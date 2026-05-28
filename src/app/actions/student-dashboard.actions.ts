"use server";

import { CourseStatus, EnrollmentStatus } from "@/generated/prisma/client";
import { requireStudent } from "@/lib/auth/student";
import prisma from "@/lib/db/prisma";

export type StudentDashboardData = {
  user: {
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
    email: string | null;
  };
  stats: {
    enrolledCoursesCount: number;
    completedLessonsCount: number;
    certificatesCount: number;
  };
  continueLearning: {
    courseTitle: string;
    courseSlug: string;
    lessonTitle: string;
    lessonSlug: string;
    progressPercent: number;
  } | null;
  enrolledCourses: Array<{
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    level: string;
    totalLessons: number;
    completedLessons: number;
    progressPercent: number;
  }>;
  certificates: Array<{
    id: string;
    code: string;
    issuedAt: string;
    courseTitle: string;
    courseSlug: string;
  }>;
};

export async function getStudentDashboardData(): Promise<StudentDashboardData> {
  const student = await requireStudent();

  // 1. Fetch user profile from database to get latest firstName/lastName/imageUrl
  const dbUser = await prisma.user.findUnique({
    where: { id: student.id },
    select: {
      firstName: true,
      lastName: true,
      imageUrl: true,
      email: true,
    },
  });

  const userData = {
    firstName: dbUser?.firstName ?? null,
    lastName: dbUser?.lastName ?? null,
    imageUrl: dbUser?.imageUrl ?? null,
    email: dbUser?.email ?? student.email ?? null,
  };

  // 2. Fetch all active or completed enrollments with course structure
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: student.id,
      status: {
        in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED],
      },
      course: { status: CourseStatus.PUBLISHED },
    },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { position: "asc" },
            include: {
              lessons: {
                orderBy: { position: "asc" },
              },
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // 3. Fetch completed lessons
  const completedProgressList = await prisma.lessonProgress.findMany({
    where: {
      userId: student.id,
      completed: true,
    },
    select: {
      lessonId: true,
    },
  });

  const completedLessonIds = new Set(
    completedProgressList.map((p) => p.lessonId),
  );

  // 4. Calculate progress for each course
  const enrolledCourses = enrollments.map((enrollment) => {
    const { course } = enrollment;
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const totalLessons = allLessons.length;
    const completedLessons = allLessons.filter((l) =>
      completedLessonIds.has(l.id),
    ).length;

    const progressPercent =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      thumbnailUrl: course.thumbnailUrl,
      level: course.level,
      totalLessons,
      completedLessons,
      progressPercent,
    };
  });

  // 5. Fetch certificates
  const certificatesRaw = await prisma.certificate.findMany({
    where: {
      userId: student.id,
    },
    include: {
      course: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
    orderBy: {
      issuedAt: "desc",
    },
  });

  const certificates = certificatesRaw.map((cert) => ({
    id: cert.id,
    code: cert.code,
    issuedAt: cert.issuedAt.toISOString(),
    courseTitle: cert.course.title,
    courseSlug: cert.course.slug,
  }));

  // 6. Find "Continue learning" course and lesson
  let continueLearning: StudentDashboardData["continueLearning"] = null;

  const enrolledCourseIds = new Set(enrolledCourses.map((course) => course.id));

  const activeEnrollmentFilter = {
    userId: student.id,
    status: {
      in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED],
    },
  };

  // Last accessed lesson, only within current enrollments (published courses)
  const lastProgress = await prisma.lessonProgress.findFirst({
    where: {
      userId: student.id,
      lesson: {
        module: {
          course: {
            status: CourseStatus.PUBLISHED,
            enrollments: { some: activeEnrollmentFilter },
          },
        },
      },
    },
    orderBy: {
      lastSeenAt: "desc",
    },
    include: {
      lesson: {
        include: {
          module: {
            include: {
              course: {
                include: {
                  modules: {
                    orderBy: { position: "asc" },
                    include: {
                      lessons: {
                        orderBy: { position: "asc" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const tryFindNextLesson = (course: any): any | null => {
    const lessons = course.modules.flatMap((m: any) => m.lessons);
    // Find the first lesson that is not completed
    return lessons.find((l: any) => !completedLessonIds.has(l.id)) ?? null;
  };

  if (lastProgress) {
    const currentCourse = lastProgress.lesson.module.course;
    if (enrolledCourseIds.has(currentCourse.id)) {
      const nextPendingLesson = tryFindNextLesson(currentCourse);
      const courseStat = enrolledCourses.find((c) => c.id === currentCourse.id);

      if (nextPendingLesson && courseStat) {
        continueLearning = {
          courseTitle: currentCourse.title,
          courseSlug: currentCourse.slug,
          lessonTitle: nextPendingLesson.title,
          lessonSlug: nextPendingLesson.slug,
          progressPercent: courseStat.progressPercent,
        };
      }
    }
  }

  // If we couldn't find a next lesson in the last accessed course, try other courses
  if (!continueLearning && enrolledCourses.length > 0) {
    for (const enrolled of enrolledCourses) {
      const fullCourse = enrollments.find(
        (e) => e.course.id === enrolled.id,
      )?.course;
      if (fullCourse) {
        const nextPendingLesson = tryFindNextLesson(fullCourse);
        if (nextPendingLesson) {
          continueLearning = {
            courseTitle: fullCourse.title,
            courseSlug: fullCourse.slug,
            lessonTitle: nextPendingLesson.title,
            lessonSlug: nextPendingLesson.slug,
            progressPercent: enrolled.progressPercent,
          };
          break;
        }
      }
    }
  }

  return {
    user: userData,
    stats: {
      enrolledCoursesCount: enrolledCourses.length,
      completedLessonsCount: completedLessonIds.size,
      certificatesCount: certificates.length,
    },
    continueLearning,
    enrolledCourses,
    certificates,
  };
}
