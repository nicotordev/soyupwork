import { getAdminBlogCategories } from "@/app/actions/blog.actions";
import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { BlogPostEditForm } from "@/components/admin/blog/blog-post-edit-form";
import { ADMIN_BLOG_PAGE } from "@/constants/blog.constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: ADMIN_BLOG_PAGE.editLabel,
};

type PageProps = {
  params: Promise<{ postId: string }>;
};

export default async function AdminBlogEditPage({ params }: PageProps) {
  const { postId } = await params;
  const categories = await getAdminBlogCategories();

  return (
    <AdminDashboardContainer>
      <BlogPostEditForm postId={postId} categories={categories} />
    </AdminDashboardContainer>
  );
}
