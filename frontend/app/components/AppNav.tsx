"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AgentIcon, LogOutIcon, UserIcon } from "./icons";

const LINKS = [
  { href: "/lead", id: "lead", label: "Lead", hint: "Answers, plans and delegates" },
  { href: "/databot", id: "databot", label: "Databot", hint: "Staged data retrieval with gates" },
];

/** Switch between the two front agents; each page has its own agent and threads. */
export function AppNav() {
  const pathname = usePathname();
  return (
    <>
      <nav className="app-nav" aria-label="Agents">
        {LINKS.map((link) => {
          const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={"app-nav-link" + (active ? " is-active" : "")}
              aria-current={active ? "page" : undefined}
              title={link.hint}
            >
              <AgentIcon name={link.id} size={15} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <SignedInUser />
    </>
  );
}

/** "alice · Sign out" when login is on; nothing otherwise. */
function SignedInUser() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as { user?: string | null; auth?: boolean };
        if (cancelled) return;
        if (response.status === 401 && payload.auth) {
          // Token expired or revoked: sign in again. A full load drops the
          // previous session's in-memory chat state.
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname)}`);
          return;
        }
        setUser(payload.user ?? null);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (!user) return null;

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    // Full load: drop the signed-out user's in-memory chat state.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/login");
  }

  return (
    <span className="app-user" data-testid="signed-in-user">
      <span className="app-user-avatar" aria-hidden="true">
        <UserIcon size={14} />
      </span>
      <strong>{user}</strong>
      <button type="button" onClick={signOut} title="Sign out">
        <LogOutIcon size={14} />
        <span>Sign out</span>
      </button>
    </span>
  );
}
