import Link from "next/link";
import { MarkdownContent } from "@/components/common/markdown-content";
import { ResourcesHubStrip } from "@/components/resources/resources-hub-strip";
import { Badge } from "@/components/ui/badge";
import { GUIDES_PAGE } from "@/constants/guides.constants";
import { GUIDE_CATEGORIES } from "@/constants/guides.constants";
import { guidePath, GUIDES_INDEX_PATH } from "@/lib/resources/paths";
import type { GuideDetail } from "@/lib/resources/guide-content";
import { ArrowLeft, Clock } from "lucide-react";

type GuideDetailContentProps = {
  detail: GuideDetail;
};

export function GuideDetailContent({ detail }: GuideDetailContentProps) {
  const { item, content } = detail;
  const category = GUIDE_CATEGORIES.find((c) => c.slug === item.categorySlug);

  return (
    <div className="relative z-10">
      <div className="border-b-2 border-foreground bg-secondary/15 px-4 py-3 sm:px-6">
        <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-primary">
          {GUIDES_PAGE.detailEyebrow}
        </p>
      </div>
      <ResourcesHubStrip current="guias" />

      <article className="mx-auto w-full max-w-3xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <Link
          href={GUIDES_INDEX_PATH}
          className="mb-6 inline-flex min-h-10 items-center gap-2 font-mono text-xs font-bold uppercase text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Volver a guías
        </Link>

        <header className="mb-8 space-y-4 border-b-2 border-foreground pb-8">
          <div className="flex flex-wrap gap-2">
            {category ? <Badge variant="outline">{category.name}</Badge> : null}
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                #{tag}
              </Badge>
            ))}
          </div>
          <h1 className="font-heading text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl">
            {item.title}
          </h1>
          {item.subtitle ? (
            <p className="text-lg font-semibold text-muted-foreground">
              {item.subtitle}
            </p>
          ) : null}
          {item.readingTimeMinutes ? (
            <p className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase text-muted-foreground">
              <Clock className="size-3.5" />
              {item.readingTimeMinutes} min lectura
            </p>
          ) : null}
        </header>

        <MarkdownContent content={content} className="prose-base" />

        <footer className="mt-10 rounded-2xl border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_var(--foreground)]">
          <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Siguiente paso
          </p>
          <p className="mt-2 text-sm font-medium text-foreground/90">
            Aplicá esta guía en tu próxima postulación y revisá el catálogo de
            cursos para profundizar en propuestas y pricing.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex min-h-10 items-center rounded-lg border-2 border-foreground bg-primary px-4 font-mono text-xs font-black uppercase text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)]"
            >
              Ver cursos
            </Link>
            <Link
              href={guidePath("estructura-propuesta-sin-plantilla")}
              className="inline-flex min-h-10 items-center rounded-lg border-2 border-foreground bg-background px-4 font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_0px_var(--foreground)]"
            >
              Guía de propuestas
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
