"use client";

import { updateLesson } from "@/app/actions/curriculum.actions";
import { LessonQuizEditor } from "@/components/admin/courses/curriculum/lesson-quiz-editor";
import { LessonTextEditor } from "@/components/admin/courses/curriculum/lesson-text-editor";
import { LessonVideoUploader } from "@/components/admin/courses/curriculum/lesson-video-uploader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ADMIN_CURRICULUM_PAGE,
  LESSON_TYPES_V1,
  LESSON_TYPE_LABELS,
  type CurriculumLessonTypeV1,
} from "@/constants/curriculum.constants";
import { adminBrutalButtonClass, adminInputClass } from "@/lib/admin/styles";
import { toSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import type { AdminCurriculumLesson } from "@/types/admin-curriculum.types";
import { IconDeviceFloppy, IconLoader } from "@tabler/icons-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "@/lib/toast";

type LessonEditPanelProps = {
  lesson: AdminCurriculumLesson;
  courseId: string;
  maxVideoSizeMb: number;
  muxConfigured: boolean;
  muxStreamingEnabled: boolean;
  onUpdated: () => void;
};

export function LessonEditPanel({
  lesson,
  courseId,
  maxVideoSizeMb,
  muxConfigured,
  muxStreamingEnabled,
  onUpdated,
}: LessonEditPanelProps) {
  const [isPending, startTransition] = useTransition();
  const slugManuallyEdited = useRef(false);

  const [title, setTitle] = useState(lesson.title);
  const [slug, setSlug] = useState(lesson.slug);
  const [description, setDescription] = useState(lesson.description);
  const [type, setType] = useState<CurriculumLessonTypeV1>(
    LESSON_TYPES_V1.includes(lesson.type as CurriculumLessonTypeV1)
      ? (lesson.type as CurriculumLessonTypeV1)
      : "VIDEO",
  );
  const [content, setContent] = useState(lesson.content);
  const [isPreview, setIsPreview] = useState(lesson.isPreview);
  const [videoPublishedAt, setVideoPublishedAt] = useState(
    lesson.videoPublishedAt ? lesson.videoPublishedAt.slice(0, 10) : "",
  );
  const [videoAuthorName, setVideoAuthorName] = useState(
    lesson.videoAuthorName ?? "",
  );

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugManuallyEdited.current) {
      setSlug(toSlug(value));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      lesson.type === "QUIZ" &&
      type !== "QUIZ" &&
      (lesson.quiz?.questions.length ?? 0) > 0 &&
      !window.confirm(ADMIN_CURRICULUM_PAGE.quizTypeChangeConfirm)
    ) {
      return;
    }

    startTransition(async () => {
      const result = await updateLesson({
        id: lesson.id,
        courseId,
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        type,
        content: content.trim(),
        isPreview,
        videoPublishedAt: type === "VIDEO" ? videoPublishedAt : undefined,
        videoAuthorName: type === "VIDEO" ? videoAuthorName : undefined,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Lección guardada");
      onUpdated();
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border-t border-foreground/20 pt-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`lesson-title-${lesson.id}`}>Título</Label>
          <Input
            id={`lesson-title-${lesson.id}`}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={adminInputClass}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`lesson-slug-${lesson.id}`}>Slug</Label>
          <Input
            id={`lesson-slug-${lesson.id}`}
            value={slug}
            onChange={(e) => {
              slugManuallyEdited.current = true;
              setSlug(toSlug(e.target.value));
            }}
            className={adminInputClass}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`lesson-type-${lesson.id}`}>Tipo</Label>
          <select
            id={`lesson-type-${lesson.id}`}
            value={type}
            onChange={(e) => setType(e.target.value as CurriculumLessonTypeV1)}
            className={cn(
              adminInputClass,
              "h-9 w-full px-2 text-xs font-mono font-bold uppercase",
            )}
          >
            {LESSON_TYPES_V1.map((lessonType) => (
              <option key={lessonType} value={lessonType}>
                {LESSON_TYPE_LABELS[lessonType]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`lesson-desc-${lesson.id}`}>
            {type === "VIDEO" ? "Descripción del vídeo" : "Descripción"}
          </Label>
          <Textarea
            id={`lesson-desc-${lesson.id}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={cn(adminInputClass, "min-h-16 resize-y")}
            rows={type === "VIDEO" ? 4 : 2}
            placeholder={
              type === "VIDEO"
                ? "Texto visible bajo el reproductor (estilo YouTube)."
                : undefined
            }
          />
        </div>
        {type === "VIDEO" ? (
          <>
            <div className="space-y-1.5">
              <Label htmlFor={`lesson-video-date-${lesson.id}`}>
                Fecha de publicación
              </Label>
              <Input
                id={`lesson-video-date-${lesson.id}`}
                type="date"
                value={videoPublishedAt}
                onChange={(e) => setVideoPublishedAt(e.target.value)}
                className={adminInputClass}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`lesson-video-author-${lesson.id}`}>
                Autor del vídeo
              </Label>
              <Input
                id={`lesson-video-author-${lesson.id}`}
                value={videoAuthorName}
                onChange={(e) => setVideoAuthorName(e.target.value)}
                className={adminInputClass}
                placeholder="Opcional — si está vacío se usa el instructor del curso"
              />
            </div>
          </>
        ) : null}
      </div>

      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox
          checked={isPreview}
          onCheckedChange={(checked) => setIsPreview(checked === true)}
        />
        <span className="text-sm">Lección de vista previa (gratis)</span>
      </label>

      {type === "TEXT" ? (
        <LessonTextEditor
          id={`lesson-content-${lesson.id}`}
          value={content}
          onChange={setContent}
        />
      ) : null}

      {type === "VIDEO" ? (
        <LessonVideoUploader
          lessonId={lesson.id}
          courseId={courseId}
          maxVideoSizeMb={maxVideoSizeMb}
          muxConfigured={muxConfigured}
          muxStreamingEnabled={muxStreamingEnabled}
          videoStatus={lesson.videoStatus}
          videoPlaybackId={lesson.videoPlaybackId}
          onUpdated={onUpdated}
        />
      ) : null}

      {type === "QUIZ" ? (
        <LessonQuizEditor
          key={`quiz-${lesson.id}-${lesson.quiz?.id ?? "new"}-${lesson.quiz?.questions.length ?? 0}`}
          lessonId={lesson.id}
          courseId={courseId}
          lessonTitle={title}
          quiz={lesson.quiz}
          canPersist={lesson.type === "QUIZ"}
        />
      ) : null}

      <Button
        type="submit"
        size="sm"
        disabled={isPending}
        className={adminBrutalButtonClass}
      >
        {isPending ? (
          <IconLoader className="animate-spin" stroke={2.25} />
        ) : (
          <IconDeviceFloppy stroke={2.25} />
        )}
        Guardar lección
      </Button>
    </form>
  );
}
