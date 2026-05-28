import { getCoursePageForPublicDemo } from "@/app/actions/course-page.actions";
import { getDemoCourseSlugFromEnv } from "@/lib/demo/resolve-demo-course";
import { getDummyCoursePageData } from "@/lib/demo/dummy-course-data";
import type { CoursePageData } from "@/types/course-page.types";

/** Course data for `/demo`: env slug from DB if possible, else static dummy. */
export async function loadDemoCoursePage(): Promise<CoursePageData> {
  const envSlug = getDemoCourseSlugFromEnv();

  if (envSlug) {
    const fromDb = await getCoursePageForPublicDemo(envSlug).catch(() => null);
    if (fromDb) return fromDb;
  }

  return getDummyCoursePageData();
}
