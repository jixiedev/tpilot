"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { CopilotKit } from "@copilotkit/react-core/v2";
import { usePathname } from "next/navigation";
import { MoonIcon, SunIcon } from "./components/icons";

export const COLOR_SCHEME_STORAGE_KEY = "tahoepilot-color-scheme";

export type ColorScheme = "light" | "dark";

type ColorSchemeContextValue = {
  theme: ColorScheme;
  setTheme: (theme: ColorScheme) => void;
};

const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(null);

function readStoredTheme(): ColorScheme | null {
  try {
    const stored = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function systemTheme(): ColorScheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: ColorScheme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function useColorScheme(): ColorSchemeContextValue {
  const value = useContext(ColorSchemeContext);
  if (!value) {
    throw new Error("useColorScheme must be used within Providers");
  }
  return value;
}

function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ColorScheme>("light");

  useLayoutEffect(() => {
    const stored = readStoredTheme();
    const next = stored ?? systemTheme();
    applyTheme(next);
    setThemeState(next);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readStoredTheme()) return;
      const system = media.matches ? "dark" : "light";
      applyTheme(system);
      setThemeState(system);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: ColorScheme) => {
    try {
      localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, next);
    } catch {
      // Private mode can reject storage; the class still updates this visit.
    }
    applyTheme(next);
    setThemeState(next);
  }, []);

  return (
    <ColorSchemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

export function ColorSchemeToggle() {
  const { theme, setTheme } = useColorScheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      className="databot-theme-toggle"
      role="switch"
      aria-checked={dark}
      data-testid="theme-toggle"
      aria-label="Dark mode"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <SunIcon size={13} className="theme-toggle-sun" />
        <MoonIcon size={13} className="theme-toggle-moon" />
        <span className="theme-toggle-knob">{dark ? <MoonIcon size={12} strokeWidth={2.2} /> : <SunIcon size={12} strokeWidth={2.2} />}</span>
      </span>
    </button>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  // The login page talks to no agent; without CopilotKit it also skips the
  // runtime-info request, which fails (401) before sign-in.
  if (usePathname() === "/login") {
    return <ColorSchemeProvider>{children}</ColorSchemeProvider>;
  }
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" useSingleEndpoint={false}>
      <ColorSchemeProvider>{children}</ColorSchemeProvider>
    </CopilotKit>
  );
}
