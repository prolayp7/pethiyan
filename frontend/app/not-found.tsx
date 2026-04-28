import Link from "next/link";
import { Home, Search, ShoppingBag } from "lucide-react";
import Container from "@/components/layout/Container";
import RecentlyViewedProducts from "@/components/sections/RecentlyViewedProducts";

export default function NotFound() {
  return (
    <>
    <div style={{ background: "var(--background)", minHeight: "70vh" }} className="flex items-center">
      <Container className="py-20 text-center">

        {/* Large 404 */}
        <div className="relative inline-block mb-6">
          <p
            className="text-[8rem] lg:text-[12rem] font-extrabold leading-none select-none"
            style={{ color: "rgba(31,79,138,0.07)" }}
          >
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--brand-gradient)" }}
            >
              <ShoppingBag className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl lg:text-3xl font-extrabold text-(--color-secondary) mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
          The page you&apos;re looking for has moved, been removed, or doesn&apos;t exist.
          Let&apos;s get you back on track.
        </p>

        {/* Quick links */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="btn-brand inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="btn-brand inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
          >
            <ShoppingBag className="h-4 w-4" />
            Browse Products
          </Link>
          <Link
            href="/search"
            className="btn-brand inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
          >
            <Search className="h-4 w-4" />
            Search
          </Link>
        </div>

      </Container>
    </div>

    <RecentlyViewedProducts
      title="Recently Viewed"
      eyebrow="Pick up where you left off"
      description="Products you've browsed recently."
      showClearAction={false}
    />
    </>
  );
}
