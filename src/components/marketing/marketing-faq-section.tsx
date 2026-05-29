import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MARKETING_FAQ_ITEMS,
  MARKETING_FAQ_SECTION,
} from "@/constants/marketing-faq.constants";

export function MarketingFaqSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-14">
        <Badge
          variant="outline"
          className="border-primary/30 text-primary font-mono"
        >
          {MARKETING_FAQ_SECTION.badge}
        </Badge>
        <h2 className="mt-2 text-xl font-black text-foreground sm:text-2xl md:text-3xl">
          {MARKETING_FAQ_SECTION.title}
        </h2>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full border-t border-border bg-card rounded-lg overflow-hidden"
      >
        {MARKETING_FAQ_ITEMS.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="border-b border-border"
          >
            <AccordionTrigger className="py-4 px-4 text-left text-[11px] font-bold uppercase leading-snug tracking-wide text-foreground hover:text-primary sm:text-xs sm:tracking-wider">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed font-medium px-4 pb-4">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
