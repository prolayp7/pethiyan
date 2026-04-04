"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Tag, Package } from "lucide-react";

export interface FallbackProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  badge?: "Sale" | "New" | "Hot";
  image?: string;
  unoptimizedImage?: boolean;
  href: string;
  minQty: number;
  gstRate: string;
  colors: string[];
  variantCount: number;
  inStock: boolean;
}

const COLOR_MAP: Record<string, string> = {
  Transparent: "#c8e6f5",
  Brown:       "#8B6347",
  Colorful:    "linear-gradient(135deg,#f44,#4f4,#44f)",
  Black:       "#222",
  White:       "#eee",
  Red:         "#e53",
  Blue:        "#36f",
  Green:       "#4b8",
  Yellow:      "#fb0",
};

export default function FeaturedProductCard({ p }: { p: FallbackProduct }) {
  const discount = p.originalPrice
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : 0;

  return (
    <Link
      href={p.href}
      className="group flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ background: "#fff", borderColor: "rgba(0,0,0,0.08)" }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {p.image ? (
          <Image
            src={p.image}
            alt={p.name}
            fill
            unoptimized={p.unoptimizedImage}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-14 w-14 text-gray-200" />
          </div>
        )}

        {/* Badge */}
        {p.badge && (
          <span
            className="absolute top-2.5 left-2.5 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
            style={{
              background:
                p.badge === "Sale" ? "#ef4444"
                : p.badge === "Hot" ? "#f97316"
                : "#22c55e",
            }}
          >
            {p.badge}{discount > 0 ? ` −${discount}%` : ""}
          </span>
        )}

        {/* Out of stock overlay */}
        {!p.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Name */}
        <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#2e7c8a] transition-colors">
          {p.name}
        </p>

        {/* Color swatches */}
        {p.colors.length > 0 && (
          <div className="flex items-center gap-1.5">
            {p.colors.slice(0, 5).map((c) => (
              <span
                key={c}
                title={c}
                className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                style={{ background: COLOR_MAP[c] ?? "#aaa" }}
              />
            ))}
            {p.variantCount > 1 && (
              <span className="text-[10px] text-gray-400 ml-0.5">
                {p.variantCount} variants
              </span>
            )}
          </div>
        )}

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-base font-extrabold text-gray-900">
            ₹{p.price.toFixed(2)}
          </span>
          {p.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{p.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* GST + min qty */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-400">+{p.gstRate}% GST</span>
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <Tag className="h-2.5 w-2.5" />
            Min: {p.minQty} pcs
          </span>
        </div>

        {/* Add to cart */}
        <button
          className="mt-1 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #2e7c8a 0%, #4ea85f 100%)" }}
          disabled={!p.inStock}
          onClick={(e) => { e.preventDefault(); }}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {p.inStock ? "Add to Cart" : "Notify Me"}
        </button>
      </div>
    </Link>
  );
}
