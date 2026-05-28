import { cn } from "@/lib/utils";
import type { CoursePageReview } from "@/types/course-page.types";
import { Star } from "lucide-react";

type CourseLandingReviewsProps = {
  reviews: CoursePageReview[];
};

export function CourseLandingReviews({ reviews }: CourseLandingReviewsProps) {
  return (
    <section className="space-y-5 font-sans">
      <h2 className="text-2xl font-black sm:text-3xl">
        Resultados de freelancers reales
      </h2>
      {reviews.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-foreground/10 bg-card p-4"
            >
              <div className="mb-2 flex items-center gap-1 text-yellow-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={`${review.id}-${index}`}
                    className={cn(
                      "size-4",
                      index < review.rating ? "fill-current" : "text-muted",
                    )}
                  />
                ))}
              </div>
              {review.headline ? (
                <p className="text-sm font-semibold">{review.headline}</p>
              ) : null}
              {review.comment ? (
                <p className="mt-2 text-sm">“{review.comment}”</p>
              ) : null}
              <p className="mt-3 text-xs text-muted-foreground">
                {review.displayName || "Estudiante"}{" "}
                {review.niche ? `· ${review.niche}` : ""}{" "}
                {review.countryCode ? `· ${review.countryCode}` : ""}
              </p>
              {review.metricBefore || review.metricAfter ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {review.metricBefore || "Antes sin dato"} →{" "}
                  {review.metricAfter || "Después sin dato"}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-foreground/20 bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Todavía no hay reseñas publicadas para este curso.
          </p>
        </div>
      )}
    </section>
  );
}
