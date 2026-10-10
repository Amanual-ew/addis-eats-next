import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/token";

// Layer 1: a fast, cheap redirect before anything renders.
// It only proves a valid session cookie exists. It is NOT the security:
// every page, route handler and action re-checks the session itself.
export async function middleware(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  let session = null;
  try {
    session = token ? await verifyToken(token) : null;
  } catch {
    session = null;
  }

  if (!session) {
    const url = new URL("/signin", request.url);
    url.searchParams.set(
      "next",
      request.nextUrl.pathname + request.nextUrl.search
    );
    return NextResponse.redirect(url);
  }

  // Layer 1.5: role gate for staff-only areas
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/kitchen") &&
    session.role !== "staff" &&
    session.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Keep it narrow: never run on /menu, images, static files, or public auth routes.
export const config = {
  matcher: [
    "/checkout/:path*",
    "/orders/:path*",
    "/kitchen/:path*",
    "/api/orders/:path*",
    "/api/dishes/:path*",
    "/api/kitchen/:path*",
  ],
};