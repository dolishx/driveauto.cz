import {
  AlertTriangle,
  Car,
  CheckCircle2,
  ClipboardList,
  Database,
  Folder,
  MessageSquare,
  PlusCircle,
  Tag,
} from "lucide-react";
import Image from "next/image";

import { AddVehicleForm } from "@/components/admin/add-vehicle-form";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LeadManagement } from "@/components/admin/lead-management";
import { ButtonLink } from "@/components/ui/button";
import { getAdminVehicles, getAppointmentRequests, getInquiries } from "@/lib/data";
import { formatMileage, formatPrice } from "@/lib/format";
import type { Vehicle } from "@/types";

const managementCards = [
  {
    title: "Všechny vozy",
    text: "Přehled nabídky s cenou, stavem a základními parametry.",
    icon: Car,
    href: "#vsechny-vozy",
  },
  {
    title: "Přidat vůz",
    text: "MVP formulář připravený pro Supabase insert.",
    icon: PlusCircle,
    href: "#pridat-vuz",
  },
  {
    title: "Kategorie",
    text: "Struktura kategorií bude ukládaná po doplnění administrační části.",
    icon: Folder,
    href: "#struktura",
  },
  {
    title: "Značky",
    text: "Správa značek je zatím připravená jako obsahová struktura.",
    icon: Tag,
    href: "#struktura",
  },
  {
    title: "Modely",
    text: "Modelové řady budou navázané na značky v další fázi.",
    icon: ClipboardList,
    href: "#struktura",
  },
];

