import type { MetadataRoute } from "next";

import { SITE_BRAND } from "@/constants/site-brand.constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_BRAND.name,
    short_name: SITE_BRAND.shortName,
    description: SITE_BRAND.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "es",
    dir: "ltr",
    background_color: SITE_BRAND.backgroundColor,
    theme_color: SITE_BRAND.themeColor,
    categories: ["education", "business"],
    icons: [
      {
        src: "/icons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/icons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
