import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// ─── Revalidation webhook ─────────────────────────────────────────────────────
//
// Called by the backend admin whenever products or categories are created,
// updated, or deleted. This purges the Next.js ISR cache so the next visitor
// gets fresh data instead of waiting for the 5-minute fallback revalidation.
//
// Usage (from backend):
//   POST /api/revalidate
//   Headers: { "x-revalidate-secret": "<REVALIDATE_SECRET>" }
//   Body:    { "tags": ["products"], "paths": ["/shop"] }
//
// Or via query string for simple GET webhooks:
//   GET /api/revalidate?secret=<REVALIDATE_SECRET>&tag=products

// Tags → paths that should also be force-revalidated when that tag fires
const TAG_PATH_MAP: Record<string, string[]> = {
  products:            ["/shop", "/", "/new-arrivals"],
  categories:          ["/shop"],
  "featured-products": ["/"],
  "new-arrivals":      ["/new-arrivals"],
  "site-settings":     ["/", "/shop", "/new-arrivals"],
  // category-specific tags bust /category/[slug] pages
};

type RevalidateBody = {
  secret?: string;
  tags?: string[];
  paths?: string[];
};

export async function POST(req: NextRequest) {
  return handleRevalidate(req);
}

// Allow GET for simple webhook integrations (e.g. backend fires a GET request)
export async function GET(req: NextRequest) {
  return handleRevalidate(req);
}

async function handleRevalidate(req: NextRequest) {
  const configuredSecret = process.env.REVALIDATE_SECRET;
  if (!configuredSecret) {
    return NextResponse.json(
      { success: false, message: "REVALIDATE_SECRET is not configured on the server." },
      { status: 500 }
    );
  }

  // Accept secret from: body, header, or query param
  const url = new URL(req.url);
  const querySecret = url.searchParams.get("secret") ?? "";
  const headerSecret = req.headers.get("x-revalidate-secret") ?? "";

  let body: RevalidateBody = {};
  if (req.method === "POST") {
    try { body = (await req.json()) as RevalidateBody; } catch { body = {}; }
  }

  const incomingSecret = body.secret ?? headerSecret ?? querySecret;
  if (incomingSecret !== configuredSecret) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  // Support query param ?tag=products as shorthand
  const queryTag = url.searchParams.get("tag");
  const tags  = [...new Set([...(body.tags ?? []), ...(queryTag ? [queryTag] : [])].filter(Boolean))];
  const paths = [...new Set([...(body.paths ?? [])].filter(Boolean))];

  // Revalidate requested tags
  for (const tag of tags) {
    revalidateTag(tag, "max");
    // Also revalidate known pages associated with this tag
    for (const p of TAG_PATH_MAP[tag] ?? []) {
      if (!paths.includes(p)) paths.push(p);
    }
  }

  // Revalidate paths
  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    success: true,
    message: "Revalidated successfully.",
    data: { tags, paths },
    revalidatedAt: new Date().toISOString(),
  });
}
