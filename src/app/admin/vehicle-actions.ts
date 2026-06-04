"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";

import { hasAdminSession } from "@/lib/admin-auth";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { vehicleSlugBase } from "@/lib/slug";
import type { SubmissionResult, SupabaseVehicleStatus } from "@/types";

const missingServiceRoleMessage = "Správa vozů vyžaduje serverový Supabase klíč.";
const missingSessionMessage = "Administrace vyžaduje platné přihlášení.";
const vehicleImageBucket = "vehicle-images";
const maxVehicleImageSize = 5 * 1024 * 1024;
const maxVehicleImageCount = 12;
const allowedVehicleImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const uploadFailureMessage = "Nahrání fotografie se nepodařilo. Můžete vložit URL obrázku ručně.";
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
  const vehicleId = randomUUID();
  const slug = await createUniqueVehicleSlug({
    brand: brand.value,
    model: model.value,
    title: title.value,
    year,
  });
  const imageUpload = await uploadVehicleImages({
    supabase,
    imageFiles: collectVehicleImageFiles(formData),
    vehicleId,
  });

  if (!imageUpload.ok) {
    return imageUpload;
  }

  const manualImageUrl = emptyToNull(textValue(formData.get("imageUrl")));
  const uploadedImageUrls = imageUpload.publicUrls;
  const imageUrl = uploadedImageUrls[0] ?? manualImageUrl ?? normalizeImageUrl("");
  const galleryUrls = uploadedImageUrls.length
    ? uploadedImageUrls
    : manualImageUrl
      ? [manualImageUrl]
      : null;

  try {
    const { data, error } = await supabase
      .from("vehicles")
      .insert({
        id: vehicleId,
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
        image_url: imageUrl,
        gallery_urls: galleryUrls,
        description: emptyToNull(textValue(formData.get("description"))),
      })
      .select("id,slug")
      .single();

    if (error) {
      await removeUploadedVehicleImages(supabase, imageUpload.storagePaths);
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
    await removeUploadedVehicleImages(supabase, imageUpload.storagePaths);

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

  const title = requiredText(formData.get("title"), "Název vozu je povinný.");
  const brand = requiredText(formData.get("brand"), "Značka je povinná.");
  const model = requiredText(formData.get("model"), "Model je povinný.");

  if ("error" in title) return { ok: false, configured: true, error: title.error };
  if ("error" in brand) return { ok: false, configured: true, error: brand.error };
  if ("error" in model) return { ok: false, configured: true, error: model.error };

  try {
    const { data: currentVehicle, error: currentVehicleError } = await supabase
      .from("vehicles")
      .select("slug,title,brand,model,year,image_url,gallery_urls")
      .eq("id", vehicleId)
      .maybeSingle();

    if (currentVehicleError) {
      return { ok: false, configured: true, error: currentVehicleError.message };
    }

    if (!currentVehicle) {
      return { ok: false, configured: true, error: "Vůz nebyl nalezen." };
    }

    const year = textValue(formData.get("year"));
    const yearNumber = toNumberOrNull(year);
    const slugRelevantFieldsChanged =
      currentVehicle.title !== title.value ||
      currentVehicle.brand !== brand.value ||
      currentVehicle.model !== model.value ||
      currentVehicle.year !== yearNumber;
    const slug = slugRelevantFieldsChanged
      ? await createUniqueVehicleSlug({
          brand: brand.value,
          model: model.value,
          title: title.value,
          year,
          excludeVehicleId: vehicleId,
        })
      : currentVehicle.slug;

    const imageUpload = await uploadVehicleImages({
      supabase,
      imageFiles: collectVehicleImageFiles(formData),
      vehicleId,
      fileNamePrefix: `edit-${Date.now()}-${randomUUID().slice(0, 8)}`,
    });

    if (!imageUpload.ok) {
      return imageUpload;
    }

    const keptGalleryUrls = uniqueUrls(formData.getAll("existingGalleryUrls").map(textValue));
    const primaryImageUrl = emptyToNull(textValue(formData.get("primaryImageUrl")));
    const manualImageUrl = emptyToNull(textValue(formData.get("imageUrl")));
    const initialImageUrl = emptyToNull(textValue(formData.get("initialImageUrl")));
    const manualImageChanged =
      manualImageUrl !== null && manualImageUrl !== initialImageUrl && !keptGalleryUrls.includes(manualImageUrl);
    const retainedGalleryUrls = orderGalleryWithPrimary(keptGalleryUrls, primaryImageUrl);
    const newImagesAsPrimary = formData.get("newImagesAsPrimary") === "on";
    const galleryWithManualUrl = manualImageChanged && manualImageUrl
      ? [manualImageUrl, ...retainedGalleryUrls]
      : retainedGalleryUrls;
    const galleryUrls = uniqueUrls(
      newImagesAsPrimary && imageUpload.publicUrls.length
        ? [...imageUpload.publicUrls, ...galleryWithManualUrl]
        : [...galleryWithManualUrl, ...imageUpload.publicUrls],
    );
    const imageUrl = galleryUrls[0] ?? (manualImageChanged ? manualImageUrl : null) ?? normalizeImageUrl("");

    const { data, error } = await supabase
      .from("vehicles")
      .update({
        slug,
        title: title.value,
        brand: brand.value,
        model: model.value,
        year: yearNumber,
        mileage: toNumberOrNull(textValue(formData.get("mileage"))),
        fuel: emptyToNull(textValue(formData.get("fuel"))),
        transmission: emptyToNull(textValue(formData.get("transmission"))),
        price_czk: toNumberOrNull(textValue(formData.get("priceCzk"))),
        category: emptyToNull(textValue(formData.get("category"))) ?? "Osobní vozy",
        body_type: emptyToNull(textValue(formData.get("bodyType"))),
        color: emptyToNull(textValue(formData.get("color"))),
        power_kw: toNumberOrNull(textValue(formData.get("powerKw"))),
        engine: emptyToNull(textValue(formData.get("engine"))),
        vin: emptyToNull(textValue(formData.get("vin"))),
        license_plate: emptyToNull(textValue(formData.get("licensePlate"))),
        status: normalizeVehicleStatus(textValue(formData.get("status"))),
        is_featured: formData.get("isFeatured") === "on",
        image_url: imageUrl,
        gallery_urls: galleryUrls.length ? galleryUrls : null,
        description: emptyToNull(textValue(formData.get("description"))),
        updated_at: new Date().toISOString(),
      })
      .eq("id", vehicleId)
      .select("slug")
      .maybeSingle();

    if (error) {
      await removeUploadedVehicleImages(supabase, imageUpload.storagePaths);
      return { ok: false, configured: true, error: error.message };
    }

    revalidateInventoryPaths(currentVehicle.slug);
    revalidateInventoryPaths(data?.slug);

    return {
      ok: true,
      configured: true,
      message: "Vůz byl aktualizován.",
      vehicleId,
      vehicleSlug: data?.slug ?? slug ?? undefined,
    };
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

type VehicleImageUploadResult =
  | {
      ok: true;
      configured: true;
      publicUrls: string[];
      storagePaths: string[];
    }
  | {
      ok: false;
      configured: true;
      error: string;
      publicUrls: string[];
      storagePaths: string[];
    };

async function uploadVehicleImages({
  supabase,
  imageFiles,
  vehicleId,
  fileNamePrefix,
}: {
  supabase: NonNullable<ReturnType<typeof getSupabaseServiceClient>>;
  imageFiles: File[];
  vehicleId: string;
  fileNamePrefix?: string;
}): Promise<VehicleImageUploadResult> {
  if (!imageFiles.length) {
    return { ok: true, configured: true, publicUrls: [], storagePaths: [] };
  }

  if (imageFiles.length > maxVehicleImageCount) {
    return {
      ok: false,
      configured: true,
      error: `Najednou lze nahrát maximálně ${maxVehicleImageCount} fotografií vozu.`,
      publicUrls: [],
      storagePaths: [],
    };
  }

  for (const imageFile of imageFiles) {
    const extension = allowedVehicleImageTypes.get(imageFile.type);

    if (!extension) {
      return {
        ok: false,
        configured: true,
        error: "Fotografie musí být ve formátu JPG, PNG nebo WebP.",
        publicUrls: [],
        storagePaths: [],
      };
    }

    if (imageFile.size > maxVehicleImageSize) {
      return {
        ok: false,
        configured: true,
        error: "Každá fotografie může mít maximálně 5 MB.",
        publicUrls: [],
        storagePaths: [],
      };
    }
  }

  const publicUrls: string[] = [];
  const storagePaths: string[] = [];

  for (const [index, imageFile] of imageFiles.entries()) {
    const extension = allowedVehicleImageTypes.get(imageFile.type) ?? "jpg";
    const fileName = fileNamePrefix ? `${fileNamePrefix}-${index + 1}` : index === 0 ? "main" : `gallery-${index}`;
    const storagePath = `vehicles/${vehicleId}/${fileName}.${extension}`;

    try {
      const { error } = await supabase.storage
        .from(vehicleImageBucket)
        .upload(storagePath, await imageFile.arrayBuffer(), {
          contentType: imageFile.type,
          upsert: false,
        });

      if (error) {
        console.error("[Supabase storage] vehicle image upload failed", error.message);
        await removeUploadedVehicleImages(supabase, storagePaths);
        return { ok: false, configured: true, error: uploadFailureMessage, publicUrls, storagePaths };
      }

      const { data } = supabase.storage.from(vehicleImageBucket).getPublicUrl(storagePath);

      publicUrls.push(data.publicUrl);
      storagePaths.push(storagePath);
    } catch (error) {
      console.error(
        "[Supabase storage] vehicle image upload failed",
        error instanceof Error ? error.message : error,
      );
      await removeUploadedVehicleImages(supabase, storagePaths);
      return { ok: false, configured: true, error: uploadFailureMessage, publicUrls, storagePaths };
    }
  }

  return {
    ok: true,
    configured: true,
    publicUrls,
    storagePaths,
  };
}

async function removeUploadedVehicleImages(
  supabase: NonNullable<ReturnType<typeof getSupabaseServiceClient>>,
  storagePaths: string[],
) {
  if (!storagePaths.length) {
    return;
  }

  const { error } = await supabase.storage.from(vehicleImageBucket).remove(storagePaths);

  if (error) {
    console.error("[Supabase storage] vehicle image cleanup failed", error.message);
  }
}

function collectVehicleImageFiles(formData: FormData) {
  return [...formData.getAll("imageFiles"), formData.get("imageFile")].filter(isUploadFile);
}

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return typeof File !== "undefined" && value instanceof File && value.size > 0;
}

async function createUniqueVehicleSlug({
  brand,
  model,
  title,
  year,
  excludeVehicleId,
}: {
  brand: string;
  model: string;
  title: string;
  year: string;
  excludeVehicleId?: string;
}) {
  const supabase = getSupabaseServiceClient();
  const base = vehicleSlugBase({ brand, model, title, year });

  if (!supabase) {
    return `${base}-${randomUUID().slice(0, 8)}`;
  }

  const { data } = await supabase
    .from("vehicles")
    .select("id,slug")
    .like("slug", `${base}%`);
  const existingSlugs = new Set(
    (data ?? [])
      .filter((item) => item.id !== excludeVehicleId)
      .map((item) => item.slug)
      .filter(Boolean),
  );

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

function uniqueUrls(urls: Array<string | null | undefined>) {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const url of urls) {
    const normalized = url?.trim();

    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    unique.push(normalized);
  }

  return unique;
}

function orderGalleryWithPrimary(urls: string[], primaryUrl?: string | null) {
  if (!primaryUrl || !urls.includes(primaryUrl)) {
    return urls;
  }

  return [primaryUrl, ...urls.filter((url) => url !== primaryUrl)];
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
