"use client";

import { LessonEditPanel } from "@/components/admin/courses/curriculum/lesson-edit-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ADMIN_CURRICULUM_PAGE,
  LESSON_TYPE_LABELS,
  LESSON_VIDEO_STATUS_LABELS,
  LESSON_VIDEO_STATUS_VARIANTS,
} from "@/constants/curriculum.constants";
import { cn } from "@/lib/utils";
import type { AdminCurriculumLesson } from "@/types/admin-curriculum.types";
import {
  IconChevronDown,
  IconChevronUp,
  IconTrash,
  IconPlayerPlayFilled,
  IconFileText,
  IconClipboardCheck,
} from "@tabler/icons-react";

type CurriculumLessonRowProps = {
  lesson: AdminCurriculumLesson;
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
  lessonCount: number;
  isExpanded: boolean;
  maxVideoSizeMb: number;
  muxConfigured: boolean;
  muxStreamingEnabled: boolean;
  onToggle: () => void;
  onMove: (direction: "up" | "down") => void;
  onDelete: () => void;
  onUpdated: () => void;
};

const typeConfigs = {
  VIDEO: {
    icon: IconPlayerPlayFilled,
    bgClass: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30 dark:text-cyan-400 dark:bg-cyan-500/20",
  },
  TEXT: {
    icon: IconFileText,
    bgClass: "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400 dark:bg-amber-500/20",
  },
  QUIZ: {
    icon: IconClipboardCheck,
    bgClass: "bg-purple-500/10 text-purple-600 border-purple-500/30 dark:text-purple-400 dark:bg-purple-500/20",
  },
} as const;

export function CurriculumLessonRow({
  lesson,
  courseId,
  lessonIndex,
  lessonCount,
  isExpanded,
  maxVideoSizeMb,
  muxConfigured,
  muxStreamingEnabled,
  onToggle,
  onMove,
  onDelete,
  onUpdated,
}: CurriculumLessonRowProps) {
  const config = typeConfigs[lesson.type as keyof typeof typeConfigs] || typeConfigs.TEXT;
  const TypeIcon = config.icon;

  return (
    <div
      className={cn(
        "rounded border-2 border-foreground bg-background transition-all duration-200",
        "hover:shadow-[3px_3px_0px_0px_var(--foreground)] hover:-translate-y-0.5",
        isExpanded && "shadow-[3px_3px_0px_0px_var(--foreground)] -translate-y-0.5 border-foreground"
      )}
    >
      <div className="flex items-center gap-3 px-3 py-2.5">
        <button
          type="button"
          onClick={onToggle}
          className="min-w-0 flex-1 text-left group"
        >
          <div className="flex flex-wrap items-center gap-2">
            <div className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded border-2 border-foreground shadow-[1px_1px_0px_0px_var(--foreground)]",
              config.bgClass
            )}>
              <TypeIcon className={cn("size-3.5", lesson.type === "VIDEO" && "ml-0.5")} />
            </div>

            <span className="font-mono text-[10px] font-bold text-muted-foreground">
              {lessonIndex + 1}.
            </span>
            <span className="truncate text-sm font-semibold tracking-tight group-hover:text-primary transition-colors">
              {lesson.title}
            </span>
            
            <div className="flex flex-wrap items-center gap-1">
              <Badge variant="outline" className="font-mono text-[9px] uppercase border-foreground/30">
                {LESSON_TYPE_LABELS[lesson.type]}
              </Badge>
              {lesson.type === "VIDEO" && lesson.videoStatus ? (
                <Badge
                  variant={LESSON_VIDEO_STATUS_VARIANTS[lesson.videoStatus]}
                  className="font-mono text-[9px] uppercase"
                >
                  {LESSON_VIDEO_STATUS_LABELS[lesson.videoStatus]}
                </Badge>
              ) : null}
              {lesson.type === "QUIZ" &&
              (lesson.quiz?.questions.length ?? 0) > 0 ? (
                <Badge
                  variant="secondary"
                  className="font-mono text-[9px] uppercase"
                >
                  {ADMIN_CURRICULUM_PAGE.quizQuestionsSummary(
                    lesson.quiz!.questions.length,
                  )}
                </Badge>
              ) : null}
              {lesson.isPreview ? (
                <Badge
                  variant="secondary"
                  className="font-mono text-[9px] uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                >
                  Preview
                </Badge>
              ) : null}
            </div>

            <IconChevronDown className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-300 ml-auto",
              isExpanded && "rotate-180 text-foreground"
            )} stroke={2.25} />
          </div>
        </button>
        <div className="flex shrink-0 items-center gap-0.5 border-l border-foreground/10 pl-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            disabled={lessonIndex === 0}
            className="hover:bg-secondary hover:text-foreground transition-colors"
            onClick={() => onMove("up")}
            aria-label="Subir lección"
          >
            <IconChevronUp stroke={2.5} className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            disabled={lessonIndex >= lessonCount - 1}
            className="hover:bg-secondary hover:text-foreground transition-colors"
            onClick={() => onMove("down")}
            aria-label="Bajar lección"
          >
            <IconChevronDown stroke={2.5} className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="text-destructive hover:bg-destructive/10 transition-colors"
            onClick={onDelete}
            aria-label="Eliminar lección"
          >
            <IconTrash stroke={2.5} className="size-3.5" />
          </Button>
        </div>
      </div>

      {isExpanded ? (
        <div className="border-t-2 border-foreground/15 px-4 py-4 bg-muted/5 animate-in fade-in slide-in-from-top-1 duration-200">
          <LessonEditPanel
            lesson={lesson}
            courseId={courseId}
            maxVideoSizeMb={maxVideoSizeMb}
            muxConfigured={muxConfigured}
            muxStreamingEnabled={muxStreamingEnabled}
            onUpdated={onUpdated}
          />
        </div>
      ) : null}
    </div>
  );
}
