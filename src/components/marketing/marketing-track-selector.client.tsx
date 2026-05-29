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
      className="relative z-10 border-b-2 border-foreground bg-secondary/15 py-12 sm:pb-24 overflow-hidden font-sans"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl space-y-4 text-center sm:mb-16">
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 text-primary font-mono px-3 py-1 font-bold uppercase tracking-wider text-[10px]"
          >
            ELIGE POR DONDE EMPEZAR
          </Badge>
          <h2 className="text-2xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl tracking-tight">
            Cursos pensados para avanzar por problemas concretos
          </h2>
          <p className="mx-auto max-w-2xl text-sm font-semibold text-muted-foreground leading-relaxed">
            Cada curso puede combinar video, texto, ejercicios, cuestionarios
            simples y progreso por leccion dentro del LMS.
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col justify-between space-y-6 rounded-2xl border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_var(--foreground)] sm:p-8 lg:col-span-5 select-none">
            <div>
              <h3 className="font-mono text-xs font-black uppercase tracking-wider text-primary">
                1. SELECCIONA UNA RUTA
              </h3>

              <div className="mt-4 space-y-2.5">
                <label className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">
                  Area de aprendizaje:
                </label>
                <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                  {Object.entries(TRACK_CONFIG).map(([key, item]) => {
                    const Icon = item.icon;
                    const isActive = selectedTrack === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedTrack(key as TrackKey)}
                        className={`group flex flex-col justify-between gap-3 rounded-xl border-2 p-3.5 text-left transition-all cursor-pointer ${
                          isActive
                            ? "bg-primary text-primary-foreground border-foreground shadow-[3px_3px_0px_0px_var(--foreground)] -translate-x-0.5 -translate-y-0.5"
                            : "bg-background border-foreground/30 text-muted-foreground hover:border-foreground/60 hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <div className={`w-fit mx-auto p-1.5 rounded-lg border-2 inline-flex ${isActive ? "border-primary-foreground/35 bg-primary-foreground/10 text-primary-foreground" : "border-foreground/10 bg-muted text-muted-foreground group-hover:border-foreground/30 group-hover:text-foreground"}`}>
                          <Icon className="h-4 w-4 shrink-0 stroke-[2.5]" />
                        </div>
                        <span className="text-[12px] font-black leading-tight tracking-tight uppercase text-center">
                          {item.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-foreground bg-background p-4 mt-6">
              <p className="text-[10px] font-mono uppercase font-bold tracking-wider text-muted-foreground">
                Formato de curso
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] font-bold text-foreground">
                <span className="inline-flex items-center gap-2 hover:translate-x-0.5 transition-transform">
                  <span className="p-1 rounded-md border-2 border-foreground bg-primary/10 text-primary">
                    <Video className="h-3 w-3 stroke-[2.5]" />
                  </span>
                  Video protegido
                </span>
                <span className="inline-flex items-center gap-2 hover:translate-x-0.5 transition-transform">
                  <span className="p-1 rounded-md border-2 border-foreground bg-secondary text-foreground">
                    <FileText className="h-3 w-3 stroke-[2.5]" />
                  </span>
                  Texto guiado
                </span>
                <span className="inline-flex items-center gap-2 hover:translate-x-0.5 transition-transform">
                  <span className="p-1 rounded-md border-2 border-foreground bg-accent text-accent-foreground">
                    <CheckCircle className="h-3 w-3 stroke-[2.5]" />
                  </span>
                  Quizzes simples
                </span>
                <span className="inline-flex items-center gap-2 hover:translate-x-0.5 transition-transform">
                  <span className="p-1 rounded-md border-2 border-foreground bg-primary/20 text-primary">
                    <Award className="h-3 w-3 stroke-[2.5]" />
                  </span>
                  Certificado basico
                </span>
              </div>
            </div>
          </div>

          <div className="relative min-w-0 lg:col-span-7 flex flex-col justify-stretch">
            {/* Soft decorative neon glow behind */}
            <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-primary to-secondary opacity-15 blur-xl -z-10" />

            <div className="relative h-full flex flex-col justify-between space-y-6 overflow-hidden rounded-2xl border-2 border-foreground bg-background p-5 shadow-[6px_6px_0px_0px_var(--foreground)] sm:shadow-[8px_8px_0px_0px_var(--foreground)] sm:p-8 select-none">
              {/* Header metrics row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="bg-card border-2 border-foreground p-4.5 rounded-xl shadow-[3px_3px_0px_0px_var(--foreground)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_var(--foreground)]">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase font-black tracking-wider">
                    Ruta seleccionada
                  </p>
                  <h4 className="text-xl font-black text-foreground mt-1 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary animate-pulse" />
                    {trackInfo.title}
                  </h4>
                </div>
                <div className="bg-primary/5 border-2 border-primary/30 p-4.5 rounded-xl shadow-[3px_3px_0px_0px_var(--primary)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_var(--primary)]">
                  <p className="text-[10px] font-mono text-primary uppercase font-black tracking-wider">
                    Modelo comercial
                  </p>
                  <h4 className="text-xl font-black text-primary mt-1">
                    Pago por curso
                  </h4>
                </div>
              </div>

              {/* Main content display box */}
              <div className="bg-muted border-2 border-foreground p-5 rounded-xl shadow-[4px_4px_0px_0px_var(--foreground)] flex-1 flex flex-col justify-center">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase font-black tracking-wider">
                    Enfoque del curso
                  </p>
                  <h3 className="mt-2 text-lg font-black text-foreground sm:text-2xl leading-snug tracking-tight">
                    {trackInfo.focus}
                  </h3>
                  <div className="mt-4 border-t-2 border-dotted border-foreground/20 pt-4">
                    <p className="text-[10px] font-mono text-primary uppercase font-black tracking-wider">
                      Resultado entregable
                    </p>
                    <p className="text-xs text-foreground/80 mt-1.5 font-semibold leading-relaxed">
                      {trackInfo.output}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer specs row */}
              <div className="grid grid-cols-1 gap-3 border-t-2 border-foreground pt-4 sm:grid-cols-2 sm:gap-4">
                <div className="flex flex-row items-center justify-between gap-3 rounded-lg border-2 border-foreground bg-card p-3 shadow-[2px_2px_0px_0px_var(--foreground)]">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                    Acceso:
                  </span>
                  <span className="text-xs font-black text-foreground bg-secondary px-2.5 py-0.5 rounded border border-foreground shadow-[1px_1px_0px_0px_var(--foreground)]">
                    Stripe
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between gap-3 rounded-lg border-2 border-primary bg-primary/10 p-3 shadow-[2px_2px_0px_0px_var(--primary)]">
                  <span className="text-[10px] font-mono font-bold text-primary uppercase">
                    Progreso:
                  </span>
                  <span className="text-xs font-black text-primary bg-background px-2.5 py-0.5 rounded border border-primary shadow-[1px_1px_0px_0px_var(--primary)]">
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
