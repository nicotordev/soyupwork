"use client";

import { Button } from "@/components/ui/button";
import { adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";
import { IconLoader2, IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

type SignOutViewProps = {
  redirectUrl?: string;
};

export function SignOutView({ redirectUrl }: SignOutViewProps) {
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut(redirectUrl ? { redirectUrl } : undefined);
    } catch {
      setIsSigningOut(false);
    }
  };

  return (
    <div
      className={cn(
        adminPanelClass,
        "space-y-6 border-2 border-foreground p-6 sm:p-8",
      )}
    >
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-bold tracking-tight">
          Cerrar sesión
        </h2>
        <p className="text-sm text-muted-foreground">
          ¿Seguro que querés salir? Vas a tener que iniciar sesión de nuevo para
          acceder a tus cursos y tu panel.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="min-h-11 flex-1"
        >
          {isSigningOut ? (
            <>
              <IconLoader2 className="size-4 animate-spin" aria-hidden />
              Cerrando sesión…
            </>
          ) : (
            <>
              <IconLogout className="size-4" stroke={2.5} aria-hidden />
              Cerrar sesión
            </>
          )}
        </Button>
        <Button asChild variant="outline" className="min-h-11 flex-1">
          <Link href="/dashboard">Cancelar</Link>
        </Button>
      </div>
    </div>
  );
}
