export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-(--color-border) overflow-hidden animate-pulse">
      <div className="aspect-4/3 bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-2.5 w-20 bg-gray-100 rounded-full" />
        <div className="h-3.5 w-full bg-gray-100 rounded-full" />
        <div className="h-3.5 w-3/4 bg-gray-100 rounded-full" />
        <div className="h-4 w-16 bg-gray-100 rounded-full mt-3" />
        <div className="h-9 w-full bg-gray-100 rounded-xl mt-2" />
      </div>
    </div>
  );
}
