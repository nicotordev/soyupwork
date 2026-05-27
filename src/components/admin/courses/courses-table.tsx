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
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { getCategoryPath } from "@/lib/catalog/category-paths";
import { cn } from "@/lib/utils";
import type { AdminCourseRow } from "@/types/admin-course.types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  IconCertificate,
  IconExternalLink,
  IconList,
  IconPencil,
  IconStar,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const columnHelper = createColumnHelper<AdminCourseRow>();

export function CoursesTable({
  courses,
  storageConfigured,
  maxThumbnailSizeMb,
}: CoursesTableProps) {
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

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("title", {
        header: "Curso",
        meta: {
          className: "w-[280px]",
        },
        cell: (info) => {
          const course = info.row.original;
          return (
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
          );
        },
      }),
      columnHelper.accessor("categoryName", {
        header: "Categoría",
        meta: {
          className: "hidden md:table-cell",
        },
        cell: (info) => {
          const val = info.getValue();
          return val ?? <span className="text-muted-foreground">—</span>;
        },
      }),
      columnHelper.accessor("status", {
        header: "Estado",
        cell: (info) => {
          const status = info.getValue();
          return (
            <Badge
              variant={ADMIN_COURSE_STATUS_VARIANTS[status]}
              className="font-mono text-[10px] uppercase"
            >
              {ADMIN_COURSE_STATUS_LABELS[status]}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("levelLabel", {
        header: "Nivel",
        meta: {
          className: "hidden lg:table-cell",
        },
        cell: (info) => (
          <span className="font-mono text-[10px] font-bold uppercase">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("priceLabel", {
        header: "Precio",
        cell: (info) => (
          <span className="font-mono text-xs font-bold">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "content",
        header: "Contenido",
        meta: {
          className: "hidden sm:table-cell",
        },
        cell: (info) => {
          const course = info.row.original;
          return (
            <span className="text-xs text-muted-foreground">
              {formatAdminCourseContentSummary(
                course.moduleCount,
                course.lessonCount,
              )}
            </span>
          );
        },
      }),
      columnHelper.accessor("enrollmentCount", {
        header: "Inscripciones",
        meta: {
          className: "hidden xl:table-cell",
        },
        cell: (info) => (
          <span className="font-mono text-xs font-bold">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("updatedAt", {
        header: "Actualizado",
        meta: {
          className: "hidden lg:table-cell",
        },
        cell: (info) => (
          <span className="text-muted-foreground">
            {formatDashboardRelativeTime(info.getValue())}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Acciones",
        meta: {
          className: "text-right",
        },
        cell: (info) => {
          const course = info.row.original;
          const href = catalogHref(course);

          return (
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCoursePendingDelete(course)}
                    disabled={isDeleting}
                    aria-label={`Eliminar ${course.title}`}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <IconTrash stroke={2.25} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Eliminar</TooltipContent>
              </Tooltip>
            </div>
          );
        },
      }),
    ];
  }, [storageConfigured, maxThumbnailSizeMb, isDeleting, router]);

  const table = useReactTable({
    data: courses,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-foreground/20 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    | { className?: string }
                    | undefined;
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "font-mono text-[10px] uppercase",
                        meta?.className,
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-foreground/15">
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as
                    | { className?: string }
                    | undefined;
                  return (
                    <TableCell key={cell.id} className={meta?.className}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

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
