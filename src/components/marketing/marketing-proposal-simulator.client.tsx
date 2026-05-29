"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AlertCircle, Check, CheckCircle } from "lucide-react";
import { Motion } from "@/components/common/motion";
import { Badge } from "@/components/ui/badge";
import { MARKETING_PAGE } from "@/constants/marketing.constants";
import { cn } from "@/lib/utils";

const sim = MARKETING_PAGE.proposalSimulator;

export function MarketingProposalSimulatorClient() {
  const [simulatorMode, setSimulatorMode] = useState<"generic" | "algorithmic">(
    "algorithmic",
  );

  return (
    <section className="relative z-10 mx-auto max-w-7xl overflow-x-hidden px-4 py-10 sm:px-6 md:py-16 lg:px-8 lg:py-24">
      <div className="grid min-w-0 grid-cols-1 items-center gap-6 sm:gap-12 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5 md:space-y-6">
          <Badge
            variant="outline"
            className="border-primary/30 text-primary font-mono text-[9px] uppercase md:text-xs"
          >
            {sim.badge}
          </Badge>
          <h2 className="text-xl font-black leading-tight text-foreground md:text-3xl lg:text-4xl">
            {sim.title}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium">
            {sim.description}
          </p>

          <div className="space-y-3 font-medium text-xs md:space-y-4">
            {sim.bullets.map((bullet) => (
              <div key={bullet} className="flex gap-2">
                <Check className="size-4 shrink-0 text-primary md:size-4.5" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-xl border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_var(--foreground)] lg:col-span-7 md:shadow-[4px_4px_0px_0px_var(--foreground)]">
          <div className="flex flex-col gap-3 border-b-2 border-foreground bg-muted/30 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <div className="flex min-w-0 items-center gap-1.5">
              <div className="size-2 shrink-0 rounded-full bg-destructive" />
              <div className="size-2 shrink-0 rounded-full bg-amber-500" />
              <div className="size-2 shrink-0 rounded-full bg-primary" />
              <span className="ml-2 truncate font-mono text-[9px] text-muted-foreground uppercase">
                <span className="md:hidden">SIMULADOR.SYS</span>
                <span className="hidden md:inline">
                  SIMULADOR_PROPUESTAS_UPWORK.SYS
                </span>
              </span>
            </div>
            <div className="grid w-full grid-cols-2 gap-1 rounded border-2 border-foreground/20 bg-background p-1 sm:flex sm:w-auto">
              <button
                type="button"
                onClick={() => setSimulatorMode("generic")}
                className={cn(
                  "min-h-11 rounded px-2 py-1 font-mono text-[10px] font-bold transition-all text-center active:opacity-80 sm:min-h-0 sm:py-0.5",
                  simulatorMode === "generic"
                    ? "bg-destructive/20 text-destructive border border-destructive/20"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {sim.genericTab}
              </button>
              <button
                type="button"
                onClick={() => setSimulatorMode("algorithmic")}
                className={cn(
                  "min-h-11 rounded px-2 py-1 font-mono text-[10px] font-bold transition-all text-center active:opacity-80 sm:min-h-0 sm:py-0.5",
                  simulatorMode === "algorithmic"
                    ? "bg-primary/20 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {sim.contextTab}
              </button>
            </div>
          </div>

          <div className="space-y-3 p-3 min-w-0 md:space-y-4 md:p-5">
            <div className="border-b border-foreground/10 bg-background p-3 text-[11px] font-medium text-muted-foreground wrap-break-word">
              <p className="font-mono text-[9px] text-primary mb-1">
                {sim.projectLabel}
              </p>
              {sim.projectSnippet}
            </div>

            <AnimatePresence mode="wait">
              {simulatorMode === "generic" ? (
                <Motion
                  as="div"
                  key="generic"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="border-b border-foreground/10 bg-destructive/5 p-3">
                    <p className="text-[11px] font-mono text-destructive/80 leading-relaxed wrap-break-word">
                      {sim.genericProposal}
                    </p>
                  </div>
                  <div className="flex gap-2 items-start bg-destructive/10 p-2.5 text-[10px] text-muted-foreground">
                    <AlertCircle className="size-4 shrink-0 text-destructive mt-0.5" />
                    <span>
                      <strong>¿Por qué falla?</strong> {sim.genericWhy}
                    </span>
                  </div>
                </Motion>
              ) : (
                <Motion
                  as="div"
                  key="algorithmic"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="border-b border-foreground/10 bg-primary/5 p-3">
                    <p className="text-[11px] font-mono text-primary leading-relaxed wrap-break-word">
                      {sim.contextProposal}
                    </p>
                  </div>
                  <div className="flex gap-2 items-start bg-primary/10 p-2.5 text-[10px] text-muted-foreground">
                    <CheckCircle className="size-4 shrink-0 text-primary mt-0.5" />
                    <span>
                      <strong>¿Por qué mejora?</strong> {sim.contextWhy}
                    </span>
                  </div>
                </Motion>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
