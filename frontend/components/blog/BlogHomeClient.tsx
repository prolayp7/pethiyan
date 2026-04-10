"use client";

import { useMemo, useState } from "react";
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

export default function BlogHomeClient({ featuredPosts, latestPosts, allPosts }: BlogHomeClientProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

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

        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">Featured Posts</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">What readers should not miss</h2>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {featuredPosts.slice(0, 3).map((post, index) => (
              <div key={post.slug} className={index === 0 ? "lg:col-span-2" : ""}>
                <BlogCard post={post} variant="featured" />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">Browse Topics</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Explore by category</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {blogCategories.map((category) => (
              <CategoryCard
                key={category.slug}
                category={category}
                postCount={categoryCounts[category.slug] ?? 0}
              />
            ))}
          </div>
        </section>

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
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
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
