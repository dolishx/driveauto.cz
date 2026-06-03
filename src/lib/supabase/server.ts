import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedServiceClient: SupabaseClient | null = null;

export function hasSupabaseServiceRoleConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  if (!cachedServiceClient) {
    cachedServiceClient = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedServiceClient;
}
