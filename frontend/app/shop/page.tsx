"use client";

import type { Metadata } from "next";
import { useState, useEffect, useCallback, useTransition } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Package,
} from "lucide-react";
import Container from "@/components/layout/Container";
import Breadcrumb from "@/components/common/Breadcrumb";
import ShopProductCard from "@/components/shop/ShopProductCard";
import SkeletonCard from "@/components/shop/SkeletonCard";
import {
  getProducts,
  getCategories,
  searchProducts,
  toNum,
  type ApiProduct,
  type ApiCategory,
} from "@/lib/api";

// Note: metadata must be exported from a Server Component.
// For client pages, set the title via document.title or use a parent layout.
// The shop page title is handled by layout.tsx template: "Shop | Pethiyan"

// ─── Sort options ─────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Newest", value: "newest" },
];

const INR_MAX = 5000; // max price range in rupees

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sortProducts(products: ApiProduct[], sort: string): ApiProduct[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => toNum(a.price) - toNum(b.price));
    case "price-desc":
      return list.sort((a, b) => toNum(b.price) - toNum(a.price));
    case "rating":
      return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    default:
      return list;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sort, setSort] = useState("featured");
  const [priceMax, setPriceMax] = useState<number>(INR_MAX);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Fetch on mount
  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Search API call
  useEffect(() => {
    if (!debouncedSearch.trim()) return;
    startTransition(() => {
      setLoading(true);
      searchProducts(debouncedSearch).then((res) => {
        setProducts(res);
        setLoading(false);
      });
    });
  }, [debouncedSearch]);

  // Reset search — reload all products
  const handleClearSearch = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setLoading(true);
    getProducts().then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, []);

  // Apply local filters
  const filtered = sortProducts(
    products.filter((p) => {
      const price = toNum(p.price);
      if (priceMax < INR_MAX && price > priceMax) return false;
      if (selectedCategory && p.category?.id !== selectedCategory) return false;
      return true;
    }),
    sort
  );

  return (
    <div className="min-h-screen bg-(--background)">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Shop" }]} />

      {/* Page header */}
      <div className="bg-white border-b border-(--color-border) py-8">
        <Container>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-(--color-secondary)">
            All Products
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            {loading
              ? "Loading products…"
              : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </Container>
      </div>

      <Container>
        <div className="py-8 flex gap-8">

          {/* Mobile overlay */}
          {filtersOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setFiltersOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* ── Filter Sidebar ── */}
          <aside
            className={`
              fixed inset-y-0 left-0 z-50 w-72 bg-white overflow-y-auto transform transition-transform duration-300 shadow-2xl
              lg:static lg:z-auto lg:w-56 lg:min-w-56 lg:shadow-none lg:transform-none lg:translate-x-0 lg:overflow-visible lg:bg-transparent
              ${filtersOpen ? "translate-x-0" : "-translate-x-full"}
            `}
            aria-label="Product filters"
          >
            <div className="p-6 lg:p-0 lg:sticky lg:top-24 space-y-6">
              {/* Mobile header */}
              <div className="flex items-center justify-between lg:hidden">
                <h2 className="font-bold text-lg text-(--color-secondary)">Filters</h2>
                <button
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                  className="p-1"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Category filter */}
              <div>
                <h3 className="text-xs font-bold text-(--color-secondary) uppercase tracking-wider mb-3">
                  Category
                </h3>
                <ul className="space-y-0.5">
                  <li>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === null
                          ? "bg-(--color-primary) text-white font-semibold"
                          : "text-gray-600 hover:bg-(--color-muted)"
                      }`}
                    >
                      All Categories
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => { setSelectedCategory(cat.id); setFiltersOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat.id
                            ? "bg-(--color-primary) text-white font-semibold"
                            : "text-gray-600 hover:bg-(--color-muted)"
                        }`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                  {categories.length === 0 && !loading && (
                    <li className="text-xs text-gray-400 px-3 py-2">No categories found</li>
                  )}
                </ul>
              </div>

              {/* Price range */}
              <div>
                <h3 className="text-xs font-bold text-(--color-secondary) uppercase tracking-wider mb-3">
                  Max Price
                </h3>
                <input
                  type="range"
                  min={0}
                  max={INR_MAX}
                  step={100}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-(--color-primary)"
                  aria-label="Maximum price filter"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0</span>
                  <span className="font-semibold text-(--color-primary)">
                    {priceMax >= INR_MAX ? "Any" : `₹${priceMax.toLocaleString("en-IN")}`}
                  </span>
                </div>
              </div>

              {/* Reset */}
              {(selectedCategory !== null || priceMax < INR_MAX) && (
                <button
                  onClick={() => { setSelectedCategory(null); setPriceMax(INR_MAX); }}
                  className="w-full text-center text-sm text-red-500 hover:text-red-700 transition-colors py-2 border border-red-200 rounded-lg hover:bg-red-50"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </aside>

          {/* ── Main ── */}
          <div className="flex-1 min-w-0">
            {/* Search + Sort toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-(--color-border) rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30 focus:border-(--color-primary) transition"
                  aria-label="Search products"
                />
                {search && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-(--color-border) rounded-xl text-sm font-medium text-gray-700 hover:border-(--color-primary) transition"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Filters
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none pl-4 pr-9 py-2.5 text-sm bg-white border border-(--color-border) rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30 focus:border-(--color-primary) transition cursor-pointer"
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
              </div>
            </div>

            {/* Product grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Package className="h-16 w-16 text-gray-200 mb-4" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-(--color-secondary) mb-1">
                  No products found
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Try adjusting your search or filters.
                </p>
                <button
                  onClick={handleClearSearch}
                  className="px-5 py-2 rounded-full bg-(--color-primary) text-white text-sm font-semibold hover:bg-(--color-primary-dark) transition"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((product) => (
                  <ShopProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile bottom padding */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </div>
  );
}
