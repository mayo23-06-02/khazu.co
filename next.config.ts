import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.autotrader.co.za",
      },
      {
        protocol: "https",
        hostname: "cfmkbytybjpwypsmldkw.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/buy",
        destination: "/listings",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/auth/login",
        permanent: false,
      },
      {
        source: "/signup",
        destination: "/auth/register",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
