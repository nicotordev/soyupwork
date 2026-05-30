"use client";

import { validateMagicLinkSignIn } from "@/app/actions/auth.actions";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminInputClass, adminPanelClass } from "@/lib/admin/styles";
import { resolveSafeAppRedirectPath } from "@/lib/auth/redirect-url";
import { cn } from "@/lib/utils";
import { magicLinkSignInSchema, signInSchema } from "@/schemas/auth";
import { signIn } from "next-auth/react";
import { IconLoader2, IconMail } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type SignInMode = "password" | "magic-link";

type SignInFormProps = {
  allowOAuthSignIn?: boolean;
  allowMagicLinkSignIn?: boolean;
  defaultCallbackUrl?: string;
  signUpUrl?: string;
  registrationDisabled?: boolean;
};

export function SignInForm({
  allowOAuthSignIn = true,
  allowMagicLinkSignIn = true,
  defaultCallbackUrl = "/dashboard",
  signUpUrl = "/sign-up",
  registrationDisabled = false,
}: SignInFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = resolveSafeAppRedirectPath(
    searchParams.get("redirect_url"),
    defaultCallbackUrl,
  );

  const initialError = (() => {
    const error = searchParams.get("error");
    if (error === "RegistrationDisabled") {
      return "El registro está cerrado. Solo usuarios existentes pueden iniciar sesión.";
    }
    if (error === "OAuthAccountNotLinked") {
      return "Ya existe una cuenta con este correo. Te redirigimos al flujo de vinculación segura.";
    }
    return null;
  })();

  const [mode, setMode] = useState<SignInMode>(
    allowMagicLinkSignIn ? "magic-link" : "password",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
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

  const handleMagicLinkSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError(null);

    const parsed = magicLinkSignInSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Datos inválidos.");
      return;
    }

    setIsSubmitting(true);

    const validation = await validateMagicLinkSignIn({
      email: parsed.data.email,
    });
    if (!validation.ok) {
      setIsSubmitting(false);
      setError(validation.error);
      return;
    }

    try {
      const result = await signIn("resend", {
        email: parsed.data.email.trim().toLowerCase(),
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError(
          registrationDisabled
            ? "El registro está cerrado. Usá una cuenta existente o contactá soporte."
            : "No pudimos enviar el enlace. Revisá el correo o intentá más tarde.",
        );
        return;
      }

      const verifyUrl = new URL("/sign-in/verify", window.location.origin);
      verifyUrl.searchParams.set(
        "email",
        parsed.data.email.trim().toLowerCase(),
      );
      const staffAccess = searchParams.get("access");
      const staffRedirect = searchParams.get("redirect_url");
      if (staffAccess) {
        verifyUrl.searchParams.set("access", staffAccess);
      }
      if (staffRedirect) {
        verifyUrl.searchParams.set("redirect_url", staffRedirect);
      }
      router.push(verifyUrl.pathname + verifyUrl.search);
    } catch {
      setError("No pudimos enviar el enlace. Intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showDivider = allowOAuthSignIn && (allowMagicLinkSignIn || mode);

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

      {showDivider ? (
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

      {allowMagicLinkSignIn ? (
        <div className="grid grid-cols-2 gap-2 rounded-lg border-2 border-foreground/20 p-1">
          <Button
            type="button"
            variant={mode === "magic-link" ? "default" : "ghost"}
            className="min-h-10"
            onClick={() => {
              setMode("magic-link");
              setError(null);
            }}
          >
            <IconMail className="size-4" aria-hidden />
            Enlace
          </Button>
          <Button
            type="button"
            variant={mode === "password" ? "default" : "ghost"}
            className="min-h-10"
            onClick={() => {
              setMode("password");
              setError(null);
            }}
          >
            Contraseña
          </Button>
        </div>
      ) : null}

      {mode === "magic-link" && allowMagicLinkSignIn ? (
        <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sign-in-magic-email">Correo</Label>
            <Input
              id="sign-in-magic-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
                Enviando enlace…
              </>
            ) : (
              "Enviar enlace de acceso"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Te enviaremos un enlace seguro por correo para iniciar sesión sin
            contraseña.
          </p>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
      )}

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
