"use client";

import { useState } from "react";
import { COURSES_PAGE } from "@/constants/courses.constants";
import {
  adminBrutalButtonClass,
  adminEyebrowClass,
} from "@/lib/admin/dashboard-styles";
import { IconPlus, IconSchool } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { CourseCreationDialog } from "@/components/admin/courses/course-creation-dialog";

export function CoursesPageHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="mb-8 flex flex-col gap-6 border-b-4 border-foreground pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-4">
        <div className={adminEyebrowClass}>
          <IconSchool className="size-4 text-primary" stroke={2.5} />
          {COURSES_PAGE.eyebrow}
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
            {COURSES_PAGE.title}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            {COURSES_PAGE.description}
          </p>
        </div>
      </div>
      <Button
        onClick={() => setIsOpen(true)}
        className={adminBrutalButtonClass}
      >
        <IconPlus stroke={2.25} />
        Nuevo curso
      </Button>

      <CourseCreationDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}

