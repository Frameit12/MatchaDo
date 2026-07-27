-- Closes the gap from 0011: get_email_for_username was callable by anyone
-- with the public anon key, meaning it could be called directly (bypassing
-- the login form) to look up any user's real email from their username.
-- The login flow now uses the service-role key server-side instead, so
-- the public grant is no longer needed and is revoked here. The
-- service_role itself bypasses grants entirely, so no replacement grant
-- is required for it to keep working.
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new

revoke execute on function public.get_email_for_username(text) from anon, authenticated;
