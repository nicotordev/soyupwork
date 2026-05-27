"use client";

import { Button } from "@/components/ui/button";
import { ADMIN_COURSES_PAGE } from "@/constants/courses.constants";
import {
  COURSE_THUMBNAIL_ACCEPTED_TYPES,
  useCourseThumbnailUpload,
} from "@/hooks/use-course-thumbnail-upload";
import { adminBrutalButtonClass, adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import {
  IconLoader,
  IconPhoto,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRef } from "react";

type CourseThumbnailUploaderProps = {
  courseId: string;
  thumbnailUrl: string | null;
  storageConfigured: boolean;
  maxSizeMb: number;
  onUpdated: () => void;
};

export function CourseThumbnailUploader({
  courseId,
  thumbnailUrl,
  storageConfigured,
  maxSizeMb,
  onUpdated,
}: CourseThumbnailUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { displayUrl, busy, uploadFile, removeThumbnail } =
    useCourseThumbnailUpload({
      courseId,
      thumbnailUrl,
      maxSizeMb,
      onUpdated,
    });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void uploadFile(file);
  };

  if (!storageConfigured) {
    return (
      <p className="rounded border border-dashed border-foreground/40 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
        {ADMIN_COURSES_PAGE.thumbnailStorageMissing}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={cn(
          adminPanelClass,
          "relative aspect-video w-full max-w-md overflow-hidden border-2 border-foreground shadow-[3px_3px_0px_0px_var(--foreground)]",
        )}
      >
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
            unoptimized
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <IconPhoto className="size-10" stroke={1.5} />
            <span className="font-mono text-[10px] font-bold uppercase">
              Sin imagen
            </span>
          </div>
        )}

        {busy ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <IconLoader
              className="size-8 animate-spin text-primary"
              stroke={2.5}
            />
          </div>
        ) : null}
      </div>

      <p className="font-mono text-[10px] text-muted-foreground">
        {ADMIN_COURSES_PAGE.thumbnailHint}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={COURSE_THUMBNAIL_ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={handleFileChange}
        disabled={busy}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          className={adminBrutalButtonClass}
          onClick={() => inputRef.current?.click()}
        >
          <IconUpload stroke={2.25} />
          {displayUrl
            ? ADMIN_COURSES_PAGE.thumbnailReplaceLabel
            : ADMIN_COURSES_PAGE.thumbnailUploadLabel}
        </Button>
        {displayUrl ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            className={cn(adminBrutalButtonClass, "text-destructive")}
            onClick={() => void removeThumbnail()}
          >
            <IconTrash stroke={2.25} />
            {ADMIN_COURSES_PAGE.thumbnailRemoveLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
