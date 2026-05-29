import { getCheckoutSuccessDetails } from "@/app/actions/checkout.actions";
import { Button } from "@/components/ui/button";
import { adminBrutalButtonClass, adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Pago confirmado",
};

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

  const details = await getCheckoutSuccessDetails(sessionId).catch(() => null);

  if (!details) {
    notFound();
  }

  const courseHref = details.courseSlug
    ? `/courses/${details.courseSlug}`
    : "/courses";

  return (
    <main className="mx-auto flex min-h-svh max-w-lg flex-col items-center justify-center px-4 py-16">
      <div
        className={cn(
          adminPanelClass,
          "w-full space-y-6 p-8 text-center shadow-[8px_8px_0px_0px_var(--foreground)]",
        )}
      >
        <div className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-foreground bg-emerald-500/15">
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
          <h1 className="font-heading text-2xl font-black tracking-tight">
            ¡Pago confirmado!
          </h1>
          <p className="text-sm text-muted-foreground">
            {details.hasEnrollment
              ? "Tu inscripción ya está activa. Puedes empezar a aprender ahora."
              : "Estamos activando tu acceso. Esto suele tardar unos segundos."}
          </p>
        </div>

        <div className="rounded-lg border border-foreground/20 bg-muted/30 p-4 text-left text-sm">
          <p className="font-semibold">{details.courseTitle}</p>
          <p className="mt-1 text-muted-foreground">
            {formatAmount(details.amountCents, details.currency)}
          </p>
          <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
            Estado: {details.orderStatus}
          </p>
        </div>

        <Button asChild className={cn(adminBrutalButtonClass, "w-full")}>
          <Link href={courseHref}>Ir al curso</Link>
        </Button>

        <Button asChild variant="outline" className={adminBrutalButtonClass}>
          <Link href="/dashboard/purchases">Ver mis compras</Link>
        </Button>
      </div>
    </main>
  );
}
