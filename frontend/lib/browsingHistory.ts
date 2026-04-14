const LS_KEY = "browsing_history_slugs";
const MAX_ITEMS = 50;

export interface BrowsingHistoryEntry {
  slug: string;
  productId: number;
}

function read(): BrowsingHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]") as BrowsingHistoryEntry[];
  } catch {
    return [];
  }
}

function write(entries: BrowsingHistoryEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(entries.slice(0, MAX_ITEMS)));
}

/** Push a product view. Most recent appears first. */
export function pushBrowsingHistory(slug: string, productId: number): void {
  const existing = read().filter((e) => e.slug !== slug);
  write([{ slug, productId }, ...existing]);
}

/** Get all slugs in order (most recent first). */
export function getBrowsingHistorySlugs(): string[] {
  return read().map((e) => e.slug);
}

/** Get all entries. */
export function getBrowsingHistory(): BrowsingHistoryEntry[] {
  return read();
}

export function clearBrowsingHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_KEY);
}
