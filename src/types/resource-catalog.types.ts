export type ResourceKind = "guide" | "template";

export type ResourceAvailability = "available" | "coming_soon" | "course";

export type ResourceCategory = {
  slug: string;
  name: string;
  description: string;
};

export type ResourceCatalogItem = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  categorySlug: string;
  tags: readonly string[];
  kind: ResourceKind;
  availability: ResourceAvailability;
  readingTimeMinutes?: number;
  fileLabel?: string;
  featured: boolean;
  relatedHref?: string;
  relatedLabel?: string;
};

export type ParsedResourceCatalogParams = {
  q: string;
  category: string;
  tag: string;
};

export type ResourceCatalogPageData = {
  kind: ResourceKind;
  items: ResourceCatalogItem[];
  featuredItems: ResourceCatalogItem[];
  categories: ResourceCategory[];
  tags: { slug: string; name: string }[];
  filters: ParsedResourceCatalogParams;
};

export type ResourcePageConfig = {
  path: string;
  eyebrow: string;
  title: string;
  titleHighlight: string;
  titleTrail: string;
  description: string;
  metadata: {
    title: string;
    description: string;
    keywords: readonly string[];
  };
  empty: {
    filteredTitle: string;
    filteredDescription: string;
    filteredCta: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  detailEyebrow: string;
};
