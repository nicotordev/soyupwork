"use client";

import { useState } from "react";
import {
  Award,
  CheckCircle,
  FileText,
  Laptop,
  MessageSquare,
  Target,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TRACK_CONFIG = {
  profile: {
    title: "Perfil y nicho",
    focus:
      "Define una especialidad vendible y ordena tu perfil para que comunique valor con claridad.",
    output:
      "Un perfil enfocado, con palabras clave, posicionamiento y una propuesta de servicios concreta.",
    icon: Target,
  },
  proposals: {
    title: "Propuestas",
    focus:
      "Aprende a leer proyectos, priorizar oportunidades y escribir mensajes cortos que abran conversaciones.",
    output:
      "Plantillas razonadas, ejemplos comentados y criterios para adaptar cada propuesta al cliente.",
    icon: FileText,
  },
  interviews: {
    title: "Entrevistas e ingles",
    focus:
      "Practica llamadas comerciales, preguntas frecuentes y respuestas para negociar sin improvisar.",
    output:
      "Guiones de entrevista, vocabulario util y estructura para presentar alcance, precio y siguientes pasos.",
    icon: MessageSquare,
  },
  operations: {
    title: "Operacion freelance",
    focus:
      "Ordena Connects, pricing, entrega, cobros y habitos de seguimiento para trabajar con mas criterio.",
    output:
      "Un sistema operativo simple para decidir donde aplicar, cuanto cobrar y como sostener la relacion.",
    icon: Laptop,
  },
};

type TrackKey = keyof typeof TRACK_CONFIG;

export function MarketingTrackSelectorClient() {
  const [selectedTrack, setSelectedTrack] = useState<TrackKey>("profile");
  const trackInfo = TRACK_CONFIG[selectedTrack];

  return (
    <section
      id="roi-calculator"
      className="relative z-10 overflow-x-hidden border-t border-border bg-card/10 py-14 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl space-y-4 text-center sm:mb-16">
          <Badge
            variant="outline"
            className="border-primary/20 text-primary font-mono"
          >
            ELIGE POR DONDE EMPEZAR
          </Badge>
          <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Cursos pensados para avanzar por problemas concretos
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Cada curso puede combinar video, texto, ejercicios, cuestionarios
            simples y progreso por leccion dentro del LMS.
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-6 rounded-xl border-2 border-border bg-card p-4 sm:p-6 lg:col-span-5">
            <h3 className="font-mono text-xs font-extrabold uppercase tracking-wider text-primary">
              1. SELECCIONA UNA RUTA
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-muted-foreground uppercase font-bold">
                Area de aprendizaje:
              </label>
              <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                {Object.entries(TRACK_CONFIG).map(([key, item]) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedTrack(key as TrackKey)}
                      className={`flex flex-col justify-between gap-1 rounded border p-3 text-left transition-all ${
                        selectedTrack === key
                          ? "bg-muted border-primary/45 text-foreground shadow-[2px_2px_0px_0px_var(--primary)]"
                          : "bg-background border-border text-muted-foreground hover:border-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="text-[11px] font-bold mt-1 leading-tight">
                        {item.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                Formato de curso
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Video className="h-3.5 w-3.5 text-primary" />
                  Video protegido
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  Texto guiado
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  Quizzes simples
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" />
                  Certificado basico
                </span>
              </div>
            </div>
          </div>

          <div className="relative min-w-0 lg:col-span-7">
            <div className="absolute -inset-1 rounded-xl bg-linear-to-r from-primary to-primary/80 opacity-10 blur-xl" />

            <div className="relative space-y-5 overflow-hidden rounded-xl border border-border bg-background p-4 shadow-2xl sm:space-y-6 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="bg-card border border-border p-4 rounded-lg">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase font-bold">
                    Ruta seleccionada
                  </p>
                  <h4 className="text-xl font-bold text-foreground mt-1">
                    {trackInfo.title}
                  </h4>
                </div>
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                  <p className="text-[10px] font-mono text-primary uppercase font-bold">
                    Modelo comercial
                  </p>
                  <h4 className="text-xl font-bold text-primary mt-1">
                    Pago por curso
                  </h4>
                </div>
              </div>

              <div className="bg-muted/40 border border-border p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase font-bold">
                    Enfoque del curso
                  </p>
                  <h3 className="mt-1 text-lg font-extrabold text-foreground sm:text-2xl">
                    {trackInfo.focus}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-3 font-semibold leading-relaxed">
                    {trackInfo.output}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 border-t border-border pt-2 sm:grid-cols-2 sm:gap-4">
                <div className="flex flex-col gap-1 rounded border border-border bg-card p-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Acceso protegido por compra:
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    Stripe
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded border border-primary/20 bg-primary/10 p-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[10px] font-mono font-bold text-primary">
                    Progreso por leccion:
                  </span>
                  <span className="text-xs font-black text-primary">
                    Incluido
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
