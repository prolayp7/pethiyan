import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumb from "@/components/common/Breadcrumb";
import SearchClient from "./SearchClient";
import { unifiedSearch } from "@/lib/api";

// ─── Dynamic metadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  if (!q) {
    return {
      title: "Search Products",
      description: "Search our full range of packaging products at Pethiyan.",
      alternates: { canonical: "/search" },
    };
  }
  return {
    title: `Results for "${q}"`,
    description: `Search results for "${q}" — packaging products at Pethiyan.`,
    robots: { index: false, follow: true }, // don't index search result pages
    alternates: { canonical: `/search?q=${encodeURIComponent(q)}` },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  // Server-side fetch for initial render (SSR — good for SEO when query exists)
  const initialResults = query ? await unifiedSearch(query, "all") : null;

  return (
    <div className="min-h-screen bg-(--background)">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Search" }]} />

      {/* Page header */}
      <div className="bg-white border-b border-(--color-border) py-8">
        <Container>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-(--color-secondary)">
            {query ? `Search: "${query}"` : "Search Products"}
          </h1>
          {query && initialResults && initialResults.total > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {initialResults.total} result{initialResults.total !== 1 ? "s" : ""} found
            </p>
          )}
        </Container>
      </div>

      {/* Client component handles live re-search */}
      <Container>
        <div className="py-10">
          <SearchClient initialQuery={query} initialResults={initialResults} />
        </div>
      </Container>

      {/* Mobile bottom padding */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </div>
  );
}
