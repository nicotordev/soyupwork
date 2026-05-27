import Link from "next/link";
import React from "react";
import { Star, Zap, Clock, Shield, Lock } from "lucide-react";
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
        <MarketingHeroSectionClient />

        {/* ----------------------------------------------------------------------
            2. PROPUESTA DE VALOR
           ---------------------------------------------------------------------- */}
        <section
          id="social-proof"
          className="border-y border-border bg-card/40 py-10 sm:py-14"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              <div className="min-w-0 rounded-xl border border-border bg-card p-4 text-center transition-colors hover:border-primary/20 sm:p-6">
                <p className="text-2xl font-black text-foreground sm:text-3xl">
                  Cursos
                </p>
                <p className="mt-2 text-pretty text-[10px] font-mono font-bold uppercase tracking-wide text-muted-foreground sm:text-xs sm:tracking-wider">
                  PAGADOS POR TEMA Y ENFOCADOS EN UPWORK
                </p>
              </div>
              <div className="min-w-0 rounded-xl border border-border bg-card p-4 text-center transition-colors hover:border-primary/20 sm:p-6">
                <p className="text-2xl font-black text-foreground sm:text-3xl">
                  Contenido
                </p>
                <p className="mt-2 text-pretty text-[10px] font-mono font-bold uppercase tracking-wide text-muted-foreground sm:text-xs sm:tracking-wider">
                  VIDEO, TEXTO, EJERCICIOS Y CUESTIONARIOS
                </p>
              </div>
              <div className="min-w-0 rounded-xl border border-border bg-card p-4 text-center transition-colors hover:border-primary/20 sm:p-6">
                <p className="text-2xl font-black text-foreground sm:text-3xl">
                  Enfoque
                </p>
                <p className="mt-2 text-pretty text-[10px] font-mono font-bold uppercase tracking-wide text-muted-foreground sm:text-xs sm:tracking-wider">
                  PROPUESTAS, NICHOS, PRICING Y OPERACION
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------------
            3. INTERACTIVE PROPOSAL SIMULATOR
           ---------------------------------------------------------------------- */}
        <MarketingProposalSimulatorClient />

        {/* ----------------------------------------------------------------------
            4. COMPARA MATRIX (SOYUPWORK VS CURSO DE GURÚ)
           ---------------------------------------------------------------------- */}
        <section className="border-t border-border bg-card/20 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-14">
              <Badge
                variant="outline"
                className="border-primary/30 text-primary font-mono"
              >
                COMPAREMOS ESTRATEGIAS
              </Badge>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                No vendemos atajos. Enseñamos criterio para competir mejor.
              </h2>
            </div>

            <div className="space-y-3 md:hidden">
              {STRATEGY_COMPARISON_ROWS.map((row) => (
                <article
                  key={row.aspect}
                  className="overflow-hidden rounded-xl border border-border bg-card shadow-lg"
                >
                  <h3 className="border-b border-border bg-muted/30 p-3 text-sm font-bold text-foreground">
                    {row.aspect}
                  </h3>
                  <div className="space-y-3 p-3">
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                      <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-wide text-destructive">
                        Cursos superficiales
                      </p>
                      <p className="text-xs font-medium leading-relaxed text-destructive/80">
                        {row.superficial}
                      </p>
                    </div>
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-wide text-primary">
                        El sistema soyup.work
                      </p>
                      <p className="text-xs font-semibold leading-relaxed text-primary">
                        {row.sistema}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-lg md:block">
              <table className="w-full text-left text-xs font-medium sm:text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 font-mono text-[10px] text-muted-foreground">
                    <th className="p-4 uppercase">MÉTRICA / ASPECTO</th>
                    <th className="p-4 uppercase text-destructive">
                      CURSOS SUPERFICIALES
                    </th>
                    <th className="p-4 uppercase text-primary">
                      EL SISTEMA SOYUP.WORK
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {STRATEGY_COMPARISON_ROWS.map((row) => (
                    <tr key={row.aspect}>
                      <td className="p-4 font-bold text-foreground">
                        {row.aspect}
                      </td>
                      <td className="bg-destructive/5 p-4 text-destructive/80">
                        {row.superficial}
                      </td>
                      <td className="bg-primary/5 p-4 font-semibold text-primary">
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
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto mb-8 max-w-3xl space-y-3 text-center sm:mb-14">
            <Badge
              variant="outline"
              className="border-primary/30 text-primary font-mono"
            >
              CURRICULUM SUGERIDO
            </Badge>
            <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl md:text-4xl">
              De entender Upwork a operar como freelancer internacional
            </h2>
            <p className="mx-auto max-w-xl text-sm font-medium text-muted-foreground">
              La idea no es enseñar solo a crear una cuenta. El contenido se
              ordena alrededor de competir mejor: nicho, perfil, Connects,
              propuestas, entrevistas, pricing, entrega y operación.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            <div className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 sm:p-6">
              <div className="space-y-4">
                <span className="font-mono text-3xl font-black text-muted-foreground/30 group-hover:text-primary transition-colors">
                  01
                </span>
                <h3 className="text-base font-bold text-foreground">
                  Perfil y nicho
                </h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Fundamentos reales de Upwork, especialización, nichos
                  rentables y perfil optimizado para búsqueda.
                </p>
              </div>
            </div>

            <div className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 sm:p-6">
              <div className="space-y-4">
                <span className="font-mono text-3xl font-black text-muted-foreground/30 group-hover:text-primary transition-colors">
                  02
                </span>
                <h3 className="text-base font-bold text-foreground">
                  Connects y propuestas
                </h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Economía de Connects, bidding con criterio y propuestas cortas
                  que responden al problema del cliente.
                </p>
              </div>
            </div>

            <div className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 sm:p-6">
              <div className="space-y-4">
                <span className="font-mono text-3xl font-black text-muted-foreground/30 group-hover:text-primary transition-colors">
                  03
                </span>
                <h3 className="text-base font-bold text-foreground">
                  Entrevistas y pricing
                </h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Inglés para entrevistas, pricing, paquetes y retainers para
                  vender alcance y valor sin improvisar.
                </p>
              </div>
            </div>

            <div className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 sm:p-6">
              <div className="space-y-4">
                <span className="font-mono text-3xl font-black text-muted-foreground/30 group-hover:text-primary transition-colors">
                  04
                </span>
                <h3 className="text-base font-bold text-foreground">
                  Entrega y operación
                </h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Entrega profesional, JSS, nociones legales/fiscales para LATAM
                  y automatización con IA cuando aporte al flujo de trabajo.
                </p>
              </div>
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
        <section className="border-t border-border bg-card/30 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex max-w-2xl flex-col gap-3 sm:mb-14 sm:flex-row sm:items-start">
              <Star className="h-5 w-5 shrink-0 text-primary" />
              <h2 className="text-xl font-black leading-tight sm:text-2xl md:text-3xl">
                Una academia custom, no un curso suelto en una plataforma
                genérica
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                <Lock className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-sm font-black text-foreground">
                  Acceso por compra
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground font-medium">
                  Compra de curso con Stripe, acceso protegido y contenido
                  disponible solo para estudiantes inscritos.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-sm font-black text-foreground">
                  Progreso y drip content
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground font-medium">
                  Lecciones organizadas por módulos, seguimiento de avance,
                  quizzes simples y liberación gradual cuando el curso lo
                  requiera.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-sm font-black text-foreground">
                  Base para escalar
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground font-medium">
                  Primero se valida contenido, ventas y retención. Comunidad,
                  gamificación, afiliados y cohortes pueden venir después.
                </p>
              </div>
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
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card p-6 text-center shadow-2xl sm:p-10 md:p-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,var(--primary)/0.18,transparent_45%)]" />

            <div className="relative space-y-5 sm:space-y-6">
              <Badge
                variant="outline"
                className="border-primary/30 text-primary font-mono"
              >
                ÚLTIMO PASO
              </Badge>

              <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl md:text-5xl">
                Si quieres vender servicios en Upwork, empieza por{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/80">
                  aprender a competir con criterio.
                </span>
              </h2>

              <p className="mx-auto max-w-2xl text-sm font-medium text-muted-foreground sm:text-base">
                Explora cursos por tema y avanza desde fundamentos reales hacia
                propuestas, entrevistas, pricing, entrega y operación freelance
                internacional.
              </p>

              <LinkButton
                href="/catalog"
                className="mx-auto inline-flex w-full max-w-sm items-center justify-center gap-2 rounded border-2 border-foreground bg-primary px-8 py-3.5 text-xs font-black uppercase tracking-wider text-primary-foreground shadow-[4px_4px_0px_0px_var(--foreground)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_0px_var(--foreground)] active:translate-y-[3px] active:shadow-none sm:w-auto sm:max-w-none sm:px-10 sm:py-4"
              >
                Ver catálogo de cursos
                <Zap className="h-4 w-4 stroke-[3]" />
              </LinkButton>
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
