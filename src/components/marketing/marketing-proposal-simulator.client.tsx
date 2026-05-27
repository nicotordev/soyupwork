"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AlertCircle, Check, CheckCircle } from "lucide-react";
import { Motion } from "@/components/common/motion";
import { Badge } from "@/components/ui/badge";

export function MarketingProposalSimulatorClient() {
  const [simulatorMode, setSimulatorMode] = useState<"generic" | "algorithmic">(
    "algorithmic",
  );

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative overflow-x-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center min-w-0">
        <div className="lg:col-span-5 space-y-6">
          <Badge
            variant="outline"
            className="border-primary/30 text-primary font-mono uppercase"
          >
            Simulador del Sistema
          </Badge>
          <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl md:text-4xl">
            La diferencia entre copiar una plantilla y entender al cliente
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium">
            En Upwork no basta con abrir una cuenta. Un curso de soyup.work te
            ensena a leer la oportunidad, detectar el problema real y escribir
            una propuesta que suene especifica, no automatica.
          </p>

          <div className="space-y-4 font-medium text-xs">
            <div className="flex gap-2">
              <Check className="h-4.5 w-4.5 text-primary shrink-0" />
              <span>Aprendes a separar proyectos viables de ruido.</span>
            </div>
            <div className="flex gap-2">
              <Check className="h-4.5 w-4.5 text-primary shrink-0" />
              <span>Evitas copy-paste generico y mensajes sin contexto.</span>
            </div>
            <div className="flex gap-2">
              <Check className="h-4.5 w-4.5 text-primary shrink-0" />
              <span>Practicas ejemplos con texto, video y cuestionarios.</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 min-w-0 border-2 border-border bg-card rounded-xl shadow-2xl overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-border bg-muted/30 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <div className="flex min-w-0 items-center gap-1.5">
              <div className="h-2 w-2 shrink-0 rounded-full bg-destructive" />
              <div className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
              <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span className="ml-2 truncate font-mono text-[9px] text-muted-foreground uppercase">
                <span className="sm:hidden">SIMULADOR.SYS</span>
                <span className="hidden sm:inline">
                  SIMULADOR_PROPUESTAS_UPWORK.SYS
                </span>
              </span>
            </div>
            <div className="grid w-full grid-cols-2 gap-1 bg-background p-1 border border-border rounded sm:flex sm:w-auto">
              <button
                type="button"
                onClick={() => setSimulatorMode("generic")}
                className={`px-2 py-1 font-mono text-[10px] font-bold rounded transition-all text-center sm:py-0.5 ${
                  simulatorMode === "generic"
                    ? "bg-destructive/20 text-destructive border border-destructive/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Propuesta generica
              </button>
              <button
                type="button"
                onClick={() => setSimulatorMode("algorithmic")}
                className={`px-2 py-1 font-mono text-[10px] font-bold rounded transition-all text-center sm:py-0.5 ${
                  simulatorMode === "algorithmic"
                    ? "bg-primary/20 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Propuesta con contexto
              </button>
            </div>
          </div>

          <div className="p-3 sm:p-5 space-y-4 min-w-0">
            <div className="border border-border bg-background p-3 rounded-lg text-[11px] font-medium text-muted-foreground wrap-break-word">
              <p className="font-mono text-[9px] text-primary mb-1">
                PROYECTO CLIENTE (EE.UU.):
              </p>
              "Need Node.js backend expert to optimize Shopify webhooks database
              crashes..."
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
                  <div className="border border-destructive/20 bg-destructive/5 rounded-lg p-3">
                    <p className="text-[11px] font-mono text-destructive/80 leading-relaxed wrap-break-word">
                      "Dear Hiring Manager, I am a senior fullstack engineer
                      with 8 years of experience. I have massive skills in Node,
                      React and AWS. I can do it very cheap. Check my
                      profile..."
                    </p>
                  </div>
                  <div className="flex gap-2 items-start bg-destructive/10 p-2.5 rounded border border-destructive/20 text-[10px] text-muted-foreground">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <span>
                      <strong>Por que falla?</strong> El saludo es amplio, parte
                      desde la experiencia del freelancer y no demuestra que
                      entendio el problema del proyecto.
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
                  <div className="border border-primary/20 bg-primary/5 rounded-lg p-3">
                    <p className="text-[11px] font-mono text-primary leading-relaxed wrap-break-word">
                      "Hi Sarah - I noticed your Node.js endpoint is failing
                      because Shopify webhook batches are massive. I made a
                      2-min Loom diagnostics audit video for your DB:
                      loom.com/share/df92..."
                    </p>
                  </div>
                  <div className="flex gap-2 items-start bg-primary/10 p-2.5 rounded border border-primary/20 text-[10px] text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>Por que mejora?</strong> Parte desde el problema
                      publicado, propone una hipotesis concreta y abre una
                      conversacion con valor antes de hablar de precio.
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
