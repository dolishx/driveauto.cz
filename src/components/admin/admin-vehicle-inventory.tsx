"use client";

import { Archive, Edit3, Eye, RefreshCw, RotateCcw, Tag } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  archiveVehicleFormAction,
  draftVehicleFormAction,
  publishVehicleFormAction,
  soldVehicleFormAction,
} from "@/app/admin/vehicle-actions";
import { EditVehicleForm } from "@/components/admin/edit-vehicle-form";
import { VehicleImage } from "@/components/site/vehicle-image";
import { formatMileage, formatPrice } from "@/lib/format";
import type { SupabaseVehicleStatus, Vehicle } from "@/types";

type InventoryGroupId = "published" | "draft" | "sold" | "archived";

const inventoryGroups: Array<{
  id: InventoryGroupId;
  label: string;
  helper: string;
}> = [
  {
    id: "published",
    label: "Aktivní / Published",
    helper: "Vozy viditelné ve veřejné nabídce.",
  },
  {
    id: "draft",
    label: "Koncepty / Draft",
    helper: "Rozpracované vozy mimo veřejný web.",
  },
  {
    id: "sold",
    label: "Prodané / Sold",
    helper: "Uzavřené vozy skryté z nabídky.",
  },
  {
    id: "archived",
    label: "Archivované / Archived",
    helper: "Testovací nebo stažené vozy k dohledání.",
  },
];

export function AdminVehicleInventory({
  vehicles,
  canManageVehicles,
  editingVehicle,
  leadCountsByVehicleId = {},
}: {
  vehicles: Vehicle[];
  canManageVehicles: boolean;
  editingVehicle: Vehicle | null;
  leadCountsByVehicleId?: Record<string, number>;
}) {
  const firstSupabaseVehicle = useMemo(() => vehicles.find((vehicle) => vehicle.adminStatus), [vehicles]);
  const counts = useMemo(() => getLifecycleCounts(vehicles), [vehicles]);
  const initialGroup = editingVehicle ? lifecycleGroupForVehicle(editingVehicle) : "published";
  const [activeGroup, setActiveGroup] = useState<InventoryGroupId>(initialGroup);
  const filteredVehicles = vehicles.filter((vehicle) => lifecycleGroupForVehicle(vehicle) === activeGroup);

  return (
    <div className="mt-5 space-y-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {inventoryGroups.map((group) => {
          const isActive = activeGroup === group.id;

          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setActiveGroup(group.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                isActive
                  ? "border-brand-blue bg-brand-soft shadow-sm"
                  : "border-brand-line bg-white hover:border-brand-blue/35 hover:bg-brand-soft/60"
              }`}
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block text-sm font-bold text-brand-navy">{group.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-brand-muted">{group.helper}</span>
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-bold ${
                    isActive ? "bg-brand-blue text-white" : "bg-brand-soft text-brand-blue"
                  }`}
                >
                  {counts[group.id]}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-brand-muted">
            <tr className="border-b border-brand-line">
              <th className="py-3 font-bold">Vůz</th>
              <th className="py-3 font-bold">Parametry</th>
              <th className="py-3 font-bold">Cena</th>
              <th className="py-3 font-bold">Stav</th>
              <th className="py-3 font-bold">Datumy</th>
              <th className="py-3 font-bold">Akce</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b border-brand-line last:border-b-0">
                <td className="py-4">
                  <VehicleIdentity vehicle={vehicle} />
                </td>
                <td className="py-4 text-brand-muted">
                  <div className="grid gap-1">
                    <span>
                      {vehicle.year} · {formatMileage(vehicle.mileage)}
                    </span>
                    <span>
                      {vehicle.fuel} · {vehicle.transmission}
                    </span>
                    {vehicle.licensePlate ? <span>SPZ: {vehicle.licensePlate}</span> : null}
                    <a href="#poptavky" className="font-semibold text-brand-blue hover:text-brand-blue-dark">
                      Leady: {leadCountsByVehicleId[vehicle.id] ?? 0}
                    </a>
                  </div>
                </td>
                <td className="py-4 font-bold text-brand-blue">{formatPrice(vehicle.price)}</td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={vehicle.status} />
                    {vehicle.featured ? (
                      <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-blue">
                        Doporučeno
                      </span>
                    ) : null}
                    <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-brand-muted">
                      {vehicle.adminStatus ? "Supabase" : "Lokální fallback"}
                    </span>
                  </div>
                </td>
                <td className="py-4 text-brand-muted">
                  <div className="grid gap-1 text-xs leading-5">
                    <span>Vytvořeno: {formatAdminDate(vehicle.createdAt)}</span>
                    <span>Upraveno: {formatAdminDate(vehicle.updatedAt ?? vehicle.createdAt)}</span>
                  </div>
                </td>
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

      {!filteredVehicles.length ? (
        <div className="rounded-2xl border border-dashed border-brand-line bg-brand-soft/45 p-5 text-sm leading-6 text-brand-muted">
          V této části zatím nejsou žádné vozy. Přepněte jiný stav nebo přidejte nový vůz.
        </div>
      ) : null}

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
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-soft">
        <VehicleImage src={vehicle.image} alt="" className="object-cover" sizes="96px" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-bold text-brand-navy">
          {vehicle.brand} {vehicle.model}
        </p>
        <p className="truncate text-brand-muted">{vehicle.variant}</p>
        <p className="mt-1 text-xs font-semibold text-brand-muted">ID: {vehicle.slug}</p>
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
  const isPublished = vehicle.adminStatus === "published";
  const isDraft = vehicle.adminStatus === "draft";
  const isSold = vehicle.adminStatus === "sold";
  const isArchived = vehicle.adminStatus === "archived";

  return (
    <div className="flex min-w-56 flex-wrap gap-2">
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

      {!isPublished ? (
        <form action={publishVehicleFormAction.bind(null, vehicle.id)}>
          <button
            type="submit"
            disabled={disabled}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-brand-line bg-white px-3 text-xs font-bold text-brand-navy hover:border-brand-blue/35 hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isArchived ? <RotateCcw className="h-3.5 w-3.5 text-brand-blue" /> : <Eye className="h-3.5 w-3.5 text-brand-blue" />}
            {isArchived ? "Obnovit" : "Publikovat"}
          </button>
        </form>
      ) : null}

      {!isDraft ? (
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
      ) : null}

      {!isSold ? (
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
      ) : null}

      {!isArchived ? (
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
      ) : null}
    </div>
  );
}

function getLifecycleCounts(vehicles: Vehicle[]) {
  return vehicles.reduce<Record<InventoryGroupId, number>>(
    (counts, vehicle) => {
      counts[lifecycleGroupForVehicle(vehicle)] += 1;
      return counts;
    },
    {
      published: 0,
      draft: 0,
      sold: 0,
      archived: 0,
    },
  );
}

function lifecycleGroupForVehicle(vehicle: Vehicle): InventoryGroupId {
  const status = vehicle.adminStatus ?? czechStatusToSupabaseStatus(vehicle.status);

  if (status === "published") return "published";
  if (status === "draft") return "draft";
  if (status === "sold") return "sold";
  if (status === "archived") return "archived";

  return "draft";
}

function czechStatusToSupabaseStatus(status: Vehicle["status"]): SupabaseVehicleStatus {
  if (status === "Koncept") return "draft";
  if (status === "Prodáno") return "sold";
  if (status === "Archivováno") return "archived";
  if (status === "Rezervováno") return "reserved";
  if (status === "Publikováno") return "published";

  return "available";
}

function formatAdminDate(value?: string) {
  if (!value) return "Neuvedeno";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
