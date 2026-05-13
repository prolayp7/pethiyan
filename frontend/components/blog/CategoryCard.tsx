import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogCategory } from "@/lib/blog-data";

const ACCENTS = [
  "from-sky-500/20 via-blue-500/10 to-cyan-400/20",
  "from-emerald-500/20 via-lime-500/10 to-teal-400/20",
  "from-violet-500/20 via-purple-500/10 to-indigo-400/20",
  "from-orange-500/20 via-amber-500/10 to-yellow-400/20",
  "from-rose-500/20 via-pink-500/10 to-red-400/20",
  "from-teal-500/20 via-cyan-500/10 to-green-400/20",
];

function slugToAccent(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return ACCENTS[hash % ACCENTS.length];
}

interface CategoryCardProps {
  category: BlogCategory;
  postCount: number;
}

export default function CategoryCard({ category, postCount }: CategoryCardProps) {
  const accent = category.accent ?? slugToAccent(category.slug);

  return (
    <Link
      href={`/blog/category/${category.slug}`}
      className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_60px_rgba(15,23,42,0.1)]"
    >
      <div className="relative mb-5 h-24 overflow-hidden rounded-[20px]">
        {category.coverImage ? (
          <Image
            src={category.coverImage}
            alt={category.title}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 44vw, 90vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className={cn("h-full w-full bg-linear-to-br", accent)} />
        )}
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950">{category.title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">{category.description}</p>
        </div>
        <ArrowUpRight className="mt-1 h-5 w-5 text-slate-400 transition group-hover:text-(--color-primary)" />
      </div>
      <div className="mt-auto pt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {postCount} articles
      </div>
    </Link>
  );
}
