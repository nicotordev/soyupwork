import { MarketingNav } from "@/components/marketing-nav/marketing-nav";
import type { CatalogSection } from "@/types/marketing-nav.types";

interface MarketingNavServerProps {
  isSignedIn: boolean;
  catalogSections: CatalogSection[];
}

export async function MarketingNavServer({
  isSignedIn,
  catalogSections,
}: MarketingNavServerProps) {
  return (
    <MarketingNav isSignedIn={isSignedIn} catalogSections={catalogSections} />
  );
}
