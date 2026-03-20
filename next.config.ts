import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/check/:path*",
        destination: "https://theviabilityindex.com/:path*",
      },
    ];
  },
};

export default nextConfig;