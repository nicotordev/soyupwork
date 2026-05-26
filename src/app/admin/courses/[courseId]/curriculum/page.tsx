import { getAdminCourseCurriculum } from "@/app/actions/curriculum.actions";
import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { CourseCurriculumShell } from "@/components/admin/courses/curriculum/course-curriculum-shell";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ courseId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseId } = await params;
  const data = await getAdminCourseCurriculum(courseId);

  return {
    title: data ? `Contenido — ${data.course.title}` : "Contenido del curso",
    description: "Edita módulos, lecciones y vídeos del curso.",
  };
}

export default async function AdminCourseCurriculumPage({ params }: PageProps) {
  const { courseId } = await params;
  const data = await getAdminCourseCurriculum(courseId);

  if (!data) {
    notFound();
  }

  return (
    <AdminDashboardContainer>
      <CourseCurriculumShell data={data} />
    </AdminDashboardContainer>
  );
}
