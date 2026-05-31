import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalMarketingShell } from "@/components/legal/legal-marketing-shell";
import { TemplateDetailContent } from "@/components/resources/template-detail-content";
import {
  getPublishedResourceCatalogItem,
  getPublishedResourceSlugs,
  getPublishedTemplateBySlug,
} from "@/lib/resources/get-public-resources";
import { templatePath } from "@/lib/resources/paths";
import { buildLegalMetadata } from "@/lib/legal/build-legal-metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPublishedResourceSlugs("template");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedResourceCatalogItem("template", slug);
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
  const detail = await getPublishedTemplateBySlug(slug);

  if (!detail) {
    notFound();
  }

  return (
    <LegalMarketingShell seed={521} shapeCount={3}>
      <TemplateDetailContent detail={detail} />
    </LegalMarketingShell>
  );
}
