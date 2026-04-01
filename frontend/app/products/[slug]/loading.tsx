// Product detail page loading skeleton
export default function ProductLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12" style={{ background: "var(--background)" }}>
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        {[80, 20, 120, 20, 160].map((w, i) => (
          <div key={i} className={`h-3 rounded-full bg-gray-200 animate-pulse`} style={{ width: w }} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery skeleton */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-16 h-16 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Details skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-24 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-8 w-3/4 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse" />
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-3 bg-gray-200 rounded-full animate-pulse w-5/6" />
            <div className="h-3 bg-gray-200 rounded-full animate-pulse w-4/5" />
          </div>
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse mt-4" />
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
