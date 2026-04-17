"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import ShopProductCard from "@/components/shop/ShopProductCard";
import type { ApiFeaturedProductsSection } from "@/lib/api";
import styles from "./FeaturedProducts.module.css";

// ─── Props ────────────────────────────────────────────────────────────────────

interface FeaturedProductsProps {
  section?: ApiFeaturedProductsSection | null;
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function FeaturedProducts({ section }: FeaturedProductsProps) {
  const mobileSliderRef = useRef<HTMLDivElement | null>(null);
  const productLimit = Math.max(1, section?.productCount ?? 8);
  const products = (section?.products ?? []).slice(0, productLimit);

  if (!section?.enabled) return null;

  const eyebrow = section.eyebrow || "Featured";
  const heading = section.heading || "Featured Products";
  const subheading = section.subheading || "";
  const viewAllLink = section.viewAllLink || "/shop";

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
            <p className={`${styles.eyebrow} mb-2`}>
              {eyebrow}
            </p>
            <h2
              id="featured-heading"
              className={`${styles.headingGradient} text-3xl font-extrabold sm:text-4xl`}
            >
              {heading}
            </h2>
            {subheading ? <p className="mt-2 text-[#4f6281]">{subheading}</p> : null}
          </div>
          <Link
            href={viewAllLink}
            className="hidden items-center gap-1.5 text-sm font-semibold text-[#6ea8d8] transition-all hover:gap-2.5 sm:flex"
          >
            View All
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {products.length > 0 ? (
          <>
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
                href={viewAllLink}
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#17396f_0%,#2f6f9f_52%,#49ad57_100%)] px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(47,111,159,0.18)] transition-all"
              >
                View All Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        ) : null}
      </Container>
    </section>
  );
}
