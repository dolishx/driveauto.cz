export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function vehicleSlugBase({
  brand,
  model,
  title,
  year,
}: {
  brand?: string;
  model?: string;
  title?: string;
  year?: string | number | null;
}) {
  return slugify([brand, model, title, year].filter(Boolean).join(" ")) || "vuz";
}
