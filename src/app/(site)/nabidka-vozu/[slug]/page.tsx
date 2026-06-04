import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CarFront,
  CheckCircle2,
  Clock,
  Fuel,
  Gauge,
  Mail,
  MapPin,
  Phone,
  Settings,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { VehicleGallery } from "@/components/site/vehicle-gallery";
import { ButtonLink } from "@/components/ui/button";
import { getVehicleBySlug, getVehicles } from "@/lib/data";
import { formatMileage, formatPrice } from "@/lib/format";

type VehicleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const vehicles = await getVehicles();

  return vehicles.map((vehicle) => ({
    slug: vehicle.slug,
  }));
}

export async function generateMetadata({ params }: VehicleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    return {
      title: "Vůz nebyl nalezen | DriveAuto",
    };
  }

  return {
    title: `${vehicle.brand} ${vehicle.model} | DriveAuto`,
    description: `${vehicle.brand} ${vehicle.model} ${vehicle.variant}. Cena ${formatPrice(vehicle.price)}.`,
  };
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const vehicleName = `${vehicle.brand} ${vehicle.model}`;
  const galleryImages = [vehicle.image, ...(vehicle.gallery ?? [])];

  return (
    <div className="bg-white">
      <section className="border-b border-brand-line bg-gradient-to-b from-brand-soft/70 to-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Link
            href="/nabidka-vozu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition hover:text-brand-blue-dark"
          >
            <ArrowLeft className="h-4 w-4" />
            Zpět na nabídku vozů
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-blue shadow-sm ring-1 ring-brand-line">
                  {vehicle.status}
                </span>
                {vehicle.featured ? (
                  <span className="rounded-full bg-brand-blue px-3 py-1 text-xs font-bold text-white shadow-sm">
                    Doporučeno
                  </span>
                ) : null}
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-muted shadow-sm ring-1 ring-brand-line">
                  {vehicle.category}
                </span>
              </div>

              <h1 className="mt-4 text-4xl font-bold tracking-[-0.055em] text-brand-navy md:text-5xl">
                {vehicleName}
              </h1>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-brand-muted">
                {vehicle.variant}
              </p>
            </div>

            <aside className="rounded-2xl border border-brand-line bg-white p-5 shadow-[0_16px_40px_rgba(8,23,52,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-muted">Cena vozu</p>
              <p className="mt-2 text-4xl font-bold tracking-[-0.055em] text-brand-blue">
                {formatPrice(vehicle.price)}
              </p>
              <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-brand-muted">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                Dostupnost, stav a termín prohlídky potvrdíme před návštěvou.
              </p>
              <div className="mt-5 grid gap-2">
                <ButtonLink href="/domluvit-prohlidku" className="h-12 w-full">
                  Domluvit prohlídku
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/kontakt" variant="secondary" className="h-12 w-full">
                  Zeptat se na vůz
                </ButtonLink>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="min-w-0 space-y-8">
            <section>
              <VehicleGallery images={galleryImages} vehicleName={vehicleName} />
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <GalleryNote icon={<CarFront className="h-5 w-5" />} title="Galerie vozu" text="Fotografie z aktuální nabídky" />
                <GalleryNote icon={<ShieldCheck className="h-5 w-5" />} title="Stav vozu" text="Ověříme před prohlídkou" />
                <GalleryNote icon={<Clock className="h-5 w-5" />} title="Prohlídka" text="Termín po domluvě" />
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SpecTile icon={<Calendar className="h-5 w-5" />} label="Rok výroby" value={String(vehicle.year)} />
              <SpecTile icon={<Gauge className="h-5 w-5" />} label="Nájezd" value={formatMileage(vehicle.mileage)} />
              <SpecTile icon={<Fuel className="h-5 w-5" />} label="Palivo" value={vehicle.fuel} />
              <SpecTile icon={<Settings className="h-5 w-5" />} label="Převodovka" value={vehicle.transmission} />
            </section>

            <SectionCard title="Výbava a praktické informace">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  vehicle.transmission,
                  vehicle.fuel,
                  vehicle.category,
                  "Osobní prohlídka po domluvě",
                  "Dostupnost potvrdíme před návštěvou",
                  "Detailní dotazy vyřešíme individuálně",
                ].map((item) => (
                  <p key={item} className="flex items-start gap-3 rounded-xl bg-brand-soft/60 p-3 text-sm font-semibold text-brand-navy">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                    {item}
                  </p>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Technické údaje">
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailRow label="Značka" value={vehicle.brand} />
                <DetailRow label="Model" value={vehicle.model} />
                <DetailRow label="Motorizace / varianta" value={vehicle.variant} />
                <DetailRow label="Kategorie" value={vehicle.category} />
                <DetailRow label="Rok výroby" value={String(vehicle.year)} />
                <DetailRow label="Nájezd" value={formatMileage(vehicle.mileage)} />
                <DetailRow label="Palivo" value={vehicle.fuel} />
                <DetailRow label="Převodovka" value={vehicle.transmission} />
              </div>
            </SectionCard>

            <SectionCard title="Stav vozu">
              <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
                <div className="rounded-xl border border-brand-line bg-white p-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-brand-muted">Aktuální stav</p>
                  <p className="mt-2 text-xl font-bold text-brand-navy">{vehicle.status}</p>
                  <p className="mt-2 text-sm leading-6 text-brand-muted">
                    Stav a dostupnost vozu potvrzujeme před sjednanou prohlídkou.
                  </p>
                </div>
                <div className="rounded-xl border border-brand-line bg-white p-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-brand-muted">Možnost prohlídky</p>
                  <p className="mt-2 text-xl font-bold text-brand-navy">Po domluvě termínu</p>
                  <p className="mt-2 text-sm leading-6 text-brand-muted">
                    Vůz připravíme k osobnímu zhlédnutí a zodpovíme technické dotazy.
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <section className="rounded-2xl border border-brand-line bg-white p-5 shadow-[0_14px_38px_rgba(8,23,52,0.06)]">
              <h2 className="text-xl font-bold tracking-[-0.03em] text-brand-navy">Rychlý kontakt</h2>
              <p className="mt-2 text-sm leading-6 text-brand-muted">
                Vyberte termín prohlídky nebo nám pošlete dotaz k tomuto vozu.
              </p>
              <div className="mt-5 grid gap-3">
                <ContactLine icon={<Phone className="h-4 w-4" />} title="Telefon" value="Bude doplněno" />
                <ContactLine icon={<Mail className="h-4 w-4" />} title="E-mail" value="Bude doplněno" />
                <ContactLine icon={<MapPin className="h-4 w-4" />} title="Adresa" value="Bude doplněno" />
              </div>
              <div className="mt-5 grid gap-2">
                <ButtonLink href="/domluvit-prohlidku" className="h-12 w-full">
                  Domluvit prohlídku
                </ButtonLink>
                <ButtonLink href="/kontakt" variant="secondary" className="h-12 w-full">
                  Napsat dotaz
                </ButtonLink>
              </div>
            </section>

            <section className="rounded-2xl border border-brand-line bg-brand-soft p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-blue shadow-sm">
                  <WalletCards className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-brand-navy">Financování</h2>
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-brand-blue ring-1 ring-brand-line">
                      Připravujeme
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-brand-muted">
                    Možnost financování bude dostupná až po dokončení spolupráce s finančními partnery.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function SpecTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-4 shadow-sm">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-muted">
        <span className="text-brand-blue">{icon}</span>
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-brand-navy">{value}</p>
    </div>
  );
}

function GalleryNote({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-brand-line bg-white p-4 shadow-sm">
      <p className="flex items-center gap-2 font-bold text-brand-navy">
        <span className="text-brand-blue">{icon}</span>
        {title}
      </p>
      <p className="mt-1 text-sm text-brand-muted">{text}</p>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-brand-line bg-white p-5 shadow-[0_14px_38px_rgba(8,23,52,0.06)] sm:p-6">
      <h2 className="text-2xl font-bold tracking-[-0.035em] text-brand-navy">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand-line bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">{label}</p>
      <p className="mt-1 font-bold text-brand-navy">{value}</p>
    </div>
  );
}

function ContactLine({ icon, title, value }: { icon: ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-brand-line bg-white p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-blue">
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">{title}</p>
        <p className="font-bold text-brand-navy">{value}</p>
      </div>
    </div>
  );
}
