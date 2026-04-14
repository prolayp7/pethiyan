import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/blog-data";

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "featured";
}

export default function BlogCard({ post, variant = "default" }: BlogCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_14px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]",
        variant === "featured" && "h-full",
      )}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className={cn("relative overflow-hidden", variant === "featured" ? "aspect-[16/10]" : "aspect-[16/11]")}>
          <img
            src={post.featuredImage}
            alt={post.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
            width={800}
            height={533}
          />
        </div>
      </Link>
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-700">
            {post.category.replace(/-/g, " ")}
          </span>
          <span>{post.publishedAt}</span>
        </div>
        <div>
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-xl font-bold leading-tight text-slate-950 transition group-hover:text-[var(--color-primary)]">
              {post.title}
            </h3>
          </Link>
          <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">{post.author.name}</p>
              <p className="text-xs text-slate-500">{post.author.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
            <Clock3 className="h-3.5 w-3.5" />
            {post.readingTime}
          </div>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-secondary)]"
        >
          Read article
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
