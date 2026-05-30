import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PRICING_PAGE } from "@/constants/pricing.constants";
import { resolvePricingCtaHref } from "@/lib/pricing/resolve-pricing-cta-href";
import { cn } from "@/lib/utils";
import type {
  PricingFlagshipProduct,
  PricingMiniModule,
  PricingPremiumOffer,
} from "@/types/pricing.types";

type PricingProductsProps = {
  miniModules: readonly PricingMiniModule[];
  flagship: PricingFlagshipProduct;
  premium: PricingPremiumOffer;
  waitlistMode: boolean;
};

export function PricingProducts({
  miniModules,
  flagship,
  premium,
  waitlistMode,
}: PricingProductsProps) {
  const {
    productsSection,
    miniModulesSection,
    flagshipSection,
    premiumSection,
  } = PRICING_PAGE;
  const flagshipHref = resolvePricingCtaHref(flagship.ctaHref, waitlistMode);
  const premiumHref = resolvePricingCtaHref(premium.ctaHref, waitlistMode);
  const catalogHref = resolvePricingCtaHref(
    miniModulesSection.catalogHref,
    waitlistMode,
  );

  return (
    <section
      id="pricing"
      className="scroll-mt-20 border-y-2 border-foreground bg-secondary/15 py-8 sm:py-12"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 font-mono text-[9px] font-bold uppercase tracking-wider text-primary"
          >
            {productsSection.badge}
          </Badge>
          <h2 className="mt-3 text-xl font-black tracking-tight text-foreground sm:text-3xl">
            {productsSection.title}
          </h2>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            {productsSection.description}
          </p>
          <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
            {productsSection.commercialModel.title}
          </p>
        </div>

        {/* Mobile: single panel, flagship → mini scroll → cohort */}
        <div className="overflow-hidden rounded-xl border-2 border-foreground bg-card shadow-[3px_3px_0px_0px_var(--foreground)] md:hidden">
          {/* Flagship */}
          <div
            id="flagship"
            className="scroll-mt-24 border-b-2 border-foreground bg-primary/5"
          >
            <div className="flex flex-wrap items-center gap-2 border-b-2 border-foreground bg-primary px-3 py-2">
              <Badge className="border-primary-foreground/20 bg-primary-foreground/15 font-mono text-[8px] font-bold uppercase text-primary-foreground">
                {flagshipSection.recommendedBadge}
              </Badge>
              <Badge
                variant="outline"
                className="border-primary-foreground/30 font-mono text-[8px] font-bold uppercase text-primary-foreground"
              >
                {flagshipSection.launchBadge}
              </Badge>
            </div>
            <div className="px-4 py-5">
              <h3 className="text-lg font-black leading-tight text-foreground">
                {flagship.name}
              </h3>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {flagship.description}
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-primary">
                  {flagship.launchPriceLabel}
                </span>
                <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground line-through">
                  {flagship.normalPriceLabel}
                </span>
              </div>
              <p className="mt-1 font-mono text-[9px] font-bold uppercase text-muted-foreground">
                {flagship.billingLabel}
              </p>
              <ul className="mt-4 space-y-2">
                {flagship.features.slice(0, 4).map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-xs font-medium text-foreground"
                  >
                    <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="mt-4 h-12 min-h-12 w-full">
                <Link href={flagshipHref}>
                  {flagship.ctaLabel}
                  <ArrowRight className="stroke-3 transition-transform duration-200 group-hover/button:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Mini modules */}
          <div
            id="mini-modules"
            className="scroll-mt-24 border-b-2 border-foreground"
          >
            <div className="border-b border-foreground/20 bg-secondary px-4 py-3">
              <p className="font-mono text-[9px] font-black uppercase tracking-wider text-foreground">
                {miniModulesSection.title}
              </p>
              <p className="text-[10px] font-medium text-muted-foreground">
                {miniModulesSection.fromPriceLabel}
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto p-4 snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {miniModules.map((mod) => (
                <Link
                  key={mod.id}
                  href={resolvePricingCtaHref(mod.ctaHref, waitlistMode)}
                  className="min-w-[10rem] shrink-0 snap-start rounded-lg border-2 border-foreground bg-background px-3 py-2.5 hover:border-primary transition-colors duration-200"
                >
                  <p className="font-mono text-[8px] font-bold uppercase text-primary border border-primary/20 bg-primary/5 px-1.5 py-0.5 rounded inline-block">
                    {mod.priceLabel}
                  </p>
                  <p className="mt-1 text-xs font-black leading-snug text-foreground">
                    {mod.name}
                  </p>
                </Link>
              ))}
            </div>
            <div className="border-t border-foreground/20 px-4 py-2">
              <Link
                href={catalogHref}
                className="inline-flex min-h-11 items-center gap-1 font-mono text-[9px] font-bold uppercase text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {miniModulesSection.catalogCta}
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

          {/* Premium */}
          <div className="px-4 py-5 bg-card">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h3 className="font-mono text-xs font-black uppercase tracking-wider">
                {premium.name}
              </h3>
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              {premium.description}
            </p>
            <p className="mt-2 text-2xl font-black text-foreground">
              {premium.priceLabel}
            </p>
            <p className="font-mono text-[9px] font-bold uppercase text-muted-foreground">
              {premium.billingLabel}
            </p>
            <Button
              asChild
              variant="accent"
              size="lg"
              className="mt-4 h-12 min-h-12 w-full"
            >
              <Link href={premiumHref}>
                {premium.ctaLabel}
                <ArrowRight className="stroke-3 transition-transform duration-200 group-hover/button:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Desktop: 3 tiers side by side */}
        <div className="hidden items-stretch gap-4 md:grid md:grid-cols-3 md:gap-5 lg:gap-6">
          {/* Mini cursos */}
          <article className="group/card flex flex-col rounded-2xl border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--foreground)] transition-all duration-300 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--foreground)]">
            <div className="border-b-2 border-foreground bg-secondary/80 px-4 py-3">
              <Badge
                variant="outline"
                className="mb-2 border-foreground/30 font-mono text-[8px] font-bold uppercase text-muted-foreground bg-background/50"
              >
                {miniModulesSection.badge}
              </Badge>
              <h3 className="text-lg font-black text-foreground">
                {miniModulesSection.title}
              </h3>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {miniModulesSection.description}
              </p>
            </div>
            <div className="flex flex-1 flex-col px-4 py-4">
              <p className="text-2xl font-black text-primary">
                {miniModulesSection.fromPriceLabel}
              </p>
              <p className="mt-1 font-mono text-[9px] font-bold uppercase text-muted-foreground">
                Por módulo · pago único
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {miniModules.map((mod) => (
                  <li key={mod.id}>
                    <Link
                      href={resolvePricingCtaHref(mod.ctaHref, waitlistMode)}
                      className="group flex items-center justify-between gap-2 rounded-lg border border-transparent px-2 py-1.5 hover:border-foreground/20 hover:bg-secondary transition-all duration-200"
                    >
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                        {mod.name}
                      </span>
                      <span className="shrink-0 font-mono text-[9px] font-bold uppercase text-primary border border-primary/20 bg-primary/5 px-1.5 py-0.5 rounded">
                        {mod.priceLabel}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant="accent"
                size="lg"
                className="mt-4 h-12 min-h-12 w-full"
              >
                <Link href={catalogHref}>
                  {miniModulesSection.catalogCta}
                  <ArrowRight className="stroke-3 transition-transform duration-200 group-hover/button:translate-x-1" />
                </Link>
              </Button>
            </div>
          </article>

          {/* Flagship — center hero */}
          <article
            id="flagship"
            className={cn(
              "overflow-hidden relative flex flex-col rounded-2xl border-2 border-primary bg-card shadow-[6px_6px_0px_0px_var(--primary)] lg:-my-2 transition-all duration-300 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0px_0px_var(--primary)] z-10",
            )}
          >
            <div className="flex flex-wrap items-center justify-center gap-2 border-b-2 border-foreground bg-primary px-4 py-2.5">
              <Badge className="border-primary-foreground/20 bg-primary-foreground/15 font-mono text-[9px] font-bold uppercase text-primary-foreground animate-float-y">
                {flagshipSection.recommendedBadge}
              </Badge>
              <Badge
                variant="outline"
                className="border-primary-foreground/30 font-mono text-[9px] font-bold uppercase text-foreground"
              >
                {flagshipSection.launchBadge}
              </Badge>
            </div>
            <div className="flex flex-1 flex-col px-5 py-5 lg:px-6 lg:py-6">
              <h3 className="text-xl font-black leading-tight text-foreground lg:text-2xl">
                {flagship.name}
              </h3>
              <p className="mt-1 text-xs font-bold text-primary">
                {flagship.tagline}
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {flagship.description}
              </p>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-primary">
                    {flagship.launchPriceLabel}
                  </span>
                  <span className="font-mono text-xs font-bold uppercase text-muted-foreground line-through">
                    {flagship.normalPriceLabel}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[9px] font-bold uppercase text-muted-foreground">
                  {flagshipSection.normalPriceNote}: {flagship.normalPriceLabel}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {flagship.billingLabel}
                </p>
              </div>
              <ul className="mt-4 flex-1 space-y-2">
                {flagship.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm font-medium text-foreground"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="mt-5 h-12 min-h-12 w-full">
                <Link href={flagshipHref}>
                  {flagship.ctaLabel}
                  <ArrowRight className="stroke-3 transition-transform duration-200 group-hover/button:translate-x-1" />
                </Link>
              </Button>
            </div>
          </article>

          {/* Cohorte premium */}
          <article className="group/card flex flex-col rounded-2xl border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--foreground)] transition-all duration-300 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--foreground)]">
            <div className="border-b-2 border-foreground bg-secondary/80 px-4 py-3">
              <Badge
                variant="outline"
                className="mb-2 border-foreground/30 font-mono text-[8px] font-bold uppercase text-muted-foreground bg-background/50"
              >
                {premiumSection.badge}
              </Badge>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 shrink-0 text-primary group-hover/card:animate-spin-slow" />
                <h3 className="text-lg font-black text-foreground">
                  {premium.name}
                </h3>
              </div>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {premiumSection.description}
              </p>
            </div>
            <div className="flex flex-1 flex-col px-4 py-4">
              <p className="text-3xl font-black text-foreground">
                {premium.priceLabel}
              </p>
              <p className="mt-1 font-mono text-[9px] font-bold uppercase text-muted-foreground">
                {premium.billingLabel}
              </p>
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                {premium.description}
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {premium.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm font-medium text-foreground"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant="accent"
                size="lg"
                className="mt-4 h-12 min-h-12 w-full"
              >
                <Link href={premiumHref}>
                  {premium.ctaLabel}
                  <ArrowRight className="stroke-3 transition-transform duration-200 group-hover/button:translate-x-1" />
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

