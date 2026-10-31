-- =====================================================================
-- Code Forge — Supabase schema
-- Run this whole file once in: Supabase dashboard → SQL Editor → New query.
-- Safe to re-run (it only creates what is missing / replaces functions).
-- Then run supabase/seed.sql to load the existing alumni.
-- =====================================================================

-- ------------------------------------------------------------- MEMBERS
-- One row per student. Students create/edit their own row after verifying
-- their @niamt.ac.in email with a one-time code. A row is shown on the
-- website only when approved = true (set by the core team in Table Editor).
create table if not exists public.members (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid unique references auth.users (id) on delete set null,
  email       text unique,
  name        text not null check (char_length(name) between 1 and 80),
  roll        text check (char_length(roll) <= 20),
  batch       text not null check (batch ~ '^[0-9]{4}-[0-9]{2}$'),          -- e.g. 2024-28
  branch      text not null check (char_length(branch) <= 80),
  github      text check (github ~ '^[A-Za-z0-9-]{1,39}$'),
  photo       text check (photo ~ '^https://'),
  bio         text check (char_length(bio) <= 280),
  role        text check (char_length(role) <= 60),                          -- club role / company
  community   text check (char_length(community) <= 60),
  stack       text[] not null default '{}' check (cardinality(stack) <= 15),
  projects    jsonb  not null default '[]'
              check (jsonb_typeof(projects) = 'array' and jsonb_array_length(projects) <= 2),
  github_url  text check (github_url ~ '^https://'),
  linkedin    text check (linkedin ~ '^https://'),
  approved    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- When a student (logged-in user) writes their row: tie it to their account
-- and verified email, and send it back for review. Edits made by the core
-- team in the dashboard are not affected.
create or replace function public.members_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (auth.jwt() ->> 'role') = 'authenticated' then
    new.user_id  := auth.uid();
    new.email    := lower(auth.jwt() ->> 'email');
    new.approved := false;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists members_guard on public.members;
create trigger members_guard
  before insert or update on public.members
  for each row execute function public.members_guard();

alter table public.members enable row level security;

drop policy if exists "members: read own row" on public.members;
create policy "members: read own row" on public.members
  for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "members: create own row (college email)" on public.members;
create policy "members: create own row (college email)" on public.members
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and lower(auth.jwt() ->> 'email') like '%@niamt.ac.in'
  );

drop policy if exists "members: edit own row" on public.members;
create policy "members: edit own row" on public.members
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and lower(auth.jwt() ->> 'email') like '%@niamt.ac.in'
  );

drop policy if exists "members: delete own row" on public.members;
create policy "members: delete own row" on public.members
  for delete to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.members from anon;
grant select, insert, update, delete on public.members to authenticated;

-- What the website shows: approved members only, never email or roll number.
-- (Runs with the view owner's rights on purpose, so it can read approved
-- rows while the table itself stays private.)
create or replace view public.public_members
with (security_invoker = false) as
  select id, name, batch, branch, github, photo, bio, role, community,
         stack, projects, github_url, linkedin, created_at
  from public.members
  where approved;

revoke all on public.public_members from anon, authenticated;
grant select on public.public_members to anon, authenticated;

-- -------------------------------------------------------------- ALUMNI
-- Public list. Edit it in Table Editor → alumni.
create table if not exists public.alumni (
  id          bigint generated always as identity primary key,
  name        text not null,
  role        text not null default '',
  company     text not null default '',
  sector      text not null default '',
  linkedin    text unique check (linkedin ~ '^https://'),
  category    text not null default 'tech' check (category in ('leaders', 'tech')),
  sort_order  int  not null default 1000,
  created_at  timestamptz not null default now()
);

alter table public.alumni enable row level security;

drop policy if exists "alumni: public read" on public.alumni;
create policy "alumni: public read" on public.alumni
  for select to anon, authenticated
  using (true);

revoke all on public.alumni from anon, authenticated;
grant select on public.alumni to anon, authenticated;
