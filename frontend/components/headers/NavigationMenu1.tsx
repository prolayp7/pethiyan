"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ArrowRight, Package } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Data ───────────────────────────────────────────────────── */

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories", hasMegaMenu: true },
  { label: "Custom Packaging", href: "/categories/custom-packaging" },
  { label: "Eco Packaging", href: "/categories/eco-packaging" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Bulk Orders", href: "/bulk" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const sidebarCategories = [
  { label: "Stand-Up Pouches", href: "/categories/standup-pouches" },
  { label: "Ziplock Bags", href: "/categories/ziplock-pouches" },
  { label: "Flat Bottom Bags", href: "/categories/flat-bottom-bags" },
  { label: "Spout Pouches", href: "/categories/spout-pouches" },
  { label: "Vacuum Pouches", href: "/categories/vacuum-pouches" },
  { label: "Window Bags", href: "/categories/window-bags" },
  { label: "Custom Packaging", href: "/categories/custom-packaging" },
  { label: "Eco Packaging", href: "/categories/eco-packaging" },
];

const solutionColumns = [
  {
    heading: "Food Packaging",
    links: [
      { label: "Snack Pouches", href: "/categories/snack-pouches" },
      { label: "Coffee Bags", href: "/categories/coffee-bags" },
      { label: "Dry Fruit Packaging", href: "/categories/dry-fruit" },
      { label: "Spice Packaging", href: "/categories/spice-packaging" },
      { label: "Pet Food Bags", href: "/categories/pet-food" },
    ],
  },
  {
    heading: "Retail Packaging",
    links: [
      { label: "Custom Printed Pouches", href: "/categories/custom-printing" },
      { label: "Display Pouches", href: "/categories/display-pouches" },
      { label: "Window Pouches", href: "/categories/window-pouches" },
      { label: "Matte Finish Bags", href: "/categories/matte-bags" },
      { label: "Glossy Pouches", href: "/categories/glossy-pouches" },
    ],
  },
  {
    heading: "Industrial Use",
    links: [
      { label: "Barrier Bags", href: "/categories/barrier-bags" },
      { label: "Heavy Duty Packaging", href: "/categories/heavy-duty" },
      { label: "Vacuum Storage Bags", href: "/categories/vacuum-bags" },
      { label: "Bulk Packing Solutions", href: "/bulk" },
      { label: "BOPP Laminates", href: "/categories/bopp" },
    ],
  },
  {
    heading: "Eco Packaging",
    links: [
      { label: "Compostable Pouches", href: "/categories/compostable" },
      { label: "Recyclable Bags", href: "/categories/recyclable" },
      { label: "Kraft Packaging", href: "/categories/kraft" },
      { label: "Sustainable Laminates", href: "/categories/sustainable" },
      { label: "Paper Stand-Up Bags", href: "/categories/paper-bags" },
    ],
  },
  {
    heading: "Custom Services",
    links: [
      { label: "Custom Printing", href: "/categories/custom-packaging" },
      { label: "Private Label Packaging", href: "/categories/private-label" },
      { label: "Bulk Orders", href: "/bulk" },
      { label: "Packaging Design Support", href: "/contact" },
      { label: "Sample Requests", href: "/contact" },
    ],
  },
];

const bestSellers = [
  {
    id: 1,
    image: "/images/products/1.jpg",
    name: "Premium Stand-Up Pouch",
    subtitle: "Resealable Ziplock",
    price: "From $0.85",
    href: "/products/stand-up-pouch",
    badge: "Best Seller",
  },
  {
    id: 2,
    image: "/images/products/2.jpg",
    name: "Kraft Paper Pouch",
    subtitle: "Eco-Friendly",
    price: "From $0.92",
    href: "/products/kraft-pouch",
    badge: "Eco Pick",
  },
  {
    id: 3,
    image: "/images/products/3.jpg",
    name: "Flat Bottom Bag",
    subtitle: "Custom Print Ready",
    price: "From $1.10",
    href: "/products/flat-bottom-bag",
    badge: null,
  },
  {
    id: 4,
    image: "/images/products/4.jpg",
    name: "Ziplock Stand Pouch",
    subtitle: "Food Grade",
    price: "From $0.78",
    href: "/products/ziplock-pouch",
    badge: "Popular",
  },
  {
    id: 5,
    image: "/images/products/5.jpg",
    name: "Spout Pouch",
    subtitle: "Liquid Packaging",
    price: "From $1.25",
    href: "/products/spout-pouch",
    badge: null,
  },
  {
    id: 6,
    image: "/images/products/6.jpg",
    name: "Coffee Bag with Valve",
    subtitle: "Aroma Seal",
    price: "From $0.95",
    href: "/products/coffee-bag",
    badge: "New",
  },
  {
    id: 7,
    image: "/images/products/7.jpg",
    name: "Window Stand-Up Pouch",
    subtitle: "Clear Window Front",
    price: "From $0.88",
    href: "/products/window-pouch",
    badge: null,
  },
  {
    id: 8,
    image: "/images/products/8.jpg",
    name: "Vacuum Seal Bag",
    subtitle: "Industrial Grade",
    price: "From $0.72",
    href: "/products/vacuum-bag",
    badge: "Bulk Deal",
  },
];

