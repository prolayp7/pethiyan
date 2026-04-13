"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { getWishlistItems } from "@/lib/api";
import { WISHLIST_COUNT_COOKIE, writeCountCookie } from "@/lib/count-preferences";

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
  add: (item: WishlistItem) => void;
  toggle: (item: WishlistItem) => void;
  remove: (id: number) => void;
  clear: () => void;
  count: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LS_KEY = "wishlist";

// ─── Context ──────────────────────────────────────────────────────────────────

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  isWishlisted: () => false,
  add: () => {},
  toggle: () => {},
  remove: () => {},
  clear: () => {},
  count: 0,
});

export function WishlistProvider({
  children,
  initialCount = 0,
}: {
  children: React.ReactNode;
  initialCount?: number;
}) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { isLoggedIn, token } = useAuth();

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      localStorage.removeItem(LS_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!hydrated) return;
    writeCountCookie(WISHLIST_COUNT_COOKIE, items.length);
  }, [hydrated, items.length]);

  // Sync count from backend for robust cross-session/device accuracy.
  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!isLoggedIn || !token) {
        return;
      }

      const rows = await getWishlistItems();
      if (!active) return;
      const dedupByProduct = new Map<number, WishlistItem>();
      rows.forEach((row) => {
        if (!row.product) return;
        if (dedupByProduct.has(row.product.id)) return;
        dedupByProduct.set(row.product.id, {
          id: row.product.id,
          name: row.product.title,
          slug: row.product.slug,
          image: row.product.image ?? null,
          price: Number(row.variant?.special_price ?? row.variant?.price ?? 0),
        });
      });
      setItems(Array.from(dedupByProduct.values()));
    };

    void run();
    return () => {
      active = false;
    };
  }, [isLoggedIn, token]);

  const isWishlisted = useCallback(
    (id: number) => items.some((i) => i.id === id),
    [items]
  );

  const add = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const toggle = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item];
    });
  }, []);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const count = hydrated ? items.length : initialCount;

  return (
    <WishlistContext.Provider
      value={{ items, isWishlisted, add, toggle, remove, clear, count }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
