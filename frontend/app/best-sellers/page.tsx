import type { Metadata } from "next";
import { getBestSellers, type RealApiProduct } from "@/lib/api";
import BestSellersClient from "./BestSellersClient";
import { breadcrumbSchema, jsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Best Sellers | Pethiyan",
  description: "Shop our most popular packaging products — top-selling pouches, bags, tapes, and more chosen by thousands of customers.",
};

// Always SSR — best sellers change with orders, never cache stale empty data.
export const dynamic = "force-dynamic";

export default async function BestSellersPage() {
  const products = await getBestSellers(40) as RealApiProduct[];

  const bcSchema = breadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Best Sellers", href: "/best-sellers" },
  ]);

  return (
    <>
      <script {...jsonLd(bcSchema)} key="breadcrumb-schema" />
      <BestSellersClient initialProducts={products} />
    </>
  );
}
