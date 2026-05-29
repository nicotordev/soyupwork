"use client";

import { preloadUiSounds, setUiSoundProfile } from "@/lib/ui-sounds/player";
import { useEffect } from "react";

/** Switches UI sounds to the casino learning profile for the demo route. */
export function DemoCasinoSounds() {
  useEffect(() => {
    setUiSoundProfile("casino");
    preloadUiSounds("casino");

    return () => {
      setUiSoundProfile("default");
    };
  }, []);

  return null;
}
