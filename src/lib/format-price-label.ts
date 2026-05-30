export function formatPriceLabel(priceCents: number, currency: string): string {
  if (priceCents === 0) return "Gratis";
  const amount = priceCents / 100;
  const code = currency.toUpperCase();
  if (code === "USD") {
    return `$${amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2)} USD`;
  }
  return `${amount.toFixed(2)} ${code}`;
}
