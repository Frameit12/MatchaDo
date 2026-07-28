-- A user should only have one review per product -- writing a second
-- review for something they already reviewed should edit the existing
-- one, not create a duplicate. Existing duplicates (e.g. from testing
-- before this rule existed) are pruned first, keeping only the most
-- recently created review per (product_id, user_id).
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new

delete from reviews r
using reviews newer
where r.product_id = newer.product_id
  and r.user_id = newer.user_id
  and r.created_at < newer.created_at;

alter table reviews
  add constraint reviews_product_user_unique unique (product_id, user_id);
