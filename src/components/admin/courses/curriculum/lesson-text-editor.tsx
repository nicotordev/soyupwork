"use client";

import { MarkdownContent } from "@/components/common/markdown-content";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminInputClass, adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { IconEye, IconPencil } from "@tabler/icons-react";
import { useState } from "react";

type LessonTextEditorProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

type EditorTab = "edit" | "preview";

export function LessonTextEditor({
  id,
  value,
  onChange,
}: LessonTextEditorProps) {
  const [tab, setTab] = useState<EditorTab>("edit");

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label htmlFor={id} className="font-semibold text-sm">Contenido (Markdown)</Label>
        <div className="flex rounded border-2 border-foreground bg-muted p-0.5 font-mono text-[10px] font-bold uppercase shadow-[1px_1px_0px_0px_var(--foreground)]">
          <button
            type="button"
            onClick={() => setTab("edit")}
            className={cn(
              "inline-flex items-center gap-1 rounded px-2.5 py-1 transition-all duration-200",
              tab === "edit"
                ? "bg-primary text-primary-foreground shadow-[1px_1px_0px_0px_var(--foreground)] border border-foreground/15"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <IconPencil className="size-3" stroke={2.5} />
            Editar
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={cn(
              "inline-flex items-center gap-1 rounded px-2.5 py-1 transition-all duration-200",
              tab === "preview"
                ? "bg-primary text-primary-foreground shadow-[1px_1px_0px_0px_var(--foreground)] border border-foreground/15"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <IconEye className="size-3" stroke={2.5} />
            Vista previa
          </button>
        </div>
      </div>

      {tab === "edit" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1.5">
            <Textarea
              id={id}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={cn(
                adminInputClass,
                "min-h-[300px] resize-y font-mono text-xs leading-relaxed transition-all duration-200",
                "focus-visible:bg-background/95"
              )}
              rows={14}
              placeholder={`# Título de la lección
Base del texto en **Markdown**...`}
            />
            <p className="font-mono text-[10px] text-muted-foreground pl-1">
              ✓ Soporta GFM: tablas, tachado, listas de tareas, enlaces automáticos.
            </p>
          </div>
          <div
            className={cn(
              adminPanelClass,
              "hidden min-h-[300px] p-5 lg:block bg-card/30 backdrop-blur-xs transition-all duration-300 hover:shadow-[5px_5px_0px_0px_var(--foreground)] overflow-y-auto max-h-[450px]"
            )}
          >
            <p className="mb-3 font-mono text-[9px] font-bold uppercase text-primary bg-primary/10 border border-primary/20 rounded px-2 py-0.5 w-fit">
              Vista previa en vivo
            </p>
            <MarkdownContent content={value} />
          </div>
        </div>
      ) : (
        <div className={cn(
          adminPanelClass,
          "min-h-[300px] p-5 bg-card/30 backdrop-blur-xs transition-all duration-300 hover:shadow-[5px_5px_0px_0px_var(--foreground)]"
        )}>
          <MarkdownContent content={value} />
        </div>
      )}
    </div>
  );
}
