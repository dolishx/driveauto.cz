import { ArrowRight, Calendar, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { ConsultationCta } from "@/components/site/consultation-cta";
import { SearchBar } from "@/components/site/search-bar";
import { TrustBenefits } from "@/components/site/trust-benefits";
import { VehicleCard } from "@/components/site/vehicle-card";
import { getFeaturedVehicles } from "@/lib/data";

export default async function HomePage() {
  const featuredVehicles = await getFeaturedVehicles();

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden border-b border-brand-line bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[0.38fr_0.62fr] lg:items-start lg:px-8 lg:py-3">
          <div className="relative z-10 max-w-[520px]">
            <p className="inline-flex rounded-md bg-brand-soft px-3 py-2 text-xs font-bold uppercase tracking-wide text-brand-blue">
              Autoprodejna AutoDrive
            </p>
            <h1 className="mt-4 text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-brand-navy lg:text-[56px]">
              Prověřené vozy. <span className="text-brand-blue">Jistý výběr.</span>
            </h1>
            <p className="mt-5 max-w-[500px] text-base leading-7 text-brand-muted">
              Nabízíme kvalitní prověřené vozy od autorizovaných partnerů.
              Poctivý přístup, férové ceny a servis, na který se můžete spolehnout.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/nabidka-vozu">
                <Search className="h-4 w-4" />
                Vyhledat vůz
              </ButtonLink>
              <ButtonLink href="/domluvit-prohlidku" variant="secondary">
                <Calendar className="h-4 w-4" />
                Domluvit prohlídku
              </ButtonLink>
            </div>
          </div>

          <div className="relative h-72 overflow-hidden rounded-2xl lg:h-[286px] lg:rounded-none">
            <Image
              src="/images/home-hero.jpg"
              alt="Prémiové vozy BMW v nabídce AutoDrive"
              fill
              priority
              fetchPriority="high"
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 62vw"
            />
            <div className="absolute inset-y-0 left-0 hidden w-[8%] bg-gradient-to-r from-white to-transparent lg:block" />
          </div>
        </div>
      </section>

      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SearchBar compact showCategories={false} />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-[-0.03em] text-brand-navy">
            Doporučené vozy
          </h2>
          <Link href="/nabidka-vozu" className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:text-brand-blue-dark">
            Zobrazit všechny vozy <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      <div className="pb-10">
        <TrustBenefits />
      </div>

      <div className="pb-16">
        <ConsultationCta />
      </div>
    </div>
  );
}
