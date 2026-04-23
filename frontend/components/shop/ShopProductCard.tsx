"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart, ShoppingBag, Package, Tag, Trash2,
  Eye, X, ChevronLeft, ChevronRight, Minus, Plus,
  CheckCircle, XCircle, Shield, RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import {
  API_BASE, getProduct, addToWishlist, getWishlistItems, removeWishlistItem,
  type RealApiProduct, type RealApiVariant,
} from "@/lib/api";
import { normalizeImageUrl } from "@/lib/image";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import AttributePills, { AttributePillsWithVariants } from "@/components/product/AttributePills";

// ─── Helpers ──────────────────────────────────────────────────────────────────


/** Extract the best available pricing from a product's variants. */
function getDefaultPricing(product: RealApiProduct) {
  const variant = product.variants?.find((v) => v.is_default) ?? product.variants?.[0];
  const pricing = variant?.store_pricing?.find((s) => s.stock_status === "in_stock") ?? variant?.store_pricing?.[0];
  return { variant, pricing };
}

function getTaxableUnitPrice(pricing: RealApiVariant["store_pricing"][number] | null | undefined): number {
  const taxableAmount = pricing?.gst?.taxable_amount;
  if (taxableAmount != null) return Number(taxableAmount);
  if (pricing?.special_price != null) return Number(pricing.special_price);
  if (pricing?.cost != null) return Number(pricing.cost);
  if (pricing?.price != null) return Number(pricing.price);
  return 0;
}

