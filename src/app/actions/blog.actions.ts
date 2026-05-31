"use server";

import {
  ADMIN_BLOG_FILTER_ALL,
  BLOG_INDEX_PATH,
  DEFAULT_BLOG_CATEGORIES,
} from "@/constants/blog.constants";
import { BlogPostStatus, type Prisma } from "@/generated/prisma/client";
import {
  blogPostDetailInclude,
  blogPostListInclude,
  mapDbBlogPostToAdminEdit,
  mapDbBlogPostToAdminRow,
  parseAdminBlogParams,
} from "@/lib/admin/blog";
import { requireAdmin } from "@/lib/auth/admin";
import { estimateReadingTimeMinutes } from "@/lib/blog/reading-time";
import prisma from "@/lib/db/prisma";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import { blogPostPath } from "@/lib/seo/blog-paths";
import { upsertSeoMetadata } from "@/lib/seo/upsert-seo-metadata";
import { toSlug } from "@/lib/slug";
import {
  createBlogPostSchema,
  deleteBlogPostSchema,
  updateBlogPostSchema,
  type UpdateBlogPostInput,
} from "@/schemas/blog";
import type {
  AdminBlogCategoryOption,
  AdminBlogPageData,
  AdminBlogStats,
  CreateBlogPostResult,
  DeleteBlogPostResult,
  GetAdminBlogPostForEditResult,
  UpdateBlogPostResult,
} from "@/types/blog.types";
import { revalidateSitemap } from "@/lib/seo/revalidate-sitemap";
import { revalidatePath } from "next/cache";

const log = getServerLogger("blog.actions");

async function resolveUniqueBlogSlug(
  baseSlug: string,
  excludePostId?: string,
): Promise<string> {
  const normalized = toSlug(baseSlug);
  if (!normalized) return "articulo";

  let candidate = normalized;
  let suffix = 2;

  while (true) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludePostId) {
      return candidate;
    }

    candidate = `${normalized}-${suffix}`;
    suffix += 1;
  }
}

async function syncBlogPostTags(
  postId: string,
  tagSlugs: string[],
): Promise<void> {
  const normalized = [
    ...new Set(tagSlugs.map((s) => toSlug(s)).filter((s) => s.length > 0)),
  ];

  await prisma.blogPostTag.deleteMany({ where: { blogPostId: postId } });

  if (normalized.length === 0) return;

  for (const slug of normalized) {
    const name = slug.replace(/-/g, " ");
    const tag = await prisma.blogTag.upsert({
      where: { slug },
      create: { slug, name },
      update: {},
      select: { id: true },
    });

    await prisma.blogPostTag.create({
      data: { blogPostId: postId, tagId: tag.id },
    });
  }
}

function buildAdminWhere(
  filters: ReturnType<typeof parseAdminBlogParams>,
): Prisma.BlogPostWhereInput {
  const where: Prisma.BlogPostWhereInput = {};

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { slug: { contains: filters.q, mode: "insensitive" } },
      { excerpt: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  if (filters.status !== ADMIN_BLOG_FILTER_ALL) {
    where.status = filters.status;
  }

  if (filters.categorySlug !== ADMIN_BLOG_FILTER_ALL) {
    where.category = { slug: filters.categorySlug };
  }

  return where;
}

export async function getAdminBlogStats(): Promise<AdminBlogStats> {
  const [total, published, draft, archived] = await Promise.all([
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: BlogPostStatus.PUBLISHED } }),
    prisma.blogPost.count({ where: { status: BlogPostStatus.DRAFT } }),
    prisma.blogPost.count({ where: { status: BlogPostStatus.ARCHIVED } }),
  ]);

  return { total, published, draft, archived };
}

async function ensureDefaultBlogCategories(): Promise<void> {
  const count = await prisma.blogCategory.count();
  if (count > 0) return;

  await prisma.blogCategory.createMany({
    data: DEFAULT_BLOG_CATEGORIES.map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      position: cat.position,
    })),
    skipDuplicates: true,
  });
}

export async function getAdminBlogCategories(): Promise<
  AdminBlogCategoryOption[]
> {
  await requireAdmin();
  await ensureDefaultBlogCategories();
  return prisma.blogCategory.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    select: { id: true, slug: true, name: true },
  });
}

export async function getAdminBlogPageData(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<AdminBlogPageData> {
  await requireAdmin();
  await ensureDefaultBlogCategories();

  const filters = parseAdminBlogParams(searchParams);
  const where = buildAdminWhere(filters);

  const totalCount = await prisma.blogPost.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / filters.pageSize));
  const page = Math.min(Math.max(1, filters.page), totalPages);
  const skip = (page - 1) * filters.pageSize;

  const [posts, stats, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: blogPostListInclude,
      orderBy: [{ updatedAt: "desc" }],
      skip,
      take: filters.pageSize,
    }),
    getAdminBlogStats(),
    getAdminBlogCategories(),
  ]);

  return {
    posts: posts.map(mapDbBlogPostToAdminRow),
    stats,
    categories,
    filters: { ...filters, page },
    pagination: {
      page,
      pageSize: filters.pageSize,
      totalCount,
      totalPages,
    },
  };
}

