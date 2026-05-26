import { getAdminCategoriesPageData } from "@/app/actions/categories.actions";
import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { CategoriesOverview } from "@/components/admin/categories/categories-overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorías",
  description: "Crea y gestiona categorías del catálogo de cursos.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const data = await getAdminCategoriesPageData(resolvedSearchParams);

  return (
    <AdminDashboardContainer>
      <CategoriesOverview data={data} />
    </AdminDashboardContainer>
  );
}
