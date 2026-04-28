"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

function shouldBypassOptimizer(src?: string | null): boolean {
  if (!src) return false;
  return /^https?:\/\//i.test(src);
}

export default function CartDrawer() {
  const { isOpen, closeCart, items, total, totalGst, updateQuantity, removeItem } = useCart();

  // Pick currency symbol from the first cart item, fall back to ₹
  const currencySymbol = items[0]?.currencySymbol ?? "₹";
  const fmt = (amount: number) =>
    `${currencySymbol}${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const grandTotal = total + totalGst;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="z-[10001] flex h-full w-full max-w-sm flex-col p-0"
        overlayClassName="z-[10000] bg-black/45"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-gray-100">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-(--color-primary)" />
            Shopping Cart
            {items.length > 0 && (
              <span className="ml-1 text-sm font-normal text-gray-400">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                <ShoppingBag className="h-7 w-7 text-gray-300" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">
                  Add items to get started
                </p>
              </div>
              <Button
                variant="default"
                size="sm"
                className="mt-2"
                onClick={closeCart}
                asChild
              >
                <Link href="/shop">Shop Now</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 space-y-0">
              {items.map((item) => (
                <li key={item.id} className="py-4 flex gap-3">
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 shrink-0 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized={shouldBypassOptimizer(item.image)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-(--color-primary) font-semibold mt-0.5">
                      {fmt(item.price * item.quantity)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - (item.step ?? 1))}
                        className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + (item.step ?? 1))}
                        className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="group p-1.5 rounded-full text-gray-500 border border-gray-200 bg-white shadow-sm hover:text-white hover:border-transparent hover:shadow-md hover:bg-[linear-gradient(135deg,#17396f_0%,#2f6f9f_52%,#49ad57_100%)] transition-all self-start"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4 text-current group-hover:text-white transition-colors" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-4 space-y-4 bg-white">
            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{fmt(total)}</span>
              </div>
              {totalGst > 0 && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>GST</span>
                  <span>{fmt(totalGst)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>{fmt(grandTotal)}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2">
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout" onClick={closeCart}>
                  Checkout
                </Link>
              </Button>
              <Button variant="outline" className="w-full" size="default" asChild>
                <Link href="/cart" onClick={closeCart}>
                  View Cart
                </Link>
              </Button>
            </div>

          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
