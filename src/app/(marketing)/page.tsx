import type { Metadata } from "next";
import {
  Star,
  Zap,
  Clock,
  Shield,
  Lock,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Send,
  Award,
  DollarSign,
} from "lucide-react";
import { NeobrutalistPageDecoration } from "@/components/common/neobrutalist-page-decoration";
import { MarketingHeroSectionClient } from "@/components/marketing/marketing-hero-section.client";
import { MarketingMobileStickyCta } from "@/components/marketing/marketing-mobile-sticky-cta.client";
import { MarketingProposalSimulatorClient } from "@/components/marketing/marketing-proposal-simulator.client";
import { MarketingTrackSelectorClient } from "@/components/marketing/marketing-track-selector.client";
import { MarketingFaqSection } from "@/components/marketing/marketing-faq-section";
import { MarketingFinalCtaSection } from "@/components/marketing/marketing-final-cta-section";
import { Badge } from "@/components/ui/badge";
import {
  MARKETING_PAGE,
  buildMarketingMetadata,
} from "@/constants/marketing.constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMarketingMetadata("/");

const CURRICULUM_ICONS = [BookOpen, Zap, DollarSign, Award] as const;
const LMS_ICONS = [Lock, Clock, Shield] as const;
const VALUE_PILLAR_ICONS = [BookOpen, Send, Award] as const;

