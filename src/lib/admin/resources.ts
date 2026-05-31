import {
  ADMIN_RESOURCES_DEFAULT_PAGE,
  ADMIN_RESOURCES_DEFAULT_PAGE_SIZE,
  ADMIN_RESOURCES_FILTER_ALL,
  ADMIN_RESOURCES_KIND_GUIDE,
  ADMIN_RESOURCES_KIND_TEMPLATE,
  ADMIN_RESOURCES_MAX_PAGE_SIZE,
  ADMIN_RESOURCES_PAGE_SIZE_OPTIONS,
  type AdminResourcesKindParam,
} from "@/constants/resources-admin.constants";
import {
  resourceDetailInclude,
  resourceListInclude,
  type DbResourceDetail,
  type DbResourceList,
} from "@/lib/resources/includes";
import type {
  AdminResourceEdit,
  AdminResourceRow,
  ParsedAdminResourcesParams,
} from "@/types/resources-admin.types";
import type { ResourceKind, ResourceStatus } from "@/generated/prisma/client";
import { ResourceKind as ResourceKindEnum } from "@/generated/prisma/client";

export {
  resourceListInclude,
  resourceDetailInclude,
} from "@/lib/resources/includes";
export type { DbResourceList, DbResourceDetail };

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
  const parsed = parsePositiveInt(value, ADMIN_RESOURCES_DEFAULT_PAGE_SIZE);
  const capped = Math.min(parsed, ADMIN_RESOURCES_MAX_PAGE_SIZE);
  const allowed = ADMIN_RESOURCES_PAGE_SIZE_OPTIONS as readonly number[];
  if (allowed.includes(capped)) return capped;
  return ADMIN_RESOURCES_DEFAULT_PAGE_SIZE;
}

function parseStatus(value: string | undefined): ResourceStatus | "all" {
  if (value === "DRAFT" || value === "PUBLISHED" || value === "ARCHIVED") {
    return value;
  }
  return ADMIN_RESOURCES_FILTER_ALL;
}

export function parseAdminResourcesKind(
  value: string | undefined,
): AdminResourcesKindParam {
  if (value === ADMIN_RESOURCES_KIND_TEMPLATE) {
    return ADMIN_RESOURCES_KIND_TEMPLATE;
  }
  return ADMIN_RESOURCES_KIND_GUIDE;
}

export function adminKindParamToResourceKind(
  kind: AdminResourcesKindParam,
): ResourceKind {
  return kind === ADMIN_RESOURCES_KIND_GUIDE
    ? ResourceKindEnum.GUIDE
    : ResourceKindEnum.TEMPLATE;
}

export function resourceKindToAdminKindParam(
  kind: ResourceKind,
): AdminResourcesKindParam {
  return kind === ResourceKindEnum.GUIDE
    ? ADMIN_RESOURCES_KIND_GUIDE
    : ADMIN_RESOURCES_KIND_TEMPLATE;
}

export function parseAdminResourcesParams(
  searchParams: Record<string, string | string[] | undefined>,
): ParsedAdminResourcesParams {
  return {
    q: firstParam(searchParams.q)?.trim() ?? "",
    kind: parseAdminResourcesKind(firstParam(searchParams.tipo)),
    status: parseStatus(firstParam(searchParams.status)),
    categorySlug:
      firstParam(searchParams.categoria)?.trim() ?? ADMIN_RESOURCES_FILTER_ALL,
    page: parsePositiveInt(
      firstParam(searchParams.page),
      ADMIN_RESOURCES_DEFAULT_PAGE,
    ),
    pageSize: parsePageSize(firstParam(searchParams.pageSize)),
  };
}

function parseTemplateSections(
  value: unknown,
): { title: string; body: string }[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (section): section is { title: string; body: string } =>
      typeof section === "object" &&
      section !== null &&
      "title" in section &&
      "body" in section &&
      typeof section.title === "string" &&
      typeof section.body === "string",
  );
}

export function mapDbResourceToAdminRow(
  resource: DbResourceList,
): AdminResourceRow {
  return {
    id: resource.id,
    slug: resource.slug,
    title: resource.title,
    subtitle: resource.subtitle,
    excerpt: resource.excerpt,
    kind: resource.kind,
    availability: resource.availability,
    status: resource.status,
    readingTimeMinutes: resource.readingTimeMinutes,
    fileLabel: resource.fileLabel,
    featured: resource.featured,
    category: resource.category
      ? {
          id: resource.category.id,
          slug: resource.category.slug,
          name: resource.category.name,
        }
      : null,
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
  };
}

export function mapDbResourceToAdminEdit(
  resource: DbResourceDetail,
): AdminResourceEdit {
  return {
    ...mapDbResourceToAdminRow(resource),
    categoryId: resource.categoryId,
    relatedHref: resource.relatedHref,
    relatedLabel: resource.relatedLabel,
    content: resource.content,
    templateSections: parseTemplateSections(resource.templateSections),
    templateIncludes: resource.templateIncludes,
    tagSlugs: resource.tags.map(({ tag }) => tag.slug),
  };
}
