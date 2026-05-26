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
import type { AdminCourseCurriculumData } from "@/types/admin-curriculum.types";
import { IconArrowLeft, IconSettings } from "@tabler/icons-react";
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
          className="inline-flex items-center gap-1 hover:text-foreground"
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
              onClick={() => setIsEditOpen(true)}
            >
              <IconSettings stroke={2.25} />
              Editar metadatos
            </Button>
          </div>
        </div>

        <div className="border-t-2 border-foreground px-4 py-3 font-mono text-[10px] font-bold uppercase text-muted-foreground">
          {data.course.moduleCount} módulos · {data.course.lessonCount}{" "}
          lecciones
          {!data.muxConfigured ? (
            <span className="ml-2 text-destructive">· Mux no configurado</span>
          ) : !data.muxStreamingEnabled ? (
            <span className="ml-2 text-amber-600">
              · Streaming deshabilitado
            </span>
          ) : null}
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
