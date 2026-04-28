"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Package, Search, Loader2, CheckCircle2, XCircle,
  Circle, Truck, MapPin, ShoppingBag, ArrowRight, Home,
  AlertCircle, ChevronRight, Tag, MessageSquare, LogIn, FileText,
} from "lucide-react";
import { trackOrder, type ApiOrder, type ApiTrackingStep } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/auth/LoginModal";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n);
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function fmtDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const STATUS_MAP: Record<string, { label: string; cls: string; bg: string }> = {
  pending:                 { label: "Order Placed",           cls: "text-amber-700",  bg: "bg-amber-100"  },
  awaiting_store_response: { label: "Awaiting Confirmation",  cls: "text-yellow-700", bg: "bg-yellow-100" },
  partially_accepted:      { label: "Partially Accepted",     cls: "text-orange-700", bg: "bg-orange-100" },
  accepted_by_seller:      { label: "Order Accepted",         cls: "text-blue-700",   bg: "bg-blue-100"   },
  ready_for_pickup:        { label: "Order Packing Done",     cls: "text-indigo-700", bg: "bg-indigo-100" },
  assigned:                { label: "Ready for Pickup",       cls: "text-purple-700", bg: "bg-purple-100" },
  preparing:               { label: "Packing",                cls: "text-blue-700",   bg: "bg-blue-100"   },
  collected:               { label: "Order Collected",        cls: "text-indigo-700", bg: "bg-indigo-100" },
  out_for_delivery:        { label: "Out for Delivery",       cls: "text-indigo-700", bg: "bg-indigo-100" },
  processing:              { label: "Processing",             cls: "text-blue-700",   bg: "bg-blue-100"   },
  shipped:                 { label: "Shipped",                cls: "text-indigo-700", bg: "bg-indigo-100" },
  delivered:               { label: "Delivered",              cls: "text-green-700",  bg: "bg-green-100"  },
  cancelled:               { label: "Cancelled",              cls: "text-red-700",    bg: "bg-red-100"    },
  failed:                  { label: "Order Failed",           cls: "text-red-700",    bg: "bg-red-100"    },
  rejected_by_seller:      { label: "Rejected",               cls: "text-red-700",    bg: "bg-red-100"    },
};

// ─── Build default tracking steps ─────────────────────────────────────────────

function buildTracking(status: string, createdAt: string): ApiTrackingStep[] {
  if (status === "cancelled" || status === "failed" || status === "rejected_by_seller") {
    return [
      { status: "pending",  label: "Order Placed",  description: "Order was placed.",         completed: true, timestamp: createdAt },
      { status,             label: STATUS_MAP[status]?.label ?? status, description: "This order was cancelled.", completed: true },
    ];
  }

  const CONFIRMED_STATUSES  = ["awaiting_store_response", "partially_accepted", "accepted_by_seller", "ready_for_pickup", "assigned", "preparing", "collected", "out_for_delivery", "processing", "shipped", "delivered"];
  const DISPATCHED_STATUSES = ["out_for_delivery", "shipped", "delivered"];

  return [
    { status: "pending",          label: "Order Placed",    description: "Your order has been received.",            completed: true,                               timestamp: createdAt },
    { status: "confirmed",        label: "Order Confirmed", description: "We're preparing your items for dispatch.", completed: CONFIRMED_STATUSES.includes(status)  },
    { status: "out_for_delivery", label: "Dispatched",      description: "Your package is on its way.",              completed: DISPATCHED_STATUSES.includes(status) },
  ];
}

// ─── Tracking Timeline ────────────────────────────────────────────────────────

