import { COURSE_PAGE } from "@/constants/course-page.constants";
import type { CoursePageView } from "@/types/course-page.types";
import {
  Check,
  ChevronRight,
  CirclePlay,
  Clock3,
  Download,
  FileText,
  HelpCircle,
  Lock,
} from "lucide-react";
import Link from "next/link";

const LESSON_TYPE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  VIDEO: CirclePlay,
  TEXT: FileText,
  QUIZ: HelpCircle,
  DOWNLOAD: Download,
};

type CourseLandingSyllabusProps = {
  view: CoursePageView;
  hasAnyLessons: boolean;
  buildLessonHref: (lessonSlug: string) => string;
};

export function CourseLandingSyllabus({
  view,
  hasAnyLessons,
  buildLessonHref,
}: CourseLandingSyllabusProps) {
  return (
    <section
      id="curriculum"
      aria-labelledby="curriculum-title"
      className="space-y-5 pt-12"
    >
      <h2 id="curriculum-title" className="text-2xl font-black sm:text-3xl">
        Curriculum estratégico
      </h2>
      <p className="max-w-3xl text-sm text-muted-foreground">
        Cada módulo combina lecciones accionables, plantillas descargables,
        quizzes y proyectos de implementación real.
      </p>

      {hasAnyLessons ? (
        <div className="space-y-4">
          {view.modules.map((module, moduleIndex) => (
            <div
              key={module.id}
              className="overflow-hidden rounded-2xl border border-foreground/10 bg-card"
            >
              <div className="flex items-center justify-between border-b border-foreground/10 bg-muted/40 px-4 py-3">
                <div>
                  <p className="font-mono text-[10px] uppercase text-muted-foreground">
                    Módulo {moduleIndex + 1}
                  </p>
                  <p className="text-sm font-semibold">{module.title}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {module.lessons.length} lecciones
                </span>
              </div>
              <ul className="divide-y divide-foreground/10">
                {module.lessons.map((lesson, lessonIndex) => {
                  const href = lesson.isAccessible
                    ? buildLessonHref(lesson.slug)
                    : null;
                  const LessonIcon = LESSON_TYPE_ICONS[lesson.type] || FileText;
                  const completed = view.hasFullAccess && lessonIndex % 4 === 0;
                  const row = (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {lessonIndex + 1}.
                        </span>
                        <LessonIcon className="size-4 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium whitespace-normal break-words">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-muted-foreground whitespace-normal break-words">
                            {lesson.description ||
                              "Lección práctica orientada a ejecución."}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson.isPreview && !view.hasFullAccess ? (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary">
                            Preview
                          </span>
                        ) : null}
                        {moduleIndex === 2 && lessonIndex === 1 ? (
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-600">
                            Most important
                          </span>
                        ) : null}
                        {lesson.type === "DOWNLOAD" ? (
                          <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] text-blue-600">
                            Template
                          </span>
                        ) : null}
                        {completed ? (
                          <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-500/15">
                            <Check className="size-4 text-emerald-600" />
                          </span>
                        ) : !lesson.isAccessible ? (
                          <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted">
                            <Lock className="size-3.5 text-muted-foreground" />
                          </span>
                        ) : (
                          <ChevronRight className="size-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  );

                  if (!href) {
                    return (
                      <li
                        key={lesson.id}
                        className="bg-muted/10 px-4 py-3 opacity-70"
                      >
                        {row}
                      </li>
                    );
                  }

                  return (
                    <li
                      key={lesson.id}
                      className="px-4 py-3 transition hover:bg-primary/5"
                    >
                      <Link href={href}>{row}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-foreground/20 bg-card p-5">
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="size-4" />
            {COURSE_PAGE.noLessonsYet}
          </p>
        </div>
      )}
    </section>
  );
}
