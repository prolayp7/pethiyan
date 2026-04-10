"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart, ShoppingBag, Package, Tag, Trash2,
  Eye, X, ChevronLeft, ChevronRight, Minus, Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import {
  API_BASE, getProduct, addToWishlist, getWishlistItems, removeWishlistItem,
  type RealApiProduct, type RealApiVariant,
} from "@/lib/api";
import { useSiteSettings } from "@/context/SiteSettingsContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  Transparent: "#c8e6f5", Brown: "#8B6347",
  Colorful: "linear-gradient(135deg,#f44,#4f4,#44f)",
  Black: "#111", White: "#f0f0f0", Red: "#e53", Blue: "#36f",
  Green: "#4b8", Yellow: "#fb0", Gray: "#9ca3af", Grey: "#9ca3af",
  "Light Gray": "#d1d5db", "Light Grey": "#d1d5db",
  "Dark Gray": "#374151", "Dark Grey": "#374151",
  Silver: "#c0c0c0", Orange: "#f97316", Purple: "#a855f7",
  Pink: "#ec4899", Beige: "#e8dcc8", Navy: "#1e3a5f", Maroon: "#800000",
};

function normalizeImageUrl(src?: string | null): string | null {
  if (!src) return null;
  const trimmed = String(src).trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = API_BASE.replace(/\/+$/, "");
  if (trimmed.startsWith("/")) return `${base}${trimmed}`;
  if (trimmed.startsWith("storage/") || trimmed.startsWith("uploads/")) return `${base}/${trimmed}`;
  return `${base}/storage/${trimmed}`;
}

/** Extract the best available pricing from a product's variants. */
function getDefaultPricing(product: RealApiProduct) {
  const variant = product.variants?.find((v) => v.is_default) ?? product.variants?.[0];
  const pricing = variant?.store_pricing?.find((s) => s.stock_status === "in_stock") ?? variant?.store_pricing?.[0];
  return { variant, pricing };
}

