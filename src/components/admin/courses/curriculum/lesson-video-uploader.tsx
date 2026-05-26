"use client";

import {
  clearLessonVideo,
  getLessonVideoStatus,
  initLessonVideoUpload,
} from "@/app/actions/curriculum.actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconLoader, IconUpload } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { LessonMuxPreview } from "@/components/admin/courses/curriculum/lesson-mux-preview";
import { adminBrutalButtonClass } from "@/lib/admin/styles";

type LessonVideoUploaderProps = {
  lessonId: string;
  courseId: string;
  maxVideoSizeMb: number;
  muxConfigured: boolean;
  muxStreamingEnabled: boolean;
  videoStatus: string | null;
  videoPlaybackId: string | null;
  onUpdated: () => void;
};

const POLL_INTERVAL_MS = 2500;
const MAX_POLL_ATTEMPTS = 120;

export function LessonVideoUploader({
  lessonId,
  courseId,
  maxVideoSizeMb,
  muxConfigured,
  muxStreamingEnabled,
  videoStatus,
  videoPlaybackId,
  onUpdated,
}: LessonVideoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localPlaybackId, setLocalPlaybackId] = useState(videoPlaybackId);
  const [localStatus, setLocalStatus] = useState(videoStatus);

  const playbackId = localPlaybackId ?? videoPlaybackId;
  const status = localStatus ?? videoStatus;

  const canUpload = muxConfigured && muxStreamingEnabled;

  const pollUntilReady = async () => {
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

      const result = await getLessonVideoStatus({ lessonId, courseId });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setLocalStatus(result.videoStatus);
      setLocalPlaybackId(result.videoPlaybackId);

      if (result.videoStatus === "READY" && result.videoPlaybackId) {
        toast.success("Vídeo procesado y listo");
        onUpdated();
        return;
      }

      if (result.videoStatus === "ERRORED") {
        toast.error("Mux reportó un error al procesar el vídeo.");
        onUpdated();
        return;
      }
    }

    toast.message(
      "El vídeo sigue procesándose. Actualiza la página en unos minutos.",
    );
    onUpdated();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const maxBytes = maxVideoSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error(`El archivo supera el límite de ${maxVideoSizeMb} MB.`);
      return;
    }

    setIsUploading(true);
    setLocalStatus("PENDING");

    try {
      const init = await initLessonVideoUpload({ lessonId, courseId });
      if (!init.ok) {
        toast.error(init.error);
        return;
      }

      const uploadResponse = await fetch(init.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/octet-stream" },
      });

      if (!uploadResponse.ok) {
        toast.error("No se pudo subir el archivo a Mux.");
        return;
      }

      toast.message("Subida completada. Procesando vídeo...");
      await pollUntilReady();
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearVideo = async () => {
    if (
      !window.confirm(
        "¿Quitar la referencia al vídeo de esta lección? (no borra el asset en Mux)",
      )
    ) {
      return;
    }

    const result = await clearLessonVideo({ lessonId, courseId });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setLocalPlaybackId(null);
    setLocalStatus(null);
    toast.success("Vídeo desvinculado");
    onUpdated();
  };

  if (!canUpload) {
    return (
      <p className="rounded border border-dashed border-foreground/40 bg-muted/20 p-3 text-xs text-muted-foreground">
        {!muxConfigured
          ? "Configura MUX_TOKEN_ID y MUX_TOKEN_SECRET para subir vídeos."
          : "Habilita Mux streaming en Ajustes → Vídeo."}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {playbackId && status === "READY" ? (
        <LessonMuxPreview playbackId={playbackId} />
      ) : null}

      {status === "PENDING" || isUploading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <IconLoader className="size-4 animate-spin" stroke={2.5} />
          Procesando vídeo en Mux...
        </div>
      ) : null}

      {status === "ERRORED" ? (
        <p className="text-xs text-destructive">
          Error al procesar el vídeo. Intenta subir de nuevo.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          className={adminBrutalButtonClass}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <IconLoader className="animate-spin" stroke={2.25} />
          ) : (
            <IconUpload stroke={2.25} />
          )}
          {playbackId ? "Reemplazar vídeo" : "Subir vídeo"}
        </Button>
        {playbackId || status ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            className={cn(adminBrutalButtonClass, "text-destructive")}
            onClick={handleClearVideo}
          >
            Quitar vídeo
          </Button>
        ) : null}
      </div>

      <p className="font-mono text-[10px] text-muted-foreground">
        Máximo {maxVideoSizeMb} MB · formatos de vídeo habituales
      </p>
    </div>
  );
}
