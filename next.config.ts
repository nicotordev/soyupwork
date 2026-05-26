import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["pino", "pino-pretty", "thread-stream"],
};

export default nextConfig;
