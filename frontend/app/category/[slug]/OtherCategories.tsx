"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/layout/Container";
import type { ApiCategory } from "@/lib/api";

interface OtherCategoriesProps {
  currentCategory: ApiCategory;
  categories: ApiCategory[];
}

function sortCategoriesByAdminOrder(categories: ApiCategory[]) {
  return [...categories].sort((a, b) => {
    const aOrder = typeof a.sort_order === "number" ? a.sort_order : Number.MAX_SAFE_INTEGER;
    const bOrder = typeof b.sort_order === "number" ? b.sort_order : Number.MAX_SAFE_INTEGER;

    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.name.localeCompare(b.name);
  });
}

export default function OtherCategories({
  currentCategory,
  categories,
}: OtherCategoriesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  const otherCategories = sortCategoriesByAdminOrder(
    categories.filter((c) => c.slug !== currentCategory.slug),
  ).slice(0, 10);

  if (otherCategories.length === 0) return null;

  return (
    <section
      className="relative z-20 bg-white pt-4 pb-0 sm:pt-5 sm:pb-1"
      aria-labelledby="other-categories-heading"
    >
      <Container>
        <div className="rounded-[30px] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:px-6 sm:py-4">
          <div className="flex items-center gap-3 min-w-0">

            {/* Label */}
            <h2
              id="other-categories-heading"
              className="shrink-0 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.28em] text-[#5879a6]"
            >
              Other Categories
            </h2>

            {/* Scroll area with prev/next buttons */}
            <div className="relative flex items-center min-w-0 flex-1">
              {/* Prev button */}
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll categories left"
                className={`shrink-0 flex items-center justify-center h-7 w-7 rounded-full border border-slate-200 bg-white shadow-sm transition mr-1 ${
                  canScrollLeft
                    ? "text-slate-600 hover:border-(--color-primary) hover:text-(--color-primary)"
                    : "text-slate-300 cursor-default pointer-events-none"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Pills */}
              <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-0.5 min-w-0 flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {otherCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-[#fbfdff] px-5 py-2 text-sm font-semibold text-slate-700 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset] transition hover:border-(--color-primary) hover:bg-white hover:text-(--color-primary)"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* Next button */}
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll categories right"
                className={`shrink-0 flex items-center justify-center h-7 w-7 rounded-full border border-slate-200 bg-white shadow-sm transition ml-1 ${
                  canScrollRight
                    ? "text-slate-600 hover:border-(--color-primary) hover:text-(--color-primary)"
                    : "text-slate-300 cursor-default pointer-events-none"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}
