"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { BarChart3, ChevronDown, Cookie, Megaphone, ShieldCheck } from "lucide-react";
import {
  COOKIE_CONSENT_NAME,
  DEFAULT_COOKIE_CONSENT,
  serializeCookieConsent,
  type CookieConsentState,
} from "@/lib/cookie-consent";

const ONE_DAY_MS = 864e5;
const COOKIE_EXPIRY_DAYS = 180;

function writeConsentCookie(state: CookieConsentState) {
  const expires = new Date(Date.now() + COOKIE_EXPIRY_DAYS * ONE_DAY_MS).toUTCString();
  document.cookie = `${COOKIE_CONSENT_NAME}=${encodeURIComponent(serializeCookieConsent(state))}; expires=${expires}; path=/; SameSite=Lax`;
}

function PreferencePill({
  icon,
  title,
  description,
  active,
  locked = false,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  active: boolean;
  locked?: boolean;
}) {
  return (
    <div className={`rounded-2xl border px-4 py-3 transition-colors ${
      active
        ? "border-(--color-primary)/20 bg-(--color-primary)/6"
        : "border-gray-200 bg-white"
    }`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
          active ? "bg-(--color-primary) text-white" : "bg-(--color-primary)/10 text-(--color-primary)"
        }`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-900">{title}</p>
            {locked && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                Always on
              </span>
            )}
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function CookieConsentPopup() {
  const portalRoot = typeof document !== "undefined"
    ? document.getElementById("portal-root")
    : null;

  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(DEFAULT_COOKIE_CONSENT.analytics);
  const [marketing, setMarketing] = useState(DEFAULT_COOKIE_CONSENT.marketing);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.cookie.includes(`${COOKIE_CONSENT_NAME}=`)) return;

    const timer = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const optionalEnabled = useMemo(
    () => analytics || marketing,
    [analytics, marketing]
  );

  function saveConsent(next: CookieConsentState) {
    writeConsentCookie(next);
    setVisible(false);

    if (next.analytics || next.marketing) {
      window.location.reload();
    }
  }

  if (!visible || !portalRoot) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100000] p-3 sm:bottom-4 sm:right-4 sm:left-auto sm:max-w-lg sm:p-0">
      <section
        aria-label="Cookie preferences"
        className="pointer-events-auto overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.18)]"
      >
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(73,173,87,0.18),_transparent_42%),linear-gradient(135deg,_rgba(23,57,111,0.08),_rgba(31,79,138,0.02)_48%,_rgba(76,175,80,0.1))]" />
          <div className="relative px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--color-primary) text-white shadow-lg shadow-(--color-primary)/20">
                <Cookie className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center rounded-full border border-(--color-primary)/10 bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-(--color-primary)">
                  Privacy controls
                </div>
                <h2 className="mt-3 text-lg font-black tracking-[0.04em] text-slate-950 sm:text-xl">
                  Your data, your packaging journey
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  We use essential cookies to keep login, cart, and checkout working. Optional cookies help us understand what shoppers use most and improve campaigns without slowing the experience down.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <PreferencePill
                icon={<ShieldCheck className="h-4 w-4" />}
                title="Necessary cookies"
                description="Required for sign-in, cart continuity, security, and checkout reliability."
                active
                locked
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setAnalytics((current) => !current)}
                  className="text-left"
                  aria-pressed={analytics}
                >
                  <PreferencePill
                    icon={<BarChart3 className="h-4 w-4" />}
                    title="Analytics"
                    description="Helps us improve search, product pages, and checkout flow based on usage."
                    active={analytics}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setMarketing((current) => !current)}
                  className="text-left"
                  aria-pressed={marketing}
                >
                  <PreferencePill
                    icon={<Megaphone className="h-4 w-4" />}
                    title="Marketing"
                    description="Used for ad and campaign measurement, such as Facebook Pixel and promo audiences."
                    active={marketing}
                  />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-(--color-primary) transition-opacity hover:opacity-75"
              aria-expanded={expanded}
            >
              {expanded ? "Hide details" : "Customize details"}
              <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>

            {expanded && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
                <p className="text-sm font-semibold text-slate-900">What changes when you choose each option</p>
                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  <p><span className="font-semibold text-slate-900">Necessary:</span> keeps auth, cart, and checkout working smoothly.</p>
                  <p><span className="font-semibold text-slate-900">Analytics:</span> allows Google Analytics and Tag Manager so we can measure product discovery and checkout friction.</p>
                  <p><span className="font-semibold text-slate-900">Marketing:</span> allows Facebook Pixel for ad attribution and campaign optimization.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => saveConsent({ necessary: true, analytics: false, marketing: false })}
                className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Necessary only
              </button>
              <button
                type="button"
                onClick={() => saveConsent({ necessary: true, analytics, marketing })}
                className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800"
              >
                {optionalEnabled ? "Save preferences" : "Continue with essentials"}
              </button>
              <button
                type="button"
                onClick={() => saveConsent({ necessary: true, analytics: true, marketing: true })}
                className="flex-1 rounded-2xl bg-[linear-gradient(135deg,#17396f_0%,#2f6f9f_52%,#49ad57_100%)] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#17396f]/20 transition-transform hover:-translate-y-0.5"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>,
    portalRoot
  );
}
