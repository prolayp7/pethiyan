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
import ProductDetailClient from "./ProductDetailClient";
import RelatedProducts from "@/components/product/RelatedProducts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pethiyan.com";

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

  const price = toNum(product.sale_price ?? product.price);
  const image = product.thumbnail ?? product.images?.[0];

  return {
    title: product.name,
    description:
      product.short_description ??
      `Buy ${product.name} online at Pethiyan. Premium packaging with GST invoice and fast shipping across India.`,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: `${product.name} | Pethiyan`,
      description:
        product.short_description ??
        `Buy ${product.name} online — GST invoice, fast delivery.`,
      url: `/products/${slug}`,
      type: "website",
      ...(image
        ? { images: [{ url: image, alt: product.name }] }
        : {}),
    },
    other: {
      "product:price:amount": String(price),
      "product:price:currency": "INR",
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
    ...(product.category
      ? [{ label: product.category.name, href: `/category/${product.category.slug}` }]
      : []),
    { label: product.name, href: `/products/${slug}` },
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
          ...(product.category
            ? [{ label: product.category.name, href: `/category/${product.category.slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      {/* All interactive product UI */}
      <ProductDetailClient product={product} reviews={reviews} faqs={faqs} />

      {/* Related products (server-fetched, same category) */}
      {product.category && (
        <RelatedProducts
          categorySlug={product.category.slug}
          currentProductId={product.id}
        />
      )}

      {/* Mobile bottom nav padding */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </div>
  );
}