const QA_BTN =
  "group/qa relative h-9 w-9 rounded-full bg-white/95 text-[#0f2444] border border-gray-200 shadow-sm flex items-center justify-center transition-all hover:scale-105 hover:shadow-md hover:text-white hover:border-transparent hover:bg-[linear-gradient(135deg,_#17396f_0%,_#2f6f9f_52%,_#49ad57_100%)]";

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShopProductCard({ product }: { product: RealApiProduct }) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { isLoggedIn } = useAuth();
  const {
    showVariantColorsInGrid,
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
  const price     = defaultPricing?.special_price || defaultPricing?.price || 0;
  const compare   = defaultPricing?.price || 0;
  const showCompare = compare > 0 && compare > price;
  const discount  = showCompare ? Math.round(((compare - price) / compare) * 100) : null;
  const inStock   = (defaultPricing?.stock ?? 0) > 0;
  const minQty    = product.policies?.minimum_order_quantity ?? 1;
  const imgSrc    = normalizeImageUrl(
    defaultVariant?.image || product.images?.main_image
  );
  const isInWishlist = isWishlisted(product.id);

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
  const priceNow      = selectedPricing?.special_price || selectedPricing?.price || price;
  const priceBase     = selectedPricing?.price || (showCompare ? compare : priceNow);
  const modalDiscount = priceBase > priceNow ? Math.round(((priceBase - priceNow) / priceBase) * 100) : 0;

  const colorOptions = useMemo(() => {
    const map = new Map<string, RealApiVariant>();
    for (const v of quickViewVariants) {
      const color = v.attributes?.color;
      if (color && !map.has(color)) map.set(color, v);
    }
    return Array.from(map.entries());
  }, [quickViewVariants]);

  const sizeOptions = useMemo(() => {
    const map = new Map<string, RealApiVariant>();
    for (const v of quickViewVariants) {
      const size = v.attributes?.size;
      if (size && !map.has(size)) map.set(size, v);
    }
    return Array.from(map.entries());
  }, [quickViewVariants]);

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
    addItem({
      id: `${product.id}-v${defaultVariant.id}-s${defaultPricing.store_id}`,
      productId: product.id,
      name: product.title,
      price,
      image: imgSrc,
      slug: product.slug,
      variantId: defaultVariant.id,
      variantLabel: defaultVariant.title,
      minQty,
      storeId: defaultPricing.store_id,
      currencySymbol: product.currency?.symbol || "₹",
    });
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
    addItem({
      id: `${quickViewProduct.id}-v${selectedVariant.id}-s${selectedPricing.store_id}`,
      productId: quickViewProduct.id,
      name: quickViewProduct.title,
      price: Number(priceNow || 0),
      image: selectedVariant.image || quickViewProduct.images?.main_image || null,
      slug: quickViewProduct.slug,
      variantId: selectedVariant.id,
      variantLabel: selectedVariant.title,
      minQty: qty,
      storeId: selectedPricing.store_id,
      currencySymbol: quickViewProduct.currency?.symbol || "₹",
      weight: selectedVariant.weight ?? undefined,
      weightUnit: selectedVariant.weight_unit ?? undefined,
    });
    openCart();
    closeQuickView();
  };

  const buyNow = (e: React.MouseEvent) => { addSelectedToCart(e); router.push("/checkout"); };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="featured-card-border transition-all duration-300 hover:-translate-y-1">
        <Link href={`/products/${product.slug}`} className="group">

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
                  -{discount}%
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
              {product.title}
            </p>

            {/* Color swatches + variant count */}
            {showVariantColorsInGrid && (() => {
              const colorMap = new Map<string, string>();
              for (const v of product.variants ?? []) {
                const c = v.attributes?.color;
                if (c && !colorMap.has(c)) colorMap.set(c, COLOR_MAP[c] ?? "#aaa");
              }
              const colors = Array.from(colorMap.entries());
              const variantCount = product.variants?.length ?? 0;
              if (colors.length === 0 && variantCount <= 1) return null;
              return (
                <div className="flex items-center gap-1.5">
                  {colors.slice(0, 5).map(([c, bg]) => (
                    <span key={c} title={c} className="w-3 h-3 rounded-full border border-black/10 shrink-0" style={{ background: bg }} />
                  ))}
                  {variantCount > 1 && (
                    <span className="text-[10px] text-gray-400 ml-0.5">{variantCount} variants</span>
                  )}
                </div>
              );
            })()}

            {/* Bottom row: price+meta left, cart right */}
            <div className="flex items-end justify-between gap-2 mt-auto pt-2 border-t border-gray-100">
              {/* Left: price + GST + min qty */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-extrabold text-gray-900">
                    {product.currency?.symbol || "₹"}{price.toFixed(2)}
                  </span>
                  {showCompare && (
                    <span className="text-[10px] text-gray-400 line-through">
                      {product.currency?.symbol || "₹"}{compare.toFixed(2)}
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
            className="w-full max-w-6xl max-h-[92vh] overflow-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {quickViewLoading ? (
              <div className="p-10 text-center text-gray-500">Loading product details...</div>
            ) : quickViewProduct ? (
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image panel */}
                <div className="relative bg-[#f3f6fa] min-h-[360px] lg:min-h-[640px]">
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
                      <button className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow flex items-center justify-center"
                        onClick={() => setActiveImageIndex((i) => (i === 0 ? modalImages.length - 1 : i - 1))} aria-label="Previous image">
                        <ChevronLeft className="h-5 w-5 text-[#0f2444]" />
                      </button>
                      <button className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow flex items-center justify-center"
                        onClick={() => setActiveImageIndex((i) => (i === modalImages.length - 1 ? 0 : i + 1))} aria-label="Next image">
                        <ChevronRight className="h-5 w-5 text-[#0f2444]" />
                      </button>
                    </>
                  )}
                </div>

                {/* Detail panel */}
                <div className="p-6 lg:p-8 xl:p-10">
                  <button className="ml-auto mb-2 hidden lg:flex h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 items-center justify-center text-[#0f2444]"
                    onClick={closeQuickView} aria-label="Close quick view">
                    <X className="h-5 w-5" />
                  </button>

                  <h3 className="text-4xl leading-tight font-extrabold text-[#0f2444]">{quickViewProduct.title}</h3>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="text-4xl font-black text-[#0f4d9a]">{quickViewProduct.currency?.symbol || "₹"}{Number(priceNow).toFixed(2)}</span>
                    {priceBase > priceNow && (
                      <span className="text-3xl text-gray-400 line-through">{quickViewProduct.currency?.symbol || "₹"}{Number(priceBase).toFixed(2)}</span>
                    )}
                    {modalDiscount > 0 && (
                      <span className="rounded-full bg-[#ff6f61] text-white text-base font-bold px-3 py-1">{modalDiscount}% Off</span>
                    )}
                  </div>

                  <p className="mt-5 text-xl leading-relaxed text-gray-700 line-clamp-4">
                    {quickViewProduct.short_description || quickViewProduct.description || "Product details available on full product page."}
                  </p>

                  {colorOptions.length > 0 && (
                    <div className="mt-6">
                      <p className="font-bold text-2xl text-[#0f2444]">Color: {selectedVariant?.attributes?.color || "-"}</p>
                      <div className="mt-3 flex items-center gap-3">
                        {colorOptions.map(([color, variant]) => (
                          <button key={color} onClick={() => setSelectedVariantId(variant.id)}
                            className={`h-10 w-10 rounded-full border-2 ${selectedVariant?.id === variant.id ? "border-[#0f4d9a]" : "border-gray-200"}`}
                            style={{ background: COLOR_MAP[color] ?? "#aaa" }} aria-label={`Select color ${color}`} />
                        ))}
                      </div>
                    </div>
                  )}

                  {sizeOptions.length > 0 && (
                    <div className="mt-6">
                      <p className="font-bold text-2xl text-[#0f2444]">Size: {selectedVariant?.attributes?.size || "-"}</p>
                      <div className="mt-3 flex items-center gap-3">
                        {sizeOptions.map(([size, variant]) => (
                          <button key={size} onClick={() => setSelectedVariantId(variant.id)}
                            className={`h-12 min-w-12 px-4 rounded-full border-2 text-lg font-semibold ${selectedVariant?.id === variant.id ? "border-[#0f4d9a] text-[#0f2444]" : "border-gray-200 text-gray-600"}`}>
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <div className="h-12 rounded-full bg-gray-100 px-3 flex items-center gap-4">
                      <button className="text-gray-700" onClick={() => setQty((q) => Math.max(stepQty, q - 1))} aria-label="Decrease quantity">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-8 text-center text-xl font-semibold">{qty}</span>
                      <button className="text-gray-700" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button onClick={addSelectedToCart} className="btn-brand h-12 rounded-full px-10 text-white text-lg font-semibold hover:opacity-95">
                      Add to cart
                    </button>
                    <button onClick={buyNow} className="btn-brand h-12 min-w-[320px] flex-1 rounded-full px-10 text-white text-lg font-semibold hover:opacity-95">
                      Buy It Now
                    </button>
                  </div>

                  <button onClick={() => { closeQuickView(); router.push(`/products/${product.slug}`); }}
                    className="mt-7 text-lg font-semibold text-[#0f4d9a] hover:text-[#49ad57] transition-colors">
                    View full details →
                  </button>
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
