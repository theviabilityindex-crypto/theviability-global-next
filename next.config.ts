import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/check/spain",
        destination: "https://theviabilityindex.com/",
      },
    ];
  },
};

export default nextConfig;