"use client";

import { sendWaitlistInvite } from "@/app/actions/waitlist-invite.actions";
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
import { ADMIN_WAITLIST_PAGE } from "@/constants/waitlist-admin.constants";
import { adminBrutalButtonClass, adminInputClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "@/lib/toast";

type WaitlistInviteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail?: string;
};

export function WaitlistInviteDialog({
  open,
  onOpenChange,
  defaultEmail = "",
}: WaitlistInviteDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState(defaultEmail);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen && !isPending) {
      setEmail(defaultEmail);
      setFieldError(null);
    }
    if (nextOpen) {
      setEmail(defaultEmail || email);
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldError(null);

    startTransition(async () => {
      const result = await sendWaitlistInvite({ email });
      if (!result.ok) {
        setFieldError(result.error);
        return;
      }

      toast.success(ADMIN_WAITLIST_PAGE.inviteSuccess(email.trim()));
      router.refresh();
      handleClose(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-2 border-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{ADMIN_WAITLIST_PAGE.inviteDialogTitle}</DialogTitle>
          <DialogDescription>
            {ADMIN_WAITLIST_PAGE.inviteDialogDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="waitlist-invite-email">Correo</Label>
            <Input
              id="waitlist-invite-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={adminInputClass}
              required
              disabled={isPending}
            />
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
              className={cn(adminBrutalButtonClass, "border-2")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className={adminBrutalButtonClass}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Enviando…
                </>
              ) : (
                "Enviar invitación"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
