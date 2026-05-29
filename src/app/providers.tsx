import { UiSoundsProvider } from "@/components/providers/ui-sounds-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { clerkProviderAppearance } from "@/lib/clerk/appearance";
import { getAfterSignOutUrl } from "@/lib/clerk/redirect-url";
import { clerkLocalization } from "@/lib/clerk/localization";
import QueryClientProvider from "@/providers/query-client-provider";
import { ClerkProvider } from "@clerk/nextjs";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={clerkProviderAppearance}
      localization={clerkLocalization}
      afterSignOutUrl={getAfterSignOutUrl()}
    >
      <TooltipProvider>
        <UiSoundsProvider>
          <QueryClientProvider>{children}</QueryClientProvider>
          <Toaster />
        </UiSoundsProvider>
      </TooltipProvider>
    </ClerkProvider>
  );
}
