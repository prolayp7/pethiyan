"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Loader2, Package, MapPin, ShoppingBag,
  CheckCircle2, Circle, Truck, Clock, XCircle,
} from "lucide-react";
import { getOrder, type ApiOrder, type ApiTrackingStep } from "@/lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n);
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function shouldBypassOptimizer(src?: string | null): boolean {
  if (!src) return false;
  return /^https?:\/\//i.test(src);
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:                  { label: "Pending",               cls: "bg-amber-100 text-amber-700"   },
  awaiting_store_response:  { label: "Awaiting Store Response", cls: "bg-yellow-100 text-yellow-700" },
  partially_accepted:       { label: "Partially Accepted",    cls: "bg-orange-100 text-orange-700" },
  accepted_by_seller:       { label: "Order Accepted",        cls: "bg-blue-100 text-blue-700"     },
  ready_for_pickup:         { label: "Order Packing Done",    cls: "bg-indigo-100 text-indigo-700" },
  assigned:                 { label: "Order Ready for Pickup", cls: "bg-purple-100 text-purple-700" },
  preparing:                { label: "Order Start Packing",   cls: "bg-blue-100 text-blue-700"     },
  collected:                { label: "Order Collected",       cls: "bg-indigo-100 text-indigo-700" },
  out_for_delivery:         { label: "Out for Delivery",      cls: "bg-indigo-100 text-indigo-700" },
  processing:               { label: "Processing",            cls: "bg-blue-100 text-blue-700"     },
  shipped:                  { label: "Shipped",               cls: "bg-indigo-100 text-indigo-700" },
  delivered:                { label: "Order Completed",       cls: "bg-green-100 text-green-700"   },
  cancelled:                { label: "Order Cancelled",       cls: "bg-red-100 text-red-700"       },
  failed:                   { label: "Order Failed",          cls: "bg-red-100 text-red-700"       },
  rejected_by_seller:       { label: "Rejected",              cls: "bg-red-100 text-red-700"       },
};

// ─── Generate default tracking steps from order status ────────────────────────

function buildDefaultTracking(status: string, createdAt: string): ApiTrackingStep[] {
  if (status === "cancelled" || status === "failed" || status === "rejected_by_seller") {
    return [
      { status: "pending",  label: "Order Placed", description: "Order was placed.", completed: true, timestamp: createdAt },
      { status,             label: STATUS_MAP[status]?.label ?? status, description: "This order was cancelled.", completed: true },
    ];
  }

  // Map detailed backend statuses → 4 simplified frontend steps
  const CONFIRMED_STATUSES = ["awaiting_store_response", "partially_accepted", "accepted_by_seller", "ready_for_pickup", "assigned", "preparing", "collected", "out_for_delivery", "processing", "shipped", "delivered"];
  const DISPATCHED_STATUSES = ["out_for_delivery", "shipped", "delivered"];
  const DELIVERED_STATUSES  = ["delivered"];

  const steps: ApiTrackingStep[] = [
    { status: "pending",        label: "Order Placed",    description: "Your order has been placed successfully.", completed: true,                              timestamp: createdAt },
    { status: "confirmed",      label: "Order Confirmed", description: "We're preparing your items for dispatch.", completed: CONFIRMED_STATUSES.includes(status) },
    { status: "out_for_delivery", label: "Dispatched",   description: "Your package is on its way.",              completed: DISPATCHED_STATUSES.includes(status) },
    { status: "delivered",      label: "Delivered",       description: "Your order has been delivered.",           completed: DELIVERED_STATUSES.includes(status)  },
  ];

  return steps;
}

// ─── Tracking Timeline ────────────────────────────────────────────────────────

