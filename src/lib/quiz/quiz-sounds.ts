import { getUiSoundProfile, playUiSound } from "@/lib/ui-sounds/player";

export function playQuizFeedbackSound(correct: boolean): void {
  if (correct && getUiSoundProfile() === "casino") {
    playUiSound("success");
    return;
  }
  playUiSound(correct ? "success" : "error");
}

export function playQuizResultsSound(
  passed: boolean,
  score: number,
  passingScore: number,
): void {
  if (!passed) {
    playUiSound("error");
    return;
  }

  const isCasino = getUiSoundProfile() === "casino";

  if (isCasino && score >= passingScore + 10) {
    playUiSound("jackpot");
    window.setTimeout(() => playUiSound("notification", 0.2), 120);
    return;
  }

  if (score < passingScore + 10) {
    playUiSound("warning");
    return;
  }

  playUiSound("success");
}

export function playQuizTimerWarningSound(): void {
  playUiSound("warning");
}
