"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { COURSE_PAGE } from "@/constants/course-page.constants";
import { adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type {
  CoursePageMode,
  CoursePageVideoAiInsight,
} from "@/types/course-page.types";
import { IconRobot, IconSparkles } from "@tabler/icons-react";

type CourseLessonVideoAiPanelProps = {
  insight: CoursePageVideoAiInsight | null;
  mode: CoursePageMode;
  className?: string;
  isSheet?: boolean;
};

export function CourseLessonVideoAiPanel({
  insight,
  mode,
  className,
  isSheet = false,
}: CourseLessonVideoAiPanelProps) {
  const isDemo = mode === "publicDemo";

  return (
    <section
      className={cn(
        isSheet 
          ? "h-full flex flex-col bg-background" 
          : cn(adminPanelClass, "overflow-hidden"),
        className
      )}
      aria-labelledby="video-ai-panel-title"
    >
      <header className="flex flex-wrap items-center gap-2 border-b-2 border-foreground px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <IconRobot
            className="size-4 shrink-0 text-primary"
            stroke={2.25}
            aria-hidden
          />
          <h2
            id="video-ai-panel-title"
            className="text-xs font-extrabold uppercase tracking-wide text-foreground"
          >
            {COURSE_PAGE.videoAiPanelTitle}
          </h2>
        </div>
        {isDemo ? (
          <Badge variant="secondary" className="shrink-0">
            Demo
          </Badge>
        ) : null}
      </header>

      <div className={cn("space-y-4 p-4 sm:p-5", isSheet && "flex-1 overflow-y-auto min-h-0")}>
        {insight ? (
          <>
            <p className="text-sm leading-relaxed text-foreground">
              {insight.summary}
            </p>

            {insight.highlights && insight.highlights.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {COURSE_PAGE.videoAiHighlightsTitle}
                </p>
                <ul className="space-y-1.5 text-sm text-foreground">
                  {insight.highlights.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {insight.suggestedPrompts && insight.suggestedPrompts.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {COURSE_PAGE.videoAiSuggestedTitle}
                </p>
                <div className="flex flex-wrap gap-2">
                  {insight.suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      disabled
                      className={cn(
                        "rounded border-2 border-foreground/30 bg-muted/40 px-2.5 py-1 text-left text-xs text-muted-foreground",
                        "cursor-not-allowed opacity-80",
                      )}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {COURSE_PAGE.videoAiPanelEmpty}
          </p>
        )}

        {isDemo ? (
          <p className="flex items-start gap-2 rounded border border-dashed border-foreground/25 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            <IconSparkles
              className="mt-0.5 size-3.5 shrink-0"
              stroke={2}
              aria-hidden
            />
            {COURSE_PAGE.videoAiDemoNotice}
          </p>
        ) : null}

        <div className="space-y-2 border-t-2 border-dashed border-foreground/20 pt-4">
          <Textarea
            disabled
            placeholder={COURSE_PAGE.videoAiAskPlaceholder}
            className="min-h-20 text-sm"
            aria-label={COURSE_PAGE.videoAiAskPlaceholder}
          />
          <div className="flex justify-end">
            <Button type="button" size="sm" disabled>
              {COURSE_PAGE.videoAiAskSoon}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
