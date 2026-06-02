export type VehicleStatus = "Dostupné" | "Rezervováno" | "Prodáno";

export type VehicleCategory = "Osobní vozy" | "SUV / 4x4" | "Dodávky";

export type FuelType = "Nafta" | "Benzin" | "Hybrid" | "Elektro";

export type TransmissionType = "Automat" | "Manuál";

export type Vehicle = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  mileage: number;
  fuel: FuelType;
  transmission: TransmissionType;
  price: number;
  status: VehicleStatus;
  image: string;
  category: VehicleCategory;
  featured: boolean;
  createdAt: string;
};

export type SupabaseVehicleStatus = "available" | "reserved" | "sold" | "draft" | "published";

export type Service = {
  id: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
  status?: "active" | "coming_soon" | "draft";
};

export type Inquiry = {
  id: string;
  customerName: string;
  vehicleName: string;
  date: string;
  status: "Nová" | "Zpracovává se" | "Vyřešeno";
};

export type CreateInquiryInput = {
  type: string;
  name?: string;
  phone?: string;
  email?: string;
  vehicleId?: string;
  message?: string;
  sourcePage?: string;
};

export type CreateAppointmentRequestInput = {
  vehicleId?: string;
  name?: string;
  phone?: string;
  email?: string;
  preferredDate?: string;
  preferredTime?: string;
  note?: string;
};

export type CreateVehicleInput = {
  title: string;
  brand: string;
  model: string;
  year?: string;
  mileage?: string;
  fuel?: string;
  transmission?: string;
  priceCzk?: string;
  status?: string;
  licensePlate?: string;
  color?: string;
  powerKw?: string;
  engine?: string;
  description?: string;
  imageUrl?: string;
};

export type SubmissionResult = {
  ok: boolean;
  configured: boolean;
  error?: string;
};
