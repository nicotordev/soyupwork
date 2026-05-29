"use client";

import React from "react";

export function CourseMarketingBento() {
  const bentoItems = [
    {
      colSpan: "lg:col-span-3",
      image: "https://tailwindcss.com/plus-assets/img/component-images/bento-01-performance.png",
      imgClass: "object-left",
      eyebrow: "Progreso visible",
      title: "Mide avance por módulo y por lección",
      description: "No estudias a ciegas. Sigues una ruta clara desde fundamentos, propuestas y entrevistas hasta entrega profesional.",
    },
    {
      colSpan: "lg:col-span-3",
      image: "https://tailwindcss.com/plus-assets/img/component-images/bento-01-releases.png",
      imgClass: "object-left lg:object-right",
      eyebrow: "Ejecución real",
      title: "Menos teoría, más decisiones aplicables",
      description: "Cada bloque aterriza en acciones concretas para mejorar perfil, leer jobs con criterio y enviar propuestas que convierten.",
    },
    {
      colSpan: "lg:col-span-2",
      image: "https://tailwindcss.com/plus-assets/img/component-images/bento-01-speed.png",
      imgClass: "object-left",
      eyebrow: "Connects con estrategia",
      title: "Aprende a priorizar y proteger presupuesto",
      description: "Evita aplicar por impulso. Usa un sistema de selección para elegir mejores oportunidades y aumentar tasa de respuesta.",
    },
    {
      colSpan: "lg:col-span-2",
      image: "https://tailwindcss.com/plus-assets/img/component-images/bento-01-integrations.png",
      imgClass: "object-center",
      eyebrow: "Adaptable a tu nicho",
      title: "Funciona para servicios tech, creativos y VA",
      description: "No importa si eres asistente virtual, developer o editor: ajustas frameworks de propuesta, pricing y seguimiento a tu contexto.",
    },
    {
      colSpan: "lg:col-span-2",
      image: "https://tailwindcss.com/plus-assets/img/component-images/bento-01-network.png",
      imgClass: "object-center",
      eyebrow: "Base para escalar",
      title: "De primer cliente a operación sostenible",
      description: "Construyes procesos para entrevistas, entrega y retención, con una estructura que te permite crecer sin improvisar.",
    },
  ];

  return (
    <div className="bg-background py-16 font-sans sm:py-24">
      <div className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
        <span className="rounded-full border-2 border-foreground bg-primary/10 px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-primary shadow-[2px_2px_0px_0px_var(--foreground)]">
          Plataforma + metodología
        </span>
        <h2 className="mt-4 max-w-3xl text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
          Todo lo que necesitas para competir mejor en Upwork
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-12 lg:grid-cols-6">
          {bentoItems.map((item, idx) => (
            <div key={idx} className={`relative ${item.colSpan}`}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--foreground)] sm:shadow-[6px_6px_0px_0px_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--foreground)] sm:hover:shadow-[8px_8px_0px_0px_var(--foreground)] transition-all">
                <div className="w-full overflow-hidden border-b-2 border-foreground bg-muted/30">
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`h-56 sm:h-64 w-full object-cover ${item.imgClass}`}
                  />
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {item.eyebrow}
                    </h3>
                    <p className="mt-1.5 text-base sm:text-lg font-black tracking-tight text-foreground leading-snug">
                      {item.title}
                    </p>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseMarketingBento;

