"use client";

import {
  initCourseThumbnailUpload,
  setCourseThumbnail,
} from "@/app/actions/courses.actions";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/lib/toast";

export const COURSE_THUMBNAIL_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type CourseThumbnailAcceptedType =
  (typeof COURSE_THUMBNAIL_ACCEPTED_TYPES)[number];

type UseCourseThumbnailUploadOptions = {
  courseId: string;
  thumbnailUrl: string | null;
  maxSizeMb: number;
  onUpdated: () => void;
};

export function useCourseThumbnailUpload({
  courseId,
  thumbnailUrl,
  maxSizeMb,
  onUpdated,
}: UseCourseThumbnailUploadOptions) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(thumbnailUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    setPreviewUrl(thumbnailUrl);
  }, [thumbnailUrl]);

  const displayUrl = previewUrl ?? thumbnailUrl;
  const busy = isUploading || isRemoving;

  const uploadFile = useCallback(
    async (file: File) => {
      if (
        !COURSE_THUMBNAIL_ACCEPTED_TYPES.includes(
          file.type as CourseThumbnailAcceptedType,
        )
      ) {
        toast.error("Usa JPG, PNG o WebP.");
        return;
      }

      const maxBytes = maxSizeMb * 1024 * 1024;
      if (file.size > maxBytes) {
        toast.error(`La imagen no puede superar ${maxSizeMb} MB.`);
        return;
      }

      setIsUploading(true);
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      try {
        const init = await initCourseThumbnailUpload({
          courseId,
          contentType: file.type as CourseThumbnailAcceptedType,
          contentLength: file.size,
        });

        if (!init.ok) {
          toast.error(init.error);
          setPreviewUrl(thumbnailUrl);
          return;
        }

        const uploadResponse = await fetch(init.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadResponse.ok) {
          toast.error("No se pudo subir la imagen al almacenamiento.");
          setPreviewUrl(thumbnailUrl);
          return;
        }

        const save = await setCourseThumbnail({
          courseId,
          thumbnailUrl: init.thumbnailUrl,
        });

        if (!save.ok) {
          toast.error(save.error);
          setPreviewUrl(thumbnailUrl);
          return;
        }

        setPreviewUrl(init.thumbnailUrl);
        toast.success("Imagen del curso actualizada");
        onUpdated();
      } catch {
        toast.error("Error al subir la imagen.");
        setPreviewUrl(thumbnailUrl);
      } finally {
        URL.revokeObjectURL(localPreview);
        setIsUploading(false);
      }
    },
    [courseId, maxSizeMb, onUpdated, thumbnailUrl],
  );

  const removeThumbnail = useCallback(async () => {
    if (!window.confirm("¿Quitar la imagen de portada de este curso?")) {
      return;
    }

    setIsRemoving(true);

    try {
      const result = await setCourseThumbnail({
        courseId,
        thumbnailUrl: null,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setPreviewUrl(null);
      toast.success("Imagen eliminada");
      onUpdated();
    } finally {
      setIsRemoving(false);
    }
  }, [courseId, onUpdated]);

  return {
    displayUrl,
    busy,
    isUploading,
    isRemoving,
    uploadFile,
    removeThumbnail,
    setPreviewUrl,
  };
}
