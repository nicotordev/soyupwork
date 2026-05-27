import { getStudentEnrolledCourses } from "@/app/actions/course-page.actions";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-shell";
import { COURSE_PAGE } from "@/constants/course-page.constants";
import type { CourseLevel } from "@/generated/prisma/client";
import { adminPanelClass } from "@/lib/admin/styles";
import { courseLevelLabel } from "@/lib/catalog/course-level";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: COURSE_PAGE.dashboardTitle,
};

export default async function DashboardCoursesPage() {
  const courses = await getStudentEnrolledCourses();

  return (
    <>
      <DashboardPageHeader
        title={COURSE_PAGE.dashboardTitle}
        description={COURSE_PAGE.dashboardDescription}
      />
      <div className="mx-auto max-w-6xl px-4 py-8">
        {courses.length === 0 ? (
          <div
            className={cn(
              adminPanelClass,
              "border-2 border-dashed border-foreground/40 p-8 text-center",
            )}
          >
            <p className="text-sm text-muted-foreground">
              Aún no estás inscrito en ningún curso.{" "}
              <Link
                href="/catalog"
                className="font-semibold text-primary underline"
              >
                Explora el catálogo
              </Link>
              .
            </p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {courses.map((course) => (
              <li key={course.id}>
                <Link
                  href={`/dashboard/courses/${course.slug}`}
                  className={cn(
                    adminPanelClass,
                    "flex gap-3 border-2 border-foreground p-3 shadow-[3px_3px_0px_0px_var(--foreground)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--foreground)]",
                  )}
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded border border-foreground bg-muted">
                    {course.thumbnailUrl ? (
                      <Image
                        src={course.thumbnailUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                        unoptimized
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center font-mono text-[9px] uppercase text-muted-foreground">
                        —
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="truncate font-semibold">{course.title}</p>
                    <p className="font-mono text-[10px] uppercase text-muted-foreground">
                      {courseLevelLabel(course.level as CourseLevel)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
