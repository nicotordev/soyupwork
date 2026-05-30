"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { IconCheck, IconLoader2 } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { mapClientTurnstileErrorCode } from "@/lib/turnstile/error-codes";
import { cn } from "@/lib/utils";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const enableInDev = process.env.NEXT_PUBLIC_TURNSTILE_ENABLE_DEV === "true";

type TurnstileFieldProps = {
  onToken: (token: string) => void;
  onExpire?: () => void;
  onError?: (message?: string) => void;
  className?: string;
  resetKey?: number;
  action?: string;
};

export function isTurnstileEnabled(): boolean {
  if (!siteKey) return false;
  if (process.env.NODE_ENV !== "production" && !enableInDev) return false;
  return true;
}

export function TurnstileField({
  onToken,
  onExpire,
  onError,
  className,
  resetKey = 0,
  action,
}: TurnstileFieldProps) {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [mounted, setMounted] = useState(false);
  const [verified, setVerified] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setVerified(false);
    setWaiting(true);
    setLoadError(null);
    turnstileRef.current?.reset();
  }, [resetKey]);

  const handleSuccess = useCallback(
    (token: string) => {
      setVerified(true);
      setWaiting(false);
      setLoadError(null);
      onToken(token);
    },
    [onToken],
  );

  const handleExpire = useCallback(() => {
    setVerified(false);
    setWaiting(true);
    onExpire?.();
  }, [onExpire]);

  const handleError = useCallback(
    (errorCode?: string) => {
      setVerified(false);
      setWaiting(false);
      const message = errorCode
        ? mapClientTurnstileErrorCode(errorCode)
        : "La verificación de seguridad falló. Intenta de nuevo.";
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Turnstile]", errorCode ?? "unknown", message);
      }
      onError?.(message);
    },
    [onError],
  );

  const handleScriptError = useCallback(() => {
    const message =
      "No se pudo cargar Cloudflare Turnstile. Revisa bloqueadores o red.";
    setLoadError(message);
    setWaiting(false);
    onError?.(message);
  }, [onError]);

  if (!mounted || !isTurnstileEnabled() || !siteKey) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={handleSuccess}
        onExpire={handleExpire}
        onError={handleError}
        scriptOptions={{ onError: handleScriptError }}
        options={{
          action,
          theme: "auto",
          retry: "auto",
          refreshExpired: "auto",
          language: "es",
        }}
        className="flex min-h-[65px] justify-center"
      />
      {verified ? (
        <p className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-primary">
          <IconCheck className="h-3.5 w-3.5 stroke-3" aria-hidden />
          Verificación completada
        </p>
      ) : waiting && !loadError ? (
        <p className="flex items-center justify-center gap-1.5 text-xs font-mono text-muted-foreground">
          <IconLoader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          Completando verificación de seguridad…
        </p>
      ) : null}
      {loadError ? (
        <p className="text-xs font-mono font-bold text-destructive">
          {loadError}
        </p>
      ) : null}
    </div>
  );
}
