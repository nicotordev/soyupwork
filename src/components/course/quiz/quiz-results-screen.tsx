"use client";

import { AppleEmoji } from "@/components/ui/apple-emoji";
import { Button } from "@/components/ui/button";
import { QUIZ_EMOJI_POOLS } from "@/constants/apple-emojis.constants";
import { QUIZ_PLAY } from "@/constants/quiz-play.constants";
import { adminBrutalButtonClass } from "@/lib/admin/styles";
import { pickFromPool } from "@/lib/emojis/apple-emoji";
import { cn } from "@/lib/utils";
import { IconRotate } from "@tabler/icons-react";
import { playQuizResultsSound } from "@/lib/quiz/quiz-sounds";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";

type QuizResultsScreenProps = {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  passingScore: number;
  onRetry: () => void;
};

function getResultsCopy(score: number, passed: boolean, passingScore: number) {
  if (!passed) return QUIZ_PLAY.results.fail;
  if (score < passingScore + 10) return QUIZ_PLAY.results.warning;
  return QUIZ_PLAY.results.success;
}

export function QuizResultsScreen({
  score,
  passed,
  correctCount,
  totalQuestions,
  passingScore,
  onRetry,
}: QuizResultsScreenProps) {
  const copy = getResultsCopy(score, passed, passingScore);

  const emojiPool = useMemo(() => {
    if (!passed) return QUIZ_EMOJI_POOLS.resultsFail;
    if (score < passingScore + 10) return QUIZ_EMOJI_POOLS.resultsWarning;
    return QUIZ_EMOJI_POOLS.resultsSuccess;
  }, [passed, score, passingScore]);

  const emojiFile = useMemo(() => pickFromPool(emojiPool), [emojiPool]);

  useEffect(() => {
    playQuizResultsSound(passed, score, passingScore);
  }, [passed, score, passingScore]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "mx-auto max-w-lg space-y-6 rounded-xl border-4 p-8 text-center shadow-[8px_8px_0px_0px_var(--foreground)]",
        passed
          ? score >= passingScore + 10
            ? "border-emerald-500 bg-emerald-500/10"
            : "border-amber-500 bg-amber-500/10"
          : "border-destructive bg-destructive/10",
      )}
    >
      <motion.div
        animate={{ scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 1.2, repeat: 2 }}
        aria-hidden
      >
        <AppleEmoji file={emojiFile} size={96} />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold">{copy.title}</h2>
        <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
      </div>

      <div className="space-y-1">
        <p className="text-5xl font-black tabular-nums">
          {QUIZ_PLAY.percentLabel(score)}
        </p>
        <p className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
          {QUIZ_PLAY.scoreLabel(correctCount, totalQuestions)}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        data-ui-sound="navigate"
        className={adminBrutalButtonClass}
        onClick={onRetry}
      >
        <IconRotate stroke={2.25} />
        {QUIZ_PLAY.introRetry}
      </Button>
    </motion.div>
  );
}
