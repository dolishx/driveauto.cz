import type { ReactNode } from "react";

import { Logo } from "@/components/site/logo";
import { PublicHeader } from "@/components/site/public-header";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-brand-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 text-sm text-brand-muted sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <Logo
              showSilhouette
              className="gap-2"
              markClassName="h-9 w-11"
              textClassName="[&>svg:first-child]:h-4 [&>svg:first-child]:w-36 [&>svg:last-child]:h-6 [&>svg:last-child]:w-36"
            />
            <p className="mt-3 max-w-xl leading-6">
              DriveAuto — autoprodejna ověřených vozů. Kontaktní a právní údaje budou doplněny po potvrzení finálních údajů provozovatele.
            </p>
          </div>
          <p className="font-semibold text-brand-navy">© 2026 DriveAuto. Všechna práva vyhrazena.</p>
        </div>
      </footer>
    </>
  );
}
