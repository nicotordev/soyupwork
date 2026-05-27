"use client";

import { setUserActive, updateUserRole } from "@/app/actions/users.actions";
import { UserEditDialog } from "@/components/admin/users/user-edit-dialog";
import { USER_ROLES, type AppUserRole } from "@/constants/users.constants";
import {
  toastCopyError,
  toastCopySuccess,
  toastCopyUnavailable,
} from "@/lib/toast/app-toast";
import type { AdminTableActionItem } from "@/types/admin-listing.types";
import type { AdminUserRow } from "@/types/admin-user.types";
import { Pencil, UserCheck, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "@/lib/toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function useUserRowActions(currentAdminUserId: string) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingRoleUserId, setPendingRoleUserId] = useState<string | null>(
    null,
  );
  const [pendingRole, setPendingRole] = useState<AppUserRole | null>(null);
  const [pendingActiveUser, setPendingActiveUser] =
    useState<AdminUserRow | null>(null);
  const [pendingUser, setPendingUser] = useState<AdminUserRow | null>(null);
  const [pendingEditUser, setPendingEditUser] = useState<AdminUserRow | null>(
    null,
  );

  const isSelf = (userId: string) => userId === currentAdminUserId;

  const handleCopyEmail = async (email: string | null) => {
    if (!email) {
      toastCopyUnavailable("Este usuario no tiene correo registrado.");
      return;
    }
    try {
      await navigator.clipboard.writeText(email);
      toastCopySuccess(email, "Correo copiado");
    } catch {
      toastCopyError();
    }
  };

  const applyRoleChange = (userId: string, role: AppUserRole) => {
    startTransition(async () => {
      const result = await updateUserRole({ userId, role });
      if (result.ok) {
        toast.success("Rol actualizado");
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  };

  const handleRoleChange = (user: AdminUserRow, nextRole: AppUserRole) => {
    if (nextRole === user.role) return;
    if (isSelf(user.id)) {
      toast.error("No puedes cambiar tu propio rol.");
      return;
    }
    if (nextRole === "ADMIN") {
      setPendingUser(user);
      setPendingRoleUserId(user.id);
      setPendingRole(nextRole);
      return;
    }
    applyRoleChange(user.id, nextRole);
  };

  const confirmRoleChange = () => {
    if (!pendingRoleUserId || !pendingRole) return;
    applyRoleChange(pendingRoleUserId, pendingRole);
    setPendingRoleUserId(null);
    setPendingRole(null);
  };

  const handleActiveToggle = (user: AdminUserRow) => {
    if (isSelf(user.id)) {
      toast.error("No puedes desactivar tu propia cuenta.");
      return;
    }
    setPendingActiveUser(user);
  };

  const confirmActiveChange = () => {
    if (!pendingActiveUser) return;
    const nextActive = !pendingActiveUser.isActive;
    const userId = pendingActiveUser.id;

    startTransition(async () => {
      const result = await setUserActive({ userId, active: nextActive });
      if (result.ok) {
        toast.success(
          nextActive ? "Usuario restaurado" : "Usuario desactivado",
        );
        router.refresh();
        setPendingActiveUser(null);
        return;
      }
      toast.error(result.error);
      setPendingActiveUser(null);
    });
  };

  const getActiveAction = (user: AdminUserRow): AdminTableActionItem => ({
    id: "active",
    label: user.isActive
      ? `Desactivar ${user.displayName}`
      : `Restaurar ${user.displayName}`,
    icon: user.isActive ? (
      <UserX className="size-4" aria-hidden />
    ) : (
      <UserCheck className="size-4" aria-hidden />
    ),
    onClick: () => handleActiveToggle(user),
    disabled: isPending || isSelf(user.id),
    destructive: user.isActive,
  });

  const getEditAction = (user: AdminUserRow): AdminTableActionItem => ({
    id: "edit",
    label: `Editar ${user.displayName}`,
    icon: <Pencil className="size-4" aria-hidden />,
    onClick: () => setPendingEditUser(user),
    disabled: isPending,
  });

  const dialogs = (
    <>
      <AlertDialog
        open={pendingRoleUserId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingRoleUserId(null);
            setPendingRole(null);
            setPendingUser(null);
          }
        }}
      >
        <AlertDialogContent className="border-2 border-foreground shadow-[6px_6px_0px_0px_var(--foreground)] sm:max-w-md">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-base font-extrabold">
              Promover a administrador
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingUser
                ? `¿Confirmás dar acceso de administrador a ${pendingUser.displayName}? Podrá gestionar el panel completo.`
                : "¿Confirmás este cambio de rol?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(event) => {
                event.preventDefault();
                confirmRoleChange();
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={pendingActiveUser !== null}
        onOpenChange={(open) => {
          if (!open) setPendingActiveUser(null);
        }}
      >
        <AlertDialogContent className="border-2 border-foreground shadow-[6px_6px_0px_0px_var(--foreground)] sm:max-w-md">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-base font-extrabold">
              {pendingActiveUser?.isActive
                ? "Desactivar miembro"
                : "Restaurar miembro"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingActiveUser?.isActive
                ? `El usuario ${pendingActiveUser.displayName} no podrá acceder a la plataforma hasta que lo restaures.`
                : `¿Restaurar el acceso de ${pendingActiveUser?.displayName ?? "este usuario"}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(event) => {
                event.preventDefault();
                confirmActiveChange();
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UserEditDialog
        user={pendingEditUser}
        onOpenChange={(open) => {
          if (!open) setPendingEditUser(null);
        }}
      />
    </>
  );

  return {
    isPending,
    isSelf,
    handleCopyEmail,
    handleRoleChange,
    handleActiveToggle,
    getEditAction,
    getActiveAction,
    dialogs,
    USER_ROLES,
  };
}
