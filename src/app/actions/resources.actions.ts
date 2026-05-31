"use server";

import {
  ADMIN_RESOURCES_FILTER_ALL,
  ADMIN_RESOURCES_KIND_GUIDE,
} from "@/constants/resources-admin.constants";
import {
  ResourceKind,
  ResourceStatus,
  type Prisma,
} from "@/generated/prisma/client";
import {
  adminKindParamToResourceKind,
  mapDbResourceToAdminEdit,
  mapDbResourceToAdminRow,
  parseAdminResourcesParams,
  resourceDetailInclude,
  resourceListInclude,
} from "@/lib/admin/resources";
import { requireAdmin } from "@/lib/auth/admin";
import { estimateReadingTimeMinutes } from "@/lib/blog/reading-time";
import prisma from "@/lib/db/prisma";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import {
  GUIDES_INDEX_PATH,
  guidePath,
  templatePath,
  TEMPLATES_INDEX_PATH,
} from "@/lib/resources/paths";
import {
  SEED_GUIDE_CATEGORIES,
  SEED_TEMPLATE_CATEGORIES,
} from "@/lib/resources/legacy-seed-data";
import { tsKindToDb } from "@/lib/resources/map-resource";
import { toSlug } from "@/lib/slug";
import {
  createResourceSchema,
  deleteResourceSchema,
  updateResourceSchema,
  type UpdateResourceInput,
} from "@/schemas/resources";
import type {
  AdminResourceCategoryOption,
  AdminResourceStats,
  AdminResourcesPageData,
  CreateResourceResult,
  DeleteResourceResult,
  GetAdminResourceForEditResult,
  UpdateResourceResult,
} from "@/types/resources-admin.types";
import { revalidatePath } from "next/cache";

const log = getServerLogger("resources.actions");

async function resolveUniqueResourceSlug(
  baseSlug: string,
  excludeResourceId?: string,
): Promise<string> {
  const normalized = toSlug(baseSlug);
  if (!normalized) return "recurso";

  let candidate = normalized;
  let suffix = 2;

  while (true) {
    const existing = await prisma.resource.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeResourceId) {
      return candidate;
    }

    candidate = `${normalized}-${suffix}`;
    suffix += 1;
  }
}

async function syncResourceTags(
  resourceId: string,
  tagSlugs: string[],
): Promise<void> {
  const normalized = [
    ...new Set(tagSlugs.map((s) => toSlug(s)).filter((s) => s.length > 0)),
  ];

  await prisma.resourceTagJoin.deleteMany({ where: { resourceId } });

  if (normalized.length === 0) return;

  for (const slug of normalized) {
    const name = slug.replace(/-/g, " ");
    const tag = await prisma.resourceTag.upsert({
      where: { slug },
      create: { slug, name },
      update: {},
      select: { id: true },
    });

    await prisma.resourceTagJoin.create({
      data: { resourceId, tagId: tag.id },
    });
  }
}

function buildAdminWhere(
  filters: ReturnType<typeof parseAdminResourcesParams>,
): Prisma.ResourceWhereInput {
  const where: Prisma.ResourceWhereInput = {
    kind: adminKindParamToResourceKind(filters.kind),
  };

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { slug: { contains: filters.q, mode: "insensitive" } },
      { excerpt: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  if (filters.status !== ADMIN_RESOURCES_FILTER_ALL) {
    where.status = filters.status;
  }

  if (filters.categorySlug !== ADMIN_RESOURCES_FILTER_ALL) {
    where.category = { slug: filters.categorySlug };
  }

  return where;
}

async function ensureDefaultResourceCategories(
  kind: ResourceKind,
): Promise<void> {
  const count = await prisma.resourceCategory.count({ where: { kind } });
  if (count > 0) return;

  const seed =
    kind === ResourceKind.GUIDE
      ? SEED_GUIDE_CATEGORIES
      : SEED_TEMPLATE_CATEGORIES;

  await prisma.resourceCategory.createMany({
    data: seed.map((category, index) => ({
      slug: category.slug,
      name: category.name,
      description: category.description,
      kind,
      position: index,
    })),
    skipDuplicates: true,
  });
}

function revalidateResourcePaths(
  kind: ResourceKind,
  slug: string,
  previousSlug?: string,
): void {
  revalidatePath("/admin/resources");
  revalidatePath(GUIDES_INDEX_PATH);
  revalidatePath(TEMPLATES_INDEX_PATH);

  if (kind === ResourceKind.GUIDE) {
    revalidatePath(guidePath(slug));
    if (previousSlug && previousSlug !== slug) {
      revalidatePath(guidePath(previousSlug));
    }
    return;
  }

  revalidatePath(templatePath(slug));
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(templatePath(previousSlug));
  }
}

