"use client";

import UIfx from "uifx";

import {
  UI_SOUND_IDS,
  UI_SOUND_PATHS,
  UI_SOUNDS_STORAGE_KEY,
  type UiSoundId,
} from "@/lib/ui-sounds/types";

const DEFAULT_VOLUME: Record<UiSoundId, number> = {
  click: 0.16,
  success: 0.2,
  error: 0.2,
  warning: 0.18,
  toggle: 0.15,
  select: 0.15,
  open: 0.16,
  close: 0.16,
  navigate: 0.15,
};

const THROTTLE_MS: Record<UiSoundId, number> = {
  click: 80,
  success: 200,
  error: 200,
  warning: 200,
  toggle: 120,
  select: 100,
  open: 150,
  close: 150,
  navigate: 120,
};

let unlocked = false;
let enabled = true;
const players = new Map<UiSoundId, UIfx>();

function readEnabledFromStorage(): boolean {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(UI_SOUNDS_STORAGE_KEY);
  if (stored === null) return true;
  return stored === "1";
}

function getPlayer(id: UiSoundId): UIfx {
  let player = players.get(id);
  if (!player) {
    player = new UIfx(UI_SOUND_PATHS[id], {
      volume: DEFAULT_VOLUME[id],
      throttleMs: THROTTLE_MS[id],
    });
    players.set(id, player);
  }
  return player;
}

export function isUiSoundsEnabled(): boolean {
  return enabled;
}

export function setUiSoundsEnabled(value: boolean): void {
  enabled = value;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(UI_SOUNDS_STORAGE_KEY, value ? "1" : "0");
  }
}

export function unlockUiSounds(): void {
  unlocked = true;
}

export function initUiSoundsFromStorage(): void {
  enabled = readEnabledFromStorage();
}

export function playUiSound(id: UiSoundId, volume?: number): void {
  if (typeof window === "undefined" || !enabled || !unlocked) return;
  if (!UI_SOUND_IDS.includes(id)) return;
  getPlayer(id).play(volume);
}

export function preloadUiSounds(): void {
  if (typeof window === "undefined") return;
  for (const id of UI_SOUND_IDS) {
    getPlayer(id);
  }
}
