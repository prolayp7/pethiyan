export const CATALOG_SORT_COOKIE = "catalog_sort";

export const CATALOG_SORT_OPTIONS = [
  "featured",
  "price-asc",
  "price-desc",
  "rating",
  "newest",
] as const;

export type CatalogSortValue = (typeof CATALOG_SORT_OPTIONS)[number];

const DEFAULT_CATALOG_SORT: CatalogSortValue = "featured";

function isCatalogSortValue(value: string): value is CatalogSortValue {
  return (CATALOG_SORT_OPTIONS as readonly string[]).includes(value);
}

export function readCatalogSortPreference(): CatalogSortValue {
  if (typeof document === "undefined") return DEFAULT_CATALOG_SORT;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CATALOG_SORT_COOKIE}=([^;]*)`)
  );
  const value = decodeURIComponent(match?.[1] ?? "").trim();

  return isCatalogSortValue(value) ? value : DEFAULT_CATALOG_SORT;
}

export function writeCatalogSortPreference(value: string) {
  if (typeof document === "undefined") return;
  if (!isCatalogSortValue(value)) return;

  const expires = new Date(Date.now() + 30 * 864e5).toUTCString();
  document.cookie = `${CATALOG_SORT_COOKIE}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}
