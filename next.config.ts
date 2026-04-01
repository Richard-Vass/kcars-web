import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "img.autobazar.eu",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/img-proxy/:path*",
        destination: "https://img.autobazar.eu/foto/:path*",
      },
    ];
  },
};

export default nextConfig;
