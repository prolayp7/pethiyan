import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

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

  // ── Turbopack (Next.js 16 default) ─────────────────────────────────────────
  // Empty config tells Next.js we're aware of Turbopack and suppresses the
  // "webpack config present but no turbopack config" warning from next-pwa.
  turbopack: {},

  // ── Images ─────────────────────────────────────────────────────────────────
  images: {
    // In development all images come from localhost (private IP) which Next.js
    // optimizer refuses to fetch. Disable optimization in dev; production keeps
    // full optimization via the remotePatterns below.
    unoptimized: process.env.NODE_ENV === "development",
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 85],
    // 30-day cache for optimized images — safe because Next.js uses content-addressed URLs
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: "http",  hostname: "localhost", port: apiPort, pathname: "/**" },
      { protocol: "http",  hostname: "localhost",               pathname: "/**" },
      { protocol: "http",  hostname: "127.0.0.1", port: apiPort, pathname: "/**" },
      { protocol: "http",  hostname: "127.0.0.1",               pathname: "/**" },
      { protocol: "https", hostname: "127.0.0.1",               pathname: "/**" },
      { protocol: apiProtocol, hostname: apiHostname, ...(apiPort ? { port: apiPort } : {}), pathname: "/**" },
      { protocol: "https", hostname: "*.pethiyan.com",          pathname: "/**" },
      // Blog post featured images
      { protocol: "https", hostname: "images.unsplash.com",     pathname: "/**" },
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
      { source: "/return-policy",  destination: "/returns-policy", permanent: true },
      { source: "/:path+/",        destination: "/:path+",          permanent: true },
    ];
  },
};

// ── PWA configuration ──────────────────────────────────────────────────────────
// Service worker is only active in production (NODE_ENV=production).
// In dev mode the SW is disabled so hot-reload works normally.
export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV !== "production",
  register: true,
  // Do NOT cache page HTML navigations — admin changes (menus, settings,
  // categories) must reflect immediately on the next page load.
  // Static assets (JS, CSS, images, fonts) are still cached below.
  cacheOnFrontEndNav: false,
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: true,
  workboxOptions: {
    skipWaiting: true,
    // ── Dynamic API data ── NetworkFirst: always try network first so admin
    // changes (menus, products, categories) show immediately. Cache is only
    // used as a fallback when the user is offline.
    runtimeCaching: [
      {
        urlPattern: /\/api\/menus\//,
        handler: "NetworkFirst" as const,
        options: {
          cacheName: "menus-api",
          networkTimeoutSeconds: 5,
          expiration: { maxEntries: 10, maxAgeSeconds: 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /\/api\/settings\//,
        handler: "NetworkFirst" as const,
        options: {
          cacheName: "settings-api",
          networkTimeoutSeconds: 5,
          expiration: { maxEntries: 10, maxAgeSeconds: 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /\/api\/hero-section/,
        handler: "NetworkFirst" as const,
        options: {
          cacheName: "hero-api",
          networkTimeoutSeconds: 5,
          expiration: { maxEntries: 5, maxAgeSeconds: 300 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /\/api\/products(\/|$|\?)/,
        handler: "NetworkFirst" as const,
        options: {
          cacheName: "products-api",
          networkTimeoutSeconds: 5,
          expiration: { maxEntries: 50, maxAgeSeconds: 300 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /\/api\/categories(\/|$|\?)/,
        handler: "NetworkFirst" as const,
        options: {
          cacheName: "categories-api",
          networkTimeoutSeconds: 5,
          expiration: { maxEntries: 20, maxAgeSeconds: 300 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // ── Product images ── CacheFirst: images are content-addressed, safe to cache
      {
        urlPattern: /\.(png|jpg|jpeg|webp|avif|gif|svg)$/i,
        handler: "CacheFirst" as const,
        options: {
          cacheName: "product-images",
          expiration: { maxEntries: 200, maxAgeSeconds: 86400 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // ── Fonts ── CacheFirst: fonts never change once deployed
      {
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
        handler: "CacheFirst" as const,
        options: {
          cacheName: "google-fonts",
          expiration: { maxEntries: 10, maxAgeSeconds: 31536000 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
  },
})(nextConfig);
