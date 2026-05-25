import { parseLevelFilters } from "@/lib/catalog/course-level";

export interface ParsedCatalogParams {
  q: string;
  categorySlugs: string[];
  levels: string[];
  levelEnums: ReturnType<typeof parseLevelFilters>;
  selectedDurations: string[];
  selectedAccess: string;
  selectedCertificate: string;
  sortBy: string;
}

export function parseCatalogSearchParams(
  resolvedParams: Record<string, string | string[] | undefined>,
): ParsedCatalogParams {
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : "";

  const categorySlugs: string[] = [];

  if (resolvedParams.category) {
    const raw = Array.isArray(resolvedParams.category)
      ? resolvedParams.category
      : [resolvedParams.category];
    categorySlugs.push(...raw);
  }

  if (typeof resolvedParams.subject === "string") {
    categorySlugs.push(resolvedParams.subject);
  }

  const levels = resolvedParams.level
    ? Array.isArray(resolvedParams.level)
      ? resolvedParams.level
      : [resolvedParams.level]
    : [];

  const selectedDurations = resolvedParams.duration
    ? Array.isArray(resolvedParams.duration)
      ? resolvedParams.duration
      : [resolvedParams.duration]
    : [];

  let selectedAccess = "all";
  if (resolvedParams.access === "free" || resolvedParams.access === "paid") {
    selectedAccess = resolvedParams.access;
  } else if (resolvedParams.free === "true") {
    selectedAccess = "free";
  }

  const selectedCertificate =
    typeof resolvedParams.certificate === "string" &&
    ["yes", "no"].includes(resolvedParams.certificate)
      ? resolvedParams.certificate
      : "all";

  let sortBy = "popular";
  if (
    typeof resolvedParams.sort === "string" &&
    ["popular", "rating", "newest", "featured"].includes(resolvedParams.sort)
  ) {
    sortBy = resolvedParams.sort;
  } else if (resolvedParams.sort === "trending") {
    sortBy = "rating";
  } else if (resolvedParams.featured) {
    sortBy = "featured";
  }

  return {
    q,
    categorySlugs: [...new Set(categorySlugs)],
    levels,
    levelEnums: parseLevelFilters(levels),
    selectedDurations,
    selectedAccess,
    selectedCertificate,
    sortBy,
  };
}

export function countActiveCatalogFilters(params: ParsedCatalogParams): number {
  return (
    (params.q ? 1 : 0) +
    params.categorySlugs.length +
    params.levels.length +
    params.selectedDurations.length +
    (params.selectedAccess !== "all" ? 1 : 0) +
    (params.selectedCertificate !== "all" ? 1 : 0)
  );
}
