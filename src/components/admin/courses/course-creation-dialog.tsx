"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCategories from "@/hooks/use-categories";
import {
  adminBrutalButtonClass,
  adminInputClass,
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconLoader,
  IconPlus,
  IconSchool,
  IconSparkles,
  IconTrash,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type CourseCreationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Step = 1 | 2 | 3 | 4;

export function CourseCreationDialog({
  isOpen,
  onClose,
}: CourseCreationDialogProps) {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  const {
    categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useCategories();

  // Form State
  const [title, setTitle] = useState("");
  // Default to first category if available, otherwise fallback to arbitrary default
  const [category, setCategory] = useState<string>("");
  const [level, setLevel] = useState("BEGINNER");
  const [price, setPrice] = useState("99");
  const [prompt, setPrompt] = useState("");

  // Update category once categories are loaded
  // This will update the selected category to the first option once categories arrive
  // But it will not override user's selection after the user already changed it
  useEffect(() => {
    if (
      Array.isArray(categories) &&
      categories.length > 0 &&
      !category &&
      !isLoadingCategories
    ) {
      setCategory(String(categories[0]?.name ?? ""));
    }
  }, [categories, isLoadingCategories]);

  // Generated Syllabus State
  const [syllabus, setSyllabus] = useState<
    { id: string; title: string; lessons: string[] }[]
  >([
    {
      id: "mod-1",
      title: "Módulo 1: Fundamentos del Freelancing",
      lessons: [
        "Introducción a Upwork",
        "Configurando un Perfil Estelar",
        "Búsqueda Eficiente de Proyectos",
      ],
    },
    {
      id: "mod-2",
      title: "Módulo 2: Propuestas Irresistibles",
      lessons: [
        "Anatomía de una Propuesta Ganadora",
        "Técnicas de Pricing",
        "Manejo del Primer Mensaje",
      ],
    },
  ]);

  const handleNext = () => {
    if (step === 1) {
      // Simulate AI generation loading
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(2);
      }, 1500);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(4);
      }, 1200);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const handleReset = () => {
    setTitle("");
    setPrompt("");
    setStep(1);
    onClose();
  };

  const addLesson = (moduleIndex: number) => {
    const updated = [...syllabus];
    updated[moduleIndex].lessons.push("Nueva Lección Autogenerada");
    setSyllabus(updated);
  };

  const deleteLesson = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...syllabus];
    updated[moduleIndex].lessons.splice(lessonIndex, 1);
    setSyllabus(updated);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={cn(
            adminPanelClass,
            "w-full max-w-2xl bg-background border-2 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] overflow-hidden",
          )}
        >
          {/* Header */}
          <div className={adminPanelHeaderClass}>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded border border-foreground bg-secondary">
                <IconSparkles className="size-4 text-primary" stroke={2.5} />
              </span>
              <h3 className={adminPanelTitleClass}>
                Asistente de Creación Rápida AI
              </h3>
            </div>
            <button
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground font-mono text-xs font-bold uppercase"
            >
              [Cerrar]
            </button>
          </div>

          {/* Stepper Progress */}
          <div className="px-6 py-3 border-b-2 border-foreground bg-muted/35 flex justify-between items-center font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <span className={cn(step >= 1 && "text-foreground font-extrabold")}>
              1. Concepto
            </span>
            <IconArrowRight className="size-3" />
            <span className={cn(step >= 2 && "text-foreground font-extrabold")}>
              2. Temario AI
            </span>
            <IconArrowRight className="size-3" />
            <span className={cn(step >= 3 && "text-foreground font-extrabold")}>
              3. Detalles
            </span>
            <IconArrowRight className="size-3" />
            <span className={cn(step >= 4 && "text-foreground font-extrabold")}>
              4. ¡Listo!
            </span>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <IconLoader
                  className="size-10 animate-spin text-primary"
                  stroke={2.5}
                />
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground animate-pulse text-center">
                  Generando temario y optimizando módulos con Inteligencia
                  Artificial...
                </p>
              </div>
            ) : (
              <>
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <label className="font-mono text-xs font-bold uppercase">
                        Título del Curso
                      </label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ej. Dominando Upwork en 30 Días"
                        className={adminInputClass}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="font-mono text-xs font-bold uppercase">
                          Categoría
                        </label>
                        {isLoadingCategories ? (
                          <div className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted animate-pulse">
                            Cargando categorías...
                          </div>
                        ) : isErrorCategories ? (
                          <div className="text-xs text-destructive px-2 py-1 rounded bg-muted">
                            Error al cargar categorías
                          </div>
                        ) : (
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={cn(
                              adminInputClass,
                              "w-full h-8 px-2 text-xs font-mono font-bold uppercase bg-background rounded-md border-2 border-foreground",
                            )}
                          >
                            {(categories ?? []).length ? (
                              categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                  {cat.name}
                                </option>
                              ))
                            ) : (
                              // Fallback for no categories
                              <option value="" disabled>
                                Sin categorías
                              </option>
                            )}
                          </select>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-xs font-bold uppercase">
                          Prompt Creativo de IA
                        </label>
                        <Input
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Ej. Enfocar el curso en propuestas de nicho técnico..."
                          className={adminInputClass}
                        />
                      </div>
                    </div>

                    <div className="rounded border-2 border-foreground bg-primary/10 p-4 space-y-2">
                      <p className="text-xs text-foreground font-semibold flex items-center gap-1.5">
                        <IconSparkles
                          className="size-4 shrink-0 text-primary"
                          stroke={2.5}
                        />
                        ¿Cómo funciona la autogeneración?
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Nuestro modelo estructurará automáticamente el curso en
                        módulos lógicos, definirá lecciones sugeridas y
                        preparará objetivos de estudio basados en las últimas
                        tendencias de Upwork.
                      </p>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between border-b-2 border-foreground pb-2">
                      <h4 className="font-heading text-sm font-extrabold">
                        Temario Estructurado por IA
                      </h4>
                      <span className="font-mono text-[9px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">
                        Optimizado
                      </span>
                    </div>

                    <div className="space-y-4">
                      {syllabus.map((mod, modIdx) => (
                        <div
                          key={mod.id}
                          className="border-2 border-foreground rounded p-3 bg-muted/10 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold uppercase">
                              {mod.title}
                            </span>
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => addLesson(modIdx)}
                              className={cn(
                                adminBrutalButtonClass,
                                "text-[9px] font-mono font-bold uppercase",
                              )}
                            >
                              <IconPlus className="size-2.5" />
                              Clase
                            </Button>
                          </div>

                          <ul className="space-y-1.5">
                            {mod.lessons.map((lesson, lesIdx) => (
                              <li
                                key={lesIdx}
                                className="flex items-center justify-between gap-2 bg-background border border-foreground/35 px-2.5 py-1 rounded text-xs"
                              >
                                <span className="font-mono text-muted-foreground">
                                  {lesIdx + 1}. {lesson}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => deleteLesson(modIdx, lesIdx)}
                                  className="text-destructive hover:text-destructive/80 transition-colors"
                                >
                                  <IconTrash className="size-3.5" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="font-mono text-xs font-bold uppercase">
                          Nivel Sugerido
                        </label>
                        <select
                          value={level}
                          onChange={(e) => setLevel(e.target.value)}
                          className={cn(
                            adminInputClass,
                            "w-full h-8 px-2 text-xs font-mono font-bold uppercase bg-background rounded-md border-2 border-foreground",
                          )}
                        >
                          <option value="BEGINNER">Principiante</option>
                          <option value="INTERMEDIATE">Intermedio</option>
                          <option value="ADVANCED">Avanzado</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-xs font-bold uppercase">
                          Precio (USD)
                        </label>
                        <Input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className={adminInputClass}
                        />
                      </div>
                    </div>

                    <div className="border-2 border-foreground rounded p-4 bg-secondary/15 flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded border-2 border-foreground bg-background shadow-[2px_2px_0px_0px_var(--foreground)]">
                        <IconSchool
                          className="size-5 text-primary"
                          stroke={2.5}
                        />
                      </span>
                      <div className="space-y-1">
                        <p className="text-xs font-bold font-mono uppercase">
                          Emisión de Certificado
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Habilita la emisión automática de diplomas digitales
                          con firma verificada al completarse el 100% de las
                          lecciones.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-4"
                  >
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full border-4 border-emerald-500 bg-emerald-100 text-emerald-600 shadow-[4px_4px_0px_0px_var(--foreground)]">
                      <IconCheck className="size-8" stroke={3} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-heading text-xl font-extrabold tracking-tight">
                        ¡Curso Creado Exitosamente!
                      </h4>
                      <p className="max-w-md mx-auto text-xs text-muted-foreground">
                        El temario interactivo estructurado de{" "}
                        <strong className="text-foreground">
                          {title || "Dominando Upwork"}
                        </strong>{" "}
                        ha sido agregado al listado en estado{" "}
                        <strong className="text-foreground">Borrador</strong>.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={handleReset}
                      className={cn(
                        adminBrutalButtonClass,
                        "mt-2 bg-secondary text-foreground",
                      )}
                    >
                      Volver a la Lista
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Footer Controls */}
          {step < 4 && !loading && (
            <div className="px-6 py-4 border-t-2 border-foreground bg-muted/20 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={step === 1 ? handleReset : handleBack}
                className={adminBrutalButtonClass}
              >
                <IconArrowLeft className="size-3.5" />
                {step === 1 ? "Cancelar" : "Atrás"}
              </Button>

              <Button
                size="sm"
                onClick={handleNext}
                className={cn(
                  adminBrutalButtonClass,
                  "bg-primary text-primary-foreground",
                )}
              >
                {step === 1
                  ? "Diseñar con IA"
                  : step === 3
                    ? "Crear Curso"
                    : "Siguiente"}
                <IconArrowRight className="size-3.5" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
