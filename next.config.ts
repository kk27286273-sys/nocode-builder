import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/site/builder",
        destination: "/preview",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;