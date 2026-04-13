export const CART_COUNT_COOKIE = "cart_count";
export const WISHLIST_COUNT_COOKIE = "wishlist_count";

function normalizeCount(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.floor(parsed);
}

export function readCountFromCookie(name: string): number {
  if (typeof document === "undefined") return 0;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`)
  );

  return normalizeCount(match ? decodeURIComponent(match[1] ?? "") : 0);
}

export function writeCountCookie(name: string, value: number) {
  if (typeof document === "undefined") return;

  const count = normalizeCount(value);
  const expires = new Date(Date.now() + 30 * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(String(count))}; expires=${expires}; path=/; SameSite=Lax`;
}

export function parseCountCookie(value?: string | null): number {
  return normalizeCount(value);
}
