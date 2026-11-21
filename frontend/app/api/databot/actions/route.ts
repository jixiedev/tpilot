import { NextRequest, NextResponse } from "next/server";
import { AGUI_BACKEND_URL, backendAuthHeaders } from "../../../lib/auth";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const upstream = await fetch(`${AGUI_BACKEND_URL}/databot/actions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...backendAuthHeaders(request) },
    body: JSON.stringify(body),
  });

  const text = await upstream.text();
  let payload: unknown = {};
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { error: text };
    }
  }

  return NextResponse.json(payload, { status: upstream.status });
}
