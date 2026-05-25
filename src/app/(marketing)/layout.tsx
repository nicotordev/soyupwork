import { MarketingNavServer } from "@/components/marketing-nav/marketing-nav-server";
import { MarketingFooter } from "@/components/marketing-footer";
import { getClerkSession } from "@/lib/clerk/session";
import { getCatalogNavSections } from "@/lib/catalog/categories";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ isSignedIn }, catalogSections] = await Promise.all([
    getClerkSession(),
    getCatalogNavSections(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNavServer isSignedIn={isSignedIn} catalogSections={catalogSections} />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
