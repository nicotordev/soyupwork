"use client";

import type { StudentDashboardData } from "@/app/actions/student-dashboard.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  adminBrutalButtonClass,
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
  adminStatCardClass,
} from "@/lib/admin/styles";
import { DashboardContainer } from "@/components/dashboard/dashboard-container";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import {
  courseLevelLabel,
  isCourseLevelValue,
} from "@/lib/catalog/course-level";
import { cn } from "@/lib/utils";
import {
  IconAward,
  IconBook,
  IconBooks,
  IconCertificate,
  IconChevronRight,
  IconCompass,
  IconMail,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type StudentDashboardOverviewProps = {
  data: StudentDashboardData;
};

export function StudentDashboardOverview({
  data,
}: StudentDashboardOverviewProps) {
  const { user, stats, continueLearning, enrolledCourses, certificates } = data;

  const userDisplayName =
    user.firstName || user.lastName
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : (user.email?.split("@")[0] ?? "Estudiante");

  const statsItems = [
    {
      id: "courses",
      label: "Cursos Inscritos",
      value: String(stats.enrolledCoursesCount),
      helper: "Tus capacitaciones activas",
      icon: IconBooks,
      color: "bg-primary/10",
    },
    {
      id: "lessons",
      label: "Lecciones Completadas",
      value: String(stats.completedLessonsCount),
      helper: "Pasos hacia tu meta",
      icon: IconBook,
      color: "bg-emerald-500/10",
    },
    {
      id: "certificates",
      label: "Certificados Logrados",
      value: String(stats.certificatesCount),
      helper: "Tus logros oficiales",
      icon: IconCertificate,
      color: "bg-amber-500/10",
    },
  ];

  // Container motion variant
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <DashboardContainer>
      <div className="pointer-events-none absolute -left-24 top-24 -z-20 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-72 -z-20 size-96 rounded-full bg-emerald-500/5 blur-3xl" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4 sm:space-y-6 md:space-y-8"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants}>
          <DashboardPageHeader
            eyebrow="Panel de Estudiante"
            icon={<IconBook className="size-4" stroke={2.5} />}
            title={`¡Hola, ${userDisplayName}! 👋`}
            description="Qué gusto tenerte de vuelta en SoyUpwork. Sigue aprendiendo y dominando el mercado freelance."
            actions={
              <div
                className={cn(
                  adminPanelClass,
                  "flex items-center gap-3 bg-card px-4 py-2 shadow-[2px_2px_0px_0px_var(--foreground)] shrink-0"
                )}
              >
                {user.imageUrl ? (
                  <div className="relative size-9 overflow-hidden rounded-full border-2 border-foreground bg-muted">
                    <Image
                      src={user.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex size-9 items-center justify-center rounded-full border-2 border-foreground bg-primary/20 font-mono text-sm font-bold">
                    {userDisplayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <p className="font-mono text-[9px] font-bold uppercase text-muted-foreground">
                    Estudiante
                  </p>
                  <p className="max-w-[150px] truncate text-xs font-bold leading-none">
                    {userDisplayName}
                  </p>
                </div>
              </div>
            }
          />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid gap-3 sm:grid-cols-3"
        >
          {statsItems.map((stat) => {
            const Icon = stat.icon;
            return (
              <article key={stat.id} className={cn(adminStatCardClass, "p-3 sm:p-4")}>
                <div className="flex items-start justify-between gap-2">
                  <p className={adminPanelTitleClass}>{stat.label}</p>
                  <div
                    className={cn(
                      "rounded-md border-2 border-foreground p-1 shadow-[1px_1px_0px_0px_var(--foreground)]",
                      stat.color,
                    )}
                  >
                    <Icon className="size-3.5 sm:size-4" stroke={2.5} />
                  </div>
                </div>
                <p className="mt-2 sm:mt-3 font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-0.5 sm:mt-1 font-mono text-[9px] sm:text-[10px] font-bold uppercase text-muted-foreground">
                  {stat.helper}
                </p>
              </article>
            );
          })}
        </motion.div>

        {/* Main Content Grid: Left side Courses / Progress, Right side Continue Learning / Certificates */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Left Column: Courses list */}
          <motion.div
            variants={itemVariants}
            className="space-y-4 sm:space-y-6 lg:col-span-2"
          >
            <div className={adminPanelClass}>
              <div className={adminPanelHeaderClass}>
                <h3 className="font-heading font-extrabold text-foreground flex items-center gap-2">
                  <IconBooks className="size-5" />
                  Mis Cursos
                </h3>
                <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                  {enrolledCourses.length}{" "}
                  {enrolledCourses.length === 1
                    ? "curso inscrito"
                    : "cursos inscritos"}
                </span>
              </div>
              <div className="p-3.5 sm:p-6">
                {enrolledCourses.length === 0 ? (
                  <div className="border-2 border-dashed border-foreground/30 p-8 text-center rounded-lg bg-muted/10">
                    <p className="text-sm text-muted-foreground mb-4">
                      Aún no estás inscrito en ningún curso. ¡Explora nuestro
                      catálogo para comenzar a aprender!
                    </p>
                    <Button asChild className={adminBrutalButtonClass}>
                      <Link
                        href="/catalog"
                        className="inline-flex items-center gap-2"
                      >
                        <IconCompass className="size-4" stroke={2.5} />
                        Explorar Catálogo
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <ul className="divide-y-2 divide-foreground/10 space-y-3 sm:space-y-4">
                    {enrolledCourses.map((course, index) => (
                      <li
                        key={course.id}
                        className={cn(
                          "pt-3 sm:pt-4 first:pt-0",
                          index > 0 && "border-t-2 border-foreground/10",
                        )}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex gap-3 sm:gap-4 flex-1 min-w-0">
                            <div className="relative size-12 sm:size-16 shrink-0 overflow-hidden rounded border-2 border-foreground bg-muted shadow-[2px_2px_0px_0px_var(--foreground)]">
                              {course.thumbnailUrl ? (
                                <Image
                                  src={course.thumbnailUrl}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                  unoptimized
                                />
                              ) : (
                                <span className="flex size-full items-center justify-center font-mono text-[8px] sm:text-[9px] uppercase text-muted-foreground">
                                  —
                                </span>
                              )}
                            </div>
                            <div className="space-y-1 min-w-0 flex-1">
                              <Link
                                href={`/dashboard/courses/${course.slug}`}
                                className="font-bold text-sm sm:text-base hover:text-primary hover:underline transition-colors block text-left truncate"
                              >
                                {course.title}
                              </Link>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <Badge
                                  variant="outline"
                                  className="font-mono text-[8px] sm:text-[9px] uppercase border-foreground/40 leading-none py-0"
                                >
                                  {isCourseLevelValue(course.level)
                                    ? courseLevelLabel(course.level)
                                    : course.level}
                                </Badge>
                                <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground font-bold">
                                  {course.completedLessons}/
                                  {course.totalLessons} lecc.
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Progress bar & action */}
                          <div className="flex items-center justify-between gap-3 sm:justify-end shrink-0 w-full sm:w-auto">
                            <div className="w-full sm:w-36 space-y-0.5 sm:space-y-1">
                              <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] font-bold">
                                <span>Progreso</span>
                                <span>{course.progressPercent}%</span>
                              </div>
                              <div className="h-2 sm:h-3 w-full border-2 border-foreground rounded bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-primary border-r-2 border-foreground transition-all duration-300"
                                  style={{
                                    width: `${course.progressPercent}%`,
                                  }}
                                />
                              </div>
                            </div>
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className={cn(
                                adminBrutalButtonClass,
                                "bg-background",
                              )}
                            >
                              <Link
                                href={`/dashboard/courses/${course.slug}`}
                                className="inline-flex items-center gap-1 font-mono text-[10px] font-extrabold uppercase"
                              >
                                Entrar
                                <IconChevronRight
                                  className="size-3"
                                  stroke={2.5}
                                />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Continue Learning widget & Certificates */}
          <div className="space-y-6">
            {/* Widget: Continue learning */}
            <motion.div variants={itemVariants}>
              {continueLearning ? (
                <div
                  className={cn(
                    adminPanelClass,
                    "bg-secondary/10 relative overflow-hidden transition-all hover:shadow-[6px_6px_0px_0px_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5",
                  )}
                >
                  {/* Decorative glowing background accent */}
                  <div className="absolute -right-8 -top-8 size-24 rounded-full bg-primary/20 blur-2xl" />

                  <div className={adminPanelHeaderClass}>
                    <h3 className="font-heading font-extrabold text-foreground flex items-center gap-2">
                      <IconPlayerPlay className="size-4" fill="currentColor" />
                      Siguiente Lección
                    </h3>
                    <Badge
                      variant="default"
                      className="font-mono text-[9px] uppercase bg-primary text-primary-foreground border-foreground"
                    >
                      Activo
                    </Badge>
                  </div>
                  <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-4">
                    <div className="space-y-0.5 sm:space-y-1 text-left">
                      <p className="font-mono text-[8px] sm:text-[9px] font-bold uppercase text-muted-foreground truncate">
                        Curso: {continueLearning.courseTitle}
                      </p>
                      <h4 className="font-bold text-sm sm:text-base leading-tight truncate">
                        {continueLearning.lessonTitle}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">
                        Tu progreso global en el curso es del{" "}
                        {continueLearning.progressPercent}%.
                      </p>
                    </div>

                    <Button
                      asChild
                      className={cn(
                        adminBrutalButtonClass,
                        "w-full bg-primary text-primary-foreground font-mono text-[10px] sm:text-xs font-bold uppercase",
                      )}
                    >
                      <Link
                        href={`/dashboard/courses/${continueLearning.courseSlug}/lessons/${continueLearning.lessonSlug}`}
                        className="inline-flex items-center justify-center gap-2"
                      >
                        Continuar Aprendiendo
                        <IconChevronRight className="size-4" stroke={3} />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : enrolledCourses.length > 0 ? (
                <div
                  className={cn(
                    adminPanelClass,
                    "bg-emerald-500/5 p-6 text-center space-y-3",
                  )}
                >
                  <div className="inline-flex items-center justify-center rounded-full border-2 border-foreground bg-emerald-500/10 p-3 shadow-[2px_2px_0px_0px_var(--foreground)]">
                    <IconAward
                      className="size-6 text-emerald-600 animate-bounce"
                      stroke={2.5}
                    />
                  </div>
                  <h4 className="font-heading font-extrabold text-base">
                    ¡Completaste todo! 🎉
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Has completado con éxito todas las lecciones disponibles en
                    tus cursos. ¡Excelente trabajo freelance!
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className={adminBrutalButtonClass}
                  >
                    <Link
                      href="/catalog"
                      className="inline-flex items-center gap-2"
                    >
                      <IconCompass className="size-4" stroke={2.5} />
                      Buscar Nuevos Retos
                    </Link>
                  </Button>
                </div>
              ) : null}
            </motion.div>

            {/* Certificates section */}
            <motion.div variants={itemVariants} className={adminPanelClass}>
              <div className={adminPanelHeaderClass}>
                <h3 className="font-heading font-extrabold text-foreground flex items-center gap-2">
                  <IconAward className="size-5" />
                  Certificados
                </h3>
                <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                  {certificates.length}
                </span>
              </div>
              <div className="p-3.5 sm:p-5">
                {certificates.length === 0 ? (
                  <div className="text-center py-4 sm:py-6 text-muted-foreground space-y-2">
                    <IconCertificate className="size-7 sm:size-8 mx-auto text-muted-foreground/40" />
                    <p className="text-xs">
                      Aún no has completado ningún curso con certificación.
                    </p>
                    <p className="text-[9px] sm:text-[10px] font-mono text-muted-foreground/60 uppercase">
                      Completa el 100% de un curso para desbloquearlo
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2 sm:space-y-3">
                    {certificates.map((cert) => (
                      <li
                        key={cert.id}
                        className="flex items-center justify-between border-2 border-foreground/10 bg-muted/10 p-2.5 sm:p-3 rounded-md hover:bg-muted/30 transition-colors"
                      >
                        <div className="min-w-0 text-left space-y-1">
                          <p className="truncate text-xs font-bold leading-tight">
                            {cert.courseTitle}
                          </p>
                          <p className="font-mono text-[9px] uppercase text-muted-foreground">
                            Código: {cert.code}
                          </p>
                        </div>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className={cn(
                            adminBrutalButtonClass,
                            "bg-background py-0.5 px-2 h-7 shrink-0",
                          )}
                        >
                          <Link
                            href={`/dashboard/courses/${cert.courseSlug}`}
                            className="font-mono text-[9px] font-extrabold uppercase inline-flex items-center gap-0.5"
                          >
                            Ver
                            <IconChevronRight
                              className="size-2.5"
                              stroke={2.5}
                            />
                          </Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>

            {/* Quick Links / Student Support */}
            <motion.div variants={itemVariants} className={adminPanelClass}>
              <div className={adminPanelHeaderClass}>
                <h3 className="font-heading font-extrabold text-foreground flex items-center gap-2">
                  <IconCompass className="size-4" />
                  Accesos Rápidos
                </h3>
              </div>
              <div className="p-3 sm:p-4 grid grid-cols-2 gap-2 sm:gap-3">
                <Link
                  href="/catalog"
                  className={cn(
                    adminPanelClass,
                    "flex flex-col items-center justify-center p-2 sm:p-3 text-center transition-all bg-card hover:bg-secondary/5 hover:translate-x-px hover:translate-y-px shadow-[2px_2px_0px_0px_var(--foreground)] hover:shadow-[1px_1px_0px_0px_var(--foreground)]",
                  )}
                >
                  <IconCompass
                    className="size-4 sm:size-5 mb-1 text-primary"
                    stroke={2.5}
                  />
                  <span className="font-bold text-[10px] sm:text-[11px] leading-tight">
                    Ver Catálogo
                  </span>
                </Link>
                <a
                  href={`mailto:${user.email ?? "soporte@soyup.work"}`}
                  className={cn(
                    adminPanelClass,
                    "flex flex-col items-center justify-center p-2 sm:p-3 text-center transition-all bg-card hover:bg-secondary/5 hover:translate-x-px hover:translate-y-px shadow-[2px_2px_0px_0px_var(--foreground)] hover:shadow-[1px_1px_0px_0px_var(--foreground)]",
                  )}
                >
                  <IconMail
                    className="size-4 sm:size-5 mb-1 text-emerald-500"
                    stroke={2.5}
                  />
                  <span className="font-bold text-[10px] sm:text-[11px] leading-tight">
                    Soporte técnico
                  </span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardContainer>
  );
}
