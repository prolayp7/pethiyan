"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  ArrowRight,
  Package,
  Lock,
  Layers,
  Droplets,
  Wind,
  Palette,
  Leaf,
  Box,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Data ───────────────────────────────────────────────────── */

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop", hasMegaMenu: true },
  { label: "Categories", href: "/categories", hasMegaMenu: true },
  { label: "Custom Packaging", href: "/categories/custom-packaging" },
  { label: "Eco Packaging", href: "/categories/eco-packaging" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const sidebarCategories = [
  { label: "Stand-Up Pouches", href: "/categories/standup-pouches", icon: Package },
  { label: "Ziplock Bags", href: "/categories/ziplock-pouches", icon: Lock },
  { label: "Flat Bottom Bags", href: "/categories/flat-bottom-bags", icon: Box },
  { label: "Spout Pouches", href: "/categories/spout-pouches", icon: Droplets },
  { label: "Vacuum Pouches", href: "/categories/vacuum-pouches", icon: Wind },
  { label: "Window Bags", href: "/categories/window-bags", icon: Layers },
  { label: "Custom Packaging", href: "/categories/custom-packaging", icon: Palette },
  { label: "Eco Packaging", href: "/categories/eco-packaging", icon: Leaf },
];

const solutionColumns = [
  {
    heading: "Food Packaging",
    color: "#1f4f8a",
    links: [
      { label: "Snack Pouches", href: "/categories/snack-pouches" },
      { label: "Coffee Bags", href: "/categories/coffee-bags" },
      { label: "Dry Fruit Packaging", href: "/categories/dry-fruit" },
      { label: "Spice Packaging", href: "/categories/spice-packaging" },
      { label: "Pet Food Bags", href: "/categories/pet-food" },
      { label: "Tea Pouches", href: "/categories/tea-pouches" },
    ],
  },
  {
    heading: "Retail Packaging",
    color: "#0f2f5f",
    links: [
      { label: "Custom Printed Pouches", href: "/categories/custom-printing" },
      { label: "Display Pouches", href: "/categories/display-pouches" },
      { label: "Window Pouches", href: "/categories/window-pouches" },
      { label: "Matte Finish Bags", href: "/categories/matte-bags" },
      { label: "Glossy Pouches", href: "/categories/glossy-pouches" },
      { label: "Foil Bags", href: "/categories/foil-bags" },
    ],
  },
  {
    heading: "Eco & Industrial",
    color: "#4caf50",
    links: [
      { label: "Compostable Pouches", href: "/categories/compostable" },
      { label: "Recyclable Bags", href: "/categories/recyclable" },
      { label: "Kraft Packaging", href: "/categories/kraft" },
      { label: "Barrier Bags", href: "/categories/barrier-bags" },
      { label: "Vacuum Storage Bags", href: "/categories/vacuum-bags" },
      { label: "Bulk Packing Solutions", href: "/bulk" },
    ],
  },
  {
    heading: "Custom Services",
    color: "#2e7c8a",
    links: [
      { label: "Custom Printing", href: "/categories/custom-packaging" },
      { label: "Private Label Packaging", href: "/categories/private-label" },
      { label: "Bulk Orders", href: "/bulk" },
      { label: "Packaging Design Support", href: "/contact" },
      { label: "Sample Requests", href: "/contact" },
      { label: "Wholesale Pricing", href: "/bulk" },
    ],
  },
];

const promoCard = {
  image: "/images/banners/3.jpg",
  eyebrow: "New Collection",
  heading: "Custom Printed Pouches",
  subtext: "Fully branded packaging from design to delivery — 7-day turnaround.",
  cta: { label: "Start Your Order", href: "/categories/custom-packaging" },
};

const bestSellers = [
  { id: 1, image: "/images/products/1.jpg", name: "Stand-Up Pouch", price: "From $0.85", badge: "Best Seller" },
  { id: 2, image: "/images/products/2.jpg", name: "Kraft Paper Bag", price: "From $0.92", badge: "Eco Pick" },
  { id: 3, image: "/images/products/3.jpg", name: "Flat Bottom Bag", price: "From $1.10", badge: null },
  { id: 4, image: "/images/products/4.jpg", name: "Ziplock Pouch", price: "From $0.78", badge: "Popular" },
  { id: 5, image: "/images/products/5.jpg", name: "Spout Pouch", price: "From $1.25", badge: null },
  { id: 6, image: "/images/products/6.jpg", name: "Coffee Bag + Valve", price: "From $0.95", badge: "New" },
  { id: 7, image: "/images/products/7.jpg", name: "Window Pouch", price: "From $0.88", badge: null },
  { id: 8, image: "/images/products/8.jpg", name: "Vacuum Seal Bag", price: "From $0.72", badge: "Bulk Deal" },
];

/* ─── Component ──────────────────────────────────────────────── */

export default function NavigationMenu2() {
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 80);
  };

  return (
    <nav
      className="hidden lg:block bg-white relative"
      style={{
        borderBottom: megaOpen ? "1px solid #e2e8f0" : "1px solid #f1f5f9",
        zIndex: 40,
      }}
      aria-label="Main navigation"
    >
      {/* ── Nav bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center" role="menubar">
          {navItems.map((item) => (
            <li key={item.label} className="relative" role="none">
              {item.hasMegaMenu ? (
                <button
                  role="menuitem"
                  aria-haspopup="true"
                  aria-expanded={megaOpen}
                  className={cn(
                    "relative flex items-center gap-1 px-3.5 py-4 text-sm font-medium transition-colors duration-150 group"
                  )}
                  style={{ color: megaOpen ? "#1f4f8a" : "#374151" }}
                  onMouseEnter={handleEnter}
                  onMouseLeave={handleLeave}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      megaOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                  {/* Green underline indicator */}
                  <span
                    className="absolute bottom-0 inset-x-3.5 h-[2px] rounded-full transition-all duration-200"
                    style={{
                      background: "#4caf50",
                      transform: megaOpen ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "left",
                    }}
                    aria-hidden="true"
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  role="menuitem"
                  className="relative block px-3.5 py-4 text-sm font-medium text-gray-600 transition-colors duration-150 group whitespace-nowrap hover:text-[#1f4f8a]"
                >
                  {item.label}
                  <span
                    className="absolute bottom-0 inset-x-3.5 h-[2px] rounded-full bg-[#4caf50] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                    aria-hidden="true"
                  />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ════════════════════════════════════════════════════════
          MEGA MENU PANEL
      ════════════════════════════════════════════════════════ */}
      {megaOpen && (
        <div
          className="absolute top-full left-0 right-0 bg-white shadow-2xl"
          style={{
            zIndex: 50,
            borderTop: "2px solid #4caf50",
          }}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          role="region"
          aria-label="Categories mega menu"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* ── TOP SECTION: Sidebar + Solutions + Promo card ── */}
            <div className="flex gap-0">

              {/* LEFT SIDEBAR — with icons */}
              <div
                className="w-56 shrink-0 py-7 pr-5"
                style={{ borderRight: "1px solid #f1f5f9" }}
              >
                <p
                  className="text-[9px] font-black tracking-[0.25em] uppercase mb-4"
                  style={{ color: "#1f4f8a" }}
                >
                  Shop by Categories
                </p>
                <ul className="space-y-0.5">
                  {sidebarCategories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <li key={cat.label}>
                        <Link
                          href={cat.href}
                          className="group flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-gray-600 hover:bg-[#f0f7ff] hover:text-[#1f4f8a] transition-all duration-150"
                          onClick={() => setMegaOpen(false)}
                        >
                          <span
                            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors duration-150"
                            style={{
                              background: "rgba(31,79,138,0.07)",
                            }}
                          >
                            <Icon
                              className="h-3.5 w-3.5 transition-colors duration-150 group-hover:text-[#1f4f8a]"
                              style={{ color: "rgba(31,79,138,0.55)" }}
                              aria-hidden="true"
                            />
                          </span>
                          <span className="font-medium text-[13px]">{cat.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-5 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
                  <Link
                    href="/shop"
                    className="group flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-xs font-bold text-white transition-all duration-200 hover:shadow-lg"
                    style={{ background: "#4caf50" }}
                    onClick={() => setMegaOpen(false)}
                  >
                    <span>All Packaging</span>
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>

              {/* CENTER — 4 solution columns */}
              <div className="flex-1 py-7 px-7">
                <p
                  className="text-[9px] font-black tracking-[0.25em] uppercase mb-5"
                  style={{ color: "#1f4f8a" }}
                >
                  Shop by Solutions
                </p>
                <div className="grid grid-cols-4 gap-5">
                  {solutionColumns.map((col) => (
                    <div key={col.heading}>
                      <div className="flex items-center gap-1.5 mb-3">
                        <span
                          className="w-2 h-2 rounded-sm shrink-0"
                          style={{ background: col.color }}
                          aria-hidden="true"
                        />
                        <p
                          className="text-[10px] font-black tracking-[0.15em] uppercase"
                          style={{ color: col.color }}
                        >
                          {col.heading}
                        </p>
                      </div>
                      <ul className="space-y-1.5">
                        {col.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              className="text-[12px] text-gray-500 hover:text-[#1f4f8a] transition-colors duration-150 block leading-snug"
                              onClick={() => setMegaOpen(false)}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — Promo card */}
              <div
                className="w-[200px] shrink-0 py-7 pl-5"
                style={{ borderLeft: "1px solid #f1f5f9" }}
              >
                <Link
                  href={promoCard.cta.href}
                  className="group block rounded-xl overflow-hidden h-full"
                  style={{ background: "#0f2f5f" }}
                  onClick={() => setMegaOpen(false)}
                >
                  {/* Image */}
                  <div className="relative w-full h-[140px] overflow-hidden">
                    <Image
                      src={promoCard.image}
                      alt={promoCard.heading}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="200px"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to bottom, transparent 50%, rgba(15,47,95,0.7) 100%)",
                      }}
                      aria-hidden="true"
                    />
                    {/* Badge */}
                    <span
                      className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "#4caf50", color: "white" }}
                    >
                      {promoCard.eyebrow}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-3.5">
                    <p className="text-[12px] font-bold text-white leading-snug mb-1.5">
                      {promoCard.heading}
                    </p>
                    <p className="text-[10px] text-white/50 leading-snug mb-3">
                      {promoCard.subtext}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full transition-all duration-200 group-hover:gap-2"
                      style={{ background: "#4caf50", color: "white" }}
                    >
                      {promoCard.cta.label}
                      <ArrowRight className="h-2.5 w-2.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </div>

            </div>

            {/* ── BOTTOM — Dark best-sellers strip ── */}
            <div
              className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-5"
              style={{ background: "#0f2f5f" }}
            >
              {/* Header */}
              <div className="max-w-7xl mx-auto flex items-center justify-between mb-4">
                <p className="text-[9px] font-black tracking-[0.25em] uppercase text-white/50">
                  Best Sellers
                </p>
                <Link
                  href="/best-sellers"
                  className="text-[11px] font-semibold flex items-center gap-1 hover:text-white transition-colors"
                  style={{ color: "#4caf50" }}
                  onClick={() => setMegaOpen(false)}
                >
                  View all
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>

              {/* Product cards — white cards on dark strip */}
              <div className="flex items-start gap-3 overflow-x-auto pb-1 max-w-7xl mx-auto" style={{ scrollbarWidth: "none" }}>
                {bestSellers.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group shrink-0 w-[120px] bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
                    onClick={() => setMegaOpen(false)}
                  >
                    {/* Image */}
                    <div className="relative w-full h-[90px] bg-gray-50 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="120px"
                      />
                      {product.badge && (
                        <span
                          className="absolute top-1.5 left-1.5 text-[7px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{
                            background:
                              product.badge === "Eco Pick"
                                ? "#4caf50"
                                : product.badge === "New"
                                ? "#1f4f8a"
                                : "rgba(15,47,95,0.85)",
                            color: "white",
                          }}
                        >
                          {product.badge}
                        </span>
                      )}
                    </div>
                    {/* Text */}
                    <div className="px-2 py-2">
                      <p className="text-[11px] font-semibold text-gray-800 truncate leading-tight group-hover:text-[#1f4f8a] transition-colors">
                        {product.name}
                      </p>
                      <p className="text-[11px] font-bold mt-0.5" style={{ color: "#4caf50" }}>
                        {product.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
