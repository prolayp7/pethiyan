"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Menu, X, Package, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MegaMenuContent from "./MegaMenuContent";

/* ─── Data ───────────────────────────────────────────────────── */

const topNavItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop", hasShopDropdown: true },
  { label: "Categories", href: "/categories", hasMegaMenu: true },
  { label: "Custom Packaging", href: "/categories/custom-packaging" },
  { label: "Eco Packaging", href: "/categories/eco-packaging" },
  { label: "Industries", href: "/industries" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const shopDropdownLinks = [
  { label: "Shop All Products", href: "/shop", highlight: true },
  { divider: true },
  { label: "New Arrivals", href: "/new-arrivals", icon: "🆕" },
  { label: "Best Sellers", href: "/best-sellers", icon: "⭐" },
  { label: "On Sale", href: "/sale", icon: "🏷️" },
  { divider: true },
  { label: "Custom Packaging", href: "/categories/custom-packaging", icon: "🎨" },
  { label: "Eco Packaging", href: "/categories/eco-packaging", icon: "🌿" },
  { label: "Bulk Orders", href: "/bulk", icon: "📦" },
];

const mobileCategories = [
  { label: "Stand-Up Pouches", href: "/categories/standup-pouches" },
  { label: "Ziplock Bags", href: "/categories/ziplock-pouches" },
  { label: "Flat Bottom Bags", href: "/categories/flat-bottom-bags" },
  { label: "Spout Pouches", href: "/categories/spout-pouches" },
  { label: "Vacuum Pouches", href: "/categories/vacuum-pouches" },
  { label: "Window Bags", href: "/categories/window-bags" },
  { label: "Custom Packaging", href: "/categories/custom-packaging" },
  { label: "Eco Packaging", href: "/categories/eco-packaging" },
];

/* ─── AccordionSection ───────────────────────────────────────── */

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
    <div style={{ borderBottom: "1px solid #e8edf5" }}>
      <button
        className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors"
        style={{ color: isOpen ? "#123f7a" : "#374151" }}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-[12px] font-semibold">{title}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────── */

export default function NavigationMenu4() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMegaEnter = () => { if (megaTimer.current) clearTimeout(megaTimer.current); setMegaOpen(true); setShopOpen(false); };
  const handleMegaLeave = () => { megaTimer.current = setTimeout(() => setMegaOpen(false), 100); };

  const handleShopEnter = () => { if (shopTimer.current) clearTimeout(shopTimer.current); setShopOpen(true); setMegaOpen(false); };
  const handleShopLeave = () => { shopTimer.current = setTimeout(() => setShopOpen(false), 100); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMegaOpen(false); setShopOpen(false); setMobileOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeAll = () => { setMegaOpen(false); setShopOpen(false); setMobileOpen(false); };
  const toggleAccordion = (key: string) => setOpenAccordion((p) => (p === key ? null : key));

  return (
    <>
      <nav
        className="relative w-full bg-white"
        style={{ borderBottom: "1px solid #e8edf5", zIndex: 40 }}
        aria-label="Main navigation"
      >
        {/* ── DESKTOP NAV BAR ── */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center" role="menubar">
              {topNavItems.map((item) => {
                const isShopActive = item.hasShopDropdown && shopOpen;
                const isCatActive = item.hasMegaMenu && megaOpen;
                const isActive = isShopActive || isCatActive;
                return (
                  <li key={item.label} role="none">
                    {item.hasShopDropdown ? (
                      <div
                        className="relative"
                        onMouseEnter={handleShopEnter}
                        onMouseLeave={handleShopLeave}
                      >
                        <button
                          role="menuitem"
                          aria-haspopup="true"
                          aria-expanded={shopOpen}
                          className="flex items-center gap-1 px-3 py-2 my-1.5 rounded-full text-sm font-medium transition-all duration-150"
                          style={{
                            background: isShopActive ? "rgba(18,63,122,0.08)" : "transparent",
                            color: isShopActive ? "#123f7a" : "#374151",
                          }}
                        >
                          {item.label}
                          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", shopOpen && "rotate-180")} />
                        </button>
                        {/* Simple dropdown */}
                        {shopOpen && (
                          <div
                            className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl py-2"
                            style={{
                              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                              border: "1px solid #e8edf5",
                              zIndex: 51,
                            }}
                            onMouseEnter={handleShopEnter}
                            onMouseLeave={handleShopLeave}
                          >
                            {shopDropdownLinks.map((item, i) => {
                              if ("divider" in item && item.divider) {
                                return <div key={i} className="my-1.5 h-px mx-3" style={{ background: "#e8edf5" }} />;
                              }
                              if ("href" in item) {
                                return (
                                  <Link
                                    key={item.label}
                                    href={item.href!}
                                    className={cn(
                                      "flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition-colors duration-150 hover:bg-[#f0f7ff] hover:text-[#123f7a]",
                                      "highlight" in item && item.highlight ? "font-bold text-[#123f7a]" : "text-gray-600"
                                    )}
                                    onClick={closeAll}
                                  >
                                    {"icon" in item && item.icon && (
                                      <span className="text-base leading-none">{item.icon}</span>
                                    )}
                                    {item.label}
                                  </Link>
                                );
                              }
                              return null;
                            })}
                          </div>
                        )}
                      </div>
                    ) : item.hasMegaMenu ? (
                      <button
                        role="menuitem"
                        aria-haspopup="true"
                        aria-expanded={megaOpen}
                        className="flex items-center gap-1 px-3 py-2 my-1.5 rounded-full text-sm font-medium transition-all duration-150"
                        style={{
                          background: isCatActive ? "rgba(18,63,122,0.08)" : "transparent",
                          color: isCatActive ? "#123f7a" : "#374151",
                        }}
                        onMouseEnter={handleMegaEnter}
                        onMouseLeave={handleMegaLeave}
                        onClick={() => setMegaOpen((v) => !v)}
                      >
                        {item.label}
                        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", megaOpen && "rotate-180")} />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        role="menuitem"
                        className="flex items-center px-3 py-2 my-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 text-gray-600 hover:text-[#123f7a] hover:bg-[rgba(18,63,122,0.06)]"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* MEGA MENU */}
          {megaOpen && (
            <div
              className="absolute top-full left-0 right-0"
              style={{ zIndex: 50, boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMegaLeave}
            >
              <MegaMenuContent onClose={closeAll} />
            </div>
          )}
        </div>

        {/* ── MOBILE NAV BAR ── */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" style={{ color: "#4ea85f" }} />
            <span className="text-[11px] font-black tracking-[0.18em] uppercase" style={{ color: "#123f7a" }}>
              Menu
            </span>
          </div>
          <button
            className="flex items-center justify-center w-9 h-9 rounded-full transition-colors"
            style={{ background: "rgba(18,63,122,0.07)" }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen
              ? <X className="h-4.5 w-4.5" style={{ color: "#123f7a" }} />
              : <Menu className="h-4.5 w-4.5" style={{ color: "#123f7a" }} />
            }
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-x-0 bottom-0 overflow-y-auto bg-white"
          style={{ top: "var(--mobile-nav-top, 104px)", zIndex: 39, borderTop: "1px solid #e8edf5" }}
        >
          {/* Quick links grid */}
          <div className="px-4 pt-5 pb-3">
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
                  className="flex items-center justify-center py-2.5 rounded-lg text-[12px] font-semibold transition-colors"
                  style={{
                    background: "rgba(18,63,122,0.06)",
                    color: "#123f7a",
                    border: "1px solid rgba(18,63,122,0.1)",
                  }}
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
              {mobileCategories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={cat.href}
                    className="flex items-center gap-2 py-2.5 text-[13px] text-gray-500 hover:text-[#123f7a] transition-colors"
                    onClick={closeAll}
                  >
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: "#4ea85f" }} />
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/shop"
              className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-lg text-[12px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #123f7a, #0f2f5f)" }}
              onClick={closeAll}
            >
              All Packaging <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </AccordionSection>

          {/* Direct links */}
          <div className="px-4 py-3" style={{ borderTop: "1px solid #e8edf5" }}>
            {topNavItems.filter((i) => !i.hasMegaMenu && !i.hasShopDropdown).map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between py-3.5 text-[13px] font-medium text-gray-600 border-b hover:text-[#123f7a] transition-colors"
                style={{ borderColor: "#f1f5f9" }}
                onClick={closeAll}
              >
                {item.label}
                <ChevronRight className="h-3.5 w-3.5 opacity-30" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
