import { NextRequest, NextResponse } from "next/server";

const AGUI_BACKEND_URL =
  process.env.AGUI_BACKEND_URL || "http://localhost:8000/agui";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const upstream = await fetch(`${AGUI_BACKEND_URL}/actions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
