export type AdminCategoryRow = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  position: number;
  courseCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminCategoriesStats = {
  total: number;
  withCourses: number;
  empty: number;
  assignedCourses: number;
};

export type ParsedAdminCategoriesParams = {
  q: string;
  page: number;
  pageSize: number;
};

export type AdminCategoriesPagination = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type AdminCategoriesPageData = {
  categories: AdminCategoryRow[];
  stats: AdminCategoriesStats;
  filters: ParsedAdminCategoriesParams;
  pagination: AdminCategoriesPagination;
};

export type { CreateCategoryInput } from "@/schemas/category";

export type CreateCategoryResult =
  | { ok: true; category: AdminCategoryRow }
  | { ok: false; error: string };

export type DeleteCategoryResult = { ok: true } | { ok: false; error: string };
