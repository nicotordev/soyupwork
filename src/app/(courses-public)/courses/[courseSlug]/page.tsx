import { getCoursePageForPublicLanding } from "@/app/actions/course-page.actions";
import { CourseLandingView } from "@/components/course/course-landing-view";
import { buildSignInRedirectUrl } from "@/lib/auth/build-sign-in-redirect";
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
  const { userId, isSignedIn } = await getClerkSession();
  const data = await getCoursePageForPublicLanding(courseSlug, userId);

  if (!data) {
    notFound();
  }

  const buildLessonHref = (lessonSlug: string) => {
    const lessonPath = `/courses/${data.view.slug}/lessons/${lessonSlug}`;
    return isSignedIn ? lessonPath : buildSignInRedirectUrl(lessonPath);
  };

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
