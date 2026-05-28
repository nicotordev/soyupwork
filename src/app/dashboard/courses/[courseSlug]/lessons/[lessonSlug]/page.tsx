import { getCoursePageForStudent } from "@/app/actions/course-page.actions";
import { CourseLearnShell } from "@/components/course/course-learn-shell";
import { findLessonInView } from "@/lib/course/course-page-view";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseSlug, lessonSlug } = await params;
  const data = await getCoursePageForStudent(courseSlug).catch(() => null);
  const lesson = data ? findLessonInView(data.view, lessonSlug) : null;

  return {
    title: lesson
      ? `${lesson.title} — ${data?.view.title}`
      : (data?.view.title ?? "Lección"),
  };
}

export default async function DashboardCourseLessonPage({ params }: PageProps) {
  const { courseSlug, lessonSlug } = await params;

  const data = await getCoursePageForStudent(courseSlug).catch(() => null);

  if (!data) {
    notFound();
  }

  const lesson = findLessonInView(data.view, lessonSlug);

  if (!lesson || !lesson.isAccessible) {
    notFound();
  }

  return (
    <CourseLearnShell
      data={data}
      lessonSlug={lessonSlug}
      lessonBasePath={`/dashboard/courses/${data.view.slug}/lessons`}
      courseLandingHref={`/dashboard/courses/${data.view.slug}`}
    />
  );
}
