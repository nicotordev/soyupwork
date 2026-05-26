"use client";

import { CourseCreationDialog } from "@/components/admin/courses/course-creation-dialog";
import { AdminDashboardPageHeader } from "@/components/common/admin-dashboard-page-header";
import { Button } from "@/components/ui/button";
import { ADMIN_COURSES_PAGE } from "@/constants/courses.constants";
import { adminBrutalButtonClass } from "@/lib/admin/dashboard-styles";
import { IconPlus, IconSchool } from "@tabler/icons-react";
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
        <Button
          onClick={() => setIsOpen(true)}
          className={adminBrutalButtonClass}
        >
          <IconPlus stroke={2.25} />
          Nuevo curso
        </Button>
      }
    >
      <CourseCreationDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </AdminDashboardPageHeader>
  );
}
