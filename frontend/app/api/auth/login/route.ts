import { NextRequest, NextResponse } from "next/server";
import { AGUI_BACKEND_URL, SESSION_COOKIE, isHttps } from "../../../lib/auth";

/**
 * Sign in: the backend checks the password against LDAP and returns a signed
 * token for the username. The token goes into an httpOnly cookie; the password
 * is not kept anywhere.
 */
export async function POST(request: NextRequest) {
  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!username || !password) {
    return NextResponse.json({ error: "Enter your username and password." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${AGUI_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "The server could not be reached. Try again." }, { status: 502 });
  }

  const payload = (await upstream.json().catch(() => ({}))) as {
    user?: string;
    token?: string;
    expires_at?: number;
    detail?: string;
  };
  if (!upstream.ok || !payload.token) {
    const error =
      upstream.status === 401
        ? "Wrong username or password."
        : payload.detail || `Sign-in failed (HTTP ${upstream.status}).`;
    return NextResponse.json({ error }, { status: upstream.status === 401 ? 401 : 502 });
  }

  const response = NextResponse.json({ user: payload.user });
  const maxAge = payload.expires_at
    ? Math.max(0, payload.expires_at - Math.floor(Date.now() / 1000))
    : undefined;
  response.cookies.set(SESSION_COOKIE, payload.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps(request),
    path: "/",
    maxAge,
  });
  return response;
}
