(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-KI3K4JFJ.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GitGraphModule",
    ()=>GitGraphModule,
    "createGitGraphServices",
    ()=>createGitGraphServices
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-FOHPRMQF.mjs [app-client] (ecmascript)");
;
// src/language/gitGraph/tokenBuilder.ts
var GitGraphTokenBuilder = class extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AbstractMermaidTokenBuilder"] {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "GitGraphTokenBuilder");
    }
    constructor(){
        super([
            "gitGraph"
        ]);
    }
};
// src/language/gitGraph/module.ts
var GitGraphModule = {
    parser: {
        TokenBuilder: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>new GitGraphTokenBuilder(), "TokenBuilder"),
        ValueConverter: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommonValueConverter"](), "ValueConverter")
    }
};
function createGitGraphServices(context = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyFileSystem"]) {
    const shared = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inject"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultSharedCoreModule"])(context), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MermaidGeneratedSharedModule"]);
    const GitGraph = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inject"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultCoreModule"])({
        shared
    }), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GitGraphGrammarGeneratedModule"], GitGraphModule);
    shared.ServiceRegistry.register(GitGraph);
    return {
        shared,
        GitGraph
    };
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(createGitGraphServices, "createGitGraphServices");
;
}),
"[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/gitGraph-4MIJSDKK.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GitGraphModule",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$KI3K4JFJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GitGraphModule"],
    "createGitGraphServices",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$KI3K4JFJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createGitGraphServices"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$gitGraph$2d$4MIJSDKK$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/gitGraph-4MIJSDKK.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$KI3K4JFJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-KI3K4JFJ.mjs [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/gitGraph-4MIJSDKK.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$KI3K4JFJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-KI3K4JFJ.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-FOHPRMQF.mjs [app-client] (ecmascript)");
;
;
;
}),
]);

//# sourceMappingURL=19xk_%40mermaid-js_parser_dist_chunks_mermaid-parser_core_1nwjbni._.js.map