import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  ArrowUpRight,
} from "lucide-react";
import FooterNewsletter from "./FooterNewsletter";

/* ─── Data ───────────────────────────────────────────────────── */

const productsLinks = [
  { label: "Standup Pouches", href: "/categories/standup-pouches" },
  { label: "Ziplock Bags", href: "/categories/ziplock-pouches" },
  { label: "Custom Packaging", href: "/categories/custom-packaging" },
  { label: "Eco Packaging", href: "/categories/eco-packaging" },
  { label: "Bulk Orders", href: "/bulk" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Process", href: "/process" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
];

const supportLinks = [
  { label: "Contact", href: "/contact" },
  { label: "Help Center", href: "/help" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Track Order", href: "/track-order" },
  { label: "FAQs", href: "/faq" },
];

const socialLinks = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
  { label: "Twitter / X", icon: Twitter, href: "#" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

/* ─── NavLink — Torriden-style underline slide animation ──────── */

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className={[
        "relative inline-block pb-px text-sm text-neutral-500",
        "after:absolute after:bottom-0 after:left-0",
        "after:h-px after:w-0 after:bg-neutral-400",
        "after:transition-[width] after:duration-300",
        "hover:after:w-full hover:text-white",
        "transition-colors duration-300",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

/* ─── NavColumn ───────────────────────────────────────────────── */

function NavColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-[10px] font-semibold tracking-[0.22em] uppercase text-neutral-600 mb-8">
        {title}
      </h3>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.label}>
            <NavLink label={link.label} href={link.href} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────── */

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white" aria-label="Site footer">

      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — PREMIUM CTA PANEL
          Empi.re: oversized editorial typography
          Arc'teryx / Apple: pure space, no decoration
          Split layout: display type left · description + CTAs right
      ══════════════════════════════════════════════════════════ */}
      <div className="relative">

        {/* Top fade-rule separator */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-350 mx-auto px-6 sm:px-10 lg:px-16 py-28 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-end">

            {/* ── Left: Empi.re-scale display heading ── */}
            {/*
              Three-line mixed-weight stack:
              Line 1 — light / dim    → sets the subject
              Line 2 — black / accent → the emotional peak
              Line 3 — light / mid    → completes the thought
            */}
            <div>
              <h2
                className="font-light text-white/25 leading-[0.9] tracking-tight"
                style={{ fontSize: "clamp(2.8rem, 7.5vw, 6.5rem)" }}
              >
                Packaging that
              </h2>
              <h2
                className="font-black leading-[0.88] tracking-tight"
                style={{
                  fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
                  backgroundImage:
                    "linear-gradient(110deg, #ffffff 0%, rgba(255,255,255,0.85) 50%, #4caf50 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                elevates
              </h2>
              <h2
                className="font-light text-white/55 leading-none tracking-tight"
                style={{ fontSize: "clamp(2.8rem, 7.5vw, 6.5rem)" }}
              >
                your brand.
              </h2>
            </div>

            {/* ── Right: description + CTA buttons ── */}
            <div className="flex flex-col justify-end">
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-neutral-600 mb-6">
                Premium Packaging
              </p>
              <p className="text-base text-neutral-500 leading-relaxed mb-10 max-w-xs">
                Discover packaging solutions engineered for modern ecommerce
                brands — from concept to courier.
              </p>

              {/* Aesop-style rectangular buttons — not pills */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/shop"
                  className="group inline-flex items-center justify-between gap-8 bg-white text-neutral-950 px-6 py-3.5 rounded text-sm font-semibold hover:bg-neutral-100 transition-all duration-300 min-w-48"
                >
                  Explore Products
                  <ArrowUpRight
                    className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-between gap-8 border border-neutral-700 hover:border-neutral-400 text-neutral-400 hover:text-white px-6 py-3.5 rounded text-sm font-semibold transition-all duration-300 min-w-48"
                >
                  Contact Sales
                  <ArrowUpRight
                    className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — MAIN FOOTER CONTENT
          Lupine Lights: strong structural grid
          Torriden: ultra-clean minimal columns
      ══════════════════════════════════════════════════════════ */}
      <div className="border-t border-neutral-800/60">
        <div className="max-w-350 mx-auto px-6 sm:px-10 lg:px-16 py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr] gap-16">

            {/* ── Column 1: Brand ── */}
            <div className="sm:col-span-2 lg:col-span-1">

              {/* Logo */}
              <Link href="/" aria-label="Home" className="inline-block mb-6">
                <Image
                  src="/pethiyan-logo.png"
                  alt="L-Commerce"
                  width={3000}
                  height={3000}
                  className="h-9 w-auto object-contain brightness-0 invert opacity-90"
                />
              </Link>

              {/* Brand statement — Taylors Wines storytelling weight */}
              <p className="text-sm text-neutral-500 leading-relaxed mb-10 max-w-72">
                L-Commerce builds premium packaging solutions designed for
                fast-growing ecommerce brands.
              </p>

              {/* Newsletter */}
              <div className="mb-10">
                <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-neutral-600 mb-4">
                  Newsletter
                </p>
                <FooterNewsletter />
              </div>

              {/* Social icons — minimal, no fill */}
              <div className="flex items-center gap-3">
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

            {/* ── Columns 2–4: Navigation ── */}
            <NavColumn title="Products" links={productsLinks} />
            <NavColumn title="Company" links={companyLinks} />
            <NavColumn title="Support" links={supportLinks} />

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — LEGAL BAR
          Taylors Wines: confident uncluttered bottom strip
      ══════════════════════════════════════════════════════════ */}
      <div className="relative">

        {/* Gradient divider — green brand-tone centre fade */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.05) 20%, rgba(76,175,80,0.18) 50%, rgba(255,255,255,0.05) 80%, transparent)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-350 mx-auto px-6 sm:px-10 lg:px-16 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

            {/* Copyright */}
            <p className="text-xs text-neutral-700 order-last sm:order-first">
              &copy; {new Date().getFullYear()} L-Commerce. All rights reserved.
            </p>

            {/* Legal links */}
            <nav
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1"
              aria-label="Legal links"
            >
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs text-neutral-700 hover:text-neutral-300 transition-colors duration-300"
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
