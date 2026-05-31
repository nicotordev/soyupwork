import { LegalBrutalSeparator } from "@/components/legal/legal-brutal-separator";
import { LegalCallout } from "@/components/legal/legal-callout";
import { LegalMetadataRow } from "@/components/legal/legal-metadata-row";
import { cn } from "@/lib/utils";
import type { LegalContentBlock, LegalSection } from "@/types/legal-page.types";

const legalTextClass =
  "text-[0.9375rem] leading-relaxed text-foreground/90 sm:text-base [&_strong]:font-bold [&_strong]:text-foreground";

const legalListClass = cn(legalTextClass, "space-y-2");

type LegalSectionProps = {
  section: LegalSection;
  index: number;
  showSeparator?: boolean;
};

function renderBlock(block: LegalContentBlock, key: number) {
  switch (block.type) {
    case "p":
      return (
        <p key={key} className={legalTextClass}>
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul
          key={key}
          className={cn(legalListClass, "list-disc pl-5 marker:text-primary")}
        >
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol
          key={key}
          className={cn(
            legalListClass,
            "list-decimal pl-5 marker:font-bold marker:text-primary",
          )}
        >
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <LegalCallout
          key={key}
          variant={block.variant}
          title={block.title}
          body={block.body}
        />
      );
    case "quote":
      return (
        <blockquote
          key={key}
          className="rounded-xl border-l-4 border-primary bg-muted/40 px-4 py-3 text-sm font-medium italic leading-relaxed text-foreground/90 sm:text-base"
        >
          {block.text}
        </blockquote>
      );
    case "meta":
      return <LegalMetadataRow key={key} items={block.items} />;
    default:
      return null;
  }
}

export function LegalSectionBlock({
  section,
  index,
  showSeparator = true,
}: LegalSectionProps) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className="scroll-mt-24 sm:scroll-mt-28"
    >
      {showSeparator && index > 0 ? <LegalBrutalSeparator /> : null}

      <header className="mb-5 space-y-2 sm:mb-6">
        <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
          Sección {String(index + 1).padStart(2, "0")}
        </p>
        <h2
          id={`${section.id}-heading`}
          className="font-heading text-xl font-black tracking-tight text-foreground sm:text-2xl"
        >
          {section.title}
        </h2>
      </header>

      <div className="space-y-4 sm:space-y-5">
        {section.blocks.map((block, blockIndex) =>
          renderBlock(block, blockIndex),
        )}
      </div>
    </section>
  );
}
