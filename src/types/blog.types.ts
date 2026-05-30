import type {
  BlogContentFormat,
  BlogPostStatus,
} from "@/generated/prisma/client";

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
