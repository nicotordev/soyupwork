"use client";

import { createBlogPost } from "@/app/actions/blog.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_BLOG_PAGE } from "@/constants/blog.constants";
import { adminInputClass, adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "@/lib/toast";

type BlogPostCreateDialogProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  className?: string;
};

export function BlogPostCreateDialog({
  isOpen: controlledOpen,
  onOpenChange,
  hideTrigger = false,
  className,
}: BlogPostCreateDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (next: boolean) => {
    if (isControlled) {
      onOpenChange?.(next);
    } else {
      setInternalOpen(next);
    }
  };

  useEffect(() => {
    if (!open) {
      setTitle("");
    }
  }, [open]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await createBlogPost({ title });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Artículo creado");
      setOpen(false);
      setTitle("");
      router.push(`/admin/blog/${result.postId}`);
    });
  };

  if (!open) {
    if (hideTrigger) return null;
    return (
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className={cn("shrink-0", className)}
      >
        <IconPlus className="size-4" />
        {ADMIN_BLOG_PAGE.createLabel}
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        adminPanelClass,
        "flex w-full flex-col gap-3 p-4 sm:max-w-md",
        className,
      )}
    >
      <div className="space-y-2">
        <Label htmlFor="new-blog-title">Título del artículo</Label>
        <Input
          id="new-blog-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={adminInputClass}
          disabled={isPending}
          autoFocus
          required
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isPending || title.trim().length < 3}>
          {isPending ? "Creando…" : "Crear borrador"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => setOpen(false)}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
