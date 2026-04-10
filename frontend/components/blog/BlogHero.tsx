import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import Container from "@/components/layout/Container";
import type { BlogPost } from "@/lib/blog-data";

interface BlogHeroProps {
  title: string;
  eyebrow: string;
  description: string;
  featuredPost: BlogPost;
}

export default function BlogHero({ title, eyebrow, description, featuredPost }: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(110,168,216,0.2),_transparent_35%),linear-gradient(150deg,#08162c_0%,#12325b_48%,#1b4b7d_100%)] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:26px_26px] opacity-30" />
      <Container className="relative grid gap-10 py-14 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-20">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">{eyebrow}</p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-blue-100/85 sm:text-base">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Read featured article
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm text-blue-50/90 backdrop-blur">
              <Search className="h-4 w-4 text-emerald-300" />
              Search by topic, packaging type, or brand growth idea
            </div>
          </div>
        </div>

        <article className="overflow-hidden rounded-[28px] border border-white/12 bg-white/10 shadow-[0_30px_80px_rgba(2,8,23,0.35)] backdrop-blur">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={featuredPost.featuredImage}
              alt={featuredPost.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />
            <div className="absolute left-5 top-5 rounded-full bg-emerald-400/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950">
              Featured
            </div>
          </div>
          <div className="space-y-4 p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-blue-100/75">
              <span>{featuredPost.publishedAt}</span>
              <span className="h-1 w-1 rounded-full bg-blue-200/70" />
              <span>{featuredPost.readingTime}</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                {featuredPost.category.replace(/-/g, " ")}
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-tight">{featuredPost.title}</h2>
              <p className="mt-3 text-sm leading-7 text-blue-100/80">{featuredPost.excerpt}</p>
            </div>
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-emerald-300"
            >
              Explore article
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </Container>
    </section>
  );
}
