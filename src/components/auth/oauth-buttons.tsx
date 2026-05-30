"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { useState } from "react";

type OAuthButtonsProps = {
  callbackUrl: string;
  allowOAuthSignIn?: boolean;
  className?: string;
};

export function OAuthButtons({
  callbackUrl,
  allowOAuthSignIn = true,
  className,
}: OAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null);

  if (!allowOAuthSignIn) {
    return null;
  }

  const handleOAuth = (provider: "google" | "github") => {
    setLoadingProvider(provider);
    void signIn(provider, { callbackUrl });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        className="min-h-11 w-full"
        disabled={loadingProvider !== null}
        onClick={() => handleOAuth("google")}
      >
        <IconBrandGoogle className="size-4" aria-hidden />
        {loadingProvider === "google" ? "Conectando…" : "Continuar con Google"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="min-h-11 w-full"
        disabled={loadingProvider !== null}
        onClick={() => handleOAuth("github")}
      >
        <IconBrandGithub className="size-4" aria-hidden />
        {loadingProvider === "github" ? "Conectando…" : "Continuar con GitHub"}
      </Button>
    </div>
  );
}
