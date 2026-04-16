import Link from "next/link";
import Image from "next/image";
import { Package, Tag, Archive, Palette, Leaf, ArrowRight, Box, ShoppingBag } from "lucide-react";
import Container from "@/components/layout/Container";
import type { ApiCategory } from "@/lib/api";

// ─── Static fallback data ──────────────────────────────────────────────────────

const staticCategories = [
  {
    label: "Standup Pouches",
    href: "/category/standup-pouches",
    icon: Archive,
    description: "Self-standing bags for premium retail display",
    color: "bg-(--color-primary)/10 text-(--color-primary)",
    hoverBg: "group-hover:bg-(--color-primary)",
  },
  {
    label: "Ziplock Bags",
    href: "/category/ziplock-pouches",
    icon: Tag,
    description: "Resealable & airtight for lasting freshness",
    color: "bg-(--color-accent)/10 text-(--color-accent)",
    hoverBg: "group-hover:bg-(--color-accent)",
  },
  {
    label: "Custom Printed",
    href: "/category/custom-packaging",
    icon: Palette,
    description: "Your brand, your design — fully customised",
    color: "bg-purple-100 text-purple-600",
    hoverBg: "group-hover:bg-purple-600",
  },
  {
    label: "Eco Friendly",
    href: "/category/eco-packaging",
    icon: Leaf,
    description: "Sustainable solutions for responsible brands",
    color: "bg-emerald-100 text-emerald-600",
    hoverBg: "group-hover:bg-emerald-600",
  },
  {
    label: "Packaging Bags",
    href: "/category/packaging-bags",
    icon: Package,
    description: "Versatile bags for every product type",
    color: "bg-amber-100 text-amber-600",
    hoverBg: "group-hover:bg-amber-600",
  },
];

// Cycle through colors for API categories
const apiColorPalette = [
  { color: "bg-(--color-primary)/10 text-(--color-primary)", hoverBg: "group-hover:bg-(--color-primary)" },
  { color: "bg-(--color-accent)/10 text-(--color-accent)", hoverBg: "group-hover:bg-(--color-accent)" },
  { color: "bg-purple-100 text-purple-600", hoverBg: "group-hover:bg-purple-600" },
  { color: "bg-emerald-100 text-emerald-600", hoverBg: "group-hover:bg-emerald-600" },
  { color: "bg-amber-100 text-amber-600", hoverBg: "group-hover:bg-amber-600" },
  { color: "bg-rose-100 text-rose-600", hoverBg: "group-hover:bg-rose-600" },
  { color: "bg-sky-100 text-sky-600", hoverBg: "group-hover:bg-sky-600" },
  { color: "bg-teal-100 text-teal-600", hoverBg: "group-hover:bg-teal-600" },
];

const fallbackIcons = [Archive, Tag, Palette, Leaf, Package, Box, ShoppingBag, Package];

// ─── Props ────────────────────────────────────────────────────────────────────

interface CategoryGridProps {
  categories?: ApiCategory[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoryGrid({ categories = [] }: CategoryGridProps) {
  // Use API categories if available, otherwise fall back to static
  const hasApiData = categories.length > 0;

  // Only show parent categories (no parent_id) or take first 8 if mixed
  const apiParents = categories.filter((c) => !c.parent_id).slice(0, 8);
  const displayCategories = hasApiData && apiParents.length > 0 ? apiParents : null;

  const colClass =
    (displayCategories ?? staticCategories).length <= 4
      ? "grid-cols-2 md:grid-cols-4"
      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5";

  return (
    <section className="py-16 bg-(--color-muted)" aria-labelledby="category-heading">
      <Container>
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-(--color-primary) uppercase tracking-wider mb-2">
            Browse Range
          </p>
          <h2
            id="category-heading"
            className="text-3xl sm:text-4xl font-extrabold text-(--color-secondary)"
          >
            Shop by Category
          </h2>
          <p className="mt-3 text-gray-500 max-w-md mx-auto">
            Find the perfect packaging for every product and every brand story
          </p>
        </div>

        {/* ── API categories ── */}
        {displayCategories ? (
          <div className={`grid ${colClass} gap-4`}>
            {displayCategories.map((cat, index) => {
              const palette = apiColorPalette[index % apiColorPalette.length];
              const Icon = fallbackIcons[index % fallbackIcons.length];
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-(--color-border) hover:border-(--color-primary)/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {(cat.banner ?? cat.image) ? (
                    /* Category has a banner/image from API — show it */
                    <div className="relative aspect-4/3 overflow-hidden">
                      <Image
                        src={(cat.banner ?? cat.image)!}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                      <p className="absolute bottom-3 left-3 text-sm font-bold text-white leading-snug">
                        {cat.name}
                      </p>
                      <ArrowRight className="absolute bottom-3 right-3 h-4 w-4 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" aria-hidden="true" />
                    </div>
                  ) : (
                    /* No image — use icon tile */
                    <div className="p-6 flex flex-col items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl ${palette.color} ${palette.hoverBg} flex items-center justify-center transition-colors duration-300`}
                      >
                        <Icon className="h-6 w-6 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-(--color-secondary) group-hover:text-(--color-primary) transition-colors">
                          {cat.name}
                        </p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-(--color-primary) group-hover:translate-x-1 transition-all duration-300 mt-auto" aria-hidden="true" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          /* ── Static fallback ── */
          <div className={`grid ${colClass} gap-4`}>
            {staticCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="group relative bg-white rounded-2xl p-6 flex flex-col items-center gap-4 border border-(--color-border) hover:border-(--color-primary)/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${cat.color} ${cat.hoverBg} flex items-center justify-center transition-colors duration-300`}
                  >
                    <Icon className="h-6 w-6 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-(--color-secondary) group-hover:text-(--color-primary) transition-colors">
                      {cat.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 leading-snug hidden sm:block">
                      {cat.description}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-(--color-primary) group-hover:translate-x-1 transition-all duration-300 mt-auto" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
