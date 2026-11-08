begin;
create table public.medinsure_pricing_versions (
  version integer generated always as identity primary key,
  effective_at timestamptz not null,
  policy jsonb not null,
  created_at timestamptz not null default now()
);
create index medinsure_pricing_effective on public.medinsure_pricing_versions (effective_at desc, version desc);
create table public.medinsure_releases (
  id uuid primary key, version text not null unique, notes text not null,
  object_path text not null unique, size_bytes integer not null check (size_bytes > 0),
  sha256 text not null check (sha256 ~ '^[a-f0-9]{64}$'), created_at timestamptz not null default now()
);
create table public.medinsure_release_policies (
  id integer generated always as identity primary key,
  release_id uuid references public.medinsure_releases,
  minimum_version text,
  created_at timestamptz not null default now()
);
alter table public.medinsure_pricing_versions enable row level security;
alter table public.medinsure_releases enable row level security;
alter table public.medinsure_release_policies enable row level security;
revoke all on public.medinsure_pricing_versions, public.medinsure_releases, public.medinsure_release_policies from public, anon, authenticated;
grant select, insert on public.medinsure_pricing_versions, public.medinsure_releases, public.medinsure_release_policies to service_role;
grant usage on sequence public.medinsure_pricing_versions_version_seq, public.medinsure_release_policies_id_seq to service_role;
insert into storage.buckets (id, name, public, file_size_limit)
values ('medinsure-installers', 'medinsure-installers', false, 52428800);
commit;
