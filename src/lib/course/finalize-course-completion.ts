import { EnrollmentStatus, Prisma } from "@/generated/prisma/client";
import {
  buildCertificateCode,
  getCertificateCodeGenerationAttempts,
} from "@/lib/certificates/generate-certificate-code";
import { evaluateCourseCompletion } from "@/lib/course/evaluate-course-completion";
import prisma from "@/lib/db/prisma";

export type FinalizeCourseCompletionResult = {
  completed: boolean;
  enrollmentCompleted: boolean;
  certificateIssued: boolean;
  certificateId?: string;
  certificateCode?: string;
  newlyIssuedCertificate: boolean;
  courseSlug?: string;
};

export async function finalizeCourseCompletion(input: {
  userId: string;
  courseId: string;
}): Promise<FinalizeCourseCompletionResult> {
  const empty: FinalizeCourseCompletionResult = {
    completed: false,
    enrollmentCompleted: false,
    certificateIssued: false,
    newlyIssuedCertificate: false,
  };

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: input.userId,
        courseId: input.courseId,
      },
    },
    select: {
      status: true,
      course: { select: { slug: true } },
    },
  });

  if (
    !enrollment ||
    enrollment.status === EnrollmentStatus.CANCELLED ||
    enrollment.status === EnrollmentStatus.EXPIRED
  ) {
    return empty;
  }

  const evaluation = await evaluateCourseCompletion(
    input.userId,
    input.courseId,
  );

  if (!evaluation?.isComplete) {
    return { ...empty, courseSlug: enrollment.course.slug };
  }

  const now = new Date();
  let certificateId: string | undefined;
  let certificateCode: string | undefined;
  let newlyIssuedCertificate = false;
  let certificateIssued = false;

  await prisma.$transaction(async (tx) => {
    const freshEnrollment = await tx.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: input.userId,
          courseId: input.courseId,
        },
      },
      select: { status: true, completedAt: true },
    });

    if (
      !freshEnrollment ||
      freshEnrollment.status === EnrollmentStatus.CANCELLED ||
      freshEnrollment.status === EnrollmentStatus.EXPIRED
    ) {
      return;
    }

    if (freshEnrollment.status !== EnrollmentStatus.COMPLETED) {
      await tx.enrollment.update({
        where: {
          userId_courseId: {
            userId: input.userId,
            courseId: input.courseId,
          },
        },
        data: {
          status: EnrollmentStatus.COMPLETED,
          completedAt: now,
        },
      });
    } else if (!freshEnrollment.completedAt) {
      await tx.enrollment.update({
        where: {
          userId_courseId: {
            userId: input.userId,
            courseId: input.courseId,
          },
        },
        data: { completedAt: now },
      });
    }

    if (!evaluation.offersCertificate) {
      return;
    }

    const existing = await tx.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: input.userId,
          courseId: input.courseId,
        },
      },
      select: { id: true, code: true },
    });

    if (existing) {
      certificateId = existing.id;
      certificateCode = existing.code;
      certificateIssued = true;
      return;
    }

    const maxAttempts = getCertificateCodeGenerationAttempts();
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const code = buildCertificateCode(now);
      try {
        const created = await tx.certificate.create({
          data: {
            userId: input.userId,
            courseId: input.courseId,
            code,
          },
          select: { id: true, code: true },
        });
        certificateId = created.id;
        certificateCode = created.code;
        certificateIssued = true;
        newlyIssuedCertificate = true;
        return;
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          continue;
        }
        throw error;
      }
    }

    throw new Error("No se pudo generar un código de certificado único.");
  });

  return {
    completed: true,
    enrollmentCompleted: true,
    certificateIssued,
    certificateId,
    certificateCode,
    newlyIssuedCertificate,
    courseSlug: enrollment.course.slug,
  };
}
