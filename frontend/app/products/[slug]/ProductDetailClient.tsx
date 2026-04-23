"use client";

import { useState, useEffect, useMemo, useCallback, type CSSProperties } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  RotateCcw,
  Shield,
  FileText,
  Minus,
  Plus,
  Package,
  ChevronDown,
  ChevronUp,
  User,
  MessageSquare,
  ZoomIn,
  Play,
  CheckCircle2,
  AlertCircle,
  Info,
  Palette,
  Trash2,
  Globe,
  MapPin,
} from "lucide-react";
import Container from "@/components/layout/Container";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  toNum,
  type ApiReview,
  type ApiFaq,
  type RealApiProduct,
  type RealApiStorePricing,
  type RealApiVariant,
  selectPrimaryStorePricing,
  resolveStorePricingDisplay,
  addToWishlist,
  getWishlistItems,
  removeWishlistItem,
  getProductReviews,
  getAvailableOrderItemsForProduct,
  submitReview,
  getProductFaqs,
  getAddresses,
} from "@/lib/api";
import { trackViewItem, trackAddToCart } from "@/lib/analytics";
import { recordBrowsingHistory } from "@/lib/api";
import { pushRecentlyViewedId } from "@/lib/recently-viewed";
import { pushBrowsingHistory } from "@/lib/browsingHistory";
import ReviewForm from "./ReviewForm";
import { toDisplayTitleCase } from "@/lib/text";
import { resolveProductSeo, resolveVariantSeo } from "@/lib/seo";

