(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__export",
    ()=>__export,
    "__name",
    ()=>__name
]);
var __defProp = Object.defineProperty;
var __name = (target, value)=>__defProp(target, "name", {
        value,
        configurable: true
    });
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
;
}),
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/sizeCapture-INFHLROL.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "captureNodeSizes",
    ()=>captureNodeSizes,
    "shouldCaptureSizes",
    ()=>shouldCaptureSizes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
;
// src/rendering-util/layout-algorithms/ddlt/captureContract.ts
var DDLT_SIZE_CAPTURE_VERSION = 1;
// src/rendering-util/layout-algorithms/ddlt/sizeCapture.ts
function getCaptureGlobal() {
    if (typeof globalThis === "undefined") {
        return void 0;
    }
    return globalThis;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(getCaptureGlobal, "getCaptureGlobal");
function shouldCaptureSizes() {
    return Boolean(getCaptureGlobal()?.mermaidCaptureSizes);
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(shouldCaptureSizes, "shouldCaptureSizes");
function capturedFromLocation() {
    if (typeof location === "undefined") {
        return "browser-dev";
    }
    return `${location.pathname}${location.search}`;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(capturedFromLocation, "capturedFromLocation");
function emitCapturedSizes(captured, element) {
    const g = getCaptureGlobal();
    if (!g) {
        return;
    }
    const domNode = element.node();
    const ownerSvg = (domNode && "ownerSVGElement" in domNode ? domNode.ownerSVGElement : null) ?? domNode;
    const svgId = ownerSvg?.id ?? "(unknown)";
    g.mermaidCapturedSizes ??= [];
    const entry = {
        svgId,
        sizes: captured
    };
    g.mermaidCapturedSizes.push(entry);
    g.mermaidLastCapturedSizes = entry;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(emitCapturedSizes, "emitCapturedSizes");
function captureNodeSizes(element, data4Layout) {
    const nodes = [];
    for (const node of data4Layout.nodes){
        if (node.isGroup) {
            continue;
        }
        nodes.push({
            id: node.id,
            width: node.width ?? 0,
            height: node.height ?? 0
        });
    }
    if (nodes.length === 0) {
        return;
    }
    emitCapturedSizes({
        metadata: {
            captureVersion: DDLT_SIZE_CAPTURE_VERSION,
            capturedAt: /* @__PURE__ */ new Date().toISOString(),
            capturedFrom: capturedFromLocation()
        },
        nodes
    }, element);
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(captureNodeSizes, "captureNodeSizes");
;
}),
]);

//# sourceMappingURL=19xk_mermaid_dist_chunks_mermaid_core_07c9k3m._.js.map