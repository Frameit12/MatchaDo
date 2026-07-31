-- Lets logged-in users flag a review (fake, offensive, spam/duplicate, or
-- other) so the admin can review it before it damages trust. One report per
-- (review, reporter) so repeat clicks from the same person don't pile up.
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new

create table review_reports (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references reviews (id) on delete cascade,
  reporter_id uuid not null references profiles (id) on delete cascade,
  reason text not null check (reason in ('fake', 'offensive', 'spam', 'other')),
  details text check (char_length(details) <= 150),
  created_at timestamptz not null default now(),
  unique (review_id, reporter_id)
);

alter table review_reports enable row level security;

create policy "Users can report reviews"
  on review_reports for insert
  with check (auth.uid() = reporter_id);

create policy "Users can see their own reports, admins can see all"
  on review_reports for select
  using (auth.uid() = reporter_id or is_admin());
