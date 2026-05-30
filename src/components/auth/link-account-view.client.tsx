"use client";

import {
  getLinkAccountPageContext,
  validateMagicLinkSignIn,
} from "@/app/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminInputClass, adminPanelClass } from "@/lib/admin/styles";
import {
  getOAuthProviderMeta,
  isOAuthLinkProvider,
  type OAuthLinkProvider,
} from "@/lib/auth/oauth-providers";
import { resolveSafeAppRedirectPath } from "@/lib/auth/redirect-url";
import { cn } from "@/lib/utils";
import { magicLinkSignInSchema, signInSchema } from "@/schemas/auth";
import {
  IconAlertTriangle,
  IconLink,
  IconLoader2,
  IconMail,
  IconShieldCheck,
} from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type LinkAccountViewProps = {
  provider: OAuthLinkProvider;
  email: string;
  defaultCallbackUrl: string;
};

type LinkAccountContext = Extract<
  Awaited<ReturnType<typeof getLinkAccountPageContext>>,
  { ok: true }
>;

export function LinkAccountView({
  provider,
  email,
  defaultCallbackUrl,
}: LinkAccountViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = resolveSafeAppRedirectPath(
    searchParams.get("redirect_url"),
    defaultCallbackUrl,
  );

  const providerMeta = getOAuthProviderMeta(provider);
  const ProviderIcon = providerMeta.Icon;

  const [context, setContext] = useState<LinkAccountContext | null>(null);
  const [contextError, setContextError] = useState<string | null>(null);
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [mode, setMode] = useState<"password" | "magic-link">("password");

  const linkAccountPath = useMemo(() => {
    const params = new URLSearchParams({
      provider,
      email,
      redirect_url: callbackUrl,
    });
    return `/sign-in/link-account?${params.toString()}`;
  }, [provider, email, callbackUrl]);

  useEffect(() => {
    let cancelled = false;

    async function loadContext() {
      setIsLoadingContext(true);
      const result = await getLinkAccountPageContext({ provider, email });
      if (cancelled) return;

      if (!result.ok) {
        setContextError(result.error);
        setContext(null);
      } else {
        setContext(result);
        setContextError(null);
        if (!result.hasPassword && result.magicLinkEnabled) {
          setMode("magic-link");
        }
      }
      setIsLoadingContext(false);
    }

    void loadContext();
    return () => {
      cancelled = true;
    };
  }, [provider, email]);

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
      callbackUrl: linkAccountPath,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    router.refresh();
    const refreshed = await getLinkAccountPageContext({ provider, email });
    if (refreshed.ok) {
      setContext(refreshed);
    }
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
        callbackUrl: linkAccountPath,
      });

      if (result?.error) {
        setError("No pudimos enviar el enlace. Intentá más tarde.");
        return;
      }

      const verifyUrl = new URL("/sign-in/verify", window.location.origin);
      verifyUrl.searchParams.set(
        "email",
        parsed.data.email.trim().toLowerCase(),
      );
      verifyUrl.searchParams.set("redirect_url", linkAccountPath);
      router.push(verifyUrl.pathname + verifyUrl.search);
    } catch {
      setError("No pudimos enviar el enlace. Intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmLink = () => {
    setError(null);
    setIsLinking(true);
    void signIn(provider, { callbackUrl });
  };

  if (isLoadingContext) {
    return (
      <div
        className={cn(
          adminPanelClass,
          "flex min-h-48 items-center justify-center border-2 border-foreground p-6 sm:p-8",
        )}
      >
        <IconLoader2 className="size-6 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  if (contextError) {
    return (
      <div
        className={cn(
          adminPanelClass,
          "space-y-6 border-2 border-foreground p-6 sm:p-8",
        )}
      >
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            No se puede vincular
          </h2>
          <p className="text-sm text-destructive" role="alert">
            {contextError}
          </p>
        </div>
        <Button asChild className="min-h-11 w-full">
          <Link href="/sign-in">Volver a iniciar sesión</Link>
        </Button>
      </div>
    );
  }

  if (!context) {
    return null;
  }

  if (context.isSignedIn && !context.isCurrentUser) {
    return (
      <div
        className={cn(
          adminPanelClass,
          "space-y-6 border-2 border-foreground p-6 sm:p-8",
        )}
      >
        <div className="flex items-start gap-3 rounded-lg border-2 border-amber-500/40 bg-amber-500/10 p-4">
          <IconAlertTriangle
            className="mt-0.5 size-5 shrink-0 text-amber-600"
            aria-hidden
          />
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-foreground">
              Estás con otra cuenta activa
            </p>
            <p className="text-muted-foreground">
              Para vincular {providerMeta.label} con{" "}
              <span className="font-semibold text-foreground">{email}</span>,
              cerrá sesión e iniciá con esa cuenta primero.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline" className="min-h-11 flex-1">
            <Link href="/sign-out">Cerrar sesión</Link>
          </Button>
          <Button asChild className="min-h-11 flex-1">
            <Link href="/sign-in">Ir a iniciar sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (context.isCurrentUser) {
    return (
      <div
        className={cn(
          adminPanelClass,
          "space-y-6 border-2 border-foreground p-6 sm:p-8",
        )}
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-full border-2 border-foreground bg-primary/10">
          <IconShieldCheck
            className="size-7 text-primary"
            stroke={2}
            aria-hidden
          />
        </div>

        <div className="space-y-2 text-center">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            ¿Vincular {providerMeta.label}?
          </h2>
          <p className="text-sm text-muted-foreground">
            Vas a conectar {providerMeta.label} con tu cuenta{" "}
            <span className="font-semibold text-foreground">{email}</span>.
            Después podrás iniciar sesión con {providerMeta.label} o con tu
            método habitual.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 rounded-lg border-2 border-foreground/20 bg-muted/40 p-4">
          <div className="flex size-10 items-center justify-center rounded-full border-2 border-foreground bg-background">
            <ProviderIcon className="size-5" aria-hidden />
          </div>
          <IconLink className="size-4 text-muted-foreground" aria-hidden />
          <div className="flex size-10 items-center justify-center rounded-full border-2 border-foreground bg-background">
            <IconMail className="size-5" aria-hidden />
          </div>
        </div>

        {error ? (
          <p className="text-sm text-destructive text-center" role="alert">
            {error}
          </p>
        ) : null}

        <Button
          type="button"
          className="min-h-11 w-full"
          disabled={isLinking}
          onClick={handleConfirmLink}
        >
          {isLinking ? (
            <>
              <IconLoader2 className="size-4 animate-spin" aria-hidden />
              Conectando…
            </>
          ) : (
            <>Sí, vincular {providerMeta.label}</>
          )}
        </Button>

        <Button asChild variant="ghost" className="min-h-11 w-full">
          <Link href={callbackUrl}>Cancelar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        adminPanelClass,
        "space-y-6 border-2 border-foreground p-6 sm:p-8",
      )}
    >
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-bold tracking-tight">
          Confirmá tu identidad
        </h2>
        <p className="text-sm text-muted-foreground">
          Ya existe una cuenta con{" "}
          <span className="font-semibold text-foreground">{email}</span>. Iniciá
          sesión para vincular {providerMeta.label} de forma segura.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-lg border-2 border-foreground/20 bg-muted/40 p-4">
        <div className="flex size-10 items-center justify-center rounded-full border-2 border-foreground bg-background">
          <ProviderIcon className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 text-sm">
          <p className="font-semibold text-foreground">
            Vincular {providerMeta.label}
          </p>
          <p className="truncate text-muted-foreground">{email}</p>
        </div>
      </div>

      {context.hasPassword && context.magicLinkEnabled ? (
        <div className="grid grid-cols-2 gap-2 rounded-lg border-2 border-foreground/20 p-1">
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
        </div>
      ) : null}

      {mode === "magic-link" && context.magicLinkEnabled ? (
        <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-account-email">Correo</Label>
            <Input
              id="link-account-email"
              type="email"
              value={email}
              readOnly
              className={cn(adminInputClass, "bg-muted/50")}
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
              "Enviar enlace de verificación"
            )}
          </Button>
        </form>
      ) : context.hasPassword ? (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-account-email-password">Correo</Label>
            <Input
              id="link-account-email-password"
              type="email"
              value={email}
              readOnly
              className={cn(adminInputClass, "bg-muted/50")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-account-password">Contraseña</Label>
            <Input
              id="link-account-password"
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
                Verificando…
              </>
            ) : (
              "Verificar y continuar"
            )}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          Esta cuenta no tiene contraseña configurada. Contactá soporte para
          vincular {providerMeta.label}.
        </p>
      )}

      <Button asChild variant="ghost" className="min-h-11 w-full">
        <Link href="/sign-in">Cancelar</Link>
      </Button>
    </div>
  );
}
