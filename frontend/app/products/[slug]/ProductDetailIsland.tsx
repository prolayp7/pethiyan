"use client";

import dynamic from "next/dynamic";
import type { ApiFaq, ApiReview, RealApiProduct } from "@/lib/api";

const ProductDetailClient = dynamic(() => import("./ProductDetailClient"), {
  ssr: false,
});

interface ProductDetailIslandProps {
  product: RealApiProduct;
  reviews: ApiReview[];
  faqs: ApiFaq[];
  initialVariantSlug?: string;
}

export default function ProductDetailIsland(props: ProductDetailIslandProps) {
  return <ProductDetailClient {...props} />;
}

