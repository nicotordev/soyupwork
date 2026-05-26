"use client";

import MuxPlayer from "@mux/mux-player-react";

type LessonMuxPreviewProps = {
  playbackId: string;
};

export function LessonMuxPreview({ playbackId }: LessonMuxPreviewProps) {
  return (
    <div className="overflow-hidden rounded border-2 border-foreground bg-black shadow-[2px_2px_0px_0px_var(--foreground)]">
      <MuxPlayer
        playbackId={playbackId}
        className="aspect-video w-full"
        streamType="on-demand"
      />
    </div>
  );
}
