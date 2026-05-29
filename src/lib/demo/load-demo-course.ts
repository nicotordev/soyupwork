
import { getDummyCoursePageData } from "@/lib/demo/dummy-course-data";
import type { CoursePageData } from "@/types/course-page.types";

/** Course data for `/demo`: env slug from DB if possible, else static dummy. */
export async function loadDemoCoursePage(): Promise<CoursePageData> {
  return getDummyCoursePageData();
}
