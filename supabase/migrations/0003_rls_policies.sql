-- RLS policies for Matchado.
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new
-- Requires 0002_add_is_admin.sql to have been run first.

-- Helper: checks if the current user is an admin. security definer so it can
-- read profiles.is_admin regardless of the caller's own RLS access.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

-- ─── profiles ────────────────────────────────────────────────────────────
-- Not one of your 5 rules, but reviews/products display a username, and a
-- user needs to create/edit their own profile row. Without these, the app
-- can't function under RLS. Remove if you'd rather lock profiles down.

create policy "Profiles are publicly readable"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─── products ────────────────────────────────────────────────────────────

create policy "Anyone can read approved products"
  on products for select
  using (status = 'approved');

create policy "Logged in users can submit products"
  on products for insert
  to authenticated
  with check (auth.uid() = submitted_by);

create policy "Only admins can update products"
  on products for update
  using (is_admin())
  with check (is_admin());

-- ─── reviews ─────────────────────────────────────────────────────────────

create policy "Anyone can read reviews"
  on reviews for select
  using (true);

create policy "Logged in users can write reviews"
  on reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on reviews for delete
  using (auth.uid() = user_id);

-- ─── saved_products ──────────────────────────────────────────────────────
-- Not stated explicitly, but a saved-items list is personal by nature, so
-- read access is scoped to the owner too (not public).

create policy "Users can view their own saved products"
  on saved_products for select
  using (auth.uid() = user_id);

create policy "Users can save products for themselves"
  on saved_products for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can unsave their own saved products"
  on saved_products for delete
  using (auth.uid() = user_id);
