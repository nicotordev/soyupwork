import {
  BLOG_DEFAULT_PAGE,
  BLOG_DEFAULT_PAGE_SIZE,
  BLOG_MAX_PAGE_SIZE,
} from "@/constants/blog.constants";
import type { ParsedPublicBlogParams } from "@/types/blog.types";

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.floor(parsed);
}

export function parsePublicBlogParams(
  searchParams: Record<string, string | string[] | undefined>,
): ParsedPublicBlogParams {
  const q = firstParam(searchParams.q)?.trim() ?? "";
  const category = firstParam(searchParams.categoria)?.trim() ?? "";
  const tag = firstParam(searchParams.tag)?.trim() ?? "";
  const page = parsePositiveInt(
    firstParam(searchParams.page),
    BLOG_DEFAULT_PAGE,
  );
  const rawPageSize = parsePositiveInt(
    firstParam(searchParams.pageSize),
    BLOG_DEFAULT_PAGE_SIZE,
  );
  const pageSize = Math.min(rawPageSize, BLOG_MAX_PAGE_SIZE);

  return { q, category, tag, page, pageSize };
}
