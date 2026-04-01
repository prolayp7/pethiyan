"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2, Plus, Minus, ShoppingBag, Tag, X,
  ChevronRight, ArrowRight, Loader2, CheckCircle2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { applyCoupon, type ApiCouponResult } from "@/lib/api";
import Container from "@/components/layout/Container";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

const FREE_SHIPPING_THRESHOLD = 999;

// ─── Empty Cart ───────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
        <ShoppingBag className="h-12 w-12 text-(--color-primary) opacity-50" />
      </div>
      <h2 className="text-2xl font-extrabold text-(--color-secondary) mb-2">Your cart is empty</h2>
      <p className="text-gray-500 text-sm mb-8 max-w-xs">
        Looks like you haven&apos;t added any packaging products yet.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
        style={{ background: "linear-gradient(135deg,#1f4f8a 0%,#0f2f5f 100%)" }}
      >
        Start Shopping
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// ─── Cart Page ────────────────────────────────────────────────────────────────

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<ApiCouponResult | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    setCouponLoading(true);
    const result = await applyCoupon(couponCode.trim().toUpperCase(), total);
    setCouponLoading(false);
    if (result.valid) {
      setCouponResult(result);
      setCouponCode("");
    } else {
      setCouponError(result.message ?? "Invalid coupon code.");
    }
  }, [couponCode, total]);

  const removeCoupon = () => {
    setCouponResult(null);
    setCouponCode("");
    setCouponError("");
  };

  const discount = couponResult?.discount_amount ?? 0;
  const shippingNote = total - discount >= FREE_SHIPPING_THRESHOLD ? "Free" : `${fmt(FREE_SHIPPING_THRESHOLD - total + discount)} away from free shipping`;
  const isFreeShipping = total - discount >= FREE_SHIPPING_THRESHOLD;
  const grandTotal = total - discount; // shipping added at checkout

  if (items.length === 0) {
    return (
      <div style={{ background: "var(--background)", minHeight: "100vh" }}>
        <Container>
          <EmptyCart />
        </Container>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <Container className="py-8 lg:py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
              <Link href="/" className="hover:text-(--color-primary)">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-(--color-secondary) font-medium">Cart</span>
            </nav>
            <h1 className="text-2xl font-extrabold text-(--color-secondary)">
              Shopping Cart
              <span className="ml-3 text-base font-semibold text-gray-400">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Items ── */}
          <div className="lg:col-span-7 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4"
              >
                {/* Image */}
                <Link
                  href={item.slug ? `/products/${item.slug}` : "#"}
                  className="shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 relative"
                >
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={item.slug ? `/products/${item.slug}` : "#"}
                        className="text-sm font-semibold text-(--color-secondary) hover:text-(--color-primary) transition-colors line-clamp-2 leading-snug"
                      >
                        {item.name}
                      </Link>
                      {item.variantLabel && (
                        <p className="text-xs text-gray-400 mt-0.5">{item.variantLabel}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 p-1 text-gray-300 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty controls */}
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= (item.minQty ?? 1)}
                        className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold text-(--color-secondary) tabular-nums min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm font-bold text-(--color-secondary)">
                        {fmt(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[11px] text-gray-400">{fmt(item.price)} each</p>
                      )}
                    </div>
                  </div>

                  {/* MOQ notice */}
                  {item.minQty && item.minQty > 1 && (
                    <p className="text-[11px] text-amber-600 mt-1.5">
                      Min. order: {item.minQty} units
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-sm text-(--color-primary) font-semibold hover:gap-2.5 transition-all"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-28">
              <h2 className="text-base font-extrabold text-(--color-secondary) mb-5">
                Order Summary
              </h2>

              {/* Free shipping progress */}
              {!isFreeShipping && (
                <div className="mb-5 p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-xs text-(--color-primary) font-medium">
                    🚚 Add <strong>{shippingNote}</strong> to get free shipping!
                  </p>
                  <div className="mt-2 h-1.5 rounded-full bg-blue-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-(--color-primary) transition-all"
                      style={{ width: `${Math.min((total - discount) / FREE_SHIPPING_THRESHOLD * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {isFreeShipping && (
                <div className="mb-5 p-3 rounded-xl bg-green-50 border border-green-100 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  <p className="text-xs text-green-700 font-medium">You&apos;ve unlocked free shipping!</p>
                </div>
              )}

              {/* Coupon */}
              {couponResult ? (
                <div className="mb-4 flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-100">
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">{couponResult.code}</span>
                    <span className="text-xs text-green-600">— {fmt(discount)} off</span>
                  </div>
                  <button onClick={removeCoupon} className="text-green-500 hover:text-green-700">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-(--color-primary) transition-colors">
                      <Tag className="h-4 w-4 text-gray-400 ml-3 shrink-0" />
                      <input
                        type="text"
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                        className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none placeholder-gray-400 font-mono tracking-wider"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || couponLoading}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      style={{ background: "linear-gradient(135deg,#1f4f8a 0%,#0f2f5f 100%)" }}
                    >
                      {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-500 mt-1.5">{couponError}</p>
                  )}
                </div>
              )}

              {/* Summary rows */}
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-(--color-secondary)">{fmt(total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Coupon discount</span>
                    <span className="text-green-600 font-semibold">−{fmt(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={isFreeShipping ? "text-green-600 font-semibold" : "text-gray-500 text-xs"}>
                    {isFreeShipping ? "Free" : "Calculated at checkout"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 border-t border-dashed border-gray-100 pt-3">
                  <span>GST (18% incl.)</span>
                  <span>{fmt(Math.round(grandTotal * 18 / 118))}</span>
                </div>
              </div>

              {/* Grand total */}
              <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
                <span className="text-base font-extrabold text-(--color-secondary)">Total</span>
                <span className="text-xl font-extrabold text-(--color-secondary)">{fmt(grandTotal)}</span>
              </div>

              {/* Checkout button */}
              <Link
                href="/checkout"
                className="mt-5 w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: "linear-gradient(135deg,#1f4f8a 0%,#0f2f5f 100%)" }}
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Trust badges */}
              <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-gray-400">
                <span>🔒 Secure Payment</span>
                <span>•</span>
                <span>📄 GST Invoice</span>
                <span>•</span>
                <span>🔄 Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
