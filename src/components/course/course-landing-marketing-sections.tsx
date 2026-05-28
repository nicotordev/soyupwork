import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Zap } from "lucide-react";
import Link from "next/link";

type FaqItem = {
  q: string;
  a: string;
};

type CourseLandingMarketingSectionsProps = {
  continueHref: string | null;
  ctaLabel: string;
  enrolledStudentCount: number;
  ecosystemTools: readonly string[];
  faqItems: readonly FaqItem[];
};

export function CourseLandingMarketingSections({
  continueHref,
  ctaLabel,
  enrolledStudentCount,
  ecosystemTools,
  faqItems,
}: CourseLandingMarketingSectionsProps) {
  return (
    <>
      <section className="rounded-3xl border border-foreground/10 bg-card p-6">
        <h2 className="mb-4 text-2xl font-black">
          Ecosistema freelancer moderno
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {ecosystemTools.map((tool) => (
            <div
              key={tool}
              className="rounded-xl border border-foreground/10 bg-background px-3 py-2 text-center text-xs text-muted-foreground"
            >
              {tool}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black sm:text-3xl">Comparativa clara</h2>
        <div className="overflow-x-auto rounded-2xl border border-foreground/10 bg-card">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-foreground/10 bg-muted/40">
              <tr>
                <th className="px-4 py-3">Característica</th>
                <th className="px-4 py-3 text-emerald-600">soyup.work</th>
                <th className="px-4 py-3">Curso freelance genérico</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Estrategia real de Upwork", "Sí", "Parcial"],
                ["Workflows con IA", "Sí", "No"],
                ["Sistemas de propuestas", "Sí", "Básico"],
                ["Pagos internacionales LATAM", "Sí", "No"],
                ["Sistema fiscal para freelancers", "Sí", "No"],
                ["Preparación de entrevistas", "Sí", "Poco"],
                ["Templates descargables", "Sí", "Limitado"],
                ["Actualizaciones continuas", "Sí", "No"],
                ["Enfoque práctico-operativo", "Total", "Teórico"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-foreground/5">
                  <td className="px-4 py-3">{row[0]}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                    {row[1]}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black sm:text-3xl">FAQ</h2>
        <Accordion
          type="single"
          collapsible
          className="border-0 bg-transparent"
        >
          {faqItems.map((item, idx) => (
            <AccordionItem
              key={item.q}
              value={`faq-${idx}`}
              className="mb-2 rounded-2xl border border-foreground/10 bg-card px-3"
            >
              <AccordionTrigger className="no-underline hover:no-underline">
                <span className="text-sm font-semibold">{item.q}</span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="rounded-3xl bg-zinc-950 p-8 text-zinc-100">
        <p className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 font-mono text-[10px] uppercase text-emerald-300">
          <Flame className="size-3.5" />
          Cohorte activa
        </p>
        <h2 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
          Tu competencia ya está automatizando propuestas. No te quedes atrás.
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-zinc-300">
          Aprende a construir un negocio freelance global con sistemas, no con
          hacks. Garantía de 7 días y pago seguro por Stripe.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {continueHref ? (
            <Button
              asChild
              className="h-11 bg-emerald-500 px-5 text-zinc-900 hover:bg-emerald-400"
            >
              <Link href={continueHref}>
                {ctaLabel}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : null}
          <p className="text-xs text-zinc-400">
            {enrolledStudentCount} estudiantes · Checkout seguro · Acceso
            lifetime
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-foreground/10 bg-card p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {[
            ["Courses", "Upwork Mastery", "Proposal OS", "AI Freelance Stack"],
            ["Resources", "Guías", "Plantillas", "Blog"],
            ["Community", "Discord privado", "Eventos", "Office hours"],
            ["Legal", "Términos", "Privacidad", "Reembolsos"],
            [
              "Support",
              "help@soyup.work",
              "Centro de ayuda",
              "Estado de plataforma",
            ],
            ["Socials", "X", "YouTube", "LinkedIn"],
          ].map((column) => (
            <div key={column[0]}>
              <p className="mb-2 font-mono text-[10px] uppercase text-muted-foreground">
                {column[0]}
              </p>
              <ul className="space-y-1 text-sm">
                {column.slice(1).map((item) => (
                  <li key={item} className="text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-foreground/10 pt-4 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} soyup.work. Todos los derechos
            reservados.
          </p>
          <p className="inline-flex items-center gap-1">
            <Zap className="size-3.5 text-emerald-500" />
            Newsletter semanal + comunidad privada para estudiantes.
          </p>
        </div>
      </section>
    </>
  );
}
