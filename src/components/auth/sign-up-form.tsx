"use client";

import { registerUser } from "@/app/actions/auth.actions";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminInputClass, adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { registerUserSchema } from "@/schemas/auth";
import { signIn } from "next-auth/react";
import { IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignUpFormProps = {
  allowOAuthSignIn?: boolean;
  defaultCallbackUrl?: string;
  lockedEmail?: string | null;
  hasValidInvite?: boolean;
};

export function SignUpForm({
  allowOAuthSignIn = true,
  defaultCallbackUrl = "/onboarding",
  lockedEmail = null,
  hasValidInvite = false,
}: SignUpFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(lockedEmail ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = registerUserSchema.safeParse({
      email,
      firstName,
      lastName,
      password,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Datos inválidos.");
      return;
    }

    setIsSubmitting(true);

    const registerResult = await registerUser(parsed.data);
    if (!registerResult.ok) {
      setIsSubmitting(false);
      setError(registerResult.error);
      return;
    }

    const signInResult = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
      callbackUrl: defaultCallbackUrl,
    });

    setIsSubmitting(false);

    if (signInResult?.error) {
      setError(
        "Cuenta creada, pero no pudimos iniciar sesión automáticamente.",
      );
      return;
    }

    router.push(signInResult?.url ?? defaultCallbackUrl);
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
          Crear cuenta
        </h2>
        <p className="text-sm text-muted-foreground">
          {hasValidInvite
            ? "Completá tu registro con el correo de tu invitación."
            : "Registrate para acceder al catálogo y tu panel de estudiante."}
        </p>
      </div>

      <OAuthButtons
        callbackUrl={defaultCallbackUrl}
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sign-up-first-name">Nombre</Label>
            <Input
              id="sign-up-first-name"
              autoComplete="given-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className={adminInputClass}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sign-up-last-name">Apellido</Label>
            <Input
              id="sign-up-last-name"
              autoComplete="family-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className={adminInputClass}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sign-up-email">Correo</Label>
          <Input
            id="sign-up-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={adminInputClass}
            required
            readOnly={Boolean(lockedEmail)}
            disabled={Boolean(lockedEmail)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sign-up-password">Contraseña</Label>
          <Input
            id="sign-up-password"
            type="password"
            autoComplete="new-password"
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
              Creando cuenta…
            </>
          ) : (
            "Registrarse"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-foreground underline"
        >
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
