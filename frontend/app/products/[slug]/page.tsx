import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getProduct,
  getProductReviews,
  getProductFaqs,
  getProducts,
  selectPrimaryStorePricing,
  resolveStorePricingDisplay,
} from "@/lib/api";
import {
  productSchema,
  breadcrumbSchema,
  faqPageSchema,
  jsonLd,
} from "@/lib/structured-data";
import { getCustomJsonLdSchemas, resolveProductSeo } from "@/lib/seo";
import Breadcrumb from "@/components/common/Breadcrumb";
import RelatedProducts from "@/components/product/RelatedProducts";
import RecentlyViewedProducts from "@/components/sections/RecentlyViewedProducts";
import BrowsingHistory from "@/components/product/BrowsingHistory";
import ProductDetailIsland from "./ProductDetailIsland";
import { toDisplayTitleCase } from "@/lib/text";

// ─── Pre-render all known product slugs at build time ─────────────────────────

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

// ─── Dynamic SEO metadata ─────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return { title: "Product Not Found" };

  const firstVariant = product.variants?.[0];
  const firstStorePricing = selectPrimaryStorePricing(firstVariant?.store_pricing);
  const price = resolveStorePricingDisplay(firstStorePricing).mainPrice;
  const rawTitle = product.title ?? "Product";
  const seo = resolveProductSeo(product);
  const inStock = firstVariant?.availability !== false;

  return {
    title: seo.title,
    description: seo.description,
    ...(seo.keywords ? { keywords: seo.keywords } : {}),
    robots: seo.indexable
      ? { index: true,  follow: true,  googleBot: { index: true,  follow: true  } }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    alternates: {
      canonical: `/products/${slug}`,
      languages: { "en": `/products/${slug}`, "x-default": `/products/${slug}` },
    },
    openGraph: {
      title: seo.openGraphTitle,
      description: seo.openGraphDescription,
      url: `/products/${slug}`,
      ...(seo.openGraphImage ? { images: [{ url: seo.openGraphImage, alt: rawTitle }] } : {}),
    },
    twitter: {
      card: seo.twitterCard,
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      ...(seo.twitterImage ? { images: [seo.twitterImage] } : {}),
    },
    other: {
      "og:type": "og:product",
      "product:price:amount": String(price),
      "product:price:currency": "INR",
      "product:availability": inStock ? "in stock" : "out of stock",
      "product:brand": "Pethiyan",
    },
  };
}

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // All fetches in parallel
  const [product, reviews, faqs] = await Promise.all([
    getProduct(slug),
    getProductReviews(slug),
    getProductFaqs(slug),
  ]);

  if (!product) notFound();

  // ── JSON-LD schemas ──
  const seo = resolveProductSeo(product);
  const pSchema = productSchema(product, reviews, {
    canonicalPath: `/products/${slug}`,
    titleOverride: seo.openGraphTitle,
    descriptionOverride: seo.openGraphDescription,
    imageOverride: seo.openGraphImage,
  });
  const bcSchema = breadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    ...((product as unknown as { category?: { name: string; slug: string } | null }).category
      ? [{
          label: (product as unknown as { category: { name: string } }).category.name,
          href: `/category/${(product as unknown as { category: { slug: string } }).category.slug}`,
        }]
      : []),
    { label: toDisplayTitleCase(product.title), href: `/products/${slug}` },
  ]);
  const customSchemas = getCustomJsonLdSchemas(
    seo.schemaMode,
    seo.schemaJsonLd,
  );
  const autoSchemas = customSchemas.length > 0 ? [] : [pSchema, bcSchema];

  return (
    <div className="min-h-screen bg-(--background)">
      {/* JSON-LD */}
      {autoSchemas.map((schema, index) => (
        <script {...jsonLd(schema)} key={`product-schema-${index}`} />
      ))}
      {customSchemas.map((schema, index) => (
        <script {...jsonLd(schema as Record<string, unknown>)} key={`product-custom-schema-${index}`} />
      ))}
      {faqs.length > 0 && (
        <script {...jsonLd(faqPageSchema(faqs))} key="faq-schema" />
      )}

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Shop", href: "/shop" },
          ...((product as unknown as { category?: { name: string; slug: string } | null }).category
            ? [{
                label: (product as unknown as { category: { name: string } }).category.name,
                href: `/category/${(product as unknown as { category: { slug: string } }).category.slug}`,
              }]
            : []),
          { label: toDisplayTitleCase(product.title) },
        ]}
      />

      {/* All interactive product UI */}
      <ProductDetailIsland product={product} reviews={reviews} faqs={faqs} />

      {/* Related products (server-fetched, same category) */}
      {(product as unknown as { category?: { slug: string } | null }).category && (
        <RelatedProducts
          categorySlug={(product as unknown as { category: { slug: string } }).category.slug}
          currentProductId={product.id}
        />
      )}

      <RecentlyViewedProducts
        excludeProductId={product.id}
        title="Recently Viewed"
        eyebrow="Keep shopping"
        description="A quick way to revisit the packaging products you explored before this one."
        viewAllLabel="See all products"
      />

      <BrowsingHistory excludeSlug={product.slug} />

      {/* Mobile bottom nav padding */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </div>
  );
}
