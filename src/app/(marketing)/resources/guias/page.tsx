import type { Metadata } from "next";
import { LegalMarketingShell } from "@/components/legal/legal-marketing-shell";
import { ResourceIndexContent } from "@/components/resources/resource-index-content";
import {
  buildGuidesIndexMetadata,
  GUIDE_CATEGORIES,
  GUIDE_ITEMS,
  GUIDES_PAGE,
} from "@/constants/guides.constants";
import { getResourceCatalogPageData } from "@/lib/resources/get-resource-catalog";

export const metadata: Metadata = buildGuidesIndexMetadata();

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function GuiasPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const data = getResourceCatalogPageData(
    GUIDES_PAGE,
    "guide",
    GUIDE_ITEMS,
    GUIDE_CATEGORIES,
    resolved,
  );

  return (
    <LegalMarketingShell seed={420} shapeCount={4}>
      <ResourceIndexContent page={GUIDES_PAGE} data={data} hubActive="guias" />
    </LegalMarketingShell>
  );
}
