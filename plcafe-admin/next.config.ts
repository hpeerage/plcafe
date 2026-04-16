import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/plcafe/admin',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
