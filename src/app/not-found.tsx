import { AppEmptyState } from "@/components/app-state/app-empty-state";
import MarketingFooter from "@/components/marketing-footer";
import { MarketingNavServer } from "@/components/marketing-nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada | SoyUpwork",
  description:
    "No pudimos encontrar el recurso o página que estás buscando en SoyUpwork.",
};

export default function NotFound() {
  return (
    <div className="w-full min-w-0 flex-1 overflow-x-hidden bg-background">
      <div className="flex min-h-screen min-w-0 flex-col">
        <MarketingNavServer isSignedIn={false} catalogSections={[]} />
        <main className="min-w-0 flex-1">
          <AppEmptyState
            title="No encontramos esta página"
            description="Puede que el enlace haya cambiado, el contenido ya no exista o todavía no tengas acceso a este módulo."
            showDashboardButton={true}
          />
        </main>
        <MarketingFooter />
      </div>
    </div>
  );
}
