import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import Container from "@/components/layout/Container";
import { getPostsByTag, getTagBySlug } from "@/lib/blog-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${getTagBySlug(slug)} Posts`,
    description: `Browse blog posts tagged with ${getTagBySlug(slug)}.`,
  };
}

export default async function BlogTagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = getPostsByTag(slug);

  if (posts.length === 0) {
    notFound();
  }

  const title = getTagBySlug(slug);

  return (
    <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_16%,#f8fafc_100%)]">
      <section className="border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <Container className="py-5">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/blog" className="hover:text-slate-900">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">#{title}</span>
          </nav>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Tag Listing</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">#{title}</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">
            A focused list of articles connected to {title.toLowerCase()}, from practical packaging decisions to brand and fulfillment lessons.
          </p>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </div>
  );
}
