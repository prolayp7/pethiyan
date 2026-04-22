"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: "New" | "Sale" | "Hot";
  category: string;
  href: string;
  image?: string | null;
}

interface ProductCardProps {
  product: Product;
}

const badgeColors: Record<string, string> = {
  New: "bg-(--color-primary) text-white",
  Sale: "bg-red-500 text-white",
  Hot: "bg-orange-500 text-white",
};

// Deterministic placeholder gradient keyed by category
const cardBgs: Record<string, string> = {
  standup: "from-(--color-primary)/20 to-(--color-primary-light)",
  ziplock: "from-(--color-accent)/20 to-emerald-50",
  custom: "from-purple-100 to-purple-50",
  eco: "from-emerald-100 to-teal-50",
  bags: "from-amber-100 to-amber-50",
};

export default function ProductCard({ product }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem, openCart } = useCart();

  const bg = cardBgs[product.category] ?? "from-gray-100 to-gray-50";

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price });
    openCart();
  };

  const discount =
    product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <article className="group relative bg-white rounded-2xl border border-(--color-border) overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
      {/* Image area */}
      <Link href={product.href} className="block relative aspect-4/3 overflow-hidden" tabIndex={-1} aria-hidden="true">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className={`absolute inset-0 bg-linear-to-br ${bg} flex items-center justify-center`}>
            <div className="flex flex-col items-center gap-2 opacity-60">
              <div className="w-16 h-20 bg-white/60 rounded-xl shadow-sm" />
              <div className="w-10 h-1.5 bg-white/40 rounded-full" />
            </div>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>

      {/* Badge */}
      {product.badge && (
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColors[product.badge]}`}>
          {product.badge}
        </span>
      )}

      {/* Discount badge */}
      {discount && (
        <span className="absolute top-3 right-10 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
          {discount}% off
        </span>
      )}

      {/* Wishlist button */}
      <button
        onClick={() => setWishlisted((w) => !w)}
        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wishlisted}
      >
        <Heart
          className={`h-3.5 w-3.5 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
        />
      </button>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
              aria-hidden="true"
            />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">({product.reviewCount})</span>
        </div>

        <Link href={product.href}>
          <h3 className="text-sm font-semibold text-(--color-secondary) hover:text-(--color-primary) transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-extrabold text-(--color-primary)">
            ₹{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="mt-auto w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-(--color-primary)/10 text-(--color-primary) text-xs font-semibold hover:bg-(--color-primary) hover:text-white transition-all duration-200"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
          Add to Cart
        </button>
      </div>
    </article>
  );
}
