import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "../../../lib/auth";

/** Sign out: drop the session cookie. */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
