import { getCatalogNavSections } from "@/app/actions/catalog.actions";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavServer } from "@/components/marketing-nav/marketing-nav-server";
import { PlatformAnnouncementBanner } from "@/components/platform/platform-announcement-banner";
import { getClerkSession } from "@/lib/clerk/session";
import { isPublicWaitlistMode } from "@/lib/platform/public-waitlist-mode";
import { redirect } from "next/navigation";

export default async function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ isSignedIn, userId }, catalogSections] = await Promise.all([
    getClerkSession(),
    getCatalogNavSections(),
  ]);

  if (!userId) {
    redirect(isPublicWaitlistMode() ? "/waitlist" : "/sign-in");
  }

  return (
    <div className="flex min-h-svh w-full min-w-0 flex-col overflow-x-hidden bg-background font-sans text-foreground">
      <PlatformAnnouncementBanner />
      <MarketingNavServer
        isSignedIn={isSignedIn}
        catalogSections={catalogSections}
      />
      <main className="w-full min-w-0 flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
