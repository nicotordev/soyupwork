"use client";

import { createCategory } from "@/app/actions/categories.actions";
import { CategoryIconPicker } from "@/components/admin/categories/category-icon-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminBrutalButtonClass,
  adminInputClass,
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { toSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import type { CreateCategoryInput } from "@/schemas/category";
import {
  IconCategory,
  IconDeviceFloppy,
  IconLink,
  IconLoader,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

type CategoryCreationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CategoryCreationDialog({
  isOpen,
  onClose,
}: CategoryCreationDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const slugManuallyEdited = useRef(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState<CreateCategoryInput["icon"]>("");
  const [position, setPosition] = useState("");

  const resetForm = () => {
    setName("");
    setSlug("");
    setIcon("");
    setPosition("");
    slugManuallyEdited.current = false;
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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
      handleClose();
      router.refresh();
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={cn(
            adminPanelClass,
            "w-full max-w-lg overflow-hidden border-2 border-foreground bg-background shadow-[8px_8px_0px_0px_var(--foreground)]",
          )}
        >
          <div className={adminPanelHeaderClass}>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded border border-foreground bg-secondary">
                <IconCategory className="size-4 text-primary" stroke={2.5} />
              </span>
              <div>
                <h3 className={adminPanelTitleClass}>Nueva categoría</h3>
                <p className="text-xs text-muted-foreground">
                  El slug se genera con slugify desde el nombre
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

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="categoryName">Nombre</Label>
                <Input
                  id="categoryName"
                  value={name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  className={adminInputClass}
                  placeholder="Freelancing"
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label
                  htmlFor="categorySlug"
                  className="flex items-center gap-1.5"
                >
                  <IconLink className="size-3.5" stroke={2.25} />
                  Slug
                </Label>
                <Input
                  id="categorySlug"
                  value={slug}
                  onChange={(event) => handleSlugChange(event.target.value)}
                  className={adminInputClass}
                  placeholder="freelancing"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL: /catalog?category={slug || "…"}
                </p>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="categoryIcon">Icono (opcional)</Label>
                <CategoryIconPicker
                  id="categoryIcon"
                  value={icon}
                  onChange={setIcon}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryPosition">Posición (opcional)</Label>
                <Input
                  id="categoryPosition"
                  type="number"
                  min={0}
                  value={position}
                  onChange={(event) => setPosition(event.target.value)}
                  className={adminInputClass}
                  placeholder="Auto"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t-2 border-foreground bg-muted/20 px-6 py-4">
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
                Crear categoría
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
