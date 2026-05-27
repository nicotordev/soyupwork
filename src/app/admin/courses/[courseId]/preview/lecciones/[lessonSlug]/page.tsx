import { getCoursePageForAdminPreview } from "@/app/actions/course-page.actions";
import { CourseLearnShell } from "@/components/course/course-learn-shell";
import { findLessonInView } from "@/lib/course/get-course-page-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ courseId: string; lessonSlug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseId, lessonSlug } = await params;
  const data = await getCoursePageForAdminPreview(courseId);
  const lesson = data ? findLessonInView(data.view, lessonSlug) : null;

  return {
    title: lesson
      ? `Vista previa — ${lesson.title}`
      : (data?.view.title ?? "Vista previa"),
  };
}

export default async function AdminCoursePreviewLessonPage({
  params,
}: PageProps) {
  const { courseId, lessonSlug } = await params;
  const data = await getCoursePageForAdminPreview(courseId);

  if (!data) {
    notFound();
  }

  const lesson = findLessonInView(data.view, lessonSlug);

  if (!lesson) {
    notFound();
  }

  return (
    <CourseLearnShell
      data={data}
      lessonSlug={lessonSlug}
      lessonBasePath={`/admin/courses/${courseId}/preview/lecciones`}
      courseLandingHref={`/admin/courses/${courseId}/preview`}
    />
  );
}
