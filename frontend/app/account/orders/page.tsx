"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package, ChevronRight, Loader2, ShoppingBag, ArrowRight,
} from "lucide-react";
import { getOrders, type ApiOrder } from "@/lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const STATUS_MAP: Record<ApiOrder["status"], { label: string; cls: string }> = {
  pending:    { label: "Pending",    cls: "bg-amber-100 text-amber-700"  },
  processing: { label: "Processing", cls: "bg-blue-100 text-blue-700"    },
  shipped:    { label: "Shipped",    cls: "bg-indigo-100 text-indigo-700" },
  delivered:  { label: "Delivered",  cls: "bg-green-100 text-green-700"  },
  cancelled:  { label: "Cancelled",  cls: "bg-red-100 text-red-700"      },
};

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">
        <Package className="h-10 w-10 text-(--color-primary) opacity-50" />
      </div>
      <h3 className="text-lg font-extrabold text-(--color-secondary) mb-2">No orders yet</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        Your order history will appear here once you make your first purchase.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white"
        style={{ background: "linear-gradient(135deg,#1f4f8a,#0f2f5f)" }}
      >
        Start Shopping <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: ApiOrder }) {
  const status = STATUS_MAP[order.status] ?? { label: order.status, cls: "bg-gray-100 text-gray-600" };
  const previewItems = order.items.slice(0, 2);
  const moreCount   = order.items.length - previewItems.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold text-gray-500 font-mono">#{order.order_number}</span>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${status.cls}`}>
            {status.label}
          </span>
        </div>
        <span className="text-xs text-gray-400">{fmtDate(order.created_at)}</span>
      </div>

      {/* Items preview */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-3">
          {previewItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 relative shrink-0">
                {(item.image || item.product?.image) ? (
                  <Image
                    src={(item.image || item.product?.image) as string}
                    alt={item.product_name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-(--color-secondary) line-clamp-1">
                  {item.product_name}
                </p>
                {item.variant_label && (
                  <p className="text-xs text-gray-400">{item.variant_label}</p>
                )}
                <p className="text-xs text-gray-500">Qty: {item.quantity} · {fmt(item.price)}</p>
              </div>
            </div>
          ))}
          {moreCount > 0 && (
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-gray-500">+{moreCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
        <div>
          <span className="text-xs text-gray-500">Total: </span>
          <span className="text-sm font-extrabold text-(--color-secondary)">{fmt(order.total)}</span>
          <span className="text-xs text-gray-400 ml-1">
            ({order.items.length} {order.items.length === 1 ? "item" : "items"})
          </span>
        </div>
        <Link
          href={`/account/orders/${order.slug}`}
          className="flex items-center gap-1 text-sm font-bold text-(--color-primary) hover:gap-2 transition-all"
        >
          View Details <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [orders, setOrders]   = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then((list) => {
      setOrders(list);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-5 w-5 text-(--color-primary)" />
        <h1 className="text-xl font-extrabold text-(--color-secondary)">My Orders</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-(--color-primary)" />
        </div>
      ) : orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
