import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import Container from "@/components/layout/Container";
import { API_BASE } from "@/lib/api";
import type { BlogPost } from "@/lib/blog-data";

// Revalidate every hour; primary invalidation via on-demand revalidate webhook.
export const revalidate = 3600;

interface ApiAuthor {
  name: string;
  role: string;
  bio: string | null;
  avatar: string | null;
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
  category: { id: number; title: string; slug: string } | null;
  author: ApiAuthor;
}

interface ApiCategory {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  postsCount: number;
  seo: { title: string | null; description: string | null };
}

interface CategoryApiResponse {
  category: ApiCategory;
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: ApiPost[];
}

const PER_PAGE = 9;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function transformPost(post: ApiPost): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    featuredImage: post.featuredImage,
    publishedAt: post.publishedAt ? formatDate(post.publishedAt) : "",
    readingTime: post.readingTime != null ? `${post.readingTime} min read` : "",
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

async function fetchCategoryData(slug: string, page: number): Promise<CategoryApiResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/blog/categories/${encodeURIComponent(slug)}?page=${page}&per_page=${PER_PAGE}`,
      { next: { revalidate: 3600 } },
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json() as Promise<CategoryApiResponse>;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchCategoryData(slug, 1);

  if (!data) {
    return { title: "Category Not Found" };
  }

  const { category } = data;
  return {
    title: category.seo.title ?? `${category.title} Articles`,
    description: category.seo.description ?? category.description ?? undefined,
  };
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ slug }, resolvedSearch] = await Promise.all([params, searchParams]);
  const page = Math.max(1, parseInt(resolvedSearch.page ?? "1", 10) || 1);

  const data = await fetchCategoryData(slug, page);

  if (!data) {
    notFound();
  }

  const { category, data: apiPosts, current_page, last_page, total } = data;
  const posts = apiPosts.map(transformPost);

  return (
    <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_16%,#f8fafc_100%)]">
      <section className="border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <Container className="py-5">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/blog" className="hover:text-slate-900">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">{category.title}</span>
          </nav>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Category Archive</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{category.title}</h1>
          {category.description && (
            <p className="mt-5 text-base leading-8 text-slate-600">{category.description}</p>
          )}
          <p className="mt-3 text-sm text-slate-500">{total} article{total !== 1 ? "s" : ""}</p>
        </header>

        {posts.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[24px] border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center text-slate-500">
            No posts in this category yet.
          </div>
        )}

        {last_page > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-4" aria-label="Pagination">
            {current_page > 1 ? (
              <Link
                href={`/blog/category/${slug}?page=${current_page - 1}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </span>
            )}

            <span className="text-sm text-slate-500">
              Page {current_page} of {last_page}
            </span>

            {current_page < last_page ? (
              <Link
                href={`/blog/category/${slug}?page=${current_page + 1}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed">
                Next
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </nav>
        )}
      </Container>
    </div>
  );
}
