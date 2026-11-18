import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route protection for the three role portals.
 *
 * The `token` cookie is a JWT issued by the API. The signature is verified
 * by the API on every request and by the role layouts (via /api/auth/me);
 * this proxy only decodes the (unsigned) payload to route users, so nobody
 * lands on a portal their session can't use. The API remains the security
 * boundary — a forged cookie would reach an empty screen but no data.
 */

type Portal = { prefix: string; login: string; home: string; role: string };

const PORTALS: Portal[] = [
  { prefix: "/student", login: "/student/login", home: "/student/home", role: "student" },
  { prefix: "/university-admin", login: "/university-admin/login", home: "/university-admin/dashboard", role: "university-admin" },
  { prefix: "/super-admin", login: "/super-admin/login", home: "/super-admin/dashboard", role: "super-admin" },
];

const PUBLIC_PATHS = new Set([
  "/student/login",
  "/student/verify",
  "/university-admin/login",
  "/university-admin/register",
  "/super-admin/login",
]);

/**
 * Decode the session JWT payload without verifying the signature (the API
 * re-verifies on every request; this proxy only routes). An expired or
 * malformed token is treated as signed out, so a stale browser cookie can
 * never bounce a logged-out user back into a portal dashboard.
 */
function sessionRole(token: string | undefined): string | null {
  if (!token) return null;
  try {
    const part = token.split(".");
    if (part.length !== 3) return null;
    const base64 = part[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(base64)) as { role?: unknown; exp?: unknown };
    if (typeof json.exp === "number" && json.exp * 1000 <= Date.now()) {
      return null; // Expired — behave as logged out.
    }
    return typeof json.role === "string" ? json.role : null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const portal = PORTALS.find((p) => pathname.startsWith(p.prefix));
  if (!portal) {
    return NextResponse.next();
  }

  const role = sessionRole(request.cookies.get("token")?.value);

  if (PUBLIC_PATHS.has(pathname)) {
    // Already signed in with the matching role? Skip the login screen.
    if (role === portal.role) {
      return NextResponse.redirect(new URL(portal.home, request.url));
    }
    return NextResponse.next();
  }

  if (role === portal.role) {
    return NextResponse.next();
  }

  if (role) {
    // Signed in, but for a different portal — send them to their own.
    const own = PORTALS.find((p) => p.role === role);
    if (own) {
      return NextResponse.redirect(new URL(own.home, request.url));
    }
  }

  return NextResponse.redirect(new URL(portal.login, request.url));
}

export const config = {
  matcher: ["/student/:path*", "/university-admin/:path*", "/super-admin/:path*"],
};
