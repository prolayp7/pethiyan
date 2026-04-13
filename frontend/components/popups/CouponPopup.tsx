"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { X, Copy, Check } from "lucide-react";
import { getPromoPopup, type ApiPromoPopupData } from "@/lib/api";

const DELAY_MS = 2000;
const DISMISS_COOKIE = "promo_popup_dismissed";
const DISMISS_DAYS = 3;
const FALLBACK_IMAGE = "/images/banners/1.jpg";

function hasDismissedPopupCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie.includes(`${DISMISS_COOKIE}=1`);
}

function setDismissedPopupCookie() {
  const expires = new Date(Date.now() + DISMISS_DAYS * 864e5).toUTCString();
  document.cookie = `${DISMISS_COOKIE}=1; expires=${expires}; path=/; SameSite=Lax`;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function buildMessage(popup: ApiPromoPopupData) {
  const description = popup.promo.description?.trim();
  const promoLine = `Use code ${popup.promo.code} for ${popup.promo.discount_label} on your order today.`;

  if (!description) {
    return `We've handpicked some packaging products for you. ${promoLine}`;
  }

  return `${description} ${promoLine}`;
}

export default function CouponPopup() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [popup, setPopup] = useState<ApiPromoPopupData | null>(null);
  const portalRoot = typeof document !== "undefined"
    ? document.getElementById("portal-root")
    : null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasDismissedPopupCookie()) return;

    let cancelled = false;
    let timeoutId: number | null = null;

    const loadPopup = async () => {
      const data = await getPromoPopup();
      if (cancelled || !data) return;

      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        setPopup(data);
        setOpen(true);
      }, DELAY_MS);
    };

    void loadPopup();

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  function close() {
    if (typeof window !== "undefined") {
      setDismissedPopupCookie();
    }
    setOpen(false);
  }

  function copyCode() {
    if (!popup) return;

    navigator.clipboard.writeText(popup.promo.code).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!open || !portalRoot || !popup) return null;

  return createPortal(
    <>
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Special offer"
        className="absolute inset-0 flex items-center justify-center p-4"
      >
        <div
          className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:flex-row"
        >
          <button
            onClick={close}
            aria-label="Close popup"
            className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition-colors hover:bg-white"
          >
            <X className="h-4 w-4 text-gray-700" />
          </button>

          <div className="relative hidden shrink-0 sm:block sm:w-[42%]">
            <Image
              src={FALLBACK_IMAGE}
              alt="Special offer"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 0px, 340px"
              priority
            />
          </div>

          <div className="flex flex-1 flex-col justify-center overflow-y-auto px-7 py-9 sm:px-8">
            <h2 className="mb-3 text-center text-xl font-black uppercase tracking-widest text-gray-900 sm:text-2xl">
              Special Picks For You
            </h2>

            <p className="mb-5 text-center text-sm leading-relaxed text-gray-500">
              {buildMessage(popup)}
            </p>

            <button
              onClick={copyCode}
              className="group mx-auto mb-6 flex w-full max-w-xs items-center justify-between gap-3 rounded-full border-2 border-gray-900 px-5 py-3 transition-colors hover:bg-gray-50"
            >
              <span className="flex-1 text-center text-base font-black tracking-widest text-gray-900">
                {popup.promo.code}
              </span>
              {copied ? (
                <Check className="h-4 w-4 shrink-0 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 shrink-0 text-gray-500 transition-colors group-hover:text-gray-800" />
              )}
            </button>

            {popup.products.length > 0 && (
              <div className="mb-6 grid grid-cols-3 gap-3">
                {popup.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={close}
                    className="group text-center"
                  >
                    <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-gray-100">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="120px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[11px] font-semibold text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <p className="mb-0.5 line-clamp-2 text-[11px] leading-tight font-semibold text-gray-800">
                      {product.title}
                    </p>
                    <p className="text-[11px] text-gray-500">{formatPrice(product.price)}</p>
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/shop"
              onClick={close}
              className="block w-full rounded-lg bg-gray-900 py-3.5 text-center text-sm font-bold text-white transition-colors hover:bg-gray-700"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </>,
    portalRoot
  );
}
