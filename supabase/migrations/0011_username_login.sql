-- Supports logging in with username instead of email. Supabase Auth only
-- supports signing in with email/phone, so we store email on profiles and
-- resolve username -> email server-side before calling signInWithPassword.
--
-- Privacy note: email is deliberately NOT exposed through the existing
-- "Profiles are publicly readable" policy (which is a blanket `using (true)`
-- row-level policy and would otherwise let anyone read every user's email
-- via the public anon key). Instead, email access is restricted at the
-- column level, and the only way to resolve a username to an email is
-- through get_email_for_username() below, which returns nothing else.
--
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new

alter table profiles add column if not exists email text;

-- Backfill existing rows from auth.users (only this migration, run with
-- elevated SQL Editor privileges, can read auth.users directly).
update profiles
set email = u.email
from auth.users u
where profiles.id = u.id
  and profiles.email is null;

alter table profiles alter column email set not null;

-- Column-level lockdown: table-wide grants to anon/authenticated already
-- exist (Supabase's default for public schema tables), so email would
-- otherwise be readable by anyone via `select=email` on the REST API.
revoke select (email) on profiles from anon, authenticated;

-- Update the signup trigger to also store email.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

-- Narrow, single-purpose lookup used only by the login flow: given a
-- username, returns the matching email (or null), nothing else.
create or replace function public.get_email_for_username(p_username text)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select email from profiles where username = p_username limit 1;
$$;

grant execute on function public.get_email_for_username(text) to anon, authenticated;
