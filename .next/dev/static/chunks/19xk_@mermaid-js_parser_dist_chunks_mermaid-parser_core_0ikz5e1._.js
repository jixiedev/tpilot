(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-UY3FDG6J.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PacketModule",
    ()=>PacketModule,
    "createPacketServices",
    ()=>createPacketServices
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-FOHPRMQF.mjs [app-client] (ecmascript)");
;
// src/language/packet/tokenBuilder.ts
var PacketTokenBuilder = class extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AbstractMermaidTokenBuilder"] {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "PacketTokenBuilder");
    }
    constructor(){
        super([
            "packet"
        ]);
    }
};
// src/language/packet/module.ts
var PacketModule = {
    parser: {
        TokenBuilder: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>new PacketTokenBuilder(), "TokenBuilder"),
        ValueConverter: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommonValueConverter"](), "ValueConverter")
    }
};
function createPacketServices(context = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyFileSystem"]) {
    const shared = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inject"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultSharedCoreModule"])(context), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MermaidGeneratedSharedModule"]);
    const Packet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inject"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultCoreModule"])({
        shared
    }), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PacketGrammarGeneratedModule"], PacketModule);
    shared.ServiceRegistry.register(Packet);
    return {
        shared,
        Packet
    };
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(createPacketServices, "createPacketServices");
;
}),
"[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/packet-AYTQ26CC.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PacketModule",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$UY3FDG6J$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PacketModule"],
    "createPacketServices",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$UY3FDG6J$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPacketServices"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$packet$2d$AYTQ26CC$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/packet-AYTQ26CC.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$UY3FDG6J$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-UY3FDG6J.mjs [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/packet-AYTQ26CC.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$UY3FDG6J$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-UY3FDG6J.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-FOHPRMQF.mjs [app-client] (ecmascript)");
;
;
;
}),
]);

//# sourceMappingURL=19xk_%40mermaid-js_parser_dist_chunks_mermaid-parser_core_0ikz5e1._.js.map