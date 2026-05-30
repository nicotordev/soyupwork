import { finalizeCourseCompletion } from "@/lib/course/finalize-course-completion";
import { runCertificateSideEffects } from "@/lib/certificates/run-certificate-side-effects";
import { getServerLogger } from "@/lib/logger/server";
import { revalidatePath } from "next/cache";

const log = getServerLogger("course-progress-update");

export type CourseProgressUpdateResult = {
  courseCompleted: boolean;
  certificateIssued: boolean;
  newlyIssuedCertificate: boolean;
};

export async function handleCourseProgressUpdate(input: {
  userId: string;
  courseId: string;
  courseSlug: string;
}): Promise<CourseProgressUpdateResult> {
  const result: CourseProgressUpdateResult = {
    courseCompleted: false,
    certificateIssued: false,
    newlyIssuedCertificate: false,
  };

  try {
    const finalized = await finalizeCourseCompletion({
      userId: input.userId,
      courseId: input.courseId,
    });

    if (!finalized.completed) {
      return result;
    }

    result.courseCompleted = true;
    result.certificateIssued = finalized.certificateIssued;
    result.newlyIssuedCertificate = finalized.newlyIssuedCertificate;

    const slug = finalized.courseSlug ?? input.courseSlug;

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/certificates");
    revalidatePath("/dashboard/progress");
    revalidatePath(`/courses/${slug}`);
    revalidatePath(`/courses/${slug}/lessons`);

    if (finalized.certificateId) {
      void runCertificateSideEffects({
        certificateId: finalized.certificateId,
        sendEmail: finalized.newlyIssuedCertificate,
      }).catch((error) => {
        log.warn(
          { err: error, certificateId: finalized.certificateId },
          "certificate_side_effects_failed",
        );
      });
    }
  } catch (error) {
    log.error(
      { err: error, userId: input.userId, courseId: input.courseId },
      "finalize_course_completion_failed",
    );
  }

  return result;
}
