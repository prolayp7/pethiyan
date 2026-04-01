"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, X, ChevronDown, Package } from "lucide-react";
import Container from "@/components/layout/Container";
import ShopProductCard from "@/components/shop/ShopProductCard";
import SkeletonCard from "@/components/shop/SkeletonCard";
import { toNum, type ApiProduct } from "@/lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

const INR_MAX = 5000;

function sortProducts(products: ApiProduct[], sort: string): ApiProduct[] {
  const list = [...products];
  switch (sort) {
    case "price-asc": return list.sort((a, b) => toNum(a.price) - toNum(b.price));
    case "price-desc": return list.sort((a, b) => toNum(b.price) - toNum(a.price));
    case "rating": return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    default: return list;
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CategoryProductsProps {
  initialProducts: ApiProduct[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoryProducts({ initialProducts }: CategoryProductsProps) {
  const [sort, setSort] = useState("featured");
  const [priceMax, setPriceMax] = useState(INR_MAX);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() =>
    sortProducts(
      initialProducts.filter((p) => {
        if (priceMax < INR_MAX && toNum(p.price) > priceMax) return false;
        return true;
      }),
      sort
    ),
    [initialProducts, sort, priceMax]
  );

  return (
    <Container>
      <div className="py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <p className="text-sm text-gray-500">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </p>

          <div className="flex items-center gap-3">
            {/* Mobile filter */}
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 bg-white border border-(--color-border) rounded-xl text-sm font-medium text-gray-700 hover:border-(--color-primary) transition"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2 text-sm bg-white border border-(--color-border) rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30 focus:border-(--color-primary) transition cursor-pointer"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Price filter (visible on sm+, collapsible on mobile) */}
        {filtersOpen && (
          <div className="sm:hidden mb-5 p-4 bg-white rounded-2xl border border-(--color-border)">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-(--color-secondary)">Max Price</h3>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <input
              type="range"
              min={0}
              max={INR_MAX}
              step={100}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-(--color-primary)"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₹0</span>
              <span className="font-semibold text-(--color-primary)">
                {priceMax >= INR_MAX ? "Any" : `₹${priceMax.toLocaleString("en-IN")}`}
              </span>
            </div>
          </div>
        )}

        {/* Desktop price filter strip */}
        <div className="hidden sm:flex items-center gap-4 mb-6 p-4 bg-white rounded-2xl border border-(--color-border)">
          <span className="text-xs font-bold text-(--color-secondary) uppercase tracking-wider shrink-0">
            Max Price
          </span>
          <input
            type="range"
            min={0}
            max={INR_MAX}
            step={100}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="flex-1 accent-(--color-primary)"
          />
          <span className="text-sm font-semibold text-(--color-primary) w-20 text-right shrink-0">
            {priceMax >= INR_MAX ? "Any" : `₹${priceMax.toLocaleString("en-IN")}`}
          </span>
          {priceMax < INR_MAX && (
            <button
              onClick={() => setPriceMax(INR_MAX)}
              className="text-xs text-red-500 hover:text-red-700 shrink-0"
            >
              Reset
            </button>
          )}
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package className="h-16 w-16 text-gray-200 mb-4" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-(--color-secondary) mb-1">
              No products in this category
            </h2>
            <p className="text-sm text-gray-500">
              Try adjusting your price filter or browse other categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ShopProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
