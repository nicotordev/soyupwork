"use client";

import { AdminListingPanel } from "@/components/admin/listing/admin-listing-panel";
import { AdminTableActions } from "@/components/admin/listing/admin-table-actions";
import { useWaitlistRowActions } from "@/components/admin/waitlist/use-waitlist-row-actions";
import {
  WAITLIST_INVITE_STATUS,
  WAITLIST_INVITE_STATUS_LABELS,
} from "@/constants/waitlist-admin.constants";
import { formatDashboardDate } from "@/lib/admin/formatters";
import type { AdminWaitlistEntryRow } from "@/types/admin-waitlist.types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function inviteStatusLabel(
  invite: AdminWaitlistEntryRow["latestInvite"],
): string {
  if (!invite) return "Sin invitar";
  if (
    invite.status === WAITLIST_INVITE_STATUS.PENDING &&
    new Date(invite.expiresAt).getTime() <= Date.now()
  ) {
    return "Expirada";
  }
  return WAITLIST_INVITE_STATUS_LABELS[invite.status] ?? invite.status;
}

function inviteBadgeVariant(
  invite: AdminWaitlistEntryRow["latestInvite"],
): "default" | "secondary" | "outline" | "destructive" {
  if (!invite) return "outline";
  if (invite.status === WAITLIST_INVITE_STATUS.ACCEPTED) return "default";
  if (invite.status === WAITLIST_INVITE_STATUS.PENDING) {
    if (new Date(invite.expiresAt).getTime() <= Date.now())
      return "destructive";
    return "secondary";
  }
  return "outline";
}

type WaitlistTableProps = {
  entries: AdminWaitlistEntryRow[];
};

export function WaitlistTable({ entries }: WaitlistTableProps) {
  const { isPending, getRowActions } = useWaitlistRowActions();

  return (
    <AdminListingPanel
      title="Registros verificados"
      description="Personas que confirmaron su correo en la lista de espera"
    >
      <Table>
        <TableHeader>
          <TableRow className="border-foreground/20 hover:bg-transparent">
            <TableHead className="font-mono text-[10px] uppercase">
              Correo
            </TableHead>
            <TableHead className="hidden font-mono text-[10px] uppercase sm:table-cell">
              Nombre
            </TableHead>
            <TableHead className="hidden font-mono text-[10px] uppercase md:table-cell">
              Origen
            </TableHead>
            <TableHead className="font-mono text-[10px] uppercase">
              Invitación
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
          {entries.map((entry) => (
            <TableRow
              key={entry.id}
              className={isPending ? "opacity-70" : undefined}
            >
              <TableCell className="font-medium">{entry.email}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {entry.name ?? "—"}
              </TableCell>
              <TableCell className="hidden font-mono text-xs md:table-cell">
                {entry.source ?? "—"}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Badge variant={inviteBadgeVariant(entry.latestInvite)}>
                    {inviteStatusLabel(entry.latestInvite)}
                  </Badge>
                  {entry.hasUserAccount ? (
                    <span className="font-mono text-[10px] text-muted-foreground">
                      Cuenta creada
                    </span>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="hidden font-mono text-xs lg:table-cell">
                {formatDashboardDate(entry.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <AdminTableActions actions={getRowActions(entry)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminListingPanel>
  );
}
