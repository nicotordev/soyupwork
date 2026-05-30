"use client";

import { AdminCardGrid } from "@/components/admin/listing/admin-card-grid";
import { AdminListingPanel } from "@/components/admin/listing/admin-listing-panel";
import { AdminTableActions } from "@/components/admin/listing/admin-table-actions";
import { useUserRowActions } from "@/components/admin/users/use-user-row-actions";
import { USER_ROLES, type AppUserRole } from "@/constants/users.constants";
import { formatDashboardDate } from "@/lib/admin/formatters";
import { cn } from "@/lib/utils";
import type { AdminUserRow } from "@/types/admin-user.types";
import { Copy, Mail, Shield } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

type UsersCardsProps = {
  users: AdminUserRow[];
  currentAdminUserId: string;
};

export function UsersCards({ users, currentAdminUserId }: UsersCardsProps) {
  const {
    isPending,
    isSelf,
    handleCopyEmail,
    handleRoleChange,
    getEditAction,
    getActiveAction,
    dialogs,
  } = useUserRowActions(currentAdminUserId);

  return (
    <>
      <AdminListingPanel
        title="Vista de tarjetas"
        description="Miembros registrados en la plataforma"
        className="border-b-0 rounded-b-none pb-0"
      />

      <AdminCardGrid className="mt-4 mb-6">
        {users.map((user) => (
          <article
            key={user.id}
            role="listitem"
            className={cn(
              "flex h-full flex-col overflow-hidden rounded-lg border-2 border-foreground bg-card",
              "shadow-[4px_4px_0px_0px_var(--foreground)] transition-all",
              "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--foreground)]",
              !user.isActive && "opacity-75",
            )}
          >
            <div className="flex items-start gap-3 border-b-2 border-foreground bg-muted/40 p-4">
              <Avatar size="sm">
                {user.imageUrl ? (
                  <AvatarImage src={user.imageUrl} alt={user.displayName} />
                ) : null}
                <AvatarFallback className="font-mono text-[10px] font-bold">
                  {userInitials(user.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-sm font-extrabold">
                  {user.displayName}
                </p>
                {user.email ? (
                  <p className="flex items-center gap-1 truncate font-mono text-[10px] text-muted-foreground">
                    <Mail className="size-3 shrink-0" aria-hidden />
                    {user.email}
                  </p>
                ) : (
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Sin correo
                  </p>
                )}
              </div>
              <Badge
                variant={user.isActive ? "secondary" : "outline"}
                className={cn(
                  "shrink-0 text-[9px] uppercase",
                  user.isActive
                    ? "border-emerald-600/40 bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                    : "text-destructive",
                )}
              >
                {user.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </div>

            <div className="space-y-2.5 p-4 font-mono text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground uppercase">
                  Rol
                </span>
                {isSelf(user.id) ? (
                  <Badge
                    variant={roleBadgeVariant(user.role)}
                    className="text-[9px] uppercase"
                  >
                    <Shield className="mr-1 size-2.5" aria-hidden />
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
                    <SelectTrigger className="h-8 w-[130px] font-mono text-[10px] font-bold uppercase">
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
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase">
                  Inscripciones
                </span>
                <span className="font-extrabold">{user.enrollmentCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase">
                  Impartidos
                </span>
                <span className="font-extrabold">
                  {user.instructedCourseCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="uppercase">Registro</span>
                <span>{formatDashboardDate(user.createdAt)}</span>
              </div>
            </div>

            <div className="mt-auto border-t-2 border-foreground bg-muted p-2">
              <AdminTableActions
                actions={[
                  {
                    id: "copy",
                    label: `Copiar correo de ${user.displayName}`,
                    icon: <Copy className="size-4" aria-hidden />,
                    onClick: () => handleCopyEmail(user.email),
                    disabled: !user.email,
                  },
                  getEditAction(user),
                  getActiveAction(user),
                ]}
              />
            </div>
          </article>
        ))}
      </AdminCardGrid>

      {dialogs}
    </>
  );
}
