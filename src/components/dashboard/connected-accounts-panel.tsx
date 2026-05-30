"use client";

import { Button } from "@/components/ui/button";
import { adminPanelClass } from "@/lib/admin/styles";
import {
  getOAuthProviderMeta,
  type OAuthLinkProvider,
} from "@/lib/auth/oauth-providers";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconCheck,
} from "@tabler/icons-react";
import { signIn } from "next-auth/react";

type ConnectedAccountsPanelProps = {
  connected: {
    google: boolean;
    github: boolean;
  };
  allowOAuthSignIn: boolean;
  callbackUrl: string;
};

function ProviderIcon({ provider }: { provider: OAuthLinkProvider }) {
  if (provider === "google") {
    return <IconBrandGoogle className="size-5" aria-hidden />;
  }
  return <IconBrandGithub className="size-5" aria-hidden />;
}

export function ConnectedAccountsPanel({
  connected,
  allowOAuthSignIn,
  callbackUrl,
}: ConnectedAccountsPanelProps) {
  if (!allowOAuthSignIn) {
    return null;
  }

  const providers: OAuthLinkProvider[] = ["google", "github"];

  return (
    <section
      className={cn(
        adminPanelClass,
        "space-y-4 border-2 border-foreground p-5 sm:p-6",
      )}
    >
      <div className="space-y-1">
        <h3 className="font-heading text-lg font-bold tracking-tight">
          Cuentas conectadas
        </h3>
        <p className="text-sm text-muted-foreground">
          Vinculá Google o GitHub para iniciar sesión más rápido con el mismo
          correo de tu cuenta.
        </p>
      </div>

      <div className="space-y-3">
        {providers.map((provider) => {
          const meta = getOAuthProviderMeta(provider);
          const isConnected = connected[provider];

          return (
            <div
              key={provider}
              className="flex flex-col gap-3 rounded-lg border-2 border-foreground/20 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full border-2 border-foreground bg-background">
                  <ProviderIcon provider={provider} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{meta.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {isConnected ? "Conectado" : "Sin conectar"}
                  </p>
                </div>
              </div>

              {isConnected ? (
                <div className="inline-flex min-h-10 items-center gap-2 self-start rounded-md border-2 border-emerald-500/40 bg-emerald-500/10 px-3 text-sm font-medium text-emerald-700 sm:self-auto">
                  <IconCheck className="size-4" aria-hidden />
                  Vinculado
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-10 self-start sm:self-auto"
                  onClick={() => signIn(provider, { callbackUrl })}
                >
                  Conectar {meta.label}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
