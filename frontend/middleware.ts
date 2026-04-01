import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require the user to be logged in
const PROTECTED_PATHS = ["/account", "/checkout"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtected) return NextResponse.next();

  // The AuthContext sets an "auth_token" cookie on login so we can check it here
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware only on matched paths — skip static files and API routes
  matcher: ["/account/:path*", "/checkout/:path*"],
};
