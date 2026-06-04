"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createInquiry } from "@/lib/data";

const formNotice =
  "Formulář je připraven pro napojení. Odesílání bude aktivní po připojení databáze a e-mailových notifikací.";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  return (
    <form
      className="min-w-0 rounded-2xl border border-brand-line bg-white p-5 shadow-[0_14px_38px_rgba(13,13,13,0.06)] sm:p-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        const formData = new FormData(event.currentTarget);
        const result = await createInquiry({
          type: String(formData.get("subject") || "Kontaktní formulář"),
          name: String(formData.get("name") || ""),
          phone: String(formData.get("phone") || ""),
          email: String(formData.get("email") || ""),
          message: String(formData.get("message") || ""),
          sourcePage: "/kontakt",
        });

        setIsSubmitting(false);

        if (!result.ok) {
          setSubmitError("Odeslání se nepodařilo. Zkuste to prosím později.");
          return;
        }

        setSent(true);
      }}
    >
      <h2 className="text-xl font-bold text-brand-navy">Napište nám</h2>
      <p className="mt-3 rounded-xl bg-brand-soft px-4 py-3 text-sm leading-6 text-brand-muted">
        {formNotice}
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <input
          name="name"
          aria-label="Jméno a příjmení"
          className="h-12 w-full min-w-0 rounded-lg border border-brand-line px-4 text-sm outline-none focus:border-brand-blue"
          placeholder="Jméno a příjmení *"
          required
        />
        <input
          name="phone"
          aria-label="Telefon"
          className="h-12 w-full min-w-0 rounded-lg border border-brand-line px-4 text-sm outline-none focus:border-brand-blue"
          placeholder="Telefon *"
          required
        />
        <input
          name="email"
          aria-label="E-mail"
          className="h-12 w-full min-w-0 rounded-lg border border-brand-line px-4 text-sm outline-none focus:border-brand-blue"
          placeholder="E-mail *"
          type="email"
          required
        />
        <select
          name="subject"
          aria-label="Předmět zprávy"
          className="h-12 w-full min-w-0 rounded-lg border border-brand-line px-4 text-sm text-brand-muted outline-none focus:border-brand-blue"
        >
          <option value="Kontaktní formulář">Předmět zprávy</option>
          <option value="Dotaz k vozu">Dotaz k vozu</option>
          <option value="Financování (připravujeme)">Financování (připravujeme)</option>
          <option value="Výkup vozu">Výkup vozu</option>
        </select>
      </div>
      <textarea
        name="message"
        aria-label="Vaše zpráva"
        className="mt-4 min-h-36 w-full rounded-lg border border-brand-line p-4 text-sm outline-none focus:border-brand-blue"
        placeholder="Vaše zpráva *"
        required
      />
      <label className="mt-4 flex items-start gap-3 text-sm text-brand-muted">
        <input type="checkbox" className="mt-1" required />
        Souhlasím se zpracováním osobních údajů za účelem zodpovězení mé zprávy.
      </label>
      <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={isSubmitting}>
        <Send className="h-4 w-4" />
        {isSubmitting ? "Odesílám..." : "Odeslat zprávu"}
      </Button>
      {submitError ? (
        <p aria-live="polite" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {submitError}
        </p>
      ) : null}
      {sent ? (
        <p aria-live="polite" className="mt-4 rounded-lg bg-brand-soft px-4 py-3 text-sm font-semibold text-brand-blue">
          {formNotice}
        </p>
      ) : null}
    </form>
  );
}
