const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "";

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

export type FaqSection = {
  id: number | null;
  name: string;
  icon: string;
  sort_order: number;
  items: FaqItem[];
};

/**
 * Fetch FAQ sections (categories + items) from the backend API.
 * Returns null on error so callers can fall back to static data.
 */
export async function fetchFaqSections(): Promise<FaqSection[] | null> {
  try {
    const url = `${API_BASE}/api/faqs/grouped`;
    const res = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (!json?.success || !Array.isArray(json?.data)) return null;

    return json.data as FaqSection[];
  } catch {
    return null;
  }
}
