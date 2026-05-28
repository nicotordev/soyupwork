"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  MessageSquare,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { Motion } from "@/components/common/motion";

export function MarketingHeroSectionClient() {
  return (
    <section className="mx-auto max-w-7xl overflow-x-hidden px-4 pb-14 py-24 sm:px-6 sm:pb-20 lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center lg:px-8">
      <div className="space-y-8 text-center lg:col-span-6 lg:text-left">
        <div className="space-y-4">
          <Motion
            as="h1"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Convierte tu talento en{" "}
            <span className="text-green-600 drop-shadow-sm">ingresos $$</span>
          </Motion>



          <Motion
            as="p"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg lg:mx-0 font-medium leading-relaxed"
          >
            soyup.work reúne cursos basados en experiencia real en la
            plataforma&nbsp;
            <span className="inline-block px-1 py-0.5 bg-primary/10 text-primary font-mono font-bold rounded">
              $2500+/mes posibles
            </span>
            : propuestas, nichos, pricing, inglés para entrevistas, Connects y
            operación freelance internacional, con videos, texto y cuestionarios
            interactivos.
            <br />
            <span className="font-semibold text-foreground">
              Aprende a facturar — no sólo a navegar la plataforma.
            </span>
          </Motion>
        </div>

        <Motion
          as="div"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="flex flex-col justify-center items-center gap-3 sm:flex-row lg:justify-start"
        >
          <Link
            href="/waitlist"
            className="inline-flex w-full items-center justify-center gap-2 rounded border-2 border-foreground bg-primary px-8 py-3.5 text-xs font-black uppercase tracking-wider text-primary-foreground shadow-[4px_4px_0px_0px_var(--foreground)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_var(--foreground)] active:translate-y-[3px] active:shadow-none transition-all sm:w-auto"
          >
            Me interesa
            <ArrowRight className="h-4 w-4 stroke-3" />
          </Link>
          <Link
            href="/demo"
            className="inline-flex w-full items-center justify-center gap-2 rounded border-2 border-primary bg-background px-8 py-3.5 text-xs font-black uppercase tracking-wider text-primary shadow-[4px_4px_0px_0px_var(--primary)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_var(--primary)] active:translate-y-[3px] active:shadow-none transition-all sm:w-auto"
          >
            Ver demo <PlayCircle className="h-4 w-4 stroke-3" />
          </Link>
        </Motion>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-muted-foreground lg:justify-start font-mono font-semibold">
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-primary" />
            Cursos por tema
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-primary" />
            Videos, texto y quizzes
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-primary" />
            Experiencia aplicada en Upwork
          </span>
        </div>
      </div>

      <Motion
        as="div"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, delay: 0.18 }}
        className="relative mt-10 min-w-0 lg:col-span-6 lg:mt-0"
      >
        <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-primary to-primary/40 opacity-15 blur-xl" />

        <div className="relative rounded-2xl border-2 border-border bg-card shadow-2xl overflow-hidden p-1 group">
          <Image
            src="/img/home/hero.webp"
            alt="Vista previa de una plataforma de aprendizaje para freelancers"
            width={1000}
            height={1000}
            className="rounded-xl w-full h-auto object-cover"
            priority
          />
        </div>

        <div className="absolute right-2 top-2 z-10 max-w-[85%] rounded border-2 border-foreground bg-primary px-2.5 py-1 text-center font-mono text-[9px] font-black uppercase text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)] sm:-right-4 sm:-top-4 sm:max-w-none sm:px-3.5 sm:py-1.5 sm:text-[10px]">
          Cursos de gratis y de pago
        </div>
      </Motion>
    </section>
  );
}
