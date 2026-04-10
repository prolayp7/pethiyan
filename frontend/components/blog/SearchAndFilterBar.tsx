"use client";

import { Search } from "lucide-react";

interface SearchAndFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  categories: { slug: string; title: string }[];
  activeCategory: string;
  onCategoryChange: (value: string) => void;
}

export default function SearchAndFilterBar({
  search,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
}: SearchAndFilterBarProps) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block flex-1">
          <span className="sr-only">Search blog posts</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title, topic, or packaging idea"
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCategoryChange("")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeCategory === ""
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All topics
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => onCategoryChange(category.slug)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === category.slug
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
