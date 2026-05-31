import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_BRAND } from "@/constants/site-brand.constants";
import { MARKETING_PAGE } from "@/constants/marketing.constants";
import { getMetadataBase } from "@/lib/seo/app-origin";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: MARKETING_PAGE.metadataTitle,
    template: `%s | ${SITE_BRAND.legalName}`,
  },
  description: MARKETING_PAGE.metadataDescription,
  applicationName: SITE_BRAND.name,
  keywords: [...MARKETING_PAGE.keywords],
  appleWebApp: {
    capable: true,
    title: SITE_BRAND.shortName,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: SITE_BRAND.themeColor },
    { media: "(prefers-color-scheme: dark)", color: SITE_BRAND.themeColor },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.className} flex min-h-full min-w-0 flex-col font-sans text-base/relaxed text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
