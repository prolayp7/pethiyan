import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth is handled client-side via LoginModal in AccountLayoutClient.
// The middleware no longer redirects so that:
// 1. Logged-in users aren't incorrectly redirected due to cross-domain cookie visibility
// 2. Unauthenticated users see a login popup instead of being taken to /login
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
