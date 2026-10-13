import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/token";

// Layer 1: a fast, cheap redirect before anything renders.
// It only proves a valid session cookie exists. It is NOT the security:
// every page, route handler and action re-checks the session itself.
export async function middleware(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  const { pathname, search } = request.nextUrl;

  // 1) No session → send to sign-in, remembering where they were going.
  if (!session) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  // 2) Staff-only areas. Customers get bounced home, not signed out.
  const isStaffOnly =
    pathname.startsWith("/kitchen") || pathname.startsWith("/dashboard");

  if (isStaffOnly && session.role !== "staff" && session.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Keep it narrow: never run on /menu, images or static files.
export const config = {
  matcher: [
    "/checkout/:path*",
    "/orders/:path*",
    "/kitchen/:path*",
    "/dashboard/:path*",
  ],
};