import {
  Prisma,
  ResourceAvailability,
  ResourceKind,
  ResourceStatus,
} from "@/generated/prisma/client";
import {
  resourceDetailInclude,
  resourceListInclude,
} from "@/lib/resources/includes";
import {
  mapDbResourceToCatalogItem,
  mapDbResourceToGuideDetail,
  mapDbResourceToTemplateDetail,
} from "@/lib/resources/map-resource";
import { parseResourceCatalogParams } from "@/lib/resources/parse-resource-params";
import prisma from "@/lib/db/prisma";
import type { GuideDetail } from "@/lib/resources/guide-content";
import type { TemplateDetail } from "@/lib/resources/template-content";
import type {
  ResourceCatalogPageData,
  ResourceKind as TsKind,
} from "@/types/resource-catalog.types";

function tsKindToPrismaKind(kind: TsKind): ResourceKind {
  return kind === "guide" ? ResourceKind.GUIDE : ResourceKind.TEMPLATE;
}

function buildPublishedWhere(
  kind: TsKind,
  params: ReturnType<typeof parseResourceCatalogParams>,
): Prisma.ResourceWhereInput {
  const where: Prisma.ResourceWhereInput = {
    kind: tsKindToPrismaKind(kind),
    status: ResourceStatus.PUBLISHED,
  };

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.tag) {
    where.tags = { some: { tag: { slug: params.tag } } };
  }

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { subtitle: { contains: params.q, mode: "insensitive" } },
      { excerpt: { contains: params.q, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function getPublishedResourcesPageData(
  kind: TsKind,
  searchParams: Record<string, string | string[] | undefined>,
): Promise<ResourceCatalogPageData> {
  const filters = parseResourceCatalogParams(searchParams);
  const where = buildPublishedWhere(kind, filters);
  const prismaKind = tsKindToPrismaKind(kind);

  const [resources, categories, tags] = await Promise.all([
    prisma.resource.findMany({
      where,
      include: resourceListInclude,
      orderBy: [
        { featured: "desc" },
        { publishedAt: "desc" },
        { title: "asc" },
      ],
    }),
    prisma.resourceCategory.findMany({
      where: { kind: prismaKind },
      orderBy: [{ position: "asc" }, { name: "asc" }],
      select: {
        slug: true,
        name: true,
        description: true,
      },
    }),
    prisma.resourceTag.findMany({
      where: {
        resources: {
          some: {
            resource: {
              kind: prismaKind,
              status: ResourceStatus.PUBLISHED,
            },
          },
        },
      },
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
      take: 24,
    }),
  ]);

  const items = resources.map(mapDbResourceToCatalogItem);
  const featuredItems = items.filter((item) => item.featured);

  return {
    kind,
    items,
    featuredItems: !filters.q && featuredItems.length > 0 ? featuredItems : [],
    categories: categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      description: category.description ?? "",
    })),
    tags,
    filters,
  };
}

export async function getPublishedGuideBySlug(
  slug: string,
): Promise<GuideDetail | null> {
  const resource = await prisma.resource.findFirst({
    where: {
      slug,
      kind: ResourceKind.GUIDE,
      status: ResourceStatus.PUBLISHED,
      availability: { not: ResourceAvailability.COMING_SOON },
      content: { not: null },
    },
    include: resourceDetailInclude,
  });

  if (!resource) return null;
  return mapDbResourceToGuideDetail(resource);
}

export async function getPublishedTemplateBySlug(
  slug: string,
): Promise<TemplateDetail | null> {
  const resource = await prisma.resource.findFirst({
    where: {
      slug,
      kind: ResourceKind.TEMPLATE,
      status: ResourceStatus.PUBLISHED,
      availability: { not: ResourceAvailability.COMING_SOON },
    },
    include: resourceDetailInclude,
  });

  if (!resource) return null;
  return mapDbResourceToTemplateDetail(resource);
}

export async function getPublishedResourceSlugs(
  kind: TsKind,
): Promise<string[]> {
  const resources = await prisma.resource.findMany({
    where: {
      kind: tsKindToPrismaKind(kind),
      status: ResourceStatus.PUBLISHED,
      availability: { not: ResourceAvailability.COMING_SOON },
      ...(kind === "guide" ? { content: { not: null } } : {}),
    },
    select: { slug: true, templateSections: true },
    orderBy: { slug: "asc" },
  });

  return resources
    .filter((resource) => {
      if (kind === "template") {
        const sections = resource.templateSections;
        return Array.isArray(sections) && sections.length > 0;
      }
      return true;
    })
    .map((resource) => resource.slug);
}

export async function getPublishedResourceCatalogItem(
  kind: TsKind,
  slug: string,
) {
  const resource = await prisma.resource.findFirst({
    where: {
      slug,
      kind: tsKindToPrismaKind(kind),
      status: ResourceStatus.PUBLISHED,
    },
    include: resourceListInclude,
  });

  if (!resource) return null;
  return mapDbResourceToCatalogItem(resource);
}
