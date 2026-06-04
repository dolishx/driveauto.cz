import { ClipboardCheck, FileText, Handshake, Headphones, ShieldCheck } from "lucide-react";

const benefits = [
  {
    title: "Férové jednání",
    description: "Vysvětlíme stav, cenu i další kroky tak, aby bylo rozhodnutí přehledné.",
    icon: Handshake,
  },
  {
    title: "Ověřené vozy",
    description: "U nabízených aut řešíme původ, technický stav a připravenost k prodeji.",
    icon: ShieldCheck,
  },
  {
    title: "Pomoc s dokumenty",
    description: "Pomůžeme s přihlášením, přípravou podkladů a návaznými kroky kolem vozu.",
    icon: FileText,
  },
  {
    title: "Reálný kontakt",
    description: "Domluvíte další postup přímo přes DriveAuto, ne přes anonymní formulář bez kontextu.",
    icon: Headphones,
  },
  {
    title: "Kompletní služby kolem auta",
    description: "Koupě, prodej, výkup, dovoz, přihlášení i STK řešíme jako jeden navazující postup.",
    icon: ClipboardCheck,
  },
];

export function TrustBenefits() {
  return (
    <section id="vyhody" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-8 rounded-3xl border border-brand-line bg-white p-6 shadow-[0_18px_45px_rgba(13,13,13,0.07)] md:p-8 lg:grid-cols-[0.72fr_1.28fr] lg:p-10">
        <div>
          <p className="text-sm font-bold uppercase text-brand-blue">
            Proč DriveAuto
          </p>
          <h2 className="mt-4 text-4xl font-bold text-brand-navy md:text-5xl">
            Důvěra u auta začíná jasnou komunikací
          </h2>
          <p className="mt-5 text-lg leading-8 text-brand-muted">
            Auto není drobný nákup. Proto držíme postup konkrétní, bez nejasných slibů
            a bez tlaku na rychlé rozhodnutí.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article
                key={benefit.title}
                className="rounded-2xl border border-brand-line bg-brand-soft/65 p-5"
              >
                <Icon className="h-9 w-9 text-brand-blue" />
                <h3 className="mt-4 text-lg font-bold text-brand-navy">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-brand-muted">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
