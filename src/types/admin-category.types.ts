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

export type AdminCategoriesPageData = {
  categories: AdminCategoryRow[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

export type { CreateCategoryInput } from "@/schemas/category";

export type CreateCategoryResult =
  | { ok: true; category: AdminCategoryRow }
  | { ok: false; error: string };

export type DeleteCategoryResult = { ok: true } | { ok: false; error: string };
