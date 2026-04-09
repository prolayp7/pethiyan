import type { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/api";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pethiyan.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ─── Static pages ─────────────────────────────────────────────────────────
  // Transactional pages (/cart, /checkout, /order-confirmed, /login,
  // /account/*, /wishlist, /track-order, /search) are intentionally excluded.
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                              lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${SITE_URL}/shop`,                    lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/new-arrivals`,            lastModified: new Date(), changeFrequency: "daily",   priority: 0.8 },
    { url: `${SITE_URL}/about`,                   lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`,                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/faq`,                     lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/shipping-policy`,         lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE_URL}/returns-policy`,          lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`,          lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE_URL}/terms-and-conditions`,    lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  // ─── Dynamic category pages (exclude non-indexable) ───────────────────────
  const categories = await getCategories();
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((cat) => cat.is_indexable !== false)
    .map((cat) => ({
      url: `${SITE_URL}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // ─── Dynamic product pages (exclude non-indexable) ────────────────────────
  const products = await getProducts();
  const productPages: MetadataRoute.Sitemap = products
    .filter((p) => p.features?.is_indexable !== false)
    .map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [...staticPages, ...categoryPages, ...productPages];
}
