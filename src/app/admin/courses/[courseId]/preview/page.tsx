import { getCoursePageForAdminPreview } from "@/app/actions/course-page.actions";
import { CourseLandingView } from "@/components/course/course-landing-view";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ courseId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseId } = await params;
  const data = await getCoursePageForAdminPreview(courseId);

  return {
    title: data ? `Vista previa — ${data.view.title}` : "Vista previa",
  };
}

export default async function AdminCoursePreviewLandingPage({
  params,
}: PageProps) {
  const { courseId } = await params;
  const data = await getCoursePageForAdminPreview(courseId);

  if (!data) {
    notFound();
  }

  const buildLessonHref = (lessonSlug: string) =>
    `/admin/courses/${courseId}/preview/lessons/${lessonSlug}`;

  return (
    <CourseLandingView
      data={data}
      buildLessonHref={buildLessonHref}
      courseLandingHref={`/admin/courses/${courseId}/preview`}
    />
  );
}
