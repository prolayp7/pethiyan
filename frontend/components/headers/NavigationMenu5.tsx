"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  X,
  Menu,
  ArrowRight,
  ChevronRight,
  Package,
  Search,
  ShoppingBag,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────── */

interface SubLink {
  label: string;
  href: string;
}

interface CategoryColumn {
  heading: string;
  links: SubLink[];
}

interface SidebarCategory {
  label: string;
  href: string;
  accent: string;
  image: string;
  tagline: string;
  columns: CategoryColumn[];
}

interface FeaturedProduct {
  id: number;
  image: string;
  name: string;
  subtitle: string;
  price: string;
  badge?: string | null;
  href: string;
}

/* ─── Data ───────────────────────────────────────────────────── */

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories", hasMegaMenu: true },
  { label: "Custom Packaging", href: "/categories/custom-packaging" },
  { label: "Eco Packaging", href: "/categories/eco-packaging" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Bulk Orders", href: "/bulk" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const sidebarCategories: SidebarCategory[] = [
  {
    label: "Stand-Up Pouches",
    href: "/categories/standup-pouches",
    accent: "#1f4f8a",
    image: "/images/banners/1.jpg",
    tagline: "Retail-ready resealable pouches",
    columns: [
      {
        heading: "By Closure",
        links: [
          { label: "Ziplock Stand-Up", href: "/categories/ziplock-pouches" },
          { label: "Press-Seal Pouches", href: "/categories/press-seal" },
          { label: "Velcro Closure Bags", href: "/categories/velcro-bags" },
          { label: "Open Top Pouches", href: "/categories/open-top" },
          { label: "Heat-Seal Bags", href: "/categories/heat-seal" },
        ],
      },
      {
        heading: "By Material",
        links: [
          { label: "Kraft Paper Pouches", href: "/categories/kraft" },
          { label: "Foil Lined Pouches", href: "/categories/foil" },
          { label: "Clear PET Pouches", href: "/categories/clear-pet" },
          { label: "Matte OPP Bags", href: "/categories/matte-opp" },
          { label: "Biodegradable Pouches", href: "/categories/bio" },
        ],
      },
      {
        heading: "By Use",
        links: [
          { label: "Food Grade Pouches", href: "/categories/food-grade" },
          { label: "Pet Food Packaging", href: "/categories/pet-food" },
          { label: "Snack Pouches", href: "/categories/snack-pouches" },
          { label: "Coffee Bags", href: "/categories/coffee-bags" },
          { label: "Spice Packaging", href: "/categories/spice-packaging" },
        ],
      },
    ],
  },
  {
    label: "Ziplock Bags",
    href: "/categories/ziplock-pouches",
    accent: "#4caf50",
    image: "/images/banners/2.jpg",
    tagline: "Airtight seals for every product",
    columns: [
      {
        heading: "Standard Ziplock",
        links: [
          { label: "Small Ziplock Bags", href: "/categories/small-ziplock" },
          { label: "Medium Ziplock Bags", href: "/categories/medium-ziplock" },
          { label: "Large Ziplock Bags", href: "/categories/large-ziplock" },
          { label: "Jumbo Ziplock Bags", href: "/categories/jumbo-ziplock" },
          { label: "Mini Grip Bags", href: "/categories/mini-grip" },
        ],
      },
      {
        heading: "Premium Ziplock",
        links: [
          { label: "Stand-Up Ziplock", href: "/categories/standup-ziplock" },
          { label: "Ziplock Mylar Bags", href: "/categories/mylar-ziplock" },
          { label: "Frosted Ziplock", href: "/categories/frosted-ziplock" },
          { label: "Clear Window Ziplock", href: "/categories/window-ziplock" },
          { label: "Custom Print Ziplock", href: "/categories/custom-ziplock" },
        ],
      },
      {
        heading: "Industrial",
        links: [
          { label: "Heavy Duty Ziplock", href: "/categories/heavy-duty-zip" },
          { label: "Anti-Static Bags", href: "/categories/anti-static" },
          { label: "Moisture Proof Bags", href: "/categories/moisture-proof" },
          { label: "Vacuum Ziplock", href: "/categories/vacuum-ziplock" },
          { label: "Bulk Ziplock Packs", href: "/categories/bulk-ziplock" },
        ],
      },
    ],
  },
  {
    label: "Flat Bottom Bags",
    href: "/categories/flat-bottom-bags",
    accent: "#e67e22",
    image: "/images/banners/3.jpg",
    tagline: "Premium shelf-stable packaging",
    columns: [
      {
        heading: "Coffee & Tea",
        links: [
          { label: "Coffee Flat Bottom", href: "/categories/coffee-flat" },
          { label: "Tea Packaging Bags", href: "/categories/tea-bags" },
          { label: "Valve Flat Bottom", href: "/categories/valve-flat" },
          { label: "Window Flat Bottom", href: "/categories/window-flat" },
          { label: "Aroma Seal Bags", href: "/categories/aroma-seal" },
        ],
      },
      {
        heading: "Food & Snacks",
        links: [
          { label: "Snack Flat Bags", href: "/categories/snack-flat" },
          { label: "Dry Fruit Bags", href: "/categories/dry-fruit" },
          { label: "Grain & Seed Bags", href: "/categories/grain-bags" },
          { label: "Candy Packaging", href: "/categories/candy-bags" },
          { label: "Nut & Trail Mix", href: "/categories/nut-bags" },
        ],
      },
      {
        heading: "Finishing",
        links: [
          { label: "Matte Finish Flat", href: "/categories/matte-flat" },
          { label: "Glossy Flat Bottom", href: "/categories/glossy-flat" },
          { label: "Metallic Finish", href: "/categories/metallic-flat" },
          { label: "Custom Printed Flat", href: "/categories/custom-flat" },
          { label: "Eco Flat Bags", href: "/categories/eco-flat" },
        ],
      },
    ],
  },
  {
    label: "Spout Pouches",
    href: "/categories/spout-pouches",
    accent: "#9b59b6",
    image: "/images/banners/4.jpg",
    tagline: "Liquid packaging made effortless",
    columns: [
      {
        heading: "By Liquid Type",
        links: [
          { label: "Juice Pouches", href: "/categories/juice-pouches" },
          { label: "Sauce Pouches", href: "/categories/sauce-pouches" },
          { label: "Oil Pouches", href: "/categories/oil-pouches" },
          { label: "Honey Pouches", href: "/categories/honey-pouches" },
          { label: "Syrup Pouches", href: "/categories/syrup-pouches" },
        ],
      },
      {
        heading: "Special Use",
        links: [
          { label: "Baby Food Pouches", href: "/categories/baby-food" },
          { label: "Detergent Pouches", href: "/categories/detergent" },
          { label: "Cosmetic Pouches", href: "/categories/cosmetic-liquid" },
          { label: "Chemical Pouches", href: "/categories/chemical" },
          { label: "Sport Drink Pouches", href: "/categories/sport-drink" },
        ],
      },
      {
        heading: "Capacity",
        links: [
          { label: "50ml–200ml Pouches", href: "/categories/small-spout" },
          { label: "250ml–500ml Pouches", href: "/categories/medium-spout" },
          { label: "1L–2L Pouches", href: "/categories/large-spout" },
          { label: "Bulk Spout Pouches", href: "/categories/bulk-spout" },
          { label: "Custom Volume", href: "/contact" },
        ],
      },
    ],
  },
  {
    label: "Eco Packaging",
    href: "/categories/eco-packaging",
    accent: "#27ae60",
    image: "/images/banners/5.jpg",
    tagline: "Sustainable solutions for green brands",
    columns: [
      {
        heading: "Compostable",
        links: [
          { label: "Compostable Pouches", href: "/categories/compostable" },
          { label: "PLA Bags", href: "/categories/pla-bags" },
          { label: "PBAT Pouches", href: "/categories/pbat" },
          { label: "Corn-Starch Bags", href: "/categories/corn-starch" },
          { label: "Certified Compostable", href: "/categories/certified-compost" },
        ],
      },
      {
        heading: "Recyclable",
        links: [
          { label: "Recyclable PE Bags", href: "/categories/recyclable-pe" },
          { label: "Mono-Material Pouches", href: "/categories/mono-material" },
          { label: "Paper Pouches", href: "/categories/paper-bags" },
          { label: "Kraft Eco Bags", href: "/categories/kraft-eco" },
          { label: "PCR Content Bags", href: "/categories/pcr-bags" },
        ],
      },
      {
        heading: "Sustainable",
        links: [
          { label: "FSC Certified Paper", href: "/categories/fsc-paper" },
          { label: "Soy Ink Printed", href: "/categories/soy-ink" },
          { label: "Carbon Neutral Bags", href: "/categories/carbon-neutral" },
          { label: "Refillable Pouches", href: "/categories/refillable" },
          { label: "Zero Waste Options", href: "/categories/zero-waste" },
        ],
      },
    ],
  },
  {
    label: "Custom Packaging",
    href: "/categories/custom-packaging",
    accent: "#e74c3c",
    image: "/images/banners/6.jpg",
    tagline: "Your brand, your way",
    columns: [
      {
        heading: "Print Options",
        links: [
          { label: "Digital Print", href: "/categories/digital-print" },
          { label: "Rotogravure Print", href: "/categories/rotogravure" },
          { label: "Flexographic Print", href: "/categories/flexo-print" },
          { label: "Spot UV Coating", href: "/categories/spot-uv" },
          { label: "Embossed Finish", href: "/categories/embossed" },
        ],
      },
      {
        heading: "Brand Services",
        links: [
          { label: "Private Label", href: "/categories/private-label" },
          { label: "Packaging Design", href: "/contact" },
          { label: "Dieline Templates", href: "/contact" },
          { label: "Sample Orders", href: "/contact" },
          { label: "Branded Inserts", href: "/categories/inserts" },
        ],
      },
      {
        heading: "MOQ & Bulk",
        links: [
          { label: "Low MOQ Custom", href: "/categories/low-moq" },
          { label: "Bulk Custom Orders", href: "/bulk" },
          { label: "White Label Bags", href: "/categories/white-label" },
          { label: "OEM Packaging", href: "/categories/oem" },
          { label: "Request a Quote", href: "/contact" },
        ],
      },
    ],
  },
  {
    label: "Window Bags",
    href: "/categories/window-bags",
    accent: "#16a085",
    image: "/images/banners/1.jpg",
    tagline: "Let your product shine through",
    columns: [
      {
        heading: "Window Styles",
        links: [
          { label: "Full-Front Window", href: "/categories/full-window" },
          { label: "Die-Cut Window", href: "/categories/die-cut-window" },
          { label: "Oval Window Bags", href: "/categories/oval-window" },
          { label: "Strip Window Bags", href: "/categories/strip-window" },
          { label: "Round Window Bags", href: "/categories/round-window" },
        ],
      },
      {
        heading: "Applications",
        links: [
          { label: "Bakery Window Bags", href: "/categories/bakery-window" },
          { label: "Candy Window Bags", href: "/categories/candy-window" },
          { label: "Cookie Packaging", href: "/categories/cookie-bags" },
          { label: "Gift Packaging", href: "/categories/gift-bags" },
          { label: "Retail Window Bags", href: "/categories/retail-window" },
        ],
      },
      {
        heading: "Material & Finish",
        links: [
          { label: "Kraft with Window", href: "/categories/kraft-window" },
          { label: "Foil with Window", href: "/categories/foil-window" },
          { label: "Clear PET Window", href: "/categories/clear-window" },
          { label: "Matte Window Bags", href: "/categories/matte-window" },
          { label: "Custom Print + Window", href: "/categories/custom-window" },
        ],
      },
    ],
  },
  {
    label: "Vacuum Pouches",
    href: "/categories/vacuum-pouches",
    accent: "#2980b9",
    image: "/images/banners/2.jpg",
    tagline: "Maximum freshness, minimum waste",
    columns: [
      {
        heading: "Food Vacuum",
        links: [
          { label: "Meat Vacuum Bags", href: "/categories/meat-vacuum" },
          { label: "Cheese Vacuum Bags", href: "/categories/cheese-vacuum" },
          { label: "Seafood Bags", href: "/categories/seafood-vacuum" },
          { label: "Poultry Packaging", href: "/categories/poultry" },
          { label: "Deli Vacuum Bags", href: "/categories/deli-vacuum" },
        ],
      },
      {
        heading: "Industrial",
        links: [
          { label: "Heavy Duty Vacuum", href: "/categories/hd-vacuum" },
          { label: "Multi-Layer Vacuum", href: "/categories/multi-layer" },
          { label: "ESD Vacuum Bags", href: "/categories/esd-vacuum" },
          { label: "Long-Term Storage", href: "/categories/long-term" },
          { label: "Barrier Vacuum Bags", href: "/categories/barrier-vacuum" },
        ],
      },
      {
        heading: "Specialty",
        links: [
          { label: "Embossed Vacuum", href: "/categories/embossed-vacuum" },
          { label: "Textured Vacuum", href: "/categories/textured-vacuum" },
          { label: "Dual-Track Zip+Vac", href: "/categories/zip-vac" },
          { label: "High-Barrier Vacuum", href: "/categories/hb-vacuum" },
          { label: "Custom Vacuum Bags", href: "/categories/custom-vacuum" },
        ],
      },
    ],
  },
];

