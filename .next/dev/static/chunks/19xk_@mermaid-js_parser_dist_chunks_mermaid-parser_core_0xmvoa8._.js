(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-XHIXRSVI.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RailroadAbnfModule",
    ()=>RailroadAbnfModule,
    "createRailroadAbnfServices",
    ()=>createRailroadAbnfServices
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-FOHPRMQF.mjs [app-client] (ecmascript)");
;
// src/language/railroad-abnf/tokenBuilder.ts
var RailroadAbnfTokenBuilder = class extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AbstractMermaidTokenBuilder"] {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "RailroadAbnfTokenBuilder");
    }
    constructor(){
        super([
            "railroad-abnf-beta"
        ]);
    }
};
// src/language/railroad-abnf/valueConverter.ts
var RailroadAbnfValueConverter = class extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AbstractMermaidValueConverter"] {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "RailroadAbnfValueConverter");
    }
    runConverter(rule, input, cstNode) {
        const value = super.runConverter(rule, input, cstNode);
        if (rule.name === "TITLE" && typeof value === "string") {
            const trimmedValue = value.trim();
            if (trimmedValue.startsWith('"') && trimmedValue.endsWith('"') || trimmedValue.startsWith("'") && trimmedValue.endsWith("'")) {
                return trimmedValue.slice(1, -1);
            }
        }
        return value;
    }
    runCustomConverter(rule, input, _cstNode) {
        if (rule.name === "ABNF_STRING") {
            return input.slice(1, -1);
        }
        return void 0;
    }
};
// src/language/railroad-abnf/module.ts
var RailroadAbnfModule = {
    parser: {
        TokenBuilder: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>new RailroadAbnfTokenBuilder(), "TokenBuilder"),
        ValueConverter: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>new RailroadAbnfValueConverter(), "ValueConverter")
    }
};
function createRailroadAbnfServices(context = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyFileSystem"]) {
    const shared = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inject"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultSharedCoreModule"])(context), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MermaidGeneratedSharedModule"]);
    const RailroadAbnf = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inject"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultCoreModule"])({
        shared
    }), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RailroadAbnfGrammarGeneratedModule"], RailroadAbnfModule);
    shared.ServiceRegistry.register(RailroadAbnf);
    return {
        shared,
        RailroadAbnf
    };
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(createRailroadAbnfServices, "createRailroadAbnfServices");
;
}),
"[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/railroad-abnf-HS5TGJTU.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RailroadAbnfModule",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$XHIXRSVI$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RailroadAbnfModule"],
    "createRailroadAbnfServices",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$XHIXRSVI$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRailroadAbnfServices"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$railroad$2d$abnf$2d$HS5TGJTU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/railroad-abnf-HS5TGJTU.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$XHIXRSVI$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-XHIXRSVI.mjs [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/railroad-abnf-HS5TGJTU.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$XHIXRSVI$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-XHIXRSVI.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-FOHPRMQF.mjs [app-client] (ecmascript)");
;
;
;
}),
]);

//# sourceMappingURL=19xk_%40mermaid-js_parser_dist_chunks_mermaid-parser_core_0xmvoa8._.js.map