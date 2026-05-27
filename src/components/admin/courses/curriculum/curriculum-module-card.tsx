"use client";

import {
  createLesson,
  deleteLesson,
  deleteModule,
  reorderLesson,
  reorderModule,
  updateModule,
} from "@/app/actions/curriculum.actions";
import { CurriculumLessonRow } from "@/components/admin/courses/curriculum/curriculum-lesson-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ADMIN_CURRICULUM_PAGE } from "@/constants/curriculum.constants";
import { adminBrutalButtonClass, adminInputClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { AdminCurriculumModule } from "@/types/admin-curriculum.types";
import {
  IconChevronDown,
  IconChevronUp,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type CurriculumModuleCardProps = {
  module: AdminCurriculumModule;
  moduleIndex: number;
  moduleCount: number;
  courseId: string;
  expandedLessonId: string | null;
  maxVideoSizeMb: number;
  muxConfigured: boolean;
  muxStreamingEnabled: boolean;
  onExpandLesson: (lessonId: string | null) => void;
};

export function CurriculumModuleCard({
  module,
  moduleIndex,
  moduleCount,
  courseId,
  expandedLessonId,
  maxVideoSizeMb,
  muxConfigured,
  muxStreamingEnabled,
  onExpandLesson,
}: CurriculumModuleCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(module.title);

  const refresh = () => router.refresh();

  const saveTitle = () => {
    if (title.trim() === module.title) return;

    startTransition(async () => {
      const result = await updateModule({
        id: module.id,
        courseId,
        title: title.trim(),
        description: module.description,
      });

      if (!result.ok) {
        toast.error(result.error);
        setTitle(module.title);
        return;
      }

      toast.success("Módulo actualizado");
      refresh();
    });
  };

  const handleAddLesson = (lessonType: "VIDEO" | "QUIZ" = "VIDEO") => {
    startTransition(async () => {
      const nextIndex = module.lessons.length + 1;
      const result = await createLesson({
        moduleId: module.id,
        courseId,
        title:
          lessonType === "QUIZ" ? `Quiz ${nextIndex}` : `Lección ${nextIndex}`,
        type: lessonType,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(
        lessonType === "QUIZ" ? "Lección quiz creada" : "Lección creada",
      );
      refresh();
    });
  };

  const handleDeleteModule = () => {
    if (
      !window.confirm(
        `¿Eliminar el módulo "${module.title}" y todas sus lecciones?`,
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteModule({ id: module.id, courseId });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Módulo eliminado");
      refresh();
    });
  };

  const handleMoveModule = (direction: "up" | "down") => {
    startTransition(async () => {
      const result = await reorderModule({
        id: module.id,
        courseId,
        direction,
      });
      if (!result.ok) toast.error(result.error);
      else refresh();
    });
  };

  const handleMoveLesson = (lessonId: string, direction: "up" | "down") => {
    startTransition(async () => {
      const result = await reorderLesson({
        id: lessonId,
        courseId,
        direction,
      });
      if (!result.ok) toast.error(result.error);
      else refresh();
    });
  };

  const handleDeleteLesson = (lessonId: string, lessonTitle: string) => {
    if (!window.confirm(`¿Eliminar la lección "${lessonTitle}"?`)) return;

    startTransition(async () => {
      const result = await deleteLesson({ id: lessonId, courseId });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      if (expandedLessonId === lessonId) onExpandLesson(null);
      toast.success("Lección eliminada");
      refresh();
    });
  };

  return (
    <article
      className={cn(
        "space-y-4 rounded border-2 border-foreground bg-card/45 backdrop-blur-xs p-4 shadow-[4px_4px_0px_0px_var(--foreground)]",
        "transition-all duration-300 hover:shadow-[5px_5px_0px_0px_var(--foreground)]",
        isPending && "opacity-70",
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[10px] font-extrabold uppercase text-primary bg-primary/10 border border-primary/20 rounded px-2 py-0.5">
          Módulo {moduleIndex + 1}
        </span>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          className={cn(
            adminInputClass,
            "h-9 flex-1 min-w-[200px] text-sm font-heading font-extrabold tracking-tight",
            "focus-visible:bg-background/95 transition-all duration-200"
          )}
        />
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={moduleIndex === 0 || isPending}
            className={cn(
              adminBrutalButtonClass,
              "transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-500"
            )}
            onClick={() => handleMoveModule("up")}
            aria-label="Subir módulo"
          >
            <IconChevronUp stroke={2.5} className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={moduleIndex >= moduleCount - 1 || isPending}
            className={cn(
              adminBrutalButtonClass,
              "transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-blue-500/10 hover:text-blue-500"
            )}
            onClick={() => handleMoveModule("down")}
            aria-label="Bajar módulo"
          >
            <IconChevronDown stroke={2.5} className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={isPending}
            className={cn(
              adminBrutalButtonClass,
              "text-destructive transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-destructive/10"
            )}
            onClick={handleDeleteModule}
            aria-label="Eliminar módulo"
          >
            <IconTrash stroke={2.5} className="size-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2.5">
        {module.lessons.map((lesson, lessonIndex) => (
          <CurriculumLessonRow
            key={lesson.id}
            lesson={lesson}
            courseId={courseId}
            moduleIndex={moduleIndex}
            lessonIndex={lessonIndex}
            lessonCount={module.lessons.length}
            isExpanded={expandedLessonId === lesson.id}
            maxVideoSizeMb={maxVideoSizeMb}
            muxConfigured={muxConfigured}
            muxStreamingEnabled={muxStreamingEnabled}
            onToggle={() =>
              onExpandLesson(expandedLessonId === lesson.id ? null : lesson.id)
            }
            onMove={(direction) => handleMoveLesson(lesson.id, direction)}
            onDelete={() => handleDeleteLesson(lesson.id, lesson.title)}
            onUpdated={refresh}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          className={cn(
            adminBrutalButtonClass,
            "inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase transition-all duration-200 hover:bg-secondary hover:scale-[1.02] active:scale-95"
          )}
          onClick={() => handleAddLesson("VIDEO")}
        >
          <IconPlus className="size-3.5" stroke={2.5} />
          {ADMIN_CURRICULUM_PAGE.addLessonLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          className={cn(
            adminBrutalButtonClass,
            "inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase transition-all duration-200 hover:bg-secondary hover:scale-[1.02] active:scale-95"
          )}
          onClick={() => handleAddLesson("QUIZ")}
        >
          <IconPlus stroke={2.25} />
          {ADMIN_CURRICULUM_PAGE.addQuizLessonLabel}
        </Button>
      </div>
    </article>
  );
}
