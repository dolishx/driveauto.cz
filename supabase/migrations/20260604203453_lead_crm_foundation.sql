-- Stage 4.0.0: dealership lead CRM foundation.
-- Existing public forms continue writing to inquiries and appointment_requests.
-- Admin CRM reads/mutates leads server-side with SUPABASE_SERVICE_ROLE_KEY
-- after the DriveAuto admin cookie is verified.

alter table public.inquiries
  add column if not exists updated_at timestamptz default now();

alter table public.appointment_requests
  add column if not exists updated_at timestamptz default now();

update public.inquiries
set updated_at = coalesce(updated_at, created_at, now())
where updated_at is null;

update public.appointment_requests
set updated_at = coalesce(updated_at, created_at, now())
where updated_at is null;

drop trigger if exists set_inquiries_updated_at on public.inquiries;
create trigger set_inquiries_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

drop trigger if exists set_appointment_requests_updated_at on public.appointment_requests;
create trigger set_appointment_requests_updated_at
before update on public.appointment_requests
for each row execute function public.set_updated_at();

create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_type text not null check (lead_type in ('inquiry', 'appointment')),
  lead_id uuid not null,
  note text not null,
  created_at timestamptz default now()
);

create table if not exists public.lead_status_history (
  id uuid primary key default gen_random_uuid(),
  lead_type text not null check (lead_type in ('inquiry', 'appointment')),
  lead_id uuid not null,
  from_status text,
  to_status text not null,
  note text,
  created_at timestamptz default now()
);

create index if not exists lead_notes_lead_created_at_idx
  on public.lead_notes (lead_type, lead_id, created_at desc);

create index if not exists lead_status_history_lead_created_at_idx
  on public.lead_status_history (lead_type, lead_id, created_at desc);

create index if not exists inquiries_vehicle_status_created_at_idx
  on public.inquiries (vehicle_id, status, created_at desc);

create index if not exists appointment_requests_vehicle_status_created_at_idx
  on public.appointment_requests (vehicle_id, status, created_at desc);

alter table public.lead_notes enable row level security;
alter table public.lead_status_history enable row level security;

-- Do not expose CRM notes/history to anon or authenticated browser clients.
drop policy if exists "Public can read lead notes" on public.lead_notes;
drop policy if exists "Public can create lead notes" on public.lead_notes;
drop policy if exists "Public can update lead notes" on public.lead_notes;
drop policy if exists "Public can delete lead notes" on public.lead_notes;

drop policy if exists "Public can read lead status history" on public.lead_status_history;
drop policy if exists "Public can create lead status history" on public.lead_status_history;
drop policy if exists "Public can update lead status history" on public.lead_status_history;
drop policy if exists "Public can delete lead status history" on public.lead_status_history;

grant usage on schema public to service_role;
grant select, insert, update, delete on table public.lead_notes to service_role;
grant select, insert, update, delete on table public.lead_status_history to service_role;
grant select, update on table public.inquiries to service_role;
grant select, update on table public.appointment_requests to service_role;
