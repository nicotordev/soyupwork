export interface Course {
  title: string;
  slug: string;
  description: string;
  category: string;
  categorySlug: string;
  level: "Principiante" | "Intermedio" | "Avanzado";
  duration: string;
  durationHours: number;
  lessonCount: number;
  priceLabel: string;
  isFree: boolean;
  isFeatured: boolean;
  tags: string[];
  instructorName: string;
  rating: number;
  enrollmentCount: number;
  hasCertificate: boolean;
}
