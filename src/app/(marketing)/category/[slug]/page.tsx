import { CatalogShell } from "@/components/catalog/catalog-shell";
import {
  getCatalogCategoryBySlug,
  getCatalogPageViewModel,
  getCategoryCanonicalPath,
} from "@/lib/catalog/get-catalog-page-view-model";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCatalogCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Categoría no encontrada | soyup.work",
    };
  }

  const canonical = getCategoryCanonicalPath(category.slug);

  return {
    title: `Cursos de ${category.name} para Freelancers | soyup.work`,
    description: `Explora cursos de ${category.name} para freelancers de LATAM. Rutas prácticas, plantillas y estrategias para vender tus servicios al exterior.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `Cursos de ${category.name} | soyup.work`,
      description: `Catálogo de cursos de ${category.name} para freelancers LATAM.`,
      url: canonical,
    },
  };
}

export default async function CategoryCatalogPage({
  params,
  searchParams,
}: PageProps) {
  const [{ slug }, resolvedParams] = await Promise.all([params, searchParams]);
  const category = await getCatalogCategoryBySlug(slug);

  if (!category) notFound();

  const data = await getCatalogPageViewModel(resolvedParams, {
    fixedCategorySlug: category.slug,
  });

  return (
    <CatalogShell
      {...data}
      pageTitle={`Cursos de ${category.name}`}
      pageDescription={`Rutas y cursos de ${category.name} para freelancers de LATAM.`}
    />
  );
}
