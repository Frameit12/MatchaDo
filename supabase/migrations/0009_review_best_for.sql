-- Replaces the single-value reviews.best_for column with a multi-select
-- join table, mirroring the review_taste_descriptors pattern, since the
-- "Best For" field in the review form is multi-select checkboxes
-- (Usucha / Latte / Cooking) rather than a single value.
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new

alter table reviews drop constraint if exists reviews_best_for_check;
alter table reviews drop column if exists best_for;

create table if not exists review_best_for (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references reviews (id) on delete cascade,
  tag text not null check (tag in ('Usucha', 'Latte', 'Cooking')),
  unique (review_id, tag)
);

alter table review_best_for enable row level security;

create policy "Anyone can read best-for tags"
  on review_best_for for select
  using (true);

create policy "Users can add best-for tags to their own reviews"
  on review_best_for for insert
  to authenticated
  with check (
    exists (
      select 1 from reviews
      where reviews.id = review_best_for.review_id
        and reviews.user_id = auth.uid()
    )
  );

create policy "Users can delete best-for tags from their own reviews"
  on review_best_for for delete
  using (
    exists (
      select 1 from reviews
      where reviews.id = review_best_for.review_id
        and reviews.user_id = auth.uid()
    )
  );
