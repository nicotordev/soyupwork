import type { Course } from "@/types/catalog-course";

/** Matches Prisma `CourseLevel` enum values (safe for client bundles). */
export type CourseLevelValue = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export const COURSE_LEVEL_VALUES = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
] as const satisfies readonly CourseLevelValue[];

export const COURSE_LEVEL_LABELS: Record<CourseLevelValue, Course["level"]> = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado",
};

export const COURSE_LEVELS: CourseLevelValue[] = [...COURSE_LEVEL_VALUES];

/** URL filter labels (Spanish) → enum value */
export const LEVEL_LABEL_TO_ENUM: Record<string, CourseLevelValue> = {
  Principiante: "BEGINNER",
  Intermedio: "INTERMEDIATE",
  Avanzado: "ADVANCED",
};

export function isCourseLevelValue(value: string): value is CourseLevelValue {
  return (COURSE_LEVEL_VALUES as readonly string[]).includes(value);
}

export function parseLevelFilters(labels: string[]): CourseLevelValue[] {
  return labels
    .map((label) => LEVEL_LABEL_TO_ENUM[label])
    .filter((level): level is CourseLevelValue => level !== undefined);
}

export function courseLevelLabel(level: CourseLevelValue): Course["level"] {
  return COURSE_LEVEL_LABELS[level];
}
