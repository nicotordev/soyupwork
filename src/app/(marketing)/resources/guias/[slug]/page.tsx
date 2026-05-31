import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalMarketingShell } from "@/components/legal/legal-marketing-shell";
import { GuideDetailContent } from "@/components/resources/guide-detail-content";
import { getGuideSlugs, GUIDE_ITEMS } from "@/constants/guides.constants";
import { findResourceBySlug } from "@/lib/resources/get-resource-catalog";
import { getGuideDetail } from "@/lib/resources/guide-content";
import { guidePath } from "@/lib/resources/paths";
import { buildLegalMetadata } from "@/lib/legal/build-legal-metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = findResourceBySlug(GUIDE_ITEMS, slug);
  if (!item) {
    return {
      title: "Guía no encontrada",
      robots: { index: false, follow: false },
    };
  }

  return buildLegalMetadata({
    path: guidePath(slug),
    title: `${item.title} · Guías Upwork LATAM`,
    description: item.excerpt,
    keywords: [...item.tags, "guía upwork", "freelancing latam"],
  });
}

export default async function GuiaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = findResourceBySlug(GUIDE_ITEMS, slug);

  if (!item || item.availability === "coming_soon") {
    notFound();
  }

  const detail = getGuideDetail(item);
  if (!detail) {
    notFound();
  }

  return (
    <LegalMarketingShell seed={421} shapeCount={3}>
      <GuideDetailContent detail={detail} />
    </LegalMarketingShell>
  );
}
