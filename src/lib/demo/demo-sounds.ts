import { playUiSound } from "@/lib/ui-sounds/player";

/** Celebration cascade when completing a demo lesson. */
export function playDemoLessonCompleteSound(): void {
  playUiSound("jackpot");
  window.setTimeout(() => playUiSound("notification", 0.22), 120);
}
