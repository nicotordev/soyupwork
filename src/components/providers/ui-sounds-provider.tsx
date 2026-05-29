"use client";

import {
  initUiSoundsFromStorage,
  isUiSoundsEnabled,
  playUiSound,
  preloadUiSounds,
  setUiSoundsEnabled,
  unlockUiSounds,
} from "@/lib/ui-sounds/player";
import { resolveClickSound } from "@/lib/ui-sounds/resolve-click-sound";
import type { UiSoundId } from "@/lib/ui-sounds/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type UiSoundsContextValue = {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  play: (id: UiSoundId, volume?: number) => void;
};

const UiSoundsContext = createContext<UiSoundsContextValue | null>(null);

export function useUiSounds(): UiSoundsContextValue {
  const ctx = useContext(UiSoundsContext);
  if (!ctx) {
    throw new Error("useUiSounds must be used within UiSoundsProvider");
  }
  return ctx;
}

function playSoundForTarget(target: EventTarget | null): void {
  unlockUiSounds();
  const sound = resolveClickSound(target);
  if (sound) playUiSound(sound);
}

export function UiSoundsProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(true);

  useEffect(() => {
    initUiSoundsFromStorage();
    setEnabledState(isUiSoundsEnabled());
    preloadUiSounds();

    const onPointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || event.button > 0) return;
      playSoundForTarget(event.target);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (event.repeat) return;
      playSoundForTarget(event.target);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    setUiSoundsEnabled(value);
    setEnabledState(value);
  }, []);

  const play = useCallback((id: UiSoundId, volume?: number) => {
    unlockUiSounds();
    playUiSound(id, volume);
  }, []);

  const value = useMemo(
    () => ({ enabled, setEnabled, play }),
    [enabled, setEnabled, play],
  );

  return (
    <UiSoundsContext.Provider value={value}>
      {children}
    </UiSoundsContext.Provider>
  );
}
