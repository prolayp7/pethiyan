"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import FeaturedProductCard, { type FallbackProduct } from "@/components/ui/FeaturedProductCard";
import type { RealApiProduct, RealApiVariant } from "@/lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDefaultVariant(variants: RealApiVariant[]): RealApiVariant | null {
  return variants.find((v) => v.is_default) ?? variants[0] ?? null;
}

function getBestPricing(variant: RealApiVariant) {
  return (
    variant.store_pricing.find((s) => s.stock_status === "in_stock") ??
    variant.store_pricing[0] ??
    null
  );
}

function getMinPrice(variants: RealApiVariant[]): number {
  const prices = variants
    .flatMap((v) => v.store_pricing.map((s) => s.special_price ?? s.price))
    .filter(Boolean);
  return prices.length ? Math.min(...prices) : 0;
}

function getColors(variants: RealApiVariant[]): string[] {
  const seen = new Set<string>();
  const colors: string[] = [];
  for (const v of variants) {
    const c = v.attributes?.color;
    if (c && !seen.has(c)) { seen.add(c); colors.push(c); }
  }
  return colors;
}

// ─── Static fallback data ─────────────────────────────────────────────────────

const staticProducts: FallbackProduct[] = [
  { id: "sp-001", name: "Matte Standup Pouch — 500g",        price: 129, originalPrice: 179, badge: "Sale", href: "/products/matte-standup-pouch-500g",        minQty: 10, gstRate: "18", colors: [],              variantCount: 3, inStock: true  },
  { id: "zl-001", name: "Resealable Ziplock Bag — 250ml",    price: 84,                      badge: "New",  href: "/products/resealable-ziplock-clear-250ml",   minQty: 20, gstRate: "12", colors: ["Transparent"], variantCount: 2, inStock: true  },
  { id: "cp-001", name: "Custom Printed Pouch — Full Colour", price: 249, originalPrice: 299, badge: "Hot",  href: "/products/custom-printed-pouch-full-colour", minQty: 50, gstRate: "18", colors: [],              variantCount: 5, inStock: true  },
  { id: "ep-001", name: "Kraft Paper Eco Bag — 1kg",         price: 149,                     badge: "New",  href: "/products/kraft-paper-eco-bag-1kg",          minQty: 10, gstRate: "5",  colors: ["Brown"],       variantCount: 2, inStock: true  },
  { id: "sp-002", name: "Glossy Standup Pouch — 1kg Window", price: 154, originalPrice: 199,                href: "/products/glossy-standup-pouch-1kg-window",  minQty: 10, gstRate: "18", colors: [],              variantCount: 4, inStock: true  },
  { id: "pb-001", name: "Heavy Duty Packaging Bag — 2kg",    price: 99,                                     href: "/products/heavy-duty-packaging-bag-2kg",     minQty: 5,  gstRate: "12", colors: [],              variantCount: 1, inStock: true  },
  { id: "zl-002", name: "Frosted Ziplock Bag — 100ml × 50",  price: 119, originalPrice: 149, badge: "Sale", href: "/products/frosted-ziplock-bag-100ml-pack50", minQty: 20, gstRate: "12", colors: ["Transparent"], variantCount: 2, inStock: false },
  { id: "ep-002", name: "Biodegradable Compostable Mailer",   price: 189,                     badge: "New",  href: "/products/biodegradable-compostable-mailer", minQty: 25, gstRate: "5",  colors: [],              variantCount: 3, inStock: true  },
];

// ─── Adapter: RealApiProduct → FallbackProduct ────────────────────────────────

function adapt(p: RealApiProduct): FallbackProduct {
  const defaultVariant = getDefaultVariant(p.variants);
  const pricing        = defaultVariant ? getBestPricing(defaultVariant) : null;
  const minPrice       = getMinPrice(p.variants);
  const colors         = getColors(p.variants);

  const price     = pricing?.special_price ?? pricing?.price ?? minPrice;
  const origPrice = pricing && pricing.price > pricing.special_price
    ? pricing.price : undefined;

  let badge: FallbackProduct["badge"] = undefined;
  if (origPrice && origPrice > price)  badge = "Sale";
  else if (p.tags?.includes("new"))    badge = "New";
  else if (p.tags?.includes("hot"))    badge = "Hot";

  const inStock = p.variants.some((v) =>
    v.store_pricing.some((s) => s.stock_status === "in_stock")
  );

  const image = defaultVariant?.image || p.images.main_image || undefined;

  return {
    id:               String(p.id),
    name:             p.title,
    price,
    originalPrice:    origPrice,
    badge,
    image,
    unoptimizedImage: /^https?:\/\/(localhost|127\.0\.0\.1)/.test(image ?? ""),
    href:             `/products/${p.slug}`,
    minQty:           p.policies.minimum_order_quantity,
    gstRate:          p.tax.gst_rate,
    colors,
    variantCount:     p.variants.length,
    inStock,
    defaultVariantId: defaultVariant?.id ?? undefined,
    defaultStoreId: pricing?.store_id ?? undefined,
    category: p.category?.title ?? undefined,
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface FeaturedProductsProps {
  apiProducts?: RealApiProduct[];
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function FeaturedProducts({ apiProducts = [] }: FeaturedProductsProps) {
  const mobileSliderRef = useRef<HTMLDivElement | null>(null);
  const products: FallbackProduct[] =
    apiProducts.length > 0
      ? apiProducts.slice(0, 8).map(adapt)
      : staticProducts;

  function scrollMobileProducts(direction: "prev" | "next") {
    const el = mobileSliderRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-featured-slide]");
    const gap = 20;
    const cardWidth = firstCard?.offsetWidth ?? el.clientWidth * 0.82;
    const amount = cardWidth + gap;
    el.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }

  return (
    <section
      className="relative overflow-hidden pt-5 pb-6 sm:pt-8 sm:pb-16"
      style={{ background: "#ffffff" }}
      aria-labelledby="featured-heading"
    >
      <Container className="relative z-10">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between sm:mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#4ea85f" }}>
              Bestsellers
            </p>
            <h2
              id="featured-heading"
              className="text-3xl sm:text-4xl font-extrabold"
              style={{
                backgroundImage: "linear-gradient(135deg, #1a4f83 0%, #2b6e92 48%, #2d8b6a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Featured Products
            </h2>
            <p className="mt-2 text-[#4f6281]">
              Handpicked packaging solutions loved by thousands of brands
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5"
            style={{ color: "#6ea8d8" }}
          >
            View All
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile slider */}
        <div className="overflow-hidden sm:hidden">
          <div className="relative">
            <button
              type="button"
              onClick={() => scrollMobileProducts("prev")}
              aria-label="Scroll featured products left"
              className="absolute left-2 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8d7ea] bg-white/95 text-[#1a4f83] shadow-sm transition-colors hover:bg-[#f3f8ff]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollMobileProducts("next")}
              aria-label="Scroll featured products right"
              className="absolute right-2 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8d7ea] bg-white/95 text-[#1a4f83] shadow-sm transition-colors hover:bg-[#f3f8ff]"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <div
              ref={mobileSliderRef}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-12 pb-4 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Featured products slider"
              style={{ scrollbarWidth: "none" }}
            >
              {products.map((p) => (
                <div
                  key={p.id}
                  data-featured-slide
                  className="w-[85%] max-w-[320px] shrink-0 snap-start"
                >
                  <FeaturedProductCard p={p} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <FeaturedProductCard key={p.id} p={p} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-4 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)",
              boxShadow: "0 10px 24px rgba(47,111,159,0.18)",
            }}
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
