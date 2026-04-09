/**
 * Analytics event helpers — GA4 (gtag) + Facebook Pixel (fbq)
 *
 * All functions are no-ops when the respective tracker is not loaded,
 * so they are safe to call unconditionally from client components.
 */

// Extend window with analytics globals injected by the script tags in layout.tsx
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?:  (...args: unknown[]) => void;
  }
}

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface AnalyticsItem {
  item_id:       string;
  item_name:     string;
  item_variant?: string;
  item_category?: string;
  price:         number;
  quantity:      number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ga(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

function fb(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
}

// ─── view_item / ViewContent ──────────────────────────────────────────────────

export function trackViewItem(params: {
  item_id:       string;
  item_name:     string;
  item_variant?: string;
  item_category?: string;
  price:         number;
  currency?:     string;
}) {
  const { item_id, item_name, item_variant, item_category, price, currency = "INR" } = params;

  ga("event", "view_item", {
    currency,
    value: price,
    items: [{ item_id, item_name, item_variant, item_category, price, quantity: 1 }],
  });

  fb("track", "ViewContent", {
    content_ids:  [item_id],
    content_name: item_name,
    content_type: "product",
    value:        price,
    currency,
  });
}

// ─── add_to_cart / AddToCart ──────────────────────────────────────────────────

export function trackAddToCart(params: {
  item_id:       string;
  item_name:     string;
  item_variant?: string;
  item_category?: string;
  price:         number;
  quantity:      number;
  currency?:     string;
}) {
  const { item_id, item_name, item_variant, item_category, price, quantity, currency = "INR" } = params;

  ga("event", "add_to_cart", {
    currency,
    value: price * quantity,
    items: [{ item_id, item_name, item_variant, item_category, price, quantity }],
  });

  fb("track", "AddToCart", {
    content_ids:  [item_id],
    content_name: item_name,
    content_type: "product",
    value:        price * quantity,
    currency,
  });
}

// ─── begin_checkout / InitiateCheckout ────────────────────────────────────────

export function trackBeginCheckout(params: {
  items:     AnalyticsItem[];
  value:     number;
  currency?: string;
}) {
  const { items, value, currency = "INR" } = params;

  ga("event", "begin_checkout", { currency, value, items });

  fb("track", "InitiateCheckout", {
    content_ids: items.map((i) => i.item_id),
    value,
    currency,
    num_items: items.reduce((sum, i) => sum + i.quantity, 0),
  });
}

// ─── purchase / Purchase ──────────────────────────────────────────────────────

export interface PurchaseEventData {
  transaction_id: string;
  value:          number;
  currency:       string;
  items:          AnalyticsItem[];
}

export const PURCHASE_STORAGE_KEY = "pethiyan_pending_purchase";

/**
 * Persist purchase data in sessionStorage so it can be fired on the
 * order-confirmed page (necessary for redirect-based payment methods).
 */
export function storePurchaseEvent(data: PurchaseEventData) {
  try {
    sessionStorage.setItem(PURCHASE_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage unavailable — ignore
  }
}

/**
 * Read purchase data from sessionStorage, fire the event, then clear storage.
 * Call this once on the order-confirmed page.
 */
export function flushPurchaseEvent() {
  try {
    const raw = sessionStorage.getItem(PURCHASE_STORAGE_KEY);
    if (!raw) return;
    sessionStorage.removeItem(PURCHASE_STORAGE_KEY);
    const data = JSON.parse(raw) as PurchaseEventData;
    trackPurchase(data);
  } catch {
    // Malformed data — ignore
  }
}

export function trackPurchase(params: PurchaseEventData) {
  const { transaction_id, value, currency = "INR", items } = params;

  ga("event", "purchase", { transaction_id, currency, value, items });

  fb("track", "Purchase", {
    content_ids:  items.map((i) => i.item_id),
    value,
    currency,
    content_type: "product",
    num_items:    items.reduce((sum, i) => sum + i.quantity, 0),
  });
}
