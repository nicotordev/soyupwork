import { getStudentEnrolledCourses } from "@/app/actions/course-page.actions";
import { DashboardContainer } from "@/components/dashboard/dashboard-container";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { COURSE_PAGE } from "@/constants/course-page.constants";
import { adminPanelClass } from "@/lib/admin/styles";
import { formatCourseLevelDisplay } from "@/lib/catalog/course-level";
import { cn } from "@/lib/utils";
import { IconBooks } from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: COURSE_PAGE.dashboardTitle,
};

export default async function DashboardCoursesPage() {
  const courses = await getStudentEnrolledCourses();

  return (
    <DashboardContainer>
      <DashboardPageHeader
        eyebrow={COURSE_PAGE.dashboardEyebrow}
        icon={<IconBooks className="size-4" stroke={2.5} />}
        title={COURSE_PAGE.dashboardTitle}
        description={COURSE_PAGE.dashboardDescription}
      />
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
        <ul className="grid gap-3 sm:grid-cols-2">
          {courses.map((course) => (
            <li key={course.id}>
              <Link
                href={`/courses/${course.slug}`}
                className={cn(
                  adminPanelClass,
                  "flex gap-2.5 border-2 border-foreground p-2.5 sm:p-3 shadow-[3px_3px_0px_0px_var(--foreground)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--foreground)]",
                )}
              >
                <div className="relative size-11 sm:size-16 shrink-0 overflow-hidden rounded border border-foreground bg-muted">
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
                    <span className="flex size-full items-center justify-center font-mono text-[8px] sm:text-[9px] uppercase text-muted-foreground">
                      —
                    </span>
                  )}
                </div>
                <div className="min-w-0 space-y-0.5 sm:space-y-1 text-left">
                  <p className="truncate text-xs sm:text-sm md:text-base font-bold text-foreground">
                    {course.title}
                  </p>
                  <p className="font-mono text-[8px] sm:text-[10px] uppercase text-muted-foreground leading-none">
                    {formatCourseLevelDisplay(course.level)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardContainer>
  );
}
