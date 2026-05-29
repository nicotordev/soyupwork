import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MARKETING_PAGE } from "@/constants/marketing.constants";
import { isPublicWaitlistMode } from "@/lib/platform/public-waitlist-mode";

const { ctaFinal, hero } = MARKETING_PAGE;

export function MarketingFinalCtaSection() {
  const waitlistMode = isPublicWaitlistMode();
  const primaryHref = waitlistMode ? "/waitlist" : ctaFinal.href;
  const primaryLabel = waitlistMode ? hero.ctaPrimary : ctaFinal.button;

  return (
    <section className="font-sans">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-24 lg:px-8">
        <div className="overflow-hidden rounded-2xl border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--foreground)] select-none sm:rounded-3xl md:shadow-[8px_8px_0px_0px_var(--foreground)]">
          <div className="flex justify-center border-b-2 border-foreground bg-secondary/80 px-4 py-3 sm:px-6">
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 font-mono text-[9px] font-bold uppercase tracking-wider text-primary sm:text-[10px]"
            >
              {ctaFinal.badge}
            </Badge>
          </div>

          <div className="px-5 py-10 text-left sm:px-10 sm:py-14 lg:flex lg:items-center lg:justify-between lg:gap-16 lg:py-16 xl:gap-20">
            <div className="min-w-0 lg:flex-1">
              <h2 className="text-pretty text-2xl font-black leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
                {ctaFinal.titleLead}{" "}
                <span className="text-primary">{ctaFinal.titleHighlight}</span>.
              </h2>

              <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed font-medium text-muted-foreground sm:mt-5 sm:text-base">
                {ctaFinal.description}
              </p>
            </div>

            <div className="mt-12 flex flex-col items-stretch gap-3 sm:mt-14 sm:flex-row sm:items-center sm:justify-start lg:mt-0 lg:shrink-0 lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
              <Button
                asChild
                size="lg"
                className="group h-12 min-h-12 w-full sm:w-auto md:h-14 md:min-h-14 md:px-8"
              >
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowUpRight className="stroke-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="accent"
                size="lg"
                className="h-12 min-h-12 w-full sm:w-auto md:h-14 md:min-h-14"
              >
                <Link href="/demo">
                  {hero.ctaSecondary}
                  <ArrowRight className="stroke-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
