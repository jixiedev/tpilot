/**
 * Server-side login helpers (route handlers and proxy.ts only; never imported by
 * client components).
 *
 * The backend checks the password against LDAP and returns a signed session
 * token (`tahoepilot/server/auth.py`). It is kept in an httpOnly cookie, so page scripts
 * cannot read it, and turned into `Authorization: Bearer <token>` on every call
 * to the backend. The backend verifies the token; nothing here does.
 */

export const SESSION_COOKIE = "tp_session";

/** `[auth].enabled` in server.toml, exported by `python -m tahoepilot.settings.server_config`. */
export function authEnabled(): boolean {
  return (process.env.TAHOEPILOT_AUTH_ENABLED || "").toLowerCase() === "true";
}

/** AG-UI base URL; each agent is served at `${AGUI_BACKEND_URL}/<agent>`. */
export const AGUI_BACKEND_URL = (
  process.env.AGUI_BACKEND_URL || "http://localhost:8000/agui"
).replace(/\/+$/, "");

/** The session token from a request's Cookie header, or "". */
export function sessionToken(request: Request): string {
  const header = request.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === SESSION_COOKIE) return decodeURIComponent(rest.join("="));
  }
  return "";
}

/** Headers that carry the visitor's session to the backend. */
export function backendAuthHeaders(request: Request): Record<string, string> {
  const token = sessionToken(request);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Whether the browser reached us over HTTPS (directly or via a TLS-terminating ingress). */
export function isHttps(request: Request): boolean {
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded) return forwarded.split(",")[0].trim() === "https";
  return new URL(request.url).protocol === "https:";
}
