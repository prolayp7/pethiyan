"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const bestSellerProducts = [
  { id: 1, image: "/images/products/1.jpg", name: "Stand-Up Pouch", subtitle: "Resealable Ziplock", price: "From $0.85", href: "/products/1", badge: "Best Seller" },
  { id: 2, image: "/images/products/2.jpg", name: "Kraft Paper Bag", subtitle: "Eco Friendly", price: "From $0.92", href: "/products/2", badge: "Eco Pick" },
  { id: 3, image: "/images/products/3.jpg", name: "Flat Bottom Bag", subtitle: "Custom Print Ready", price: "From $1.10", href: "/products/3", badge: null },
  { id: 4, image: "/images/products/4.jpg", name: "Ziplock Stand Pouch", subtitle: "Food Grade", price: "From $0.78", href: "/products/4", badge: "Popular" },
  { id: 5, image: "/images/products/5.jpg", name: "Spout Pouch", subtitle: "Liquid Packaging", price: "From $1.25", href: "/products/5", badge: null },
  { id: 6, image: "/images/products/6.jpg", name: "Coffee Bag + Valve", subtitle: "Aroma Seal", price: "From $0.95", href: "/products/6", badge: "New" },
  { id: 7, image: "/images/products/7.jpg", name: "Window Pouch", subtitle: "Clear Window Front", price: "From $0.88", href: "/products/7", badge: null },
  { id: 8, image: "/images/products/8.jpg", name: "Vacuum Seal Bag", subtitle: "Industrial Grade", price: "From $0.72", href: "/products/8", badge: "Bulk Deal" },
];

const SCROLL_AMOUNT = 360;

export default function MegaMenuBestSellers({ onClose }: { onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", updateArrows); ro.disconnect(); };
  }, [updateArrows]);

  const scroll = (dir: "prev" | "next") => {
    scrollRef.current?.scrollBy({ left: dir === "next" ? SCROLL_AMOUNT : -SCROLL_AMOUNT, behavior: "smooth" });
  };

  return (
    <div
      className="py-5 px-4 sm:px-6 lg:px-8"
      style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[9px] font-black tracking-[0.28em] uppercase" style={{ color: "#123f7a" }}>
            Best-Sellers
          </p>
          <div className="flex items-center gap-2">
            {/* Prev / Next buttons */}
            <button
              type="button"
              onClick={() => scroll("prev")}
              disabled={!canPrev}
              className="w-6 h-6 rounded-full border flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#123f7a]"
              style={{ borderColor: "#e2e8f0", color: "#123f7a" }}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("next")}
              disabled={!canNext}
              className="w-6 h-6 rounded-full border flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#123f7a]"
              style={{ borderColor: "#e2e8f0", color: "#123f7a" }}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <Link
              href="/best-sellers"
              className="flex items-center gap-1 text-[11px] font-semibold hover:underline underline-offset-4 transition-colors ml-1"
              style={{ color: "#4ea85f" }}
              onClick={onClose}
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex items-start gap-3.5 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {bestSellerProducts.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="group shrink-0 w-[116px]"
              onClick={onClose}
            >
              <div
                className="relative w-full h-[96px] rounded-xl overflow-hidden bg-white mb-2"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="116px"
                />
                {product.badge && (
                  <span
                    className="absolute top-1.5 left-1.5 text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                    style={{
                      background:
                        product.badge === "Eco Pick" ? "#4ea85f" :
                        product.badge === "New" ? "#2e7c8a" :
                        "#123f7a",
                      color: "white",
                    }}
                  >
                    {product.badge}
                  </span>
                )}
              </div>
              <p
                className="text-[12px] font-semibold leading-tight truncate transition-colors duration-150 group-hover:text-[#123f7a]"
                style={{ color: "#1e293b" }}
              >
                {product.name}
              </p>
              <p className="text-[10px] text-gray-400 truncate mt-0.5">{product.subtitle}</p>
              <p className="text-[12px] font-bold mt-0.5" style={{ color: "#4ea85f" }}>
                {product.price}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
