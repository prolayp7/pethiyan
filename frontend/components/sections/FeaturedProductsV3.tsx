import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import ProductCard, { type Product } from "@/components/ui/ProductCard";
import type { ApiProduct } from "@/lib/api";
import { toNum } from "@/lib/api";

// ─── Static fallback data (used when API returns nothing) ─────────────────────

const staticProducts: Product[] = [
  {
    id: "sp-001",
    name: "Matte Standup Pouch — 500g",
    price: 129,
    originalPrice: 179,
    rating: 5,
    reviewCount: 124,
    badge: "Sale",
    category: "standup",
    href: "/products/matte-standup-pouch-500g",
  },
  {
    id: "zl-001",
    name: "Resealable Ziplock Bag — Clear 250ml",
    price: 84,
    rating: 4,
    reviewCount: 89,
    badge: "New",
    category: "ziplock",
    href: "/products/resealable-ziplock-clear-250ml",
  },
  {
    id: "cp-001",
    name: "Custom Printed Pouch — Full Colour",
    price: 249,
    originalPrice: 299,
    rating: 5,
    reviewCount: 56,
    badge: "Hot",
    category: "custom",
    href: "/products/custom-printed-pouch-full-colour",
  },
  {
    id: "ep-001",
    name: "Kraft Paper Eco Bag — 1kg",
    price: 149,
    rating: 4,
    reviewCount: 203,
    badge: "New",
    category: "eco",
    href: "/products/kraft-paper-eco-bag-1kg",
  },
  {
    id: "sp-002",
    name: "Glossy Standup Pouch — 1kg Window",
    price: 154,
    originalPrice: 199,
    rating: 4,
    reviewCount: 77,
    category: "standup",
    href: "/products/glossy-standup-pouch-1kg-window",
  },
  {
    id: "pb-001",
    name: "Heavy Duty Packaging Bag — 2kg",
    price: 99,
    rating: 4,
    reviewCount: 44,
    category: "bags",
    href: "/products/heavy-duty-packaging-bag-2kg",
  },
  {
    id: "zl-002",
    name: "Frosted Ziplock Bag — 100ml (Pack of 50)",
    price: 119,
    originalPrice: 149,
    rating: 5,
    reviewCount: 161,
    badge: "Sale",
    category: "ziplock",
    href: "/products/frosted-ziplock-bag-100ml-pack50",
  },
  {
    id: "ep-002",
    name: "Biodegradable Compostable Mailer Bag",
    price: 189,
    rating: 5,
    reviewCount: 92,
    badge: "New",
    category: "eco",
    href: "/products/biodegradable-compostable-mailer",
  },
];

// ─── Adapter: ApiProduct → Product ───────────────────────────────────────────

function toProduct(p: ApiProduct): Product {
  const rawPrice =
    (p as any).store_pricing?.[0]?.special_price ??
    (p as any).store_pricing?.[0]?.cost ??
    p.sale_price ??
    p.price;
  const price = toNum(rawPrice);
  // comparePrice: use cost (GST-excluded) as the strikethrough — only show if special_price < cost
  const costPrice = toNum((p as any).store_pricing?.[0]?.cost ?? p.compare_price);
  const comparePrice = price < costPrice ? costPrice : 0;

  // Determine badge
  let badge: Product["badge"] = undefined;
  if ((p as any).store_pricing?.[0]?.discount_percent > 0) badge = "Sale";
  else if (p.tags?.includes("new")) badge = "New";
  else if (p.tags?.includes("hot")) badge = "Hot";

  return {
    id: String(p.id),
    name: p.name,
    price,
    originalPrice: comparePrice > 0 ? comparePrice : undefined,
    rating: p.rating ?? 0,
    reviewCount: p.reviews_count ?? 0,
    badge,
    category: p.category?.slug ?? "bags",
    href: `/products/${p.slug}`,
    image: p.thumbnail ?? (p.images?.[0] ?? null),
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface FeaturedProductsProps {
  apiProducts?: ApiProduct[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FeaturedProducts({ apiProducts = [] }: FeaturedProductsProps) {
  const products: Product[] =
    apiProducts.length > 0
      ? apiProducts.slice(0, 8).map(toProduct)
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
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-(--color-primary) uppercase tracking-wider mb-2">
              Bestsellers
            </p>
            <h2
              id="featured-heading"
              className="text-3xl sm:text-4xl font-extrabold text-white"
            >
              Featured Products
            </h2>
            <p className="mt-2 text-white/50">
              Handpicked packaging solutions loved by thousands of brands
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-(--color-primary) hover:gap-2.5 transition-all"
          >
            View All
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-(--color-primary) text-(--color-primary) text-sm font-semibold hover:bg-(--color-primary) hover:text-white transition-all"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
