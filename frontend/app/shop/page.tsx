import type { Metadata } from "next";
import { getProductsPage, getCategories, getSubCategories } from "@/lib/api";
import { breadcrumbSchema, jsonLd } from "@/lib/structured-data";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop All Products | Pethiyan",
  description: "Browse our full range of premium packaging products — pouches, kraft bags, tapes, and more.",
};

// Safety fallback: revalidate every 5 minutes even if webhook never fires.
// Primary invalidation is on-demand via POST /api/revalidate from the backend.
export const revalidate = 300;

export default async function ShopPage() {
  const [firstPage, categories, subCategories] = await Promise.all([
    getProductsPage(1, 24),
    getCategories(),
    getSubCategories(),
  ]);

  const bcSchema = breadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
  ]);

  return (
    <>
      <script {...jsonLd(bcSchema)} key="breadcrumb-schema" />
      <ShopClient
        initialProducts={firstPage.products}
        initialCategories={categories}
        initialSubCategories={subCategories}
        initialPage={firstPage.currentPage}
        initialHasMore={firstPage.hasMore}
      />
    </>
  );
}
