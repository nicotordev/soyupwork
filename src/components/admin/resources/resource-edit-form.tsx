"use client";

import {
  getAdminResourceCategories,
  getAdminResourceForEdit,
  updateResource,
} from "@/app/actions/resources.actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ADMIN_RESOURCES_AVAILABILITY_OPTIONS,
  ADMIN_RESOURCES_PAGE,
  ADMIN_RESOURCES_STATUS_FILTER_OPTIONS,
  RESOURCE_AVAILABILITY,
  RESOURCE_AVAILABILITY_LABELS,
  RESOURCE_KIND,
  RESOURCE_STATUS,
  resourceKindValueToAdminParam,
} from "@/constants/resources-admin.constants";
import type {
  ResourceAvailabilityValue,
  ResourceKindValue,
  ResourceStatusValue,
} from "@/constants/resources-admin.constants";
import {
  adminInputClass,
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { guidePath, templatePath } from "@/lib/resources/paths";
import { toSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import type { AdminResourceCategoryOption } from "@/types/resources-admin.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "@/lib/toast";
import { IconDeviceFloppy, IconExternalLink } from "@tabler/icons-react";

const STATUS_OPTIONS = ADMIN_RESOURCES_STATUS_FILTER_OPTIONS.filter(
  (o) => o.value !== "all",
);

const AVAILABILITY_OPTIONS = ADMIN_RESOURCES_AVAILABILITY_OPTIONS;

type ResourceEditFormProps = {
  resourceId: string;
};

export function ResourceEditForm({ resourceId }: ResourceEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const slugManual = useRef(false);

  const [kind, setKind] = useState<ResourceKindValue>(RESOURCE_KIND.GUIDE);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState<ResourceStatusValue>(
    RESOURCE_STATUS.DRAFT,
  );
  const [availability, setAvailability] = useState<ResourceAvailabilityValue>(
    RESOURCE_AVAILABILITY.AVAILABLE,
  );
  const [isFeatured, setIsFeatured] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [readingTimeMinutes, setReadingTimeMinutes] = useState("");
  const [fileLabel, setFileLabel] = useState("");
  const [relatedHref, setRelatedHref] = useState("");
  const [relatedLabel, setRelatedLabel] = useState("");
  const [tagSlugs, setTagSlugs] = useState("");
  const [content, setContent] = useState("");
  const [templateSectionsJson, setTemplateSectionsJson] = useState("[]");
  const [templateIncludes, setTemplateIncludes] = useState("");
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [publishedKind, setPublishedKind] = useState<ResourceKindValue>(
    RESOURCE_KIND.GUIDE,
  );
  const [categories, setCategories] = useState<AdminResourceCategoryOption[]>(
    [],
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    slugManual.current = false;

    void getAdminResourceForEdit(resourceId).then((result) => {
      if (cancelled) return;
      setIsLoading(false);
      if (!result.ok) {
        toast.error(result.error);
        router.push("/admin/resources");
        return;
      }

      const resource = result.resource;
      setKind(resource.kind);
      setTitle(resource.title);
      setSlug(resource.slug);
      setSubtitle(resource.subtitle ?? "");
      setExcerpt(resource.excerpt);
      setStatus(resource.status);
      setAvailability(resource.availability);
      setIsFeatured(resource.featured);
      setCategoryId(resource.categoryId ?? "");
      setReadingTimeMinutes(resource.readingTimeMinutes?.toString() ?? "");
      setFileLabel(resource.fileLabel ?? "");
      setRelatedHref(resource.relatedHref ?? "");
      setRelatedLabel(resource.relatedLabel ?? "");
      setTagSlugs(resource.tagSlugs.join(", "));
      setContent(resource.content ?? "");
      setTemplateSectionsJson(
        JSON.stringify(resource.templateSections, null, 2),
      );
      setTemplateIncludes(resource.templateIncludes.join("\n"));
      if (resource.status === RESOURCE_STATUS.PUBLISHED) {
        setPublishedSlug(resource.slug);
        setPublishedKind(resource.kind);
      }

      void getAdminResourceCategories(
        resourceKindValueToAdminParam(resource.kind),
      ).then((nextCategories) => {
        if (!cancelled) setCategories(nextCategories);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [resourceId, router]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugManual.current) {
      setSlug(toSlug(value));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    let templateSections: { title: string; body: string }[] = [];
    if (kind === RESOURCE_KIND.TEMPLATE) {
      try {
        const parsed = JSON.parse(templateSectionsJson) as unknown;
        if (!Array.isArray(parsed)) {
          toast.error("Las secciones deben ser un array JSON.");
          return;
        }
        templateSections = parsed as { title: string; body: string }[];
      } catch {
        toast.error("JSON de secciones inválido.");
        return;
      }
    }

    startTransition(async () => {
      const result = await updateResource({
        resourceId,
        title,
        slug,
        subtitle: subtitle || null,
        excerpt,
        kind,
        availability,
        status,
        readingTimeMinutes: readingTimeMinutes
          ? Number(readingTimeMinutes)
          : null,
        fileLabel: fileLabel || null,
        featured: isFeatured,
        categoryId: categoryId || null,
        relatedHref: relatedHref || null,
        relatedLabel: relatedLabel || null,
        content: kind === RESOURCE_KIND.GUIDE ? content : null,
        templateSections,
        templateIncludes: templateIncludes
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        tagSlugs: tagSlugs
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Recurso guardado");
      router.refresh();
      if (status === RESOURCE_STATUS.PUBLISHED) {
        setPublishedSlug(slug);
        setPublishedKind(kind);
      }
    });
  };

  const publicHref =
    publishedSlug && status === RESOURCE_STATUS.PUBLISHED
      ? publishedKind === RESOURCE_KIND.GUIDE
        ? guidePath(publishedSlug)
        : templatePath(publishedSlug)
      : null;

  const pageLabel =
    kind === RESOURCE_KIND.GUIDE
      ? ADMIN_RESOURCES_PAGE.editGuideLabel
      : ADMIN_RESOURCES_PAGE.editTemplateLabel;

  // For SelectItem value of "no-category", used to represent no category.
  const NO_CATEGORY_VALUE = "__no_category__";

  if (isLoading) {
    return (
      <p className="p-6 font-mono text-xs text-muted-foreground">Cargando…</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/resources">← Volver al listado</Link>
        </Button>
        {publicHref ? (
          <Button type="button" variant="outline" asChild>
            <Link href={publicHref} target="_blank">
              Ver publicado
              <IconExternalLink className="size-4" />
            </Link>
          </Button>
        ) : null}
      </div>

      <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
        {pageLabel}
      </p>

      <section className={adminPanelClass}>
        <div className={adminPanelHeaderClass}>
          <h2 className={adminPanelTitleClass}>Metadatos</h2>
        </div>
        <div className="space-y-4 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="resource-title">Título</Label>
              <Input
                id="resource-title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={adminInputClass}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resource-slug">Slug</Label>
              <Input
                id="resource-slug"
                value={slug}
                onChange={(e) => {
                  slugManual.current = true;
                  setSlug(toSlug(e.target.value));
                }}
                className={adminInputClass}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resource-status">Estado</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as ResourceStatusValue)
                }
              >
                <SelectTrigger
                  id="resource-status"
                  className={cn(adminInputClass, "h-9 w-full")}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="resource-availability">Disponibilidad</Label>
              <Select
                value={availability}
                onValueChange={(value) =>
                  setAvailability(value as ResourceAvailabilityValue)
                }
              >
                <SelectTrigger
                  id="resource-availability"
                  className={cn(adminInputClass, "h-9 w-full")}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABILITY_OPTIONS.map((value) => (
                    <SelectItem key={value} value={value}>
                      {RESOURCE_AVAILABILITY_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="resource-category">Categoría</Label>
              <Select
                // Use placeholder clearing behavior by interpreting NO_CATEGORY_VALUE as ""
                value={categoryId === "" ? NO_CATEGORY_VALUE : categoryId}
                onValueChange={(v) => setCategoryId(v === NO_CATEGORY_VALUE ? "" : v)}
              >
                <SelectTrigger
                  id="resource-category"
                  className={cn(adminInputClass, "h-9 w-full")}
                >
                  <SelectValue placeholder="Sin categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CATEGORY_VALUE}>Sin categoría</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="resource-subtitle">Subtítulo</Label>
              <Input
                id="resource-subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className={adminInputClass}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="resource-excerpt">Extracto</Label>
              <Textarea
                id="resource-excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className={adminInputClass}
                required
              />
            </div>
            {kind === RESOURCE_KIND.GUIDE ? (
              <div className="space-y-2">
                <Label htmlFor="resource-reading-time">
                  Minutos de lectura
                </Label>
                <Input
                  id="resource-reading-time"
                  type="number"
                  min={1}
                  value={readingTimeMinutes}
                  onChange={(e) => setReadingTimeMinutes(e.target.value)}
                  className={adminInputClass}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="resource-file-label">Etiqueta de archivo</Label>
                <Input
                  id="resource-file-label"
                  value={fileLabel}
                  onChange={(e) => setFileLabel(e.target.value)}
                  className={adminInputClass}
                  placeholder="Markdown + Notion"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="resource-tags">
                Tags (slugs separados por coma)
              </Label>
              <Input
                id="resource-tags"
                value={tagSlugs}
                onChange={(e) => setTagSlugs(e.target.value)}
                className={adminInputClass}
                placeholder="propuestas, pricing"
              />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Checkbox
                id="resource-featured"
                checked={isFeatured}
                onCheckedChange={(v) => setIsFeatured(v === true)}
              />
              <Label htmlFor="resource-featured">Destacado en índice</Label>
            </div>
            {availability === RESOURCE_AVAILABILITY.COURSE ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="resource-related-href">
                    Enlace relacionado
                  </Label>
                  <Input
                    id="resource-related-href"
                    value={relatedHref}
                    onChange={(e) => setRelatedHref(e.target.value)}
                    className={adminInputClass}
                    placeholder="/catalog"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resource-related-label">
                    Texto del enlace
                  </Label>
                  <Input
                    id="resource-related-label"
                    value={relatedLabel}
                    onChange={(e) => setRelatedLabel(e.target.value)}
                    className={adminInputClass}
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className={adminPanelClass}>
        <div className={adminPanelHeaderClass}>
          <h2 className={adminPanelTitleClass}>
            {kind === RESOURCE_KIND.GUIDE
              ? "Contenido (Markdown)"
              : "Preview de plantilla"}
          </h2>
        </div>
        <div className="space-y-4 p-4">
          {kind === RESOURCE_KIND.GUIDE ? (
            <Textarea
              id="resource-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              className={cn(adminInputClass, "min-h-[280px] font-mono text-xs")}
            />
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="resource-sections">
                  Secciones (JSON: title + body)
                </Label>
                <Textarea
                  id="resource-sections"
                  value={templateSectionsJson}
                  onChange={(e) => setTemplateSectionsJson(e.target.value)}
                  rows={12}
                  className={cn(
                    adminInputClass,
                    "min-h-[220px] font-mono text-xs",
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-includes">
                  Incluye (una línea por ítem)
                </Label>
                <Textarea
                  id="resource-includes"
                  value={templateIncludes}
                  onChange={(e) => setTemplateIncludes(e.target.value)}
                  rows={5}
                  className={adminInputClass}
                />
              </div>
            </>
          )}
        </div>
      </section>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        <IconDeviceFloppy className="size-4" />
        {isPending ? "Guardando…" : "Guardar recurso"}
      </Button>
    </form>
  );
}
