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
} from "@/lib/admin/dashboard-styles";
import { cn } from "@/lib/utils";
import type {
  AdminCourseCategoryOption,
  ParsedAdminCoursesParams,
} from "@/types/admin-course.types";
import { IconSearch, IconX } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  resultCount: number;
};

const selectTriggerClass = cn(
  adminInputClass,
  "h-9 min-w-[140px] font-mono text-xs font-bold uppercase",
);

export function CoursesToolbar({
  filters,
  categories,
  resultCount,
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
    startTransition(() => {
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
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

  return (
    <section
      className={cn(adminPanelClass, "mb-6 p-4", isPending && "opacity-70")}
      aria-label="Filtros de cursos"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.status}
            onValueChange={(value) => updateFilter("status", value)}
          >
            <SelectTrigger className={selectTriggerClass}>
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

          <Select
            value={filters.level}
            onValueChange={(value) => updateFilter("level", value)}
          >
            <SelectTrigger className={selectTriggerClass}>
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

          <Select
            value={filters.categorySlug}
            onValueChange={(value) => updateFilter("category", value)}
          >
            <SelectTrigger className={cn(selectTriggerClass, "min-w-[160px]")}>
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

          {hasActiveFilters ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className={adminBrutalButtonClass}
            >
              Limpiar
            </Button>
          ) : null}
        </div>
      </div>

      <p className="mt-3 font-mono text-[10px] font-bold uppercase text-muted-foreground">
        {resultCount === 1
          ? "1 curso encontrado"
          : `${resultCount} cursos encontrados`}
      </p>
    </section>
  );
}
