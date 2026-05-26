import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function formatAdminCoursePrice(
  priceCents: number,
  currency: string,
): string {
  if (priceCents === 0) return "Gratis";
  const amount = priceCents / 100;
  const code = currency.toUpperCase();
  if (code === "USD") {
    return `$${amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2)} USD`;
  }
  return `${amount.toFixed(2)} ${code}`;
}

export function formatAdminCourseContentSummary(
  moduleCount: number,
  lessonCount: number,
): string {
  const modules = moduleCount === 1 ? "1 módulo" : `${moduleCount} módulos`;
  const lessons = lessonCount === 1 ? "1 lección" : `${lessonCount} lecciones`;
  return `${modules} · ${lessons}`;
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatDashboardCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function formatDashboardCompactCurrency(amount: number): string {
  return compactCurrencyFormatter.format(amount);
}

export function formatDashboardDate(isoDate: string): string {
  return format(new Date(isoDate), "d MMM yyyy, HH:mm", { locale: es });
}

export function formatDashboardRelativeTime(isoDate: string): string {
  return formatDistanceToNow(new Date(isoDate), {
    addSuffix: true,
    locale: es,
  });
}

export function formatDashboardPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
