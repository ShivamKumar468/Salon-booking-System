import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@salon/shared"],
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
