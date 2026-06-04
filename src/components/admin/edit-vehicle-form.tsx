"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Image as ImageIcon,
  Save,
  Upload,
  X,
} from "lucide-react";
import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";

import { updateVehicleAction } from "@/app/admin/vehicle-actions";
import type { VehicleMutationState } from "@/app/admin/vehicle-actions";
import { Button } from "@/components/ui/button";
import type { SupabaseVehicleStatus, Vehicle } from "@/types";

const serviceRoleMessage = "Úprava vozu vyžaduje serverový Supabase klíč.";
const initialVehicleMutationState: VehicleMutationState = {
  ok: false,
  configured: true,
};

type SelectedVehicleImage = {
  id: string;
  file: File;
  previewUrl: string;
};

export function EditVehicleForm({
  vehicle,
  canManageVehicles,
}: {
  vehicle: Vehicle;
  canManageVehicles: boolean;
}) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const selectedImagesRef = useRef<SelectedVehicleImage[]>([]);
  const initialGalleryUrls = uniqueUrls([vehicle.image, ...(vehicle.gallery ?? [])]);
  const [galleryUrls, setGalleryUrls] = useState(initialGalleryUrls);
  const [primaryImageUrl, setPrimaryImageUrl] = useState(initialGalleryUrls[0] ?? vehicle.image);
  const [manualImageUrl, setManualImageUrl] = useState(vehicle.image);
  const [selectedImages, setSelectedImages] = useState<SelectedVehicleImage[]>([]);
  const [state, formAction, isSubmitting] = useActionState(
    updateVehicleAction.bind(null, vehicle.id),
    initialVehicleMutationState,
  );

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

  function removeGalleryUrl(url: string) {
    const nextGalleryUrls = galleryUrls.filter((item) => item !== url);
    setGalleryUrls(nextGalleryUrls);

    if (primaryImageUrl === url) {
      setPrimaryImageUrl(nextGalleryUrls[0] ?? "");
    }

    if (manualImageUrl === url) {
      setManualImageUrl("");
    }
  }

  function moveGalleryUrl(url: string, direction: -1 | 1) {
    const currentUrls = [...galleryUrls];
    const currentIndex = currentUrls.findIndex((item) => item === url);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= currentUrls.length) {
      return;
    }

    [currentUrls[currentIndex], currentUrls[nextIndex]] = [currentUrls[nextIndex], currentUrls[currentIndex]];
    setGalleryUrls(currentUrls);
  }

  return (
    <form action={formAction} className="grid gap-5 rounded-2xl border border-brand-line bg-brand-soft/35 p-4 sm:p-5">
      <input type="hidden" name="primaryImageUrl" value={primaryImageUrl} />
      <input type="hidden" name="initialImageUrl" value={vehicle.image} />
      {galleryUrls.map((url) => (
        <input key={url} type="hidden" name="existingGalleryUrls" value={url} />
      ))}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-blue">Upravit vůz</p>
          <h3 className="mt-1 text-xl font-bold tracking-[-0.03em] text-brand-navy">
            {vehicle.brand} {vehicle.model}
          </h3>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-blue ring-1 ring-brand-line">
          Slug: {vehicle.slug}
        </span>
      </div>

      {!canManageVehicles ? (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-800">
          {serviceRoleMessage}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Input name="title" label="Název vozu" defaultValue={vehicle.variant} required />
        <Input name="brand" label="Značka" defaultValue={vehicle.brand} required />
        <Input name="model" label="Model" defaultValue={vehicle.model} required />
        <Input name="year" label="Rok" defaultValue={vehicle.year || ""} type="number" />
        <Input name="mileage" label="Nájezd km" defaultValue={vehicle.mileage || ""} type="number" />
        <Select name="fuel" label="Palivo" defaultValue={vehicle.fuel} options={["Nafta", "Benzin", "Hybrid", "Elektro"]} />
        <Select name="transmission" label="Převodovka" defaultValue={vehicle.transmission} options={["Automat", "Manuál"]} />
        <Input name="priceCzk" label="Cena CZK" defaultValue={vehicle.price || ""} type="number" />
        <Select
          name="status"
          label="Stav"
          defaultValue={vehicle.adminStatus ?? statusToSupabaseStatus(vehicle.status)}
          options={[
            ["available", "Dostupné"],
            ["reserved", "Rezervováno"],
            ["sold", "Prodáno"],
            ["draft", "Koncept"],
            ["published", "Publikováno"],
            ["archived", "Archivováno"],
          ]}
        />
        <Select
          name="category"
          label="Kategorie"
          defaultValue={vehicle.category}
          options={["Osobní vozy", "SUV / 4x4", "Dodávky"]}
        />
        <Input name="bodyType" label="Karoserie" defaultValue={vehicle.bodyType ?? ""} />
        <Input name="licensePlate" label="Štítek SPZ" defaultValue={vehicle.licensePlate ?? ""} />
        <Input name="color" label="Barva" defaultValue={vehicle.color ?? ""} />
        <Input name="powerKw" label="Výkon kW" defaultValue={vehicle.powerKw ?? ""} type="number" />
        <Input name="engine" label="Motor" defaultValue={vehicle.engine ?? ""} />
        <Input name="vin" label="VIN" defaultValue={vehicle.vin ?? ""} />
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-brand-line bg-white px-4 py-3 text-sm font-semibold text-brand-muted">
        <input
          name="isFeatured"
          type="checkbox"
          defaultChecked={vehicle.featured}
          className="h-4 w-4 rounded border-brand-line text-brand-blue"
        />
        Zobrazit jako doporučený vůz
      </label>

      <Field label="Aktuální galerie" icon={<ImageIcon className="h-4 w-4" />}>
        {galleryUrls.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {galleryUrls.map((url, index) => (
              <div key={url} className="overflow-hidden rounded-xl border border-brand-line bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-brand-soft">
                  <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${url})` }} />
                  <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-brand-blue shadow-sm">
                    {primaryImageUrl === url ? "Primární" : `Galerie ${index + 1}`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 p-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveGalleryUrl(url, -1)}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-brand-line text-brand-navy hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Posunout fotografii doleva"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrimaryImageUrl(url)}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-brand-line text-brand-blue hover:bg-brand-soft"
                    aria-label="Nastavit jako primární fotografii"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeGalleryUrl(url)}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-rose-100 text-rose-700 hover:bg-rose-50"
                    aria-label="Odebrat fotografii z galerie"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === galleryUrls.length - 1}
                    onClick={() => moveGalleryUrl(url, 1)}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-brand-line text-brand-navy hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Posunout fotografii doprava"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-brand-line bg-white p-4 text-sm text-brand-muted">
            Galerie je prázdná. Nahrajte nové fotografie nebo vložte ruční Image URL.
          </p>
        )}
        <span className="text-xs leading-5 text-brand-muted">
          Odebrání zde pouze odstraní URL z galerie vozu. Soubor ve Storage se v této fázi fyzicky nemaže.
        </span>
      </Field>

      <Field label="Přidat nové fotografie" icon={<Upload className="h-4 w-4" />}>
        <input
          ref={imageInputRef}
          name="imageFiles"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => handleImageSelection(event.currentTarget.files)}
          className="rounded-lg border border-brand-line bg-white px-3 py-2 text-sm text-brand-muted file:mr-4 file:rounded-md file:border-0 file:bg-brand-soft file:px-3 file:py-2 file:text-sm file:font-bold file:text-brand-blue hover:file:bg-blue-100 focus:border-brand-blue focus:outline-none"
        />
        <label className="flex items-center gap-3 rounded-xl border border-brand-line bg-white px-4 py-3 text-sm font-semibold text-brand-muted">
          <input name="newImagesAsPrimary" type="checkbox" className="h-4 w-4 rounded border-brand-line text-brand-blue" />
          Použít první nově nahranou fotografii jako primární
        </label>
        {selectedImages.length ? (
          <div className="grid gap-3 rounded-xl border border-brand-line bg-white p-3 sm:grid-cols-2 xl:grid-cols-3">
            {selectedImages.map((image, index) => (
              <div key={image.id} className="overflow-hidden rounded-xl border border-brand-line bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-brand-soft">
                  <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${image.previewUrl})` }} />
                  <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-brand-blue shadow-sm">
                    Nová {index + 1}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 p-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveSelectedImage(image.id, -1)}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-brand-line text-brand-navy hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Posunout novou fotografii doleva"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSelectedImage(image.id)}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-rose-100 text-rose-700 hover:bg-rose-50"
                    aria-label="Odebrat novou fotografii"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === selectedImages.length - 1}
                    onClick={() => moveSelectedImage(image.id, 1)}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-brand-line text-brand-navy hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Posunout novou fotografii doprava"
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
          value={manualImageUrl}
          onChange={(event) => setManualImageUrl(event.currentTarget.value)}
          className="h-11 rounded-lg border border-brand-line px-3 text-sm outline-none focus:border-brand-blue"
          placeholder="/images/car-superb.jpg"
        />
        <span className="text-xs leading-5 text-brand-muted">
          Pokud URL změníte ručně, uloží se jako primární obrázek vozu.
        </span>
      </Field>

      <label className="grid gap-2">
        <span className="text-sm font-bold text-brand-navy">Popis</span>
        <textarea
          name="description"
          defaultValue={vehicle.description ?? ""}
          className="min-h-28 rounded-lg border border-brand-line bg-white p-3 text-sm outline-none focus:border-brand-blue"
          placeholder="Popis vozu pro veřejný detail a interní práci."
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={isSubmitting || !canManageVehicles}>
          <Save className="h-4 w-4" />
          {isSubmitting ? "Ukládám..." : "Uložit úpravy"}
        </Button>
        <p className="text-sm text-brand-muted">Změny se po uložení propíšou do veřejné nabídky.</p>
      </div>

      {state.error || state.message ? (
        <p
          aria-live="polite"
          className={
            state.ok
              ? "rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
              : !state.configured || state.error === serviceRoleMessage
                ? "rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800"
                : "rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          }
        >
          {state.message || state.error}
          {state.vehicleSlug ? (
            <span className="mt-1 block font-normal">Nový slug detailu: {state.vehicleSlug}</span>
          ) : null}
        </p>
      ) : null}
    </form>
  );
}

function Input({
  name,
  label,
  defaultValue,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
}) {
  return (
    <Field label={label}>
      <input
        name={name}
        defaultValue={defaultValue}
        className="h-11 rounded-lg border border-brand-line bg-white px-3 text-sm outline-none focus:border-brand-blue"
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
  defaultValue,
}: {
  name: string;
  label: string;
  options: Array<string | [string, string]>;
  defaultValue?: string;
}) {
  return (
    <Field label={label}>
      <select
        name={name}
        defaultValue={defaultValue}
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

function uniqueUrls(urls: string[]) {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const url of urls) {
    const normalized = url.trim();

    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    unique.push(normalized);
  }

  return unique;
}

function statusToSupabaseStatus(status: Vehicle["status"]): SupabaseVehicleStatus {
  if (status === "Rezervováno") return "reserved";
  if (status === "Prodáno") return "sold";
  if (status === "Koncept") return "draft";
  if (status === "Publikováno") return "published";
  if (status === "Archivováno") return "archived";

  return "available";
}
