-- Stage 3.3.0: align public inventory visibility with lifecycle controls.
-- Public website and anon Data API reads should only expose published vehicles.
-- Draft, sold, archived, reserved, and available rows remain manageable through
-- server-side admin actions that use the service role key after admin cookie
-- verification.

drop index if exists public.vehicles_public_status_created_at_idx;

create index if not exists vehicles_public_published_created_at_idx
  on public.vehicles (created_at desc)
  where status = 'published';

drop policy if exists "Public can read listed vehicles" on public.vehicles;

create policy "Public can read listed vehicles"
on public.vehicles
for select
to anon, authenticated
using (status = 'published');
