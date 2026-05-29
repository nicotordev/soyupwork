"use client";

import {
  ACCESS_FILTER_OPTIONS,
  CERTIFICATE_FILTER_OPTIONS,
  catalogFilterCheckboxClass,
  catalogFilterClearButtonClass,
  catalogFilterFieldClass,
  catalogFilterFieldGroupClass,
  catalogFilterHeaderClass,
  catalogFilterOptionLabelClass,
  catalogFilterPanelClass,
  catalogFilterRadioClass,
  catalogFilterSectionTitleClass,
  catalogFilterSeparatorClass,
  catalogFilterSheetContentClass,
  catalogFilterTitleClass,
} from "@/components/catalog/catalog-filter-styles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  getCatalogPath,
  getCategoryPath,
  getCategorySlugFromPath,
} from "@/lib/catalog/category-paths";
import type { CatalogFilterOptions } from "@/types/catalog-filters";
import {
  IconAdjustmentsHorizontal,
  IconRotate,
  IconX,
} from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CatalogFiltersProps {
  filterOptions: CatalogFilterOptions;
  activeFiltersCount: number;
  selectedCategorySlugs: string[];
  selectedLevels: string[];
  selectedDurations: string[];
  selectedAccess: string;
  selectedCertificate: string;
  isMobileFiltersOpen: boolean;
  setIsMobileFiltersOpen: (open: boolean) => void;
  filteredCoursesCount: number;
}

interface CatalogFilterPanelProps {
  filterOptions: CatalogFilterOptions;
  activeFiltersCount: number;
  selectedCategorySlugs: string[];
  selectedLevels: string[];
  selectedDurations: string[];
  selectedAccess: string;
  selectedCertificate: string;
  onToggleCheckbox: (key: string, value: string) => void;
  onRadioChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  showMobileClose?: boolean;
  onMobileClose?: () => void;
}

