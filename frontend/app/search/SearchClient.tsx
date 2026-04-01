"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import ShopProductCard from "@/components/shop/ShopProductCard";
import SkeletonCard from "@/components/shop/SkeletonCard";
import { searchProducts, type ApiProduct } from "@/lib/api";

interface SearchClientProps {
  initialQuery: string;
  initialResults: ApiProduct[];
}

export default function SearchClient({
  initialQuery,
  initialResults,
}: SearchClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ApiProduct[]>(initialResults);
  const [isPending, startTransition] = useTransition();
  const [localLoading, setLocalLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update URL + re-fetch when user types
  useEffect(() => {
    if (query === initialQuery) return; // skip initial mount

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        startTransition(() => router.replace("/search", { scroll: false }));
        return;
      }

      setLocalLoading(true);
      searchProducts(query).then((res) => {
        setResults(res);
        setLocalLoading(false);
        // Update URL without reload
        startTransition(() =>
          router.replace(`/search?q=${encodeURIComponent(query)}`, {
            scroll: false,
          })
        );
      });
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const loading = localLoading || isPending;
  const hasQuery = query.trim().length > 0;

  return (
    <div>
      {/* Search input */}
      <div className="relative max-w-xl mx-auto mb-10">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search packaging products…"
          autoFocus
          className="w-full pl-12 pr-12 py-3.5 text-sm bg-white border-2 border-(--color-border) rounded-2xl focus:outline-none focus:border-(--color-primary) focus:ring-4 focus:ring-(--color-primary)/10 transition shadow-sm"
          aria-label="Search products"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Results count */}
      {hasQuery && !loading && (
        <p className="text-sm text-gray-500 mb-6">
          {results.length > 0
            ? `${results.length} result${results.length !== 1 ? "s" : ""} for `
            : "No results for "}
          <strong className="text-(--color-secondary)">&ldquo;{query}&rdquo;</strong>
        </p>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Results grid */}
      {!loading && hasQuery && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {results.map((product) => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && hasQuery && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="h-16 w-16 text-gray-200 mb-4" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-(--color-secondary) mb-1">
            No products found
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">
            We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try a different
            keyword or browse our categories.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-(--color-primary) text-white text-sm font-semibold hover:bg-(--color-primary-dark) transition"
          >
            Browse All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Empty state — no query entered yet */}
      {!loading && !hasQuery && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="h-16 w-16 text-gray-200 mb-4" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-(--color-secondary) mb-1">
            What are you looking for?
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Start typing above to search packaging products.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {["Standup Pouches", "Ziplock Bags", "Eco Packaging", "Custom Printed"].map(
              (suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="px-4 py-1.5 rounded-full border border-(--color-border) text-sm text-gray-600 hover:border-(--color-primary) hover:text-(--color-primary) transition"
                >
                  {suggestion}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
