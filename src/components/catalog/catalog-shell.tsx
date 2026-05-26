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
import { IconArrowRight } from "@tabler/icons-react";
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
    <div className="bg-background text-foreground min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
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
            <h2 className="text-xl font-bold font-sans flex items-center gap-2">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourses.slice(0, 3).map((course) => (
              <CourseCard key={`featured-${course.slug}`} course={course} />
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
            setIsMobileFiltersOpen={setIsMobileFiltersOpen}
          />
        </div>
      </main>

      {/* 4. Marketing Value Proposition Section */}
      <section className="max-w-7xl mx-auto mt-20 border-4 border-foreground bg-secondary/15 rounded-xl p-8 relative overflow-hidden shadow-[6px_6px_0px_0px_var(--foreground)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="font-mono text-[9px] font-bold bg-primary text-primary-foreground px-2.5 py-1 border-2 border-foreground rounded shadow-[1px_1px_0px_0px_var(--foreground)] uppercase tracking-wider">
              ¿Por qué soyup.work?
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans">
              Formación práctica de LATAM para el mundo entero
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              No enseñamos teoría abstracta. Nuestros cursos están construidos
              por profesionales en activo que facturan miles de dólares en
              plataformas internacionales. Te damos plantillas de propuestas
              listas para copiar, guías de cotización por horas y simulación de
              llamadas en inglés.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/precios"
                className="inline-flex justify-center items-center gap-1.5 font-mono text-xs font-bold uppercase border-2 border-foreground bg-foreground text-background px-4 py-2.5 hover:bg-foreground/90 transition-all rounded shadow-[2px_2px_0px_0px_var(--background)] active:translate-y-px"
              >
                Ver planes de membresía <IconArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                title: "Plantillas Listas",
                desc: "Propuestas cortas validadas que reciben respuestas de clientes premium.",
              },
              {
                title: "Mentoría Grupal",
                desc: "Workshops en vivo semanales para revisar tu perfil de Upwork.",
              },
              {
                title: "Enfoque Práctico",
                desc: "Ejercicios reales de pricing y cálculo de rentabilidad de Connects.",
              },
              {
                title: "Comunidad VIP",
                desc: "Foro privado para compartir contratos, resolver dudas y alianzas.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-card border-2 border-foreground p-4 rounded-lg shadow-[2px_2px_0px_0px_var(--foreground)] space-y-1.5"
              >
                <h4 className="font-bold text-xs font-mono uppercase text-primary">
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
    </div>
  );
}
