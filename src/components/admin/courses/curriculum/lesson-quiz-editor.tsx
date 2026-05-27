"use client";

import { upsertLessonQuiz } from "@/app/actions/curriculum.actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ADMIN_CURRICULUM_PAGE } from "@/constants/curriculum.constants";
import {
  adminBrutalButtonClass,
  adminInputClass,
  adminPanelClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { AdminCurriculumQuiz } from "@/types/admin-curriculum.types";
import {
  IconChevronDown,
  IconChevronUp,
  IconDeviceFloppy,
  IconLoader,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "@/lib/toast";

type DraftOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type DraftQuestion = {
  id: string;
  question: string;
  options: DraftOption[];
};

type LessonQuizEditorProps = {
  lessonId: string;
  courseId: string;
  lessonTitle: string;
  quiz: AdminCurriculumQuiz | null;
  canPersist: boolean;
};

function createEmptyOption(): DraftOption {
  return {
    id: crypto.randomUUID(),
    text: "",
    isCorrect: false,
  };
}

function createEmptyQuestion(): DraftQuestion {
  return {
    id: crypto.randomUUID(),
    question: "",
    options: [createEmptyOption(), createEmptyOption()],
  };
}

function mapQuizToDraft(quiz: AdminCurriculumQuiz): {
  title: string;
  description: string;
  passingScore: number;
  questions: DraftQuestion[];
} {
  return {
    title: quiz.title,
    description: quiz.description,
    passingScore: quiz.passingScore,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text,
        isCorrect: option.isCorrect,
      })),
    })),
  };
}

