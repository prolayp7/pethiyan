import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock3, Facebook, Linkedin, Share2, Twitter } from "lucide-react";
import Container from "@/components/layout/Container";
import PostContent from "@/components/blog/PostContent";
import RelatedPosts from "@/components/blog/RelatedPosts";
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/blog-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.featuredImage, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post);

  return (
    <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_10%,#f8fafc_100%)]">
      <div className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <Container className="py-4">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/blog" className="hover:text-slate-900">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/blog/category/${post.category}`} className="hover:text-slate-900">
              {post.category.replace(/-/g, " ")}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">{post.title}</span>
          </nav>
        </Container>
      </div>

      <article>
        <Container className="py-10 sm:py-14">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                {post.category.replace(/-/g, " ")}
              </span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-full border border-slate-200 px-3 py-1 hover:border-slate-300 hover:text-slate-900"
                >
                  {tag}
                </Link>
              ))}
            </div>

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
              <div>
                <header>
                  <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    {post.title}
                  </h1>
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{post.excerpt}</p>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-y border-slate-200 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{post.author.name}</p>
                        <p className="text-sm text-slate-500">{post.author.role}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
                      <span>{post.publishedAt}</span>
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        {post.readingTime}
                      </span>
                    </div>
                  </div>
                </header>

                <div className="relative mt-8 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="aspect-[16/9] w-full object-cover"
                  />
                </div>

                <div className="mt-10 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_16px_70px_rgba(15,23,42,0.06)] sm:p-10">
                  <PostContent post={post} />
                </div>
              </div>

              <aside className="lg:sticky lg:top-28">
                <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_14px_60px_rgba(15,23,42,0.06)]">
                  <section aria-labelledby="share-this-post">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900" id="share-this-post">
                      <Share2 className="h-4 w-4 text-[var(--color-primary)]" />
                      Share this article
                    </div>
                    <div className="mt-4 flex gap-3">
                      {[
                        { label: "Facebook", icon: Facebook },
                        { label: "Twitter", icon: Twitter },
                        { label: "LinkedIn", icon: Linkedin },
                      ].map(({ label, icon: Icon }) => (
                        <button
                          key={label}
                          type="button"
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                          aria-label={`Share on ${label}`}
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </section>

                  <section aria-labelledby="table-of-contents">
                    <h2 id="table-of-contents" className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      On this page
                    </h2>
                    <ol className="mt-4 space-y-3 text-sm text-slate-600">
                      {post.sections.map((section) => (
                        <li key={section.id}>
                          <a href={`#${section.id}`} className="hover:text-slate-950">
                            {section.title}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section aria-labelledby="author-block">
                    <h2 id="author-block" className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      About the author
                    </h2>
                    <div className="mt-4 rounded-[22px] bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{post.author.name}</p>
                          <p className="text-sm text-slate-500">{post.author.role}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-slate-600">{post.author.bio}</p>
                    </div>
                  </section>
                </div>
              </aside>
            </div>
          </div>
        </Container>
      </article>

      <RelatedPosts posts={relatedPosts} />
    </div>
  );
}
