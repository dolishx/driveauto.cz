import { appointmentRequests } from "@/data/appointment-requests";
import { inquiries } from "@/data/inquiries";
import { services } from "@/data/services";
import { vehicles } from "@/data/vehicles";
import { getSupabaseClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";
import type {
  AppointmentRequest,
  CreateAppointmentRequestInput,
  CreateInquiryInput,
  CreateVehicleInput,
  FuelType,
  Inquiry,
  LeadStatus,
  Service,
  SubmissionResult,
  SupabaseVehicleStatus,
  TransmissionType,
  UpdateLeadStatusInput,
  Vehicle,
  VehicleCategory,
  VehicleStatus,
} from "@/types";

type VehicleRow = {
  id: string;
  slug: string | null;
  brand: string;
  model: string;
  title: string;
  year: number | null;
  mileage: number | null;
  fuel: string | null;
  transmission: string | null;
  price_czk: number | null;
  category: string | null;
  body_type: string | null;
  color: string | null;
  power_kw: number | null;
  engine: string | null;
  vin: string | null;
  license_plate: string | null;
  status: string | null;
  is_featured: boolean | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: string | null;
  badge: string | null;
};

type RelatedVehicleRow = {
  brand: string | null;
  model: string | null;
  title: string | null;
};

type RelatedVehicleValue = RelatedVehicleRow | RelatedVehicleRow[] | null;

type InquiryRow = {
  id: string;
  type: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  vehicle_id: string | null;
  message: string | null;
  status: string | null;
  source_page: string | null;
  created_at: string | null;
  vehicle?: RelatedVehicleValue;
};

type AppointmentRequestRow = {
  id: string;
  vehicle_id: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  note: string | null;
  status: string | null;
  created_at: string | null;
  vehicle?: RelatedVehicleValue;
};

const publicVehicleStatuses = ["published"];
const publicFallbackVehicles = vehicles.filter((vehicle) => vehicle.status === "Publikováno");
const leadStatuses: LeadStatus[] = ["new", "contacted", "scheduled", "completed", "closed"];
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getVehicles(): Promise<Vehicle[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return publicFallbackVehicles;
  }

  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .in("status", publicVehicleStatuses)
      .order("created_at", { ascending: false });

    if (error) {
      warnSupabaseFallback("vehicles", error.message);
      return publicFallbackVehicles;
    }

    if (!data?.length) {
      warnSupabaseFallback("vehicles returned empty result");
      return publicFallbackVehicles;
    }

    return data.map(mapVehicleRow);
  } catch (error) {
    warnSupabaseFallback("vehicles", getErrorMessage(error));
    return publicFallbackVehicles;
  }
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return publicFallbackVehicles.filter((vehicle) => vehicle.featured);
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
      return publicFallbackVehicles.filter((vehicle) => vehicle.featured);
    }

    if (!data?.length) {
      warnSupabaseFallback("vehicles returned empty result");
      return publicFallbackVehicles.filter((vehicle) => vehicle.featured);
    }

    return data.map(mapVehicleRow);
  } catch (error) {
    warnSupabaseFallback("featured vehicles", getErrorMessage(error));
    return publicFallbackVehicles.filter((vehicle) => vehicle.featured);
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
  const localVehicle = publicFallbackVehicles.find((vehicle) => vehicle.slug === slug) ?? null;

  if (localVehicle) {
    return localVehicle;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("slug", slug)
      .in("status", publicVehicleStatuses)
      .maybeSingle();

    if (error) {
      warnSupabaseFallback("vehicle detail", error.message);
      const currentVehicles = await getVehicles();
      return currentVehicles.find((vehicle) => vehicle.slug === slug) ?? null;
    }

    if (data) {
      return mapVehicleRow(data);
    }
  } catch (error) {
    warnSupabaseFallback("vehicle detail", getErrorMessage(error));
  }

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

export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return inquiries;
  }

  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select("id,type,name,phone,email,vehicle_id,message,status,source_page,created_at,vehicle:vehicles(brand,model,title)")
      .order("created_at", { ascending: false });

    if (error) {
      warnSupabaseFallback("inquiries", error.message);
      return inquiries;
    }

    if (!data?.length) {
      warnSupabaseFallback("inquiries returned empty result");
      return inquiries;
    }

    return data.map((row) => mapInquiryRow(row as unknown as InquiryRow));
  } catch (error) {
    warnSupabaseFallback("inquiries", getErrorMessage(error));
    return inquiries;
  }
}

export async function getAppointmentRequests(): Promise<AppointmentRequest[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return appointmentRequests;
  }

  try {
    const { data, error } = await supabase
      .from("appointment_requests")
      .select("id,vehicle_id,name,phone,email,preferred_date,preferred_time,note,status,created_at,vehicle:vehicles(brand,model,title)")
      .order("created_at", { ascending: false });

    if (error) {
      warnSupabaseFallback("appointment requests", error.message);
      return appointmentRequests;
    }

    if (!data?.length) {
      warnSupabaseFallback("appointment requests returned empty result");
      return appointmentRequests;
    }

    return data.map((row) => mapAppointmentRequestRow(row as unknown as AppointmentRequestRow));
  } catch (error) {
    warnSupabaseFallback("appointment requests", getErrorMessage(error));
    return appointmentRequests;
  }
}

