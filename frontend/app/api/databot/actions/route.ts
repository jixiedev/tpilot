import { NextRequest, NextResponse } from "next/server";

// ``127.0.0.1`` rather than ``localhost``: on hosts where ``localhost``
// resolves to ``::1`` first, anything already bound to the IPv6 loopback
// port (a ``kubectl port-forward``, for example) would swallow the request
// and answer with an HTML page instead of JSON.
const AGUI_BACKEND_URL =
  process.env.AGUI_BACKEND_URL || "http://127.0.0.1:8000/agui";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  // The upstream may be down, slow or return a non-JSON error page. Without
  // this guard Next would answer with its own HTML 500 page and the client
  // would blow up on `response.json()` with a confusing parse error.
  let upstream: Response;
  try {
    upstream = await fetch(`${AGUI_BACKEND_URL}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json(
      { error: "agent backend is unreachable" },
      { status: 502 },
    );
  }

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
