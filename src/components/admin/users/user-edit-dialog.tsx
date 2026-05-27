"use client";

import { updateAdminUserProfile } from "@/app/actions/users.actions";
import { adminFilterSelectTriggerClass } from "@/components/admin/listing/admin-filter-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ADMIN_USERS_PAGE,
  USER_ROLES,
  type AppUserRole,
} from "@/constants/users.constants";
import { adminBrutalButtonClass, adminInputClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { updateAdminUserProfileSchema } from "@/schemas/user";
import type { AdminUserRow } from "@/types/admin-user.types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "@/lib/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserEditDialogProps = {
  user: AdminUserRow | null;
  onOpenChange: (open: boolean) => void;
};

const ROLE_LABELS: Record<AppUserRole, string> = {
  STUDENT: "Estudiante",
  INSTRUCTOR: "Instructor",
  ADMIN: "Administrador",
};

export function UserEditDialog({ user, onOpenChange }: UserEditDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState<AppUserRole>("STUDENT");
  const [active, setActive] = useState(true);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const open = user !== null;
  const initialFirstName = useMemo(
    () => user?.firstName ?? "",
    [user?.firstName],
  );
  const initialLastName = useMemo(() => user?.lastName ?? "", [user?.lastName]);
  const initialRole = useMemo(() => user?.role ?? "STUDENT", [user?.role]);
  const initialActive = useMemo(() => user?.isActive ?? true, [user?.isActive]);
  const initialImageUrl = useMemo(() => user?.imageUrl ?? "", [user?.imageUrl]);
  const initialBio = useMemo(() => user?.bio ?? "", [user?.bio]);
  const normalizedFirstName = firstName.trim();
  const normalizedLastName = lastName.trim();
  const normalizedImageUrl = imageUrl.trim();
  const normalizedBio = bio.trim();
  const hasChanges =
    user !== null &&
    (normalizedFirstName !== initialFirstName.trim() ||
      normalizedLastName !== initialLastName.trim() ||
      normalizedImageUrl !== initialImageUrl.trim() ||
      normalizedBio !== initialBio.trim() ||
      role !== initialRole ||
      active !== initialActive);

  useEffect(() => {
    if (!open) return;
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setImageUrl(initialImageUrl);
    setBio(initialBio);
    setRole(initialRole);
    setActive(initialActive);
    setFieldError(null);
  }, [
    open,
    initialFirstName,
    initialLastName,
    initialImageUrl,
    initialBio,
    initialRole,
    initialActive,
  ]);

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen && !isPending) {
      onOpenChange(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    setFieldError(null);

    const parsed = updateAdminUserProfileSchema.safeParse({
      userId: user.id,
      firstName,
      lastName,
      imageUrl,
      bio,
      role,
      active,
    });

    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Datos inválidos.");
      return;
    }

    startTransition(async () => {
      const result = await updateAdminUserProfile(parsed.data);
      if (!result.ok) {
        toast.error(result.error ?? ADMIN_USERS_PAGE.editUserError);
        return;
      }

      toast.success(ADMIN_USERS_PAGE.editUserSuccess(result.displayName));
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-2 border-foreground shadow-[6px_6px_0px_0px_var(--foreground)] sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="text-base font-extrabold">
            {ADMIN_USERS_PAGE.editUserTitle}
          </DialogTitle>
          <DialogDescription>
            {ADMIN_USERS_PAGE.editUserDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-user-first-name"
                className="font-mono text-[10px] font-bold uppercase"
              >
                Nombre
              </Label>
              <Input
                id="edit-user-first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
                className={adminInputClass}
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-user-last-name"
                className="font-mono text-[10px] font-bold uppercase"
              >
                Apellido
              </Label>
              <Input
                id="edit-user-last-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="family-name"
                className={adminInputClass}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="edit-user-image-url"
              className="font-mono text-[10px] font-bold uppercase"
            >
              Imagen de perfil (URL)
            </Label>
            <Input
              id="edit-user-image-url"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
              autoComplete="url"
              className={adminInputClass}
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="edit-user-bio"
              className="font-mono text-[10px] font-bold uppercase"
            >
              Biografía
            </Label>
            <Textarea
              id="edit-user-bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Breve descripción del miembro..."
              className={cn(adminInputClass, "min-h-24")}
              disabled={isPending}
              maxLength={300}
            />
            <p className="font-mono text-[10px] text-muted-foreground">
              {bio.length}/300
            </p>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="edit-user-email"
              className="font-mono text-[10px] font-bold uppercase"
            >
              Correo
            </Label>
            <Input
              id="edit-user-email"
              value={user?.email ?? "Sin correo"}
              readOnly
              className={cn(adminInputClass, "opacity-80")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] font-bold uppercase">
                Rol
              </Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as AppUserRole)}
                disabled={isPending}
              >
                <SelectTrigger className={adminFilterSelectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((userRole) => (
                    <SelectItem key={userRole} value={userRole}>
                      {ROLE_LABELS[userRole]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] font-bold uppercase">
                Estado
              </Label>
              <Select
                value={active ? "active" : "inactive"}
                onValueChange={(value) => setActive(value === "active")}
                disabled={isPending}
              >
                <SelectTrigger className={adminFilterSelectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {fieldError ? (
            <p className="text-sm text-destructive" role="alert">
              {fieldError}
            </p>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending || !hasChanges}
              className={cn(adminBrutalButtonClass)}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
