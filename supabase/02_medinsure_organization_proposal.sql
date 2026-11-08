-- Local rehearsal only. Review and convert to a migration before deployment.
begin;

create schema medinsure;
revoke all on schema medinsure from public, anon, authenticated;
grant usage on schema medinsure to service_role;

create table medinsure.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0)
);

create table medinsure.memberships (
  organization_id uuid not null references medinsure.organizations,
  user_id uuid not null references auth.users,
  role text not null check (role in ('branch_manager', 'assistant_manager', 'agent')),
  active boolean not null default true,
  primary key (organization_id, user_id)
);

create table medinsure.organization_subscriptions (
  organization_id uuid primary key references medinsure.organizations,
  seat_limit integer not null check (seat_limit >= 0),
  status text not null check (status in ('active', 'past_due', 'suspended', 'ended')),
  paid_through timestamptz not null,
  payment_failed_at timestamptz,
  check (status <> 'past_due' or payment_failed_at is not null)
);

create table medinsure.seat_assignments (
  organization_id uuid not null,
  user_id uuid not null,
  assigned_at timestamptz not null default statement_timestamp(),
  primary key (organization_id, user_id),
  foreign key (organization_id, user_id)
    references medinsure.memberships (organization_id, user_id)
);

create table medinsure.seat_audit (
  id bigint generated always as identity primary key,
  organization_id uuid not null references medinsure.organizations,
  actor_id uuid not null,
  target_id uuid not null,
  was_assigned boolean not null,
  is_assigned boolean not null,
  occurred_at timestamptz not null default statement_timestamp()
);

alter table medinsure.organizations enable row level security;
alter table medinsure.memberships enable row level security;
alter table medinsure.organization_subscriptions enable row level security;
alter table medinsure.seat_assignments enable row level security;
alter table medinsure.seat_audit enable row level security;
grant select on all tables in schema medinsure to service_role;
grant insert, delete on medinsure.seat_assignments to service_role;
grant insert on medinsure.seat_audit to service_role;
grant usage on all sequences in schema medinsure to service_role;
-- PostgreSQL requires UPDATE privilege for SELECT FOR UPDATE.
grant update (seat_limit) on medinsure.organization_subscriptions to service_role;

-- Server-only. The server supplies the actor from verified authentication.
-- Membership/contract mutations must use the same organization lock before
-- changing permissions, removing staff, or reducing the seat limit.
create function medinsure.change_seats(
  target_organization uuid,
  actor uuid,
  assign_ids uuid[],
  revoke_ids uuid[]
) returns integer
language plpgsql security invoker set search_path = ''
as $$
declare
  subscription medinsure.organization_subscriptions%rowtype;
  current_count integer;
  expected_count integer;
  current_time_utc timestamptz;
