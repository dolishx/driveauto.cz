# Supabase readiness

The app has a Supabase-ready data layer, but it must keep working without
environment variables. `getSupabaseClient()` returns `null` unless both public
Supabase variables are present, and `src/lib/data.ts` falls back to local seed
data.

## Environment variables

Use placeholders in `.env.example` only:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ADMIN_PASSWORD=
SUPABASE_SERVICE_ROLE_KEY=
```

Use `.env.local` for local values and Vercel Environment Variables for
production. `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never use a
`NEXT_PUBLIC_` prefix. Do not commit service role keys, database passwords, or
direct PostgreSQL connection strings.

## Database files

- Migration: `supabase/migrations/001_initial_schema.sql`
- Admin inventory migration: `supabase/migrations/002_admin_inventory_policies.sql`
- Vehicle image storage migration: `supabase/migrations/003_vehicle_image_storage.sql`
- Lead CRM migration: `supabase/migrations/20260604203453_lead_crm_foundation.sql`
- Seed data: `supabase/seed.sql`

Apply the migration first, then the seed data in the Supabase SQL Editor or via
the Supabase CLI once the local account has access to project
`ptpouetttwyqksnksboc`.

The storage migration creates the public `vehicle-images` bucket for uploaded
vehicle photos. Public reads are allowed, but browser uploads are not. Admin
uploads run through `src/app/admin/vehicle-actions.ts` after the admin session is
verified and require the server-only `SUPABASE_SERVICE_ROLE_KEY`.

Vehicle gallery uploads are stored under `vehicles/{vehicle-id}/`. The first
uploaded image becomes `image_url`; the ordered list is stored in
`gallery_urls`. Manual Image URL is still supported when no files are uploaded.

## Stable data API

Keep these exports stable so page components do not need to change:

- `getVehicles()`
- `getFeaturedVehicles()`
- `getVehicleById()`
- `getServices()`
- `createInquiry()`
- `createAppointmentRequest()`

Admin inventory writes use `src/app/admin/vehicle-actions.ts` and the
server-only Supabase service client in `src/lib/supabase/server.ts`.

Admin CRM writes use `src/app/admin/lead-actions.ts`. The public contact and
appointment forms keep inserting into `inquiries` and `appointment_requests`;
the admin CRM combines those rows server-side and stores internal notes/history
in `lead_notes` and `lead_status_history`. Those CRM tables are admin-only and
should not receive anon read/write policies.
