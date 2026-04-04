import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

  const image = defaultVariant?.image ?? p.images.main_image;

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
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface FeaturedProductsProps {
  apiProducts?: RealApiProduct[];
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function FeaturedProducts({ apiProducts = [] }: FeaturedProductsProps) {
  const products: FallbackProduct[] =
    apiProducts.length > 0
      ? apiProducts.slice(0, 8).map(adapt)
      : staticProducts;

  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0d2150 0%, #0c1d38 30%, #091528 65%, #071023 100%)" }}
      aria-labelledby="featured-heading"
    >
      {/* Fine grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(70,190,150,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(70,190,150,0.045) 1px, transparent 1px),
            linear-gradient(rgba(60,130,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(60,130,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "10px 10px, 10px 10px, 50px 50px, 50px 50px",
        }}
      />

      <Container className="relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#4ea85f" }}>
              Bestsellers
            </p>
            <h2 id="featured-heading" className="text-3xl sm:text-4xl font-extrabold text-white">
              Featured Products
            </h2>
            <p className="mt-2 text-white/50">
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <FeaturedProductCard key={p.id} p={p} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 text-sm font-semibold transition-all"
            style={{ borderColor: "#6ea8d8", color: "#6ea8d8" }}
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
