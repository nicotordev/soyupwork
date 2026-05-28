import Link from "next/link";
import React from "react";
import {
  Star,
  Zap,
  Clock,
  Shield,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Send,
  Award,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import { MarketingHeroSectionClient } from "@/components/marketing/marketing-hero-section.client";
import { MarketingProposalSimulatorClient } from "@/components/marketing/marketing-proposal-simulator.client";
import { MarketingTrackSelectorClient } from "@/components/marketing/marketing-track-selector.client";
import { MarketingFaqSection } from "@/components/marketing/marketing-faq-section";
import { Badge } from "@/components/ui/badge";

const STRATEGY_COMPARISON_ROWS = [
  {
    aspect: "Posicionamiento",
    superficial: "Abrir una cuenta, completar campos y esperar resultados",
    sistema:
      "Definir nicho, oferta, palabras clave y señales comerciales del perfil",
  },
  {
    aspect: "Propuestas",
    superficial: "Plantillas largas que no cambian segun el proyecto",
    sistema: "Lectura del problema, mensajes breves y ejemplos comentados",
  },
  {
    aspect: "Connects",
    superficial: "Aplicar a todo sin priorizar ni medir calidad",
    sistema:
      "Criterios para elegir proyectos, cuidar presupuesto y aprender de cada intento",
  },
  {
    aspect: "Operación",
    superficial: "Improvisar precio, llamadas, entrega y seguimiento",
    sistema:
      "Pricing, entrevistas, entrega profesional y nociones legales/fiscales para LATAM",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-sans text-foreground antialiased">
      <main className="relative z-10">
        {/* ----------------------------------------------------------------------
            1. HERO SECTION (MARKETING-FIRST CON MOCKUP PREMIUM Y CHAT FLOTANTE)
           ---------------------------------------------------------------------- */}
        <div className="relative">
          <MarketingHeroSectionClient />

          <hr />

          {/* ----------------------------------------------------------------------
            2. PROPUESTA DE VALOR
           ---------------------------------------------------------------------- */}
          <section
            id="social-proof"
            className="md:absolute md:-bottom-58 md:left-1/2 md:-translate-x-1/2 border-foreground bg-secondary/15 py-12 sm:py-20 overflow-hidden font-sans w-full"
          >
            {/* Subtle grid pattern background */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.153_0.006_107.1_/_8%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.153_0.006_107.1_/_8%)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-45" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
                <div className="group relative min-w-0 rounded-2xl border-2 border-foreground bg-card p-5 text-center shadow-[4px_4px_0px_0px_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_var(--foreground)] transition-all sm:p-8 select-none">
                  <div className="mx-auto mb-4 inline-flex p-3 rounded-xl border-2 border-foreground bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <BookOpen className="size-6 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-black text-foreground sm:text-3xl tracking-tight">
                    Cursos
                  </h3>
                  <p className="mt-3 text-pretty text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs leading-none">
                    PAGADOS POR TEMA Y ENFOCADOS EN UPWORK
                  </p>
                </div>
                <div className="group relative min-w-0 rounded-2xl border-2 border-foreground bg-card p-5 text-center shadow-[4px_4px_0px_0px_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_var(--foreground)] transition-all sm:p-8 select-none">
                  <div className="mx-auto mb-4 inline-flex p-3 rounded-xl border-2 border-foreground bg-secondary text-foreground group-hover:scale-110 transition-transform shadow-[2px_2px_0px_0px_var(--foreground)]">
                    <Send className="size-6 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-black text-foreground sm:text-3xl tracking-tight">
                    Contenido
                  </h3>
                  <p className="mt-3 text-pretty text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs leading-none">
                    VIDEO, TEXTO, EJERCICIOS Y CUESTIONARIOS
                  </p>
                </div>
                <div className="group relative min-w-0 rounded-2xl border-2 border-foreground bg-card p-5 text-center shadow-[4px_4px_0px_0px_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_var(--foreground)] transition-all sm:p-8 select-none">
                  <div className="mx-auto mb-4 inline-flex p-3 rounded-xl border-2 border-foreground bg-accent text-accent-foreground group-hover:scale-110 transition-transform">
                    <Award className="size-6 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-black text-foreground sm:text-3xl tracking-tight">
                    Enfoque
                  </h3>
                  <p className="mt-3 text-pretty text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs leading-none">
                    PROPUESTAS, NICHOS, PRICING Y OPERACION
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ----------------------------------------------------------------------
            3. INTERACTIVE PROPOSAL SIMULATOR
           ---------------------------------------------------------------------- */}
        <div className="md:pt-32">
          <MarketingProposalSimulatorClient />
        </div>

        {/* ----------------------------------------------------------------------
            4. COMPARA MATRIX (SOYUPWORK VS CURSO DE GURÚ)
           ---------------------------------------------------------------------- */}
        <section className="relative border-y-2 border-foreground bg-muted py-12 sm:py-24 overflow-hidden font-sans">
          {/* Subtle grid pattern background */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.153_0.006_107.1_/_8%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.153_0.006_107.1_/_8%)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35" />
          <div className="pointer-events-none absolute -left-20 top-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />

          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
              <Badge
                variant="outline"
                className="border-primary/40 bg-primary/15 text-primary font-mono px-3 py-1 font-bold uppercase tracking-wider text-[10px]"
              >
                COMPAREMOS ESTRATEGIAS
              </Badge>
              <h2 className="mt-4 text-2xl font-black sm:text-4xl lg:text-5xl leading-tight text-foreground tracking-tight">
                No vendemos atajos. Enseñamos criterio para competir mejor.
              </h2>
            </div>

            {/* Mobile View */}
            <div className="space-y-4 md:hidden">
              {STRATEGY_COMPARISON_ROWS.map((row) => (
                <article
                  key={row.aspect}
                  className="overflow-hidden rounded-2xl border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--foreground)]"
                >
                  <h3 className="border-b-2 border-foreground bg-secondary/80 px-4 py-3 text-sm font-black text-foreground uppercase tracking-wider font-mono">
                    {row.aspect}
                  </h3>
                  <div className="space-y-3 p-3.5 sm:p-4">
                    <div className="rounded-xl border-2 border-foreground bg-destructive/10 p-3 sm:p-3.5">
                      <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-destructive flex items-center gap-1.5">
                        <AlertTriangle className="size-3.5" /> Cursos superficiales
                      </p>
                      <p className="text-xs font-semibold leading-relaxed text-foreground">
                        {row.superficial}
                      </p>
                    </div>
                    <div className="rounded-xl border-2 border-foreground bg-primary/10 p-3 sm:p-3.5">
                      <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5" /> El sistema soyup.work
                      </p>
                      <p className="text-xs font-semibold leading-relaxed text-foreground">
                        {row.sistema}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden overflow-hidden rounded-2xl border-2 border-foreground bg-card shadow-[8px_8px_0px_0px_var(--foreground)] md:block select-none">
              <table className="w-full text-left text-xs font-medium sm:text-sm">
                <thead>
                  <tr className="border-b-2 border-foreground bg-secondary/80 font-mono text-[10px] text-muted-foreground tracking-wider">
                    <th className="p-5 uppercase font-bold">MÉTRICA / ASPECTO</th>
                    <th className="p-5 uppercase font-bold text-destructive border-l-2 border-foreground">
                      CURSOS SUPERFICIALES
                    </th>
                    <th className="p-5 uppercase font-bold text-primary border-l-2 border-foreground">
                      EL SISTEMA SOYUP.WORK
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-foreground">
                  {STRATEGY_COMPARISON_ROWS.map((row) => (
                    <tr key={row.aspect} className="hover:bg-muted/50 transition-colors">
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

        {/* ----------------------------------------------------------------------
            5. CURRICULUM SUGERIDO
           ---------------------------------------------------------------------- */}
        <section className="relative overflow-hidden py-12 sm:py-24 font-sans border-foreground">
          {/* Engineering grid lines background */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.153_0.006_107.1_/_6%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.153_0.006_107.1_/_6%)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center sm:mb-16">
              <Badge
                variant="outline"
                className="border-primary/40 bg-primary/10 text-primary font-mono px-3 py-1 font-bold uppercase tracking-wider text-[10px]"
              >
                CURRICULUM SUGERIDO
              </Badge>
              <h2 className="text-2xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl tracking-tight">
                De entender Upwork a operar como freelancer internacional
              </h2>
              <p className="mx-auto max-w-2xl text-sm sm:text-base font-medium text-muted-foreground leading-relaxed">
                La idea no es enseñar solo a crear una cuenta. El contenido se
                ordena alrededor de competir mejor: nicho, perfil, Connects,
                propuestas, entrevistas, pricing, entrega y operación.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  num: "01",
                  title: "Perfil y nicho",
                  desc: "Fundamentos reales de Upwork, especialización, nichos rentables y perfil optimizado para búsqueda.",
                  icon: BookOpen,
                },
                {
                  num: "02",
                  title: "Connects y propuestas",
                  desc: "Economía de Connects, bidding con criterio y propuestas cortas que responden al problema del cliente.",
                  icon: Zap,
                },
                {
                  num: "03",
                  title: "Entrevistas y pricing",
                  desc: "Inglés para entrevistas, pricing, paquetes y retainers para vender alcance y valor sin improvisar.",
                  icon: DollarSign,
                },
                {
                  num: "04",
                  title: "Entrega y operación",
                  desc: "Entrega profesional, JSS, nociones legales/fiscales para LATAM y automatización con IA cuando aporte al flujo de trabajo.",
                  icon: Award,
                },
              ].map((step) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="group relative flex flex-col justify-between rounded-2xl border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--foreground)] transition-all select-none sm:p-6"
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

        {/* ----------------------------------------------------------------------
            6. SELECTOR DE RUTAS
           ---------------------------------------------------------------------- */}
        <MarketingTrackSelectorClient />

        {/* ----------------------------------------------------------------------
            7. PLATAFORMA LMS
           ---------------------------------------------------------------------- */}
        <section className="relative border-b-2 border-foreground bg-primary/5 py-12 sm:py-24 overflow-hidden font-sans">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_20%,var(--primary)/0.06,transparent_40%)]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex max-w-3xl flex-col gap-4 sm:mb-16 sm:flex-row sm:items-start select-none">
              <div className="inline-flex p-3 shrink-0 rounded-2xl border-2 border-foreground bg-secondary text-foreground shadow-[3px_3px_0px_0px_var(--foreground)] w-fit">
                <Star className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-primary/10 text-primary font-mono px-2 py-0.5 font-bold uppercase tracking-wider text-[9px] mb-2"
                >
                  SISTEMA LMS PROPIO
                </Badge>
                <h2 className="text-xl font-black leading-tight sm:text-3xl md:text-4xl text-foreground tracking-tight">
                  Una academia custom, no un curso suelto en una plataforma genérica
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              {[
                {
                  title: "Acceso por compra",
                  desc: "Compra de curso con Stripe, acceso protegido y contenido disponible solo para estudiantes inscritos.",
                  icon: Lock,
                },
                {
                  title: "Progreso y drip content",
                  desc: "Lecciones organizadas por módulos, seguimiento de avance, quizzes simples y liberación gradual cuando el curso lo requiera.",
                  icon: Clock,
                },
                {
                  title: "Base para escalar",
                  desc: "Primero se valida contenido, ventas y retención. Comunidad, gamificación, afiliados y cohortes pueden venir después.",
                  icon: Shield,
                },
              ].map((card, idx) => {
                const CardIcon = card.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border-2 border-foreground bg-card p-5 shadow-[6px_6px_0px_0px_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[4px_4px_0px_0px_var(--foreground)] transition-all select-none sm:p-8"
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

        {/* ----------------------------------------------------------------------
            8. PREGUNTAS FRECUENTES CON ACORDEÓN
           ---------------------------------------------------------------------- */}
        <MarketingFaqSection />

        {/* ----------------------------------------------------------------------
            9. CTA FINAL (EMOTIONAL BANNER)
           ---------------------------------------------------------------------- */}
        <section className="relative mx-auto max-w-6xl px-4 py-12 sm:py-24 lg:px-8 font-sans">
          <div className="relative overflow-hidden rounded-3xl border-2 border-foreground bg-card p-5 text-center shadow-[6px_6px_0px_0px_var(--foreground)] sm:border-4 sm:p-14 sm:shadow-[12px_12px_0px_0px_var(--foreground)] md:p-16 select-none">
            {/* High opacity glowing background gradient */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_0%,var(--primary)/0.25,transparent_50%)]" />
            {/* Soft grid lines inside the banner */}
            <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,oklch(0.153_0.006_107.1_/_4%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.153_0.006_107.1_/_4%)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

            <div className="relative space-y-6 sm:space-y-8">
              <Badge
                variant="outline"
                className="border-primary/40 bg-primary/10 text-primary font-mono px-3.5 py-1 font-bold uppercase tracking-wider text-[10px]"
              >
                ÚLTIMO PASO
              </Badge>

              <h2 className="text-xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl max-w-4xl mx-auto tracking-tight">
                Si quieres vender servicios en Upwork, empieza por{" "}
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500 underline decoration-foreground decoration-wavy decoration-3 underline-offset-4">
                  aprender a competir con criterio.
                </span>
              </h2>

              <p className="mx-auto max-w-2xl text-sm sm:text-base font-semibold text-muted-foreground leading-relaxed">
                Explora cursos por tema y avanza desde fundamentos reales hacia
                propuestas, entrevistas, pricing, entrega y operación freelance
                internacional.
              </p>

              <div className="pt-2 flex justify-center">
                <LinkButton
                  href="/catalog"
                  className="group relative inline-flex w-full max-w-sm items-center justify-center gap-2.5 rounded-xl border-2 border-foreground bg-primary px-8 py-4 text-xs font-black uppercase tracking-widest text-primary-foreground shadow-[4px_4px_0px_0px_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_0px_var(--foreground)] active:translate-y-[3.5px] active:shadow-none transition-all sm:w-auto sm:px-10"
                >
                  Ver catálogo de cursos
                  <Zap className="h-4 w-4 stroke-[3] group-hover:scale-125 transition-transform" />
                  <ArrowUpRight className="h-3.5 w-3.5 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </LinkButton>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

interface LinkButtonProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode;
}

function LinkButton({ children, className, ...props }: LinkButtonProps) {
  return (
    <Link className={className} {...props}>
      {children}
    </Link>
  );
}