const QA_BTN =
  "group/qa relative h-9 w-9 rounded-full bg-white/95 text-[#0f2444] border border-gray-200 shadow-sm flex items-center justify-center transition-all hover:scale-105 hover:shadow-md hover:text-white hover:border-transparent hover:bg-[linear-gradient(135deg,_#17396f_0%,_#2f6f9f_52%,_#49ad57_100%)]";

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShopProductCard({ product }: { product: RealApiProduct }) {
  const router = useRouter();
  const { addItem, openCart, updateQuantity } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { isLoggedIn } = useAuth();
  const {
    showGstInGrid,
    showCategoryNameInGrid,
    showMinQtyInGrid,
  } = useSiteSettings();

  const [wishlistBusy, setWishlistBusy]           = useState(false);
  const [quickViewOpen, setQuickViewOpen]         = useState(false);
  const [quickViewLoading, setQuickViewLoading]   = useState(false);
  const [quickViewProduct, setQuickViewProduct]   = useState<RealApiProduct | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex]   = useState(0);
  const [qty, setQty] = useState(product.policies?.minimum_order_quantity ?? 1);

  // ── Derived card values ──────────────────────────────────────────────────
  const { variant: defaultVariant, pricing: defaultPricing } = getDefaultPricing(product);
  const [hoveredVariantId, setHoveredVariantId] = useState<number | null>(null);
  const price = getTaxableUnitPrice(defaultPricing);
  // compare: use cost (GST-excluded base price) as the strikethrough so it's same tax-basis as displayPrice
  const compare   = defaultPricing?.cost != null ? parseFloat(String(defaultPricing.cost)) : (defaultPricing?.price != null ? Number(defaultPricing.price) : 0);
  // Display price: prefer special_price when available, otherwise use cost (price without GST)
  const displayPrice = getTaxableUnitPrice(defaultPricing);
  const showCompare = compare > 0 && compare > displayPrice;
  // Use discount_percent from API if available, otherwise do not show discount badge
  const discount  = defaultPricing?.discount_percent ?? null;
  const inStock   = (defaultPricing?.stock ?? 0) > 0;
  const minQty    = product.policies?.minimum_order_quantity ?? 1;
  const imgSrc    = normalizeImageUrl(
    // prefer hovered variant image when hovering a swatch; treat empty string as missing
    (product.variants?.find((v) => v.id === hoveredVariantId)?.image) || defaultVariant?.image || product.images?.main_image
  );
  const isInWishlist = isWishlisted(product.id);
  
  // Price to show in grid (prefer discounted special_price when present)
  // If hovering a variant, try to use that variant's pricing
  const hoveredVariant = product.variants?.find((v) => v.id === hoveredVariantId) ?? null;
  const defaultDisplayTitle = hoveredVariant?.title ?? (product.type === "variant" ? (defaultVariant?.title ?? product.title) : product.title);
  function getPricingForVariant(v: typeof defaultVariant | null) {
    if (!v) return null;
    // Prefer a store pricing that matches defaultPricing store_id if available
    const matchStoreId = defaultPricing?.store_id ?? null;
    const pricing = (v.store_pricing?.find((s) => (matchStoreId ? s.store_id === matchStoreId : s.stock_status === "in_stock")) ?? v.store_pricing?.[0]) ?? null;
    return pricing
      ? {
          display: getTaxableUnitPrice(pricing),
          compare: pricing.cost != null ? parseFloat(String(pricing.cost)) : (pricing.price != null ? Number(pricing.price) : 0),
          raw: pricing,
        }
      : null;
  }

  const hoveredPricingInfo = getPricingForVariant(hoveredVariant);
  const defaultPricingInfo = getPricingForVariant(defaultVariant) ?? { display: displayPrice, compare };

  const priceWithoutGst = hoveredPricingInfo?.display ?? defaultPricingInfo.display ?? 0;
  const compareWithoutGst = hoveredPricingInfo?.compare ?? defaultPricingInfo.compare ?? 0;

  // ── Quick view derived values ─────────────────────────────────────────────
  const quickViewVariants = useMemo(() => quickViewProduct?.variants ?? [], [quickViewProduct]);

  const selectedVariant: RealApiVariant | null = useMemo(() => {
    if (!quickViewVariants.length) return null;
    if (selectedVariantId == null) return quickViewVariants.find((v) => v.is_default) ?? quickViewVariants[0];
    return quickViewVariants.find((v) => v.id === selectedVariantId) ?? quickViewVariants[0];
  }, [quickViewVariants, selectedVariantId]);

  const selectedPricing = useMemo(() => {
    if (!selectedVariant) return null;
    return selectedVariant.store_pricing?.find((s) => s.stock_status === "in_stock") ?? selectedVariant.store_pricing?.[0] ?? null;
  }, [selectedVariant]);

  const modalImages = useMemo(() => {
    if (!quickViewProduct) return [];
    const all = quickViewProduct.images?.all ?? [];
    const raw = all.length > 0 ? all : [quickViewProduct.images?.main_image];
    return raw.map((img) => normalizeImageUrl(img)).filter((img): img is string => Boolean(img));
  }, [quickViewProduct]);

  const stepQty       = quickViewProduct?.policies?.minimum_order_quantity ?? minQty;
  const priceNow = getTaxableUnitPrice(selectedPricing) || price;
  // priceBase is the "was" price — use cost (GST-excluded) so it's on the same tax basis as priceNow
  const priceBase     = selectedPricing?.cost != null ? parseFloat(String(selectedPricing.cost)) : priceNow;
  // Use discount_percent from API; only show if there is an actual special_price discount
  const modalDiscount = selectedPricing?.discount_percent ?? 0;

  const qvInStock = (selectedPricing?.stock ?? 0) > 0;

  // Lock body scroll when modal open
  useEffect(() => {
    if (!quickViewOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [quickViewOpen]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!defaultVariant || !defaultPricing) return;
    const itemId = `${product.id}-v${defaultVariant.id}-s${defaultPricing.store_id}`;
    addItem({
      id: itemId,
      productId: product.id,
      name: product.title,
      price,
      taxPerUnit: defaultPricing.gst?.total_tax_amount ?? 0,
      image: imgSrc,
      slug: product.slug,
      variantId: defaultVariant.id,
      variantLabel: defaultVariant.title,
      minQty,
      step: product.policies?.quantity_step_size ?? 1,
      totalAllowed: product.policies?.total_allowed_quantity ?? null,
      stock: defaultPricing?.stock ?? undefined,
      storeId: defaultPricing.store_id,
      currencySymbol: product.currency?.symbol || "₹",
      weight: defaultVariant.weight ?? undefined,
      weightUnit: defaultVariant.weight_unit ?? undefined,
    });
    // Reflect selected qty (local `qty`) in cart after add
    setTimeout(() => updateQuantity(itemId, qty), 0);
    openCart();
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    void (async () => {
      e.preventDefault();
      if (!isLoggedIn) { toast.error("Please login to manage wishlist."); return; }
      if (wishlistBusy) return;
      setWishlistBusy(true);
      try {
        if (isInWishlist) {
          const rows = await getWishlistItems();
          const match = rows.find((row) => row.product?.id === product.id);
          if (!match) {
            toggle({ id: product.id, name: product.title, slug: product.slug, image: imgSrc ?? undefined, price });
            toast.success("Removed from wishlist");
            return;
          }
          const res = await removeWishlistItem(match.id);
          if (res.success) {
            toggle({ id: product.id, name: product.title, slug: product.slug, image: imgSrc ?? undefined, price });
            toast.success("Removed from wishlist");
          } else {
            toast.error(res.message || "Failed to remove");
          }
          return;
        }
        const storeId = defaultPricing?.store_id;
        if (!storeId) { toast.error("Store not available for this product."); return; }
        const res = await addToWishlist({
          wishlist_title: "Favorite",
          product_id: product.id,
          store_id: storeId,
          product_variant_id: defaultVariant?.id ?? null,
        });
        const msg = (res.message || "").toLowerCase();
        if (res.success || msg.includes("already") || msg.includes("exists")) {
          if (!isInWishlist) {
            toggle({ id: product.id, name: product.title, slug: product.slug, image: imgSrc ?? undefined, price });
          }
          toast.success(res.message || "Added to wishlist");
        } else {
          toast.error(res.message || "Failed to add to wishlist");
        }
      } finally {
        setWishlistBusy(false);
      }
    })();
  };

  const openQuickView = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
    setQuickViewLoading(true);
    setActiveImageIndex(0);
    const prod = await getProduct(product.slug);
    setQuickViewProduct(prod);
    setSelectedVariantId(prod?.variants?.find((v) => v.is_default)?.id ?? prod?.variants?.[0]?.id ?? null);
    setQty(Math.max(1, prod?.policies?.minimum_order_quantity ?? minQty));
    setQuickViewLoading(false);
  };

  const closeQuickView = () => setQuickViewOpen(false);

  const addSelectedToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!quickViewProduct || !selectedVariant || !selectedPricing) return;
    const itemId = `${quickViewProduct.id}-v${selectedVariant.id}-s${selectedPricing.store_id}`;
    addItem({
      id: itemId,
      productId: quickViewProduct.id,
      name: quickViewProduct.title,
      price: Number(priceNow || 0),
      taxPerUnit: selectedPricing.gst?.total_tax_amount ?? 0,
      image: selectedVariant.image || quickViewProduct.images?.main_image || null,
      slug: quickViewProduct.slug,
      variantId: selectedVariant.id,
      variantLabel: selectedVariant.title,
      minQty: qty,
      step: quickViewProduct.policies?.quantity_step_size ?? 1,
      totalAllowed: quickViewProduct.policies?.total_allowed_quantity ?? null,
      stock: selectedPricing?.stock ?? undefined,
      storeId: selectedPricing.store_id,
      currencySymbol: quickViewProduct.currency?.symbol || "₹",
      weight: selectedVariant.weight ?? undefined,
      weightUnit: selectedVariant.weight_unit ?? undefined,
    });
    setTimeout(() => updateQuantity(itemId, qty), 0);
    openCart();
  };


  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <div onMouseLeave={() => setHoveredVariantId(null)} className="featured-card-border transition-all duration-300 hover:-translate-y-1 h-full">
        <Link href={`/products/${product.slug}`} className="group flex flex-col h-full">

          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={product.title}
                fill
                unoptimized={/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(imgSrc)}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-14 w-14 text-gray-200" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
              {product.featured === "1" && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                  style={{ background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)" }}>
                  Featured
                </span>
              )}
              {discount && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white bg-red-500">
                  {discount}% off
                </span>
              )}
            </div>

            {/* Quick action stack — wishlist + quick view only */}
            <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
              <button type="button" onClick={handleToggleWishlist} disabled={wishlistBusy} className={QA_BTN}
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}>
                {isInWishlist ? <Trash2 className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
                <span className="pointer-events-none absolute z-20 right-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#0f2444] px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover/qa:opacity-100">
                  {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  <span className="absolute left-full top-1/2 -translate-y-1/2 h-0 w-0 border-y-[5px] border-l-[6px] border-y-transparent border-l-[#0f2444]" />
                </span>
              </button>

              <button type="button" onClick={openQuickView} className={QA_BTN} aria-label="Quick view">
                <Eye className="h-4 w-4" />
                <span className="pointer-events-none absolute z-20 right-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#0f2444] px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover/qa:opacity-100">
                  Quick view
                  <span className="absolute left-full top-1/2 -translate-y-1/2 h-0 w-0 border-y-[5px] border-l-[6px] border-y-transparent border-l-[#0f2444]" />
                </span>
              </button>
            </div>

            {/* Out of stock overlay */}
            {!inStock && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex flex-col flex-1 p-3 gap-1.5">
            {showCategoryNameInGrid && product.category && (
              <p className="text-[10px] text-[#1f4f8a] font-semibold uppercase tracking-wider">
                {product.category.title}
              </p>
            )}
            <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#2e7c8a] transition-colors">
              {defaultDisplayTitle}
            </p>
            {/* Variant attributes (interactive) */}
            {product.type === "variant" && product.variants && (() => {
              const seenColor = new Set<string>();
              const seenSize = new Set<string>();
              const seenWeight = new Set<string>();
              const colors: { color: string; variantId: number }[] = [];
              const sizes: { size: string; variantId: number }[] = [];
              const weights: { weight: string; variantId: number }[] = [];

              // Determine the default variant's color so we only show sizes for that color
              const defaultAttrsRaw = defaultVariant?.attributes || {};
              const defaultAttrs: Record<string, string> = {};
              for (const [k, val] of Object.entries(defaultAttrsRaw)) {
                defaultAttrs[String(k).toLowerCase()] = val;
              }
              const defaultColor = defaultAttrs.color ?? defaultAttrs.col ?? null;

              // Check if ANY variant in this product has a color attribute
              const productHasColorVariants = product.variants.some((v) => {
                const a = v.attributes || {};
                return Object.entries(a).some(([k]) => {
                  const key = String(k).toLowerCase();
                  return key === "color" || key === "col";
                });
              });

              for (const v of product.variants) {
                const raw = v.attributes || {};
                // normalize attribute keys to lowercase for robust lookup
                const attrs: Record<string, string> = {};
                for (const [k, val] of Object.entries(raw)) {
                  attrs[String(k).toLowerCase()] = val;
                }
                const col = attrs.color ?? attrs.col ?? null;
                const sz = attrs.size ?? attrs.size_label ?? attrs.size_in ?? attrs.size_cm ?? attrs.dimensions ?? attrs.pouch_size ?? attrs.pouchsize ?? attrs["pouch-size"] ?? attrs["pack_size"] ?? attrs["pack-size"] ?? attrs.measurement ?? attrs.dim ?? null;
                const wt = attrs.weight ?? attrs.weight_kg ?? attrs.weight_g ?? attrs.wt ?? null;
                // Always collect colors from all variants
                if (col && !seenColor.has(String(col))) { seenColor.add(String(col)); colors.push({ color: String(col), variantId: v.id }); }
                // If product uses color as a variant dimension, include sizes from:
                // (a) variants matching the default color, OR (b) variants with no color attribute.
                // Exclude variants with a different explicit color (e.g. don't show Pink sizes on Red).
                const colorMatches = !productHasColorVariants
                  ? true
                  : (col == null || String(col) === String(defaultColor));
                if (!colorMatches) continue;
                let finalSize = sz;
                // fallback: try parsing size-like patterns from title or sku or option values
                if (!finalSize) {
                  const titleStr = String(v.title ?? "");
                  const skuStr = String(v.sku ?? "");
                  const combined = `${titleStr} ${skuStr}`;
                  const sizeMatch = combined.match(/\b\d+(?:\s*[x×]\s*\d+){1,2}\s*(?:mm|cm|in)?\b/i);
                  if (sizeMatch) finalSize = sizeMatch[0];
                }
                // also check variant.options array (common in some APIs)
                if (!finalSize && Array.isArray(v.options)) {
                  for (const opt of v.options) {
                    if (!opt) continue;
                    const val = String(typeof opt === "string" ? opt : (opt.value ?? "")).trim();
                    if (/\d+(?:\s*[x×]\s*\d+){1,2}/.test(val)) { finalSize = val; break; }
                  }
                }
                if (finalSize && !seenSize.has(String(finalSize))) { seenSize.add(String(finalSize)); sizes.push({ size: String(finalSize), variantId: v.id }); }
                if (wt && !seenWeight.has(String(wt))) { seenWeight.add(String(wt)); weights.push({ weight: String(wt), variantId: v.id }); }
              }
              const hasVariantImages = (product.images?.variant_images?.length ?? 0) > 0;
              const variantImageSet = new Set<number>(product.variants?.filter((v) => Boolean(v.image)).map((v) => v.id) ?? []);
              if (colors.length === 0 && sizes.length === 0 && weights.length === 0) {
                return <AttributePills attributes={defaultVariant?.attributes ?? null} />;
              }

              return (
                <AttributePillsWithVariants
                  colors={colors}
                  weights={weights.map((w) => ({ value: w.weight, variantId: w.variantId }))}
                  hoveredVariantId={hoveredVariantId}
                  onHoverVariant={(id) => {
                    if (id == null) { setHoveredVariantId(null); return; }
                    if (hasVariantImages && variantImageSet.has(id)) setHoveredVariantId(id);
                  }}
                  variantImageSet={variantImageSet}
                  hoverEnabled={hasVariantImages}
                  showColorSwatches={true}
                />
              );
            })()}
            {product.type !== "variant" && <AttributePills attributes={defaultVariant?.attributes ?? null} />}

            {/* Bottom row: price+meta left, cart right */}
            <div className="flex items-end justify-between gap-2 mt-auto pt-2 border-t border-gray-100">
              {/* Left: price + GST + min qty */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-extrabold text-gray-900">
                    {product.currency?.symbol || "₹"}{priceWithoutGst.toFixed(2)}
                  </span>
                  {showCompare && (
                    <span className="text-[10px] text-gray-400 line-through">
                      {product.currency?.symbol || "₹"}{compareWithoutGst.toFixed(2)}
                    </span>
                  )}
                </div>
                {showGstInGrid && (
                  <span className="text-[10px] text-gray-400">+{product.tax?.gst_rate ?? ""}% GST</span>
                )}
                {showMinQtyInGrid && (
                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Tag className="h-2.5 w-2.5 shrink-0" />
                    Min: {minQty} pcs
                  </span>
                )}
              </div>

              {/* Right: add to cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 bg-[linear-gradient(135deg,#17396f_0%,#2f6f9f_52%,#49ad57_100%)]"
                aria-label="Add to cart"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Add to Cart
              </button>
            </div>
          </div>
        </Link>
      </div>

      {/* ── Quick View Modal ── */}
      {quickViewOpen && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/55 backdrop-blur-[1px] flex items-center justify-center p-3 sm:p-6"
          onClick={closeQuickView}
          role="dialog" aria-modal="true" aria-label="Quick product view"
        >
          <div
            className="w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {quickViewLoading ? (
              /* Skeleton loader */
              <div className="grid grid-cols-1 lg:grid-cols-2 animate-pulse">
                <div className="bg-gray-200 min-h-[320px] lg:min-h-[520px] rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none" />
                <div className="p-6 lg:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-5 bg-gray-200 rounded-full w-24" />
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                  </div>
                  <div className="h-7 bg-gray-200 rounded w-full" />
                  <div className="h-7 bg-gray-200 rounded w-3/4" />
                  <div className="h-8 bg-gray-200 rounded w-1/3 mt-1" />
                  <div className="space-y-2 pt-1">
                    <div className="h-3.5 bg-gray-200 rounded" />
                    <div className="h-3.5 bg-gray-200 rounded w-5/6" />
                    <div className="h-3.5 bg-gray-200 rounded w-4/6" />
                  </div>
                  <div className="pt-2 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="flex gap-2">
                      {[1,2,3].map(i => <div key={i} className="h-8 w-8 bg-gray-200 rounded-full" />)}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <div className="h-10 bg-gray-200 rounded-full w-28" />
                    <div className="h-10 bg-gray-200 rounded-full flex-1" />
                  </div>
                  <div className="h-10 bg-gray-200 rounded-full w-full" />
                </div>
              </div>
            ) : quickViewProduct ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-0 flex-1 overflow-hidden">
                {/* ── Image panel ── */}
                <div className="bg-[#f3f6fa] rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none flex flex-col min-h-0">
                  <div className="relative flex-1 min-h-[280px] lg:min-h-0">
                    {modalImages.length > 0 ? (
                      <Image
                        src={modalImages[Math.min(activeImageIndex, modalImages.length - 1)]}
                        alt={quickViewProduct.title}
                        fill
                        unoptimized={/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(modalImages[Math.min(activeImageIndex, modalImages.length - 1)] || "")}
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                    {modalImages.length > 1 && (
                      <>
                        <button className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
                          onClick={() => setActiveImageIndex((i) => (i === 0 ? modalImages.length - 1 : i - 1))} aria-label="Previous image">
                          <ChevronLeft className="h-5 w-5 text-[#0f2444]" />
                        </button>
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
                          onClick={() => setActiveImageIndex((i) => (i === modalImages.length - 1 ? 0 : i + 1))} aria-label="Next image">
                          <ChevronRight className="h-5 w-5 text-[#0f2444]" />
                        </button>
                      </>
                    )}
                  </div>
                  {/* Thumbnail strip */}
                  {modalImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none shrink-0">
                      {modalImages.map((img, idx) => (
                        <button key={idx} onClick={() => setActiveImageIndex(idx)}
                          className={`relative flex-shrink-0 w-13 h-13 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === idx ? "border-[#0f4d9a] shadow-sm" : "border-transparent hover:border-gray-300"}`}
                          aria-label={`View image ${idx + 1}`}
                        >
                          <Image src={img} alt="" fill className="object-cover"
                            unoptimized={/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(img)} sizes="52px" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Detail panel ── */}
                <div className="overflow-y-auto max-h-[92vh] lg:max-h-none">
                  <div className="p-5 lg:p-7">
                    {/* Top bar */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {quickViewProduct.category && (
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2f6f9f] bg-[#2f6f9f]/10 px-2.5 py-0.5 rounded-full">
                            {quickViewProduct.category.title}
                          </span>
                        )}
                        {qvInStock ? (
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> In Stock
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> Out of Stock
                          </span>
                        )}
                      </div>
                      <button className="shrink-0 h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#0f2444] transition-colors"
                        onClick={closeQuickView} aria-label="Close quick view">
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl leading-tight font-extrabold text-[#0f2444]">
                      {quickViewProduct.title}
                    </h3>

                    {/* SKU */}
                    {selectedPricing?.sku && (
                      <p className="mt-1 text-xs text-gray-400">SKU: {selectedPricing.sku}</p>
                    )}

                    {/* Price */}
                    <div className="mt-3 flex flex-wrap items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-[#0f4d9a]">
                        {quickViewProduct.currency?.symbol || "₹"}{Number(priceNow).toFixed(2)}
                      </span>
                      {priceBase > priceNow && (
                        <span className="text-lg text-gray-400 line-through">
                          {quickViewProduct.currency?.symbol || "₹"}{Number(priceBase).toFixed(2)}
                        </span>
                      )}
                      {modalDiscount > 0 && (
                        <span className="rounded-full bg-red-500 text-white text-xs font-bold px-2.5 py-0.5">
                          {modalDiscount}% Off
                        </span>
                      )}
                    </div>
                    {/* Short description */}
                    {(quickViewProduct.short_description || quickViewProduct.description) && (
                      <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        {quickViewProduct.short_description || quickViewProduct.description}
                      </p>
                    )}

                    {/* Variant selector — always image cards when multiple variants exist */}
                    {quickViewVariants.length > 1 && (
                      <div className="mt-4">
                        <p className="text-sm font-bold text-[#0f2444] mb-2">
                          Variants <span className="font-normal text-gray-400 text-xs">({quickViewVariants.length})</span>
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                          {quickViewVariants.map((v) => {
                            const isSelected = selectedVariant?.id === v.id;
                            const noVariantImages = (quickViewProduct.images?.variant_images?.length ?? 0) === 0;
                            const imgUrl = normalizeImageUrl(v.image || (noVariantImages ? quickViewProduct.images?.main_image : null));
                            return (
                              <button
                                key={v.id}
                                type="button"
                                onClick={() => setSelectedVariantId(v.id)}
                                aria-label={v.title || `Variant ${v.id}`}
                                data-selected={isSelected}
                                className={`rounded-xl border-2 overflow-hidden transition-all text-left focus:outline-none ${
                                  isSelected
                                    ? "border-transparent shadow-md"
                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                }`}
                              >
                                <div className={`relative aspect-square ${isSelected ? "bg-[linear-gradient(135deg,#17396f_0%,#2f6f9f_52%,#49ad57_100%)]" : "bg-gray-50"}`}>
                                  {imgUrl ? (
                                    <Image src={imgUrl} alt={v.title || ""} fill
                                      className="object-contain p-1.5" sizes="100px"
                                      unoptimized={/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(imgUrl)} />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className={`h-6 w-6 ${isSelected ? "text-white/60" : "text-gray-300"}`} />
                                    </div>
                                  )}
                                </div>
                                <div className={`px-1.5 py-1.5 ${isSelected ? "bg-[linear-gradient(135deg,#17396f_0%,#2f6f9f_52%,#49ad57_100%)]" : "bg-white"}`}>
                                  <p className={`text-[9px] font-semibold leading-tight line-clamp-2 text-center ${isSelected ? "text-white" : "text-gray-700"}`}>
                                    {v.title}
                                  </p>
                                  {v.attributes && Object.keys(v.attributes).length > 0 && (
                                    <p className={`text-[8px] leading-tight line-clamp-1 text-center mt-0.5 ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                                      {Object.values(v.attributes).filter(Boolean).join(" · ")}
                                    </p>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Qty + Add to Cart */}
                    <div className="mt-5 flex flex-wrap items-center gap-2.5">
                      <div className="h-10 rounded-full bg-gray-100 px-3 flex items-center gap-3 shrink-0">
                        <button className="text-gray-700" onClick={() => setQty((q) => Math.max(stepQty, q - (quickViewProduct?.policies?.quantity_step_size ?? 1)))} aria-label="Decrease quantity">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-7 text-center text-base font-semibold">{qty}</span>
                        <button className="text-gray-700" onClick={() => setQty((q) => q + (quickViewProduct?.policies?.quantity_step_size ?? 1))} aria-label="Increase quantity">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      {priceNow > 0 && (
                        <span className="text-sm font-bold text-[#0f4d9a] shrink-0">
                          = {quickViewProduct.currency?.symbol || "₹"}{(priceNow * qty).toFixed(2)}
                        </span>
                      )}
                      <button onClick={addSelectedToCart} disabled={!qvInStock}
                        className="flex-1 h-10 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed bg-[linear-gradient(135deg,#17396f_0%,#2f6f9f_52%,#49ad57_100%)] flex items-center justify-center gap-1.5">
                        <ShoppingBag className="h-4 w-4" />
                        Add to Cart
                      </button>
                    </div>

                    {stepQty > 1 && (
                      <p className="mt-1.5 text-[11px] text-gray-400 flex items-center justify-center gap-1">
                        <Tag className="h-3 w-3" /> Min. order: {stepQty} pcs
                        {(quickViewProduct?.policies?.quantity_step_size ?? 1) > 1 && ` · Step: ${quickViewProduct.policies.quantity_step_size}`}
                      </p>
                    )}

                    {/* Divider */}
                    <div className="my-4 border-t border-gray-100" />

                    {/* Product details */}
                    <div className="space-y-2 text-sm">
                      {quickViewProduct.features?.warranty_period && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Shield className="h-4 w-4 text-[#2f6f9f] shrink-0" />
                          <span>Warranty: {quickViewProduct.features.warranty_period}</span>
                        </div>
                      )}
                      {quickViewProduct.features?.guarantee_period && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Shield className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>Guarantee: {quickViewProduct.features.guarantee_period}</span>
                        </div>
                      )}
                      {quickViewProduct.policies?.is_returnable && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <RotateCcw className="h-4 w-4 text-[#49ad57] shrink-0" />
                          <span>Returnable</span>
                        </div>
                      )}
                    </div>

                    <button onClick={() => { closeQuickView(); router.push(`/products/${product.slug}`); }}
                      className="mt-5 text-sm font-semibold text-[#0f4d9a] hover:text-[#49ad57] transition-colors">
                      View full details →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-gray-500">Unable to load product details.</div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
