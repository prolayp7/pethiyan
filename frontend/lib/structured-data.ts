import type { ApiProduct, ApiReview, ApiFaq } from "./api";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pethiyan.com";
const SITE_NAME = "Pethiyan";
const SITE_DESCRIPTION =
  "High-quality packaging products — pouches, jars, delivery boxes and custom packaging for modern brands.";

// ─── Organization ─────────────────────────────────────────────────────────────

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/pethiyan-logo.png`,
      width: 160,
      height: 70,
    },
    image: `${SITE_URL}/opengraph-image.png`,
    description: SITE_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "400001",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-98765-43210",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    sameAs: [],
  };
}

// ─── Website (with SearchAction) ─────────────────────────────────────────────

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href.startsWith("http") ? item.href : `${SITE_URL}${item.href}`,
    })),
  };
}

// ─── Product ──────────────────────────────────────────────────────────────────

export function productSchema(product: ApiProduct, reviews: ApiReview[] = []) {
  const price =
    typeof product.sale_price === "number" || typeof product.sale_price === "string"
      ? Number(product.sale_price) || Number(product.price)
      : Number(product.price);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? product.description ?? "",
    sku: String(product.id),
    brand: product.brand
      ? { "@type": "Brand", name: product.brand.name }
      : undefined,
    image: product.thumbnail
      ? [product.thumbnail]
      : product.images?.length
      ? product.images
      : undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: "INR",
      price: price.toFixed(2),
      availability:
        product.stock == null || product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };

  if (product.rating != null && product.reviews_count != null) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews_count,
    };
  }

  if (reviews.length > 0) {
    schema.review = reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
      },
      author: {
        "@type": "Person",
        name: r.user?.name ?? "Verified Buyer",
      },
      reviewBody: r.comment,
      datePublished: r.created_at,
    }));
  }

  return schema;
}

// ─── FAQ Page ─────────────────────────────────────────────────────────────────

export function faqPageSchema(faqs: ApiFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ─── Static FAQ schema (for hardcoded FAQ page) ───────────────────────────────

export function staticFaqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

// ─── ItemList schema (for category/shop pages) ────────────────────────────────

export function itemListSchema(
  items: { name: string; url: string; position: number }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map(({ name, url, position }) => ({
      "@type": "ListItem",
      position,
      name,
      url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    })),
  };
}

// ─── Local Business ───────────────────────────────────────────────────────────

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    image: `${SITE_URL}/pethiyan-logo.png`,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, UPI, Net Banking",
  };
}

// ─── JSON-LD Script helper ────────────────────────────────────────────────────
// Usage in a Server Component:
//   import { jsonLd } from "@/lib/structured-data";
//   <script {...jsonLd(productSchema(product))} />

export function jsonLd(schema: Record<string, unknown>) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(schema) },
  };
}
