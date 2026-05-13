"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  Box,
  Truck,
  Archive,
  Wrench,
  Layers,
  Palette,
  Leaf,
  ShoppingBag,
} from "lucide-react";
import type { ApiCategory } from "@/lib/api";
import { shouldBypassOptimizer } from "@/lib/image";

// ─── Static fallback data ─────────────────────────────────────────────────────
const staticCategories = [
  { icon: Archive, title: "Packaging Pouches",  href: "/category/standup-pouches",  desc: "Stand-Up Zipper, Kraft, Foil, Window & Custom Printed pouches" },
  { icon: Box,     title: "Mailer Boxes",        href: "/category/mailer-boxes",     desc: "Corrugated mailer boxes for safe eCommerce shipping & custom branding" },
  { icon: Truck,   title: "Courier Bags",        href: "/category/courier-bags",     desc: "Waterproof, tamper-proof courier bags with strong adhesive seal" },
  { icon: Package, title: "Plastic Jars",        href: "/category/plastic-jars",     desc: "Food-grade plastic jars for spices, dry fruits, snacks & powders" },
  { icon: Wrench,  title: "Sealing Machines",    href: "/category/sealing-machines", desc: "Impulse & heat sealing machines for quick, secure pouch sealing" },
  { icon: Layers,  title: "Packaging Tape",      href: "/category/packaging-tape",   desc: "Strong BOPP & custom printed tapes for secure box sealing" },
];

const fallbackIcons = [Archive, Box, Truck, Package, Wrench, Layers, Palette, Leaf, ShoppingBag];

const CG_DELAY_CLASSES = ["cg-delay0","cg-delay1","cg-delay2","cg-delay3","cg-delay4","cg-delay5"];

// Tiny light-gray SVG used as a blur placeholder while the real image loads.
// Eliminates the blank-image flash without needing a per-image LQIP fetch.
const BLUR_DATA_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0IDQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmMGYyZjUiLz48L3N2Zz4=";

// ─── CategoryCard — pure CSS hover effects, no Framer Motion ─────────────────
// All hover animations (lift, image scale, shine sweep, glass panel slide,
// name peek fade) are driven by CSS transitions + :hover selectors in
// globals.css — no JS animation library needed, eliminating the
// framer-motion chunk from the homepage bundle.

interface CardProps {
  href: string;
  name: string;
  desc?: string | null;
  image?: string | null;
  Icon?: React.ComponentType<{ className?: string }>;
  animClass?: string;
  priority?: boolean;
}

