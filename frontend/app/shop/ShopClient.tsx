"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  SlidersHorizontal, X, ChevronDown, ChevronRight, Package, Layers, Home,
} from "lucide-react";
import Container from "@/components/layout/Container";
import ShopProductCard from "@/components/shop/ShopProductCard";
import RecentlyViewedProducts from "@/components/sections/RecentlyViewedProducts";
import {
  type RealApiProduct, type ApiCategory,
} from "@/lib/api";
import { readCatalogSortPreference, writeCatalogSortPreference } from "@/lib/catalog-preferences";

const SORT_OPTIONS = [
  { label: "Featured",           value: "featured"   },
  { label: "Price: Low to High", value: "price-asc"  },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated",          value: "rating"     },
  { label: "Newest",             value: "newest"     },
];

// Known color name → CSS color value
const COLOR_MAP: Record<string, string> = {
  "red": "#ef4444", "blue": "#3b82f6", "green": "#22c55e",
  "yellow": "#eab308", "orange": "#f97316", "purple": "#a855f7",
  "pink": "#ec4899", "black": "#1f2937", "white": "#f9fafb",
  "gray": "#9ca3af", "grey": "#9ca3af", "brown": "#92400e",
  "navy": "#1e3a5f", "teal": "#14b8a6", "gold": "#d97706",
  "silver": "#94a3b8", "beige": "#d6c4a1", "cream": "#fef3c7",
  "transparent": "#e5e7eb", "clear": "#e5e7eb",
  "colorful": "linear-gradient(135deg,#ef4444,#3b82f6,#22c55e,#eab308)",
  "multicolor": "linear-gradient(135deg,#ef4444,#3b82f6,#22c55e,#eab308)",
  "light gray": "#d1d5db", "dark gray": "#4b5563",
  "light grey": "#d1d5db", "dark grey": "#4b5563",
};

function toColorCss(name: string): string {
  return COLOR_MAP[name.toLowerCase()] ?? "#aaa";
}

