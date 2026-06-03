import "server-only";

import { vehicles } from "@/data/vehicles";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { mapVehicleRow } from "@/lib/data";
import type { Vehicle } from "@/types";

export async function getAdminVehicles(): Promise<Vehicle[]> {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return vehicles;
  }

  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn(`[Supabase fallback] admin vehicles: ${error.message}`);
      return vehicles;
    }

    if (!data?.length) {
      console.warn("[Supabase fallback] admin vehicles returned empty result");
      return vehicles;
    }

    return data.map(mapVehicleRow);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Supabase error";
    console.warn(`[Supabase fallback] admin vehicles: ${message}`);
    return vehicles;
  }
}
