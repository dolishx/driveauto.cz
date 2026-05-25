"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const formNotice =
  "Formulář je připraven pro napojení. Odesílání bude aktivní po připojení databáze a e-mailových notifikací.";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="rounded-2xl border border-brand-line bg-white p-6 shadow-[0_14px_38px_rgba(8,23,52,0.06)]"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <h2 className="text-xl font-bold text-brand-navy">Napište nám</h2>
      <p className="mt-3 rounded-xl bg-brand-soft px-4 py-3 text-sm leading-6 text-brand-muted">
        {formNotice}
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <input className="h-12 rounded-lg border border-brand-line px-4 text-sm outline-none focus:border-brand-blue" placeholder="Jméno a příjmení *" required />
        <input className="h-12 rounded-lg border border-brand-line px-4 text-sm outline-none focus:border-brand-blue" placeholder="Telefon *" required />
        <input className="h-12 rounded-lg border border-brand-line px-4 text-sm outline-none focus:border-brand-blue" placeholder="E-mail *" type="email" required />
        <select className="h-12 rounded-lg border border-brand-line px-4 text-sm text-brand-muted outline-none focus:border-brand-blue">
          <option>Předmět zprávy</option>
          <option>Dotaz k vozu</option>
          <option>Financování (připravujeme)</option>
          <option>Výkup vozu</option>
        </select>
      </div>
      <textarea className="mt-4 min-h-36 w-full rounded-lg border border-brand-line p-4 text-sm outline-none focus:border-brand-blue" placeholder="Vaše zpráva *" required />
      <label className="mt-4 flex items-start gap-3 text-sm text-brand-muted">
        <input type="checkbox" className="mt-1" required />
        Souhlasím se zpracováním osobních údajů za účelem zodpovězení mé zprávy.
      </label>
      <Button type="submit" className="mt-6 w-full sm:w-auto">
        <Send className="h-4 w-4" />
        Odeslat zprávu
      </Button>
      {sent ? (
        <p className="mt-4 rounded-lg bg-brand-soft px-4 py-3 text-sm font-semibold text-brand-blue">
          {formNotice}
        </p>
      ) : null}
    </form>
  );
}
