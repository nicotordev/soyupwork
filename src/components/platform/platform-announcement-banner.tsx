import { getPlatformSettings } from "@/lib/platform-settings/get-platform-settings";
import { IconBell } from "@tabler/icons-react";

export async function PlatformAnnouncementBanner() {
  const settings = await getPlatformSettings();

  if (!settings.showAnnouncementBanner || !settings.announcementMessage) {
    return null;
  }

  return (
    <div className="border-b-2 border-foreground bg-primary/15 px-4 py-2">
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-center font-mono text-xs font-bold uppercase tracking-wide">
        <IconBell className="size-4 shrink-0 text-primary" stroke={2.5} />
        <span>{settings.announcementMessage}</span>
      </p>
    </div>
  );
}
