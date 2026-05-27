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

export function UiSoundsProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(true);

  useEffect(() => {
    initUiSoundsFromStorage();
    setEnabledState(isUiSoundsEnabled());
    preloadUiSounds();

    const unlock = () => {
      unlockUiSounds();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.isPrimary) unlock();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") unlock();
    };

    const onClick = (event: MouseEvent) => {
      const sound = resolveClickSound(event.target);
      if (sound) playUiSound(sound);
    };

    window.addEventListener("pointerdown", onPointerDown, { once: true });
    window.addEventListener("keydown", onKeyDown, { once: true });
    document.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    setUiSoundsEnabled(value);
    setEnabledState(value);
  }, []);

  const play = useCallback((id: UiSoundId, volume?: number) => {
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
