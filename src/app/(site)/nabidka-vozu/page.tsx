import { ArrowRight, ArrowUpDown, Car, Phone, SearchX, ShieldCheck, SlidersHorizontal } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { SearchBar } from "@/components/site/search-bar";
import { VehicleListCard } from "@/components/site/vehicle-list-card";
import { getVehicles } from "@/lib/data";

export default async function VehicleOfferPage() {
  const vehicles = await getVehicles();
  const vehicleCountLabel =
    vehicles.length === 1
      ? "1 vůz"
      : vehicles.length > 1 && vehicles.length < 5
        ? `${vehicles.length} vozy`
        : `${vehicles.length} vozů`;

  return (
    <div className="bg-white">
      <section className="border-b border-brand-line bg-gradient-to-b from-brand-soft/70 to-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase text-brand-blue">
                Nabídka vozů
              </p>
              <h1 className="mt-4 text-4xl font-bold text-brand-navy md:text-5xl">
                Vozy připravené k osobnímu výběru
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-brand-muted">
                Projděte si aktuální nabídku DriveAuto. Detail vozu, dostupnost a termín prohlídky ověříme před vaší návštěvou.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-line bg-white p-5 shadow-[0_14px_38px_rgba(13,13,13,0.06)]">
              <p className="text-sm font-semibold text-brand-muted">Aktuálně v nabídce</p>
              <p className="mt-2 text-4xl font-bold text-brand-blue">
                {vehicleCountLabel}
              </p>
              <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-brand-muted">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                Dostupnost každého vozu potvrzujeme před sjednanou prohlídkou.
              </p>
            </div>
          </div>
          <SearchBar className="mt-8" />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
        <aside className="hidden h-fit rounded-2xl border border-brand-line bg-white p-6 shadow-[0_14px_38px_rgba(13,13,13,0.06)] lg:block">
          <FilterPanel />
        </aside>

        <div className="min-w-0">
          <details className="mb-5 rounded-2xl border border-brand-line bg-white p-4 shadow-sm lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-bold text-brand-navy">
              <span className="flex items-center gap-3">
                <SlidersHorizontal className="h-5 w-5 text-brand-blue" />
                Filtry nabídky
              </span>
              <span className="text-sm font-semibold text-brand-blue">Upravit</span>
            </summary>
            <div className="mt-5 border-t border-brand-line pt-5">
              <FilterPanel />
            </div>
          </details>

          <div className="mb-5 grid gap-4 rounded-2xl border border-brand-line bg-white p-4 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-blue">
                <Car className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-bold text-brand-navy">{vehicleCountLabel} v nabídce</p>
                <p className="text-sm text-brand-muted">
                  Zobrazujeme aktuální vozy se základním řazením pro rychlou orientaci.
                </p>
              </div>
            </div>
            <label className="grid gap-2 text-sm font-semibold text-brand-muted sm:flex sm:items-center sm:justify-end">
              <span className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-brand-blue" />
                Řazení
              </span>
              <select className="h-11 min-w-48 rounded-lg border border-brand-line bg-white px-3 text-brand-navy outline-none transition focus:border-brand-blue">
                <option>Nejnovější v nabídce</option>
                <option>Cena od nejnižší</option>
                <option>Nejnižší nájezd</option>
                <option>Nejnovější rok výroby</option>
              </select>
            </label>
          </div>

          {vehicles.length ? (
            <div className="grid gap-5">
              {vehicles.map((vehicle) => (
                <VehicleListCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-brand-line bg-white p-8 text-center shadow-sm">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand-blue">
                <SearchX className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-2xl font-bold text-brand-navy">
                Nabídka je právě bez vozů k zobrazení
              </h2>
              <p className="mx-auto mt-3 max-w-xl leading-7 text-brand-muted">
                Ozvěte se nám a připravíme pro vás výběr podle značky, rozpočtu a preferovaného termínu prohlídky.
              </p>
              <ButtonLink href="/kontakt" className="mt-6">
                Kontaktovat DriveAuto
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          )}

          <div className="mt-8 overflow-hidden rounded-2xl border border-brand-line bg-brand-soft shadow-[0_14px_38px_rgba(13,13,13,0.06)]">
            <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
              <div className="min-w-0">
                <p className="text-sm font-bold uppercase text-brand-blue">Pomoc s výběrem</p>
                <h2 className="text-2xl font-bold text-brand-navy">
                  Nenašli jste ideální vůz?
                </h2>
                <p className="mt-2 max-w-2xl leading-7 text-brand-muted">
                  Popište nám, co hledáte. Pomůžeme zúžit výběr a domluvit prohlídku vozu, který dává prakticky smysl.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 md:min-w-80 md:grid-cols-1">
                <ButtonLink href="/domluvit-prohlidku" className="h-12 w-full">
                  Domluvit prohlídku
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/kontakt" variant="secondary" className="h-12 w-full">
                  <Phone className="h-4 w-4" />
                  Kontakt
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FilterPanel() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <SlidersHorizontal className="h-5 w-5 text-brand-blue" />
        <h2 className="text-lg font-bold text-brand-navy">Filtry</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-brand-muted">
        Orientační výběr podle typu vozu, značky a techniky.
      </p>
      <div className="mt-6 grid gap-5">
        <FilterGroup title="Kategorie" options={["Všechny vozy", "Osobní vozy", "SUV / 4x4", "Dodávky"]} />
        <FilterGroup title="Značka" options={["Škoda", "BMW", "Volkswagen", "Audi", "Volvo"]} />
        <FilterGroup title="Palivo" options={["Nafta", "Benzin", "Hybrid", "Elektro"]} />
        <FilterGroup title="Převodovka" options={["Automat", "Manuál"]} />
      </div>
      <ButtonLink href="/kontakt" variant="secondary" className="mt-6 w-full">
        Potřebuji poradit
      </ButtonLink>
    </div>
  );
}

function FilterGroup({ title, options }: { title: string; options: string[] }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-bold text-brand-navy">{title}</legend>
      <div className="grid gap-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-3 text-sm text-brand-muted">
            <input type="checkbox" className="h-4 w-4 rounded border-brand-line text-brand-blue" />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
