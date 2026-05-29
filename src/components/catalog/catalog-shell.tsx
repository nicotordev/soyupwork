"use client";

import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { CatalogGrid } from "@/components/catalog/catalog-grid";
import { CatalogHeader } from "@/components/catalog/catalog-header";
import { CourseCard } from "@/components/catalog/course-card";
import type { CatalogTopicChip } from "@/lib/catalog/categories";
import type { Course } from "@/types/catalog-course";
import type {
  CatalogFilterCategory,
  CatalogFilterOptions,
} from "@/types/catalog-filters";
import { CATALOG_PAGE } from "@/constants/catalog.constants";
import { adminGridBackgroundClass } from "@/lib/admin/styles";
import {
  IconArrowRight,
  IconAdjustmentsHorizontal,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

interface CatalogShellProps {
  filterOptions: CatalogFilterOptions;
  topicChips: CatalogTopicChip[];
  promoCategory: CatalogFilterCategory | null;
  courses: Course[];
  featuredCourses: Course[];
  activeFiltersCount: number;
  searchQuery: string;
  selectedCategorySlugs: string[];
  selectedLevels: string[];
  selectedDurations: string[];
  selectedAccess: string;
  selectedCertificate: string;
  sortBy: string;
  pageTitle?: string;
  pageDescription?: string;
  /** When set, empty grid without extra filters uses category-specific copy. */
  scopedCategoryName?: string | null;
}

export function CatalogShell({
  filterOptions,
  topicChips,
  promoCategory,
  courses,
  featuredCourses,
  activeFiltersCount,
  searchQuery,
  selectedCategorySlugs,
  selectedLevels,
  selectedDurations,
  selectedAccess,
  selectedCertificate,
  sortBy,
  pageTitle,
  pageDescription,
  scopedCategoryName = null,
}: CatalogShellProps) {
  // Mobile filter drawer state
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Derive if we should show the featured list
  const showFeaturedList =
    featuredCourses.length > 0 &&
    !searchQuery &&
    selectedCategorySlugs.length === 0 &&
    selectedLevels.length === 0 &&
    selectedDurations.length === 0 &&
    selectedAccess === "all" &&
    selectedCertificate === "all";

  return (
    <div className="relative bg-background text-foreground min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 pb-20 lg:pb-8">
      {/* Decorative neobrutalist grid background lines, shared with admin */}
      <div aria-hidden className={adminGridBackgroundClass} />

      {/* 1. Header component (handles local state & url push for search input) */}
      <CatalogHeader
        initialSearchQuery={searchQuery}
        topicChips={topicChips}
        pageTitle={pageTitle}
        pageDescription={pageDescription}
      />

      {/* 2. Horizontal Featured Rows */}
      {showFeaturedList && (
        <section className="max-w-7xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-extrabold flex items-center gap-2 tracking-tight text-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded border-2 border-foreground bg-primary text-primary-foreground text-xs font-mono">
                ★
              </span>
              Rutas y Cursos Destacados
            </h2>
            <div className="h-[2px] flex-1 bg-dashed border-t border-foreground/35 mx-4 hidden md:block" />
            <span className="font-mono text-xs text-muted-foreground font-bold hidden sm:inline">
              FREELANCE PRO
            </span>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scroll-smooth snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {featuredCourses.slice(0, 3).map((course) => (
              <div
                key={`featured-${course.slug}`}
                className="min-w-[280px] w-[85%] md:w-auto snap-center shrink-0"
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Main Catalog Layout */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar (desktop) & Slide-over Drawer (mobile) */}
          <CatalogFilters
            filterOptions={filterOptions}
            activeFiltersCount={activeFiltersCount}
            selectedCategorySlugs={selectedCategorySlugs}
            selectedLevels={selectedLevels}
            selectedDurations={selectedDurations}
            selectedAccess={selectedAccess}
            selectedCertificate={selectedCertificate}
            isMobileFiltersOpen={isMobileFiltersOpen}
            setIsMobileFiltersOpen={setIsMobileFiltersOpen}
            filteredCoursesCount={courses.length}
          />

          {/* Catalog Main Course Cards Grid */}
          <CatalogGrid
            courses={courses}
            activeFiltersCount={activeFiltersCount}
            sortBy={sortBy}
            promoCategory={promoCategory}
            scopedCategoryName={scopedCategoryName}
            setIsMobileFiltersOpen={setIsMobileFiltersOpen}
          />
        </div>
      </main>

      {/* 4. Marketing Value Proposition Section */}
      <section className="max-w-7xl mx-auto mt-20 border-4 border-foreground bg-linear-to-br from-secondary/20 to-secondary/5 rounded-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-[6px_6px_0px_0px_var(--foreground)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-5">
            <span className="font-mono text-[9px] font-bold bg-primary text-primary-foreground px-2.5 py-1 border-2 border-foreground rounded shadow-[1px_1px_0px_0px_var(--foreground)] uppercase tracking-wider">
              {CATALOG_PAGE.valueEyebrow}
            </span>
            <h2 className="mt-2 text-2xl md:text-3xl font-heading font-black tracking-tight text-balance text-foreground leading-none">
              {CATALOG_PAGE.valueTitle}
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-semibold">
              {CATALOG_PAGE.valueDescription}
            </p>

            <div className="rounded-lg border-2 border-dashed border-foreground/40 bg-card/80 p-4 space-y-3">
              <p className="font-mono text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                {CATALOG_PAGE.valueNotDoTitle}
              </p>
              <ul className="space-y-2">
                {CATALOG_PAGE.valueNotDoItems.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-[11px] leading-relaxed text-muted-foreground font-medium"
                  >
                    <IconX
                      className="size-3.5 shrink-0 text-destructive mt-0.5"
                      stroke={2.5}
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href={CATALOG_PAGE.valueCtaHref}
                className="inline-flex justify-center items-center gap-1.5 font-mono text-xs font-bold uppercase border-2 border-foreground bg-foreground text-background px-4 py-2.5 hover:bg-foreground/90 transition-all rounded shadow-[2px_2px_0px_0px_var(--background)] active:translate-y-px"
              >
                {CATALOG_PAGE.valueCtaLabel}{" "}
                <IconArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CATALOG_PAGE.valueFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-card border-2 border-foreground p-4 rounded-lg shadow-[2px_2px_0px_0px_var(--foreground)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[3.5px_3.5px_0px_0px_var(--foreground)] transition-all space-y-1.5 select-none"
              >
                <h4 className="font-mono text-xs font-black uppercase text-primary tracking-wider leading-none">
                  {feature.title}
                </h4>
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Mobile Floating Action Button (Sticky bottom-6) */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none w-auto">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 border-2 border-foreground bg-primary text-primary-foreground text-xs font-mono font-black uppercase tracking-wider rounded-full shadow-[4px_4px_0px_0px_var(--foreground)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--foreground)] transition-all cursor-pointer"
        >
          <IconAdjustmentsHorizontal className="size-4 shrink-0" />
          Filtrar cursos
          {activeFiltersCount > 0 && (
            <span className="min-w-5 h-5 px-1 bg-background text-foreground border border-foreground rounded-full flex items-center justify-center text-[10px] font-black">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
