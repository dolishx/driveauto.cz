"use client";

import { Calendar, Car, Clock, Lock, Mail, Phone, Send, User } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { Vehicle } from "@/types";

const formNotice =
  "Formulář je připraven pro napojení. Odesílání bude aktivní po připojení databáze a e-mailových notifikací.";

export function AppointmentForm({ vehicles }: { vehicles: Vehicle[] }) {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm leading-6 text-brand-muted">
        {formNotice}
      </p>

      <label className="grid gap-2">
        <span className="text-sm font-bold text-brand-navy">Vyberte vůz *</span>
        <FieldIcon icon={<Car className="h-4 w-4" />}>
          <select className="w-full bg-transparent text-sm outline-none" required>
            <option value="">Vyberte vůz</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id}>
                {vehicle.brand} {vehicle.model} - {vehicle.year}
              </option>
            ))}
          </select>
        </FieldIcon>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Jméno a příjmení *" icon={<User className="h-4 w-4" />} placeholder="Zadejte jméno a příjmení" />
        <Input label="Telefon *" icon={<Phone className="h-4 w-4" />} placeholder="Zadejte telefonní číslo" />
      </div>

      <Input label="E-mail *" icon={<Mail className="h-4 w-4" />} placeholder="Zadejte e-mailovou adresu" type="email" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Preferovaný termín *" icon={<Calendar className="h-4 w-4" />} placeholder="Vyberte datum" type="date" />
        <label className="grid gap-2">
          <span className="text-sm font-bold text-brand-navy">Čas *</span>
          <FieldIcon icon={<Clock className="h-4 w-4" />}>
            <select className="w-full bg-transparent text-sm outline-none" required>
              <option value="">Vyberte čas</option>
              <option>9:00</option>
              <option>11:00</option>
              <option>14:00</option>
              <option>16:00</option>
            </select>
          </FieldIcon>
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-bold text-brand-navy">Poznámka</span>
        <textarea className="min-h-28 rounded-lg border border-brand-line p-4 text-sm outline-none focus:border-brand-blue" placeholder="Napište nám jakékoliv informace k prohlídce (volitelné)" />
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
        <Button type="submit">
          <Send className="h-4 w-4" />
          Odeslat žádost o prohlídku
        </Button>
        <span className="inline-flex items-center gap-2 text-sm text-brand-muted">
          <Lock className="h-4 w-4" />
          Vaše údaje jsou u nás v bezpečí.
        </span>
      </div>

      {sent ? (
        <p className="rounded-lg bg-brand-soft px-4 py-3 text-sm font-semibold text-brand-blue">
          {formNotice}
        </p>
      ) : null}
    </form>
  );
}

function Input({
  label,
  icon,
  placeholder,
  type = "text",
}: {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-brand-navy">{label}</span>
      <FieldIcon icon={icon}>
        <input
          className="w-full bg-transparent text-sm outline-none"
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
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="flex h-12 items-center gap-3 rounded-lg border border-brand-line px-4 text-brand-muted focus-within:border-brand-blue">
      {icon}
      {children}
    </span>
  );
}
