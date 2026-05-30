export const UI_SOUND_IDS = [
  "click",
  "success",
  "jackpot",
  "error",
  "warning",
  "notification",
  "toggle",
  "select",
  "open",
  "close",
  "navigate",
] as const;

export type UiSoundId = (typeof UI_SOUND_IDS)[number];

/** Sound file paths live in `UI_SOUND_PROFILES` (`./profiles.ts`). */
export const UI_SOUNDS_STORAGE_KEY = "soyupwork:ui-sounds-enabled";
