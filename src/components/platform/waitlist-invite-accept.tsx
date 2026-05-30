"use client";

import { acceptWaitlistInviteToken } from "@/app/actions/waitlist-invite.actions";
import { adminBrutalButtonClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type WaitlistInviteAcceptProps = {
  token: string | null;
};

export function WaitlistInviteAccept({ token }: WaitlistInviteAcceptProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
  const [message, setMessage] = useState(
    token
      ? "Validando tu invitación…"
      : "Falta el token de invitación en el enlace.",
  );
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    void (async () => {
      const result = await acceptWaitlistInviteToken(token);
      if (cancelled) return;

      if (!result.ok) {
        setStatus("error");
        setMessage(result.error);
        return;
      }

      setStatus("success");
      setEmail(result.email);
      setMessage("Invitación validada. Redirigiendo al registro…");
      router.replace("/sign-up");
      router.refresh();
    })();

    return () => {
      cancelled = true;
    };
  }, [token, router]);

  return (
    <div className="space-y-4 text-center">
      {status === "loading" ? (
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <IconLoader2 className="size-4 animate-spin" aria-hidden />
          {message}
        </p>
      ) : (
        <p
          className={cn(
            "text-sm",
            status === "error" ? "text-destructive" : "text-muted-foreground",
          )}
          role={status === "error" ? "alert" : undefined}
        >
          {message}
        </p>
      )}

      {status === "success" && email ? (
        <p className="font-mono text-xs text-muted-foreground">{email}</p>
      ) : null}

      {status === "error" ? (
        <Button asChild className={adminBrutalButtonClass}>
          <Link href="/waitlist">Volver a la lista de espera</Link>
        </Button>
      ) : null}
    </div>
  );
}
