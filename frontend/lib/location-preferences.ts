export const LAST_PINCODE_COOKIE = "last_pincode";
const LAST_PINCODE_DAYS = 30;

export function normalizeIndianPincode(value?: string | null): string {
  return String(value ?? "").replace(/\D/g, "").slice(0, 6);
}

export function readLastPincodeFromCookie(): string {
  if (typeof document === "undefined") return "";

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${LAST_PINCODE_COOKIE}=([^;]*)`)
  );

  if (!match) return "";

  return normalizeIndianPincode(decodeURIComponent(match[1] ?? ""));
}

export function writeLastPincodeCookie(value?: string | null) {
  if (typeof document === "undefined") return;

  const pincode = normalizeIndianPincode(value);
  if (pincode.length !== 6) return;

  const expires = new Date(Date.now() + LAST_PINCODE_DAYS * 864e5).toUTCString();
  document.cookie = `${LAST_PINCODE_COOKIE}=${encodeURIComponent(pincode)}; expires=${expires}; path=/; SameSite=Lax`;
}
