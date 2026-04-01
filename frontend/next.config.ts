import type { NextConfig } from "next";

// Extract hostname and port from the API URL for image remote patterns
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
let apiHostname = "localhost";
let apiPort = "8000";
let apiProtocol: "http" | "https" = "http";
try {
  const parsed = new URL(apiUrl);
  apiHostname = parsed.hostname;
  apiPort = parsed.port;
  apiProtocol = parsed.protocol.replace(":", "") as "http" | "https";
} catch { /* keep defaults */ }

const nextConfig: NextConfig = {
  // ── Performance ────────────────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,

  // ── Images ─────────────────────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    remotePatterns: [
      { protocol: "http",  hostname: "localhost", port: apiPort, pathname: "**" },
      { protocol: "http",  hostname: "localhost",               pathname: "**" },
      { protocol: "http",  hostname: "127.0.0.1", port: apiPort, pathname: "**" },
      { protocol: "http",  hostname: "127.0.0.1",               pathname: "**" },
      { protocol: "https", hostname: "127.0.0.1",               pathname: "**" },
      { protocol: apiProtocol, hostname: apiHostname, ...(apiPort ? { port: apiPort } : {}), pathname: "**" },
      { protocol: "https", hostname: "*.pethiyan.com",          pathname: "**" },
    ],
  },

  // ── Security & Cache Headers ────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options",       value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection",       value: "1; mode=block" },
          { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self)",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // Content-hashed → safe to cache forever
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // ── Redirects ──────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // Old slug typo → correct route
      { source: "/return-policy", destination: "/returns-policy", permanent: true },
      // Remove trailing slashes (canonical)
      { source: "/:path+/", destination: "/:path+", permanent: true },
    ];
  },
};

export default nextConfig;
