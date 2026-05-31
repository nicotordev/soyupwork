import Link from "next/link";
import { ResourcesHubStrip } from "@/components/resources/resources-hub-strip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TEMPLATES_PAGE } from "@/constants/templates.constants";
import { TEMPLATE_CATEGORIES } from "@/constants/templates.constants";
import { TEMPLATES_INDEX_PATH } from "@/lib/resources/paths";
import type { TemplateDetail } from "@/lib/resources/template-content";
import { ArrowLeft, Download, Lock } from "lucide-react";

type TemplateDetailContentProps = {
  detail: TemplateDetail;
};

export function TemplateDetailContent({ detail }: TemplateDetailContentProps) {
  const { item, sections, includes } = detail;
  const category = TEMPLATE_CATEGORIES.find(
    (c) => c.slug === item.categorySlug,
  );

  const canDownload = item.availability === "available";

  return (
    <div className="relative z-10">
      <div className="border-b-2 border-foreground bg-secondary/15 px-4 py-3 sm:px-6">
        <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-primary">
          {TEMPLATES_PAGE.detailEyebrow}
        </p>
      </div>
      <ResourcesHubStrip current="plantillas" />

      <article className="mx-auto w-full max-w-3xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <Link
          href={TEMPLATES_INDEX_PATH}
          className="mb-6 inline-flex min-h-10 items-center gap-2 font-mono text-xs font-bold uppercase text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Volver a plantillas
        </Link>

        <header className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            {category ? (
              <Badge variant="outline">{category.name}</Badge>
            ) : null}
            {item.fileLabel ? (
              <Badge variant="secondary">{item.fileLabel}</Badge>
            ) : null}
          </div>
          <h1 className="font-heading text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl">
            {item.title}
          </h1>
          {item.subtitle ? (
            <p className="text-lg font-semibold text-muted-foreground">
              {item.subtitle}
            </p>
          ) : null}
          <p className="text-sm leading-relaxed text-foreground/90">
            {item.excerpt}
          </p>
        </header>

        <div className="space-y-4">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border-2 border-foreground bg-card p-4 shadow-[3px_3px_0px_0px_var(--foreground)] sm:p-5"
            >
              <h2 className="font-mono text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-sm font-medium leading-relaxed text-foreground/90">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <aside className="mt-8 rounded-2xl border-2 border-foreground bg-muted/30 p-5 shadow-[4px_4px_0px_0px_var(--foreground)]">
          <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Incluye
          </p>
          <ul className="mt-3 space-y-2">
            {includes.map((line) => (
              <li
                key={line}
                className="flex items-start gap-2 text-sm font-medium text-foreground/90"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            {canDownload ? (
              <Button asChild>
                <Link href="/sign-up">
                  <Download className="size-4" />
                  Crear cuenta para descargar
                </Link>
              </Button>
            ) : item.availability === "course" && item.relatedHref ? (
              <Button asChild>
                <Link href={item.relatedHref}>
                  <Lock className="size-4" />
                  {item.relatedLabel ?? "Ver en catálogo"}
                </Link>
              </Button>
            ) : (
              <p className="text-sm font-semibold text-muted-foreground">
                Disponible próximamente — unite a la lista o revisá el blog
                mientras tanto.
              </p>
            )}
            <Button asChild variant="outline">
              <Link href="/resources/blog">Ir al blog</Link>
            </Button>
          </div>
        </aside>
      </article>
    </div>
  );
}
