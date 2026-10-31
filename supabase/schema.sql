-- =====================================================================
-- Code Forge — Supabase schema
-- Run this whole file in: Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run (creates what is missing, replaces functions/policies).
-- Then run supabase/seed.sql to load the existing alumni and events,
-- and finally add your 5 admins (see supabase/README.md, step 5).
-- =====================================================================

-- ------------------------------------------------------------- ADMINS
-- The (max 5) leads who can manage the website from /admin.
-- Only editable from the Supabase dashboard / SQL Editor — nobody can add
-- themselves from the website.
create table if not exists public.admins (
  email     text primary key check (email = lower(email) and email like '%@%'),
  name      text not null default '',
  added_at  timestamptz not null default now()
);

create or replace function public.admins_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.email := lower(trim(new.email));
  if not exists (select 1 from public.admins where email = new.email)
     and (select count(*) from public.admins) >= 5 then
    raise exception 'Only 5 admins are allowed. Remove one before adding another.';
  end if;
  return new;
end;
$$;

drop trigger if exists admins_limit on public.admins;
create trigger admins_limit
  before insert on public.admins
  for each row execute function public.admins_limit();

-- true when the logged-in user's verified email is in public.admins.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admins enable row level security;

drop policy if exists "admins: admins can see the list" on public.admins;
create policy "admins: admins can see the list" on public.admins
  for select to authenticated
  using ((select public.is_admin()));

revoke all on public.admins from anon, authenticated;
grant select on public.admins to authenticated;

-- ------------------------------------------------------------- MEMBERS
-- One row per student. Students create/edit their own row after verifying
-- their @niamt.ac.in email with a one-time code. A row is shown on the
-- website only when approved = true (set by an admin).
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

-- When a student writes their row: tie it to their account and verified
-- email, and send it back for review. Admins (and the dashboard) are exempt.
create or replace function public.members_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (auth.jwt() ->> 'role') = 'authenticated' then
    if public.is_admin() then
      if new.user_id = auth.uid() then
        new.email := lower(auth.jwt() ->> 'email');
      end if;
    else
      new.user_id  := auth.uid();
      new.email    := lower(auth.jwt() ->> 'email');
      new.approved := false;
    end if;
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

drop policy if exists "members: admins manage all" on public.members;
create policy "members: admins manage all" on public.members
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

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

-- -------------------------------------------------------------- EVENTS
-- Images/videos: a site path ("/events/x/01.webp") or a full https:// URL
-- (uploads from /admin go to the "media" storage bucket).
create table if not exists public.events (
  id             bigint generated always as identity primary key,
  slug           text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title          text not null,
  tagline        text,
  category       text not null default 'Session'
                 check (category in ('Workshop', 'Session', 'Competition', 'Hackathon', 'Induction', 'Community')),
  start_at       timestamptz not null,
  end_at         timestamptz,
  date_label     text,           -- e.g. "20 Nov 2026" (auto from start_at if empty)
  time_label     text,           -- e.g. "4:00 PM"     (auto from start_at if empty)
  venue          text,
  collab         text,
  banner         text check (banner  ~ '^(https://|/)'),
  trailer        text check (trailer ~ '^(https://|/)'),
  featured       boolean not null default false,
  registration   boolean not null default false,
  description    text,
  highlights     text[] not null default '{}',
  sessions       jsonb  not null default '[]' check (jsonb_typeof(sessions) = 'array'),
  gallery        text[] not null default '{}',
  gallery_title  text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- --------------------------------------------------------- LEADERBOARD
create table if not exists public.leaderboard (
  id          bigint generated always as identity primary key,
  name        text not null check (char_length(name) between 1 and 80),
  github      text check (github ~ '^[A-Za-z0-9-]{1,39}$'),
  score       numeric not null default 0,
  updated_at  timestamptz not null default now()
);

-- ---------------------------------- PUBLIC READ, ADMIN WRITE (3 tables)
do $$
declare t text;
begin
  foreach t in array array['alumni', 'events', 'leaderboard'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "%s: public read" on public.%I', t, t);
    execute format('create policy "%s: public read" on public.%I for select to anon, authenticated using (true)', t, t);
    execute format('drop policy if exists "%s: admins write" on public.%I', t, t);
    execute format('create policy "%s: admins write" on public.%I for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t, t);
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select on public.%I to anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end; $$;

drop trigger if exists events_touch on public.events;
create trigger events_touch before update on public.events
  for each row execute function public.touch_updated_at();
drop trigger if exists leaderboard_touch on public.leaderboard;
create trigger leaderboard_touch before insert or update on public.leaderboard
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------- MEDIA STORAGE
-- Public bucket for event posters/photos uploaded from /admin.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media: admins upload" on storage.objects;
create policy "media: admins upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "media: admins update" on storage.objects;
create policy "media: admins update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "media: admins delete" on storage.objects;
create policy "media: admins delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