function CatalogFilterPanel({
  filterOptions,
  activeFiltersCount,
  selectedCategorySlugs,
  selectedLevels,
  selectedDurations,
  selectedAccess,
  selectedCertificate,
  onToggleCheckbox,
  onRadioChange,
  onClearFilters,
  showMobileClose,
  onMobileClose,
}: CatalogFilterPanelProps) {
  return (
    <>
      <div className={catalogFilterHeaderClass}>
        <h3 className={catalogFilterTitleClass}>
          <IconAdjustmentsHorizontal className="size-4 text-primary" />
          Filtros
        </h3>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button
              type="button"
              variant="link"
              className={catalogFilterClearButtonClass}
              onClick={onClearFilters}
            >
              <IconRotate className="size-3" />
              Limpiar ({activeFiltersCount})
            </Button>
          )}
          {showMobileClose && onMobileClose && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-7 shrink-0"
              onClick={onMobileClose}
              aria-label="Cerrar filtros"
            >
              <IconX className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <FieldGroup className="gap-2">
        <FieldSet className="gap-1 mt-4">
          <FieldLegend className={catalogFilterSectionTitleClass}>
            Categorías
          </FieldLegend>
          <FieldGroup className={catalogFilterFieldGroupClass}>
            {filterOptions.categories.map((category) => {
              const inputId = `catalog-cat-${category.slug}`;
              return (
                <Field
                  key={category.slug}
                  orientation="horizontal"
                  className={catalogFilterFieldClass}
                >
                  <Checkbox
                    id={inputId}
                    checked={selectedCategorySlugs.includes(category.slug)}
                    onCheckedChange={() =>
                      onToggleCheckbox("category", category.slug)
                    }
                    className={catalogFilterCheckboxClass}
                  />
                  <FieldLabel
                    htmlFor={inputId}
                    className={catalogFilterOptionLabelClass}
                  >
                    {category.name}
                  </FieldLabel>
                </Field>
              );
            })}
          </FieldGroup>
        </FieldSet>

        <Separator className={catalogFilterSeparatorClass} />

        <FieldSet className="mt-4">
          <FieldLegend className={catalogFilterSectionTitleClass}>
            Nivel
          </FieldLegend>
          <FieldGroup className={catalogFilterFieldGroupClass}>
            {filterOptions.levels.map((level) => {
              const inputId = `catalog-lvl-${level.label}`;
              return (
                <Field
                  key={level.label}
                  orientation="horizontal"
                  className={catalogFilterFieldClass}
                >
                  <Checkbox
                    id={inputId}
                    checked={selectedLevels.includes(level.label)}
                    onCheckedChange={() =>
                      onToggleCheckbox("level", level.label)
                    }
                    className={catalogFilterCheckboxClass}
                  />
                  <FieldLabel
                    htmlFor={inputId}
                    className={catalogFilterOptionLabelClass}
                  >
                    {level.label}
                  </FieldLabel>
                </Field>
              );
            })}
          </FieldGroup>
        </FieldSet>

        <Separator className={catalogFilterSeparatorClass} />

        <FieldSet className="mt-4">
          <FieldLegend className={catalogFilterSectionTitleClass}>
            Duración
          </FieldLegend>
          <FieldGroup className={catalogFilterFieldGroupClass}>
            {filterOptions.durations.map((duration) => {
              const inputId = `catalog-dur-${duration.label}`;
              return (
                <Field
                  key={duration.label}
                  orientation="horizontal"
                  className={catalogFilterFieldClass}
                >
                  <Checkbox
                    id={inputId}
                    checked={selectedDurations.includes(duration.label)}
                    onCheckedChange={() =>
                      onToggleCheckbox("duration", duration.label)
                    }
                    className={catalogFilterCheckboxClass}
                  />
                  <FieldLabel
                    htmlFor={inputId}
                    className={catalogFilterOptionLabelClass}
                  >
                    {duration.label}
                  </FieldLabel>
                </Field>
              );
            })}
          </FieldGroup>
        </FieldSet>

        <Separator className={catalogFilterSeparatorClass} />

        <FieldSet className="mt-4">
          <FieldLegend className={catalogFilterSectionTitleClass}>
            Tipo de Acceso
          </FieldLegend>
          <RadioGroup
            value={selectedAccess}
            onValueChange={(value) => onRadioChange("access", value)}
            className={catalogFilterFieldGroupClass}
          >
            {ACCESS_FILTER_OPTIONS.map((item) => {
              const inputId = `catalog-access-${item.value}`;
              return (
                <Field
                  key={item.value}
                  orientation="horizontal"
                  className={catalogFilterFieldClass}
                >
                  <RadioGroupItem
                    id={inputId}
                    value={item.value}
                    className={catalogFilterRadioClass}
                  />
                  <Label
                    htmlFor={inputId}
                    className={catalogFilterOptionLabelClass}
                  >
                    {item.label}
                  </Label>
                </Field>
              );
            })}
          </RadioGroup>
        </FieldSet>

        <Separator className={catalogFilterSeparatorClass} />

        <FieldSet className="mt-4">
          <FieldLegend className={catalogFilterSectionTitleClass}>
            Certificado
          </FieldLegend>
          <RadioGroup
            value={selectedCertificate}
            onValueChange={(value) => onRadioChange("certificate", value)}
            className={catalogFilterFieldGroupClass}
          >
            {CERTIFICATE_FILTER_OPTIONS.map((item) => {
              const inputId = `catalog-cert-${item.value}`;
              return (
                <Field
                  key={item.value}
                  orientation="horizontal"
                  className={catalogFilterFieldClass}
                >
                  <RadioGroupItem
                    id={inputId}
                    value={item.value}
                    className={catalogFilterRadioClass}
                  />
                  <Label
                    htmlFor={inputId}
                    className={catalogFilterOptionLabelClass}
                  >
                    {item.label}
                  </Label>
                </Field>
              );
            })}
          </RadioGroup>
        </FieldSet>
      </FieldGroup>
    </>
  );
}

