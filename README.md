# DriveAuto MVP

DriveAuto MVP is a Czech car dealership website for presenting verified vehicles, dealership services, contact information, appointment booking, and a simple MVP admin overview.

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
- `/admin` - password-protected MVP admin overview for vehicles and inquiries

## Current MVP Limitations

- Vehicle, service, and inquiry data falls back to local seed data when Supabase env vars are missing.
- Forms are wired to submission helpers and write to Supabase only when the public Supabase env vars are configured.
- Admin access is protected by a simple MVP password gate. This is not full user authentication.
- Admin vehicle mutations require `SUPABASE_SERVICE_ROLE_KEY` and run only through server-side actions after the admin cookie check.
- Vehicle photo uploads use Supabase Storage through server-side admin actions. Multiple uploaded photos are stored as a gallery, and manual Image URL remains available as a fallback.
- No email sending or notification workflow is implemented yet.
- Contact details, address, statutory company identifiers, and opening hours are intentionally not shown until real values are provided.
- Financing is presented only as a future service.

## Environment Variables

Copy `.env.example` to `.env.local` when real values are available.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ADMIN_PASSWORD=
SUPABASE_SERVICE_ROLE_KEY=
```

For local development, put real values only in `.env.local`.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ptpouetttwyqksnksboc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste publishable anon key locally>
SUPABASE_SERVICE_ROLE_KEY=<paste service role key locally>
```

Do not commit `.env.local`, service role keys, database passwords, or direct PostgreSQL connection strings.

`ADMIN_PASSWORD` is used only on the server to unlock `/admin`. Keep it in `.env.local` for local development and in Vercel Environment Variables for production. Do not prefix it with `NEXT_PUBLIC_`.

`SUPABASE_SERVICE_ROLE_KEY` is used only by server-side admin inventory actions. Never expose it in browser code and never prefix it with `NEXT_PUBLIC_`.

## Supabase Setup

Supabase project:

- Project URL: `https://ptpouetttwyqksnksboc.supabase.co`
- Project ref: `ptpouetttwyqksnksboc`

Database files:

- Migration: `supabase/migrations/001_initial_schema.sql`
- Admin inventory migration: `supabase/migrations/002_admin_inventory_policies.sql`
- Vehicle image storage migration: `supabase/migrations/003_vehicle_image_storage.sql`
- Seed data: `supabase/seed.sql`

To apply the schema without the Supabase CLI:

1. Open the Supabase Dashboard.
2. Go to SQL Editor.
3. Run the contents of `supabase/migrations/001_initial_schema.sql`.
4. Run the contents of `supabase/migrations/002_admin_inventory_policies.sql`.
5. Run the contents of `supabase/migrations/003_vehicle_image_storage.sql`.
6. Run the contents of `supabase/seed.sql`.

The storage migration creates a public Supabase Storage bucket named `vehicle-images`
with a 5 MB limit and JPG, PNG, and WebP allowed MIME types. It adds public read
access for stored vehicle photos and intentionally does not add browser upload
policies. Uploads are performed server-side through the admin vehicle Server
Action using `SUPABASE_SERVICE_ROLE_KEY`.

Uploaded vehicle photos use this Storage structure:

```txt
vehicle-images/
  vehicles/{vehicle-id}/main.jpg
  vehicles/{vehicle-id}/gallery-1.webp
  vehicles/{vehicle-id}/gallery-2.png
```

The first uploaded file is saved as `image_url` and the ordered uploaded list is
saved to `gallery_urls`. If no files are uploaded, the optional manual Image URL
continues to work as the vehicle image fallback.

If the SQL migration cannot be applied, create the bucket manually in Supabase:

1. Go to Storage.
2. Create a bucket named `vehicle-images`.
3. Set it to public.
4. Limit uploads to 5 MB.
5. Allow `image/jpeg`, `image/png`, and `image/webp`.
6. Add a SELECT policy on `storage.objects` for bucket `vehicle-images` so public
   vehicle images can be read.

To use the Supabase CLI locally:

```bash
supabase login
supabase init
supabase link --project-ref ptpouetttwyqksnksboc
```

If linking requires different account permissions, apply the SQL files through the Supabase Dashboard SQL Editor instead.

The public pages read through `src/lib/data.ts`. That layer tries Supabase first when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured, then falls back to local seed data if Supabase is unavailable.

Admin vehicle mutations and image/gallery uploads use Server Actions in `src/app/admin/vehicle-actions.ts` and the server-only client in `src/lib/supabase/server.ts`. They require `ADMIN_PASSWORD` for access and `SUPABASE_SERVICE_ROLE_KEY` for database writes and Storage uploads.

Additional notes live in `src/lib/supabase/README.md`.

## Vercel Deployment Notes

The project can be imported into Vercel as a standard Next.js app.

- Build command: `npm run build`
- Install command: `npm install`
- Framework preset: Next.js
- Environment variables: add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_PASSWORD`, and `SUPABASE_SERVICE_ROLE_KEY` in Vercel
- No `vercel.json` is required for the current MVP

Before deployment, run:

```bash
npm run lint
npm run build
```
