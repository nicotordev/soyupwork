"use client";

import { AppleEmoji } from "@/components/ui/apple-emoji";
import {
  QUIZ_CHECK_EMOJI_FILE,
  QUIZ_EMOJI_POOLS,
} from "@/constants/apple-emojis.constants";
import { QUIZ_PLAY } from "@/constants/quiz-play.constants";
import { pickFromPool } from "@/lib/emojis/apple-emoji";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";

type QuizFeedbackScreenProps = {
  correct: boolean;
  correctOptionIds: string[];
  optionLabels: { id: string; text: string }[];
};

export function QuizFeedbackScreen({
  correct,
  correctOptionIds,
  optionLabels,
}: QuizFeedbackScreenProps) {
  const copy = correct
    ? QUIZ_PLAY.feedback.correct
    : QUIZ_PLAY.feedback.incorrect;

  const emojiFile = useMemo(
    () =>
      pickFromPool(
        correct
          ? QUIZ_EMOJI_POOLS.feedbackCorrect
          : QUIZ_EMOJI_POOLS.feedbackIncorrect,
      ),
    [correct],
  );

  const correctTexts = optionLabels
    .filter((option) => correctOptionIds.includes(option.id))
    .map((option) => option.text);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "mx-auto flex min-h-[320px] w-full max-w-lg flex-col items-center justify-center gap-4 rounded-xl border-4 p-8 text-center shadow-[8px_8px_0px_0px_var(--foreground)]",
        correct
          ? "border-emerald-500 bg-emerald-500/15"
          : "border-destructive bg-destructive/15",
      )}
    >
      <motion.div
        animate={
          correct
            ? { rotate: [0, -8, 8, -4, 4, 0], scale: [1, 1.15, 1] }
            : { x: [0, -12, 12, -8, 8, 0] }
        }
        transition={{ duration: 0.55 }}
        aria-hidden
      >
        <AppleEmoji file={emojiFile} size={88} />
      </motion.div>

      <div className="space-y-2">
        <h3 className="text-2xl font-extrabold">{copy.title}</h3>
        <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
      </div>

      {!correct && correctTexts.length > 0 ? (
        <div className="w-full rounded border-2 border-foreground/30 bg-background/80 px-4 py-3 text-left">
          <p className="mb-1 font-mono text-[10px] font-bold uppercase text-muted-foreground">
            Respuesta correcta
          </p>
          <ul className="space-y-1 text-sm font-medium">
            {correctTexts.map((text) => (
              <li key={text} className="flex items-start gap-2">
                <AppleEmoji
                  file={QUIZ_CHECK_EMOJI_FILE}
                  size={18}
                  className="mt-0.5 shrink-0"
                />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </motion.div>
  );
}
