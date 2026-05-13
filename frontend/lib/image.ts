import { API_BASE } from "./api";

/**
 * Returns true when the Next.js <Image> optimizer should be bypassed:
 *  - data: URIs (inline base64 — optimizer would just re-encode them)
 *  - SVG files (Next.js cannot rasterise vectors)
 *  - localhost / 127.0.0.1 URLs (dev — optimizer can't reach internal addresses)
 *
 * Everything else (production backend, CDN, Unsplash, etc.) flows through
 * the optimizer so cache, format conversion (AVIF/WebP), and resizing all apply.
 */
export function shouldBypassOptimizer(src?: string | null): boolean {
  if (!src) return false;
  if (/^data:/i.test(src)) return true;
  if (/\.svg(\?|#|$)/i.test(src)) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(src)) return true;
  return false;
}

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
