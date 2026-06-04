"use client";

import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useMemo, useState } from "react";

import { VehicleImage } from "@/components/site/vehicle-image";

type VehicleGalleryProps = {
  images: string[];
  vehicleName: string;
};

export function VehicleGallery({ images, vehicleName }: VehicleGalleryProps) {
  const galleryImages = useMemo(() => uniqueImages(images), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryImages[activeIndex] ?? "";
  const hasMultipleImages = galleryImages.length > 1;

  function showImage(index: number) {
    if (!galleryImages.length) {
      setActiveIndex(0);
      return;
    }

    const nextIndex = (index + galleryImages.length) % galleryImages.length;
    setActiveIndex(nextIndex);
  }

  return (
    <div className="min-w-0">
      <div className="overflow-hidden rounded-2xl border border-brand-line bg-brand-soft shadow-[0_18px_46px_rgba(8,23,52,0.08)]">
        <div className="relative aspect-[16/10] min-h-[260px]">
          <VehicleImage
            src={activeImage}
            alt={vehicleName}
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 820px"
          />

          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-brand-blue shadow-sm ring-1 ring-brand-line">
            <Images className="h-4 w-4" />
            {galleryImages.length ? `${activeIndex + 1} / ${galleryImages.length}` : "Fotografie"}
          </div>

          {hasMultipleImages ? (
            <>
              <button
                type="button"
                onClick={() => showImage(activeIndex - 1)}
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand-navy shadow-sm ring-1 ring-brand-line transition hover:text-brand-blue"
                aria-label="Předchozí fotografie"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => showImage(activeIndex + 1)}
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand-navy shadow-sm ring-1 ring-brand-line transition hover:text-brand-blue"
                aria-label="Další fotografie"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
        {galleryImages.length ? (
          galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => showImage(index)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border bg-brand-soft transition ${
                index === activeIndex
                  ? "border-brand-blue ring-4 ring-brand-blue/10"
                  : "border-brand-line hover:border-brand-blue/40"
              }`}
              aria-label={`Zobrazit fotografii ${index + 1}`}
            >
              <VehicleImage
                src={image}
                alt=""
                className="object-cover"
                sizes="112px"
              />
            </button>
          ))
        ) : (
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-brand-line bg-brand-soft">
            <VehicleImage src="" alt="" sizes="112px" />
          </div>
        )}
      </div>
    </div>
  );
}

function uniqueImages(images: string[]) {
  const seen = new Set<string>();

  return images
    .map((image) => image.trim())
    .filter((image) => {
      if (!image || seen.has(image)) {
        return false;
      }

      seen.add(image);
      return true;
    });
}
