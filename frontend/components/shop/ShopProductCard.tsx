"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toNum, type ApiProduct } from "@/lib/api";

export default function ShopProductCard({ product }: { product: ApiProduct }) {
  const { addItem, openCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);

  const price = toNum(product.sale_price ?? product.price);
  const compare = toNum(product.compare_price ?? product.sale_price);
  const showCompare = compare > 0 && compare > price;
  const discount = showCompare
    ? Math.round(((compare - price) / compare) * 100)
    : null;
  const rating = product.rating ?? 0;
  const reviewCount = product.reviews_count ?? 0;

  const handleAddToCart = () => {
    addItem({ id: String(product.id), name: product.name, price });
    openCart();
  };

  return (
    <article className="group relative bg-white rounded-2xl border border-(--color-border) overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-4/3 overflow-hidden bg-linear-to-br from-(--color-primary)/10 to-(--color-primary-light)"
        tabIndex={-1}
        aria-hidden="true"
      >
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-14 w-14 text-(--color-primary)/20" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>

      {/* Discount badge */}
      {discount && (
        <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
          -{discount}%
        </span>
      )}

      {/* Wishlist */}
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
      <div className="p-4">
        {/* Stars */}
        <div className="flex items-center gap-1 mb-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
              aria-hidden="true"
            />
          ))}
          {reviewCount > 0 && (
            <span className="text-[10px] text-gray-400 ml-1">({reviewCount})</span>
          )}
        </div>

        {product.category && (
          <p className="text-[10px] text-(--color-primary) font-semibold uppercase tracking-wider mb-1">
            {product.category.name}
          </p>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-(--color-secondary) hover:text-(--color-primary) transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-extrabold text-(--color-primary)">
            ₹{price.toFixed(2)}
          </span>
          {showCompare && (
            <span className="text-xs text-gray-400 line-through">
              ₹{compare.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-(--color-primary)/10 text-(--color-primary) text-xs font-semibold hover:bg-(--color-primary) hover:text-white transition-all duration-200"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
          Add to Cart
        </button>
      </div>
    </article>
  );
}
