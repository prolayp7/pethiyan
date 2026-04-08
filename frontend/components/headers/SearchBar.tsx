"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, TrendingUp, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const TOP_SEARCHES = [
  "Stand-Up Pouches",
  "Kraft Paper Bags",
  "Zip Lock Pouches",
  "Window Pouches",
  "Foil Pouches",
  "Custom Printed Bags",
  "Eco Packaging",
  "Resealable Pouches",
];

const HOT_PRODUCTS = [
  {
    id: 1,
    name: "Premium Stand-Up Kraft Pouch",
    price: "₹12.99",
    image: "/images/products/1.jpg",
    href: "/products/1",
  },
  {
    id: 2,
    name: "Foil Zip Lock Pouch",
    price: "₹9.99",
    image: "/images/products/2.jpg",
    href: "/products/2",
  },
  {
    id: 3,
    name: "Custom Window Bag",
    price: "₹8.49",
    image: "/images/products/3.jpg",
    href: "/products/3",
  },
  {
    id: 4,
    name: "Eco Kraft Paper Bag",
    price: "₹6.99",
    image: "/images/products/4.jpg",
    href: "/products/4",
  },
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  return (
    <div ref={overlayRef} className="w-full relative">
      {/* Search input */}
      <div
        className={cn(
          "relative flex items-center rounded-full border-2 transition-all duration-200",
          open || query
            ? "bg-white"
            : "border-gray-200 bg-gray-50 hover:border-gray-300"
        )}
        style={open || query ? {
          borderColor: "#2f6f9f",
          boxShadow: "0 0 0 3px rgba(47,111,159,0.15), 0 2px 8px rgba(23,57,111,0.12)",
        } : undefined}
      >
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search for products, packaging, pouches..."
          className="w-full pl-12 pr-12 py-2.5 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
          aria-label="Search products"
          autoComplete="off"
        />
        {(query || open) && (
          <button
            onClick={handleClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Expanded panel */}
      {open && (
        <div
          className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 z-200 overflow-hidden"
          style={{ minWidth: "100%" }}
        >
          <div className="flex divide-x divide-gray-100">
            {/* Left: Top Searches */}
            <div className="w-56 shrink-0 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-(--color-primary)" />
                <span className="text-xs font-bold tracking-widest text-gray-800 uppercase">
                  Top Searches
                </span>
              </div>
              <ul className="space-y-1">
                {TOP_SEARCHES.map((term) => (
                  <li key={term}>
                    <button
                      onMouseDown={() => {
                        setQuery(term);
                        setOpen(false);
                      }}
                      className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Hot Right Now */}
            <div className="flex-1 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-bold tracking-widest text-gray-800 uppercase">
                  Hot Right Now
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {HOT_PRODUCTS.map((product) => (
                  <Link
                    key={product.id}
                    href={product.href}
                    onMouseDown={() => setOpen(false)}
                    className="group text-center"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2 border border-gray-100 group-hover:border-(--color-primary)/30 transition-colors">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-xs text-gray-600 leading-snug line-clamp-2 group-hover:text-gray-900 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{product.price}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between bg-gray-50/60">
            <span className="text-xs text-gray-400">Press ESC to close</span>
            <Link
              href="/products"
              onMouseDown={() => setOpen(false)}
              className="text-sm font-medium text-(--color-primary) hover:underline flex items-center gap-1"
            >
              View all best sellers
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
