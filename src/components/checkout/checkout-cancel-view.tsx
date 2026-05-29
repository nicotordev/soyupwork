import { RetryCheckoutButton } from "@/components/checkout/retry-checkout-button.client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { adminBrutalButtonClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  CreditCard,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type CheckoutCancelCourse = {
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  priceLabel: string;
  description: string | null;
};

type CheckoutCancelViewProps = {
  course: CheckoutCancelCourse | null;
  courseHref: string;
};

export function CheckoutCancelView({
  course,
  courseHref,
}: CheckoutCancelViewProps) {
  return (
    <div className="relative isolate min-h-[calc(100svh-3.5rem)] overflow-hidden pb-16 pt-8 sm:pt-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-35 sm:bg-[size:4rem_4rem] dark:opacity-20"
      />
      <div className="pointer-events-none absolute -left-24 top-24 -z-20 size-104 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-48 -z-20 size-112 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto w-full max-w-2xl space-y-6 px-4 sm:px-6">
        <Card className="overflow-hidden border-2 border-foreground bg-card shadow-[8px_8px_0px_0px_var(--foreground)]">
          <div className="flex items-center justify-between gap-3 border-b-2 border-foreground bg-secondary px-4 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-full border border-foreground bg-amber-500" />
              <span className="truncate font-mono text-[10px] font-bold uppercase tracking-wider">
                Checkout cancelado
              </span>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 border-foreground/30 font-mono text-[9px] uppercase"
            >
              Sin cargo
            </Badge>
          </div>

          <CardHeader className="space-y-4 pb-2 pt-8 text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-2xl border-2 border-foreground bg-muted shadow-[4px_4px_0px_0px_var(--foreground)]">
              <XCircle
                className="size-10 text-muted-foreground"
                strokeWidth={2.25}
              />
            </div>
            <div className="space-y-2">
              <CardTitle className="font-heading text-2xl font-black tracking-tight sm:text-3xl">
                No completaste el pago
              </CardTitle>
              <CardDescription className="mx-auto max-w-md text-sm leading-relaxed sm:text-base">
                Saliste de Stripe Checkout antes de confirmar. No se realizó
                ningún cargo a tu tarjeta y tu inscripción no quedó activa.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-4 pb-2 sm:px-8">
            {course ? (
              <div className="rounded-xl border-2 border-foreground/20 bg-muted/20 p-4">
                <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Curso que intentabas comprar
                </p>
                <div className="flex gap-4">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border-2 border-foreground bg-background shadow-[3px_3px_0px_0px_var(--foreground)]">
                    {course.thumbnailUrl ? (
                      <Image
                        src={course.thumbnailUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-primary/10">
                        <BookOpen className="size-8 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <p className="font-heading text-base font-extrabold leading-snug sm:text-lg">
                      {course.title}
                    </p>
                    {course.description ? (
                      <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                        {course.description}
                      </p>
                    ) : null}
                    <p className="inline-flex rounded-md border border-emerald-600/20 bg-emerald-500/10 px-2.5 py-1 text-sm font-black text-emerald-700 dark:text-emerald-300">
                      {course.priceLabel}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: CreditCard,
                  title: "Sin cargo",
                  desc: "Tu método de pago no fue debitado.",
                },
                {
                  icon: ShieldCheck,
                  title: "Compra segura",
                  desc: "Stripe Checkout sigue disponible cuando quieras.",
                },
                {
                  icon: BookOpen,
                  title: "Acceso al volver",
                  desc: "Al pagar, la inscripción se activa al instante.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-lg border border-foreground/15 bg-background/80 p-3 text-left"
                  >
                    <Icon
                      className="mb-2 size-4 text-primary"
                      strokeWidth={2.5}
                    />
                    <p className="text-xs font-bold">{item.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 border-t border-foreground/10 bg-muted/15 px-4 py-6 sm:px-8">
            {course ? (
              <RetryCheckoutButton courseSlug={course.slug} />
            ) : (
              <Button
                asChild
                size="lg"
                className={cn(adminBrutalButtonClass, "w-full")}
              >
                <Link href={courseHref}>Volver al curso</Link>
              </Button>
            )}

            <div className="grid w-full gap-2 sm:grid-cols-2">
              <Button
                asChild
                variant="outline"
                className={adminBrutalButtonClass}
              >
                <Link href={courseHref}>
                  <ArrowLeft className="size-4" />
                  Ver landing del curso
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className={adminBrutalButtonClass}
              >
                <Link href="/catalog">
                  <Compass className="size-4" />
                  Explorar catálogo
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          ¿Problemas con el pago?{" "}
          <Link
            href="/dashboard/purchases"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Revisa tus compras
          </Link>{" "}
          o vuelve a intentarlo desde la página del curso.
        </p>
      </div>
    </div>
  );
}
