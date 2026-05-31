import { getAdminBlogPageData } from "@/app/actions/blog.actions";
import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { BlogOverview } from "@/components/admin/blog/blog-overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Gestiona artículos, categorías y SEO del blog de SoyUpwork.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminBlogPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const data = await getAdminBlogPageData(resolved);

  return (
    <AdminDashboardContainer>
      <BlogOverview data={data} />
    </AdminDashboardContainer>
  );
}
