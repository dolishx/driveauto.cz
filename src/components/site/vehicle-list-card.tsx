import {
  ArrowRight,
  Calendar,
  CarFront,
  Fuel,
  Gauge,
  Heart,
  MessageCircle,
  Settings,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/button";
import { VehicleImage } from "@/components/site/vehicle-image";
import { formatMileage, formatPrice } from "@/lib/format";
import type { Vehicle } from "@/types";

export function VehicleListCard({ vehicle }: { vehicle: Vehicle }) {
  const detailHref = `/nabidka-vozu/${vehicle.slug}`;

  return (
    <article className="group grid overflow-hidden rounded-2xl border border-brand-line bg-white shadow-[0_12px_32px_rgba(8,23,52,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_46px_rgba(8,23,52,0.11)] md:grid-cols-[286px_1fr]">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-soft md:aspect-auto md:min-h-full">
        <Link href={detailHref} className="absolute inset-0 block" aria-label={`Zobrazit detail vozu ${vehicle.brand} ${vehicle.model}`}>
          <VehicleImage
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 286px"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-blue shadow-sm ring-1 ring-brand-line/70">
              {vehicle.status}
            </span>
            {vehicle.featured ? (
              <span className="rounded-full bg-brand-blue px-3 py-1 text-xs font-bold text-white shadow-sm">
                Doporučeno
              </span>
            ) : null}
          </div>
        </Link>
        <button
          type="button"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-brand-navy shadow-sm ring-1 ring-brand-line/70 transition hover:text-brand-blue"
          aria-label="Přidat do oblíbených"
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>

      <div className="grid min-w-0 gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_238px] lg:p-6">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-blue">
              <CarFront className="h-3.5 w-3.5" />
              {vehicle.category}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-muted ring-1 ring-brand-line">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-blue" />
              Před prohlídkou ověříme dostupnost
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between lg:block">
            <div className="min-w-0">
              <Link href={detailHref}>
                <h2 className="text-2xl font-bold tracking-[-0.035em] text-brand-navy transition-colors hover:text-brand-blue">
                  {vehicle.brand} {vehicle.model}
                </h2>
              </Link>
              <p className="mt-2 text-sm leading-6 text-brand-muted sm:text-base">
                {vehicle.variant}
              </p>
            </div>
            <div className="rounded-xl border border-brand-line bg-brand-soft/65 px-4 py-3 sm:text-right lg:hidden">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Cena vozu</p>
              <p className="mt-1 text-2xl font-bold text-brand-blue">{formatPrice(vehicle.price)}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-brand-muted sm:grid-cols-4">
            <Spec icon={<Calendar className="h-4 w-4" />} label="Rok" value={String(vehicle.year)} />
            <Spec icon={<Gauge className="h-4 w-4" />} label="Nájezd" value={formatMileage(vehicle.mileage)} />
            <Spec icon={<Fuel className="h-4 w-4" />} label="Palivo" value={vehicle.fuel} />
            <Spec icon={<Settings className="h-4 w-4" />} label="Převodovka" value={vehicle.transmission} />
          </div>
        </div>

        <div className="flex flex-col gap-5 rounded-2xl border border-brand-line bg-brand-soft/55 p-4 lg:items-stretch">
          <div className="hidden lg:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Cena vozu</p>
            <p className="mt-1 text-3xl font-bold tracking-[-0.035em] text-brand-blue">
              {formatPrice(vehicle.price)}
            </p>
          </div>
          <div className="grid gap-2">
            <ButtonLink href={detailHref} className="h-11 w-full">
              Zobrazit detail
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/domluvit-prohlidku" variant="secondary" className="h-11 w-full">
              Domluvit prohlídku
            </ButtonLink>
            <ButtonLink href="/kontakt" variant="ghost" className="h-10 w-full text-brand-blue">
              <MessageCircle className="h-4 w-4" />
              Zeptat se
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}

function Spec({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-brand-line bg-white px-3 py-3">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-muted">
        <span className="shrink-0 text-brand-blue">{icon}</span>
        {label}
      </p>
      <p className="mt-1 truncate font-bold text-brand-navy">{value}</p>
    </div>
  );
}
