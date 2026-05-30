import { DemoPresentation } from "@/components/demo/demo-presentation";
import { loadDemoCoursePage } from "@/lib/demo/load-demo-course";
import type { Metadata } from "next";
import { getCatalogNavSections } from "@/app/actions/catalog.actions";
import { getClerkSession } from "@/lib/clerk/session";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Demo | SoyUpwork",
  description:
    "Explora la plataforma en vivo: temario, lecciones, vídeo, texto y quizzes — todo en una sola página.",
};

export default async function DemoPage() {
  const [clerkSession, catalogSections, data] = await Promise.all([
    getClerkSession(),
    getCatalogNavSections(),
    loadDemoCoursePage(),
  ]);
  const { isSignedIn } = clerkSession ?? {};

  return (
    <Suspense fallback={null}>
      <DemoPresentation
        data={data}
        isSignedIn={!!isSignedIn}
        catalogSections={catalogSections}
      />
    </Suspense>
  );
}
