export default function ShopProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden animate-pulse">
      {/* Image */}
      <div className="aspect-square bg-gray-100" />

      {/* Body */}
      <div className="flex flex-col gap-2 p-3">
        {/* Category label */}
        <div className="h-2.5 w-16 bg-gray-100 rounded-full" />

        {/* Title — two lines */}
        <div className="space-y-1.5">
          <div className="h-3.5 bg-gray-100 rounded w-full" />
          <div className="h-3.5 bg-gray-100 rounded w-4/5" />
        </div>

        {/* Attribute pills */}
        <div className="flex gap-1.5 mt-0.5">
          <div className="h-5 w-10 bg-gray-100 rounded-full" />
          <div className="h-5 w-14 bg-gray-100 rounded-full" />
          <div className="h-5 w-8 bg-gray-100 rounded-full" />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mt-1" />

        {/* Price + button row */}
        <div className="flex items-end justify-between gap-2 mt-0.5">
          <div className="space-y-1">
            <div className="h-4 w-16 bg-gray-100 rounded" />
            <div className="h-2.5 w-10 bg-gray-100 rounded" />
          </div>
          <div className="h-7 w-24 bg-gray-100 rounded-lg shrink-0" />
        </div>
      </div>
    </div>
  );
}
