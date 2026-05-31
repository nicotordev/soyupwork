import Link from "next/link";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LegalTocItem } from "@/types/legal-page.types";

type LegalTocProps = {
  items: readonly LegalTocItem[];
};

export function LegalToc({ items }: LegalTocProps) {
  return (
    <>
      {/* Mobile: compact index */}
      <details className="group md:hidden">
        <summary
          className={cn(
            "flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-xl border-2 border-foreground bg-card px-4 py-3",
            "shadow-[3px_3px_0px_0px_var(--foreground)]",
            "[&::-webkit-details-marker]:hidden",
          )}
        >
          <span className="flex items-center gap-2 font-mono text-xs font-extrabold uppercase tracking-wider">
            <List className="size-4 shrink-0" aria-hidden />
            Índice del documento
          </span>
          <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground group-open:hidden">
            Ver
          </span>
          <span className="hidden font-mono text-[10px] font-bold uppercase text-muted-foreground group-open:inline">
            Ocultar
          </span>
        </summary>
        <nav
          aria-label="Índice de términos"
          className="mt-2 rounded-xl border-2 border-foreground bg-muted/30 p-2 shadow-[2px_2px_0px_0px_var(--foreground)]"
        >
          <ul className="divide-y-2 divide-foreground/15">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`#${item.id}`}
                  className="flex min-h-10 items-center px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-card hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </details>

      {/* Desktop: sticky sidebar */}
      <nav
        aria-label="Índice de términos"
        className="hidden md:block md:sticky md:top-24 md:self-start"
      >
        <div className="rounded-2xl border-2 border-foreground bg-card p-4 shadow-[4px_4px_0px_0px_var(--foreground)]">
          <p className="mb-3 font-mono text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            En este documento
          </p>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`#${item.id}`}
                  className="block rounded-lg px-2 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
