export const IMAGE_UPLOAD_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type ImageUploadContentType =
  (typeof IMAGE_UPLOAD_CONTENT_TYPES)[number];
