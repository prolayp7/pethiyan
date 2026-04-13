"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { type RealApiProduct, type ApiCategory } from "@/lib/api";
import { readCatalogSortPreference, writeCatalogSortPreference } from "@/lib/catalog-preferences";
import OtherCategories from "./OtherCategories";
import CategoryProducts from "./CategoryProducts";

const SORT_OPTIONS = [
  { label: "Featured",           value: "featured"   },
  { label: "Price: Low to High", value: "price-asc"  },
  { label: "Price: High to Low", value: "price-desc" },
];

interface Props {
  currentCategory: ApiCategory;
  categories: ApiCategory[];
  products: RealApiProduct[];
}

export default function CategoryClientLayout({ currentCategory, categories, products }: Props) {
  const [sort, setSort] = useState(() => readCatalogSortPreference());

  useEffect(() => {
    writeCatalogSortPreference(sort);
  }, [sort]);

  const sortDropdown = (
    <div className="relative">
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="appearance-none rounded-xl border border-(--color-border) bg-white py-2 pl-4 pr-9 text-sm transition focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30"
        aria-label="Sort category products"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
    </div>
  );

  return (
    <>
      <OtherCategories
        currentCategory={currentCategory}
        categories={categories}
        sortDropdown={sortDropdown}
      />
      <CategoryProducts initialProducts={products} sort={sort} />
    </>
  );
}
