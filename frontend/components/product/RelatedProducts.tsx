import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import { getProductsByCategory } from "@/lib/api";
import ShopProductCard from "@/components/shop/ShopProductCard";

interface RelatedProductsProps {
  categorySlug: string;
  currentProductId: number;
}

export default async function RelatedProducts({
  categorySlug,
  currentProductId,
}: RelatedProductsProps) {
  const all = await getProductsByCategory(categorySlug);

  // Exclude the current product; show up to 4
  const related = all.filter((p) => p.id !== currentProductId).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section
      className="py-14 bg-(--color-muted) border-t border-(--color-border)"
      aria-labelledby="related-heading"
    >
      <Container>
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-(--color-primary) uppercase tracking-widest mb-1">
              You may also like
            </p>
            <h2
              id="related-heading"
              className="text-2xl font-extrabold text-(--color-secondary)"
            >
              Related Products
            </h2>
          </div>
          <Link
            href={`/category/${categorySlug}`}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-(--color-primary) hover:gap-2.5 transition-all"
          >
            View All
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {related.map((product) => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href={`/category/${categorySlug}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-(--color-primary) text-(--color-primary) text-sm font-semibold hover:bg-(--color-primary) hover:text-white transition-all"
          >
            View All in Category
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