begin
  if assign_ids is null or revoke_ids is null
    or array_position(assign_ids, null::uuid) is not null
    or array_position(revoke_ids, null::uuid) is not null
    or assign_ids && revoke_ids
    or cardinality(assign_ids) + cardinality(revoke_ids) not between 1 and 200 then
    raise exception 'invalid_seat_targets' using errcode = '22023';
  end if;

  select * into subscription from medinsure.organization_subscriptions
  where organization_id = target_organization for update;

  if not exists (
    select 1 from medinsure.memberships
    where organization_id = target_organization and user_id = actor
      and active and role in ('branch_manager', 'assistant_manager')
  ) then
    raise exception 'organization_access_denied' using errcode = '42501';
  end if;
  if subscription.organization_id is null then
    raise exception 'subscription_missing' using errcode = '23514';
  end if;

  current_time_utc := clock_timestamp();
  if cardinality(assign_ids) > 0 and not (
    (subscription.status = 'active' and current_time_utc < subscription.paid_through)
    or (subscription.status = 'past_due'
      and current_time_utc >= subscription.payment_failed_at
      and current_time_utc < subscription.payment_failed_at + interval '72 hours')
  ) then
    raise exception 'subscription_not_assignable' using errcode = '23514';
  end if;

  if exists (
    select 1 from unnest(assign_ids) as target(id)
    where not exists (
      select 1 from medinsure.memberships
      where organization_id = target_organization and user_id = target.id and active
    )
  ) then
    raise exception 'target_not_active_member' using errcode = '23514';
  end if;

  select count(*) into current_count from medinsure.seat_assignments
  where organization_id = target_organization;

  select count(*) into expected_count from medinsure.seat_assignments
  where organization_id = target_organization and user_id = any(revoke_ids);
  if expected_count <> cardinality(revoke_ids) then
    raise exception 'invalid_revocations' using errcode = '22023';
  end if;

  if exists (
    select 1 from medinsure.seat_assignments
    where organization_id = target_organization and user_id = any(assign_ids)
  ) then
    raise exception 'already_assigned' using errcode = '23505';
  end if;

  expected_count := current_count - cardinality(revoke_ids) + cardinality(assign_ids);
  if cardinality(assign_ids) > 0 and expected_count > subscription.seat_limit then
    raise exception 'seat_limit_exceeded' using errcode = '23514';
  end if;

  with removed as (
    delete from medinsure.seat_assignments
    where organization_id = target_organization and user_id = any(revoke_ids)
    returning user_id
  )
  insert into medinsure.seat_audit (organization_id, actor_id, target_id, was_assigned, is_assigned)
  select target_organization, actor, user_id, true, false from removed;

  with added as (
    insert into medinsure.seat_assignments (organization_id, user_id)
    select target_organization, id from unnest(assign_ids) as target(id)
    returning user_id
  )
  insert into medinsure.seat_audit (organization_id, actor_id, target_id, was_assigned, is_assigned)
  select target_organization, actor, user_id, false, true from added;

  return expected_count;
end;
$$;

revoke all on function medinsure.change_seats(uuid, uuid, uuid[], uuid[]) from public, anon, authenticated;
grant execute on function medinsure.change_seats(uuid, uuid, uuid[], uuid[]) to service_role;

create table medinsure.invites (
  token_hash text primary key,
  organization_id uuid not null references medinsure.organizations,
  email text not null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  cancelled_at timestamptz
);
alter table medinsure.invites enable row level security;
grant select, insert, update on medinsure.invites to service_role;
grant insert, update on medinsure.memberships to service_role;

-- PostgREST entry point. Only the authenticated application server can call it.
create function public.medinsure_organization(
  actor uuid, verified_email text, org uuid, action text, payload jsonb
) returns jsonb language plpgsql security invoker set search_path = ''
as $$
declare
  member_role text;
  invitation medinsure.invites%rowtype;
  result jsonb;
