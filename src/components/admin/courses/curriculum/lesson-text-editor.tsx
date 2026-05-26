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
        <Label htmlFor={id}>Contenido (Markdown)</Label>
        <div className="flex rounded border-2 border-foreground p-0.5 font-mono text-[10px] font-bold uppercase">
          <button
            type="button"
            onClick={() => setTab("edit")}
            className={cn(
              "inline-flex items-center gap-1 rounded-sm px-2 py-1 transition-colors",
              tab === "edit"
                ? "bg-primary text-primary-foreground"
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
              "inline-flex items-center gap-1 rounded-sm px-2 py-1 transition-colors",
              tab === "preview"
                ? "bg-primary text-primary-foreground"
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
                "min-h-[280px] resize-y font-mono text-xs leading-relaxed",
              )}
              rows={14}
              placeholder={`# Título de la lección

Introduce el contenido en **Markdown**.

- Listas y tablas (GFM)
- \`código inline\`
- Enlaces y citas`}
            />
            <p className="font-mono text-[10px] text-muted-foreground">
              Soporta GFM: tablas, tachado, listas de tareas, enlaces
              automáticos.
            </p>
          </div>
          <div
            className={cn(adminPanelClass, "hidden min-h-[280px] p-4 lg:block")}
          >
            <p className="mb-3 font-mono text-[10px] font-bold uppercase text-muted-foreground">
              Vista previa en vivo
            </p>
            <MarkdownContent content={value} />
          </div>
        </div>
      ) : (
        <div className={cn(adminPanelClass, "min-h-[280px] p-4")}>
          <MarkdownContent content={value} />
        </div>
      )}
    </div>
  );
}
