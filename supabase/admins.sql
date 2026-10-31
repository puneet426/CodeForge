-- The 5 leads who can manage the website at /admin (max 5 is enforced).
-- Run in Supabase → SQL Editor after schema.sql.
-- To replace someone: delete their row first, then insert the new email.
--   delete from public.admins where email = 'old@niamt.ac.in';
--   insert into public.admins (email) values ('new@niamt.ac.in');

insert into public.admins (email) values
  ('ce4272023@niamt.ac.in'),
  ('ce40520224@gmail.com'),
  ('ce4222024@niamt.ac.in'),
  ('ce4352024@niamt.ac.in'),
  ('ce4302024@niamt.ac.in')
on conflict (email) do nothing;
