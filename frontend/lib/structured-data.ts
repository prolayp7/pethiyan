import type {
  ApiCategory,
  ApiProduct,
  ApiReview,
  ApiFaq,
  RealApiProduct,
  RealApiVariant,
} from "./api";
import { resolveStorePricingDisplay, selectPrimaryStorePricing } from "./api";

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

// ─── Category / Collection ───────────────────────────────────────────────────

export function collectionPageSchema(
  category: ApiCategory,
  products: { title?: string; name?: string; slug?: string }[] = [],
) {
  const categoryName = category.name?.trim() || category.title?.trim() || "Category";
  const url = `${SITE_URL}/category/${category.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: categoryName,
    url,
    description:
      category.description ||
      category.seo_description ||
      `Browse ${categoryName} products on ${SITE_NAME}.`,
    ...(category.image ? { image: category.image } : {}),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.slice(0, 24).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.title || product.name || `Product ${index + 1}`,
        url: `${SITE_URL}/products/${product.slug ?? ""}`,
      })),
    },
  };
}

// ─── Product ──────────────────────────────────────────────────────────────────

interface ProductSchemaOptions {
  variant?: RealApiVariant | null;
  canonicalPath?: string;
  titleOverride?: string;
  descriptionOverride?: string;
  imageOverride?: string;
}

export function productSchema(
  product: ApiProduct | RealApiProduct,
  reviews: ApiReview[] = [],
  options: ProductSchemaOptions = {},
) {
  const variant = options.variant ?? null;
  const productName = (
    options.titleOverride ??
    variant?.title ??
    (product as Partial<ApiProduct>).name ??
    (product as Partial<RealApiProduct>).title ??
    "Product"
  ).trim();
  const productSlug = (product as Partial<ApiProduct>).slug ?? (product as Partial<RealApiProduct>).slug ?? "";
  const productDescription =
    options.descriptionOverride ??
    (variant?.metadata?.seo_description as string | undefined) ??
    (variant?.seo_description as string | undefined) ??
    (product as Partial<ApiProduct>).short_description ??
    (product as Partial<RealApiProduct>).short_description ??
    (product as Partial<ApiProduct>).description ??
    (product as Partial<RealApiProduct>).description ??
    "";

  const storePrice = resolveStorePricingDisplay(
    selectPrimaryStorePricing((product as Partial<RealApiProduct>).variants?.[0]?.store_pricing)
  ).mainPrice;

  const fallbackPrice =
    typeof (product as Partial<ApiProduct>).sale_price === "number" ||
    typeof (product as Partial<ApiProduct>).sale_price === "string"
      ? Number((product as Partial<ApiProduct>).sale_price) || Number((product as Partial<ApiProduct>).price)
      : Number((product as Partial<ApiProduct>).price);

  const variantPrice = resolveStorePricingDisplay(selectPrimaryStorePricing(variant?.store_pricing)).mainPrice;
  const price = Number.isFinite(variantPrice) && variantPrice > 0
    ? variantPrice
    : Number.isFinite(storePrice) && storePrice > 0
    ? storePrice
    : fallbackPrice;

  const imageList = options.imageOverride
    ? [options.imageOverride]
    : variant?.image
    ? [variant.image]
    : (product as Partial<RealApiProduct>).images?.all?.length
    ? (product as Partial<RealApiProduct>).images?.all
    : (product as Partial<ApiProduct>).images?.length
    ? (product as Partial<ApiProduct>).images
    : (product as Partial<RealApiProduct>).images?.main_image
    ? [(product as Partial<RealApiProduct>).images?.main_image as string]
    : (product as Partial<ApiProduct>).thumbnail
    ? [(product as Partial<ApiProduct>).thumbnail as string]
    : undefined;

  const stock =
    variant?.store_pricing?.[0]?.stock ??
    (product as Partial<RealApiProduct>).variants?.[0]?.store_pricing?.[0]?.stock ??
    (product as Partial<ApiProduct>).stock ??
    null;

  const productSku =
    variant?.slug ||
    (product as Partial<ApiProduct>).sku ||
    (product as Partial<RealApiProduct>).features?.["sku" as never] ||
    String(product.id);

  const firstVariantBarcode =
    variant?.barcode ||
    (product as Partial<RealApiProduct>).variants?.[0]?.barcode ||
    undefined;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description: productDescription,
    sku: productSku,
    ...(firstVariantBarcode ? { mpn: firstVariantBarcode } : {}),
    brand: (product as Partial<ApiProduct>).brand
      ? { "@type": "Brand", name: (product as Partial<ApiProduct>).brand?.name }
      : { "@type": "Brand", name: "Pethiyan" },
    image: imageList,
    offers: {
      "@type": "Offer",
      url: options.canonicalPath
        ? `${SITE_URL}${options.canonicalPath}`
        : `${SITE_URL}/products/${productSlug}`,
      priceCurrency: "INR",
      price: price.toFixed(2),
      availability:
        stock == null || stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };

  if ((product as Partial<ApiProduct>).rating != null && (product as Partial<ApiProduct>).reviews_count != null) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: (product as Partial<ApiProduct>).rating,
      reviewCount: (product as Partial<ApiProduct>).reviews_count,
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
