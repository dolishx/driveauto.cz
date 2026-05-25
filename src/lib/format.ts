export function formatPrice(value: number) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMileage(value: number) {
  return `${new Intl.NumberFormat("cs-CZ").format(value)} km`;
}
