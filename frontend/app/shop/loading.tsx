import Container from "@/components/layout/Container";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className ?? ""}`} />;
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        {/* Category pill */}
        <SkeletonBlock className="h-4 w-20 rounded-full" />
        {/* Title */}
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-3/4" />
        {/* Price row */}
        <div className="flex items-center gap-2 pt-1">
          <SkeletonBlock className="h-5 w-16" />
          <SkeletonBlock className="h-4 w-12 opacity-50" />
        </div>
        {/* Button */}
        <SkeletonBlock className="h-9 w-full rounded-xl mt-2" />
      </div>
    </div>
  );
}

function FilterSectionSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      <div className="h-9 bg-gray-200 animate-pulse" />
      <div className="bg-white px-4 py-3 space-y-2.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2.5">
            <SkeletonBlock className="h-4 w-4 rounded" />
            <SkeletonBlock className="h-3.5 flex-1 max-w-[120px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 py-5">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="h-10 w-10 rounded-xl" />
              <div className="space-y-2">
                <SkeletonBlock className="h-7 w-40" />
                <SkeletonBlock className="h-3.5 w-28" />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <SkeletonBlock className="h-4 w-12" />
              <SkeletonBlock className="h-3.5 w-3.5 rounded-full" />
              <SkeletonBlock className="h-4 w-10" />
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-8 flex gap-8">
          {/* ── Sidebar skeleton ── */}
          <aside className="hidden lg:block w-60 min-w-60">
            <div className="sticky top-24 space-y-6">
              <FilterSectionSkeleton />
              <FilterSectionSkeleton />
              <FilterSectionSkeleton />
            </div>
          </aside>

          {/* ── Main content skeleton ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex gap-3 mb-6">
              <SkeletonBlock className="h-10 w-36 rounded-xl lg:hidden" />
              <SkeletonBlock className="h-10 w-44 rounded-xl" />
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
