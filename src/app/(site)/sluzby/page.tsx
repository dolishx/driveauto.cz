import { ArrowRight, BadgeCheck, Car, Globe2, ShieldCheck, Wallet, Wrench } from "lucide-react";
import Link from "next/link";

import { ConsultationCta } from "@/components/site/consultation-cta";
import { PageHero } from "@/components/site/page-hero";
import { getServices } from "@/lib/data";

const serviceIcons = {
  financovani: Wallet,
  vykup: Car,
  pojisteni: ShieldCheck,
  servis: Wrench,
  dovoz: Globe2,
  garance: BadgeCheck,
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="bg-white">
      <PageHero
        label="Služby"
        title="Služby, které vám usnadní cestu k novému vozu"
        description="Komplexní služby na jednom místě. Postaráme se o vše, aby byl váš zážitek z nákupu co nejpříjemnější."
        image="/images/showroom-hero.jpg"
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = serviceIcons[service.id as keyof typeof serviceIcons] ?? BadgeCheck;
            return (
              <article
                key={service.id}
                id={service.id}
                className="rounded-2xl border border-brand-line bg-white p-7 shadow-[0_14px_38px_rgba(13,13,13,0.06)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <Icon className="h-12 w-12 text-brand-blue" />
                  {service.badge ? (
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-blue ring-1 ring-brand-blue/15">
                      {service.badge}
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-5 text-xl font-bold text-brand-navy">{service.title}</h2>
                <p className="mt-3 max-w-sm leading-7 text-brand-muted">{service.description}</p>
                <Link href="/kontakt" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:text-brand-blue-dark">
                  Zjistit více <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <div className="pb-14">
        <ConsultationCta
          title="Nevíte si rady s výběrem služby?"
          subtitle="Rádi vám poradíme a najdeme nejlepší řešení právě pro vás."
          buttonLabel="Kontaktujte nás"
        />
      </div>
    </div>
  );
}
