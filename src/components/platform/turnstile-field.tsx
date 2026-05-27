"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const TURNSTILE_SCRIPT =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileFieldProps = {
  onToken: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
  resetKey?: number;
};

export function isTurnstileEnabled(): boolean {
  return Boolean(siteKey);
}

export function TurnstileField({
  onToken,
  onExpire,
  onError,
  className,
  resetKey = 0,
}: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

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

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "auto",
      callback: (token: string) => onToken(token),
      "expired-callback": () => {
        widgetIdRef.current = null;
        onExpire?.();
      },
      "error-callback": () => {
        onError?.();
      },
    });
  }, [scriptReady, clearWidget, onToken, onExpire, onError]);

  useEffect(() => {
    renderWidget();
    return clearWidget;
  }, [renderWidget, resetKey, clearWidget]);

  if (!siteKey) {
    return null;
  }

  return (
    <>
      <Script
        src={TURNSTILE_SCRIPT}
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />
      <div
        ref={containerRef}
        className={cn("flex min-h-[65px] justify-center", className)}
        aria-label="Verificación de seguridad Cloudflare Turnstile"
      />
    </>
  );
}
