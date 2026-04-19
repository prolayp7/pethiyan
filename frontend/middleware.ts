import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth is handled client-side via LoginModal in AccountLayoutClient.
// The middleware no longer redirects so that:
// 1. Logged-in users aren't incorrectly redirected due to cross-domain cookie visibility
// 2. Unauthenticated users see a login popup instead of being taken to /login
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
