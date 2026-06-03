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
- Seed data: `supabase/seed.sql`

Apply the migration first, then the seed data in the Supabase SQL Editor or via
the Supabase CLI once the local account has access to project
`ptpouetttwyqksnksboc`.

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
