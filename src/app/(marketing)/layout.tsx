import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavServer } from "@/components/marketing-nav/marketing-nav-server";
import { PlatformAnnouncementBanner } from "@/components/platform/platform-announcement-banner";
import { getCatalogNavSections } from "@/app/actions/catalog.actions";
import { getClerkSession } from "@/lib/clerk/session";

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
    <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden">
      <PlatformAnnouncementBanner />
      <MarketingNavServer
        isSignedIn={isSignedIn}
        catalogSections={catalogSections}
      />
      <main className="w-full min-w-0">{children}</main>
      <MarketingFooter />
    </div>
  );
}
