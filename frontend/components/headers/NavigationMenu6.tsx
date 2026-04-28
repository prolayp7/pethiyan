"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  ArrowRight,
  Package,
  Search,
  ShoppingBag,
  Star,
  Sparkles,
  TrendingUp,
  Tag,
  Truck,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Icon map (string → component) ─────────────────────────── */

const ICON_MAP: Record<string, LucideIcon> = {
  Layers,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
  Tag,
  Package,
};

/* ─── Types ──────────────────────────────────────────────────── */

export interface NavItem {
  label: string;
  href: string;
  type: "link" | "shop_dropdown" | "mega_menu";
  badge?: string | null;
  target?: string;
}

export interface ShopDropdownItem {
  label: string;
  href: string;
  description: string;
  iconName: string;
  accent: string;
}

export interface CategoryColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export interface MegaProduct {
  image: string;
  name: string;
  price: string;
  badge?: string | null;
  href: string;
}

export interface SidebarCategory {
  label: string;
  href: string;
  accent: string;
  image: string;
  tagline: string;
  columns: CategoryColumn[];
  topProducts: MegaProduct[];
}

export interface NavMenuProps {
  navItems?: NavItem[];
  shopDropdownItems?: ShopDropdownItem[];
  sidebarCategories?: SidebarCategory[];
  megaFeaturedProducts?: MegaProduct[];
}

/* ─── Mobile Accordion ───────────────────────────────────────── */

