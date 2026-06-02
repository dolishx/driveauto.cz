"use client";

import { Calendar, ChevronDown, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  return pathname === href;
}

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Hlavní navigace">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex h-20 items-center gap-1 border-b-2 border-transparent text-sm font-semibold text-brand-navy transition-colors hover:text-brand-blue",
                isActive(pathname, item.href) &&
                  "border-brand-blue text-brand-blue",
              )}
            >
              {item.label}
              {item.chevron ? <ChevronDown className="h-3.5 w-3.5" /> : null}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 fill-brand-navy text-brand-navy" />
            <span className="leading-tight">
              <span className="block text-base font-bold">Kontakt DriveAuto</span>
              <span className="block text-xs text-brand-muted">Přes formulář</span>
            </span>
          </div>
          <ButtonLink href="/domluvit-prohlidku">
            <Calendar className="h-4 w-4" />
            Domluvit prohlídku
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-brand-line text-brand-navy lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Otevřít menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-brand-line bg-white px-4 py-4 shadow-lg lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1" aria-label="Mobilní navigace">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-soft",
                  isActive(pathname, item.href) && "bg-brand-soft text-brand-blue",
                )}
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href="/domluvit-prohlidku" className="mt-2 w-full">
              <Calendar className="h-4 w-4" />
              Domluvit prohlídku
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
