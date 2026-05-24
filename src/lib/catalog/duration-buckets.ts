import type { CatalogFilterDuration } from "@/types/catalog-filters";

/** Duration filter buckets (UI ranges; not a DB table). */
export const DURATION_BUCKETS: CatalogFilterDuration[] = [
  { label: "Corto (< 5 horas)", min: 0, max: 5 },
  { label: "Medio (5-10 horas)", min: 5, max: 10 },
  { label: "Largo (> 10 horas)", min: 10, max: 100 },
];

export function courseHoursMatchesBucket(
  durationHours: number,
  bucket: CatalogFilterDuration,
): boolean {
  return durationHours >= bucket.min && durationHours < bucket.max;
}