begin
  if action = 'list' then
    return coalesce((
      select jsonb_agg(jsonb_build_object('id', o.id, 'name', o.name, 'role', m.role) order by o.name)
      from medinsure.memberships m join medinsure.organizations o on o.id = m.organization_id
      where m.user_id = actor and m.active
    ), '[]'::jsonb);
  end if;

  if action = 'entitlement' then
    return jsonb_build_object('allowed', exists (
      select 1 from medinsure.memberships m
      join medinsure.seat_assignments a using (organization_id, user_id)
      join medinsure.organization_subscriptions s using (organization_id)
      where m.user_id = actor and m.active
        and ((s.status = 'active' and statement_timestamp() < s.paid_through)
          or (s.status = 'past_due' and statement_timestamp() >= s.payment_failed_at
            and statement_timestamp() < s.payment_failed_at + interval '72 hours'))
    ));
  end if;

  if action = 'accept' then
    perform pg_advisory_xact_lock(hashtextextended(actor::text, 7821));
    select * into invitation from medinsure.invites
    where token_hash = payload->>'hash';
    if invitation.organization_id is null then
      raise exception 'invite_invalid' using errcode = '42501';
    end if;
    org := invitation.organization_id;
  end if;

  if action <> 'dashboard' then
    perform 1 from medinsure.organization_subscriptions where organization_id = org for update;
  end if;

  if action = 'accept' then
    update medinsure.invites set accepted_at = clock_timestamp()
    where token_hash = payload->>'hash' and accepted_at is null and cancelled_at is null
      and expires_at > clock_timestamp() and email = lower(verified_email);
    if not found then raise exception 'invite_invalid' using errcode = '42501'; end if;
    if exists (select 1 from medinsure.memberships where user_id = actor and active and organization_id <> org) then
      raise exception 'organization_transfer_required' using errcode = '23514';
    end if;
    insert into medinsure.memberships values (org, actor, 'agent', true)
    on conflict (organization_id, user_id) do update set active = true, role = 'agent'
    where not memberships.active;
    return jsonb_build_object('organizationId', org);
  end if;

  select role into member_role from medinsure.memberships
  where organization_id = org and user_id = actor and active;
  if member_role is null or member_role = 'agent' then
    raise exception 'organization_access_denied' using errcode = '42501';
  end if;

  case action
    when 'dashboard' then
      select jsonb_build_object(
        'role', member_role,
        'subscription', (select to_jsonb(s) from medinsure.organization_subscriptions s where organization_id = org),
        'assigned', (select count(*) from medinsure.seat_assignments where organization_id = org),
        'pending', (select count(*) from medinsure.invites where organization_id = org
          and accepted_at is null and cancelled_at is null and expires_at > statement_timestamp()),
        'members', coalesce((select jsonb_agg(jsonb_build_object(
          'id', m.user_id, 'email', u.email, 'role', m.role, 'assigned', s.user_id is not null
        ) order by u.email) from medinsure.memberships m
          join auth.users u on u.id = m.user_id
          left join medinsure.seat_assignments s using (organization_id, user_id)
          where m.organization_id = org and m.active), '[]'::jsonb),
        'invites', coalesce((select jsonb_agg(jsonb_build_object(
          'email', email, 'expiresAt', expires_at, 'acceptedAt', accepted_at, 'cancelledAt', cancelled_at
        ) order by expires_at desc) from medinsure.invites where organization_id = org), '[]'::jsonb),
        'audit', coalesce((select jsonb_agg(to_jsonb(a) order by a.id desc) from (
          select * from medinsure.seat_audit where organization_id = org order by id desc limit 10
        ) a), '[]'::jsonb)
      ) into result;
      return result;
    when 'invite' then
      if exists (
        select 1 from medinsure.memberships m join auth.users u on u.id = m.user_id
        where m.organization_id = org and m.active and lower(u.email) = payload->>'email'
      ) then raise exception 'already_member' using errcode = '23505'; end if;
      update medinsure.invites set cancelled_at = clock_timestamp()
      where organization_id = org and email = payload->>'email' and accepted_at is null and cancelled_at is null;
      insert into medinsure.invites(token_hash, organization_id, email, expires_at)
      values (payload->>'hash', org, payload->>'email', clock_timestamp() + interval '24 hours');
    when 'cancel_invite' then
      update medinsure.invites set cancelled_at = clock_timestamp()
      where organization_id = org and email = payload->>'email' and accepted_at is null and cancelled_at is null;
    when 'delegate' then
      if member_role <> 'branch_manager' then
        raise exception 'organization_access_denied' using errcode = '42501';
      end if;
      update medinsure.memberships set role = case when (payload->>'enabled')::boolean
        then 'assistant_manager' else 'agent' end
      where organization_id = org and user_id = (payload->>'userId')::uuid
        and active and role <> 'branch_manager';
      if not found then raise exception 'invalid_member' using errcode = '22023'; end if;
    when 'seats' then
      return jsonb_build_object('assigned', medinsure.change_seats(org, actor,
        array(select jsonb_array_elements_text(payload->'assign')::uuid),
        array(select jsonb_array_elements_text(payload->'revoke')::uuid)));
    when 'remove_member' then
      if not exists (
        select 1 from medinsure.memberships
        where organization_id = org and user_id = (payload->>'userId')::uuid and active
          and (role = 'agent' or (role = 'assistant_manager' and member_role = 'branch_manager'))
          and user_id <> actor
      ) then raise exception 'organization_access_denied' using errcode = '42501'; end if;
      if exists (select 1 from medinsure.seat_assignments where organization_id = org and user_id = (payload->>'userId')::uuid) then
        perform medinsure.change_seats(org, actor, '{}'::uuid[], array[(payload->>'userId')::uuid]);
      end if;
      update medinsure.memberships set active = false where organization_id = org and user_id = (payload->>'userId')::uuid;
    else
      raise exception 'invalid_action' using errcode = '22023';
  end case;
  return '{}'::jsonb;
