(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/app/components/AppNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppNav",
    ()=>AppNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/icons.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const LINKS = [
    {
        href: "/lead",
        id: "lead",
        label: "Lead",
        hint: "Answers, plans and delegates"
    },
    {
        href: "/databot",
        id: "databot",
        label: "Databot",
        hint: "Staged data retrieval with gates"
    }
];
function AppNav() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "app-nav",
                "aria-label": "Agents",
                children: LINKS.map((link)=>{
                    const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: link.href,
                        className: "app-nav-link" + (active ? " is-active" : ""),
                        "aria-current": active ? "page" : undefined,
                        title: link.hint,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AgentIcon"], {
                                name: link.id,
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/AppNav.tsx",
                                lineNumber: 29,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: link.label
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/AppNav.tsx",
                                lineNumber: 30,
                                columnNumber: 15
                            }, this)
                        ]
                    }, link.href, true, {
                        fileName: "[project]/frontend/app/components/AppNav.tsx",
                        lineNumber: 22,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/AppNav.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SignedInUser, {}, void 0, false, {
                fileName: "[project]/frontend/app/components/AppNav.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/components/AppNav.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_s(AppNav, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AppNav;
/** "alice · Sign out" when login is on; nothing otherwise. */ function SignedInUser() {
    _s1();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SignedInUser.useEffect": ()=>{
            let cancelled = false;
            fetch("/api/auth/me", {
                cache: "no-store"
            }).then({
                "SignedInUser.useEffect": async (response)=>{
                    const payload = await response.json().catch({
                        "SignedInUser.useEffect": ()=>({})
                    }["SignedInUser.useEffect"]);
                    if (cancelled) return;
                    if (response.status === 401 && payload.auth) {
                        // Token expired or revoked: sign in again. A full load drops the
                        // previous session's in-memory chat state.
                        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
                        window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname)}`);
                        return;
                    }
                    setUser(payload.user ?? null);
                }
            }["SignedInUser.useEffect"]).catch({
                "SignedInUser.useEffect": ()=>undefined
            }["SignedInUser.useEffect"]);
            return ({
                "SignedInUser.useEffect": ()=>{
                    cancelled = true;
                }
            })["SignedInUser.useEffect"];
        }
    }["SignedInUser.useEffect"], []);
    if (!user) return null;
    async function signOut() {
        await fetch("/api/auth/logout", {
            method: "POST"
        }).catch(()=>undefined);
        // Full load: drop the signed-out user's in-memory chat state.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign("/login");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "app-user",
        "data-testid": "signed-in-user",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "app-user-avatar",
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserIcon"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/frontend/app/components/AppNav.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/AppNav.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                children: user
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/AppNav.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: signOut,
                title: "Sign out",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LogOutIcon"], {
                        size: 14
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/AppNav.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Sign out"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/AppNav.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/AppNav.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/components/AppNav.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
_s1(SignedInUser, "5s2qRsV95gTJBmaaTh11GoxYeGE=");
_c1 = SignedInUser;
var _c, _c1;
__turbopack_context__.k.register(_c, "AppNav");
__turbopack_context__.k.register(_c1, "SignedInUser");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/DatabotAssistantMessage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DatabotAssistantMessage",
    ()=>DatabotAssistantMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__B__as__CopilotChatAssistantMessage$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/react-core/dist/copilotkit-BmW2sFH6.mjs [app-client] (ecmascript) <locals> <export B as CopilotChatAssistantMessage>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$databotChatUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/databotChatUtils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$FoldSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/FoldSection.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
function DatabotAssistantMessage(props) {
    const hasToolCalls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$databotChatUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assistantMessageHasToolCalls"])(props.message);
    const rawContent = (props.message.content || "").trim();
    const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$databotChatUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripThinkBlocks"])(rawContent);
    const think = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$databotChatUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractThinkText"])(rawContent);
    const isLatest = props.messages?.[props.messages.length - 1]?.id === props.message.id;
    const streaming = Boolean(props.isRunning && isLatest);
    // Narration: internal monologue, or long prose written alongside tool calls.
    const isNarration = content.length > 0 && ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$databotChatUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHiddenAssistantNarration"])(rawContent) || hasToolCalls && content.length > 200);
    const reply = isNarration ? "" : content;
    const thinkingFold = think.text ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$FoldSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FoldSection"], {
        label: think.open && streaming ? "Thinking…" : "Thinking",
        active: think.open && streaming,
        className: "fold-section--thinking",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fold-section-text",
            children: think.text
        }, void 0, false, {
            fileName: "[project]/frontend/app/components/DatabotAssistantMessage.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/components/DatabotAssistantMessage.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this) : null;
    const narrationFold = isNarration ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$FoldSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FoldSection"], {
        label: "Reasoning",
        className: "fold-section--reasoning",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fold-section-text",
            children: content
        }, void 0, false, {
            fileName: "[project]/frontend/app/components/DatabotAssistantMessage.tsx",
            lineNumber: 44,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/components/DatabotAssistantMessage.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this) : null;
    if (!hasToolCalls && !reply) {
        if (!thinkingFold && !narrationFold) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "databot-assistant-folds",
            children: [
                thinkingFold,
                narrationFold
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/app/components/DatabotAssistantMessage.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "databot-assistant-folds",
        children: [
            thinkingFold,
            narrationFold,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__B__as__CopilotChatAssistantMessage$3e$__["CopilotChatAssistantMessage"], {
                ...props,
                message: {
                    ...props.message,
                    content: reply
                },
                inspectorButton: ()=>null,
                toolbarVisible: false,
                markdownRenderer: reply ? undefined : ()=>null
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/DatabotAssistantMessage.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/components/DatabotAssistantMessage.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_c = DatabotAssistantMessage;
var _c;
__turbopack_context__.k.register(_c, "DatabotAssistantMessage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/DatabotNewChatButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DatabotNewChatButton",
    ()=>DatabotNewChatButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__tt__as__useAgent$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/react-core/dist/copilotkit-BmW2sFH6.mjs [app-client] (ecmascript) <locals> <export tt as useAgent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__Mt__as__useCopilotChatConfiguration$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/react-core/dist/copilotkit-BmW2sFH6.mjs [app-client] (ecmascript) <locals> <export Mt as useCopilotChatConfiguration>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$databotClientReset$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/databotClientReset.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$DatabotSessionContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/DatabotSessionContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$databotAgent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/databotAgent.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/icons.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function DatabotNewChatButton({ className, agentId = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$databotAgent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DATABOT_AGENT_ID"], resetAgentView = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$databotClientReset$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resetDatabotAgentView"] }) {
    _s();
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__Mt__as__useCopilotChatConfiguration$3e$__["useCopilotChatConfiguration"])();
    const { agent, isReady } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__tt__as__useAgent$3e$__["useAgent"])({
        agentId
    });
    const { resetSessionUi } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$DatabotSessionContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDatabotSession"])();
    const busy = isReady && agent.isRunning;
    const handleClick = ()=>{
        if (busy) return;
        config?.startNewThread();
        if (isReady) resetAgentView(agent);
        resetSessionUi();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: [
            "databot-new-chat-btn",
            className
        ].filter(Boolean).join(" "),
        onClick: handleClick,
        disabled: busy,
        title: busy ? "Wait for the current run to finish" : "Start a new conversation (new thread)",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlusIcon"], {
                size: 15,
                strokeWidth: 2.4
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/DatabotNewChatButton.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: "New chat"
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/DatabotNewChatButton.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/components/DatabotNewChatButton.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(DatabotNewChatButton, "p3UThXpESF++MmISe9yC3Dataro=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__Mt__as__useCopilotChatConfiguration$3e$__["useCopilotChatConfiguration"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__tt__as__useAgent$3e$__["useAgent"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$DatabotSessionContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDatabotSession"]
    ];
});
_c = DatabotNewChatButton;
var _c;
__turbopack_context__.k.register(_c, "DatabotNewChatButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/DatabotSessionContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DatabotSessionProvider",
    ()=>DatabotSessionProvider,
    "useDatabotSession",
    ()=>useDatabotSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const DatabotSessionContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function DatabotSessionProvider({ children }) {
    _s();
    const [sessionKey, setSessionKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const resetSessionUi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DatabotSessionProvider.useCallback[resetSessionUi]": ()=>{
            setSessionKey({
                "DatabotSessionProvider.useCallback[resetSessionUi]": (key)=>key + 1
            }["DatabotSessionProvider.useCallback[resetSessionUi]"]);
        }
    }["DatabotSessionProvider.useCallback[resetSessionUi]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DatabotSessionContext.Provider, {
        value: {
            sessionKey,
            resetSessionUi
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/app/components/DatabotSessionContext.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(DatabotSessionProvider, "DRAfGKS/yBj96+AMvYgohBbST5Y=");
_c = DatabotSessionProvider;
function useDatabotSession() {
    _s1();
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(DatabotSessionContext);
    if (!value) {
        throw new Error("useDatabotSession requires DatabotSessionProvider");
    }
    return value;
}
_s1(useDatabotSession, "ksutO2/Ix3UeCrGnhyM+QEP505Y=");
var _c;
__turbopack_context__.k.register(_c, "DatabotSessionProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/ExecutionChart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExecutionChart",
    ()=>ExecutionChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/recharts/es6/cartesian/Bar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/recharts/es6/chart/BarChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/recharts/es6/component/Cell.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/recharts/es6/component/Legend.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/recharts/es6/cartesian/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/recharts/es6/chart/LineChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/recharts/es6/polar/Pie.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/recharts/es6/chart/PieChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$executionResultUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/executionResultUtils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const TIME_HINTS = [
    "date",
    "time",
    "ts",
    "timestamp",
    "dt",
    "month",
    "day",
    "year",
    "_at"
];
const COLOR_PALETTE = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#84cc16",
    "#f97316",
    "#a855f7"
];
function isNumeric(v) {
    if (v == null) return false;
    if (typeof v === "number") return Number.isFinite(v);
    if (typeof v === "string") {
        const t = v.trim();
        if (t === "") return false;
        const n = Number(t);
        return Number.isFinite(n);
    }
    return false;
}
function looksLikeTime(name, sample) {
    const lower = name.toLowerCase();
    if (TIME_HINTS.some((h)=>lower.includes(h))) return true;
    if (typeof sample === "string") {
        // ISO date or yyyy-mm-dd
        if (/^\d{4}-\d{2}(-\d{2})?(T.*)?$/.test(sample)) return true;
    }
    return false;
}
function inferShape(columns, rows) {
    const numericKeys = [];
    const timeKeys = [];
    const categoricalKeys = [];
    for (const col of columns){
        const sample = rows[0]?.[col];
        if (isNumeric(sample)) {
            numericKeys.push(col);
        } else if (looksLikeTime(col, sample)) {
            timeKeys.push(col);
        } else {
            categoricalKeys.push(col);
        }
    }
    // Scalar: single row, single numeric column
    if (rows.length === 1 && numericKeys.length === 1 && columns.length <= 2) {
        const valueRaw = rows[0][numericKeys[0]];
        const value = typeof valueRaw === "number" ? valueRaw : Number(valueRaw);
        return {
            kind: "bar",
            xKey: columns.find((c)=>c !== numericKeys[0]) ?? null,
            yKeys: numericKeys,
            numericKeys,
            categoricalKeys,
            timeKeys,
            scalar: {
                value,
                label: numericKeys[0]
            }
        };
    }
    // One row of several values (e.g. a month's totals): a chart of one point
    // per column says nothing, so show the table.
    if (rows.length === 1) {
        return {
            kind: "table",
            xKey: null,
            yKeys: numericKeys,
            numericKeys,
            categoricalKeys,
            timeKeys,
            scalar: null
        };
    }
    // Time series: time key + ≥1 numeric
    if (timeKeys.length >= 1 && numericKeys.length >= 1) {
        return {
            kind: "line",
            xKey: timeKeys[0],
            yKeys: numericKeys,
            numericKeys,
            categoricalKeys,
            timeKeys,
            scalar: null
        };
    }
    // Grouped: ≥1 categorical + ≥1 numeric
    if (categoricalKeys.length >= 1 && numericKeys.length >= 1) {
        return {
            kind: "bar",
            xKey: categoricalKeys[0],
            yKeys: numericKeys,
            numericKeys,
            categoricalKeys,
            timeKeys,
            scalar: null
        };
    }
    // Fallback: table
    return {
        kind: "table",
        xKey: null,
        yKeys: numericKeys,
        numericKeys,
        categoricalKeys,
        timeKeys,
        scalar: null
    };
}
const CHART_KIND_LABEL = {
    bar: "bar",
    line: "line",
    pie: "pie",
    table: "table"
};
function ExecutionChart({ result }) {
    _s();
    const [override, setOverride] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const shape = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ExecutionChart.useMemo[shape]": ()=>{
            if (!result || !result.columns || !result.rows) return null;
            if (result.rows.length === 0) return null;
            return inferShape(result.columns, result.rows);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["ExecutionChart.useMemo[shape]"], [
        result?.columns?.join(","),
        result?.rows?.length,
        result?.error
    ]);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$executionResultUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasExecutionResult"])(result)) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "muted",
            children: "No execution result yet."
        }, void 0, false, {
            fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
            lineNumber: 181,
            columnNumber: 12
        }, this);
    }
    if (!result.ok) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "exec-error",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: "Execution failed"
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                            lineNumber: 188,
                            columnNumber: 11
                        }, this),
                        result.sql && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                " ",
                                "— ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                    className: "exec-sql",
                                    children: truncate(result.sql, 120)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                    lineNumber: 191,
                                    columnNumber: 22
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                            lineNumber: 190,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                    lineNumber: 187,
                    columnNumber: 9
                }, this),
                result.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                    className: "exec-error-msg",
                    children: result.error
                }, void 0, false, {
                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                    lineNumber: 195,
                    columnNumber: 26
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
            lineNumber: 186,
            columnNumber: 7
        }, this);
    }
    if (!shape) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "muted",
            children: "Query returned no rows."
        }, void 0, false, {
            fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
            lineNumber: 201,
            columnNumber: 12
        }, this);
    }
    if (shape.scalar) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "exec-scalar",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "exec-scalar-value",
                    children: formatNumber(shape.scalar.value)
                }, void 0, false, {
                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                    lineNumber: 207,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "exec-scalar-label",
                    children: shape.scalar.label
                }, void 0, false, {
                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                    lineNumber: 208,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
            lineNumber: 206,
            columnNumber: 7
        }, this);
    }
    const allowedKinds = shape.timeKeys.length ? [
        "line",
        "bar",
        "table"
    ] : shape.numericKeys.length === 1 ? [
        "bar",
        "line",
        "pie",
        "table"
    ] : [
        "bar",
        "line",
        "table"
    ];
    const kind = override && allowedKinds.includes(override) ? override : shape.kind;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "exec-chart",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "exec-chart-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "muted",
                        children: [
                            result.row_count,
                            " row",
                            result.row_count === 1 ? "" : "s",
                            result.truncated ? " (truncated)" : ""
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "exec-chart-picker",
                        role: "tablist",
                        children: allowedKinds.map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                role: "tab",
                                "aria-selected": kind === k,
                                className: `btn btn-tab ${kind === k ? "active" : ""}`,
                                onClick: ()=>setOverride(k),
                                children: CHART_KIND_LABEL[k]
                            }, k, false, {
                                fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                lineNumber: 229,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "exec-chart-body",
                children: [
                    kind === "bar" && shape.xKey && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                        width: "100%",
                        height: 320,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                            data: result.rows,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                    strokeDasharray: "3 3",
                                    stroke: "rgba(0,0,0,0.1)"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                    lineNumber: 246,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                    dataKey: shape.xKey
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                    lineNumber: 247,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {}, void 0, false, {
                                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                    lineNumber: 248,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                    lineNumber: 249,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Legend"], {}, void 0, false, {
                                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                    lineNumber: 250,
                                    columnNumber: 15
                                }, this),
                                shape.yKeys.map((y, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                        dataKey: y,
                                        fill: COLOR_PALETTE[i % COLOR_PALETTE.length]
                                    }, y, false, {
                                        fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                        lineNumber: 252,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                            lineNumber: 245,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                        lineNumber: 244,
                        columnNumber: 11
                    }, this),
                    kind === "line" && shape.xKey && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                        width: "100%",
                        height: 320,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LineChart"], {
                            data: result.rows,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                    strokeDasharray: "3 3",
                                    stroke: "rgba(0,0,0,0.1)"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                    lineNumber: 260,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                    dataKey: shape.xKey
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                    lineNumber: 261,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {}, void 0, false, {
                                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                    lineNumber: 262,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                    lineNumber: 263,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Legend"], {}, void 0, false, {
                                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                    lineNumber: 264,
                                    columnNumber: 15
                                }, this),
                                shape.yKeys.map((y, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                                        type: "monotone",
                                        dataKey: y,
                                        stroke: COLOR_PALETTE[i % COLOR_PALETTE.length],
                                        strokeWidth: 2,
                                        dot: false
                                    }, y, false, {
                                        fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                        lineNumber: 266,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                            lineNumber: 259,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                        lineNumber: 258,
                        columnNumber: 11
                    }, this),
                    kind === "pie" && shape.xKey && shape.yKeys.length >= 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                        width: "100%",
                        height: 320,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PieChart"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                    lineNumber: 281,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Legend"], {}, void 0, false, {
                                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                    lineNumber: 282,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Pie"], {
                                    data: result.rows,
                                    dataKey: shape.yKeys[0],
                                    nameKey: shape.xKey,
                                    cx: "50%",
                                    cy: "50%",
                                    outerRadius: 110,
                                    label: true,
                                    children: (result.rows ?? []).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                            fill: COLOR_PALETTE[i % COLOR_PALETTE.length]
                                        }, i, false, {
                                            fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                            lineNumber: 293,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                    lineNumber: 283,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                            lineNumber: 280,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                        lineNumber: 279,
                        columnNumber: 11
                    }, this),
                    kind === "table" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultTable, {
                        result: result
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                        lineNumber: 299,
                        columnNumber: 30
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                lineNumber: 242,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
        lineNumber: 221,
        columnNumber: 5
    }, this);
}
_s(ExecutionChart, "b+LXfDRCyXwuguBvdfu6+7va3Ys=");
_c = ExecutionChart;
function ResultTable({ result }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "result-table-wrap",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            className: "result-table",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                        children: result.columns?.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                children: c
                            }, c, false, {
                                fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                lineNumber: 312,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                        lineNumber: 310,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                    lineNumber: 309,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                    children: result.rows?.map((row, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            children: result.columns?.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    children: formatCell(row[c])
                                }, c, false, {
                                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                                    lineNumber: 320,
                                    columnNumber: 17
                                }, this))
                        }, i, false, {
                            fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                            lineNumber: 318,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
                    lineNumber: 316,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
            lineNumber: 308,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/components/ExecutionChart.tsx",
        lineNumber: 307,
        columnNumber: 5
    }, this);
}
_c1 = ResultTable;
function formatCell(v) {
    if (v == null) return "—";
    if (typeof v === "number") return formatNumber(v);
    return String(v);
}
function formatNumber(n) {
    if (!Number.isFinite(n)) return String(n);
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + "M";
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(2) + "K";
    if (Number.isInteger(n)) return n.toLocaleString();
    return n.toFixed(2);
}
function truncate(s, n) {
    return s.length > n ? s.slice(0, n) + "…" : s;
}
var _c, _c1;
__turbopack_context__.k.register(_c, "ExecutionChart");
__turbopack_context__.k.register(_c1, "ResultTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/FoldSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FoldSection",
    ()=>FoldSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function FoldSection({ label, active = false, className, children }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(active);
    const userToggled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FoldSection.useEffect": ()=>{
            if (!userToggled.current) setOpen(active);
        }
    }["FoldSection.useEffect"], [
        active
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `fold-section${open ? " fold-section--open" : ""} ${className ?? ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "fold-section-header",
                "aria-expanded": open,
                onClick: ()=>{
                    userToggled.current = true;
                    setOpen((prev)=>!prev);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "fold-chevron",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/FoldSection.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/FoldSection.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/FoldSection.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fold-section-body",
                children: children
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/FoldSection.tsx",
                lineNumber: 39,
                columnNumber: 15
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/components/FoldSection.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(FoldSection, "5IoTPv3K4SyCbGPxJ8XFQz7IzhY=");
_c = FoldSection;
var _c;
__turbopack_context__.k.register(_c, "FoldSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/ToolCallCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToolCallCard",
    ()=>ToolCallCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
/** Cards the user must read or act on stay open after the tool completes. */ const STAY_OPEN_VARIANTS = new Set([
    "gate",
    "answer",
    "warning"
]);
function statusLabel(status) {
    if (status === "inProgress") return "Preparing";
    if (status === "executing") return "Running";
    return "Done";
}
function ToolCallCard({ title, subtitle, status, variant = "default", defaultOpen, children }) {
    _s();
    const autoOpen = defaultOpen ?? (status !== "complete" || STAY_OPEN_VARIANTS.has(variant));
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(autoOpen);
    const userToggled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ToolCallCard.useEffect": ()=>{
            if (!userToggled.current) setOpen(autoOpen);
        }
    }["ToolCallCard.useEffect"], [
        autoOpen
    ]);
    const foldable = Boolean(children);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `tool-call-card tool-call-card--${variant} tool-call-card--${status}${open ? "" : " tool-call-card--folded"}`,
        "data-status": status,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "tool-call-card-header",
                "aria-expanded": foldable ? open : undefined,
                disabled: !foldable,
                onClick: ()=>{
                    userToggled.current = true;
                    setOpen((prev)=>!prev);
                },
                children: [
                    foldable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "fold-chevron",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/ToolCallCard.tsx",
                        lineNumber: 70,
                        columnNumber: 21
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "tool-call-card-titles",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "tool-call-card-title",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/ToolCallCard.tsx",
                                lineNumber: 72,
                                columnNumber: 11
                            }, this),
                            subtitle ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "tool-call-card-subtitle",
                                children: subtitle
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/ToolCallCard.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/components/ToolCallCard.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `tool-call-status tool-call-status--${status}`,
                        children: statusLabel(status)
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/ToolCallCard.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/ToolCallCard.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            children && open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "tool-call-card-body",
                children: children
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/ToolCallCard.tsx",
                lineNumber: 81,
                columnNumber: 27
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/components/ToolCallCard.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_s(ToolCallCard, "eRH7iU3BE+DHEI/LcNZ33Z5N1D0=");
_c = ToolCallCard;
var _c;
__turbopack_context__.k.register(_c, "ToolCallCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/databotAgent.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Databot is a front agent with its own page (`/databot`) and AG-UI endpoint
// (`/agui/databot`, see `agui_server.py`). Its state arrives at the top level
// of the agent state: { messages, stage, review_cards, draft_sql, ... }.
__turbopack_context__.s([
    "DATABOT_AGENT_ID",
    ()=>DATABOT_AGENT_ID,
    "databotStateOf",
    ()=>databotStateOf,
    "withDatabotPatch",
    ()=>withDatabotPatch
]);
const DATABOT_AGENT_ID = "databot";
function databotStateOf(state) {
    return state ?? undefined;
}
function withDatabotPatch(state, patch) {
    return {
        ...state ?? {},
        ...patch
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/databotChatUtils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Heuristics for hiding ReAct planning text in the chat sidebar. */ __turbopack_context__.s([
    "assistantMessageHasToolCalls",
    ()=>assistantMessageHasToolCalls,
    "extractThinkText",
    ()=>extractThinkText,
    "isHiddenAssistantNarration",
    ()=>isHiddenAssistantNarration,
    "stripThinkBlocks",
    ()=>stripThinkBlocks
]);
function assistantMessageHasToolCalls(message) {
    return Array.isArray(message.toolCalls) && message.toolCalls.length > 0;
}
function stripThinkBlocks(content) {
    const withoutClosed = content.replace(/<think>[\s\S]*?<\/think>/gi, "");
    const cut = withoutClosed.replace(/<think>[\s\S]*$/i, "");
    return cut.trim();
}
function extractThinkText(content) {
    const parts = [];
    for (const match of content.matchAll(/<think>([\s\S]*?)<\/think>/gi)){
        parts.push(match[1].trim());
    }
    const rest = content.replace(/<think>[\s\S]*?<\/think>/gi, "");
    const unclosed = /<think>([\s\S]*)$/i.exec(rest);
    if (unclosed) parts.push(unclosed[1].trim());
    return {
        text: parts.filter(Boolean).join("\n\n"),
        open: unclosed !== null
    };
}
function isHiddenAssistantNarration(content) {
    // Judge the prose only: a real answer often quotes the SQL it ran in a
    // fenced block (date_trunc, current_date, tool-like names), which made the
    // lead's full GMV answer fold away as "Reasoning".
    const text = stripThinkBlocks(content).replace(/```[\s\S]*?```/g, "").replace(/```[\s\S]*$/, "").trim();
    if (!text) return false;
    const lower = text.toLowerCase();
    const internalOpeners = /^(let me |i need to |i'll |i will |maybe i |actually |actually wait|the user |looking at the|i've validated|i have validated|i validated|i already provided|i should call |wait, |hmm,|so the )/i;
    if (internalOpeners.test(text)) {
        return true;
    }
    if (lower.includes("没有新的") || lower.includes("等你下一条") || lower.includes("等你下一个") || lower.includes("latest message is empty") || lower.includes("no new question") || lower.includes("no actual new question") || lower.includes("system reminder")) {
        return true;
    }
    if (/\bthe user (wants|is asking)\b/i.test(text) || /\bthey asked\b/i.test(text) || /\bmy (task|job) is\b/i.test(text)) {
        return true;
    }
    if (lower.includes("invoke_knowledge") || lower.includes("fetch_related_models") || lower.includes("find_models_metrics") || lower.includes("search_metric_catalog") || lower.includes("commit_cards") || lower.includes("add_card_to_state") || lower.includes("mark_cards_selected") || lower.includes("trino_explain") || lower.includes("propose_sql") || lower.includes("write_gate_reasons") || lower.includes("ok=true") || lower.includes("returned ok") || lower.includes("view in inspector") || lower.includes("[blocked]")) {
        return true;
    }
    if (text.length > 200 && (lower.includes("date_trunc") || lower.includes("current_date") || lower.includes("interval '") || lower.includes("add_months"))) {
        return true;
    }
    if (lower.includes("emit only tool") || lower.includes("take exactly one action")) {
        return true;
    }
    return false;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/databotClientReset.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EMPTY_DATABOT_STATE",
    ()=>EMPTY_DATABOT_STATE,
    "resetDatabotAgentView",
    ()=>resetDatabotAgentView
]);
const EMPTY_DATABOT_STATE = {
    stage: "prepare_cards",
    history_cards: [],
    staging_cards: [],
    committed_cards: [],
    review_cards: [],
    approved_cards: [],
    metric_conflicts: [],
    draft_sql: "",
    approved_sql: "",
    sql_validated: false,
    gate_decisions: [],
    cards_reasons: {},
    cards_selection_summary: "",
    sql_reasons: {},
    dryrun: false,
    halt_reason: "",
    deny_feedback: ""
};
const PRESERVED_AGENT_STATE_KEYS = [
    "tools",
    "copilotkit"
];
function resetDatabotAgentView(agent) {
    const current = agent.state ?? {};
    const preserved = {};
    for (const key of PRESERVED_AGENT_STATE_KEYS){
        if (key in current) preserved[key] = current[key];
    }
    agent.setMessages([]);
    agent.setState({
        ...preserved,
        ...EMPTY_DATABOT_STATE,
        execution_result: undefined
    });
    agent.pendingInterrupts = [];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/executionResultUtils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasExecutionResult",
    ()=>hasExecutionResult
]);
function hasExecutionResult(result) {
    if (!result) return false;
    if (Object.keys(result).length === 0) return false;
    if (result.ok === true || result.ok === false) return true;
    if (result.error) return true;
    if ((result.rows?.length ?? 0) > 0) return true;
    if ((result.columns?.length ?? 0) > 0) return true;
    return false;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/lead/LeadMessageView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LeadMessageView",
    ()=>LeadMessageView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__A__as__CopilotChatMessageView$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/react-core/dist/copilotkit-BmW2sFH6.mjs [app-client] (ecmascript) <locals> <export A as CopilotChatMessageView>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$DatabotAssistantMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/DatabotAssistantMessage.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function LeadMessageView(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__A__as__CopilotChatMessageView$3e$__["CopilotChatMessageView"], {
        ...props,
        assistantMessage: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$DatabotAssistantMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DatabotAssistantMessage"],
        children: ({ messageElements, isRunning, messages, interruptElement })=>{
            const lastMessage = messages[messages.length - 1];
            const showCursor = isRunning && lastMessage?.role !== "reasoning";
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "copilot-message-list",
                className: "copilotKitMessages cpk:flex cpk:flex-col lead-message-list",
                children: [
                    messageElements,
                    interruptElement,
                    showCursor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__A__as__CopilotChatMessageView$3e$__["CopilotChatMessageView"].Cursor, {}, void 0, false, {
                        fileName: "[project]/frontend/app/components/lead/LeadMessageView.tsx",
                        lineNumber: 27,
                        columnNumber: 28
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/lead/LeadMessageView.tsx",
                lineNumber: 21,
                columnNumber: 11
            }, this);
        }
    }, void 0, false, {
        fileName: "[project]/frontend/app/components/lead/LeadMessageView.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = LeadMessageView;
var _c;
__turbopack_context__.k.register(_c, "LeadMessageView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/lead/LeadToolRenderers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LeadToolRenderers",
    ()=>LeadToolRenderers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__rt__as__useDefaultRenderTool$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/react-core/dist/copilotkit-BmW2sFH6.mjs [app-client] (ecmascript) <locals> <export rt as useDefaultRenderTool>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__it__as__useRenderTool$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/react-core/dist/copilotkit-BmW2sFH6.mjs [app-client] (ecmascript) <locals> <export it as useRenderTool>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$ToolCallCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/ToolCallCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/leadState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$toolRenderUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/toolRenderUtils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$StatusPill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/lead/StatusPill.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function DelegateCard({ status, agent, task, step, result }) {
    const parsed = status === "complete" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseDelegateResult"])(result) : null;
    const subtitle = [
        step ? `Step ${step}` : "",
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$toolRenderUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["truncate"])(task ?? "", 140)
    ].filter(Boolean).join(" · ");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$ToolCallCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToolCallCard"], {
        title: `Delegated to ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["agentLabel"])(agent)}`,
        subtitle: subtitle || undefined,
        status: status,
        variant: "default",
        children: status !== "complete" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "tool-call-muted",
            children: [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["agentLabel"])(agent),
                " is working on it…"
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
            lineNumber: 39,
            columnNumber: 9
        }, this) : parsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "lead-delegate-result",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$StatusPill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusPill"], {
                    status: String(parsed.status ?? "done")
                }, void 0, false, {
                    fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
                    lineNumber: 42,
                    columnNumber: 11
                }, this),
                parsed.summary ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "lead-delegate-summary",
                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$toolRenderUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["truncate"])(parsed.summary, 1200)
                }, void 0, false, {
                    fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
                    lineNumber: 43,
                    columnNumber: 29
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
            lineNumber: 41,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
            className: "tool-call-pre",
            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$toolRenderUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["truncate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$toolRenderUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatToolResult"])(result), 800)
        }, void 0, false, {
            fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
            lineNumber: 46,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_c = DelegateCard;
function LeadToolRenderers() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__rt__as__useDefaultRenderTool$3e$__["useDefaultRenderTool"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__it__as__useRenderTool$3e$__["useRenderTool"])({
        name: "delegate",
        parameters: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            agent: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            task: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            step: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional()
        }),
        render: {
            "LeadToolRenderers.useRenderTool": ({ status, parameters, result })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DelegateCard, {
                    status: status,
                    agent: parameters.agent,
                    task: parameters.task,
                    step: parameters.step,
                    result: result
                }, void 0, false, {
                    fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
                    lineNumber: 64,
                    columnNumber: 7
                }, this)
        }["LeadToolRenderers.useRenderTool"]
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__it__as__useRenderTool$3e$__["useRenderTool"])({
        name: "write_plan",
        parameters: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            steps: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional()
        }),
        render: {
            "LeadToolRenderers.useRenderTool": ({ status, parameters })=>{
                const steps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$toolRenderUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asList"])(parameters.steps).filter({
                    "LeadToolRenderers.useRenderTool.steps": (s)=>typeof s === "object" && s !== null && "text" in s
                }["LeadToolRenderers.useRenderTool.steps"]);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$ToolCallCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToolCallCard"], {
                    title: "Plan updated",
                    subtitle: steps.length ? `${steps.length} step(s)` : "Writing the plan",
                    status: status,
                    variant: "default",
                    children: steps.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                        className: "lead-plan-inline",
                        children: steps.map({
                            "LeadToolRenderers.useRenderTool": (step, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: [
                                        step.text,
                                        step.agent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "lead-plan-agent",
                                            children: [
                                                " · ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["agentLabel"])(step.agent)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
                                            lineNumber: 93,
                                            columnNumber: 33
                                        }, this) : null
                                    ]
                                }, `${i}-${step.text}`, true, {
                                    fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
                                    lineNumber: 91,
                                    columnNumber: 17
                                }, this)
                        }["LeadToolRenderers.useRenderTool"])
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
                        lineNumber: 89,
                        columnNumber: 13
                    }, this) : null
                }, void 0, false, {
                    fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this);
            }
        }["LeadToolRenderers.useRenderTool"]
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__it__as__useRenderTool$3e$__["useRenderTool"])({
        name: "request_sql_approval",
        parameters: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            sql: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            explanation: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
        }),
        render: {
            "LeadToolRenderers.useRenderTool": ({ status, parameters, result })=>{
                const text = status === "complete" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$toolRenderUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatToolResult"])(result) : "";
                const outcome = text.startsWith("Approved") ? "Approved" : text.includes("asked for changes") ? "Changes requested" : text.includes("stopped") ? "Stopped" : text.startsWith("Not sent") ? "Not sent" : "";
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$ToolCallCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToolCallCard"], {
                    title: "SQL review",
                    subtitle: outcome || (status === "complete" ? "Reviewed" : "Waiting for your review"),
                    status: status,
                    variant: "sql",
                    children: [
                        parameters.sql ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                            className: "tool-call-pre",
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$toolRenderUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sqlPreview"])(parameters.sql, 600)
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
                            lineNumber: 127,
                            columnNumber: 29
                        }, this) : null,
                        outcome && outcome !== "Approved" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "tool-call-muted",
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$toolRenderUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["truncate"])(text, 300)
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
                            lineNumber: 129,
                            columnNumber: 13
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, this);
            }
        }["LeadToolRenderers.useRenderTool"]
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__it__as__useRenderTool$3e$__["useRenderTool"])({
        name: "run_sql",
        parameters: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            sql: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
        }),
        render: {
            "LeadToolRenderers.useRenderTool": ({ status, parameters, result })=>{
                const text = status === "complete" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$toolRenderUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatToolResult"])(result) : "";
                let subtitle = status === "complete" ? "Done" : "Running the approved query";
                if (text.startsWith("Not run")) subtitle = "Refused: not approved";
                else if (text.startsWith("SQL failed")) subtitle = "Query failed";
                else if (text.startsWith("{")) {
                    try {
                        const parsed = JSON.parse(text.split("\n")[0]);
                        subtitle = `${parsed.row_count ?? 0} row(s) — see Results`;
                    } catch  {
                    /* keep default */ }
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$ToolCallCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToolCallCard"], {
                    title: "Query",
                    subtitle: subtitle,
                    status: status,
                    variant: subtitle.startsWith("Query failed") || subtitle.startsWith("Refused") ? "warning" : "sql",
                    children: [
                        parameters.sql ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                            className: "tool-call-pre",
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$toolRenderUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sqlPreview"])(parameters.sql, 400)
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
                            lineNumber: 159,
                            columnNumber: 29
                        }, this) : null,
                        text.startsWith("SQL failed") || text.startsWith("Not run") ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "tool-call-warning-text",
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$toolRenderUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["truncate"])(text, 400)
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
                            lineNumber: 161,
                            columnNumber: 13
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/components/lead/LeadToolRenderers.tsx",
                    lineNumber: 153,
                    columnNumber: 9
                }, this);
            }
        }["LeadToolRenderers.useRenderTool"]
    });
    return null;
}
_s(LeadToolRenderers, "8WbvDau48dDVq9C7xJMcKphVvsc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__rt__as__useDefaultRenderTool$3e$__["useDefaultRenderTool"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__it__as__useRenderTool$3e$__["useRenderTool"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__it__as__useRenderTool$3e$__["useRenderTool"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__it__as__useRenderTool$3e$__["useRenderTool"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__it__as__useRenderTool$3e$__["useRenderTool"]
    ];
});
_c1 = LeadToolRenderers;
var _c, _c1;
__turbopack_context__.k.register(_c, "DelegateCard");
__turbopack_context__.k.register(_c1, "LeadToolRenderers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/lead/LeadWorkspace.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LeadWorkspace",
    ()=>LeadWorkspace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__tt__as__useAgent$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/react-core/dist/copilotkit-BmW2sFH6.mjs [app-client] (ecmascript) <locals> <export tt as useAgent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$ExecutionChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/ExecutionChart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/leadState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$StatusPill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/lead/StatusPill.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/icons.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function LeadWorkspace() {
    _s();
    const { agent, isReady } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__tt__as__useAgent$3e$__["useAgent"])({
        agentId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEAD_AGENT_ID"]
    });
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["leadStateOf"])(isReady ? agent.state : undefined);
    const running = isReady && agent.isRunning;
    const plan = state.plan ?? [];
    const record = state.work_record ?? [];
    const active = state.active_subagent ?? null;
    const warehouse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warehouseViewOf"])(state);
    // A specialist that is still working has no view yet; its pending
    // `delegate` call names it.
    const working = running ? pendingDelegateAgent(isReady ? agent.messages : []) : undefined;
    const shownName = working ?? active?.name;
    // `paused` comes from the last snapshot; once the user answers and the run
    // resumes it is stale until the next one.
    const paused = Boolean(active?.paused) && !running;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "lead-workspace",
        "data-testid": "lead-workspace",
        "aria-label": "Lead workspace",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PlanPanel, {
                plan: plan,
                running: running
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SpecialistPanel, {
                name: shownName,
                paused: paused,
                warehouse: shownName === active?.name ? warehouse : undefined,
                running: Boolean(working)
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkRecordPanel, {
                record: record
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s(LeadWorkspace, "3TM392TmxUpD/KOaCvxnk/5OTjw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__tt__as__useAgent$3e$__["useAgent"]
    ];
});
_c = LeadWorkspace;
/** Specialist named by the latest `delegate` call that has no result yet. */ function pendingDelegateAgent(messages) {
    const answered = new Set();
    for (const m of messages){
        if (m.role === "tool" && m.toolCallId) answered.add(m.toolCallId);
    }
    for(let i = messages.length - 1; i >= 0; i--){
        const m = messages[i];
        if (m.role !== "assistant" || !m.toolCalls?.length) continue;
        for (const call of m.toolCalls){
            if (call.function?.name !== "delegate" || answered.has(call.id)) continue;
            try {
                const args = JSON.parse(call.function.arguments || "{}");
                if (args.agent) return args.agent;
            } catch  {
            /* arguments still streaming */ }
        }
    }
    return undefined;
}
function Panel({ title, icon, aside, children, testId }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "lead-panel",
        "data-testid": testId,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "lead-panel-head",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: [
                            icon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "lead-panel-icon",
                                children: icon
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                                lineNumber: 98,
                                columnNumber: 19
                            }, this) : null,
                            title
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this),
                    aside
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lead-panel-body",
                children: children
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_c1 = Panel;
function PlanPanel({ plan, running }) {
    const done = plan.filter((s)=>s.status === "done").length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Panel, {
        title: "Plan",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlanIcon"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
            lineNumber: 113,
            columnNumber: 13
        }, this),
        testId: "lead-plan",
        aside: plan.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "lead-panel-meta",
            children: [
                done,
                "/",
                plan.length,
                " done"
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
            lineNumber: 115,
            columnNumber: 28
        }, this) : null,
        children: plan.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "lead-empty",
            children: running ? "No plan for this request — the lead plans only when it needs several steps." : "Multi-step requests get a plan here. Simple questions are answered or delegated directly."
        }, void 0, false, {
            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
            lineNumber: 118,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
            className: "lead-plan",
            children: plan.map((step, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    className: `lead-plan-step lead-plan-step--${step.status}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "lead-plan-index",
                            "aria-hidden": "true",
                            children: step.status === "done" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckIcon"], {
                                size: 12,
                                strokeWidth: 2.6
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                                lineNumber: 128,
                                columnNumber: 43
                            }, this) : i + 1
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                            lineNumber: 127,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lead-plan-text",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: step.text
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                                    lineNumber: 131,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "lead-plan-meta",
                                    children: [
                                        step.agent ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["agentLabel"])(step.agent) : "Lead",
                                        step.added ? " · added" : ""
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                                    lineNumber: 132,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                            lineNumber: 130,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$StatusPill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusPill"], {
                            status: step.status
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                            lineNumber: 137,
                            columnNumber: 15
                        }, this)
                    ]
                }, `${i}-${step.text}`, true, {
                    fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                    lineNumber: 126,
                    columnNumber: 13
                }, this))
        }, void 0, false, {
            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
            lineNumber: 124,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
_c2 = PlanPanel;
function SpecialistPanel({ name, paused, warehouse, running }) {
    _s1();
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("results");
    const status = paused ? "paused" : running && name ? "running" : name ? "done" : "";
    const working = running && !paused;
    if (!name) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Panel, {
            title: "Specialist",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SparkleIcon"], {
                size: 14
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                lineNumber: 165,
                columnNumber: 39
            }, this),
            testId: "lead-specialist",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "lead-empty",
                children: [
                    "When the lead hands work to a specialist, its live work shows here. Data questions go to ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Warehouse"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                        lineNumber: 168,
                        columnNumber: 14
                    }, this),
                    ", which asks you to review every query before it runs."
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                lineNumber: 166,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
            lineNumber: 165,
            columnNumber: 7
        }, this);
    }
    const review = warehouse?.sql_review;
    const execution = warehouse?.execution;
    const tables = warehouse?.tables ?? [];
    const candidates = warehouse?.candidates ?? [];
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asExecutionResult"])(execution);
    const effectiveTab = tab === "results" && !execution ? review ? "sql" : "tables" : tab;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Panel, {
        title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["agentLabel"])(name),
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AgentIcon"], {
            name: name,
            size: 14
        }, void 0, false, {
            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
            lineNumber: 185,
            columnNumber: 13
        }, this),
        testId: "lead-specialist",
        aside: status ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$StatusPill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusPill"], {
            status: status
        }, void 0, false, {
            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
            lineNumber: 187,
            columnNumber: 23
        }, this) : null,
        children: !warehouse ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "lead-empty",
            children: working ? `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["agentLabel"])(name)} is working — its steps stream into the chat.` : `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["agentLabel"])(name)} reports back in the chat.`
        }, void 0, false, {
            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
            lineNumber: 190,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lead-tabs",
                    role: "tablist",
                    children: [
                        "results",
                        "sql",
                        "tables"
                    ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            role: "tab",
                            "aria-selected": effectiveTab === t,
                            className: "lead-tab" + (effectiveTab === t ? " is-active" : ""),
                            onClick: ()=>setTab(t),
                            children: t === "results" ? `Results${execution?.row_count != null ? ` (${execution.row_count})` : ""}` : t === "sql" ? "SQL" : `Tables (${tables.length})`
                        }, t, false, {
                            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                            lineNumber: 199,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                    lineNumber: 197,
                    columnNumber: 11
                }, this),
                effectiveTab === "results" ? execution ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lead-results",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$ExecutionChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExecutionChart"], {
                            result: result
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                            lineNumber: 218,
                            columnNumber: 17
                        }, this),
                        execution.truncated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "lead-note",
                            children: [
                                "Result truncated at ",
                                execution.row_count,
                                " rows."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                            lineNumber: 220,
                            columnNumber: 19
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                    lineNumber: 217,
                    columnNumber: 15
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "lead-empty",
                    children: "No query has run yet."
                }, void 0, false, {
                    fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                    lineNumber: 224,
                    columnNumber: 15
                }, this) : null,
                effectiveTab === "sql" ? review || execution?.sql ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lead-sql",
                    children: [
                        review?.status ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "lead-sql-status",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$StatusPill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusPill"], {
                                    status: reviewPill(review.status, paused)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                                    lineNumber: 232,
                                    columnNumber: 21
                                }, this),
                                review.edited ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "lead-note",
                                    children: " edited by the reviewer"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                                    lineNumber: 233,
                                    columnNumber: 38
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                            lineNumber: 231,
                            columnNumber: 19
                        }, this) : paused ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "lead-sql-status",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$StatusPill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusPill"], {
                                    status: "paused"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                                    lineNumber: 237,
                                    columnNumber: 21
                                }, this),
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "lead-note",
                                    children: "review the SQL in the chat"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                                    lineNumber: 237,
                                    columnNumber: 52
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                            lineNumber: 236,
                            columnNumber: 19
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                            className: "lead-code",
                            children: execution?.sql || review?.sql
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                            lineNumber: 240,
                            columnNumber: 17
                        }, this),
                        review?.explanation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "lead-note",
                            children: review.explanation
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                            lineNumber: 241,
                            columnNumber: 40
                        }, this) : null,
                        review?.comments ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "lead-note",
                            children: [
                                "Reviewer: ",
                                review.comments
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                            lineNumber: 242,
                            columnNumber: 37
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                    lineNumber: 229,
                    columnNumber: 15
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "lead-empty",
                    children: paused ? "Review the SQL in the chat." : "No SQL drafted yet."
                }, void 0, false, {
                    fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                    lineNumber: 245,
                    columnNumber: 15
                }, this) : null,
                effectiveTab === "tables" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        tables.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "lead-tables",
                            children: tables.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                            children: t.name
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                                            lineNumber: 256,
                                            columnNumber: 23
                                        }, this),
                                        t.description ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: t.description
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                                            lineNumber: 257,
                                            columnNumber: 40
                                        }, this) : null
                                    ]
                                }, t.name, true, {
                                    fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                                    lineNumber: 255,
                                    columnNumber: 21
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                            lineNumber: 253,
                            columnNumber: 17
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "lead-empty",
                            children: paused ? "A query is waiting for your review — its tables are listed on the card in the chat." : review || execution ? "The SQL reads no named table." : "No SQL yet — tables appear once a query is drafted."
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                            lineNumber: 262,
                            columnNumber: 17
                        }, this),
                        candidates.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CandidateList, {
                            names: candidates
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                            lineNumber: 270,
                            columnNumber: 36
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                    lineNumber: 251,
                    columnNumber: 13
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
            lineNumber: 196,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
        lineNumber: 183,
        columnNumber: 5
    }, this);
}
_s1(SpecialistPanel, "U3BoPPUgET6luNK2GuldcTYQksI=");
_c3 = SpecialistPanel;
function CandidateList({ names }) {
    _s2();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "lead-candidates",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "fold-section-header",
                "aria-expanded": open,
                onClick: ()=>setOpen((v)=>!v),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "fold-chevron",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                        lineNumber: 289,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "Also found by search, not used (",
                            names.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                        lineNumber: 290,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                lineNumber: 283,
                columnNumber: 7
            }, this),
            open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "lead-chip-row",
                children: names.map((name)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "lead-chip lead-chip--table",
                        children: name
                    }, name, false, {
                        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                        lineNumber: 295,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                lineNumber: 293,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
        lineNumber: 282,
        columnNumber: 5
    }, this);
}
_s2(CandidateList, "xG1TONbKtDWtdOTrXaTAsNhPg/Q=");
_c4 = CandidateList;
function reviewPill(status, paused) {
    if (status === "approved") return "done";
    if (status === "stopped") return "halted";
    if (status === "revise") return paused ? "paused" : "pending";
    return status;
}
function WorkRecordPanel({ record }) {
    const items = [
        ...record
    ].reverse();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Panel, {
        title: "Work record",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HistoryIcon"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
            lineNumber: 317,
            columnNumber: 13
        }, this),
        testId: "lead-work-record",
        aside: record.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "lead-panel-meta",
            children: record.length
        }, void 0, false, {
            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
            lineNumber: 319,
            columnNumber: 30
        }, this) : null,
        children: items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "lead-empty",
            children: "Specialist results in this conversation are listed here, newest first."
        }, void 0, false, {
            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
            lineNumber: 322,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
            className: "lead-record",
            children: items.map((entry, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkRecordItem, {
                    entry: entry
                }, `${record.length - i}`, false, {
                    fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                    lineNumber: 326,
                    columnNumber: 13
                }, this))
        }, void 0, false, {
            fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
            lineNumber: 324,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
        lineNumber: 315,
        columnNumber: 5
    }, this);
}
_c5 = WorkRecordPanel;
function WorkRecordItem({ entry }) {
    _s3();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const sql = typeof entry.artifacts?.sql === "string" ? entry.artifacts.sql : "";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: "lead-record-item",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "lead-record-head",
                "aria-expanded": open,
                onClick: ()=>setOpen((v)=>!v),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "fold-chevron",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                        lineNumber: 345,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "lead-record-agent",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AgentIcon"], {
                                name: entry.agent,
                                size: 13
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                                lineNumber: 347,
                                columnNumber: 11
                            }, this),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["agentLabel"])(entry.agent)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                        lineNumber: 346,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "lead-record-task",
                        children: entry.task
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                        lineNumber: 350,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$StatusPill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusPill"], {
                        status: String(entry.status)
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                        lineNumber: 351,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                lineNumber: 339,
                columnNumber: 7
            }, this),
            open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lead-record-body",
                children: [
                    entry.turn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "lead-note",
                        children: [
                            "Turn ",
                            entry.turn,
                            entry.step ? ` · step ${entry.step}` : ""
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                        lineNumber: 356,
                        columnNumber: 13
                    }, this) : null,
                    entry.summary ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "lead-record-summary",
                        children: entry.summary
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                        lineNumber: 361,
                        columnNumber: 28
                    }, this) : null,
                    sql ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                        className: "lead-code",
                        children: sql
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                        lineNumber: 362,
                        columnNumber: 18
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
                lineNumber: 354,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/components/lead/LeadWorkspace.tsx",
        lineNumber: 338,
        columnNumber: 5
    }, this);
}
_s3(WorkRecordItem, "xG1TONbKtDWtdOTrXaTAsNhPg/Q=");
_c6 = WorkRecordItem;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "LeadWorkspace");
__turbopack_context__.k.register(_c1, "Panel");
__turbopack_context__.k.register(_c2, "PlanPanel");
__turbopack_context__.k.register(_c3, "SpecialistPanel");
__turbopack_context__.k.register(_c4, "CandidateList");
__turbopack_context__.k.register(_c5, "WorkRecordPanel");
__turbopack_context__.k.register(_c6, "WorkRecordItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/lead/SqlReviewGate.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SqlReviewGate",
    ()=>SqlReviewGate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__Y__as__useInterrupt$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/react-core/dist/copilotkit-BmW2sFH6.mjs [app-client] (ecmascript) <locals> <export Y as useInterrupt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/leadState.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
function SqlReviewGate() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__Y__as__useInterrupt$3e$__["useInterrupt"])({
        agentId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEAD_AGENT_ID"],
        render: {
            "SqlReviewGate.useInterrupt": ({ interrupt, resolve })=>{
                const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseSqlReviewInterrupt"])(interrupt?.message);
                if (!value) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {}, void 0, false, {
                    fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                    lineNumber: 17,
                    columnNumber: 26
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SqlReviewCard, {
                    value: value,
                    onResolve: resolve
                }, value.sql, false, {
                    fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                    lineNumber: 18,
                    columnNumber: 14
                }, this);
            }
        }["SqlReviewGate.useInterrupt"]
    });
    return null;
}
_s(SqlReviewGate, "k3f4e64s/H8KLlbvQPO6melJu7g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__Y__as__useInterrupt$3e$__["useInterrupt"]
    ];
});
_c = SqlReviewGate;
function SqlReviewCard({ value, onResolve }) {
    _s1();
    const [sql, setSql] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(value.sql);
    const [comments, setComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [sent, setSent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SqlReviewCard.useEffect": ()=>setSql(value.sql)
    }["SqlReviewCard.useEffect"], [
        value.sql
    ]);
    const edited = sql.trim() !== value.sql.trim();
    const send = (payload)=>{
        if (sent) return;
        setSent(true);
        onResolve(payload);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "lead-review",
        "data-testid": "lead-sql-review",
        "aria-label": "SQL review",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "lead-review-head",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "lead-review-badge",
                        children: "Review"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Run this SQL against the warehouse?"
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                                lineNumber: 51,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Nothing runs until you approve. Edit the SQL to run your version instead."
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            value.explanation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "lead-review-explain",
                children: value.explanation
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                lineNumber: 56,
                columnNumber: 28
            }, this) : null,
            value.tables && value.tables.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "lead-chip-row",
                "aria-label": "Tables",
                children: value.tables.map((table)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "lead-chip lead-chip--table",
                        children: table
                    }, table, false, {
                        fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                        lineNumber: 60,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                lineNumber: 58,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "lead-review-sql",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "SQL",
                            edited ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                className: "lead-review-edited",
                                children: " · edited"
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                                lineNumber: 69,
                                columnNumber: 24
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: sql,
                        onChange: (e)=>setSql(e.target.value),
                        spellCheck: false,
                        rows: Math.min(14, Math.max(4, sql.split("\n").length + 1)),
                        disabled: sent
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            mode !== "idle" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "lead-review-comments",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: mode === "revise" ? "What should change?" : "Why stop? (optional)"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                        lineNumber: 82,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: comments,
                        onChange: (e)=>setComments(e.target.value),
                        rows: 2,
                        autoFocus: true,
                        disabled: sent,
                        placeholder: mode === "revise" ? "e.g. use the payment date, not the order date" : ""
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                lineNumber: 81,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lead-review-actions",
                children: [
                    mode === "idle" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "lead-btn lead-btn--primary",
                                disabled: sent || !sql.trim(),
                                onClick: ()=>send(edited ? {
                                        decision: "approve",
                                        sql
                                    } : {
                                        decision: "approve"
                                    }),
                                children: edited ? "Approve edited SQL" : "Approve & run"
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "lead-btn",
                                disabled: sent,
                                onClick: ()=>setMode("revise"),
                                children: "Request changes"
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "lead-btn lead-btn--ghost",
                                disabled: sent,
                                onClick: ()=>setMode("stop"),
                                children: "Stop"
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                                lineNumber: 112,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: mode === "stop" ? "lead-btn lead-btn--danger" : "lead-btn lead-btn--primary",
                                disabled: sent || mode === "revise" && !comments.trim(),
                                onClick: ()=>send({
                                        decision: mode,
                                        comments: comments.trim()
                                    }),
                                children: mode === "revise" ? "Send back" : "Stop the query"
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                                lineNumber: 123,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "lead-btn lead-btn--ghost",
                                disabled: sent,
                                onClick: ()=>setMode("idle"),
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                                lineNumber: 131,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this),
                    sent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "lead-review-sent",
                        children: "Sent — resuming…"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                        lineNumber: 136,
                        columnNumber: 17
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/components/lead/SqlReviewGate.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_s1(SqlReviewCard, "qCe+quDhwBUfm2arIEieHteUrBo=");
_c1 = SqlReviewCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "SqlReviewGate");
__turbopack_context__.k.register(_c1, "SqlReviewCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/lead/StatusPill.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatusPill",
    ()=>StatusPill
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
const LABELS = {
    pending: "Pending",
    done: "Done",
    failed: "Failed",
    halted: "Stopped",
    blocked: "Blocked",
    skipped: "Skipped",
    needs_input: "Needs input",
    running: "Running",
    paused: "Waiting for you"
};
function StatusPill({ status }) {
    const key = (status || "pending").toLowerCase();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `lead-pill lead-pill--${key}`,
        "data-status": key,
        children: LABELS[key] ?? key
    }, void 0, false, {
        fileName: "[project]/frontend/app/components/lead/StatusPill.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c = StatusPill;
var _c;
__turbopack_context__.k.register(_c, "StatusPill");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/lead/leadClientReset.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resetLeadAgentView",
    ()=>resetLeadAgentView
]);
const PRESERVED_AGENT_STATE_KEYS = [
    "tools",
    "copilotkit"
];
function resetLeadAgentView(agent) {
    const current = agent.state ?? {};
    const preserved = {};
    for (const key of PRESERVED_AGENT_STATE_KEYS){
        if (key in current) preserved[key] = current[key];
    }
    agent.setMessages([]);
    agent.setState({
        ...preserved,
        plan: [],
        work_record: [],
        active_subagent: null
    });
    agent.pendingInterrupts = [];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/leadState.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// The lead page (`/lead`) talks to the lead agent (`/agui/lead`). Its state:
//
//   { messages, plan, work_record, active_subagent: { name, state, paused? }, ... }
//
// - `plan`: this turn's steps (empty unless the lead planned).
// - `work_record`: every delegation so far, newest last.
// - `active_subagent`: the latest specialist's UI view; `paused` while it waits
//   for the user (the server overlays its live state).
// Keep in sync with `agent/lead/state.py`, `agent/lead/paused.py` and
// `agent/specialists/warehouse/warehouse_agent.py` (`ui_view`).
__turbopack_context__.s([
    "LEAD_AGENT_ID",
    ()=>LEAD_AGENT_ID,
    "WAREHOUSE_SUBAGENT",
    ()=>WAREHOUSE_SUBAGENT,
    "agentLabel",
    ()=>agentLabel,
    "asExecutionResult",
    ()=>asExecutionResult,
    "leadStateOf",
    ()=>leadStateOf,
    "parseDelegateResult",
    ()=>parseDelegateResult,
    "parseSqlReviewInterrupt",
    ()=>parseSqlReviewInterrupt,
    "warehouseViewOf",
    ()=>warehouseViewOf
]);
const LEAD_AGENT_ID = "lead";
const WAREHOUSE_SUBAGENT = "warehouse";
function leadStateOf(state) {
    return state ?? {};
}
function warehouseViewOf(state) {
    const active = leadStateOf(state).active_subagent;
    if (!active || active.name !== WAREHOUSE_SUBAGENT) return undefined;
    return active.state ?? {};
}
function asExecutionResult(execution) {
    if (!execution) return undefined;
    return {
        ...execution,
        ok: !execution.error
    };
}
function parseDelegateResult(result) {
    if (result && typeof result === "object") return result;
    if (typeof result !== "string" || !result.trim().startsWith("{")) return null;
    try {
        return JSON.parse(result);
    } catch  {
        return null;
    }
}
function parseSqlReviewInterrupt(message) {
    let parsed = message;
    if (typeof message === "string") {
        try {
            parsed = JSON.parse(message);
        } catch  {
            return null;
        }
    }
    if (parsed && typeof parsed === "object" && parsed.gate === "warehouse_sql") {
        return parsed;
    }
    return null;
}
function agentLabel(name) {
    const labels = {
        warehouse: "Warehouse",
        knowledge: "Knowledge",
        diagnostic: "Diagnostic",
        data_analysis: "Data analysis",
        swe: "SWE",
        model_selection: "Model selection"
    };
    if (!name) return "Specialist";
    return labels[name] ?? name;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/components/toolRenderUtils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Shared helpers for CopilotKit tool-call renderers. */ __turbopack_context__.s([
    "asList",
    ()=>asList,
    "cardNamesFromUnknown",
    ()=>cardNamesFromUnknown,
    "formatToolResult",
    ()=>formatToolResult,
    "isToolErrorText",
    ()=>isToolErrorText,
    "parseCommitCardsResult",
    ()=>parseCommitCardsResult,
    "parseFetchRelatedModelsResult",
    ()=>parseFetchRelatedModelsResult,
    "parseGlossaryResult",
    ()=>parseGlossaryResult,
    "sqlPreview",
    ()=>sqlPreview,
    "truncate",
    ()=>truncate
]);
function formatToolResult(result) {
    if (result == null) return "";
    if (typeof result === "string") return result;
    try {
        return JSON.stringify(result, null, 2);
    } catch  {
        return String(result);
    }
}
function truncate(text, max) {
    const cleaned = text.trim();
    if (cleaned.length <= max) return cleaned;
    return `${cleaned.slice(0, max - 1)}…`;
}
function cardNamesFromUnknown(cards) {
    if (!Array.isArray(cards)) return [];
    return cards.map((c)=>{
        if (c && typeof c === "object" && "name" in c) {
            return String(c.name ?? "");
        }
        return "";
    }).filter(Boolean);
}
function parseFetchRelatedModelsResult(result) {
    let payload = null;
    if (typeof result === "string") {
        try {
            payload = JSON.parse(result);
        } catch  {
            return null;
        }
    } else if (result && typeof result === "object") {
        payload = result;
    }
    if (!payload) return null;
    const staged = Array.isArray(payload.staged) ? payload.staged : [];
    const names = cardNamesFromUnknown(staged);
    const total = typeof payload.staging_total === "number" ? payload.staging_total : names.length;
    return {
        names,
        count: Math.max(total, names.length),
        message: typeof payload.message === "string" ? payload.message : undefined
    };
}
function sqlPreview(sql, max = 420) {
    return truncate((sql ?? "").replace(/\s+/g, " "), max);
}
function parseCommitCardsResult(result) {
    const resultText = formatToolResult(result).trim();
    if (!resultText) return null;
    const committedMatch = resultText.match(/committed\s+(\d+)\s+card/i);
    const committedCount = committedMatch ? Number(committedMatch[1]) : null;
    let committedNames = [];
    const afterColon = resultText.includes(":") ? resultText.split(":", 2)[1] : "";
    if (afterColon) {
        const namesSegment = afterColon.split(";")[0] ?? "";
        committedNames = namesSegment.split(",").map((name)=>name.trim()).filter(Boolean);
    }
    const issues = [];
    const semicolonIdx = resultText.indexOf("; ");
    if (semicolonIdx >= 0) {
        for (const part of resultText.slice(semicolonIdx + 2).split("; ")){
            const trimmed = part.trim();
            if (trimmed) issues.push(trimmed);
        }
    }
    return {
        committedCount,
        committedNames,
        issues
    };
}
function isToolErrorText(text) {
    const lower = text.toLowerCase();
    return lower.includes("tool error") || lower.includes("connection error") || lower.includes("connection refused") || lower.includes("missing datahub") || lower.includes("traceback");
}
function parseGlossaryResult(result) {
    let payload = null;
    if (typeof result === "string") {
        try {
            payload = JSON.parse(result);
        } catch  {
            return null;
        }
    } else if (result && typeof result === "object") {
        payload = result;
    }
    if (!payload) return null;
    const entities = Array.isArray(payload.entities) ? payload.entities : [];
    const names = entities.map((e)=>{
        if (e && typeof e === "object" && "name" in e) {
            return String(e.name ?? "");
        }
        return "";
    }).filter(Boolean);
    return {
        query: String(payload.query ?? ""),
        total: Number(payload.total ?? names.length ?? 0),
        names,
        rawNote: typeof payload.note === "string" ? payload.note : undefined
    };
}
function asList(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
        try {
            return asList(JSON.parse(value));
        } catch  {
            return [];
        }
    }
    if (value && typeof value === "object") {
        const wrapped = value.item ?? value.items;
        if (wrapped !== undefined) return asList(wrapped);
    }
    return [];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/lead/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LeadPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__D__as__CopilotChat$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/react-core/dist/copilotkit-BmW2sFH6.mjs [app-client] (ecmascript) <locals> <export D as CopilotChat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__jt__as__CopilotChatConfigurationProvider$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/react-core/dist/copilotkit-BmW2sFH6.mjs [app-client] (ecmascript) <locals> <export jt as CopilotChatConfigurationProvider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/providers.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/icons.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$AppNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/AppNav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$DatabotNewChatButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/DatabotNewChatButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$DatabotSessionContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/DatabotSessionContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/leadState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$LeadMessageView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/lead/LeadMessageView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$LeadToolRenderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/lead/LeadToolRenderers.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$LeadWorkspace$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/lead/LeadWorkspace.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$SqlReviewGate$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/lead/SqlReviewGate.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$leadClientReset$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/lead/leadClientReset.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
const SPECIALISTS = [
    {
        id: "warehouse",
        name: "Warehouse",
        text: "data questions, with every query reviewed by you"
    },
    {
        id: "knowledge",
        name: "Knowledge",
        text: "metric definitions, docs, code and Jira"
    },
    {
        id: "diagnostic",
        name: "Diagnostic",
        text: "failing jobs, DAGs and pods"
    },
    {
        id: "data_analysis",
        name: "Data analysis",
        text: "trends, comparisons and charts"
    },
    {
        id: "swe",
        name: "SWE",
        text: "code and config changes"
    }
];
function LeadWorkspaceColumn() {
    _s();
    const { sessionKey } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$DatabotSessionContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDatabotSession"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$LeadWorkspace$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LeadWorkspace"], {}, `workspace-${sessionKey}`, false, {
        fileName: "[project]/frontend/app/lead/page.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
_s(LeadWorkspaceColumn, "a3vXsdRT+Ui3vn9ps3JYZ9EdMZA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$DatabotSessionContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDatabotSession"]
    ];
});
_c = LeadWorkspaceColumn;
function LeadPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__jt__as__CopilotChatConfigurationProvider$3e$__["CopilotChatConfigurationProvider"], {
        agentId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEAD_AGENT_ID"],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$DatabotSessionContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DatabotSessionProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "lead-shell",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "lead-topbar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lead-brand",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TahoeMark"], {
                                        size: 36
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/lead/page.tsx",
                                        lineNumber: 40,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                children: "TahoePilot"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/lead/page.tsx",
                                                lineNumber: 42,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "lead-tagline",
                                                children: "Lead agent · answers, plans and delegates to specialists"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/lead/page.tsx",
                                                lineNumber: 43,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/app/lead/page.tsx",
                                        lineNumber: 41,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/app/lead/page.tsx",
                                lineNumber: 39,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$AppNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppNav"], {}, void 0, false, {
                                fileName: "[project]/frontend/app/lead/page.tsx",
                                lineNumber: 46,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lead-topbar-actions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ColorSchemeToggle"], {}, void 0, false, {
                                        fileName: "[project]/frontend/app/lead/page.tsx",
                                        lineNumber: 48,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$DatabotNewChatButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DatabotNewChatButton"], {
                                        agentId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$leadState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEAD_AGENT_ID"],
                                        resetAgentView: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$leadClientReset$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resetLeadAgentView"]
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/lead/page.tsx",
                                        lineNumber: 49,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/app/lead/page.tsx",
                                lineNumber: 47,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/lead/page.tsx",
                        lineNumber: 38,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lead-layout",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "lead-chat-column",
                                "data-testid": "lead-chat-column",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$react$2d$core$2f$dist$2f$copilotkit$2d$BmW2sFH6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__D__as__CopilotChat$3e$__["CopilotChat"], {
                                        // A plain component fills the slot; the slot type expects the built-in view.
                                        messageView: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$LeadMessageView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LeadMessageView"],
                                        labels: {
                                            modalHeaderTitle: "TahoePilot",
                                            welcomeMessageText: "Ask about data, metrics, failing jobs or code. I answer what I can, ask when something is unclear, and hand real work to a specialist."
                                        },
                                        className: "lead-chat"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/lead/page.tsx",
                                        lineNumber: 55,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "lead-roster",
                                        "aria-label": "Specialists",
                                        children: SPECIALISTS.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: `agent-chip agent-chip--${s.id}`,
                                                title: s.text,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AgentIcon"], {
                                                        name: s.id,
                                                        size: 13
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/app/lead/page.tsx",
                                                        lineNumber: 68,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: s.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/app/lead/page.tsx",
                                                        lineNumber: 69,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "lead-roster-text",
                                                        children: s.text
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/app/lead/page.tsx",
                                                        lineNumber: 70,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, s.name, true, {
                                                fileName: "[project]/frontend/app/lead/page.tsx",
                                                lineNumber: 67,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/lead/page.tsx",
                                        lineNumber: 65,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/app/lead/page.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LeadWorkspaceColumn, {}, void 0, false, {
                                fileName: "[project]/frontend/app/lead/page.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/lead/page.tsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$LeadToolRenderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LeadToolRenderers"], {}, void 0, false, {
                        fileName: "[project]/frontend/app/lead/page.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$lead$2f$SqlReviewGate$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SqlReviewGate"], {}, void 0, false, {
                        fileName: "[project]/frontend/app/lead/page.tsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/lead/page.tsx",
                lineNumber: 37,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend/app/lead/page.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/lead/page.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_c1 = LeadPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "LeadWorkspaceColumn");
__turbopack_context__.k.register(_c1, "LeadPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_app_1ugvcxt._.js.map