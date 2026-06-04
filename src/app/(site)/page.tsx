import {
  ArrowRight,
  Car,
  ClipboardCheck,
  FileText,
  Handshake,
  Phone,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { ConsultationCta } from "@/components/site/consultation-cta";
import { SearchBar } from "@/components/site/search-bar";
import { TrustBenefits } from "@/components/site/trust-benefits";
import { VehicleCard } from "@/components/site/vehicle-card";
import { getFeaturedVehicles } from "@/lib/data";

const heroProofs = [
  "Prodej ověřených vozů",
  "Výkup a komisní prodej",
  "Dovoz podle požadavků",
  "Přihlášení / STK",
];

const customerSituations = [
  {
    title: "Chci koupit vůz",
    description:
      "Vyberete si z aktuální nabídky a domluvíme prohlídku i další postup kolem vozu.",
    meta: "Nabídka • prohlídka • předání",
    href: "/nabidka-vozu",
    icon: Car,
  },
  {
    title: "Chci prodat vůz",
    description:
      "Pomůžeme s naceněním, výkupem nebo komisním prodejem bez zbytečného tlaku.",
    meta: "Výkup • komisní prodej",
    href: "/kontakt?typ=prodej",
    icon: Handshake,
  },
  {
    title: "Chci dovézt vůz",
    description:
      "Probereme požadavky a navrhneme přehledný postup pro výběr a dovoz auta.",
    meta: "Výběr • kontrola • dovoz",
    href: "/kontakt?typ=dovoz",
    icon: ClipboardCheck,
  },
  {
    title: "Potřebuji přihlášení nebo STK",
    description:
      "Pomůžeme s dokumenty, přípravou vozu a kroky kolem přihlášení nebo technické kontroly.",
    meta: "Dokumenty • přihlášení • STK",
    href: "/kontakt?typ=sluzby",
    icon: FileText,
  },
];

const processSteps = [
  {
    title: "Ozvete se nám",
    description: "Krátce probereme, jestli řešíte koupi, prodej, dovoz nebo dokumenty.",
  },
  {
    title: "Zjistíme vaši situaci",
    description: "Upřesníme požadavky, termín a informace, které jsou pro další postup důležité.",
  },
  {
    title: "Navrhneme řešení",
    description: "Doporučíme konkrétní další krok a vysvětlíme, co je potřeba připravit.",
  },
  {
    title: "Připravíme vůz nebo dokumenty",
    description: "Zajistíme prověření, prohlídku, výkup, dovoz nebo administrativu podle situace.",
  },
  {
    title: "Předáme hotový výsledek",
    description: "Dostanete připravené auto, férovou nabídku nebo vyřešené kroky kolem vozu.",
  },
];

export default async function HomePage() {
  const featuredVehicles = await getFeaturedVehicles();

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden border-b border-brand-line bg-[radial-gradient(circle_at_80%_20%,rgba(30,64,175,0.10),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f7faff_100%)]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.44fr_0.56fr] lg:px-8 lg:py-12">
          <div className="relative z-10 max-w-[620px]">
            <p className="inline-flex rounded-md bg-brand-soft px-3 py-2 text-xs font-bold uppercase text-brand-blue">
              DriveAuto — autoprodejna ověřených vozů
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.02] text-brand-navy sm:text-5xl lg:text-[64px]">
              Prověřené vozy. <span className="text-brand-blue">Jistý výběr.</span>
            </h1>
            <p className="mt-5 max-w-[560px] text-lg leading-8 text-brand-muted">
              Pomůžeme vám vybrat prověřený vůz a domluvit další postup bez zbytečných starostí.
              Když řešíte prodej, výkup, dovoz nebo administrativu, navedeme vás na správný krok.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/nabidka-vozu">
                <Search className="h-4 w-4" />
                Prohlédnout nabídku
              </ButtonLink>
              <ButtonLink href="/kontakt?typ=prodej" variant="secondary">
                <Handshake className="h-4 w-4" />
                Prodat vůz
              </ButtonLink>
              <ButtonLink href="/kontakt" variant="ghost">
                <Phone className="h-4 w-4" />
                Kontakt
              </ButtonLink>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {heroProofs.map((item) => (
                <span
                  key={item}
                  className="rounded-xl border border-brand-line bg-white/80 px-3 py-3 text-xs font-bold leading-5 text-brand-navy shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative h-80 overflow-hidden rounded-3xl bg-brand-soft shadow-[0_24px_60px_rgba(13,13,13,0.14)] lg:h-[430px]">
            <Image
              src="/images/home-hero.jpg"
              alt="Prémiové vozy BMW v nabídce DriveAuto"
              fill
              priority
              fetchPriority="high"
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 62vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/55 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/25 bg-white/90 p-4 shadow-[0_18px_40px_rgba(13,13,13,0.16)] backdrop-blur">
              <p className="text-sm font-bold text-brand-navy">DriveAuto prodejna</p>
              <p className="mt-1 text-sm leading-6 text-brand-muted">
                Přijďte se podívat na vůz. Ověříme dostupnost a připravíme další postup podle vaší situace.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SearchBar compact showCategories={false} />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-brand-navy">
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

      <section id="sluzby" className="border-y border-brand-line bg-brand-soft/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
          <div>
            <p className="text-sm font-bold uppercase text-brand-blue">
              Služby podle situace
            </p>
            <h2 className="mt-4 max-w-xl text-4xl font-bold text-brand-navy md:text-5xl">
              Jakou situaci řešíte?
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-brand-muted">
              DriveAuto není jen katalog aut. Pomůžeme s nákupem, prodejem, dovozem
              i navazujícími kroky kolem dokumentů a STK.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {["Komisní prodej", "Prodej", "Výkup", "Dovoz", "Přihlášení", "STK"].map((item) => (
                <span key={item} className="rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-semibold text-brand-navy">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {customerSituations.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-brand-line bg-white p-6 shadow-[0_14px_34px_rgba(13,13,13,0.06)] transition hover:-translate-y-1 hover:border-brand-blue/30 hover:shadow-[0_18px_45px_rgba(13,13,13,0.10)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand-blue group-hover:bg-brand-blue group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="mt-5 text-xs font-bold uppercase text-brand-blue">
                    {item.meta}
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-brand-navy">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-brand-muted">
                    {item.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-blue">
                    Vyřešit situaci <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <div className="pb-10">
        <TrustBenefits />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-bold uppercase text-brand-blue">
            Jak pracujeme
          </p>
          <h2 className="mt-4 text-4xl font-bold text-brand-navy md:text-5xl">
            Praktický postup bez složitého rozhodování
          </h2>
          <p className="mt-5 text-lg leading-8 text-brand-muted">
            Nejdřív pochopíme vaši situaci, potom navrhneme konkrétní řešení.
            Proces se přizpůsobí tomu, jestli kupujete, prodáváte nebo řešíte dovoz a dokumenty.
          </p>
        </div>
        <div className="relative grid gap-4 lg:grid-cols-5">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-brand-line lg:block" />
          {processSteps.map((step, index) => (
            <article key={step.title} className="relative rounded-2xl border border-brand-line bg-white p-5 shadow-[0_12px_30px_rgba(13,13,13,0.05)]">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white shadow-[0_12px_24px_rgba(30,64,175,0.22)]">
                {index + 1}
              </span>
              <h3 className="mt-5 text-lg font-bold text-brand-navy">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-brand-muted">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="pb-16">
        <ConsultationCta
          title="Připravíme další krok kolem vašeho auta."
          subtitle="Ať chcete koupit, prodat, dovézt nebo řešíte dokumenty, napište nám. Domluvíme konkrétní postup bez zbytečných slibů."
          buttonLabel="Kontaktovat DriveAuto"
        />
      </div>
    </div>
  );
}
