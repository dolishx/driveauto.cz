-- Stage 2.7.0: server-side admin inventory management foundation.
-- Apply this after 001_initial_schema.sql.

alter table public.vehicles
  add column if not exists slug text;

update public.vehicles
set slug = regexp_replace(
  trim(both '-' from lower(
    coalesce(brand, '') || '-' ||
    coalesce(model, '') || '-' ||
    coalesce(year::text, '') || '-' ||
    left(id::text, 8)
  )),
  '[^a-z0-9]+',
  '-',
  'g'
)
where slug is null;

create unique index if not exists vehicles_slug_unique_idx
  on public.vehicles (slug)
  where slug is not null;

create index if not exists vehicles_public_status_created_at_idx
  on public.vehicles (status, created_at desc)
  where status in ('available', 'reserved', 'published');

alter table public.vehicles enable row level security;
alter table public.services enable row level security;
alter table public.inquiries enable row level security;
alter table public.appointment_requests enable row level security;

drop policy if exists "Public can read listed vehicles" on public.vehicles;
create policy "Public can read listed vehicles"
on public.vehicles
for select
to anon, authenticated
using (status in ('available', 'reserved', 'published'));

-- Do not create anon insert/update/delete policies for vehicles.
-- Admin inventory mutations are performed by Next.js Server Actions after
-- the admin password cookie is verified, using SUPABASE_SERVICE_ROLE_KEY.
drop policy if exists "Public can insert vehicles" on public.vehicles;
drop policy if exists "Public can update vehicles" on public.vehicles;
drop policy if exists "Public can delete vehicles" on public.vehicles;
drop policy if exists "Authenticated can insert vehicles" on public.vehicles;
drop policy if exists "Authenticated can update vehicles" on public.vehicles;
drop policy if exists "Authenticated can delete vehicles" on public.vehicles;

drop policy if exists "Public can read active services" on public.services;
create policy "Public can read active services"
on public.services
for select
to anon, authenticated
using (status in ('active', 'coming_soon'));

drop policy if exists "Public can create inquiries" on public.inquiries;
create policy "Public can create inquiries"
on public.inquiries
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can create appointment requests" on public.appointment_requests;
create policy "Public can create appointment requests"
on public.appointment_requests
for insert
to anon, authenticated
with check (true);
