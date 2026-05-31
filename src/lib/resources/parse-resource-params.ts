import type { ParsedResourceCatalogParams } from "@/types/resource-catalog.types";

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseResourceCatalogParams(
  searchParams: Record<string, string | string[] | undefined>,
): ParsedResourceCatalogParams {
  return {
    q: firstParam(searchParams.q)?.trim() ?? "",
    category: firstParam(searchParams.categoria)?.trim() ?? "",
    tag: firstParam(searchParams.tag)?.trim() ?? "",
  };
}
