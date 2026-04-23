"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2, Plus, Minus, ShoppingBag, Tag, X,
  ChevronRight, ArrowRight, Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { applyCoupon, type ApiCouponResult } from "@/lib/api";
import Container from "@/components/layout/Container";
import BrowsingHistory from "@/components/product/BrowsingHistory";
import YourItems from "@/components/sections/YourItems";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shouldBypassOptimizer(src?: string | null): boolean {
  if (!src) return false;
  return /^https?:\/\//i.test(src);
}

function formatWeightDisplay(weight?: number, weightUnit?: string, quantity = 1): string | null {
  if (weight == null || weight <= 0) return null;

  const unit = (weightUnit ?? "g").toLowerCase();
  const unitGrams = unit === "kg" ? weight * 1000 : weight;
  const totalGrams = unitGrams * quantity;
  const formatGrams = (grams: number) =>
    grams >= 1000
      ? `${(grams / 1000).toFixed(2)} kg`
      : `${grams.toFixed(2)} g`;

  return `Total weight: ${formatGrams(totalGrams)} (${formatGrams(unitGrams)} x ${quantity})`;
}

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
        className="btn-brand inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
      >
        Start Shopping
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// ─── Cart Page ────────────────────────────────────────────────────────────────

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, totalGst, clearCart } = useCart();

  const currencySymbol = items[0]?.currencySymbol ?? "₹";
  const fmt = (n: number) =>
    `${currencySymbol}${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const FREE_SHIPPING_THRESHOLD = currencySymbol === "₹" ? 999 : 50;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // ── Coupon ─────────────────────────────────────────────────────────────────
  const [couponCode, setCouponCode]     = useState("");
  const [couponResult, setCouponResult] = useState<ApiCouponResult | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError]   = useState("");

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    setCouponLoading(true);
    const result = await applyCoupon(couponCode.trim().toUpperCase(), total);
    setCouponLoading(false);
    if (result.valid) {
      setCouponResult(result);
      setCouponCode("");
      sessionStorage.setItem("applied_coupon", JSON.stringify(result));
    } else {
      setCouponError(result.message ?? "Invalid coupon code.");
    }
  }, [couponCode, total]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("applied_coupon");
      if (!saved) return;

      const parsed = JSON.parse(saved) as ApiCouponResult;
      if (!parsed?.valid) return;

      setCouponCode(parsed.code);
      setCouponResult(parsed);
    } catch {
      sessionStorage.removeItem("applied_coupon");
    }
  }, []);

  const removeCoupon = () => {
    setCouponResult(null);
    setCouponCode("");
    setCouponError("");
    sessionStorage.removeItem("applied_coupon");
  };

  const discount = couponResult?.discount_amount ?? 0;
  const subtotalAfterDiscount = Math.max(total - discount, 0);
  const grandTotal = subtotalAfterDiscount + totalGst;
  const isFreeShipping = grandTotal >= FREE_SHIPPING_THRESHOLD;
  void isFreeShipping; // referenced elsewhere if needed

  if (items.length === 0) {
    return (
      <div className="bg-background min-h-screen">
        <Container>
          <EmptyCart />
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Container className="py-8 lg:py-12">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
              <Link href="/" className="hover:text-(--color-primary)">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-(--color-secondary) font-medium">Cart</span>
            </nav>
            <h1 className="text-2xl font-extrabold text-(--color-secondary)">
              Shopping Cart
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart.
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors mt-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Items ── */}
          <div className="lg:col-span-7 space-y-3">
            {items.map((item) => {
              const weightDisplay = formatWeightDisplay(item.weight, item.weightUnit, item.quantity);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3 transition-all duration-200"
                >
                  {/* Image */}
                  <Link
                    href={item.slug ? `/products/${item.slug}` : "#"}
                    className="shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 relative"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized={shouldBypassOptimizer(item.image)}
                      />
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
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 p-1.5 rounded-full text-gray-300 border border-transparent hover:text-white hover:border-transparent hover:shadow-md hover:bg-[linear-gradient(135deg,#17396f_0%,#2f6f9f_52%,#49ad57_100%)] transition-all"
                        aria-label="Remove item"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - (item.step ?? 1))}
                          disabled={item.quantity <= (item.minQty ?? 1)}
                          className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 py-1.5 text-sm font-semibold text-(--color-secondary) tabular-nums min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + (item.step ?? 1))}
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
                        {weightDisplay && (
                          <p className="text-[11px] text-gray-400 mt-1">{weightDisplay}</p>
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
              );
            })}

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
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-extrabold text-(--color-secondary)">
                  Order Summary
                </h2>
                <span className="text-[11px] font-semibold bg-(--color-primary)/10 text-(--color-primary) px-2.5 py-1 rounded-full">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Coupon */}
              {couponResult ? (
                <div className="mb-4 flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-100">
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">{couponResult.code}</span>
                    <span className="text-xs text-green-600">— {fmt(discount)} off</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-green-500 hover:text-green-700"
                    aria-label="Remove coupon"
                  >
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
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || couponLoading}
                      className="btn-brand px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-(--color-secondary)">{fmt(total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Coupon discount</span>
                    <span className="text-green-600 font-semibold">−{fmt(discount)}</span>
                  </div>
                )}
                {totalGst > 0 && (
                  <div className="flex justify-between text-xs text-gray-400 border-t border-dashed border-gray-100 pt-3">
                    <span>GST</span>
                    <span>{fmt(totalGst)}</span>
                  </div>
                )}
              </div>

              {/* Grand total */}
              <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
                <span className="text-base font-extrabold text-(--color-secondary)">Total</span>
                <span className="text-xl font-extrabold text-(--color-secondary)">{fmt(grandTotal)}</span>
              </div>

              {/* Checkout button */}
              <Link
                href="/checkout"
                className="btn-brand mt-5 w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Trust badges */}
              <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-gray-400">
                <span>🔒 Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <YourItems />

      <BrowsingHistory />

      {/* Mobile bottom nav padding */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </div>
  );
}
