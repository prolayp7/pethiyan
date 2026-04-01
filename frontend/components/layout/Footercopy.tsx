import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  ArrowRight,
  MoveRight,
} from "lucide-react";
import FooterNewsletter from "./FooterNewsletter";

/* ─── Data ───────────────────────────────────────────────────── */

const navColumns = [
  {
    title: "Products",
    links: [
      { label: "Standup Pouches", href: "/categories/standup-pouches" },
      { label: "Ziplock Bags", href: "/categories/ziplock-pouches" },
      { label: "Custom Packaging", href: "/categories/custom-packaging" },
      { label: "Eco Packaging", href: "/categories/eco-packaging" },
      { label: "Wholesale Orders", href: "/wholesale" },
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
      { label: "Press", href: "/press" },
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
      { label: "FAQs", href: "/faq" },
    ],
  },
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

/* ─── Shared micro-component: NavLink with underline slide ────── */

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

/* ─── Component ──────────────────────────────────────────────── */

export default function Footer() {
  return (
    <footer
      className="bg-[#0a0a0a] text-white overflow-hidden"
      aria-label="Site footer"
    >

      {/* ══════════════════════════════════════════════════════════
          ZONE 1 — PRE-FOOTER CTA
          Empi.re: full-width bold typography, generous whitespace
          Taylors Wines: confident scale, premium presence
      ══════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">

        {/* Very faint top-centred radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(31,79,138,0.18) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        {/* Fade-rule separator */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-350 mx-auto px-6 sm:px-10 lg:px-16 py-28 lg:py-36">

          {/* Editorial eyebrow */}
          <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-neutral-600 mb-10">
            Get Started
          </p>

          {/* Empi.re-style large stacked headline — mixed weight */}
          <div className="mb-12 lg:mb-14">
            <h2
              className="font-light text-white/30 leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)" }}
            >
              Build better
            </h2>
            <h2
              className="font-extrabold leading-[0.88] tracking-tight bg-clip-text text-transparent"
              style={{
                fontSize: "clamp(3.5rem, 9.5vw, 9rem)",
                backgroundImage:
                  "linear-gradient(105deg, #ffffff 0%, rgba(255,255,255,0.75) 60%, #4caf50 100%)",
              }}
            >
              packaging
            </h2>
            <h2
              className="font-semibold text-white/45 leading-none tracking-tight"
              style={{ fontSize: "clamp(1.4rem, 3.5vw, 3.2rem)" }}
            >
              for modern brands.
            </h2>
          </div>

          {/* Subtext + CTAs — row on large, stacked on small */}
          <div className="flex flex-col sm:flex-row items-start gap-8 sm:gap-14">
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mt-1">
              Join thousands of brands using L-Commerce packaging solutions to
              ship with confidence.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/shop"
                className="group inline-flex items-center justify-between gap-10 px-6 py-3.5 bg-white text-[#0a0a0a] text-sm font-bold rounded-full hover:bg-[#4caf50] hover:text-white transition-all duration-300 shadow-lg shadow-black/30 hover:shadow-[#4caf50]/20 min-w-50"
              >
                Explore Products
                <ArrowRight
                  className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-between gap-10 px-6 py-3.5 border border-white/12 hover:border-white/25 text-white/60 hover:text-white text-sm font-semibold rounded-full transition-all duration-300 min-w-50"
              >
                Contact Sales
                <MoveRight
                  className="h-4 w-4 group-hover:translate-x-1 transition-transform shrink-0"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 2 — MAIN FOOTER GRID
          Lupine Lights: strong grid, max-w-350
          Torriden: ultra-clean columns, gentle hover effects
      ══════════════════════════════════════════════════════════ */}
      <div
        className="border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-350 mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr] gap-14 lg:gap-10 xl:gap-16">

            {/* ── COLUMN 1: Brand ── */}
            <div className="sm:col-span-2 lg:col-span-1">

              {/* Logo */}
              <Link href="/" aria-label="Pethiyan — Home" className="inline-block mb-5">
                <Image
                  src="/pethiyan-logo.png"
                  alt="Pethiyan"
                  width={3000}
                  height={3000}
                  className="h-10 sm:h-11 w-auto object-contain brightness-0 invert"
                />
              </Link>

              {/* Brand statement — Taylors Wines storytelling */}
              <p className="text-sm text-neutral-500 leading-relaxed mb-8 max-w-70">
                L-Commerce creates premium packaging solutions engineered for
                modern ecommerce brands. From concept to courier — crafted with
                purpose.
              </p>

              {/* Newsletter */}
              <div className="mb-8">
                <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-neutral-600 mb-4">
                  Newsletter
                </p>
                <FooterNewsletter />
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-2.5">
                {socialLinks.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-600 hover:border-neutral-500 hover:text-white hover:bg-white/5 hover:scale-110 transition-all duration-300"
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* ── COLUMNS 2–4: Navigation ── */}
            {navColumns.map((col) => (
              <div key={col.title}>

                {/* Column header — Torriden: tiny, tracked, restrained */}
                <h3 className="text-[10px] font-semibold tracking-[0.22em] uppercase text-neutral-600 mb-7">
                  {col.title}
                </h3>

                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <NavLink label={link.label} href={link.href} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 3 — LEGAL BAR
          Taylors Wines: confident, uncluttered bottom strip
      ══════════════════════════════════════════════════════════ */}
      <div className="relative">

        {/* Gradient divider — green brand accent fade */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.06) 15%, rgba(76,175,80,0.15) 50%, rgba(255,255,255,0.06) 85%, transparent)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-350 mx-auto px-6 sm:px-10 lg:px-16 py-5">
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
