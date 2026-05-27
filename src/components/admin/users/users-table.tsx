"use client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        title="Registro de miembros"
        description="Miembros sincronizados desde Clerk · datos en base de datos"
      >
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
                          <Mail className="size-3 shrink-0" aria-hidden />
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
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.isActive ? "secondary" : "outline"}
                    className={cn(
                      "text-[9px] uppercase",
                      user.isActive
                        ? "border-emerald-600/40 bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminListingPanel>

      {dialogs}
    </>
  );
}
