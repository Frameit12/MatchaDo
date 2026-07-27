-- Adds an admin flag to profiles, needed for the "only admin can approve
-- products" policy. Run this in the Supabase SQL Editor before 0003.

alter table profiles
  add column if not exists is_admin boolean not null default false;

-- After running this, promote yourself manually, e.g.:
-- update profiles set is_admin = true where id = '<your-user-uuid>';