/* ─── Component ──────────────────────────────────────────────── */

export default function NavigationMenu1() {
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
      className="hidden lg:block bg-white border-b border-gray-100 relative"
      style={{ zIndex: 40 }}
      aria-label="Main navigation"
    >
      {/* ── Nav bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center" role="menubar">
          {navItems.map((item) => (
            <li key={item.label} role="none">
              {item.hasMegaMenu ? (
                <button
                  role="menuitem"
                  aria-haspopup="true"
                  aria-expanded={megaOpen}
                  className={cn(
                    "flex items-center gap-1 px-3.5 py-3.5 text-sm font-medium transition-colors duration-150",
                    megaOpen
                      ? "text-[#1f4f8a]"
                      : "text-gray-700 hover:text-[#1f4f8a]"
                  )}
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
                </button>
              ) : (
                <Link
                  href={item.href}
                  role="menuitem"
                  className="block px-3.5 py-3.5 text-sm font-medium text-gray-700 hover:text-[#1f4f8a] transition-colors duration-150 whitespace-nowrap"
                >
                  {item.label}
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
          className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl"
          style={{ zIndex: 50 }}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          role="region"
          aria-label="Categories mega menu"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* ── TOP SECTION: Sidebar + Solutions grid ── */}
            <div className="flex">

              {/* LEFT SIDEBAR — Shop by Categories */}
              <div
                className="w-52 shrink-0 py-7 pr-6"
                style={{ borderRight: "1px solid #f1f5f9" }}
              >
                <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-4" style={{ color: "#1f4f8a" }}>
                  Shop by Categories
                </p>
                <ul className="space-y-0.5">
                  {sidebarCategories.map((cat) => (
                    <li key={cat.label}>
                      <Link
                        href={cat.href}
                        className="group flex items-center justify-between px-2.5 py-2 rounded-md text-sm text-gray-600 hover:bg-[#f0f7ff] hover:text-[#1f4f8a] transition-all duration-150"
                        onClick={() => setMegaOpen(false)}
                      >
                        <span className="font-medium">{cat.label}</span>
                        <ArrowRight
                          className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* ALL PACKAGING CTA */}
                <div className="mt-5 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
                  <Link
                    href="/shop"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-xs font-bold text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                    style={{
                      background: "linear-gradient(135deg, #1f4f8a 0%, #0f2f5f 100%)",
                    }}
                    onClick={() => setMegaOpen(false)}
                  >
                    <Package className="h-3.5 w-3.5" aria-hidden="true" />
                    All Packaging
                  </Link>
                </div>
              </div>

              {/* RIGHT — Shop by Solutions (5 columns) */}
              <div className="flex-1 py-7 pl-7">
                <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-5" style={{ color: "#1f4f8a" }}>
                  Shop by Solutions
                </p>
                <div className="grid grid-cols-5 gap-6">
                  {solutionColumns.map((col) => (
                    <div key={col.heading}>
                      <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-3 text-gray-900">
                        {col.heading}
                      </p>
                      <ul className="space-y-1.5">
                        {col.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              className="text-[13px] text-gray-500 hover:text-[#1f4f8a] transition-colors duration-150 block leading-snug"
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
            </div>

            {/* ── BOTTOM SECTION: Best Sellers ── */}
            <div
              className="py-6"
              style={{ borderTop: "1px solid #f1f5f9" }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black tracking-[0.22em] uppercase" style={{ color: "#1f4f8a" }}>
                  Best Sellers
                </p>
                <Link
                  href="/best-sellers"
                  className="text-xs font-semibold hover:underline underline-offset-4 transition-colors flex items-center gap-1"
                  style={{ color: "#4caf50" }}
                  onClick={() => setMegaOpen(false)}
                >
                  View all
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>

              {/* Product cards — horizontal scrollable row */}
              <div className="flex items-start gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {bestSellers.map((product) => (
                  <Link
                    key={product.id}
                    href={product.href}
                    className="group shrink-0 w-[130px]"
                    onClick={() => setMegaOpen(false)}
                  >
                    {/* Image */}
                    <div className="relative w-full h-[110px] rounded-xl overflow-hidden bg-gray-50 mb-2.5">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="130px"
                      />
                      {/* Badge */}
                      {product.badge && (
                        <span
                          className="absolute top-1.5 left-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full"
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
                    <p className="text-[12px] font-semibold text-gray-800 leading-tight truncate group-hover:text-[#1f4f8a] transition-colors">
                      {product.name}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                      {product.subtitle}
                    </p>
                    <p
                      className="text-[12px] font-bold mt-1"
                      style={{ color: "#4caf50" }}
                    >
                      {product.price}
                    </p>
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