export default function LandingPage() {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-background pb-20 font-sans text-foreground antialiased md:pb-0">
      <NeobrutalistPageDecoration shapeCount={8} seed={42} />
      <main className="relative z-10">
        <MarketingHeroSectionClient />

        <hr className="border-foreground" />

        {/* Propuesta de valor */}
        <section
          id="social-proof"
          className="border-y-2 border-foreground bg-secondary/15 py-10 sm:py-20 overflow-hidden font-sans w-full md:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Mobile: single panel + list rows */}
            <div className="overflow-hidden rounded-xl border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_var(--foreground)] md:hidden">
              {MARKETING_PAGE.valuePillars.map((pillar, index) => {
                const Icon = VALUE_PILLAR_ICONS[index];
                return (
                  <div
                    key={pillar.title}
                    className={cn(
                      "flex min-h-11 items-center gap-3 px-3 py-2",
                      index < MARKETING_PAGE.valuePillars.length - 1 &&
                        "border-b-2 border-foreground",
                    )}
                  >
                    <div className="inline-flex shrink-0 rounded-lg border-2 border-foreground bg-primary/10 p-2 text-primary">
                      <Icon className="size-4 stroke-[2.5]" />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <h3 className="text-base font-black text-foreground tracking-tight">
                        {pillar.title}
                      </h3>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground leading-none">
                        {pillar.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: 3 cards */}
            <div className="hidden grid-cols-3 gap-8 md:grid">
              {MARKETING_PAGE.valuePillars.map((pillar, index) => {
                const Icon = VALUE_PILLAR_ICONS[index];
                return (
                  <div
                    key={pillar.title}
                    className="group relative min-w-0 rounded-2xl border-2 border-foreground bg-card p-8 text-center shadow-[4px_4px_0px_0px_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_var(--foreground)] transition-all select-none"
                  >
                    <div
                      className={cn(
                        "mx-auto mb-4 inline-flex p-3 rounded-xl border-2 border-foreground group-hover:scale-110 transition-transform",
                        "bg-primary/10 text-primary",
                      )}
                    >
                      <Icon className="size-6 stroke-[2.5]" />
                    </div>
                    <h3 className="text-3xl font-black text-foreground tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-pretty text-xs font-bold uppercase tracking-wider text-muted-foreground leading-none">
                      {pillar.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <MarketingProposalSimulatorClient />

        {/* COMPARA MATRIX */}
        <section className="relative border-y-2 border-foreground bg-muted py-10 sm:py-24 overflow-hidden font-sans md:py-24">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.153_0.006_107.1_/_8%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.153_0.006_107.1_/_8%)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35" />
          <div className="pointer-events-none absolute -left-20 top-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl hidden md:block" />
          <div className="pointer-events-none absolute -right-20 bottom-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl hidden md:block" />

          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-16">
              <Badge
                variant="outline"
                className="border-primary/40 bg-primary/15 text-primary font-mono px-3 py-1 font-bold uppercase tracking-wider text-[9px] md:text-[10px]"
              >
                {MARKETING_PAGE.strategyComparison.badge}
              </Badge>
              <h2 className="mt-4 text-xl font-black sm:text-4xl lg:text-5xl leading-tight text-foreground tracking-tight">
                {MARKETING_PAGE.strategyComparison.title}
              </h2>
              <p className="mt-3 text-muted-foreground text-sm sm:text-lg font-medium tracking-tight">
                {MARKETING_PAGE.strategyComparison.description}
              </p>
            </div>

            {/* Mobile: single panel + flat rows */}
            <div className="overflow-hidden rounded-xl border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_var(--foreground)] md:hidden">
              {MARKETING_PAGE.strategyComparison.rows.map((row, rowIndex) => (
                <div
                  key={row.aspect}
                  className={
                    rowIndex < MARKETING_PAGE.strategyComparison.rows.length - 1
                      ? "border-b-2 border-foreground"
                      : undefined
                  }
                >
                  <h3 className="border-b-2 border-foreground bg-secondary/80 px-3 py-2 text-xs font-black text-foreground uppercase tracking-wider font-mono">
                    {row.aspect}
                  </h3>
                  <div className="border-b border-foreground/10 bg-destructive/5 px-3 py-2.5">
                    <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-wider text-destructive flex items-center gap-1.5">
                      <AlertTriangle className="size-3.5 shrink-0" />
                      {MARKETING_PAGE.strategyComparison.superficialLabel}
                    </p>
                    <p className="text-xs font-semibold leading-relaxed text-foreground">
                      {row.superficial}
                    </p>
                  </div>
                  <div className="bg-primary/5 px-3 py-2.5">
                    <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 shrink-0" />
                      {MARKETING_PAGE.strategyComparison.sistemaLabel}
                    </p>
                    <p className="text-xs font-semibold leading-relaxed text-foreground">
                      {row.sistema}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden overflow-hidden rounded-2xl border-2 border-foreground bg-card shadow-[8px_8px_0px_0px_var(--foreground)] md:block select-none">
              <table className="w-full text-left text-xs font-medium sm:text-sm">
                <thead>
                  <tr className="border-b-2 border-foreground bg-secondary/80 font-mono text-[10px] text-muted-foreground tracking-wider">
                    <th className="p-5 uppercase font-bold">
                      MÉTRICA / ASPECTO
                    </th>
                    <th className="p-5 uppercase font-bold text-destructive border-l-2 border-foreground">
                      {MARKETING_PAGE.strategyComparison.superficialLabel}
                    </th>
                    <th className="p-5 uppercase font-bold text-primary border-l-2 border-foreground">
                      {MARKETING_PAGE.strategyComparison.sistemaLabel}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-foreground">
                  {MARKETING_PAGE.strategyComparison.rows.map((row) => (
                    <tr
                      key={row.aspect}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-5 font-black text-foreground tracking-wide">
                        {row.aspect}
                      </td>
                      <td className="bg-destructive/5 p-5 text-foreground/85 border-l-2 border-foreground leading-relaxed font-medium">
                        {row.superficial}
                      </td>
                      <td className="bg-primary/5 p-5 font-bold text-primary border-l-2 border-foreground leading-relaxed">
                        {row.sistema}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CURRICULUM SUGERIDO */}
        <section className="relative overflow-hidden py-10 sm:pt-24 font-sans border-foreground md:pt-24">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.153_0.006_107.1_/_6%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.153_0.006_107.1_/_6%)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-8 max-w-3xl space-y-4 text-center sm:mb-16">
              <Badge
                variant="outline"
                className="border-primary/40 bg-primary/10 text-primary font-mono px-3 py-1 font-bold uppercase tracking-wider text-[9px] md:text-[10px]"
              >
                {MARKETING_PAGE.curriculum.badge}
              </Badge>
              <h2 className="text-xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl tracking-tight">
                {MARKETING_PAGE.curriculum.title}
              </h2>
              <p className="mx-auto max-w-2xl text-sm sm:text-base font-medium text-muted-foreground leading-relaxed">
                {MARKETING_PAGE.curriculum.description}
              </p>
            </div>

            {/* Mobile: list rows */}
            <div className="overflow-hidden rounded-xl border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_var(--foreground)] md:hidden">
              {MARKETING_PAGE.curriculum.steps.map((step, index) => {
                const StepIcon = CURRICULUM_ICONS[index];
                return (
                  <div
                    key={step.num}
                    className={cn(
                      "flex min-h-11 items-start gap-3 px-3 py-3",
                      index < MARKETING_PAGE.curriculum.steps.length - 1 &&
                        "border-b-2 border-foreground",
                    )}
                  >
                    <span className="shrink-0 font-mono text-lg font-black text-muted-foreground/40">
                      {step.num}
                    </span>
                    <div className="shrink-0 rounded-lg border-2 border-foreground bg-secondary p-1.5 text-foreground">
                      <StepIcon className="size-4 stroke-[2.25]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-black text-foreground tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground font-semibold leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: grid cards */}
            <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
              {MARKETING_PAGE.curriculum.steps.map((step, index) => {
                const StepIcon = CURRICULUM_ICONS[index];
                return (
                  <div
                    key={step.num}
                    className="group relative flex flex-col justify-between rounded-2xl border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--foreground)] transition-all select-none"
                  >
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-4xl font-black text-muted-foreground/35 group-hover:text-primary transition-colors">
                          {step.num}
                        </span>
                        <div className="p-2.5 rounded-lg border-2 border-foreground bg-secondary text-foreground shadow-[2px_2px_0px_0px_var(--foreground)] group-hover:scale-110 transition-transform">
                          <StepIcon className="size-4.5 stroke-[2.25]" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-black text-foreground tracking-tight">
                          {step.title}
                        </h3>
                        <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <MarketingTrackSelectorClient />

        {/* PLATAFORMA LMS */}
        <section className="relative border-b-2 border-foreground bg-primary/5 py-10 sm:py-24 overflow-hidden font-sans md:py-24">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_20%,var(--primary)/0.06,transparent_40%)]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex max-w-3xl flex-col gap-4 sm:mb-16 sm:flex-row sm:items-start select-none">
              <div className="inline-flex p-3 shrink-0 rounded-2xl border-2 border-foreground bg-secondary text-foreground shadow-[3px_3px_0px_0px_var(--foreground)] w-fit">
                <Star className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-primary/10 text-primary font-mono px-2 py-0.5 font-bold uppercase tracking-wider text-[9px] mb-2"
                >
                  {MARKETING_PAGE.lmsSection.badge}
                </Badge>
                <h2 className="text-xl font-black leading-tight sm:text-3xl md:text-4xl text-foreground tracking-tight">
                  {MARKETING_PAGE.lmsSection.title}
                </h2>
              </div>
            </div>

            {/* Mobile: single panel + list rows */}
            <div className="overflow-hidden rounded-xl border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_var(--foreground)] md:hidden">
              {MARKETING_PAGE.lmsSection.cards.map((card, idx) => {
                const CardIcon = LMS_ICONS[idx];
                return (
                  <div
                    key={idx}
                    className={cn(
                      "flex min-h-11 items-start gap-3 px-3 py-3",
                      idx < MARKETING_PAGE.lmsSection.cards.length - 1 &&
                        "border-b-2 border-foreground",
                    )}
                  >
                    <div className="inline-flex shrink-0 rounded-lg border-2 border-foreground bg-secondary p-2 text-foreground">
                      <CardIcon className="size-4 stroke-[2.5]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-black text-foreground tracking-tight">
                        {card.title}
                      </h3>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground font-semibold line-clamp-2">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: 3 cards */}
            <div className="hidden grid-cols-3 gap-8 md:grid">
              {MARKETING_PAGE.lmsSection.cards.map((card, idx) => {
                const CardIcon = LMS_ICONS[idx];
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border-2 border-foreground bg-card p-8 shadow-[6px_6px_0px_0px_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[4px_4px_0px_0px_var(--foreground)] transition-all select-none"
                  >
                    <div className="inline-flex p-3 rounded-xl border-2 border-foreground bg-secondary text-foreground shadow-[2.5px_2.5px_0px_0px_var(--foreground)] mb-5">
                      <CardIcon className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <h3 className="text-base font-black text-foreground tracking-tight">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground font-semibold">
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <MarketingFaqSection />

        <MarketingFinalCtaSection />
      </main>
      <MarketingMobileStickyCta />
    </div>
  );
}
