import { ArrowRight, Car, SlidersHorizontal } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { SearchBar } from "@/components/site/search-bar";
import { VehicleListCard } from "@/components/site/vehicle-list-card";
import { getVehicles } from "@/lib/data";

export default async function VehicleOfferPage() {
  const vehicles = await getVehicles();

  return (
    <div className="bg-white">
      <section className="border-b border-brand-line bg-brand-soft/55">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-brand-blue">
              Nabídka vozů
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.05em] text-brand-navy md:text-5xl">
              Vyberte si prověřený vůz připravený k prohlídce
            </h1>
            <p className="mt-5 text-lg leading-8 text-brand-muted">
              Aktuální nabídka vozů AutoDrive s jasným původem, férovou cenou a možností osobní prohlídky.
            </p>
          </div>
          <SearchBar className="mt-8" />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
        <aside className="h-fit rounded-2xl border border-brand-line bg-white p-6 shadow-[0_14px_38px_rgba(8,23,52,0.06)]">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-brand-blue" />
            <h2 className="text-lg font-bold text-brand-navy">Filtry</h2>
          </div>
          <div className="mt-6 grid gap-5">
            <FilterGroup title="Kategorie" options={["Všechny vozy", "Osobní vozy", "SUV / 4x4", "Dodávky"]} />
            <FilterGroup title="Značka" options={["Škoda", "BMW", "Volkswagen", "Audi", "Volvo"]} />
            <FilterGroup title="Palivo" options={["Nafta", "Benzin", "Hybrid", "Elektro"]} />
            <FilterGroup title="Převodovka" options={["Automat", "Manuál"]} />
          </div>
          <ButtonLink href="/kontakt" variant="secondary" className="mt-6 w-full">
            Potřebuji poradit
          </ButtonLink>
        </aside>

        <div>
          <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-brand-line bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand-blue">
                <Car className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-brand-navy">{vehicles.length} vozů v nabídce</p>
                <p className="text-sm text-brand-muted">Seřazeno podle nejnovějších vozů.</p>
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm font-semibold text-brand-muted">
              Řazení
              <select className="h-11 rounded-lg border border-brand-line bg-white px-3 text-brand-navy outline-none">
                <option>Nejnovější</option>
                <option>Nejnižší cena</option>
                <option>Nejnižší nájezd</option>
                <option>Nejnovější rok</option>
              </select>
            </label>
          </div>

          <div className="grid gap-5">
            {vehicles.map((vehicle) => (
              <VehicleListCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-brand-soft p-6 md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-brand-navy">
                Nenašli jste ideální vůz?
              </h2>
              <p className="mt-2 text-brand-muted">
                Řekněte nám představu a pohlídáme vhodnou nabídku za vás.
              </p>
            </div>
            <ButtonLink href="/kontakt" className="mt-5 md:mt-0">
              Kontaktovat AutoDrive <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>
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
