import {
  ArrowRight,
  BadgeCheck,
  Car,
  ClipboardCheck,
  Handshake,
  Headphones,
  Phone,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";

const miniBenefits = [
  { title: "Ověřené vozy", text: "Prověřené původy a technický stav.", icon: ShieldCheck },
  {
    title: "Financování připravujeme",
    text: "Dostupné až po dokončení spolupráce s finančními partnery.",
    icon: Wallet,
  },
  { title: "Záruka kvality", text: "Možnost prodloužené záruky až na 36 měsíců.", icon: BadgeCheck },
  { title: "Rychlý kontakt", text: "Pošlete dotaz a navážeme na konkrétní situaci.", icon: Headphones },
];

const ctaActions = [
  { href: "/nabidka-vozu", label: "Prohlédnout vozy", icon: Car },
  { href: "/kontakt?typ=prodej", label: "Prodat vůz", icon: Handshake },
  { href: "/kontakt?typ=dovoz", label: "Dovoz vozu", icon: ClipboardCheck },
];

export function ConsultationCta({
  title = "Nevíte si rady s výběrem?",
  subtitle = "Pomůžeme vám najít ideální vůz podle vašich představ, rozpočtu i potřeb.",
  buttonLabel = "Nezávazná konzultace",
  buttonHref = "/kontakt",
}: {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonHref?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-brand-line bg-brand-soft p-6 shadow-[0_14px_36px_rgba(8,23,52,0.06)] md:p-10">
        <div className="absolute right-0 top-0 hidden h-full w-1/2 opacity-45 lg:block">
          <Image
            src="/images/showroom-hero.jpg"
            alt=""
            fill
            loading="eager"
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-soft via-brand-soft/65 to-transparent" />
        </div>

        <div className="relative grid gap-8 lg:grid-cols-[1fr_440px]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-brand-blue">
              Nezávazná konzultace
            </p>
            <h2 className="mt-5 max-w-xl text-4xl font-bold tracking-[-0.055em] text-brand-navy md:text-5xl">
              {title}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-brand-muted">
              {subtitle}
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-5 rounded-2xl border border-brand-line bg-white p-6 shadow-[0_12px_30px_rgba(8,23,52,0.07)]">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand-blue">
                <Phone className="h-8 w-8 fill-brand-blue" />
              </span>
              <span>
                <span className="block text-brand-muted">Kontakt DriveAuto</span>
                <span className="block text-2xl font-bold text-brand-navy">Formulář a prohlídka</span>
                <span className="block text-sm text-brand-muted">
                  Telefon zveřejníme po potvrzení finálních kontaktních údajů.
                </span>
              </span>
            </div>
            <ButtonLink href={buttonHref} className="h-16 justify-between px-7 text-base">
              <span className="inline-flex items-center gap-3">
                <Headphones className="h-5 w-5" />
                {buttonLabel}
              </span>
              <ArrowRight className="h-5 w-5" />
            </ButtonLink>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {ctaActions.map((action) => {
                const Icon = action.icon;
                return (
                  <ButtonLink
                    key={action.href}
                    href={action.href}
                    variant="secondary"
                    className="h-12 justify-start px-4"
                  >
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </ButtonLink>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative mt-9 grid gap-4 border-t border-brand-line pt-8 md:grid-cols-4">
          {miniBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="flex gap-3">
                <Icon className="h-8 w-8 shrink-0 text-brand-blue" />
                <div>
                  <h3 className="font-bold text-brand-navy">{benefit.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-brand-muted">{benefit.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
