import { BlogPostStatus } from "@/generated/prisma/client";
import {
  blogPostDetailInclude,
  blogPostListInclude,
} from "@/lib/blog/includes";
import {
  mapDbBlogPostToDetail,
  mapDbBlogPostToSummary,
} from "@/lib/blog/map-blog-post";
import { parsePublicBlogParams } from "@/lib/blog/parse-public-blog-params";
import prisma from "@/lib/db/prisma";
import type { BlogIndexPageData, BlogPostDetail } from "@/types/blog.types";
import type { Prisma } from "@/generated/prisma/client";

function buildPublishedWhere(
  params: ReturnType<typeof parsePublicBlogParams>,
): Prisma.BlogPostWhereInput {
  const where: Prisma.BlogPostWhereInput = {
    status: BlogPostStatus.PUBLISHED,
    publishedAt: { not: null },
  };

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { subtitle: { contains: params.q, mode: "insensitive" } },
      { excerpt: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.tag) {
    where.tags = { some: { tag: { slug: params.tag } } };
  }

  return where;
}

export async function getPublishedBlogPostBySlug(
  slug: string,
): Promise<BlogPostDetail | null> {
  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      status: BlogPostStatus.PUBLISHED,
      publishedAt: { not: null },
    },
    include: blogPostDetailInclude,
  });

  if (!post) return null;
  return mapDbBlogPostToDetail(post);
}

export async function getBlogIndexPageData(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<BlogIndexPageData> {
  const params = parsePublicBlogParams(searchParams);
  const where = buildPublishedWhere(params);

  const totalCount = await prisma.blogPost.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / params.pageSize));
  const page = Math.min(Math.max(1, params.page), totalPages);
  const skip = (page - 1) * params.pageSize;

  const [posts, featuredPosts, categories, tags] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: blogPostListInclude,
      orderBy: [{ publishedAt: "desc" }],
      skip,
      take: params.pageSize,
    }),
    prisma.blogPost.findMany({
      where: {
        status: BlogPostStatus.PUBLISHED,
        publishedAt: { not: null },
        isFeatured: true,
      },
      include: blogPostListInclude,
      orderBy: [{ publishedAt: "desc" }],
      take: 3,
    }),
    prisma.blogCategory.findMany({
      orderBy: [{ position: "asc" }, { name: "asc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        icon: true,
        position: true,
      },
    }),
    prisma.blogTag.findMany({
      orderBy: { name: "asc" },
      select: { id: true, slug: true, name: true },
      take: 24,
    }),
  ]);

  return {
    posts: posts.map(mapDbBlogPostToSummary),
    featuredPosts: featuredPosts.map(mapDbBlogPostToSummary),
    categories,
    tags,
    filters: { ...params, page },
    pagination: {
      page,
      pageSize: params.pageSize,
      totalCount,
      totalPages,
    },
  };
}
