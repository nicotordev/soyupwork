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

/** @deprecated Use UI_SOUND_PROFILES from ./profiles */
export const UI_SOUND_PATHS: Record<UiSoundId, string> = {
  click: "/sounds/button.wav",
  success: "/sounds/celebration.wav",
  jackpot: "/sounds/celebration.wav",
  error: "/sounds/disabled.wav",
  warning: "/sounds/caution.wav",
  notification: "/sounds/notification.wav",
  toggle: "/sounds/toggle_on.wav",
  select: "/sounds/select.wav",
  open: "/sounds/transition_up.wav",
  close: "/sounds/transition_down.wav",
  navigate: "/sounds/swipe.wav",
};

export const UI_SOUNDS_STORAGE_KEY = "soyupwork:ui-sounds-enabled";
