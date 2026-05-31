import { ResourceAvailability, ResourceKind } from "@/generated/prisma/client";
import type {
  DbResourceDetail,
  DbResourceList,
} from "@/lib/resources/includes";
import type { GuideDetail } from "@/lib/resources/guide-content";
import type { TemplateDetail } from "@/lib/resources/template-content";
import type {
  ResourceAvailability as TsAvailability,
  ResourceCatalogItem,
  ResourceCategory,
  ResourceKind as TsKind,
} from "@/types/resource-catalog.types";

export function mapDbResourceKind(kind: ResourceKind): TsKind {
  return kind === ResourceKind.GUIDE ? "guide" : "template";
}

export function mapDbResourceAvailability(
  availability: ResourceAvailability,
): TsAvailability {
  switch (availability) {
    case ResourceAvailability.AVAILABLE:
      return "available";
    case ResourceAvailability.COMING_SOON:
      return "coming_soon";
    case ResourceAvailability.COURSE:
      return "course";
  }
}

export function tsAvailabilityToDb(
  availability: TsAvailability,
): ResourceAvailability {
  switch (availability) {
    case "available":
      return ResourceAvailability.AVAILABLE;
    case "coming_soon":
      return ResourceAvailability.COMING_SOON;
    case "course":
      return ResourceAvailability.COURSE;
  }
}

export function tsKindToDb(kind: TsKind): ResourceKind {
  return kind === "guide" ? ResourceKind.GUIDE : ResourceKind.TEMPLATE;
}

function mapTags(resource: DbResourceList): string[] {
  return resource.tags.map(({ tag }) => tag.name);
}

export function mapDbResourceToCatalogItem(
  resource: DbResourceList,
): ResourceCatalogItem {
  return {
    id: resource.id,
    slug: resource.slug,
    title: resource.title,
    subtitle: resource.subtitle,
    excerpt: resource.excerpt,
    categorySlug: resource.category?.slug ?? "",
    tags: mapTags(resource),
    kind: mapDbResourceKind(resource.kind),
    availability: mapDbResourceAvailability(resource.availability),
    readingTimeMinutes: resource.readingTimeMinutes ?? undefined,
    fileLabel: resource.fileLabel ?? undefined,
    featured: resource.featured,
    relatedHref: resource.relatedHref ?? undefined,
    relatedLabel: resource.relatedLabel ?? undefined,
  };
}

export function mapDbCategoryToResourceCategory(
  category: DbResourceList["category"],
): ResourceCategory | null {
  if (!category) return null;
  return {
    slug: category.slug,
    name: category.name,
    description: category.description ?? "",
  };
}

export function mapDbResourceToGuideDetail(
  resource: DbResourceDetail,
): GuideDetail | null {
  if (!resource.content?.trim()) return null;

  return {
    item: mapDbResourceToCatalogItem(resource),
    content: resource.content,
    categoryName: resource.category?.name,
  };
}

type TemplateSectionJson = {
  title: string;
  body: string;
};

function parseTemplateSections(value: unknown): TemplateSectionJson[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (section): section is TemplateSectionJson =>
      typeof section === "object" &&
      section !== null &&
      "title" in section &&
      "body" in section &&
      typeof section.title === "string" &&
      typeof section.body === "string",
  );
}

export function mapDbResourceToTemplateDetail(
  resource: DbResourceDetail,
): TemplateDetail | null {
  const sections = parseTemplateSections(resource.templateSections);
  if (sections.length === 0) return null;

  return {
    item: mapDbResourceToCatalogItem(resource),
    sections,
    includes: resource.templateIncludes,
    categoryName: resource.category?.name,
  };
}
