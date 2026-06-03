"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";

import { hasAdminSession } from "@/lib/admin-auth";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { vehicleSlugBase } from "@/lib/slug";
import type { SubmissionResult, SupabaseVehicleStatus } from "@/types";

const missingServiceRoleMessage = "Správa vozů vyžaduje serverový Supabase klíč.";
const missingSessionMessage = "Administrace vyžaduje platné přihlášení.";
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const vehicleStatuses: SupabaseVehicleStatus[] = [
  "available",
  "reserved",
  "sold",
  "draft",
  "published",
  "archived",
];

export type VehicleMutationState = SubmissionResult;

export async function createVehicleAction(
  _state: VehicleMutationState,
  formData: FormData,
): Promise<VehicleMutationState> {
  const authError = await assertAdminMutationAllowed();
  if (authError) return authError;

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { ok: false, configured: false, error: missingServiceRoleMessage };
  }

  const title = requiredText(formData.get("title"), "Název vozu je povinný.");
  const brand = requiredText(formData.get("brand"), "Značka je povinná.");
  const model = requiredText(formData.get("model"), "Model je povinný.");

  if ("error" in title) return { ok: false, configured: true, error: title.error };
  if ("error" in brand) return { ok: false, configured: true, error: brand.error };
  if ("error" in model) return { ok: false, configured: true, error: model.error };

  const year = textValue(formData.get("year"));
  const slug = await createUniqueVehicleSlug({
    brand: brand.value,
    model: model.value,
    title: title.value,
    year,
  });

  try {
    const { data, error } = await supabase
      .from("vehicles")
      .insert({
        slug,
        title: title.value,
        brand: brand.value,
        model: model.value,
        year: toNumberOrNull(year),
        mileage: toNumberOrNull(textValue(formData.get("mileage"))),
        fuel: emptyToNull(textValue(formData.get("fuel"))),
        transmission: emptyToNull(textValue(formData.get("transmission"))),
        price_czk: toNumberOrNull(textValue(formData.get("priceCzk"))),
        category: emptyToNull(textValue(formData.get("category"))) ?? "Osobní vozy",
        body_type: emptyToNull(textValue(formData.get("bodyType"))),
        color: emptyToNull(textValue(formData.get("color"))),
        power_kw: toNumberOrNull(textValue(formData.get("powerKw"))),
        engine: emptyToNull(textValue(formData.get("engine"))),
        license_plate: emptyToNull(textValue(formData.get("licensePlate"))),
        status: normalizeVehicleStatus(textValue(formData.get("status"))),
        is_featured: formData.get("isFeatured") === "on",
        image_url: normalizeImageUrl(textValue(formData.get("imageUrl"))),
        description: emptyToNull(textValue(formData.get("description"))),
      })
      .select("id,slug")
      .single();

    if (error) {
      return { ok: false, configured: true, error: error.message };
    }

    revalidateInventoryPaths(data?.slug ?? slug);

    return {
      ok: true,
      configured: true,
      message: "Vůz byl uložen do Supabase.",
      vehicleId: data?.id,
      vehicleSlug: data?.slug ?? slug,
    };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      error: error instanceof Error ? error.message : "Uložení vozu se nepodařilo.",
    };
  }
}

export async function updateVehicleAction(
  vehicleId: string,
  _state: VehicleMutationState,
  formData: FormData,
): Promise<VehicleMutationState> {
  const authError = await assertAdminMutationAllowed();
  if (authError) return authError;

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { ok: false, configured: false, error: missingServiceRoleMessage };
  }

  if (!isUuid(vehicleId)) {
    return { ok: false, configured: true, error: "Neplatné ID vozu." };
  }

  try {
    const { data, error } = await supabase
      .from("vehicles")
      .update({
        title: emptyToNull(textValue(formData.get("title"))),
        brand: emptyToNull(textValue(formData.get("brand"))),
        model: emptyToNull(textValue(formData.get("model"))),
        year: toNumberOrNull(textValue(formData.get("year"))),
        mileage: toNumberOrNull(textValue(formData.get("mileage"))),
        fuel: emptyToNull(textValue(formData.get("fuel"))),
        transmission: emptyToNull(textValue(formData.get("transmission"))),
        price_czk: toNumberOrNull(textValue(formData.get("priceCzk"))),
        color: emptyToNull(textValue(formData.get("color"))),
        power_kw: toNumberOrNull(textValue(formData.get("powerKw"))),
        engine: emptyToNull(textValue(formData.get("engine"))),
        license_plate: emptyToNull(textValue(formData.get("licensePlate"))),
        image_url: normalizeImageUrl(textValue(formData.get("imageUrl"))),
        description: emptyToNull(textValue(formData.get("description"))),
      })
      .eq("id", vehicleId)
      .select("slug")
      .maybeSingle();

    if (error) {
      return { ok: false, configured: true, error: error.message };
    }

    revalidateInventoryPaths(data?.slug);

    return { ok: true, configured: true, message: "Vůz byl aktualizován." };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      error: error instanceof Error ? error.message : "Aktualizace vozu se nepodařila.",
    };
  }
}

