"use client";

import {
  initCourseThumbnailUpload,
  setCourseThumbnail,
} from "@/app/actions/courses.actions";
import { useMutation } from "@tanstack/react-query";
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

  useEffect(() => {
    setPreviewUrl(thumbnailUrl);
  }, [thumbnailUrl]);

  const displayUrl = previewUrl ?? thumbnailUrl;
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const init = await initCourseThumbnailUpload({
        courseId,
        contentType: file.type as CourseThumbnailAcceptedType,
        contentLength: file.size,
      });

      if (!init.ok) {
        throw new Error(init.error);
      }

      const uploadResponse = await fetch(init.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("No se pudo subir la imagen al almacenamiento.");
      }

      const save = await setCourseThumbnail({
        courseId,
        thumbnailUrl: init.thumbnailUrl,
      });

      if (!save.ok) {
        throw new Error(save.error);
      }

      return init.thumbnailUrl;
    },
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      const result = await setCourseThumbnail({
        courseId,
        thumbnailUrl: null,
      });

      if (!result.ok) {
        throw new Error(result.error);
      }
    },
  });

  const isUploading = uploadMutation.isPending;
  const isRemoving = removeMutation.isPending;
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

      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      try {
        const uploadedUrl = await uploadMutation.mutateAsync(file);
        setPreviewUrl(uploadedUrl);
        toast.success("Imagen del curso actualizada");
        onUpdated();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al subir la imagen.",
        );
        setPreviewUrl(thumbnailUrl);
      } finally {
        URL.revokeObjectURL(localPreview);
      }
    },
    [maxSizeMb, onUpdated, thumbnailUrl, uploadMutation],
  );

  const removeThumbnail = useCallback(async () => {
    if (!window.confirm("¿Quitar la imagen de portada de este curso?")) {
      return;
    }

    try {
      await removeMutation.mutateAsync();
      setPreviewUrl(null);
      toast.success("Imagen eliminada");
      onUpdated();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la imagen.",
      );
    }
  }, [onUpdated, removeMutation]);

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
