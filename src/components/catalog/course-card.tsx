import type { Course } from "@/types/catalog-course";
import { IconAward, IconBook, IconClock } from "@tabler/icons-react";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="group flex flex-col bg-card border-2 border-foreground rounded-lg overflow-hidden shadow-[4px_4px_0px_0px_var(--foreground)] hover:shadow-[8px_8px_0px_0px_var(--foreground)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200">
      {/* Top Brand Accent Bar */}
      <div
        className={`h-1.5 w-full border-b-2 border-foreground shrink-0 transition-colors duration-200 ${
          course.isFree ? "bg-emerald-500" : "bg-primary"
        }`}
      />

      {/* Course Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider bg-secondary border border-foreground px-2 py-0.5 rounded">
              {course.category}
            </span>
            <span
              className={`font-mono text-[9px] font-bold px-2 py-0.5 border border-foreground rounded ${
                course.isFree
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {course.priceLabel}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-heading font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug">
              {course.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-semibold">
              {course.description}
            </p>
          </div>
        </div>

        <div>
          {/* Tags list */}
          <div className="flex flex-wrap gap-1 mb-4">
            {course.tags.map((tag) => (
              <span
                key={`tag-${course.slug}-${tag}`}
                className="text-[9px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px border-t border-dashed border-foreground/20 mb-3" />

          {/* Metadata details */}
          <div className="grid grid-cols-3 gap-1 py-1 text-[10px] text-muted-foreground font-mono mb-4">
            <div className="flex items-center gap-1">
              <IconClock className="size-3 text-primary shrink-0" />
              <span className="truncate">{course.duration}</span>
            </div>
            <div className="flex items-center gap-1 justify-center">
              <IconBook className="size-3 text-primary shrink-0" />
              <span>{course.lessonCount} lecc.</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <IconAward
                className={`size-3 shrink-0 ${
                  course.hasCertificate
                    ? "text-primary"
                    : "text-muted-foreground/35"
                }`}
              />
              <span className="truncate">{course.level}</span>
            </div>
          </div>

          {/* Call to Action Button */}
          <Link
            href={`/dashboard/courses/${course.slug}`}
            className="w-full text-center block font-mono text-xs font-bold uppercase tracking-wider border-2 border-foreground bg-card py-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-[2px_2px_0px_0px_var(--foreground)] group-hover:shadow-[4px_4px_0px_0px_var(--foreground)] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 cursor-pointer rounded"
          >
            {course.isFree ? "Empezar gratis" : "Ver curso completo"}
          </Link>
        </div>
      </div>
    </article>
  );
}
