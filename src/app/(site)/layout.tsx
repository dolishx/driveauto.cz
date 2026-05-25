import type { ReactNode } from "react";

import { PublicHeader } from "@/components/site/public-header";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-brand-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-brand-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2024 AutoDrive. Všechna práva vyhrazena.</p>
          <p>AutoDrive — autoprodejna ověřených vozů.</p>
        </div>
      </footer>
    </>
  );
}
