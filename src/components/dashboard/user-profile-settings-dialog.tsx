"use client";

import { UserProfileSettingsForm } from "@/components/dashboard/user-profile-settings-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export { PROFILE_QUERY_KEY } from "@/components/dashboard/user-profile-settings-form";

type UserProfileSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserProfileSettingsDialog({
  open,
  onOpenChange,
}: UserProfileSettingsDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onOpenChange(false);
      }}
    >
      <DialogContent className="border-2 border-foreground bg-card shadow-[6px_6px_0px_0px_var(--foreground)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-base font-extrabold">
            Configuración de perfil
          </DialogTitle>
          <DialogDescription>
            Actualiza tu nombre, biografía y foto. El correo se gestiona desde
            tu cuenta de acceso.
          </DialogDescription>
        </DialogHeader>

        <UserProfileSettingsForm
          enabled={open}
          variant="dialog"
          onSaved={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
