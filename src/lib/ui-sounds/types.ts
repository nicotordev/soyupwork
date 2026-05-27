export const UI_SOUND_IDS = [
  "click",
  "success",
  "error",
  "warning",
  "toggle",
  "select",
  "open",
  "close",
  "navigate",
] as const;

export type UiSoundId = (typeof UI_SOUND_IDS)[number];

export const UI_SOUND_PATHS: Record<UiSoundId, string> = {
  click: "/sounds/click.wav",
  success: "/sounds/success.wav",
  error: "/sounds/error.wav",
  warning: "/sounds/warning.wav",
  toggle: "/sounds/toggle.wav",
  select: "/sounds/select.wav",
  open: "/sounds/open.wav",
  close: "/sounds/close.wav",
  navigate: "/sounds/navigate.wav",
};

export const UI_SOUNDS_STORAGE_KEY = "soyupwork:ui-sounds-enabled";
