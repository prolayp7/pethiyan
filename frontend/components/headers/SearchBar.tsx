"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, TrendingUp, Flame, Tag, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  API_BASE,
  fetchTopSearches,
  fetchTrendingProducts,
  unifiedSearch,
  trackSearch,
  type RealApiProduct,
  type UnifiedSearchResults,
  type ApiBlogSearchResult,
  type ApiCategory,
} from "@/lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveImageUrl(raw: string | null | undefined): string {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = API_BASE.replace(/\/+$/, "");
  if (trimmed.startsWith("/")) return `${base}${trimmed}`;
  if (trimmed.startsWith("storage/") || trimmed.startsWith("uploads/")) return `${base}/${trimmed}`;
  return `${base}/storage/${trimmed}`;
}

function getDisplayPrice(product: RealApiProduct): string {
  const variant = product.variants?.find((v) => v.is_default) ?? product.variants?.[0];
  const pricing = variant?.store_pricing?.find((s) => s.stock_status === "in_stock") ?? variant?.store_pricing?.[0];
  const price = pricing?.special_price ?? pricing?.cost ?? pricing?.price ?? 0;
  if (!price) return "";
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

function getProductImage(product: RealApiProduct): string {
  const raw = product.images?.main_image || product.images?.all?.[0] || "";
  return resolveImageUrl(raw);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery]           = useState("");
  const [open, setOpen]             = useState(false);
  const inputRef                    = useRef<HTMLInputElement>(null);
  const overlayRef                  = useRef<HTMLDivElement>(null);
  const debounceRef                 = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Static panels (loaded once on open) ──────────────────────────────────────
  const [topSearches, setTopSearches]         = useState<string[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<RealApiProduct[]>([]);
  const [panelLoading, setPanelLoading]       = useState(false);

  // ── Live results (while user types) ──────────────────────────────────────────
  const [liveResults, setLiveResults]   = useState<UnifiedSearchResults | null>(null);
  const [liveLoading, setLiveLoading]   = useState(false);

  // Load top searches + trending products when panel first opens
  useEffect(() => {
    if (!open || topSearches.length > 0 || trendingProducts.length > 0) return;
    setPanelLoading(true);
    Promise.all([fetchTopSearches(8), fetchTrendingProducts(4)]).then(([terms, products]) => {
      setTopSearches(terms);
      setTrendingProducts(products);
      setPanelLoading(false);
    });
  }, [open, topSearches.length, trendingProducts.length]);

  // Debounced live search while user types
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setLiveResults(null);
      return;
    }
    setLiveLoading(true);
    debounceRef.current = setTimeout(() => {
      unifiedSearch(query, "all").then((res) => {
        setLiveResults(res);
        setLiveLoading(false);
      });
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); inputRef.current?.blur(); }
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setQuery("");
    setLiveResults(null);
    inputRef.current?.blur();
  };

  const handleSubmit = useCallback((term: string) => {
    const q = term.trim();
    if (!q) return;
    trackSearch(q, liveResults?.total ?? 0, ["products", "categories", "blogs"]);
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }, [liveResults?.total, router]);

  const handleTermClick = (term: string) => {
    setQuery(term);
    handleSubmit(term);
  };

  const showLive = !!query.trim();

  return (
    <div ref={overlayRef} className="w-full relative">
      {/* Search input */}
      <div
        className={cn(
          "relative flex items-center rounded-full border-2 transition-all duration-200",
          open || query
            ? "bg-white border-[#2f6f9f] shadow-[0_0_0_3px_rgba(47,111,159,0.15),0_2px_8px_rgba(23,57,111,0.12)]"
            : "border-gray-200 bg-gray-50 hover:border-gray-300"
        )}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(query); }}
          placeholder="Search for products, packaging, pouches..."
          className="w-full pl-12 pr-12 py-2.5 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
          aria-label="Search products"
          autoComplete="off"
        />
        {(query || open) && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Expanded panel */}
      {open && (
        <div
          className="absolute top-[calc(100%+8px)] left-0 right-0 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-[200] overflow-hidden"
        >
          {/* ── Live results while typing ─────────────────────────────────────── */}
          {showLive ? (
            <div className="p-4">
              {liveLoading ? (
                <div className="flex items-center gap-2 py-6 justify-center text-gray-400 text-sm">
                  <span className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-[--color-primary] rounded-full inline-block" />
                  Searching…
                </div>
              ) : liveResults && liveResults.total > 0 ? (
                <div className="space-y-4">
                  {/* Products */}
                  {liveResults.products.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Tag className="h-3.5 w-3.5 text-(--color-primary)" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Products</span>
                      </div>
                      <ul className="divide-y divide-gray-50">
                        {liveResults.products.slice(0, 5).map((p) => (
                          <li key={p.id}>
                            <Link
                              href={`/products/${p.slug}`}
                              onClick={() => { trackSearch(query, liveResults.total, ["products"]); setOpen(false); }}
                              className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-gray-50 transition-colors group"
                            >
                              {getProductImage(p) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={getProductImage(p)}
                                  alt={p.title}
                                  className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
                              )}
                              <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900 line-clamp-1">{p.title}</span>
                              {getDisplayPrice(p) && (
                                <span className="text-sm font-bold text-(--color-secondary) shrink-0">{getDisplayPrice(p)}</span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Categories */}
                  {liveResults.categories.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <ChevronRight className="h-3.5 w-3.5 text-(--color-primary)" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Categories</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {liveResults.categories.map((cat: ApiCategory) => (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            onClick={() => { trackSearch(query, liveResults.total, ["categories"]); setOpen(false); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-700 hover:border-(--color-primary) hover:text-(--color-primary) transition-colors"
                          >
                            {cat.name ?? (cat as unknown as { title: string }).title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blogs */}
                  {liveResults.blogs.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <FileText className="h-3.5 w-3.5 text-(--color-primary)" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Blog Posts</span>
                      </div>
                      <ul className="divide-y divide-gray-50">
                        {liveResults.blogs.map((post: ApiBlogSearchResult) => (
                          <li key={post.id}>
                            <Link
                              href={`/blog/${post.slug}`}
                              onClick={() => { trackSearch(query, liveResults.total, ["blogs"]); setOpen(false); }}
                              className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-gray-50 transition-colors group"
                            >
                              <FileText className="h-5 w-5 text-gray-300 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700 group-hover:text-gray-900 line-clamp-1">{post.title}</p>
                                {post.category && (
                                  <p className="text-xs text-gray-400 mt-0.5">{post.category.title}</p>
                                )}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-gray-400">
                  No results for &ldquo;<strong className="text-gray-600">{query}</strong>&rdquo;
                </p>
              )}

              {/* View all results */}
              {liveResults && liveResults.total > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 text-right">
                  <button
                    type="button"
                    onClick={() => handleSubmit(query)}
                    className="text-sm font-medium text-(--color-primary) hover:underline"
                  >
                    View all {liveResults.total} results →
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Default panel: Top Searches + Hot Right Now ─────────────────── */
            <div className="flex divide-x divide-gray-100">
              {/* Left: Top Searches */}
              <div className="w-56 shrink-0 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-(--color-primary)" />
                  <span className="text-xs font-bold tracking-widest text-gray-800 uppercase">Top Searches</span>
                </div>
                {panelLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {topSearches.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          onClick={() => handleTermClick(term)}
                          className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {term}
                        </button>
                      </li>
                    ))}
                    {!panelLoading && topSearches.length === 0 && (
                      <li className="text-xs text-gray-400 py-2">No data yet</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Right: Hot Right Now */}
              <div className="flex-1 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-bold tracking-widest text-gray-800 uppercase">Hot Right Now</span>
                </div>
                {panelLoading ? (
                  <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i}>
                        <div className="aspect-square rounded-xl bg-gray-100 animate-pulse mb-2" />
                        <div className="h-3 bg-gray-100 rounded animate-pulse mb-1" />
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3 mx-auto" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {trendingProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => setOpen(false)}
                        className="group text-center"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2 border border-gray-100 group-hover:border-(--color-primary)/30 transition-colors">
                          {getProductImage(product) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={getProductImage(product)}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 leading-snug line-clamp-2 group-hover:text-gray-900 transition-colors">
                          {product.title}
                        </p>
                        {getDisplayPrice(product) && (
                          <p className="text-sm font-bold text-gray-900 mt-1">{getDisplayPrice(product)}</p>
                        )}
                      </Link>
                    ))}
                    {!panelLoading && trendingProducts.length === 0 && (
                      <p className="col-span-4 text-xs text-gray-400 py-4">No trending products yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between bg-gray-50/60">
            <span className="text-xs text-gray-400">Press ESC to close</span>
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-(--color-primary) hover:underline flex items-center gap-1"
            >
              View all best sellers <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
