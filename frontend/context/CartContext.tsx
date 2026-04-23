"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { getProduct, serverCartAdd, serverCartUpdateQty, serverCartRemove, serverCartClear } from "@/lib/api";
import { CART_COUNT_COOKIE, writeCountCookie } from "@/lib/count-preferences";

export interface CartItem {
  id: string;               // unique key, e.g. "42-v15" (productId-variantId)
  productId?: number;
  name: string;
  price: number;            // GST-excluded unit price (special_price ?? cost)
  taxPerUnit?: number;      // GST per unit (gst.total_tax_amount)
  quantity: number;
  image?: string | null;
  slug?: string;
  variantId?: number;
  variantLabel?: string;
  minQty?: number;
  step?: number;            // quantity_step_size
  totalAllowed?: number | null; // total_allowed_quantity (null = unlimited)
  stock?: number;          // store stock for the variant
  currencySymbol?: string;  // e.g. "₹", "$"
  weight?: number;          // weight per unit
  weightUnit?: string;      // e.g. "g", "kg"
  storeId?: number;         // store_id for server cart sync
  serverCartItemId?: number; // cart item id from backend (for update/remove)
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  totalGst: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const LS_KEY = "pethiyan_cart";

export function CartProvider({
  children,
  initialItemCount = 0,
}: {
  children: React.ReactNode;
  initialItemCount?: number;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const weightBackfillAttemptedRef = useRef(new Set<string>());

  // Keep a ref always in sync with current items so callbacks can read
  // current state without stale closures
  const itemsRef = useRef<CartItem[]>([]);
  useEffect(() => { itemsRef.current = items; }, [items]);

  // Prevent rapid duplicate addItem calls for same id (e.g., accidental
  // double-clicks or render loops). Tracks IDs that are in the process of
  // being added so subsequent calls within the same tick are ignored.
  const pendingAddsRef = useRef(new Set<string>());

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CartItem[];

        // Sanitize persisted quantities so corrupted or stale values don't
        // produce huge totals in the cart drawer. Enforce min/step/stock/totalAllowed
        // and snap quantities to the configured step relative to minQty.
        const sanitized = parsed.map((it) => {
          const min = Number(it.minQty ?? 1) || 1;
          const step = Number(it.step ?? 1) || 1;
          let q = Number(it.quantity ?? 0) || 0;
          q = Math.max(q, min);

          if (q > min && step > 0) {
            const delta = q - min;
            const n = Math.round(delta / step);
            q = min + n * step;
            if (q < min) q = min;
          }

          if (it.totalAllowed && it.totalAllowed > 0) q = Math.min(q, it.totalAllowed);
          if (it.stock != null) q = Math.min(q, it.stock);

          // Reasonable upper bound guard
          q = Math.min(q, 1_000_000);

          return { ...it, quantity: q } as CartItem;
        });

        setItems(sanitized);
        itemsRef.current = sanitized;
      }
    } catch {
      // ignore corrupted data
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items, hydrated]);

  const liveItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const itemCount = hydrated ? liveItemCount : initialItemCount;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalGst = items.reduce((sum, item) => sum + (item.taxPerUnit ?? 0) * item.quantity, 0);

  useEffect(() => {
    if (!hydrated) return;
    writeCountCookie(CART_COUNT_COOKIE, liveItemCount);
  }, [hydrated, liveItemCount]);

  useEffect(() => {
    if (!hydrated || items.length === 0) return;

    const candidates = items.filter((item) => {
      const missingWeight = item.weight == null || item.weight <= 0;
      return missingWeight && !!item.slug && !!item.variantId && !weightBackfillAttemptedRef.current.has(item.id);
    });

    if (candidates.length === 0) return;

    candidates.forEach((item) => weightBackfillAttemptedRef.current.add(item.id));

    let cancelled = false;

    void (async () => {
      const productCache = new Map<string, Awaited<ReturnType<typeof getProduct>>>();
      const resolved = await Promise.all(
        candidates.map(async (item) => {
          const slug = item.slug;
          const variantId = item.variantId;
          if (!slug || !variantId) return null;

          let product = productCache.get(slug);
          if (product === undefined) {
            product = await getProduct(slug);
            productCache.set(slug, product);
          }

          const variant = product?.variants.find((entry) => entry.id === variantId);
          if (variant?.weight == null || variant.weight <= 0) return null;

          const weightUnit = variant.weight_unit ?? item.weightUnit;
          if (!weightUnit) return null;

          return {
            id: item.id,
            weight: variant.weight,
            weightUnit,
          };
        })
      );

      if (cancelled) return;

      const updates = new Map(
        resolved
          .filter((entry): entry is { id: string; weight: number; weightUnit: string } => entry !== null)
          .map((entry) => [entry.id, entry])
      );

      if (updates.size === 0) return;

      setItems((current) => {
        let changed = false;
        const next = current.map((item) => {
          const update = updates.get(item.id);
          if (!update) return item;
          changed = true;
          return { ...item, weight: update.weight, weightUnit: update.weightUnit };
        });
        return changed ? next : current;
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, items]);

  const openCart  = useCallback(() => setIsOpen(true),  []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    // If an add for this item id is already in progress, ignore duplicate
    // calls to avoid accidental repeated increments (seen as huge totals).
    if (pendingAddsRef.current.has(newItem.id)) return;
    pendingAddsRef.current.add(newItem.id);

    // Use the functional updater so the existence check always reads the
    // latest state — prevents duplicate keys on rapid double-clicks.
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        const step = existing.step ?? 1;
        let candidateQty = existing.quantity + step;
        if (existing.totalAllowed && existing.totalAllowed > 0) candidateQty = Math.min(candidateQty, existing.totalAllowed);
        if (existing.stock != null) candidateQty = Math.min(candidateQty, existing.stock);
        return prev.map((i) => (i.id === newItem.id ? { ...i, quantity: candidateQty } : i));
      }

      // New item: set basic fields; step/totalAllowed/stock may be populated later
      const initialQty = newItem.minQty ?? 1;
      const itemToAdd: CartItem = {
        ...newItem,
        quantity: initialQty,
        step: (newItem as any).step ?? 1,
        totalAllowed: (newItem as any).totalAllowed ?? null,
        stock: (newItem as any).stock,
      };

      return [...prev, itemToAdd];
    });
    // Clear the pending marker soon after scheduling the update so future
    // legitimate adds are allowed. Using a microtask timeout keeps this
    // window short and avoids swallowing subsequent user actions.
    setTimeout(() => pendingAddsRef.current.delete(newItem.id), 50);

    // Server sync: use ref for best-effort (ref may be one render behind,
    // but that only affects the network call, not the local cart state).
    const existing = itemsRef.current.find((i) => i.id === newItem.id);
    if (existing) {
      const newQty = existing.quantity;
      if (existing.serverCartItemId) {
        serverCartUpdateQty(existing.serverCartItemId, newQty).then((ok) => {
          console.log(`[cart] updateQty serverCartItemId=${existing.serverCartItemId} qty=${newQty} ok=${ok}`);
        });
      }
    } else {
      const initialQty = newItem.minQty ?? 1;
      if (newItem.variantId && newItem.storeId) {
        console.log(`[cart] serverCartAdd variantId=${newItem.variantId} storeId=${newItem.storeId} qty=${initialQty}`);
        serverCartAdd(newItem.variantId, newItem.storeId, initialQty).then((serverCartItemId) => {
          console.log(`[cart] serverCartAdd result serverCartItemId=${serverCartItemId}`);
          if (serverCartItemId) {
            let latestQuantity = initialQty;

            setItems((current) =>
              current.map((i) => {
                if (i.id !== newItem.id) return i;
                latestQuantity = i.quantity;
                return { ...i, serverCartItemId };
              })
            );

            if (latestQuantity !== initialQty) {
              serverCartUpdateQty(serverCartItemId, latestQuantity).then((ok) => {
                if (!ok) {
                  console.warn(`[cart] post-add quantity sync failed for ${serverCartItemId}`);
                }
              });
            }
          }
        });

        // Try to populate policy fields from product if slug available
        if (newItem.slug) {
          void (async () => {
            try {
              const prod = await getProduct(newItem.slug!);
              if (!prod) return;
              const variant = prod.variants?.find((v) => v.id === newItem.variantId);
              setItems((current) =>
                current.map((i) => i.id === newItem.id ? {
                  ...i,
                  step: i.step ?? prod.policies?.quantity_step_size ?? 1,
                  minQty: i.minQty ?? prod.policies?.minimum_order_quantity ?? i.minQty,
                  totalAllowed: i.totalAllowed ?? (prod as any).policies?.total_allowed_quantity ?? null,
                  stock: i.stock ?? variant?.store_pricing?.[0]?.stock ?? i.stock,
                } : i)
              );
            } catch (err) {
              // ignore
            }
          })();
        }
      } else {
        console.warn(`[cart] skipping server add — missing variantId=${newItem.variantId} storeId=${newItem.storeId}`);
      }
    }
  }, []);

  const removeItem = useCallback((id: string) => {
    const item = itemsRef.current.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (item?.serverCartItemId) {
      serverCartRemove(item.serverCartItemId).then((ok) => {
        console.log(`[cart] remove serverCartItemId=${item.serverCartItemId} ok=${ok}`);
      });
    }
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const item = itemsRef.current.find((i) => i.id === id);
    if (!item) return;

    const min = item.minQty ?? 1;
    const step = item.step ?? 1;
    let q = Math.max(quantity, min);

    // Snap to step: allowed = min + n*step
    if (q > min && step > 0) {
      const delta = q - min;
      const n = Math.round(delta / step);
      q = min + n * step;
      if (q < min) q = min;
    }

    // Apply totalAllowed and stock caps
    if (item.totalAllowed && item.totalAllowed > 0) q = Math.min(q, item.totalAllowed);
    if (item.stock != null) q = Math.min(q, item.stock);

    // If quantity falls below min after snapping, remove item
    if (q < min) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (item.serverCartItemId) serverCartRemove(item.serverCartItemId);
      return;
    }

    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: q } : i));
    if (item.serverCartItemId) {
      serverCartUpdateQty(item.serverCartItemId, q).then((ok) => {
        if (!ok) console.warn(`[cart] server update failed for ${item.serverCartItemId}`);
      });
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    serverCartClear();
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        totalGst,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

const noop = () => {};

const fallbackCart: CartContextType = {
  items: [],
  itemCount: 0,
  total: 0,
  totalGst: 0,
  isOpen: false,
  openCart: noop,
  closeCart: noop,
  addItem: noop,
  removeItem: noop,
  updateQuantity: noop,
  clearCart: noop,
};

export function useCart() {
  const context = useContext(CartContext);
  return context ?? fallbackCart;
}
