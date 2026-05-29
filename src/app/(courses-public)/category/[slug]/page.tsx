import { CatalogPageSkeleton } from "@/components/catalog/catalog-page-skeleton";
import { CatalogShell } from "@/components/catalog/catalog-shell";
import {
  CATALOG_PAGE,
  buildCategoryMetadata,
} from "@/constants/catalog.constants";
import {
  getCatalogCategoryBySlug,
  getCatalogPageViewModel,
} from "@/lib/catalog/get-catalog-page-view-model";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: Pick<PageProps, "params">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCatalogCategoryBySlug(slug);

  if (!category) {
    return { title: "Categoría no encontrada" };
  }

  return buildCategoryMetadata(category.name, slug);
}

export default async function CategoryCatalogPage({
  params,
  searchParams,
}: PageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const category = await getCatalogCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const viewModel = await getCatalogPageViewModel(resolvedSearchParams, {
    fixedCategorySlug: slug,
  });

  return (
    <Suspense fallback={<CatalogPageSkeleton />}>
      <CatalogShell
        {...viewModel}
        pageTitle={`Cursos de ${category.name}`}
        pageDescription={CATALOG_PAGE.categoryPageDescription(category.name)}
        scopedCategoryName={category.name}
      />
    </Suspense>
  );
}
