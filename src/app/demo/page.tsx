import { DemoPresentation } from "@/components/demo/demo-presentation";
import { loadDemoCoursePage } from "@/lib/demo/load-demo-course";
import { findLessonInView } from "@/lib/course/get-course-page-data";
import type { Metadata } from "next";
import { getCatalogNavSections } from "../actions/catalog.actions";
import { getClerkSession } from "@/lib/clerk/session";

export const metadata: Metadata = {
  title: "Demo | SoyUpwork",
  description:
    "Explora la plataforma en vivo: temario, lecciones, vídeo, texto y quizzes — todo en una sola página.",
};

type PageProps = {
  searchParams: Promise<{ leccion?: string }>;
};

export default async function DemoPage({ searchParams }: PageProps) {
  const { leccion } = await searchParams;
  const [clerkSession, catalogSections] = await Promise.all([
    getClerkSession(),
    getCatalogNavSections(),
  ]);
  const { isSignedIn } = clerkSession ?? {};
  const data = await loadDemoCoursePage();

  const activeLessonSlug =
    leccion && findLessonInView(data.view, leccion) ? leccion : null;

  return (
    <DemoPresentation
      data={data}
      activeLessonSlug={activeLessonSlug}
      isSignedIn={!!isSignedIn}
      catalogSections={catalogSections}
    />
  );
}
