"use client";

import {
  ArrowLeft,
  ArrowRight,
  Car,
  Image as ImageIcon,
  Save,
  ShieldAlert,
  Upload,
  X,
} from "lucide-react";
import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";

import { createVehicleAction } from "@/app/admin/vehicle-actions";
import type { VehicleMutationState } from "@/app/admin/vehicle-actions";
import { Button } from "@/components/ui/button";

const serviceRoleMessage = "Správa vozů vyžaduje serverový Supabase klíč.";
const initialVehicleMutationState: VehicleMutationState = {
  ok: false,
  configured: true,
};

type SelectedVehicleImage = {
  id: string;
  file: File;
  previewUrl: string;
};

export function AddVehicleForm({ canManageVehicles }: { canManageVehicles: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const selectedImagesRef = useRef<SelectedVehicleImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<SelectedVehicleImage[]>([]);
  const [state, formAction, isSubmitting] = useActionState(createVehicleAction, initialVehicleMutationState);

  useEffect(() => {
    selectedImagesRef.current = selectedImages;
  }, [selectedImages]);

  useEffect(() => {
    return () => {
      selectedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  function syncImageInput(nextImages: SelectedVehicleImage[]) {
    if (!imageInputRef.current || typeof DataTransfer === "undefined") {
      return;
    }

    const transfer = new DataTransfer();
    nextImages.forEach((image) => transfer.items.add(image.file));
    imageInputRef.current.files = transfer.files;
  }

  function clearSelectedImages() {
    selectedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    selectedImagesRef.current = [];
    setSelectedImages([]);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function handleImageSelection(files: FileList | null) {
    const nextImages = Array.from(files ?? []).map((file, index) => ({
      id: `${file.name}-${file.lastModified}-${index}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    selectedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    selectedImagesRef.current = nextImages;
    setSelectedImages(nextImages);
    syncImageInput(nextImages);
  }

  function removeSelectedImage(imageId: string) {
    const nextImages = selectedImagesRef.current.filter((image) => {
      if (image.id === imageId) {
        URL.revokeObjectURL(image.previewUrl);
        return false;
      }

      return true;
    });

    selectedImagesRef.current = nextImages;
    setSelectedImages(nextImages);
    syncImageInput(nextImages);
  }

  function moveSelectedImage(imageId: string, direction: -1 | 1) {
    const currentImages = [...selectedImagesRef.current];
    const currentIndex = currentImages.findIndex((image) => image.id === imageId);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= currentImages.length) {
      return;
    }

    [currentImages[currentIndex], currentImages[nextIndex]] = [
      currentImages[nextIndex],
      currentImages[currentIndex],
    ];

    selectedImagesRef.current = currentImages;
    setSelectedImages(currentImages);
    syncImageInput(currentImages);
  }

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      const resetTimer = window.setTimeout(() => {
        clearSelectedImages();
      }, 0);

      return () => window.clearTimeout(resetTimer);
    }
  }, [state.ok]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl border border-brand-line bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-blue">Přidat vůz</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-brand-navy">Nový vůz do nabídky</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">
            Formulář ukládá vozidlo serverově přes Supabase. Publikované a dostupné vozy se zobrazí ve veřejné nabídce.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-blue">
          <ShieldAlert className="h-4 w-4" />
          Server action
        </span>
      </div>

      {!canManageVehicles ? (
        <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-800">
          {serviceRoleMessage}
        </p>
      ) : null}

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
            ["draft", "Koncept"],
            ["published", "Publikováno"],
            ["sold", "Prodáno"],
            ["archived", "Archivováno"],
          ]}
        />
        <Select name="category" label="Kategorie" options={["Osobní vozy", "SUV / 4x4", "Dodávky"]} />
        <Input name="licensePlate" label="Štítek SPZ" placeholder="Např. 1AM ZENJA" />
        <Input name="color" label="Barva" placeholder="Např. Černá metalíza" />
        <Input name="powerKw" label="Výkon kW" placeholder="147" type="number" />
        <Input name="engine" label="Motor" placeholder="Např. 2.0 TDI" />
        <Input name="bodyType" label="Karoserie" placeholder="Např. kombi, SUV" />
        <Field label="Fotografie vozu" icon={<Upload className="h-4 w-4" />}>
          <input
            ref={imageInputRef}
            name="imageFiles"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) => handleImageSelection(event.currentTarget.files)}
            className="rounded-lg border border-brand-line bg-white px-3 py-2 text-sm text-brand-muted file:mr-4 file:rounded-md file:border-0 file:bg-brand-soft file:px-3 file:py-2 file:text-sm file:font-bold file:text-brand-blue hover:file:bg-blue-100 focus:border-brand-blue focus:outline-none"
          />
          <span className="text-xs leading-5 text-brand-muted">
            Nahrajte fotografie vozu ve formátu JPG, PNG nebo WebP do 5 MB za soubor. První fotografie bude hlavní.
          </span>
          {selectedImages.length ? (
            <div className="grid gap-3 rounded-xl border border-brand-line bg-brand-soft/45 p-3 sm:grid-cols-2 xl:grid-cols-3">
              {selectedImages.map((image, index) => (
                <div key={image.id} className="overflow-hidden rounded-xl border border-brand-line bg-white shadow-sm">
                  <div className="relative aspect-[4/3] bg-brand-soft">
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${image.previewUrl})` }}
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-brand-blue shadow-sm">
                      {index === 0 ? "Primární" : `Galerie ${index}`}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 p-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveSelectedImage(image.id, -1)}
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-brand-line text-brand-navy hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Posunout fotografii doleva"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSelectedImage(image.id)}
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-rose-100 text-rose-700 hover:bg-rose-50"
                      aria-label="Odebrat fotografii"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === selectedImages.length - 1}
                      onClick={() => moveSelectedImage(image.id, 1)}
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-brand-line text-brand-navy hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Posunout fotografii doprava"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </Field>
        <Field label="Image URL" icon={<ImageIcon className="h-4 w-4" />}>
          <input
            name="imageUrl"
            className="h-11 rounded-lg border border-brand-line px-3 text-sm outline-none focus:border-brand-blue"
            placeholder="/images/car-superb.jpg"
          />
          <span className="text-xs leading-5 text-brand-muted">
            Volitelné ruční URL zůstává jako záloha, pokud fotografii nenahráváte.
          </span>
        </Field>
      </div>

      <label className="mt-4 flex items-center gap-3 rounded-xl border border-brand-line bg-white px-4 py-3 text-sm font-semibold text-brand-muted">
        <input name="isFeatured" type="checkbox" className="h-4 w-4 rounded border-brand-line text-brand-blue" />
        Zobrazit jako doporučený vůz
      </label>

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
            Veřejná nabídka zobrazuje pouze vozy ve stavech dostupné, publikované nebo rezervované. Fallback zůstává jako pojistka, pokud Supabase vrátí prázdná data.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={isSubmitting || !canManageVehicles}>
          <Save className="h-4 w-4" />
          {isSubmitting ? "Ukládám..." : "Uložit vůz"}
        </Button>
        <p className="text-sm text-brand-muted">Plná správa přístupů bude doplněna v další fázi.</p>
      </div>

      {state.error || state.message ? (
        <p
          aria-live="polite"
          className={
            state.ok
              ? "mt-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
              : !state.configured || state.error === serviceRoleMessage
                ? "mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800"
                : "mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          }
        >
          {state.message || state.error}
          {state.vehicleSlug ? (
            <span className="mt-1 block font-normal">Slug detailu: {state.vehicleSlug}</span>
          ) : null}
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
