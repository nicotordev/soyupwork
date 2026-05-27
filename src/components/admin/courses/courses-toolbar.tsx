"use client";

import {
  AdminFilterField,
  adminFilterSelectTriggerClass,
} from "@/components/admin/listing/admin-filter-field";
import { AdminToolbar } from "@/components/admin/listing/admin-toolbar";
import {
  ADMIN_COURSES_FILTER_ALL,
  ADMIN_COURSES_LEVEL_FILTER_OPTIONS,
  ADMIN_COURSES_STATUS_FILTER_OPTIONS,
} from "@/constants/courses.constants";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import type {
  AdminCourseCategoryOption,
  AdminCoursesPagination,
  ParsedAdminCoursesParams,
} from "@/types/admin-course.types";
import type { AdminActiveFilter } from "@/types/admin-listing.types";
import { useMemo } from "react";

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
};

export function CoursesToolbar({
  filters,
  categories,
  pagination,
}: CoursesToolbarProps) {
  const {
    localQuery,
    setLocalQuery,
    viewMode,
    setViewMode,
    setParam,
    clearParams,
    isPending,
  } = useAdminListingParams();

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

  const statusLabel =
    ADMIN_COURSES_STATUS_FILTER_OPTIONS.find((o) => o.value === filters.status)
      ?.label ?? filters.status;

  const levelLabel =
    ADMIN_COURSES_LEVEL_FILTER_OPTIONS.find((o) => o.value === filters.level)
      ?.label ?? filters.level;

  const categoryLabel =
    filters.categorySlug === ADMIN_COURSES_FILTER_ALL
      ? null
      : (categories.find((c) => c.slug === filters.categorySlug)?.name ??
        filters.categorySlug);

  const activeFilterBadges = useMemo((): AdminActiveFilter[] => {
    const badges: AdminActiveFilter[] = [];

    if (filters.status !== ADMIN_COURSES_FILTER_ALL) {
      badges.push({
        key: "status",
        label: "Estado",
        value: statusLabel,
        onRemove: () => setParam("status", null, ADMIN_COURSES_FILTER_ALL),
      });
    }

    if (filters.level !== ADMIN_COURSES_FILTER_ALL) {
      badges.push({
        key: "level",
        label: "Nivel",
        value: levelLabel,
        onRemove: () => setParam("level", null, ADMIN_COURSES_FILTER_ALL),
      });
    }

    if (categoryLabel) {
      badges.push({
        key: "category",
        label: "Categoría",
        value: categoryLabel,
        onRemove: () => setParam("category", null, ADMIN_COURSES_FILTER_ALL),
      });
    }

    return badges;
  }, [
    filters.status,
    filters.level,
    categoryLabel,
    statusLabel,
    levelLabel,
    setParam,
  ]);

  const resultSummary =
    pagination.totalCount === 1
      ? "1 curso encontrado"
      : `${pagination.totalCount} cursos encontrados` +
        (pagination.totalPages > 1
          ? ` · página ${pagination.page} de ${pagination.totalPages}`
          : "");

  return (
    <AdminToolbar
      isPending={isPending}
      search={{
        value: localQuery,
        onChange: setLocalQuery,
        placeholder: "Buscar por título, slug o descripción...",
        ariaLabel: "Buscar cursos",
      }}
      filters={{
        activeCount: activeFiltersCount,
        hasActiveFilters,
        onClear: () => clearParams(["status", "level", "category", "q"]),
        title: "Filtros",
        children: (
          <>
            <AdminFilterField label="Estado">
              <Select
                value={filters.status}
                onValueChange={(value) => setParam("status", value, ADMIN_COURSES_FILTER_ALL)}
              >
                <SelectTrigger className={adminFilterSelectTriggerClass}>
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
            </AdminFilterField>

            <AdminFilterField label="Nivel">
              <Select
                value={filters.level}
                onValueChange={(value) => setParam("level", value, ADMIN_COURSES_FILTER_ALL)}
              >
                <SelectTrigger className={adminFilterSelectTriggerClass}>
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
            </AdminFilterField>

            <AdminFilterField label="Categoría">
              <Select
                value={filters.categorySlug}
                onValueChange={(value) =>
                  setParam("category", value, ADMIN_COURSES_FILTER_ALL)
                }
              >
                <SelectTrigger className={adminFilterSelectTriggerClass}>
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
            </AdminFilterField>
          </>
        ),
      }}
      view={{ mode: viewMode, onChange: setViewMode }}
      activeFilterBadges={activeFilterBadges}
      resultSummary={resultSummary}
    />
  );
}
