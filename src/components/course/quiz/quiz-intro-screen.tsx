"use client";

import { AppleEmoji } from "@/components/ui/apple-emoji";
import { Button } from "@/components/ui/button";
import { QUIZ_EMOJI_POOLS } from "@/constants/apple-emojis.constants";
import { QUIZ_PLAY } from "@/constants/quiz-play.constants";
import { adminBrutalButtonClass, adminPanelClass } from "@/lib/admin/styles";
import { pickFromPool } from "@/lib/emojis/apple-emoji";
import { cn } from "@/lib/utils";
import type {
  QuizPlayAttemptSummary,
  QuizPlayData,
} from "@/types/quiz-play.types";
import { IconPlayerPlay } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

type QuizIntroScreenProps = {
  quiz: QuizPlayData;
  previousAttempt: QuizPlayAttemptSummary | null;
  onStart: () => void;
};

export function QuizIntroScreen({
  quiz,
  previousAttempt,
  onStart,
}: QuizIntroScreenProps) {
  const emojiFile = useMemo(() => pickFromPool(QUIZ_EMOJI_POOLS.intro), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        adminPanelClass,
        "mx-auto max-w-lg space-y-6 border-2 border-foreground p-6 text-center shadow-[6px_6px_0px_0px_var(--foreground)]",
      )}
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        aria-hidden
      >
        <AppleEmoji file={emojiFile} size={80} priority />
      </motion.div>

      <div className="space-y-2">
        <p className="font-mono text-[10px] font-bold uppercase text-primary">
          Modo trivia
        </p>
        <h2 className="text-2xl font-extrabold">{quiz.title}</h2>
        {quiz.description ? (
          <p className="text-sm text-muted-foreground">{quiz.description}</p>
        ) : null}
      </div>

      <div className="space-y-1 font-mono text-[10px] font-bold uppercase text-muted-foreground">
        <p>{quiz.questions.length} preguntas</p>
        <p>{QUIZ_PLAY.passingLabel(quiz.passingScore)}</p>
        <p>{QUIZ_PLAY.timerSeconds}s por pregunta</p>
      </div>

      {previousAttempt ? (
        <p
          className={cn(
            "rounded border-2 px-3 py-2 font-mono text-[10px] font-bold uppercase",
            previousAttempt.passed
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300",
          )}
        >
          {QUIZ_PLAY.previousScore(
            previousAttempt.score,
            previousAttempt.passed,
          )}
        </p>
      ) : null}

      <Button
        type="button"
        size="lg"
        className={cn(adminBrutalButtonClass, "w-full")}
        onClick={onStart}
      >
        <IconPlayerPlay stroke={2.25} />
        {previousAttempt ? QUIZ_PLAY.introRetry : QUIZ_PLAY.introCta}
      </Button>
    </motion.div>
  );
}
