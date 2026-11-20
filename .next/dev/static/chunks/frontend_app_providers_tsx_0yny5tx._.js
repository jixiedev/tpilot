(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COLOR_SCHEME_STORAGE_KEY",
    ()=>COLOR_SCHEME_STORAGE_KEY,
    "ColorSchemeToggle",
    ()=>ColorSchemeToggle,
    "Providers",
    ()=>Providers,
    "useColorScheme",
    ()=>useColorScheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__t__as__CopilotKit$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/react-core/dist/copilotkit-BmW2sFH6.mjs [app-client] (ecmascript) <locals> <export t as CopilotKit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
;
;
const COLOR_SCHEME_STORAGE_KEY = "tahoepilot-color-scheme";
const ColorSchemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function readStoredTheme() {
    try {
        const stored = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
        return stored === "light" || stored === "dark" ? stored : null;
    } catch  {
        return null;
    }
}
function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyTheme(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
}
function useColorScheme() {
    _s();
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ColorSchemeContext);
    if (!value) {
        throw new Error("useColorScheme must be used within Providers");
    }
    return value;
}
_s(useColorScheme, "ksutO2/Ix3UeCrGnhyM+QEP505Y=");
function ColorSchemeProvider({ children }) {
    _s1();
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("light");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "ColorSchemeProvider.useLayoutEffect": ()=>{
            const stored = readStoredTheme();
            const next = stored ?? systemTheme();
            applyTheme(next);
            setThemeState(next);
            const media = window.matchMedia("(prefers-color-scheme: dark)");
            const onChange = {
                "ColorSchemeProvider.useLayoutEffect.onChange": ()=>{
                    if (readStoredTheme()) return;
                    const system = media.matches ? "dark" : "light";
                    applyTheme(system);
                    setThemeState(system);
                }
            }["ColorSchemeProvider.useLayoutEffect.onChange"];
            media.addEventListener("change", onChange);
            return ({
                "ColorSchemeProvider.useLayoutEffect": ()=>media.removeEventListener("change", onChange)
            })["ColorSchemeProvider.useLayoutEffect"];
        }
    }["ColorSchemeProvider.useLayoutEffect"], []);
    const setTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ColorSchemeProvider.useCallback[setTheme]": (next)=>{
            try {
                localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, next);
            } catch  {
            // Private mode can reject storage; the class still updates this visit.
            }
            applyTheme(next);
            setThemeState(next);
        }
    }["ColorSchemeProvider.useCallback[setTheme]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorSchemeContext.Provider, {
        value: {
            theme,
            setTheme
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/app/providers.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
_s1(ColorSchemeProvider, "ziV2h90sW/WqbN0h/nTwOrAjkS8=");
_c = ColorSchemeProvider;
function ColorSchemeToggle() {
    _s2();
    const { theme, setTheme } = useColorScheme();
    const dark = theme === "dark";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: "databot-theme-toggle",
        role: "switch",
        "aria-checked": dark,
        "data-testid": "theme-toggle",
        onClick: ()=>setTheme(dark ? "light" : "dark"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "databot-switch" + (dark ? " is-on" : ""),
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/frontend/app/providers.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: dark ? "Dark" : "Light"
            }, void 0, false, {
                fileName: "[project]/frontend/app/providers.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/providers.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
_s2(ColorSchemeToggle, "URnCQVYB4hHJBJ988noYRAWpLH8=", false, function() {
    return [
        useColorScheme
    ];
});
_c1 = ColorSchemeToggle;
function Providers({ children }) {
    _s3();
    // The login page talks to no agent; without CopilotKit it also skips the
    // runtime-info request, which fails (401) before sign-in.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])() === "/login") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorSchemeProvider, {
            children: children
        }, void 0, false, {
            fileName: "[project]/frontend/app/providers.tsx",
            lineNumber: 109,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__t__as__CopilotKit$3e$__["CopilotKit"], {
        runtimeUrl: "/api/copilotkit",
        useSingleEndpoint: false,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorSchemeProvider, {
            children: children
        }, void 0, false, {
            fileName: "[project]/frontend/app/providers.tsx",
            lineNumber: 113,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/providers.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, this);
}
_s3(Providers, "wVXOWZKWdId76kQQO0KX6Oz3JDA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c2 = Providers;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ColorSchemeProvider");
__turbopack_context__.k.register(_c1, "ColorSchemeToggle");
__turbopack_context__.k.register(_c2, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_app_providers_tsx_0yny5tx._.js.map