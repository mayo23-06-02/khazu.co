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
      {
        // Legacy listing images predating the Cloudinary → Supabase Storage
        // migration (see supabase/README.md) still reference this host.
        protocol: "https",
        hostname: "res.cloudinary.com",
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
  async headers() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseWs = supabaseUrl.replace(/^http/, "ws");
    // Report-only for now: Next.js/React hydration and Tailwind can rely on
    // inline styles/scripts in ways that are easy to break blind (no live
    // Supabase project to click through in this environment). This still
    // surfaces violations in the browser console/reporting endpoint without
    // risking breaking the app; tighten to enforcing once verified clean.
    const csp = [
      "default-src 'self'",
      "img-src 'self' data: blob: https://images.unsplash.com https://img.autotrader.co.za https://cfmkbytybjpwypsmldkw.supabase.co https://res.cloudinary.com",
      `connect-src 'self' ${supabaseUrl} ${supabaseWs}`,
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Content-Security-Policy-Report-Only", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
