"use client";

import { AdminDashboardPageHeader } from "@/components/common/admin-dashboard-page-header";
import { BlogPostCreateDialog } from "@/components/admin/blog/blog-post-create-dialog";
import { ADMIN_BLOG_PAGE } from "@/constants/blog.constants";
import { Newspaper } from "lucide-react";

export function BlogPageHeader() {
  return (
    <AdminDashboardPageHeader
      eyebrow={ADMIN_BLOG_PAGE.eyebrow}
      icon={<Newspaper className="size-4 text-primary" />}
      title={ADMIN_BLOG_PAGE.title}
      description={ADMIN_BLOG_PAGE.description}
      actions={<BlogPostCreateDialog />}
    />
  );
}
