"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2, Package, ArrowRight, Home, ShoppingBag,
  MapPin, CreditCard, Clock, Truck,
} from "lucide-react";
import { flushPurchaseEvent } from "@/lib/analytics";
import { getOrder, type ApiOrder } from "@/lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR",
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n);
}

function bypassOptimizer(src?: string | null) {
  return typeof src === "string" && /^https?:\/\//i.test(src);
}

const PAYMENT_LABELS: Record<string, string> = {
  razorpay: "Razorpay",
  easepay:  "Easepay",
  cod:      "Cash on Delivery",
};

function OrderConfirmedHeroSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center animate-pulse">
      <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-6" />
      <div className="h-8 w-72 max-w-full bg-gray-200 rounded-xl mx-auto mb-3" />
      <div className="h-4 w-96 max-w-full bg-gray-100 rounded-full mx-auto mb-2" />
      <div className="h-4 w-80 max-w-full bg-gray-100 rounded-full mx-auto" />
      <div className="mt-5 w-64 max-w-full mx-auto rounded-xl bg-blue-50 border border-blue-100 px-6 py-3">
        <div className="h-3 w-24 bg-blue-100 rounded-full mx-auto mb-2" />
        <div className="h-7 w-44 bg-blue-200 rounded-lg mx-auto mb-2" />
        <div className="h-3 w-32 bg-blue-100 rounded-full mx-auto" />
      </div>
    </div>
  );
}