function TrackingTimeline({ steps, status }: { steps: ApiTrackingStep[]; status: string }) {
  const isCancelled = status === "cancelled" || status === "failed" || status === "rejected_by_seller";

  return (
    <div className="relative">
      {steps.map((step, i) => {
        const isLast    = i === steps.length - 1;
        const isCurrent = step.completed && (isLast || !steps[i + 1]?.completed);

        return (
          <div key={i} className="flex gap-4">
            {/* Icon + connector */}
            <div className="flex flex-col items-center">
              <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                step.completed
                  ? isCancelled && isLast ? "bg-red-100" : "bg-green-100"
                  : "bg-gray-100"
              }`}>
                {step.completed ? (
                  isCancelled && isLast
                    ? <XCircle className="h-5 w-5 text-red-500" />
                    : <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
                {isCurrent && !isCancelled && (
                  <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-25" />
                )}
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 my-1 rounded-full ${
                    step.completed && steps[i + 1]?.completed ? "bg-green-300" : "bg-gray-100"
                  }`}
                />
              )}
            </div>

            {/* Text */}
            <div className="pb-7 flex-1">
              <p className={`font-bold text-sm ${step.completed ? "text-gray-900" : "text-gray-300"}`}>
                {step.label}
              </p>
              {step.description && (
                <p className={`text-xs mt-0.5 ${step.completed ? "text-gray-500" : "text-gray-300"}`}>
                  {step.description}
                </p>
              )}
              {step.timestamp && (
                <p className="text-[11px] text-gray-400 mt-1">{fmtDateTime(step.timestamp)}</p>
              )}
              {isCurrent && !isCancelled && (
                <span className="inline-block mt-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  Current Status
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Order Result ─────────────────────────────────────────────────────────────

function OrderResult({ order, onViewDetails, isLoggedIn }: { order: ApiOrder; onViewDetails: () => void; isLoggedIn: boolean }) {
  const status = STATUS_MAP[order.status] ?? { label: order.status, cls: "text-gray-600", bg: "bg-gray-100" };
  const steps  = order.tracking?.length
    ? order.tracking
    : buildTracking(order.status, order.created_at);
  const previewItems = order.items.slice(0, 3);

  return (
    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-400">

      {/* Summary banner */}
      <div className="btn-brand rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-blue-200 text-xs font-semibold mb-1">Order Number</p>
            <p className="text-xl font-extrabold font-mono tracking-wider">
              #{order.order_number}
            </p>
            <p className="text-blue-300 text-xs mt-1">Placed on {fmtDate(order.created_at)}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${status.bg} ${status.cls}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">

        {/* ── Left: Tracking timeline ── */}
        <div className="sm:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Truck className="h-4 w-4 text-(--color-primary)" />
              <h2 className="text-sm font-extrabold text-gray-900">Live Tracking</h2>
            </div>
            <TrackingTimeline steps={steps} status={order.status} />
          </div>

          {/* Tracking code */}
          {order.tracking_code && (
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Tag className="h-4 w-4 text-(--color-primary)" />
                <h2 className="text-sm font-extrabold text-gray-900">Tracking Code</h2>
              </div>
              <p className="text-sm font-mono font-semibold text-gray-800 tracking-wide break-all">
                {order.tracking_code}
              </p>
            </div>
          )}

          {/* Admin note */}
          {order.admin_note && (
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <MessageSquare className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-extrabold text-gray-900">Note from our team</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{order.admin_note}</p>
            </div>
          )}
        </div>

        {/* ── Right column ── */}
        <div className="sm:col-span-2 space-y-4">

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-extrabold text-gray-900 mb-3">
              Items ({order.items.length})
            </h2>
            <div className="space-y-3">
              {previewItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 relative shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.product_name} fill className="object-cover" unoptimized={/^https?:\/\//i.test(item.image)} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 line-clamp-1">
                      {item.product_name}
                    </p>
                    {item.variant_label && (
                      <p className="text-[10px] text-gray-400">{item.variant_label}</p>
                    )}
                    <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-bold text-gray-700 shrink-0">
                    {fmt(item.subtotal ?? item.price * item.quantity)}
                  </p>
                </div>
              ))}
              {order.items.length > 3 && (
                <p className="text-[11px] text-gray-400 text-center">
                  +{order.items.length - 3} more items
                </p>
              )}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Total</span>
              <span className="text-sm font-extrabold text-gray-900">{fmt(order.total)}</span>
            </div>
          </div>

          {/* Delivery city */}
          {order.address && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-(--color-primary)" />
                <h2 className="text-sm font-extrabold text-gray-900">Delivering to</h2>
              </div>
              <p className="text-sm font-semibold text-gray-800">{order.address.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{order.address.city}, {order.address.state}</p>
              <p className="text-xs text-gray-500">{order.address.pincode}</p>
            </div>
          )}

          {/* View full order details CTA */}
          <button
            type="button"
            onClick={onViewDetails}
            className="btn-brand w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all hover:-translate-y-0.5"
          >
            {isLoggedIn ? (
              <><FileText className="h-4 w-4" /> View Full Order Details</>
            ) : (
              <><LogIn className="h-4 w-4" /> Sign In to View Details</>
            )}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TrackOrderClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [query,          setQuery]          = useState(searchParams.get("order_number") ?? searchParams.get("query") ?? "");
  const [loading,        setLoading]        = useState(false);
  const [result,         setResult]         = useState<ApiOrder | null>(null);
  const [notFound,       setNotFound]       = useState(false);
  const [hasSearched,    setHasSearched]    = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleViewDetails = useCallback(() => {
    if (!result) return;
    if (isLoggedIn) {
      router.push(`/account/orders/${result.slug}`);
    } else {
      setLoginModalOpen(true);
    }
  }, [isLoggedIn, result, router]);

  const handleTrack = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    setHasSearched(true);

    const order = await trackOrder(query.trim());
    setLoading(false);

    if (order) {
      setResult(order);
    } else {
      setNotFound(true);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleTrack();
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10 lg:py-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-(--color-primary) flex items-center gap-1">
            <Home className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600 font-medium">Track Order</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="btn-brand inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-(--color-secondary)">Track Your Order</h1>
          <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
            Enter your order number or tracking code to get real-time delivery updates.
          </p>
        </div>

        {/* Search form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="space-y-4">

            {/* Order number / tracking code */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Order Number or Tracking Code
              </label>
              <div className="relative">
                <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. PET2026042300013 or tracking code"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value.toUpperCase());
                    setNotFound(false);
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-mono tracking-wider outline-none focus:border-(--color-primary) focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Error */}
            {notFound && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                No order found. Please check your order number or tracking code.
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleTrack}
              disabled={loading || !query.trim()}
              className="btn-brand w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Tracking…</>
              ) : (
                <><Search className="h-4 w-4" /> Track Order</>
              )}
            </button>
          </div>

          {/* Help text */}
          <p className="mt-4 text-center text-xs text-gray-400">
            Your order number was sent via SMS after placing your order.{" "}
            <Link href="/contact" className="underline hover:text-gray-600">Need help?</Link>
          </p>
        </div>

        {/* Skeleton while loading */}
        {loading && (
          <div className="mt-6 space-y-4 animate-pulse">
            <div className="rounded-2xl p-5 bg-gray-200 h-24" />
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="sm:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div className="h-4 w-28 bg-gray-200 rounded" />
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                      {i < 2 && <div className="w-0.5 flex-1 my-1 bg-gray-100 rounded-full min-h-10" />}
                    </div>
                    <div className="pb-7 flex-1 space-y-2">
                      <div className="h-3.5 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-48 bg-gray-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="sm:col-span-2 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-full bg-gray-200 rounded" />
                        <div className="h-2.5 w-12 bg-gray-100 rounded" />
                      </div>
                      <div className="h-3 w-14 bg-gray-200 rounded shrink-0" />
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 border-t border-gray-100">
                    <div className="h-3 w-10 bg-gray-100 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
                  <div className="h-3.5 w-36 bg-gray-200 rounded" />
                  <div className="h-3 w-28 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {!loading && result && (
          <OrderResult order={result} onViewDetails={handleViewDetails} isLoggedIn={isLoggedIn} />
        )}

        {/* Login modal — opens when guest clicks "Sign In to View Details" */}
        <LoginModal
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onSuccess={() => {
            setLoginModalOpen(false);
            if (result) router.push(`/account/orders/${result.slug}`);
          }}
        />

        {/* Logged in user shortcut */}
        {!hasSearched && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/account/orders"
                className="font-bold text-(--color-primary) hover:underline"
              >
                View all orders →
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
