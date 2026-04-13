import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RETURN_TO_COOKIE, sanitizeReturnToPath } from "@/lib/return-to";

// Routes that require the user to be logged in
const PROTECTED_PATHS = ["/account"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtected) return NextResponse.next();

  // The backend now sets the HttpOnly "auth_token" cookie on successful auth.
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    const safeReturnTo = sanitizeReturnToPath(`${pathname}${request.nextUrl.search}`);
    if (safeReturnTo) {
      response.cookies.set(RETURN_TO_COOKIE, safeReturnTo, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 30,
      });
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware only on matched paths — skip static files and API routes
  matcher: ["/account/:path*"],
};
