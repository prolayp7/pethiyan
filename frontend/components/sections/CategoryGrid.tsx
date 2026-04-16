"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useAnimation,
  type Variants,
} from "framer-motion";
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

// ─── Animation variants ───────────────────────────────────────────────────────

const sectionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.10 } },
};

const headingVariants: Variants = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

// ─── CategoryCard ─────────────────────────────────────────────────────────────

interface CardProps {
  href: string;
  name: string;
  desc?: string | null;
  image?: string | null;
  Icon?: React.ComponentType<{ className?: string }>;
}

function CategoryCard({ href, name, desc, image, Icon }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const shineControls = useAnimation();

  const handleHoverStart = async () => {
    setHovered(true);
    // Shine sweeps once across the card on each hover entry
    await shineControls.start({
      x: "240%",
      transition: { duration: 0.75, ease: "easeOut" },
    });
    shineControls.set({ x: "-130%" });
  };

  const handleHoverEnd = () => setHovered(false);

  return (
    <motion.div variants={cardVariants}>
      {/* Link wraps the whole card; glass panel "button" is a span (no nested <a>) */}
      <Link href={href} className="block" aria-label={`Shop ${name}`}>
        <motion.div
          className="cat-hv-card relative"
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          animate={{ y: hovered ? -10 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
        >
          {/* ── Card body (3:4 portrait) ─────────────────────── */}
          <div className="cat-hv-body">

            {/* Image or icon background */}
            {image ? (
              <motion.div
                className="absolute inset-0"
                animate={{ scale: hovered ? 1.07 : 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  loading="lazy"
                  quality={80}
                  unoptimized={/^https?:\/\//i.test(image)}
                />
              </motion.div>
            ) : (
              <motion.div
                className="cat-hv-icon-bg absolute inset-0 flex items-center justify-center"
                animate={{ scale: hovered ? 1.04 : 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden="true"
              >
                {Icon && <Icon className="w-20 h-20 text-white/20" />}
              </motion.div>
            )}

            {/* Base gradient overlay — darkens on hover */}
            <motion.div
              className="cat-hv-overlay absolute inset-0 z-[1]"
              animate={{ opacity: hovered ? 1.3 : 1 }}
              transition={{ duration: 0.45 }}
            />

            {/* Extra dark veil — fades in on hover for more contrast behind glass */}
            <motion.div
              className="absolute inset-0 z-[2] bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 0.22 : 0 }}
              transition={{ duration: 0.45 }}
            />

            {/* Shine sweep (one-shot on hover entry) */}
            <motion.div
              className="cat-hv-shine absolute inset-0 z-[3] pointer-events-none"
              initial={{ x: "-130%" }}
              animate={shineControls}
            />

            {/* Always-visible name peek — fades out when glass panel appears */}
            <motion.div
              className="absolute bottom-0 inset-x-0 z-[4] px-6 pb-5"
              animate={{ opacity: hovered ? 0 : 1, y: hovered ? 6 : 0 }}
              transition={{ duration: 0.22 }}
            >
              <p className="text-white/80 text-xs font-bold uppercase tracking-[0.18em]">
                {name}
              </p>
            </motion.div>

            {/* ── Glass reveal panel — slides up from below ── */}
            <motion.div
              className="cat-hv-glass z-[5]"
              initial={{ y: "100%" }}
              animate={{ y: hovered ? "0%" : "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
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
                <motion.span
                  animate={{ x: hovered ? 3 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.span>
              </span>
            </motion.div>

          </div>{/* /cat-hv-body */}
        </motion.div>
      </Link>
    </motion.div>
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

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

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

  // Unified card props for both mobile slider and desktop grid
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

  function scrollCatSlider(dir: "prev" | "next") {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-cat-slide]");
    const gap = 16;
    const w = card?.offsetWidth ?? el.clientWidth * 0.78;
    el.scrollBy({ left: dir === "next" ? w + gap : -(w + gap), behavior: "smooth" });
  }

  return (
    <section className="cat-section pt-12 pb-6 lg:pt-16 lg:pb-8" aria-labelledby="category-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Heading ── */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
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
        </motion.div>

        {/* ── Mobile horizontal slider (hidden on sm+) ── */}
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
            {cards.map((c) => (
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
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Desktop / tablet grid (hidden below sm) ── */}
        <motion.div
          className={`hidden sm:grid ${gridCols} gap-6 lg:gap-8`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {cards.map((c) => (
            <CategoryCard
              key={c.key}
              href={c.href}
              name={c.name}
              desc={c.desc}
              image={c.image}
              Icon={c.Icon}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
