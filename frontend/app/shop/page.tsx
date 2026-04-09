import type { Metadata } from "next";
import { getProducts, getCategories, getSubCategories, type RealApiProduct } from "@/lib/api";
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
  const [products, categories, subCategories] = await Promise.all([
    getProducts() as Promise<RealApiProduct[]>,
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
        initialProducts={products}
        initialCategories={categories}
        initialSubCategories={subCategories}
      />
    </>
  );
}
