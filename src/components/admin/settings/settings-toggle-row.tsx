"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type SettingsToggleRowProps = {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function SettingsToggleRow({
  id,
  title,
  description,
  checked,
  onCheckedChange,
}: SettingsToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded border-2 border-foreground bg-secondary/40 px-3 py-2">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="font-mono text-xs font-bold uppercase">
          {title}
        </Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
