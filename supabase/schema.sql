-- Run once in the Supabase SQL editor.
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 48),
  company text not null check (char_length(company) between 1 and 48),
  attending boolean not null,
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;

-- Visitors (anon key) may add an RSVP but never read, change or delete any.
-- View responses in the Supabase dashboard's Table Editor.
drop policy if exists "Anyone can submit an RSVP" on public.rsvps;
create policy "Anyone can submit an RSVP"
  on public.rsvps for insert
  to anon
  with check (true);

grant insert on public.rsvps to anon;
