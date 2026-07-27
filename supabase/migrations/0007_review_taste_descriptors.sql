-- Free-form taste descriptor tags attached to a review (separate from the
-- new numeric taste rating added in 0006).
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new

create table if not exists review_taste_descriptors (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references reviews (id) on delete cascade,
  descriptor text not null check (
    descriptor in ('Bitter', 'Umami', 'Balanced', 'Sweet', 'Grassy', 'Astringent')
  ),
  unique (review_id, descriptor)
);

alter table review_taste_descriptors enable row level security;

-- There's no user_id column on this table (per spec), so "own" is
-- determined by ownership of the parent review.

create policy "Anyone can read taste descriptors"
  on review_taste_descriptors for select
  using (true);

create policy "Users can add descriptors to their own reviews"
  on review_taste_descriptors for insert
  to authenticated
  with check (
    exists (
      select 1 from reviews
      where reviews.id = review_taste_descriptors.review_id
        and reviews.user_id = auth.uid()
    )
  );

create policy "Users can delete descriptors from their own reviews"
  on review_taste_descriptors for delete
  using (
    exists (
      select 1 from reviews
      where reviews.id = review_taste_descriptors.review_id
        and reviews.user_id = auth.uid()
    )
  );