function OrderConfirmedDetailsSkeleton() {
  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="h-4 w-36 bg-gray-200 rounded-full" />
        </div>
        <div className="divide-y divide-gray-50">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex gap-3 px-5 py-4">
              <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-100 shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
                <div className="h-3 w-1/2 bg-gray-100 rounded-full" />
                <div className="h-3 w-20 bg-gray-100 rounded-full" />
              </div>
              <div className="w-24 shrink-0 space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded-full" />
                <div className="h-3 w-16 ml-auto bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
            <div className="h-4 w-32 bg-gray-200 rounded-full mb-4" />
            <div className="space-y-3">
              <div className="h-3 w-full bg-gray-100 rounded-full" />
              <div className="h-3 w-5/6 bg-gray-100 rounded-full" />
              <div className="h-3 w-2/3 bg-gray-100 rounded-full" />
              <div className="h-3 w-3/4 bg-gray-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Inner component (uses useSearchParams) ───────────────────────────────────

function OrderConfirmedInner() {
  const searchParams = useSearchParams();
  const orderNumber  = searchParams.get("order_number") ?? "";
  const orderId      = searchParams.get("order_id")     ?? "";
  const orderSlug    = searchParams.get("order_slug")   ?? "";

  const [order,   setOrder]   = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { flushPurchaseEvent(); }, []);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    getOrder(orderId).then((o) => { setOrder(o); setLoading(false); });
  }, [orderId]);

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "var(--background)" }}>
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Hero card ── */}
        {loading ? (
          <OrderConfirmedHeroSkeleton />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="relative inline-flex mb-6">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-14 w-14 text-green-500" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-30" />
            </div>

            <h1 className="text-2xl font-extrabold text-(--color-secondary) mb-1">
              Thank You for Your Order!
            </h1>
            <p className="text-gray-500 text-sm">
              Your order has been placed successfully. We&apos;ll start processing it right away.
            </p>

            {orderNumber && (
              <div className="mt-5 inline-block px-6 py-3 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-[11px] text-gray-500 mb-0.5">Order Number</p>
                <p className="text-lg font-extrabold text-(--color-primary) tracking-wider font-mono">
                  {orderNumber}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">Save this for tracking your order</p>
              </div>
            )}
          </div>
        )}

        {/* ── Order detail cards ── */}
        {loading ? (
          <OrderConfirmedDetailsSkeleton />
        ) : order ? (
          <>
            {/* Items list */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <Package className="h-4 w-4 text-(--color-primary)" />
                <h2 className="text-sm font-bold text-gray-700">
                  Order Items <span className="text-gray-400 font-normal">({order.items.length})</span>
                </h2>
              </div>
              <div className="divide-y divide-gray-50">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-3 px-5 py-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.product_name}
                          width={56} height={56}
                          unoptimized={bypassOptimizer(item.image)}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2">{item.product_name}</p>
                      {item.variant_label && (
                        <p className="text-xs text-gray-400 mt-0.5">{item.variant_label}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-800">
                        {fmt((item.subtotal != null && item.subtotal > 0) ? item.subtotal : item.price * item.quantity)}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{fmt(item.price)} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price summary + delivery address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Price summary */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-4 w-4 text-(--color-primary)" />
                  <h2 className="text-sm font-bold text-gray-700">Price Summary</h2>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{fmt(order.subtotal)}</span>
                  </div>
                  {(order.delivery_charge ?? 0) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>{fmt(order.delivery_charge ?? 0)}</span>
                    </div>
                  )}
                  {(order.discount ?? 0) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{fmt(order.discount ?? 0)}</span>
                    </div>
                  )}
                  {(order.discount ?? 0) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{fmt(order.discount ?? 0)}</span>
                    </div>
                  )}
                  {(order.gst_amount ?? 0) > 0 && (
                    <div className="flex justify-between text-gray-400 text-xs">
                      <span>GST</span>
                      <span>{fmt(order.gst_amount ?? 0)}</span>
                    </div>
                  )}
                  <div className="pt-2.5 border-t border-gray-100 flex justify-between font-bold text-gray-900">
                    <span>Total Paid</span>
                    <span className="text-(--color-primary)">{fmt(order.final_total)}</span>
                  </div>
                  {order.payment_method && (
                    <div className="pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-50">
                      <span>Payment via</span>
                      <span className="font-semibold text-gray-700">
                        {PAYMENT_LABELS[order.payment_method.toLowerCase()] ?? order.payment_method}
                      </span>
                    </div>
                  )}
                  {order.payment_status && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Payment status</span>
                      <span className={`px-2 py-0.5 rounded-full font-semibold capitalize ${
                        order.payment_status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {order.payment_status}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery address */}
              {order.address && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-(--color-primary)" />
                    <h2 className="text-sm font-bold text-gray-700">Delivery Address</h2>
                  </div>
                  <div className="text-sm text-gray-600 space-y-0.5">
                    <p className="font-semibold text-gray-800">{order.address.name}</p>
                    {order.address.company_name && (
                      <p className="text-xs text-gray-500">{order.address.company_name}</p>
                    )}
                    <p>{order.address.address_line1}</p>
                    {order.address.address_line2 && <p>{order.address.address_line2}</p>}
                    <p>
                      {[order.address.city, order.address.state, order.address.pincode]
                        .filter(Boolean).join(", ")}
                    </p>
                    {order.address.phone && (
                      <p className="pt-1.5 text-xs text-gray-400">
                        <span className="font-medium">Phone:</span> {order.address.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}

        {/* ── What happens next ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-4">What happens next</h2>
          <div className="space-y-4">
            {[
              {
                icon: <Clock className="h-4 w-4 text-(--color-primary)" />,
                title: "Confirmation",
                text: "You'll receive a confirmation SMS on your registered mobile number.",
              },
              {
                icon: <Package className="h-4 w-4 text-(--color-primary)" />,
                title: "Packing & Dispatch",
                text: "We'll pack and dispatch your order within 1–2 business days.",
              },
              {
                icon: <Truck className="h-4 w-4 text-(--color-primary)" />,
                title: "Shipment Tracking",
                text: "Track your shipment in real-time from your account.",
              },
            ].map(({ icon, title, text }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTAs ── */}
        <div className="space-y-3">
          {orderId && (
            (() => {
              const orderLink = order?.slug ? `/account/orders/${order.slug}` : (orderSlug ? `/account/orders/${orderSlug}` : `/account/orders/${orderId}`);
              return (
                <Link
                  href={orderLink}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 shadow-sm"
                  style={{ background: "linear-gradient(135deg,#1f4f8a,#0f2f5f)" }}
                >
                  <Package className="h-4 w-4" />
                  View Full Order Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              );
            })()
          )}
          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/shop"
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 shadow-sm"
              style={{ background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)" }}
            >
              <ShoppingBag className="h-4 w-4" />
              Shop More
            </Link>
          </div>
        </div>

        {/* Track order footnote */}
        <p className="text-center text-xs text-gray-400 pb-6">
          You can also track using{" "}
          <Link href="/track-order" className="underline text-(--color-primary) font-medium">
            Track My Order
          </Link>
          {orderNumber && (
            <> with order number{" "}
              <strong className="font-mono text-gray-600">{orderNumber}</strong>
            </>
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
      <div className="min-h-screen py-10 px-4" style={{ background: "var(--background)" }}>
        <div className="max-w-2xl mx-auto space-y-5">
          <OrderConfirmedHeroSkeleton />
          <OrderConfirmedDetailsSkeleton />
        </div>
      </div>
    }>
      <OrderConfirmedInner />
    </Suspense>
  );
}
