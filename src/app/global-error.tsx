"use client";

import { AppErrorState } from "@/components/app-state/app-error-state";
import "./globals.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="es" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col font-sans text-base/relaxed text-foreground bg-background">
        <div className="flex flex-1 items-center justify-center">
          <AppErrorState
            error={error}
            reset={reset}
            title="Error Crítico del Sistema"
            description="La plataforma experimentó una interrupción a nivel global. Puedes intentar forzar la recarga o ponerte en contacto con soporte si persiste."
          />
        </div>
      </body>
    </html>
  );
}
