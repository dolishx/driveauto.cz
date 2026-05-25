import { Calendar, Fuel, Gauge, Heart, Settings } from "lucide-react";
import Image from "next/image";

import { formatMileage, formatPrice } from "@/lib/format";
import type { Vehicle } from "@/types";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-[0_14px_34px_rgba(8,23,52,0.07)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(8,23,52,0.10)]">
      <div className="relative aspect-[1.42] bg-brand-soft">
        <Image
          src={vehicle.image}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <button
          type="button"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-navy shadow-sm ring-1 ring-brand-line/70 hover:text-brand-blue"
          aria-label="Přidat do oblíbených"
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold tracking-[-0.02em] text-brand-navy">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="mt-1 text-sm text-brand-muted">{vehicle.variant}</p>
          </div>
          <p className="shrink-0 text-lg font-bold text-brand-blue">
            {formatPrice(vehicle.price)}
          </p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-brand-line pt-4 text-sm text-brand-muted">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {vehicle.year}
          </span>
          <span className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            {formatMileage(vehicle.mileage)}
          </span>
          <span className="flex items-center gap-2">
            <Fuel className="h-4 w-4" />
            {vehicle.fuel}
          </span>
          <span className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {vehicle.transmission}
          </span>
        </div>
      </div>
    </article>
  );
}
