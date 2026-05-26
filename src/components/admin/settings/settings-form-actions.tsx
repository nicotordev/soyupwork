"use client";

import { adminBrutalButtonClass } from "@/lib/admin/dashboard-styles";
import { IconDeviceFloppy, IconLoader } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

type SettingsFormActionsProps = {
  isPending: boolean;
};

export function SettingsFormActions({ isPending }: SettingsFormActionsProps) {
  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        disabled={isPending}
        className={adminBrutalButtonClass}
      >
        {isPending ? (
          <IconLoader className="animate-spin" stroke={2.25} />
        ) : (
          <IconDeviceFloppy stroke={2.25} />
        )}
        Guardar cambios
      </Button>
    </div>
  );
}
