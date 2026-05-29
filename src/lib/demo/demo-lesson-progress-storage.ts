const STORAGE_KEY_PREFIX = "soyupwork-demo-lesson-progress:";

export function readDemoCompletedLessonIds(courseId: string): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${courseId}`);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function writeDemoCompletedLessonIds(
  courseId: string,
  lessonIds: string[],
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    `${STORAGE_KEY_PREFIX}${courseId}`,
    JSON.stringify(lessonIds),
  );
}
