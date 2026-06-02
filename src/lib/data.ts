import { inquiries } from "@/data/inquiries";
import { services } from "@/data/services";
import { vehicles } from "@/data/vehicles";
import { getSupabaseClient } from "@/lib/supabase/client";
import type {
  CreateAppointmentRequestInput,
  CreateInquiryInput,
  CreateVehicleInput,
  FuelType,
  Service,
  SubmissionResult,
  TransmissionType,
  Vehicle,
  VehicleCategory,
  VehicleStatus,
} from "@/types";

type VehicleRow = {
  id: string;
  brand: string;
  model: string;
  title: string;
  year: number | null;
  mileage: number | null;
  fuel: string | null;
  transmission: string | null;
  price_czk: number | null;
  category: string | null;
  status: string | null;
  is_featured: boolean | null;
  image_url: string | null;
  created_at: string | null;
};

type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: string | null;
  badge: string | null;
};

const publicVehicleStatuses = ["available", "reserved", "published"];
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getVehicles(): Promise<Vehicle[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return vehicles;
  }

  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .in("status", publicVehicleStatuses)
      .order("created_at", { ascending: false });

    if (error) {
      warnSupabaseFallback("vehicles", error.message);
      return vehicles;
    }

    if (!data?.length) {
      warnSupabaseFallback("vehicles returned empty result");
      return vehicles;
    }

    return data.map(mapVehicleRow);
  } catch (error) {
    warnSupabaseFallback("vehicles", getErrorMessage(error));
    return vehicles;
  }
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return vehicles.filter((vehicle) => vehicle.featured);
  }

  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("is_featured", true)
      .in("status", publicVehicleStatuses)
      .order("created_at", { ascending: false });

    if (error) {
      warnSupabaseFallback("featured vehicles", error.message);
      return vehicles.filter((vehicle) => vehicle.featured);
    }

    if (!data?.length) {
      warnSupabaseFallback("vehicles returned empty result");
      return vehicles.filter((vehicle) => vehicle.featured);
    }

    return data.map(mapVehicleRow);
  } catch (error) {
    warnSupabaseFallback("featured vehicles", getErrorMessage(error));
    return vehicles.filter((vehicle) => vehicle.featured);
  }
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const localVehicle = vehicles.find((vehicle) => vehicle.id === id) ?? null;
  const supabase = getSupabaseClient();

  if (!supabase || !isUuid(id)) {
    return localVehicle;
  }

  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      warnSupabaseFallback("vehicle detail", error.message);
      return localVehicle;
    }

    if (!data) {
      return localVehicle;
    }

    return mapVehicleRow(data);
  } catch (error) {
    warnSupabaseFallback("vehicle detail", getErrorMessage(error));
    return localVehicle;
  }
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const currentVehicles = await getVehicles();
  return currentVehicles.find((vehicle) => vehicle.slug === slug) ?? null;
}

export async function getAdminVehicles(): Promise<Vehicle[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return vehicles;
  }

  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      warnSupabaseFallback("admin vehicles", error.message);
      return vehicles;
    }

    if (!data?.length) {
      warnSupabaseFallback("admin vehicles returned empty result");
      return vehicles;
    }

    return data.map(mapVehicleRow);
  } catch (error) {
    warnSupabaseFallback("admin vehicles", getErrorMessage(error));
    return vehicles;
  }
}

export async function getServices(): Promise<Service[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return services;
  }

  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .in("status", ["active", "coming_soon"])
      .order("sort_order", { ascending: true });

    if (error) {
      warnSupabaseFallback("services", error.message);
      return services;
    }

    if (!data?.length) {
      warnSupabaseFallback("services returned empty result");
      return services;
    }

    return data.map(mapServiceRow);
  } catch (error) {
    warnSupabaseFallback("services", getErrorMessage(error));
    return services;
  }
}

export async function createInquiry(input: CreateInquiryInput): Promise<SubmissionResult> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { ok: true, configured: false };
  }

  try {
    const { error } = await supabase.from("inquiries").insert({
      type: input.type,
      name: emptyToNull(input.name),
      phone: emptyToNull(input.phone),
      email: emptyToNull(input.email),
      vehicle_id: isUuid(input.vehicleId) ? input.vehicleId : null,
      message: emptyToNull(input.message),
      source_page: emptyToNull(input.sourcePage),
    });

    if (error) {
      warnSupabaseFallback("inquiry insert", error.message);
      return { ok: false, configured: true, error: error.message };
    }

    return { ok: true, configured: true };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      error: getErrorMessage(error),
    };
  }
}

