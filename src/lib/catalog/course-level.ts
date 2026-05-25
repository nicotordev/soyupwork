import { CourseLevel } from "@/generated/prisma/client";
import type { Course } from "@/types/catalog-course";

export const COURSE_LEVEL_LABELS: Record<CourseLevel, Course["level"]> = {
  [CourseLevel.BEGINNER]: "Principiante",
  [CourseLevel.INTERMEDIATE]: "Intermedio",
  [CourseLevel.ADVANCED]: "Avanzado",
};

export const COURSE_LEVELS = Object.values(CourseLevel);

/** URL filter labels (Spanish) → Prisma enum */
export const LEVEL_LABEL_TO_ENUM: Record<string, CourseLevel> = {
  Principiante: CourseLevel.BEGINNER,
  Intermedio: CourseLevel.INTERMEDIATE,
  Avanzado: CourseLevel.ADVANCED,
};

export function parseLevelFilters(labels: string[]): CourseLevel[] {
  return labels
    .map((label) => LEVEL_LABEL_TO_ENUM[label])
    .filter((level): level is CourseLevel => level !== undefined);
}

export function courseLevelLabel(level: CourseLevel): Course["level"] {
  return COURSE_LEVEL_LABELS[level];
}
