import type { Metadata } from "next";
import { getNewArrivals, type RealApiProduct } from "@/lib/api";
import NewArrivalsClient from "./NewArrivalsClient";

export const metadata: Metadata = {
  title: "New Arrivals | Pethiyan",
  description: "Discover the latest additions to our packaging collection — fresh pouches, bags, tapes, and more.",
};

// Fallback revalidation every 5 minutes; primary invalidation via POST /api/revalidate
export const revalidate = 300;

export default async function NewArrivalsPage() {
  const products = await getNewArrivals(30, 40) as RealApiProduct[];

  return <NewArrivalsClient initialProducts={products} />;
}
