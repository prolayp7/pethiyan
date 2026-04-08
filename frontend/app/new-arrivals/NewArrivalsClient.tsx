"use client";

import { useState, useMemo } from "react";
import { Search, X, Package, Sparkles } from "lucide-react";
import Container from "@/components/layout/Container";
import Breadcrumb from "@/components/common/Breadcrumb";
import ShopProductCard from "@/components/shop/ShopProductCard";
import { type RealApiProduct } from "@/lib/api";

const SORT_OPTIONS = [
  { label: "Newest First",         value: "newest"     },
  { label: "Price: Low to High",   value: "price-asc"  },
  { label: "Price: High to Low",   value: "price-desc" },
  { label: "Featured",             value: "featured"   },
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
    case "featured":   return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    default:           return list; // newest — already ordered by created_at DESC from API
  }
}

interface Props {
  initialProducts: RealApiProduct[];
}

export default function NewArrivalsClient({ initialProducts }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matched = q
      ? initialProducts.filter((p) =>
          p.title?.toLowerCase().includes(q) ||
          p.short_description?.toLowerCase().includes(q) ||
          (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q))) ||
          p.variants?.some((v) => v.title?.toLowerCase().includes(q))
        )
      : initialProducts;
    return sortProducts(matched, sort);
  }, [initialProducts, search, sort]);

  return (
    <div className="min-h-screen bg-(--background)">
      <Breadcrumb items={[{ label: "New Arrivals" }]} />

      {/* Page header */}
      <div className="bg-white py-8">
        <Container>
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center h-10 w-10 rounded-xl shrink-0"
              style={{ background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)" }}
            >
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-(--color-secondary)">
                New Arrivals
              </h1>
              <p className="mt-0.5 text-gray-500 text-sm">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""} · Added in the last 30 days
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-8">
          {/* Search + Sort toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search new arrivals…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-(--color-border) rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30 focus:border-(--color-primary) transition"
                aria-label="Search new arrivals"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 text-sm bg-white border border-(--color-border) rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30 focus:border-(--color-primary) transition cursor-pointer"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Package className="h-16 w-16 text-gray-200 mb-4" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-(--color-secondary) mb-1">No products found</h2>
              <p className="text-sm text-gray-500 mb-6">
                {search ? "Try adjusting your search." : "No new products have been added recently."}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="btn-brand px-5 py-2 rounded-full text-sm font-semibold"
                >
                  Clear Search
                </button>
              )}
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
    </div>
  );
}
