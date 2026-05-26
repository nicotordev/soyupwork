import type { Prisma } from "@/generated/prisma/client";

export const adminCourseInclude = {
  category: { select: { name: true, slug: true } },
  instructor: { select: { firstName: true, lastName: true } },
  modules: {
    orderBy: { position: "asc" as const },
    select: {
      id: true,
      lessons: { select: { id: true } },
    },
  },
  _count: { select: { enrollments: true } },
} satisfies Prisma.CourseInclude;

export type DbAdminCourse = Prisma.CourseGetPayload<{
  include: typeof adminCourseInclude;
}>;
