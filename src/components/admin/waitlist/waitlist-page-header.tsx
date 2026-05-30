import { ADMIN_WAITLIST_PAGE } from "@/constants/waitlist-admin.constants";
import { adminPanelTitleClass } from "@/lib/admin/styles";

export function WaitlistPageHeader() {
  return (
    <header className="mb-8 border-b-2 border-foreground pb-6">
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {ADMIN_WAITLIST_PAGE.eyebrow}
      </p>
      <h1 className={`mt-2 ${adminPanelTitleClass}`}>{ADMIN_WAITLIST_PAGE.title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        {ADMIN_WAITLIST_PAGE.description}
      </p>
    </header>
  );
}
