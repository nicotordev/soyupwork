import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalMarketingShell } from "@/components/legal/legal-marketing-shell";
import { TemplateDetailContent } from "@/components/resources/template-detail-content";
import {
  getTemplateSlugs,
  TEMPLATE_ITEMS,
} from "@/constants/templates.constants";
import { findResourceBySlug } from "@/lib/resources/get-resource-catalog";
import { getTemplateDetail } from "@/lib/resources/template-content";
import { templatePath } from "@/lib/resources/paths";
import { buildLegalMetadata } from "@/lib/legal/build-legal-metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getTemplateSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = findResourceBySlug(TEMPLATE_ITEMS, slug);
  if (!item) {
    return {
      title: "Plantilla no encontrada",
      robots: { index: false, follow: false },
    };
  }

  return buildLegalMetadata({
    path: templatePath(slug),
    title: `${item.title} · Plantillas Upwork`,
    description: item.excerpt,
    keywords: [...item.tags, "plantilla upwork", "propuesta freelance"],
  });
}

export default async function PlantillaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = findResourceBySlug(TEMPLATE_ITEMS, slug);

  if (!item || item.availability === "coming_soon") {
    notFound();
  }

  const detail = getTemplateDetail(item);
  if (!detail) {
    notFound();
  }

  return (
    <LegalMarketingShell seed={521} shapeCount={3}>
      <TemplateDetailContent detail={detail} />
    </LegalMarketingShell>
  );
}
