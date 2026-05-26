"use client";

import type { CatalogTopicChip } from "@/lib/catalog/categories";
import { IconSchool, IconSearch, IconX } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CatalogHeaderProps {
  initialSearchQuery: string;
  topicChips: CatalogTopicChip[];
}

export function CatalogHeader({
  initialSearchQuery,
  topicChips,
}: CatalogHeaderProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [localQuery, setLocalQuery] = useState(initialSearchQuery);

  useEffect(() => {
    setLocalQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = localQuery.trim();

      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }

      const nextQuery = params.toString();
      const currentQuery = searchParams.toString();
      if (nextQuery === currentQuery) {
        return;
      }

      const href = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.replace(href, { scroll: false });
    }, 350);

    return () => clearTimeout(delayDebounce);
    // Only re-sync the URL when the user edits the search box — not when searchParams
    // changes from our own router.replace (that caused an infinite RSC refetch loop).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- searchParams intentionally omitted
  }, [localQuery]);

  const handleClear = () => {
    setLocalQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleTopicChipClick = (chip: CatalogTopicChip) => {
    setLocalQuery("");
    const params = new URLSearchParams();
    params.append("category", chip.categorySlug);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <header className="max-w-7xl mx-auto mb-10 text-center md:text-left space-y-6 pt-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-4 border-foreground pb-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary border-2 border-foreground rounded font-mono text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--foreground)]">
            <IconSchool className="size-4 text-primary" stroke={2.5} />
            Catálogo de Cursos
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans leading-none text-balance">
            Explora cursos para vender <br className="hidden md:inline" />
            <span className="bg-primary/20 border-b-4 border-primary px-1">
              mejor tus servicios
            </span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Aprende Upwork, propuestas, pricing, entrevistas, automatización e
            IA con rutas prácticas estructuradas exclusivamente para freelancers
            de LATAM.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center pt-2">
        <div className="lg:col-span-2 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch className="size-4 text-muted-foreground" />
          </span>
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Buscar por tema, habilidad o ruta..."
            className="w-full pl-9 pr-10 py-3 bg-card border-2 border-foreground rounded-lg text-sm shadow-[3px_3px_0px_0px_var(--foreground)] focus:shadow-[5px_5px_0px_0px_var(--foreground)] focus:translate-x-[-2px] focus:translate-y-[-2px] outline-none transition-all placeholder:text-muted-foreground font-mono"
          />
          {localQuery && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <IconX className="size-4" />
            </button>
          )}
        </div>

        {topicChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 justify-center lg:justify-start">
            <span className="text-xs font-mono font-bold uppercase text-muted-foreground mr-1">
              Rutas:
            </span>
            {topicChips.map((chip) => (
              <button
                key={chip.categorySlug}
                type="button"
                onClick={() => handleTopicChipClick(chip)}
                className="font-mono text-[10px] font-bold bg-secondary hover:bg-primary hover:text-primary-foreground border-2 border-foreground px-2 py-0.5 rounded cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-px shadow-[1px_1px_0px_0px_var(--foreground)] hover:shadow-[2px_2px_0px_0px_var(--foreground)]"
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
