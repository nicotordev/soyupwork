import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  FaCloudUploadAlt,
  FaCertificate,
  FaStream,
  FaDatabase,
  FaShieldAlt,
  FaBolt,
} from "react-icons/fa";

// These color classes should match the ones defined in @src/app/globals.css
// e.g., 'text-primary', 'text-secondary', 'bg-primary', etc.

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

const features = [
  {
    icon: (
      <FaCloudUploadAlt
        className="absolute top-1 left-1 size-5 text-primary-foreground"
        aria-hidden="true"
      />
    ),
    title: "Aprende con sistema, no con atajos.",
    description:
      "Si buscas upwork como funciona, aqui no te vendemos teoria vacia: trabajas con flujo real de perfil, propuesta, entrevista y cierre.",
  },
  {
    icon: (
      <FaCertificate
        className="absolute top-1 left-1 size-5 text-primary-foreground"
        aria-hidden="true"
      />
    ),
    title: "Ruta clara para principiantes.",
    description:
      "Desde upwork para principiantes hasta propuestas que convierten: contenido guiado para avanzar con criterio, incluso si hoy estas sin experiencia.",
  },
  {
    icon: (
      <FaStream
        className="absolute top-1 left-1 size-5 text-primary-foreground"
        aria-hidden="true"
      />
    ),
    title: "Economia de Connects con estrategia.",
    description:
      "Aprende cuando aplicar, cuanto pujar y como proteger presupuesto. Ideal para quien busca buy connects upwork sin desperdiciar intentos.",
  },
  {
    icon: (
      <FaShieldAlt
        className="absolute top-1 left-1 size-5 text-primary-foreground"
        aria-hidden="true"
      />
    ),
    title: "Enfoque real para LATAM.",
    description:
      "Resolvemos dudas comunes como upwork es confiable y aterrizamos operacion freelance para trabajar remoto desde toda Latinoamérica.",
  },
  {
    icon: (
      <FaBolt
        className="absolute top-1 left-1 size-5 text-primary-foreground"
        aria-hidden="true"
      />
    ),
    title: "Aplicable por nicho.",
    description:
      "Ya seas upwork asistente virtual, upwork web developer o perfil creativo, adaptas frameworks de propuestas y pricing a tu servicio.",
  },
  {
    icon: (
      <FaDatabase
        className="absolute top-1 left-1 size-5 text-primary-foreground"
        aria-hidden="true"
      />
    ),
    title: "Plataforma propia y progreso real.",
    description:
      "No es un PDF suelto: es software con lecciones, quizzes y seguimiento para convertir aprendizaje en resultados medibles en Upwork.",
  },
];

export function CourseLandingMarketingSections({
  continueHref,
  ctaLabel,
  enrolledStudentCount,
  ecosystemTools,
  faqItems,
}: CourseLandingMarketingSectionsProps) {
  return (
    <>
      <div className="relative bg-primary py-20 font-sans sm:py-28">
        <div
          aria-hidden
          className="absolute inset-0 z-1 opacity-75"
          style={{
            backgroundColor: "hsl(var(--background))",
            backgroundImage: `
              radial-gradient(circle at 12% 18%, rgba(16,185,129,.14), transparent 32%),
              radial-gradient(circle at 86% 16%, rgba(59,130,246,.12), transparent 28%),
              radial-gradient(circle at 74% 84%, rgba(16,185,129,.10), transparent 26%),
              linear-gradient(rgba(15,23,42,.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(15,23,42,.08) 1px, transparent 1px)
            `,
            backgroundSize: "auto, auto, auto, 26px 26px, 26px 26px",
          }}
        />
        <div className="relative z-2">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="text-base font-semibold text-primary-foreground">
                Academia práctica para Upwork
              </h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-primary-foreground sm:text-5xl">
                De entender Upwork a competir con criterio comercial.
              </p>
              <p className="mt-6 text-lg text-primary-foreground/80">
                SoyUpwork es una plataforma para freelancers que quieren
                resultados reales: perfil, nicho, propuestas, entrevistas, pricing
                y operación. Si hoy estás buscando upwork latam, upwork opiniones
                o cómo conseguir trabajo en Upwork, este es el punto de partida
                correcto.
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden pt-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <img
                width={2432}
                height={1442}
                src="/img/home/hero.webp"
                alt="Software de SoyUpwork para aprender y ejecutar estrategias de Upwork"
                className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-border"
              />
              <div aria-hidden="true" className="relative">
                <div className="absolute -inset-x-20 bottom-0 bg-linear-to-t from-primary/50 pt-[7%]" />
              </div>
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
            <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base text-muted-foreground sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
              {features.map((feature, idx) => (
                <div className="relative pl-9" key={idx}>
                  <dt className="inline font-semibold text-primary-foreground">
                    {feature.icon}
                    {feature.title}
                  </dt>
                  <br />
                  <dd className="inline text-primary-foreground/80">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <section className="bg-background py-16 sm:py-24 border-b-2 border-foreground relative isolate font-sans">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <span className="rounded-full border-2 border-foreground bg-primary/10 px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-primary shadow-[2px_2px_0px_0px_var(--foreground)]">
              F.A.Q.
            </span>
            <h2 className="mt-4 text-2xl font-black sm:text-4xl tracking-tight text-foreground">
              Preguntas Frecuentes
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
              Todo lo que necesitas saber sobre el programa y la metodología de Upwork.
            </p>
          </div>

          <div className="border-2 border-foreground bg-card rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_var(--foreground)] sm:shadow-[6px_6px_0px_0px_var(--foreground)]">
            <Accordion type="single" collapsible className="w-full divide-y divide-foreground/10">
              {faqItems.map((item, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="border-none py-1.5 first:pt-0 last:pb-0">
                  <AccordionTrigger className="text-left font-black text-sm sm:text-base text-foreground hover:text-primary transition-colors hover:no-underline py-3">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-3 font-medium">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}

