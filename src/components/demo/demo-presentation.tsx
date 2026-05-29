"use client";

import { DemoCasinoSounds } from "@/components/demo/demo-casino-sounds.client";
import { CourseLandingView } from "@/components/course/course-landing-view";
import { CourseLearnShell } from "@/components/course/course-learn-shell";
import { applyCoursePageSequentialAccess } from "@/lib/course/apply-course-page-sequential";
import { findLessonInView } from "@/lib/course/course-page-view";
import { findFirstAccessibleLessonSlug } from "@/lib/course/sequential-lesson-access";
import {
  readDemoCompletedLessonIds,
  writeDemoCompletedLessonIds,
} from "@/lib/demo/demo-lesson-progress-storage";
import type { CoursePageData } from "@/types/course-page.types";
import type { CatalogSection } from "@/types/marketing-nav.types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MarketingNavServer } from "../marketing-nav/marketing-nav-server";
import { MarketingFooter } from "../marketing-footer";

type DemoPresentationProps = {
  data: CoursePageData;
  activeLessonSlug: string | null;
  isSignedIn: boolean;
  catalogSections: CatalogSection[];
};

export function DemoPresentation({
  data,
  activeLessonSlug,
  isSignedIn,
  catalogSections,
}: DemoPresentationProps) {
  const router = useRouter();
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCompletedLessonIds(readDemoCompletedLessonIds(data.view.id));
    setHydrated(true);
  }, [data.view.id]);

  const completedSet = useMemo(
    () => new Set(completedLessonIds),
    [completedLessonIds],
  );

  const dataWithProgress = useMemo(
    () => applyCoursePageSequentialAccess(data, completedSet),
    [data, completedSet],
  );

  const { view } = dataWithProgress;
  const lesson =
    activeLessonSlug !== null ? findLessonInView(view, activeLessonSlug) : null;

  const buildLessonHref = (lessonSlug: string) =>
    `/demo?leccion=${encodeURIComponent(lessonSlug)}`;
  const courseLandingHref = "/demo";
  const inLesson = lesson !== null;

  useEffect(() => {
    if (!hydrated || !activeLessonSlug || !lesson || lesson.isAccessible) {
      return;
    }

    const firstSlug = findFirstAccessibleLessonSlug(view.modules);
    if (firstSlug && firstSlug !== activeLessonSlug) {
      router.replace(buildLessonHref(firstSlug));
    }
  }, [hydrated, activeLessonSlug, lesson, view.modules, router]);

  const handleDemoLessonComplete = useCallback(
    (lessonId: string) => {
      setCompletedLessonIds((current) => {
        if (current.includes(lessonId)) return current;
        const next = [...current, lessonId];
        writeDemoCompletedLessonIds(data.view.id, next);
        return next;
      });
    },
    [data.view.id],
  );

  return inLesson && lesson ? (
    <>
      <DemoCasinoSounds />
      <CourseLearnShell
        data={dataWithProgress}
        lessonSlug={lesson.slug}
        lessonBasePath="/demo"
        courseLandingHref={courseLandingHref}
        lessonHrefMode="query"
        showModeBanner={false}
        onDemoLessonComplete={handleDemoLessonComplete}
      />
    </>
  ) : (
    <>
      <DemoCasinoSounds />
      <MarketingNavServer
        isSignedIn={isSignedIn}
        catalogSections={catalogSections}
      />
      <CourseLandingView
        data={dataWithProgress}
        buildLessonHref={buildLessonHref}
        courseLandingHref={courseLandingHref}
        showModeBanner={false}
        isSignedIn={isSignedIn}
        catalogSections={catalogSections}
      />
      <MarketingFooter />
    </>
  );
}
