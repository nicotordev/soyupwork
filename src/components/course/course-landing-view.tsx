import { CoursePreviewBanner } from "@/components/course/course-preview-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COURSE_PAGE } from "@/constants/course-page.constants";
import { adminBrutalButtonClass, adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { CoursePageData } from "@/types/course-page.types";
import { IconBook, IconCertificate, IconLock } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

type CourseLandingViewProps = {
  data: CoursePageData;
  buildLessonHref: (lessonSlug: string) => string;
  courseLandingHref: string;
};

export function CourseLandingView({
  data,
  buildLessonHref,
}: CourseLandingViewProps) {
  const { view, mode } = data;
  const continueHref = view.firstLessonSlug
    ? buildLessonHref(view.firstLessonSlug)
    : null;

  return (
    <div className="flex min-h-svh flex-col">
      {mode === "adminPreview" ? (
        <CoursePreviewBanner courseId={view.id} />
      ) : null}

      <div className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 py-8 sm:px-6">
        <header className="space-y-6">
          {view.thumbnailUrl ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)]">
              <Image
                src={view.thumbnailUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
                unoptimized
              />
            </div>
          ) : null}

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {view.categoryName ? (
                <Badge
                  variant="outline"
                  className="font-mono text-[9px] uppercase"
                >
                  {view.categoryName}
                </Badge>
              ) : null}
              <Badge
                variant="secondary"
                className="font-mono text-[9px] uppercase"
              >
                {view.levelLabel}
              </Badge>
              <span className="font-mono text-xs font-bold">
                {view.priceLabel}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {view.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {view.instructorName}
            </p>
            {view.description ? (
              <p className="text-sm leading-relaxed text-foreground/90">
                {view.description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] font-bold uppercase text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <IconBook className="size-3.5 text-primary" stroke={2.25} />
              {view.moduleCount} módulos · {view.lessonCount} lecciones
            </span>
            {view.offersCertificate ? (
              <span className="inline-flex items-center gap-1">
                <IconCertificate
                  className="size-3.5 text-primary"
                  stroke={2.25}
                />
                Certificado
              </span>
            ) : null}
          </div>

          {continueHref ? (
            <Button asChild className={adminBrutalButtonClass}>
              <Link href={continueHref}>
                {view.hasFullAccess || mode === "adminPreview"
                  ? COURSE_PAGE.continueLabel
                  : COURSE_PAGE.startLabel}
              </Link>
            </Button>
          ) : (
            <p className="font-mono text-xs text-muted-foreground">
              {COURSE_PAGE.noLessonsYet}
            </p>
          )}

          {mode === "student" && !view.hasFullAccess && !view.isFree ? (
            <p className="text-sm text-muted-foreground">
              {COURSE_PAGE.enrollCta}
            </p>
          ) : null}
        </header>

        <section
          className={cn(
            adminPanelClass,
            "border-2 border-foreground p-4 sm:p-6",
          )}
        >
          <h2 className="mb-4 font-mono text-xs font-bold uppercase">
            {COURSE_PAGE.syllabusTitle}
          </h2>
          <div className="space-y-4">
            {view.modules.map((module, moduleIndex) => (
              <div key={module.id}>
                <h3 className="mb-2 font-semibold">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {moduleIndex + 1}.{" "}
                  </span>
                  {module.title}
                </h3>
                <ul className="space-y-1">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const href = lesson.isAccessible
                      ? buildLessonHref(lesson.slug)
                      : null;

                    const row = (
                      <span className="flex flex-1 items-center gap-2 text-sm">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {lessonIndex + 1}.
                        </span>
                        <span
                          className={
                            lesson.isAccessible ? "" : "text-muted-foreground"
                          }
                        >
                          {lesson.title}
                        </span>
                        {lesson.isPreview && !view.hasFullAccess ? (
                          <Badge
                            variant="outline"
                            className="font-mono text-[8px] uppercase"
                          >
                            {COURSE_PAGE.previewLessonBadge}
                          </Badge>
                        ) : null}
                        {!lesson.isAccessible ? (
                          <IconLock
                            className="size-3.5 text-muted-foreground"
                            stroke={2.25}
                          />
                        ) : null}
                      </span>
                    );

                    if (!href) {
                      return (
                        <li
                          key={lesson.id}
                          className="flex items-center rounded px-2 py-1.5 opacity-60"
                        >
                          {row}
                        </li>
                      );
                    }

                    return (
                      <li key={lesson.id}>
                        <Link
                          href={href}
                          className="flex items-center rounded border border-transparent px-2 py-1.5 transition-colors hover:border-foreground/25 hover:bg-muted/50"
                        >
                          {row}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
