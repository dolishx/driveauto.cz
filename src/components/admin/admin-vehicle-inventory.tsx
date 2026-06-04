"use client";

import { Archive, Edit3, Eye, RefreshCw, Tag } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import {
  archiveVehicleFormAction,
  draftVehicleFormAction,
  publishVehicleFormAction,
  soldVehicleFormAction,
} from "@/app/admin/vehicle-actions";
import { EditVehicleForm } from "@/components/admin/edit-vehicle-form";
import { VehicleImage } from "@/components/site/vehicle-image";
import { formatMileage, formatPrice } from "@/lib/format";
import type { Vehicle } from "@/types";

export function AdminVehicleInventory({
  vehicles,
  canManageVehicles,
  editingVehicle,
}: {
  vehicles: Vehicle[];
  canManageVehicles: boolean;
  editingVehicle: Vehicle | null;
}) {
  const firstSupabaseVehicle = useMemo(() => vehicles.find((vehicle) => vehicle.adminStatus), [vehicles]);

  return (
    <div className="mt-5 space-y-5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-brand-muted">
            <tr className="border-b border-brand-line">
              <th className="py-3 font-bold">Vůz</th>
              <th className="py-3 font-bold">Parametry</th>
              <th className="py-3 font-bold">Cena</th>
              <th className="py-3 font-bold">Stav</th>
              <th className="py-3 font-bold">Zdroj</th>
              <th className="py-3 font-bold">Akce</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b border-brand-line last:border-b-0">
                <td className="py-4">
                  <VehicleIdentity vehicle={vehicle} />
                </td>
                <td className="py-4 text-brand-muted">
                  {vehicle.year} · {formatMileage(vehicle.mileage)} · {vehicle.fuel} · {vehicle.transmission}
                </td>
                <td className="py-4 font-bold text-brand-blue">{formatPrice(vehicle.price)}</td>
                <td className="py-4">
                  <StatusBadge status={vehicle.status} />
                </td>
                <td className="py-4 text-brand-muted">{vehicle.adminStatus ? "Supabase" : "Lokální fallback"}</td>
                <td className="py-4">
                  <VehicleActions
                    vehicle={vehicle}
                    canManageVehicles={canManageVehicles}
                    isEditing={editingVehicle?.id === vehicle.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingVehicle ? (
        <section id="upravit-vuz" className="scroll-mt-24">
          <EditVehicleForm vehicle={editingVehicle} canManageVehicles={canManageVehicles} />
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-brand-line bg-brand-soft/45 p-5 text-sm leading-6 text-brand-muted">
          {firstSupabaseVehicle
            ? "Vyberte akci Upravit u konkrétního vozu. Editační formulář se otevře pod tabulkou."
            : "Editace je dostupná pro vozy načtené ze Supabase. Lokální fallback slouží pouze jako pojistka veřejného webu."}
        </div>
      )}
    </div>
  );
}

function VehicleIdentity({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-soft">
        <VehicleImage src={vehicle.image} alt="" className="object-cover" sizes="80px" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-bold text-brand-navy">
          {vehicle.brand} {vehicle.model}
        </p>
        <p className="truncate text-brand-muted">{vehicle.variant}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Vehicle["status"] }) {
  const className =
    status === "Prodáno"
      ? "bg-slate-100 text-slate-700"
      : status === "Koncept"
        ? "bg-slate-50 text-slate-600"
        : status === "Archivováno"
          ? "bg-rose-50 text-rose-700"
          : status === "Publikováno"
            ? "bg-blue-50 text-blue-700"
            : status === "Rezervováno"
              ? "bg-amber-50 text-amber-800"
              : "bg-emerald-50 text-emerald-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {status}
    </span>
  );
}

function VehicleActions({
  vehicle,
  canManageVehicles,
  isEditing,
}: {
  vehicle: Vehicle;
  canManageVehicles: boolean;
  isEditing: boolean;
}) {
  const isSupabaseRow = Boolean(vehicle.adminStatus);

  if (!isSupabaseRow) {
    return <p className="text-xs font-semibold text-brand-muted">Pouze fallback</p>;
  }

  const disabled = !canManageVehicles;

  return (
    <div className="flex min-w-52 flex-wrap gap-2">
      <Link
        href={`/admin?editVehicle=${vehicle.id}#upravit-vuz`}
        aria-disabled={disabled}
        className={`inline-flex h-9 items-center gap-1.5 rounded-lg border border-brand-blue/20 bg-brand-soft px-3 text-xs font-bold text-brand-blue hover:bg-blue-100 ${
          disabled ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <Edit3 className="h-3.5 w-3.5" />
        {isEditing ? "Upravuji" : "Upravit"}
      </Link>
      <form action={publishVehicleFormAction.bind(null, vehicle.id)}>
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-brand-line bg-white px-3 text-xs font-bold text-brand-navy hover:border-brand-blue/35 hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Eye className="h-3.5 w-3.5 text-brand-blue" />
          Publikovat
        </button>
      </form>
      <form action={draftVehicleFormAction.bind(null, vehicle.id)}>
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-brand-line bg-white px-3 text-xs font-bold text-brand-navy hover:border-brand-blue/35 hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className="h-3.5 w-3.5 text-brand-blue" />
          Koncept
        </button>
      </form>
      <form action={soldVehicleFormAction.bind(null, vehicle.id)}>
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-brand-line bg-white px-3 text-xs font-bold text-brand-navy hover:border-brand-blue/35 hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Tag className="h-3.5 w-3.5 text-brand-blue" />
          Prodáno
        </button>
      </form>
      <form action={archiveVehicleFormAction.bind(null, vehicle.id)}>
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-100 bg-white px-3 text-xs font-bold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Archive className="h-3.5 w-3.5" />
          Archiv
        </button>
      </form>
    </div>
  );
}
