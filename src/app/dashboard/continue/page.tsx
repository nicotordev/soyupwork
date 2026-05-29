import { getStudentDashboardData } from "@/app/actions/student-dashboard.actions";
import { StudentContinueEmpty } from "@/components/dashboard/student-continue-empty";
import { redirect } from "next/navigation";

export default async function StudentContinuePage() {
  const { continueLearning } = await getStudentDashboardData();

  if (continueLearning) {
    redirect(
      `/courses/${continueLearning.courseSlug}/lessons/${continueLearning.lessonSlug}`,
    );
  }

  return <StudentContinueEmpty />;
}
