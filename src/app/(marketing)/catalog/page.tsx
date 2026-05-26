import { CatalogShell } from "@/components/catalog/catalog-shell";
import { getCatalogPageViewModel } from "@/lib/catalog/get-catalog-page-view-model";
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
  const data = await getCatalogPageViewModel(resolvedParams);

  return <CatalogShell {...data} />;
}
