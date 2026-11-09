begin;

create table public.medinsure_access_suspensions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  suspended_at timestamptz not null default now()
);

alter table public.medinsure_access_suspensions enable row level security;
revoke all on table public.medinsure_access_suspensions from public, anon, authenticated, service_role;
grant select on table public.medinsure_access_suspensions to service_role;

commit;
