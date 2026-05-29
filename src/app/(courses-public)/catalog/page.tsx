import { CatalogPageSkeleton } from "@/components/catalog/catalog-page-skeleton";
import { CatalogShell } from "@/components/catalog/catalog-shell";
import { buildCatalogMetadata } from "@/constants/catalog.constants";
import { getCatalogPageViewModel } from "@/lib/catalog/get-catalog-page-view-model";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = buildCatalogMetadata("/catalog");

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const viewModel = await getCatalogPageViewModel(resolvedSearchParams);

  return (
    <Suspense fallback={<CatalogPageSkeleton />}>
      <CatalogShell {...viewModel} />
    </Suspense>
  );
}