export default async function AdminPage() {
  const [vehicles, inquiries, appointmentRequests] = await Promise.all([
    getAdminVehicles(),
    getInquiries(),
    getAppointmentRequests(),
  ]);
  const activeVehicles = vehicles.filter((vehicle) => vehicle.status === "Dostupné" || vehicle.status === "Rezervováno");
  const soldVehicles = vehicles.filter((vehicle) => vehicle.status === "Prodáno");
  const newLeadCount =
    inquiries.filter((inquiry) => inquiry.status === "new").length +
    appointmentRequests.filter((request) => request.status === "new").length;

  const stats = [
    { label: "Celkem vozů", value: vehicles.length, helper: "Vozidla načtená pro administraci", icon: Car },
    { label: "Aktivní vozy", value: activeVehicles.length, helper: "Dostupné a rezervované vozy", icon: CheckCircle2 },
    { label: "Prodané vozy", value: soldVehicles.length, helper: "Vozy označené jako prodané", icon: Tag },
    { label: "Nové poptávky", value: newLeadCount, helper: "Nové kontakty a žádosti o prohlídku", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-brand-navy">
      <div className="flex">
        <AdminSidebar />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-brand-blue lg:hidden">
                  DriveAuto Admin
                </p>
                <h1 className="mt-1 text-3xl font-bold tracking-[-0.04em] md:text-4xl">Administrace vozů</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-brand-muted">
                  Jednoduchý MVP přehled pro přípravu skladových vozů, poptávek a budoucí správy kategorií.
                </p>
              </div>
              <ButtonLink href="/nabidka-vozu" variant="secondary" className="h-11">
                Zobrazit veřejnou nabídku
              </ButtonLink>
            </header>

            <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 shadow-sm">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <strong>MVP administrace</strong> — přístup a ukládání budou zabezpečeny v další fázi.
                  <span className="mt-1 block">
                    Data mohou pocházet ze Supabase nebo z lokálního fallbacku, pokud tabulky vrací prázdný výsledek.
                  </span>
                </div>
              </div>
            </section>

            <nav className="mt-5 flex gap-2 overflow-x-auto pb-2 text-sm font-semibold" aria-label="Sekce administrace">
              {["Přehled", "Všechny vozy", "Přidat vůz", "Struktura", "Poptávky"].map((item) => (
                <a
                  key={item}
                  href={`#${sectionId(item)}`}
                  className="shrink-0 rounded-full border border-brand-line bg-white px-4 py-2 text-brand-navy shadow-sm hover:border-brand-blue/35 hover:bg-brand-soft"
                >
                  {item}
                </a>
              ))}
            </nav>

            <section id="prehled" className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <article key={stat.label} className="rounded-2xl border border-brand-line bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-blue">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-brand-muted">{stat.label}</p>
                        <p className="mt-1 text-3xl font-bold tracking-[-0.04em] text-brand-navy">{stat.value}</p>
                        <p className="mt-2 text-sm leading-6 text-brand-muted">{stat.helper}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="mt-7">
              <LatestVehiclesTable vehicles={vehicles.slice(0, 5)} />
            </section>

            <LeadManagement inquiries={inquiries} appointmentRequests={appointmentRequests} />

            <section id="vsechny-vozy" className="mt-7 rounded-2xl border border-brand-line bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-brand-blue">Všechny vozy</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em]">Skladová nabídka</h2>
                  <p className="mt-2 text-sm text-brand-muted">
                    Administrativní přehled pro kontrolu stavu vozů. Úpravy stavů budou doplněny po zabezpečení administrace.
                  </p>
                </div>
                <a href="#pridat-vuz" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-blue px-4 text-sm font-semibold text-white shadow-[0_14px_26px_rgba(7,95,232,0.22)] hover:bg-brand-blue-dark">
                  <PlusCircle className="h-4 w-4" />
                  Přidat vůz
                </a>
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-brand-muted">
                    <tr className="border-b border-brand-line">
                      <th className="py-3 font-bold">Vůz</th>
                      <th className="py-3 font-bold">Parametry</th>
                      <th className="py-3 font-bold">Cena</th>
                      <th className="py-3 font-bold">Stav</th>
                      <th className="py-3 font-bold">Zdroj</th>
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
                        <td className="py-4 text-brand-muted">MVP data</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="pridat-vuz" className="mt-7">
              <AddVehicleForm />
            </section>

            <section id="struktura" className="mt-7 rounded-2xl border border-brand-line bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-blue">
                  <Database className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-brand-blue">Kategorie / značky / modely</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em]">Struktura pro budoucí správu katalogu</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-muted">
                    Tyto sekce zatím nespravují samostatné tabulky. Slouží jako připravené místo pro budoucí číselníky, které sjednotí filtrování a zadávání vozů.
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {managementCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <a
                      key={card.title}
                      href={card.href}
                      className="rounded-xl border border-brand-line p-4 transition hover:border-brand-blue/35 hover:bg-brand-soft"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand-blue">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="mt-4 block font-bold">{card.title}</span>
                      <span className="mt-2 block text-sm leading-6 text-brand-muted">{card.text}</span>
                    </a>
                  );
                })}
              </div>
            </section>

            <footer className="mt-8 flex flex-col gap-2 text-sm text-brand-muted sm:flex-row sm:items-center sm:justify-between">
              <p>DriveAuto Admin Panel</p>
              <p>MVP režim bez autentizace. Verze 1.1.0</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

function LatestVehiclesTable({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <section className="min-w-0 rounded-2xl border border-brand-line bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Nejnovější vozy</h2>
          <p className="mt-1 text-sm text-brand-muted">Poslední položky načtené pro administraci.</p>
        </div>
        <a href="#vsechny-vozy" className="text-sm font-bold text-brand-blue hover:text-brand-blue-dark">
          Všechny vozy
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-brand-muted">
            <tr className="border-b border-brand-line">
              <th className="py-3 font-bold">Vůz</th>
              <th className="py-3 font-bold">Cena</th>
              <th className="py-3 font-bold">Stav</th>
              <th className="py-3 font-bold">Vytvořeno</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b border-brand-line last:border-b-0">
                <td className="py-4">
                  <VehicleIdentity vehicle={vehicle} />
                </td>
                <td className="py-4 font-semibold">{formatPrice(vehicle.price)}</td>
                <td className="py-4">
                  <StatusBadge status={vehicle.status} />
                </td>
                <td className="py-4 text-brand-muted">{vehicle.createdAt || "Lokální fallback"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function VehicleIdentity({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-soft">
        <Image src={vehicle.image} alt="" fill className="object-cover" sizes="80px" />
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
      : status === "Rezervováno"
        ? "bg-amber-50 text-amber-800"
        : "bg-emerald-50 text-emerald-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {status}
    </span>
  );
}

function sectionId(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
