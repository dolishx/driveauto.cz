import { Calendar, Globe2, Phone, User } from "lucide-react";

import { AppointmentForm } from "@/components/site/appointment-form";
import { MapCard } from "@/components/site/map-card";
import { PageHero } from "@/components/site/page-hero";
import { getVehicles } from "@/lib/data";

const reasons = [
  {
    title: "Vůz připravený jen pro vás",
    text: "Vůz bude nachystaný a čistý při vašem příjezdu.",
    icon: Globe2,
  },
  {
    title: "Osobní přístup",
    text: "Náš specialista se vám bude věnovat naplno.",
    icon: User,
  },
  {
    title: "Flexibilní termíny",
    text: "Prohlídku si domluvíte kdy vám to vyhovuje.",
    icon: Calendar,
  },
];

export default async function AppointmentPage() {
  const vehicles = await getVehicles();

  return (
    <div className="bg-white">
      <PageHero
        label="Domluvit prohlídku"
        title="Osobní prohlídka na míru vám"
        description="Vyberte si termín, který vám vyhovuje, a my vám připravíme vůz k osobní prohlídce."
        image="/images/appointment-hero.jpg"
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-[0_14px_38px_rgba(8,23,52,0.06)] md:p-8">
          <AppointmentForm vehicles={vehicles} />
        </div>

        <div className="grid content-start gap-6">
          <section className="rounded-2xl border border-brand-line bg-white p-6 shadow-[0_14px_38px_rgba(8,23,52,0.06)]">
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-brand-navy">
              Proč si domluvit prohlídku?
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {reasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <div key={reason.title}>
                    <Icon className="h-10 w-10 text-brand-blue" />
                    <h3 className="mt-4 font-bold text-brand-navy">{reason.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-brand-muted">{reason.text}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <MapCard />

          <section className="rounded-2xl border border-brand-line bg-white p-6 shadow-[0_14px_38px_rgba(8,23,52,0.06)] md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-brand-navy">Potřebujete poradit?</h2>
              <p className="mt-2 text-brand-muted">
                Kontaktní údaje budou doplněny po potvrzení finálních údajů provozovatele.
              </p>
            </div>
            <div className="mt-5 inline-flex h-12 items-center gap-2 rounded-lg border border-brand-line bg-brand-soft px-5 text-sm font-bold text-brand-blue md:mt-0">
              <Phone className="h-4 w-4" />
              Bude doplněno
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
