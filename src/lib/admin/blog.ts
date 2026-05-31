import {
  ADMIN_BLOG_DEFAULT_PAGE,
  ADMIN_BLOG_DEFAULT_PAGE_SIZE,
  ADMIN_BLOG_FILTER_ALL,
  ADMIN_BLOG_MAX_PAGE_SIZE,
  ADMIN_BLOG_PAGE_SIZE_OPTIONS,
} from "@/constants/blog.constants";
import {
  blogPostDetailInclude,
  blogPostListInclude,
  type DbBlogPostDetail,
  type DbBlogPostList,
} from "@/lib/blog/includes";
import { mapDbBlogPostToSummary } from "@/lib/blog/map-blog-post";
import type { BlogPostStatus } from "@/generated/prisma/client";
import type {
  AdminBlogPostEdit,
  AdminBlogPostRow,
  ParsedAdminBlogParams,
} from "@/types/blog.types";

export {
  blogPostListInclude,
  blogPostDetailInclude,
} from "@/lib/blog/includes";
export type { DbBlogPostList, DbBlogPostDetail };

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
  const parsed = parsePositiveInt(value, ADMIN_BLOG_DEFAULT_PAGE_SIZE);
  const capped = Math.min(parsed, ADMIN_BLOG_MAX_PAGE_SIZE);
  const allowed = ADMIN_BLOG_PAGE_SIZE_OPTIONS as readonly number[];
  if (allowed.includes(capped)) return capped;
  return ADMIN_BLOG_DEFAULT_PAGE_SIZE;
}

function parseStatus(value: string | undefined): BlogPostStatus | "all" {
  if (value === "DRAFT" || value === "PUBLISHED" || value === "ARCHIVED") {
    return value;
  }
  return ADMIN_BLOG_FILTER_ALL;
}

export function parseAdminBlogParams(
  searchParams: Record<string, string | string[] | undefined>,
): ParsedAdminBlogParams {
  return {
    q: firstParam(searchParams.q)?.trim() ?? "",
    status: parseStatus(firstParam(searchParams.status)),
    categorySlug:
      firstParam(searchParams.categoria)?.trim() ?? ADMIN_BLOG_FILTER_ALL,
    page: parsePositiveInt(
      firstParam(searchParams.page),
      ADMIN_BLOG_DEFAULT_PAGE,
    ),
    pageSize: parsePageSize(firstParam(searchParams.pageSize)),
  };
}

export function mapDbBlogPostToAdminRow(
  post: DbBlogPostList,
): AdminBlogPostRow {
  return {
    ...mapDbBlogPostToSummary(post),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

export function mapDbBlogPostToAdminEdit(
  post: DbBlogPostDetail,
): AdminBlogPostEdit {
  const seo = post.seoMetadata;
  return {
    ...mapDbBlogPostToAdminRow(post),
    content: post.content,
    categoryId: post.categoryId,
    authorId: post.authorId,
    tagSlugs: post.tags.map(({ tag }) => tag.slug),
    seoTitle: seo?.title ?? null,
    seoDescription: seo?.description ?? null,
    seoKeywords: seo?.keywords ?? [],
  };
}
