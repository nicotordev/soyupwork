import { LessonVideoStatus } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import { muxPlaybackUrl } from "@/lib/webhooks/shared";

type MuxWebhookEvent = {
  type: string;
  data: Record<string, unknown>;
};

function parseMuxEvent(payload: unknown): MuxWebhookEvent {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("type" in payload) ||
    !("data" in payload)
  ) {
    throw new Error("Invalid Mux webhook payload");
  }
  return payload as MuxWebhookEvent;
}

function dataObject(data: Record<string, unknown>): Record<string, unknown> {
  const obj = data.object;
  if (typeof obj === "object" && obj !== null) {
    return obj as Record<string, unknown>;
  }
  return data;
}

async function findLessonByAssetId(assetId: string) {
  return prisma.lesson.findFirst({
    where: { videoAssetId: assetId },
  });
}

async function findLessonByUploadId(uploadId: string) {
  return prisma.lesson.findFirst({
    where: { videoAssetId: uploadId },
  });
}

export async function handleMuxWebhook(payload: unknown): Promise<void> {
  const event = parseMuxEvent(payload);
  const obj = dataObject(event.data);

  switch (event.type) {
    case "video.upload.asset_created":
      await handleUploadAssetCreated(obj);
      break;
    case "video.asset.ready":
      await handleAssetReady(obj);
      break;
    case "video.asset.errored":
      await handleAssetErrored(obj);
      break;
    case "video.asset.deleted":
      await handleAssetDeleted(obj);
      break;
    default:
      break;
  }
}

async function handleUploadAssetCreated(
  obj: Record<string, unknown>,
): Promise<void> {
  const assetId = typeof obj.id === "string" ? obj.id : null;
  const uploadId = typeof obj.upload_id === "string" ? obj.upload_id : null;

  if (!assetId) return;

  const lesson =
    (uploadId ? await findLessonByUploadId(uploadId) : null) ??
    (await findLessonByAssetId(assetId));

  if (!lesson) {
    console.warn("[mux] video.upload.asset_created: lesson not found", {
      assetId,
      uploadId,
    });
    return;
  }

  await prisma.lesson.update({
    where: { id: lesson.id },
    data: {
      videoProvider: "mux",
      videoAssetId: assetId,
      videoStatus: LessonVideoStatus.PENDING,
    },
  });
}

async function handleAssetReady(obj: Record<string, unknown>): Promise<void> {
  const assetId = typeof obj.id === "string" ? obj.id : null;
  if (!assetId) return;

  const playbackIds = obj.playback_ids;
  let playbackId: string | null = null;

  if (Array.isArray(playbackIds) && playbackIds.length > 0) {
    const first = playbackIds[0];
    if (typeof first === "object" && first !== null && "id" in first) {
      playbackId = String((first as { id: string }).id);
    }
  }

  const lesson = await findLessonByAssetId(assetId);
  if (!lesson) {
    console.warn("[mux] video.asset.ready: lesson not found", assetId);
    return;
  }

  await prisma.lesson.update({
    where: { id: lesson.id },
    data: {
      videoProvider: "mux",
      videoAssetId: assetId,
      videoPlaybackId: playbackId,
      videoUrl: playbackId ? muxPlaybackUrl(playbackId) : null,
      videoStatus: LessonVideoStatus.READY,
    },
  });
}

async function handleAssetErrored(obj: Record<string, unknown>): Promise<void> {
  const assetId = typeof obj.id === "string" ? obj.id : null;
  if (!assetId) return;

  const lesson = await findLessonByAssetId(assetId);
  if (!lesson) {
    console.warn("[mux] video.asset.errored: lesson not found", assetId);
    return;
  }

  console.error("[mux] video.asset.errored", {
    lessonId: lesson.id,
    assetId,
    errors: obj.errors,
  });

  await prisma.lesson.update({
    where: { id: lesson.id },
    data: {
      videoStatus: LessonVideoStatus.ERRORED,
    },
  });
}

async function handleAssetDeleted(obj: Record<string, unknown>): Promise<void> {
  const assetId = typeof obj.id === "string" ? obj.id : null;
  if (!assetId) return;

  const lesson = await findLessonByAssetId(assetId);
  if (!lesson) return;

  await prisma.lesson.update({
    where: { id: lesson.id },
    data: {
      videoPlaybackId: null,
      videoUrl: null,
      videoAssetId: null,
      videoStatus: LessonVideoStatus.DELETED,
    },
  });
}
