alter table public.vehicles
  add column if not exists stk_valid_until date,
  add column if not exists origin_country text,
  add column if not exists first_registration date,
  add column if not exists owners_count integer,
  add column if not exists service_history text,
  add column if not exists accident_history text,
  add column if not exists equipment text[],
  add column if not exists condition_note text,
  add column if not exists warranty_note text,
  add column if not exists emission_standard text,
  add column if not exists drivetrain text,
  add column if not exists doors_count integer,
  add column if not exists seats_count integer;

create index if not exists vehicles_stk_valid_until_idx
  on public.vehicles (stk_valid_until)
  where stk_valid_until is not null;

create index if not exists vehicles_origin_country_idx
  on public.vehicles (origin_country)
  where origin_country is not null;
