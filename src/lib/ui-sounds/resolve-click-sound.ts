import { UI_SOUND_IDS, type UiSoundId } from "@/lib/ui-sounds/types";

function isUiSoundId(value: string): value is UiSoundId {
  return (UI_SOUND_IDS as readonly string[]).includes(value);
}

const INTERACTIVE_SELECTOR = [
  "button:not(:disabled)",
  "a[href]",
  '[role="button"]:not([aria-disabled="true"])',
  '[role="menuitem"]',
  '[role="tab"]',
  '[role="switch"]',
  '[data-slot="button"]',
  '[data-slot="switch"]',
  '[data-slot="checkbox"]',
  '[data-slot="toggle"]',
  '[data-slot="select-trigger"]',
  '[data-slot="dialog-trigger"]',
  '[data-slot="sheet-trigger"]',
  '[data-slot="dropdown-menu-trigger"]',
  '[data-slot="popover-trigger"]',
].join(",");

const SKIP_SELECTOR =
  'input, textarea, select, [contenteditable="true"], [data-ui-sound="off"]';

export function resolveClickSound(
  target: EventTarget | null,
): UiSoundId | null {
  if (!(target instanceof Element)) return null;
  if (target.closest(SKIP_SELECTOR)) return null;

  const interactive = target.closest(INTERACTIVE_SELECTOR);
  if (!interactive) return null;

  const explicit = interactive.getAttribute("data-ui-sound");
  if (explicit === "off") return null;
  if (explicit && isUiSoundId(explicit)) {
    return explicit;
  }

  if (
    interactive.matches(
      '[role="switch"], [data-slot="switch"], [data-slot="checkbox"], [data-slot="toggle"]',
    )
  ) {
    return "toggle";
  }

  if (interactive.matches('[data-slot="select-trigger"]')) {
    return "select";
  }

  if (
    interactive.matches(
      'button:not(:disabled), [data-slot="button"], [role="button"]:not([aria-disabled="true"])',
    )
  ) {
    return "click";
  }

  if (
    interactive.matches("a[href]") &&
    !interactive.matches('[data-slot="button"]')
  ) {
    return "navigate";
  }

  return "click";
}
