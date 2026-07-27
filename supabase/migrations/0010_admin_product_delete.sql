-- No DELETE policy exists yet on products, so even admins currently can't
-- delete a row (RLS denies by default with no matching policy). Needed for
-- the admin "Reject" action, which permanently deletes pending submissions.
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new

create policy "Only admins can delete products"
  on products for delete
  using (is_admin());
