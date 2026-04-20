import { API_BASE } from "./api";

export function normalizeImageUrl(src?: string | null): string | null {
  if (!src) return null;
  const trimmed = String(src).trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed);
      const apiOrigin = new URL(API_BASE).origin;
      if (u.hostname === "127.0.0.1" || u.hostname === "localhost") {
        return apiOrigin + u.pathname + u.search + u.hash;
      }
    } catch (e) {
      // fallthrough to return trimmed
    }
    return trimmed;
  }
  const base = API_BASE.replace(/\/+$/, "");
  if (trimmed.startsWith("/")) return `${base}${trimmed}`;
  if (trimmed.startsWith("storage/") || trimmed.startsWith("uploads/")) return `${base}/${trimmed}`;
  return `${base}/storage/${trimmed}`;
}
