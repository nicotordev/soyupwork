import { CatalogShell } from "@/components/catalog/catalog-shell";
import { categoryNamesForFilterUi } from "@/lib/catalog/category-map";
import { getCatalogCourses } from "@/lib/catalog/get-catalog-courses";
import { getCatalogFilterOptions } from "@/lib/catalog/get-catalog-filter-options";
import {
  countActiveCatalogFilters,
  parseCatalogSearchParams,
} from "@/lib/catalog/parse-catalog-params";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de Cursos para Freelancers LATAM | soyup.work",
  description:
    "Explora rutas y cursos prácticos en Upwork, redacción de propuestas, fijación de precios, inglés para entrevistas B2B y automatización con IA. Aprende a vender tus servicios al exterior.",
  keywords: [
    "Upwork",
    "Freelance",
    "LATAM",
    "Propuestas",
    "Ventas B2B",
    "Inteligencia Artificial",
    "Remoto",
    "Inglés",
  ],
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const parsed = parseCatalogSearchParams(resolvedParams);
  const [{ courses, featuredCourses }, filterOptions] = await Promise.all([
    getCatalogCourses(parsed),
    getCatalogFilterOptions(),
  ]);

  return (
    <CatalogShell
      filterOptions={filterOptions}
      courses={courses}
      featuredCourses={featuredCourses}
      activeFiltersCount={countActiveCatalogFilters(parsed)}
      searchQuery={parsed.q}
      selectedCategories={categoryNamesForFilterUi(
        parsed.categoryNames,
        parsed.categorySlugs,
      )}
      selectedLevels={parsed.levels}
      selectedDurations={parsed.selectedDurations}
      selectedAccess={parsed.selectedAccess}
      selectedCertificate={parsed.selectedCertificate}
      sortBy={parsed.sortBy}
    />
  );
}
