// Category page loading skeleton
export default function CategoryLoading() {
  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      {/* Hero skeleton */}
      <div className="h-40 bg-gray-200 animate-pulse" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filter bar skeleton */}
        <div className="flex gap-3 mb-8">
          {[120, 100, 140, 90].map((w, i) => (
            <div key={i} className="h-9 rounded-full bg-gray-200 animate-pulse" style={{ width: w }} />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
