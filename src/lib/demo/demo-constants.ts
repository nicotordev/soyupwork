export const DEMO_DUMMY_COURSE_ID = "demo-course";

/** Public Mux sample stream (Mux docs / player examples). Used when demo env playback IDs are unset. */
export const MUX_PUBLIC_SAMPLE_PLAYBACK_ID =
  "DS00Spx1CV902MCtPj5WknGlR102V5HFkDe";

export function isDummyDemoCourse(courseId: string): boolean {
  return courseId === DEMO_DUMMY_COURSE_ID;
}
