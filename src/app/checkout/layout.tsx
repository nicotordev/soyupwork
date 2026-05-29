import { getClerkSession } from "@/lib/clerk/session";
import { isPublicWaitlistMode } from "@/lib/platform/public-waitlist-mode";
import { redirect } from "next/navigation";

export default async function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isSignedIn } = await getClerkSession();

  if (!isSignedIn) {
    redirect(isPublicWaitlistMode() ? "/waitlist" : "/sign-in");
  }

  return (
    <div className="min-h-svh bg-background font-sans text-foreground">
      {children}
    </div>
  );
}
