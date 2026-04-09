"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { flushPurchaseEvent } from "@/lib/analytics";
import { CheckCircle2, Package, ArrowRight, Home, ShoppingBag } from "lucide-react";

// ─── Inner component (uses useSearchParams) ───────────────────────────────────

function OrderConfirmedInner() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order_number") ?? "";
  const orderId = searchParams.get("order_id") ?? "";

  // Fire GA4 purchase + FB Purchase event once, using data stored before checkout redirect
  useEffect(() => {
    flushPurchaseEvent();
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full max-w-md text-center">

        {/* Success animation */}
        <div className="relative inline-flex mb-8">
          <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          {/* Decorative rings */}
          <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-30" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h1 className="text-2xl font-extrabold text-(--color-secondary) mb-2">
            Order Confirmed! 🎉
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Thank you for your order. We&apos;ll start processing it right away.
          </p>

          {/* Order number */}
          {orderNumber && (
            <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs text-gray-500 mb-1">Order Number</p>
              <p className="text-lg font-extrabold text-(--color-primary) tracking-wider font-mono">
                {orderNumber}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Save this for tracking your order
              </p>
            </div>
          )}

          {/* What happens next */}
          <div className="text-left mb-6 space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">What happens next</p>

            {[
              { icon: "📧", text: "You'll receive a confirmation SMS on your registered mobile." },
              { icon: "📦", text: "We'll pack and dispatch your order within 1–2 business days." },
              { icon: "🚚", text: "Track your shipment in real-time from your account." },
            ].map(({ icon, text }, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5">{icon}</span>
                <p className="text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            {orderId && (
              <Link
                href={`/account/orders/${orderId}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg,#1f4f8a,#0f2f5f)" }}
              >
                <Package className="h-4 w-4" />
                View Order Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}

            <Link
              href="/account/orders"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-(--color-primary) border-2 border-(--color-primary) hover:bg-blue-50 transition-all"
            >
              <Package className="h-4 w-4" />
              All My Orders
            </Link>

            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                href="/shop"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Shop More
              </Link>
            </div>
          </div>
        </div>

        {/* Track order link */}
        <p className="mt-6 text-xs text-gray-400">
          Can also track using{" "}
          <Link href="/track-order" className="underline text-(--color-primary) font-medium">
            Track My Order
          </Link>
          {orderNumber && (
            <> with order number <strong className="font-mono">{orderNumber}</strong></>
          )}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="w-16 h-16 rounded-full border-4 border-(--color-primary) border-t-transparent animate-spin" />
      </div>
    }>
      <OrderConfirmedInner />
    </Suspense>
  );
}
