-- Stage 3.0.0: Supabase Storage bucket for vehicle photos.
-- Apply this after 002_admin_inventory_policies.sql.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'vehicle-images',
  'vehicle-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read vehicle images" on storage.objects;
create policy "Public can read vehicle images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'vehicle-images');

-- No anon insert/update/delete policies are created. Vehicle image uploads are
-- performed by Next.js Server Actions after the admin password cookie is
-- verified, using SUPABASE_SERVICE_ROLE_KEY on the server.
drop policy if exists "Public can upload vehicle images" on storage.objects;
drop policy if exists "Public can update vehicle images" on storage.objects;
drop policy if exists "Public can delete vehicle images" on storage.objects;
