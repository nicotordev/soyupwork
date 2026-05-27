"use client";

import {
  getAdminCourseForEdit,
  updateCourse,
} from "@/app/actions/courses.actions";
import { CourseThumbnailUploader } from "@/components/admin/courses/course-thumbnail-uploader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ADMIN_COURSES_PAGE,
  ADMIN_COURSES_STATUS_FILTER_OPTIONS,
  ADMIN_COURSE_STATUS_LABELS,
} from "@/constants/courses.constants";
import type { CourseLevel, CourseStatus } from "@/generated/prisma/client";
import {
  adminBrutalButtonClass,
  adminInputClass,
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { toSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import type { AdminCourseCategorySelectOption } from "@/types/admin-course.types";
import {
  IconBooks,
  IconDeviceFloppy,
  IconLink,
  IconLoader,
  IconSchool,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

type CourseEditDialogProps = {
  courseId: string | null;
  onClose: () => void;
};

const STATUS_OPTIONS = ADMIN_COURSES_STATUS_FILTER_OPTIONS.filter(
  (option) => option.value !== "all",
);

export function CourseEditDialog({ courseId, onClose }: CourseEditDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const slugManuallyEdited = useRef(false);

  const [categories, setCategories] = useState<
    AdminCourseCategorySelectOption[]
  >([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<CourseStatus>("DRAFT");
  const [level, setLevel] = useState<CourseLevel>("BEGINNER");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("0");
  const [isFeatured, setIsFeatured] = useState(false);
  const [offersCertificate, setOffersCertificate] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [storageConfigured, setStorageConfigured] = useState(false);
  const [maxThumbnailSizeMb, setMaxThumbnailSizeMb] = useState(10);

  useEffect(() => {
    if (!courseId) return;

    let cancelled = false;
    slugManuallyEdited.current = false;
    setIsLoading(true);

    void getAdminCourseForEdit(courseId).then((result) => {
      if (cancelled) return;
      setIsLoading(false);

      if (!result.ok) {
        toast.error(result.error);
        onClose();
        return;
      }

      const { course } = result;
      setCategories(result.categories);
      setTitle(course.title);
      setSlug(course.slug);
      setDescription(course.description);
      setStatus(course.status);
      setLevel(course.level);
      setCategoryId(course.categoryId ?? "");
      setPrice(String(course.priceCents / 100));
      setIsFeatured(course.isFeatured);
      setOffersCertificate(course.offersCertificate);
      setThumbnailUrl(course.thumbnailUrl);
      setStorageConfigured(result.storageConfigured);
      setMaxThumbnailSizeMb(result.maxThumbnailSizeMb);
    });

    return () => {
      cancelled = true;
    };
    // onClose omitted — stable enough via parent state reset only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleClose = () => {
    onClose();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugManuallyEdited.current) {
      setSlug(toSlug(value));
    }
  };

  const handleSlugChange = (value: string) => {
    slugManuallyEdited.current = true;
    setSlug(toSlug(value));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!courseId) return;

    const priceValue = Number.parseFloat(price);
    if (!Number.isFinite(priceValue) || priceValue < 0) {
      toast.error("Ingresa un precio válido.");
      return;
    }

    startTransition(async () => {
      const result = await updateCourse({
        id: courseId,
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        status,
        level,
        categoryId: categoryId || null,
        priceCents: Math.round(priceValue * 100),
        isFeatured,
        offersCertificate,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(`Curso "${result.course.title}" actualizado`);
      handleClose();
      router.refresh();
    });
  };

  if (!courseId) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={cn(
            adminPanelClass,
            "max-h-[90vh] w-full max-w-lg overflow-hidden border-2 border-foreground bg-background shadow-[8px_8px_0px_0px_var(--foreground)]",
          )}
        >
          <div className={adminPanelHeaderClass}>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded border border-foreground bg-secondary">
                <IconSchool className="size-4 text-primary" stroke={2.5} />
              </span>
              <div>
                <h3 className={adminPanelTitleClass}>Editar curso</h3>
                <p className="text-xs text-muted-foreground">
                  Metadatos, precio y publicación
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="font-mono text-xs font-bold uppercase text-muted-foreground hover:text-foreground"
            >
              [Cerrar]
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <IconLoader
                className="size-8 animate-spin text-primary"
                stroke={2.5}
              />
              <p className="font-mono text-xs font-bold uppercase text-muted-foreground">
                Cargando curso...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="overflow-y-auto">
              <div className="grid max-h-[calc(90vh-10rem)] gap-4 overflow-y-auto p-6 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="editCourseTitle">Título</Label>
                  <Input
                    id="editCourseTitle"
                    value={title}
                    onChange={(event) => handleTitleChange(event.target.value)}
                    className={adminInputClass}
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label
                    htmlFor="editCourseSlug"
                    className="flex items-center gap-1.5"
                  >
                    <IconLink className="size-3.5" stroke={2.25} />
                    Slug
                  </Label>
                  <Input
                    id="editCourseSlug"
                    value={slug}
                    onChange={(event) => handleSlugChange(event.target.value)}
                    className={adminInputClass}
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="editCourseDescription">Descripción</Label>
                  <Textarea
                    id="editCourseDescription"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className={cn(adminInputClass, "min-h-24 resize-y")}
                    rows={4}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label>{ADMIN_COURSES_PAGE.thumbnailLabel}</Label>
                  <CourseThumbnailUploader
                    courseId={courseId}
                    thumbnailUrl={thumbnailUrl}
                    storageConfigured={storageConfigured}
                    maxSizeMb={maxThumbnailSizeMb}
                    onUpdated={() => {
                      router.refresh();
                      void getAdminCourseForEdit(courseId).then((result) => {
                        if (result.ok) {
                          setThumbnailUrl(result.course.thumbnailUrl);
                        }
                      });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editCourseStatus">Estado</Label>
                  <select
                    id="editCourseStatus"
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value as CourseStatus)
                    }
                    className={cn(
                      adminInputClass,
                      "h-9 w-full px-2 text-xs font-mono font-bold uppercase",
                    )}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {
                          ADMIN_COURSE_STATUS_LABELS[
                            option.value as keyof typeof ADMIN_COURSE_STATUS_LABELS
                          ]
                        }
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editCourseLevel">Nivel</Label>
                  <select
                    id="editCourseLevel"
                    value={level}
                    onChange={(event) =>
                      setLevel(event.target.value as CourseLevel)
                    }
                    className={cn(
                      adminInputClass,
                      "h-9 w-full px-2 text-xs font-mono font-bold uppercase",
                    )}
                  >
                    <option value="BEGINNER">Principiante</option>
                    <option value="INTERMEDIATE">Intermedio</option>
                    <option value="ADVANCED">Avanzado</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editCourseCategory">Categoría</Label>
                  <select
                    id="editCourseCategory"
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                    className={cn(
                      adminInputClass,
                      "h-9 w-full px-2 text-xs font-mono font-bold uppercase",
                    )}
                  >
                    <option value="">Sin categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editCoursePrice">Precio (USD)</Label>
                  <Input
                    id="editCoursePrice"
                    type="number"
                    min={0}
                    step="0.01"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    className={adminInputClass}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3 sm:col-span-2">
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <Checkbox
                      checked={isFeatured}
                      onCheckedChange={(checked) =>
                        setIsFeatured(checked === true)
                      }
                    />
                    <span className="text-sm font-medium">Curso destacado</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <Checkbox
                      checked={offersCertificate}
                      onCheckedChange={(checked) =>
                        setOffersCertificate(checked === true)
                      }
                    />
                    <span className="text-sm font-medium">
                      Emite certificado al completar
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-foreground bg-muted/20 px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={adminBrutalButtonClass}
                  asChild
                >
                  <Link
                    href={`/admin/courses/${courseId}/curriculum`}
                    onClick={handleClose}
                  >
                    <IconBooks stroke={2.25} />
                    Módulos y lecciones
                  </Link>
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className={adminBrutalButtonClass}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className={adminBrutalButtonClass}
                  >
                    {isPending ? (
                      <IconLoader className="animate-spin" stroke={2.25} />
                    ) : (
                      <IconDeviceFloppy stroke={2.25} />
                    )}
                    Guardar cambios
                  </Button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
