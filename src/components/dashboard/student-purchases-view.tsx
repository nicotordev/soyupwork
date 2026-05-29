import {
  getStudentPurchasesData,
  type StudentPurchaseRow,
  type StudentSubscriptionRow,
} from "@/app/actions/purchases.actions";
import { DashboardContainer } from "@/components/dashboard/dashboard-container";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminBrutalButtonClass, adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { OrderStatus, SubscriptionStatus } from "@/generated/prisma/client";
import {
  IconChevronRight,
  IconCompass,
  IconReceipt,
  IconRepeat,
} from "@tabler/icons-react";
import Link from "next/link";

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PAID: "Pagado",
  PENDING: "Pendiente",
  FAILED: "Fallido",
  REFUNDED: "Reembolsado",
  CANCELLED: "Cancelado",
};

const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  ACTIVE: "Activa",
  TRIALING: "Prueba",
  PAST_DUE: "Pago pendiente",
  CANCELLED: "Cancelada",
  UNPAID: "Impaga",
  INCOMPLETE: "Incompleta",
};

function formatAmount(amountCents: number, currency: string): string {
  const amount = amountCents / 100;
  if (currency.toUpperCase() === "USD") {
    return `$${amount.toFixed(2)}`;
  }
  return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function PurchaseRow({ purchase }: { purchase: StudentPurchaseRow }) {
  const courseHref = purchase.courseSlug
    ? `/courses/${purchase.courseSlug}`
    : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/10 py-4 last:border-b-0">
      <div className="min-w-0 space-y-1">
        <p className="font-semibold">{purchase.courseTitle}</p>
        <p className="text-sm text-muted-foreground">
          {formatAmount(purchase.amountCents, purchase.currency)} ·{" "}
          {formatDate(purchase.date)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline">{ORDER_STATUS_LABELS[purchase.status]}</Badge>
        {courseHref ? (
          <Button
            asChild
            size="sm"
            variant="outline"
            className={adminBrutalButtonClass}
          >
            <Link href={courseHref}>
              Ver curso
              <IconChevronRight className="size-4" />
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function SubscriptionRow({
  subscription,
}: {
  subscription: StudentSubscriptionRow;
}) {
  const courseHref = subscription.courseSlug
    ? `/courses/${subscription.courseSlug}`
    : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/10 py-4 last:border-b-0">
      <div className="min-w-0 space-y-1">
        <p className="font-semibold">{subscription.courseTitle}</p>
        <p className="text-sm text-muted-foreground">
          Desde {formatDate(subscription.date)}
          {subscription.currentPeriodEnd
            ? ` · Renueva ${formatDate(subscription.currentPeriodEnd)}`
            : null}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          {SUBSCRIPTION_STATUS_LABELS[subscription.status]}
        </Badge>
        {courseHref ? (
          <Button
            asChild
            size="sm"
            variant="outline"
            className={adminBrutalButtonClass}
          >
            <Link href={courseHref}>
              Ver curso
              <IconChevronRight className="size-4" />
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export async function StudentPurchasesView() {
  const { orders, subscriptions } = await getStudentPurchasesData();
  const hasAny = orders.length > 0 || subscriptions.length > 0;

  return (
    <DashboardContainer>
      <DashboardPageHeader
        eyebrow="Facturación"
        icon={<IconReceipt className="size-4" stroke={2.5} />}
        title="Mis compras"
        description="Historial de pagos únicos y suscripciones activas."
      />

      {!hasAny ? (
        <div
          className={cn(
            adminPanelClass,
            "flex flex-col items-center gap-6 p-8 text-center shadow-[6px_6px_0px_0px_var(--foreground)]",
          )}
        >
          <div className="flex size-16 items-center justify-center rounded-full border-2 border-foreground bg-primary/10">
            <IconReceipt className="size-8 text-primary" stroke={2.25} />
          </div>
          <div className="space-y-2">
            <h3 className="font-heading text-lg font-extrabold">
              Aún no tienes compras registradas
            </h3>
            <p className="text-sm text-muted-foreground">
              Cuando compres un curso con Stripe Checkout, aparecerá aquí junto
              con el estado de tus suscripciones.
            </p>
          </div>
          <Button asChild className={adminBrutalButtonClass}>
            <Link href="/catalog">
              <IconCompass className="size-4" />
              Explorar catálogo
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.length > 0 ? (
            <section className={cn(adminPanelClass, "p-4 sm:p-6")}>
              <div className="mb-4 flex items-center gap-2">
                <IconReceipt className="size-4 text-primary" />
                <h2 className="font-heading text-lg font-bold">Compras</h2>
              </div>
              {orders.map((order) => (
                <PurchaseRow key={order.id} purchase={order} />
              ))}
            </section>
          ) : null}

          {subscriptions.length > 0 ? (
            <section className={cn(adminPanelClass, "p-4 sm:p-6")}>
              <div className="mb-4 flex items-center gap-2">
                <IconRepeat className="size-4 text-primary" />
                <h2 className="font-heading text-lg font-bold">
                  Suscripciones
                </h2>
              </div>
              {subscriptions.map((subscription) => (
                <SubscriptionRow
                  key={subscription.id}
                  subscription={subscription}
                />
              ))}
            </section>
          ) : null}
        </div>
      )}
    </DashboardContainer>
  );
}
