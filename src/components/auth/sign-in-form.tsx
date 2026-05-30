"use client";

import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminInputClass, adminPanelClass } from "@/lib/admin/styles";
import { resolveSafeAppRedirectPath } from "@/lib/auth/redirect-url";
import { cn } from "@/lib/utils";
import { signInSchema } from "@/schemas/auth";
import { signIn } from "next-auth/react";
import { IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type SignInFormProps = {
  allowOAuthSignIn?: boolean;
  defaultCallbackUrl?: string;
  signUpUrl?: string;
};

export function SignInForm({
  allowOAuthSignIn = true,
  defaultCallbackUrl = "/dashboard",
  signUpUrl = "/sign-up",
}: SignInFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = resolveSafeAppRedirectPath(
    searchParams.get("redirect_url"),
    defaultCallbackUrl,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Datos inválidos.");
      return;
    }

    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    router.push(result?.url ?? callbackUrl);
    router.refresh();
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
          Iniciar sesión
        </h2>
        <p className="text-sm text-muted-foreground">
          Accedé a tu panel, cursos y progreso.
        </p>
      </div>

      <OAuthButtons
        callbackUrl={callbackUrl}
        allowOAuthSignIn={allowOAuthSignIn}
      />

      {allowOAuthSignIn ? (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-foreground/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 font-mono text-muted-foreground">
              o con correo
            </span>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sign-in-email">Correo</Label>
          <Input
            id="sign-in-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={adminInputClass}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sign-in-password">Contraseña</Label>
          <Input
            id="sign-in-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={adminInputClass}
            required
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          className="min-h-11 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <IconLoader2 className="size-4 animate-spin" aria-hidden />
              Ingresando…
            </>
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        ¿No tenés cuenta?{" "}
        <Link
          href={signUpUrl}
          className="font-semibold text-foreground underline"
        >
          Registrate
        </Link>
      </p>
    </div>
  );
}
