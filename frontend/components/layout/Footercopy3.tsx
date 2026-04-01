"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Linkedin,
  Youtube,
  Menu,
  X,
  ArrowRight,
  MoveRight,
} from "lucide-react";
import FooterNewsletter from "./FooterNewsletter";

/* ─── Data ───────────────────────────────────────────────────── */

const heroNavLinks = [
  { label: "Products", href: "/shop" },
  { label: "Company", href: "/about" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/help" },
  { label: "Contact", href: "/contact" },
];

const navColumns = [
  {
    title: "Products",
    links: [
      { label: "Standup Pouches", href: "/categories/standup-pouches" },
      { label: "Ziplock Bags", href: "/categories/ziplock-pouches" },
      { label: "Custom Packaging", href: "/categories/custom-packaging" },
      { label: "Eco Packaging", href: "/categories/eco-packaging" },
      { label: "Bulk Orders", href: "/bulk" },
      { label: "Wholesale", href: "/wholesale" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Our Process", href: "/process" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Help Center", href: "/help" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Track Order", href: "/track-order" },
      { label: "FAQs", href: "/faq" },
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
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

/* ─── Underline-slide NavLink ─────────────────────────────────── */

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className={[
        "relative inline-block pb-px text-sm tracking-[0.12em] uppercase",
        "text-neutral-400 hover:text-white",
        "after:absolute after:bottom-0 after:left-0",
        "after:h-px after:w-0 after:bg-white",
        "after:transition-[width] after:duration-300",
        "hover:after:w-full transition-colors duration-300",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

/* ─── Component ──────────────────────────────────────────────── */

export default function Footer() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <footer
      className="bg-neutral-950 text-white overflow-hidden"
      aria-label="Site footer"
    >

      {/* ══════════════════════════════════════════════════════════
          HERO SECTION — 3-LAYER EDITORIAL LAYOUT
          ─────────────────────────────────────────────────────────
          Layer 1 (back)   : full-width watermark "PETHIYAN"
          Layer 2 (middle) : navbar pinned to top, z-20
          Layer 3 (front)  : tagline + description content grid
      ══════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "clamp(360px, 50vw, 520px)" }}
        aria-label="Footer hero"
      >
        {/* Top fade-rule */}
        <div
          className="absolute top-0 inset-x-0 h-px z-10"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.07) 25%, rgba(255,255,255,0.07) 75%, transparent)",
          }}
          aria-hidden="true"
        />

        {/* ── LAYER 1: Watermark background typography ── */}
        <p
          className="absolute inset-x-0 top-1/2 -translate-y-[42%] text-center font-black uppercase leading-none select-none pointer-events-none whitespace-nowrap z-0"
          style={{
            fontSize: "clamp(4.5rem, 18vw, 18rem)",
            color: "rgba(255,255,255,0.042)",
            letterSpacing: "-0.03em",
          }}
          aria-hidden="true"
        >
          PETHIYAN
        </p>

        {/* ── LAYER 2: Navigation bar (absolute top, z-20) ── */}
        <nav
          className="absolute top-0 left-0 w-full z-20"
          aria-label="Footer hero navigation"
        >
          <div className="max-w-350 mx-auto px-6 sm:px-10 lg:px-16">
            <div className="flex items-center justify-between py-7 lg:py-9">

              {/* Logo */}
              <Link href="/" aria-label="Home" className="shrink-0">
                <Image
                  src="/pethiyan-logo.png"
                  alt="Pethiyan"
                  width={3000}
                  height={3000}
                  className="h-10 sm:h-11 w-auto object-contain brightness-0 invert opacity-80"
                />
              </Link>

              {/* Desktop nav */}
              <ul className="hidden lg:flex items-center gap-8 xl:gap-10" role="list">
                {heroNavLinks.map((link) => (
                  <li key={link.label}>
                    <NavLink label={link.label} href={link.href} />
                  </li>
                ))}
              </ul>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 -mr-2 text-neutral-400 hover:text-white transition-colors duration-300"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                aria-controls="footer-mobile-nav"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>

        {/* ── Mobile nav overlay ── */}
        {mobileOpen && (
          <div
            id="footer-mobile-nav"
            className="absolute inset-0 z-30 bg-neutral-950 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Header row */}
            <div className="flex items-center justify-between px-6 py-7 border-b border-neutral-800/60">
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
                  className="h-10 w-auto object-contain brightness-0 invert opacity-80"
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

            {/* Mobile links */}
            <ul className="flex flex-col px-6 py-6 gap-0" role="list">
              {heroNavLinks.map((link, i) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between py-4 text-sm tracking-[0.18em] uppercase text-neutral-300 hover:text-white border-b border-neutral-800/40 transition-colors duration-300"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                    <span
                      className="text-[9px] font-bold tabular-nums text-neutral-700"
                      aria-hidden="true"
                    >
                      0{i + 1}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── LAYER 3: Hero content (relative, sits above watermark) ── */}
        <div className="relative z-10 max-w-350 mx-auto px-6 sm:px-10 lg:px-16 pt-36 pb-20 lg:pt-44 lg:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-end">

            {/* Left — brand tagline */}
            <div>
              <p
                className="text-[10px] font-bold tracking-[0.35em] uppercase text-neutral-700 mb-6"
                aria-hidden="true"
              >
                Est. 2020
              </p>
              <p
                className="text-lg sm:text-xl font-bold tracking-[0.18em] uppercase leading-snug"
                style={{ color: "#4caf50" }}
              >
                The Power of
                <br />
                Perfect Packaging
              </p>
            </div>

            {/* Right — brand description */}
            <p className="text-sm text-neutral-500 leading-relaxed max-w-sm md:pb-0.5">
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
          MAIN FOOTER GRID
          4-column: Brand · Products · Company · Support
      ══════════════════════════════════════════════════════════ */}
      <div className="max-w-350 mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* ── Col 1: Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-neutral-600 mb-6">
              Brand
            </p>
            <p className="text-sm text-neutral-500 leading-relaxed mb-8 max-w-xs">
              L-Commerce creates premium packaging solutions designed for
              modern brands — built to make every shipment memorable.
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
          {navColumns.map((col) => (
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

        {/* Gradient divider with green centre pulse */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.05) 20%, rgba(76,175,80,0.15) 50%, rgba(255,255,255,0.05) 80%, transparent)",
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
