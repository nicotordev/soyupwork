"use client";

import {
  ADMIN_COURSES_FILTER_ALL,
  ADMIN_COURSES_LEVEL_FILTER_OPTIONS,
  ADMIN_COURSES_STATUS_FILTER_OPTIONS,
} from "@/constants/courses.constants";
import {
  adminBrutalButtonClass,
  adminInputClass,
  adminPanelClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type {
  AdminCourseCategoryOption,
  AdminCoursesPagination,
  ParsedAdminCoursesParams,
} from "@/types/admin-course.types";
import { IconSearch, IconX, IconTable, IconLayoutGrid, IconFilter, IconChevronDown } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CoursesToolbarProps = {
  filters: ParsedAdminCoursesParams;
  categories: AdminCourseCategoryOption[];
  pagination: AdminCoursesPagination;
  view: "table" | "cards";
  onViewChange: (view: "table" | "cards") => void;
};

const selectTriggerClass = cn(
  adminInputClass,
  "h-9 min-w-[140px] font-mono text-xs font-bold uppercase",
);

export function CoursesToolbar({
  filters,
  categories,
  pagination,
  view,
  onViewChange,
}: CoursesToolbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [localQuery, setLocalQuery] = useState(filters.q);

  useEffect(() => {
    setLocalQuery(filters.q);
  }, [filters.q]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = localQuery.trim();

      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
      params.delete("page");

      const nextQuery = params.toString();
      if (nextQuery === searchParams.toString()) return;

      startTransition(() => {
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
          scroll: false,
        });
      });
    }, 350);

    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- searchParams omitted to avoid loops
  }, [localQuery, pathname, router]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === ADMIN_COURSES_FILTER_ALL) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    startTransition(() => {
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, {
        scroll: false,
      });
    });
  };

  const clearFilters = () => {
    setLocalQuery("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const hasActiveFilters =
    filters.q.length > 0 ||
    filters.status !== ADMIN_COURSES_FILTER_ALL ||
    filters.level !== ADMIN_COURSES_FILTER_ALL ||
    filters.categorySlug !== ADMIN_COURSES_FILTER_ALL;

  const activeFiltersCount = [
    filters.status !== ADMIN_COURSES_FILTER_ALL,
    filters.level !== ADMIN_COURSES_FILTER_ALL,
    filters.categorySlug !== ADMIN_COURSES_FILTER_ALL,
  ].filter(Boolean).length;

  return (
    <section
      className={cn(adminPanelClass, "mb-6 p-4", isPending && "opacity-70")}
      aria-label="Filtros de cursos"
    >
      <div className="flex items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <IconSearch
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            stroke={2.25}
          />
          <Input
            type="search"
            value={localQuery}
            onChange={(event) => setLocalQuery(event.target.value)}
            placeholder="Buscar por título, slug o descripción..."
            className={cn(adminInputClass, "h-9 pl-8 font-mono text-xs")}
            aria-label="Buscar cursos"
          />
          {localQuery ? (
            <button
              type="button"
              onClick={() => setLocalQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Limpiar búsqueda"
            >
              <IconX className="size-4" stroke={2.25} />
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className={cn(adminBrutalButtonClass, "h-9 font-mono text-xs font-bold uppercase hidden sm:flex")}
            >
              Limpiar
            </Button>
          ) : null}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  adminBrutalButtonClass,
                  "h-9 gap-1.5 font-mono text-xs font-bold uppercase shrink-0"
                )}
              >
                <IconFilter className="size-4" stroke={2.25} />
                <span className="hidden sm:inline">Filtros y Vista</span>
                <span className="inline sm:hidden">Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="flex size-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground border border-foreground shadow-[1px_1px_0px_0px_var(--foreground)] ml-0.5">
                    {activeFiltersCount}
                  </span>
                )}
                <IconChevronDown className="size-3.5 text-muted-foreground ml-0.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className={cn(
                adminPanelClass,
                "w-[min(20rem,calc(100vw-2rem))] overflow-hidden border-2 border-foreground bg-background p-4 shadow-[6px_6px_0px_0px_var(--foreground)] flex flex-col gap-4 z-50",
              )}
            >
              <div className="border-b-2 border-foreground pb-2 flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                  Filtros y Vista
                </h3>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="font-mono text-[10px] font-bold uppercase text-primary hover:underline cursor-pointer"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                  Estado
                </label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => updateFilter("status", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClass, "w-full")}>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_COURSES_STATUS_FILTER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Level Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                  Nivel
                </label>
                <Select
                  value={filters.level}
                  onValueChange={(value) => updateFilter("level", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClass, "w-full")}>
                    <SelectValue placeholder="Nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_COURSES_LEVEL_FILTER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                  Categoría
                </label>
                <Select
                  value={filters.categorySlug}
                  onValueChange={(value) => updateFilter("category", value)}
                >
                  <SelectTrigger className={cn(selectTriggerClass, "w-full")}>
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ADMIN_COURSES_FILTER_ALL}>
                      Todas las categorías
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Switcher Toggle inside Popover */}
              <div className="flex flex-col gap-1.5 border-t-2 border-dashed border-foreground/20 pt-3">
                <label className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                  Visualización
                </label>
                <div className="flex border-2 border-foreground rounded bg-card overflow-hidden shadow-[2px_2px_0px_0px_var(--foreground)] h-9 w-full">
                  <button
                    type="button"
                    onClick={() => onViewChange("table")}
                    className={cn(
                      "flex-1 flex items-center justify-center transition-colors border-r-2 border-foreground cursor-pointer text-xs font-mono font-bold uppercase gap-1.5",
                      view === "table"
                        ? "bg-primary text-primary-foreground font-bold"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground",
                    )}
                    aria-label="Ver como tabla"
                  >
                    <IconTable className="size-4" stroke={2.25} />
                    <span>Tabla</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewChange("cards")}
                    className={cn(
                      "flex-1 flex items-center justify-center transition-colors cursor-pointer text-xs font-mono font-bold uppercase gap-1.5",
                      view === "cards"
                        ? "bg-primary text-primary-foreground font-bold"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground",
                    )}
                    aria-label="Ver como tarjetas"
                  >
                    <IconLayoutGrid className="size-4" stroke={2.25} />
                    <span>Tarjetas</span>
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <p className="mt-3 font-mono text-[10px] font-bold uppercase text-muted-foreground">
        {pagination.totalCount === 1
          ? "1 curso encontrado"
          : `${pagination.totalCount} cursos encontrados`}
        {pagination.totalPages > 1
          ? ` · página ${pagination.page} de ${pagination.totalPages}`
          : null}
      </p>
    </section>
  );
}
