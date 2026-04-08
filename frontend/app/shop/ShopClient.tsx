"use client";

import { useState, useEffect, useCallback, useTransition, useMemo } from "react";
import {
  Search, SlidersHorizontal, X, ChevronDown, ChevronRight, Package,
} from "lucide-react";
import Container from "@/components/layout/Container";
import Breadcrumb from "@/components/common/Breadcrumb";
import ShopProductCard from "@/components/shop/ShopProductCard";
import SkeletonCard from "@/components/shop/SkeletonCard";
import {
  searchProducts, type RealApiProduct, type ApiCategory,
} from "@/lib/api";

const SORT_OPTIONS = [
  { label: "Featured",           value: "featured"   },
  { label: "Price: Low to High", value: "price-asc"  },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated",          value: "rating"     },
  { label: "Newest",             value: "newest"     },
];

const INR_MAX = 5000;

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

// ── Checkbox component with brand accent ──────────────────────────────────────
function CategoryCheckbox({
  id, label, checked, onChange, count, indent = false,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
  indent?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-2.5 py-1.5 cursor-pointer group ${indent ? "pl-5" : ""}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {/* Custom checkbox */}
      <span
        className={`flex-shrink-0 h-4 w-4 rounded border-2 flex items-center justify-center transition-all ${
          checked
            ? "border-transparent"
            : "border-gray-300 group-hover:border-[#2f6f9f]"
        }`}
        style={checked ? { background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)" } : undefined}
        aria-hidden="true"
      >
        {checked && (
          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className={`text-sm leading-tight flex-1 ${checked ? "text-[#17396f] font-semibold" : "text-gray-600 group-hover:text-gray-900"} transition-colors`}>
        {label}
      </span>
      {count !== undefined && (
        <span className="text-[10px] text-gray-400 tabular-nums">{count}</span>
      )}
    </label>
  );
}

interface Props {
  initialProducts: RealApiProduct[];
  initialCategories: ApiCategory[];
  initialSubCategories: ApiCategory[];
}

export default function ShopClient({ initialProducts, initialCategories, initialSubCategories }: Props) {
  const [products, setProducts]           = useState<RealApiProduct[]>(initialProducts);
  const [searchLoading, setSearchLoading] = useState(false);
  const [, startTransition]               = useTransition();

  const [search,          setSearch]          = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedIds,     setSelectedIds]     = useState<Set<number>>(new Set());
  const [expandedCats,    setExpandedCats]    = useState<Set<number>>(new Set());
  const [sort,    setSort]    = useState("featured");
  const [priceMax, setPriceMax] = useState<number>(INR_MAX);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Build nested structure: parent categories + their sub-categories
  const categoryTree = useMemo(() => {
    return initialCategories.map((cat) => ({
      ...cat,
      children: initialSubCategories.filter((s) => s.parent_id === cat.id),
    }));
  }, [initialCategories, initialSubCategories]);

  // Orphan sub-categories (parent not in initialCategories)
  const orphanSubs = useMemo(() => {
    const parentIds = new Set(initialCategories.map((c) => c.id));
    return initialSubCategories.filter((s) => s.parent_id == null || !parentIds.has(s.parent_id));
  }, [initialCategories, initialSubCategories]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Search API call
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setProducts(initialProducts);
      return;
    }
    startTransition(() => {
      setSearchLoading(true);
      searchProducts(debouncedSearch).then((res) => {
        setProducts(res as unknown as RealApiProduct[]);
        setSearchLoading(false);
      });
    });
  }, [debouncedSearch, initialProducts]);

  const handleClearSearch = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setProducts(initialProducts);
  }, [initialProducts]);

  const toggleId = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleExpand = useCallback((id: number) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedIds(new Set());
    setPriceMax(INR_MAX);
  }, []);

  const filtered = sortProducts(
    products.filter((p) => {
      if (priceMax < INR_MAX && getPrice(p) > priceMax) return false;
      if (selectedIds.size > 0) {
        const catId = p.category?.id ?? p.category_id ?? -1;
        if (!selectedIds.has(catId)) return false;
      }
      return true;
    }),
    sort
  );

  const hasActiveFilters = selectedIds.size > 0 || priceMax < INR_MAX;

  return (
    <div className="min-h-screen bg-(--background)">
      <Breadcrumb items={[{ label: "Shop" }]} />

      <div className="bg-white border-b border-(--color-border) py-8">
        <Container>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-(--color-secondary)">
            All Products
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            {searchLoading
              ? "Searching…"
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
              lg:static lg:z-auto lg:w-60 lg:min-w-60 lg:shadow-none lg:transform-none lg:translate-x-0 lg:overflow-visible lg:bg-transparent
              ${filtersOpen ? "translate-x-0" : "-translate-x-full"}
            `}
            aria-label="Product filters"
          >
            <div className="p-6 lg:p-0 lg:sticky lg:top-24 space-y-6">
              {/* Mobile header */}
              <div className="flex items-center justify-between lg:hidden">
                <h2 className="font-bold text-lg text-(--color-secondary)">Filters</h2>
                <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="p-1">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* ── Category filter ── */}
              <div>
                <h3 className="text-xs font-bold text-(--color-secondary) uppercase tracking-wider mb-3">
                  Category
                </h3>

                {initialCategories.length === 0 && initialSubCategories.length === 0 ? (
                  <p className="text-xs text-gray-400 py-1">No categories found</p>
                ) : (
                  <div className="space-y-0.5">
                    {categoryTree.map((cat) => {
                      const hasSubs = cat.children.length > 0;
                      const expanded = expandedCats.has(cat.id);
                      return (
                        <div key={cat.id}>
                          {/* Parent row */}
                          <div className="flex items-center">
                            <div className="flex-1">
                              <CategoryCheckbox
                                id={`cat-${cat.id}`}
                                label={cat.title}
                                checked={selectedIds.has(cat.id)}
                                onChange={() => toggleId(cat.id)}
                                count={cat.product_count}
                              />
                            </div>
                            {hasSubs && (
                              <button
                                onClick={() => toggleExpand(cat.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label={expanded ? "Collapse subcategories" : "Expand subcategories"}
                              >
                                {expanded
                                  ? <ChevronDown className="h-3.5 w-3.5" />
                                  : <ChevronRight className="h-3.5 w-3.5" />}
                              </button>
                            )}
                          </div>

                          {/* Sub-categories */}
                          {hasSubs && expanded && (
                            <div className="mt-0.5 border-l-2 border-gray-100 ml-2 space-y-0.5">
                              {cat.children.map((sub) => (
                                <CategoryCheckbox
                                  key={sub.id}
                                  id={`cat-${sub.id}`}
                                  label={sub.title}
                                  checked={selectedIds.has(sub.id)}
                                  onChange={() => toggleId(sub.id)}
                                  count={sub.product_count}
                                  indent
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Orphan sub-categories (no matched parent) */}
                    {orphanSubs.map((sub) => (
                      <CategoryCheckbox
                        key={sub.id}
                        id={`cat-${sub.id}`}
                        label={sub.title}
                        checked={selectedIds.has(sub.id)}
                        onChange={() => toggleId(sub.id)}
                        count={sub.product_count}
                      />
                    ))}
                  </div>
                )}

                {/* Selected summary */}
                {selectedIds.size > 0 && (
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="mt-2 text-[11px] text-[#2f6f9f] hover:text-[#17396f] transition-colors"
                  >
                    Clear ({selectedIds.size} selected)
                  </button>
                )}
              </div>

              {/* ── Price range ── */}
              <div>
                <h3 className="text-xs font-bold text-(--color-secondary) uppercase tracking-wider mb-3">
                  Max Price
                </h3>
                <input
                  type="range"
                  min={0} max={INR_MAX} step={100}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: "#2f6f9f" }}
                  aria-label="Maximum price filter"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0</span>
                  <span className="font-semibold" style={{ color: "#2f6f9f" }}>
                    {priceMax >= INR_MAX ? "Any" : `₹${priceMax.toLocaleString("en-IN")}`}
                  </span>
                </div>
              </div>

              {/* Reset */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
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
                  <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Clear search">
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-(--color-border) rounded-xl text-sm font-medium text-gray-700 hover:border-(--color-primary) transition"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 h-5 w-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#17396f,#49ad57)" }}>
                    {selectedIds.size + (priceMax < INR_MAX ? 1 : 0)}
                  </span>
                )}
              </button>

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
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
              </div>
            </div>

            {/* Product grid */}
            {searchLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Package className="h-16 w-16 text-gray-200 mb-4" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-(--color-secondary) mb-1">No products found</h2>
                <p className="text-sm text-gray-500 mb-6">Try adjusting your search or filters.</p>
                <button
                  onClick={handleClearSearch}
                  className="btn-brand px-5 py-2 rounded-full text-sm font-semibold"
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

      <div className="h-16 lg:hidden" aria-hidden="true" />
    </div>
  );
}
