import { AppLoadingState } from "@/components/app-state/app-loading-state";
import { MarketingNavServer } from "@/components/marketing-nav/marketing-nav-server";

export default function Loading() {
  return (
    <div className="flex-1 w-full bg-background">
      <div className="flex min-h-screen flex-col">
        <MarketingNavServer isSignedIn={false} catalogSections={[]} />
        <main className="flex-1">
          {" "}
          <div className="flex-1 w-full bg-background py-8">
            <AppLoadingState label="Cargando SoyUpwork..." />
          </div>
        </main>
      </div>
    </div>
  );
}
