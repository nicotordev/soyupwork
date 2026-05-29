import { getCheckoutSuccessDetails } from "@/app/actions/checkout.actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminBrutalButtonClass, adminPanelClass } from "@/lib/admin/styles";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Pago confirmado",
};

const log = getServerLogger("checkout.success");

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

function formatAmount(amountCents: number, currency: string): string {
  const amount = amountCents / 100;
  if (currency.toUpperCase() === "USD") {
    return `$${amount.toFixed(2)} USD`;
  }
  return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    notFound();
  }

  let details: Awaited<ReturnType<typeof getCheckoutSuccessDetails>> = null;
  let loadError: string | null = null;

  try {
    details = await getCheckoutSuccessDetails(sessionId);
  } catch (error) {
    log.error(
      serializeError(error),
      `Failed to load checkout success details (${sessionId})`,
    );
    loadError =
      "No pudimos verificar tu pago en este momento. Si se realizó el cargo, revisa tus compras en unos minutos.";
  }

  if (!details && !loadError) {
    loadError =
      "No encontramos los detalles de esta sesión de pago. Si ya pagaste, el acceso puede tardar unos segundos en activarse.";
  }

  if (loadError || !details) {
    return (
      <main className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-12 sm:py-20 font-sans">
        <div
          className={cn(
            adminPanelClass,
            "w-full space-y-6 p-5 sm:p-8 text-center rounded-2xl shadow-[4px_4px_0px_0px_var(--foreground)] sm:shadow-[8px_8px_0px_0px_var(--foreground)]",
          )}
        >
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border-2 border-foreground bg-destructive/10 shadow-[2px_2px_0px_0px_var(--foreground)]">
            <AlertCircle
              className="size-8 text-destructive"
              strokeWidth={2.5}
            />
          </div>

          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              No pudimos confirmar el pago
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              {loadError}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full pt-2">
            <Button asChild className={cn(adminBrutalButtonClass, "w-full")}>
              <Link href="/dashboard/purchases">Ver mis compras</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className={cn(adminBrutalButtonClass, "w-full")}
            >
              <Link href="/catalog">Volver al catálogo</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const courseHref = details.courseSlug
    ? `/courses/${details.courseSlug}`
    : "/catalog";

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-12 sm:py-20 font-sans">
      <div
        className={cn(
          adminPanelClass,
          "w-full space-y-6 p-5 sm:p-8 text-center rounded-2xl shadow-[4px_4px_0px_0px_var(--foreground)] sm:shadow-[8px_8px_0px_0px_var(--foreground)]",
        )}
      >
        {/* Success Icon Block with neobrutalist offset shadow */}
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border-2 border-foreground bg-emerald-500/15 shadow-[2px_2px_0px_0px_var(--foreground)] sm:shadow-[3px_3px_0px_0px_var(--foreground)]">
          {details.hasEnrollment ? (
            <CheckCircle2
              className="size-8 text-emerald-600"
              strokeWidth={2.5}
            />
          ) : (
            <Loader2 className="size-8 animate-spin text-primary" />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            ¡Pago confirmado!
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            {details.hasEnrollment
              ? "Tu inscripción ya está activa. Puedes empezar a aprender ahora."
              : "Estamos activando tu acceso. Esto suele tardar unos segundos."}
          </p>
        </div>

        {/* Invoice-style Neobrutalist Details Block */}
        <div className="rounded-xl border-2 border-foreground bg-muted/20 p-4 text-left text-sm shadow-[2px_2px_0px_0px_var(--foreground)]">
          <p className="font-heading font-black text-base text-foreground leading-snug">
            {details.courseTitle}
          </p>
          <div className="mt-4 pt-3 border-t-2 border-foreground/10 flex items-center justify-between">
            <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Total pagado
            </span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-base">
              {formatAmount(details.amountCents, details.currency)}
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Estado
            </span>
            <Badge className="h-6 rounded-md border border-emerald-600/20 bg-emerald-500/15 px-2.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              {details.orderStatus}
            </Badge>
          </div>
        </div>

        {/* Actions Stack */}
        <div className="flex flex-col gap-3 w-full pt-2">
          <Button asChild className={cn(adminBrutalButtonClass, "w-full")}>
            <Link href={courseHref}>Ir al curso</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className={cn(adminBrutalButtonClass, "w-full")}
          >
            <Link href="/dashboard/purchases">Ver mis compras</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
