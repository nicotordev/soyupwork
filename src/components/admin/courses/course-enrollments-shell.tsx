"use client";

import {
  adminEnrollUser,
  adminRevokeEnrollment,
  searchUsersForEnrollment,
  type AdminCourseEnrollmentRow,
} from "@/app/actions/enrollments.actions";
import { AdminListingPanel } from "@/components/admin/listing/admin-listing-panel";
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
import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDashboardDate } from "@/lib/admin/formatters";
import { adminBrutalButtonClass, adminInputClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { EnrollmentStatus } from "@/generated/prisma/client";
import { Loader2, UserPlus, UserX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type CourseEnrollmentsShellProps = {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  enrollments: AdminCourseEnrollmentRow[];
};

const STATUS_LABELS: Record<EnrollmentStatus, string> = {
  ACTIVE: "Activa",
  COMPLETED: "Completada",
  CANCELLED: "Revocada",
  EXPIRED: "Expirada",
};

function statusVariant(status: EnrollmentStatus) {
  if (status === EnrollmentStatus.ACTIVE) return "default";
  if (status === EnrollmentStatus.COMPLETED) return "secondary";
  return "outline";
}

export function CourseEnrollmentsShell({
  courseId,
  courseTitle,
  courseSlug,
  enrollments,
}: CourseEnrollmentsShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] =
    useState<AdminCourseEnrollmentRow | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; label: string; email: string | null }>
  >([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!enrollOpen) return;
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = window.setTimeout(() => {
      setIsSearching(true);
      void searchUsersForEnrollment(searchQuery).then((results) => {
        setSearchResults(results);
        setIsSearching(false);
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchQuery, enrollOpen]);

  const handleEnroll = () => {
    if (!selectedUserId) {
      toast.error("Selecciona un usuario.");
      return;
    }

    startTransition(async () => {
      const result = await adminEnrollUser({
        userId: selectedUserId,
        courseId,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Usuario inscrito correctamente.");
      setEnrollOpen(false);
      setSearchQuery("");
      setSelectedUserId(null);
      router.refresh();
    });
  };

  const handleRevoke = () => {
    if (!revokeTarget) return;

    startTransition(async () => {
      const result = await adminRevokeEnrollment({
        userId: revokeTarget.userId,
        courseId,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Inscripción revocada.");
      setRevokeTarget(null);
      router.refresh();
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Inscripciones
            </p>
            <h1 className="font-heading text-2xl font-black">{courseTitle}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestiona accesos manuales sin pasar por Stripe.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className={adminBrutalButtonClass}
              onClick={() => setEnrollOpen(true)}
            >
              <UserPlus className="size-4" />
              Inscribir usuario
            </Button>
            <Button
              asChild
              variant="outline"
              className={adminBrutalButtonClass}
            >
              <Link href={`/admin/courses/${courseId}/curriculum`}>
                Volver al contenido
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className={adminBrutalButtonClass}
            >
              <Link href={`/courses/${courseSlug}`} target="_blank">
                Ver landing
              </Link>
            </Button>
          </div>
        </div>

        <AdminListingPanel
          title="Alumnos inscritos"
          description={`${enrollments.length} inscripciones registradas`}
        >
          {enrollments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aún no hay inscripciones en este curso.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-foreground/20 hover:bg-transparent">
                  <TableHead className="font-mono text-[10px] uppercase">
                    Alumno
                  </TableHead>
                  <TableHead className="font-mono text-[10px] uppercase">
                    Estado
                  </TableHead>
                  <TableHead className="font-mono text-[10px] uppercase">
                    Origen
                  </TableHead>
                  <TableHead className="font-mono text-[10px] uppercase">
                    Fecha
                  </TableHead>
                  <TableHead className="font-mono text-[10px] uppercase">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{enrollment.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {enrollment.userEmail ?? "Sin email"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(enrollment.status)}>
                        {STATUS_LABELS[enrollment.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm capitalize">
                      {enrollment.source ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDashboardDate(enrollment.createdAt)}
                    </TableCell>
                    <TableCell>
                      {enrollment.status === EnrollmentStatus.ACTIVE ||
                      enrollment.status === EnrollmentStatus.COMPLETED ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={adminBrutalButtonClass}
                          disabled={isPending}
                          onClick={() => setRevokeTarget(enrollment)}
                        >
                          <UserX className="size-3.5" />
                          Revocar
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </AdminListingPanel>
      </div>

      <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inscribir usuario</DialogTitle>
            <DialogDescription>
              Busca por nombre o email y confirma la inscripción manual.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="enrollUserSearch">Buscar usuario</Label>
              <Input
                id="enrollUserSearch"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className={adminInputClass}
                placeholder="Nombre o email…"
              />
            </div>
            <div className="max-h-48 space-y-1 overflow-y-auto rounded border border-foreground/20 p-2">
              {isSearching ? (
                <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Buscando…
                </div>
              ) : searchResults.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {searchQuery.trim().length < 2
                    ? "Escribe al menos 2 caracteres."
                    : "Sin resultados."}
                </p>
              ) : (
                searchResults.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className={cn(
                      "flex w-full flex-col rounded px-3 py-2 text-left text-sm hover:bg-muted",
                      selectedUserId === user.id && "bg-muted",
                    )}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <span className="font-medium">{user.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email ?? "Sin email"}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className={adminBrutalButtonClass}
              onClick={() => setEnrollOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className={adminBrutalButtonClass}
              disabled={isPending || !selectedUserId}
              onClick={handleEnroll}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Confirmar inscripción"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={revokeTarget !== null}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Revocar inscripción?</AlertDialogTitle>
            <AlertDialogDescription>
              {revokeTarget
                ? `${revokeTarget.userName} perderá acceso al curso. Esta acción se puede revertir inscribiéndolo de nuevo.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={adminBrutalButtonClass}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className={adminBrutalButtonClass}
              disabled={isPending}
              onClick={handleRevoke}
            >
              Revocar acceso
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