function CategoryCard({ href, name, desc, image, Icon, animClass = "", priority = false }: CardProps) {
  return (
    <div className={`cg-item ${animClass}`}>
      <Link href={href} className="block" aria-label={`Shop ${name}`}>
        <div className="cat-hv-card">
          <div className="cat-hv-body">

            {/* Image or icon background */}
            {image ? (
              <div className="cat-hv-image-wrap absolute inset-0">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  priority={priority}
                  loading={priority ? "eager" : "lazy"}
                  quality={80}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  unoptimized={shouldBypassOptimizer(image)}
                />
              </div>
            ) : (
              <div
                className="cat-hv-icon-bg absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                {Icon && <Icon className="w-20 h-20 text-white/20" />}
              </div>
            )}

            {/* Base gradient overlay */}
            <div className="cat-hv-overlay absolute inset-0 z-1" />

            {/* Dark veil — fades in on hover via CSS */}
            <div className="cat-hv-dark-veil absolute inset-0 z-2 bg-black" />

            {/* Shine sweep — CSS one-shot animation */}
            <div className="cat-hv-shine absolute inset-0 z-3 pointer-events-none" />

            {/* Name peek — fades out when glass appears */}
            <div className="cat-hv-name-peek absolute bottom-0 inset-x-0 z-4 px-6 pb-5">
              <p className="text-white/80 text-xs font-bold uppercase tracking-[0.18em]">
                {name}
              </p>
            </div>

            {/* Glass reveal panel — slides up from below via CSS */}
            <div className="cat-hv-glass z-5">
              <h3 className="text-white text-xl font-black leading-tight mb-2">
                {name}
              </h3>
              {desc && (
                <p className="text-white/60 text-[11px] leading-relaxed mb-4 line-clamp-2">
                  {desc}
                </p>
              )}
              <span className="cat-hv-btn font-bold">
                Shop Now
                <span className="cat-hv-arrow">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </span>
            </div>

          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

interface CategoryGridProps {
  categories?: ApiCategory[];
}

function sortCategoriesByAdminOrder(categories: ApiCategory[]): ApiCategory[] {
  return [...categories].sort((left, right) => {
    const leftOrder = typeof left.sort_order === "number" ? left.sort_order : Number.MAX_SAFE_INTEGER;
    const rightOrder = typeof right.sort_order === "number" ? right.sort_order : Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return left.name.localeCompare(right.name);
  });
}

export default function CategoryGrid({ categories = [] }: CategoryGridProps) {
  const apiParents = sortCategoriesByAdminOrder(categories.filter((c) => !c.parent_id)).slice(0, 6);
  const hasApiData = apiParents.length > 0;

  const count = hasApiData ? apiParents.length : staticCategories.length;
  const gridCols =
    count <= 2 ? "sm:grid-cols-2" :
    count <= 4 ? "sm:grid-cols-2 lg:grid-cols-4" :
                 "sm:grid-cols-2 md:grid-cols-3";

  const cards = hasApiData
    ? apiParents.map((cat, i) => ({
        key: String(cat.id),
        href: `/category/${cat.slug}`,
        name: cat.name,
        desc: cat.description ?? null,
        image: cat.banner ?? cat.image ?? null,
        Icon: (cat.banner ?? cat.image) ? undefined : fallbackIcons[i % fallbackIcons.length],
      }))
    : staticCategories.map(({ icon: Icon, title, href, desc }) => ({
        key: title,
        href,
        name: title,
        desc,
        image: null as string | null,
        Icon,
      }));

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  function scrollCatSlider(dir: "prev" | "next") {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-cat-slide]");
    const gap = 16;
    const w = card?.offsetWidth ?? el.clientWidth * 0.78;
    el.scrollBy({ left: dir === "next" ? w + gap : -(w + gap), behavior: "smooth" });
  }

  return (
    <section ref={sectionRef} className="cat-section pt-12 pb-6 lg:pt-16 lg:pb-8" aria-labelledby="category-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Heading ── */}
        <div className={`cg-item cg-delay0 ${visible ? "cg-show" : ""} mb-10 min-h-27.5 sm:min-h-32`}>
          <p className="cat-eyebrow-text text-sm font-semibold uppercase tracking-wider mb-2">
            Browse Range
          </p>
          <h2
            id="category-heading"
            className="cat-heading-gradient text-3xl sm:text-4xl font-extrabold"
          >
            Shop by Category
          </h2>
          <p className="cat-subheading mt-3 text-sm">
            Find the perfect packaging for every product and every brand story
          </p>
        </div>

        {/* ── Mobile horizontal slider ── */}
        <div className="relative sm:hidden">
          <button
            type="button"
            onClick={() => scrollCatSlider("prev")}
            aria-label="Previous category"
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#c8d7ea] bg-white/95 text-[#1a4f83] shadow-sm transition-colors hover:bg-[#f3f8ff]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollCatSlider("next")}
            aria-label="Next category"
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#c8d7ea] bg-white/95 text-[#1a4f83] shadow-sm transition-colors hover:bg-[#f3f8ff]"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-10 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((c, i) => (
              <div
                key={c.key}
                data-cat-slide
                className="w-[78vw] shrink-0 snap-start"
              >
                <CategoryCard
                  href={c.href}
                  name={c.name}
                  desc={c.desc}
                  image={c.image}
                  Icon={c.Icon}
                  priority={i < 2}
                  animClass={visible ? `cg-show ${CG_DELAY_CLASSES[i] ?? "cg-delay5"}` : (CG_DELAY_CLASSES[i] ?? "cg-delay5")}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Desktop / tablet grid ── */}
        <div className={`hidden sm:grid ${gridCols} gap-6 lg:gap-8`}>
          {cards.map((c, i) => (
            <CategoryCard
              key={c.key}
              href={c.href}
              name={c.name}
              desc={c.desc}
              image={c.image}
              Icon={c.Icon}
              priority={i < 2}
              animClass={visible ? `cg-show ${CG_DELAY_CLASSES[i] ?? "cg-delay5"}` : (CG_DELAY_CLASSES[i] ?? "cg-delay5")}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
