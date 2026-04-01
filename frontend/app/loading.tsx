// Root-level loading.tsx — shown while any page segment is streaming
// Keeps the header visible; replaces only the <main> content area.
export default function RootLoading() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center"
      style={{ background: "var(--background)" }}
      aria-label="Loading page content"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Branded spinner */}
        <div
          className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "rgba(31,79,138,0.2)", borderTopColor: "#1f4f8a" }}
        />
        <p className="text-sm text-gray-400 font-medium">Loading…</p>
      </div>
    </div>
  );
}