export async function getAdminResourceStats(
  kindParam: ReturnType<typeof parseAdminResourcesParams>["kind"],
): Promise<AdminResourceStats> {
  const kind = adminKindParamToResourceKind(kindParam);
  const base = { kind };

  const [total, published, draft, archived] = await Promise.all([
    prisma.resource.count({ where: base }),
    prisma.resource.count({
      where: { ...base, status: ResourceStatus.PUBLISHED },
    }),
    prisma.resource.count({ where: { ...base, status: ResourceStatus.DRAFT } }),
    prisma.resource.count({
      where: { ...base, status: ResourceStatus.ARCHIVED },
    }),
  ]);

  return { total, published, draft, archived };
}

export async function getAdminResourceCategories(
  kindParam: ReturnType<typeof parseAdminResourcesParams>["kind"],
): Promise<AdminResourceCategoryOption[]> {
  await requireAdmin();
  const kind = adminKindParamToResourceKind(kindParam);
  await ensureDefaultResourceCategories(kind);

  return prisma.resourceCategory.findMany({
    where: { kind },
    orderBy: [{ position: "asc" }, { name: "asc" }],
    select: { id: true, slug: true, name: true },
  });
}

export async function getAdminResourcesPageData(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<AdminResourcesPageData> {
  await requireAdmin();

  const filters = parseAdminResourcesParams(searchParams);
  const kind = adminKindParamToResourceKind(filters.kind);
  await ensureDefaultResourceCategories(kind);

  const where = buildAdminWhere(filters);
  const totalCount = await prisma.resource.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / filters.pageSize));
  const page = Math.min(Math.max(1, filters.page), totalPages);
  const skip = (page - 1) * filters.pageSize;

  const [resources, stats, categories] = await Promise.all([
    prisma.resource.findMany({
      where,
      include: resourceListInclude,
      orderBy: [{ updatedAt: "desc" }],
      skip,
      take: filters.pageSize,
    }),
    getAdminResourceStats(filters.kind),
    getAdminResourceCategories(filters.kind),
  ]);

  return {
    resources: resources.map(mapDbResourceToAdminRow),
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

export async function getAdminResourceForEdit(
  resourceId: string,
): Promise<GetAdminResourceForEditResult> {
  try {
    await requireAdmin();

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: resourceDetailInclude,
    });

    if (!resource) {
      return { ok: false, error: "Recurso no encontrado." };
    }

    return { ok: true, resource: mapDbResourceToAdminEdit(resource) };
  } catch (error) {
    log.error(serializeError(error), "getAdminResourceForEdit failed");
    return { ok: false, error: "No se pudo cargar el recurso." };
  }
}

export async function createResource(
  input: unknown,
): Promise<CreateResourceResult> {
  try {
    await requireAdmin();
    const parsed = createResourceSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const kind = tsKindToDb(parsed.data.kind);
    await ensureDefaultResourceCategories(kind);

    const slug = await resolveUniqueResourceSlug(
      parsed.data.slug?.trim() || parsed.data.title,
    );

    const resource = await prisma.resource.create({
      data: {
        title: parsed.data.title.trim(),
        slug,
        excerpt: parsed.data.title.trim(),
        kind,
        status: ResourceStatus.DRAFT,
        content: kind === ResourceKind.GUIDE ? "" : null,
        templateSections: kind === ResourceKind.TEMPLATE ? [] : undefined,
      },
      select: { id: true },
    });

    revalidatePath("/admin/resources");
    revalidatePath(GUIDES_INDEX_PATH);
    revalidatePath(TEMPLATES_INDEX_PATH);

    return { ok: true, resourceId: resource.id };
  } catch (error) {
    log.error(serializeError(error), "createResource failed");
    return { ok: false, error: "No se pudo crear el recurso." };
  }
}

