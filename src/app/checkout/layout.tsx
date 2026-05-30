import { getCatalogNavSections } from "@/app/actions/catalog.actions";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavServer } from "@/components/marketing-nav/marketing-nav-server";
import { PlatformAnnouncementBanner } from "@/components/platform/platform-announcement-banner";
import { getAuthSession } from "@/lib/auth/session";
import { isPublicWaitlistMode } from "@/lib/platform/public-waitlist-mode";
import { redirect } from "next/navigation";
import { adminGridBackgroundClass } from "@/lib/admin/styles";

export default async function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ isSignedIn, userId }, catalogSections] = await Promise.all([
    getAuthSession(),
    getCatalogNavSections(),
  ]);

  if (!userId) {
    redirect(isPublicWaitlistMode() ? "/waitlist" : "/sign-in");
  }

  return (
    <div className="relative flex min-h-svh w-full min-w-0 flex-col overflow-x-hidden bg-background font-sans text-foreground antialiased">
      <div className={adminGridBackgroundClass} />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,var(--primary),transparent)] opacity-10 md:opacity-15" />
      <PlatformAnnouncementBanner />
      <MarketingNavServer
        isSignedIn={isSignedIn}
        catalogSections={catalogSections}
      />
      <main className="relative w-full min-w-0 flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}

