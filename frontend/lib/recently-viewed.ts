export const RECENTLY_VIEWED_COOKIE = "recently_viewed_ids";
const MAX_RECENTLY_VIEWED = 10;

export function readRecentlyViewedIds(): number[] {
  if (typeof document === "undefined") return [];

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${RECENTLY_VIEWED_COOKIE}=([^;]*)`)
  );

  if (!match) return [];

  return decodeURIComponent(match[1] ?? "")
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((value, index, list) => Number.isInteger(value) && value > 0 && list.indexOf(value) === index)
    .slice(0, MAX_RECENTLY_VIEWED);
}

export function writeRecentlyViewedIds(ids: number[]) {
  if (typeof document === "undefined") return;

  const normalized = ids
    .map((value) => Number(value))
    .filter((value, index, list) => Number.isInteger(value) && value > 0 && list.indexOf(value) === index)
    .slice(0, MAX_RECENTLY_VIEWED);

  const expires = new Date(Date.now() + 7 * 864e5).toUTCString();
  document.cookie = `${RECENTLY_VIEWED_COOKIE}=${encodeURIComponent(normalized.join(","))}; expires=${expires}; path=/; SameSite=Lax`;
}

export function clearRecentlyViewedIds() {
  if (typeof document === "undefined") return;

  document.cookie = `${RECENTLY_VIEWED_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export function pushRecentlyViewedId(id: number) {
  const normalizedId = Number(id);
  if (!Number.isInteger(normalizedId) || normalizedId <= 0) return;

  const next = [
    normalizedId,
    ...readRecentlyViewedIds().filter((value) => value !== normalizedId),
  ].slice(0, MAX_RECENTLY_VIEWED);

  writeRecentlyViewedIds(next);
}
