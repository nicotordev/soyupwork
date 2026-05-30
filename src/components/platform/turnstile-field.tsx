"use client";

import { IconCheck, IconLoader2 } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { mapClientTurnstileErrorCode } from "@/lib/turnstile/error-codes";
import { loadTurnstileScript } from "@/lib/turnstile/load-turnstile-script";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isTurnstileEnabled()) return;

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (!cancelled) {
          setScriptReady(true);
          setLoadError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(
            "No se pudo cargar Cloudflare Turnstile. Revisa bloqueadores o red.",
          );
          onError?.(
            "No se pudo cargar Cloudflare Turnstile. Revisa bloqueadores o red.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mounted, onError]);

  const clearWidget = useCallback(() => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }
  }, []);

  const renderWidget = useCallback(() => {
    if (
      !scriptReady ||
      !containerRef.current ||
      !siteKey ||
      !window.turnstile
    ) {
      return;
    }

    clearWidget();

    setWaiting(true);
    setVerified(false);
    setLoadError(null);

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "auto",
      action,
      retry: "auto",
      "refresh-expired": "auto",
      callback: (token: string) => {
        setVerified(true);
        setWaiting(false);
        onToken(token);
      },
      "expired-callback": () => {
        widgetIdRef.current = null;
        setVerified(false);
        setWaiting(true);
        onExpire?.();
      },
      "error-callback": (errorCode?: string) => {
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
    });
  }, [scriptReady, clearWidget, onToken, onExpire, onError, action]);

  useEffect(() => {
    if (!mounted) return;
    renderWidget();
    return clearWidget;
  }, [mounted, renderWidget, resetKey, clearWidget]);

  if (!mounted || !isTurnstileEnabled()) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        ref={containerRef}
        className="flex min-h-[65px] justify-center"
        aria-label="Verificación de seguridad Cloudflare Turnstile"
      />
      {verified ? (
        <p className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-primary">
          <IconCheck className="h-3.5 w-3.5 stroke-[3]" aria-hidden />
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
