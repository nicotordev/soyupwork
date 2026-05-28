import type { CoursePageMode } from "@/types/course-page.types";

export function isPreviewMode(mode: CoursePageMode): boolean {
  return mode === "adminPreview" || mode === "publicDemo";
}

export function isPublicDemoMode(mode: CoursePageMode): boolean {
  return mode === "publicDemo";
}

export function isAdminPreviewMode(mode: CoursePageMode): boolean {
  return mode === "adminPreview";
}
