"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { X, Copy, Check } from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────────

const COUPON_CODE = "PACK20";
const DELAY_MS    = 2000;           // show after 2 s
const SESSION_KEY = "coupon_popup_dismissed";

const featuredProducts = [
  {
    id: 1,
    name: "Standup Pouch 500g",
    price: "₹ 120.00",
    image: "/images/products/1.jpg",
    href: "/products/standup-pouch-500g",
  },
  {
    id: 2,
    name: "Ziplock Bag 250g",
    price: "₹ 85.00",
    image: "/images/products/2.jpg",
    href: "/products/ziplock-bag-250g",
  },
  {
    id: 3,
    name: "Kraft Paper Bag",
    price: "₹ 60.00",
    image: "/images/products/3.jpg",
    href: "/products/kraft-paper-bag",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CouponPopup() {
  const [open,        setOpen]        = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [portalRoot,  setPortalRoot]  = useState<HTMLElement | null>(null);

  // Resolve portal root
  useEffect(() => {
    setPortalRoot(document.getElementById("portal-root"));
  }, []);

  // Open after delay, once per session
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  function close() {
    sessionStorage.setItem(SESSION_KEY, "1");
    setOpen(false);
  }

  function copyCode() {
    navigator.clipboard.writeText(COUPON_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!open || !portalRoot) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Special offer"
        className="absolute inset-0 flex items-center justify-center p-4"
      >
        <div
          className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col sm:flex-row bg-white"
          style={{ maxHeight: "90vh" }}
        >
          {/* Close button */}
          <button
            onClick={close}
            aria-label="Close popup"
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow transition-colors"
          >
            <X className="h-4 w-4 text-gray-700" />
          </button>

          {/* Left — image panel */}
          <div className="relative hidden sm:block sm:w-[42%] shrink-0">
            <Image
              src="/images/banners/1.jpg"
              alt="Special offer"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 0px, 340px"
              priority
            />
          </div>

          {/* Right — content panel */}
          <div className="flex-1 flex flex-col justify-center px-7 py-9 sm:px-8 overflow-y-auto">

            {/* Heading */}
            <h2 className="text-xl sm:text-2xl font-black tracking-widest uppercase text-gray-900 text-center mb-3">
              Special Picks For You
            </h2>

            {/* Subtitle */}
            <p className="text-sm text-gray-500 text-center leading-relaxed mb-5">
              We&apos;ve handpicked our best packaging products just for you.
              Use code <span className="font-bold text-gray-800">{COUPON_CODE}</span> for{" "}
              <span className="font-bold text-gray-800">20% OFF</span> your order today.
            </p>

            {/* Coupon code box */}
            <button
              onClick={copyCode}
              className="flex items-center justify-between gap-3 w-full max-w-xs mx-auto mb-6 px-5 py-3 rounded-full border-2 border-gray-900 hover:bg-gray-50 transition-colors group"
            >
              <span className="flex-1 text-center text-base font-black tracking-widest text-gray-900">
                {COUPON_CODE}
              </span>
              {copied
                ? <Check className="h-4 w-4 text-green-600 shrink-0" />
                : <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-800 shrink-0 transition-colors" />
              }
            </button>

            {/* Featured products */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {featuredProducts.map((p) => (
                <Link key={p.id} href={p.href} onClick={close} className="group text-center">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="100px"
                    />
                  </div>
                  <p className="text-[11px] font-semibold text-gray-800 leading-tight line-clamp-2 mb-0.5">
                    {p.name}
                  </p>
                  <p className="text-[11px] text-gray-500">{p.price}</p>
                </Link>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/shop"
              onClick={close}
              className="block w-full text-center bg-gray-900 hover:bg-gray-700 text-white text-sm font-bold py-3.5 rounded-lg transition-colors"
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
