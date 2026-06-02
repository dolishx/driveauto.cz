import { ArrowRight, Calendar, Fuel, Gauge, Heart, Settings, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/button";
import { formatMileage, formatPrice } from "@/lib/format";
import type { Vehicle } from "@/types";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const detailHref = `/nabidka-vozu/${vehicle.slug}`;

  return (
    <article className="group overflow-hidden rounded-2xl border border-brand-line bg-white shadow-[0_14px_34px_rgba(8,23,52,0.07)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(8,23,52,0.10)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-soft">
        <Link href={detailHref} className="absolute inset-0 block" aria-label={`Zobrazit detail vozu ${vehicle.brand} ${vehicle.model}`}>
          <Image
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 25vw"
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
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-brand-navy shadow-sm ring-1 ring-brand-line/70 hover:text-brand-blue"
          aria-label="Přidat do oblíbených"
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>

      <div className="p-5">
        <div className="flex min-h-[116px] flex-col">
          <div className="flex items-start justify-between gap-4">
            <Link href={detailHref}>
              <h3 className="text-lg font-bold tracking-[-0.02em] text-brand-navy transition-colors hover:text-brand-blue">
                {vehicle.brand} {vehicle.model}
              </h3>
            </Link>
            <p className="shrink-0 text-right text-lg font-bold text-brand-blue">
              {formatPrice(vehicle.price)}
            </p>
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-brand-muted">{vehicle.variant}</p>
          <p className="mt-auto inline-flex items-center gap-2 pt-3 text-xs font-semibold text-brand-muted">
            <ShieldCheck className="h-4 w-4 text-brand-blue" />
            Stav a dostupnost ověříme před prohlídkou
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 border-y border-brand-line py-4 text-sm text-brand-muted">
          <Spec icon={<Calendar className="h-4 w-4" />} value={String(vehicle.year)} />
          <Spec icon={<Gauge className="h-4 w-4" />} value={formatMileage(vehicle.mileage)} />
          <Spec icon={<Fuel className="h-4 w-4" />} value={vehicle.fuel} />
          <Spec icon={<Settings className="h-4 w-4" />} value={vehicle.transmission} />
        </div>

        <div className="mt-4 grid gap-2">
          <ButtonLink href={detailHref} className="h-11 w-full">
            Detail vozu
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/domluvit-prohlidku" variant="secondary" className="h-11 w-full">
            Domluvit prohlídku
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

function Spec({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="shrink-0 text-brand-blue">{icon}</span>
      <span className="truncate">{value}</span>
    </span>
  );
}
