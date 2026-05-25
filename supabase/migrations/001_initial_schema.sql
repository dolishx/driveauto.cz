create extension if not exists pgcrypto;

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  title text not null,
  year integer,
  mileage integer,
  fuel text,
  transmission text,
  price_czk integer,
  category text,
  body_type text,
  color text,
  power_kw integer,
  engine text,
  vin text,
  license_plate text,
  status text default 'draft',
  is_featured boolean default false,
  image_url text,
  gallery_urls text[],
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  name text,
  phone text,
  email text,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  message text,
  status text default 'new',
  source_page text,
  created_at timestamptz default now()
);

create table if not exists public.appointment_requests (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id) on delete set null,
  name text,
  phone text,
  email text,
  preferred_date date,
  preferred_time text,
  note text,
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  status text default 'active',
  badge text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_vehicles_updated_at on public.vehicles;
create trigger set_vehicles_updated_at
before update on public.vehicles
for each row execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create index if not exists vehicles_status_created_at_idx
  on public.vehicles (status, created_at desc);

create index if not exists vehicles_featured_status_idx
  on public.vehicles (is_featured, status)
  where is_featured = true;

create index if not exists inquiries_status_created_at_idx
  on public.inquiries (status, created_at desc);

create index if not exists inquiries_vehicle_id_idx
  on public.inquiries (vehicle_id);

create index if not exists appointment_requests_status_created_at_idx
  on public.appointment_requests (status, created_at desc);

create index if not exists appointment_requests_vehicle_id_idx
  on public.appointment_requests (vehicle_id);

create index if not exists services_status_sort_order_idx
  on public.services (status, sort_order);

alter table public.vehicles enable row level security;
alter table public.inquiries enable row level security;
alter table public.appointment_requests enable row level security;
alter table public.services enable row level security;

drop policy if exists "Public can read listed vehicles" on public.vehicles;
create policy "Public can read listed vehicles"
on public.vehicles
for select
to anon, authenticated
using (status in ('available', 'reserved', 'published'));

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

drop policy if exists "Public can read active services" on public.services;
create policy "Public can read active services"
on public.services
for select
to anon, authenticated
using (status in ('active', 'coming_soon'));
