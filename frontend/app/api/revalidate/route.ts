import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type RevalidateBody = {
  secret?: string;
  tags?: string[];
  paths?: string[];
};

export async function POST(req: NextRequest) {
  const configuredSecret = process.env.REVALIDATE_SECRET;
  if (!configuredSecret) {
    return NextResponse.json(
      { success: false, message: "REVALIDATE_SECRET is not configured." },
      { status: 500 }
    );
  }

  let body: RevalidateBody = {};
  try {
    body = (await req.json()) as RevalidateBody;
  } catch {
    body = {};
  }

  const incomingSecret =
    body.secret ?? req.headers.get("x-revalidate-secret") ?? "";
  if (incomingSecret !== configuredSecret) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  const tags = (body.tags ?? []).filter(Boolean);
  const paths = (body.paths ?? []).filter(Boolean);

  for (const tag of tags) {
    revalidateTag(tag);
  }

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

