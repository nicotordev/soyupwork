import type { Metadata } from "next";
import { LegalMarketingShell } from "@/components/legal/legal-marketing-shell";
import { ResourceIndexContent } from "@/components/resources/resource-index-content";
import {
  buildTemplatesIndexMetadata,
  TEMPLATES_PAGE,
} from "@/constants/templates.constants";
import { getPublishedResourcesPageData } from "@/lib/resources/get-public-resources";

export const metadata: Metadata = buildTemplatesIndexMetadata();

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PlantillasPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const data = await getPublishedResourcesPageData("template", resolved);

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
