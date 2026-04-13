export const RETURN_TO_COOKIE = "return_to";
const RETURN_TO_MAX_AGE = 60 * 30; // 30 minutes

export function sanitizeReturnToPath(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();

  if (!trimmed.startsWith("/")) return null;
  if (trimmed.startsWith("//")) return null;

  return trimmed;
}

export function readReturnToCookie(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${RETURN_TO_COOKIE}=([^;]*)`)
  );

  return sanitizeReturnToPath(match ? decodeURIComponent(match[1] ?? "") : null);
}

export function writeReturnToCookie(path?: string | null) {
  if (typeof document === "undefined") return;

  const sanitized = sanitizeReturnToPath(path);
  if (!sanitized) return;

  document.cookie = `${RETURN_TO_COOKIE}=${encodeURIComponent(sanitized)}; max-age=${RETURN_TO_MAX_AGE}; path=/; SameSite=Lax`;
}

export function clearReturnToCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${RETURN_TO_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function resolveLoginRedirect(
  redirectParam?: string | null,
  fallback = "/account"
): string {
  return sanitizeReturnToPath(redirectParam)
    ?? readReturnToCookie()
    ?? fallback;
}
