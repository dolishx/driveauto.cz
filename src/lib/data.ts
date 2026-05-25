import { inquiries } from "@/data/inquiries";
import { services } from "@/data/services";
import { vehicles } from "@/data/vehicles";
import { getSupabaseClient } from "@/lib/supabase/client";
import type {
  CreateAppointmentRequestInput,
  CreateInquiryInput,
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

    if (error || !data?.length) {
      return vehicles;
    }

    return data.map(mapVehicleRow);
  } catch {
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

    if (error || !data?.length) {
      return vehicles.filter((vehicle) => vehicle.featured);
    }

    return data.map(mapVehicleRow);
  } catch {
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

    if (error || !data) {
      return localVehicle;
    }

    return mapVehicleRow(data);
  } catch {
    return localVehicle;
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

    if (error || !data?.length) {
      return services;
    }

    return data.map(mapServiceRow);
  } catch {
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
      return { ok: false, configured: true, error: error.message };
    }

    return { ok: true, configured: true };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      error: error instanceof Error ? error.message : "Unknown Supabase error",
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
      return { ok: false, configured: true, error: error.message };
    }

    return { ok: true, configured: true };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      error: error instanceof Error ? error.message : "Unknown Supabase error",
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
