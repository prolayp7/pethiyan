import { API_BASE } from './api';

const BASE = API_BASE.replace(/\/+$/, '');

export async function fetchPageBySlug(slug: string) {
  const res = await fetch(`${BASE}/api/pages/${encodeURIComponent(slug)}`, {
    next: { tags: ['pages'] },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch page ${slug}: ${res.status}`);
  return res.json();
}

export async function fetchActivePages(): Promise<Array<{ slug: string; title: string; updated_at: string | null }>> {
  try {
    const res = await fetch(`${BASE}/api/pages`, { next: { tags: ['pages'] } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchBlogPostSlugs(): Promise<Array<{ slug: string; updated_at: string | null }>> {
  try {
    const res = await fetch(`${BASE}/api/blog/posts?per_page=500`, {
      next: { tags: ['blog'], revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const posts: Array<{ slug: string; updated_at?: string | null }> = json?.data ?? json ?? [];
    return posts.map((p) => ({ slug: p.slug, updated_at: p.updated_at ?? null }));
  } catch {
    return [];
  }
}
