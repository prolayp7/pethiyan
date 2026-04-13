import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogCategory } from "@/lib/blog-data";

interface CategoryCardProps {
  category: BlogCategory;
  postCount: number;
}

export default function CategoryCard({ category, postCount }: CategoryCardProps) {
  return (
    <Link
      href={`/blog/category/${category.slug}`}
      className="group flex h-full flex-col rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_60px_rgba(15,23,42,0.1)]"
    >
      <div className={cn("mb-5 h-24 rounded-[20px] bg-gradient-to-br", category.accent)} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950">{category.title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">{category.description}</p>
        </div>
        <ArrowUpRight className="mt-1 h-5 w-5 text-slate-400 transition group-hover:text-[var(--color-primary)]" />
      </div>
      <div className="mt-auto pt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {postCount} articles
      </div>
    </Link>
  );
}
