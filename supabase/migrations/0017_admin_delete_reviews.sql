-- Admins should be able to remove any review for moderation (spam, abuse),
-- not just their own. Replace the owner-only delete policy with one that
-- also allows admins.
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new

drop policy if exists "Users can delete their own reviews" on reviews;

create policy "Users can delete their own reviews, admins can delete any"
  on reviews for delete
  using (auth.uid() = user_id or is_admin());
