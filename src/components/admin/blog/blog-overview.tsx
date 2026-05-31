"use client";

import { BlogEmptyState } from "@/components/admin/blog/blog-empty-state";
import { BlogPageHeader } from "@/components/admin/blog/blog-page-header";
import { BlogPaginationBar } from "@/components/admin/blog/blog-pagination";
import { BlogStatsGrid } from "@/components/admin/blog/blog-stats-grid";
import { BlogTable } from "@/components/admin/blog/blog-table";
import { BlogToolbar } from "@/components/admin/blog/blog-toolbar";
import { ADMIN_BLOG_FILTER_ALL } from "@/constants/blog.constants";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import type { AdminBlogPageData } from "@/types/blog.types";

type BlogOverviewProps = {
  data: AdminBlogPageData;
};

export function BlogOverview({ data }: BlogOverviewProps) {
  const { clearParams } = useAdminListingParams();

  const hasFilters =
    data.filters.q.length > 0 ||
    data.filters.status !== ADMIN_BLOG_FILTER_ALL ||
    data.filters.categorySlug !== ADMIN_BLOG_FILTER_ALL;

  return (
    <div className="space-y-0">
      <BlogPageHeader />
      <BlogStatsGrid stats={data.stats} />
      <BlogToolbar
        filters={data.filters}
        pagination={data.pagination}
        categories={data.categories}
      />
      {data.pagination.totalCount === 0 ? (
        <BlogEmptyState
          hasFilters={hasFilters}
          onClearFilters={
            hasFilters
              ? () => clearParams(["q", "status", "categoria", "page"])
              : undefined
          }
        />
      ) : (
        <>
          <BlogTable posts={data.posts} />
          <div className="px-4 sm:px-6">
            <BlogPaginationBar pagination={data.pagination} />
          </div>
        </>
      )}
    </div>
  );
}
