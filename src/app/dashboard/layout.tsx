import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getAuthSession } from "@/lib/auth/session";
import { isPublicWaitlistMode } from "@/lib/platform/public-waitlist-mode";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    default: "Mi área",
    template: "%s | SoyUpwork",
  },
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isSignedIn } = await getAuthSession();

  if (!isSignedIn) {
    redirect(isPublicWaitlistMode() ? "/waitlist" : "/sign-in");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
