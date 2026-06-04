"use client";

import { Calendar, Car, Clock, Lock, Mail, Phone, Send, User } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { createAppointmentRequest } from "@/lib/data";
import type { Vehicle } from "@/types";

const formNotice =
  "Formulář je připraven pro napojení. Odesílání bude aktivní po připojení databáze a e-mailových notifikací.";

export function AppointmentForm({ vehicles }: { vehicles: Vehicle[] }) {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  return (
    <form
      className="grid min-w-0 gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        const formData = new FormData(event.currentTarget);
        const result = await createAppointmentRequest({
          vehicleId: String(formData.get("vehicleId") || ""),
          name: String(formData.get("name") || ""),
          phone: String(formData.get("phone") || ""),
          email: String(formData.get("email") || ""),
          preferredDate: String(formData.get("preferredDate") || ""),
          preferredTime: String(formData.get("preferredTime") || ""),
          note: String(formData.get("note") || ""),
        });

        setIsSubmitting(false);

        if (!result.ok) {
          setSubmitError("Odeslání se nepodařilo. Zkuste to prosím později.");
          return;
        }

        setSent(true);
      }}
    >
      <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm leading-6 text-brand-muted">
        {formNotice}
      </p>

      <label className="grid gap-2">
        <span className="text-sm font-bold text-brand-navy">Vyberte vůz *</span>
        <FieldIcon icon={<Car className="h-4 w-4" />}>
          <select name="vehicleId" className="w-full min-w-0 bg-transparent text-sm outline-none" required>
            <option value="">Vyberte vůz</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} - {vehicle.year}
              </option>
            ))}
          </select>
        </FieldIcon>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="name" label="Jméno a příjmení *" icon={<User className="h-4 w-4" />} placeholder="Zadejte jméno a příjmení" />
        <Input name="phone" label="Telefon *" icon={<Phone className="h-4 w-4" />} placeholder="Zadejte telefonní číslo" />
      </div>

      <Input name="email" label="E-mail *" icon={<Mail className="h-4 w-4" />} placeholder="Zadejte e-mailovou adresu" type="email" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="preferredDate" label="Preferovaný termín *" icon={<Calendar className="h-4 w-4" />} placeholder="Vyberte datum" type="date" />
        <label className="grid gap-2">
          <span className="text-sm font-bold text-brand-navy">Čas *</span>
          <FieldIcon icon={<Clock className="h-4 w-4" />}>
            <select name="preferredTime" className="w-full bg-transparent text-sm outline-none" required>
              <option value="">Vyberte čas</option>
              <option value="9:00">9:00</option>
              <option value="11:00">11:00</option>
              <option value="14:00">14:00</option>
              <option value="16:00">16:00</option>
            </select>
          </FieldIcon>
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-bold text-brand-navy">Poznámka</span>
        <textarea name="note" className="min-h-28 w-full min-w-0 rounded-lg border border-brand-line p-4 text-sm outline-none focus:border-brand-blue" placeholder="Napište nám jakékoliv informace k prohlídce (volitelné)" />
      </label>

      <div className="rounded-xl bg-brand-soft p-4">
        <div className="flex gap-3">
          <Lock className="h-5 w-5 text-brand-blue" />
          <div>
            <h3 className="font-bold text-brand-navy">Bez závazků</h3>
            <p className="text-sm text-brand-muted">
              Prohlídka je nezávazná a zdarma. Rádi vám zodpovíme všechny dotazy.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          <Send className="h-4 w-4" />
          {isSubmitting ? "Odesílám..." : "Odeslat žádost o prohlídku"}
        </Button>
        <span className="inline-flex items-center gap-2 text-sm text-brand-muted">
          <Lock className="h-4 w-4" />
          Vaše údaje jsou u nás v bezpečí.
        </span>
      </div>

      {submitError ? (
        <p aria-live="polite" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {submitError}
        </p>
      ) : null}

      {sent ? (
        <p aria-live="polite" className="rounded-lg bg-brand-soft px-4 py-3 text-sm font-semibold text-brand-blue">
          {formNotice}
        </p>
      ) : null}
    </form>
  );
}

function Input({
  name,
  label,
  icon,
  placeholder,
  type = "text",
}: {
  name: string;
  label: string;
  icon: ReactNode;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-brand-navy">{label}</span>
      <FieldIcon icon={icon}>
        <input
          name={name}
          className="w-full min-w-0 bg-transparent text-sm outline-none"
          placeholder={placeholder}
          type={type}
          required={label.includes("*")}
        />
      </FieldIcon>
    </label>
  );
}

function FieldIcon({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="flex h-12 min-w-0 items-center gap-3 rounded-lg border border-brand-line px-4 text-brand-muted focus-within:border-brand-blue">
      {icon}
      {children}
    </span>
  );
}
