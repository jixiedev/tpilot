"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/lead", label: "Lead", hint: "Answers, plans and delegates" },
  { href: "/databot", label: "Databot", hint: "Staged data retrieval with gates" },
];

/** Switch between the two front agents; each page has its own agent and threads. */
export function AppNav() {
  const pathname = usePathname();
  return (
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
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
