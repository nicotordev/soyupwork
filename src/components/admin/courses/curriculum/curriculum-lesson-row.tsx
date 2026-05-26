"use client";

import { LessonEditPanel } from "@/components/admin/courses/curriculum/lesson-edit-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LESSON_TYPE_LABELS,
  LESSON_VIDEO_STATUS_LABELS,
  LESSON_VIDEO_STATUS_VARIANTS,
} from "@/constants/curriculum.constants";
import type { AdminCurriculumLesson } from "@/types/admin-curriculum.types";
import { IconChevronDown, IconChevronUp, IconTrash } from "@tabler/icons-react";

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
  return (
    <div className="rounded border border-foreground/25 bg-background">
      <div className="flex items-center gap-2 px-2.5 py-2">
        <button
          type="button"
          onClick={onToggle}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] text-muted-foreground">
              {lessonIndex + 1}.
            </span>
            <span className="truncate text-sm font-medium">{lesson.title}</span>
            <Badge variant="outline" className="font-mono text-[9px] uppercase">
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
            {lesson.isPreview ? (
              <Badge
                variant="secondary"
                className="font-mono text-[9px] uppercase"
              >
                Preview
              </Badge>
            ) : null}
          </div>
        </button>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            disabled={lessonIndex === 0}
            onClick={() => onMove("up")}
            aria-label="Subir lección"
          >
            <IconChevronUp stroke={2.25} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            disabled={lessonIndex >= lessonCount - 1}
            onClick={() => onMove("down")}
            aria-label="Bajar lección"
          >
            <IconChevronDown stroke={2.25} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="text-destructive"
            onClick={onDelete}
            aria-label="Eliminar lección"
          >
            <IconTrash stroke={2.25} />
          </Button>
        </div>
      </div>

      {isExpanded ? (
        <div className="border-t border-foreground/15 px-3 pb-3">
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
