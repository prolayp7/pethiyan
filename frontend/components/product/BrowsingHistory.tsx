"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import Container from "@/components/layout/Container";
import { getBrowsingHistorySlugs, clearBrowsingHistory } from "@/lib/browsingHistory";
import { API_BASE, type RealApiProduct } from "@/lib/api";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeImg(src?: string | null): string | null {
  if (!src) return null;
  const t = String(src).trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  const base = API_BASE.replace(/\/+$/, "");
  if (t.startsWith("/")) return `${base}${t}`;
  if (t.startsWith("storage/") || t.startsWith("uploads/")) return `${base}/${t}`;
  return `${base}/storage/${t}`;
}

function getPrice(product: RealApiProduct): { price: number; special: number | null; variantTitle: string | null } {
  const variant = product.variants?.find((v) => v.is_default) ?? product.variants?.[0];
  const pricing = variant?.store_pricing?.[0];
  if (!pricing) return { price: 0, special: null, variantTitle: null };
  const price = Number(pricing.price) || 0;
  const special = pricing.special_price ? Number(pricing.special_price) : null;
  const variantTitle = variant?.title && variant.title !== product.title ? variant.title : null;
  return { price, special, variantTitle };
}

async function fetchBySlug(slugs: string[]): Promise<RealApiProduct[]> {
  if (slugs.length === 0) return [];
  try {
    const params = new URLSearchParams({ slugs: slugs.join(","), per_page: "50" });
    const res = await fetch(`${API_BASE}/api/products?${params}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    const raw = json?.data?.data ?? json?.data ?? [];
    const arr: RealApiProduct[] = Array.isArray(raw) ? raw : [];
    return slugs.map((s) => arr.find((p) => p.slug === s)).filter(Boolean) as RealApiProduct[];
  } catch {
    return [];
  }
}

// ─── Mini product card (designed for horizontal scroll) ───────────────────────

function HistoryCard({ product }: { product: RealApiProduct }) {
  const img = normalizeImg(product.images?.main_image);
  const { price, special, variantTitle } = getPrice(product);
  const symbol = "₹";
  const hasDiscount = special !== null && special < price;
  const fmt = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex-shrink-0 w-44 flex flex-col rounded-2xl border border-(--color-border) bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-(--color-primary)/40 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-gray-50">
        {img ? (
          <Image
            src={img}
            alt={product.title}
            fill
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            sizes="176px"
            loading="lazy"
            quality={80}
            unoptimized={/^https?:\/\//i.test(img)}
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-(--color-primary)/10 to-(--color-primary-light)" />
        )}
        {hasDiscount && (
          <span className="absolute top-2 left-2 text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
            {Math.round(((price - special!) / price) * 100)}% off
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        <p className="text-xs font-semibold text-(--color-secondary) line-clamp-2 leading-tight group-hover:text-(--color-primary) transition-colors">
          {product.title}
        </p>
        {variantTitle && (
          <p className="text-[10px] text-gray-400 truncate">{variantTitle}</p>
        )}
        {price > 0 && (
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm font-extrabold text-(--color-primary)">
              {symbol}{fmt(special ?? price)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-gray-400 line-through">
                {symbol}{fmt(price)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function BrowsingHistory({ excludeSlug }: { excludeSlug?: string }) {
  const [products, setProducts] = useState<RealApiProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slugs = getBrowsingHistorySlugs().filter((s) => s !== excludeSlug);
    if (slugs.length === 0) { setLoaded(true); return; }
    fetchBySlug(slugs).then((data) => { setProducts(data); setLoaded(true); });
  }, [excludeSlug]);

  if (!loaded || products.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  const handleClear = () => {
    clearBrowsingHistory();
    setProducts([]);
  };

  return (
    <section
      className="border-t border-(--color-border) bg-white py-14"
      aria-labelledby="browsing-history-heading"
    >
      <Container>
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-(--color-primary)">
              Recently explored
            </p>
            <h2
              id="browsing-history-heading"
              className="text-2xl font-extrabold text-(--color-secondary) sm:text-3xl"
            >
              Your browsing history
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Pick up where you left off — products you viewed recently.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-(--color-primary)"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Clear
            </button>
            <Link
              href="/shop"
              className="flex items-center gap-1.5 text-sm font-semibold text-(--color-primary) transition-all hover:gap-2.5"
            >
              Browse all
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            {/* Scroll controls */}
            <div className="flex gap-1 ml-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-(--color-border) hover:bg-(--color-muted) transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-(--color-border) hover:bg-(--color-muted) transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal scroll row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <HistoryCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile footer */}
        <div className="mt-6 flex items-center justify-between sm:hidden">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-(--color-primary) transition-colors"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Clear history
          </button>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border-2 border-(--color-primary) px-5 py-2 text-sm font-semibold text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition-all"
          >
            Browse all
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
