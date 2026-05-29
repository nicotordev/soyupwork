import { getCoursePageForPublicLanding } from "@/app/actions/course-page.actions";
import { CourseLandingView } from "@/components/course/course-landing-view";
import { getClerkSession } from "@/lib/clerk/session";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseSlug } = await params;
  const data = await getCoursePageForPublicLanding(courseSlug);

  return {
    title: data?.view.title ?? "Curso",
  };
}

export default async function PublicCourseLandingPage({ params }: PageProps) {
  const { courseSlug } = await params;
  const [{ isSignedIn }, data] = await Promise.all([
    getClerkSession(),
    getCoursePageForPublicLanding(courseSlug),
  ]);

  if (!data) {
    notFound();
  }

  const buildLessonHref = (lessonSlug: string) =>
    `/courses/${data.view.slug}/lessons/${lessonSlug}`;

  return (
    <CourseLandingView
      data={data}
      buildLessonHref={buildLessonHref}
      courseLandingHref={`/courses/${data.view.slug}`}
      isSignedIn={isSignedIn}
      useCheckoutFlow
    />
  );
}
