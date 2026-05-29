import { AuthIllustration } from "@/components/auth/auth-illustration";
import Link from "next/link";

type AuthSplitVariant = "sign-in" | "sign-up" | "sign-out";

const panelCopy: Record<
  AuthSplitVariant,
  { eyebrow: string; title: string; description: string }
> = {
  "sign-in": {
    eyebrow: "Acceso estudiantes",
    title: "Retoma donde lo dejaste",
    description:
      "Tus cursos, progreso y certificados siguen esperándote en tu panel.",
  },
  "sign-up": {
    eyebrow: "Nueva cuenta",
    title: "Empieza a aprender hoy",
    description:
      "Crea tu perfil y desbloquea el catálogo, compras y tu ruta de aprendizaje.",
  },
  "sign-out": {
    eyebrow: "Cerrar sesión",
    title: "Hasta pronto",
    description:
      "Tu progreso queda guardado. Podés volver cuando quieras retomar tus cursos.",
  },
};

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  variant: AuthSplitVariant;
}

export function AuthSplitLayout({ children, variant }: AuthSplitLayoutProps) {
  const copy = panelCopy[variant];

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <aside className="relative flex w-full flex-col justify-between overflow-hidden border-b-2 border-foreground bg-primary text-primary-foreground lg:min-h-screen lg:w-1/2 lg:border-b-0 lg:border-r-2">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--primary-foreground)_1px,transparent_1px),linear-gradient(to_bottom,var(--primary-foreground)_1px,transparent_1px)] bg-size-[3rem_3rem] opacity-[0.08]"
          aria-hidden
        />

        <div className="relative z-10 flex flex-1 flex-col p-6 sm:p-10 lg:p-12">
          <Link
            href="/"
            className="inline-flex w-fit shrink-0 items-center rounded border-2 border-primary-foreground bg-primary-foreground/10 px-3 py-1 font-heading text-sm font-extrabold tracking-tight text-primary-foreground shadow-[2px_2px_0px_0px_var(--primary-foreground)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_var(--primary-foreground)]"
          >
            SoyUpwork
          </Link>

          <div className="mt-10 max-w-md space-y-4 lg:mt-16">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary-foreground/90">
              {copy.eyebrow}
            </p>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
              {copy.title}
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/90 sm:text-base">
              {copy.description}
            </p>
          </div>

          <div className="mt-10 flex flex-1 items-end justify-center pb-4 lg:mt-8 lg:pb-8">
            <AuthIllustration className="h-auto w-full max-w-md text-primary-foreground" />
          </div>
        </div>
      </aside>

      <main className="flex w-full flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:w-1/2 lg:px-12 lg:py-16">
        <div className="w-full max-w-104">{children}</div>
      </main>
    </div>
  );
}
