import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
  : null;

// img-src and connect-src include Supabase when configured, else wildcard fallback.
const cspImgSrc = [
  "'self'",
  "data:",
  "blob:",
  "https://res.cloudinary.com",
  "https://furnishingshub.co.uk",
  supabaseHost ? `https://${supabaseHost}` : "https://*.supabase.co",
].join(" ");

const cspConnectSrc = [
  "'self'",
  supabaseHost ? `https://${supabaseHost}` : "https://*.supabase.co",
].join(" ");

// script-src uses 'unsafe-inline' because Next.js App Router emits inline hydration
// scripts. Tighten to a nonce-based policy once a nonce infrastructure is in place.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src ${cspImgSrc}`,
  `connect-src ${cspConnectSrc}`,
  "font-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      // /basket is an unreferenced duplicate of /cart.
      { source: "/basket", destination: "/cart", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dmlna04yk/**",
      },
      {
        protocol: "https",
        hostname: "furnishingshub.co.uk",
        pathname: "/wp-content/uploads/**",
      },
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL
        ? [
            {
              protocol: "https" as const,
              hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
              pathname: "/storage/v1/object/public/product-media/**",
            },
          ]
        : []),
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};
export default nextConfig;
