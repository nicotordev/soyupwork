"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const navSections = [
  {
    label: "Catálogo",
    items: [
      {
        title: "Todos los cursos",
        href: "/catalog",
        description: "Explora el catálogo completo",
      },
      {
        title: "Cursos destacados",
        href: "/catalog?featured=true",
        description: "Lo más popular ahora",
      },
      {
        title: "Nuevos lanzamientos",
        href: "/catalog?sort=new",
        description: "Contenido recién publicado",
      },
    ],
  },
  {
    label: "Recursos",
    items: [
      {
        title: "Guías",
        href: "/recursos/guias",
        description: "Material práctico para freelancers",
      },
      {
        title: "Plantillas",
        href: "/recursos/plantillas",
        description: "Propuestas y documentos listos",
      },
      {
        title: "Blog",
        href: "/recursos/blog",
        description: "Artículos y novedades",
      },
    ],
  },
  {
    label: "Comunidad",
    items: [
      {
        title: "Foro",
        href: "/comunidad/foro",
        description: "Pregunta y comparte experiencias",
      },
      {
        title: "Eventos",
        href: "/comunidad/eventos",
        description: "Sesiones en vivo y workshops",
      },
      {
        title: "Historias",
        href: "/comunidad/historias",
        description: "Casos de éxito de alumnos",
      },
    ],
  },
  {
    label: "Precios",
    items: [
      {
        title: "Planes",
        href: "/precios",
        description: "Compara opciones de acceso",
      },
      {
        title: "Empresas",
        href: "/precios/empresas",
        description: "Formación para equipos",
      },
      {
        title: "Preguntas frecuentes",
        href: "/precios#faq",
        description: "Dudas sobre pagos y acceso",
      },
    ],
  },
] as const;

function NavDropdownContent({
  items,
}: {
  items: (typeof navSections)[number]["items"];
}) {
  return (
    <ul className="grid gap-1 p-2 md:w-80">
      {items.map((item) => (
        <li key={item.href}>
          <NavigationMenuLink asChild>
            <Link href={item.href}>
              <span className="font-medium">{item.title}</span>
              <span className="text-muted-foreground">{item.description}</span>
            </Link>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  );
}

function DesktopNav() {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {navSections.map((section) => (
          <NavigationMenuItem key={section.label}>
            <NavigationMenuTrigger>{section.label}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavDropdownContent items={section.items} />
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon">
          <IconMenu2 />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>SoyUpwork</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-6">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-2">
              <p className="text-sm font-semibold">{section.label}</p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="flex flex-col gap-2 border-t pt-4">
            <Button variant="outline" asChild>
              <Link href="/sign-in">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Registrarse</Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-200",
        scrolled &&
          "border-b bg-background/95 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/80",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-lg font-semibold tracking-tight"
        >
          SoyUpwork
        </Link>

        <div className="flex flex-1 justify-center">
          <DesktopNav />
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="outline" asChild>
            <Link href="/sign-in">Iniciar sesión</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Registrarse</Link>
          </Button>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
