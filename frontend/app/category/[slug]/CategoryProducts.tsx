"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronDown, Package } from "lucide-react";
import Container from "@/components/layout/Container";
import ShopProductCard from "@/components/shop/ShopProductCard";
import { type RealApiProduct } from "@/lib/api";
import { readCatalogSortPreference, writeCatalogSortPreference } from "@/lib/catalog-preferences";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { label: "Featured",           value: "featured"   },
  { label: "Price: Low to High", value: "price-asc"  },
  { label: "Price: High to Low", value: "price-desc" },
];

function getPrice(p: RealApiProduct): number {
  const v = p.variants?.find((v) => v.is_default) ?? p.variants?.[0];
  const s = v?.store_pricing?.find((s) => s.stock_status === "in_stock") ?? v?.store_pricing?.[0];
  return s?.special_price || s?.price || 0;
}

function sortProducts(products: RealApiProduct[], sort: string): RealApiProduct[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":  return list.sort((a, b) => getPrice(a) - getPrice(b));
    case "price-desc": return list.sort((a, b) => getPrice(b) - getPrice(a));
    default:           return list;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoryProducts({ initialProducts }: { initialProducts: RealApiProduct[] }) {
  const [sort, setSort] = useState(() => readCatalogSortPreference());

  const sorted = useMemo(() => sortProducts(initialProducts, sort), [initialProducts, sort]);

  useEffect(() => {
    writeCatalogSortPreference(sort);
  }, [sort]);

  return (
    <Container>
      <div className="py-8">
        <div className="mb-6 flex justify-end">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none rounded-xl border border-(--color-border) bg-white py-2.5 pl-4 pr-9 text-sm transition focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30"
              aria-label="Sort category products"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          </div>
        </div>

        {/* Product grid */}
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
