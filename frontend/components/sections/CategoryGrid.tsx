"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, Box, Truck, Archive, Wrench, Layers, Palette, Leaf, ShoppingBag } from "lucide-react";
import type { ApiCategory } from "@/lib/api";

// ─── Static fallback data ─────────────────────────────────────────────────────

const staticCategories = [
  { icon: Archive, title: "Packaging Pouches", href: "/category/standup-pouches",   desc: "Stand-Up Zipper, Kraft, Foil, Window & Custom Printed pouches", color: "#4ea85f" },
  { icon: Box,     title: "Mailer Boxes",      href: "/category/mailer-boxes",      desc: "Corrugated mailer boxes for safe eCommerce shipping & custom branding", color: "#2e7c8a" },
  { icon: Truck,   title: "Courier Bags",      href: "/category/courier-bags",      desc: "Waterproof, tamper-proof courier bags with strong adhesive seal",  color: "#6ea8d8" },
  { icon: Package, title: "Plastic Jars",      href: "/category/plastic-jars",      desc: "Food-grade plastic jars for spices, dry fruits, snacks & powders", color: "#4ea85f" },
  { icon: Wrench,  title: "Sealing Machines",  href: "/category/sealing-machines",  desc: "Impulse & heat sealing machines for quick, secure pouch sealing",  color: "#2e7c8a" },
  { icon: Layers,  title: "Packaging Tape",    href: "/category/packaging-tape",    desc: "Strong BOPP & custom printed tapes for secure box sealing",        color: "#6ea8d8" },
];

const fallbackIcons = [Archive, Box, Truck, Package, Wrench, Layers, Palette, Leaf, ShoppingBag];
const fallbackColors = ["#4ea85f", "#2e7c8a", "#6ea8d8", "#4ea85f", "#2e7c8a", "#6ea8d8", "#4ea85f", "#2e7c8a"];

// ─── Card background colour ───────────────────────────────────────────────────

