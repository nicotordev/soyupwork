"use client";

import { AppErrorState } from "@/components/app-state/app-error-state";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalRouteError({ error, reset }: ErrorProps) {
  return (
    <div className="flex-1 w-full bg-background">
      <AppErrorState
        error={error}
        reset={reset}
        title="Algo salió mal"
        description="No pudimos cargar esta sección de la plataforma. Puedes intentar recargar la página o volver a tu panel principal."
      />
    </div>
  );
}
