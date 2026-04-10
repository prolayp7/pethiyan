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
import { getCustomJsonLdSchemas, resolveVariantSeo } from "@/lib/seo";
import Breadcrumb from "@/components/common/Breadcrumb";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductDetailIsland from "../ProductDetailIsland";

// ─── Pre-render all known product+variant slug pairs at build time ─────────────

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.flatMap((p) =>
      (p.variants ?? [])
        .filter((v) => v.slug)
        .map((v) => ({ slug: p.slug, variantSlug: v.slug }))
    );
  } catch {
    return [];
  }
}

// ─── Dynamic SEO metadata (variant-level with product fallbacks) ──────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; variantSlug: string }>;
}): Promise<Metadata> {
  const { slug, variantSlug } = await params;
  const product = await getProduct(slug);

  if (!product) return { title: "Product Not Found" };

  const variant = product.variants?.find((v) => v.slug === variantSlug);
  if (!variant) return { title: "Variant Not Found" };

  const firstStorePricing = variant.store_pricing?.[0];
  const price = toNum(firstStorePricing?.special_price ?? firstStorePricing?.price ?? 0);
  const productTitle = product.title ?? "Product";
  const variantTitle = variant.title ?? variantSlug;
  const seo = resolveVariantSeo(product, variant);

  return {
    title: seo.title,
    description: seo.description,
    ...(seo.keywords ? { keywords: seo.keywords } : {}),
    robots: seo.indexable
      ? { index: true,  follow: true,  googleBot: { index: true,  follow: true  } }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    alternates: {
      canonical: `/products/${slug}/${variantSlug}`,
      languages: { "en": `/products/${slug}/${variantSlug}`, "x-default": `/products/${slug}/${variantSlug}` },
    },
    openGraph: {
      title: seo.openGraphTitle,
      description: seo.openGraphDescription,
      url: `/products/${slug}/${variantSlug}`,
      ...(seo.openGraphImage
        ? { images: [{ url: seo.openGraphImage, alt: `${productTitle} - ${variantTitle}` }] }
        : {}),
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
      "product:availability": variant.availability !== false ? "in stock" : "out of stock",
      "product:brand": "Pethiyan",
    },
  };
}

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default async function ProductVariantPage({
  params,
}: {
  params: Promise<{ slug: string; variantSlug: string }>;
}) {
  const { slug, variantSlug } = await params;

  const [product, reviews, faqs] = await Promise.all([
    getProduct(slug),
    getProductReviews(slug),
    getProductFaqs(slug),
  ]);

  if (!product) notFound();

  const variant = product.variants?.find((v) => v.slug === variantSlug);
  if (!variant) notFound();

  // ── JSON-LD schemas ──
  const seo = resolveVariantSeo(product, variant);
  const pSchema = productSchema(product, reviews, {
    variant,
    canonicalPath: `/products/${slug}/${variantSlug}`,
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
    { label: product.title, href: `/products/${slug}` },
    { label: variant.title, href: `/products/${slug}/${variantSlug}` },
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
        <script {...jsonLd(schema)} key={`variant-schema-${index}`} />
      ))}
      {customSchemas.map((schema, index) => (
        <script {...jsonLd(schema as Record<string, unknown>)} key={`variant-custom-schema-${index}`} />
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
          { label: product.title, href: `/products/${slug}` },
          { label: variant.title },
        ]}
      />

      {/* All interactive product UI — variant pre-selected via initialVariantSlug */}
      <ProductDetailIsland
        product={product}
        reviews={reviews}
        faqs={faqs}
        initialVariantSlug={variantSlug}
      />

      {(product as unknown as { category?: { slug: string } | null }).category && (
        <RelatedProducts
          categorySlug={(product as unknown as { category: { slug: string } }).category.slug}
          currentProductId={product.id}
        />
      )}

      <div className="h-16 lg:hidden" aria-hidden="true" />
    </div>
  );
}
