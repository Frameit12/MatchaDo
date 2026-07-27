-- Drops the texture column from reviews.
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new

alter table reviews drop column if exists texture;
