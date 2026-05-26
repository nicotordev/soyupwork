"use client";

import { createCategory } from "@/app/actions/categories.actions";
import { SettingsFormActions } from "@/components/admin/settings/settings-form-actions";
import { SettingsPanel } from "@/components/admin/settings/settings-panel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminInputClass } from "@/lib/admin/styles";
import { toSlug } from "@/lib/slug";
import { IconCategory, IconLink } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

export function CategoryCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const slugManuallyEdited = useRef(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("");
  const [position, setPosition] = useState("");

  const handleNameChange = (value: string) => {
    setName(value);
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

    startTransition(async () => {
      const result = await createCategory({
        name,
        slug,
        icon,
        position: position.trim() === "" ? null : Number(position),
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(`Categoría "${result.category.name}" creada`);
      setName("");
      setSlug("");
      setIcon("");
      setPosition("");
      slugManuallyEdited.current = false;
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SettingsPanel
        icon={<IconCategory className="size-4 text-primary" stroke={2.5} />}
        title="Nueva categoría"
        description="El slug se genera con slugify desde el nombre"
      >
        <div className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="categoryName">Nombre</Label>
            <Input
              id="categoryName"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={adminInputClass}
              placeholder="Freelancing"
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="categorySlug" className="flex items-center gap-1.5">
              <IconLink className="size-3.5" stroke={2.25} />
              Slug
            </Label>
            <Input
              id="categorySlug"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className={adminInputClass}
              placeholder="freelancing"
              required
            />
            <p className="text-xs text-muted-foreground">
              URL: /catalog?category={slug || "…"}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryIcon">Icono (opcional)</Label>
            <Input
              id="categoryIcon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className={adminInputClass}
              placeholder="IconBriefcase"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryPosition">Posición (opcional)</Label>
            <Input
              id="categoryPosition"
              type="number"
              min={0}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className={adminInputClass}
              placeholder="Auto"
            />
          </div>
        </div>
      </SettingsPanel>

      <SettingsFormActions isPending={isPending} />
    </form>
  );
}
