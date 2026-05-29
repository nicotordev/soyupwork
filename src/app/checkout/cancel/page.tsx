import { Button } from "@/components/ui/button";
import { adminBrutalButtonClass, adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { XCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pago cancelado",
};

type PageProps = {
  searchParams: Promise<{ course?: string }>;
};

export default async function CheckoutCancelPage({ searchParams }: PageProps) {
  const { course: courseSlug } = await searchParams;
  const courseHref = courseSlug ? `/courses/${courseSlug}` : "/catalog";

  return (
    <main className="mx-auto flex min-h-svh max-w-lg flex-col items-center justify-center px-4 py-16">
      <div
        className={cn(
          adminPanelClass,
          "w-full space-y-6 p-8 text-center shadow-[8px_8px_0px_0px_var(--foreground)]",
        )}
      >
        <div className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-foreground bg-muted">
          <XCircle className="size-8 text-muted-foreground" strokeWidth={2.5} />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-black tracking-tight">
            Pago cancelado
          </h1>
          <p className="text-sm text-muted-foreground">
            No se realizó ningún cargo. Puedes volver al curso e intentarlo de
            nuevo cuando quieras.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild className={cn(adminBrutalButtonClass, "w-full")}>
            <Link href={courseHref}>Volver al curso</Link>
          </Button>
          <Button asChild variant="outline" className={adminBrutalButtonClass}>
            <Link href="/catalog">Explorar catálogo</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
