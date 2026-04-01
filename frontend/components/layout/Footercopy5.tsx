"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

/* ─── Navigation data ────────────────────────────────────────── */

const navItems = [
  {
    label: "Products",
    href: "/shop",
    items: [
      { label: "Standup Pouches", href: "/categories/standup-pouches" },
      { label: "Ziplock Bags", href: "/categories/ziplock-pouches" },
      { label: "Custom Packaging", href: "/categories/custom-packaging" },
      { label: "Eco Packaging", href: "/categories/eco-packaging" },
      { label: "Bulk Orders", href: "/bulk" },
    ],
  },
  {
    label: "Company",
    href: "/about",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Our Process", href: "/process" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    label: "Support",
    href: "/help",
    items: [
      { label: "Contact", href: "/contact" },
      { label: "Help Center", href: "/help" },
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Track Order", href: "/track-order" },
    ],
  },
];

/* ─── DropdownMenu — desktop hover panel ─────────────────────── */

function DropdownMenu({
  item,
}: {
  item: (typeof navItems)[number];
}) {
  const [open, setOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enter = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setOpen(true);
  }, []);

  const leave = useCallback(() => {
    leaveTimer.current = setTimeout(() => setOpen(false), 100);
  }, []);

  useEffect(() => () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      {/* Trigger button */}
      <button
        className={[
          "group flex items-center gap-1 relative pb-px",
          "text-sm font-medium tracking-widest uppercase",
          "text-neutral-300 hover:text-white",
          "after:absolute after:bottom-0 after:left-0",
          "after:h-px after:w-0 after:bg-white",
          "after:transition-[width] after:duration-300",
          open ? "text-white after:w-full" : "hover:after:w-full",
          "transition-colors duration-300 outline-none",
        ].join(" ")}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180 text-white" : "text-neutral-500"
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown panel */}
      <div
        className={[
          "absolute left-0 top-full pt-4 z-50",
          "transition-all duration-300 ease-out origin-top",
          open
            ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none",
        ].join(" ")}
        role="menu"
        aria-hidden={!open}
      >
        {/* Arrow notch */}
        <div
          className="ml-4 w-2.5 h-2.5 bg-neutral-900 border-l border-t border-neutral-800 rotate-45 -mb-1.5 relative z-10"
          aria-hidden="true"
        />

        {/* Panel */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl shadow-black/60 p-2 min-w-56 overflow-hidden">
          {item.items.map((sub, idx) => (
            <Link
              key={sub.label}
              href={sub.href}
              role="menuitem"
              className={[
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg",
                "text-sm text-neutral-400 hover:text-white",
                "hover:bg-neutral-800/70 transition-all duration-200",
              ].join(" ")}
              style={{
                transitionDelay: open ? `${idx * 25}ms` : "0ms",
              }}
            >
              {/* Dot indicator */}
              <span
                className="w-1 h-1 rounded-full bg-neutral-700 group-hover:bg-green-500 shrink-0 transition-colors duration-200"
                aria-hidden="true"
              />
              {sub.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────── */

export default function HeaderHero() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (label: string) =>
    setExpandedSection((prev) => (prev === label ? null : label));

  /* Close mobile menu on resize to desktop */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setMobileOpen(false);
        setExpandedSection(null);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    /*
     * ┌──────────────────────────────────────────────────────┐
     * │  Layer 1 (z-0)  → "PATHIYAN" watermark bg text       │
     * │  Layer 2 (z-50) → Navbar: logo + dropdown nav        │
     * │  Layer 3 (z-10) → Hero: tagline + description        │
     * └──────────────────────────────────────────────────────┘
     */
    <section
      className="relative bg-neutral-950 text-white overflow-hidden"
      style={{ minHeight: "clamp(420px, 56vw, 600px)" }}
      aria-label="Hero"
    >

      {/* ──────────────────────────────────────────────────────
          LAYER 1 — Giant background watermark
          Spans full width, sits behind everything
      ────────────────────────────────────────────────────── */}
      <p
        className="absolute inset-x-0 top-1/2 -translate-y-[38%] text-center font-black uppercase leading-none select-none pointer-events-none whitespace-nowrap z-0"
        style={{
          fontSize: "clamp(4rem, 19vw, 19rem)",
          color: "rgba(255,255,255,0.048)",
          letterSpacing: "-0.03em",
        }}
        aria-hidden="true"
      >
        PATHIYAN
      </p>

      {/* ──────────────────────────────────────────────────────
          LAYER 2 — Navigation bar (absolute, z-50)
      ────────────────────────────────────────────────────── */}
      <header
        className="absolute top-0 left-0 w-full z-50"
        aria-label="Primary navigation"
      >
        {/* Top fade-rule */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.07) 25%, rgba(255,255,255,0.07) 75%, transparent)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-350 mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between py-7 lg:py-8">

            {/* ── Logo ── */}
            <Link href="/" aria-label="Home" className="shrink-0 z-10">
              <Image
                src="/pethiyan-logo.png"
                alt="Pethiyan"
                width={3000}
                height={3000}
                className="h-10 sm:h-11 w-auto object-contain brightness-0 invert opacity-85"
              />
            </Link>

            {/* ── Desktop navigation ── */}
            <nav
              className="hidden lg:flex items-center gap-8 xl:gap-10"
              aria-label="Primary"
            >
              {navItems.map((item) => (
                <DropdownMenu key={item.label} item={item} />
              ))}
            </nav>

            {/* ── Mobile hamburger ── */}
            <button
              className="lg:hidden p-2 -mr-2 text-neutral-400 hover:text-white transition-colors duration-300"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────
          Mobile navigation overlay
      ────────────────────────────────────────────────────── */}
      <div
        id="mobile-nav"
        className={[
          "fixed inset-0 z-100 bg-neutral-950 flex flex-col overflow-y-auto",
          "transition-all duration-300 ease-out",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Mobile header row */}
        <div className="flex items-center justify-between px-6 py-7 border-b border-neutral-800/60 shrink-0">
          <Link
            href="/"
            aria-label="Home"
            onClick={() => setMobileOpen(false)}
          >
            <Image
              src="/pethiyan-logo.png"
              alt="Pethiyan"
              width={3000}
              height={3000}
              className="h-10 w-auto object-contain brightness-0 invert opacity-85"
            />
          </Link>
          <button
            className="p-2 -mr-2 text-neutral-400 hover:text-white transition-colors duration-300"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Mobile accordion nav */}
        <ul className="flex flex-col px-6 py-4" role="list">
          {navItems.map((item) => {
            const isOpen = expandedSection === item.label;
            return (
              <li key={item.label} className="border-b border-neutral-800/40">
                <button
                  className="w-full flex items-center justify-between py-4 text-sm tracking-[0.15em] uppercase text-neutral-300 hover:text-white transition-colors duration-300"
                  onClick={() => toggleSection(item.label)}
                  aria-expanded={isOpen}
                >
                  {item.label}
                  <ChevronRight
                    className={`h-4 w-4 text-neutral-600 transition-transform duration-300 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {/* Submenu items */}
                {isOpen && (
                  <ul className="pb-3 pl-2 space-y-0.5" role="list">
                    {item.items.map((sub) => (
                      <li key={sub.label}>
                        <Link
                          href={sub.href}
                          className="flex items-center gap-2.5 py-2.5 text-sm text-neutral-500 hover:text-white transition-colors duration-200"
                          onClick={() => setMobileOpen(false)}
                        >
                          <span
                            className="w-1 h-1 rounded-full bg-neutral-700 shrink-0"
                            aria-hidden="true"
                          />
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* ──────────────────────────────────────────────────────
          LAYER 3 — Hero content grid (z-10, relative)
          Sits visually above the watermark, below the navbar
      ────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-350 mx-auto px-6 sm:px-10 lg:px-16 pt-36 pb-20 lg:pt-44 lg:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-end">

          {/* Left — brand tagline */}
          <div>
            <p
              className="text-[10px] font-bold tracking-[0.4em] uppercase text-neutral-700 mb-6"
              aria-hidden="true"
            >
              Packaging Solutions
            </p>
            <p
              className="text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase leading-snug"
              style={{ color: "#4caf50" }}
            >
              The Power of
              <br />
              Perfect Packaging
            </p>
          </div>

          {/* Right — brand description */}
          <p className="text-sm text-neutral-500 leading-relaxed max-w-md">
            Premium packaging solutions engineered for modern ecommerce brands.
            From concept to courier — crafted with purpose.
          </p>

        </div>
      </div>

      {/* Bottom fade-rule */}
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 75%, transparent)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
