import { inquiries } from "@/data/inquiries";
import { services } from "@/data/services";
import { vehicles } from "@/data/vehicles";

// Supabase will be connected here later. Keep page components calling these
// functions so seed data can be replaced by Supabase queries without changing UI.
export async function getVehicles() {
  return vehicles;
}

export async function getFeaturedVehicles() {
  return vehicles.filter((vehicle) => vehicle.featured);
}

export async function getServices() {
  return services;
}

export async function getInquiries() {
  return inquiries;
}
