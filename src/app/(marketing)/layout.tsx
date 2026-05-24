import { MarketingNavServer } from "@/components/marketing-nav/marketing-nav-server";
import { MarketingFooter } from "@/components/marketing-footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNavServer />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
