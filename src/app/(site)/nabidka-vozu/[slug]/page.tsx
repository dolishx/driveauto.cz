import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
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
      title: "Vůz nebyl nalezen",
    };
  }

  return {
    title: `${vehicle.brand} ${vehicle.model}`,
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
  const basicInfoRows = compactDetailRows([
    { label: "Značka", value: vehicle.brand },
    { label: "Model", value: vehicle.model },
    { label: "Motorizace / varianta", value: vehicle.variant },
    { label: "Kategorie", value: vehicle.category },
    { label: "Karoserie", value: vehicle.bodyType },
    { label: "Barva", value: vehicle.color },
    { label: "Rok výroby", value: vehicle.year ? String(vehicle.year) : undefined },
    { label: "Nájezd", value: vehicle.mileage ? formatMileage(vehicle.mileage) : undefined },
    { label: "Počet dveří", value: formatCount(vehicle.doorsCount) },
    { label: "Počet míst", value: formatCount(vehicle.seatsCount) },
  ]);
  const technicalRows = compactDetailRows([
    { label: "Motor", value: vehicle.engine },
    { label: "Výkon", value: vehicle.powerKw ? `${vehicle.powerKw} kW` : undefined },
    { label: "Palivo", value: vehicle.fuel },
    { label: "Převodovka", value: vehicle.transmission },
    { label: "Pohon", value: vehicle.drivetrain },
    { label: "Emisní norma", value: vehicle.emissionStandard },
  ]);
  const historyRows = compactDetailRows([
    { label: "VIN", value: vehicle.vin },
    { label: "Štítek SPZ", value: vehicle.licensePlate },
    { label: "Země původu", value: vehicle.originCountry },
    { label: "První registrace", value: formatDate(vehicle.firstRegistration) },
    { label: "STK platná do", value: formatDate(vehicle.stkValidUntil) },
    { label: "Počet majitelů", value: formatCount(vehicle.ownersCount) },
    { label: "Servisní historie", value: vehicle.serviceHistory },
    { label: "Historie poškození", value: vehicle.accidentHistory },
  ]);
  const conditionRows = compactDetailRows([
    { label: "Aktuální stav", value: vehicle.status },
    { label: "Stav vozu", value: vehicle.conditionNote },
    { label: "Záruka / poznámka", value: vehicle.warrantyNote },
  ]);
  const equipmentItems = vehicle.equipment ?? [];
  const specTileCandidates: Array<{ icon: ReactNode; label: string; value?: string }> = [
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Rok výroby",
      value: vehicle.year ? String(vehicle.year) : undefined,
    },
    {
      icon: <Gauge className="h-5 w-5" />,
      label: "Nájezd",
      value: vehicle.mileage ? formatMileage(vehicle.mileage) : undefined,
    },
    { icon: <Fuel className="h-5 w-5" />, label: "Palivo", value: vehicle.fuel },
    { icon: <Settings className="h-5 w-5" />, label: "Převodovka", value: vehicle.transmission },
  ];
  const specTiles = specTileCandidates.flatMap((item) => (item.value ? [{ ...item, value: item.value }] : []));

  return (
    <div className="bg-white pb-24 lg:pb-0">
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

              <h1 className="mt-4 text-4xl font-bold text-brand-navy md:text-5xl">
                {vehicleName}
              </h1>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-brand-muted">
                {vehicle.variant}
              </p>
            </div>

            <aside className="rounded-2xl border border-brand-line bg-white p-5 shadow-[0_16px_40px_rgba(13,13,13,0.08)]">
              <p className="text-sm font-semibold uppercase text-brand-muted">Cena vozu</p>
              <p className="mt-2 text-4xl font-bold text-brand-blue">
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
            </section>

            {specTiles.length ? (
              <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {specTiles.map((item) => (
                  <SpecTile key={item.label} icon={item.icon} label={item.label} value={item.value} />
                ))}
              </section>
            ) : null}

            {basicInfoRows.length || vehicle.description ? (
              <SectionCard title="Základní informace">
                <div className="space-y-5">
                  {vehicle.description ? (
                    <p className="rounded-xl border border-brand-line bg-white p-4 text-sm leading-7 text-brand-muted">
                      {vehicle.description}
                    </p>
                  ) : null}
                  <DetailGrid rows={basicInfoRows} />
                </div>
              </SectionCard>
            ) : null}

            {technicalRows.length ? (
              <SectionCard title="Technické údaje">
                <DetailGrid rows={technicalRows} />
              </SectionCard>
            ) : null}

            {historyRows.length ? (
              <SectionCard title="Historie a původ">
                <DetailGrid rows={historyRows} />
              </SectionCard>
            ) : null}

            {equipmentItems.length ? (
              <SectionCard title="Výbava">
                <div className="grid gap-3 sm:grid-cols-2">
                  {equipmentItems.map((item) => (
                    <p
                      key={item}
                      className="flex items-start gap-3 rounded-xl bg-brand-soft/60 p-3 text-sm font-semibold text-brand-navy"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                      {item}
                    </p>
                  ))}
                </div>
              </SectionCard>
            ) : null}

            {conditionRows.length ? (
              <SectionCard title="Stav vozu">
                <DetailGrid rows={conditionRows} />
                <p className="mt-4 rounded-xl border border-brand-line bg-white p-4 text-sm leading-6 text-brand-muted">
                  Stav a dostupnost vozu potvrzujeme před sjednanou prohlídkou.
                </p>
              </SectionCard>
            ) : null}

            <SectionCard title="Prohlídka vozu">
              <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
                <div className="rounded-xl border border-brand-line bg-white p-4">
                  <p className="text-sm font-semibold uppercase text-brand-muted">Osobní prohlídka</p>
                  <p className="mt-2 text-xl font-bold text-brand-navy">Po domluvě termínu</p>
                  <p className="mt-2 text-sm leading-6 text-brand-muted">
                    Vůz připravíme k osobnímu zhlédnutí a zodpovíme technické dotazy.
                  </p>
                </div>
                <div className="rounded-xl border border-brand-line bg-white p-4">
                  <p className="text-sm font-semibold uppercase text-brand-muted">Dotaz k vozu</p>
                  <p className="mt-2 text-xl font-bold text-brand-navy">Individuální domluva</p>
                  <p className="mt-2 text-sm leading-6 text-brand-muted">
                    Před návštěvou potvrdíme dostupnost, aktuální stav a detaily k dokumentaci.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/domluvit-prohlidku" className="h-12">
                  Domluvit prohlídku
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/kontakt" variant="secondary" className="h-12">
                  Zeptat se na vůz
                </ButtonLink>
              </div>
            </SectionCard>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <section className="rounded-2xl border border-brand-line bg-white p-5 shadow-[0_14px_38px_rgba(13,13,13,0.06)]">
              <h2 className="text-xl font-bold text-brand-navy">Rychlý kontakt</h2>
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

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-line bg-white/96 px-4 py-3 shadow-[0_-12px_32px_rgba(13,13,13,0.10)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold uppercase text-brand-muted">Cena vozu</p>
            <p className="truncate text-lg font-extrabold text-brand-blue">{formatPrice(vehicle.price)}</p>
          </div>
          <ButtonLink href="/domluvit-prohlidku" className="h-11 shrink-0 px-4">
            Prohlídka
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function SpecTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-4 shadow-sm">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase text-brand-muted">
        <span className="text-brand-blue">{icon}</span>
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-brand-navy">{value}</p>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-brand-line bg-white p-5 shadow-[0_14px_38px_rgba(13,13,13,0.06)] sm:p-6">
      <h2 className="text-2xl font-bold text-brand-navy">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

type DetailItem = {
  label: string;
  value?: string | null;
};

function DetailGrid({ rows }: { rows: DetailItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <DetailRow key={`${row.label}-${row.value}`} label={row.label} value={row.value ?? ""} />
      ))}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand-line bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase text-brand-muted">{label}</p>
      <p className="mt-1 font-bold text-brand-navy">{value}</p>
    </div>
  );
}

function compactDetailRows(rows: DetailItem[]) {
  return rows
    .map((row) => ({
      ...row,
      value: row.value?.trim(),
    }))
    .filter((row): row is DetailItem & { value: string } => Boolean(row.value));
}

function formatDate(value?: string) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatCount(value?: number) {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : undefined;
}

function ContactLine({ icon, title, value }: { icon: ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-brand-line bg-white p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-blue">
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase text-brand-muted">{title}</p>
        <p className="font-bold text-brand-navy">{value}</p>
      </div>
    </div>
  );
}
