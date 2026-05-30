"use client";

import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PRICING_PAGE } from "@/constants/pricing.constants";
import type { PricingFaqItem } from "@/types/pricing.types";

type PricingFaqSectionClientProps = {
  items: readonly PricingFaqItem[];
};

export function PricingFaqSectionClient({
  items,
}: PricingFaqSectionClientProps) {
  const { badge, title } = PRICING_PAGE.faqSection;

  return (
    <section
      id="faq"
      className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-14">
        <Badge
          variant="outline"
          className="border-primary/30 font-mono text-[9px] text-primary md:text-xs"
        >
          {badge}
        </Badge>
        <h2 className="mt-2 text-xl font-black text-foreground sm:text-2xl md:text-3xl">
          {title}
        </h2>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full overflow-hidden rounded-xl border-2 border-foreground bg-card md:rounded-lg md:border md:border-border"
      >
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="border-b-2 border-foreground last:border-b-0 md:border-b md:border-border"
          >
            <AccordionTrigger className="min-h-11 px-3 py-3 text-left text-[11px] font-bold uppercase leading-snug tracking-wide text-foreground hover:text-primary active:opacity-80 sm:px-4 sm:text-xs sm:tracking-wider">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 text-xs font-medium leading-relaxed text-muted-foreground sm:px-4 sm:pb-4">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
