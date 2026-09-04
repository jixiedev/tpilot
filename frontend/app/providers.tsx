"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useSyncExternalStore,
} from "react";
import { CopilotKit } from "@copilotkit/react-core/v2";

export const COLOR_SCHEME_STORAGE_KEY = "tahoepilot-color-scheme";

export type ColorScheme = "light" | "dark";

type ColorSchemeContextValue = {
  theme: ColorScheme;
  setTheme: (theme: ColorScheme) => void;
};

const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(null);

/** Fired when this tab changes the stored preference, so every store re-reads. */
const COLOR_SCHEME_EVENT = "tahoepilot-color-scheme-change";

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

/** The effective theme: the explicit choice wins, otherwise follow the OS. */
function currentTheme(): ColorScheme {
  return readStoredTheme() ?? systemTheme();
}

function applyTheme(theme: ColorScheme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

function subscribeToColorScheme(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  // An explicit choice pins the theme; only follow the OS while unset.
  const onMediaChange = () => {
    if (!readStoredTheme()) onChange();
  };
  media.addEventListener("change", onMediaChange);
  window.addEventListener(COLOR_SCHEME_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onMediaChange);
    window.removeEventListener(COLOR_SCHEME_EVENT, onChange);
  };
}

export function useColorScheme(): ColorSchemeContextValue {
  const value = useContext(ColorSchemeContext);
  if (!value) {
    throw new Error("useColorScheme must be used within Providers");
  }
  return value;
}

function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  // The theme lives in localStorage + the OS preference — external state.
  // Reading it through useSyncExternalStore keeps React in sync without a
  // "setState inside an effect" cascade, and gives us a correct server
  // snapshot for hydration.
  const theme = useSyncExternalStore(
    subscribeToColorScheme,
    currentTheme,
    () => "light" as ColorScheme,
  );

  // Paint the resolved theme onto <html> before the browser paints.
  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((next: ColorScheme) => {
    try {
      localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, next);
    } catch {
      // Private mode can reject storage; the class still updates this visit.
    }
    applyTheme(next);
    window.dispatchEvent(new Event(COLOR_SCHEME_EVENT));
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
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      agent="databot"
      useSingleEndpoint={false}
      enableInspector={false}
    >
      <ColorSchemeProvider>{children}</ColorSchemeProvider>
    </CopilotKit>
  );
}