export async function getAdminBlogPostForEdit(
  postId: string,
): Promise<GetAdminBlogPostForEditResult> {
  try {
    await requireAdmin();

    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      include: blogPostDetailInclude,
    });

    if (!post) {
      return { ok: false, error: "Artículo no encontrado." };
    }

    return { ok: true, post: mapDbBlogPostToAdminEdit(post) };
  } catch (error) {
    log.error(serializeError(error), "getAdminBlogPostForEdit failed");
    return { ok: false, error: "No se pudo cargar el artículo." };
  }
}

export async function createBlogPost(
  input: unknown,
): Promise<CreateBlogPostResult> {
  try {
    const admin = await requireAdmin();
    const parsed = createBlogPostSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const slug = await resolveUniqueBlogSlug(
      parsed.data.slug?.trim() || parsed.data.title,
    );

    const post = await prisma.blogPost.create({
      data: {
        title: parsed.data.title.trim(),
        slug,
        content: "",
        status: BlogPostStatus.DRAFT,
        authorId: admin.id,
      },
      select: { id: true },
    });

    await upsertSeoMetadata({ blogPostId: post.id }, {});

    revalidatePath("/admin/blog");
    revalidatePath(BLOG_INDEX_PATH);

    return { ok: true, postId: post.id };
  } catch (error) {
    log.error(serializeError(error), "createBlogPost failed");
    return { ok: false, error: "No se pudo crear el artículo." };
  }
}

function resolvePublishedAt(
  status: BlogPostStatus,
  currentPublishedAt: Date | null,
): Date | null {
  if (status !== BlogPostStatus.PUBLISHED) {
    return currentPublishedAt;
  }
  return currentPublishedAt ?? new Date();
}

function normalizeCoverUrl(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function applyBlogPostUpdate(
  data: UpdateBlogPostInput,
): Promise<UpdateBlogPostResult> {
  const existing = await prisma.blogPost.findUnique({
    where: { id: data.postId },
    select: { id: true, slug: true, publishedAt: true },
  });

  if (!existing) {
    return { ok: false, error: "Artículo no encontrado." };
  }

  const slug = await resolveUniqueBlogSlug(data.slug, data.postId);
  const readingTimeMinutes = estimateReadingTimeMinutes(data.content);
  const publishedAt = resolvePublishedAt(data.status, existing.publishedAt);

  await prisma.blogPost.update({
    where: { id: data.postId },
    data: {
      title: data.title.trim(),
      slug,
      subtitle: data.subtitle?.trim() || null,
      excerpt: data.excerpt?.trim() || null,
      content: data.content,
      contentFormat: data.contentFormat,
      coverImageUrl: normalizeCoverUrl(data.coverImageUrl),
      status: data.status,
      isFeatured: data.isFeatured,
      categoryId: data.categoryId || null,
      authorId: data.authorId || null,
      readingTimeMinutes,
      publishedAt,
    },
  });

  await syncBlogPostTags(data.postId, data.tagSlugs ?? []);

  if (data.seo) {
    await upsertSeoMetadata(
      { blogPostId: data.postId },
      {
        title: data.seo.title,
        description: data.seo.description,
        keywords: data.seo.keywords,
      },
    );
  }

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${data.postId}`);
  revalidatePath(BLOG_INDEX_PATH);
  revalidatePath(blogPostPath(slug));
  if (existing.slug !== slug) {
    revalidatePath(blogPostPath(existing.slug));
  }
  revalidateSitemap();

  return { ok: true };
}

export async function updateBlogPost(
  input: unknown,
): Promise<UpdateBlogPostResult> {
  try {
    await requireAdmin();
    const parsed = updateBlogPostSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    return applyBlogPostUpdate(parsed.data);
  } catch (error) {
    log.error(serializeError(error), "updateBlogPost failed");
    return { ok: false, error: "No se pudo guardar el artículo." };
  }
}

export async function deleteBlogPost(
  input: unknown,
): Promise<DeleteBlogPostResult> {
  try {
    await requireAdmin();
    const parsed = deleteBlogPostSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const existing = await prisma.blogPost.findUnique({
      where: { id: parsed.data.postId },
      select: { slug: true },
    });

    if (!existing) {
      return { ok: false, error: "Artículo no encontrado." };
    }

    await prisma.blogPost.delete({ where: { id: parsed.data.postId } });

    revalidatePath("/admin/blog");
    revalidatePath(BLOG_INDEX_PATH);
    revalidatePath(blogPostPath(existing.slug));
    revalidateSitemap();

    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "deleteBlogPost failed");
    return { ok: false, error: "No se pudo eliminar el artículo." };
  }
}