const featuredProducts: FeaturedProduct[] = [
  {
    id: 1,
    image: "/images/products/1.jpg",
    name: "Premium Stand-Up Pouch",
    subtitle: "Resealable Ziplock",
    price: "From $0.85",
    badge: "Best Seller",
    href: "/products/stand-up-pouch",
  },
  {
    id: 2,
    image: "/images/products/2.jpg",
    name: "Kraft Paper Pouch",
    subtitle: "Eco-Friendly",
    price: "From $0.92",
    badge: "Eco Pick",
    href: "/products/kraft-pouch",
  },
  {
    id: 3,
    image: "/images/products/3.jpg",
    name: "Flat Bottom Bag",
    subtitle: "Custom Print Ready",
    price: "From $1.10",
    badge: null,
    href: "/products/flat-bottom-bag",
  },
  {
    id: 4,
    image: "/images/products/4.jpg",
    name: "Ziplock Stand Pouch",
    subtitle: "Food Grade",
    price: "From $0.78",
    badge: "Popular",
    href: "/products/ziplock-pouch",
  },
];

/* ─── Mobile Accordion Item ──────────────────────────────────── */

function MobileAccordion({ category }: { category: SidebarCategory; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-sm font-semibold text-white/90">{category.label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-white/40 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="pb-4 px-5 grid grid-cols-2 gap-x-4 gap-y-1">
          {category.columns.flatMap((col) =>
            col.links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="text-[13px] text-white/50 hover:text-white py-1 block transition-colors"
              >
                {link.label}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────── */

export default function NavigationMenu5() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── hover helpers ── */
  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 90);
  };

  /* ── mobile body-lock ── */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* ── ESC to close ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMobileOpen(false); setMegaOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const active = sidebarCategories[activeIndex];

  return (
    <>
      {/* ═══════════════════════════════════════════════
          DESKTOP NAV BAR
      ═══════════════════════════════════════════════ */}
      <nav
        className="hidden lg:block bg-white relative"
        style={{ borderBottom: "1px solid #f0f4f8", zIndex: 40 }}
        aria-label="Main navigation"
      >
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
                      "relative flex items-center gap-1 px-4 py-3.5 text-sm font-medium transition-colors duration-150 group",
                      megaOpen ? "text-[#1f4f8a]" : "text-gray-700 hover:text-[#1f4f8a]"
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
                    {/* Sliding underline indicator */}
                    <span
                      className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full transition-transform duration-200 origin-left"
                      style={{
                        background: "linear-gradient(to right, #1f4f8a, #4caf50)",
                        transform: megaOpen ? "scaleX(1)" : "scaleX(0)",
                      }}
                      aria-hidden="true"
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    role="menuitem"
                    className="relative block px-4 py-3.5 text-sm font-medium text-gray-700 hover:text-[#1f4f8a] transition-colors duration-150 group whitespace-nowrap"
                  >
                    {item.label}
                    {/* Sliding underline on all nav items */}
                    <span
                      className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                      style={{ background: "linear-gradient(to right, #1f4f8a, #4caf50)" }}
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </li>
            ))}

            {/* Mobile hamburger (visible on md and below, hidden on lg+) */}
            <li className="ml-auto lg:hidden" role="none">
              <button
                className="p-2 text-gray-700"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </li>
          </ul>
        </div>

        {/* ═══════════════════════════════════════════════
            MEGA MENU PANEL
        ═══════════════════════════════════════════════ */}
        {megaOpen && (
          <div
            className="absolute top-full left-0 right-0 bg-white shadow-2xl"
            style={{ borderTop: "2px solid #f0f4f8", zIndex: 50 }}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            role="region"
            aria-label="Categories mega menu"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex" style={{ minHeight: "420px" }}>

                {/* ── LEFT: Category Sidebar ── */}
                <div
                  className="w-[200px] shrink-0 py-6 pr-4"
                  style={{ borderRight: "1px solid #f0f4f8" }}
                >
                  <p
                    className="text-[9px] font-black tracking-[0.25em] uppercase mb-3 px-2"
                    style={{ color: "#94a3b8" }}
                  >
                    Categories
                  </p>
                  <ul className="space-y-0.5">
                    {sidebarCategories.map((cat, i) => {
                      const isActive = i === activeIndex;
                      return (
                        <li key={cat.label}>
                          <button
                            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-left transition-all duration-150"
                            style={{
                              background: isActive ? "#f0f7ff" : "transparent",
                              color: isActive ? "#1f4f8a" : "#475569",
                            }}
                            onMouseEnter={() => setActiveIndex(i)}
                          >
                            {/* Accent dot */}
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ background: cat.accent }}
                              aria-hidden="true"
                            />
                            <span className="truncate">{cat.label}</span>
                            {isActive && (
                              <ChevronRight
                                className="h-3 w-3 ml-auto shrink-0"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {/* View all CTA */}
                  <div className="mt-4 pt-4" style={{ borderTop: "1px solid #f0f4f8" }}>
                    <Link
                      href="/shop"
                      className="flex items-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 hover:shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #1f4f8a 0%, #0f2f5f 100%)",
                        color: "white",
                      }}
                      onClick={() => setMegaOpen(false)}
                    >
                      <Package className="h-3.5 w-3.5" aria-hidden="true" />
                      All Packaging
                    </Link>
                  </div>
                </div>

                {/* ── CENTER: Featured Image + Category Info ── */}
                <div
                  className="w-[220px] shrink-0 py-6 px-5"
                  style={{ borderRight: "1px solid #f0f4f8" }}
                >
                  {/* Category Image */}
                  <div className="relative w-full h-[160px] rounded-xl overflow-hidden mb-4">
                    <Image
                      src={active.image}
                      alt={active.label}
                      fill
                      className="object-cover"
                      sizes="220px"
                    />
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)",
                      }}
                      aria-hidden="true"
                    />
                    {/* Category name on image */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-sm font-bold leading-tight">
                        {active.label}
                      </p>
                      <p className="text-white/60 text-[11px] mt-0.5 leading-tight">
                        {active.tagline}
                      </p>
                    </div>
                    {/* Accent dot overlay */}
                    <div
                      className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full"
                      style={{ background: active.accent }}
                      aria-hidden="true"
                    />
                  </div>

                  {/* View Category CTA */}
                  <Link
                    href={active.href}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:opacity-90 mb-4"
                    style={{
                      background: active.accent + "15",
                      color: active.accent,
                      border: `1px solid ${active.accent}30`,
                    }}
                    onClick={() => setMegaOpen(false)}
                  >
                    View All {active.label}
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>

                  {/* Featured products (2) */}
                  <p
                    className="text-[9px] font-black tracking-[0.2em] uppercase mb-2"
                    style={{ color: "#94a3b8" }}
                  >
                    Top Picks
                  </p>
                  <div className="space-y-2">
                    {featuredProducts.slice(0, 2).map((p) => (
                      <Link
                        key={p.id}
                        href={p.href}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                        onClick={() => setMegaOpen(false)}
                      >
                        <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-gray-100">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-gray-800 truncate group-hover:text-[#1f4f8a] transition-colors">
                            {p.name}
                          </p>
                          <p className="text-[11px] font-bold" style={{ color: "#4caf50" }}>
                            {p.price}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* ── RIGHT: 3-Column Sub-links ── */}
                <div className="flex-1 py-6 pl-7">
                  <div className="flex items-center justify-between mb-5">
                    <p
                      className="text-[9px] font-black tracking-[0.25em] uppercase"
                      style={{ color: "#94a3b8" }}
                    >
                      {active.label}
                    </p>
                    <Link
                      href={active.href}
                      className="flex items-center gap-1 text-xs font-semibold hover:underline underline-offset-4 transition-colors"
                      style={{ color: active.accent }}
                      onClick={() => setMegaOpen(false)}
                    >
                      Browse All
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {active.columns.map((col) => (
                      <div key={col.heading}>
                        <p
                          className="text-[10px] font-bold tracking-[0.15em] uppercase mb-3"
                          style={{ color: active.accent }}
                        >
                          {col.heading}
                        </p>
                        <ul className="space-y-2">
                          {col.links.map((link) => (
                            <li key={link.label}>
                              <Link
                                href={link.href}
                                className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-150 block leading-snug group flex items-center gap-1"
                                onClick={() => setMegaOpen(false)}
                              >
                                <span className="group-hover:translate-x-0.5 transition-transform duration-150 inline-block">
                                  {link.label}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Bottom: Featured Products strip */}
                  <div
                    className="mt-6 pt-5"
                    style={{ borderTop: "1px solid #f0f4f8" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p
                        className="text-[9px] font-black tracking-[0.22em] uppercase flex items-center gap-1.5"
                        style={{ color: "#94a3b8" }}
                      >
                        <Star className="h-3 w-3" style={{ color: "#f59e0b" }} aria-hidden="true" />
                        Best Sellers
                      </p>
                      <Link
                        href="/best-sellers"
                        className="text-xs font-semibold hover:underline underline-offset-4 flex items-center gap-1"
                        style={{ color: "#4caf50" }}
                        onClick={() => setMegaOpen(false)}
                      >
                        View all
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>
                    <div className="flex items-start gap-3">
                      {featuredProducts.map((p) => (
                        <Link
                          key={p.id}
                          href={p.href}
                          className="group shrink-0 w-[110px]"
                          onClick={() => setMegaOpen(false)}
                        >
                          <div className="relative w-full h-[85px] rounded-lg overflow-hidden bg-gray-50 mb-2">
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="110px"
                            />
                            {p.badge && (
                              <span
                                className="absolute top-1 left-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white"
                                style={{
                                  background:
                                    p.badge === "Eco Pick"
                                      ? "#4caf50"
                                      : p.badge === "Popular"
                                      ? "#f59e0b"
                                      : "#1f4f8a",
                                }}
                              >
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-semibold text-gray-800 truncate group-hover:text-[#1f4f8a] transition-colors leading-tight">
                            {p.name}
                          </p>
                          <p className="text-[11px] font-bold mt-0.5" style={{ color: "#4caf50" }}>
                            {p.price}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════════════
          MOBILE HAMBURGER (shown inside nav bar — below lg)
      ═══════════════════════════════════════════════ */}
      <div
        className="lg:hidden flex items-center justify-between px-4 py-3 bg-white"
        style={{ borderBottom: "1px solid #f0f4f8" }}
      >
        <Link href="/" className="text-sm font-bold text-[#1f4f8a] flex items-center gap-1.5">
          <Package className="h-4 w-4" aria-hidden="true" />
          Pethiyan
        </Link>
        <div className="flex items-center gap-2">
          <button aria-label="Search" className="p-1.5 text-gray-600 hover:text-[#1f4f8a] transition-colors">
            <Search className="h-4.5 w-4.5" />
          </button>
          <button aria-label="Cart" className="p-1.5 text-gray-600 hover:text-[#1f4f8a] transition-colors">
            <ShoppingBag className="h-4.5 w-4.5" />
          </button>
          <button
            className="p-1.5 text-gray-700 hover:text-[#1f4f8a] transition-colors"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          MOBILE FULL-SCREEN OVERLAY MENU
      ═══════════════════════════════════════════════ */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col"
          style={{ background: "#071023" }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Link
              href="/"
              className="text-sm font-bold text-white flex items-center gap-1.5"
              onClick={() => setMobileOpen(false)}
            >
              <Package className="h-4 w-4 text-[#4caf50]" aria-hidden="true" />
              Pethiyan
            </Link>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">

            {/* Quick nav links */}
            <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[9px] font-black tracking-[0.25em] uppercase mb-3 text-white/30">
                Quick Links
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Shop All", href: "/shop" },
                  { label: "New Arrivals", href: "/new-arrivals" },
                  { label: "Best Sellers", href: "/best-sellers" },
                  { label: "Bulk Orders", href: "/bulk" },
                  { label: "Custom Packaging", href: "/categories/custom-packaging" },
                  { label: "Eco Packaging", href: "/categories/eco-packaging" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    <ArrowRight className="h-3 w-3 text-white/30 shrink-0" aria-hidden="true" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Category Accordions */}
            <div>
              <p className="text-[9px] font-black tracking-[0.25em] uppercase px-5 pt-5 pb-3 text-white/30">
                All Categories
              </p>
              {sidebarCategories.map((cat) => (
                <MobileAccordion
                  key={cat.label}
                  category={cat}
                  onClose={() => setMobileOpen(false)}
                />
              ))}
            </div>

            {/* Footer links */}
            <div className="px-5 py-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between py-3 text-sm text-white/50 hover:text-white transition-colors"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                  <ChevronRight className="h-3.5 w-3.5 text-white/30" aria-hidden="true" />
                </Link>
              ))}

              {/* CTA */}
              <Link
                href="/contact"
                className="btn-brand mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-bold transition-all hover:opacity-95"
                onClick={() => setMobileOpen(false)}
              >
                Request a Quote
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
