"use client";

import { createAdminUser } from "@/app/actions/users.actions";
import {
  adminFilterSelectTriggerClass,
} from "@/components/admin/listing/admin-filter-field";
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
import {
  ADMIN_USERS_PAGE,
  USER_ROLES,
  type AppUserRole,
} from "@/constants/users.constants";
import { adminBrutalButtonClass, adminInputClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { createAdminUserSchema } from "@/schemas/user";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "@/lib/toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLE_LABELS: Record<AppUserRole, string> = {
  STUDENT: "Estudiante",
  INSTRUCTOR: "Instructor",
  ADMIN: "Administrador",
};

type UserCreationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserCreationDialog({
  open,
  onOpenChange,
}: UserCreationDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AppUserRole>("STUDENT");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const resetForm = () => {
    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setRole("STUDENT");
    setFieldError(null);
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen && !isPending) {
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldError(null);

    const parsed = createAdminUserSchema.safeParse({
      email,
      firstName,
      lastName,
      password,
      role,
    });

    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Datos inválidos.");
      return;
    }

    startTransition(async () => {
      const result = await createAdminUser(parsed.data);
      if (!result.ok) {
        toast.error(result.error ?? ADMIN_USERS_PAGE.createUserError);
        return;
      }

      toast.success(ADMIN_USERS_PAGE.createUserSuccess(result.displayName));
      resetForm();
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-2 border-foreground shadow-[6px_6px_0px_0px_var(--foreground)] sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="text-base font-extrabold">
            {ADMIN_USERS_PAGE.createUserTitle}
          </DialogTitle>
          <DialogDescription>
            {ADMIN_USERS_PAGE.createUserDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="create-user-first-name"
                className="font-mono text-[10px] font-bold uppercase"
              >
                Nombre
              </Label>
              <Input
                id="create-user-first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
                className={adminInputClass}
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="create-user-last-name"
                className="font-mono text-[10px] font-bold uppercase"
              >
                Apellido
              </Label>
              <Input
                id="create-user-last-name"
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
              htmlFor="create-user-email"
              className="font-mono text-[10px] font-bold uppercase"
            >
              Correo
            </Label>
            <Input
              id="create-user-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className={adminInputClass}
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="create-user-password"
              className="font-mono text-[10px] font-bold uppercase"
            >
              Contraseña temporal
            </Label>
            <Input
              id="create-user-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              className={adminInputClass}
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-mono text-[10px] font-bold uppercase">
              Rol inicial
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
              disabled={isPending}
              className={cn(adminBrutalButtonClass)}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Creando...
                </>
              ) : (
                "Crear miembro"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
