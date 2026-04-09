import type { MetadataRoute } from "next";
import { getSeoAdvancedSettings } from "@/lib/api";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pethiyan.com";

// Paths that must always be disallowed regardless of admin settings.
const CORE_DISALLOW = [
  "/account/",
  "/checkout/",
  "/cart/",
  "/order-confirmed/",
  "/login/",
  "/wishlist/",
  "/track-order/",
  "/search/",
  "/api/",
  "/admin/",
  "/_next/",
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seoAdvanced = await getSeoAdvancedSettings();
  const extraRules  = (seoAdvanced?.robotsDisallowRules ?? []).filter(Boolean);

  // Merge, deduplicate
  const disallow = Array.from(new Set([...CORE_DISALLOW, ...extraRules]));

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