export function CatalogFilters({
  filterOptions,
  activeFiltersCount,
  selectedCategorySlugs,
  selectedLevels,
  selectedDurations,
  selectedAccess,
  selectedCertificate,
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
  filteredCoursesCount,
}: CatalogFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleToggleCheckbox = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const activeCategorySlug = getCategorySlugFromPath(pathname);
    params.delete("subject");
    params.delete("free");
    params.delete("featured");

    if (key === "category") {
      const isSelected =
        selectedCategorySlugs.includes(value) || activeCategorySlug === value;

      if (activeCategorySlug) {
        if (isSelected) {
          router.replace(getCatalogPath(params), { scroll: false });
          return;
        }

        router.replace(getCategoryPath(value, params), { scroll: false });
        return;
      }

      if (isSelected) {
        const remaining = selectedCategorySlugs.filter(
          (slug) => slug !== value,
        );
        params.delete("category");
        remaining.forEach((slug) => params.append("category", slug));
        router.replace(getCatalogPath(params), { scroll: false });
        return;
      }

      const nextSlugs = [...selectedCategorySlugs, value];
      if (nextSlugs.length === 1) {
        router.replace(getCategoryPath(value, params), { scroll: false });
        return;
      }

      params.delete("category");
      nextSlugs.forEach((slug) => params.append("category", slug));
      router.replace(getCatalogPath(params), { scroll: false });
      return;
    }

    const currentValues = params.getAll(key);

    if (currentValues.includes(value)) {
      const newValues = currentValues.filter((v) => v !== value);
      params.delete(key);
      newValues.forEach((v) => params.append(key, v));
    } else {
      params.append(key, value);
    }

    const nextPath = activeCategorySlug
      ? getCategoryPath(activeCategorySlug, params)
      : getCatalogPath(params);
    router.replace(nextPath, { scroll: false });
  };

  const handleRadioChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("subject");
    params.delete("free");
    params.delete("featured");

    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const activeCategorySlug = getCategorySlugFromPath(pathname);
    const nextPath = activeCategorySlug
      ? getCategoryPath(activeCategorySlug, params)
      : getCatalogPath(params);
    router.replace(nextPath, { scroll: false });
  };

  const handleClearFilters = () => {
    const activeCategorySlug = getCategorySlugFromPath(pathname);
    router.push(
      activeCategorySlug ? getCategoryPath(activeCategorySlug) : "/catalog",
    );
  };

  const panelProps: CatalogFilterPanelProps = {
    filterOptions,
    activeFiltersCount,
    selectedCategorySlugs,
    selectedLevels,
    selectedDurations,
    selectedAccess,
    selectedCertificate,
    onToggleCheckbox: handleToggleCheckbox,
    onRadioChange: handleRadioChange,
    onClearFilters: handleClearFilters,
  };

  return (
    <>
      <Card
        className={`${catalogFilterPanelClass} hidden lg:col-span-1 lg:flex lg:flex-col lg:self-start ring-0`}
      >
        <CardContent className="px-5 pt-0">
          <CatalogFilterPanel {...panelProps} />
        </CardContent>
      </Card>

      <Drawer open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
        <DrawerContent className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col border-t-4 border-x-4 border-foreground bg-background rounded-t-3xl p-5 before:hidden outline-none shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
          <DrawerHeader className="border-b-2 border-foreground pb-3 text-left p-0">
            <DrawerTitle className="font-heading text-base font-black text-foreground flex items-center justify-between w-full">
              <span className="flex items-center gap-2">
                <IconAdjustmentsHorizontal className="size-4 text-primary" />
                Filtros de búsqueda
              </span>
              {activeFiltersCount > 0 && (
                <Button
                  type="button"
                  variant="link"
                  className={catalogFilterClearButtonClass}
                  onClick={() => {
                    handleClearFilters();
                    setIsMobileFiltersOpen(false);
                  }}
                >
                  <IconRotate className="size-3" />
                  Limpiar ({activeFiltersCount})
                </Button>
              )}
            </DrawerTitle>
          </DrawerHeader>

          <div className="py-4 overflow-y-auto flex-1 font-sans">
            <CatalogFilterPanel {...panelProps} showMobileClose={false} />
          </div>

          <DrawerFooter className="gap-2 border-t-2 border-dashed border-foreground/35 p-0 pt-4 flex flex-col mt-auto shrink-0">
            <Button
              type="button"
              className="w-full py-3 font-mono"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              Aplicar filtros ({filteredCoursesCount})
            </Button>
            {activeFiltersCount > 0 && (
              <Button
                type="button"
                variant="outline"
                className="w-full py-3 font-mono text-destructive hover:bg-destructive/5"
                onClick={() => {
                  handleClearFilters();
                  setIsMobileFiltersOpen(false);
                }}
              >
                Limpiar todo
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
