import { NextResponse } from "next/server";
import { API_BASE } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pethiyan.com";

function normalizeIconUrl(src?: string | null): string | null {
  if (!src) return null;

  const trimmed = String(src).trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const incoming = new URL(trimmed);
      const apiBase  = new URL(API_BASE);
      // Rewrite localhost/127.0.0.1 URLs to the configured API origin
      if (["127.0.0.1", "localhost"].includes(incoming.hostname)) {
        return `${apiBase.origin}${incoming.pathname}${incoming.search}${incoming.hash}`;
      }
    } catch {
      // fall through
    }
    return trimmed;
  }

  const base = API_BASE.replace(/\/+$/, "");
  if (trimmed.startsWith("/")) return `${base}${trimmed}`;
  if (trimmed.startsWith("storage/") || trimmed.startsWith("uploads/")) return `${base}/${trimmed}`;
  return `${base}/storage/${trimmed}`;
}

async function resolveConfiguredIconUrl(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE}/api/settings/system`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) return null;

    const payload = await response.json() as {
      success?: boolean;
      data?: { value?: Record<string, unknown> } | Record<string, unknown>;
    };

    if (!payload?.success || !payload.data) return null;

    const setting = ("value" in payload.data ? payload.data.value : payload.data) as Record<string, unknown> | undefined;
    const favicon = typeof setting?.favicon === "string" ? setting.favicon : null;

    return normalizeIconUrl(favicon);
  } catch {
    return null;
  }
}

export async function GET() {
  const iconUrl = (await resolveConfiguredIconUrl()) ?? new URL("/favicon.ico", SITE_URL).toString();

  try {
    const iconResponse = await fetch(iconUrl, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!iconResponse.ok || !iconResponse.body) {
      return new NextResponse(null, { status: 204 });
    }

    return new NextResponse(iconResponse.body, {
      headers: {
        "Content-Type": iconResponse.headers.get("content-type") ?? "image/x-icon",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}