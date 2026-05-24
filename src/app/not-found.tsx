import { AppEmptyState } from "@/components/app-state/app-empty-state";
import { MarketingNavServer } from "@/components/marketing-nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada | SoyUpwork",
  description:
    "No pudimos encontrar el recurso o página que estás buscando en SoyUpwork.",
};

export default function NotFound() {
  return (
    <div className="flex-1 w-full bg-background">
      <div className="flex min-h-screen flex-col">
        <MarketingNavServer />
        <main className="flex-1">
          {" "}
          <AppEmptyState
            title="No encontramos esta página"
            description="Puede que el enlace haya cambiado, el contenido ya no exista o todavía no tengas acceso a este módulo."
            showDashboardButton={true}
          />{" "}
        </main>
      </div>
    </div>
  );
}
