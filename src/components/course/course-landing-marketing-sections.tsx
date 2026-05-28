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
} from "react-icons/fa";
import { FiShield, FiZap } from "react-icons/fi";
import Link from "next/link";

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
        className="absolute top-1 left-1 size-5 text-primary"
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
        className="absolute top-1 left-1 size-5 text-primary"
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
        className="absolute top-1 left-1 size-5 text-primary"
        aria-hidden="true"
      />
    ),
    title: "Economia de Connects con estrategia.",
    description:
      "Aprende cuando aplicar, cuanto pujar y como proteger presupuesto. Ideal para quien busca buy connects upwork sin desperdiciar intentos.",
  },
  {
    icon: (
      <FiShield
        className="absolute top-1 left-1 size-5 text-primary"
        aria-hidden="true"
      />
    ),
    title: "Enfoque real para LATAM.",
    description:
      "Resolvemos dudas comunes como upwork es confiable y aterrizamos operacion freelance para trabajar remoto desde Chile y toda LATAM.",
  },
  {
    icon: (
      <FiZap
        className="absolute top-1 left-1 size-5 text-primary"
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
        className="absolute top-1 left-1 size-5 text-primary"
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
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-base font-semibold text-primary">
            Academia práctica para Upwork
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-foreground sm:text-5xl">
            De entender Upwork a competir con criterio comercial.
          </p>
          <p className="mt-6 text-lg text-muted-foreground">
            SoyUpwork es una plataforma para freelancers que quieren resultados
            reales: perfil, nicho, propuestas, entrevistas, pricing y operación.
            Si hoy estás buscando upwork chile, upwork opiniones o cómo
            conseguir trabajo en Upwork, este es el punto de partida correcto.
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
            <div className="absolute -inset-x-20 bottom-0 bg-linear-to-t from-background pt-[7%]" />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base text-muted-foreground sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {features.map((feature, idx) => (
            <div className="relative pl-9" key={idx}>
              <dt className="inline font-semibold text-foreground">
                {feature.icon}
                {feature.title}
              </dt>
              <dd className="inline">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
