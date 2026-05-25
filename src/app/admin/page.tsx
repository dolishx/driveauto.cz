import { Calendar, Car, Eye, MessageSquare, MoreVertical, PlusCircle, Tag } from "lucide-react";
import Image from "next/image";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ButtonLink } from "@/components/ui/button";
import { getInquiries, getVehicles } from "@/lib/data";
import { formatMileage, formatPrice } from "@/lib/format";

const stats = [
  { label: "Celkem vozů", value: "128", change: "12 tento týden", icon: Car },
  { label: "Zobrazení webu", value: "24 532", change: "18,7% oproti min. týdnu", icon: Eye },
  { label: "Poptávky", value: "37", change: "15,6% oproti min. týdnu", icon: MessageSquare },
  { label: "Prodané vozy", value: "9", change: "2 oproti min. týdnu", icon: Tag },
];

const quickActions = [
  { title: "Přidat nový vůz", text: "Příprava formuláře pro budoucí správu nabídky.", icon: Car },
  { title: "Kategorie", text: "Příprava správy kategorií vozů.", icon: PlusCircle },
  { title: "Značky", text: "Příprava správy značek vozů.", icon: Tag },
  { title: "Modely", text: "Příprava správy modelů vozů.", icon: PlusCircle },
  { title: "Stránky", text: "Příprava editace obsahu stránek.", icon: MessageSquare },
];

export default async function AdminPage() {
  const vehicles = await getVehicles();
  const inquiries = await getInquiries();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-brand-navy">
      <div className="flex">
        <AdminSidebar />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-brand-blue lg:hidden">
                  AutoDrive Admin
                </p>
                <h1 className="text-3xl font-bold tracking-[-0.04em]">Přehled</h1>
              </div>
              <button className="inline-flex h-12 items-center gap-3 rounded-lg border border-brand-line bg-white px-4 text-sm font-semibold shadow-sm">
                <Calendar className="h-4 w-4" />
                Ukázkové období
              </button>
            </header>

            <div className="mt-5 rounded-2xl border border-brand-line bg-white p-4 text-sm leading-6 text-brand-muted shadow-sm">
              <strong className="text-brand-navy">MVP administrace</strong> — data jsou zatím lokální a slouží pro přípravu struktury webu.
            </div>

            <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <article key={stat.label} className="rounded-2xl border border-brand-line bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-5">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand-blue">
                        <Icon className="h-7 w-7" />
                      </span>
                      <div>
                        <p className="font-semibold text-brand-muted">{stat.label}</p>
                        <p className="mt-1 text-3xl font-bold text-brand-navy">{stat.value}</p>
                        <p className="mt-3 text-sm font-semibold text-emerald-600">↗ {stat.change}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
              <div className="min-w-0 rounded-2xl border border-brand-line bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Nejnovější vozy</h2>
                    <p className="mt-1 text-sm text-brand-muted">Ukázková lokální data pro přípravu administrace.</p>
                  </div>
                  <ButtonLink href="/nabidka-vozu" variant="secondary" className="h-10">
                    Zobrazit všechny
                  </ButtonLink>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-brand-muted">
                      <tr className="border-b border-brand-line">
                        <th className="py-3 font-bold">Vůz</th>
                        <th className="py-3 font-bold">Cena</th>
                        <th className="py-3 font-bold">Stav</th>
                        <th className="py-3 font-bold">Vytvořeno</th>
                        <th className="py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.slice(0, 5).map((vehicle) => (
                        <tr key={vehicle.id} className="border-b border-brand-line last:border-b-0">
                          <td className="py-4">
                            <div className="flex items-center gap-4">
                              <div className="relative h-14 w-20 overflow-hidden rounded-lg bg-brand-soft">
                                <Image src={vehicle.image} alt="" fill className="object-cover" sizes="80px" />
                              </div>
                              <div>
                                <p className="font-bold text-brand-navy">{vehicle.brand} {vehicle.model}</p>
                                <p className="text-brand-muted">{vehicle.year} · {formatMileage(vehicle.mileage)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 font-semibold">{formatPrice(vehicle.price)}</td>
                          <td className="py-4">
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                              {vehicle.status === "Dostupné" ? "Publikováno" : vehicle.status}
                            </span>
                          </td>
                          <td className="py-4 text-brand-muted">Lokální data</td>
                          <td className="py-4 text-right">
                            <MoreVertical className="ml-auto h-4 w-4 text-brand-muted" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="min-w-0 rounded-2xl border border-brand-line bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Poptávky</h2>
                    <p className="mt-1 text-sm text-brand-muted">Ukázková lokální data, bez napojení na backend.</p>
                  </div>
                  <button className="h-10 rounded-lg border border-brand-line px-4 text-sm font-semibold">
                    Zobrazit všechny
                  </button>
                </div>
                <div className="grid gap-1">
                  {inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="flex items-center justify-between gap-4 border-b border-brand-line py-4 last:border-b-0">
                      <div>
                        <p className="font-bold">{inquiry.customerName}</p>
                        <p className="text-sm text-brand-muted">{inquiry.vehicleName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-brand-muted">{inquiry.date}</p>
                        <span className="mt-2 inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-blue">
                          {inquiry.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-7 rounded-2xl border border-brand-line bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Rychlé akce</h2>
              <p className="mt-2 text-sm text-brand-muted">
                Ukládání bude doplněno po připojení databáze.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button key={action.title} className="flex items-center justify-between gap-3 rounded-xl border border-brand-line p-4 text-left hover:border-brand-blue/35 hover:bg-brand-soft">
                      <span className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand-blue">
                          <Icon className="h-6 w-6" />
                        </span>
                        <span>
                          <span className="block font-bold">{action.title}</span>
                          <span className="mt-1 block text-sm text-brand-muted">{action.text}</span>
                        </span>
                      </span>
                      <span className="text-xl text-brand-muted">→</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <footer className="mt-8 flex flex-col gap-2 text-sm text-brand-muted sm:flex-row sm:items-center sm:justify-between">
              <p>AutoDrive Admin Panel</p>
              <p>© 2024 AutoDrive. Verze 1.0.0</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
