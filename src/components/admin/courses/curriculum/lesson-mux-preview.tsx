"use client";

import MuxPlayer from "@mux/mux-player-react";

type LessonMuxPreviewProps = {
  playbackId: string;
};

export function LessonMuxPreview({ playbackId }: LessonMuxPreviewProps) {
  return (
    <div className="overflow-hidden rounded-lg border-2 border-foreground bg-black shadow-[4px_4px_0px_0px_var(--foreground)] transition-all duration-300 hover:shadow-[5px_5px_0px_0px_var(--foreground)]">
      <div className="flex items-center gap-1.5 border-b-2 border-foreground bg-secondary px-3 py-1.5 font-mono text-[9px] font-bold uppercase text-foreground select-none">
        <span className="size-2 rounded-full bg-cyan-500 animate-pulse" />
        Vista previa del vídeo · streaming on-demand
      </div>
      <MuxPlayer
        playbackId={playbackId}
        className="aspect-video w-full"
        streamType="on-demand"
      />
    </div>
  );
}
