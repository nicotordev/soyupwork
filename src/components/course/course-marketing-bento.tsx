"use client";

import React from "react";

export function CourseMarketingBento() {
  const bentoItems = [
    {
      colSpan: "lg:col-span-3",
      image: "/img/courses/dashboard.webp",
      imgClass: "object-top",
      eyebrow: "Progreso visible",
      title: "Mide avance por módulo y por lección",
      description:
        "No estudias a ciegas. Sigues una ruta clara desde fundamentos, propuestas y entrevistas hasta entrega profesional.",
    },
    {
      colSpan: "lg:col-span-3",
      image: "/img/courses/lesson.webp",
      imgClass: "object-left lg:object-right",
      eyebrow: "Ejecución real",
      title: "Menos teoría, más decisiones aplicables",
      description:
        "Cada bloque aterriza en acciones concretas para mejorar perfil, leer jobs con criterio y enviar propuestas que convierten.",
    },
    {
      colSpan: "lg:col-span-2",
      image: "/img/courses/connects.webp",
      imgClass: "object-center",
      eyebrow: "Connects optimizados",
      title: "Convierte connects en oportunidades reales",
      description:
        "Aprende a invertir tus connects con criterio: selecciona cuándo, dónde y por qué postular, y maximiza tu retorno siguiendo un sistema validado.",
    },
    {
      colSpan: "lg:col-span-2",
      image: "/img/courses/pexels-zayed-hossain-52728970-36706459.webp",
      imgClass: "object-center",
      eyebrow: "Sirve para cualquier nicho Upwork",
      title: "Desde devs hasta asistentes virtuales y creativos",
      description:
        "Ajusta marcos de propuesta, filtros y precios sin importar tu rol: developer, freelancer creativo, asistente o consultor. Útil en jobs para principiantes o avanzados.",
    },
    {
      colSpan: "lg:col-span-2",
      image: "/img/courses/pexels-jakubzerdzicki-34975657.webp",
      imgClass: "object-center",
      eyebrow: "Escala tu operación freelance",
      title: "De primer job al flujo estable de clientes",
      description:
        "Construye un camino: desde landing page optimizada, entrega impecable y estructura de seguimiento sostenible. Escala paso a paso, reduce improvisación y mejora retención.",
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
