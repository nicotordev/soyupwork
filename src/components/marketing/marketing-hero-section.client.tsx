"use client";

import Link from "next/link";
import { ArrowRight, Check, PlayCircle } from "lucide-react";
import { Motion } from "@/components/common/motion";
import { Badge } from "@/components/ui/badge";
import { MARKETING_PAGE } from "@/constants/marketing.constants";

const { hero } = MARKETING_PAGE;

export function MarketingHeroSectionClient() {
  return (
    <section className="relative mx-auto w-full overflow-x-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.153_0.006_107.1/8%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.153_0.006_107.1/8%)_1px,transparent_1px)] bg-size-[3rem_3rem] opacity-45" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,var(--primary),transparent)] opacity-15" />

      <div className="mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center">
        <Motion
          as="div"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Badge
            variant="outline"
            className="border-primary/30 text-primary font-mono text-[10px] font-bold uppercase tracking-wider"
          >
            {hero.eyebrow}
          </Badge>
        </Motion>

        <div className="space-y-5">
          <Motion
            as="h1"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-pretty text-4xl font-black leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {hero.titleLead}{" "}
            <span className="text-green-600 drop-shadow-sm">
              {hero.titleHighlight}
            </span>
            {hero.titleTrail}
          </Motion>

          <Motion
            as="p"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto max-w-3xl text-base text-muted-foreground sm:text-lg md:text-xl font-medium leading-relaxed"
          >
            {hero.description}{" "}
            <span className="font-semibold text-foreground">
              {hero.descriptionEmphasis}
            </span>
          </Motion>
        </div>

        <Motion
          as="div"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="flex w-full max-w-lg flex-col justify-center gap-3 sm:max-w-none sm:flex-row"
        >
          <Link
            href="/waitlist"
            className="inline-flex w-full items-center justify-center gap-2 rounded border-2 border-foreground bg-primary px-8 py-3.5 text-xs font-black uppercase tracking-wider text-primary-foreground shadow-[4px_4px_0px_0px_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_0px_var(--foreground)] active:translate-y-[3px] active:shadow-none transition-all sm:w-auto"
          >
            {hero.ctaPrimary}
            <ArrowRight className="h-4 w-4 stroke-3" />
          </Link>
          <Link
            href="/demo"
            className="inline-flex w-full items-center justify-center gap-2 rounded border-2 border-primary bg-background px-8 py-3.5 text-xs font-black uppercase tracking-wider text-primary shadow-[4px_4px_0px_0px_var(--primary)] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_0px_var(--primary)] active:translate-y-[3px] active:shadow-none transition-all sm:w-auto"
          >
            {hero.ctaSecondary} <PlayCircle className="h-4 w-4 stroke-3" />
          </Link>
        </Motion>

        <Motion
          as="div"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-2 text-xs text-muted-foreground font-mono font-semibold sm:text-sm"
        >
          {hero.trustChecks.map((label) => (
            <span key={label} className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
              {label}
            </span>
          ))}
        </Motion>
      </div>
    </section>
  );
}
