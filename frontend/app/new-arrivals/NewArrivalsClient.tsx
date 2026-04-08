"use client";

import Link from "next/link";
import { Package, Sparkles, Home, ChevronRight } from "lucide-react";
import Container from "@/components/layout/Container";
import ShopProductCard from "@/components/shop/ShopProductCard";
import { type RealApiProduct } from "@/lib/api";

interface Props {
  initialProducts: RealApiProduct[];
}

export default function NewArrivalsClient({ initialProducts }: Props) {
  const filtered = initialProducts;

  return (
    <div className="min-h-screen bg-(--background)">
      {/* Page header with inline breadcrumb */}
      <div className="bg-white border-b border-(--color-border) py-5">
        <Container>
          <div className="flex items-center justify-between gap-4">
            {/* Left: icon + title + subtitle */}
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center h-10 w-10 rounded-xl shrink-0"
                style={{ background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)" }}
              >
                <Sparkles className="h-5 w-5 text-white" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-(--color-secondary)">New Arrivals</h1>
                <p className="mt-0.5 text-gray-500 text-sm">
                  {filtered.length} product{filtered.length !== 1 ? "s" : ""} · Added in the last 30 days
                </p>
              </div>
            </div>
            {/* Right: breadcrumb */}
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 shrink-0" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1 hover:text-(--color-primary) transition-colors">
                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
              <span className="text-(--color-secondary) font-medium">New Arrivals</span>
            </nav>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-8">
          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Package className="h-16 w-16 text-gray-200 mb-4" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-(--color-secondary) mb-1">No products found</h2>
              <p className="text-sm text-gray-500 mb-6">No new products have been added recently.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <ShopProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
