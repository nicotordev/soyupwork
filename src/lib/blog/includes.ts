import type { Prisma } from "@/generated/prisma/client";

export const blogCategorySelect = {
  id: true,
  slug: true,
  name: true,
  description: true,
  icon: true,
  position: true,
} as const;

export const blogTagSelect = {
  id: true,
  slug: true,
  name: true,
} as const;

export const blogAuthorSelect = {
  id: true,
  name: true,
  imageUrl: true,
  image: true,
} as const;

export const blogPostListInclude = {
  category: { select: blogCategorySelect },
  author: { select: blogAuthorSelect },
  tags: { include: { tag: { select: blogTagSelect } } },
} as const satisfies Prisma.BlogPostInclude;

export const blogPostDetailInclude = {
  ...blogPostListInclude,
  seoMetadata: {
    select: {
      id: true,
      title: true,
      description: true,
      keywords: true,
    },
  },
} as const satisfies Prisma.BlogPostInclude;

export type DbBlogPostList = Prisma.BlogPostGetPayload<{
  include: typeof blogPostListInclude;
}>;

export type DbBlogPostDetail = Prisma.BlogPostGetPayload<{
  include: typeof blogPostDetailInclude;
}>;
