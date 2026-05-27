import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function MarketingFaqSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-14">
        <Badge
          variant="outline"
          className="border-primary/30 text-primary font-mono"
        >
          PREGUNTAS FRECUENTES
        </Badge>
        <h2 className="mt-2 text-xl font-black text-foreground sm:text-2xl md:text-3xl">
          Antes de entrar a un curso
        </h2>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full border-t border-border bg-card rounded-lg overflow-hidden"
      >
        <AccordionItem value="faq-1" className="border-b border-border">
          <AccordionTrigger className="py-4 px-4 text-left text-[11px] font-bold uppercase leading-snug tracking-wide text-foreground hover:text-primary sm:text-xs sm:tracking-wider">
            Necesito hablar un ingles nativo o perfecto?
          </AccordionTrigger>
          <AccordionContent className="text-xs text-muted-foreground leading-relaxed font-medium px-4 pb-4">
            No. El enfoque es ingles comercial funcional: entender al cliente,
            explicar alcance, hacer preguntas, presentar precio y cerrar los
            proximos pasos con claridad.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-2" className="border-b border-border">
          <AccordionTrigger className="py-4 px-4 text-left text-[11px] font-bold uppercase leading-snug tracking-wide text-foreground hover:text-primary sm:text-xs sm:tracking-wider">
            Esto es unicamente para programadores?
          </AccordionTrigger>
          <AccordionContent className="text-xs text-muted-foreground leading-relaxed font-medium px-4 pb-4">
            No. soyup.work esta pensado para freelancers digitales que quieren
            vender servicios en Upwork: desarrollo, diseno, edicion, data,
            redaccion, automatizacion y otras especialidades compatibles con
            trabajo remoto.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-3" className="border-b border-border">
          <AccordionTrigger className="py-4 px-4 text-left text-[11px] font-bold uppercase leading-snug tracking-wide text-foreground hover:text-primary sm:text-xs sm:tracking-wider">
            Los cursos prometen resultados o ingresos?
          </AccordionTrigger>
          <AccordionContent className="text-xs text-muted-foreground leading-relaxed font-medium px-4 pb-4">
            No. La promesa es formacion practica y criterio aplicado, no una
            garantia de ingresos. Upwork depende del nicho, experiencia,
            mercado, calidad de ejecucion y consistencia de cada freelancer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
