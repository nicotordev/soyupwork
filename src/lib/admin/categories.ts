import {
  ADMIN_CATEGORIES_DEFAULT_PAGE,
  ADMIN_CATEGORIES_DEFAULT_PAGE_SIZE,
  ADMIN_CATEGORIES_MAX_PAGE_SIZE,
  ADMIN_CATEGORIES_PAGE_SIZE_OPTIONS,
} from "@/constants/categories.constants";
import type { ParsedAdminCategoriesParams } from "@/types/admin-category.types";

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.floor(parsed);
}

function parsePageSize(value: string | undefined): number {
  const parsed = parsePositiveInt(value, ADMIN_CATEGORIES_DEFAULT_PAGE_SIZE);
  const capped = Math.min(parsed, ADMIN_CATEGORIES_MAX_PAGE_SIZE);
  const allowed = ADMIN_CATEGORIES_PAGE_SIZE_OPTIONS as readonly number[];
  if (allowed.includes(capped)) return capped;
  return ADMIN_CATEGORIES_DEFAULT_PAGE_SIZE;
}

export function parseAdminCategoriesParams(
  searchParams: Record<string, string | string[] | undefined>,
): ParsedAdminCategoriesParams {
  const q = firstParam(searchParams.q)?.trim() ?? "";
  const page = parsePositiveInt(
    firstParam(searchParams.page),
    ADMIN_CATEGORIES_DEFAULT_PAGE,
  );
  const pageSize = parsePageSize(firstParam(searchParams.pageSize));

  return { q, page, pageSize };
}
