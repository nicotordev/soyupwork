import { Badge } from "@/components/ui/badge";
import { BLOG_INDEX_PAGE } from "@/constants/blog.constants";

export function BlogIndexHero() {
  return (
    <header className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.153_0.006_107.1/8%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.153_0.006_107.1/8%)_1px,transparent_1px)] bg-size-[3rem_3rem] opacity-25" />
      <div className="flex flex-col items-start gap-4 sm:gap-5">
        <Badge
          variant="outline"
          className="border-primary/30 font-mono text-[10px] font-bold uppercase tracking-wider text-primary"
        >
          {BLOG_INDEX_PAGE.eyebrow}
        </Badge>
        <h1 className="font-heading text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
          {BLOG_INDEX_PAGE.title}{" "}
          <span className="text-primary">{BLOG_INDEX_PAGE.titleHighlight}</span>
          {BLOG_INDEX_PAGE.titleTrail}
        </h1>
        <p className="max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground sm:text-base md:text-lg">
          {BLOG_INDEX_PAGE.description}
        </p>
      </div>
    </header>
  );
}
