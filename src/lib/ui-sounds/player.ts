"use client";

import {
  isUiSoundId,
  UI_SOUND_PROFILES,
  type UiSoundProfileId,
} from "@/lib/ui-sounds/profiles";
import {
  UI_SOUND_IDS,
  UI_SOUNDS_STORAGE_KEY,
  type UiSoundId,
} from "@/lib/ui-sounds/types";

type SoundPlayer = {
  play: (volume?: number) => void;
};

let enabled = true;
let activeProfileId: UiSoundProfileId = "default";
const players = new Map<string, SoundPlayer>();
const lastPlayedAt = new Map<string, number>();

function playerKey(profileId: UiSoundProfileId, id: UiSoundId): string {
  return `${profileId}:${id}`;
}

function readEnabledFromStorage(): boolean {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(UI_SOUNDS_STORAGE_KEY);
  if (stored === null) return true;
  return stored === "1";
}

function playAudio(path: string, volume: number): void {
  const audio = new Audio(path);
  audio.volume = volume;

  const start = () => {
    void audio.play().catch(() => {
      // Ignore autoplay / missing-gesture errors outside click handlers.
    });
  };

  if (audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    start();
    return;
  }

  audio.addEventListener("canplaythrough", start, { once: true });
  audio.load();
}

function ensurePlayer(profileId: UiSoundProfileId, id: UiSoundId): SoundPlayer {
  const key = playerKey(profileId, id);
  let player = players.get(key);

  if (!player) {
    const profile = UI_SOUND_PROFILES[profileId];
    const path = profile.paths[id];
    const defaultVolume = profile.volumes[id];
    const throttleMs = profile.throttleMs[id];

    // Warm the browser cache (UIfx used to do this via hidden <audio> tags).
    const preload = new Audio(path);
    preload.preload = "auto";
    preload.load();

    player = {
      play: (volumeOverride?: number) => {
        const now = Date.now();
        const last = lastPlayedAt.get(key) ?? 0;
        if (now - last < throttleMs) return;
        lastPlayedAt.set(key, now);

        playAudio(path, volumeOverride ?? defaultVolume);
      },
    };
    players.set(key, player);
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

export function getUiSoundProfile(): UiSoundProfileId {
  return activeProfileId;
}

export function setUiSoundProfile(profileId: UiSoundProfileId): void {
  activeProfileId = profileId;
}

export function unlockUiSounds(): void {
  // Kept for API compatibility; native Audio does not require a separate unlock.
}

export function initUiSoundsFromStorage(): void {
  enabled = readEnabledFromStorage();
}

export function playUiSound(id: UiSoundId, volume?: number): void {
  if (typeof window === "undefined" || !enabled) return;
  if (!isUiSoundId(id)) return;
  ensurePlayer(activeProfileId, id).play(volume);
}

export function preloadUiSounds(
  profileId: UiSoundProfileId = activeProfileId,
): void {
  if (typeof window === "undefined") return;
  for (const id of UI_SOUND_IDS) {
    ensurePlayer(profileId, id);
  }
}
