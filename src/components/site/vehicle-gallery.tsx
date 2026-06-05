"use client";

import { ChevronLeft, ChevronRight, Images, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type TouchEvent } from "react";

import { VehicleImage } from "@/components/site/vehicle-image";

type VehicleGalleryProps = {
  images: string[];
  vehicleName: string;
};

export function VehicleGallery({ images, vehicleName }: VehicleGalleryProps) {
  const galleryImages = useMemo(() => uniqueImages(images), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const activeImage = galleryImages[activeIndex] ?? "";
  const hasMultipleImages = galleryImages.length > 1;

  const showImage = useCallback((index: number) => {
    if (!galleryImages.length) {
      setActiveIndex(0);
      return;
    }

    const nextIndex = (index + galleryImages.length) % galleryImages.length;
    setActiveIndex(nextIndex);
  }, [galleryImages.length]);

  useEffect(() => {
    if (!isZoomOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsZoomOpen(false);
      }

      if (event.key === "ArrowLeft") {
        showImage(activeIndex - 1);
      }

      if (event.key === "ArrowRight") {
        showImage(activeIndex + 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, isZoomOpen, showImage]);

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX === null || !hasMultipleImages) {
      setTouchStartX(null);
      return;
    }

    const deltaX = event.changedTouches[0].clientX - touchStartX;

    if (Math.abs(deltaX) > 44) {
      showImage(activeIndex + (deltaX < 0 ? 1 : -1));
    }

    setTouchStartX(null);
  }

  return (
    <div className="min-w-0">
      <div className="overflow-hidden rounded-2xl border border-brand-line bg-brand-soft shadow-[0_18px_46px_rgba(13,13,13,0.08)]">
        <div
          className="relative aspect-[16/10] min-h-[220px] touch-pan-y sm:min-h-[260px]"
          onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
          onTouchEnd={handleTouchEnd}
        >
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

          {activeImage ? (
            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              aria-label="Zvětšit fotografii"
              className="absolute right-4 top-4 inline-flex h-10 items-center gap-2 rounded-full bg-white/95 px-3 text-xs font-bold text-brand-navy shadow-sm ring-1 ring-brand-line transition hover:text-brand-blue"
            >
              <Maximize2 className="h-4 w-4" />
              <span className="hidden sm:inline">Zvětšit</span>
            </button>
          ) : null}

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

      {hasMultipleImages ? (
        <div className="mt-3 flex snap-x gap-3 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => showImage(index)}
              className={`relative h-20 w-28 shrink-0 snap-start overflow-hidden rounded-xl border bg-brand-soft transition ${
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
          ))}
        </div>
      ) : !galleryImages.length ? (
        <div className="mt-3 flex snap-x gap-3 overflow-x-auto pb-2">
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-brand-line bg-brand-soft">
            <VehicleImage src="" alt="" sizes="112px" />
          </div>
        </div>
      ) : null}

      {isZoomOpen ? (
        <div
          className="fixed inset-0 z-[80] bg-brand-black/92 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Zvětšená fotografie vozu ${vehicleName}`}
        >
          <div className="mx-auto flex h-full max-w-7xl flex-col">
            <div className="mb-4 flex items-center justify-between gap-4 text-white">
              <p className="min-w-0 truncate text-sm font-bold">
                {vehicleName} · {galleryImages.length ? `${activeIndex + 1} / ${galleryImages.length}` : "Fotografie"}
              </p>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/20"
                aria-label="Zavřít zvětšenou fotografii"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-black">
              <VehicleImage
                src={activeImage}
                alt={vehicleName}
                priority
                className="object-contain"
                sizes="100vw"
              />
              {hasMultipleImages ? (
                <>
                  <button
                    type="button"
                    onClick={() => showImage(activeIndex - 1)}
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-sm transition hover:text-brand-blue sm:left-5"
                    aria-label="Předchozí fotografie"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => showImage(activeIndex + 1)}
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-sm transition hover:text-brand-blue sm:right-5"
                    aria-label="Další fotografie"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
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
