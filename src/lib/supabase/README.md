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
```

Use `.env.local` for local values and Vercel Environment Variables for
production. Do not commit service role keys, database passwords, or direct
PostgreSQL connection strings.

## Database files

- Migration: `supabase/migrations/001_initial_schema.sql`
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
