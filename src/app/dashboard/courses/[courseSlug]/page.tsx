import { getCoursePageForStudent } from "@/app/actions/course-page.actions";
import { CourseLandingView } from "@/components/course/course-landing-view";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseSlug } = await params;
  const data = await getCoursePageForStudent(courseSlug).catch(() => null);

  return {
    title: data?.view.title ?? "Curso",
  };
}

export default async function DashboardCourseLandingPage({
  params,
}: PageProps) {
  const { courseSlug } = await params;

  const data = await getCoursePageForStudent(courseSlug).catch(() => null);

  if (!data) {
    notFound();
  }

  const buildLessonHref = (lessonSlug: string) =>
    `/dashboard/courses/${data.view.slug}/lessons/${lessonSlug}`;

  return (
    <CourseLandingView
      data={data}
      buildLessonHref={buildLessonHref}
      courseLandingHref={`/dashboard/courses/${data.view.slug}`}
    />
  );
}
