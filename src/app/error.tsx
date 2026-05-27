"use client";

import { AppErrorState } from "@/components/app-state/app-error-state";
import "./globals.css";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavServer } from "@/components/marketing-nav";
import { useClerk } from "@clerk/nextjs";
import useCatalogSections from "@/hooks/use-catalog-sections";
import Providers from "./providers";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalRouteError({ error, reset }: ErrorProps) {
  const { isSignedIn } = useClerk();
  const catalogSectionsQuery = useCatalogSections();
  const catalogSections = catalogSectionsQuery.data ?? [];

  return (
    <Providers>
      <div className="w-full min-w-0 flex-1 overflow-x-hidden bg-background">
        <div className="flex min-h-screen min-w-0 flex-col">
          <MarketingNavServer
            isSignedIn={isSignedIn}
            catalogSections={catalogSections}
          />
          <main className="min-w-0 flex-1">
            <AppErrorState
              error={error}
              reset={reset}
              title="Algo salió mal"
              description="No pudimos cargar esta sección de la plataforma. Puedes intentar recargar la página o volver a tu panel principal."
            />
          </main>
          <MarketingFooter />
        </div>
      </div>
    </Providers>
  );
}
