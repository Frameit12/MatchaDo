-- A submitter should be able to view and review their own product right
-- after submitting it, without waiting for admin approval. The existing
-- SELECT policies only cover approved products (everyone) and all products
-- (admins) -- add one covering a submitter's own row regardless of status.
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new

create policy "Submitters can read their own products"
  on products for select
  using (auth.uid() = submitted_by);
