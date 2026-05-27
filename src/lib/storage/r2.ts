import "server-only";

import { getResolvedStoragePublicUrl } from "@/lib/platform/settings/resolve";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class StorageConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageConfigError";
  }
}

const COURSE_THUMBNAIL_PREFIX = "courses/";

export const COURSE_THUMBNAIL_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type CourseThumbnailContentType =
  (typeof COURSE_THUMBNAIL_CONTENT_TYPES)[number];

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_BUCKET?.trim() &&
    process.env.R2_ACCESS_KEY_ID?.trim() &&
    process.env.R2_SECRET_ACCESS_KEY?.trim() &&
    (process.env.R2_ENDPOINT?.trim() || process.env.R2_ACCOUNT_ID?.trim()),
  );
}

function getR2Endpoint(): string {
  const endpoint = process.env.R2_ENDPOINT?.trim();
  if (endpoint) return endpoint;

  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  if (!accountId) {
    throw new StorageConfigError(
      "Configura R2_ENDPOINT o R2_ACCOUNT_ID para el almacenamiento.",
    );
  }

  return `https://${accountId}.r2.cloudflarestorage.com`;
}

function getR2Client(): S3Client {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();

  if (!accessKeyId || !secretAccessKey) {
    throw new StorageConfigError(
      "R2_ACCESS_KEY_ID y R2_SECRET_ACCESS_KEY deben estar configurados.",
    );
  }

  return new S3Client({
    region: process.env.R2_REGION?.trim() || "auto",
    endpoint: getR2Endpoint(),
    credentials: { accessKeyId, secretAccessKey },
  });
}

function contentTypeToExtension(
  contentType: CourseThumbnailContentType,
): string {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

export function buildCourseThumbnailObjectKey(
  courseId: string,
  contentType: CourseThumbnailContentType,
): string {
  const extension = contentTypeToExtension(contentType);
  return `${COURSE_THUMBNAIL_PREFIX}${courseId}/thumbnail-${Date.now()}.${extension}`;
}

export function buildPublicObjectUrl(
  publicBaseUrl: string,
  objectKey: string,
): string {
  const base = publicBaseUrl.replace(/\/$/, "");
  const key = objectKey.replace(/^\//, "");
  return `${base}/${key}`;
}

export async function createCourseThumbnailUploadUrl(input: {
  courseId: string;
  contentType: CourseThumbnailContentType;
  contentLength: number;
}): Promise<{ uploadUrl: string; thumbnailUrl: string; objectKey: string }> {
  const bucket = process.env.R2_BUCKET?.trim();
  if (!bucket) {
    throw new StorageConfigError("R2_BUCKET debe estar configurado.");
  }

  const publicBaseUrl = await getResolvedStoragePublicUrl();
  if (!publicBaseUrl) {
    throw new StorageConfigError(
      "Configura la URL pública del bucket (R2_PUBLIC_URL o ajustes de almacenamiento).",
    );
  }

  const objectKey = buildCourseThumbnailObjectKey(
    input.courseId,
    input.contentType,
  );
  const thumbnailUrl = buildPublicObjectUrl(publicBaseUrl, objectKey);

  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    ContentType: input.contentType,
    ContentLength: input.contentLength,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 600 });

  return { uploadUrl, thumbnailUrl, objectKey };
}

export async function assertThumbnailUrlAllowed(
  thumbnailUrl: string,
): Promise<void> {
  const publicBaseUrl = await getResolvedStoragePublicUrl();
  if (!publicBaseUrl) {
    throw new StorageConfigError(
      "No hay URL pública de almacenamiento configurada.",
    );
  }

  const normalizedBase = publicBaseUrl.replace(/\/$/, "");
  if (
    !thumbnailUrl.startsWith(`${normalizedBase}/`) &&
    thumbnailUrl !== normalizedBase
  ) {
    throw new StorageConfigError("La URL de la imagen no es válida.");
  }

  const objectKey = thumbnailUrl.slice(normalizedBase.length + 1);
  if (!objectKey.startsWith(COURSE_THUMBNAIL_PREFIX)) {
    throw new StorageConfigError("La ruta de la imagen no es válida.");
  }
}
