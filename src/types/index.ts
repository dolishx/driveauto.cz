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

export type Service = {
  id: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
};

export type Inquiry = {
  id: string;
  customerName: string;
  vehicleName: string;
  date: string;
  status: "Nová" | "Zpracovává se" | "Vyřešeno";
};
