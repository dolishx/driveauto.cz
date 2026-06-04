"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

type VehicleImageProps = {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

const supabaseStorageHost = "ptpouetttwyqksnksboc.supabase.co";

export function VehicleImage({ src, alt, className = "object-cover", sizes, priority }: VehicleImageProps) {
  const [failed, setFailed] = useState(false);
  const normalizedSrc = typeof src === "string" ? src.trim() : "";
  const canUseNextImage = useMemo(() => isNextImageSource(normalizedSrc), [normalizedSrc]);

  if (!normalizedSrc || failed) {
    return <VehicleImagePlaceholder />;
  }

  if (!canUseNextImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={normalizedSrc}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className}`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={normalizedSrc}
      alt={alt}
      fill
      priority={priority}
      className={className}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}

function VehicleImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-brand-soft via-white to-blue-50 px-5 text-center text-brand-muted">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-blue shadow-sm ring-1 ring-brand-line">
        <ImageOff className="h-6 w-6" />
      </span>
      <span className="mt-3 text-sm font-semibold">Fotografie bude doplněna</span>
    </div>
  );
}

function isNextImageSource(src: string) {
  if (src.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" &&
      url.hostname === supabaseStorageHost &&
      url.pathname.startsWith("/storage/v1/object/public/vehicle-images/")
    );
  } catch {
    return false;
  }
}
