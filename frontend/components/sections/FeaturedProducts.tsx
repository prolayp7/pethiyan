"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import ShopProductCard from "@/components/shop/ShopProductCard";
import type { RealApiProduct } from "@/lib/api";

// ─── Props ────────────────────────────────────────────────────────────────────

interface FeaturedProductsProps {
  apiProducts?: RealApiProduct[];
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function FeaturedProducts({ apiProducts = [] }: FeaturedProductsProps) {
  const mobileSliderRef = useRef<HTMLDivElement | null>(null);
  const products = apiProducts.slice(0, 8);

  if (products.length === 0) return null;

  function scrollMobileProducts(direction: "prev" | "next") {
    const el = mobileSliderRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-featured-slide]");
    const gap = 20;
    const cardWidth = firstCard?.offsetWidth ?? el.clientWidth * 0.82;
    el.scrollBy({ left: direction === "next" ? cardWidth + gap : -(cardWidth + gap), behavior: "smooth" });
  }

  return (
    <section
      className="relative overflow-hidden bg-white pt-5 pb-6 sm:pt-8 sm:pb-16"
      aria-labelledby="featured-heading"
    >
      <Container className="relative z-10">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between sm:mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#4ea85f" }}>
              Bestsellers
            </p>
            <h2
              id="featured-heading"
              className="text-3xl sm:text-4xl font-extrabold"
              style={{
                backgroundImage: "linear-gradient(135deg, #1a4f83 0%, #2b6e92 48%, #2d8b6a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Featured Products
            </h2>
            <p className="mt-2 text-[#4f6281]">
              Handpicked packaging solutions loved by thousands of brands
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5"
            style={{ color: "#6ea8d8" }}
          >
            View All
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile slider */}
        <div className="overflow-hidden sm:hidden">
          <div className="relative">
            <button
              type="button"
              onClick={() => scrollMobileProducts("prev")}
              aria-label="Scroll featured products left"
              className="absolute left-2 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8d7ea] bg-white/95 text-[#1a4f83] shadow-sm transition-colors hover:bg-[#f3f8ff]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollMobileProducts("next")}
              aria-label="Scroll featured products right"
              className="absolute right-2 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8d7ea] bg-white/95 text-[#1a4f83] shadow-sm transition-colors hover:bg-[#f3f8ff]"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <div
              ref={mobileSliderRef}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-12 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Featured products slider"
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  data-featured-slide
                  className="w-[85%] max-w-[320px] shrink-0 snap-start"
                >
                  <ShopProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-4 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)",
              boxShadow: "0 10px 24px rgba(47,111,159,0.18)",
            }}
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
