import { NeobrutalistPageDecoration } from "@/components/common/neobrutalist-page-decoration";

type LegalMarketingShellProps = {
  children: React.ReactNode;
  seed?: number;
  shapeCount?: number;
};

export function LegalMarketingShell({
  children,
  seed = 901,
  shapeCount = 5,
}: LegalMarketingShellProps) {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-background font-sans text-foreground antialiased">
      <NeobrutalistPageDecoration shapeCount={shapeCount} seed={seed} />
      {children}
    </div>
  );
}
