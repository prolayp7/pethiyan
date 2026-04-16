"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/layout/Container";
import ShopProductCard from "@/components/shop/ShopProductCard";
import { useAuth } from "@/context/AuthContext";
import {
  getSavedForLaterProducts,
  getBuyAgainProducts,
  type RealApiProduct,
} from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "saved" | "buy-again";

// ─── Category pill helpers ────────────────────────────────────────────────────

function getCategories(products: RealApiProduct[]): string[] {
  const seen = new Set<string>();
  const cats: string[] = [];
  for (const p of products) {
    const name = (p as unknown as { category?: { title?: string } }).category?.title;
    if (name && !seen.has(name)) { seen.add(name); cats.push(name); }
  }
  return cats;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function YourItemsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
          <div className="aspect-square bg-gray-100 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-3 w-3/4 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function YourItems() {
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab]         = useState<Tab>("saved");
  const [activeCat, setActiveCat]         = useState<string>("All");
  const [savedProducts, setSavedProducts] = useState<RealApiProduct[]>([]);
  const [buyProducts, setBuyProducts]     = useState<RealApiProduct[]>([]);
  const [loadingSaved, setLoadingSaved]   = useState(false);
  const [loadingBuy, setLoadingBuy]       = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch on mount (only when logged in)
  useEffect(() => {
    if (!isLoggedIn) return;

    setLoadingSaved(true);
    getSavedForLaterProducts().then((data) => {
      setSavedProducts(data);
      setLoadingSaved(false);
    });

    setLoadingBuy(true);
    getBuyAgainProducts().then((data) => {
      setBuyProducts(data);
      setLoadingBuy(false);
    });
  }, [isLoggedIn]);

  // Don't render when not logged in
  if (!isLoggedIn) return null;

  const products = activeTab === "saved" ? savedProducts : buyProducts;
  const loading  = activeTab === "saved" ? loadingSaved : loadingBuy;

  const categories = ["All", ...getCategories(products)];
  const filtered   = activeCat === "All"
    ? products
    : products.filter(
        (p) => (p as unknown as { category?: { title?: string } }).category?.title === activeCat
      );

  // Reset category pill when tab or products change
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setActiveCat("All");
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  // Don't show the section if both tabs are empty and not loading
  if (!loadingSaved && !loadingBuy && savedProducts.length === 0 && buyProducts.length === 0) {
    return null;
  }

  return (
    <section
      className="border-t border-(--color-border) bg-white py-12"
      aria-labelledby="your-items-heading"
    >
      <Container>

        {/* ── Header ── */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-(--color-primary)">
              Your account
            </p>
            <h2
              id="your-items-heading"
              className="text-2xl font-extrabold text-(--color-secondary) sm:text-3xl"
            >
              Your Items
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-(--color-primary) transition-all hover:gap-2.5"
          >
            Browse all
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* ── Tabs ── */}
        <div className="mb-5 flex items-center gap-1 border-b border-(--color-border)">
          {(["saved", "buy-again"] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-(--color-primary) text-(--color-primary)"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab === "saved" ? "Saved for Later" : "Buy it Again"}
              {tab === "saved" && savedProducts.length > 0 && (
                <span className="ml-2 text-[10px] font-bold bg-(--color-primary)/10 text-(--color-primary) px-1.5 py-0.5 rounded-full">
                  {savedProducts.length}
                </span>
              )}
              {tab === "buy-again" && buyProducts.length > 0 && (
                <span className="ml-2 text-[10px] font-bold bg-(--color-primary)/10 text-(--color-primary) px-1.5 py-0.5 rounded-full">
                  {buyProducts.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Category pills ── */}
        {categories.length > 1 && !loading && (
          <div className="relative mb-6 flex items-center gap-2">
            {/* Prev */}
            <button
              type="button"
              onClick={() => scroll("left")}
              className="shrink-0 flex items-center justify-center h-7 w-7 rounded-full border border-(--color-border) bg-white shadow-sm text-gray-500 hover:text-(--color-primary) hover:border-(--color-primary) transition-colors"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    activeCat === cat
                      ? "bg-(--color-primary) text-white border-(--color-primary)"
                      : "bg-white text-gray-600 border-(--color-border) hover:border-(--color-primary) hover:text-(--color-primary)"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              type="button"
              onClick={() => scroll("right")}
              className="shrink-0 flex items-center justify-center h-7 w-7 rounded-full border border-(--color-border) bg-white shadow-sm text-gray-500 hover:text-(--color-primary) hover:border-(--color-primary) transition-colors"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <YourItemsSkeleton />
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-(--color-secondary) mb-1">
              {activeTab === "saved" ? "No saved items yet" : "No past orders found"}
            </p>
            <p className="text-xs text-gray-400 mb-5">
              {activeTab === "saved"
                ? "Add products to your wishlist to save them for later."
                : "Products from your delivered orders will appear here."}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-(--color-primary) px-5 py-2 text-sm font-semibold text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition-all"
            >
              Shop now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <ShopProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile view all */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border-2 border-(--color-primary) px-6 py-2.5 text-sm font-semibold text-(--color-primary) transition-all hover:bg-(--color-primary) hover:text-white"
          >
            Browse all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </Container>
    </section>
  );
}