function resolvePublishedAt(
  status: ResourceStatus,
  currentPublishedAt: Date | null,
): Date | null {
  if (status !== ResourceStatus.PUBLISHED) {
    return currentPublishedAt;
  }
  return currentPublishedAt ?? new Date();
}

function validateResourceContent(data: UpdateResourceInput): string | null {
  if (data.status !== ResourceStatus.PUBLISHED) return null;

  if (data.kind === ResourceKind.GUIDE && !data.content?.trim()) {
    return "Las guías publicadas necesitan contenido.";
  }

  if (
    data.kind === ResourceKind.TEMPLATE &&
    (!data.templateSections || data.templateSections.length === 0)
  ) {
    return "Las plantillas publicadas necesitan al menos una sección.";
  }

  return null;
}

async function applyResourceUpdate(
  data: UpdateResourceInput,
): Promise<UpdateResourceResult> {
  const contentError = validateResourceContent(data);
  if (contentError) {
    return { ok: false, error: contentError };
  }

  const existing = await prisma.resource.findUnique({
    where: { id: data.resourceId },
    select: { id: true, slug: true, kind: true, publishedAt: true },
  });

  if (!existing) {
    return { ok: false, error: "Recurso no encontrado." };
  }

  const slug = await resolveUniqueResourceSlug(data.slug, data.resourceId);
  const readingTimeMinutes =
    data.kind === ResourceKind.GUIDE && data.content?.trim()
      ? estimateReadingTimeMinutes(data.content)
      : (data.readingTimeMinutes ?? null);
  const publishedAt = resolvePublishedAt(data.status, existing.publishedAt);

  await prisma.resource.update({
    where: { id: data.resourceId },
    data: {
      title: data.title.trim(),
      slug,
      subtitle: data.subtitle?.trim() || null,
      excerpt: data.excerpt.trim(),
      kind: data.kind,
      availability: data.availability,
      status: data.status,
      readingTimeMinutes,
      fileLabel: data.fileLabel?.trim() || null,
      featured: data.featured,
      categoryId: data.categoryId || null,
      relatedHref: data.relatedHref?.trim() || null,
      relatedLabel: data.relatedLabel?.trim() || null,
      content: data.kind === ResourceKind.GUIDE ? (data.content ?? "") : null,
      templateSections:
        data.kind === ResourceKind.TEMPLATE ? data.templateSections : undefined,
      templateIncludes:
        data.kind === ResourceKind.TEMPLATE ? data.templateIncludes : [],
      publishedAt,
    },
  });

  await syncResourceTags(data.resourceId, data.tagSlugs ?? []);

  revalidatePath("/admin/resources");
  revalidatePath(`/admin/resources/${data.resourceId}`);
  revalidateResourcePaths(existing.kind, slug, existing.slug);

  return { ok: true };
}

export async function updateResource(
  input: unknown,
): Promise<UpdateResourceResult> {
  try {
    await requireAdmin();
    const parsed = updateResourceSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    return applyResourceUpdate(parsed.data);
  } catch (error) {
    log.error(serializeError(error), "updateResource failed");
    return { ok: false, error: "No se pudo guardar el recurso." };
  }
}

export async function deleteResource(
  input: unknown,
): Promise<DeleteResourceResult> {
  try {
    await requireAdmin();
    const parsed = deleteResourceSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const existing = await prisma.resource.findUnique({
      where: { id: parsed.data.resourceId },
      select: { slug: true, kind: true },
    });

    if (!existing) {
      return { ok: false, error: "Recurso no encontrado." };
    }

    await prisma.resource.delete({ where: { id: parsed.data.resourceId } });

    revalidatePath("/admin/resources");
    revalidateResourcePaths(existing.kind, existing.slug);

    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "deleteResource failed");
    return { ok: false, error: "No se pudo eliminar el recurso." };
  }
}

export { ADMIN_RESOURCES_KIND_GUIDE };
