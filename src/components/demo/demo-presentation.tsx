import { CourseLandingView } from "@/components/course/course-landing-view";
import { CourseLearnShell } from "@/components/course/course-learn-shell";
import { findLessonInView } from "@/lib/course/get-course-page-data";
import type { CoursePageData } from "@/types/course-page.types";

type DemoPresentationProps = {
  data: CoursePageData;
  activeLessonSlug: string | null;
};

export function DemoPresentation({
  data,
  activeLessonSlug,
}: DemoPresentationProps) {
  const { view } = data;
  const lesson =
    activeLessonSlug !== null ? findLessonInView(view, activeLessonSlug) : null;

  const buildLessonHref = (lessonSlug: string) =>
    `/demo?leccion=${encodeURIComponent(lessonSlug)}`;
  const courseLandingHref = "/demo";
  const inLesson = lesson !== null;

  return inLesson && lesson ? (
    <CourseLearnShell
      data={data}
      lessonSlug={lesson.slug}
      lessonBasePath="/demo"
      courseLandingHref={courseLandingHref}
      buildLessonHref={buildLessonHref}
      showModeBanner={false}
    />
  ) : (
    <CourseLandingView
      data={data}
      buildLessonHref={buildLessonHref}
      courseLandingHref={courseLandingHref}
      showModeBanner={false}
    />
  );
}
