"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { navSections } from "@/data/nav-data";
import {
  IconBrandLinkedin,
  IconBrandYoutube,
  IconBrandX,
  IconBrandGithub,
  IconArrowRight,
  IconCheck,
  IconSparkles,
} from "@tabler/icons-react";

export function MarketingFooter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Por favor, ingresa un correo válido.");
      return;
    }
    setError("");
    setIsLoading(true);

    // Simulate standard registration network time
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsLoading(false);
    setIsSubmitted(true);
    setEmail("");
  };

  // Extra legal/company links not present in headers
  const companyLinks = [
    { title: "Términos de Servicio", href: "/terminos" },
    { title: "Política de Privacidad", href: "/privacidad" },
    { title: "Política de Reembolsos", href: "/reembolsos" },
    { title: "Soporte y Contacto", href: "/contacto" },
  ];

  return (
    <footer className="w-full border-t-4 border-foreground bg-background text-foreground transition-colors duration-200">
      {/* Top Banner (Neo-brutalist CTA / Promo marquee-like section) */}
      <div className="border-b-4 border-foreground bg-secondary px-4 py-4 md:py-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <p className="font-mono text-xs md:text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <IconSparkles className="h-4 w-4 text-primary animate-spin" style={{ animationDuration: "3s" }} />
              ¿Listo para dar el salto freelance internacional?
            </p>
          </div>
          <Link
            href="/catalog"
            className="group flex items-center gap-2 border-2 border-foreground bg-background px-4 py-2 font-mono text-xs md:text-sm font-black uppercase shadow-[3px_3px_0px_0px_var(--foreground)] rounded transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_var(--foreground)] active:translate-y-[3px] active:shadow-none"
          >
            Explorar Cursos
            <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Info & Newsletter */}
          <div className="space-y-8 xl:col-span-1">
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-block font-heading text-xl font-black tracking-tight border-3 border-foreground bg-secondary px-4 py-1.5 shadow-[3px_3px_0px_0px_var(--foreground)] rounded-md transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_var(--foreground)] active:translate-y-[3px]"
              >
                SoyUpwork
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs font-medium">
                Formación práctica y comunidad para freelancers de habla hispana que quieren vender en Upwork y cerrar clientes en inglés.
              </p>
            </div>

            {/* Premium Interactive Newsletter Input */}
            <div className="border-3 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_var(--foreground)] rounded-lg">
              <h3 className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground mb-1">
                Tácticas semanales
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Únete a freelancers que ya reciben consejos prácticos directamente en su correo.
              </p>

              {isSubmitted ? (
                <div className="flex items-center gap-2.5 border-2 border-foreground bg-primary/10 p-3 rounded font-mono text-xs font-bold text-primary">
                  <IconCheck className="h-4 w-4 stroke-[3]" />
                  <span>¡Te has registrado con éxito! Revisa tu buzón.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      disabled={isLoading}
                      className={cn(
                        "w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-medium rounded shadow-[2px_2px_0px_0px_var(--foreground)] transition-all",
                        "focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_var(--foreground)]",
                        error && "border-destructive text-destructive focus:ring-destructive"
                      )}
                    />
                  </div>
                  {error && <p className="text-xs font-mono font-bold text-destructive">{error}</p>}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 border-2 border-foreground bg-primary text-primary-foreground font-mono text-xs font-black uppercase py-2.5 rounded shadow-[3px_3px_0px_0px_var(--foreground)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_var(--foreground)] active:translate-y-[3px] active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Registrando..." : "¡Quiero vender más!"}
                  </button>
                </form>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 border-2 border-foreground bg-background hover:bg-secondary rounded shadow-[2px_2px_0px_0px_var(--foreground)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:translate-y-[2px]"
                aria-label="LinkedIn"
              >
                <IconBrandLinkedin className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 border-2 border-foreground bg-background hover:bg-secondary rounded shadow-[2px_2px_0px_0px_var(--foreground)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:translate-y-[2px]"
                aria-label="YouTube"
              >
                <IconBrandYoutube className="h-5 w-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 border-2 border-foreground bg-background hover:bg-secondary rounded shadow-[2px_2px_0px_0px_var(--foreground)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:translate-y-[2px]"
                aria-label="Twitter/X"
              >
                <IconBrandX className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 border-2 border-foreground bg-background hover:bg-secondary rounded shadow-[2px_2px_0px_0px_var(--foreground)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:translate-y-[2px]"
                aria-label="GitHub"
              >
                <IconBrandGithub className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 md:grid-cols-4">
            {/* Dynamic sections from nav-data */}
            {navSections.map((section) => (
              <div key={section.label} className="space-y-4">
                <h4 className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground/80 border-b-2 border-dashed border-foreground/30 pb-2">
                  {section.label}
                </h4>
                <ul className="space-y-2.5">
                  {section.items.slice(0, 6).map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hover:underline decoration-primary decoration-2 underline-offset-4"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Additional Legal/Company links column */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground/80 border-b-2 border-dashed border-foreground/30 pb-2">
                Compañía
              </h4>
              <ul className="space-y-2.5">
                {companyLinks.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hover:underline decoration-primary decoration-2 underline-offset-4"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
                </ul>
              </div>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="mt-12 border-t-2 border-foreground pt-8 md:flex md:items-center md:justify-between gap-4">
          <p className="text-xs font-mono font-bold text-muted-foreground">
            &copy; {new Date().getFullYear()} SoyUpwork. Todos los derechos reservados.
          </p>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center gap-1.5 border-2 border-foreground bg-secondary px-3 py-1 font-mono text-[10px] md:text-xs font-extrabold uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--foreground)] rounded">
              Hecho en LATAM 🇨🇱/🌎
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
