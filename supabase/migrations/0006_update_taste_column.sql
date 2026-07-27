-- Changes reviews.taste from a text enum ('Bitter'/'Balanced'/'Sweet') to an
-- integer 1-5 rating, matching the other rating columns on this table.
-- Any existing taste values are cleared since a text descriptor can't be
-- mapped onto a 1-5 scale automatically — fine as long as no real review
-- data depends on the old values yet.
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new

alter table reviews drop constraint if exists reviews_taste_check;
alter table reviews alter column taste drop not null;
alter table reviews alter column taste type integer using null;
alter table reviews alter column taste set not null;
alter table reviews add constraint reviews_taste_check check (taste between 1 and 5);
