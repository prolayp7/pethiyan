"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Package, ArrowRight, Tag, FileText, LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ShopProductCard from "@/components/shop/ShopProductCard";
import SkeletonCard from "@/components/shop/SkeletonCard";
import {
  unifiedSearch,
  trackSearch,
  type RealApiProduct,
  type UnifiedSearchResults,
  type ApiBlogSearchResult,
  type ApiCategory,
} from "@/lib/api";

type Tab = "all" | "products" | "categories" | "blogs";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "all",        label: "All",        icon: LayoutGrid },
  { id: "products",   label: "Products",   icon: Tag        },
  { id: "categories", label: "Categories", icon: ArrowRight },
  { id: "blogs",      label: "Blogs",      icon: FileText   },
];

interface SearchClientProps {
  initialQuery: string;
  initialResults: UnifiedSearchResults | null;
}

export default function SearchClient({ initialQuery, initialResults }: SearchClientProps) {
  const router                                  = useRouter();
  const [query, setQuery]                       = useState(initialQuery);
  const [activeTab, setActiveTab]               = useState<Tab>("all");
  const [results, setResults]                   = useState<UnifiedSearchResults | null>(initialResults);
  const [isPending, startTransition]            = useTransition();
  const [localLoading, setLocalLoading]         = useState(false);
  const debounceRef                             = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackedRef                              = useRef<string>("");

  // Re-search + update URL when query changes
  useEffect(() => {
    if (query === initialQuery) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults(null);
      startTransition(() => router.replace("/search", { scroll: false }));
      return;
    }

    setLocalLoading(true);
    debounceRef.current = setTimeout(() => {
      unifiedSearch(query, "all").then((res) => {
        setResults(res);
        setLocalLoading(false);
        startTransition(() =>
          router.replace(`/search?q=${encodeURIComponent(query)}`, { scroll: false })
        );
      });
    }, 400);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Track search once results settle
  useEffect(() => {
    if (!results || !query.trim() || trackedRef.current === query) return;
    trackedRef.current = query;
    trackSearch(query, results.total, ["products", "categories", "blogs"]);
  }, [results, query]);

  const loading   = localLoading || isPending;
  const hasQuery  = query.trim().length > 0;

  // Tab counts
  const counts = {
    all:        (results?.products.length ?? 0) + (results?.categories.length ?? 0) + (results?.blogs.length ?? 0),
    products:   results?.products.length  ?? 0,
    categories: results?.categories.length ?? 0,
    blogs:      results?.blogs.length      ?? 0,
  };

  return (
    <div>
      {/* Search input */}
      <div className="relative max-w-xl mx-auto mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`); }}
          placeholder="Search products, categories, blogs…"
          autoFocus
          className="w-full pl-12 pr-12 py-3.5 text-sm bg-white border-2 border-(--color-border) rounded-2xl focus:outline-none focus:border-(--color-primary) focus:ring-4 focus:ring-(--color-primary)/10 transition shadow-sm"
          aria-label="Search"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Tabs (only when there are results) */}
      {hasQuery && !loading && results && results.total > 0 && (
        <div className="flex gap-1 mb-6 border-b border-(--color-border)">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === id
                  ? "border-(--color-primary) text-(--color-primary)"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {counts[id] > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === id ? "bg-(--color-primary)/10 text-(--color-primary)" : "bg-gray-100 text-gray-500"
                }`}>
                  {counts[id]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {hasQuery && !loading && results && (
        <p className="text-sm text-gray-500 mb-6">
          {results.total > 0
            ? `${results.total} result${results.total !== 1 ? "s" : ""} for `
            : "No results for "}
          <strong className="text-(--color-secondary)">&ldquo;{query}&rdquo;</strong>
        </p>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Results ─────────────────────────────────────────────────────────── */}
      {!loading && hasQuery && results && results.total > 0 && (
        <div className="space-y-10">
          {/* Products */}
          {(activeTab === "all" || activeTab === "products") && results.products.length > 0 && (
            <section>
              {activeTab === "all" && (
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-(--color-secondary) flex items-center gap-2">
                    <Tag className="h-4 w-4 text-(--color-primary)" /> Products
                    <span className="text-sm font-normal text-gray-400">({results.products.length})</span>
                  </h2>
                  {results.products.length >= 5 && (
                    <button type="button" onClick={() => setActiveTab("products")} className="text-sm text-(--color-primary) hover:underline">
                      View all →
                    </button>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {results.products.map((product: RealApiProduct) => (
                  <ShopProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Categories */}
          {(activeTab === "all" || activeTab === "categories") && results.categories.length > 0 && (
            <section>
              {activeTab === "all" && (
                <h2 className="text-base font-bold text-(--color-secondary) flex items-center gap-2 mb-4">
                  <ArrowRight className="h-4 w-4 text-(--color-primary)" /> Categories
                  <span className="text-sm font-normal text-gray-400">({results.categories.length})</span>
                </h2>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {results.categories.map((cat: ApiCategory) => {
                  const name = cat.name ?? (cat as unknown as { title: string }).title ?? "";
                  return (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="group flex flex-col items-center gap-2 p-4 bg-white border border-(--color-border) rounded-2xl hover:border-(--color-primary)/40 hover:shadow-md transition-all text-center"
                    >
                      {cat.image ? (
                        <Image
                          src={cat.image}
                          alt={name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                          <Tag className="h-6 w-6 text-gray-300" />
                        </div>
                      )}
                      <span className="text-sm font-semibold text-(--color-secondary) group-hover:text-(--color-primary) transition-colors line-clamp-2">
                        {name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Blogs */}
          {(activeTab === "all" || activeTab === "blogs") && results.blogs.length > 0 && (
            <section>
              {activeTab === "all" && (
                <h2 className="text-base font-bold text-(--color-secondary) flex items-center gap-2 mb-4">
                  <FileText className="h-4 w-4 text-(--color-primary)" /> Blog Posts
                  <span className="text-sm font-normal text-gray-400">({results.blogs.length})</span>
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.blogs.map((post: ApiBlogSearchResult) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex gap-4 bg-white border border-(--color-border) rounded-2xl p-4 hover:border-(--color-primary)/40 hover:shadow-md transition-all"
                  >
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-gray-100 shrink-0 flex items-center justify-center">
                        <FileText className="h-7 w-7 text-gray-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {post.category && (
                        <span className="text-xs font-semibold text-(--color-primary) uppercase tracking-wide">
                          {post.category.title}
                        </span>
                      )}
                      <p className="text-sm font-semibold text-(--color-secondary) group-hover:text-(--color-primary) transition-colors line-clamp-2 mt-0.5">
                        {post.title}
                      </p>
                      {post.excerpt && (
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">{post.excerpt}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* No results */}
      {!loading && hasQuery && results && results.total === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="h-16 w-16 text-gray-200 mb-4" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-(--color-secondary) mb-1">No results found</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">
            Nothing matched &ldquo;{query}&rdquo;. Try a different keyword or browse our categories.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-(--color-primary) text-white text-sm font-semibold hover:bg-(--color-primary-dark) transition"
          >
            Browse All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Empty state — no query */}
      {!loading && !hasQuery && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="h-16 w-16 text-gray-200 mb-4" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-(--color-secondary) mb-1">What are you looking for?</h2>
          <p className="text-sm text-gray-500 mb-6">Search products, categories, and blog posts.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {["Standup Pouches", "Ziplock Bags", "Eco Packaging", "Custom Printed"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="px-4 py-1.5 rounded-full border border-(--color-border) text-sm text-gray-600 hover:border-(--color-primary) hover:text-(--color-primary) transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
