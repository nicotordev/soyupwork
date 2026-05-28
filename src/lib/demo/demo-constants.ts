export const DEMO_DUMMY_COURSE_ID = "demo-course";

export function isDummyDemoCourse(courseId: string): boolean {
  return courseId === DEMO_DUMMY_COURSE_ID;
}