export async function updateInquiryStatus(input: UpdateLeadStatusInput): Promise<SubmissionResult> {
  const supabase = getSupabaseClient();

  if (!leadStatuses.includes(input.status)) {
    return { ok: false, configured: Boolean(supabase), error: "Neplatný status poptávky." };
  }

  if (!supabase) {
    return {
      ok: false,
      configured: false,
      error: "Změna statusu vyžaduje admin policy nebo server-side action.",
    };
  }

  if (!isUuid(input.id)) {
    return {
      ok: false,
      configured: true,
      error: "Změna statusu vyžaduje admin policy nebo server-side action.",
    };
  }

  const tableName = input.entity === "appointment" ? "appointment_requests" : "inquiries";

  try {
    const { error } = await supabase
      .from(tableName)
      .update({ status: input.status })
      .eq("id", input.id);

    if (error) {
      const message = isRlsError(error.message)
        ? "Změna statusu vyžaduje admin policy nebo server-side action."
        : error.message;
      warnSupabaseFallback(`${tableName} status update`, message);
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

function mapInquiryRow(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    type: row.type || "Poptávka",
    name: row.name || "Bez jména",
    phone: row.phone || "Bude doplněno",
    email: row.email || "Bude doplněno",
    vehicleId: row.vehicle_id ?? undefined,
    vehicleName: relatedVehicleName(row.vehicle) || "Bez vybraného vozu",
    message: row.message || "Bez zprávy",
    status: normalizeLeadStatus(row.status),
    sourcePage: row.source_page || "Neuvedeno",
    createdAt: row.created_at ? formatDateTime(row.created_at) : "Neuvedeno",
  };
}

function mapAppointmentRequestRow(row: AppointmentRequestRow): AppointmentRequest {
  return {
    id: row.id,
    vehicleId: row.vehicle_id ?? undefined,
    vehicleName: relatedVehicleName(row.vehicle) || "Bez vybraného vozu",
    name: row.name || "Bez jména",
    phone: row.phone || "Bude doplněno",
    email: row.email || "Bude doplněno",
    preferredDate: row.preferred_date || "Neuvedeno",
    preferredTime: row.preferred_time || "Neuvedeno",
    note: row.note || "Bez poznámky",
    status: normalizeLeadStatus(row.status),
    createdAt: row.created_at ? formatDateTime(row.created_at) : "Neuvedeno",
  };
}

export function mapVehicleRow(row: VehicleRow): Vehicle {
  const gallery = normalizeGalleryUrls(row.gallery_urls);
  const image = row.image_url || gallery[0] || "/images/car-superb.jpg";

  return {
    id: row.id,
    slug: row.slug || slugify(`${row.brand}-${row.model}-${row.title}-${row.year ?? ""}-${row.id.slice(0, 8)}`),
    brand: row.brand,
    model: row.model,
    variant: row.title,
    year: row.year ?? 0,
    mileage: row.mileage ?? 0,
    fuel: normalizeFuel(row.fuel),
    transmission: normalizeTransmission(row.transmission),
    price: row.price_czk ?? 0,
    status: normalizeVehicleStatus(row.status),
    image,
    gallery: gallery.length ? gallery : row.image_url ? [row.image_url] : [],
    category: normalizeCategory(row.category),
    bodyType: row.body_type ?? undefined,
    color: row.color ?? undefined,
    powerKw: row.power_kw ?? undefined,
    engine: row.engine ?? undefined,
    vin: row.vin ?? undefined,
    licensePlate: row.license_plate ?? undefined,
    description: row.description ?? undefined,
    featured: Boolean(row.is_featured),
    createdAt: row.created_at ?? "",
    updatedAt: row.updated_at ?? undefined,
    adminStatus: normalizeSupabaseVehicleStatus(row.status),
  };
}

function normalizeGalleryUrls(value: string[] | null) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => item.trim()).filter(Boolean);
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
  if (status === "draft") return "Koncept";
  if (status === "published") return "Publikováno";
  if (status === "archived") return "Archivováno";
  return "Dostupné";
}

function normalizeSupabaseVehicleStatus(status: string | null): SupabaseVehicleStatus {
  if (
    status === "reserved" ||
    status === "sold" ||
    status === "draft" ||
    status === "published" ||
    status === "archived"
  ) {
    return status;
  }

  return "available";
}

function normalizeAdminStatus(status?: string) {
  if (status === "reserved") return "reserved";
  if (status === "sold") return "sold";
  if (status === "published") return "published";
  if (status === "draft") return "draft";
  return "available";
}

function normalizeLeadStatus(status: string | null): LeadStatus {
  if (status && leadStatuses.includes(status as LeadStatus)) {
    return status as LeadStatus;
  }
  return "new";
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

function relatedVehicleName(vehicle?: RelatedVehicleValue) {
  if (!vehicle) return "";
  const normalized = Array.isArray(vehicle) ? vehicle[0] : vehicle;
  if (!normalized) return "";
  return [normalized.brand, normalized.model, normalized.title].filter(Boolean).join(" ");
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
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
