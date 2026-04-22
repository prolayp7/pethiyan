"use client";

import { useMemo } from "react";
import { Package } from "lucide-react";
import Container from "@/components/layout/Container";
import ShopProductCard from "@/components/shop/ShopProductCard";
import { type RealApiProduct } from "@/lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPrice(p: RealApiProduct): number {
  const v = p.variants?.find((v) => v.is_default) ?? p.variants?.[0];
  const s = v?.store_pricing?.find((s) => s.stock_status === "in_stock") ?? v?.store_pricing?.[0];
  if (!s) return 0;
  // Prefer special_price (discounted), otherwise prefer cost (price without GST) when provided, else price
  const special = s.special_price ?? null;
  if (special != null) return Number(special) || 0;
  if (s.cost != null) return Number(s.cost) || 0;
  return Number(s.price) || 0;
}

export function sortProducts(products: RealApiProduct[], sort: string): RealApiProduct[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":  return list.sort((a, b) => getPrice(a) - getPrice(b));
    case "price-desc": return list.sort((a, b) => getPrice(b) - getPrice(a));
    default:           return list;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoryProducts({
  initialProducts,
  sort,
}: {
  initialProducts: RealApiProduct[];
  sort: string;
}) {
  const sorted = useMemo(() => sortProducts(initialProducts, sort), [initialProducts, sort]);

  return (
    <Container>
      <div className="py-8">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package className="h-16 w-16 text-gray-200 mb-4" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-(--color-secondary) mb-1">No products in this category</h2>
            <p className="text-sm text-gray-500">Check back soon or browse other categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sorted.map((product) => (
              <ShopProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