// Merge direct variant fields (weight, capacity, dimensions) with named
// global attributes so they can all be filtered uniformly.
type RealVariant = RealApiProduct["variants"][number];
function getVariantAttrs(v: RealVariant): Record<string, string> {
  const attrs: Record<string, string> = { ...(v.attributes ?? {}) };

  // Weight from direct field
  if (v.weight) {
    attrs.weight = `${v.weight}${v.weight_unit ? " " + v.weight_unit : ""}`.trim();
  }

  // Capacity from direct field
  if (v.capacity) {
    attrs.capacity = `${v.capacity}${v.capacity_unit ? " " + v.capacity_unit : ""}`.trim();
  }

  // Size from length × breadth dimensions (only if no explicit size attribute)
  if (!attrs.size && (v.length || v.breadth)) {
    const unit = v.length_unit || v.breadth_unit || "";
    if (v.length && v.breadth) {
      attrs.size = `${v.length} × ${v.breadth}${unit ? " " + unit : ""}`.trim();
    } else if (v.length) {
      attrs.size = `${v.length}${unit ? " " + unit : ""}`.trim();
    } else if (v.breadth) {
      attrs.size = `${v.breadth}${unit ? " " + unit : ""}`.trim();
    }
  }

  return attrs;
}

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
  const [search, setSearch] = useState("");
  const [selectedIds,     setSelectedIds]     = useState<Set<number>>(new Set());
  const [expandedCats,    setExpandedCats]    = useState<Set<number>>(new Set());
  const [sort,    setSort]    = useState(() => readCatalogSortPreference());
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Attribute filters: key → Set of selected values
  const [selectedAttrs, setSelectedAttrs] = useState<Map<string, Set<string>>>(new Map());

  // Minimum quantity filter
  const [selectedMinQtys, setSelectedMinQtys] = useState<Set<number>>(new Set());

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

  // Derive distinct minimum_order_quantity values from all products
  const minQtyOptions = useMemo(() => {
    const set = new Set<number>();
    for (const p of initialProducts) {
      const qty = p.policies?.minimum_order_quantity;
      if (qty != null && qty > 0) set.add(qty);
    }
    return Array.from(set).sort((a, b) => a - b);
  }, [initialProducts]);

  const toggleMinQty = useCallback((qty: number) => {
    setSelectedMinQtys((prev) => {
      const next = new Set(prev);
      if (next.has(qty)) next.delete(qty);
      else next.add(qty);
      return next;
    });
  }, []);

  // Derive available attribute options from all products
  // Returns Map<attrKey, string[]> sorted by value name
  const attrOptions = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const product of initialProducts) {
      for (const variant of product.variants ?? []) {
        for (const [key, value] of Object.entries(getVariantAttrs(variant))) {
          if (!value) continue;
          if (!map.has(key)) map.set(key, new Set());
          map.get(key)!.add(value);
        }
      }
    }
    // Convert to sorted arrays
    const result = new Map<string, string[]>();
    for (const [key, values] of map.entries()) {
      result.set(key, Array.from(values).sort());
    }
    return result;
  }, [initialProducts]);

  const handleClearSearch = useCallback(() => {
    setSearch("");
  }, []);

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

  const toggleAttr = useCallback((attrKey: string, value: string) => {
    setSelectedAttrs((prev) => {
      const next = new Map(prev);
      const existing = next.get(attrKey) ? new Set(next.get(attrKey)) : new Set<string>();
      if (existing.has(value)) existing.delete(value);
      else existing.add(value);
      if (existing.size === 0) next.delete(attrKey);
      else next.set(attrKey, existing);
      return next;
    });
  }, []);

  const clearAttrGroup = useCallback((attrKey: string) => {
    setSelectedAttrs((prev) => {
      const next = new Map(prev);
      next.delete(attrKey);
      return next;
    });
  }, []);

  useEffect(() => {
    writeCatalogSortPreference(sort);
  }, [sort]);

  const resetFilters = useCallback(() => {
    setSelectedIds(new Set());
    setSelectedAttrs(new Map());
    setSelectedMinQtys(new Set());
  }, []);

  const activeAttrCount = useMemo(() => {
    let count = 0;
    for (const s of selectedAttrs.values()) count += s.size;
    return count;
  }, [selectedAttrs]);

  const filtered = sortProducts(
    initialProducts.filter((p: RealApiProduct) => {
      // Search: match title, short_description, tags, variant titles
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hit =
          p.title?.toLowerCase().includes(q) ||
          p.short_description?.toLowerCase().includes(q) ||
          (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q))) ||
          p.variants?.some((v) => v.title?.toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (selectedIds.size > 0) {
        const catId = p.category?.id ?? p.category_id ?? -1;
        if (!selectedIds.has(catId)) return false;
      }
      if (selectedMinQtys.size > 0) {
        const qty = p.policies?.minimum_order_quantity ?? 0;
        if (!selectedMinQtys.has(qty)) return false;
      }
      // Attribute filter: product passes if for every selected attr group,
      // at least one variant matches a selected value in that group.
      if (selectedAttrs.size > 0) {
        for (const [attrKey, selectedValues] of selectedAttrs.entries()) {
          if (selectedValues.size === 0) continue;
          const hasMatch = p.variants?.some((v: RealVariant) => {
            const val = getVariantAttrs(v)[attrKey];
            return val !== undefined && selectedValues.has(val);
          }) ?? false;
          if (!hasMatch) return false;
        }
      }
      return true;
    }),
    sort
  );

  const hasActiveFilters = selectedIds.size > 0 || selectedAttrs.size > 0 || selectedMinQtys.size > 0;
  const totalActiveCount = selectedIds.size + activeAttrCount + selectedMinQtys.size;

  return (
    <div className="min-h-screen bg-(--background)">
      <div className="bg-white border-b border-(--color-border) py-5">
        <Container>
          <div className="flex items-center justify-between gap-4">
            {/* Left: icon + title + subtitle */}
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center h-10 w-10 rounded-xl shrink-0"
                style={{ background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)" }}
              >
                <Layers className="h-5 w-5 text-white" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-(--color-secondary)">All Products</h1>
                <p className="mt-0.5 text-gray-500 text-sm">
                  {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
            {/* Right: breadcrumb */}
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 shrink-0" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1 hover:text-(--color-primary) transition-colors">
                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
              <span className="text-(--color-secondary) font-medium">Shop</span>
            </nav>
          </div>
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
              <div className="rounded-xl overflow-hidden border border-[#17396f]/15">
                <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)" }}>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Category
                  </h3>
                  {selectedIds.size > 0 && (
                    <button
                      onClick={() => setSelectedIds(new Set())}
                      className="text-[11px] text-white/80 hover:text-white transition-colors"
                    >
                      Clear ({selectedIds.size})
                    </button>
                  )}
                </div>
                <div className="bg-white px-4 py-3">
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
                </div>
              </div>

              {/* ── Attribute filters (dynamic, one section per attribute key) ── */}
              {Array.from(attrOptions.entries()).map(([attrKey, values]) => {
                const label = attrKey.charAt(0).toUpperCase() + attrKey.slice(1);
                const isColor = attrKey.toLowerCase() === "color" || attrKey.toLowerCase() === "colour";
                const selectedForKey = selectedAttrs.get(attrKey) ?? new Set<string>();

                return (
                  <div key={attrKey} className="rounded-xl overflow-hidden border border-[#17396f]/15">
                    <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)" }}>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        {label}
                      </h3>
                      {selectedForKey.size > 0 && (
                        <button
                          onClick={() => clearAttrGroup(attrKey)}
                          className="text-[11px] text-white/80 hover:text-white transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="bg-white px-4 py-3">
                      {isColor ? (
                        /* Color swatches */
                        <div className="flex flex-wrap gap-2">
                          {values.map((value) => {
                            const css = toColorCss(value);
                            const isSelected = selectedForKey.has(value);
                            const isGradient = css.startsWith("linear-gradient");
                            return (
                              <div key={value} className="relative group/swatch">
                                <button
                                  onClick={() => toggleAttr(attrKey, value)}
                                  className={`relative w-7 h-7 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#2f6f9f]/40 ${
                                    isSelected
                                      ? "border-[#17396f] scale-110 shadow-md"
                                      : "border-transparent hover:border-gray-300 hover:scale-105"
                                  }`}
                                  style={isGradient ? { background: css } : { backgroundColor: css }}
                                  aria-label={value}
                                  aria-pressed={isSelected}
                                >
                                  {isSelected && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                      <svg className="h-3 w-3 drop-shadow" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    </span>
                                  )}
                                </button>
                                {/* Tooltip */}
                                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-semibold text-white bg-gray-800 opacity-0 group-hover/swatch:opacity-100 transition-opacity duration-150 z-20 capitalize">
                                  {value}
                                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        /* Pill buttons for non-color attributes */
                        <div className="flex flex-wrap gap-1.5">
                          {values.map((value) => {
                            const isSelected = selectedForKey.has(value);
                            return (
                              <button
                                key={value}
                                onClick={() => toggleAttr(attrKey, value)}
                                className={`px-2.5 py-1 text-xs rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-[#2f6f9f]/40 ${
                                  isSelected
                                    ? "text-white border-transparent font-semibold"
                                    : "text-gray-600 border-gray-200 hover:border-[#2f6f9f] hover:text-[#17396f]"
                                }`}
                                style={isSelected ? { background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)" } : undefined}
                                aria-pressed={isSelected}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* ── Minimum Quantity filter ── */}
              {minQtyOptions.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-[#17396f]/15">
                  <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)" }}>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Min. Quantity
                    </h3>
                    {selectedMinQtys.size > 0 && (
                      <button
                        onClick={() => setSelectedMinQtys(new Set())}
                        className="text-[11px] text-white/80 hover:text-white transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="bg-white px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {minQtyOptions.map((qty) => {
                        const isSelected = selectedMinQtys.has(qty);
                        return (
                          <button
                            key={qty}
                            onClick={() => toggleMinQty(qty)}
                            className={`px-2.5 py-1 text-xs rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-[#2f6f9f]/40 ${
                              isSelected
                                ? "text-white border-transparent font-semibold"
                                : "text-gray-600 border-gray-200 hover:border-[#2f6f9f] hover:text-[#17396f]"
                            }`}
                            style={isSelected ? { background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)" } : undefined}
                            aria-pressed={isSelected}
                          >
                            {qty}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

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
            {/* Sort / filter toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-(--color-border) rounded-xl text-sm font-medium text-gray-700 hover:border-(--color-primary) transition"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 h-5 w-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#17396f,#49ad57)" }}>
                    {totalActiveCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
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

            {/* Active attribute filter chips */}
            {activeAttrCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.from(selectedAttrs.entries()).map(([attrKey, values]) =>
                  Array.from(values).map((value) => {
                    const isColor = attrKey.toLowerCase() === "color" || attrKey.toLowerCase() === "colour";
                    return (
                      <span
                        key={`${attrKey}:${value}`}
                        className="inline-flex items-center gap-1.5 pl-2 pr-1 py-0.5 bg-[#17396f]/10 text-[#17396f] rounded-full text-xs font-medium"
                      >
                        {isColor && (
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                            style={
                              toColorCss(value).startsWith("linear-gradient")
                                ? { background: toColorCss(value) }
                                : { backgroundColor: toColorCss(value) }
                            }
                          />
                        )}
                        {value}
                        <button
                          onClick={() => toggleAttr(attrKey, value)}
                          className="hover:bg-[#17396f]/20 rounded-full p-0.5 transition-colors"
                          aria-label={`Remove ${value} filter`}
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    );
                  })
                )}
              </div>
            )}

            {/* Product grid */}
            {filtered.length === 0 ? (
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

      <RecentlyViewedProducts
        title="Recently Viewed"
        eyebrow="Back to what caught your eye"
        description="Reopen the packaging products you explored recently without losing your place in the catalog."
        viewAllLabel="Browse full catalog"
      />

      <div className="h-16 lg:hidden" aria-hidden="true" />
    </div>
  );
}
