// Shown only on the very first visit to a category URL (before any data arrives).
// On subsequent category-to-category navigations the shell renders instantly and
// only the <Suspense> boundary inside page.tsx shows the product grid skeleton.
export default function CategoryLoading() {
  return (
    <div className="bg-(--background) min-h-screen">
      {/* Page header skeleton */}
      <div className="bg-white border-b border-gray-100 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gray-200 animate-pulse shrink-0" />
            <div className="space-y-2">
              <div className="h-7 w-48 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-72 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* OtherCategories strip skeleton */}
      <div className="bg-white pt-4 pb-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[30px] border border-slate-200/80 px-5 py-4 flex gap-3 items-center">
            <div className="h-4 w-28 bg-gray-200 rounded-full animate-pulse shrink-0" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-24 rounded-full bg-gray-200 animate-pulse shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* Sort bar skeleton */}
      <div className="bg-white border-b border-gray-100 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="h-9 w-36 rounded-xl bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
