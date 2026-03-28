import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/check/spain",
        destination: "https://app.theviabilityindex.com/?year=2026&source=authority",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;