create table if not exists public.contact_submissions (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  phone text,
  service text,
  budget text,
  message text not null,
  created_at timestamptz not null default now()
);
alter table public.contact_submissions disable row level security;