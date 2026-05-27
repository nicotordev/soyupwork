"use client";

import { createModule } from "@/app/actions/curriculum.actions";
import { CurriculumModuleCard } from "@/components/admin/courses/curriculum/curriculum-module-card";
import { Button } from "@/components/ui/button";
import { ADMIN_CURRICULUM_PAGE } from "@/constants/curriculum.constants";
import {
  adminBrutalButtonClass,
  adminGridBackgroundClass,
  adminPanelClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { AdminCourseCurriculumData } from "@/types/admin-curriculum.types";
import { IconFolderPlus, IconLoader, IconPlus } from "@tabler/icons-react";
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
      <section className={cn(adminPanelClass, "relative overflow-hidden")}>
        <div className={adminGridBackgroundClass} />
        <div className="relative z-10 flex flex-col items-center gap-5 px-6 py-16 text-center">
          <span className="group flex size-16 items-center justify-center rounded-lg border-2 border-foreground bg-secondary shadow-[4px_4px_0px_0px_var(--foreground)] transition-all duration-300 hover:rotate-6 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--foreground)]">
            <IconFolderPlus className="size-8 text-primary transition-transform duration-300 group-hover:scale-110" stroke={2} />
          </span>
          <div className="max-w-sm space-y-2">
            <h2 className="font-heading text-xl font-extrabold tracking-tight">
              {ADMIN_CURRICULUM_PAGE.emptyModulesTitle}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {ADMIN_CURRICULUM_PAGE.emptyModulesDescription}
            </p>
          </div>
          <Button
            type="button"
            onClick={handleAddModule}
            disabled={isPending}
            className={cn(
              adminBrutalButtonClass,
              "mt-2 inline-flex items-center gap-2 px-5 py-5 font-mono text-xs font-bold uppercase transition-all duration-300 hover:scale-[1.02] active:scale-95"
            )}
          >
            {isPending ? (
              <IconLoader className="size-4 animate-spin" stroke={2.5} />
            ) : (
              <IconPlus className="size-4" stroke={2.5} />
            )}
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
        className={cn(
          adminBrutalButtonClass,
          "w-full py-6 font-mono text-xs font-bold uppercase transition-all duration-300 hover:bg-secondary hover:shadow-[4px_4px_0px_0px_var(--foreground)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0px_0px_var(--foreground)]"
        )}
        onClick={handleAddModule}
      >
        {isPending ? (
          <IconLoader className="size-4 animate-spin" stroke={2.5} />
        ) : (
          <IconPlus className="size-4" stroke={2.5} />
        )}
        {ADMIN_CURRICULUM_PAGE.addModuleLabel}
      </Button>
    </div>
  );
}