function MobileAccordion({ category, onClose }: { category: SidebarCategory; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.07]">
      <button
        type="button"
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
                onClick={onClose}
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

export default function NavigationMenu6({
  navItems = [],
  shopDropdownItems = [],
  sidebarCategories = [],
  megaFeaturedProducts = [],
}: NavMenuProps) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [canScrollBestSellersLeft, setCanScrollBestSellersLeft] = useState(false);
  const [canScrollBestSellersRight, setCanScrollBestSellersRight] = useState(false);

  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bestSellersRef = useRef<HTMLDivElement | null>(null);

  const handleMegaEnter = () => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    setMegaOpen(true);
  };
  const handleMegaLeave = () => {
    megaTimer.current = setTimeout(() => setMegaOpen(false), 90);
  };

  const handleShopEnter = () => {
    if (shopTimer.current) clearTimeout(shopTimer.current);
    setShopOpen(true);
  };
  const handleShopLeave = () => {
    shopTimer.current = setTimeout(() => setShopOpen(false), 90);
  };

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setMegaOpen(false);
        setShopOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const rail = bestSellersRef.current;
    if (!rail || !megaOpen) return;

    const updateScrollButtons = () => {
      const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
      setCanScrollBestSellersLeft(rail.scrollLeft > 4);
      setCanScrollBestSellersRight(maxScrollLeft - rail.scrollLeft > 4);
    };

    updateScrollButtons();
    rail.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      rail.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [megaOpen, megaFeaturedProducts.length, activeIndex]);

  const scrollBestSellers = (direction: "left" | "right") => {
    const rail = bestSellersRef.current;
    if (!rail) return;

    const amount = Math.max(rail.clientWidth * 0.65, 220);
    rail.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

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
          <ul className="flex items-center justify-center flex-wrap" role="menubar">
            {navItems.map((item) => (
              <li key={item.label} role="none">

                {/* ── SHOP dropdown trigger ── */}
                {item.type === "shop_dropdown" ? (
                  <div
                    className="relative"
                    onMouseEnter={handleShopEnter}
                    onMouseLeave={handleShopLeave}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      aria-haspopup="true"
                      aria-expanded={shopOpen}
                      className={cn(
                        "relative flex items-center gap-1 px-4 pt-2.5 pb-2 text-sm font-medium transition-colors duration-150 group",
                        shopOpen ? "text-[#1f4f8a]" : "text-gray-700 hover:text-[#1f4f8a]"
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200",
                          shopOpen && "rotate-180"
                        )}
                        aria-hidden="true"
                      />
                      <span
                        className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full transition-transform duration-200 origin-left"
                        style={{
                          background: "linear-gradient(to right, #1f4f8a, #4caf50)",
                          transform: shopOpen ? "scaleX(1)" : "scaleX(0)",
                        }}
                        aria-hidden="true"
                      />
                    </button>

                    {/* ── SHOP DROPDOWN PANEL ── */}
                    {shopOpen && (
                      <div
                        className="absolute top-full left-0 bg-white rounded-b-xl shadow-2xl"
                        style={{
                          minWidth: "360px",
                          border: "1px solid #f0f4f8",
                          zIndex: 50,
                          marginTop: "1px",
                        }}
                      >
                        <div
                          className="px-4 pt-4 pb-3"
                          style={{ borderBottom: "1px solid #f0f4f8" }}
                        >
                          <p
                            className="text-[9px] font-black tracking-[0.25em] uppercase"
                            style={{ color: "#94a3b8" }}
                          >
                            Shop by
                          </p>
                        </div>

                        <div className="p-2">
                          {shopDropdownItems.map((si) => {
                            const Icon = ICON_MAP[si.iconName] ?? Package;
                            return (
                              <Link
                                key={si.href}
                                href={si.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                                onClick={() => setShopOpen(false)}
                              >
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-110"
                                  style={{ background: si.accent + "15" }}
                                >
                                  <Icon
                                    className="h-3.5 w-3.5"
                                    style={{ color: si.accent }}
                                    aria-hidden="true"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[13px] font-semibold text-gray-800 group-hover:text-[#1f4f8a] transition-colors leading-tight">
                                    {si.label}
                                  </p>
                                  <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">
                                    {si.description}
                                  </p>
                                </div>
                                <ChevronRight
                                  className="h-3 w-3 text-gray-300 group-hover:text-[#1f4f8a] group-hover:translate-x-0.5 transition-all duration-150 shrink-0"
                                  aria-hidden="true"
                                />
                              </Link>
                            );
                          })}
                        </div>

                        <div
                          className="p-3"
                          style={{ borderTop: "1px solid #f0f4f8" }}
                        >
                          <Link
                            href="/contact"
                            className="btn-brand flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-bold transition-all hover:opacity-95 hover:shadow-md"
                            onClick={() => setShopOpen(false)}
                          >
                            <Package className="h-3.5 w-3.5" aria-hidden="true" />
                            Request a Custom Quote
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                /* ── CATEGORIES mega menu trigger ── */
                ) : item.type === "mega_menu" ? (
                  <button
                    type="button"
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={megaOpen}
                    className={cn(
                      "relative flex items-center gap-1 px-4 pt-2.5 pb-2 text-sm font-medium transition-colors duration-150 group",
                      megaOpen ? "text-[#1f4f8a]" : "text-gray-700 hover:text-[#1f4f8a]"
                    )}
                    onMouseEnter={handleMegaEnter}
                    onMouseLeave={handleMegaLeave}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        megaOpen && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full transition-transform duration-200 origin-left"
                      style={{
                        background: "linear-gradient(to right, #1f4f8a, #4caf50)",
                        transform: megaOpen ? "scaleX(1)" : "scaleX(0)",
                      }}
                      aria-hidden="true"
                    />
                  </button>

                /* ── Regular nav link ── */
                ) : (
                  <Link
                    href={item.href}
                    role="menuitem"
                    target={item.target === "_blank" ? "_blank" : undefined}
                    rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                    className="relative block px-4 pt-2.5 pb-2 text-sm font-medium text-gray-700 hover:text-[#1f4f8a] transition-colors duration-150 group whitespace-nowrap"
                  >
                    {item.label}
                    {item.badge && (
                      <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-500 text-white">
                        {item.badge}
                      </span>
                    )}
                    <span
                      className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                      style={{ background: "linear-gradient(to right, #1f4f8a, #4caf50)" }}
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ═══════════════════════════════════════════════
            MEGA MENU PANEL (Categories)
        ═══════════════════════════════════════════════ */}
        {megaOpen && active && (
          <div
            className="absolute top-full left-0 right-0 bg-white shadow-2xl"
            style={{ borderTop: "2px solid #f0f4f8", zIndex: 50 }}
            onMouseEnter={handleMegaEnter}
            onMouseLeave={handleMegaLeave}
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
                  <Link
                    href={active.href}
                    className="group relative block w-full h-40 rounded-xl overflow-hidden mb-4"
                    onClick={() => setMegaOpen(false)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={active.image}
                      alt={active.label}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)",
                      }}
                      aria-hidden="true"
                    />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-sm font-bold leading-tight">{active.label}</p>
                      <p className="text-white/60 text-[11px] mt-0.5 leading-tight">
                        {active.tagline}
                      </p>
                    </div>
                    <div
                      className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full"
                      style={{ background: active.accent }}
                      aria-hidden="true"
                    />
                  </Link>

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

                  {active.topProducts.length > 0 && (
                    <>
                      <p
                        className="text-[9px] font-black tracking-[0.2em] uppercase mb-2"
                        style={{ color: "#94a3b8" }}
                      >
                        Top Picks
                      </p>
                      <div className="space-y-2">
                        {active.topProducts.slice(0, 2).map((p, idx) => (
                          <Link
                            key={idx}
                            href={p.href}
                            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                            onClick={() => setMegaOpen(false)}
                          >
                            <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-gray-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.image}
                                alt={p.name}
                                className="absolute inset-0 w-full h-full object-cover"
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
                    </>
                  )}
                </div>

                {/* ── RIGHT: 3-Column Sub-links ── */}
                <div className="flex-1 min-w-0 py-6 pl-7">
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
                  {megaFeaturedProducts.length > 0 && (
                    <div className="mt-6 pt-5" style={{ borderTop: "1px solid #f0f4f8" }}>
                      <div className="flex items-center justify-between mb-3">
                        <p
                          className="text-[9px] font-black tracking-[0.22em] uppercase flex items-center gap-1.5"
                          style={{ color: "#94a3b8" }}
                        >
                          <Star className="h-3 w-3" style={{ color: "#f59e0b" }} aria-hidden="true" />
                          Best Sellers
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              aria-label="Scroll best sellers left"
                              onClick={() => scrollBestSellers("left")}
                              disabled={!canScrollBestSellersLeft}
                              className="flex h-7 w-7 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-35"
                              style={{ borderColor: "#dbe5ef", color: "#1f4f8a", background: "#fff" }}
                            >
                              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              aria-label="Scroll best sellers right"
                              onClick={() => scrollBestSellers("right")}
                              disabled={!canScrollBestSellersRight}
                              className="flex h-7 w-7 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-35"
                              style={{ borderColor: "#dbe5ef", color: "#1f4f8a", background: "#fff" }}
                            >
                              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
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
                      </div>
                      <div
                        ref={bestSellersRef}
                        className="flex items-start gap-3 overflow-x-auto scroll-smooth pb-1"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {megaFeaturedProducts.map((p, idx) => (
                          <Link
                            key={idx}
                            href={p.href}
                            className="group shrink-0 w-[110px]"
                            onClick={() => setMegaOpen(false)}
                          >
                            <div className="relative w-full h-[85px] rounded-lg overflow-hidden bg-gray-50 mb-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.image}
                                alt={p.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                  )}
                </div>

              </div>
            </div>
          </div>
        )}
      </nav>


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

            {/* Quick nav links — plain links from navItems */}
            <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[9px] font-black tracking-[0.25em] uppercase mb-3 text-white/30">
                Quick Links
              </p>
              <div className="grid grid-cols-2 gap-2">
                {navItems
                  .filter((it) => it.type === "link")
                  .map((link) => (
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

            {/* Shop dropdown items (mobile) */}
            {shopDropdownItems.length > 0 && (
              <div
                className="px-5 py-5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <p className="text-[9px] font-black tracking-[0.25em] uppercase mb-3 text-white/30">
                  Shop
                </p>
                <div className="space-y-1">
                  {shopDropdownItems.map((si) => {
                    const Icon = ICON_MAP[si.iconName] ?? Package;
                    return (
                      <Link
                        key={si.href}
                        href={si.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                        style={{ color: "rgba(255,255,255,0.65)" }}
                        onClick={() => setMobileOpen(false)}
                      >
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                          style={{ background: si.accent + "20" }}
                        >
                          <Icon className="h-3.5 w-3.5" style={{ color: si.accent }} aria-hidden="true" />
                        </div>
                        <span className="text-sm font-medium">{si.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category Accordions */}
            {sidebarCategories.length > 0 && (
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
            )}

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
