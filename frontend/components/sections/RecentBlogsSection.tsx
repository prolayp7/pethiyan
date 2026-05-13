import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import BlogCard from "@/components/blog/BlogCard";
import RecentBlogsMobileSlider from "@/components/blog/RecentBlogsMobileSlider";
import { API_BASE } from "@/lib/api";
import type { BlogPost } from "@/lib/blog-data";

interface ApiCategory {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  postsCount: number;
}

interface ApiPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string;
  isFeatured: boolean;
  publishedAt: string | null;
  readingTime: string | number | null;
  tags: string[];
  category: ApiCategory | null;
  author: { name: string; role: string; bio: string | null; avatar: string | null };
}

interface BlogHomeApiResponse {
  settings: {
    isActive: boolean;
    eyebrow: string;
    heading: string;
    subheading: string;
  };
  featuredPosts: ApiPost[];
  latestPosts: ApiPost[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatReadingTime(value: string | number | null): string {
  if (value == null) return "";
  if (typeof value === "number") return `${value} min read`;
  return value;
}

function transformPost(post: ApiPost): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    featuredImage: post.featuredImage,
    publishedAt: post.publishedAt ? formatDate(post.publishedAt) : "",
    readingTime: formatReadingTime(post.readingTime),
    category: post.category?.slug ?? "",
    tags: post.tags ?? [],
    author: {
      name: post.author?.name ?? "",
      role: post.author?.role ?? "",
      bio: post.author?.bio ?? "",
      avatar: post.author?.avatar ?? "",
    },
    featured: post.isFeatured,
    sections: [],
  };
}

async function fetchRecentPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_BASE}/api/blog`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = (await res.json()) as BlogHomeApiResponse;

    const allPosts = [...(data.featuredPosts ?? []), ...(data.latestPosts ?? [])];
    const seen = new Set<string>();
    const unique = allPosts.filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    });
    return unique.slice(0, 3).map(transformPost);
  } catch {
    return [];
  }
}

export default async function RecentBlogsSection() {
  const posts = await fetchRecentPosts();

  if (posts.length === 0) {
    return null;
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
            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-(--color-primary) hover:text-(--color-primary)"
          >
            View all articles
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <RecentBlogsMobileSlider posts={posts} />

        <div className="mt-10 hidden grid-cols-1 gap-6 lg:grid-cols-3 lg:grid">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
