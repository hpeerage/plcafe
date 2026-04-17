import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/plcafe/admin',
  assetPrefix: '/plcafe/admin/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
