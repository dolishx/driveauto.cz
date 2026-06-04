import { Calendar, MapPin, Phone } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { ContactForm } from "@/components/site/contact-form";
import { MapCard } from "@/components/site/map-card";
import { PageHero } from "@/components/site/page-hero";

const contactNotice = "Kontaktní údaje budou doplněny po potvrzení finálních údajů provozovatele.";

const contactCards = [
  {
    title: "Kontakt",
    icon: Phone,
    body: ["Telefon: Bude doplněno", "E-mail: Bude doplněno", contactNotice],
    action: null,
  },
  {
    title: "Prodej vozů",
    icon: Phone,
    body: ["Telefon: Bude doplněno", "E-mail: Bude doplněno", "Rádi pomůžeme s výběrem vozu po doplnění finálních kontaktů."],
    action: null,
  },
  {
    title: "Domluvit prohlídku",
    icon: Calendar,
    body: ["Termín si můžete připravit přes formulář.", "Odesílání bude aktivní po připojení databáze a e-mailových notifikací."],
    action: "Domluvit prohlídku",
  },
  {
    title: "Kde nás najdete",
    icon: MapPin,
    body: ["Adresa: Bude doplněno", "Mapa bude doplněna po potvrzení adresy."],
    action: null,
  },
];

export default function ContactPage() {
  return (
    <div className="bg-white">
      <PageHero
        label="Kontakt"
        title="Jsme tu pro vás"
        description="Máte dotaz, chcete poradit nebo si domluvit prohlídku? Kontaktní údaje budou doplněny po potvrzení finálních údajů provozovatele."
        image="/images/contact-hero.jpg"
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="min-w-0 rounded-2xl border border-brand-line bg-white p-5 shadow-[0_14px_38px_rgba(13,13,13,0.06)] sm:p-6">
                <Icon className="h-9 w-9 text-brand-blue" />
                <h2 className="mt-4 font-bold text-brand-navy">{card.title}</h2>
                <div className="mt-3 space-y-1 text-sm leading-6 text-brand-muted">
                  {card.body.map((line) => (
                    <p key={line} className={line.includes("Bude doplněno") ? "font-bold text-brand-blue" : "break-words"}>
                      {line}
                    </p>
                  ))}
                </div>
                {card.action ? (
                  <ButtonLink href="/domluvit-prohlidku" variant="ghost" className="mt-4 h-9 px-0 text-brand-blue">
                    {card.action}
                  </ButtonLink>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <ContactForm />

          <div className="grid min-w-0 gap-6">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <MapCard />
              <aside className="min-w-0 rounded-2xl border border-brand-line bg-white p-5 shadow-[0_14px_38px_rgba(13,13,13,0.06)] sm:p-6">
                <h2 className="text-xl font-bold text-brand-navy">Otevírací doba</h2>
                <div className="mt-5 rounded-xl bg-brand-soft p-4 text-sm leading-6">
                  <p className="font-bold text-brand-blue">Bude doplněno</p>
                  <p className="mt-2 text-brand-muted">{contactNotice}</p>
                </div>
              </aside>
            </div>

            <div className="min-w-0 rounded-2xl bg-brand-soft p-5 md:flex md:items-center md:justify-between sm:p-6">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-brand-navy">Potřebujete rychlou pomoc?</h2>
                <p className="mt-2 text-brand-muted">{contactNotice}</p>
              </div>
              <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-lg border border-brand-line bg-white px-5 py-3 text-sm font-bold text-brand-blue md:mt-0">
                <Phone className="h-4 w-4" />
                Bude doplněno
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
