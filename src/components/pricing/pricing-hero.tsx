import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolvePricingCtaHref } from "@/lib/pricing/resolve-pricing-cta-href";
import type { PricingPageData } from "@/types/pricing.types";

type PricingHeroProps = {
  hero: PricingPageData["hero"];
  waitlistMode: boolean;
};

export function PricingHero({ hero, waitlistMode }: PricingHeroProps) {
  const primaryHref = waitlistMode ? "/waitlist" : hero.ctaPrimaryHref;

  return (
    <section className="relative mx-auto w-full overflow-x-hidden px-4 py-10 sm:px-6 sm:py-16 md:py-20 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.153_0.006_107.1/8%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.153_0.006_107.1/8%)_1px,transparent_1px)] bg-size-[3rem_3rem] opacity-25 md:opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,var(--primary),transparent)] opacity-10" />

      <div className="mx-auto flex max-w-3xl flex-col items-center space-y-6 text-center">
        <Badge
          variant="outline"
          className="border-primary/30 font-mono text-[10px] font-bold uppercase tracking-wider text-primary"
        >
          {hero.eyebrow}
        </Badge>

        <h1 className="text-pretty text-3xl font-black leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
          {hero.titleLead}{" "}
          <span className="text-primary">{hero.titleHighlight}</span>
          {hero.titleTrail}
        </h1>

        <p className="max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground sm:text-base md:text-lg">
          {hero.description}{" "}
          <span className="font-semibold text-foreground">
            {hero.descriptionEmphasis}
          </span>
        </p>

        <div className="flex w-full max-w-md flex-col gap-2.5 sm:max-w-none sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="h-12 min-h-12 w-full sm:w-auto md:h-14 md:px-7"
          >
            <Link href={primaryHref}>
              {hero.ctaPrimary}
              <ArrowRight className="stroke-3" />
            </Link>
          </Button>
          <Button
            asChild
            variant="accent"
            size="lg"
            className="h-12 min-h-12 w-full sm:w-auto md:h-14 md:px-7"
          >
            <Link href={hero.ctaSecondaryHref}>{hero.ctaSecondary}</Link>
          </Button>
        </div>

        <div className="flex w-full max-w-lg flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-1 font-mono text-[10px] font-semibold text-muted-foreground sm:text-xs">
          {hero.trustChecks.map((label) => (
            <span key={label} className="inline-flex items-center gap-1">
              <Check className="size-3 shrink-0 text-primary" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
