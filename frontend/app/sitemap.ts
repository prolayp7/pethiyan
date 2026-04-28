import type { MetadataRoute } from "next";
import { getProducts, getCategories, getSeoAdvancedSettings } from "@/lib/api";
import { fetchActivePages, fetchBlogPostSlugs } from "@/lib/pages";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pethiyan.com"
).replace(/\/+$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seoAdvanced    = await getSeoAdvancedSettings();
  const excludeUrls    = new Set(seoAdvanced?.sitemapExcludeUrls ?? []);
  const customEntries  = (seoAdvanced?.sitemapCustomUrls ?? []).filter((e) => e.url);

  // ─── Static pages ─────────────────────────────────────────────────────────
  // Transactional pages (/cart, /checkout, /order-confirmed, /login,
  // /account/*, /wishlist, /track-order, /search) are intentionally excluded.
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                              lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${SITE_URL}/shop`,                    lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/new-arrivals`,            lastModified: new Date(), changeFrequency: "daily",   priority: 0.8 },
    { url: `${SITE_URL}/blog`,                    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/about`,                   lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`,                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/faq`,                     lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/shipping-policy`,         lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE_URL}/returns-policy`,          lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`,          lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE_URL}/terms-and-conditions`,    lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  // ─── Dynamic CMS pages (non-system, active) ───────────────────────────────
  const cmsPages = await fetchActivePages();
  const cmsPageEntries: MetadataRoute.Sitemap = cmsPages
    .filter((p) => !excludeUrls.has(`/${p.slug}`))
    .map((p) => ({
      url: `${SITE_URL}/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  // ─── Blog posts ───────────────────────────────────────────────────────────
  const blogSlugs = await fetchBlogPostSlugs();
  const blogPages: MetadataRoute.Sitemap = blogSlugs
    .filter((b) => !excludeUrls.has(`/blog/${b.slug}`))
    .map((b) => ({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  // ─── Dynamic category pages (active + indexable only) ────────────────────
  const categories = await getCategories({ status: "active" });
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((cat) => cat.is_indexable !== false)
    .filter((cat) => !excludeUrls.has(`/category/${cat.slug}`))
    .map((cat) => ({
      url: `${SITE_URL}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // ─── Dynamic product pages (active + indexable only) ─────────────────────
  const products = await getProducts({ status: "active" });
  const indexableProducts = products.filter((p) => p.features?.is_indexable !== false);

  const productPages: MetadataRoute.Sitemap = indexableProducts
    .filter((p) => !excludeUrls.has(`/products/${p.slug}`))
    .map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // ─── Per-variant URLs ─────────────────────────────────────────────────────
  // Skip variants whose slug matches the product slug (bad DB data — would
  // produce duplicate URLs like /products/foo/foo).
  const variantPages: MetadataRoute.Sitemap = indexableProducts.flatMap((p) =>
    (p.variants ?? [])
      .filter((v) => v.slug && v.slug !== p.slug && v.is_indexable !== false)
      .filter((v) => !excludeUrls.has(`/products/${p.slug}/${v.slug}`))
      .map((v) => ({
        url: `${SITE_URL}/products/${p.slug}/${v.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      }))
  );

  // ─── Admin-defined custom URLs ────────────────────────────────────────────
  const adminCustomPages: MetadataRoute.Sitemap = customEntries.map((e) => ({
    url: e.url.startsWith("http") ? e.url : `${SITE_URL}${e.url}`,
    lastModified: new Date(),
    changeFrequency: (e.changeFreq || "weekly") as MetadataRoute.Sitemap[0]["changeFrequency"],
    priority: parseFloat(e.priority) || 0.5,
  }));

  return [...staticPages, ...cmsPageEntries, ...blogPages, ...categoryPages, ...productPages, ...variantPages, ...adminCustomPages];
}
