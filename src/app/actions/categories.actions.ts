"use server";

import { requireAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/db/prisma";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import { toSlug } from "@/lib/slug";
import type { CreateCategoryInput } from "@/schemas/category";
import { createCategorySchema } from "@/schemas/category";
import type {
  AdminCategoriesPageData,
  AdminCategoryRow,
  CreateCategoryResult,
  DeleteCategoryResult,
} from "@/types/admin-category.types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const log = getServerLogger("categories.actions");

async function resolveUniqueCategorySlug(baseSlug: string): Promise<string> {
  const normalized = toSlug(baseSlug);
  if (!normalized) return "categoria";

  let candidate = normalized;
  let suffix = 2;

  while (
    await prisma.courseCategory.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })
  ) {
    candidate = `${normalized}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function mapCategoryRow(category: {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  _count: { courses: number };
}): AdminCategoryRow {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    icon: category.icon,
    position: category.position,
    courseCount: category._count.courses,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export async function getPaginatedCategories(page: number, pageSize: number) {
  log.debug({ page, pageSize }, "Fetching paginated categories");

  try {
    const [categories, total] = await Promise.all([
      prisma.courseCategory.findMany({
        orderBy: { position: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          slug: true,
          name: true,
          icon: true,
          position: true,
        },
      }),
      prisma.courseCategory.count(),
    ]);

    log.info(
      { page, pageSize, returned: categories.length, total },
      "Paginated categories loaded",
    );

    return { categories, total };
  } catch (error) {
    log.error(serializeError(error), "Failed to fetch paginated categories");
    return { categories: [], total: 0 };
  }
}

export async function getAdminCategoriesPageData(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<AdminCategoriesPageData> {
  try {
    await requireAdmin();
  } catch {
    redirect("/sign-in");
  }

  const page = Math.max(
    1,
    Number(
      Array.isArray(searchParams.page)
        ? searchParams.page[0]
        : searchParams.page,
    ) || 1,
  );
  const pageSize = Math.min(
    50,
    Math.max(
      1,
      Number(
        Array.isArray(searchParams.pageSize)
          ? searchParams.pageSize[0]
          : searchParams.pageSize,
      ) || 20,
    ),
  );

  const [categories, totalCount] = await Promise.all([
    prisma.courseCategory.findMany({
      orderBy: [{ position: "asc" }, { name: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        slug: true,
        name: true,
        icon: true,
        position: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { courses: true } },
      },
    }),
    prisma.courseCategory.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    categories: categories.map(mapCategoryRow),
    pagination: { page, pageSize, totalCount, totalPages },
  };
}

export async function createCategory(
  input: CreateCategoryInput,
): Promise<CreateCategoryResult> {
  try {
    await requireAdmin();

    const parsed = createCategorySchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const slug = await resolveUniqueCategorySlug(parsed.data.slug);

    const position =
      parsed.data.position ??
      ((await prisma.courseCategory.aggregate({ _max: { position: true } }))
        ._max.position ?? -1) + 1;

    const created = await prisma.courseCategory.create({
      data: {
        name: parsed.data.name,
        slug,
        icon: parsed.data.icon.trim() || null,
        position,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        icon: true,
        position: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { courses: true } },
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/courses");
    revalidatePath("/catalog");

    log.info(
      { categoryId: created.id, slug: created.slug },
      "Category created",
    );

    return { ok: true, category: mapCategoryRow(created) };
  } catch (error) {
    log.error(serializeError(error), "Failed to create category");
    return { ok: false, error: "No se pudo crear la categoría." };
  }
}

export async function deleteCategory(
  id: string,
): Promise<DeleteCategoryResult> {
  try {
    await requireAdmin();

    const existing = await prisma.courseCategory.findUnique({
      where: { id },
      select: { _count: { select: { courses: true } } },
    });

    if (!existing) {
      return { ok: false, error: "La categoría no existe." };
    }

    if (existing._count.courses > 0) {
      return {
        ok: false,
        error: "No puedes eliminar una categoría con cursos asignados.",
      };
    }

    await prisma.courseCategory.delete({ where: { id } });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/courses");
    revalidatePath("/catalog");

    log.info({ categoryId: id }, "Category deleted");

    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to delete category");
    return { ok: false, error: "No se pudo eliminar la categoría." };
  }
}
