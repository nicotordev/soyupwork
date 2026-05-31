import Link from "next/link";
import { BLOG_INDEX_EMPTY, BLOG_INDEX_PATH } from "@/constants/blog.constants";
import { FileText, FilterX, Sparkles } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";

type BlogIndexEmptyProps = {
  hasFilters: boolean;
};

export function BlogIndexEmpty({ hasFilters }: BlogIndexEmptyProps) {
  const Icon = hasFilters ? FilterX : FileText;

  return (
    <Empty className="overflow-hidden rounded-2xl border-2 border-foreground bg-card text-center w-full shadow-[4px_4px_0px_0px_var(--foreground)] px-0 py-0">
      <div className="border-b-2 border-foreground bg-secondary/30 px-4 py-3 w-full">
        <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
          {hasFilters ? "Sin coincidencias" : "Blog"}
        </p>
      </div>

      <EmptyContent className="items-center gap-4 px-6 py-10 sm:py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-14 border-2 border-foreground bg-primary/10 shadow-[3px_3px_0px_0px_var(--foreground)] rounded-xl flex items-center justify-center">
            <Icon className="size-7 text-primary" strokeWidth={2.25} />
          </EmptyMedia>
        </EmptyHeader>
        <EmptyTitle className="font-heading text-lg font-black tracking-tight sm:text-xl">
          {hasFilters
            ? BLOG_INDEX_EMPTY.filteredTitle
            : BLOG_INDEX_EMPTY.comingSoonTitle}
        </EmptyTitle>
        <EmptyDescription className="text-sm font-medium leading-relaxed text-muted-foreground">
          {hasFilters
            ? BLOG_INDEX_EMPTY.filteredDescription
            : BLOG_INDEX_EMPTY.comingSoonDescription}
        </EmptyDescription>
        {hasFilters ? (
          <Link
            href={BLOG_INDEX_PATH}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border-2 border-foreground bg-primary px-5 font-mono text-xs font-black uppercase tracking-wider text-primary-foreground shadow-[3px_3px_0px_0px_var(--foreground)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_var(--foreground)]"
          >
            {BLOG_INDEX_EMPTY.filteredCta}
          </Link>
        ) : (
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" aria-hidden />
            Nuevos artículos en camino
          </div>
        )}
      </EmptyContent>
    </Empty>
  );
}
