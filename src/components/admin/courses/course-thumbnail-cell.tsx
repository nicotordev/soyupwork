"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ADMIN_COURSES_PAGE } from "@/constants/courses.constants";
import {
  COURSE_THUMBNAIL_ACCEPTED_TYPES,
  useCourseThumbnailUpload,
} from "@/hooks/use-course-thumbnail-upload";
import { cn } from "@/lib/utils";
import {
  IconLoader,
  IconPhoto,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRef } from "react";

type CourseThumbnailCellProps = {
  courseId: string;
  courseTitle: string;
  thumbnailUrl: string | null;
  storageConfigured: boolean;
  maxSizeMb: number;
  onUpdated: () => void;
};

export function CourseThumbnailCell({
  courseId,
  courseTitle,
  thumbnailUrl,
  storageConfigured,
  maxSizeMb,
  onUpdated,
}: CourseThumbnailCellProps) {
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
      <div
        className="relative size-12 shrink-0 overflow-hidden rounded border-2 border-foreground bg-muted shadow-[2px_2px_0px_0px_var(--foreground)]"
        title={ADMIN_COURSES_PAGE.thumbnailStorageMissing}
      >
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt=""
            fill
            className="object-cover"
            sizes="48px"
            unoptimized
          />
        ) : (
          <span className="flex size-full items-center justify-center font-mono text-[10px] font-bold uppercase text-muted-foreground">
            —
          </span>
        )}
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={COURSE_THUMBNAIL_ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={handleFileChange}
        disabled={busy}
        aria-label={`Imagen de ${courseTitle}`}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={busy}
            className={cn(
              "group relative size-12 shrink-0 overflow-hidden rounded border-2 border-foreground bg-muted shadow-[2px_2px_0px_0px_var(--foreground)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              !busy && "cursor-pointer hover:border-primary",
            )}
            aria-label={`Cambiar imagen de ${courseTitle}`}
          >
            {displayUrl ? (
              <Image
                src={displayUrl}
                alt=""
                fill
                className="object-cover"
                sizes="48px"
                unoptimized
              />
            ) : (
              <span className="flex size-full items-center justify-center font-mono text-[10px] font-bold uppercase text-muted-foreground">
                <IconPhoto className="size-4" stroke={2} />
              </span>
            )}

            {!busy ? (
              <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-opacity group-hover:bg-foreground/50 group-hover:opacity-100 group-data-[state=open]:bg-foreground/50 group-data-[state=open]:opacity-100">
                <IconPhoto className="size-4 text-background" stroke={2.5} />
              </span>
            ) : (
              <span className="absolute inset-0 flex items-center justify-center bg-background/70">
                <IconLoader
                  className="size-4 animate-spin text-primary"
                  stroke={2.5}
                />
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[10rem]">
          <DropdownMenuItem
            onSelect={() => inputRef.current?.click()}
            disabled={busy}
          >
            <IconUpload stroke={2.25} />
            {displayUrl
              ? ADMIN_COURSES_PAGE.thumbnailReplaceLabel
              : ADMIN_COURSES_PAGE.thumbnailUploadLabel}
          </DropdownMenuItem>
          {displayUrl ? (
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => void removeThumbnail()}
              disabled={busy}
            >
              <IconTrash stroke={2.25} />
              {ADMIN_COURSES_PAGE.thumbnailRemoveLabel}
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
