import { CourseEnrollButton } from "@/components/course/course-enroll-button.client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CoursePageView } from "@/types/course-page.types";
import { Layers, Star, TrendingUp, Clock, Play, Users } from "lucide-react";
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
  isSignedIn?: boolean;
  useCheckoutFlow?: boolean;
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
  isSignedIn = false,
  useCheckoutFlow = false,
}: CourseLandingHeroProps) {
  const stats = [
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
  ];

  return (
    <section className="relative isolate border border-foreground/20 px-3.5 py-6 pb-8 font-sans sm:p-8 sm:pb-10">
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

      <Card className="mb-0 mt-5 w-full mx-auto max-w-4xl flex flex-col items-center space-y-5 sm:space-y-8 rounded-2xl sm:rounded-[1.6rem] border-2 border-foreground bg-card/85 p-4 pb-6 sm:p-8 text-center shadow-[4px_4px_0px_0px_var(--foreground)] sm:shadow-[8px_8px_0px_0px_var(--foreground)] backdrop-blur-md">
        {/* 1. Category, level & Rating Badge row */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {view.categoryName ? (
            <Badge
              variant="default"
              className="h-7 gap-1 sm:gap-1.5 border border-foreground/30 px-2.5 sm:px-3.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
            >
              <Layers className="size-2.5 sm:size-3" /> {view.categoryName}
            </Badge>
          ) : null}
          <Badge
            variant="secondary"
            className="h-7 gap-1 sm:gap-1.5 border border-foreground/30 px-2.5 sm:px-3.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
          >
            <TrendingUp className="size-2.5 sm:size-3 text-emerald-500" />
            {view.levelLabel}
          </Badge>
          <Badge
            variant="outline"
            className="h-7 gap-1 sm:gap-1.5 border border-foreground/30 px-2.5 sm:px-3.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
          >
            <Star className="size-2.5 sm:size-3 fill-yellow-400 text-yellow-400" />
            {averageRating
              ? `${averageRating} (${reviewCount} reseñas)`
              : "Sin reseñas"}
          </Badge>
        </div>

        {/* 2. Headline and description */}
        <div className="space-y-3 sm:space-y-4 max-w-3xl">
          <CardHeader className="p-0">
            <CardTitle className="text-2xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-tight">
              {view.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CardDescription>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg font-medium">
                {view.description ||
                  "Aprende a competir en Upwork con estrategia real: perfil, propuestas, posicionamiento, pricing y sistemas de ejecución."}
              </p>
            </CardDescription>
          </CardContent>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-1 sm:pt-2">
            <Badge className="h-7 sm:h-8 border border-emerald-700/20 bg-emerald-500/15 px-3 sm:px-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Precio
            </Badge>
            <p className="rounded-lg border border-foreground/30 bg-background/85 px-3 py-1 sm:px-4 sm:py-1.5 text-lg sm:text-xl font-black text-emerald-600 shadow-sm dark:text-emerald-400">
              {view.priceLabel}
            </p>
          </div>
        </div>

        {/* 3. Horizontal actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Start / Continue Button */}
          {continueHref || useCheckoutFlow ? (
            <div className="w-full sm:w-auto transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <CourseEnrollButton
                courseSlug={view.slug}
                hasFullAccess={view.hasFullAccess}
                isFree={view.isFree}
                ctaLabel={ctaLabel}
                fallbackHref={continueHref}
                isSignedIn={isSignedIn}
                useCheckoutFlow={useCheckoutFlow}
                size="lg"
                className="w-full sm:w-auto h-10 px-4 sm:h-12 sm:px-6 gap-1.5 sm:gap-2 text-[10px] sm:text-xs"
              />
            </div>
          ) : null}

          {/* View syllabus button */}
          <div className="w-full sm:w-auto transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full hover:bg-muted sm:w-auto h-10 px-4 sm:h-12 sm:px-6 text-[10px] sm:text-xs"
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

      {/* Stats — flujo normal (sin absolute) para no tapar la sección de confianza */}
      <div className="hidden sm:grid mt-6 lg:mt-8 gap-3 sm:gap-4 w-full grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto px-4 pb-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--foreground)] transition-all min-h-[95px] select-none flex flex-col items-center text-center justify-between"
              /* utilizes Card's border/bg/shadow already */
            >
              <CardContent className="flex flex-col items-center justify-center p-0">
                <Icon className="size-4 text-primary stroke-[2.5] mb-2" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground leading-none">
                    {stat.label}
                  </p>
                  <p className="text-xs sm:text-sm font-black text-foreground mt-1.5 leading-none">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>



      {/* 5. Neobrutalist Highlights Stats Unified Panel - MOBILE */}
      <div className="block sm:hidden mt-6 w-full max-w-md mx-auto">
        <div className="border-2 border-foreground bg-card rounded-xl shadow-[4px_4px_0px_0px_var(--foreground)] overflow-hidden">
          <div className="grid grid-cols-2 divide-x-2 divide-y-2 divide-foreground">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 p-3.5 bg-card"
                >
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border-2 border-foreground bg-primary/10 text-primary shadow-[1px_1px_0px_0px_var(--foreground)]">
                    <Icon className="size-3.5 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground leading-none">
                      {stat.label}
                    </p>
                    <p className="text-xs font-black text-foreground mt-1.5 leading-tight truncate">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
