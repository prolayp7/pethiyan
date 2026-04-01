"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  Menu,
  X,
  ChevronRight,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  MoveRight,
} from "lucide-react";
import FooterNewsletter from "./FooterNewsletter";

/* ─── Nav data ───────────────────────────────────────────────── */

const navItems = [
  {
    label: "Products",
    href: "/shop",
    children: [
      { label: "Standup Pouches", href: "/categories/standup-pouches", desc: "Flexible & rigid pouch formats" },
      { label: "Ziplock Bags", href: "/categories/ziplock-pouches", desc: "Resealable poly & kraft bags" },
      { label: "Custom Packaging", href: "/categories/custom-packaging", desc: "Brand-printed solutions" },
      { label: "Eco Packaging", href: "/categories/eco-packaging", desc: "Sustainable & compostable" },
    ],
  },
  {
    label: "Company",
    href: "/about",
    children: [
      { label: "About Us", href: "/about", desc: "Our story and mission" },
      { label: "Our Process", href: "/process", desc: "From design to delivery" },
      { label: "Sustainability", href: "/sustainability", desc: "Our environmental commitments" },
      { label: "Careers", href: "/careers", desc: "Join our team" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Blog", href: "/blog", desc: "Packaging tips & trends" },
      { label: "Guides", href: "/guides", desc: "In-depth how-to content" },
      { label: "Case Studies", href: "/case-studies", desc: "Real brand results" },
    ],
  },
  {
    label: "Support",
    href: "/help",
    children: [
      { label: "Help Center", href: "/help", desc: "FAQs & documentation" },
      { label: "Shipping", href: "/shipping", desc: "Rates, times & policies" },
      { label: "Returns", href: "/returns", desc: "Easy return process" },
      { label: "Track Order", href: "/track-order", desc: "Real-time tracking" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    children: [],
  },
];

/* ─── Footer nav grid data ──────────────────────────────────── */

const footerColumns = [
  {
    title: "Products",
    links: [
      { label: "Standup Pouches", href: "/categories/standup-pouches" },
      { label: "Ziplock Bags", href: "/categories/ziplock-pouches" },
      { label: "Custom Packaging", href: "/categories/custom-packaging" },
      { label: "Eco Packaging", href: "/categories/eco-packaging" },
      { label: "Bulk Orders", href: "/bulk" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Process", href: "/process" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Help Center", href: "/help" },
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Track Order", href: "/track-order" },
    ],
  },
];

const socialLinks = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

/* ─── DropdownItem — desktop submenu entry ───────────────────── */

function DropdownItem({
  label,
  href,
  desc,
}: {
  label: string;
  href: string;
  desc?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-800/70 transition-colors duration-200"
    >
      <div className="mt-2 w-1 h-1 rounded-full bg-neutral-600 group-hover:bg-green-500 transition-colors duration-200 shrink-0" />
      <div>
        <p className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors duration-200 leading-tight">
          {label}
        </p>
        {desc && (
          <p className="text-xs text-neutral-600 group-hover:text-neutral-500 transition-colors duration-200 mt-0.5 leading-tight">
            {desc}
          </p>
        )}
      </div>
    </Link>
  );
}

/* ─── NavItem — desktop nav with hover dropdown ──────────────── */

function NavItem({
  item,
}: {
  item: (typeof navItems)[number];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!item.children.length) {
    return (
      <Link
        href={item.href}
        className={[
          "relative inline-block pb-px text-sm tracking-widest uppercase",
          "text-neutral-300 hover:text-white",
          "after:absolute after:bottom-0 after:left-0",
          "after:h-px after:w-0 after:bg-white",
          "after:transition-[width] after:duration-300",
          "hover:after:w-full transition-colors duration-300",
        ].join(" ")}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button
        className={[
          "group flex items-center gap-1.5 relative pb-px text-sm tracking-widest uppercase",
          "text-neutral-300 hover:text-white",
          "after:absolute after:bottom-0 after:left-0",
          "after:h-px after:w-0 after:bg-white",
          "after:transition-[width] after:duration-300",
          open ? "text-white after:w-full" : "hover:after:w-full",
          "transition-colors duration-300",
        ].join(" ")}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown panel */}
      <div
        className={[
          "absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50",
          "bg-neutral-900 border border-neutral-800/80 rounded-xl shadow-2xl shadow-black/50",
          "p-3 min-w-56",
          "transition-all duration-300 ease-out origin-top",
          open
            ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none",
        ].join(" ")}
        role="menu"
      >
        {/* Arrow notch */}
        <div
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-900 border-l border-t border-neutral-800/80 rotate-45"
          aria-hidden="true"
        />
        {item.children.map((child) => (
          <DropdownItem
            key={child.label}
            label={child.label}
            href={child.href}
            desc={child.desc}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────── */

export default function Footer() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const toggleMobileSection = (label: string) => {
    setMobileExpanded((prev) => (prev === label ? null : label));
  };

  return (
    <footer
      className="bg-neutral-950 text-white overflow-hidden"
      aria-label="Site footer"
    >

      {/* ══════════════════════════════════════════════════════════
          HERO HEADER SECTION — 3-LAYER STACK

          ┌────────────────────────────────────────┐
          │ [Layer 1] "PETHIYAN" bg typography     │  z-0  absolute
          │ [Layer 2] Logo + nav + dropdowns       │  z-50 absolute top-0
          │ [Layer 3] Tagline + description grid   │  z-10 relative
          └────────────────────────────────────────┘
      ══════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "clamp(380px, 52vw, 560px)" }}
        aria-label="Hero header"
      >
        {/* ─ Top separator rule ─ */}
        <div
          className="absolute top-0 inset-x-0 h-px z-10"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.07) 25%, rgba(255,255,255,0.07) 75%, transparent)",
          }}
          aria-hidden="true"
        />

        {/* ──────────────────────────────────────────────────────
            LAYER 1 — Background "PETHIYAN" watermark
        ────────────────────────────────────────────────────── */}
        <p
          className="absolute inset-x-0 top-1/2 -translate-y-[40%] text-center font-black uppercase leading-none select-none pointer-events-none whitespace-nowrap z-0"
          style={{
            fontSize: "clamp(4rem, 18vw, 18rem)",
            color: "rgba(255,255,255,0.045)",
            letterSpacing: "-0.03em",
          }}
          aria-hidden="true"
        >
          PETHIYAN
        </p>

        {/* ──────────────────────────────────────────────────────
            LAYER 2 — Navigation bar (absolute, z-50)
        ────────────────────────────────────────────────────── */}
        <header
          className="absolute top-0 left-0 w-full z-50"
          aria-label="Site navigation"
        >
          <div className="max-w-350 mx-auto px-6 sm:px-10 lg:px-16">
            <div className="flex items-center justify-between py-7 lg:py-8">

              {/* Logo */}
              <Link href="/" aria-label="Home" className="shrink-0 z-10">
                <Image
                  src="/pethiyan-logo.png"
                  alt="Pethiyan"
                  width={3000}
                  height={3000}
                  className="h-10 sm:h-11 w-auto object-contain brightness-0 invert opacity-85"
                />
              </Link>

              {/* Desktop nav */}
              <nav
                className="hidden lg:flex items-center gap-7 xl:gap-9"
                aria-label="Primary"
              >
                {navItems.map((item) => (
                  <NavItem key={item.label} item={item} />
                ))}
              </nav>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 -mr-2 text-neutral-400 hover:text-white transition-colors duration-300"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        {/* ──────────────────────────────────────────────────────
            Mobile nav overlay — full-section takeover
        ────────────────────────────────────────────────────── */}
        {mobileOpen && (
          <div
            className="absolute inset-0 z-60 bg-neutral-950 flex flex-col overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Header bar */}
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

            {/* Accordion nav items */}
            <ul className="flex flex-col px-6 py-4 gap-0" role="list">
              {navItems.map((item) => (
                <li key={item.label} className="border-b border-neutral-800/40">
                  {item.children.length > 0 ? (
                    <>
                      <button
                        className="w-full flex items-center justify-between py-4 text-sm tracking-[0.16em] uppercase text-neutral-300 hover:text-white transition-colors duration-300"
                        onClick={() => toggleMobileSection(item.label)}
                        aria-expanded={mobileExpanded === item.label}
                      >
                        {item.label}
                        <ChevronRight
                          className={`h-4 w-4 text-neutral-600 transition-transform duration-300 ${mobileExpanded === item.label ? "rotate-90" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                      {mobileExpanded === item.label && (
                        <ul className="pb-3 pl-3 space-y-0.5" role="list">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <Link
                                href={child.href}
                                className="block py-2.5 text-sm text-neutral-500 hover:text-white transition-colors duration-200"
                                onClick={() => setMobileOpen(false)}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center py-4 text-sm tracking-[0.16em] uppercase text-neutral-300 hover:text-white transition-colors duration-300"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────
            LAYER 3 — Hero content (sits above bg typography)
        ────────────────────────────────────────────────────── */}
        <div className="relative z-10 max-w-350 mx-auto px-6 sm:px-10 lg:px-16 pt-36 pb-20 lg:pt-44 lg:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-end">

            {/* Left — brand tagline */}
            <div>
              <p
                className="text-[10px] font-bold tracking-[0.38em] uppercase text-neutral-700 mb-5"
                aria-hidden="true"
              >
                Est. 2020
              </p>
              <p
                className="text-lg sm:text-xl font-bold tracking-[0.22em] uppercase leading-[1.4]"
                style={{ color: "#4caf50" }}
              >
                The Power of
                <br />
                Perfect Packaging
              </p>
            </div>

            {/* Right — brand description */}
            <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">
              Premium packaging solutions engineered for modern ecommerce
              brands. From concept to courier — crafted with purpose.
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

      {/* ══════════════════════════════════════════════════════════
          MAIN FOOTER GRID — 4 columns
      ══════════════════════════════════════════════════════════ */}
      <div className="max-w-350 mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* ── Col 1: Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-neutral-600 mb-6">
              Brand
            </p>
            <p className="text-sm text-neutral-500 leading-relaxed mb-8 max-w-xs">
              L-Commerce creates premium packaging solutions designed for modern
              brands — built to make every shipment memorable.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 mb-10">
              <Link
                href="/shop"
                className="group inline-flex items-center justify-between gap-6 px-5 py-3 border border-neutral-800 hover:border-neutral-500 rounded text-xs font-semibold text-neutral-400 hover:text-white transition-all duration-300 max-w-52"
              >
                Explore Products
                <ArrowRight
                  className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform shrink-0"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-between gap-6 px-5 py-3 border border-neutral-800 hover:border-neutral-500 rounded text-xs font-semibold text-neutral-500 hover:text-white transition-all duration-300 max-w-52"
              >
                Request a Quote
                <MoveRight
                  className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform shrink-0"
                  aria-hidden="true"
                />
              </Link>
            </div>

            {/* Newsletter */}
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-neutral-600 mb-4">
              Newsletter
            </p>
            <FooterNewsletter />

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-8">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-neutral-600 hover:text-white transition-colors duration-300"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Cols 2–4: Nav columns ── */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[10px] font-semibold tracking-[0.22em] uppercase text-neutral-600 mb-6">
                {col.title}
              </h3>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={[
                        "relative inline-block pb-px text-sm",
                        "text-neutral-500 hover:text-white",
                        "after:absolute after:bottom-0 after:left-0",
                        "after:h-px after:w-0 after:bg-neutral-400",
                        "after:transition-[width] after:duration-300",
                        "hover:after:w-full transition-colors duration-300",
                      ].join(" ")}
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

      {/* ══════════════════════════════════════════════════════════
          LEGAL BAR
      ══════════════════════════════════════════════════════════ */}
      <div className="relative">
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.05) 20%, rgba(76,175,80,0.14) 50%, rgba(255,255,255,0.05) 80%, transparent)",
          }}
          aria-hidden="true"
        />
        <div className="max-w-350 mx-auto px-6 sm:px-10 lg:px-16 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-neutral-700 order-last sm:order-first">
              &copy; {new Date().getFullYear()} L-Commerce. All rights reserved.
            </p>
            <nav
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1"
              aria-label="Legal links"
            >
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs text-neutral-700 hover:text-neutral-400 transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

    </footer>
  );
}
