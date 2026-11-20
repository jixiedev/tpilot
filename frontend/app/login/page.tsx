"use client";

import { useState } from "react";
import { ArrowRightIcon, LockIcon, TahoeMark, UserIcon } from "../components/icons";

/** Only same-site paths are followed after login (no open redirect). */
function nextPath(): string {
  const next = new URLSearchParams(window.location.search).get("next") || "/";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

/**
 * Sign in with the company directory (LDAP). The password is checked by the
 * backend and not stored; only the username is kept as the identity.
 */
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        setError(payload.error || "Sign-in failed.");
        setPassword("");
        return;
      }
      // Full navigation so every route sees the new cookie.
      window.location.assign(nextPath());
    } catch {
      setError("The server could not be reached. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="login">
      <form className="login-card" onSubmit={submit} data-testid="login-form">
        <header className="login-head">
          <TahoeMark size={48} />
          <div>
            <h1>Sign in to TahoePilot</h1>
            <p>Use your company account.</p>
          </div>
        </header>

        <label className="login-field">
          <span>Username</span>
          <span className="login-input">
            <UserIcon size={16} />
            <input
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
          </span>
        </label>
        <label className="login-field">
          <span>Password</span>
          <span className="login-input">
            <LockIcon size={16} />
            <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
          </span>
        </label>

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="login-submit" disabled={pending || !username.trim() || !password}>
          {pending ? "Signing in…" : (
            <>
              Sign in <ArrowRightIcon size={16} strokeWidth={2.2} />
            </>
          )}
        </button>
      </form>
    </main>
  );
}
