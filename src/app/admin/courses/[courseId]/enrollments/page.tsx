import { getCourseEnrollmentsPageData } from "@/app/actions/enrollments.actions";
import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { CourseEnrollmentsShell } from "@/components/admin/courses/course-enrollments-shell";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ courseId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseId } = await params;
  const data = await getCourseEnrollmentsPageData(courseId);

  return {
    title: data ? `Inscripciones — ${data.course.title}` : "Inscripciones",
  };
}

export default async function AdminCourseEnrollmentsPage({
  params,
}: PageProps) {
  const { courseId } = await params;
  const data = await getCourseEnrollmentsPageData(courseId);

  if (!data) {
    notFound();
  }

  return (
    <AdminDashboardContainer>
      <CourseEnrollmentsShell
        courseId={data.course.id}
        courseTitle={data.course.title}
        courseSlug={data.course.slug}
        enrollments={data.enrollments}
      />
    </AdminDashboardContainer>
  );
}
