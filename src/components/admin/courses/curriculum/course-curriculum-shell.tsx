"use client";

import { CourseEditDialog } from "@/components/admin/courses/course-edit-dialog";
import { CurriculumModulesList } from "@/components/admin/courses/curriculum/curriculum-modules-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ADMIN_COURSE_STATUS_LABELS,
  ADMIN_COURSE_STATUS_VARIANTS,
} from "@/constants/courses.constants";
import { ADMIN_CURRICULUM_PAGE } from "@/constants/curriculum.constants";
import {
  adminBrutalButtonClass,
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { AdminCourseCurriculumData } from "@/types/admin-curriculum.types";
import { IconArrowLeft, IconEye, IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

type CourseCurriculumShellProps = {
  data: AdminCourseCurriculumData;
};

export function CourseCurriculumShell({ data }: CourseCurriculumShellProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="space-y-6">
      <nav className="font-mono text-xs font-bold uppercase text-muted-foreground">
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-1 transition-all duration-200 hover:-translate-x-0.5 hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" stroke={2.25} />
          {ADMIN_CURRICULUM_PAGE.backLabel}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{data.course.title}</span>
      </nav>

      <section className={adminPanelClass}>
        <div className={adminPanelHeaderClass}>
          <div className="space-y-1">
            <p className="font-mono text-[10px] font-bold uppercase text-primary">
              {ADMIN_CURRICULUM_PAGE.eyebrow}
            </p>
            <h1 className={adminPanelTitleClass}>{data.course.title}</h1>
            <p className="font-mono text-[10px] text-muted-foreground">
              /{data.course.slug}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={ADMIN_COURSE_STATUS_VARIANTS[data.course.status]}
              className="font-mono text-[10px] uppercase"
            >
              {ADMIN_COURSE_STATUS_LABELS[data.course.status]}
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={adminBrutalButtonClass}
              asChild
            >
              <Link
                href={`/admin/courses/${data.course.id}/preview`}
                target="_blank"
                rel="noopener noreferrer"
                title={ADMIN_CURRICULUM_PAGE.previewOpenHint}
              >
                <IconEye stroke={2.25} />
                {ADMIN_CURRICULUM_PAGE.previewLabel}
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(adminBrutalButtonClass, "group")}
              onClick={() => setIsEditOpen(true)}
            >
              <IconSettings
                className="size-4 transition-transform duration-500 ease-out group-hover:rotate-90"
                stroke={2.25}
              />
              Editar metadatos
            </Button>
          </div>
        </div>

        <div className="border-t-2 border-foreground px-4 py-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] font-bold uppercase">
          <span className="text-muted-foreground">
            {data.course.moduleCount} módulos · {data.course.lessonCount}{" "}
            lecciones
          </span>
          <div className="flex items-center gap-2">
            {!data.muxConfigured ? (
              <span className="inline-flex items-center gap-1.5 rounded border border-destructive bg-destructive/10 px-2.5 py-0.5 text-destructive animate-pulse">
                <span className="size-1.5 rounded-full bg-destructive" />
                Mux no configurado
              </span>
            ) : !data.muxStreamingEnabled ? (
              <span className="inline-flex items-center gap-1.5 rounded border border-amber-500 bg-amber-500/10 px-2.5 py-0.5 text-amber-600 dark:text-amber-500">
                <span className="size-1.5 rounded-full bg-amber-500 animate-ping" />
                Streaming deshabilitado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded border border-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-600 dark:text-emerald-500">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Streaming activo
              </span>
            )}
          </div>
        </div>
      </section>

      <CurriculumModulesList data={data} />

      <CourseEditDialog
        courseId={isEditOpen ? data.course.id : null}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
}
