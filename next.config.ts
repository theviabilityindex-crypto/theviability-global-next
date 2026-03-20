import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/check/spain",
        destination: "https://theviabilityindex.lovable.app/",
      },
    ];
  },
};

export default nextConfig;