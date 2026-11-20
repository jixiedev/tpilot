import { NextRequest, NextResponse } from "next/server";
import { AGUI_BACKEND_URL, authEnabled, backendAuthHeaders } from "../../../lib/auth";

/** `{user, auth}`: the signed-in username as the backend sees it. */
export async function GET(request: NextRequest) {
  if (!authEnabled()) return NextResponse.json({ user: null, auth: false });
  try {
    const upstream = await fetch(`${AGUI_BACKEND_URL}/auth/me`, {
      headers: backendAuthHeaders(request),
      cache: "no-store",
    });
    if (!upstream.ok) return NextResponse.json({ user: null, auth: true }, { status: upstream.status });
    return NextResponse.json(await upstream.json());
  } catch {
    return NextResponse.json({ user: null, auth: true }, { status: 502 });
  }
}
