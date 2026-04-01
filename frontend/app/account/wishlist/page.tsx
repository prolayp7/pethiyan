"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n);
}

function EmptyWishlist() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
        <Heart className="h-10 w-10 text-red-300" />
      </div>
      <h3 className="text-lg font-extrabold text-(--color-secondary) mb-2">Your wishlist is empty</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
        Save products you love by tapping the heart icon on any product.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white"
        style={{ background: "linear-gradient(135deg,#1f4f8a,#0f2f5f)" }}
      >
        Explore Products <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function WishlistPage() {
  const { items, remove, clear } = useWishlist();
  const { addItem, openCart }    = useCart();

  function handleAddToCart(item: typeof items[0]) {
    addItem({
      id: String(item.id),
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      slug: item.slug,
    });
    openCart();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-400 fill-red-400" />
          <h1 className="text-xl font-extrabold text-(--color-secondary)">
            Wishlist
            {items.length > 0 && (
              <span className="ml-2 text-sm font-semibold text-gray-400">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </h1>
        </div>
        {items.length > 0 && (
          <button
            onClick={clear}
            className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group"
            >
              {/* Image */}
              <Link href={`/products/${item.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-gray-200" />
                  </div>
                )}
                {/* Remove button overlay */}
                <button
                  onClick={(e) => { e.preventDefault(); remove(item.id); toast("Removed from wishlist", { icon: "🗑️" }); }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </Link>

              {/* Details */}
              <div className="p-4">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-sm font-semibold text-(--color-secondary) hover:text-(--color-primary) transition-colors line-clamp-2 leading-snug"
                >
                  {item.name}
                </Link>
                <p className="text-base font-extrabold text-(--color-secondary) mt-1.5">
                  {fmt(item.price)}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg,#1f4f8a,#0f2f5f)" }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => { remove(item.id); toast("Removed from wishlist", { icon: "🗑️" }); }}
                    className="w-10 flex items-center justify-center rounded-xl border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
