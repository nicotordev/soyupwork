import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { CategoryCreateForm } from "@/components/admin/categories/category-create-form";
import { AdminDashboardPageHeader } from "@/components/common/admin-dashboard-page-header";
import { Button } from "@/components/ui/button";
import { ADMIN_CATEGORIES_PAGE } from "@/constants/categories.constants";
import type { AdminCategoriesPageData } from "@/types/admin-category.types";
import { IconCategory } from "@tabler/icons-react";
import Link from "next/link";

type CategoriesOverviewProps = {
  data: AdminCategoriesPageData;
};

export function CategoriesOverview({ data }: CategoriesOverviewProps) {
  return (
    <div className="space-y-8">
      <AdminDashboardPageHeader
        eyebrow={ADMIN_CATEGORIES_PAGE.eyebrow}
        icon={<IconCategory className="size-4 text-primary" stroke={2.5} />}
        title={ADMIN_CATEGORIES_PAGE.title}
        description={ADMIN_CATEGORIES_PAGE.description}
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/courses">Volver a cursos</Link>
          </Button>
        }
      />
      <CategoryCreateForm />
      <CategoriesTable categories={data.categories} />
    </div>
  );
}
