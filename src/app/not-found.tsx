"use client";

import { AppEmptyState } from "@/components/app-state/app-empty-state";
import MarketingFooter from "@/components/marketing-footer";
import { MarketingNavServer } from "@/components/marketing-nav";
import useCatalogSections from "@/hooks/use-catalog-sections";
import { useSession } from "next-auth/react";

export default function NotFound() {
  const { status } = useSession();
  const isSignedIn = status === "authenticated";
  const catalogSectionsQuery = useCatalogSections();
  const catalogSections = catalogSectionsQuery.data ?? [];

  return (
    <div className="w-full min-w-0 flex-1 overflow-x-hidden bg-background">
      <div className="flex min-h-screen min-w-0 flex-col">
        <MarketingNavServer
          isSignedIn={isSignedIn}
          catalogSections={catalogSections}
        />
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
