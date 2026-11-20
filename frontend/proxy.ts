import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, authEnabled } from "./app/lib/auth";

/**
 * With login on (`[auth].enabled` in server.toml), visitors without a session
 * cookie are sent to /login, and API calls get 401. This only checks that the
 * cookie exists; the backend verifies the token on every request.
 */
export function proxy(request: NextRequest) {
  if (!authEnabled() || request.cookies.get(SESSION_COOKIE)?.value) {
    return NextResponse.next();
  }
  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }
  const login = new URL("/login", request.url);
  if (pathname !== "/") login.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(login);
}

export const config = {
  // Everything except the login page, the login API, Next.js assets and public files.
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|svg|jpg|ico|webp)$).*)"],
};