function TrackingTimeline({ steps, status }: { steps: ApiTrackingStep[]; status: string }) {
  const isCancelled = status === "cancelled" || status === "failed" || status === "rejected_by_seller";

  return (
    <div className="relative">
      {steps.map((step, i) => {
        const isLast    = i === steps.length - 1;
        const isCurrent = step.completed && (isLast || !steps[i + 1]?.completed);
        const StepIcon  = step.completed
          ? isCancelled && isLast ? XCircle : CheckCircle2
          : Circle;

        return (
          <div key={i} className="flex gap-4">
            {/* Icon + line */}
            <div className="flex flex-col items-center">
              <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                step.completed
                  ? isCancelled && isLast
                    ? "bg-red-100"
                    : "bg-green-100"
                  : "bg-gray-100"
              }`}>
                <StepIcon className={`h-4.5 w-4.5 ${
                  step.completed
                    ? isCancelled && isLast ? "text-red-500" : "text-green-500"
                    : "text-gray-300"
                }`} />
                {/* Pulse for current active step */}
                {isCurrent && !isCancelled && (
                  <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30" />
                )}
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 my-1 rounded-full ${
                  step.completed && steps[i + 1]?.completed ? "bg-green-300" : "bg-gray-100"
                }`} style={{ minHeight: "2rem" }} />
              )}
            </div>

            {/* Content */}
            <div className={`pb-6 flex-1 min-w-0 ${isLast ? "" : ""}`}>
              <p className={`text-sm font-bold ${step.completed ? "text-(--color-secondary)" : "text-gray-300"}`}>
                {step.label}
              </p>
              {step.description && (
                <p className={`text-xs mt-0.5 ${step.completed ? "text-gray-500" : "text-gray-300"}`}>
                  {step.description}
                </p>
              )}
              {step.timestamp && (
                <p className="text-[11px] text-gray-400 mt-1">{fmtDate(step.timestamp)}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order,   setOrder]   = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getOrder(id).then((o) => {
      if (o) setOrder(o);
      else setNotFound(true);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-(--color-primary)" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <Package className="h-12 w-12 text-gray-200 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-(--color-secondary) mb-2">Order not found</h2>
        <p className="text-sm text-gray-500 mb-5">We couldn&apos;t find this order in your account.</p>
        <Link href="/account/orders" className="text-sm font-bold text-(--color-primary)">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const status        = STATUS_MAP[order.status] ?? { label: order.status, cls: "bg-gray-100 text-gray-600" };
  const trackingSteps = order.tracking?.length ? order.tracking : buildDefaultTracking(order.status, order.created_at);
  const subtotal = order.subtotal;
  const gst      = order.gst_amount ?? 0;

  return (
    <div className="space-y-5">

      {/* Back + header */}
      <div>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-(--color-primary) transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-(--color-secondary)">
              Order #{order.order_number}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Placed on {fmtDate(order.created_at)}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${status.cls}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ── Left: Tracking + Items ── */}
        <div className="lg:col-span-3 space-y-5">

          {/* Tracking */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Truck className="h-4 w-4 text-(--color-primary)" />
              <h2 className="text-sm font-extrabold text-(--color-secondary)">Order Tracking</h2>
            </div>
            <TrackingTimeline steps={trackingSteps} status={order.status} />
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-(--color-primary)" />
              <h2 className="text-sm font-extrabold text-(--color-secondary)">
                Items ({order.items.length})
              </h2>
            </div>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 relative shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                        unoptimized={shouldBypassOptimizer(item.image)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product_slug}`}
                      className="text-sm font-semibold text-(--color-secondary) hover:text-(--color-primary) line-clamp-2 leading-snug"
                    >
                      {item.product_name}
                    </Link>
                    {item.variant_label && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.variant_label}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-(--color-secondary) shrink-0">
                    {fmt(item.price > 0 ? item.price * item.quantity : (item.subtotal ?? 0))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Summary + Address ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Price breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-extrabold text-(--color-secondary) mb-4">Price Details</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">{fmt(subtotal)}</span>
              </div>
              {(order.discount ?? 0) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-semibold">−{fmt(order.discount ?? 0)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={order.shipping_charge === 0 ? "text-green-600 font-semibold" : "font-semibold"}>
                  {order.shipping_charge === 0 ? "Free" : fmt(order.shipping_charge)}
                </span>
              </div>
              {gst > 0 && (
                <div className="flex justify-between text-xs text-gray-400 border-t border-dashed border-gray-100 pt-2.5">
                  <span>GST</span>
                  <span>{fmt(gst)}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-gray-200 pt-2.5">
                <span className="font-extrabold text-(--color-secondary)">Total</span>
                <span className="text-lg font-extrabold text-(--color-secondary)">{fmt(order.total)}</span>
              </div>
            </div>

            {order.payment_method && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Payment</span>
                <span className="font-semibold capitalize">
                  {order.payment_method === "cod"
                    ? "Cash on Delivery"
                    : order.payment_method === "easepayPayment"
                      ? "Online (Easepay)"
                      : "Online (Razorpay)"}
                </span>
              </div>
            )}
          </div>

          {/* Delivery address */}
          {order.address && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-(--color-primary)" />
                <h2 className="text-sm font-extrabold text-(--color-secondary)">Delivery Address</h2>
              </div>
              <div className="text-sm text-gray-600 space-y-0.5">
                <p className="font-semibold text-(--color-secondary)">{order.address.name}</p>
                <p>{order.address.address_line1}</p>
                {order.address.address_line2 && <p>{order.address.address_line2}</p>}
                <p>{order.address.city}, {order.address.state} — {order.address.pincode}</p>
                <p className="text-xs text-gray-400 pt-1">📞 +91 {order.address.phone}</p>
              </div>
            </div>
          )}

          {/* Help */}
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4 text-center">
            <Clock className="h-5 w-5 text-(--color-primary) mx-auto mb-2" />
            <p className="text-xs font-semibold text-(--color-secondary) mb-1">Need help with this order?</p>
            <Link href="/contact" className="text-xs font-bold text-(--color-primary) hover:underline">
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
