export const COOKIE_CONSENT_NAME = "cookie_consent";

export type CookieConsentCategory = "necessary" | "analytics" | "marketing";

export interface CookieConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export const DEFAULT_COOKIE_CONSENT: CookieConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export function parseCookieConsent(value?: string | null): CookieConsentState {
  if (!value) return DEFAULT_COOKIE_CONSENT;

  const parts = value
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  const includesAll = parts.includes("all");

  return {
    necessary: true,
    analytics: includesAll || parts.includes("analytics"),
    marketing: includesAll || parts.includes("marketing"),
  };
}

export function serializeCookieConsent(state: CookieConsentState): string {
  const parts: CookieConsentCategory[] = ["necessary"];

  if (state.analytics) parts.push("analytics");
  if (state.marketing) parts.push("marketing");

  return parts.join(",");
}

export function hasStoredCookieConsent(value?: string | null): boolean {
  return Boolean(value && value.trim());
}
