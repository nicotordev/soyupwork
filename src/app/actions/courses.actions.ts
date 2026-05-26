"use server";

import { ADMIN_COURSES_FILTER_ALL } from "@/constants/courses.constants";
import {
  CourseStatus,
  type CourseLevel,
  type Prisma,
} from "@/generated/prisma/client";
import {
  adminCourseInclude,
  mapDbCourseToAdminCourseRow,
  parseAdminCoursesParams,
} from "@/lib/admin/courses";
import { resolveLessonSlug } from "@/lib/admin/curriculum";
import { requireAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/db/prisma";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import { OpenAIConfigError } from "@/lib/openai/config";
import { generateCourseSyllabusWithOpenAI } from "@/lib/openai/generate-syllabus";
import { toSlug } from "@/lib/slug";
import {
  createAiDraftCourseSchema,
  generateCourseSyllabusInputSchema,
  updateCourseSchema,
  type CreateAiDraftCourseInput,
  type GenerateCourseSyllabusInput,
  type UpdateCourseInput,
} from "@/schemas/course";
import type {
  AdminCourseCategoryOption,
  AdminCoursesPageData,
  AdminCoursesStats,
  CreateAiDraftCourseResult,
  GenerateCourseSyllabusResult,
  GetAdminCourseForEditResult,
  ParsedAdminCoursesParams,
  UpdateCourseResult,
} from "@/types/admin-course.types";
import { revalidatePath } from "next/cache";

const log = getServerLogger("courses.actions");

async function resolveUniqueCourseSlug(
  baseSlug: string,
  excludeCourseId?: string,
): Promise<string> {
  const normalized = toSlug(baseSlug);
  if (!normalized) return "curso";

  let candidate = normalized;
  let suffix = 2;

  while (true) {
    const existing = await prisma.course.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeCourseId) {
      return candidate;
    }

    candidate = `${normalized}-${suffix}`;
    suffix += 1;
  }
}

function buildWhere(params: ParsedAdminCoursesParams): Prisma.CourseWhereInput {
  const where: Prisma.CourseWhereInput = {};

  const q = params.q.trim();
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ];
  }

  if (params.status !== ADMIN_COURSES_FILTER_ALL) {
    where.status = params.status;
  }

  if (params.level !== ADMIN_COURSES_FILTER_ALL) {
    where.level = params.level as CourseLevel;
  }

  if (params.categorySlug !== ADMIN_COURSES_FILTER_ALL) {
    where.category = { slug: params.categorySlug };
  }

  return where;
}

export async function getAdminCoursesStats(): Promise<AdminCoursesStats> {
  const [total, published, draft, archived] = await Promise.all([
    prisma.course.count(),
    prisma.course.count({ where: { status: CourseStatus.PUBLISHED } }),
    prisma.course.count({ where: { status: CourseStatus.DRAFT } }),
    prisma.course.count({ where: { status: CourseStatus.ARCHIVED } }),
  ]);

  return { total, published, draft, archived };
}

async function getAdminCourseCategories(): Promise<
  AdminCourseCategoryOption[]
> {
  return prisma.courseCategory.findMany({
    orderBy: { position: "asc" },
    select: { id: true, slug: true, name: true },
  });
}

export async function getAdminCoursesPageData(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<AdminCoursesPageData> {
  const filters = parseAdminCoursesParams(searchParams);

  log.debug(
    {
      page: filters.page,
      pageSize: filters.pageSize,
      status: filters.status,
      level: filters.level,
      hasQuery: filters.q.length > 0,
    },
    "Fetching admin courses page",
  );

  try {
    const where = buildWhere(filters);

    const totalCount = await prisma.course.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalCount / filters.pageSize));
    const page = Math.min(Math.max(1, filters.page), totalPages);
    const skip = (page - 1) * filters.pageSize;

    const [courses, stats, categories] = await Promise.all([
      prisma.course.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }],
        skip,
        take: filters.pageSize,
        include: adminCourseInclude,
      }),
      getAdminCoursesStats(),
      getAdminCourseCategories(),
    ]);

    log.info(
      {
        page,
        pageSize: filters.pageSize,
        returned: courses.length,
        totalCount,
      },
      "Admin courses page loaded",
    );

    return {
      courses: courses.map(mapDbCourseToAdminCourseRow),
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
  } catch (error) {
    log.error(serializeError(error), "Failed to fetch admin courses page");
    throw error;
  }
}

export async function generateCourseSyllabus(
  input: GenerateCourseSyllabusInput,
): Promise<GenerateCourseSyllabusResult> {
  try {
    await requireAdmin();

    const parsed = generateCourseSyllabusInputSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const syllabus = await generateCourseSyllabusWithOpenAI(parsed.data);

    log.info(
      {
        title: parsed.data.title,
        moduleCount: syllabus.modules.length,
      },
      "Course syllabus generated with OpenAI",
    );

    return { ok: true, syllabus };
  } catch (error) {
    if (error instanceof OpenAIConfigError) {
      return { ok: false, error: error.message };
    }

    log.error(serializeError(error), "Failed to generate course syllabus");
    return {
      ok: false,
      error: "No se pudo generar el temario. Intenta de nuevo.",
    };
  }
}

