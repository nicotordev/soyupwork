import type { NextConfig } from "next";

function buildImageRemotePatterns(): NonNullable<
  NextConfig["images"]
>["remotePatterns"] {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

  const publicUrl = process.env.R2_PUBLIC_URL?.trim();
  if (publicUrl) {
    try {
      const { protocol, hostname } = new URL(publicUrl);
      if (protocol === "https:" || protocol === "http:") {
        patterns.push({
          protocol: protocol.replace(":", "") as "https" | "http",
          hostname,
          pathname: "/**",
        });
      }
    } catch {
      // ignore invalid R2_PUBLIC_URL at build time
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  serverExternalPackages: [
    "pino",
    "pino-pretty",
    "thread-stream",
    "@react-pdf/renderer",
  ],
  images: {
    remotePatterns: buildImageRemotePatterns(),
  },
};

export default nextConfig;
