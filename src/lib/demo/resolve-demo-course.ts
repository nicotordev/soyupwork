import { CourseStatus } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";

export function getDemoCourseSlugFromEnv(): string | undefined {
  const slug = process.env.DEMO_COURSE_SLUG?.trim();
  return slug || undefined;
}

/** Published course slug used when visiting `/demo` without a slug. */
export async function resolveDefaultDemoCourseSlug(): Promise<string | null> {
  const fromEnv = getDemoCourseSlugFromEnv();

  if (fromEnv) {
    const course = await prisma.course.findFirst({
      where: { slug: fromEnv, status: CourseStatus.PUBLISHED },
      select: { slug: true },
    });
    if (course) return course.slug;
  }

  const fallback = await prisma.course.findFirst({
    where: {
      status: CourseStatus.PUBLISHED,
      modules: { some: { lessons: { some: {} } } },
    },
    orderBy: { updatedAt: "desc" },
    select: { slug: true },
  });

  return fallback?.slug ?? null;
}