function formatCurrency(amount: number | null | undefined, symbol = "₹"): string {
  const value = toNum(amount);
  return `${symbol}${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  values.forEach((value) => {
    const v = (value ?? "").trim();
    if (!v || seen.has(v)) return;
    seen.add(v);
    out.push(v);
  });
  return out;
}

function isVideoLink(url?: string | null): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}

function shouldBypassOptimizer(src?: string | null): boolean {
  if (!src) return false;
  return /^https?:\/\//i.test(src);
}

function colorSwatchStyle(color: string): CSSProperties {
  const normalized = color.trim().toLowerCase();
  const palette: Record<string, string> = {
    transparent: "#b8ddea",
    brown: "#8b6242",
    red: "#ef4444",
    blue: "#2563eb",
    green: "#22c55e",
    yellow: "#f59e0b",
    black: "#111827",
    white: "#f8fafc",
    orange: "#f97316",
    purple: "#7c3aed",
    pink: "#ec4899",
    grey: "#9ca3af",
    gray: "#9ca3af",
    "light gray": "#d1d5db",
    "light grey": "#d1d5db",
    "dark gray": "#374151",
    "dark grey": "#374151",
    silver: "#c0c0c0",
    gold: "#d4af37",
    navy: "#1e3a5f",
    maroon: "#800000",
    beige: "#e8dcc8",
  };

  if (normalized === "colorful" || normalized === "multicolor" || normalized === "multi color") {
    return { background: "conic-gradient(#0ea5e9, #22c55e, #eab308, #ef4444, #8b5cf6, #0ea5e9)" };
  }

  return { background: palette[normalized] ?? "#94a3b8" };
}

function upsertMetaTag(attribute: "name" | "property", key: string, content?: string) {
  if (typeof document === "undefined") return;
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
  const value = content?.trim();

  if (!value) {
    tag?.remove();
    return;
  }

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", value);
}

function upsertCanonicalLink(href: string) {
  if (typeof document === "undefined") return;
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}


function Gallery({
  images,
  name,
  videoUrl,
}: {
  images: string[];
  name: string;
  videoUrl?: string | null;
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  const allThumbs = [
    ...images.map((src) => ({ type: "image" as const, src })),
    ...(videoUrl && isVideoLink(videoUrl) ? [{ type: "video" as const, src: videoUrl }] : []),
  ];

  const isVideo = allThumbs[active]?.type === "video";

  if (images.length === 0 && !videoUrl) {
    return (
      <div className="aspect-square rounded-2xl bg-linear-to-br from-(--color-primary)/10 to-(--color-primary-light) flex items-center justify-center border border-(--color-border)">
        <Package className="h-24 w-24 text-(--color-primary)/20" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-(--color-border) cursor-zoom-in group"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => { setZoomed(false); setOrigin("50% 50%"); }}
        onMouseMove={handleMouseMove}
      >
        {isVideo ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <video src={allThumbs[active].src} controls className="max-h-full max-w-full" />
          </div>
        ) : (
          <>
            <Image
              src={images[active] ?? images[0]}
              alt={`${name} — image ${active + 1}`}
              fill
              className="object-contain transition-transform duration-200"
              style={{
                transformOrigin: origin,
                transform: zoomed ? "scale(2.2)" : "scale(1)",
              }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              unoptimized={shouldBypassOptimizer(images[active] ?? images[0])}
            />
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/50 text-white rounded-full p-1.5">
                <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
            </div>
          </>
        )}
      </div>

      {allThumbs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Product images">
          {allThumbs.map((thumb, i) => (
            <button
              key={`${thumb.type}-${thumb.src}-${i}`}
              onClick={() => setActive(i)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                active === i
                  ? "border-(--color-primary) shadow-md"
                  : "border-(--color-border) hover:border-(--color-primary)/50"
              }`}
              aria-label={thumb.type === "video" ? "Product video" : `Image ${i + 1}`}
              aria-pressed={active === i}
            >
              {thumb.type === "video" ? (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <Play className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
              ) : (
                <Image
                  src={thumb.src}
                  alt={`${name} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                  unoptimized={shouldBypassOptimizer(thumb.src)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const cls = size === "lg" ? "h-5 w-5" : size === "md" ? "h-4 w-4" : "h-3 w-3";
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${cls} ${
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i < rating
              ? "fill-amber-200 text-amber-400"
              : "text-gray-200"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function ReviewsTab({ reviews, rating }: { reviews: ApiReview[]; rating: number }) {
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));
  const maxCount = Math.max(...dist.map((d) => d.count), 1);

  return (
    <div>
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-8 mb-8 p-6 bg-(--color-muted) rounded-2xl">
          <div className="text-center shrink-0">
            <p className="text-5xl font-extrabold text-(--color-primary)">{rating.toFixed(1)}</p>
            <StarRating rating={rating} size="md" />
            <p className="text-xs text-gray-500 mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {dist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-3">{star}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" aria-hidden="true" />
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${(count / maxCount) * 100}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center text-gray-400">
          <MessageSquare className="h-10 w-10 mb-3 opacity-30" aria-hidden="true" />
          <p className="font-medium">No reviews yet</p>
          <p className="text-sm mt-1">Be the first to review this product</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((r) => (
            <div key={r.id} className="flex gap-4 pb-6 border-b border-(--color-border) last:border-0">
              <div className="shrink-0 w-9 h-9 rounded-full bg-(--color-primary)/10 flex items-center justify-center">
                <User className="h-4 w-4 text-(--color-primary)" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-(--color-secondary)">{r.user?.name ?? "Verified Buyer"}</span>
                  <StarRating rating={r.rating} />
                  <span className="text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FaqsTab({ faqs }: { faqs: ApiFaq[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (faqs.length === 0) {
    return <p className="text-center text-gray-400 py-12 text-sm">No FAQs for this product.</p>;
  }

  return (
    <div className="space-y-2">
      {faqs.map((faq) => {
        const isOpen = open === faq.id;
        return (
          <div key={faq.id} className="border border-(--color-border) rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : faq.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-(--color-muted) transition-colors"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-(--color-secondary) pr-4">{faq.question}</span>
              {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />}
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-(--color-border) pt-4">{faq.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface ProductDetailClientProps {
  product: RealApiProduct;
  reviews: ApiReview[];
  faqs: ApiFaq[];
  initialVariantSlug?: string;
}

export default function ProductDetailClient({ product, reviews: initialReviews, faqs: initialFaqs, initialVariantSlug }: ProductDetailClientProps) {
  const { addItem, openCart, items, updateQuantity } = useCart();
  const { isLoggedIn } = useAuth();
  const { isWishlisted, add, remove } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();

  const [reviews, setReviews] = useState<ApiReview[]>(initialReviews ?? []);
  const [faqs, setFaqs] = useState<ApiFaq[]>(initialFaqs ?? []);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [qty, setQty] = useState(Math.max(product.policies?.minimum_order_quantity ?? 1, 1));
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews" | "faqs">("description");
  const [customerStateName, setCustomerStateName] = useState<string | null>(null);

  const productName = product.title ?? "Product";
  const variantList = useMemo(() => product.variants ?? [], [product.variants]);

  // Render the selected variant first in the UI so it stays visible.
  // Use `selectedVariantId` here to avoid referencing `selectedVariant`
  // before it's declared.
  const displayVariantList = useMemo(() => {
    if (selectedVariantId == null) return variantList;
    const sel = variantList.find((v) => v.id === selectedVariantId);
    if (!sel) return variantList;
    return [sel, ...variantList.filter((v) => v.id !== selectedVariantId)];
  }, [variantList, selectedVariantId]);

  // Initialise selected variant from URL slug (variant page pre-selection)
  useEffect(() => {
    if (!initialVariantSlug) return;
    const match = variantList.find((v) => v.slug === initialVariantSlug);
    if (match) setSelectedVariantId(match.id);
  }, [initialVariantSlug, variantList]);

  const navigateToVariant = useCallback((variant: RealApiVariant) => {
    setSelectedVariantId(variant.id);
  }, []);

  useEffect(() => {
    if (initialReviews.length === 0) {
      getProductReviews(product.slug).then((data) => setReviews(data));
    }
    if (initialFaqs.length === 0) {
      getProductFaqs(product.slug).then((data) => setFaqs(data));
    }
  }, [product.slug, initialReviews.length, initialFaqs.length]);

  // Detect delivery state: saved address (logged in) → geolocation fallback
  useEffect(() => {
    let cancelled = false;

    async function detectDeliveryState() {
      // 1. Try saved address when logged in
      if (isLoggedIn) {
        try {
          const addresses = await getAddresses();
          const addr = addresses.find((a) => a.is_default) ?? addresses[0];
          if (addr?.state && !cancelled) {
            setCustomerStateName(addr.state);
            return;
          }
        } catch {
          // fall through to geolocation
        }
      }

      // 2. Geolocation fallback (silent — no error shown if denied)
      if (!("geolocation" in navigator)) return;
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (cancelled) return;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
              { headers: { "Accept-Language": "en" } }
            );
            const data = (await res.json()) as { address?: { state?: string } };
            const stateName = data?.address?.state;
            if (stateName && !cancelled) setCustomerStateName(stateName);
          } catch {
            // silently ignore reverse-geocode failures
          }
        },
        () => { /* permission denied — silently skip */ }
      );
    }

    detectDeliveryState();
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  // Single memo resolves both "which variant is selected" and "what is its id".
  // Keeping it as one memo avoids the chained-memo TDZ that Turbopack flags.
  const selectedVariant = useMemo<RealApiVariant | undefined>(() => {
    if (variantList.length === 0) return undefined;
    if (selectedVariantId) {
      const match = variantList.find((v) => v.id === selectedVariantId);
      if (match) return match;
    }
    return variantList.find((v) => v.is_default) ?? variantList[0];
  }, [selectedVariantId, variantList]);

  const selectedSeo = useMemo(
    () => (selectedVariant ? resolveVariantSeo(product, selectedVariant) : resolveProductSeo(product)),
    [product, selectedVariant],
  );

  const selectedPath = useMemo(() => {
    if (selectedVariantId == null) {
      return `/products/${product.slug}`;
    }

    if (selectedVariant?.slug) {
      return `/products/${product.slug}/${selectedVariant.slug}`;
    }

    return `/products/${product.slug}`;
  }, [product.slug, selectedVariant, selectedVariantId]);

  // Fire view_item whenever the selected variant changes (initial load + variant switch).
  useEffect(() => {
    if (!selectedVariant) return;
    const price = resolveStorePricingDisplay(selectPrimaryStorePricing(selectedVariant.store_pricing)).mainPrice;
    trackViewItem({
      item_id:       String(product.id),
      item_name:     product.title,
      item_variant:  selectedVariant.title,
      item_category: (product as unknown as { category?: { title: string } | null }).category?.title,
      price,
    });
    pushRecentlyViewedId(product.id);
    pushBrowsingHistory(product.slug, product.id);
    recordBrowsingHistory(product.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariant]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selectedVariantId == null) return;

    const nextUrl = new URL(selectedPath, window.location.origin);
    const currentPathWithQuery = `${window.location.pathname}${window.location.search}`;
    const nextPathWithQuery = `${nextUrl.pathname}${window.location.search}`;

    if (currentPathWithQuery !== nextPathWithQuery) {
      window.history.replaceState(window.history.state, "", nextPathWithQuery);
    }

    document.title = /pethiyan/i.test(selectedSeo.title)
      ? selectedSeo.title
      : `${selectedSeo.title} | Pethiyan`;
    upsertCanonicalLink(nextUrl.toString());
    upsertMetaTag("name", "description", selectedSeo.description);
    upsertMetaTag("name", "keywords", selectedSeo.keywords);
    upsertMetaTag("name", "robots", selectedSeo.indexable ? "index,follow" : "noindex,nofollow");
    upsertMetaTag("property", "og:title", selectedSeo.openGraphTitle);
    upsertMetaTag("property", "og:description", selectedSeo.openGraphDescription);
    upsertMetaTag("property", "og:url", nextUrl.toString());
    upsertMetaTag("property", "og:image", selectedSeo.openGraphImage);
    upsertMetaTag("name", "twitter:title", selectedSeo.twitterTitle);
    upsertMetaTag("name", "twitter:description", selectedSeo.twitterDescription);
    upsertMetaTag("name", "twitter:image", selectedSeo.twitterImage);
    upsertMetaTag("name", "twitter:card", selectedSeo.twitterCard);
  }, [selectedPath, selectedSeo, selectedVariant, selectedVariantId]);

  const selectedVariantStorePricing = useMemo(
    () => selectedVariant?.store_pricing ?? [],
    [selectedVariant]
  );

  const selectedStoreIdSafe = useMemo(() => {
    if (selectedVariantStorePricing.length === 0) return null;
    const firstInStock = selectedVariantStorePricing.find((s) => s.stock_status === "in_stock" && s.stock > 0);
    return firstInStock?.store_id ?? selectedVariantStorePricing[0].store_id;
  }, [selectedVariantStorePricing]);

  const selectedStorePricing: RealApiStorePricing | undefined = useMemo(() => {
    if (!selectedStoreIdSafe) return selectedVariantStorePricing[0];
    return selectedVariantStorePricing.find((s) => s.store_id === selectedStoreIdSafe) ?? selectedVariantStorePricing[0];
  }, [selectedVariantStorePricing, selectedStoreIdSafe]);

  // Keep product page quantity in sync with cart: when the same variant+store
  // exists in cart, reflect its quantity on the product page so updates from
  // the cart drawer are visible here.
  useEffect(() => {
    if (!selectedVariant || !selectedStoreIdSafe) return;
    const itemId = `${product.id}-${selectedVariant.id}-${selectedStoreIdSafe}`;
    const match = items.find((it) => it.id === itemId);
    if (match && typeof match.quantity === "number") {
      setQty(match.quantity);
    }
  }, [items, selectedVariant, selectedStoreIdSafe, product.id]);

  const colorOptions = useMemo(() => {
    const map = new Map<string, number>();
    variantList.forEach((variant) => {
      const color = variant.attributes?.color;
      if (color && !map.has(color)) map.set(color, variant.id);
    });
    return Array.from(map.entries()).map(([color, variantId]) => ({ color, variantId }));
  }, [variantList]);

  // Collect all attributes available across variants (case-insensitive keying)
  const attributeGroups = useMemo(() => {
    const m = new Map<string, { displayKey: string; values: Map<string, number> }>();
    variantList.forEach((variant) => {
      const attrs = variant.attributes ?? {};
      Object.entries(attrs).forEach(([k, v]) => {
        const keyNorm = k.trim().toLowerCase();
        if (!m.has(keyNorm)) m.set(keyNorm, { displayKey: k.trim(), values: new Map() });
        const entry = m.get(keyNorm)!;
        if (v && !entry.values.has(v)) entry.values.set(v, variant.id);
      });
    });
    return Array.from(m.entries()).map(([key, { displayKey, values }]) => ({
      key,
      displayKey,
      values: Array.from(values.entries()).map(([value, variantId]) => ({ value, variantId })),
    }));
  }, [variantList]);

  function getAttributeValue(variant?: RealApiVariant | undefined, keyNorm?: string) {
    if (!variant || !keyNorm) return undefined;
    const attrs = variant.attributes ?? {};
    const found = Object.entries(attrs).find(([k]) => k.trim().toLowerCase() === keyNorm);
    return found ? found[1] : undefined;
  }

  const galleryImages = useMemo(() => {
    return uniqueStrings([
      selectedVariant?.image,
      product.images?.main_image,
      ...(product.images?.additional_images ?? []),
      ...(product.images?.variant_images ?? []),
      ...(product.images?.all ?? []),
    ]);
  }, [selectedVariant, product.images]);

  const pricingDisplay = useMemo(
    () => resolveStorePricingDisplay(selectedStorePricing),
    [selectedStorePricing]
  );
  const effectivePrice = pricingDisplay.mainPrice;
  const basePrice = pricingDisplay.comparePrice;
  const hasDiscount = pricingDisplay.hasDiscount;
  const discount = pricingDisplay.discountPercent;

  const stockQty = selectedStorePricing?.stock ?? 0;
  const inStock = (selectedStorePricing?.stock_status === "in_stock") && stockQty > 0;
  const lowStock = inStock && stockQty <= 10;

  const currencySymbol = product.currency?.symbol ?? "₹";

  const moq = Math.max(product.policies?.minimum_order_quantity ?? 1, 1);
  const stepSize = Math.max(product.policies?.quantity_step_size ?? 1, 1);

  const qtySafe = Math.max(qty, moq);

  const rating = 0;
  const reviewCount = reviews.length;

  // Review submission state
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewPendingMessage, setReviewPendingMessage] = useState<string | null>(null);

  const specs: Array<{ key: string; value: string }> = [
    { key: "Product Type", value: product.type },
    { key: "HSN Code", value: product.tax?.hsn_code || "-" },
    { key: "GST Rate", value: product.tax?.gst_rate ? `${product.tax.gst_rate}%` : "-" },
    { key: "Tax Group", value: (product.tax?.tax_groups ?? []).join(", ") || "-" },
    { key: "Made In", value: product.features?.made_in || "-" },
    { key: "Warranty", value: product.features?.warranty_period || "-" },
    { key: "Guarantee", value: product.features?.guarantee_period || "-" },
    { key: "MOQ", value: String(moq) },
    { key: "Quantity Step", value: String(stepSize) },
    { key: "Returnable", value: product.policies?.is_returnable ? "Yes" : "No" },
    { key: "Cancelable", value: product.policies?.is_cancelable ? "Yes" : "No" },
    { key: "Requires OTP", value: product.policies?.requires_otp ? "Yes" : "No" },
    { key: "Variant Barcode", value: selectedVariant?.barcode || "-" },
    { key: "Weight", value: selectedVariant?.weight != null ? `${selectedVariant.weight} ${selectedVariant.weight_unit}` : "-" },
    { key: "Height", value: selectedVariant?.height != null ? `${selectedVariant.height} ${selectedVariant.height_unit}` : "-" },
    { key: "Breadth", value: selectedVariant?.breadth != null ? `${selectedVariant.breadth} ${selectedVariant.breadth_unit}` : "-" },
    { key: "Length", value: selectedVariant?.length != null ? `${selectedVariant.length} ${selectedVariant.length_unit}` : "-" },
    { key: "Capacity", value: selectedVariant?.capacity != null ? `${selectedVariant.capacity} ${selectedVariant.capacity_unit}` : "-" },
  ];

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedStorePricing || !inStock) return;

    const itemId = `${product.id}-${selectedVariant.id}-${selectedStorePricing.store_id}`;
    const safeQty = qtySafe;
    const existsInCart = items.some((item) => item.id === itemId);
    // Add once, then set the desired total quantity explicitly. The previous
    // approach called addItem in a loop which repeatedly incremented by the
    // step causing large incorrect totals (e.g. 1000). Instead add a single
    // entry and update its quantity to the selected value on the next tick.
    addItem({
      id: itemId,
      productId: product.id,
      slug: product.slug,
      variantId: selectedVariant.id,
      variantLabel: selectedVariant.title,
      minQty: moq,
      step: stepSize,
      totalAllowed: product.policies?.total_allowed_quantity ?? null,
      stock: selectedStorePricing?.stock ?? undefined,
      name: selectedVariant.title || productName,
      price: effectivePrice,
      taxPerUnit: selectedStorePricing?.gst?.total_tax_amount ?? 0,
      image: selectedVariant.image || product.images?.main_image || null,
      currencySymbol,
      weight: selectedVariant.weight ?? undefined,
      weightUnit: selectedVariant.weight_unit ?? undefined,
      storeId: selectedStoreIdSafe ?? undefined,
    });

    // Ensure cart quantity reflects the selected qty. Use a microtask so the
    // item exists in state before updating quantity.
    setTimeout(() => {
      try { updateQuantity(itemId, safeQty); } catch (e) { /* silent */ }
    }, 0);

    trackAddToCart({
      item_id:      String(product.id),
      item_name:    selectedVariant.title || productName,
      item_variant: selectedVariant.title,
      item_category: (product as unknown as { category?: { title: string } | null }).category?.title,
      price:        effectivePrice,
      quantity:     safeQty,
    });

    setAddedToCart(true);
    openCart();
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const tabs = [
    { key: "description" as const, label: "Description" },
    { key: "specs" as const, label: "Specifications" },
    { key: "reviews" as const, label: `Reviews (${reviewCount})` },
    { key: "faqs" as const, label: `FAQs (${faqs.length})` },
  ];

  const tags = product.tags ?? [];
  const displayTitle = toDisplayTitleCase(selectedVariant?.title?.trim() || productName);
  const wishlisted = isWishlisted(product.id);

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      const redirectPath =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : pathname || `/products/${product.slug}`;
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }
    if (wishlistBusy) return;

    if (wishlisted) {
      setWishlistBusy(true);
      try {
        const rows = await getWishlistItems();
        const matches = rows.filter((row) => row.product?.id === product.id);
        if (matches.length === 0) {
          remove(product.id);
          toast.success("Removed from wishlist");
          return;
        }

        let removedAny = false;
        for (const row of matches) {
          const res = await removeWishlistItem(row.id);
          if (res.success) removedAny = true;
        }

        if (removedAny) {
          remove(product.id);
          toast.success("Removed from wishlist");
        } else {
          toast.error("Failed to remove wishlist item");
        }
      } finally {
        setWishlistBusy(false);
      }
      return;
    }

    if (!selectedStoreIdSafe) {
      toast.error("Please select a store before adding to wishlist.");
      return;
    }
    if (!selectedVariant?.id) {
      toast.error("Please select a variant before adding to wishlist.");
      return;
    }
    setWishlistBusy(true);
    const res = await addToWishlist({
      wishlist_title: "Favorite",
      product_id: product.id,
      product_variant_id: selectedVariant.id,
      store_id: selectedStoreIdSafe,
    });
    setWishlistBusy(false);

    if (res.success) {
      add({
        id: product.id,
        name: displayTitle,
        slug: product.slug,
        image: selectedVariant.image || product.images?.main_image || null,
        price: effectivePrice,
      });
      toast.success(res.message || "Added to wishlist");
      return;
    }

    // API may return duplicate item with success=false. Keep UI in sync as wishlisted.
    if ((res.message || "").toLowerCase().includes("already")) {
      add({
        id: product.id,
        name: displayTitle,
        slug: product.slug,
        image: selectedVariant.image || product.images?.main_image || null,
        price: effectivePrice,
      });
      toast("Already in wishlist", { icon: "❤️" });
      return;
    }

    toast.error(res.message || "Failed to add wishlist item");
  };

  return (
    <Container>
      <div className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 md:items-start">
          <div className="flex flex-col gap-6">
            <Gallery
              key={`gallery-${selectedVariant?.id ?? "base"}`}
              images={galleryImages}
              name={productName}
              videoUrl={isVideoLink(product.video?.video_link) ? product.video?.video_link : null}
            />
            {/* Variant selector moved under gallery (compact square boxes) */}
            {variantList.length > 1 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-(--color-secondary) mb-2">Variants</p>
                <div className="grid grid-cols-5 gap-2 max-h-[220px] overflow-y-auto">
                  {displayVariantList.map((variant) => {
                    const selected = selectedVariant?.id === variant.id;
                    const attrLabel = Object.entries(variant.attributes ?? {}).map(([k, v]) => `${k}: ${v}`).join(" | ");
                    const sizeKeys = [
                      "pouch-size",
                      "pouchsize",
                      "size",
                      "size_label",
                      "pack_size",
                      "pack-size",
                      "dimensions",
                      "measurement",
                      "pouch_size",
                    ];
                    let variantSize: string | undefined;
                    for (const k of sizeKeys) {
                      const v = getAttributeValue(variant, k);
                      if (v) { variantSize = String(v); break; }
                    }
                    if (!variantSize) {
                      const m = String(variant.title ?? "").match(/\b\d+(?:\s*[x×]\s*\d+){0,2}\b/i);
                      if (m) variantSize = m[0];
                    }
                    const variantImage = variant.image || product.images?.main_image;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => navigateToVariant(variant)}
                        aria-pressed={selected}
                        title={attrLabel}
                        className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all text-center min-w-[56px] ${
                          selected
                            ? "btn-brand border-2 border-(--color-primary) shadow-md"
                            : "bg-white text-(--color-secondary) border border-(--color-border) hover:shadow-sm"
                        }`}
                      >
                        {variantImage ? (
                          <div className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 ${selected ? "ring-2 ring-(--color-primary)" : ""}`}>
                            <Image
                              src={variantImage}
                              alt={variant.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                              unoptimized={shouldBypassOptimizer(variantImage)}
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <Package className="h-5 w-5 text-gray-300" aria-hidden="true" />
                          </div>
                        )}
                        <div className={`text-xs font-semibold leading-snug line-clamp-2 w-14 ${selected ? "text-white" : "text-(--color-secondary)"}`}>{toDisplayTitleCase(variant.title)}</div>
                        {variantSize ? <div className={`text-[10px] ${selected ? "text-white/80" : "text-gray-400"}`}>{variantSize}</div> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center flex-wrap gap-2 mb-3">
              <span className="text-xs font-semibold text-(--color-primary) bg-(--color-primary)/10 px-2.5 py-1 rounded-full">
                {product.type === "variant" ? "Variant Product" : "Simple Product"}
              </span>
              {product.featured === "1" && (
                <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">Featured</span>
              )}
              {product.status && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full capitalize">{product.status}</span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                <Globe className="h-3 w-3" aria-hidden="true" />
                Pan India Delivery
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-(--color-secondary) leading-tight">{displayTitle}</h2>

            <div className="flex items-center gap-2 mt-3">
              <StarRating rating={rating} size="md" />
              <span className="text-sm text-gray-500">{reviewCount} review{reviewCount !== 1 ? "s" : ""}</span>
            </div>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-extrabold text-(--color-primary)">{formatCurrency(effectivePrice, currencySymbol)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatCurrency(basePrice, currencySymbol)}</span>
                  <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Save {discount}%</span>
                </>
              )}
            </div>
            <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
              <p className="text-[11px] text-gray-400">GST excluded price shown. GST invoice available.</p>
              {customerStateName && (
                <span className="inline-flex items-center gap-0.5 text-[11px] text-blue-600">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  Delivering to {customerStateName}
                </span>
              )}
            </div>

            {product.short_description && <p className="mt-4 text-gray-600 text-sm leading-relaxed">{product.short_description}</p>}

            <div className="mt-3">
              {!inStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  Out of Stock
                </span>
              ) : lowStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                  <Info className="h-3.5 w-3.5" aria-hidden="true" />
                  Only {stockQty} left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  In Stock
                </span>
              )}
            </div>

            {/* product variants moved to left column */}

            {attributeGroups.length > 0 && (
              <div className="mt-5">
                {attributeGroups.map((group) => {
                  // Only render attribute groups that exist on the currently
                  // selected variant. Some variants (e.g. particular pouch
                  // sizes) may not have a `color` attribute — hide the group
                  // when the selected variant lacks that attribute.
                  const selectedAttrValue = getAttributeValue(selectedVariant, group.key);
                  if (selectedAttrValue == null || String(selectedAttrValue).trim() === "") return null;

                  const selectedValue = selectedAttrValue;
                  const isColorGroup = group.key.includes("color") || group.displayKey.toLowerCase().includes("color");
                  return (
                    <div key={group.key} className="mb-4">
                      <p className="text-sm font-semibold text-(--color-secondary) mb-2 flex items-center gap-2">
                        {isColorGroup ? <Palette className="h-4 w-4" /> : null}
                        {toDisplayTitleCase(group.displayKey)}
                      </p>
                      <p className="text-2xl font-bold text-(--color-secondary) mb-3">
                        {toDisplayTitleCase(group.displayKey)}: {toDisplayTitleCase(selectedValue)}
                      </p>

                      <div className="flex flex-wrap items-center gap-2.5">
                        {group.values.map((opt) => {
                          const selected = selectedVariant?.id === opt.variantId;
                          const handleClick = () => {
                            const v = variantList.find((vr) => vr.id === opt.variantId);
                            if (v) navigateToVariant(v);
                          };

                          if (isColorGroup) {
                            return (
                              <button
                                key={`${opt.value}-${opt.variantId}`}
                                onClick={handleClick}
                                className={`h-10 w-10 rounded-full border-2 transition-all ${
                                  selected
                                    ? "border-white shadow-[0_0_0_3px_#17396f,_0_0_0_5px_#49ad57]"
                                    : "border-(--color-border) hover:border-(--color-primary)/60"
                                }`}
                                style={colorSwatchStyle(opt.value)}
                                aria-pressed={selected}
                                aria-label={`Select ${toDisplayTitleCase(group.displayKey)} ${toDisplayTitleCase(opt.value)}`}
                                title={toDisplayTitleCase(opt.value)}
                              >
                                <span className="sr-only">{toDisplayTitleCase(opt.value)}</span>
                              </button>
                            );
                          }

                          return (
                            <button
                              key={`${opt.value}-${opt.variantId}`}
                              onClick={handleClick}
                              className={`px-3 py-2 min-w-[88px] text-center rounded-xl border transition-colors text-sm ${selected ? "btn-brand text-white" : "border-(--color-border) hover:border-(--color-primary)/60 text-(--color-secondary)"}`}
                              aria-pressed={selected}
                            >
                              {toDisplayTitleCase(opt.value)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}


            {moq > 1 && (
              <p className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Minimum order quantity: <strong>{moq} units</strong>. Step size: <strong>{stepSize}</strong>
              </p>
            )}

            <hr className="my-5 border-(--color-border)" />

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-(--color-border) rounded-xl overflow-hidden bg-white" aria-label="Quantity selector">
                <button
                  onClick={() => setQty((q) => Math.max(moq, Math.max(q, moq) - stepSize))}
                  disabled={qtySafe <= moq}
                  className="w-10 h-11 flex items-center justify-center hover:bg-(--color-muted) transition-colors disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <span className="w-10 text-center text-sm font-semibold tabular-nums">{qtySafe}</span>
                <button
                  onClick={() => setQty((q) => {
                    const next = Math.max(q, moq) + stepSize;
                    if (!selectedStorePricing) return next;
                    return Math.min(selectedStorePricing.stock, next);
                  })}
                  disabled={!!selectedStorePricing && qtySafe >= selectedStorePricing.stock}
                  className="w-10 h-11 flex items-center justify-center hover:bg-(--color-muted) transition-colors disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock || !selectedVariant || !selectedStorePricing}
                className={`flex-1 min-w-[160px] h-12 px-6 flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-300 ${
                  addedToCart
                    ? "bg-green-500 text-white scale-95"
                    : !inStock
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "btn-brand hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0"
                }`}
                aria-label={addedToCart ? "Added to cart" : `Add ${productName} to cart`}
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                {addedToCart ? "Added to Cart!" : "Add to Cart"}
              </button>

              <button
                onClick={handleWishlist}
                disabled={wishlistBusy}
                className="group relative w-11 h-11 rounded-full bg-white/95 text-[#0f2444] border border-gray-200 shadow-sm flex items-center justify-center transition-all hover:scale-105 hover:shadow-md hover:text-white hover:border-transparent hover:bg-[linear-gradient(135deg,_#17396f_0%,_#2f6f9f_52%,_#49ad57_100%)]"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wishlisted}
              >
                {wishlisted ? (
                  <Trash2 className="h-5 w-5 transition-colors text-red-500 group-hover:text-white" />
                ) : (
                  <Heart className="h-5 w-5 transition-colors text-gray-400 group-hover:text-white group-hover:fill-white" />
                )}
                <span className="pointer-events-none absolute z-20 left-1/2 -translate-x-1/2 bottom-[calc(100%+12px)] whitespace-nowrap rounded-md bg-[#0f2444] px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  <span className="absolute left-1/2 top-full -translate-x-1/2 h-0 w-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#0f2444]" />
                </span>
              </button>
            </div>

            {qtySafe > 1 && (
              <p className="mt-2 text-xs text-gray-500">
                Total: <strong className="text-(--color-primary)">{formatCurrency(effectivePrice * qtySafe, currencySymbol)}</strong> for {qtySafe} units
                {selectedVariant?.weight != null && selectedVariant.weight > 0 && (() => {
                  const totalGrams = selectedVariant.weight * qtySafe;
                  const unit = (selectedVariant.weight_unit ?? "g").toLowerCase();
                  // Normalise to grams first, then display in kg if ≥ 1000g
                  const inGrams = unit === "kg" ? totalGrams * 1000 : totalGrams;
                  const display = inGrams >= 1000
                    ? `${(inGrams / 1000).toFixed(2)} kg`
                    : `${inGrams.toFixed(2)} g`;
                  return <span className="ml-2 text-gray-400">· Total weight: <strong className="text-gray-600">{display}</strong></span>;
                })()}
              </p>
            )}

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { icon: Truck, label: "Pan India Shipping", sub: "Delivered anywhere in India" },
                { icon: Shield, label: "Secure Payment", sub: "SSL encrypted" },
                { icon: FileText, label: "GST Invoice", sub: "On every order" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white border border-(--color-border)">
                  <Icon className="h-4 w-4 text-(--color-primary) mb-1" aria-hidden="true" />
                  <span className="text-[11px] font-semibold text-(--color-secondary) leading-snug">{label}</span>
                  <span className="text-[10px] text-gray-400 leading-snug">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14">
          <div className="flex border-b border-(--color-border) overflow-x-auto" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? "border-(--color-primary) text-(--color-primary)"
                    : "border-transparent text-gray-500 hover:text-(--color-secondary)"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-8 pb-4" role="tabpanel">
            {activeTab === "description" && (
              <div className="space-y-5">
                <div className="prose prose-sm max-w-none text-gray-600">
                  {product.description ? (
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  ) : product.short_description ? (
                    <p>{product.short_description}</p>
                  ) : (
                    <p className="text-gray-400 text-center py-8">No description available.</p>
                  )}
                </div>

                {tags.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-(--color-secondary) mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {(product.video?.video_link && !isVideoLink(product.video.video_link)) && (
                  <div>
                    <p className="text-sm font-semibold text-(--color-secondary) mb-1">Product Video</p>
                    <a href={product.video.video_link} target="_blank" rel="noreferrer" className="text-sm text-(--color-primary) hover:underline">
                      Watch product video
                    </a>
                  </div>
                )}
              </div>
            )}

            {activeTab === "specs" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map((spec, i) => (
                      <tr key={`${spec.key}-${i}`} className={i % 2 === 0 ? "bg-(--color-muted)" : "bg-white"}>
                        <td className="px-4 py-3 font-semibold text-(--color-secondary) w-1/3 rounded-l-lg">{spec.key}</td>
                        <td className="px-4 py-3 text-gray-600 rounded-r-lg">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && <ReviewsTab reviews={reviews} rating={rating} />}

            {activeTab === "reviews" && (
              <div className="mt-6">
                {reviewPendingMessage ? (
                  <div className="p-3 rounded-md bg-yellow-50 text-yellow-800">{reviewPendingMessage}</div>
                ) : (
                  <ReviewForm
                    productSlug={product.slug}
                    onSubmitting={() => setSubmittingReview(true)}
                    onDone={(msg) => { setSubmittingReview(false); setReviewPendingMessage(msg ?? null); }}
                  />
                )}
              </div>
            )}

            {activeTab === "faqs" && <FaqsTab faqs={faqs} />}
          </div>
        </div>
      </div>
    </Container>
  );
}
