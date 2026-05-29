"use client";

import { Button } from "@/components/ui/button";
import { QUIZ_PLAY } from "@/constants/quiz-play.constants";
import { adminBrutalButtonClass } from "@/lib/admin/styles";
import { playQuizTimerWarningSound } from "@/lib/quiz/quiz-sounds";
import { cn } from "@/lib/utils";
import type { QuizPlayQuestion } from "@/types/quiz-play.types";
import { IconClock } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

type QuizQuestionScreenProps = {
  question: QuizPlayQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedOptionIds: string[];
  secondsLeft: number;
  isSubmitting: boolean;
  onToggleOption: (optionId: string) => void;
  onConfirm: () => void;
};

export function QuizQuestionScreen({
  question,
  questionIndex,
  totalQuestions,
  selectedOptionIds,
  secondsLeft,
  isSubmitting,
  onToggleOption,
  onConfirm,
}: QuizQuestionScreenProps) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100;
  const timerUrgent = secondsLeft <= 5;
  const timerWarningPlayedRef = useRef(false);

  useEffect(() => {
    timerWarningPlayedRef.current = false;
  }, [question.id]);

  useEffect(() => {
    if (secondsLeft > 5 || timerWarningPlayedRef.current || isSubmitting) {
      return;
    }
    timerWarningPlayedRef.current = true;
    playQuizTimerWarningSound();
  }, [secondsLeft, isSubmitting]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 font-mono text-[10px] font-bold uppercase">
          <span>{QUIZ_PLAY.questionOf(questionIndex + 1, totalQuestions)}</span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded border-2 px-2 py-0.5",
              timerUrgent
                ? "animate-pulse border-destructive bg-destructive/10 text-destructive"
                : "border-foreground",
            )}
          >
            <IconClock className="size-3" stroke={2.5} />
            {secondsLeft}s
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full border-2 border-foreground bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </div>

      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-extrabold leading-snug sm:text-2xl">
          {question.question}
        </h2>

        <ul className="grid gap-2 sm:grid-cols-2">
          {question.options.map((option, index) => {
            const selected = selectedOptionIds.includes(option.id);

            return (
              <motion.li
                key={option.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  type="button"
                  disabled={isSubmitting}
                  data-ui-sound="select"
                  onClick={() => onToggleOption(option.id)}
                  className={cn(
                    "w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-all",
                    "shadow-[3px_3px_0px_0px_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-foreground bg-card hover:bg-muted",
                  )}
                >
                  <span className="font-mono text-[10px] font-bold uppercase opacity-70">
                    {String.fromCharCode(65 + index)}.
                  </span>{" "}
                  {option.text}
                </button>
              </motion.li>
            );
          })}
        </ul>
      </motion.div>

      <Button
        type="button"
        size="lg"
        disabled={isSubmitting || selectedOptionIds.length === 0}
        className={cn(adminBrutalButtonClass, "w-full sm:w-auto")}
        onClick={onConfirm}
      >
        {QUIZ_PLAY.confirmAnswer}
      </Button>
    </div>
  );
}
