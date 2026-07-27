-- Storage bucket for product photos uploaded via the "Submit a Matcha" form.
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vbvoxfxnftahhtsoypwu/sql/new

insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;

create policy "Public can view product photos"
  on storage.objects for select
  using (bucket_id = 'product-photos');

create policy "Authenticated users can upload product photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-photos');
