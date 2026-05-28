import { Button } from "@/components/ui/button";
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
    <section className="relative isolate border border-foreground/20 p-3 font-sans sm:p-8">
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
      <div className="absolute inset-x-8 top-0 -z-10 h-20 bg-primary/10 blur-2xl" />

      <Card className="mb-12 mt-5 w-full mx-auto max-w-4xl flex flex-col items-center space-y-8 rounded-[1.6rem] border-2 border-foreground bg-card/85 p-4 pb-5 text-center shadow-[8px_8px_0px_0px_var(--foreground)] backdrop-blur-md sm:p-8">
        {/* 1. Category, level & Rating Badge row */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {view.categoryName ? (
            <Badge
              variant="default"
              className="h-7 gap-1.5 border border-foreground/30 px-3.5 text-[0.65rem] font-semibold uppercase tracking-wide"
            >
              <Layers className="size-3" /> {view.categoryName}
            </Badge>
          ) : null}
          <Badge
            variant="secondary"
            className="h-7 gap-1.5 border border-foreground/30 px-3.5 text-[0.65rem] font-semibold uppercase tracking-wide"
          >
            <TrendingUp className="size-3 text-emerald-500" />
            {view.levelLabel}
          </Badge>
          <Badge
            variant="outline"
            className="h-7 gap-1.5 border border-foreground/30 px-3.5 text-[0.65rem] font-semibold uppercase tracking-wide"
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
            <CardTitle className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-tight">
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
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <Badge className="h-8 border border-emerald-700/20 bg-emerald-500/15 px-4 text-[0.68rem] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Inversion
            </Badge>
            <p className="rounded-lg border border-foreground/30 bg-background/85 px-4 py-1.5 text-xl font-black text-emerald-600 shadow-sm dark:text-emerald-400">
              {view.priceLabel}
            </p>
          </div>
        </div>

        {/* 3. Horizontal actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto">
          {/* Start / Continue Button */}
          {continueHref ? (
            <div className="w-full sm:w-auto transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <Button
                asChild
                className={cn(
                  adminBrutalButtonClass,
                  "h-12 w-full sm:w-auto bg-primary px-6 text-xs font-black uppercase tracking-wider text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)] hover:shadow-[3px_3px_0px_0px_var(--foreground)] active:translate-y-[2px] active:shadow-none",
                )}
              >
                <Link
                  href={continueHref}
                  className="flex items-center justify-center gap-2"
                >
                  {ctaLabel}
                  <ArrowRight className="size-4 stroke-3" />
                </Link>
              </Button>
            </div>
          ) : null}

          {/* View syllabus button */}
          <div className="w-full sm:w-auto transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <Button
              asChild
              variant="outline"
              className="h-12 w-full sm:w-auto px-6 border-2 border-foreground hover:bg-muted text-xs font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_var(--foreground)] hover:shadow-[3px_3px_0px_0px_var(--foreground)] active:translate-y-[2px] active:shadow-none"
            >
              <Link
                href="#curriculum"
                className="flex items-center justify-center"
              >
                Ver temario completo
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* 5. Neobrutalist Highlights Stats Grid */}
      <div className="relative mt-8 lg:absolute lg:translate-y-1/2 lg:bottom-0 lg:left-0 lg:right-0 lg:mt-0 grid gap-4 w-full grid-cols-2 sm:grid-cols-4 pt-4 max-w-7xl mx-auto px-4">
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
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground leading-none">
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
