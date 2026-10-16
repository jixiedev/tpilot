"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { CopilotKit } from "@copilotkit/react-core/v2";

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
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <span className={"databot-switch" + (dark ? " is-on" : "")} aria-hidden="true" />
      <span>{dark ? "Dark" : "Light"}</span>
    </button>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="databot" useSingleEndpoint={false}>
      <ColorSchemeProvider>{children}</ColorSchemeProvider>
    </CopilotKit>
  );
}
