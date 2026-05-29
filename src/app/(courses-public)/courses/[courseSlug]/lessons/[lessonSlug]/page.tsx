import { getCoursePageForStudent } from "@/app/actions/course-page.actions";
import { CourseLearnShell } from "@/components/course/course-learn-shell";
import { findLessonInView } from "@/lib/course/course-page-view";
import { findFirstAccessibleLessonSlug } from "@/lib/course/sequential-lesson-access";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

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
  await auth.protect();

  const { courseSlug, lessonSlug } = await params;

  const data = await getCoursePageForStudent(courseSlug);

  if (!data) {
    notFound();
  }

  const lesson = findLessonInView(data.view, lessonSlug);

  if (!lesson) {
    notFound();
  }

  if (!lesson.isAccessible) {
    const firstAccessible = findFirstAccessibleLessonSlug(data.view.modules);
    if (firstAccessible && firstAccessible !== lessonSlug) {
      redirect(`/courses/${data.view.slug}/lessons/${firstAccessible}`);
    }
    notFound();
  }

  return (
    <CourseLearnShell
      data={data}
      lessonSlug={lessonSlug}
      lessonBasePath={`/courses/${data.view.slug}/lessons`}
      courseLandingHref={`/courses/${data.view.slug}`}
    />
  );
}
