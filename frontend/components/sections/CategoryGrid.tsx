"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Box, Truck, Archive, Wrench, Layers, Palette, Leaf, ShoppingBag, Star } from "lucide-react";
import type { ApiCategory } from "@/lib/api";

// ─── Static fallback data ─────────────────────────────────────────────────────

const staticCategories = [
  { icon: Archive, title: "Packaging Pouches", href: "/category/standup-pouches",   desc: "Stand-Up Zipper, Kraft, Foil, Window & Custom Printed pouches", highlight: "Food-grade materials",      color: "#4ea85f" },
  { icon: Box,     title: "Mailer Boxes",      href: "/category/mailer-boxes",      desc: "Corrugated mailer boxes for safe eCommerce shipping & custom branding", highlight: "Custom printing available", color: "#2e7c8a" },
  { icon: Truck,   title: "Courier Bags",      href: "/category/courier-bags",      desc: "Waterproof, tamper-proof courier bags with strong adhesive seal",  highlight: "Tear-resistant design",    color: "#6ea8d8" },
  { icon: Package, title: "Plastic Jars",      href: "/category/plastic-jars",      desc: "Food-grade plastic jars for spices, dry fruits, snacks & powders", highlight: "Multiple sizes",           color: "#4ea85f" },
  { icon: Wrench,  title: "Sealing Machines",  href: "/category/sealing-machines",  desc: "Impulse & heat sealing machines for quick, secure pouch sealing",  highlight: "Easy to operate",         color: "#2e7c8a" },
  { icon: Layers,  title: "Packaging Tape",    href: "/category/packaging-tape",    desc: "Strong BOPP & custom printed tapes for secure box sealing",        highlight: "BOPP & custom print",     color: "#6ea8d8" },
];

const fallbackIcons = [Archive, Box, Truck, Package, Wrench, Layers, Palette, Leaf, ShoppingBag];
const fallbackColors = ["#4ea85f", "#2e7c8a", "#6ea8d8", "#4ea85f", "#2e7c8a", "#6ea8d8", "#4ea85f", "#2e7c8a"];

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
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cg-item { opacity: 0; }
        .cg-item.show { animation: cg-fade-up 550ms cubic-bezier(0.22,1,0.36,1) forwards; }
        .cg-card:hover .cg-icon { transform: scale(1.12); transition: transform 300ms ease; }
      `}</style>

      <section
        ref={ref}
        className="relative overflow-hidden py-16 lg:py-20"
        style={{ background: "#ffffff" }}
        aria-labelledby="category-heading"
      >
        {/* Intentionally no overlays here: section should stay pure white */}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
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

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hasApiData ? apiParents.map((cat, i) => {
              const Icon = fallbackIcons[i % fallbackIcons.length];
              const color = fallbackColors[i % fallbackColors.length];
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`cg-card cg-item group rounded-2xl overflow-hidden${visible ? " show" : ""}`}
                  style={{
                    backgroundColor: "#0b1f3e",
                    backgroundImage: `
                      linear-gradient(160deg, #07132b 0%, #0a2140 62%, #12344b 100%),
                      linear-gradient(rgba(110,168,216,0.028) 0.5px, transparent 0.5px),
                      linear-gradient(90deg, rgba(110,168,216,0.028) 0.5px, transparent 0.5px)
                    `,
                    backgroundBlendMode: "normal,normal,normal",
                    backgroundSize: "100% 100%, 15px 15px, 15px 15px",
                    backgroundPosition: "0 0, 0 0, 0 0",
                    border: "1px solid rgba(110,168,216,0.18)",
                    boxShadow: "0 8px 24px rgba(3,10,22,0.35)",
                    animationDelay: visible ? `${80 + i * 70}ms` : undefined,
                    textDecoration: "none",
                    transition: "background 300ms ease, box-shadow 300ms ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0d2648";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 14px 34px rgba(3,10,22,0.45), 0 0 0 1px ${color}44`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0b1f3e";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(3,10,22,0.35)";
                  }}
                >
                  {cat.image ? (
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={cat.image} alt={cat.name} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,16,35,0.85) 0%, transparent 60%)" }} />
                      <p className="absolute bottom-3 left-4 text-sm font-bold text-white">{cat.name}</p>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="cg-icon w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}22` }}>
                        <Icon className="h-5 w-5" style={{ color }} />
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1.5">{cat.name}</h4>
                    </div>
                  )}
                </Link>
              );
            }) : staticCategories.map(({ icon: Icon, title, href, desc, highlight, color }, i) => (
              <Link
                key={title}
                href={href}
                className={`cg-card cg-item group rounded-2xl p-6${visible ? " show" : ""}`}
                style={{
                  backgroundColor: "#0b1f3e",
                  backgroundImage: `
                    linear-gradient(160deg, #07132b 0%, #0a2140 62%, #12344b 100%),
                    linear-gradient(rgba(110,168,216,0.028) 0.5px, transparent 0.5px),
                    linear-gradient(90deg, rgba(110,168,216,0.028) 0.5px, transparent 0.5px)
                  `,
                  backgroundBlendMode: "normal,normal,normal",
                  backgroundSize: "100% 100%, 15px 15px, 15px 15px",
                  backgroundPosition: "0 0, 0 0, 0 0",
                  border: "1px solid rgba(110,168,216,0.18)",
                  boxShadow: "0 8px 24px rgba(3,10,22,0.35)",
                  animationDelay: visible ? `${80 + i * 70}ms` : undefined,
                  textDecoration: "none",
                  transition: "background 300ms ease, box-shadow 300ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0d2648";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 14px 34px rgba(3,10,22,0.45), 0 0 0 1px ${color}44`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0b1f3e";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(3,10,22,0.35)";
                }}
              >
                <div className="cg-icon w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}22` }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">{title}</h4>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.72)" }}>{desc}</p>
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: `${color}26`, color }}
                >
                  <Star className="h-2.5 w-2.5" />
                  {highlight}
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