export async function createAppointmentRequest(
  input: CreateAppointmentRequestInput,
): Promise<SubmissionResult> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { ok: true, configured: false };
  }

  try {
    const { error } = await supabase.from("appointment_requests").insert({
      vehicle_id: isUuid(input.vehicleId) ? input.vehicleId : null,
      name: emptyToNull(input.name),
      phone: emptyToNull(input.phone),
      email: emptyToNull(input.email),
      preferred_date: emptyToNull(input.preferredDate),
      preferred_time: emptyToNull(input.preferredTime),
      note: emptyToNull(input.note),
    });

    if (error) {
      warnSupabaseFallback("appointment request insert", error.message);
      return { ok: false, configured: true, error: error.message };
    }

    return { ok: true, configured: true };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      error: getErrorMessage(error),
    };
  }
}

export async function createVehicle(input: CreateVehicleInput): Promise<SubmissionResult> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      ok: false,
      configured: false,
      error: "Supabase není nakonfigurovaný. Ukládání vozu je připravené pro další fázi.",
    };
  }

  try {
    const { error } = await supabase.from("vehicles").insert({
      title: requiredText(input.title),
      brand: requiredText(input.brand),
      model: requiredText(input.model),
      year: toNumberOrNull(input.year),
      mileage: toNumberOrNull(input.mileage),
      fuel: emptyToNull(input.fuel),
      transmission: emptyToNull(input.transmission),
      price_czk: toNumberOrNull(input.priceCzk),
      category: "Osobní vozy",
      color: emptyToNull(input.color),
      power_kw: toNumberOrNull(input.powerKw),
      engine: emptyToNull(input.engine),
      license_plate: emptyToNull(input.licensePlate),
      status: normalizeAdminStatus(input.status),
      is_featured: false,
      image_url: normalizeImageUrl(input.imageUrl),
      description: emptyToNull(input.description),
    });

    if (error) {
      const message = isRlsError(error.message)
        ? "Ukládání vozu vyžaduje admin policy nebo server-side action."
        : error.message;
      warnSupabaseFallback("vehicle insert", message);
      return { ok: false, configured: true, error: message };
    }

    return { ok: true, configured: true };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      error: getErrorMessage(error),
    };
  }
}

export async function getInquiries() {
  return inquiries;
}

function mapVehicleRow(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    slug: slugify(`${row.brand}-${row.model}-${row.id.slice(0, 8)}`),
    brand: row.brand,
    model: row.model,
    variant: row.title,
    year: row.year ?? 0,
    mileage: row.mileage ?? 0,
    fuel: normalizeFuel(row.fuel),
    transmission: normalizeTransmission(row.transmission),
    price: row.price_czk ?? 0,
    status: normalizeVehicleStatus(row.status),
    image: row.image_url || "/images/car-superb.jpg",
    category: normalizeCategory(row.category),
    featured: Boolean(row.is_featured),
    createdAt: row.created_at ?? "",
  };
}

function mapServiceRow(row: ServiceRow): Service {
  return {
    id: row.slug,
    title: row.title,
    description: row.description ?? "",
    href: `/sluzby#${row.slug}`,
    badge: row.badge ?? undefined,
    status: row.status === "coming_soon" ? "coming_soon" : "active",
  };
}

function normalizeVehicleStatus(status: string | null): VehicleStatus {
  if (status === "reserved") return "Rezervováno";
  if (status === "sold") return "Prodáno";
  return "Dostupné";
}

function normalizeAdminStatus(status?: string) {
  if (status === "reserved") return "reserved";
  if (status === "sold") return "sold";
  if (status === "published") return "published";
  if (status === "draft") return "draft";
  return "available";
}

function normalizeFuel(fuel: string | null): FuelType {
  if (fuel === "Benzin" || fuel === "Hybrid" || fuel === "Elektro") return fuel;
  return "Nafta";
}

function normalizeTransmission(transmission: string | null): TransmissionType {
  if (transmission === "Manuál") return "Manuál";
  return "Automat";
}

function normalizeCategory(category: string | null): VehicleCategory {
  if (category === "Osobní vozy" || category === "Dodávky") return category;
  return "SUV / 4x4";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isUuid(value?: string) {
  return Boolean(value && uuidPattern.test(value));
}

function emptyToNull(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function requiredText(value?: string) {
  return value?.trim() || "Bez názvu";
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

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown Supabase error";
}

function isRlsError(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("row-level security") || normalized.includes("rls") || normalized.includes("policy");
}

function warnSupabaseFallback(context: string, message?: string) {
  console.warn(`[Supabase fallback] ${message ? `${context}: ${message}` : context}`);
}
