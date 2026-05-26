"use client";

import { AppErrorState } from "@/components/app-state/app-error-state";
import "./globals.css";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavServer } from "@/components/marketing-nav";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <div className="flex-1 w-full bg-background">
      <div className="flex min-h-screen flex-col">
        <MarketingNavServer isSignedIn={false} catalogSections={[]} />
        <main className="flex-1">
          {" "}
          <AppErrorState
            error={error}
            reset={reset}
            title="Algo salió mal"
            description="No pudimos cargar esta sección de la plataforma. Puedes intentar recargar la página o volver a tu panel principal."
          />{" "}
        </main>
        <MarketingFooter />
      </div>
    </div>
  );
}
