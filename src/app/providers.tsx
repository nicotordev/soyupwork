import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkProviderAppearance } from "@/lib/clerk/appearance";
import { clerkLocalization } from "@/lib/clerk/localization";
import QueryClientProvider from "@/providers/query-client-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={clerkProviderAppearance}
      localization={clerkLocalization}
    >
      <TooltipProvider>
        <QueryClientProvider>{children}</QueryClientProvider>
      </TooltipProvider>
    </ClerkProvider>
  );
}
