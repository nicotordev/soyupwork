"use client";

import { createModule } from "@/app/actions/curriculum.actions";
import { CurriculumModuleCard } from "@/components/admin/courses/curriculum/curriculum-module-card";
import { Button } from "@/components/ui/button";
import { ADMIN_CURRICULUM_PAGE } from "@/constants/curriculum.constants";
import { adminBrutalButtonClass, adminPanelClass } from "@/lib/admin/styles";
import type { AdminCourseCurriculumData } from "@/types/admin-curriculum.types";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type CurriculumModulesListProps = {
  data: AdminCourseCurriculumData;
};

export function CurriculumModulesList({ data }: CurriculumModulesListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

  const handleAddModule = () => {
    startTransition(async () => {
      const result = await createModule({
        courseId: data.course.id,
        title: `Módulo ${data.modules.length + 1}`,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Módulo creado");
      router.refresh();
    });
  };

  if (data.modules.length === 0) {
    return (
      <section className={adminPanelClass}>
        <div className="flex flex-col items-center gap-4 p-10 text-center">
          <h2 className="font-heading text-lg font-extrabold">
            {ADMIN_CURRICULUM_PAGE.emptyModulesTitle}
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            {ADMIN_CURRICULUM_PAGE.emptyModulesDescription}
          </p>
          <Button
            type="button"
            onClick={handleAddModule}
            disabled={isPending}
            className={adminBrutalButtonClass}
          >
            <IconPlus stroke={2.25} />
            {ADMIN_CURRICULUM_PAGE.addModuleLabel}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {data.modules.map((module, index) => (
        <CurriculumModuleCard
          key={module.id}
          module={module}
          moduleIndex={index}
          moduleCount={data.modules.length}
          courseId={data.course.id}
          expandedLessonId={expandedLessonId}
          maxVideoSizeMb={data.maxVideoSizeMb}
          muxConfigured={data.muxConfigured}
          muxStreamingEnabled={data.muxStreamingEnabled}
          onExpandLesson={setExpandedLessonId}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        className={adminBrutalButtonClass}
        onClick={handleAddModule}
      >
        <IconPlus stroke={2.25} />
        {ADMIN_CURRICULUM_PAGE.addModuleLabel}
      </Button>
    </div>
  );
}
