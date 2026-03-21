import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/check/spain",
        destination: "https://app.theviabilityindex.com",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;