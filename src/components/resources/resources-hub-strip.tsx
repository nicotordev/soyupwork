import Link from "next/link";
import { BLOG_INDEX_PATH } from "@/lib/seo/blog-paths";
import { GUIDES_INDEX_PATH, TEMPLATES_INDEX_PATH } from "@/lib/resources/paths";
import { cn } from "@/lib/utils";

const links = [
  { href: GUIDES_INDEX_PATH, label: "Guías", active: "guias" as const },
  {
    href: TEMPLATES_INDEX_PATH,
    label: "Plantillas",
    active: "plantillas" as const,
  },
  { href: BLOG_INDEX_PATH, label: "Blog", active: "blog" as const },
] as const;

type ResourcesHubStripProps = {
  current: (typeof links)[number]["active"];
};

export function ResourcesHubStrip({ current }: ResourcesHubStripProps) {
  return (
    <nav
      aria-label="Recursos relacionados"
      className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pb-6 sm:px-6 lg:px-8"
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={link.active === current ? "page" : undefined}
          className={cn(
            "inline-flex min-h-9 items-center rounded-lg border-2 border-foreground px-4 font-mono text-[10px] font-extrabold uppercase tracking-wider transition-all",
            link.active === current
              ? "bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)]"
              : "bg-card hover:bg-muted shadow-[2px_2px_0px_0px_var(--foreground)]",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
