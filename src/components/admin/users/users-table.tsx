"use client";

import { setUserActive, updateUserRole } from "@/app/actions/users.actions";
import { USER_ROLES, type AppUserRole } from "@/constants/users.constants";
import { formatDashboardDate } from "@/lib/admin/formatters";
import {
  adminBrutalButtonClass,
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { AdminUserRow } from "@/types/admin-user.types";
import { IconCopy, IconMail, IconShield } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const ROLE_LABELS: Record<AppUserRole, string> = {
  STUDENT: "Estudiante",
  INSTRUCTOR: "Instructor",
  ADMIN: "Administrador",
};

function userInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

function roleBadgeVariant(role: AppUserRole) {
  if (role === "ADMIN") return "default";
  if (role === "INSTRUCTOR") return "secondary";
  return "outline";
}

type UsersTableProps = {
  users: AdminUserRow[];
  currentAdminUserId: string;
};

export function UsersTable({ users, currentAdminUserId }: UsersTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingRoleUserId, setPendingRoleUserId] = useState<string | null>(
    null,
  );
  const [pendingRole, setPendingRole] = useState<AppUserRole | null>(null);
  const [pendingActiveUser, setPendingActiveUser] =
    useState<AdminUserRow | null>(null);

  const isSelf = (userId: string) => userId === currentAdminUserId;

  const handleCopyEmail = async (email: string | null) => {
    if (!email) {
      toast.error("Este usuario no tiene correo registrado.");
      return;
    }
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Correo copiado al portapapeles");
    } catch {
      toast.error("No se pudo copiar el correo.");
    }
  };

  const handleRoleChange = (user: AdminUserRow, nextRole: AppUserRole) => {
    if (nextRole === user.role) return;
    if (isSelf(user.id)) {
      toast.error("No puedes cambiar tu propio rol.");
      return;
    }
    if (nextRole === "ADMIN") {
      setPendingRoleUserId(user.id);
      setPendingRole(nextRole);
      return;
    }
    applyRoleChange(user.id, nextRole);
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

  const pendingUser = users.find((u) => u.id === pendingRoleUserId);

  return (
    <>
      <section className={adminPanelClass} aria-labelledby="users-table-title">
        <div className={adminPanelHeaderClass}>
          <div>
            <h2 id="users-table-title" className={adminPanelTitleClass}>
              Registro de miembros
            </h2>
            <p className="text-xs text-muted-foreground">
              Miembros sincronizados desde Clerk · datos en base de datos
            </p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-foreground/20 hover:bg-transparent">
              <TableHead className="font-mono text-[10px] uppercase">
                Miembro
              </TableHead>
              <TableHead className="font-mono text-[10px] uppercase">
                Rol
              </TableHead>
              <TableHead className="font-mono text-[10px] uppercase">
                Estado
              </TableHead>
              <TableHead className="hidden font-mono text-[10px] uppercase sm:table-cell">
                Inscripciones
              </TableHead>
              <TableHead className="hidden font-mono text-[10px] uppercase md:table-cell">
                Impartidos
              </TableHead>
              <TableHead className="hidden font-mono text-[10px] uppercase lg:table-cell">
                Registro
              </TableHead>
              <TableHead className="text-right font-mono text-[10px] uppercase">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className={cn(
                  "border-foreground/15",
                  !user.isActive && "opacity-70",
                )}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar size="sm">
                      {user.imageUrl ? (
                        <AvatarImage
                          src={user.imageUrl}
                          alt={user.displayName}
                        />
                      ) : null}
                      <AvatarFallback className="font-mono text-[10px] font-bold">
                        {userInitials(user.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{user.displayName}</p>
                      {user.email ? (
                        <p className="flex items-center gap-1 truncate font-mono text-[10px] text-muted-foreground">
                          <IconMail className="size-3 shrink-0" />
                          {user.email}
                        </p>
                      ) : (
                        <p className="font-mono text-[10px] text-muted-foreground">
                          Sin correo
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {isSelf(user.id) ? (
                    <Badge
                      variant={roleBadgeVariant(user.role)}
                      className="text-[9px] uppercase"
                    >
                      <IconShield className="mr-1 size-2.5" />
                      {ROLE_LABELS[user.role]}
                    </Badge>
                  ) : (
                    <Select
                      value={user.role}
                      disabled={isPending || !user.isActive}
                      onValueChange={(value) =>
                        handleRoleChange(user, value as AppUserRole)
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          "h-8 w-[130px] font-mono text-[10px] font-bold uppercase",
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {USER_ROLES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {ROLE_LABELS[role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.isActive ? "secondary" : "outline"}
                    className={cn(
                      "text-[9px] uppercase",
                      user.isActive
                        ? "border-emerald-600/40 bg-emerald-100 text-emerald-900"
                        : "text-destructive",
                    )}
                  >
                    {user.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden font-mono text-xs sm:table-cell">
                  {user.enrollmentCount}
                </TableCell>
                <TableCell className="hidden font-mono text-xs md:table-cell">
                  {user.instructedCourseCount}
                </TableCell>
                <TableCell className="hidden font-mono text-[10px] text-muted-foreground lg:table-cell">
                  {formatDashboardDate(user.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={!user.email}
                      onClick={() => handleCopyEmail(user.email)}
                      aria-label={`Copiar correo de ${user.displayName}`}
                    >
                      <IconCopy stroke={2.25} />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPending || isSelf(user.id)}
                      onClick={() => handleActiveToggle(user)}
                      className={adminBrutalButtonClass}
                    >
                      {user.isActive ? "Desactivar" : "Restaurar"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <AlertDialog
        open={pendingRoleUserId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingRoleUserId(null);
            setPendingRole(null);
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
    </>
  );
}
