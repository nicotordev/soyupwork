import { AlertTriangle, Globe, Lock, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PricingPageData } from "@/types/pricing.types";

const TRUST_ICONS = [Shield, Lock, AlertTriangle, Globe] as const;

type PricingTrustSectionProps = {
  trust: PricingPageData["trust"];
};

export function PricingTrustSection({ trust }: PricingTrustSectionProps) {
  const { section, items } = trust;

  return (
    <section className="border-y-2 border-foreground bg-secondary/15 py-10 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12">
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 font-mono text-[9px] font-bold uppercase tracking-wider text-primary md:text-[10px]"
          >
            {section.badge}
          </Badge>
          <h2 className="mt-4 text-xl font-black leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {section.title}
          </h2>
          <p className="mt-3 text-sm font-medium tracking-tight text-muted-foreground sm:text-lg">
            {section.description}
          </p>
        </div>

        {/* Mobile list rows */}
        <div className="overflow-hidden rounded-xl border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_var(--foreground)] md:hidden">
          {items.map((item, index) => {
            const Icon = TRUST_ICONS[index] ?? Shield;
            return (
              <div
                key={item.id}
                className={cn(
                  "flex min-h-11 gap-3 px-3 py-3",
                  index < items.length - 1 && "border-b-2 border-foreground",
                )}
              >
                <div className="inline-flex shrink-0 rounded-lg border-2 border-foreground bg-primary/10 p-2 text-primary">
                  <Icon className="size-4 stroke-[2.5]" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <h3 className="text-sm font-black tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop grid */}
        <div className="hidden grid-cols-2 gap-6 md:grid lg:grid-cols-4 lg:gap-8">
          {items.map((item, index) => {
            const Icon = TRUST_ICONS[index] ?? Shield;
            return (
              <article
                key={item.id}
                className="rounded-2xl border-2 border-foreground bg-card p-6 text-left shadow-[4px_4px_0px_0px_var(--foreground)] transition-all select-none hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_var(--foreground)]"
              >
                <div className="mb-4 inline-flex rounded-xl border-2 border-foreground bg-primary/10 p-3 text-primary">
                  <Icon className="size-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