export async function createAiDraftCourse(
  input: CreateAiDraftCourseInput,
): Promise<CreateAiDraftCourseResult> {
  try {
    await requireAdmin();

    const parsed = createAiDraftCourseSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const category = await prisma.courseCategory.findUnique({
      where: { id: parsed.data.categoryId },
      select: { id: true },
    });

    if (!category) {
      return { ok: false, error: "La categoría seleccionada no existe." };
    }

    const slug = await resolveUniqueCourseSlug(parsed.data.title);

    const course = await prisma.$transaction(async (tx) => {
      const created = await tx.course.create({
        data: {
          slug,
          title: parsed.data.title,
          description: parsed.data.description,
          status: CourseStatus.DRAFT,
          priceCents: parsed.data.priceCents,
          categoryId: parsed.data.categoryId,
          level: parsed.data.level,
          offersCertificate: parsed.data.offersCertificate,
        },
        select: { id: true, slug: true, title: true },
      });

      const usedLessonSlugs = new Map<string, Set<string>>();

      for (const [modIdx, mod] of parsed.data.modules.entries()) {
        const courseModule = await tx.courseModule.create({
          data: {
            courseId: created.id,
            title: mod.title,
            position: modIdx,
          },
        });

        const moduleSlugs =
          usedLessonSlugs.get(courseModule.id) ?? new Set<string>();
        usedLessonSlugs.set(courseModule.id, moduleSlugs);

        for (const [lesIdx, lessonTitle] of mod.lessons.entries()) {
          let lessonSlug = resolveLessonSlug(lessonTitle, lesIdx);
          if (moduleSlugs.has(lessonSlug)) {
            lessonSlug = `${lessonSlug}-${lesIdx + 1}`;
          }
          moduleSlugs.add(lessonSlug);

          await tx.lesson.create({
            data: {
              moduleId: courseModule.id,
              title: lessonTitle,
              slug: lessonSlug,
              position: lesIdx,
            },
          });
        }
      }

      return created;
    });

    revalidatePath("/admin/courses");
    revalidatePath("/catalog");

    log.info(
      { courseId: course.id, slug: course.slug },
      "AI draft course created",
    );

    return { ok: true, course };
  } catch (error) {
    log.error(serializeError(error), "Failed to create AI draft course");
    return { ok: false, error: "No se pudo crear el curso." };
  }
}

export async function getAdminCourseForEdit(
  courseId: string,
): Promise<GetAdminCourseForEditResult> {
  try {
    await requireAdmin();

    const [course, categories] = await Promise.all([
      prisma.course.findUnique({
        where: { id: courseId },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          status: true,
          level: true,
          priceCents: true,
          categoryId: true,
          isFeatured: true,
          offersCertificate: true,
        },
      }),
      prisma.courseCategory.findMany({
        orderBy: { position: "asc" },
        select: { id: true, name: true },
      }),
    ]);

    if (!course) {
      return { ok: false, error: "Curso no encontrado." };
    }

    return {
      ok: true,
      course: {
        ...course,
        description: course.description ?? "",
      },
      categories,
    };
  } catch (error) {
    log.error(serializeError(error), "Failed to load course for edit");
    return { ok: false, error: "No se pudo cargar el curso." };
  }
}

export async function updateCourse(
  input: UpdateCourseInput,
): Promise<UpdateCourseResult> {
  try {
    await requireAdmin();

    const parsed = updateCourseSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const existing = await prisma.course.findUnique({
      where: { id: parsed.data.id },
      select: { id: true, slug: true },
    });

    if (!existing) {
      return { ok: false, error: "Curso no encontrado." };
    }

    if (parsed.data.categoryId) {
      const category = await prisma.courseCategory.findUnique({
        where: { id: parsed.data.categoryId },
        select: { id: true },
      });

      if (!category) {
        return { ok: false, error: "La categoría seleccionada no existe." };
      }
    }

    const slugConflict = await prisma.course.findFirst({
      where: {
        slug: parsed.data.slug,
        id: { not: parsed.data.id },
      },
      select: { id: true },
    });

    if (slugConflict) {
      return { ok: false, error: "Ese slug ya está en uso por otro curso." };
    }

    const slug =
      parsed.data.slug === existing.slug
        ? existing.slug
        : await resolveUniqueCourseSlug(parsed.data.slug, parsed.data.id);

    const updated = await prisma.course.update({
      where: { id: parsed.data.id },
      data: {
        title: parsed.data.title,
        slug,
        description: parsed.data.description || null,
        status: parsed.data.status,
        level: parsed.data.level,
        categoryId: parsed.data.categoryId,
        priceCents: parsed.data.priceCents,
        isFeatured: parsed.data.isFeatured,
        offersCertificate: parsed.data.offersCertificate,
      },
      select: { id: true, slug: true, title: true },
    });

    revalidatePath("/admin/courses");
    revalidatePath("/catalog");

    log.info({ courseId: updated.id, slug: updated.slug }, "Course updated");

    return { ok: true, course: updated };
  } catch (error) {
    log.error(serializeError(error), "Failed to update course");
    return { ok: false, error: "No se pudo actualizar el curso." };
  }
}
