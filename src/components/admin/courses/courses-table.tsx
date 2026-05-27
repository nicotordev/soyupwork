"use client";

import {
  ADMIN_COURSE_STATUS_LABELS,
  ADMIN_COURSE_STATUS_VARIANTS,
} from "@/constants/courses.constants";
import {
  formatAdminCourseContentSummary,
  formatDashboardRelativeTime,
} from "@/lib/admin/formatters";
import {
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { getCategoryPath } from "@/lib/catalog/category-paths";
import type { AdminCourseRow } from "@/types/admin-course.types";
import {
  IconCertificate,
  IconExternalLink,
  IconList,
  IconPencil,
  IconStar,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CourseEditDialog } from "@/components/admin/courses/course-edit-dialog";
import { CourseThumbnailCell } from "@/components/admin/courses/course-thumbnail-cell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type CoursesTableProps = {
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

export function CoursesTable({
  courses,
  storageConfigured,
  maxThumbnailSizeMb,
}: CoursesTableProps) {
  const router = useRouter();
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  return (
    <>
      <section
        className={adminPanelClass}
        aria-labelledby="courses-table-title"
      >
        <div className={adminPanelHeaderClass}>
          <div>
            <h2 id="courses-table-title" className={adminPanelTitleClass}>
              Listado de cursos
            </h2>
            <p className="text-xs text-muted-foreground">
              Ordenados por última actualización
            </p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-foreground/20 hover:bg-transparent">
              <TableHead className="w-[280px] font-mono text-[10px] uppercase">
                Curso
              </TableHead>
              <TableHead className="hidden font-mono text-[10px] uppercase md:table-cell">
                Categoría
              </TableHead>
              <TableHead className="font-mono text-[10px] uppercase">
                Estado
              </TableHead>
              <TableHead className="hidden font-mono text-[10px] uppercase lg:table-cell">
                Nivel
              </TableHead>
              <TableHead className="font-mono text-[10px] uppercase">
                Precio
              </TableHead>
              <TableHead className="hidden font-mono text-[10px] uppercase sm:table-cell">
                Contenido
              </TableHead>
              <TableHead className="hidden font-mono text-[10px] uppercase xl:table-cell">
                Inscripciones
              </TableHead>
              <TableHead className="hidden font-mono text-[10px] uppercase lg:table-cell">
                Actualizado
              </TableHead>
              <TableHead className="text-right font-mono text-[10px] uppercase">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => {
              const href = catalogHref(course);

              return (
                <TableRow key={course.id} className="border-foreground/15">
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <CourseThumbnailCell
                        courseId={course.id}
                        courseTitle={course.title}
                        thumbnailUrl={course.thumbnailUrl}
                        storageConfigured={storageConfigured}
                        maxSizeMb={maxThumbnailSizeMb}
                        onUpdated={() => router.refresh()}
                      />
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="truncate font-semibold">
                            {course.title}
                          </p>
                          {course.isFeatured ? (
                            <IconStar
                              className="size-3.5 shrink-0 text-primary"
                              stroke={2.5}
                              aria-label="Destacado"
                            />
                          ) : null}
                          {course.offersCertificate ? (
                            <IconCertificate
                              className="size-3.5 shrink-0 text-primary"
                              stroke={2.5}
                              aria-label="Con certificado"
                            />
                          ) : null}
                        </div>
                        <p className="truncate font-mono text-[10px] text-muted-foreground">
                          /{course.slug}
                        </p>
                        <p className="line-clamp-1 text-xs text-muted-foreground md:hidden">
                          {course.instructorName}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {course.categoryName ?? (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={ADMIN_COURSE_STATUS_VARIANTS[course.status]}
                      className="font-mono text-[10px] uppercase"
                    >
                      {ADMIN_COURSE_STATUS_LABELS[course.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="font-mono text-[10px] font-bold uppercase">
                      {course.levelLabel}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold">
                    {course.priceLabel}
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                    {formatAdminCourseContentSummary(
                      course.moduleCount,
                      course.lessonCount,
                    )}
                  </TableCell>
                  <TableCell className="hidden font-mono text-xs font-bold xl:table-cell">
                    {course.enrollmentCount}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {formatDashboardRelativeTime(course.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {href ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button asChild variant="outline" size="sm">
                              <Link
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Ver en catálogo"
                              >
                                <IconExternalLink stroke={2.25} />
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
                            >
                              <IconExternalLink stroke={2.25} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Catálogo</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button asChild variant="outline" size="sm">
                            <Link
                              href={`/admin/courses/${course.id}/curriculum`}
                              aria-label={`Contenido de ${course.title}`}
                            >
                              <IconList stroke={2.25} />
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
                          >
                            <IconPencil stroke={2.25} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>

      <CourseEditDialog
        courseId={editingCourseId}
        onClose={() => setEditingCourseId(null)}
      />
    </>
  );
}
