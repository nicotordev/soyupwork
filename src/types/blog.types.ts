import type {
  BlogContentFormat,
  BlogPostStatus,
} from "@/generated/prisma/client";
import type { SeoMetadataInput } from "@/types/seo.types";

export type BlogCategorySummary = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  position: number;
};

export type BlogTagSummary = {
  id: string;
  slug: string;
  name: string;
};

export type BlogAuthorSummary = {
  id: string;
  name: string;
  imageUrl: string | null;
};

export type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  coverImageUrl: string | null;
  status: BlogPostStatus;
  publishedAt: string | null;
  readingTimeMinutes: number | null;
  isFeatured: boolean;
  contentFormat: BlogContentFormat;
  category: BlogCategorySummary | null;
  author: BlogAuthorSummary | null;
  tags: BlogTagSummary[];
};

export type BlogPostDetail = BlogPostSummary & {
  content: string;
};

export type ParsedPublicBlogParams = {
  q: string;
  category: string;
  tag: string;
  page: number;
  pageSize: number;
};

export type BlogPagination = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type BlogIndexPageData = {
  posts: BlogPostSummary[];
  featuredPosts: BlogPostSummary[];
  categories: BlogCategorySummary[];
  tags: BlogTagSummary[];
  filters: ParsedPublicBlogParams;
  pagination: BlogPagination;
};

export type AdminBlogPostRow = BlogPostSummary & {
  updatedAt: string;
  createdAt: string;
};

export type AdminBlogStats = {
  total: number;
  published: number;
  draft: number;
  archived: number;
};

export type ParsedAdminBlogParams = {
  q: string;
  status: BlogPostStatus | "all";
  categorySlug: string;
  page: number;
  pageSize: number;
};

export type AdminBlogCategoryOption = {
  id: string;
  slug: string;
  name: string;
};

export type AdminBlogPageData = {
  posts: AdminBlogPostRow[];
  stats: AdminBlogStats;
  categories: AdminBlogCategoryOption[];
  filters: ParsedAdminBlogParams;
  pagination: BlogPagination;
};

export type AdminBlogPostSeoFields = {
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
};

export type AdminBlogPostEdit = AdminBlogPostRow &
  AdminBlogPostSeoFields & {
    content: string;
    categoryId: string | null;
    authorId: string | null;
    tagSlugs: string[];
  };

export type GetAdminBlogPostForEditResult =
  | { ok: true; post: AdminBlogPostEdit }
  | { ok: false; error: string };

export type CreateBlogPostResult =
  | { ok: true; postId: string }
  | { ok: false; error: string };

export type UpdateBlogPostResult = { ok: true } | { ok: false; error: string };

export type DeleteBlogPostResult = { ok: true } | { ok: false; error: string };

export type BlogPostMutationInput = {
  title: string;
  slug: string;
  subtitle?: string | null;
  excerpt?: string | null;
  content: string;
  contentFormat: BlogContentFormat;
  coverImageUrl?: string | null;
  status: BlogPostStatus;
  isFeatured: boolean;
  categoryId?: string | null;
  authorId?: string | null;
  tagSlugs?: string[];
  seo?: SeoMetadataInput | null;
};
