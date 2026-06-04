export type VehicleStatus = "Dostupné" | "Rezervováno" | "Prodáno" | "Koncept" | "Publikováno" | "Archivováno";

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
  gallery?: string[];
  category: VehicleCategory;
  bodyType?: string;
  color?: string;
  powerKw?: number;
  engine?: string;
  vin?: string;
  licensePlate?: string;
  description?: string;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
  adminStatus?: SupabaseVehicleStatus;
};

export type SupabaseVehicleStatus = "available" | "reserved" | "sold" | "draft" | "published" | "archived";

export type Service = {
  id: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
  status?: "active" | "coming_soon" | "draft";
};

export type LeadStatus =
  | "new"
  | "contacted"
  | "scheduled"
  | "offer_sent"
  | "waiting_decision"
  | "closed"
  | "rejected";

export type LeadSourceType = "inquiry" | "appointment";

export type LeadNote = {
  id: string;
  text: string;
  createdAt: string;
};

export type LeadStatusHistoryEntry = {
  id: string;
  fromStatus?: LeadStatus;
  toStatus: LeadStatus;
  note?: string;
  createdAt: string;
};

export type CrmLead = {
  id: string;
  sourceId: string;
  sourceType: LeadSourceType;
  leadId: string;
  name: string;
  phone: string;
  email: string;
  vehicleId?: string;
  vehicleName: string;
  vehicleSlug?: string;
  source: string;
  status: LeadStatus;
  notes: LeadNote[];
  statusHistory: LeadStatusHistoryEntry[];
  message?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentNote?: string;
  createdAt: string;
  updatedAt: string;
};

export type Inquiry = {
  id: string;
  type: string;
  name: string;
  phone: string;
  email: string;
  vehicleId?: string;
  vehicleName: string;
  message: string;
  status: LeadStatus;
  sourcePage: string;
  createdAt: string;
};

export type AppointmentRequest = {
  id: string;
  vehicleId?: string;
  vehicleName: string;
  name: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  note: string;
  status: LeadStatus;
  createdAt: string;
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

export type UpdateLeadStatusInput = {
  id: string;
  status: LeadStatus;
  entity?: "inquiry" | "appointment";
};

export type SubmissionResult = {
  ok: boolean;
  configured: boolean;
  error?: string;
  message?: string;
  vehicleId?: string;
  vehicleSlug?: string;
  leadNote?: LeadNote;
  leadStatus?: LeadStatus;
};
