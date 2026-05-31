import type { Metadata } from "next";
import { LegalMarketingShell } from "@/components/legal/legal-marketing-shell";
import { ResourceIndexContent } from "@/components/resources/resource-index-content";
import {
  buildTemplatesIndexMetadata,
  TEMPLATE_CATEGORIES,
  TEMPLATE_ITEMS,
  TEMPLATES_PAGE,
} from "@/constants/templates.constants";
import { getResourceCatalogPageData } from "@/lib/resources/get-resource-catalog";

export const metadata: Metadata = buildTemplatesIndexMetadata();

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PlantillasPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const data = getResourceCatalogPageData(
    TEMPLATES_PAGE,
    "template",
    TEMPLATE_ITEMS,
    TEMPLATE_CATEGORIES,
    resolved,
  );

  return (
    <LegalMarketingShell seed={520} shapeCount={4}>
      <ResourceIndexContent
        page={TEMPLATES_PAGE}
        data={data}
        hubActive="plantillas"
      />
    </LegalMarketingShell>
  );
}
