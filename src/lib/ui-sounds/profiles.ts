import { UI_SOUND_IDS, type UiSoundId } from "@/lib/ui-sounds/types";

export type UiSoundProfileId = "default" | "casino";

export type UiSoundProfile = {
  paths: Record<UiSoundId, string>;
  volumes: Record<UiSoundId, number>;
  throttleMs: Record<UiSoundId, number>;
};

const BASE_THROTTLE_MS: Record<UiSoundId, number> = {
  click: 80,
  success: 200,
  jackpot: 400,
  error: 200,
  warning: 200,
  notification: 180,
  toggle: 120,
  select: 100,
  open: 150,
  close: 150,
  navigate: 120,
};

/** Standard UI feedback — files in public/sounds/ */
const DEFAULT_PATHS: Record<UiSoundId, string> = {
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

const DEFAULT_VOLUMES: Record<UiSoundId, number> = {
  click: 0.18,
  success: 0.22,
  jackpot: 0.26,
  error: 0.2,
  warning: 0.18,
  notification: 0.18,
  toggle: 0.16,
  select: 0.16,
  open: 0.18,
  close: 0.16,
  navigate: 0.16,
};

/** Demo / gamified — snappier taps and swipes from the same pack */
const CASINO_PATHS: Record<UiSoundId, string> = {
  click: "/sounds/tap_03.wav",
  success: "/sounds/celebration.wav",
  jackpot: "/sounds/celebration.wav",
  error: "/sounds/caution.wav",
  warning: "/sounds/caution.wav",
  notification: "/sounds/notification.wav",
  toggle: "/sounds/toggle_on.wav",
  select: "/sounds/select.wav",
  open: "/sounds/transition_up.wav",
  close: "/sounds/transition_down.wav",
  navigate: "/sounds/swipe_03.wav",
};

const CASINO_VOLUMES: Record<UiSoundId, number> = {
  click: 0.24,
  success: 0.3,
  jackpot: 0.36,
  error: 0.26,
  warning: 0.24,
  notification: 0.22,
  toggle: 0.2,
  select: 0.2,
  open: 0.24,
  close: 0.2,
  navigate: 0.22,
};

export const UI_SOUND_PROFILES: Record<UiSoundProfileId, UiSoundProfile> = {
  default: {
    paths: DEFAULT_PATHS,
    volumes: DEFAULT_VOLUMES,
    throttleMs: BASE_THROTTLE_MS,
  },
  casino: {
    paths: CASINO_PATHS,
    volumes: CASINO_VOLUMES,
    throttleMs: BASE_THROTTLE_MS,
  },
};

export function isUiSoundId(value: string): value is UiSoundId {
  return (UI_SOUND_IDS as readonly string[]).includes(value);
}
