import { getCoursePageForPublicLanding } from "@/app/actions/course-page.actions";
import { CourseLandingView } from "@/components/course/course-landing-view";
import { PlatformAnnouncementBanner } from "@/components/platform/platform-announcement-banner";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavServer } from "@/components/marketing-nav/marketing-nav-server";
import { buildSignInRedirectUrl } from "@/lib/auth/build-sign-in-redirect";
import { getAuthSession } from "@/lib/auth/session";
import { getCatalogNavSections } from "@/app/actions/catalog.actions";
import { getPublishedCourseSeoMetadata } from "@/lib/seo/fetch-public-seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseSlug } = await params;
  const metadata = await getPublishedCourseSeoMetadata(courseSlug);

  if (metadata) {
    return metadata;
  }

  return {
    title: "Curso no encontrado",
    robots: { index: false, follow: false },
  };
}

export default async function PublicCourseLandingPage({ params }: PageProps) {
  const { courseSlug } = await params;

  const [{ userId, isSignedIn }, data, catalogSections] = await Promise.all([
    getAuthSession(),
    getCoursePageForPublicLanding(courseSlug),
    getCatalogNavSections(),
  ]);

  if (!data) {
    notFound();
  }

  const buildLessonHref = (lessonSlug: string) => {
    const lessonPath = `/courses/${data.view.slug}/lessons/${lessonSlug}`;
    return isSignedIn ? lessonPath : buildSignInRedirectUrl(lessonPath);
  };

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden">
      <PlatformAnnouncementBanner />
      <MarketingNavServer
        isSignedIn={isSignedIn}
        catalogSections={catalogSections}
      />
      <main className="w-full min-w-0">
        {" "}
        <CourseLandingView
          data={data}
          buildLessonHref={buildLessonHref}
          courseLandingHref={`/courses/${data.view.slug}`}
          isSignedIn={isSignedIn}
          useCheckoutFlow
        />
      </main>
      <MarketingFooter />
    </div>
  );
}
