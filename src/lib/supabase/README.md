# Supabase readiness

Supabase is intentionally not connected in this MVP because no environment
variables are present yet.

When the project is ready for backend data:

1. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel.
2. Install `@supabase/supabase-js`.
3. Create a typed Supabase client in `src/lib/supabase/client.ts`.
4. Replace seed reads inside `src/lib/data.ts` with Supabase queries.
5. Keep the exported data functions stable so the page components do not need to change.
