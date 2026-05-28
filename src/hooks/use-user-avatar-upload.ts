"use client";

import {
  initStudentAvatarUpload,
  setStudentAvatar,
} from "@/app/actions/profile.actions";
import {
  IMAGE_UPLOAD_CONTENT_TYPES,
  type ImageUploadContentType,
} from "@/lib/storage/image-upload.constants";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/lib/toast";

type UseUserAvatarUploadOptions = {
  imageUrl: string | null;
  maxSizeMb: number;
  onUpdated: (imageUrl: string | null) => void;
};

export function useUserAvatarUpload({
  imageUrl,
  maxSizeMb,
  onUpdated,
}: UseUserAvatarUploadOptions) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl);

  useEffect(() => {
    setPreviewUrl(imageUrl);
  }, [imageUrl]);

  const displayUrl = previewUrl ?? imageUrl;

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const init = await initStudentAvatarUpload({
        contentType: file.type as ImageUploadContentType,
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

      const save = await setStudentAvatar({ imageUrl: init.imageUrl });

      if (!save.ok) {
        throw new Error(save.error);
      }

      return save.imageUrl;
    },
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      const result = await setStudentAvatar({ imageUrl: null });

      if (!result.ok) {
        throw new Error(result.error);
      }

      return result.imageUrl;
    },
  });

  const busy = uploadMutation.isPending || removeMutation.isPending;

  const uploadFile = useCallback(
    async (file: File) => {
      if (
        !IMAGE_UPLOAD_CONTENT_TYPES.includes(
          file.type as ImageUploadContentType,
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
        toast.success("Foto de perfil actualizada");
        onUpdated(uploadedUrl);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al subir la imagen.",
        );
        setPreviewUrl(imageUrl);
      } finally {
        URL.revokeObjectURL(localPreview);
      }
    },
    [imageUrl, maxSizeMb, onUpdated, uploadMutation],
  );

  const removeAvatar = useCallback(async () => {
    if (!window.confirm("¿Quitar tu foto de perfil?")) {
      return;
    }

    try {
      await removeMutation.mutateAsync();
      setPreviewUrl(null);
      toast.success("Foto de perfil eliminada");
      onUpdated(null);
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
    uploadFile,
    removeAvatar,
  };
}
