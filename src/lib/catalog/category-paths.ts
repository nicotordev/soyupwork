import type { ParsedCatalogParams } from "@/lib/catalog/filters";

export const CATEGORY_PATH_PREFIX = "/category" as const;

export function getCategoryPath(
  slug: string,
  searchParams?: URLSearchParams,
): string {
  const base = `${CATEGORY_PATH_PREFIX}/${slug}`;
  if (!searchParams) return base;

  const params = new URLSearchParams(searchParams.toString());
  params.delete("category");
  params.delete("subject");

  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function getCatalogPath(searchParams?: URLSearchParams): string {
  if (!searchParams) return "/catalog";
  const params = new URLSearchParams(searchParams.toString());
  params.delete("category");
  params.delete("subject");
  const query = params.toString();
  return query ? `/catalog?${query}` : "/catalog";
}

export function isCategoryPath(pathname: string): boolean {
  return (
    pathname === CATEGORY_PATH_PREFIX ||
    pathname.startsWith(`${CATEGORY_PATH_PREFIX}/`)
  );
}

export function getCategorySlugFromPath(pathname: string): string | null {
  if (!pathname.startsWith(`${CATEGORY_PATH_PREFIX}/`)) return null;
  const slug = pathname.slice(CATEGORY_PATH_PREFIX.length + 1).split("/")[0];
  return slug || null;
}

export function appendCatalogFiltersToSearchParams(
  params: URLSearchParams,
  filters: Pick<
    ParsedCatalogParams,
    | "q"
    | "levels"
    | "selectedDurations"
    | "selectedAccess"
    | "selectedCertificate"
    | "sortBy"
  >,
): URLSearchParams {
  const next = new URLSearchParams(params.toString());

  next.delete("q");
  next.delete("level");
  next.delete("duration");
  next.delete("access");
  next.delete("certificate");
  next.delete("sort");
  next.delete("free");
  next.delete("featured");
  next.delete("category");
  next.delete("subject");

  if (filters.q.trim()) next.set("q", filters.q.trim());
  filters.levels.forEach((level) => next.append("level", level));
  filters.selectedDurations.forEach((duration) =>
    next.append("duration", duration),
  );
  if (filters.selectedAccess !== "all") {
    next.set("access", filters.selectedAccess);
  }
  if (filters.selectedCertificate !== "all") {
    next.set("certificate", filters.selectedCertificate);
  }
  if (filters.sortBy !== "popular") {
    next.set("sort", filters.sortBy);
  }

  return next;
}

export function buildLegacyCategoryRedirectPath(
  slug: string,
  resolvedParams: Record<string, string | string[] | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedParams)) {
    if (key === "category" || key === "subject") continue;
    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry));
    } else if (typeof value === "string") {
      params.set(key, value);
    }
  }

  return getCategoryPath(slug, params);
}
