-- 0012 revoked execute from anon/authenticated specifically, but Postgres
-- functions grant EXECUTE to the special PUBLIC pseudo-role by default at
-- creation time (unlike tables, which default to no access). That PUBLIC
-- grant applies to every role regardless of what's revoked from anon/
-- authenticated individually, which is why the anon key could still call
-- this after 0012. This closes that gap.
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new

revoke execute on function public.get_email_for_username(text) from public;
