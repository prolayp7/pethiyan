import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogHomeClient from "@/components/blog/BlogHomeClient";
import { API_BASE } from "@/lib/api";
import type { BlogCategory, BlogPost } from "@/lib/blog-data";

export const revalidate = 3600;

interface ApiCategory {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  postsCount: number;
  seo: { title: string | null; description: string | null };
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
    featuredSectionTitle: string;
    latestSectionTitle: string;
    categoriesSectionTitle: string;
    postsPerPage: number;
  };
  featuredPosts: ApiPost[];
  latestPosts: ApiPost[];
  categories: ApiCategory[];
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

function transformCategory(cat: ApiCategory): BlogCategory {
  return {
    slug: cat.slug,
    title: cat.title,
    description: cat.description ?? "",
    coverImage: cat.coverImage,
  };
}

async function fetchBlogHome(): Promise<BlogHomeApiResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/blog`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json() as Promise<BlogHomeApiResponse>;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchBlogHome();
  return {
    title: data?.settings.heading ?? "Blog",
    description: data?.settings.subheading ?? undefined,
  };
}

export default async function BlogPage() {
  const data = await fetchBlogHome();

  if (!data) notFound();

  const { settings, featuredPosts, latestPosts, categories } = data;

  const allPosts = [
    ...featuredPosts.map(transformPost),
    ...latestPosts.map(transformPost),
  ];
  // deduplicate by slug (featuredPosts may overlap latestPosts)
  const seen = new Set<string>();
  const uniquePosts = allPosts.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  // Ensure at least 3 posts in the featured grid. If fewer are marked featured,
  // pad with latest posts (skipping slugs already in the featured list).
  const featuredSlugs = new Set(featuredPosts.map((p) => p.slug));
  const paddingPosts = latestPosts.filter((p) => !featuredSlugs.has(p.slug));
  const paddedFeatured = [
    ...featuredPosts,
    ...paddingPosts,
  ].slice(0, 3);
  const transformedFeatured = paddedFeatured.map(transformPost);

  return (
    <BlogHomeClient
      featuredPosts={transformedFeatured}
      latestPosts={latestPosts.map(transformPost)}
      allPosts={uniquePosts}
      categories={categories.map(transformCategory)}
      heroSettings={{
        eyebrow: settings.eyebrow,
        heading: settings.heading,
        subheading: settings.subheading,
      }}
    />
  );
}
