"use client";

import { Button } from "@/components/ui/button";
import { useUserAvatarUpload } from "@/hooks/use-user-avatar-upload";
import { adminBrutalButtonClass, adminPanelClass } from "@/lib/admin/styles";
import { IMAGE_UPLOAD_CONTENT_TYPES } from "@/lib/storage/image-upload.constants";
import { cn } from "@/lib/utils";
import {
  IconLoader,
  IconPhoto,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRef } from "react";

type UserAvatarUploaderProps = {
  imageUrl: string | null;
  storageConfigured: boolean;
  maxSizeMb: number;
  onUpdated: (imageUrl: string | null) => void;
};

export function UserAvatarUploader({
  imageUrl,
  storageConfigured,
  maxSizeMb,
  onUpdated,
}: UserAvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { displayUrl, busy, uploadFile, removeAvatar } = useUserAvatarUpload({
    imageUrl,
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
      <p className="rounded border border-dashed border-foreground/40 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        La subida de fotos no está disponible. El administrador debe configurar
        Cloudflare R2.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
      <div
        className={cn(
          adminPanelClass,
          "relative size-20 sm:size-24 shrink-0 overflow-hidden rounded-full border-2 border-foreground shadow-[3px_3px_0px_0px_var(--foreground)]",
        )}
      >
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt=""
            fill
            className="object-cover"
            sizes="96px"
            unoptimized
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground">
            <IconPhoto className="size-7 sm:size-8" stroke={1.5} />
          </div>
        )}

        {busy ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <IconLoader
              className="size-6 animate-spin text-primary"
              stroke={2.5}
            />
          </div>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="font-mono text-[10px] text-muted-foreground">
          JPG, PNG o WebP. Máximo {maxSizeMb} MB.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_UPLOAD_CONTENT_TYPES.join(",")}
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
            {displayUrl ? "Cambiar foto" : "Subir foto"}
          </Button>
          {displayUrl ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              className={cn(adminBrutalButtonClass, "text-destructive")}
              onClick={() => void removeAvatar()}
            >
              <IconTrash stroke={2.25} />
              Quitar
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
