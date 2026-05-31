import type {
  ResourceAvailabilityValue,
  ResourceKindValue,
  ResourceStatusValue,
} from "@/constants/resources-admin.constants";
import type { AdminResourcesKindParam } from "@/constants/resources-admin.constants";

export type AdminResourceCategoryOption = {
  id: string;
  slug: string;
  name: string;
};

export type AdminResourceRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  kind: ResourceKindValue;
  availability: ResourceAvailabilityValue;
  status: ResourceStatusValue;
  readingTimeMinutes: number | null;
  fileLabel: string | null;
  featured: boolean;
  category: AdminResourceCategoryOption | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminResourceStats = {
  total: number;
  published: number;
  draft: number;
  archived: number;
};

export type ParsedAdminResourcesParams = {
  q: string;
  kind: AdminResourcesKindParam;
  status: ResourceStatusValue | "all";
  categorySlug: string;
  page: number;
  pageSize: number;
};

export type AdminResourcesPagination = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type AdminResourcesPageData = {
  resources: AdminResourceRow[];
  stats: AdminResourceStats;
  categories: AdminResourceCategoryOption[];
  filters: ParsedAdminResourcesParams;
  pagination: AdminResourcesPagination;
};

export type AdminResourceEdit = AdminResourceRow & {
  categoryId: string | null;
  relatedHref: string | null;
  relatedLabel: string | null;
  content: string | null;
  templateSections: { title: string; body: string }[];
  templateIncludes: string[];
  tagSlugs: string[];
};

export type CreateResourceResult =
  | { ok: true; resourceId: string }
  | { ok: false; error: string };

export type UpdateResourceResult = { ok: true } | { ok: false; error: string };

export type DeleteResourceResult = { ok: true } | { ok: false; error: string };

export type GetAdminResourceForEditResult =
  | { ok: true; resource: AdminResourceEdit }
  | { ok: false; error: string };
