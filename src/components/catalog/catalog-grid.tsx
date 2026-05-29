"use client";

import { CourseCard } from "@/components/catalog/course-card";
import { CATALOG_PAGE } from "@/constants/catalog.constants";
import type { Course } from "@/types/catalog-course";
import type { CatalogFilterCategory } from "@/types/catalog-filters";
import {
  IconAdjustmentsHorizontal,
  IconBook,
  IconExternalLink,
  IconRotate,
  IconSchool,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface CatalogGridProps {
  courses: Course[];
  activeFiltersCount: number;
  sortBy: string;
  promoCategory: CatalogFilterCategory | null;
  scopedCategoryName?: string | null;
  setIsMobileFiltersOpen: (open: boolean) => void;
}

interface CatalogGridEmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

function CatalogGridEmptyState({
  icon,
  title,
  description,
  action,
}: CatalogGridEmptyStateProps) {
  return (
    <div className="space-y-6 rounded-lg border-4 border-dashed border-foreground/35 bg-card p-12 text-center shadow-[4px_4px_0px_0px_var(--foreground)]">
      <div className="mx-auto flex size-12 items-center justify-center rounded border-2 border-foreground bg-secondary shadow-[2px_2px_0px_0px_var(--foreground)]">
        {icon}
      </div>
      <div className="mx-auto max-w-md space-y-2">
        <h3 className="font-sans text-lg font-bold">{title}</h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function CatalogGrid({
  courses,
  activeFiltersCount,
  sortBy,
  promoCategory,
  scopedCategoryName = null,
  setIsMobileFiltersOpen,
}: CatalogGridProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const hasActiveFilters = activeFiltersCount > 0;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("featured");
    params.set("sort", e.target.value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    router.push(pathname);
  };

  const handlePromoClick = () => {
    if (!promoCategory) return;
    const params = new URLSearchParams();
    params.append("category", promoCategory.slug);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const renderEmptyState = () => {
    if (hasActiveFilters) {
      return (
        <CatalogGridEmptyState
          icon={<IconRotate className="size-6 text-muted-foreground" />}
          title={CATALOG_PAGE.emptyFilteredTitle}
          description={CATALOG_PAGE.emptyFilteredDescription}
          action={
            <Button
              type="button"
              className="font-mono"
              onClick={handleClearFilters}
            >
              {CATALOG_PAGE.emptyFilteredCta}
            </Button>
          }
        />
      );
    }

    if (scopedCategoryName) {
      return (
        <CatalogGridEmptyState
          icon={<IconBook className="size-6 text-primary" />}
          title={CATALOG_PAGE.emptyCategoryTitle(scopedCategoryName)}
          description={CATALOG_PAGE.emptyCategoryDescription}
          action={
            <Button asChild className="font-mono">
              <Link href="/catalog">{CATALOG_PAGE.emptyCategoryCta}</Link>
            </Button>
          }
        />
      );
    }

    return (
      <CatalogGridEmptyState
        icon={<IconSchool className="size-6 text-primary" />}
        title={CATALOG_PAGE.emptyCatalogTitle}
        description={CATALOG_PAGE.emptyCatalogDescription}
        action={
          <Button asChild className="font-mono">
            <Link href="/">{CATALOG_PAGE.emptyCatalogCta}</Link>
          </Button>
        }
      />
    );
  };

  return (
    <section className="lg:col-span-3 space-y-6">
      {/* Controls Bar (Filter toggle for mobile, sort selector, results count) */}
      <div className="flex items-center justify-between border-2 border-foreground bg-secondary/20 p-3 rounded-lg shadow-[2px_2px_0px_0px_var(--foreground)]">
        <div className="flex items-center gap-2">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-foreground bg-card text-xs font-mono font-bold uppercase tracking-wider rounded cursor-pointer shadow-[2px_2px_0px_0px_var(--foreground)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-y-px transition-all"
          >
            <IconAdjustmentsHorizontal className="size-4" />
            Filtrar
            {activeFiltersCount > 0 && (
              <span className="size-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[9px]">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <span className="text-xs font-mono text-muted-foreground">
            Mostrando{" "}
            <strong className="text-foreground">{courses.length}</strong> cursos
          </span>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
            Ordenar:
          </span>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="bg-card border-2 border-foreground px-2 py-1 text-xs font-mono font-bold rounded cursor-pointer outline-none shadow-[1px_1px_0px_0px_var(--foreground)]"
          >
            <option value="popular">Más popular</option>
            <option value="trending">Tendencias</option>
            <option value="rating">Calificación</option>
            <option value="newest">Más reciente</option>
            <option value="featured">Destacados</option>
          </select>
        </div>
      </div>

      {/* Courses Main Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            // Every 4 elements, we display a premium CTA Banner inline inside the grid to feel fully integrated
            const showBannerInline = index === 3;

            return (
              <div key={course.slug} className="contents">
                {showBannerInline && promoCategory && (
                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 border-2 border-foreground bg-linear-to-br from-primary/15 to-primary/5 rounded-xl p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[4px_4px_0px_0px_var(--foreground)] hover:shadow-[6px_6px_0px_0px_var(--foreground)] transition-all duration-200 relative overflow-hidden my-2">
                    {/* Banner Background Cyber Element */}
                    <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 size-36 rounded-full border-4 border-foreground bg-primary/20 pointer-events-none hidden md:block" />

                    <div className="space-y-2 max-w-2xl">
                      <span className="font-mono text-[9px] font-bold bg-primary text-primary-foreground px-2.5 py-1 border-2 border-foreground rounded shadow-[1px_1px_0px_0px_var(--foreground)] uppercase tracking-wider">
                        PROMO DE TEMPORADA
                      </span>
                      <h3 className="font-extrabold text-lg md:text-xl tracking-tight leading-tight">
                        Convierte habilidades en ofertas vendibles
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-xl">
                        Aprende a empaquetar servicios freelance, escribir
                        propuestas cortas de alto impacto y calcular si vale la
                        pena invertir Connects antes de postular a cualquier
                        oferta de Upwork.
                      </p>
                    </div>

                    <div className="shrink-0">
                      <Button
                        type="button"
                        className="w-full font-mono md:w-auto"
                        onClick={handlePromoClick}
                      >
                        Ver {promoCategory.name}{" "}
                        <IconExternalLink className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                )}

                <CourseCard course={course} />
              </div>
            );
          })}
        </div>
      ) : (
        renderEmptyState()
      )}

      {/* Pagination / Load more Simulation */}
      {courses.length > 0 && (
        <div className="pt-6 border-t-2 border-dashed border-foreground/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-mono text-xs text-muted-foreground">
          <span>
            Página 1 de 1 (Mostrando {courses.length} de {courses.length}{" "}
            cursos)
          </span>
          <button
            disabled
            className="w-full sm:w-auto text-center px-4 py-2 border-2 border-foreground bg-muted text-muted-foreground/50 rounded cursor-not-allowed opacity-60 font-bold uppercase tracking-wider"
          >
            Cargar más cursos
          </button>
        </div>
      )}
    </section>
  );
}
