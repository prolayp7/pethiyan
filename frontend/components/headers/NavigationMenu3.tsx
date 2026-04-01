"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Menu,
  X,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────── */

interface NavItem {
  label: string;
  href: string;
  hasMegaMenu?: boolean;
}

interface SidebarCategory {
  label: string;
  href: string;
}

interface SolutionLink {
  label: string;
  href: string;
}

interface SolutionColumn {
  heading: string;
  links: SolutionLink[];
}

interface BestSellerProduct {
  id: number;
  name: string;
  image: string;
  price: string;
  href: string;
  badge?: string | null;
}

/* ─── Data ───────────────────────────────────────────────────── */

const topNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop", hasMegaMenu: true },
  { label: "Categories", href: "/categories", hasMegaMenu: true },
  { label: "Custom Packaging", href: "/categories/custom-packaging" },
  { label: "Eco Packaging", href: "/categories/eco-packaging" },
  { label: "Industries", href: "/industries" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const sidebarCategories: SidebarCategory[] = [
  { label: "Stand-Up Pouches", href: "/categories/standup-pouches" },
  { label: "Ziplock Bags", href: "/categories/ziplock-pouches" },
  { label: "Flat Bottom Bags", href: "/categories/flat-bottom-bags" },
  { label: "Spout Pouches", href: "/categories/spout-pouches" },
  { label: "Vacuum Pouches", href: "/categories/vacuum-pouches" },
  { label: "Window Bags", href: "/categories/window-bags" },
  { label: "Custom Packaging", href: "/categories/custom-packaging" },
  { label: "Eco Packaging", href: "/categories/eco-packaging" },
];

const groupedColumns: SolutionColumn[] = [
  {
    heading: "Food Packaging",
    links: [
      { label: "Snack Pouches", href: "/categories/snack-pouches" },
      { label: "Coffee Bags", href: "/categories/coffee-bags" },
      { label: "Spice Packaging", href: "/categories/spice-packaging" },
      { label: "Dry Fruit Pouches", href: "/categories/dry-fruit" },
      { label: "Tea Pouches", href: "/categories/tea-pouches" },
    ],
  },
  {
    heading: "Retail Packaging",
    links: [
      { label: "Window Pouches", href: "/categories/window-pouches" },
      { label: "Matte Finish Bags", href: "/categories/matte-bags" },
      { label: "Custom Printed Pouches", href: "/categories/custom-printing" },
      { label: "Display Pouches", href: "/categories/display-pouches" },
      { label: "Glossy Pouches", href: "/categories/glossy-pouches" },
    ],
  },
  {
    heading: "Industrial",
    links: [
      { label: "Barrier Bags", href: "/categories/barrier-bags" },
      { label: "Heavy Duty Bags", href: "/categories/heavy-duty" },
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
      { label: "Private Label", href: "/categories/private-label" },
      { label: "Bulk Orders", href: "/bulk" },
      { label: "Design Support", href: "/contact" },
      { label: "Sample Requests", href: "/contact" },
    ],
  },
  {
    heading: "Industries Served",
    links: [
      { label: "Food & Beverage", href: "/industries/food" },
      { label: "Pet Food", href: "/industries/pet-food" },
      { label: "Supplements", href: "/industries/supplements" },
      { label: "Cosmetics", href: "/industries/cosmetics" },
      { label: "Household Products", href: "/industries/household" },
    ],
  },
];

const bestSellerProducts: BestSellerProduct[] = [
  { id: 1, image: "/images/products/1.jpg", name: "Stand-Up Pouch", price: "From $0.85", href: "/products/1", badge: "Best Seller" },
  { id: 2, image: "/images/products/2.jpg", name: "Kraft Paper Bag", price: "From $0.92", href: "/products/2", badge: "Eco Pick" },
  { id: 3, image: "/images/products/3.jpg", name: "Flat Bottom Bag", price: "From $1.10", href: "/products/3", badge: null },
  { id: 4, image: "/images/products/4.jpg", name: "Ziplock Pouch", price: "From $0.78", href: "/products/4", badge: "Popular" },
  { id: 5, image: "/images/products/5.jpg", name: "Spout Pouch", price: "From $1.25", href: "/products/5", badge: null },
  { id: 6, image: "/images/products/6.jpg", name: "Coffee Bag + Valve", price: "From $0.95", href: "/products/6", badge: "New" },
  { id: 7, image: "/images/products/7.jpg", name: "Window Pouch", price: "From $0.88", href: "/products/7", badge: null },
  { id: 8, image: "/images/products/8.jpg", name: "Vacuum Seal Bag", price: "From $0.72", href: "/products/8", badge: "Bulk Deal" },
];

/* ─── Accordion item (mobile) ────────────────────────────────── */

function AccordionSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <button
        className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors"
        style={{ color: isOpen ? "#4caf50" : "rgba(255,255,255,0.85)" }}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-[11px] font-bold tracking-[0.2em] uppercase">{title}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────── */

export default function NavigationMenu3() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Hover handlers */
  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 100);
  };

  /* Close mega on ESC */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMegaOpen(false); setMobileOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleAccordion = (key: string) =>
    setOpenAccordion((prev) => (prev === key ? null : key));

  const closeAll = () => {
    setMegaOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className="relative w-full"
        style={{ background: "#0f2f5f", zIndex: 40 }}
        aria-label="Main navigation"
      >
        {/* ══════════════════════════════════════════
            DESKTOP NAV BAR
        ══════════════════════════════════════════ */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center" role="menubar">
              {topNavItems.map((item) => (
                <li key={item.label} role="none">
                  {item.hasMegaMenu ? (
                    <button
                      role="menuitem"
                      aria-haspopup="true"
                      aria-expanded={megaOpen}
                      className="relative flex items-center gap-1 px-3.5 py-4 text-sm font-medium transition-colors duration-150 group"
                      style={{ color: megaOpen ? "#4caf50" : "rgba(255,255,255,0.85)" }}
                      onMouseEnter={handleEnter}
                      onMouseLeave={handleLeave}
                      onClick={() => setMegaOpen((v) => !v)}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn("h-3.5 w-3.5 transition-transform duration-200", megaOpen && "rotate-180")}
                        aria-hidden="true"
                      />
                      <span
                        className="absolute bottom-0 inset-x-0 h-[2px] transition-all duration-200"
                        style={{
                          background: "#4caf50",
                          transform: megaOpen ? "scaleX(1)" : "scaleX(0)",
                        }}
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      role="menuitem"
                      className="relative block px-3.5 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-150 group"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                    >
                      {item.label}
                      <span
                        className="absolute bottom-0 inset-x-0 h-[2px] bg-[#4caf50] scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                        aria-hidden="true"
                      />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ════════════════════════════════════════════
              MEGA MENU PANEL (desktop)
          ════════════════════════════════════════════ */}
          {megaOpen && (
            <div
              className="absolute top-full left-0 right-0 bg-white"
              style={{
                zIndex: 50,
                borderTop: "3px solid #4caf50",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              }}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              role="region"
              aria-label="Mega menu"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* TOP: Sidebar + Grid */}
                <div className="flex">

                  {/* LEFT SIDEBAR */}
                  <div
                    className="w-52 shrink-0 py-7 pr-5"
                    style={{ borderRight: "1px solid #e2e8f0" }}
                  >
                    <p
                      className="text-[9px] font-black tracking-[0.28em] uppercase mb-5"
                      style={{ color: "#0f2f5f" }}
                    >
                      Shop by Categories
                    </p>
                    <ul className="space-y-0.5">
                      {sidebarCategories.map((cat) => (
                        <li key={cat.label}>
                          <Link
                            href={cat.href}
                            className="group flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-150"
                            style={{ color: "#374151" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "#0f2f5f";
                              (e.currentTarget as HTMLElement).style.background = "#f0f7ff";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "#374151";
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                            }}
                            onClick={closeAll}
                          >
                            <span>{cat.label}</span>
                            <ChevronRight
                              className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ color: "#4caf50" }}
                              aria-hidden="true"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-6 pt-5" style={{ borderTop: "1px solid #e2e8f0" }}>
                      <Link
                        href="/shop"
                        className="group flex items-center justify-between w-full px-4 py-3 rounded-lg text-[12px] font-black tracking-wide text-white transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                        style={{ background: "linear-gradient(135deg, #123f7a 0%, #0f2f5f 100%)" }}
                        onClick={closeAll}
                      >
                        <span className="uppercase tracking-widest">All Packaging</span>
                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* RIGHT GRID — 6 columns */}
                  <div className="flex-1 py-7 pl-7">
                    <p
                      className="text-[9px] font-black tracking-[0.28em] uppercase mb-5"
                      style={{ color: "#0f2f5f" }}
                    >
                      Shop by Solutions
                    </p>
                    <div className="grid grid-cols-3 xl:grid-cols-6 gap-x-5 gap-y-6">
                      {groupedColumns.map((col) => (
                        <div key={col.heading}>
                          <p
                            className="text-[10px] font-black tracking-[0.14em] uppercase pb-2 mb-3"
                            style={{
                              color: "#0f2f5f",
                              borderBottom: "2px solid #4caf50",
                              display: "inline-block",
                            }}
                          >
                            {col.heading}
                          </p>
                          <ul className="space-y-2">
                            {col.links.map((link) => (
                              <li key={link.label}>
                                <Link
                                  href={link.href}
                                  className="text-[12px] text-gray-500 transition-colors duration-150 block leading-snug hover:text-[#123f7a]"
                                  onClick={closeAll}
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

                {/* BOTTOM — Best-sellers strip */}
                <div
                  className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-5"
                  style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}
                >
                  <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                      <p
                        className="text-[9px] font-black tracking-[0.28em] uppercase"
                        style={{ color: "#0f2f5f" }}
                      >
                        Best-Sellers
                      </p>
                      <Link
                        href="/best-sellers"
                        className="text-[11px] font-semibold flex items-center gap-1 hover:underline underline-offset-4"
                        style={{ color: "#4caf50" }}
                        onClick={closeAll}
                      >
                        View all <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>

                    <div className="flex items-start gap-3.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                      {bestSellerProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={product.href}
                          className="group shrink-0 w-[116px]"
                          onClick={closeAll}
                        >
                          <div
                            className="relative w-full h-[96px] rounded-xl overflow-hidden bg-white mb-2.5"
                            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                          >
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="116px"
                            />
                            {product.badge && (
                              <span
                                className="absolute top-1.5 left-1.5 text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                                style={{
                                  background:
                                    product.badge === "Eco Pick" ? "#4caf50" :
                                    product.badge === "New" ? "#2e7c8a" :
                                    "#0f2f5f",
                                  color: "white",
                                }}
                              >
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <p
                            className="text-[12px] font-semibold leading-tight truncate transition-colors duration-150 group-hover:text-[#123f7a]"
                            style={{ color: "#1e293b" }}
                          >
                            {product.name}
                          </p>
                          <p className="text-[12px] font-bold mt-0.5" style={{ color: "#4caf50" }}>
                            {product.price}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            MOBILE / TABLET NAV BAR
        ══════════════════════════════════════════ */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" style={{ color: "#4caf50" }} aria-hidden="true" />
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-white">
              Browse
            </span>
          </div>
          <button
            className="flex items-center justify-center w-9 h-9 rounded-md transition-colors"
            style={{ background: "rgba(255,255,255,0.08)" }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen
              ? <X className="h-5 w-5 text-white" aria-hidden="true" />
              : <Menu className="h-5 w-5 text-white" aria-hidden="true" />
            }
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════
          MOBILE DRAWER — full-screen accordion
      ════════════════════════════════════════════════ */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 overflow-y-auto"
          style={{
            background: "#0a1e3d",
            zIndex: 39,
            top: "calc(var(--header-height, 0px) + 52px)",
          }}
          role="dialog"
          aria-label="Mobile navigation menu"
        >
          {/* Quick links */}
          <div className="px-4 pt-5 pb-2">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Shop All", href: "/shop" },
                { label: "New Arrivals", href: "/new-arrivals" },
                { label: "Custom Packaging", href: "/categories/custom-packaging" },
                { label: "Bulk Orders", href: "/bulk" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-center py-2.5 rounded-lg text-[12px] font-semibold text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onClick={closeAll}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Accordion: Categories */}
          <AccordionSection
            title="Shop by Categories"
            isOpen={openAccordion === "categories"}
            onToggle={() => toggleAccordion("categories")}
          >
            <ul className="space-y-0.5">
              {sidebarCategories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={cat.href}
                    className="flex items-center gap-2 py-2.5 text-[13px] transition-colors"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                    onClick={closeAll}
                  >
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: "#4caf50" }} aria-hidden="true" />
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/shop"
              className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-lg text-[12px] font-bold text-white"
              style={{ background: "#4caf50" }}
              onClick={closeAll}
            >
              All Packaging <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </AccordionSection>

          {/* Accordion: each solution column */}
          {groupedColumns.map((col) => (
            <AccordionSection
              key={col.heading}
              title={col.heading}
              isOpen={openAccordion === col.heading}
              onToggle={() => toggleAccordion(col.heading)}
            >
              <ul className="space-y-0.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="block py-2 text-[13px] transition-colors"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                      onClick={closeAll}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionSection>
          ))}

          {/* Accordion: Best Sellers */}
          <AccordionSection
            title="Best Sellers"
            isOpen={openAccordion === "best-sellers"}
            onToggle={() => toggleAccordion("best-sellers")}
          >
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {bestSellerProducts.map((p) => (
                <Link
                  key={p.id}
                  href={p.href}
                  className="shrink-0 w-[100px]"
                  onClick={closeAll}
                >
                  <div className="relative w-full h-[80px] rounded-lg overflow-hidden bg-white/10 mb-2">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </div>
                  <p className="text-[11px] font-medium text-white/80 truncate">{p.name}</p>
                  <p className="text-[11px] font-bold" style={{ color: "#4caf50" }}>{p.price}</p>
                </Link>
              ))}
            </div>
          </AccordionSection>

          {/* Direct nav links */}
          <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {topNavItems
              .filter((i) => !i.hasMegaMenu)
              .map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between py-3 text-[13px] font-medium border-b transition-colors"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                  onClick={closeAll}
                >
                  {item.label}
                  <ChevronRight className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
                </Link>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
