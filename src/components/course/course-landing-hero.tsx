import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminBrutalButtonClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { CoursePageView } from "@/types/course-page.types";
import {
  ArrowRight,
  Layers,
  Star,
  TrendingUp,
  Clock,
  Play,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type CourseLandingHeroProps = {
  view: CoursePageView;
  continueHref: string | null;
  ctaLabel: string;
  estimatedHoursLabel: string;
  dynamicFeatureItems: string[];
  averageRating: number | null;
  reviewCount: number;
  enrolledStudentCount: number;
};

export function CourseLandingHero({
  view,
  continueHref,
  ctaLabel,
  estimatedHoursLabel,
  dynamicFeatureItems,
  averageRating,
  reviewCount,
  enrolledStudentCount,
}: CourseLandingHeroProps) {
  return (
    <section className="relative isolate overflow-y-visible rounded-[2rem] border border-foreground/20 p-3 sm:p-8">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-75"
        style={{
          backgroundColor: "hsl(var(--background))",
          backgroundImage: `
            radial-gradient(circle at 12% 18%, rgba(16,185,129,.14), transparent 32%),
            radial-gradient(circle at 86% 16%, rgba(59,130,246,.12), transparent 28%),
            radial-gradient(circle at 74% 84%, rgba(16,185,129,.10), transparent 26%),
            linear-gradient(rgba(15,23,42,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,.08) 1px, transparent 1px)
          `,
          backgroundSize: "auto, auto, auto, 26px 26px, 26px 26px",
        }}
      />
      <div className="absolute inset-x-8 top-0 -z-10 h-20 rounded-full bg-emerald-500/10 blur-2xl" />

      <Card className="mb-12 mt-5 w-full mx-auto max-w-4xl flex flex-col items-center space-y-8 rounded-[1.6rem] border-2 border-foreground bg-card/85 p-5 pb-6 text-center shadow-[8px_8px_0px_0px_var(--foreground)] backdrop-blur-md sm:p-8">
        {/* 1. Category, level & Rating Badge row */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {view.categoryName ? (
            <Badge
              variant="default"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground border-2 border-foreground rounded-full font-mono text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--foreground)]"
            >
              <Layers className="size-3" /> {view.categoryName}
            </Badge>
          ) : null}
          <Badge
            variant="secondary"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-secondary-foreground border-2 border-foreground rounded-full font-mono text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--foreground)]"
          >
            <TrendingUp className="size-3 text-emerald-500" />
            {view.levelLabel}
          </Badge>
          <Badge
            variant="outline"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-card text-foreground border-2 border-foreground rounded-full font-mono text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--foreground)]"
          >
            <Star className="size-3 fill-yellow-400 text-yellow-400" />
            {averageRating
              ? `${averageRating} (${reviewCount} reseñas)`
              : "Sin reseñas"}
          </Badge>
        </div>

        {/* 2. Headline and description */}
        <div className="space-y-4 max-w-3xl">
          <CardHeader className="p-0">
            <CardTitle className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-tight">
              {view.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CardDescription>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg font-medium">
                {view.description ||
                  "Aprende a competir en Upwork con estrategia real: perfil, propuestas, posicionamiento, pricing y sistemas de ejecución."}
              </p>
            </CardDescription>
          </CardContent>
        </div>

        {/* 3. Horizontal Cohesive Action & Investment Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          {/* Investment block tag */}
          <Card className="inline-flex flex-col items-start px-4 py-2 bg-emerald-500/10 border-2 border-foreground rounded-xl shadow-[3px_3px_0px_0px_var(--foreground)] select-none">
            <span className="font-mono text-[8px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-bold">
              Inversión
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 leading-none mt-0.5">
              {view.priceLabel}
            </span>
          </Card>

          {/* Start / Continue Button */}
          {continueHref ? (
            <div className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <Button
                asChild
                className={cn(
                  adminBrutalButtonClass,
                  "h-12 bg-primary px-6 text-xs font-black uppercase tracking-wider text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)] hover:shadow-[3px_3px_0px_0px_var(--foreground)] active:translate-y-[2px] active:shadow-none",
                )}
              >
                <Link href={continueHref} className="flex items-center gap-2">
                  {ctaLabel}
                  <ArrowRight className="size-4 stroke-3" />
                </Link>
              </Button>
            </div>
          ) : null}

          {/* View syllabus button */}
          <div className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <Button
              asChild
              variant="outline"
              className="h-12 px-6 border-2 border-foreground hover:bg-muted text-xs font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_var(--foreground)] hover:shadow-[3px_3px_0px_0px_var(--foreground)] active:translate-y-[2px] active:shadow-none"
            >
              <Link href="#curriculum">Ver temario completo</Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* 5. Neobrutalist Highlights Stats Grid */}
      <div className="absolute translate-y-1/2 bottom-0 left-0 right-0 grid gap-4 w-full grid-cols-2 sm:grid-cols-4 pt-4 max-w-7xl mx-auto">
        {[
          {
            label: "Alumnos",
            value:
              enrolledStudentCount > 0
                ? `${enrolledStudentCount} inscritos`
                : "Sé el primero",
            icon: Users,
          },
          {
            label: "Duración estimada",
            value: estimatedHoursLabel,
            icon: Clock,
          },
          { label: "Dificultad", value: view.levelLabel, icon: TrendingUp },
          {
            label: "Lecciones",
            value: `${view.lessonCount} lecciones`,
            icon: Play,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-2 border-foreground bg-card p-4 rounded-xl shadow-[4px_4px_0px_0px_var(--foreground)] hover:scale-[1.02] transition-all flex flex-col items-center text-center justify-between min-h-[95px] select-none"
            >
              <Icon className="size-4 text-primary stroke-[2.5] mb-2" />
              <div>
                <p className="font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-muted-foreground leading-none">
                  {stat.label}
                </p>
                <p className="text-xs sm:text-sm font-black text-foreground mt-1.5 leading-none">
                  {stat.value}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
