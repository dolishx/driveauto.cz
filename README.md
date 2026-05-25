# AutoDrive MVP

AutoDrive MVP is a Czech car dealership website for presenting verified vehicles, dealership services, contact information, appointment booking, and a simple MVP admin overview.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Lucide React icons
- Local seed data for vehicles, services, and inquiries
- Supabase-ready data structure for later integration
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

- Vehicle, service, and inquiry data is local seed data.
- Forms prevent the default submit action and show client-side MVP feedback only.
- No database writes are active yet.
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

These variables are placeholders for the planned Supabase integration. Do not commit real secrets.

## Supabase Integration Later

Supabase is intentionally not connected in this MVP. The public pages read through `src/lib/data.ts`, so seed data can later be replaced with Supabase queries without changing page components. Additional notes live in `src/lib/supabase/README.md`.

## Vercel Deployment Notes

The project can be imported into Vercel as a standard Next.js app.

- Build command: `npm run build`
- Install command: `npm install`
- Framework preset: Next.js
- Environment variables: add Supabase values later only when the database is connected
- No `vercel.json` is required for the current MVP

Before deployment, run:

```bash
npm run lint
npm run build
```
