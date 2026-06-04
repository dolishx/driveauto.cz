"use client";

import { Calendar, Car, Droplet, Search, Tag } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const categories = ["Všechny vozy", "Osobní vozy", "SUV / 4x4", "Dodávky"];

export function SearchBar({
  className,
  showCategories = true,
  compact = false,
}: {
  className?: string;
  showCategories?: boolean;
  compact?: boolean;
}) {
  const [category, setCategory] = useState(categories[0]);

  return (
    <form
      className={cn(
        "rounded-2xl border border-brand-line bg-white shadow-[0_18px_45px_rgba(13,13,13,0.10)]",
        compact ? "p-4 md:p-5" : "p-4 md:p-6",
        className,
      )}
      onSubmit={(event) => event.preventDefault()}
    >
      {showCategories ? (
        <div className="mb-5 flex flex-wrap gap-2 border-b border-brand-line pb-4">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors",
                category === item
                  ? "bg-brand-soft text-brand-blue"
                  : "text-brand-muted hover:bg-brand-soft hover:text-brand-navy",
              )}
            >
              <Car className="h-4 w-4" />
              {item}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_0.85fr_0.9fr_0.9fr_auto]">
        <SearchField label="Značka" compact={compact} icon={<Tag className="h-4 w-4" />}>
          <option>Vyberte značku</option>
          <option>Škoda</option>
          <option>BMW</option>
          <option>Audi</option>
          <option>Volkswagen</option>
          <option>Volvo</option>
        </SearchField>
        <SearchField label="Model" compact={compact} icon={<Car className="h-4 w-4" />}>
          <option>Vyberte model</option>
          <option>Superb Combi</option>
          <option>X3</option>
          <option>X6 M</option>
          <option>Tiguan</option>
        </SearchField>
        <SearchField label="Rok od" compact={compact} icon={<Calendar className="h-4 w-4" />}>
          <option>2018</option>
          <option>2019</option>
          <option>2020</option>
          <option>2021</option>
          <option>2024</option>
        </SearchField>
        <SearchField label="Cena do" compact={compact} icon={<Tag className="h-4 w-4" />}>
          <option>800 000 Kč</option>
          <option>1 000 000 Kč</option>
          <option>2 000 000 Kč</option>
          <option>Bez omezení</option>
        </SearchField>
        <SearchField label="Palivo" compact={compact} icon={<Droplet className="h-4 w-4" />}>
          <option>Všechna paliva</option>
          <option>Nafta</option>
          <option>Benzin</option>
          <option>Hybrid</option>
        </SearchField>
        <div className="flex items-end">
          <Button type="submit" className={cn("w-full lg:w-40", compact && "h-12")}>
            <Search className="h-4 w-4" />
            Hledat vozy
          </Button>
        </div>
      </div>
    </form>
  );
}

function SearchField({
  label,
  icon,
  children,
  compact,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-brand-navy">{label}</span>
      <span
        className={cn(
          "flex items-center gap-2 rounded-xl border border-brand-line bg-white px-4 text-brand-muted shadow-sm focus-within:border-brand-blue",
          compact ? "h-12" : "h-14",
        )}
      >
        {icon}
        <select className="w-full bg-transparent text-sm font-medium text-brand-navy outline-none">
          {children}
        </select>
      </span>
    </label>
  );
}
