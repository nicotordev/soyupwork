"use client";

import {
  revokeWaitlistInvite,
  sendWaitlistInvite,
} from "@/app/actions/waitlist-invite.actions";
import type { AdminTableActionItem } from "@/types/admin-listing.types";
import type { AdminWaitlistEntryRow } from "@/types/admin-waitlist.types";
import { WAITLIST_INVITE_STATUS } from "@/constants/waitlist-admin.constants";
import { Ban, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "@/lib/toast";
import { ADMIN_WAITLIST_PAGE } from "@/constants/waitlist-admin.constants";

export function useWaitlistRowActions() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const sendInvite = (email: string) => {
    startTransition(async () => {
      const result = await sendWaitlistInvite({ email });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(ADMIN_WAITLIST_PAGE.inviteSuccess(email));
      router.refresh();
    });
  };

  const revokeInvite = (inviteId: string) => {
    startTransition(async () => {
      const result = await revokeWaitlistInvite({ inviteId });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(ADMIN_WAITLIST_PAGE.revokeSuccess);
      router.refresh();
    });
  };

  const getRowActions = (
    entry: AdminWaitlistEntryRow,
  ): AdminTableActionItem[] => {
    const actions: AdminTableActionItem[] = [];

    if (!entry.hasUserAccount) {
      const inviteLabel =
        entry.latestInvite?.status === WAITLIST_INVITE_STATUS.PENDING
          ? "Reenviar invitación"
          : "Enviar invitación";

      actions.push({
        id: "invite",
        label: inviteLabel,
        icon: <Mail className="size-4" aria-hidden />,
        onClick: () => sendInvite(entry.email),
        disabled:
          isPending ||
          entry.latestInvite?.status === WAITLIST_INVITE_STATUS.ACCEPTED,
      });
    }

    if (entry.latestInvite?.status === WAITLIST_INVITE_STATUS.PENDING) {
      const expiresAt = new Date(entry.latestInvite.expiresAt);
      if (expiresAt.getTime() > Date.now()) {
        actions.push({
          id: "revoke",
          label: "Revocar invitación",
          icon: <Ban className="size-4" aria-hidden />,
          onClick: () => revokeInvite(entry.latestInvite!.id),
          disabled: isPending,
          destructive: true,
        });
      }
    }

    return actions;
  };

  return { isPending, getRowActions };
}
