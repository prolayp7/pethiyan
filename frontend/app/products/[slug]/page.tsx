import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getProduct,
  getProductReviews,
  getProductFaqs,
  getProducts,
  toNum,
} from "@/lib/api";
import {
  productSchema,
  breadcrumbSchema,
  faqPageSchema,
  jsonLd,
} from "@/lib/structured-data";
import Breadcrumb from "@/components/common/Breadcrumb";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductDetailIsland from "./ProductDetailIsland";

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
  const firstStorePricing = firstVariant?.store_pricing?.[0];
  const price = toNum(firstStorePricing?.special_price ?? firstStorePricing?.price ?? 0);
  const image = product.images?.main_image ?? product.images?.all?.[0];
  const rawTitle = product.title ?? "Product";
  const title = product.features?.seo_title || rawTitle;
  const description =
    product.features?.seo_description ||
    product.short_description ||
    `Buy ${rawTitle} online at Pethiyan. Premium packaging with GST invoice and fast shipping across India.`;
  const keywords = product.features?.seo_keywords || undefined;
  const indexable = product.features?.is_indexable !== false;
  const inStock = firstVariant?.availability !== false;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    robots: indexable
      ? { index: true,  follow: true,  googleBot: { index: true,  follow: true  } }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    alternates: {
      canonical: `/products/${slug}`,
      languages: { "en": `/products/${slug}`, "x-default": `/products/${slug}` },
    },
    openGraph: {
      title: `${title} | Pethiyan`,
      description,
      url: `/products/${slug}`,
      ...(image ? { images: [{ url: image, alt: rawTitle }] } : {}),
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
  const pSchema = productSchema(product, reviews);
  const bcSchema = breadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    ...((product as unknown as { category?: { name: string; slug: string } | null }).category
      ? [{
          label: (product as unknown as { category: { name: string } }).category.name,
          href: `/category/${(product as unknown as { category: { slug: string } }).category.slug}`,
        }]
      : []),
    { label: product.title, href: `/products/${slug}` },
  ]);

  return (
    <div className="min-h-screen bg-(--background)">
      {/* JSON-LD */}
      <script {...jsonLd(pSchema)} key="product-schema" />
      <script {...jsonLd(bcSchema)} key="breadcrumb-schema" />
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
          { label: product.title },
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

      {/* Mobile bottom nav padding */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </div>
  );
}
