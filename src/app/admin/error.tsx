"use client";

import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { motion } from "framer-motion";
import { IconAlertTriangle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <AdminDashboardContainer>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto flex flex-col items-center justify-center py-20"
      >
        <Alert variant="destructive" className="mb-6 max-w-md w-full flex flex-col items-center">
          <IconAlertTriangle className="w-8 h-8 text-destructive mb-2" stroke={2} />
          <AlertTitle className="text-2xl font-extrabold tracking-tight">
            ¡Ha ocurrido un error!
          </AlertTitle>
          <AlertDescription className="text-muted-foreground text-center">
            Algo salió mal en el panel de administración. Intenta recargar la página o volver más tarde.
          </AlertDescription>
        </Alert>
        <div className="flex gap-3 mb-4">
          <Button variant="default" onClick={() => reset()} type="button">
            Reintentar
          </Button>
          <Button asChild variant="secondary">
            <a href="/admin">Volver al panel principal</a>
          </Button>
        </div>
        <Card className="mt-8 w-full max-w-lg bg-muted/30">
          <CardContent className="p-4">
            <details>
              <summary className="cursor-pointer mb-2 font-semibold text-sm">
                Detalles del error
              </summary>
              <pre className="whitespace-pre-wrap break-all text-muted-foreground text-xs mt-2">
                {error?.message}
              </pre>
            </details>
          </CardContent>
        </Card>
      </motion.div>
    </AdminDashboardContainer>
  );
}
