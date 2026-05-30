import { DemoPresentation } from "@/components/demo/demo-presentation";
import { loadDemoCoursePage } from "@/lib/demo/load-demo-course";
import type { Metadata } from "next";
import { getCatalogNavSections } from "@/app/actions/catalog.actions";
import { getAuthSession } from "@/lib/auth/session";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Demo | SoyUpwork",
  description:
    "Explora la plataforma en vivo: temario, lecciones, vídeo, texto y quizzes — todo en una sola página.",
};

export default async function DemoPage() {
  const [authSession, catalogSections, data] = await Promise.all([
    getAuthSession(),
    getCatalogNavSections(),
    loadDemoCoursePage(),
  ]);
  const { isSignedIn } = authSession ?? {};

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
