"use client";

import { Calendar, ChevronDown, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";

const navItems = [
  { label: "Nabídka vozů", href: "/nabidka-vozu", chevron: true },
  { label: "Výkup vozu", href: "/sluzby#vykup" },
  { label: "O nás", href: "/#vyhody" },
  { label: "Služby", href: "/sluzby", chevron: true },
  { label: "Kontakt", href: "/kontakt" },
];

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-line bg-white/96 shadow-[0_10px_30px_rgba(13,13,13,0.04)] backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo
          className="gap-2.5"
          markClassName="h-10 w-12"
          textClassName="[&>svg]:h-7 [&>svg]:w-40 xl:[&>svg]:w-48"
        />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Hlavní navigace">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex h-[72px] items-center gap-1 border-b-2 border-transparent text-sm font-semibold text-brand-navy transition-colors hover:text-brand-blue",
                isActive(pathname, item.href) &&
                  "border-brand-blue text-brand-blue",
              )}
            >
              {item.label}
              {item.chevron ? <ChevronDown className="h-3.5 w-3.5" /> : null}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/kontakt"
            className="group flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:border-brand-line hover:bg-brand-soft"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand-blue transition group-hover:bg-brand-blue group-hover:text-white">
              <Phone className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-extrabold text-brand-navy">Kontakt DriveAuto</span>
              <span className="block text-xs font-semibold text-brand-muted">Telefon bude doplněn</span>
            </span>
          </Link>
          <ButtonLink href="/domluvit-prohlidku" className="h-12 px-5">
            <Calendar className="h-4 w-4" />
            Domluvit prohlídku
          </ButtonLink>
        </div>

        <details className="group lg:hidden">
          <summary
            className="inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-lg border border-brand-line text-brand-navy transition hover:border-brand-blue hover:text-brand-blue [&::-webkit-details-marker]:hidden"
            aria-label="Otevřít menu"
          >
            <Menu className="h-5 w-5 group-open:hidden" />
            <X className="hidden h-5 w-5 group-open:block" />
          </summary>
          <div className="fixed left-0 right-0 top-[72px] border-t border-brand-line bg-white px-4 py-4 shadow-lg">
            <div className="mx-auto max-w-7xl">
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-brand-line bg-brand-soft px-4 py-3">
                <Logo
                  className="gap-2"
                  markClassName="h-9 w-11"
                  textClassName="[&>svg]:h-6 [&>svg]:w-36"
                />
                <span className="text-xs font-bold uppercase text-brand-blue">Menu</span>
              </div>
              <nav className="grid gap-1" aria-label="Mobilní navigace">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "rounded-lg px-3 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-soft",
                      isActive(pathname, item.href) && "bg-brand-soft text-brand-blue",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/kontakt"
                  className="mt-2 flex items-center gap-3 rounded-xl border border-brand-line bg-white px-3 py-3 text-sm font-semibold text-brand-navy"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand-blue">
                    <Phone className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-bold">Kontakt DriveAuto</span>
                    <span className="block text-xs text-brand-muted">Telefon bude doplněn</span>
                  </span>
                </Link>
                <ButtonLink href="/domluvit-prohlidku" className="mt-2 w-full">
                  <Calendar className="h-4 w-4" />
                  Domluvit prohlídku
                </ButtonLink>
              </nav>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
