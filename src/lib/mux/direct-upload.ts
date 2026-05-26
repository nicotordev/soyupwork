import "server-only";

import { getMuxClient } from "@/lib/mux/client";
import { getMuxConfig } from "@/lib/mux/config";

export type LessonDirectUpload = {
  uploadId: string;
  uploadUrl: string;
};

export async function createLessonDirectUpload(): Promise<LessonDirectUpload> {
  const { corsOrigin } = getMuxConfig();
  const mux = getMuxClient();

  const upload = await mux.video.uploads.create({
    cors_origin: corsOrigin,
    new_asset_settings: {
      playback_policy: ["public"],
    },
  });

  if (!upload.id || !upload.url) {
    throw new Error("Mux no devolvió un upload válido.");
  }

  return { uploadId: upload.id, uploadUrl: upload.url };
}
