import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { itemPath } from "@/lib/resources/get-resource-catalog";
import { cn } from "@/lib/utils";
import type { ResourceCatalogItem } from "@/types/resource-catalog.types";
import { Clock, FileText, Lock, Sparkles } from "lucide-react";

const availabilityLabels = {
  available: "Disponible",
  coming_soon: "Próximamente",
  course: "En curso",
} as const;

const availabilityVariant = {
  available: "default",
  coming_soon: "secondary",
  course: "outline",
} as const;

type ResourceItemCardProps = {
  item: ResourceCatalogItem;
  categoryName?: string;
  featured?: boolean;
};

export function ResourceItemCard({
  item,
  categoryName,
  featured = false,
}: ResourceItemCardProps) {
  const href =
    item.availability === "available" || item.availability === "course"
      ? itemPath(item.kind, item.slug)
      : null;
  const Icon = item.kind === "guide" ? FileText : Sparkles;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border-2 border-foreground bg-card",
        "shadow-[4px_4px_0px_0px_var(--foreground)] transition-all",
        "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--foreground)]",
        item.availability !== "available" && "opacity-95",
        featured && "md:flex-row",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center border-b-2 border-foreground bg-primary/10",
          featured ? "md:w-32 md:border-b-0 md:border-r-2" : "h-24",
        )}
      >
        <Icon className="size-8 text-primary" strokeWidth={2.25} aria-hidden />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {categoryName ? (
            <Badge variant="outline" className="text-[10px]">
              {categoryName}
            </Badge>
          ) : null}
          <Badge
            variant={
              availabilityVariant[item.availability] as
                | "default"
                | "secondary"
                | "outline"
            }
            className="text-[10px]"
          >
            {item.availability === "course" ? (
              <Lock className="size-2.5" aria-hidden />
            ) : null}
            {availabilityLabels[item.availability]}
          </Badge>
          {item.fileLabel ? (
            <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
              {item.fileLabel}
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          {href ? (
            <Link href={href}>
              <h2
                className={cn(
                  "font-heading font-black tracking-tight text-foreground group-hover:text-primary",
                  featured ? "text-xl sm:text-2xl" : "text-lg",
                )}
              >
                {item.title}
              </h2>
            </Link>
          ) : (
            <h2
              className={cn(
                "font-heading font-black tracking-tight text-foreground",
                featured ? "text-xl sm:text-2xl" : "text-lg",
              )}
            >
              {item.title}
            </h2>
          )}
          {item.subtitle ? (
            <p className="text-sm font-semibold text-muted-foreground">
              {item.subtitle}
            </p>
          ) : null}
          <p className="line-clamp-3 text-sm leading-relaxed text-foreground/85">
            {item.excerpt}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 font-mono text-[10px] font-bold uppercase text-muted-foreground">
          {item.readingTimeMinutes ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden />
              {item.readingTimeMinutes} min
            </span>
          ) : null}
          <span className="text-primary">
            {item.availability === "available" ? "Ver recurso →" : "Ver detalle →"}
          </span>
        </div>
      </div>
    </article>
  );
}
