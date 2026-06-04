import {
  Car,
  CircleGauge,
  ClipboardList,
  FileText,
  Folder,
  Fuel,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { DriveAutoMonogram, Logo } from "@/components/site/logo";

type SidebarItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

const groups: Array<{ title: string | null; items: SidebarItem[] }> = [
  {
    title: null,
    items: [{ label: "Přehled", icon: LayoutDashboard, active: true }],
  },
  {
    title: "Vozy",
    items: [
      { label: "Všechny vozy", icon: Car },
      { label: "Přidat vůz", icon: PlusCircle },
      { label: "Kategorie", icon: Folder },
      { label: "Značky", icon: Tag },
      { label: "Modely", icon: ClipboardList },
      { label: "Palivo", icon: Fuel },
      { label: "Převodovky", icon: CircleGauge },
      { label: "Stav vozů", icon: Settings },
      { label: "Poptávky", icon: ClipboardList },
    ],
  },
  {
    title: "Obsah webu",
    items: [
      { label: "Stránky", icon: FileText },
      { label: "Služby", icon: ClipboardList },
    ],
  },
  {
    title: "Nastavení",
    items: [{ label: "Obecné nastavení", icon: Settings }],
  },
];

export function AdminSidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-brand-line bg-white lg:flex lg:flex-col">
      <div className="flex h-24 items-center px-7">
        <Logo />
      </div>
      <nav className="flex-1 space-y-7 px-5 py-4">
        {groups.map((group, index) => (
          <div key={group.title ?? `main-${index}`}>
            {group.title ? (
              <p className="mb-3 px-3 text-xs font-bold uppercase text-brand-muted">
                {group.title}
              </p>
            ) : null}
            <div className="grid gap-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={
                      item.active
                        ? "flex h-11 items-center gap-3 rounded-lg bg-brand-soft px-3 text-sm font-bold text-brand-blue"
                        : "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-brand-navy hover:bg-brand-soft"
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-brand-line p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft">
            <DriveAutoMonogram className="h-7 w-9" />
          </div>
          <div>
            <p className="font-bold text-brand-navy">Správce webu</p>
            <p className="text-sm text-brand-muted">MVP režim</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
