-- The admin page queries `products` for status = 'pending' to build the
-- review queue, but the only SELECT policy on this table is "Anyone can
-- read approved products" (status = 'approved'). With no policy covering
-- pending rows, RLS silently filters them out for everyone, including
-- admins — the admin page's query just returns zero rows, no error.
-- Same class of gap as 0010 (admin delete), just for reads.
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new

create policy "Admins can read all products"
  on products for select
  using (is_admin());
