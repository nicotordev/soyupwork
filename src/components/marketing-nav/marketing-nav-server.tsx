import { MarketingNav } from "@/components/marketing-nav/marketing-nav";
import type { CatalogSection } from "@/types/marketing-nav.types";

interface MarketingNavServerProps {
  isSignedIn: boolean;
  catalogSections: CatalogSection[];
  isLoadingCatalogSections?: boolean;
}

export function MarketingNavServer({
  isSignedIn,
  catalogSections,
  isLoadingCatalogSections = false,
}: MarketingNavServerProps) {
  return (
    <MarketingNav
      isSignedIn={isSignedIn}
      catalogSections={catalogSections}
      isLoadingCatalogSections={isLoadingCatalogSections}
    />
  );
}
