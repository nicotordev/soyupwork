"use client";

import { createResource } from "@/app/actions/resources.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ADMIN_RESOURCES_KIND_GUIDE,
  ADMIN_RESOURCES_KIND_TEMPLATE,
  ADMIN_RESOURCES_PAGE,
} from "@/constants/resources-admin.constants";
import type { AdminResourcesKindParam } from "@/constants/resources-admin.constants";
import { adminBrutalButtonClass, adminInputClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "@/lib/toast";

type ResourceCreateDialogProps = {
  kind: AdminResourcesKindParam;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  className?: string;
};

export function ResourceCreateDialog({
  kind,
  isOpen: controlledOpen,
  onOpenChange,
  hideTrigger = false,
  className,
}: ResourceCreateDialogProps) {
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

  const createLabel =
    kind === ADMIN_RESOURCES_KIND_GUIDE
      ? ADMIN_RESOURCES_PAGE.createGuideLabel
      : ADMIN_RESOURCES_PAGE.createTemplateLabel;

  const resourceName =
    kind === ADMIN_RESOURCES_KIND_TEMPLATE ? "plantilla" : "guía";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (title.trim().length < 3) return;

    startTransition(async () => {
      const result = await createResource({
        title,
        kind: kind === ADMIN_RESOURCES_KIND_GUIDE ? "guide" : "template",
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Recurso creado");
      setOpen(false);
      setTitle("");
      router.push(`/admin/resources/${result.resourceId}`);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button
            type="button"
            className={cn(
              adminBrutalButtonClass,
              "h-9 gap-1.5 font-mono text-xs font-bold uppercase shrink-0",
              className,
            )}
          >
            <Plus className="size-4" aria-hidden />
            <span>{createLabel}</span>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="border-2 border-foreground bg-card shadow-[6px_6px_0px_0px_var(--foreground)] sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="text-base font-extrabold">
            Crear nueva {resourceName}
          </DialogTitle>
          <DialogDescription>
            Introduce el título de tu borrador. Serás redirigido al editor una vez que se cree.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label
              htmlFor="new-resource-title"
              className="font-mono text-[10px] font-bold uppercase"
            >
              Título de la {resourceName}
            </Label>
            <Input
              id="new-resource-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={adminInputClass}
              disabled={isPending}
              placeholder={`Ej. Guía para mandar propuestas a Upwork...`}
              autoFocus
              required
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending || title.trim().length < 3}
              className={cn(adminBrutalButtonClass)}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1" aria-hidden />
                  Creando borrador...
                </>
              ) : (
                "Crear borrador"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
