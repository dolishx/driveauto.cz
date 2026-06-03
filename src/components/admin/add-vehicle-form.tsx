"use client";

import { Car, Image as ImageIcon, Save, ShieldAlert } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { createVehicle } from "@/lib/data";

const rlsMessage = "Ukládání vozu vyžaduje admin policy nebo server-side action.";

export function AddVehicleForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "warning" | "error">("warning");

  return (
    <form
      className="rounded-2xl border border-brand-line bg-white p-5 shadow-sm sm:p-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        const form = event.currentTarget;
        const formData = new FormData(form);
        const result = await createVehicle({
          title: String(formData.get("title") || ""),
          brand: String(formData.get("brand") || ""),
          model: String(formData.get("model") || ""),
          year: String(formData.get("year") || ""),
          mileage: String(formData.get("mileage") || ""),
          fuel: String(formData.get("fuel") || ""),
          transmission: String(formData.get("transmission") || ""),
          priceCzk: String(formData.get("priceCzk") || ""),
          status: String(formData.get("status") || ""),
          licensePlate: String(formData.get("licensePlate") || ""),
          color: String(formData.get("color") || ""),
          powerKw: String(formData.get("powerKw") || ""),
          engine: String(formData.get("engine") || ""),
          description: String(formData.get("description") || ""),
          imageUrl: String(formData.get("imageUrl") || ""),
        });

        setIsSubmitting(false);

        if (result.ok) {
          setMessageType("success");
          setMessage("Vůz byl uložen do Supabase. Po publikování se může zobrazit ve veřejné nabídce.");
          form.reset();
          return;
        }

        if (!result.configured) {
          setMessageType("warning");
          setMessage("Supabase není lokálně nakonfigurovaný. Formulář je připravený, ukládání bude aktivní po doplnění env proměnných.");
          return;
        }

        setMessageType(result.error === rlsMessage ? "warning" : "error");
        setMessage(result.error || "Uložení vozu se nepodařilo.");
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-blue">Přidat vůz</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-brand-navy">Nový vůz do nabídky</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">
            Formulář je připravený pro napojení na Supabase. Bez admin policy nebo server-side action může být uložení blokované RLS.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-blue">
          <ShieldAlert className="h-4 w-4" />
          MVP režim
        </span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Input name="title" label="Název vozu" placeholder="Např. 2.0 TDI 147 kW DSG L&K" required />
        <Input name="brand" label="Značka" placeholder="Např. Škoda" required />
        <Input name="model" label="Model" placeholder="Např. Superb Combi" required />
        <Input name="year" label="Rok" placeholder="2021" type="number" />
        <Input name="mileage" label="Nájezd km" placeholder="112000" type="number" />
        <Select name="fuel" label="Palivo" options={["Nafta", "Benzin", "Hybrid", "Elektro"]} />
        <Select name="transmission" label="Převodovka" options={["Automat", "Manuál"]} />
        <Input name="priceCzk" label="Cena CZK" placeholder="569000" type="number" />
        <Select
          name="status"
          label="Stav"
          options={[
            ["available", "Dostupné"],
            ["reserved", "Rezervováno"],
            ["sold", "Prodáno"],
            ["draft", "Koncept"],
            ["published", "Publikováno"],
          ]}
        />
        <Input name="licensePlate" label="Štítek SPZ" placeholder="Např. 1AM ZENJA" />
        <Input name="color" label="Barva" placeholder="Např. Černá metalíza" />
        <Input name="powerKw" label="Výkon kW" placeholder="147" type="number" />
        <Input name="engine" label="Motor" placeholder="Např. 2.0 TDI" />
        <Field label="Image URL" icon={<ImageIcon className="h-4 w-4" />}>
          <input
            name="imageUrl"
            className="h-11 rounded-lg border border-brand-line px-3 text-sm outline-none focus:border-brand-blue"
            placeholder="/images/car-superb.jpg"
          />
        </Field>
      </div>

      <label className="mt-4 grid gap-2">
        <span className="text-sm font-bold text-brand-navy">Popis</span>
        <textarea
          name="description"
          className="min-h-28 rounded-lg border border-brand-line p-3 text-sm outline-none focus:border-brand-blue"
          placeholder="Krátký interní popis vozu pro další práci v administraci."
        />
      </label>

      <div className="mt-5 rounded-xl bg-brand-soft p-4 text-sm leading-6 text-brand-muted">
        <div className="flex gap-3">
          <Car className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
          <p>
            Ukládání je zatím MVP. Veřejná nabídka zobrazuje pouze vozy ve stavech dostupné/publikované/rezervované a dál používá lokální fallback, pokud Supabase vrací prázdná data.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4" />
          {isSubmitting ? "Ukládám..." : "Uložit vůz"}
        </Button>
        <p className="text-sm text-brand-muted">Plná správa přístupů bude doplněna v další fázi.</p>
      </div>

      {message ? (
        <p
          aria-live="polite"
          className={
            messageType === "success"
              ? "mt-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
              : messageType === "warning"
                ? "mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800"
                : "mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

function Input({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <Field label={label}>
      <input
        name={name}
        className="h-11 rounded-lg border border-brand-line px-3 text-sm outline-none focus:border-brand-blue"
        placeholder={placeholder}
        type={type}
        required={required}
      />
    </Field>
  );
}

function Select({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: Array<string | [string, string]>;
}) {
  return (
    <Field label={label}>
      <select
        name={name}
        className="h-11 rounded-lg border border-brand-line bg-white px-3 text-sm text-brand-navy outline-none focus:border-brand-blue"
      >
        {options.map((option) => {
          const value = Array.isArray(option) ? option[0] : option;
          const labelText = Array.isArray(option) ? option[1] : option;
          return (
            <option key={value} value={value}>
              {labelText}
            </option>
          );
        })}
      </select>
    </Field>
  );
}

function Field({ label, icon, children }: { label: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center gap-2 text-sm font-bold text-brand-navy">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
