"use client";

import { CategoryCreationDialog } from "@/components/admin/categories/category-creation-dialog";
import { AdminDashboardPageHeader } from "@/components/common/admin-dashboard-page-header";
import { Button } from "@/components/ui/button";
import { ADMIN_CATEGORIES_PAGE } from "@/constants/categories.constants";
import { adminBrutalButtonClass } from "@/lib/admin/styles";
import { IconCategory, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

export function CategoriesPageHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AdminDashboardPageHeader
      eyebrow={ADMIN_CATEGORIES_PAGE.eyebrow}
      icon={<IconCategory className="size-4 text-primary" stroke={2.5} />}
      title={ADMIN_CATEGORIES_PAGE.title}
      description={ADMIN_CATEGORIES_PAGE.description}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/courses">Volver a cursos</Link>
          </Button>
          <Button
            onClick={() => setIsOpen(true)}
            className={adminBrutalButtonClass}
          >
            <IconPlus stroke={2.25} />
            Nueva categoría
          </Button>
        </div>
      }
    >
      <CategoryCreationDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </AdminDashboardPageHeader>
  );
}
