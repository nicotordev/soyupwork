import { playUiSound } from "@/lib/ui-sounds/player";

export function playQuizFeedbackSound(correct: boolean): void {
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
  if (score < passingScore + 10) {
    playUiSound("warning");
    return;
  }
  playUiSound("success");
}

export function playQuizTimerWarningSound(): void {
  playUiSound("warning");
}
