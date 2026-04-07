"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { serverCartAdd, serverCartUpdateQty, serverCartRemove, serverCartClear } from "@/lib/api";

export interface CartItem {
  id: string;               // unique key, e.g. "42-v15" (productId-variantId)
  productId?: number;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  slug?: string;
  variantId?: number;
  variantLabel?: string;
  minQty?: number;
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Keep a ref always in sync with current items so callbacks can read
  // current state without stale closures
  const itemsRef = useRef<CartItem[]>([]);
  useEffect(() => { itemsRef.current = items; }, [items]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CartItem[];
        setItems(parsed);
        itemsRef.current = parsed;
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

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const openCart  = useCallback(() => setIsOpen(true),  []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    // Use the functional updater so the existence check always reads the
    // latest state — prevents duplicate keys on rapid double-clicks.
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id ? { ...i, quantity: existing.quantity + 1 } : i
        );
      }
      return [...prev, { ...newItem, quantity: newItem.minQty ?? 1 }];
    });

    // Server sync: use ref for best-effort (ref may be one render behind,
    // but that only affects the network call, not the local cart state).
    const existing = itemsRef.current.find((i) => i.id === newItem.id);
    if (existing) {
      const newQty = existing.quantity + 1;
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
            setItems((current) =>
              current.map((i) => i.id === newItem.id ? { ...i, serverCartItemId } : i)
            );
          }
        });
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
    const min = item?.minQty ?? 1;

    if (quantity < min) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (item?.serverCartItemId) {
        serverCartRemove(item.serverCartItemId);
      }
      return;
    }

    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
    if (item?.serverCartItemId) {
      serverCartUpdateQty(item.serverCartItemId, quantity);
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
