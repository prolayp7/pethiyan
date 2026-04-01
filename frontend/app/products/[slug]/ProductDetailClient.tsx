"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
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
} from "lucide-react";
import Container from "@/components/layout/Container";
import { useCart } from "@/context/CartContext";
import {
  getProductVariants,
  toNum,
  type ApiProduct,
  type ApiReview,
  type ApiFaq,
  type ApiVariantAttribute,
  type ApiProductVariant,
} from "@/lib/api";

// ─── Gallery ──────────────────────────────────────────────────────────────────

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

  const allThumbs = [
    ...images.map((src) => ({ type: "image" as const, src })),
    ...(videoUrl ? [{ type: "video" as const, src: videoUrl }] : []),
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
      {/* Main image */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-(--color-border) cursor-zoom-in group"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        {isVideo ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <video
              src={allThumbs[active].src}
              controls
              className="max-h-full max-w-full"
            />
          </div>
        ) : (
          <>
            <Image
              src={images[active] ?? images[0]}
              alt={`${name} — image ${active + 1}`}
              fill
              className={`object-contain transition-transform duration-500 ${
                zoomed ? "scale-110" : "scale-100"
              }`}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {/* Zoom hint */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/50 text-white rounded-full p-1.5">
                <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {allThumbs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Product images">
          {allThumbs.map((thumb, i) => (
            <button
              key={i}
              role="listitem"
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
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const cls = size === "lg" ? "h-5 w-5" : size === "md" ? "h-4 w-4" : "h-3 w-3";
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${cls} ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : i < rating ? "fill-amber-200 text-amber-400" : "text-gray-200"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// ─── Variant Selector ─────────────────────────────────────────────────────────

function VariantSelector({
  attributes,
  variants,
  selected,
  onSelect,
}: {
  attributes: ApiVariantAttribute[];
  variants: ApiProductVariant[];
  selected: Record<number, number>;
  onSelect: (attrId: number, valueId: number) => void;
}) {
  if (attributes.length === 0) return null;

  // Check if a value is in stock for a given attribute when combined with current selections
  const isValueAvailable = (attrId: number, valueId: number): boolean => {
    const testSelection = { ...selected, [attrId]: valueId };
    return variants.some((v) =>
      v.attribute_values.every(
        (av) =>
          testSelection[av.attribute_id] === undefined ||
          testSelection[av.attribute_id] === av.value_id
      ) && (v.stock == null || v.stock > 0)
    );
  };

  return (
    <div className="space-y-4 mt-5">
      {attributes.map((attr) => {
        const selectedValue = attr.values.find((v) => v.id === selected[attr.id]);
        return (
          <div key={attr.id}>
            <p className="text-sm font-semibold text-(--color-secondary) mb-2">
              {attr.name}
              {selectedValue && (
                <span className="font-normal text-(--color-primary) ml-1.5">
                  : {selectedValue.value}
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {attr.values.map((val) => {
                const isSelected = selected[attr.id] === val.id;
                const available = isValueAvailable(attr.id, val.id);
                return (
                  <button
                    key={val.id}
                    onClick={() => available && onSelect(attr.id, val.id)}
                    disabled={!available}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
                      isSelected
                        ? "border-(--color-primary) bg-(--color-primary) text-white"
                        : available
                        ? "border-(--color-border) text-(--color-secondary) hover:border-(--color-primary)/60"
                        : "border-gray-100 text-gray-300 cursor-not-allowed line-through"
                    }`}
                    aria-pressed={isSelected}
                    aria-disabled={!available}
                  >
                    {val.value}
                    {val.price_modifier && val.price_modifier > 0 && (
                      <span className="ml-1 text-[10px] opacity-70">+₹{val.price_modifier}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Reviews tab ──────────────────────────────────────────────────────────────

function ReviewsTab({ reviews, rating }: { reviews: ApiReview[]; rating: number }) {
  // Star distribution
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));
  const maxCount = Math.max(...dist.map((d) => d.count), 1);

  return (
    <div>
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-8 mb-8 p-6 bg-(--color-muted) rounded-2xl">
          {/* Average */}
          <div className="text-center shrink-0">
            <p className="text-5xl font-extrabold text-(--color-primary)">{rating.toFixed(1)}</p>
            <StarRating rating={rating} size="md" />
            <p className="text-xs text-gray-500 mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          </div>
          {/* Distribution */}
          <div className="flex-1 space-y-1.5">
            {dist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-3">{star}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" aria-hidden="true" />
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
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
                  <span className="text-sm font-semibold text-(--color-secondary)">
                    {r.user?.name ?? "Verified Buyer"}
                  </span>
                  <StarRating rating={r.rating} />
                  <span className="text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
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

// ─── FAQs tab ─────────────────────────────────────────────────────────────────

function FaqsTab({ faqs }: { faqs: ApiFaq[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (faqs.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12 text-sm">
        No FAQs for this product.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {faqs.map((faq) => {
        const isOpen = open === faq.id;
        return (
          <div
            key={faq.id}
            className="border border-(--color-border) rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpen(isOpen ? null : faq.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-(--color-muted) transition-colors"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-(--color-secondary) pr-4">
                {faq.question}
              </span>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
              )}
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-(--color-border) pt-4">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page skeleton ─────────────────────────────────────────────────────────────

function ProductSkeleton() {
  return (
    <Container>
      <div className="py-10 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square rounded-2xl bg-gray-100" />
          <div className="space-y-4">
            <div className="h-3 w-24 bg-gray-100 rounded-full" />
            <div className="h-8 w-3/4 bg-gray-100 rounded-full" />
            <div className="h-4 w-32 bg-gray-100 rounded-full" />
            <div className="h-10 w-28 bg-gray-100 rounded-full" />
            <div className="space-y-2 mt-4">
              <div className="h-4 w-full bg-gray-100 rounded-full" />
              <div className="h-4 w-5/6 bg-gray-100 rounded-full" />
            </div>
            <div className="h-12 w-full bg-gray-100 rounded-xl mt-6" />
          </div>
        </div>
      </div>
    </Container>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductDetailClientProps {
  product: ApiProduct;
  reviews: ApiReview[];
  faqs: ApiFaq[];
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function ProductDetailClient({
  product,
  reviews,
  faqs,
}: ProductDetailClientProps) {
  const { addItem, openCart } = useCart();

  // Variant state
  const [attributes, setAttributes] = useState<ApiVariantAttribute[]>([]);
  const [variants, setVariants] = useState<ApiProductVariant[]>([]);
  const [selectedAttrs, setSelectedAttrs] = useState<Record<number, number>>({});
  const [variantsLoading, setVariantsLoading] = useState(false);

  // UI state
  const moq = product.min_order_qty ?? 1;
  const [qty, setQty] = useState(moq);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews" | "faqs">(
    "description"
  );

  // Fetch variants
  useEffect(() => {
    setVariantsLoading(true);
    getProductVariants(product.slug).then(({ attributes: attrs, variants: vars }) => {
      setAttributes(attrs);
      setVariants(vars);
      // Pre-select first value of each attribute
      const defaults: Record<number, number> = {};
      attrs.forEach((a) => {
        if (a.values.length > 0) defaults[a.id] = a.values[0].id;
      });
      setSelectedAttrs(defaults);
      setVariantsLoading(false);
    });
  }, [product.slug]);

  // Compute active variant
  const activeVariant = variants.find((v) =>
    v.attribute_values.every(
      (av) => selectedAttrs[av.attribute_id] === av.value_id
    )
  );

  // Price: prefer active variant price > sale_price > price
  const basePrice = toNum(product.sale_price ?? product.price);
  const effectivePrice = activeVariant?.price ?? basePrice;
  const comparePrice = toNum(product.compare_price);
  const hasDiscount = comparePrice > effectivePrice;
  const discount = hasDiscount
    ? Math.round(((comparePrice - effectivePrice) / comparePrice) * 100)
    : null;

  // Stock
  const stockQty = activeVariant?.stock ?? product.stock;
  const inStock = stockQty == null || stockQty > 0;
  const lowStock = stockQty != null && stockQty > 0 && stockQty <= 10;

  // Gallery images
  const images = product.images?.length
    ? product.images
    : product.thumbnail
    ? [product.thumbnail]
    : [];

  const rating = product.rating ?? 0;
  const reviewCount = product.reviews_count ?? reviews.length;

  const handleAttrSelect = useCallback((attrId: number, valueId: number) => {
    setSelectedAttrs((prev) => ({ ...prev, [attrId]: valueId }));
  }, []);

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem({
      id: activeVariant ? `${product.id}-${activeVariant.id}` : String(product.id),
      name: product.name,
      price: effectivePrice,
      image: product.thumbnail ?? undefined,
    });
    // Cart addItem adds qty=1 each call — call qty times
    for (let i = 1; i < qty; i++) {
      addItem({
        id: activeVariant ? `${product.id}-${activeVariant.id}` : String(product.id),
        name: product.name,
        price: effectivePrice,
        image: product.thumbnail ?? undefined,
      });
    }
    setAddedToCart(true);
    openCart();
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const tabs = [
    { key: "description" as const, label: "Description" },
    ...(product.specifications?.length
      ? [{ key: "specs" as const, label: "Specifications" }]
      : []),
    { key: "reviews" as const, label: `Reviews (${reviewCount})` },
    { key: "faqs" as const, label: `FAQs (${faqs.length})` },
  ];

  return (
    <Container>
      <div className="py-10">
        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* Left — Gallery */}
          <Gallery images={images} name={product.name} videoUrl={product.video_url} />

          {/* Right — Info */}
          <div className="flex flex-col">

            {/* Category + Brand chips */}
            <div className="flex items-center flex-wrap gap-2 mb-3">
              {product.category && (
                <span className="text-xs font-semibold text-(--color-primary) bg-(--color-primary)/10 px-2.5 py-1 rounded-full">
                  {product.category.name}
                </span>
              )}
              {product.brand && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {product.brand.name}
                </span>
              )}
            </div>

            {/* Product name (h1 is in the page layout via JSON-LD/meta, use h2 visually) */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-(--color-secondary) leading-tight">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <StarRating rating={rating} size="md" />
              <span className="text-sm text-gray-500">
                {rating.toFixed(1)} &nbsp;({reviewCount} review{reviewCount !== 1 ? "s" : ""})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-extrabold text-(--color-primary)">
                ₹{effectivePrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{comparePrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Inclusive of all taxes. GST invoice available.</p>

            {/* Short description */}
            {product.short_description && (
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Stock badge */}
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

            {/* Variant selector */}
            {!variantsLoading && attributes.length > 0 && (
              <VariantSelector
                attributes={attributes}
                variants={variants}
                selected={selectedAttrs}
                onSelect={handleAttrSelect}
              />
            )}

            {/* MOQ notice */}
            {moq > 1 && (
              <p className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Minimum order quantity: <strong>{moq} units</strong>
              </p>
            )}

            <hr className="my-5 border-(--color-border)" />

            {/* Qty + Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Qty selector */}
              <div
                className="flex items-center border border-(--color-border) rounded-xl overflow-hidden bg-white"
                aria-label="Quantity selector"
              >
                <button
                  onClick={() => setQty((q) => Math.max(moq, q - 1))}
                  disabled={qty <= moq}
                  className="w-10 h-11 flex items-center justify-center hover:bg-(--color-muted) transition-colors disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <span className="w-10 text-center text-sm font-semibold tabular-nums">
                  {qty}
                </span>
                <button
                  onClick={() =>
                    setQty((q) => (stockQty != null ? Math.min(stockQty, q + 1) : q + 1))
                  }
                  disabled={stockQty != null && qty >= stockQty}
                  className="w-10 h-11 flex items-center justify-center hover:bg-(--color-muted) transition-colors disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  addedToCart
                    ? "bg-green-500 text-white scale-95"
                    : !inStock
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-(--color-primary) text-white hover:bg-(--color-primary-dark) shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                }`}
                aria-label={addedToCart ? "Added to cart" : `Add ${product.name} to cart`}
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                {addedToCart ? "Added to Cart!" : "Add to Cart"}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setWishlisted((w) => !w)}
                className="w-11 h-11 rounded-xl border border-(--color-border) flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-colors"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wishlisted}
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            {/* Line total */}
            {qty > 1 && (
              <p className="mt-2 text-xs text-gray-500">
                Total:{" "}
                <strong className="text-(--color-primary)">
                  ₹{(effectivePrice * qty).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </strong>{" "}
                for {qty} units
              </p>
            )}

            {/* Trust badges */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { icon: Truck, label: "Free Shipping", sub: "Orders above ₹999" },
                { icon: RotateCcw, label: "7-Day Returns", sub: "Hassle-free" },
                { icon: Shield, label: "Secure Payment", sub: "SSL encrypted" },
                { icon: FileText, label: "GST Invoice", sub: "On every order" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white border border-(--color-border)"
                >
                  <Icon className="h-4 w-4 text-(--color-primary) mb-1" aria-hidden="true" />
                  <span className="text-[11px] font-semibold text-(--color-secondary) leading-snug">{label}</span>
                  <span className="text-[10px] text-gray-400 leading-snug">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-14">
          {/* Tab bar */}
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

          {/* Tab content */}
          <div className="pt-8 pb-4" role="tabpanel">
            {activeTab === "description" && (
              <div className="prose prose-sm max-w-none text-gray-600">
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : product.short_description ? (
                  <p>{product.short_description}</p>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    No description available.
                  </p>
                )}
              </div>
            )}

            {activeTab === "specs" && product.specifications && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-(--color-muted)" : "bg-white"}>
                        <td className="px-4 py-3 font-semibold text-(--color-secondary) w-1/3 rounded-l-lg">
                          {spec.key}
                        </td>
                        <td className="px-4 py-3 text-gray-600 rounded-r-lg">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <ReviewsTab reviews={reviews} rating={rating} />
            )}

            {activeTab === "faqs" && <FaqsTab faqs={faqs} />}
          </div>
        </div>
      </div>
    </Container>
  );
}
