"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import BlogCard from "@/components/blog/BlogCard";
import { getLatestPosts } from "@/lib/blog-data";

export default function RecentBlogsSection() {
  const mobileSliderRef = useRef<HTMLDivElement | null>(null);
  const posts = getLatestPosts().slice(0, 3);

  if (posts.length === 0) {
    return null;
  }

  function scrollMobileBlogs(direction: "prev" | "next") {
    const el = mobileSliderRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-blog-slide]");
    const gap = 24;
    const cardWidth = firstCard?.offsetWidth ?? el.clientWidth * 0.9;
    const amount = cardWidth + gap;
    el.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }

  return (
    <section
      className="relative overflow-hidden bg-white pt-6 pb-0 sm:py-20"
      aria-labelledby="recent-blogs-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,#dbeafe_0%,rgba(219,234,254,0)_68%)]"
        aria-hidden="true"
      />
      <Container className="relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
              From The Blog
            </p>
            <h2
              id="recent-blogs-heading"
              className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl"
            >
              Packaging ideas, product tips, and growth stories for modern brands
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Fresh reads on packaging strategy, ecommerce presentation, and practical ways to
              make your products stand out online and offline.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            View all articles
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="relative mt-4 lg:hidden">
          <button
            type="button"
            onClick={() => scrollMobileBlogs("prev")}
            aria-label="Scroll blog posts left"
            className="blog-slider-arrow absolute left-2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8d7ea] bg-white/95 text-[#1a4f83] shadow-sm transition-colors hover:bg-[#f3f8ff]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollMobileBlogs("next")}
            aria-label="Scroll blog posts right"
            className="blog-slider-arrow absolute right-2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8d7ea] bg-white/95 text-[#1a4f83] shadow-sm transition-colors hover:bg-[#f3f8ff]"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <div
            ref={mobileSliderRef}
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

        <div className="mt-10 hidden grid-cols-1 gap-6 lg:grid-cols-3 lg:grid">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
