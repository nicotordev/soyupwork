"use client";

import { CourseCreationDialog } from "@/components/admin/courses/course-creation-dialog";
import { AdminDashboardPageHeader } from "@/components/common/admin-dashboard-page-header";
import { Button } from "@/components/ui/button";
import { ADMIN_COURSES_PAGE } from "@/constants/courses.constants";
import { adminBrutalButtonClass } from "@/lib/admin/styles";
import { IconPlus, IconSchool } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

export function CoursesPageHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AdminDashboardPageHeader
      eyebrow={ADMIN_COURSES_PAGE.eyebrow}
      icon={<IconSchool className="size-4 text-primary" stroke={2.5} />}
      title={ADMIN_COURSES_PAGE.title}
      description={ADMIN_COURSES_PAGE.description}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/categories">Categorías</Link>
          </Button>
          <Button
            onClick={() => setIsOpen(true)}
            className={adminBrutalButtonClass}
          >
            <IconPlus stroke={2.25} />
            Nuevo curso
          </Button>
        </div>
      }
    >
      <CourseCreationDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </AdminDashboardPageHeader>
  );
}
