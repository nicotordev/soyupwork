import { getAdminCoursesPageData } from "@/app/actions/courses.actions";
import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { CoursesOverview } from "@/components/admin/courses/courses-overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cursos",
  description:
    "Gestiona cursos, módulos y lecciones del catálogo de SoyUpwork.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCoursesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const data = await getAdminCoursesPageData(resolvedSearchParams);

  return (
    <AdminDashboardContainer>
      <CoursesOverview data={data} />
    </AdminDashboardContainer>
  );
}
