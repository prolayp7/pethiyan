"use client";

import { useState, useEffect, useMemo, type CSSProperties } from "react";
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
  Store,
  Palette,
  Layers,
  Trash2,
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
  addToWishlist,
  getWishlistItems,
  removeWishlistItem,
  getProductReviews,
  getProductFaqs,
} from "@/lib/api";

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
    silver: "#c0c0c0",
    gold: "#d4af37",
  };

  if (normalized === "colorful" || normalized === "multicolor" || normalized === "multi color") {
    return { background: "conic-gradient(#0ea5e9, #22c55e, #eab308, #ef4444, #8b5cf6, #0ea5e9)" };
  }

  return { background: palette[normalized] ?? "#94a3b8" };
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
        onMouseLeave={() => setZoomed(false)}
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
              className={`object-contain transition-transform duration-500 ${zoomed ? "scale-110" : "scale-100"}`}
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
}

export default function ProductDetailClient({ product, reviews: initialReviews, faqs: initialFaqs }: ProductDetailClientProps) {
  const { addItem, openCart, items } = useCart();
  const { isLoggedIn } = useAuth();
  const { isWishlisted, add, remove } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();

  const [reviews, setReviews] = useState<ApiReview[]>(initialReviews ?? []);
  const [faqs, setFaqs] = useState<ApiFaq[]>(initialFaqs ?? []);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [qty, setQty] = useState(Math.max(product.policies?.minimum_order_quantity ?? 1, 1));
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews" | "faqs">("description");

  const productName = product.title ?? "Product";
  const variantList = useMemo(() => product.variants ?? [], [product.variants]);

  useEffect(() => {
    if (initialReviews.length === 0) {
      getProductReviews(product.slug).then((data) => setReviews(data));
    }
    if (initialFaqs.length === 0) {
      getProductFaqs(product.slug).then((data) => setFaqs(data));
    }
  }, [product.slug, initialReviews.length, initialFaqs.length]);

  const selectedVariantIdSafe = useMemo(() => {
    if (variantList.length === 0) return null;
    if (selectedVariantId && variantList.some((v) => v.id === selectedVariantId)) return selectedVariantId;
    const def = variantList.find((v) => v.is_default);
    return def?.id ?? variantList[0].id;
  }, [selectedVariantId, variantList]);

  const selectedVariant: RealApiVariant | undefined = useMemo(() => {
    if (!selectedVariantIdSafe) return variantList[0];
    return variantList.find((v) => v.id === selectedVariantIdSafe) ?? variantList[0];
  }, [variantList, selectedVariantIdSafe]);

  const selectedVariantStorePricing = useMemo(
    () => selectedVariant?.store_pricing ?? [],
    [selectedVariant?.store_pricing]
  );

  const selectedStoreIdSafe = useMemo(() => {
    if (selectedVariantStorePricing.length === 0) return null;
    if (selectedStoreId && selectedVariantStorePricing.some((s) => s.store_id === selectedStoreId)) return selectedStoreId;
    const firstInStock = selectedVariantStorePricing.find((s) => s.stock_status === "in_stock" && s.stock > 0);
    return firstInStock?.store_id ?? selectedVariantStorePricing[0].store_id;
  }, [selectedStoreId, selectedVariantStorePricing]);

  const selectedStorePricing: RealApiStorePricing | undefined = useMemo(() => {
    if (!selectedStoreIdSafe) return selectedVariantStorePricing[0];
    return selectedVariantStorePricing.find((s) => s.store_id === selectedStoreIdSafe) ?? selectedVariantStorePricing[0];
  }, [selectedVariantStorePricing, selectedStoreIdSafe]);

  const colorOptions = useMemo(() => {
    const map = new Map<string, number>();
    variantList.forEach((variant) => {
      const color = variant.attributes?.color;
      if (color && !map.has(color)) map.set(color, variant.id);
    });
    return Array.from(map.entries()).map(([color, variantId]) => ({ color, variantId }));
  }, [variantList]);

  const galleryImages = useMemo(() => {
    return uniqueStrings([
      selectedVariant?.image,
      product.images?.main_image,
      ...(product.images?.additional_images ?? []),
      ...(product.images?.variant_images ?? []),
      ...(product.images?.all ?? []),
    ]);
  }, [selectedVariant?.image, product.images]);

  const basePrice = toNum(selectedStorePricing?.price ?? selectedStorePricing?.special_price ?? 0);
  const effectivePrice = toNum(selectedStorePricing?.special_price ?? selectedStorePricing?.price ?? 0);
  const hasDiscount = basePrice > 0 && effectivePrice > 0 && effectivePrice < basePrice;
  const discount = hasDiscount ? Math.round(((basePrice - effectivePrice) / basePrice) * 100) : null;

  const stockQty = selectedStorePricing?.stock ?? 0;
  const inStock = (selectedStorePricing?.stock_status === "in_stock") && stockQty > 0;
  const lowStock = inStock && stockQty <= 10;

  const currencySymbol = product.currency?.symbol ?? "₹";

  const moq = Math.max(product.policies?.minimum_order_quantity ?? 1, 1);
  const stepSize = Math.max(product.policies?.quantity_step_size ?? 1, 1);

  const qtySafe = Math.max(qty, moq);

  const rating = 0;
  const reviewCount = reviews.length;

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
    const addCalls = existsInCart
      ? safeQty
      : Math.max(safeQty - moq + 1, 1);

    for (let i = 0; i < addCalls; i++) {
      addItem({
        id: itemId,
        productId: product.id,
        slug: product.slug,
        variantId: selectedVariant.id,
        variantLabel: selectedVariant.title,
        minQty: moq,
        name: selectedVariant.title || productName,
        price: effectivePrice,
        image: selectedVariant.image || product.images?.main_image || null,
        currencySymbol,
        weight: selectedVariant.weight ?? undefined,
        weightUnit: selectedVariant.weight_unit ?? undefined,
        storeId: selectedStoreIdSafe ?? undefined,
      });
    }

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
  const customStateForTax = product.tax?.customer_state_code;
  const displayTitle = selectedVariant?.title?.trim() || productName;
  const wishlisted = isWishlisted(product.id);

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(pathname || `/products/${product.slug}`)}`);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <Gallery
            key={`gallery-${selectedVariant?.id ?? "base"}`}
            images={galleryImages}
            name={productName}
            videoUrl={isVideoLink(product.video?.video_link) ? product.video.video_link : null}
          />

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
            <p className="text-[11px] text-gray-400 mt-0.5">Inclusive of all taxes. GST invoice available.</p>

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

            {colorOptions.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-semibold text-(--color-secondary) mb-2 flex items-center gap-2">
                  <Palette className="h-4 w-4" /> Color
                </p>
                <p className="text-2xl font-bold text-(--color-secondary) mb-3">
                  Color: {selectedVariant?.attributes?.color || colorOptions[0]?.color || "-"}
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                  {colorOptions.map((opt) => {
                    const selected = selectedVariant?.id === opt.variantId;
                    return (
                      <button
                        key={`${opt.color}-${opt.variantId}`}
                        onClick={() => setSelectedVariantId(opt.variantId)}
                        className={`h-10 w-10 rounded-full border-2 transition-all ${
                          selected
                            ? "border-(--color-primary) shadow-[0_0_0_2px_rgba(31,79,138,0.18)]"
                            : "border-(--color-border) hover:border-(--color-primary)/60"
                        }`}
                        style={colorSwatchStyle(opt.color)}
                        aria-pressed={selected}
                        aria-label={`Select color ${opt.color}`}
                        title={opt.color}
                      >
                        <span className="sr-only">{opt.color}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {variantList.length > 0 && (
              <div className="space-y-3 mt-5">
                <p className="text-sm font-semibold text-(--color-secondary) flex items-center gap-2">
                  <Layers className="h-4 w-4" /> Product Variants
                </p>
                <div className="grid gap-2 max-h-44 overflow-auto pr-1">
                  {variantList.map((variant) => {
                    const selected = selectedVariant?.id === variant.id;
                    const attributeLabel = Object.entries(variant.attributes ?? {})
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" | ");
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`text-left border rounded-xl p-3 transition-all ${
                          selected
                            ? "border-(--color-primary) bg-(--color-primary)/5"
                            : "border-(--color-border) hover:border-(--color-primary)/50"
                        }`}
                        aria-pressed={selected}
                      >
                        <p className="text-sm font-semibold text-(--color-secondary)">{variant.title}</p>
                        {attributeLabel && <p className="text-xs text-gray-500 mt-0.5">{attributeLabel}</p>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedVariantStorePricing.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-semibold text-(--color-secondary) mb-2 flex items-center gap-2">
                  <Store className="h-4 w-4" /> Store-wise Pricing
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedVariantStorePricing.map((store) => {
                    const selected = selectedStorePricing?.store_id === store.store_id;
                    return (
                      <button
                        key={store.store_id}
                        onClick={() => setSelectedStoreId(store.store_id)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                          selected
                            ? "border-(--color-primary) bg-(--color-primary) text-white"
                            : "border-(--color-border) text-(--color-secondary) hover:border-(--color-primary)/60"
                        }`}
                        aria-pressed={selected}
                      >
                        {store.store_name}
                      </button>
                    );
                  })}
                </div>

                {selectedStorePricing && (
                  <div className="border border-(--color-border) rounded-xl p-3 bg-(--color-muted)">
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div>
                        <p className="text-gray-500">Store</p>
                        <p className="font-semibold text-(--color-secondary)">{selectedStorePricing.store_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">State</p>
                        <p className="font-semibold text-(--color-secondary)">
                          {selectedStorePricing.store_state_name} ({selectedStorePricing.store_state_code})
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">SKU</p>
                        <p className="font-semibold text-(--color-secondary)">{selectedStorePricing.sku || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Stock</p>
                        <p className="font-semibold text-(--color-secondary)">
                          {selectedStorePricing.stock} ({selectedStorePricing.stock_status.replace("_", " ")})
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-(--color-border) pt-2">
                      <div>
                        <p className="text-gray-500">Taxable Amount</p>
                        <p className="font-semibold text-(--color-secondary)">{formatCurrency(selectedStorePricing.gst?.taxable_amount, currencySymbol)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">GST Type</p>
                        <p className="font-semibold text-(--color-secondary) uppercase">{selectedStorePricing.gst?.gst_type || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">CGST</p>
                        <p className="font-semibold text-(--color-secondary)">
                          {selectedStorePricing.gst?.cgst_rate ?? 0}% ({formatCurrency(selectedStorePricing.gst?.cgst_amount, currencySymbol)})
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">SGST</p>
                        <p className="font-semibold text-(--color-secondary)">
                          {selectedStorePricing.gst?.sgst_rate ?? 0}% ({formatCurrency(selectedStorePricing.gst?.sgst_amount, currencySymbol)})
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">IGST</p>
                        <p className="font-semibold text-(--color-secondary)">
                          {selectedStorePricing.gst?.igst_rate ?? 0}% ({formatCurrency(selectedStorePricing.gst?.igst_amount, currencySymbol)})
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total GST</p>
                        <p className="font-semibold text-(--color-secondary)">{formatCurrency(selectedStorePricing.gst?.total_tax_amount, currencySymbol)}</p>
                      </div>
                    </div>

                    <div className="border-t border-(--color-border) mt-2 pt-2 flex justify-between items-center">
                      <p className="text-xs text-gray-500">Final Amount</p>
                      <p className="text-sm font-bold text-(--color-primary)">{formatCurrency(selectedStorePricing.gst?.total_amount ?? effectivePrice, currencySymbol)}</p>
                    </div>

                    {customStateForTax && (
                      <p className="text-[11px] text-gray-500 mt-2">
                        Customer State for GST split: <strong>{customStateForTax}</strong>
                      </p>
                    )}
                  </div>
                )}
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
                    ? `${(inGrams / 1000).toFixed(2).replace(/\.?0+$/, "")} kg`
                    : `${inGrams} g`;
                  return <span className="ml-2 text-gray-400">· Total weight: <strong className="text-gray-600">{display}</strong></span>;
                })()}
              </p>
            )}

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { icon: Truck, label: "Free Shipping", sub: `Orders above ${currencySymbol}999` },
                { icon: RotateCcw, label: "7-Day Returns", sub: "Hassle-free" },
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

            {activeTab === "faqs" && <FaqsTab faqs={faqs} />}
          </div>
        </div>
      </div>
    </Container>
  );
}
