import { Calendar, Fuel, Gauge, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { formatMileage, formatPrice } from "@/lib/format";
import type { Vehicle } from "@/types";

export function VehicleListCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article className="grid overflow-hidden rounded-2xl border border-brand-line bg-white shadow-[0_12px_32px_rgba(8,23,52,0.06)] transition-shadow hover:shadow-[0_18px_46px_rgba(8,23,52,0.11)] md:grid-cols-[268px_1fr]">
      <Link href="/domluvit-prohlidku" className="relative min-h-56 bg-brand-soft md:min-h-full">
        <Image
          src={vehicle.image}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 280px"
        />
      </Link>
      <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:p-6">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-blue">
              {vehicle.status}
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-muted ring-1 ring-brand-line">
              {vehicle.category}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-[-0.035em] text-brand-navy">
            {vehicle.brand} {vehicle.model}
          </h2>
          <p className="mt-2 text-brand-muted">{vehicle.variant}</p>

          <div className="mt-5 grid max-w-2xl grid-cols-2 gap-4 text-sm text-brand-muted sm:grid-cols-4">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-blue" />
              {vehicle.year}
            </span>
            <span className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-brand-blue" />
              {formatMileage(vehicle.mileage)}
            </span>
            <span className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-brand-blue" />
              {vehicle.fuel}
            </span>
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-brand-blue" />
              {vehicle.transmission}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-5 md:min-w-52 md:items-end">
          <p className="text-2xl font-bold text-brand-blue">
            {formatPrice(vehicle.price)}
          </p>
          <div className="flex flex-wrap gap-3 md:grid md:w-full">
            <ButtonLink href="/domluvit-prohlidku" className="md:w-full">
              Domluvit prohlídku
            </ButtonLink>
            <ButtonLink href="/kontakt" variant="secondary" className="md:w-full">
              Zeptat se na vůz
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}
