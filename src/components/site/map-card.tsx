import { MapPin } from "lucide-react";
import Image from "next/image";

export function MapCard() {
  return (
    <div className="grid overflow-hidden rounded-2xl border border-brand-line bg-white shadow-[0_14px_38px_rgba(8,23,52,0.06)] md:grid-cols-[0.8fr_1.2fr]">
      <div className="p-6">
        <h2 className="text-xl font-bold text-brand-navy">Kde nás najdete</h2>
        <div className="mt-5 flex gap-3">
          <MapPin className="h-6 w-6 text-brand-blue" />
          <div className="text-sm leading-6 text-brand-muted">
            <p className="font-bold text-brand-navy">Adresa</p>
            <p>Bude doplněno</p>
            <p>Kontaktní údaje budou doplněny po potvrzení finálních údajů provozovatele.</p>
          </div>
        </div>
        <p className="mt-5 text-sm font-bold text-brand-blue">Mapa bude doplněna</p>
      </div>
      <div className="relative min-h-56 bg-brand-soft">
        <Image
          src="/images/map-placeholder.jpg"
          alt="Orientační mapový podklad pro AutoDrive"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 450px"
        />
      </div>
    </div>
  );
}
