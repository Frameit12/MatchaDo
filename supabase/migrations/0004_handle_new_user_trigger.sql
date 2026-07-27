-- Auto-creates a profiles row whenever a new auth.users row is inserted.
-- This runs with elevated privileges (security definer) so it works
-- regardless of whether email confirmation is required and without
-- depending on the client having an active session yet.
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
