import { getProductsByCategory } from "@/lib/api";
import CategoryClientLayout from "./CategoryClientLayout";

/**
 * Async server component — independently suspends while fetching products.
 * Wrapped in <Suspense> by page.tsx so only the product grid skeletons,
 * not the breadcrumb / header / OtherCategories strip.
 */
export default async function CategoryProductsFetcher({ slug }: { slug: string }) {
  const products = await getProductsByCategory(slug);
  return <CategoryClientLayout initialProducts={products} />;
}
