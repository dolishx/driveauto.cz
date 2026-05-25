import { Headphones, ShieldCheck, Wallet } from "lucide-react";

const benefits = [
  {
    title: "Prověřený původ",
    description: "Každý vůz důkladně prověřujeme po technické i právní stránce.",
    icon: ShieldCheck,
  },
  {
    title: "Financování připravujeme",
    description:
      "Možnost financování bude dostupná až po dokončení spolupráce s finančními partnery.",
    icon: Wallet,
  },
  {
    title: "Záruka kvality",
    description: "Možnost prodloužené záruky a garance na původ vozu.",
    icon: ShieldCheck,
  },
  {
    title: "Rychlý kontakt",
    description: "Jsme tu pro vás každý pracovní den od 8:00 do 18:00.",
    icon: Headphones,
  },
];

export function TrustBenefits() {
  return (
    <section id="vyhody" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid rounded-2xl border border-brand-line bg-white shadow-[0_18px_45px_rgba(8,23,52,0.07)] md:grid-cols-4">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <div
              key={benefit.title}
              className="flex gap-4 p-6 text-left md:block md:border-l md:border-brand-line md:text-center first:md:border-l-0"
            >
              <Icon className="h-11 w-11 shrink-0 text-brand-blue md:mx-auto md:h-14 md:w-14" />
              <h3 className="mt-0 text-lg font-bold text-brand-navy md:mt-6">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-brand-muted">
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
