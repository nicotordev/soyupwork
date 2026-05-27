"use client";

import { deleteCourse } from "@/app/actions/courses.actions";
import {
  ADMIN_COURSES_PAGE,
  ADMIN_COURSE_STATUS_LABELS,
  ADMIN_COURSE_STATUS_VARIANTS,
} from "@/constants/courses.constants";
import {
  formatAdminCourseContentSummary,
  formatDashboardRelativeTime,
} from "@/lib/admin/formatters";
import {
  adminBrutalButtonClass,
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { getCategoryPath } from "@/lib/catalog/category-paths";
import { cn } from "@/lib/utils";
import type { AdminCourseRow } from "@/types/admin-course.types";
import {
  Award,
  ExternalLink,
  List,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "@/lib/toast";

import { CourseEditDialog } from "@/components/admin/courses/course-edit-dialog";
import { CourseThumbnailCell } from "@/components/admin/courses/course-thumbnail-cell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CoursesCardsProps = {
  courses: AdminCourseRow[];
  storageConfigured: boolean;
  maxThumbnailSizeMb: number;
};

function catalogHref(course: AdminCourseRow): string | null {
  if (course.status !== "PUBLISHED") return null;
  if (course.categorySlug) {
    return getCategoryPath(course.categorySlug);
  }
  if (course.title) {
    return `/catalog?q=${encodeURIComponent(course.title)}`;
  }
  return "/catalog";
}

export function CoursesCards({
  courses,
  storageConfigured,
  maxThumbnailSizeMb,
}: CoursesCardsProps) {
  const router = useRouter();
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [coursePendingDelete, setCoursePendingDelete] =
    useState<AdminCourseRow | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleDeleteCourse = () => {
    if (!coursePendingDelete) return;

    startDeleteTransition(async () => {
      const result = await deleteCourse({ id: coursePendingDelete.id });
      if (!result.ok) {
        toast.error(result.error ?? ADMIN_COURSES_PAGE.deleteCourseError);
        return;
      }

      toast.success(
        ADMIN_COURSES_PAGE.deleteCourseSuccess(result.course.title),
      );
      setCoursePendingDelete(null);
      router.refresh();
    });
  };

  return (
    <>
      <section
        className={cn(adminPanelClass, "border-b-0 rounded-b-none pb-0")}
        aria-labelledby="courses-cards-title"
      >
        <div className={adminPanelHeaderClass}>
          <div>
            <h2 id="courses-cards-title" className={adminPanelTitleClass}>
              Vista de Tarjetas
            </h2>
            <p className="text-xs text-muted-foreground">
              Ordenados por última actualización
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
        {courses.map((course) => {
          const href = catalogHref(course);

          return (
            <article
              key={course.id}
              className={cn(
                "border-2 border-foreground bg-card rounded-lg flex flex-col h-full overflow-hidden",
                "shadow-[4px_4px_0px_0px_var(--foreground)] transition-all",
                "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--foreground)]",
              )}
            >
              {/* Card Header (Title & Image) */}
              <div className="flex items-start justify-between gap-3 p-4 border-b-2 border-foreground bg-muted/40">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="font-heading text-sm font-extrabold truncate" title={course.title}>
                      {course.title}
                    </h3>
                    {course.isFeatured ? (
                      <Star
                        className="size-3.5 shrink-0 text-primary animate-pulse"
                       
                        aria-label="Destacado"
                      />
                    ) : null}
                    {course.offersCertificate ? (
                      <Award
                        className="size-3.5 shrink-0 text-primary"
                       
                        aria-label="Con certificado"
                      />
                    ) : null}
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground truncate">
                    /{course.slug}
                  </p>
                  <p className="line-clamp-1 text-[11px] text-muted-foreground">
                    {course.instructorName}
                  </p>
                </div>
                <CourseThumbnailCell
                  courseId={course.id}
                  courseTitle={course.title}
                  thumbnailUrl={course.thumbnailUrl}
                  storageConfigured={storageConfigured}
                  maxSizeMb={maxThumbnailSizeMb}
                  onUpdated={() => router.refresh()}
                />
              </div>

              {/* Category & Status */}
              <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2 bg-card">
                <span className="font-mono text-[9px] font-bold uppercase text-muted-foreground truncate max-w-[65%]">
                  {course.categoryName ?? "Sin categoría"}
                </span>
                <Badge
                  variant={ADMIN_COURSE_STATUS_VARIANTS[course.status]}
                  className="font-mono text-[9px] uppercase tracking-wide shrink-0"
                >
                  {ADMIN_COURSE_STATUS_LABELS[course.status]}
                </Badge>
              </div>

              {/* Specs Body */}
              <div className="p-4 flex-1 space-y-2.5 font-mono text-xs bg-card">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Nivel</span>
                  <span className="font-extrabold uppercase text-[11px]">{course.levelLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Precio</span>
                  <span className="font-extrabold text-[11px] text-primary">{course.priceLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Contenido</span>
                  <span className="font-medium text-[11px] text-foreground">
                    {formatAdminCourseContentSummary(course.moduleCount, course.lessonCount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Inscripciones</span>
                  <span className="font-extrabold text-[11px]">{course.enrollmentCount}</span>
                </div>
              </div>

              {/* Timestamp Footer */}
              <div className="px-4 py-2 border-t border-foreground/10 bg-muted/10 flex justify-between items-center text-[9px] font-mono text-muted-foreground">
                <span>Actualizado</span>
                <span>{formatDashboardRelativeTime(course.updatedAt)}</span>
              </div>

              {/* Actions Footer */}
              <div className="border-t-2 border-foreground bg-muted p-2 flex justify-end gap-1.5 mt-auto">
                {href ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Link
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Ver en catálogo"
                        >
                          <ExternalLink className="size-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Catálogo</TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        aria-label="Catálogo"
                        className="h-8 w-8 p-0"
                      >
                        <ExternalLink className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Catálogo</TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Link
                        href={`/admin/courses/${course.id}/curriculum`}
                        aria-label={`Contenido de ${course.title}`}
                      >
                        <List className="size-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Contenido</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCourseId(course.id)}
                      aria-label={`Editar ${course.title}`}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Editar</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCoursePendingDelete(course)}
                      disabled={isDeleting}
                      aria-label={`Eliminar ${course.title}`}
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Eliminar</TooltipContent>
                </Tooltip>
              </div>
            </article>
          );
        })}
      </div>

      <CourseEditDialog
        courseId={editingCourseId}
        onClose={() => setEditingCourseId(null)}
      />

      <AlertDialog
        open={coursePendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setCoursePendingDelete(null);
        }}
      >
        <AlertDialogContent className="border-2 border-foreground shadow-[6px_6px_0px_0px_var(--foreground)] sm:max-w-md">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-base font-extrabold">
              {ADMIN_COURSES_PAGE.deleteCourseTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {coursePendingDelete
                ? ADMIN_COURSES_PAGE.deleteCourseDescription(
                    coursePendingDelete.title,
                    coursePendingDelete.enrollmentCount,
                  )
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {ADMIN_COURSES_PAGE.deleteCourseCancel}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting || !coursePendingDelete}
              onClick={(event) => {
                event.preventDefault();
                handleDeleteCourse();
              }}
            >
              {isDeleting
                ? "Eliminando..."
                : ADMIN_COURSES_PAGE.deleteCourseConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
