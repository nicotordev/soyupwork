"use client";

import React from "react";

export function CourseMarketingBento() {
  return (
    <div className="bg-background py-24 font-sans sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-base/7 font-semibold text-primary">
          Plataforma + metodologia
        </h2>
        <p className="mt-2 max-w-3xl text-4xl font-semibold tracking-tight text-pretty text-foreground sm:text-5xl">
          Todo lo que necesitas para competir mejor en Upwork
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          {/* Performance */}
          <div className="relative lg:col-span-3">
            <div className="absolute inset-0 rounded-lg bg-card max-lg:rounded-t-4xl lg:rounded-tl-4xl"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] border border-border bg-card max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
              <img
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-performance.png"
                alt="Panel de progreso y rendimiento de aprendizaje"
                className="h-80 object-cover object-left"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-primary">
                  Progreso visible
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-foreground">
                  Mide avance por modulo y por leccion
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-muted-foreground">
                  No estudias a ciegas. Sigues una ruta clara desde fundamentos,
                  propuestas y entrevistas hasta entrega profesional.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-border/60 max-lg:rounded-t-4xl lg:rounded-tl-4xl"></div>
          </div>

          {/* Releases */}
          <div className="relative lg:col-span-3">
            <div className="absolute inset-0 rounded-lg bg-card lg:rounded-tr-4xl"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] border border-border bg-card lg:rounded-tr-[calc(2rem+1px)]">
              <img
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-releases.png"
                alt="Lecciones y contenido actualizado de forma continua"
                className="h-80 object-cover object-left lg:object-right"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-primary">
                  Ejecucion real
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-foreground">
                  Menos teoria, mas decisiones aplicables
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-muted-foreground">
                  Cada bloque aterriza en acciones concretas para mejorar
                  perfil, leer jobs con criterio y enviar propuestas que
                  convierten.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-border/60 lg:rounded-tr-4xl"></div>
          </div>

          {/* Speed */}
          <div className="relative lg:col-span-2">
            <div className="absolute inset-0 rounded-lg bg-card lg:rounded-bl-4xl"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] border border-border bg-card lg:rounded-bl-[calc(2rem+1px)]">
              <img
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-speed.png"
                alt="Lecciones de Connects y priorizacion de proyectos"
                className="h-80 object-cover object-left"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-primary">
                  Connects con estrategia
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-foreground">
                  Aprende a priorizar y proteger presupuesto
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-muted-foreground">
                  Evita aplicar por impulso. Usa un sistema de seleccion para
                  elegir mejores oportunidades y aumentar tasa de respuesta.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-border/60 lg:rounded-bl-4xl"></div>
          </div>

          {/* Integrations */}
          <div className="relative lg:col-span-2">
            <div className="absolute inset-0 rounded-lg bg-card"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] border border-border bg-card">
              <img
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-integrations.png"
                alt="Modulos por nicho para asistentes virtuales, tech y creativos"
                className="h-80 object-cover"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-primary">
                  Adaptable a tu nicho
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-foreground">
                  Funciona para servicios tech, creativos y VA
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-muted-foreground">
                  No importa si eres asistente virtual, developer o editor:
                  ajustas frameworks de propuesta, pricing y seguimiento a tu
                  contexto.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-border/60"></div>
          </div>

          {/* Network */}
          <div className="relative lg:col-span-2">
            <div className="absolute inset-0 rounded-lg bg-card max-lg:rounded-b-4xl lg:rounded-br-4xl"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] border border-border bg-card max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]">
              <img
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-network.png"
                alt="Sistema de aprendizaje continuo para freelancers en LATAM"
                className="h-80 object-cover"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-primary">
                  Base para escalar
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-foreground">
                  De primer cliente a operacion sostenible
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-muted-foreground">
                  Construyes procesos para entrevistas, entrega y retencion, con
                  una estructura que te permite crecer sin improvisar.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-border/60 max-lg:rounded-b-4xl lg:rounded-br-4xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseMarketingBento;
