"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import BlogHero from "@/components/blog/BlogHero";
import CategoryCard from "@/components/blog/CategoryCard";
import SearchAndFilterBar from "@/components/blog/SearchAndFilterBar";
import Container from "@/components/layout/Container";
import { blogCategories, type BlogPost } from "@/lib/blog-data";

interface BlogHomeClientProps {
  featuredPosts: BlogPost[];
  latestPosts: BlogPost[];
  allPosts: BlogPost[];
}

/** Shared arrow button styles — matches home page blog slider */
const ARROW_CLASS =
  "absolute z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8d7ea] bg-white/95 text-[#1a4f83] shadow-sm transition-colors hover:bg-[#f3f8ff]";

function scrollSlider(ref: React.RefObject<HTMLDivElement | null>, direction: "prev" | "next") {
  const el = ref.current;
  if (!el) return;
  const firstCard = el.querySelector<HTMLElement>("[data-blog-slide]");
  const gap = 24;
  const cardWidth = firstCard?.offsetWidth ?? el.clientWidth * 0.9;
  el.scrollBy({ left: direction === "next" ? cardWidth + gap : -(cardWidth + gap), behavior: "smooth" });
}

export default function BlogHomeClient({ featuredPosts, latestPosts, allPosts }: BlogHomeClientProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const featuredSliderRef = useRef<HTMLDivElement | null>(null);
  const latestSliderRef = useRef<HTMLDivElement | null>(null);
  const categorySliderRef = useRef<HTMLDivElement | null>(null);

  const filteredPosts = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return latestPosts.filter((post) => {
      const matchesCategory = activeCategory === "" || post.category === activeCategory;
      const matchesSearch =
        normalized === "" ||
        post.title.toLowerCase().includes(normalized) ||
        post.excerpt.toLowerCase().includes(normalized) ||
        post.tags.some((tag) => tag.toLowerCase().includes(normalized));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, latestPosts, search]);

  const categoryCounts = useMemo(() => {
    return blogCategories.reduce<Record<string, number>>((acc, category) => {
      acc[category.slug] = allPosts.filter((post) => post.category === category.slug).length;
      return acc;
    }, {});
  }, [allPosts]);

  const heroPost = featuredPosts[0] ?? latestPosts[0];

  if (!heroPost) {
    return null;
  }

  return (
    <div className="bg-[linear-gradient(180deg,#f7fafc_0%,#ffffff_12%,#f8fafc_100%)]">
      <BlogHero
        eyebrow="Editorial Journal"
        title="Ideas, systems, and stories for better packaging"
        description="A modern editorial space for packaging strategy, launch planning, fulfillment clarity, and the details that make ecommerce brands feel more intentional."
        featuredPost={heroPost}
      />

      <Container className="relative z-10 -mt-8 pb-16 sm:-mt-10 sm:pb-20">
        <SearchAndFilterBar
          search={search}
          onSearchChange={setSearch}
          categories={blogCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* ── Featured Posts ── */}
        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">Featured Posts</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">What readers should not miss</h2>
            </div>
          </div>

          {/* Mobile horizontal slider — hidden on sm+ */}
          <div className="relative sm:hidden">
            <button
              type="button"
              onClick={() => scrollSlider(featuredSliderRef, "prev")}
              aria-label="Scroll featured posts left"
              className={`${ARROW_CLASS} left-2 blog-slider-arrow`}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollSlider(featuredSliderRef, "next")}
              aria-label="Scroll featured posts right"
              className={`${ARROW_CLASS} right-2 blog-slider-arrow`}
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <div
              ref={featuredSliderRef}
              className="blog-slider-scroll flex snap-x snap-mandatory gap-6 overflow-x-auto px-12 pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Featured blog posts slider"
            >
              {featuredPosts.slice(0, 3).map((post) => (
                <div
                  key={post.slug}
                  data-blog-slide
                  className="w-[calc(100vw-3rem)] max-w-full shrink-0 snap-start"
                >
                  <BlogCard post={post} variant="featured" />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop / tablet grid — hidden below sm */}
          <div className="hidden sm:grid gap-6 lg:grid-cols-3">
            {featuredPosts.slice(0, 3).map((post, index) => (
              <div key={post.slug} className={index === 0 ? "lg:col-span-2" : ""}>
                <BlogCard post={post} variant="featured" />
              </div>
            ))}
          </div>
        </section>

        {/* ── Browse Topics (categories) — layout unchanged ── */}
        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">Browse Topics</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Explore by category</h2>
            </div>
          </div>
          {/* Mobile horizontal slider — hidden on sm+ */}
          <div className="relative sm:hidden bg-white rounded-[20px] py-3 -mx-4 px-4">
            <button
              type="button"
              onClick={() => scrollSlider(categorySliderRef, "prev")}
              aria-label="Scroll categories left"
              className={`${ARROW_CLASS} left-2 blog-slider-arrow`}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollSlider(categorySliderRef, "next")}
              aria-label="Scroll categories right"
              className={`${ARROW_CLASS} right-2 blog-slider-arrow`}
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <div
              ref={categorySliderRef}
              className="blog-slider-scroll flex snap-x snap-mandatory gap-6 overflow-x-auto px-12 pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Blog categories slider"
            >
              {blogCategories.map((category) => (
                <div
                  key={category.slug}
                  data-blog-slide
                  className="w-[calc(100vw-3rem)] max-w-full shrink-0 snap-start"
                >
                  <CategoryCard
                    category={category}
                    postCount={categoryCounts[category.slug] ?? 0}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop / tablet grid — hidden below sm */}
          <div className="hidden sm:grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {blogCategories.map((category) => (
              <CategoryCard
                key={category.slug}
                category={category}
                postCount={categoryCounts[category.slug] ?? 0}
              />
            ))}
          </div>
        </section>

        {/* ── Latest Posts ── */}
        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">Latest Posts</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                {search || activeCategory ? "Filtered results" : "Fresh thinking from the journal"}
              </h2>
            </div>
            <p className="text-sm text-slate-500">{filteredPosts.length} articles</p>
          </div>

          {filteredPosts.length > 0 ? (
            <>
              {/* Mobile horizontal slider — hidden on sm+ */}
              <div className="relative sm:hidden">
                <button
                  type="button"
                  onClick={() => scrollSlider(latestSliderRef, "prev")}
                  aria-label="Scroll latest posts left"
                  className={`${ARROW_CLASS} left-2 blog-slider-arrow`}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollSlider(latestSliderRef, "next")}
                  aria-label="Scroll latest posts right"
                  className={`${ARROW_CLASS} right-2 blog-slider-arrow`}
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <div
                  ref={latestSliderRef}
                  className="blog-slider-scroll flex snap-x snap-mandatory gap-6 overflow-x-auto px-12 pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  aria-label="Latest blog posts slider"
                >
                  {filteredPosts.map((post) => (
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

              {/* Desktop / tablet grid — hidden below sm */}
              <div className="hidden sm:grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center text-slate-500">
              No posts matched that search yet. Try a different topic or clear the active filter.
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}