export function LessonQuizEditor({
  lessonId,
  courseId,
  lessonTitle,
  quiz,
  canPersist,
}: LessonQuizEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const initial = quiz
    ? mapQuizToDraft(quiz)
    : {
        title: lessonTitle,
        description: "",
        passingScore: 70,
        questions: [] as DraftQuestion[],
      };

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [passingScore, setPassingScore] = useState(initial.passingScore);
  const [questions, setQuestions] = useState<DraftQuestion[]>(
    initial.questions,
  );

  const correctCount = useMemo(
    () =>
      questions.reduce(
        (total, question) =>
          total + question.options.filter((option) => option.isCorrect).length,
        0,
      ),
    [questions],
  );

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= questions.length) return;

    setQuestions((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
  };

  const removeQuestion = (index: number) => {
    if (!window.confirm("¿Eliminar esta pregunta y todas sus opciones?")) {
      return;
    }

    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index: number, value: string) => {
    setQuestions((prev) =>
      prev.map((question, i) =>
        i === index ? { ...question, question: value } : question,
      ),
    );
  };

  const addOption = (questionIndex: number) => {
    setQuestions((prev) =>
      prev.map((question, i) => {
        if (i !== questionIndex || question.options.length >= 6) {
          return question;
        }
        return {
          ...question,
          options: [...question.options, createEmptyOption()],
        };
      }),
    );
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((question, i) => {
        if (i !== questionIndex || question.options.length <= 2) {
          return question;
        }
        return {
          ...question,
          options: question.options.filter((_, j) => j !== optionIndex),
        };
      }),
    );
  };

  const updateOptionText = (
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    setQuestions((prev) =>
      prev.map((question, i) => {
        if (i !== questionIndex) return question;
        return {
          ...question,
          options: question.options.map((option, j) =>
            j === optionIndex ? { ...option, text: value } : option,
          ),
        };
      }),
    );
  };

  const toggleOptionCorrect = (questionIndex: number, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((question, i) => {
        if (i !== questionIndex) return question;
        return {
          ...question,
          options: question.options.map((option, j) =>
            j === optionIndex
              ? { ...option, isCorrect: !option.isCorrect }
              : option,
          ),
        };
      }),
    );
  };

  const handleSave = () => {
    if (!canPersist) {
      toast.error(
        "Guarda la lección con tipo Quiz antes de guardar el cuestionario.",
      );
      return;
    }

    if (questions.length === 0) {
      toast.error("Añade al menos una pregunta antes de guardar.");
      return;
    }

    for (const [index, question] of questions.entries()) {
      if (!question.question.trim()) {
        toast.error(`La pregunta ${index + 1} no puede estar vacía.`);
        return;
      }

      if (question.options.length < 2) {
        toast.error(`La pregunta ${index + 1} necesita al menos 2 opciones.`);
        return;
      }

      const hasEmptyOption = question.options.some(
        (option) => !option.text.trim(),
      );
      if (hasEmptyOption) {
        toast.error(`Completa todas las opciones de la pregunta ${index + 1}.`);
        return;
      }

      if (!question.options.some((option) => option.isCorrect)) {
        toast.error(
          `Marca al menos una respuesta correcta en la pregunta ${index + 1}.`,
        );
        return;
      }
    }

    startTransition(async () => {
      const result = await upsertLessonQuiz({
        lessonId,
        courseId,
        title: title.trim(),
        description: description.trim() || undefined,
        passingScore,
        questions: questions.map((question) => ({
          id: question.id,
          question: question.question.trim(),
          options: question.options.map((option) => ({
            id: option.id,
            text: option.text.trim(),
            isCorrect: option.isCorrect,
          })),
        })),
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Quiz guardado");
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <p className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
        {ADMIN_CURRICULUM_PAGE.quizEditorTitle}
      </p>

      {!canPersist ? (
        <p className="rounded border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-100">
          Guarda la lección con tipo Quiz antes de guardar el cuestionario.
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`quiz-title-${lessonId}`}>Título del quiz</Label>
          <Input
            id={`quiz-title-${lessonId}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={adminInputClass}
            required
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`quiz-desc-${lessonId}`}>Descripción</Label>
          <Textarea
            id={`quiz-desc-${lessonId}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={cn(adminInputClass, "min-h-16 resize-y")}
            rows={2}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`quiz-passing-${lessonId}`}>
            {ADMIN_CURRICULUM_PAGE.quizPassingScoreLabel}
          </Label>
          <Input
            id={`quiz-passing-${lessonId}`}
            type="number"
            min={0}
            max={100}
            value={passingScore}
            onChange={(e) =>
              setPassingScore(
                Math.min(100, Math.max(0, Number(e.target.value) || 0)),
              )
            }
            className={adminInputClass}
          />
        </div>
      </div>

      <p className="font-mono text-[10px] text-muted-foreground">
        {ADMIN_CURRICULUM_PAGE.quizQuestionsSummary(questions.length)} ·{" "}
        {correctCount === 1
          ? "1 opción correcta marcada"
          : `${correctCount} opciones correctas marcadas`}
      </p>

      <div className="space-y-4">
        {questions.map((question, questionIndex) => (
          <div
            key={question.id}
            className={cn(
              adminPanelClass,
              "space-y-4 border-2 border-foreground p-4 bg-card/25 shadow-[3px_3px_0px_0px_var(--foreground)] hover:shadow-[4px_4px_0px_0px_var(--foreground)] transition-all duration-300 rounded-lg",
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-foreground/10 pb-2">
              <span className="font-mono text-[10px] font-extrabold uppercase text-primary bg-primary/10 border border-primary/20 rounded px-2.5 py-0.5">
                Pregunta {questionIndex + 1}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={questionIndex === 0}
                  className="hover:bg-secondary transition-colors"
                  onClick={() => moveQuestion(questionIndex, "up")}
                  aria-label="Subir pregunta"
                >
                  <IconChevronUp stroke={2.5} className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={questionIndex >= questions.length - 1}
                  className="hover:bg-secondary transition-colors"
                  onClick={() => moveQuestion(questionIndex, "down")}
                  aria-label="Bajar pregunta"
                >
                  <IconChevronDown stroke={2.5} className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={() => removeQuestion(questionIndex)}
                  aria-label="Eliminar pregunta"
                >
                  <IconTrash stroke={2.5} className="size-3.5" />
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`quiz-q-${question.id}`} className="font-bold text-xs uppercase tracking-tight font-mono text-muted-foreground">Enunciado de la pregunta</Label>
              <Textarea
                id={`quiz-q-${question.id}`}
                value={question.question}
                onChange={(e) =>
                  updateQuestionText(questionIndex, e.target.value)
                }
                className={cn(
                  adminInputClass,
                  "min-h-14 resize-y font-heading font-extrabold tracking-tight text-sm transition-all duration-200",
                  "focus-visible:bg-background/90"
                )}
                rows={2}
                placeholder="Escribe la pregunta…"
              />
            </div>

            <div className="space-y-3">
              <p className="font-mono text-[9px] font-extrabold uppercase text-muted-foreground tracking-wider">
                Opciones de respuesta
              </p>
              <div className="space-y-2.5">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={option.id}
                    className={cn(
                      "flex flex-wrap items-center gap-3 p-2 rounded-md border-2 border-transparent transition-all duration-200",
                      option.isCorrect
                        ? "border-emerald-500 bg-emerald-500/5 shadow-[2px_2px_0px_0px_var(--foreground)]"
                        : "bg-muted/10 border-foreground/10 hover:border-foreground/30"
                    )}
                  >
                    <span className={cn(
                      "font-mono text-xs font-black rounded-sm size-6 flex items-center justify-center border-2 border-foreground select-none",
                      option.isCorrect
                        ? "bg-emerald-500 text-white shadow-[1px_1px_0px_0px_var(--foreground)]"
                        : "bg-secondary text-foreground"
                    )}>
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <Input
                      value={option.text}
                      onChange={(e) =>
                        updateOptionText(
                          questionIndex,
                          optionIndex,
                          e.target.value,
                        )
                      }
                      className={cn(
                        adminInputClass,
                        "min-w-[180px] flex-1 h-8 text-xs font-medium",
                        option.isCorrect && "border-emerald-500/60 focus-visible:border-emerald-500 focus-visible:shadow-[2px_2px_0px_0px_var(--foreground)]"
                      )}
                      placeholder={`Escribe la opción ${optionIndex + 1}`}
                    />
                    <label className={cn(
                      "flex shrink-0 cursor-pointer items-center gap-1.5 rounded border border-foreground/20 px-2 py-1 text-xs select-none transition-colors",
                      option.isCorrect
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                        : "hover:bg-muted/30"
                    )}>
                      <Checkbox
                        checked={option.isCorrect}
                        className={cn(
                          "data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white data-[state=checked]:border-emerald-500"
                        )}
                        onCheckedChange={() =>
                          toggleOptionCorrect(questionIndex, optionIndex)
                        }
                      />
                      <span className="text-[9px] font-extrabold uppercase font-mono tracking-tight">
                        {ADMIN_CURRICULUM_PAGE.quizCorrectOptionLabel}
                      </span>
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="text-destructive hover:bg-destructive/10 transition-colors"
                      disabled={question.options.length <= 2}
                      onClick={() => removeOption(questionIndex, optionIndex)}
                      aria-label="Quitar opción"
                    >
                      <IconTrash stroke={2.5} className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={question.options.length >= 6}
                className={cn(
                  adminBrutalButtonClass,
                  "inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase transition-all duration-200 hover:scale-[1.02] active:scale-95"
                )}
                onClick={() => addOption(questionIndex)}
              >
                <IconPlus stroke={2.5} className="size-3" />
                {ADMIN_CURRICULUM_PAGE.quizAddOptionLabel}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={adminBrutalButtonClass}
          onClick={addQuestion}
        >
          <IconPlus stroke={2.25} />
          {ADMIN_CURRICULUM_PAGE.quizAddQuestionLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={isPending || !canPersist}
          className={adminBrutalButtonClass}
          onClick={handleSave}
        >
          {isPending ? (
            <IconLoader className="animate-spin" stroke={2.25} />
          ) : (
            <IconDeviceFloppy stroke={2.25} />
          )}
          {ADMIN_CURRICULUM_PAGE.quizSaveLabel}
        </Button>
      </div>
    </div>
  );
}
