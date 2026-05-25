# AutoDrive MVP

AutoDrive MVP is a Czech car dealership website for presenting verified vehicles, dealership services, contact information, appointment booking, and a simple MVP admin overview.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Lucide React icons
- Local seed data fallback for vehicles, services, and inquiries
- Supabase database foundation prepared for vehicles, inquiries, appointment requests, and services
- Vercel-ready build output

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in a browser.

## Verification

```bash
npm run lint
npm run build
```

## Available Routes

- `/` - homepage with hero, search UI, recommended vehicles, benefits, and consultation CTA
- `/nabidka-vozu` - vehicle offer listing with filters, sorting UI, and vehicle cards
- `/sluzby` - dealership services; financing is marked as `Připravujeme`
- `/kontakt` - contact page with safe placeholders until final company details are confirmed
- `/domluvit-prohlidku` - appointment request form prepared for future backend wiring
- `/admin` - MVP admin overview using local sample data only

## Current MVP Limitations

- Vehicle, service, and inquiry data falls back to local seed data when Supabase env vars are missing.
- Forms are wired to submission helpers and write to Supabase only when the public Supabase env vars are configured.
- No authentication or admin permissions are implemented yet.
- No email sending or notification workflow is implemented yet.
- Contact details, address, statutory company identifiers, and opening hours are intentionally not shown until real values are provided.
- Financing is presented only as a future service.

## Environment Variables

Copy `.env.example` to `.env.local` when real values are available.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

For local development, put real values only in `.env.local`.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ptpouetttwyqksnksboc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste publishable anon key locally>
```

Do not commit `.env.local`, service role keys, database passwords, or direct PostgreSQL connection strings.

## Supabase Setup

Supabase project:

- Project URL: `https://ptpouetttwyqksnksboc.supabase.co`
- Project ref: `ptpouetttwyqksnksboc`

Database files:

- Migration: `supabase/migrations/001_initial_schema.sql`
- Seed data: `supabase/seed.sql`

To apply the schema without the Supabase CLI:

1. Open the Supabase Dashboard.
2. Go to SQL Editor.
3. Run the contents of `supabase/migrations/001_initial_schema.sql`.
4. Run the contents of `supabase/seed.sql`.

To use the Supabase CLI locally:

```bash
supabase login
supabase init
supabase link --project-ref ptpouetttwyqksnksboc
```

If linking requires different account permissions, apply the SQL files through the Supabase Dashboard SQL Editor instead.

The public pages read through `src/lib/data.ts`. That layer tries Supabase first when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured, then falls back to local seed data if Supabase is unavailable.

Additional notes live in `src/lib/supabase/README.md`.

## Vercel Deployment Notes

The project can be imported into Vercel as a standard Next.js app.

- Build command: `npm run build`
- Install command: `npm install`
- Framework preset: Next.js
- Environment variables: add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel only after the database schema is applied
- No `vercel.json` is required for the current MVP

Before deployment, run:

```bash
npm run lint
npm run build
```
