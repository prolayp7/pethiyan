import Link from "next/link";
import Image from "next/image";
import FooterBrandIdentityBand from "./FooterBrandIdentityBand";
import {
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  MoveRight,
} from "lucide-react";
import FooterNewsletter from "./FooterNewsletter";

/* ─── Static data ────────────────────────────────────────────── */

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

/* ─── Component ──────────────────────────────────────────────── */

export default function Footer() {
  return (
    <footer
      className="bg-[#050810] text-white overflow-hidden"
      aria-label="Site footer"
    >

      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — NEWSLETTER CTA STRIP
          Split layout: headline left · form right
      ══════════════════════════════════════════════════════════ */}
      <div className="relative">

        {/* Top fade-rule */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.07) 25%, rgba(255,255,255,0.07) 75%, transparent)",
          }}
          aria-hidden="true"
        />

        {/* Left-anchored radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 90% at 10% 60%, rgba(31,79,138,0.2) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

            {/* Left — editorial headline */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/25 mb-5">
                Newsletter
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-extrabold leading-[1.04] tracking-tight">
                Stay connected with
                <br />
                <em className="not-italic font-light text-white/45">
                  the future of
                </em>
                <br />
                packaging
                <span style={{ color: "#4caf50" }}>.</span>
              </h2>
              <p className="mt-5 text-sm text-white/35 leading-relaxed max-w-xs">
                Get product updates, new launches and exclusive insights
                delivered to your inbox.
              </p>
            </div>

            {/* Right — newsletter form */}
            <div className="lg:pl-8">
              <FooterNewsletter />
            </div>

          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — NAVIGATION GRID
          4-column: Brand · Products · Company · Support
      ══════════════════════════════════════════════════════════ */}
      <div
        className="border-t"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-14 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

            {/* ── Col 1: Brand ── */}
            <div className="sm:col-span-2 lg:col-span-1">
              <p
                className="text-[9px] font-bold tracking-[0.35em] uppercase mb-4 select-none"
                style={{ color: "rgba(255,255,255,0.16)" }}
                aria-hidden="true"
              >
                01
              </p>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.18em] mb-6"
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                Brand
              </p>
              <p className="text-sm text-white/35 leading-relaxed mb-8 max-w-xs">
                L-Commerce creates premium packaging solutions designed for
                modern brands — built to make every shipment memorable.
              </p>

              {/* CTA links */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/shop"
                  className="group inline-flex items-center justify-between gap-6 px-5 py-3 bg-white/6 hover:bg-white/10 border border-white/8 hover:border-white/15 rounded-full text-xs font-semibold text-white/70 hover:text-white transition-all duration-300 max-w-52"
                >
                  Explore Products
                  <ArrowRight
                    className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform shrink-0"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-between gap-6 px-5 py-3 border border-white/8 hover:border-white/15 rounded-full text-xs font-semibold text-white/45 hover:text-white transition-all duration-300 max-w-52"
                >
                  Request a Quote
                  <MoveRight
                    className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform shrink-0"
                    aria-hidden="true"
                  />
                </Link>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-2 mt-8">
                {socialLinks.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/35 hover:border-white/30 hover:text-white hover:bg-white/6 hover:scale-110 transition-all duration-300"
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* ── Cols 2-4: Nav columns ── */}
            {navColumns.map((col, i) => (
              <div key={col.title}>
                <p
                  className="text-[9px] font-bold tracking-[0.35em] uppercase mb-4 select-none"
                  style={{ color: "rgba(255,255,255,0.16)" }}
                  aria-hidden="true"
                >
                  0{i + 2}
                </p>
                <h3
                  className="text-[10px] font-bold uppercase tracking-[0.18em] mb-6"
                  style={{ color: "rgba(255,255,255,0.28)" }}
                >
                  {col.title}
                </h3>
                <ul className="space-y-3.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-0 text-sm text-white/40 hover:text-white transition-colors duration-200"
                      >
                        {/* Dash that grows on hover */}
                        <span
                          className="block h-px w-0 bg-[#4caf50] group-hover:w-3 group-hover:mr-2 transition-all duration-300 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="group-hover:translate-x-0 transition-transform duration-200">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — BRAND IDENTITY BAND
          Logo + tagline left · brand statement right
          Giant watermark behind
      ══════════════════════════════════════════════════════════ */}
     {/* <FooterBrandIdentityBand /> */}

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — BOTTOM LEGAL BAR
          Copyright · Legal links · Social icons
      ══════════════════════════════════════════════════════════ */}
      <div
        className="border-t"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        {/* Gradient rule — editorial line above the bar */}
        <div
          className="h-px w-full -mt-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(76,175,80,0.12) 30%, rgba(76,175,80,0.12) 70%, transparent)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Copyright */}
            <p
              className="text-xs order-last sm:order-first"
              style={{ color: "rgba(255,255,255,0.18)" }}
            >
              &copy; {new Date().getFullYear()} Pethiyan Packaging. All rights
              reserved.
            </p>

            {/* Legal links — centred */}
            <nav
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1"
              aria-label="Legal links"
            >
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs text-white/28 hover:text-white/65 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Social icons — right */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/35 hover:border-white/28 hover:text-white hover:bg-white/6 hover:scale-110 transition-all duration-300"
                >
                  <Icon className="h-3 w-3" aria-hidden="true" />
                </a>
              ))}
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}
