import Link from "next/link";
import Container from "@/components/layout/Container";
import type { ApiCategory } from "@/lib/api";

interface OtherCategoriesProps {
  currentCategory: ApiCategory;
  categories: ApiCategory[];
}

function sortRelatedCategories(currentCategory: ApiCategory, categories: ApiCategory[]) {
  return [...categories].sort((a, b) => {
    const aSameParent = a.parent_id === currentCategory.parent_id ? 1 : 0;
    const bSameParent = b.parent_id === currentCategory.parent_id ? 1 : 0;

    if (aSameParent !== bSameParent) {
      return bSameParent - aSameParent;
    }

    return a.name.localeCompare(b.name);
  });
}

export default function OtherCategories({
  currentCategory,
  categories,
}: OtherCategoriesProps) {
  const otherCategories = sortRelatedCategories(
    currentCategory,
    categories.filter((category) => category.slug !== currentCategory.slug),
  ).slice(0, 10);

  if (otherCategories.length === 0) {
    return null;
  }

  return (
    <section
      className="relative z-20 -mt-10 bg-white pt-3 pb-0 sm:-mt-7 sm:pt-4 sm:pb-1"
      aria-labelledby="other-categories-heading"
    >
      <Container>
        <div className="rounded-[30px] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:px-6 sm:py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <h2
              id="other-categories-heading"
              className="shrink-0 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.28em] text-[#5879a6]"
            >
              Other Categories
            </h2>

            <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-0.5 lg:flex-wrap lg:overflow-visible">
              {otherCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-[#fbfdff] px-5 py-2 text-sm font-semibold text-slate-700 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset] transition hover:border-(--color-primary) hover:bg-white hover:text-(--color-primary)"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
