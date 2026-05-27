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
import { toast } from "@/lib/toast";

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
    <div className="space-y-4">
      {playbackId && status === "READY" ? (
        <div className="space-y-3">
          <LessonMuxPreview playbackId={playbackId} />
        </div>
      ) : null}

      {!playbackId && status !== "PENDING" && !isUploading ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="group cursor-pointer flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-foreground/45 bg-muted/10 p-7 text-center transition-all duration-300 hover:bg-muted/25 hover:border-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:shadow-[4px_4px_0px_0px_var(--foreground)] hover:-translate-y-0.5"
        >
          <div className="flex size-10 items-center justify-center rounded-lg border-2 border-foreground bg-secondary shadow-[2px_2px_0px_0px_var(--foreground)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <IconUpload className="size-5 text-primary" stroke={2.5} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold tracking-tight">Seleccionar archivo de vídeo</p>
            <p className="font-mono text-[9px] text-muted-foreground">
              Máximo {maxVideoSizeMb} MB · formatos de vídeo habituales (MP4, MOV, WebM)
            </p>
          </div>
        </div>
      ) : null}

      {(status === "PENDING" || isUploading) ? (
        <div className="rounded-lg border-2 border-foreground bg-card p-4 shadow-[3px_3px_0px_0px_var(--foreground)] space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase">
            <span className="flex items-center gap-1.5 text-primary">
              <IconLoader className="size-4 animate-spin text-primary" stroke={2.5} />
              Procesando en Mux
            </span>
            <span className="text-muted-foreground animate-pulse">Codificando...</span>
          </div>
          <div className="h-4 w-full rounded border-2 border-foreground bg-muted overflow-hidden p-0.5">
            <div className="h-full bg-primary/90 rounded-xs animate-[pulse_1.5s_infinite] w-[70%]" />
          </div>
          <p className="font-mono text-[9px] text-muted-foreground leading-relaxed">
            Tu vídeo se está subiendo y procesando para streaming multidispositivo. Esta sección se actualizará automáticamente.
          </p>
        </div>
      ) : null}

      {status === "ERRORED" ? (
        <div className="rounded border border-destructive bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2 font-mono uppercase">
          <span>⚠</span> Error al procesar el vídeo. Intenta subir de nuevo.
        </div>
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
        {playbackId && !isUploading && status !== "PENDING" ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              className={cn(
                adminBrutalButtonClass,
                "inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase transition-all duration-200 hover:bg-secondary hover:scale-[1.02] active:scale-95"
              )}
              onClick={() => inputRef.current?.click()}
            >
              <IconUpload stroke={2.5} className="size-3.5" />
              Reemplazar vídeo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              className={cn(
                adminBrutalButtonClass,
                "text-destructive transition-all duration-200 hover:scale-[1.02] active:scale-95 hover:bg-destructive/10"
              )}
              onClick={handleClearVideo}
            >
              Quitar vídeo
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