const CARD_BG        = "#0b1f3e";
const CARD_BG_HOVER  = "#0d2648";
const CARD_BORDER    = "rgba(110,168,216,0.18)";
const CARD_GRADIENT  = "linear-gradient(160deg, #07132b 0%, #0a2140 62%, #12344b 100%)";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CategoryGridProps {
  categories?: ApiCategory[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoryGrid({ categories = [] }: CategoryGridProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const apiParents = categories.filter((c) => !c.parent_id).slice(0, 8);
  const hasApiData = apiParents.length > 0;

  return (
    <>
      <style>{`
        @keyframes cg-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cg-item { opacity: 0; }
        .cg-item.show { animation: cg-fade-up 560ms cubic-bezier(0.22,1,0.36,1) forwards; }

        .cg-card { transition: transform 280ms ease, box-shadow 280ms ease; }
        .cg-card:hover { transform: translateY(-4px); }
        .cg-card:hover .cg-img { transform: scale(1.06); }
        .cg-img { transition: transform 500ms cubic-bezier(0.22,1,0.36,1); }

        .cg-arrow {
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 240ms ease, transform 240ms ease;
        }
        .cg-card:hover .cg-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        .cg-pill {
          transition: background 240ms ease;
        }
        .cg-card:hover .cg-pill {
          background: rgba(110,168,216,0.22) !important;
        }
      `}</style>

      <section
        ref={ref}
        className="relative overflow-hidden py-16 lg:py-24"
        style={{ background: "#ffffff" }}
        aria-labelledby="category-heading"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Heading ── */}
          <div
            className={`cg-item mb-12 text-left max-w-3xl${visible ? " show" : ""}`}
            style={{ animationDelay: "0ms" }}
          >
            <p className="text-xs font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "#2f8f58" }}>
              Browse Range
            </p>
            <h2
              id="category-heading"
              className="text-3xl sm:text-4xl font-extrabold"
              style={{
                backgroundImage: "linear-gradient(135deg, #1f5d8f 0%, #2d7897 48%, #2e8a78 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Shop by Category
            </h2>
            <p className="mt-3 text-sm" style={{ color: "rgba(15,36,68,0.82)" }}>
              Find the perfect packaging for every product and every brand story
            </p>
          </div>

          {/* ── Cards grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* ── API categories ── */}
            {hasApiData
              ? apiParents.map((cat, i) => {
                  const accentColor = fallbackColors[i % fallbackColors.length];
                  const Icon        = fallbackIcons[i % fallbackIcons.length];
                  const cardBg      = cat.background_color || CARD_BG;
                  const fontColor   = cat.font_color || "#ffffff";

                  return (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className={`cg-card cg-item group rounded-2xl overflow-hidden flex flex-col${visible ? " show" : ""}`}
                      style={{
                        background: CARD_GRADIENT,
                        backgroundColor: cardBg,
                        border: `1px solid ${CARD_BORDER}`,
                        boxShadow: "0 8px 28px rgba(3,10,22,0.32)",
                        animationDelay: visible ? `${80 + i * 70}ms` : undefined,
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 18px 40px rgba(3,10,22,0.48), 0 0 0 1px ${accentColor}55`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 28px rgba(3,10,22,0.32)";
                      }}
                    >
                      {/* Image area */}
                      {cat.image ? (
                        <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            unoptimized
                            className="cg-img object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {/* Subtle bottom gradient so text below feels connected */}
                          <div
                            className="absolute inset-x-0 bottom-0 h-10"
                            style={{ background: `linear-gradient(to bottom, transparent, ${cardBg})` }}
                          />
                        </div>
                      ) : (
                        /* Placeholder when no image */
                        <div
                          className="flex items-center justify-center"
                          style={{ aspectRatio: "16/9", background: `${accentColor}14` }}
                        >
                          <Icon className="h-12 w-12 opacity-40" style={{ color: accentColor }} />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex flex-col flex-1 px-5 py-4 gap-2">

                        {/* Name + arrow */}
                        <div className="flex items-start justify-between gap-2">
                          <h3
                            className="text-base font-bold leading-snug"
                            style={{ color: fontColor }}
                          >
                            {cat.name}
                          </h3>
                          <span
                            className="cg-arrow flex-shrink-0 mt-0.5"
                            aria-hidden="true"
                          >
                            <ArrowRight className="h-4 w-4" style={{ color: accentColor }} />
                          </span>
                        </div>

                        {/* Description */}
                        {cat.description && (
                          <p
                            className="text-xs leading-relaxed line-clamp-2"
                            style={{ color: "rgba(255,255,255,0.62)" }}
                          >
                            {cat.description}
                          </p>
                        )}

                        {/* Shop now pill */}
                        <div className="mt-auto pt-3">
                          <span
                            className="cg-pill inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
                            style={{
                              background: `${accentColor}18`,
                              color: accentColor,
                            }}
                          >
                            Shop now
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })

              /* ── Static fallback ── */
              : staticCategories.map(({ icon: Icon, title, href, desc, color }, i) => (
                <Link
                  key={title}
                  href={href}
                  className={`cg-card cg-item group rounded-2xl overflow-hidden flex flex-col${visible ? " show" : ""}`}
                  style={{
                    background: CARD_GRADIENT,
                    backgroundColor: CARD_BG,
                    border: `1px solid ${CARD_BORDER}`,
                    boxShadow: "0 8px 28px rgba(3,10,22,0.32)",
                    animationDelay: visible ? `${80 + i * 70}ms` : undefined,
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = CARD_BG_HOVER;
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 18px 40px rgba(3,10,22,0.48), 0 0 0 1px ${color}55`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = CARD_BG;
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 28px rgba(3,10,22,0.32)";
                  }}
                >
                  {/* Icon placeholder */}
                  <div
                    className="flex items-center justify-center"
                    style={{ aspectRatio: "16/9", background: `${color}12` }}
                  >
                    <Icon className="h-14 w-14 opacity-35" style={{ color }} />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 px-5 py-4 gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-white leading-snug">{title}</h3>
                      <span className="cg-arrow flex-shrink-0 mt-0.5" aria-hidden="true">
                        <ArrowRight className="h-4 w-4" style={{ color }} />
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "rgba(255,255,255,0.62)" }}>
                      {desc}
                    </p>
                    <div className="mt-auto pt-3">
                      <span
                        className="cg-pill inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
                        style={{ background: `${color}18`, color }}
                      >
                        Shop now
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </section>
    </>
  );
}