export async function updateVehicleStatusAction(
  vehicleId: string,
  status: SupabaseVehicleStatus,
): Promise<VehicleMutationState> {
  const authError = await assertAdminMutationAllowed();
  if (authError) return authError;

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { ok: false, configured: false, error: missingServiceRoleMessage };
  }

  if (!isUuid(vehicleId)) {
    return { ok: false, configured: true, error: "Neplatné ID vozu." };
  }

  if (!vehicleStatuses.includes(status)) {
    return { ok: false, configured: true, error: "Neplatný status vozu." };
  }

  try {
    const { data, error } = await supabase
      .from("vehicles")
      .update({ status })
      .eq("id", vehicleId)
      .select("slug")
      .maybeSingle();

    if (error) {
      return { ok: false, configured: true, error: error.message };
    }

    revalidateInventoryPaths(data?.slug);

    return { ok: true, configured: true, message: "Status vozu byl uložen." };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      error: error instanceof Error ? error.message : "Změna statusu se nepodařila.",
    };
  }
}

export async function archiveVehicleAction(vehicleId: string): Promise<VehicleMutationState> {
  return updateVehicleStatusAction(vehicleId, "archived");
}

export async function publishVehicleFormAction(vehicleId: string): Promise<void> {
  await updateVehicleStatusAction(vehicleId, "published");
}

export async function draftVehicleFormAction(vehicleId: string): Promise<void> {
  await updateVehicleStatusAction(vehicleId, "draft");
}

export async function soldVehicleFormAction(vehicleId: string): Promise<void> {
  await updateVehicleStatusAction(vehicleId, "sold");
}

export async function archiveVehicleFormAction(vehicleId: string): Promise<void> {
  await archiveVehicleAction(vehicleId);
}

async function assertAdminMutationAllowed(): Promise<VehicleMutationState | null> {
  if (!(await hasAdminSession())) {
    return { ok: false, configured: true, error: missingSessionMessage };
  }

  return null;
}

async function createUniqueVehicleSlug({
  brand,
  model,
  title,
  year,
}: {
  brand: string;
  model: string;
  title: string;
  year: string;
}) {
  const supabase = getSupabaseServiceClient();
  const base = vehicleSlugBase({ brand, model, title, year });

  if (!supabase) {
    return `${base}-${randomUUID().slice(0, 8)}`;
  }

  const { data } = await supabase
    .from("vehicles")
    .select("slug")
    .like("slug", `${base}%`);
  const existingSlugs = new Set((data ?? []).map((item) => item.slug).filter(Boolean));

  if (!existingSlugs.has(base)) {
    return base;
  }

  return `${base}-${randomUUID().slice(0, 8)}`;
}

function revalidateInventoryPaths(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/nabidka-vozu");
  revalidatePath("/domluvit-prohlidku");

  if (slug) {
    revalidatePath(`/nabidka-vozu/${slug}`);
  }
}

function textValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function requiredText(value: FormDataEntryValue | null, error: string) {
  const normalized = textValue(value);

  if (!normalized) {
    return { error } as const;
  }

  return { value: normalized } as const;
}

function emptyToNull(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function toNumberOrNull(value?: string) {
  if (!value?.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeImageUrl(value?: string) {
  const normalized = value?.trim();
  return normalized || "/images/car-superb.jpg";
}

function normalizeVehicleStatus(value?: string): SupabaseVehicleStatus {
  if (vehicleStatuses.includes(value as SupabaseVehicleStatus)) {
    return value as SupabaseVehicleStatus;
  }

  return "draft";
}

function isUuid(value?: string) {
  return Boolean(value && uuidPattern.test(value));
}
