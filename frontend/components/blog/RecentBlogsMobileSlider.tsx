"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import type { BlogPost } from "@/lib/blog-data";

interface Props {
  posts: BlogPost[];
}

export default function RecentBlogsMobileSlider({ posts }: Props) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const indexRef = useRef(0);

  function scroll(direction: "prev" | "next") {
    const el = sliderRef.current;
    if (!el) return;
    const slides = el.querySelectorAll<HTMLElement>("[data-blog-slide]");
    if (slides.length === 0) return;
    const delta = direction === "next" ? 1 : -1;
    const next = Math.max(0, Math.min(indexRef.current + delta, slides.length - 1));
    indexRef.current = next;
    slides[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  return (
    <div className="relative mt-4 lg:hidden">
      <button
        type="button"
        onClick={() => scroll("prev")}
        aria-label="Scroll blog posts left"
        className="blog-slider-arrow absolute left-2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8d7ea] bg-white/95 text-[#1a4f83] shadow-sm transition-colors hover:bg-[#f3f8ff]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => scroll("next")}
        aria-label="Scroll blog posts right"
        className="blog-slider-arrow absolute right-2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8d7ea] bg-white/95 text-[#1a4f83] shadow-sm transition-colors hover:bg-[#f3f8ff]"
      >
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>

      <div
        ref={sliderRef}
        className="blog-slider-scroll flex snap-x snap-mandatory gap-6 overflow-x-auto px-12 pb-0 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Recent blog posts slider"
      >
        {posts.map((post) => (
          <div
            key={post.slug}
            data-blog-slide
            className="w-[calc(100vw-3rem)] max-w-full shrink-0 snap-start"
          >
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
