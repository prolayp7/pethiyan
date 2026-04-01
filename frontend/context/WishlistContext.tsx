"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  price: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  isWishlisted: (id: number) => boolean;
  toggle: (item: WishlistItem) => void;
  remove: (id: number) => void;
  clear: () => void;
  count: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LS_KEY = "wishlist";

// ─── Context ──────────────────────────────────────────────────────────────────

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      localStorage.removeItem(LS_KEY);
    }
  }, []);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  const isWishlisted = useCallback(
    (id: number) => items.some((i) => i.id === id),
    [items]
  );

  const toggle = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item];
    });
  }, []);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return (
    <WishlistContext.Provider
      value={{ items, isWishlisted, toggle, remove, clear, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