end;
$$;
-- Dashboard needs emails, but the application role does not gain access to
-- passwords, authentication tokens, or other auth.users columns.
grant usage on schema auth to service_role;
grant select (id, email) on auth.users to service_role;
revoke all on function public.medinsure_organization(uuid, text, uuid, text, jsonb) from public, anon, authenticated;
grant execute on function public.medinsure_organization(uuid, text, uuid, text, jsonb) to service_role;

create table public.medinsure_releases (
  id uuid primary key,
  version text not null unique,
  notes text not null,
  object_path text not null unique,
  size_bytes integer not null check (size_bytes > 0),
  sha256 text not null check (sha256 ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now()
);
create table public.medinsure_release_channel (
  singleton boolean primary key default true check (singleton),
  release_id uuid references public.medinsure_releases
);
alter table public.medinsure_releases enable row level security;
alter table public.medinsure_release_channel enable row level security;
revoke all on public.medinsure_releases, public.medinsure_release_channel from public, anon, authenticated;
grant select, insert on public.medinsure_releases to service_role;
grant select, insert, update on public.medinsure_release_channel to service_role;

create table public.medinsure_test_orders (
  id uuid primary key,
  buyer_id uuid not null references auth.users,
  customer_key uuid not null unique,
  plan text not null,
  seats integer not null check (seats between 1 and 10000),
  months integer not null default 1 check (months between 1 and 36),
  pricing_version integer not null default 0,
  amount integer not null check (amount > 0),
  organization_name text not null,
  consent_version text not null,
  status text not null default 'pending' check (status in ('pending','confirming','paid')),
  payment_key text unique,
  created_at timestamptz not null default now()
);
alter table medinsure.organization_subscriptions
  add column plan text,
  add column monthly_amount integer check (monthly_amount >= 0);
alter table public.medinsure_test_orders enable row level security;
revoke all on public.medinsure_test_orders from public, anon, authenticated;
grant select, insert, update on public.medinsure_test_orders to service_role;
grant insert on medinsure.organizations, medinsure.organization_subscriptions to service_role;

create function public.medinsure_activate_test_order(order_id uuid, buyer uuid, confirmed_payment text)
returns uuid language plpgsql security invoker set search_path = ''
as $$
declare
  selected public.medinsure_test_orders%rowtype;
  new_org uuid;
begin
  select * into selected from public.medinsure_test_orders
  where id = order_id and buyer_id = buyer and status = 'confirming' for update;
  if not found then raise exception 'invalid_test_order' using errcode = '23514'; end if;
  insert into medinsure.organizations(name) values (selected.organization_name) returning id into new_org;
  insert into medinsure.memberships values (new_org, buyer,
    case when (selected.plan = 'solo' or selected.plan like 'personal-%') then 'agent' else 'branch_manager' end, true);
  insert into medinsure.organization_subscriptions
    (organization_id, seat_limit, status, paid_through, plan, monthly_amount)
  values (new_org, selected.seats, 'active',
    ((now() at time zone 'Asia/Seoul') + make_interval(months => selected.months)) at time zone 'Asia/Seoul', selected.plan, selected.amount);
  if (selected.plan = 'solo' or selected.plan like 'personal-%') then
    insert into medinsure.seat_assignments(organization_id, user_id) values (new_org, buyer);
  end if;
  update public.medinsure_test_orders set status = 'paid', payment_key = confirmed_payment where id = order_id;
  return new_org;
end;
$$;
revoke all on function public.medinsure_activate_test_order(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.medinsure_activate_test_order(uuid, uuid, text) to service_role;

commit;
