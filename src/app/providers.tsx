import { UiSoundsProvider } from "@/components/providers/ui-sounds-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryClientProvider from "@/providers/query-client-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TooltipProvider>
        <UiSoundsProvider>
          <QueryClientProvider>{children}</QueryClientProvider>
          <Toaster />
        </UiSoundsProvider>
      </TooltipProvider>
    </AuthProvider>
  );
}
