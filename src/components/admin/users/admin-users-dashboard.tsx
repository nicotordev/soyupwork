"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconUsers,
  IconSearch,
  IconUserPlus,
  IconMail,
  IconShield,
  IconSchool,
  IconDotsVertical,
  IconCheck,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  adminBrutalButtonClass,
  adminInputClass,
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/dashboard-styles";
import { cn } from "@/lib/utils";

type StudentUser = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
  courseCount: number;
  joinedAt: string;
};

const INITIAL_USERS: StudentUser[] = [
  {
    id: "usr_1",
    name: "Esteban Altamirano",
    email: "esteban.alt@gmail.com",
    role: "STUDENT",
    status: "ACTIVE",
    courseCount: 3,
    joinedAt: "2026-05-10",
  },
  {
    id: "usr_2",
    name: "Valentina Gómez",
    email: "vale.gomez@soyup.work",
    role: "INSTRUCTOR",
    status: "ACTIVE",
    courseCount: 8,
    joinedAt: "2026-01-15",
  },
  {
    id: "usr_3",
    name: "Cristóbal Silva",
    email: "c.silva.dev@outlook.com",
    role: "STUDENT",
    status: "ACTIVE",
    courseCount: 1,
    joinedAt: "2026-05-24",
  },
  {
    id: "usr_4",
    name: "Javiera Martínez",
    email: "javi.mtz@gmail.com",
    role: "STUDENT",
    status: "INACTIVE",
    courseCount: 2,
    joinedAt: "2026-03-02",
  },
  {
    id: "usr_5",
    name: "Andrés Muñoz",
    email: "a.munoz.admin@soyupwork.com",
    role: "ADMIN",
    status: "ACTIVE",
    courseCount: 0,
    joinedAt: "2025-11-01",
  },
];

export function AdminUsersDashboard() {
  const [users, setUsers] = useState<StudentUser[]>(INITIAL_USERS);
  const [query, setQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          triggerToast(`Estado de ${u.name} cambiado a ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const changeRole = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextRole =
            u.role === "STUDENT"
              ? "INSTRUCTOR"
              : u.role === "INSTRUCTOR"
              ? "ADMIN"
              : "STUDENT";
          triggerToast(`Rol de ${u.name} cambiado a ${nextRole}`);
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = filterRole === "ALL" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 border-2 border-foreground bg-secondary px-4 py-2.5 font-mono text-xs font-bold uppercase shadow-[4px_4px_0px_0px_var(--foreground)]"
          >
            <IconCheck className="size-4 text-emerald-600" stroke={3} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top metrics bar */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={cn(adminPanelClass, "p-4 bg-primary/5")}>
          <p className={adminPanelTitleClass}>Estudiantes Totales</p>
          <p className="mt-2 font-heading text-2xl font-extrabold">{users.length} alumnos</p>
          <p className="font-mono text-[9px] text-muted-foreground uppercase mt-1">Registrados en la DB</p>
        </div>
        <div className={cn(adminPanelClass, "p-4 bg-secondary/5")}>
          <p className={adminPanelTitleClass}>Activos ahora</p>
          <p className="mt-2 font-heading text-2xl font-extrabold">
            {users.filter((u) => u.status === "ACTIVE").length} online
          </p>
          <p className="font-mono text-[9px] text-muted-foreground uppercase mt-1">Sesiones iniciadas</p>
        </div>
        <div className={cn(adminPanelClass, "p-4 bg-card")}>
          <p className={adminPanelTitleClass}>Instructores activos</p>
          <p className="mt-2 font-heading text-2xl font-extrabold">
            {users.filter((u) => u.role === "INSTRUCTOR").length} guías
          </p>
          <p className="font-mono text-[9px] text-muted-foreground uppercase mt-1">Mentores de Upwork</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className={cn(adminPanelClass, "p-4 bg-background")}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative min-w-0 flex-1">
            <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" stroke={2.25} />
            <Input
              type="search"
              placeholder="Buscar por nombre o correo..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cn(adminInputClass, "h-9 pl-8 font-mono text-xs")}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["ALL", "STUDENT", "INSTRUCTOR", "ADMIN"].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={cn(
                  "px-3 py-1 font-mono text-[10px] font-extrabold uppercase border-2 border-foreground rounded transition-all shadow-[2px_2px_0px_0px_var(--foreground)] active:translate-y-px",
                  filterRole === r ? "bg-secondary text-foreground" : "bg-background text-muted-foreground"
                )}
              >
                {r === "ALL" ? "Todos" : r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={cn(adminPanelClass, "overflow-hidden")}>
        <div className={adminPanelHeaderClass}>
          <div>
            <h2 className={adminPanelTitleClass}>Registro de Miembros</h2>
            <p className="text-[10px] text-muted-foreground">Actualización en tiempo real desde Clerk</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-foreground/20 bg-muted/20 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Miembro</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Cursos</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="text-xs transition-colors hover:bg-muted/15">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{user.name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                      <IconMail className="size-3" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono">
                    <Badge variant={user.role === "ADMIN" ? "default" : user.role === "INSTRUCTOR" ? "secondary" : "outline"} className="text-[9px] uppercase">
                      <IconShield className="size-2.5 mr-1" />
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className={cn(
                        "font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-foreground/30 shadow-[1px_1px_0px_0px_var(--foreground)]",
                        user.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {user.status === "ACTIVE" ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold">{user.courseCount}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => changeRole(user.id)}
                        className={cn(adminBrutalButtonClass, "text-[9px] font-mono")}
                      >
                        Rol
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => toggleStatus(user.id)}
                        className={cn(adminBrutalButtonClass, "text-[9px] font-mono")}
                      >
                        Estado
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
