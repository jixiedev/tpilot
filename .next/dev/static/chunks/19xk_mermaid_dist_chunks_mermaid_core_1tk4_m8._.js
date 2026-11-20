(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-75Z2AOVW.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ZERO_WIDTH_SPACE",
    ()=>ZERO_WIDTH_SPACE,
    "calculateTextDimensions",
    ()=>calculateTextDimensions,
    "calculateTextHeight",
    ()=>calculateTextHeight,
    "calculateTextWidth",
    ()=>calculateTextWidth,
    "cleanAndMerge",
    ()=>cleanAndMerge,
    "decodeEntities",
    ()=>decodeEntities,
    "encodeEntities",
    ()=>encodeEntities,
    "generateId",
    ()=>generateId,
    "getEdgeId",
    ()=>getEdgeId,
    "getStylesFromArray",
    ()=>getStylesFromArray,
    "handleUndefinedAttr",
    ()=>handleUndefinedAttr,
    "interpolateToCurve",
    ()=>interpolateToCurve,
    "isDetailedError",
    ()=>isDetailedError,
    "parseFontSize",
    ()=>parseFontSize,
    "random",
    ()=>random,
    "removeDirectives",
    ()=>removeDirectives,
    "utils_default",
    ()=>utils_default,
    "wrapLabel",
    ()=>wrapLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
// src/utils.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$braintree$2f$sanitize$2d$url$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@braintree/sanitize-url/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBasis$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/basis.js [app-client] (ecmascript) <export default as curveBasis>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basisClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBasisClosed$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/basisClosed.js [app-client] (ecmascript) <export default as curveBasisClosed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basisOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBasisOpen$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/basisOpen.js [app-client] (ecmascript) <export default as curveBasisOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bump$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__bumpX__as__curveBumpX$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/bump.js [app-client] (ecmascript) <export bumpX as curveBumpX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bump$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__bumpY__as__curveBumpY$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/bump.js [app-client] (ecmascript) <export bumpY as curveBumpY>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bundle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBundle$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/bundle.js [app-client] (ecmascript) <export default as curveBundle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinalClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCardinalClosed$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/cardinalClosed.js [app-client] (ecmascript) <export default as curveCardinalClosed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinalOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCardinalOpen$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/cardinalOpen.js [app-client] (ecmascript) <export default as curveCardinalOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCardinal$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/cardinal.js [app-client] (ecmascript) <export default as curveCardinal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRomClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCatmullRomClosed$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/catmullRomClosed.js [app-client] (ecmascript) <export default as curveCatmullRomClosed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRomOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCatmullRomOpen$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/catmullRomOpen.js [app-client] (ecmascript) <export default as curveCatmullRomOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCatmullRom$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/catmullRom.js [app-client] (ecmascript) <export default as curveCatmullRom>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$linear$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveLinear$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/linear.js [app-client] (ecmascript) <export default as curveLinear>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$linearClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveLinearClosed$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/linearClosed.js [app-client] (ecmascript) <export default as curveLinearClosed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__monotoneX__as__curveMonotoneX$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/monotone.js [app-client] (ecmascript) <export monotoneX as curveMonotoneX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__monotoneY__as__curveMonotoneY$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/monotone.js [app-client] (ecmascript) <export monotoneY as curveMonotoneY>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$natural$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveNatural$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/natural.js [app-client] (ecmascript) <export default as curveNatural>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveStep$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/step.js [app-client] (ecmascript) <export default as curveStep>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__stepAfter__as__curveStepAfter$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/step.js [app-client] (ecmascript) <export stepAfter as curveStepAfter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__stepBefore__as__curveStepBefore$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/step.js [app-client] (ecmascript) <export stepBefore as curveStepBefore>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$function$2f$memoize$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/function/memoize.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$object$2f$merge$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/object/merge.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
var ZERO_WIDTH_SPACE = "\u200B";
var d3CurveTypes = {
    curveBasis: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBasis$3e$__["curveBasis"],
    curveBasisClosed: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basisClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBasisClosed$3e$__["curveBasisClosed"],
    curveBasisOpen: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basisOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBasisOpen$3e$__["curveBasisOpen"],
    curveBumpX: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bump$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__bumpX__as__curveBumpX$3e$__["curveBumpX"],
    curveBumpY: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bump$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__bumpY__as__curveBumpY$3e$__["curveBumpY"],
    curveBundle: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bundle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBundle$3e$__["curveBundle"],
    curveCardinalClosed: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinalClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCardinalClosed$3e$__["curveCardinalClosed"],
    curveCardinalOpen: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinalOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCardinalOpen$3e$__["curveCardinalOpen"],
    curveCardinal: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCardinal$3e$__["curveCardinal"],
    curveCatmullRomClosed: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRomClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCatmullRomClosed$3e$__["curveCatmullRomClosed"],
    curveCatmullRomOpen: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRomOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCatmullRomOpen$3e$__["curveCatmullRomOpen"],
    curveCatmullRom: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCatmullRom$3e$__["curveCatmullRom"],
    curveLinear: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$linear$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveLinear$3e$__["curveLinear"],
    curveLinearClosed: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$linearClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveLinearClosed$3e$__["curveLinearClosed"],
    curveMonotoneX: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__monotoneX__as__curveMonotoneX$3e$__["curveMonotoneX"],
    curveMonotoneY: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__monotoneY__as__curveMonotoneY$3e$__["curveMonotoneY"],
    curveNatural: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$natural$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveNatural$3e$__["curveNatural"],
    curveStep: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveStep$3e$__["curveStep"],
    curveStepAfter: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__stepAfter__as__curveStepAfter$3e$__["curveStepAfter"],
    curveStepBefore: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__stepBefore__as__curveStepBefore$3e$__["curveStepBefore"]
};
var directiveWithoutOpen = /\s*(?:(\w+)(?=:):|(\w+))\s*(?:(\w+)|((?:(?!}%{2}).|\r?\n)*))?\s*(?:}%{2})?/gi;
var detectInit = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(text, config) {
    const inits = detectDirective(text, /(?:init\b)|(?:initialize\b)/);
    let results = {};
    if (Array.isArray(inits)) {
        const args = inits.map((init)=>init.args);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeDirective"])(args);
        results = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assignWithDepth_default"])(results, [
            ...args
        ]);
    } else {
        results = inits.args;
    }
    if (!results) {
        return;
    }
    let type = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["detectType"])(text, config);
    const prop = "config";
    if (results[prop] !== void 0) {
        if (type === "flowchart-v2") {
            type = "flowchart";
        }
        results[type] = results[prop];
        delete results[prop];
    }
    return results;
}, "detectInit");
var detectDirective = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(text, type = null) {
    try {
        const commentWithoutDirectives = new RegExp(`[%]{2}(?![{]${directiveWithoutOpen.source})(?=[}][%]{2}).*
`, "ig");
        text = text.trim().replace(commentWithoutDirectives, "").replace(/'/gm, '"');
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug(`Detecting diagram directive${type !== null ? " type:" + type : ""} based on the text:${text}`);
        let match;
        const result = [];
        while((match = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["directiveRegex"].exec(text)) !== null){
            if (match.index === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["directiveRegex"].lastIndex) {
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["directiveRegex"].lastIndex++;
            }
            if (match && !type || type && match[1]?.match(type) || type && match[2]?.match(type)) {
                const type2 = match[1] ? match[1] : match[2];
                const args = match[3] ? match[3].trim() : match[4] ? JSON.parse(match[4].trim()) : null;
                result.push({
                    type: type2,
                    args
                });
            }
        }
        if (result.length === 0) {
            return {
                type: text,
                args: null
            };
        }
        return result.length === 1 ? result[0] : result;
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].error(`ERROR: ${error.message} - Unable to parse directive type: '${type}' based on the text: '${text}'`);
        return {
            type: void 0,
            args: null
        };
    }
}, "detectDirective");
var removeDirectives = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(text) {
    return text.replace(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["directiveRegex"], "");
}, "removeDirectives");
var isSubstringInArray = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(str, arr) {
    for (const [i, element] of arr.entries()){
        if (element.match(str)) {
            return i;
        }
    }
    return -1;
}, "isSubstringInArray");
function interpolateToCurve(interpolate, defaultCurve) {
    if (!interpolate) {
        return defaultCurve;
    }
    const curveName = `curve${interpolate.charAt(0).toUpperCase() + interpolate.slice(1)}`;
    return d3CurveTypes[curveName] ?? defaultCurve;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(interpolateToCurve, "interpolateToCurve");
function formatUrl(linkStr, config) {
    const url = linkStr.trim();
    if (!url) {
        return void 0;
    }
    if (config.securityLevel !== "loose") {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$braintree$2f$sanitize$2d$url$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeUrl"])(url);
    }
    return url;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(formatUrl, "formatUrl");
var runFunc = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((functionName, ...params)=>{
    const arrPaths = functionName.split(".");
    const len = arrPaths.length - 1;
    const fnName = arrPaths[len];
    let obj = window;
    for(let i = 0; i < len; i++){
        obj = obj[arrPaths[i]];
        if (!obj) {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].error(`Function name: ${functionName} not found in window`);
            return;
        }
    }
    obj[fnName](...params);
}, "runFunc");
function distance(p1, p2) {
    if (!p1 || !p2) {
        return 0;
    }
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(distance, "distance");
function traverseEdge(points) {
    let prevPoint;
    let totalDistance = 0;
    points.forEach((point)=>{
        totalDistance += distance(point, prevPoint);
        prevPoint = point;
    });
    const remainingDistance = totalDistance / 2;
    return calculatePoint(points, remainingDistance);
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(traverseEdge, "traverseEdge");
function calcLabelPosition(points) {
    if (points.length === 1) {
        return points[0];
    }
    return traverseEdge(points);
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(calcLabelPosition, "calcLabelPosition");
var roundNumber = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((num, precision = 2)=>{
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
}, "roundNumber");
var calculatePoint = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((points, distanceToTraverse)=>{
    let prevPoint = void 0;
    let remainingDistance = distanceToTraverse;
    for (const point of points){
        if (prevPoint) {
            const vectorDistance = distance(point, prevPoint);
            if (vectorDistance === 0) {
                return prevPoint;
            }
            if (vectorDistance < remainingDistance) {
                remainingDistance -= vectorDistance;
            } else {
                const distanceRatio = remainingDistance / vectorDistance;
                if (distanceRatio <= 0) {
                    return prevPoint;
                }
                if (distanceRatio >= 1) {
                    return {
                        x: point.x,
                        y: point.y
                    };
                }
                if (distanceRatio > 0 && distanceRatio < 1) {
                    return {
                        x: roundNumber((1 - distanceRatio) * prevPoint.x + distanceRatio * point.x, 5),
                        y: roundNumber((1 - distanceRatio) * prevPoint.y + distanceRatio * point.y, 5)
                    };
                }
            }
        }
        prevPoint = point;
    }
    throw new Error("Could not find a suitable point for the given distance");
}, "calculatePoint");
var calcCardinalityPosition = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((isRelationTypePresent, points, initialPosition)=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info(`our points ${JSON.stringify(points)}`);
    if (points[0] !== initialPosition) {
        points = points.reverse();
    }
    const distanceToCardinalityPoint = 25;
    const center = calculatePoint(points, distanceToCardinalityPoint);
    const d = isRelationTypePresent ? 10 : 5;
    const angle = Math.atan2(points[0].y - center.y, points[0].x - center.x);
    const cardinalityPosition = {
        x: 0,
        y: 0
    };
    cardinalityPosition.x = Math.sin(angle) * d + (points[0].x + center.x) / 2;
    cardinalityPosition.y = -Math.cos(angle) * d + (points[0].y + center.y) / 2;
    return cardinalityPosition;
}, "calcCardinalityPosition");
function calcTerminalLabelPosition(terminalMarkerSize, position, _points) {
    const points = structuredClone(_points);
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("our points", points);
    if (position !== "start_left" && position !== "start_right") {
        points.reverse();
    }
    const distanceToCardinalityPoint = 25 + terminalMarkerSize;
    const center = calculatePoint(points, distanceToCardinalityPoint);
    const d = 10 + terminalMarkerSize * 0.5;
    const angle = Math.atan2(points[0].y - center.y, points[0].x - center.x);
    const cardinalityPosition = {
        x: 0,
        y: 0
    };
    if (position === "start_left") {
        cardinalityPosition.x = Math.sin(angle + Math.PI) * d + (points[0].x + center.x) / 2;
        cardinalityPosition.y = -Math.cos(angle + Math.PI) * d + (points[0].y + center.y) / 2;
    } else if (position === "end_right") {
        cardinalityPosition.x = Math.sin(angle - Math.PI) * d + (points[0].x + center.x) / 2 - 5;
        cardinalityPosition.y = -Math.cos(angle - Math.PI) * d + (points[0].y + center.y) / 2 - 5;
    } else if (position === "end_left") {
        cardinalityPosition.x = Math.sin(angle) * d + (points[0].x + center.x) / 2 - 5;
        cardinalityPosition.y = -Math.cos(angle) * d + (points[0].y + center.y) / 2 - 5;
    } else {
        cardinalityPosition.x = Math.sin(angle) * d + (points[0].x + center.x) / 2;
        cardinalityPosition.y = -Math.cos(angle) * d + (points[0].y + center.y) / 2;
    }
    return cardinalityPosition;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(calcTerminalLabelPosition, "calcTerminalLabelPosition");
function getStylesFromArray(arr) {
    let style = "";
    let labelStyle = "";
    for (const element of arr){
        if (element !== void 0) {
            if (element.startsWith("color:") || element.startsWith("text-align:")) {
                labelStyle = labelStyle + element + ";";
            } else {
                style = style + element + ";";
            }
        }
    }
    return {
        style,
        labelStyle
    };
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(getStylesFromArray, "getStylesFromArray");
var cnt = 0;
var generateId = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>{
    cnt++;
    return "id-" + Math.random().toString(36).substr(2, 12) + "-" + cnt;
}, "generateId");
function makeRandomHex(length) {
    let result = "";
    const characters = "0123456789abcdef";
    const charactersLength = characters.length;
    for(let i = 0; i < length; i++){
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(makeRandomHex, "makeRandomHex");
var random = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((options)=>{
    return makeRandomHex(options.length);
}, "random");
var getTextObj = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    return {
        x: 0,
        y: 0,
        fill: void 0,
        anchor: "start",
        style: "#666",
        width: 100,
        height: 100,
        textMargin: 0,
        rx: 0,
        ry: 0,
        valign: void 0,
        text: ""
    };
}, "getTextObj");
var drawSimpleText = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(elem, textData) {
    const nText = textData.text.replace(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["common_default"].lineBreakRegex, " ");
    const [, _fontSizePx] = parseFontSize(textData.fontSize);
    const textElem = elem.append("text");
    textElem.attr("x", textData.x);
    textElem.attr("y", textData.y);
    textElem.style("text-anchor", textData.anchor);
    textElem.style("font-family", textData.fontFamily);
    textElem.style("font-size", _fontSizePx);
    textElem.style("font-weight", textData.fontWeight);
    textElem.attr("fill", textData.fill);
    if (textData.class !== void 0) {
        textElem.attr("class", textData.class);
    }
    const span = textElem.append("tspan");
    span.attr("x", textData.x + textData.textMargin * 2);
    span.attr("fill", textData.fill);
    span.text(nText);
    return textElem;
}, "drawSimpleText");
var wrapLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$function$2f$memoize$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memoize"])((label, maxWidth, config)=>{
    if (!label) {
        return label;
    }
    config = Object.assign({
        fontSize: 12,
        fontWeight: 400,
        fontFamily: "Arial",
        joinWith: "<br/>"
    }, config);
    if (__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["common_default"].lineBreakRegex.test(label)) {
        return label;
    }
    const words = label.split(" ").filter(Boolean);
    const completedLines = [];
    let nextLine = "";
    words.forEach((word, index)=>{
        const wordLength = calculateTextWidth(`${word} `, config);
        const nextLineLength = calculateTextWidth(nextLine, config);
        if (wordLength > maxWidth) {
            const { hyphenatedStrings, remainingWord } = breakString(word, maxWidth, "-", config);
            completedLines.push(nextLine, ...hyphenatedStrings);
            nextLine = remainingWord;
        } else if (nextLineLength + wordLength >= maxWidth) {
            completedLines.push(nextLine);
            nextLine = word;
        } else {
            nextLine = [
                nextLine,
                word
            ].filter(Boolean).join(" ");
        }
        const currentWord = index + 1;
        const isLastWord = currentWord === words.length;
        if (isLastWord) {
            completedLines.push(nextLine);
        }
    });
    return completedLines.filter((line)=>line !== "").join(config.joinWith);
}, (label, maxWidth, config)=>`${label}${maxWidth}${config.fontSize}${config.fontWeight}${config.fontFamily}${config.joinWith}`);
var breakString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$function$2f$memoize$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memoize"])((word, maxWidth, hyphenCharacter = "-", config)=>{
    config = Object.assign({
        fontSize: 12,
        fontWeight: 400,
        fontFamily: "Arial",
        margin: 0
    }, config);
    const characters = [
        ...word
    ];
    const lines = [];
    let currentLine = "";
    characters.forEach((character, index)=>{
        const nextLine = `${currentLine}${character}`;
        const lineWidth = calculateTextWidth(nextLine, config);
        if (lineWidth >= maxWidth) {
            const currentCharacter = index + 1;
            const isLastLine = characters.length === currentCharacter;
            const hyphenatedNextLine = `${nextLine}${hyphenCharacter}`;
            lines.push(isLastLine ? nextLine : hyphenatedNextLine);
            currentLine = "";
        } else {
            currentLine = nextLine;
        }
    });
    return {
        hyphenatedStrings: lines,
        remainingWord: currentLine
    };
}, (word, maxWidth, hyphenCharacter = "-", config)=>`${word}${maxWidth}${hyphenCharacter}${config.fontSize}${config.fontWeight}${config.fontFamily}`);
function calculateTextHeight(text, config) {
    return calculateTextDimensions(text, config).height;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(calculateTextHeight, "calculateTextHeight");
function calculateTextWidth(text, config) {
    return calculateTextDimensions(text, config).width;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(calculateTextWidth, "calculateTextWidth");
var calculateTextDimensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$function$2f$memoize$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memoize"])((text, config)=>{
    const { fontSize = 12, fontFamily = "Arial", fontWeight = 400 } = config;
    if (!text) {
        return {
            width: 0,
            height: 0
        };
    }
    const [, _fontSizePx] = parseFontSize(fontSize);
    const fontFamilies = [
        "sans-serif",
        fontFamily
    ];
    const lines = text.split(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["common_default"].lineBreakRegex);
    const dims = [];
    const body = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])("body");
    if (!body.remove) {
        return {
            width: 0,
            height: 0,
            lineHeight: 0
        };
    }
    const g = body.append("svg");
    for (const fontFamily2 of fontFamilies){
        let cHeight = 0;
        const dim = {
            width: 0,
            height: 0,
            lineHeight: 0
        };
        for (const line of lines){
            const textObj = getTextObj();
            textObj.text = line || ZERO_WIDTH_SPACE;
            const textElem = drawSimpleText(g, textObj).style("font-size", _fontSizePx).style("font-weight", fontWeight).style("font-family", fontFamily2);
            const bBox = (textElem._groups || textElem)[0][0].getBBox();
            if (bBox.width === 0 && bBox.height === 0) {
                throw new Error("svg element not in render tree");
            }
            dim.width = Math.round(Math.max(dim.width, bBox.width));
            cHeight = Math.round(bBox.height);
            dim.height += cHeight;
            dim.lineHeight = Math.round(Math.max(dim.lineHeight, cHeight));
        }
        dims.push(dim);
    }
    g.remove();
    const index = isNaN(dims[1].height) || isNaN(dims[1].width) || isNaN(dims[1].lineHeight) || dims[0].height > dims[1].height && dims[0].width > dims[1].width && dims[0].lineHeight > dims[1].lineHeight ? 0 : 1;
    return dims[index];
}, (text, config)=>`${text}${config.fontSize}${config.fontWeight}${config.fontFamily}`);
var InitIDGenerator = class {
    constructor(deterministic = false, seed){
        this.count = 0;
        this.count = seed ? seed.length : 0;
        this.next = deterministic ? ()=>this.count++ : ()=>Date.now();
    }
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "InitIDGenerator");
    }
};
var decoder;
var entityDecode = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(html) {
    decoder = decoder || document.createElement("div");
    html = escape(html).replace(/%26/g, "&").replace(/%23/g, "#").replace(/%3B/g, ";");
    decoder.innerHTML = html;
    return unescape(decoder.textContent);
}, "entityDecode");
function isDetailedError(error) {
    return "str" in error;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(isDetailedError, "isDetailedError");
var insertTitle = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((parent, cssClass, titleTopMargin, title)=>{
    if (!title) {
        return;
    }
    const bounds = parent.node()?.getBBox();
    if (!bounds) {
        return;
    }
    parent.append("text").text(title).attr("text-anchor", "middle").attr("x", bounds.x + bounds.width / 2).attr("y", -titleTopMargin).attr("class", cssClass);
}, "insertTitle");
var parseFontSize = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((fontSize)=>{
    if (typeof fontSize === "number") {
        return [
            fontSize,
            fontSize + "px"
        ];
    }
    const fontSizeNumber = parseInt(fontSize ?? "", 10);
    if (Number.isNaN(fontSizeNumber)) {
        return [
            void 0,
            void 0
        ];
    } else if (fontSize === String(fontSizeNumber)) {
        return [
            fontSizeNumber,
            fontSize + "px"
        ];
    } else {
        return [
            fontSizeNumber,
            fontSize
        ];
    }
}, "parseFontSize");
function cleanAndMerge(defaultData, data) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$object$2f$merge$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])({}, defaultData, data);
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(cleanAndMerge, "cleanAndMerge");
var utils_default = {
    assignWithDepth: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assignWithDepth_default"],
    wrapLabel,
    calculateTextHeight,
    calculateTextWidth,
    calculateTextDimensions,
    cleanAndMerge,
    detectInit,
    detectDirective,
    isSubstringInArray,
    interpolateToCurve,
    calcLabelPosition,
    calcCardinalityPosition,
    calcTerminalLabelPosition,
    formatUrl,
    getStylesFromArray,
    generateId,
    random,
    runFunc,
    entityDecode,
    insertTitle,
    isLabelCoordinateInPath,
    parseFontSize,
    InitIDGenerator
};
var encodeEntities = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(text) {
    let txt = text;
    txt = txt.replace(/style.*:\S*#.*;/g, function(s) {
        return s.substring(0, s.length - 1);
    });
    txt = txt.replace(/classDef.*:\S*#.*;/g, function(s) {
        return s.substring(0, s.length - 1);
    });
    txt = txt.replace(/#\w+;/g, function(s) {
        const innerTxt = s.substring(1, s.length - 1);
        const isInt = /^\+?\d+$/.test(innerTxt);
        if (isInt) {
            return "\uFB02\xB0\xB0" + innerTxt + "\xB6\xDF";
        } else {
            return "\uFB02\xB0" + innerTxt + "\xB6\xDF";
        }
    });
    return txt;
}, "encodeEntities");
var decodeEntities = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(text) {
    return text.replace(/ﬂ°°/g, "&#").replace(/ﬂ°/g, "&").replace(/¶ß/g, ";");
}, "decodeEntities");
var getEdgeId = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((from, to, { counter = 0, prefix, suffix }, id)=>{
    if (id) {
        return id;
    }
    return `${prefix ? `${prefix}_` : ""}${from}_${to}_${counter}${suffix ? `_${suffix}` : ""}`;
}, "getEdgeId");
function handleUndefinedAttr(attrValue) {
    return attrValue ?? null;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(handleUndefinedAttr, "handleUndefinedAttr");
function isLabelCoordinateInPath(point, dAttr) {
    const roundedX = Math.round(point.x);
    const roundedY = Math.round(point.y);
    const sanitizedD = dAttr.replace(/(\d+\.\d+)/g, (match)=>Math.round(parseFloat(match)).toString());
    return sanitizedD.includes(roundedX.toString()) || sanitizedD.includes(roundedY.toString());
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(isLabelCoordinateInPath, "isLabelCoordinateInPath");
;
}),
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UnknownDiagramError",
    ()=>UnknownDiagramError,
    "addDirective",
    ()=>addDirective,
    "assignWithDepth_default",
    ()=>assignWithDepth_default,
    "calculateMathMLDimensions",
    ()=>calculateMathMLDimensions,
    "clear",
    ()=>clear,
    "commonDb_exports",
    ()=>commonDb_exports,
    "common_default",
    ()=>common_default,
    "configureSvgSize",
    ()=>configureSvgSize,
    "cssStyleSheetToString",
    ()=>cssStyleSheetToString,
    "defaultConfig",
    ()=>defaultConfig,
    "defaultConfig2",
    ()=>defaultConfig2,
    "defaultConfig_default",
    ()=>defaultConfig_default,
    "detectType",
    ()=>detectType,
    "detectors",
    ()=>detectors,
    "directiveRegex",
    ()=>directiveRegex,
    "evaluate",
    ()=>evaluate,
    "frontMatterRegex",
    ()=>frontMatterRegex,
    "getAccDescription",
    ()=>getAccDescription,
    "getAccTitle",
    ()=>getAccTitle,
    "getConfig",
    ()=>getConfig,
    "getConfig2",
    ()=>getConfig2,
    "getDiagram",
    ()=>getDiagram,
    "getDiagramLoader",
    ()=>getDiagramLoader,
    "getDiagramTitle",
    ()=>getDiagramTitle,
    "getEffectiveHtmlLabels",
    ()=>getEffectiveHtmlLabels,
    "getSiteConfig",
    ()=>getSiteConfig,
    "getThemeVariables",
    ()=>getThemeVariables3,
    "getUrl",
    ()=>getUrl,
    "getUserDefinedConfig",
    ()=>getUserDefinedConfig,
    "hasKatex",
    ()=>hasKatex,
    "lineBreakRegex",
    ()=>lineBreakRegex,
    "parseGenericTypes",
    ()=>parseGenericTypes,
    "registerDiagram",
    ()=>registerDiagram,
    "registerLazyLoadedDiagrams",
    ()=>registerLazyLoadedDiagrams,
    "renderKatexSanitized",
    ()=>renderKatexSanitized,
    "reset",
    ()=>reset,
    "sanitizeCss",
    ()=>sanitizeCss,
    "sanitizeDirective",
    ()=>sanitizeDirective,
    "sanitizeText",
    ()=>sanitizeText,
    "sanitizeText2",
    ()=>sanitizeText3,
    "saveConfigFromInitialize",
    ()=>saveConfigFromInitialize,
    "setAccDescription",
    ()=>setAccDescription,
    "setAccTitle",
    ()=>setAccTitle,
    "setConfig",
    ()=>setConfig,
    "setConfig2",
    ()=>setConfig2,
    "setDiagramTitle",
    ()=>setDiagramTitle,
    "setSiteConfig",
    ()=>setSiteConfig,
    "setupGraphViewbox",
    ()=>setupGraphViewbox,
    "setupGraphViewbox2",
    ()=>setupGraphViewbox2,
    "styles_default",
    ()=>styles_default,
    "themes_default",
    ()=>themes_default,
    "updateSiteConfig",
    ()=>updateSiteConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
// src/themes/theme-base.js
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/adjust.js [app-client] (ecmascript) <export default as adjust>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/darken.js [app-client] (ecmascript) <export default as darken>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/invert.js [app-client] (ecmascript) <export default as invert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$is_dark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__isDark$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/is_dark.js [app-client] (ecmascript) <export default as isDark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/lighten.js [app-client] (ecmascript) <export default as lighten>");
// src/themes/theme-dark.js
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$rgba$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__rgba$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/rgba.js [app-client] (ecmascript) <export default as rgba>");
// src/diagrams/common/common.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dompurify$2f$dist$2f$purify$2e$es$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/dompurify/dist/purify.es.mjs [app-client] (ecmascript)");
;
;
// src/assignWithDepth.ts
var assignWithDepth = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((dst, src, { depth = 2 } = {})=>{
    const config2 = {
        depth
    };
    if (Array.isArray(src) && !Array.isArray(dst)) {
        src.forEach((s)=>assignWithDepth(dst, s, config2));
        return dst;
    } else if (Array.isArray(src) && Array.isArray(dst)) {
        src.forEach((s)=>{
            if (!dst.includes(s)) {
                dst.push(s);
            }
        });
        return dst;
    }
    if (dst === void 0 || dst === null || depth <= 0) {
        if (dst !== void 0 && dst !== null && typeof dst === "object" && typeof src === "object") {
            return Object.assign(dst, src);
        } else {
            return src;
        }
    }
    if (src !== void 0 && src !== null && typeof dst === "object" && typeof src === "object") {
        const dstWithKeys = dst;
        Object.entries(src).forEach(([key, srcValue])=>{
            if (typeof srcValue === "object") {
                if (srcValue === null) {
                    return;
                }
                if (!Object.hasOwn(dst, key)) {
                    Object.defineProperty(dst, key, {
                        value: void 0,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                }
                if (dstWithKeys[key] === void 0) {
                    dstWithKeys[key] = Array.isArray(srcValue) ? [] : {};
                }
                if (typeof dstWithKeys[key] === "object") {
                    dstWithKeys[key] = assignWithDepth(dstWithKeys[key], srcValue, {
                        depth: depth - 1
                    });
                }
            } else if (typeof dstWithKeys[key] !== "object") {
                if (Object.hasOwn(dst, key)) {
                    dstWithKeys[key] = srcValue;
                } else {
                    Object.defineProperty(dst, key, {
                        value: srcValue,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                }
            }
        });
    }
    return dst;
}, "assignWithDepth");
var assignWithDepth_default = assignWithDepth;
;
// src/themes/erDiagram-oldHardcodedValues.ts
var oldAttributeBackgroundColorOdd = "#ffffff";
var oldAttributeBackgroundColorEven = "#f2f2f2";
;
var mkBorder = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((col, darkMode)=>darkMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(col, {
        s: -40,
        l: 10
    }) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(col, {
        s: -40,
        l: -10
    }), "mkBorder");
// src/themes/theme-base.js
var Theme = class {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "Theme");
    }
    constructor(){
        this.background = "#f4f4f4";
        this.primaryColor = "#fff4dd";
        this.noteBkgColor = "#fff5ad";
        this.noteTextColor = "#333";
        this.THEME_COLOR_LIMIT = 12;
        this.radius = 5;
        this.strokeWidth = 1;
        this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif';
        this.fontSize = "16px";
        this.useGradient = true;
        this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))";
    }
    updateColors() {
        this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333");
        this.secondaryColor = this.secondaryColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -120
        });
        this.tertiaryColor = this.tertiaryColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 180,
            l: 5
        });
        this.primaryBorderColor = this.primaryBorderColor || mkBorder(this.primaryColor, this.darkMode);
        this.secondaryBorderColor = this.secondaryBorderColor || mkBorder(this.secondaryColor, this.darkMode);
        this.tertiaryBorderColor = this.tertiaryBorderColor || mkBorder(this.tertiaryColor, this.darkMode);
        this.noteBorderColor = this.noteBorderColor || mkBorder(this.noteBkgColor, this.darkMode);
        this.noteBkgColor = this.noteBkgColor || "#fff5ad";
        this.noteTextColor = this.noteTextColor || "#333";
        this.secondaryTextColor = this.secondaryTextColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.secondaryColor);
        this.tertiaryTextColor = this.tertiaryTextColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.tertiaryColor);
        this.lineColor = this.lineColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.arrowheadColor = this.arrowheadColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.textColor = this.textColor || this.primaryTextColor;
        this.border2 = this.border2 || this.tertiaryBorderColor;
        this.nodeBkg = this.nodeBkg || this.primaryColor;
        this.mainBkg = this.mainBkg || this.primaryColor;
        this.nodeBorder = this.nodeBorder || this.primaryBorderColor;
        this.clusterBkg = this.clusterBkg || this.tertiaryColor;
        this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor;
        this.defaultLinkColor = this.defaultLinkColor || this.lineColor;
        this.titleColor = this.titleColor || this.tertiaryTextColor;
        this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 30) : this.secondaryColor);
        this.nodeTextColor = this.nodeTextColor || this.primaryTextColor;
        this.actorBorder = this.actorBorder || this.primaryBorderColor;
        this.actorBkg = this.actorBkg || this.mainBkg;
        this.actorTextColor = this.actorTextColor || this.primaryTextColor;
        this.actorLineColor = this.actorLineColor || this.actorBorder;
        this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg;
        this.signalColor = this.signalColor || this.textColor;
        this.signalTextColor = this.signalTextColor || this.textColor;
        this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder;
        this.labelTextColor = this.labelTextColor || this.actorTextColor;
        this.loopTextColor = this.loopTextColor || this.actorTextColor;
        this.activationBorderColor = this.activationBorderColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 10);
        this.activationBkgColor = this.activationBkgColor || this.secondaryColor;
        this.sequenceNumberColor = this.sequenceNumberColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.lineColor);
        this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
        this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor;
        this.altSectionBkgColor = this.altSectionBkgColor || "white";
        this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor;
        this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor;
        this.excludeBkgColor = this.excludeBkgColor || "#eeeeee";
        this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor;
        this.taskBkgColor = this.taskBkgColor || this.primaryColor;
        this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor;
        this.activeTaskBkgColor = this.activeTaskBkgColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.primaryColor, 23);
        this.gridColor = this.gridColor || "lightgrey";
        this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey";
        this.doneTaskBorderColor = this.doneTaskBorderColor || "grey";
        this.critBorderColor = this.critBorderColor || "#ff8888";
        this.critBkgColor = this.critBkgColor || "red";
        this.todayLineColor = this.todayLineColor || "red";
        this.vertLineColor = this.vertLineColor || "navy";
        this.taskTextColor = this.taskTextColor || this.textColor;
        this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor;
        this.taskTextLightColor = this.taskTextLightColor || this.textColor;
        this.taskTextColor = this.taskTextColor || this.primaryTextColor;
        this.taskTextDarkColor = this.taskTextDarkColor || this.textColor;
        this.taskTextClickableColor = this.taskTextClickableColor || "#003163";
        this.noteFontWeight = this.noteFontWeight || "normal";
        this.fontWeight = this.fontWeight || "normal";
        this.personBorder = this.personBorder || this.primaryBorderColor;
        this.personBkg = this.personBkg || this.mainBkg;
        if (this.darkMode) {
            this.rowOdd = this.rowOdd || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.mainBkg, 5) || "#ffffff";
            this.rowEven = this.rowEven || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.mainBkg, 10);
        } else {
            this.rowOdd = this.rowOdd || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.mainBkg, 75) || "#ffffff";
            this.rowEven = this.rowEven || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.mainBkg, 5);
        }
        this.transitionColor = this.transitionColor || this.lineColor;
        this.transitionLabelColor = this.transitionLabelColor || this.textColor;
        this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor;
        this.stateBkg = this.stateBkg || this.mainBkg;
        this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg;
        this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor;
        this.altBackground = this.altBackground || this.tertiaryColor;
        this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg;
        this.compositeBorder = this.compositeBorder || this.nodeBorder;
        this.innerEndBackground = this.nodeBorder;
        this.errorBkgColor = this.errorBkgColor || this.tertiaryColor;
        this.errorTextColor = this.errorTextColor || this.tertiaryTextColor;
        this.transitionColor = this.transitionColor || this.lineColor;
        this.specialStateColor = this.lineColor;
        this.cScale0 = this.cScale0 || this.primaryColor;
        this.cScale1 = this.cScale1 || this.secondaryColor;
        this.cScale2 = this.cScale2 || this.tertiaryColor;
        this.cScale3 = this.cScale3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 30
        });
        this.cScale4 = this.cScale4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60
        });
        this.cScale5 = this.cScale5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 90
        });
        this.cScale6 = this.cScale6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120
        });
        this.cScale7 = this.cScale7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 150
        });
        this.cScale8 = this.cScale8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 210,
            l: 150
        });
        this.cScale9 = this.cScale9 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 270
        });
        this.cScale10 = this.cScale10 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 300
        });
        this.cScale11 = this.cScale11 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 330
        });
        if (this.darkMode) {
            for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
                this["cScale" + i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 75);
            }
        } else {
            for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
                this["cScale" + i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 25);
            }
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleInv" + i] = this["cScaleInv" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this["cScale" + i]);
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            if (this.darkMode) {
                this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this["cScale" + i], 10);
            } else {
                this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 10);
            }
        }
        this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleLabel" + i] = this["cScaleLabel" + i] || this.scaleLabelColor;
        }
        const multiplier = this.darkMode ? -4 : -1;
        for(let i = 0; i < 5; i++){
            this["surface" + i] = this["surface" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 180,
                s: -15,
                l: multiplier * (5 + i * 3)
            });
            this["surfacePeer" + i] = this["surfacePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 180,
                s: -15,
                l: multiplier * (8 + i * 3)
            });
        }
        this.classText = this.classText || this.textColor;
        this.fillType0 = this.fillType0 || this.primaryColor;
        this.fillType1 = this.fillType1 || this.secondaryColor;
        this.fillType2 = this.fillType2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 64
        });
        this.fillType3 = this.fillType3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 64
        });
        this.fillType4 = this.fillType4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -64
        });
        this.fillType5 = this.fillType5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: -64
        });
        this.fillType6 = this.fillType6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 128
        });
        this.fillType7 = this.fillType7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 128
        });
        this.pie1 = this.pie1 || this.primaryColor;
        this.pie2 = this.pie2 || this.secondaryColor;
        this.pie3 = this.pie3 || this.tertiaryColor;
        this.pie4 = this.pie4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            l: -10
        });
        this.pie5 = this.pie5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            l: -10
        });
        this.pie6 = this.pie6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.tertiaryColor, {
            l: -10
        });
        this.pie7 = this.pie7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60,
            l: -10
        });
        this.pie8 = this.pie8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60,
            l: -10
        });
        this.pie9 = this.pie9 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120,
            l: 0
        });
        this.pie10 = this.pie10 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60,
            l: -20
        });
        this.pie11 = this.pie11 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60,
            l: -20
        });
        this.pie12 = this.pie12 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120,
            l: -10
        });
        this.pieTitleTextSize = this.pieTitleTextSize || "25px";
        this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor;
        this.pieSectionTextSize = this.pieSectionTextSize || "17px";
        this.pieSectionTextColor = this.pieSectionTextColor || this.textColor;
        this.pieLegendTextSize = this.pieLegendTextSize || "17px";
        this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor;
        this.pieStrokeColor = this.pieStrokeColor || "black";
        this.pieStrokeWidth = this.pieStrokeWidth || "2px";
        this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px";
        this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black";
        this.pieOpacity = this.pieOpacity || "0.7";
        this.venn1 = this.venn1 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            l: -30
        });
        this.venn2 = this.venn2 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            l: -30
        });
        this.venn3 = this.venn3 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.tertiaryColor, {
            l: -30
        });
        this.venn4 = this.venn4 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60,
            l: -30
        });
        this.venn5 = this.venn5 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60,
            l: -30
        });
        this.venn6 = this.venn6 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 60,
            l: -30
        });
        this.venn7 = this.venn7 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120,
            l: -30
        });
        this.venn8 = this.venn8 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 120,
            l: -30
        });
        this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor;
        this.vennSetTextColor = this.vennSetTextColor ?? this.textColor;
        this.cynefin = {
            domainFontSize: this.cynefin?.domainFontSize || 16,
            itemFontSize: this.cynefin?.itemFontSize || 12,
            boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
            boundaryWidth: this.cynefin?.boundaryWidth || 2,
            cliffColor: this.cynefin?.cliffColor || "#8B0000",
            cliffWidth: this.cynefin?.cliffWidth || 4,
            arrowColor: this.cynefin?.arrowColor || this.lineColor,
            arrowWidth: this.cynefin?.arrowWidth || 2,
            complexBg: this.cynefin?.complexBg || "#E8F5E9",
            complicatedBg: this.cynefin?.complicatedBg || "#E3F2FD",
            chaoticBg: this.cynefin?.chaoticBg || "#FBE9E7",
            clearBg: this.cynefin?.clearBg || "#FFF8E1",
            confusionBg: this.cynefin?.confusionBg || "#F3E5F5",
            textColor: this.cynefin?.textColor || this.textColor,
            labelColor: this.cynefin?.labelColor || this.primaryTextColor
        };
        this.radar = {
            axisColor: this.radar?.axisColor || this.lineColor,
            axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
            axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
            curveOpacity: this.radar?.curveOpacity || 0.5,
            curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
            graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
            graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
            graticuleOpacity: this.radar?.graticuleOpacity || 0.3,
            legendBoxSize: this.radar?.legendBoxSize || 12,
            legendFontSize: this.radar?.legendFontSize || 12
        };
        this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545";
        this.wardley = {
            backgroundColor: this.wardley?.backgroundColor || this.background,
            axisColor: this.wardley?.axisColor || this.lineColor,
            axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
            gridColor: this.wardley?.gridColor || this.gridColor,
            componentFill: this.wardley?.componentFill || this.background,
            componentStroke: this.wardley?.componentStroke || this.lineColor,
            componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
            linkStroke: this.wardley?.linkStroke || this.lineColor,
            evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
            annotationStroke: this.wardley?.annotationStroke || this.lineColor,
            annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
            annotationFill: this.wardley?.annotationFill || this.background
        };
        this.archEdgeColor = this.archEdgeColor || "#777";
        this.archEdgeArrowColor = this.archEdgeArrowColor || "#777";
        this.archEdgeWidth = this.archEdgeWidth || "3";
        this.archGroupBorderColor = this.archGroupBorderColor || "#000";
        this.archGroupBorderWidth = this.archGroupBorderWidth || "2px";
        this.quadrant1Fill = this.quadrant1Fill || this.primaryColor;
        this.quadrant2Fill = this.quadrant2Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 5,
            g: 5,
            b: 5
        });
        this.quadrant3Fill = this.quadrant3Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 10,
            g: 10,
            b: 10
        });
        this.quadrant4Fill = this.quadrant4Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 15,
            g: 15,
            b: 15
        });
        this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor;
        this.quadrant2TextFill = this.quadrant2TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -5,
            g: -5,
            b: -5
        });
        this.quadrant3TextFill = this.quadrant3TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -10,
            g: -10,
            b: -10
        });
        this.quadrant4TextFill = this.quadrant4TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -15,
            g: -15,
            b: -15
        });
        this.quadrantPointFill = this.quadrantPointFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$is_dark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__isDark$3e$__["isDark"])(this.quadrant1Fill) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.quadrant1Fill) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.quadrant1Fill);
        this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor;
        this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor;
        this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor;
        this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor;
        this.xyChart = {
            backgroundColor: this.xyChart?.backgroundColor || this.background,
            titleColor: this.xyChart?.titleColor || this.primaryTextColor,
            dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
            legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
            xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
            xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
            xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
            xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
            yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
            yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
            yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
            yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
            plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
        };
        this.requirementBackground = this.requirementBackground || this.primaryColor;
        this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor;
        this.requirementBorderSize = this.requirementBorderSize || "1";
        this.requirementTextColor = this.requirementTextColor || this.primaryTextColor;
        this.relationColor = this.relationColor || this.lineColor;
        this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 30) : this.secondaryColor);
        this.relationLabelColor = this.relationLabelColor || this.actorTextColor;
        this.git0 = this.git0 || this.primaryColor;
        this.git1 = this.git1 || this.secondaryColor;
        this.git2 = this.git2 || this.tertiaryColor;
        this.git3 = this.git3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -30
        });
        this.git4 = this.git4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60
        });
        this.git5 = this.git5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -90
        });
        this.git6 = this.git6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60
        });
        this.git7 = this.git7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120
        });
        if (this.darkMode) {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git7, 25);
        } else {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git7, 25);
        }
        this.gitInv0 = this.gitInv0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git0);
        this.gitInv1 = this.gitInv1 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git1);
        this.gitInv2 = this.gitInv2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git2);
        this.gitInv3 = this.gitInv3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git3);
        this.gitInv4 = this.gitInv4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git4);
        this.gitInv5 = this.gitInv5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git5);
        this.gitInv6 = this.gitInv6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git6);
        this.gitInv7 = this.gitInv7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git7);
        this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor);
        this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor;
        this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor;
        this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor;
        this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor;
        this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor;
        this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor;
        this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor;
        this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor;
        this.tagLabelColor = this.tagLabelColor || this.primaryTextColor;
        this.tagLabelBackground = this.tagLabelBackground || this.primaryColor;
        this.tagLabelBorder = this.tagBorder || this.primaryBorderColor;
        this.tagLabelFontSize = this.tagLabelFontSize || "10px";
        this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor;
        this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor;
        this.commitLabelFontSize = this.commitLabelFontSize || "10px";
        this.emUiFill = this.emUiFill || "white";
        this.emUiStroke = this.emUiStroke || "#dbdada";
        this.emProcessorFill = this.emProcessorFill || "#edb3f6";
        this.emProcessorStroke = this.emProcessorStroke || "#b88cbf";
        this.emReadModelFill = this.emReadModelFill || "#d3f1a2";
        this.emReadModelStroke = this.emReadModelStroke || "#a3b732";
        this.emCommandFill = this.emCommandFill || "#bcd6fe";
        this.emCommandStroke = this.emCommandStroke || "#679ac3";
        this.emEventFill = this.emEventFill || "#ffb778";
        this.emEventStroke = this.emEventStroke || "#c19a0f";
        this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)";
        this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)";
        this.emArrowhead = this.emArrowhead || this.lineColor;
        this.emRelationStroke = this.emRelationStroke || this.lineColor;
        this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || oldAttributeBackgroundColorOdd;
        this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || oldAttributeBackgroundColorEven;
        this.gradientStart = this.primaryBorderColor;
        this.gradientStop = this.secondaryBorderColor;
    }
    calculate(overrides) {
        if (typeof overrides !== "object") {
            this.updateColors();
            return;
        }
        const keys = Object.keys(overrides);
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
        this.updateColors();
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
    }
};
var getThemeVariables = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((userOverrides)=>{
    const theme = new Theme();
    theme.calculate(userOverrides);
    return theme;
}, "getThemeVariables");
;
var Theme2 = class {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "Theme");
    }
    constructor(){
        this.background = "#333";
        this.primaryColor = "#1f2020";
        this.secondaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.primaryColor, 16);
        this.tertiaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -160
        });
        this.primaryBorderColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.secondaryBorderColor = mkBorder(this.secondaryColor, this.darkMode);
        this.tertiaryBorderColor = mkBorder(this.tertiaryColor, this.darkMode);
        this.primaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.primaryColor);
        this.secondaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.secondaryColor);
        this.tertiaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.tertiaryColor);
        this.lineColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.textColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.mainBkg = "#1f2020";
        this.secondBkg = "calculated";
        this.mainContrastColor = "lightgrey";
        this.darkTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])("#323D47"), 10);
        this.lineColor = "calculated";
        this.border1 = "#ccc";
        this.border2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$rgba$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__rgba$3e$__["rgba"])(255, 255, 255, 0.25);
        this.arrowheadColor = "calculated";
        this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif';
        this.fontSize = "16px";
        this.labelBackground = "#181818";
        this.textColor = "#ccc";
        this.THEME_COLOR_LIMIT = 12;
        this.radius = 5;
        this.strokeWidth = 1;
        this.nodeBkg = "calculated";
        this.nodeBorder = "calculated";
        this.clusterBkg = "calculated";
        this.clusterBorder = "calculated";
        this.defaultLinkColor = "calculated";
        this.titleColor = "#F9FFFE";
        this.edgeLabelBackground = "calculated";
        this.actorBorder = "calculated";
        this.actorBkg = "calculated";
        this.actorTextColor = "calculated";
        this.actorLineColor = "calculated";
        this.signalColor = "calculated";
        this.signalTextColor = "calculated";
        this.labelBoxBkgColor = "calculated";
        this.labelBoxBorderColor = "calculated";
        this.labelTextColor = "calculated";
        this.loopTextColor = "calculated";
        this.noteBorderColor = "calculated";
        this.noteBkgColor = "#fff5ad";
        this.noteTextColor = "calculated";
        this.activationBorderColor = "calculated";
        this.activationBkgColor = "calculated";
        this.sequenceNumberColor = "black";
        this.clusterBkg = "#302F3D";
        this.sectionBkgColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])("#EAE8D9", 30);
        this.altSectionBkgColor = "calculated";
        this.sectionBkgColor2 = "#EAE8D9";
        this.excludeBkgColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.sectionBkgColor, 10);
        this.taskBorderColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$rgba$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__rgba$3e$__["rgba"])(255, 255, 255, 70);
        this.taskBkgColor = "calculated";
        this.taskTextColor = "calculated";
        this.taskTextLightColor = "calculated";
        this.taskTextOutsideColor = "calculated";
        this.taskTextClickableColor = "#003163";
        this.activeTaskBorderColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$rgba$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__rgba$3e$__["rgba"])(255, 255, 255, 50);
        this.activeTaskBkgColor = "#81B1DB";
        this.gridColor = "calculated";
        this.doneTaskBkgColor = "calculated";
        this.doneTaskBorderColor = "grey";
        this.critBorderColor = "#E83737";
        this.critBkgColor = "#E83737";
        this.taskTextDarkColor = "calculated";
        this.todayLineColor = "#DB5757";
        this.vertLineColor = "#00BFFF";
        this.personBorder = this.primaryBorderColor;
        this.personBkg = this.mainBkg;
        this.archEdgeColor = "calculated";
        this.archEdgeArrowColor = "calculated";
        this.archEdgeWidth = "3";
        this.archGroupBorderColor = this.primaryBorderColor;
        this.archGroupBorderWidth = "2px";
        this.rowOdd = this.rowOdd || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.mainBkg, 5) || "#ffffff";
        this.rowEven = this.rowEven || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.mainBkg, 10);
        this.labelColor = "calculated";
        this.errorBkgColor = "#a44141";
        this.errorTextColor = "#ddd";
        this.useGradient = true;
        this.gradientStart = this.primaryBorderColor;
        this.gradientStop = this.secondaryBorderColor;
        this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))";
        this.noteFontWeight = this.noteFontWeight || "normal";
        this.fontWeight = this.fontWeight || "normal";
    }
    updateColors() {
        this.secondBkg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.mainBkg, 16);
        this.lineColor = this.mainContrastColor;
        this.arrowheadColor = this.mainContrastColor;
        this.nodeBkg = this.mainBkg;
        this.nodeBorder = this.border1;
        this.clusterBkg = this.secondBkg;
        this.clusterBorder = this.border2;
        this.defaultLinkColor = this.lineColor;
        this.edgeLabelBackground = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.labelBackground, 25);
        this.actorBorder = this.border1;
        this.actorBkg = this.mainBkg;
        this.actorTextColor = this.mainContrastColor;
        this.actorLineColor = this.actorBorder;
        this.signalColor = this.mainContrastColor;
        this.signalTextColor = this.mainContrastColor;
        this.labelBoxBkgColor = this.actorBkg;
        this.labelBoxBorderColor = this.actorBorder;
        this.labelTextColor = this.mainContrastColor;
        this.loopTextColor = this.mainContrastColor;
        this.noteBorderColor = this.secondaryBorderColor;
        this.noteBkgColor = this.secondBkg;
        this.noteTextColor = this.secondaryTextColor;
        this.activationBorderColor = this.border1;
        this.activationBkgColor = this.secondBkg;
        this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
        this.altSectionBkgColor = this.background;
        this.taskBkgColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.mainBkg, 23);
        this.taskTextColor = this.darkTextColor;
        this.taskTextLightColor = this.mainContrastColor;
        this.taskTextOutsideColor = this.taskTextLightColor;
        this.gridColor = this.mainContrastColor;
        this.doneTaskBkgColor = this.mainContrastColor;
        this.taskTextDarkColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.doneTaskBkgColor);
        this.archEdgeColor = this.lineColor;
        this.archEdgeArrowColor = this.lineColor;
        this.transitionColor = this.transitionColor || this.lineColor;
        this.transitionLabelColor = this.transitionLabelColor || this.textColor;
        this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor;
        this.stateBkg = this.stateBkg || this.mainBkg;
        this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg;
        this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor;
        this.altBackground = this.altBackground || "#555";
        this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg;
        this.compositeBorder = this.compositeBorder || this.nodeBorder;
        this.innerEndBackground = this.primaryBorderColor;
        this.specialStateColor = "#f4f4f4";
        this.errorBkgColor = this.errorBkgColor || this.tertiaryColor;
        this.errorTextColor = this.errorTextColor || this.tertiaryTextColor;
        this.fillType0 = this.primaryColor;
        this.fillType1 = this.secondaryColor;
        this.fillType2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 64
        });
        this.fillType3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 64
        });
        this.fillType4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -64
        });
        this.fillType5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: -64
        });
        this.fillType6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 128
        });
        this.fillType7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 128
        });
        this.cScale1 = this.cScale1 || "#0b0000";
        this.cScale2 = this.cScale2 || "#4d1037";
        this.cScale3 = this.cScale3 || "#3f5258";
        this.cScale4 = this.cScale4 || "#4f2f1b";
        this.cScale5 = this.cScale5 || "#6e0a0a";
        this.cScale6 = this.cScale6 || "#3b0048";
        this.cScale7 = this.cScale7 || "#995a01";
        this.cScale8 = this.cScale8 || "#154706";
        this.cScale9 = this.cScale9 || "#161722";
        this.cScale10 = this.cScale10 || "#00296f";
        this.cScale11 = this.cScale11 || "#01629c";
        this.cScale12 = this.cScale12 || "#010029";
        this.cScale0 = this.cScale0 || this.primaryColor;
        this.cScale1 = this.cScale1 || this.secondaryColor;
        this.cScale2 = this.cScale2 || this.tertiaryColor;
        this.cScale3 = this.cScale3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 30
        });
        this.cScale4 = this.cScale4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60
        });
        this.cScale5 = this.cScale5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 90
        });
        this.cScale6 = this.cScale6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120
        });
        this.cScale7 = this.cScale7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 150
        });
        this.cScale8 = this.cScale8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 210
        });
        this.cScale9 = this.cScale9 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 270
        });
        this.cScale10 = this.cScale10 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 300
        });
        this.cScale11 = this.cScale11 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 330
        });
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleInv" + i] = this["cScaleInv" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this["cScale" + i]);
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this["cScale" + i], 10);
        }
        for(let i = 0; i < 5; i++){
            this["surface" + i] = this["surface" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 30,
                s: -30,
                l: -(-10 + i * 4)
            });
            this["surfacePeer" + i] = this["surfacePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 30,
                s: -30,
                l: -(-7 + i * 4)
            });
        }
        this.scaleLabelColor = this.scaleLabelColor || (this.darkMode ? "black" : this.labelTextColor);
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleLabel" + i] = this["cScaleLabel" + i] || this.scaleLabelColor;
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["pie" + i] = this["cScale" + i];
        }
        this.pieTitleTextSize = this.pieTitleTextSize || "25px";
        this.pieTitleTextColor = this.pieTitleTextColor || this.mainContrastColor;
        this.pieSectionTextSize = this.pieSectionTextSize || "17px";
        this.pieSectionTextColor = this.pieSectionTextColor || this.textColor;
        this.pieLegendTextSize = this.pieLegendTextSize || "17px";
        this.pieLegendTextColor = this.pieLegendTextColor || this.mainContrastColor;
        this.pieStrokeColor = this.pieStrokeColor || "black";
        this.pieStrokeWidth = this.pieStrokeWidth || "2px";
        this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px";
        this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black";
        this.pieOpacity = this.pieOpacity || "0.7";
        for(let i = 0; i < 8; i++){
            this["venn" + (i + 1)] = this["venn" + (i + 1)] ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this["cScale" + i], 30);
        }
        this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor;
        this.vennSetTextColor = this.vennSetTextColor ?? this.textColor;
        this.cynefin = {
            domainFontSize: this.cynefin?.domainFontSize || 16,
            itemFontSize: this.cynefin?.itemFontSize || 12,
            boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
            boundaryWidth: this.cynefin?.boundaryWidth || 2,
            cliffColor: this.cynefin?.cliffColor || "#FF6B6B",
            cliffWidth: this.cynefin?.cliffWidth || 4,
            arrowColor: this.cynefin?.arrowColor || this.lineColor,
            arrowWidth: this.cynefin?.arrowWidth || 2,
            complexBg: this.cynefin?.complexBg || "#1B5E20",
            complicatedBg: this.cynefin?.complicatedBg || "#0D47A1",
            chaoticBg: this.cynefin?.chaoticBg || "#BF360C",
            clearBg: this.cynefin?.clearBg || "#F57F17",
            confusionBg: this.cynefin?.confusionBg || "#4A148C",
            textColor: this.cynefin?.textColor || this.textColor,
            labelColor: this.cynefin?.labelColor || this.primaryTextColor
        };
        this.quadrant1Fill = this.quadrant1Fill || this.primaryColor;
        this.quadrant2Fill = this.quadrant2Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 5,
            g: 5,
            b: 5
        });
        this.quadrant3Fill = this.quadrant3Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 10,
            g: 10,
            b: 10
        });
        this.quadrant4Fill = this.quadrant4Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 15,
            g: 15,
            b: 15
        });
        this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor;
        this.quadrant2TextFill = this.quadrant2TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -5,
            g: -5,
            b: -5
        });
        this.quadrant3TextFill = this.quadrant3TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -10,
            g: -10,
            b: -10
        });
        this.quadrant4TextFill = this.quadrant4TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -15,
            g: -15,
            b: -15
        });
        this.quadrantPointFill = this.quadrantPointFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$is_dark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__isDark$3e$__["isDark"])(this.quadrant1Fill) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.quadrant1Fill) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.quadrant1Fill);
        this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor;
        this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor;
        this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor;
        this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor;
        this.xyChart = {
            backgroundColor: this.xyChart?.backgroundColor || this.background,
            titleColor: this.xyChart?.titleColor || this.primaryTextColor,
            dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
            legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
            xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
            xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
            xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
            xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
            yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
            yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
            yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
            yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
            plotColorPalette: this.xyChart?.plotColorPalette || "#3498db,#2ecc71,#e74c3c,#f1c40f,#bdc3c7,#ffffff,#34495e,#9b59b6,#1abc9c,#e67e22"
        };
        this.packet = {
            startByteColor: this.primaryTextColor,
            endByteColor: this.primaryTextColor,
            labelColor: this.primaryTextColor,
            titleColor: this.primaryTextColor,
            blockStrokeColor: this.primaryTextColor,
            blockFillColor: this.background
        };
        this.radar = {
            axisColor: this.radar?.axisColor || this.lineColor,
            axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
            axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
            curveOpacity: this.radar?.curveOpacity || 0.5,
            curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
            graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
            graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
            graticuleOpacity: this.radar?.graticuleOpacity || 0.3,
            legendBoxSize: this.radar?.legendBoxSize || 12,
            legendFontSize: this.radar?.legendFontSize || 12
        };
        this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#ff6b6b";
        this.wardley = {
            backgroundColor: this.wardley?.backgroundColor || this.background,
            axisColor: this.wardley?.axisColor || this.lineColor,
            axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
            gridColor: this.wardley?.gridColor || this.gridColor,
            componentFill: this.wardley?.componentFill || this.mainBkg,
            componentStroke: this.wardley?.componentStroke || this.lineColor,
            componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
            linkStroke: this.wardley?.linkStroke || this.lineColor,
            evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
            annotationStroke: this.wardley?.annotationStroke || this.lineColor,
            annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
            annotationFill: this.wardley?.annotationFill || this.mainBkg
        };
        this.classText = this.primaryTextColor;
        this.requirementBackground = this.requirementBackground || this.primaryColor;
        this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor;
        this.requirementBorderSize = this.requirementBorderSize || "1";
        this.requirementTextColor = this.requirementTextColor || this.primaryTextColor;
        this.relationColor = this.relationColor || this.lineColor;
        this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 30) : this.secondaryColor);
        this.relationLabelColor = this.relationLabelColor || this.actorTextColor;
        this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.secondaryColor, 20);
        this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.pie2 || this.secondaryColor, 20);
        this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.pie3 || this.tertiaryColor, 20);
        this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.pie4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -30
        }), 20);
        this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.pie5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60
        }), 20);
        this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.pie6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -90
        }), 10);
        this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.pie7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60
        }), 10);
        this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.pie8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120
        }), 20);
        this.gitInv0 = this.gitInv0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git0);
        this.gitInv1 = this.gitInv1 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git1);
        this.gitInv2 = this.gitInv2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git2);
        this.gitInv3 = this.gitInv3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git3);
        this.gitInv4 = this.gitInv4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git4);
        this.gitInv5 = this.gitInv5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git5);
        this.gitInv6 = this.gitInv6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git6);
        this.gitInv7 = this.gitInv7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git7);
        this.gitBranchLabel0 = this.gitBranchLabel0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.labelTextColor);
        this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor;
        this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor;
        this.gitBranchLabel3 = this.gitBranchLabel3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.labelTextColor);
        this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor;
        this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor;
        this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor;
        this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor;
        this.tagLabelColor = this.tagLabelColor || this.primaryTextColor;
        this.tagLabelBackground = this.tagLabelBackground || this.primaryColor;
        this.tagLabelBorder = this.tagBorder || this.primaryBorderColor;
        this.tagLabelFontSize = this.tagLabelFontSize || "10px";
        this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor;
        this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor;
        this.commitLabelFontSize = this.commitLabelFontSize || "10px";
        this.emUiFill = this.emUiFill || "#2d2d2d";
        this.emUiStroke = this.emUiStroke || "#555";
        this.emProcessorFill = this.emProcessorFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])("#5a3d5c", 10);
        this.emProcessorStroke = this.emProcessorStroke || "#8a6d8c";
        this.emReadModelFill = this.emReadModelFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])("#3d5a2d", 10);
        this.emReadModelStroke = this.emReadModelStroke || "#6d8c5c";
        this.emCommandFill = this.emCommandFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])("#2d3d5a", 10);
        this.emCommandStroke = this.emCommandStroke || "#5c6d8c";
        this.emEventFill = this.emEventFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])("#5a452d", 10);
        this.emEventStroke = this.emEventStroke || "#8c755c";
        this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.background, 5);
        this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.background, 12);
        this.emArrowhead = this.emArrowhead || this.lineColor;
        this.emRelationStroke = this.emRelationStroke || this.lineColor;
        this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.background, 12);
        this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.background, 2);
        this.nodeBorder = this.nodeBorder || "#999";
    }
    calculate(overrides) {
        if (typeof overrides !== "object") {
            this.updateColors();
            return;
        }
        const keys = Object.keys(overrides);
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
        this.updateColors();
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
    }
};
var getThemeVariables2 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((userOverrides)=>{
    const theme = new Theme2();
    theme.calculate(userOverrides);
    return theme;
}, "getThemeVariables");
;
var Theme3 = class {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "Theme");
    }
    constructor(){
        this.background = "#f4f4f4";
        this.primaryColor = "#ECECFF";
        this.secondaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120
        });
        this.secondaryColor = "#ffffde";
        this.tertiaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -160
        });
        this.primaryBorderColor = mkBorder(this.primaryColor, this.darkMode);
        this.secondaryBorderColor = mkBorder(this.secondaryColor, this.darkMode);
        this.tertiaryBorderColor = mkBorder(this.tertiaryColor, this.darkMode);
        this.primaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.primaryColor);
        this.secondaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.secondaryColor);
        this.tertiaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.tertiaryColor);
        this.lineColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.textColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.background = "white";
        this.mainBkg = "#ECECFF";
        this.secondBkg = "#ffffde";
        this.lineColor = "#333333";
        this.border1 = "#9370DB";
        this.primaryBorderColor = mkBorder(this.primaryColor, this.darkMode);
        this.border2 = "#aaaa33";
        this.arrowheadColor = "#333333";
        this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif';
        this.fontSize = "16px";
        this.labelBackground = "rgba(232,232,232, 0.8)";
        this.textColor = "#333";
        this.THEME_COLOR_LIMIT = 12;
        this.radius = 5;
        this.strokeWidth = 1;
        this.nodeBkg = "calculated";
        this.nodeBorder = "calculated";
        this.clusterBkg = "calculated";
        this.clusterBorder = "calculated";
        this.defaultLinkColor = "calculated";
        this.titleColor = "calculated";
        this.edgeLabelBackground = "calculated";
        this.actorBorder = "calculated";
        this.actorBkg = "calculated";
        this.actorTextColor = "black";
        this.actorLineColor = "calculated";
        this.signalColor = "calculated";
        this.signalTextColor = "calculated";
        this.labelBoxBkgColor = "calculated";
        this.labelBoxBorderColor = "calculated";
        this.labelTextColor = "calculated";
        this.loopTextColor = "calculated";
        this.noteBorderColor = "calculated";
        this.noteBkgColor = "#fff5ad";
        this.noteTextColor = "calculated";
        this.activationBorderColor = "#666";
        this.activationBkgColor = "#f4f4f4";
        this.sequenceNumberColor = "white";
        this.clusterBkg = "#FBFBFF";
        this.sectionBkgColor = "calculated";
        this.altSectionBkgColor = "calculated";
        this.sectionBkgColor2 = "calculated";
        this.excludeBkgColor = "#eeeeee";
        this.taskBorderColor = "calculated";
        this.taskBkgColor = "calculated";
        this.taskTextLightColor = "calculated";
        this.taskTextColor = this.taskTextLightColor;
        this.taskTextDarkColor = "calculated";
        this.taskTextOutsideColor = this.taskTextDarkColor;
        this.taskTextClickableColor = "calculated";
        this.activeTaskBorderColor = "calculated";
        this.activeTaskBkgColor = "calculated";
        this.gridColor = "calculated";
        this.doneTaskBkgColor = "calculated";
        this.doneTaskBorderColor = "calculated";
        this.critBorderColor = "calculated";
        this.critBkgColor = "calculated";
        this.todayLineColor = "calculated";
        this.vertLineColor = "calculated";
        this.sectionBkgColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$rgba$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__rgba$3e$__["rgba"])(102, 102, 255, 0.49);
        this.altSectionBkgColor = "white";
        this.sectionBkgColor2 = "#fff400";
        this.taskBorderColor = "#534fbc";
        this.taskBkgColor = "#8a90dd";
        this.taskTextLightColor = "white";
        this.taskTextColor = "calculated";
        this.taskTextDarkColor = "black";
        this.taskTextOutsideColor = "calculated";
        this.taskTextClickableColor = "#003163";
        this.activeTaskBorderColor = "#534fbc";
        this.activeTaskBkgColor = "#bfc7ff";
        this.gridColor = "lightgrey";
        this.doneTaskBkgColor = "lightgrey";
        this.doneTaskBorderColor = "grey";
        this.critBorderColor = "#ff8888";
        this.critBkgColor = "red";
        this.todayLineColor = "red";
        this.vertLineColor = "navy";
        this.noteFontWeight = this.noteFontWeight || "normal";
        this.fontWeight = this.fontWeight || "normal";
        this.personBorder = this.primaryBorderColor;
        this.personBkg = this.mainBkg;
        this.archEdgeColor = "calculated";
        this.archEdgeArrowColor = "calculated";
        this.archEdgeWidth = "3";
        this.archGroupBorderColor = this.primaryBorderColor;
        this.archGroupBorderWidth = "2px";
        this.rowOdd = "calculated";
        this.rowEven = "calculated";
        this.labelColor = "black";
        this.errorBkgColor = "#552222";
        this.errorTextColor = "#552222";
        this.useGradient = false;
        this.gradientStart = this.primaryBorderColor;
        this.gradientStop = this.secondaryBorderColor;
        this.dropShadow = "drop-shadow(1px 2px 2px rgba(185, 185, 185, 1))";
        this.updateColors();
    }
    updateColors() {
        this.cScale0 = this.cScale0 || this.primaryColor;
        this.cScale1 = this.cScale1 || this.secondaryColor;
        this.cScale2 = this.cScale2 || this.tertiaryColor;
        this.cScale3 = this.cScale3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 30
        });
        this.cScale4 = this.cScale4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60
        });
        this.cScale5 = this.cScale5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 90
        });
        this.cScale6 = this.cScale6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120
        });
        this.cScale7 = this.cScale7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 150
        });
        this.cScale8 = this.cScale8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 210
        });
        this.cScale9 = this.cScale9 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 270
        });
        this.cScale10 = this.cScale10 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 300
        });
        this.cScale11 = this.cScale11 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 330
        });
        this["cScalePeer1"] = this["cScalePeer1"] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 45);
        this["cScalePeer2"] = this["cScalePeer2"] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.tertiaryColor, 40);
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScale" + i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 10);
            this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 25);
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleInv" + i] = this["cScaleInv" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this["cScale" + i], {
                h: 180
            });
        }
        for(let i = 0; i < 5; i++){
            this["surface" + i] = this["surface" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 30,
                l: -(5 + i * 5)
            });
            this["surfacePeer" + i] = this["surfacePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 30,
                l: -(7 + i * 5)
            });
        }
        this.scaleLabelColor = this.scaleLabelColor !== "calculated" && this.scaleLabelColor ? this.scaleLabelColor : this.labelTextColor;
        if (this.labelTextColor !== "calculated") {
            this.cScaleLabel0 = this.cScaleLabel0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.labelTextColor);
            this.cScaleLabel3 = this.cScaleLabel3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.labelTextColor);
            for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
                this["cScaleLabel" + i] = this["cScaleLabel" + i] || this.labelTextColor;
            }
        }
        this.nodeBkg = this.mainBkg;
        this.nodeBorder = this.border1;
        this.clusterBkg = this.secondBkg;
        this.clusterBorder = this.border2;
        this.defaultLinkColor = this.lineColor;
        this.titleColor = this.textColor;
        this.edgeLabelBackground = this.labelBackground;
        this.actorBorder = this.border1;
        this.actorBkg = this.mainBkg;
        this.labelBoxBkgColor = this.actorBkg;
        this.signalColor = this.textColor;
        this.signalTextColor = this.textColor;
        this.labelBoxBorderColor = this.actorBorder;
        this.labelTextColor = this.actorTextColor;
        this.loopTextColor = this.actorTextColor;
        this.noteBorderColor = this.border2;
        this.noteTextColor = this.actorTextColor;
        this.actorLineColor = this.actorBorder;
        this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
        this.taskTextColor = this.taskTextLightColor;
        this.taskTextOutsideColor = this.taskTextDarkColor;
        this.archEdgeColor = this.lineColor;
        this.archEdgeArrowColor = this.lineColor;
        this.rowOdd = this.rowOdd || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.primaryColor, 75) || "#ffffff";
        this.rowEven = this.rowEven || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.primaryColor, 1);
        this.transitionColor = this.transitionColor || this.lineColor;
        this.transitionLabelColor = this.transitionLabelColor || this.textColor;
        this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor;
        this.stateBkg = this.stateBkg || this.mainBkg;
        this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg;
        this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor;
        this.altBackground = this.altBackground || "#f0f0f0";
        this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg;
        this.compositeBorder = this.compositeBorder || this.nodeBorder;
        this.innerEndBackground = this.nodeBorder;
        this.specialStateColor = this.lineColor;
        this.errorBkgColor = this.errorBkgColor || this.tertiaryColor;
        this.errorTextColor = this.errorTextColor || this.tertiaryTextColor;
        this.transitionColor = this.transitionColor || this.lineColor;
        this.classText = this.primaryTextColor;
        this.fillType0 = this.primaryColor;
        this.fillType1 = this.secondaryColor;
        this.fillType2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 64
        });
        this.fillType3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 64
        });
        this.fillType4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -64
        });
        this.fillType5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: -64
        });
        this.fillType6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 128
        });
        this.fillType7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 128
        });
        this.pie1 = this.pie1 || this.primaryColor;
        this.pie2 = this.pie2 || this.secondaryColor;
        this.pie3 = this.pie3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.tertiaryColor, {
            l: -40
        });
        this.pie4 = this.pie4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            l: -10
        });
        this.pie5 = this.pie5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            l: -30
        });
        this.pie6 = this.pie6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.tertiaryColor, {
            l: -20
        });
        this.pie7 = this.pie7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60,
            l: -20
        });
        this.pie8 = this.pie8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60,
            l: -40
        });
        this.pie9 = this.pie9 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120,
            l: -40
        });
        this.pie10 = this.pie10 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60,
            l: -40
        });
        this.pie11 = this.pie11 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -90,
            l: -40
        });
        this.pie12 = this.pie12 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120,
            l: -30
        });
        this.pieTitleTextSize = this.pieTitleTextSize || "25px";
        this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor;
        this.pieSectionTextSize = this.pieSectionTextSize || "17px";
        this.pieSectionTextColor = this.pieSectionTextColor || this.textColor;
        this.pieLegendTextSize = this.pieLegendTextSize || "17px";
        this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor;
        this.pieStrokeColor = this.pieStrokeColor || "black";
        this.pieStrokeWidth = this.pieStrokeWidth || "2px";
        this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px";
        this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black";
        this.pieOpacity = this.pieOpacity || "0.7";
        this.venn1 = this.venn1 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            l: -30
        });
        this.venn2 = this.venn2 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            l: -30
        });
        this.venn3 = this.venn3 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.tertiaryColor, {
            l: -40
        });
        this.venn4 = this.venn4 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60,
            l: -30
        });
        this.venn5 = this.venn5 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60,
            l: -30
        });
        this.venn6 = this.venn6 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 60,
            l: -30
        });
        this.venn7 = this.venn7 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120,
            l: -30
        });
        this.venn8 = this.venn8 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 120,
            l: -30
        });
        this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor;
        this.vennSetTextColor = this.vennSetTextColor ?? this.textColor;
        this.cynefin = {
            domainFontSize: this.cynefin?.domainFontSize || 16,
            itemFontSize: this.cynefin?.itemFontSize || 12,
            boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
            boundaryWidth: this.cynefin?.boundaryWidth || 2,
            cliffColor: this.cynefin?.cliffColor || "#8B0000",
            cliffWidth: this.cynefin?.cliffWidth || 4,
            arrowColor: this.cynefin?.arrowColor || this.lineColor,
            arrowWidth: this.cynefin?.arrowWidth || 2,
            complexBg: this.cynefin?.complexBg || "#E8F5E9",
            complicatedBg: this.cynefin?.complicatedBg || "#E3F2FD",
            chaoticBg: this.cynefin?.chaoticBg || "#FBE9E7",
            clearBg: this.cynefin?.clearBg || "#FFF8E1",
            confusionBg: this.cynefin?.confusionBg || "#F3E5F5",
            textColor: this.cynefin?.textColor || this.textColor,
            labelColor: this.cynefin?.labelColor || this.primaryTextColor
        };
        this.quadrant1Fill = this.quadrant1Fill || this.primaryColor;
        this.quadrant2Fill = this.quadrant2Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 5,
            g: 5,
            b: 5
        });
        this.quadrant3Fill = this.quadrant3Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 10,
            g: 10,
            b: 10
        });
        this.quadrant4Fill = this.quadrant4Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 15,
            g: 15,
            b: 15
        });
        this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor;
        this.quadrant2TextFill = this.quadrant2TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -5,
            g: -5,
            b: -5
        });
        this.quadrant3TextFill = this.quadrant3TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -10,
            g: -10,
            b: -10
        });
        this.quadrant4TextFill = this.quadrant4TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -15,
            g: -15,
            b: -15
        });
        this.quadrantPointFill = this.quadrantPointFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$is_dark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__isDark$3e$__["isDark"])(this.quadrant1Fill) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.quadrant1Fill) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.quadrant1Fill);
        this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor;
        this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor;
        this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor;
        this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor;
        this.radar = {
            axisColor: this.radar?.axisColor || this.lineColor,
            axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
            axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
            curveOpacity: this.radar?.curveOpacity || 0.5,
            curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
            graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
            graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
            graticuleOpacity: this.radar?.graticuleOpacity || 0.3,
            legendBoxSize: this.radar?.legendBoxSize || 12,
            legendFontSize: this.radar?.legendFontSize || 12
        };
        this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545";
        this.wardley = {
            backgroundColor: this.wardley?.backgroundColor || this.background,
            axisColor: this.wardley?.axisColor || this.lineColor,
            axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
            gridColor: this.wardley?.gridColor || this.gridColor,
            componentFill: this.wardley?.componentFill || this.background,
            componentStroke: this.wardley?.componentStroke || this.lineColor,
            componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
            linkStroke: this.wardley?.linkStroke || this.lineColor,
            evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
            annotationStroke: this.wardley?.annotationStroke || this.lineColor,
            annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
            annotationFill: this.wardley?.annotationFill || this.background
        };
        this.xyChart = {
            backgroundColor: this.xyChart?.backgroundColor || this.background,
            titleColor: this.xyChart?.titleColor || this.primaryTextColor,
            dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
            legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
            xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
            xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
            xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
            xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
            yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
            yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
            yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
            yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
            plotColorPalette: this.xyChart?.plotColorPalette || "#ECECFF,#8493A6,#FFC3A0,#DCDDE1,#B8E994,#D1A36F,#C3CDE6,#FFB6C1,#496078,#F8F3E3"
        };
        this.requirementBackground = this.requirementBackground || this.primaryColor;
        this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor;
        this.requirementBorderSize = this.requirementBorderSize || "1";
        this.requirementTextColor = this.requirementTextColor || this.primaryTextColor;
        this.relationColor = this.relationColor || this.lineColor;
        this.relationLabelBackground = this.relationLabelBackground || this.labelBackground;
        this.relationLabelColor = this.relationLabelColor || this.actorTextColor;
        this.git0 = this.git0 || this.primaryColor;
        this.git1 = this.git1 || this.secondaryColor;
        this.git2 = this.git2 || this.tertiaryColor;
        this.git3 = this.git3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -30
        });
        this.git4 = this.git4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60
        });
        this.git5 = this.git5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -90
        });
        this.git6 = this.git6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60
        });
        this.git7 = this.git7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120
        });
        if (this.darkMode) {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git7, 25);
        } else {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git7, 25);
        }
        this.gitInv0 = this.gitInv0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git0), 25);
        this.gitInv1 = this.gitInv1 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git1);
        this.gitInv2 = this.gitInv2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git2);
        this.gitInv3 = this.gitInv3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git3);
        this.gitInv4 = this.gitInv4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git4);
        this.gitInv5 = this.gitInv5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git5);
        this.gitInv6 = this.gitInv6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git6);
        this.gitInv7 = this.gitInv7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git7);
        this.gitBranchLabel0 = this.gitBranchLabel0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.labelTextColor);
        this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor;
        this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor;
        this.gitBranchLabel3 = this.gitBranchLabel3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.labelTextColor);
        this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor;
        this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor;
        this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor;
        this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor;
        this.tagLabelColor = this.tagLabelColor || this.primaryTextColor;
        this.tagLabelBackground = this.tagLabelBackground || this.primaryColor;
        this.tagLabelBorder = this.tagBorder || this.primaryBorderColor;
        this.tagLabelFontSize = this.tagLabelFontSize || "10px";
        this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor;
        this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor;
        this.commitLabelFontSize = this.commitLabelFontSize || "10px";
        this.emUiFill = this.emUiFill || "white";
        this.emUiStroke = this.emUiStroke || "#dbdada";
        this.emProcessorFill = this.emProcessorFill || "#edb3f6";
        this.emProcessorStroke = this.emProcessorStroke || "#b88cbf";
        this.emReadModelFill = this.emReadModelFill || "#d3f1a2";
        this.emReadModelStroke = this.emReadModelStroke || "#a3b732";
        this.emCommandFill = this.emCommandFill || "#bcd6fe";
        this.emCommandStroke = this.emCommandStroke || "#679ac3";
        this.emEventFill = this.emEventFill || "#ffb778";
        this.emEventStroke = this.emEventStroke || "#c19a0f";
        this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)";
        this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)";
        this.emArrowhead = this.emArrowhead || this.lineColor;
        this.emRelationStroke = this.emRelationStroke || this.lineColor;
        this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || oldAttributeBackgroundColorOdd;
        this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || oldAttributeBackgroundColorEven;
    }
    calculate(overrides) {
        Object.keys(this).forEach((k)=>{
            if (this[k] === "calculated") {
                this[k] = void 0;
            }
        });
        if (typeof overrides !== "object") {
            this.updateColors();
            return;
        }
        const keys = Object.keys(overrides);
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
        this.updateColors();
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
    }
};
var getThemeVariables3 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((userOverrides)=>{
    const theme = new Theme3();
    theme.calculate(userOverrides);
    return theme;
}, "getThemeVariables");
;
var Theme4 = class {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "Theme");
    }
    constructor(){
        this.background = "#f4f4f4";
        this.primaryColor = "#cde498";
        this.secondaryColor = "#cdffb2";
        this.background = "white";
        this.mainBkg = "#cde498";
        this.secondBkg = "#cdffb2";
        this.lineColor = "green";
        this.border1 = "#13540c";
        this.border2 = "#6eaa49";
        this.arrowheadColor = "green";
        this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif';
        this.fontSize = "16px";
        this.tertiaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])("#cde498", 10);
        this.primaryBorderColor = mkBorder(this.primaryColor, this.darkMode);
        this.secondaryBorderColor = mkBorder(this.secondaryColor, this.darkMode);
        this.tertiaryBorderColor = mkBorder(this.tertiaryColor, this.darkMode);
        this.primaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.primaryColor);
        this.secondaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.secondaryColor);
        this.tertiaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.primaryColor);
        this.lineColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.textColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.THEME_COLOR_LIMIT = 12;
        this.radius = 5;
        this.strokeWidth = 1;
        this.nodeBkg = "calculated";
        this.nodeBorder = "calculated";
        this.clusterBkg = "calculated";
        this.clusterBorder = "calculated";
        this.defaultLinkColor = "calculated";
        this.titleColor = "#333";
        this.edgeLabelBackground = "#e8e8e8";
        this.actorBorder = "calculated";
        this.actorBkg = "calculated";
        this.actorTextColor = "black";
        this.actorLineColor = "calculated";
        this.signalColor = "#333";
        this.signalTextColor = "#333";
        this.labelBoxBkgColor = "calculated";
        this.labelBoxBorderColor = "#326932";
        this.labelTextColor = "calculated";
        this.loopTextColor = "calculated";
        this.noteBorderColor = "calculated";
        this.noteBkgColor = "#fff5ad";
        this.noteTextColor = "calculated";
        this.activationBorderColor = "#666";
        this.activationBkgColor = "#f4f4f4";
        this.sequenceNumberColor = "white";
        this.sectionBkgColor = "#6eaa49";
        this.altSectionBkgColor = "white";
        this.sectionBkgColor2 = "#6eaa49";
        this.excludeBkgColor = "#eeeeee";
        this.taskBorderColor = "calculated";
        this.taskBkgColor = "#487e3a";
        this.taskTextLightColor = "white";
        this.taskTextColor = "calculated";
        this.taskTextDarkColor = "black";
        this.taskTextOutsideColor = "calculated";
        this.taskTextClickableColor = "#003163";
        this.activeTaskBorderColor = "calculated";
        this.activeTaskBkgColor = "calculated";
        this.gridColor = "lightgrey";
        this.doneTaskBkgColor = "lightgrey";
        this.doneTaskBorderColor = "grey";
        this.critBorderColor = "#ff8888";
        this.critBkgColor = "red";
        this.todayLineColor = "red";
        this.vertLineColor = "#00BFFF";
        this.personBorder = this.primaryBorderColor;
        this.personBkg = this.mainBkg;
        this.archEdgeColor = "calculated";
        this.archEdgeArrowColor = "calculated";
        this.archEdgeWidth = "3";
        this.archGroupBorderColor = this.primaryBorderColor;
        this.archGroupBorderWidth = "2px";
        this.noteFontWeight = "normal";
        this.fontWeight = "normal";
        this.labelColor = "black";
        this.errorBkgColor = "#552222";
        this.errorTextColor = "#552222";
        this.useGradient = true;
        this.gradientStart = this.primaryBorderColor;
        this.gradientStop = this.secondaryBorderColor;
        this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,0.5))";
    }
    updateColors() {
        this.actorBorder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.mainBkg, 20);
        this.actorBkg = this.mainBkg;
        this.labelBoxBkgColor = this.actorBkg;
        this.labelTextColor = this.actorTextColor;
        this.loopTextColor = this.actorTextColor;
        this.noteBorderColor = this.border2;
        this.noteTextColor = this.actorTextColor;
        this.actorLineColor = this.actorBorder;
        this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
        this.cScale0 = this.cScale0 || this.primaryColor;
        this.cScale1 = this.cScale1 || this.secondaryColor;
        this.cScale2 = this.cScale2 || this.tertiaryColor;
        this.cScale3 = this.cScale3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 30
        });
        this.cScale4 = this.cScale4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60
        });
        this.cScale5 = this.cScale5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 90
        });
        this.cScale6 = this.cScale6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120
        });
        this.cScale7 = this.cScale7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 150
        });
        this.cScale8 = this.cScale8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 210
        });
        this.cScale9 = this.cScale9 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 270
        });
        this.cScale10 = this.cScale10 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 300
        });
        this.cScale11 = this.cScale11 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 330
        });
        this["cScalePeer1"] = this["cScalePeer1"] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 45);
        this["cScalePeer2"] = this["cScalePeer2"] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.tertiaryColor, 40);
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScale" + i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 10);
            this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 25);
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleInv" + i] = this["cScaleInv" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this["cScale" + i], {
                h: 180
            });
        }
        this.scaleLabelColor = this.scaleLabelColor !== "calculated" && this.scaleLabelColor ? this.scaleLabelColor : this.labelTextColor;
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleLabel" + i] = this["cScaleLabel" + i] || this.scaleLabelColor;
        }
        for(let i = 0; i < 5; i++){
            this["surface" + i] = this["surface" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 30,
                s: -30,
                l: -(5 + i * 5)
            });
            this["surfacePeer" + i] = this["surfacePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 30,
                s: -30,
                l: -(8 + i * 5)
            });
        }
        this.nodeBkg = this.mainBkg;
        this.nodeBorder = this.border1;
        this.clusterBkg = this.secondBkg;
        this.clusterBorder = this.border2;
        this.defaultLinkColor = this.lineColor;
        this.taskBorderColor = this.border1;
        this.taskTextColor = this.taskTextLightColor;
        this.taskTextOutsideColor = this.taskTextDarkColor;
        this.activeTaskBorderColor = this.taskBorderColor;
        this.activeTaskBkgColor = this.mainBkg;
        this.archEdgeColor = this.lineColor;
        this.archEdgeArrowColor = this.lineColor;
        this.rowOdd = this.rowOdd || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.mainBkg, 75) || "#ffffff";
        this.rowEven = this.rowEven || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.mainBkg, 20);
        this.transitionColor = this.transitionColor || this.lineColor;
        this.transitionLabelColor = this.transitionLabelColor || this.textColor;
        this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor;
        this.stateBkg = this.stateBkg || this.mainBkg;
        this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg;
        this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor;
        this.altBackground = this.altBackground || "#f0f0f0";
        this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg;
        this.compositeBorder = this.compositeBorder || this.nodeBorder;
        this.innerEndBackground = this.primaryBorderColor;
        this.specialStateColor = this.lineColor;
        this.errorBkgColor = this.errorBkgColor || this.tertiaryColor;
        this.errorTextColor = this.errorTextColor || this.tertiaryTextColor;
        this.transitionColor = this.transitionColor || this.lineColor;
        this.classText = this.primaryTextColor;
        this.fillType0 = this.primaryColor;
        this.fillType1 = this.secondaryColor;
        this.fillType2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 64
        });
        this.fillType3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 64
        });
        this.fillType4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -64
        });
        this.fillType5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: -64
        });
        this.fillType6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 128
        });
        this.fillType7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 128
        });
        this.pie1 = this.pie1 || this.primaryColor;
        this.pie2 = this.pie2 || this.secondaryColor;
        this.pie3 = this.pie3 || this.tertiaryColor;
        this.pie4 = this.pie4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            l: -30
        });
        this.pie5 = this.pie5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            l: -30
        });
        this.pie6 = this.pie6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.tertiaryColor, {
            h: 40,
            l: -40
        });
        this.pie7 = this.pie7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60,
            l: -10
        });
        this.pie8 = this.pie8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60,
            l: -10
        });
        this.pie9 = this.pie9 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120,
            l: 0
        });
        this.pie10 = this.pie10 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60,
            l: -50
        });
        this.pie11 = this.pie11 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60,
            l: -50
        });
        this.pie12 = this.pie12 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120,
            l: -50
        });
        this.pieTitleTextSize = this.pieTitleTextSize || "25px";
        this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor;
        this.pieSectionTextSize = this.pieSectionTextSize || "17px";
        this.pieSectionTextColor = this.pieSectionTextColor || this.textColor;
        this.pieLegendTextSize = this.pieLegendTextSize || "17px";
        this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor;
        this.pieStrokeColor = this.pieStrokeColor || "black";
        this.pieStrokeWidth = this.pieStrokeWidth || "2px";
        this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px";
        this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black";
        this.pieOpacity = this.pieOpacity || "0.7";
        this.venn1 = this.venn1 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            l: -30
        });
        this.venn2 = this.venn2 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            l: -30
        });
        this.venn3 = this.venn3 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.tertiaryColor, {
            l: -30
        });
        this.venn4 = this.venn4 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60,
            l: -30
        });
        this.venn5 = this.venn5 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60,
            l: -30
        });
        this.venn6 = this.venn6 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 60,
            l: -30
        });
        this.venn7 = this.venn7 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120,
            l: -30
        });
        this.venn8 = this.venn8 ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 120,
            l: -30
        });
        this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor;
        this.vennSetTextColor = this.vennSetTextColor ?? this.textColor;
        this.cynefin = {
            domainFontSize: this.cynefin?.domainFontSize || 16,
            itemFontSize: this.cynefin?.itemFontSize || 12,
            boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
            boundaryWidth: this.cynefin?.boundaryWidth || 2,
            cliffColor: this.cynefin?.cliffColor || "#8B4513",
            cliffWidth: this.cynefin?.cliffWidth || 4,
            arrowColor: this.cynefin?.arrowColor || this.lineColor,
            arrowWidth: this.cynefin?.arrowWidth || 2,
            complexBg: this.cynefin?.complexBg || "#C8E6C9",
            complicatedBg: this.cynefin?.complicatedBg || "#DCEDC8",
            chaoticBg: this.cynefin?.chaoticBg || "#FFE0B2",
            clearBg: this.cynefin?.clearBg || "#FFF9C4",
            confusionBg: this.cynefin?.confusionBg || "#D7CCC8",
            textColor: this.cynefin?.textColor || this.textColor,
            labelColor: this.cynefin?.labelColor || this.primaryTextColor
        };
        this.quadrant1Fill = this.quadrant1Fill || this.primaryColor;
        this.quadrant2Fill = this.quadrant2Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 5,
            g: 5,
            b: 5
        });
        this.quadrant3Fill = this.quadrant3Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 10,
            g: 10,
            b: 10
        });
        this.quadrant4Fill = this.quadrant4Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 15,
            g: 15,
            b: 15
        });
        this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor;
        this.quadrant2TextFill = this.quadrant2TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -5,
            g: -5,
            b: -5
        });
        this.quadrant3TextFill = this.quadrant3TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -10,
            g: -10,
            b: -10
        });
        this.quadrant4TextFill = this.quadrant4TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -15,
            g: -15,
            b: -15
        });
        this.quadrantPointFill = this.quadrantPointFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$is_dark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__isDark$3e$__["isDark"])(this.quadrant1Fill) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.quadrant1Fill) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.quadrant1Fill);
        this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor;
        this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor;
        this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor;
        this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor;
        this.packet = {
            startByteColor: this.primaryTextColor,
            endByteColor: this.primaryTextColor,
            labelColor: this.primaryTextColor,
            titleColor: this.primaryTextColor,
            blockStrokeColor: this.primaryTextColor,
            blockFillColor: this.mainBkg
        };
        this.radar = {
            axisColor: this.radar?.axisColor || this.lineColor,
            axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
            axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
            curveOpacity: this.radar?.curveOpacity || 0.5,
            curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
            graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
            graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
            graticuleOpacity: this.radar?.graticuleOpacity || 0.3,
            legendBoxSize: this.radar?.legendBoxSize || 12,
            legendFontSize: this.radar?.legendFontSize || 12
        };
        this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545";
        this.wardley = {
            backgroundColor: this.wardley?.backgroundColor || this.background,
            axisColor: this.wardley?.axisColor || this.lineColor,
            axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
            gridColor: this.wardley?.gridColor || this.gridColor,
            componentFill: this.wardley?.componentFill || this.background,
            componentStroke: this.wardley?.componentStroke || this.lineColor,
            componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
            linkStroke: this.wardley?.linkStroke || this.lineColor,
            evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
            annotationStroke: this.wardley?.annotationStroke || this.lineColor,
            annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
            annotationFill: this.wardley?.annotationFill || this.background
        };
        this.xyChart = {
            backgroundColor: this.xyChart?.backgroundColor || this.background,
            titleColor: this.xyChart?.titleColor || this.primaryTextColor,
            dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
            legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
            xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
            xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
            xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
            xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
            yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
            yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
            yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
            yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
            plotColorPalette: this.xyChart?.plotColorPalette || "#CDE498,#FF6B6B,#A0D2DB,#D7BDE2,#F0F0F0,#FFC3A0,#7FD8BE,#FF9A8B,#FAF3E0,#FFF176"
        };
        this.requirementBackground = this.requirementBackground || this.primaryColor;
        this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor;
        this.requirementBorderSize = this.requirementBorderSize || "1";
        this.requirementTextColor = this.requirementTextColor || this.primaryTextColor;
        this.relationColor = this.relationColor || this.lineColor;
        this.relationLabelBackground = this.relationLabelBackground || this.edgeLabelBackground;
        this.relationLabelColor = this.relationLabelColor || this.actorTextColor;
        this.git0 = this.git0 || this.primaryColor;
        this.git1 = this.git1 || this.secondaryColor;
        this.git2 = this.git2 || this.tertiaryColor;
        this.git3 = this.git3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -30
        });
        this.git4 = this.git4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60
        });
        this.git5 = this.git5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -90
        });
        this.git6 = this.git6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60
        });
        this.git7 = this.git7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120
        });
        if (this.darkMode) {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git7, 25);
        } else {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git7, 25);
        }
        this.gitInv0 = this.gitInv0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git0);
        this.gitInv1 = this.gitInv1 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git1);
        this.gitInv2 = this.gitInv2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git2);
        this.gitInv3 = this.gitInv3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git3);
        this.gitInv4 = this.gitInv4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git4);
        this.gitInv5 = this.gitInv5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git5);
        this.gitInv6 = this.gitInv6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git6);
        this.gitInv7 = this.gitInv7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git7);
        this.gitBranchLabel0 = this.gitBranchLabel0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.labelTextColor);
        this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor;
        this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor;
        this.gitBranchLabel3 = this.gitBranchLabel3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.labelTextColor);
        this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor;
        this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor;
        this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor;
        this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor;
        this.tagLabelColor = this.tagLabelColor || this.primaryTextColor;
        this.tagLabelBackground = this.tagLabelBackground || this.primaryColor;
        this.tagLabelBorder = this.tagBorder || this.primaryBorderColor;
        this.tagLabelFontSize = this.tagLabelFontSize || "10px";
        this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor;
        this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor;
        this.commitLabelFontSize = this.commitLabelFontSize || "10px";
        this.emUiFill = this.emUiFill || "white";
        this.emUiStroke = this.emUiStroke || "#dbdada";
        this.emProcessorFill = this.emProcessorFill || "#edb3f6";
        this.emProcessorStroke = this.emProcessorStroke || "#b88cbf";
        this.emReadModelFill = this.emReadModelFill || "#d3f1a2";
        this.emReadModelStroke = this.emReadModelStroke || "#a3b732";
        this.emCommandFill = this.emCommandFill || "#bcd6fe";
        this.emCommandStroke = this.emCommandStroke || "#679ac3";
        this.emEventFill = this.emEventFill || "#ffb778";
        this.emEventStroke = this.emEventStroke || "#c19a0f";
        this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)";
        this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)";
        this.emArrowhead = this.emArrowhead || this.lineColor;
        this.emRelationStroke = this.emRelationStroke || this.lineColor;
        this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || oldAttributeBackgroundColorOdd;
        this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || oldAttributeBackgroundColorEven;
    }
    calculate(overrides) {
        if (typeof overrides !== "object") {
            this.updateColors();
            return;
        }
        const keys = Object.keys(overrides);
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
        this.updateColors();
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
    }
};
var getThemeVariables4 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((userOverrides)=>{
    const theme = new Theme4();
    theme.calculate(userOverrides);
    return theme;
}, "getThemeVariables");
;
var Theme5 = class {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "Theme");
    }
    constructor(){
        this.primaryColor = "#eee";
        this.contrast = "#707070";
        this.secondaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.contrast, 55);
        this.background = "#ffffff";
        this.tertiaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -160
        });
        this.primaryBorderColor = mkBorder(this.primaryColor, this.darkMode);
        this.secondaryBorderColor = mkBorder(this.secondaryColor, this.darkMode);
        this.tertiaryBorderColor = mkBorder(this.tertiaryColor, this.darkMode);
        this.primaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.primaryColor);
        this.secondaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.secondaryColor);
        this.tertiaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.tertiaryColor);
        this.lineColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.textColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.mainBkg = "#eee";
        this.secondBkg = "calculated";
        this.lineColor = "#666";
        this.border1 = "#999";
        this.border2 = "calculated";
        this.note = "#ffa";
        this.text = "#333";
        this.critical = "#d42";
        this.done = "#bbb";
        this.arrowheadColor = "#333333";
        this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif';
        this.fontSize = "16px";
        this.THEME_COLOR_LIMIT = 12;
        this.radius = 5;
        this.strokeWidth = 1;
        this.nodeBkg = "calculated";
        this.nodeBorder = "calculated";
        this.clusterBkg = "calculated";
        this.clusterBorder = "calculated";
        this.defaultLinkColor = "calculated";
        this.titleColor = "calculated";
        this.edgeLabelBackground = "white";
        this.actorBorder = "calculated";
        this.actorBkg = "calculated";
        this.actorTextColor = "calculated";
        this.actorLineColor = this.actorBorder;
        this.signalColor = "calculated";
        this.signalTextColor = "calculated";
        this.labelBoxBkgColor = "calculated";
        this.labelBoxBorderColor = "calculated";
        this.labelTextColor = "calculated";
        this.loopTextColor = "calculated";
        this.noteBorderColor = "calculated";
        this.noteBkgColor = "calculated";
        this.noteTextColor = "calculated";
        this.activationBorderColor = "#666";
        this.activationBkgColor = "#f4f4f4";
        this.sequenceNumberColor = "white";
        this.sectionBkgColor = "calculated";
        this.altSectionBkgColor = "white";
        this.sectionBkgColor2 = "calculated";
        this.excludeBkgColor = "#eeeeee";
        this.taskBorderColor = "calculated";
        this.taskBkgColor = "calculated";
        this.taskTextLightColor = "white";
        this.taskTextColor = "calculated";
        this.taskTextDarkColor = "calculated";
        this.taskTextOutsideColor = "calculated";
        this.taskTextClickableColor = "#003163";
        this.activeTaskBorderColor = "calculated";
        this.activeTaskBkgColor = "calculated";
        this.gridColor = "calculated";
        this.doneTaskBkgColor = "calculated";
        this.doneTaskBorderColor = "calculated";
        this.critBkgColor = "calculated";
        this.critBorderColor = "calculated";
        this.todayLineColor = "calculated";
        this.vertLineColor = "calculated";
        this.personBorder = this.primaryBorderColor;
        this.personBkg = this.mainBkg;
        this.archEdgeColor = "calculated";
        this.archEdgeArrowColor = "calculated";
        this.archEdgeWidth = "3";
        this.archGroupBorderColor = this.primaryBorderColor;
        this.archGroupBorderWidth = "2px";
        this.noteFontWeight = "normal";
        this.fontWeight = "normal";
        this.rowOdd = this.rowOdd || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.mainBkg, 75) || "#ffffff";
        this.rowEven = this.rowEven || "#f4f4f4";
        this.labelColor = "black";
        this.errorBkgColor = "#552222";
        this.errorTextColor = "#552222";
        this.useGradient = true;
        this.gradientStart = this.primaryBorderColor;
        this.gradientStop = this.secondaryBorderColor;
        this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))";
    }
    updateColors() {
        this.secondBkg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.contrast, 55);
        this.border2 = this.contrast;
        this.actorBorder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.border1, 23);
        this.actorBkg = this.mainBkg;
        this.actorTextColor = this.text;
        this.actorLineColor = this.actorBorder;
        this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
        this.signalColor = this.text;
        this.signalTextColor = this.text;
        this.labelBoxBkgColor = this.actorBkg;
        this.labelBoxBorderColor = this.actorBorder;
        this.labelTextColor = this.text;
        this.loopTextColor = this.text;
        this.noteBorderColor = "#999";
        this.noteBkgColor = "#666";
        this.noteTextColor = "#fff";
        this.cScale0 = this.cScale0 || "#555";
        this.cScale1 = this.cScale1 || "#F4F4F4";
        this.cScale2 = this.cScale2 || "#555";
        this.cScale3 = this.cScale3 || "#BBB";
        this.cScale4 = this.cScale4 || "#777";
        this.cScale5 = this.cScale5 || "#999";
        this.cScale6 = this.cScale6 || "#DDD";
        this.cScale7 = this.cScale7 || "#FFF";
        this.cScale8 = this.cScale8 || "#DDD";
        this.cScale9 = this.cScale9 || "#BBB";
        this.cScale10 = this.cScale10 || "#999";
        this.cScale11 = this.cScale11 || "#777";
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleInv" + i] = this["cScaleInv" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this["cScale" + i]);
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            if (this.darkMode) {
                this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this["cScale" + i], 10);
            } else {
                this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 10);
            }
        }
        this.scaleLabelColor = this.scaleLabelColor || (this.darkMode ? "black" : this.labelTextColor);
        this.cScaleLabel0 = this.cScaleLabel0 || this.cScale1;
        this.cScaleLabel2 = this.cScaleLabel2 || this.cScale1;
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleLabel" + i] = this["cScaleLabel" + i] || this.scaleLabelColor;
        }
        for(let i = 0; i < 5; i++){
            this["surface" + i] = this["surface" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                l: -(5 + i * 5)
            });
            this["surfacePeer" + i] = this["surfacePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                l: -(8 + i * 5)
            });
        }
        this.nodeBkg = this.mainBkg;
        this.nodeBorder = this.border1;
        this.clusterBkg = this.secondBkg;
        this.clusterBorder = this.border2;
        this.defaultLinkColor = this.lineColor;
        this.titleColor = this.text;
        this.sectionBkgColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.contrast, 30);
        this.sectionBkgColor2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.contrast, 30);
        this.taskBorderColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.contrast, 10);
        this.taskBkgColor = this.contrast;
        this.taskTextColor = this.taskTextLightColor;
        this.taskTextDarkColor = this.text;
        this.taskTextOutsideColor = this.taskTextDarkColor;
        this.activeTaskBorderColor = this.taskBorderColor;
        this.activeTaskBkgColor = this.mainBkg;
        this.gridColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.border1, 30);
        this.doneTaskBkgColor = this.done;
        this.doneTaskBorderColor = this.lineColor;
        this.critBkgColor = this.critical;
        this.critBorderColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.critBkgColor, 10);
        this.todayLineColor = this.critBkgColor;
        this.vertLineColor = this.critBkgColor;
        this.archEdgeColor = this.lineColor;
        this.archEdgeArrowColor = this.lineColor;
        this.transitionColor = this.transitionColor || "#000";
        this.transitionLabelColor = this.transitionLabelColor || this.textColor;
        this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor;
        this.stateBkg = this.stateBkg || this.mainBkg;
        this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg;
        this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor;
        this.altBackground = this.altBackground || "#f4f4f4";
        this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg;
        this.stateBorder = this.stateBorder || "#000";
        this.innerEndBackground = this.primaryBorderColor;
        this.specialStateColor = "#222";
        this.errorBkgColor = this.errorBkgColor || this.tertiaryColor;
        this.errorTextColor = this.errorTextColor || this.tertiaryTextColor;
        this.classText = this.primaryTextColor;
        this.fillType0 = this.primaryColor;
        this.fillType1 = this.secondaryColor;
        this.fillType2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 64
        });
        this.fillType3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 64
        });
        this.fillType4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -64
        });
        this.fillType5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: -64
        });
        this.fillType6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 128
        });
        this.fillType7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 128
        });
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["pie" + i] = this["cScale" + i];
        }
        this.pie12 = this.pie0;
        this.pieTitleTextSize = this.pieTitleTextSize || "25px";
        this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor;
        this.pieSectionTextSize = this.pieSectionTextSize || "17px";
        this.pieSectionTextColor = this.pieSectionTextColor || this.textColor;
        this.pieLegendTextSize = this.pieLegendTextSize || "17px";
        this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor;
        this.pieStrokeColor = this.pieStrokeColor || "black";
        this.pieStrokeWidth = this.pieStrokeWidth || "2px";
        this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px";
        this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black";
        this.pieOpacity = this.pieOpacity || "0.7";
        for(let i = 0; i < 8; i++){
            this["venn" + (i + 1)] = this["venn" + (i + 1)] ?? this["cScale" + i];
        }
        this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor;
        this.vennSetTextColor = this.vennSetTextColor ?? this.textColor;
        this.cynefin = {
            domainFontSize: this.cynefin?.domainFontSize || 16,
            itemFontSize: this.cynefin?.itemFontSize || 12,
            boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
            boundaryWidth: this.cynefin?.boundaryWidth || 2,
            cliffColor: this.cynefin?.cliffColor || "#8B0000",
            cliffWidth: this.cynefin?.cliffWidth || 4,
            arrowColor: this.cynefin?.arrowColor || this.lineColor,
            arrowWidth: this.cynefin?.arrowWidth || 2,
            complexBg: this.cynefin?.complexBg || "#E8F5E9",
            complicatedBg: this.cynefin?.complicatedBg || "#E3F2FD",
            chaoticBg: this.cynefin?.chaoticBg || "#FBE9E7",
            clearBg: this.cynefin?.clearBg || "#FFF8E1",
            confusionBg: this.cynefin?.confusionBg || "#F3E5F5",
            textColor: this.cynefin?.textColor || this.textColor,
            labelColor: this.cynefin?.labelColor || this.primaryTextColor
        };
        this.quadrant1Fill = this.quadrant1Fill || this.primaryColor;
        this.quadrant2Fill = this.quadrant2Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 5,
            g: 5,
            b: 5
        });
        this.quadrant3Fill = this.quadrant3Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 10,
            g: 10,
            b: 10
        });
        this.quadrant4Fill = this.quadrant4Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 15,
            g: 15,
            b: 15
        });
        this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor;
        this.quadrant2TextFill = this.quadrant2TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -5,
            g: -5,
            b: -5
        });
        this.quadrant3TextFill = this.quadrant3TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -10,
            g: -10,
            b: -10
        });
        this.quadrant4TextFill = this.quadrant4TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -15,
            g: -15,
            b: -15
        });
        this.quadrantPointFill = this.quadrantPointFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$is_dark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__isDark$3e$__["isDark"])(this.quadrant1Fill) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.quadrant1Fill) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.quadrant1Fill);
        this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor;
        this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor;
        this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor;
        this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor;
        this.xyChart = {
            backgroundColor: this.xyChart?.backgroundColor || this.background,
            titleColor: this.xyChart?.titleColor || this.primaryTextColor,
            dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
            legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
            xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
            xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
            xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
            xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
            yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
            yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
            yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
            yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
            plotColorPalette: this.xyChart?.plotColorPalette || "#EEE,#6BB8E4,#8ACB88,#C7ACD6,#E8DCC2,#FFB2A8,#FFF380,#7E8D91,#FFD8B1,#FAF3E0"
        };
        this.radar = {
            axisColor: this.radar?.axisColor || this.lineColor,
            axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
            axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
            curveOpacity: this.radar?.curveOpacity || 0.5,
            curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
            graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
            graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
            graticuleOpacity: this.radar?.graticuleOpacity || 0.3,
            legendBoxSize: this.radar?.legendBoxSize || 12,
            legendFontSize: this.radar?.legendFontSize || 12
        };
        this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545";
        this.wardley = {
            backgroundColor: this.wardley?.backgroundColor || this.background,
            axisColor: this.wardley?.axisColor || this.lineColor,
            axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
            gridColor: this.wardley?.gridColor || this.gridColor,
            componentFill: this.wardley?.componentFill || this.background,
            componentStroke: this.wardley?.componentStroke || this.lineColor,
            componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
            linkStroke: this.wardley?.linkStroke || this.lineColor,
            evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
            annotationStroke: this.wardley?.annotationStroke || this.lineColor,
            annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
            annotationFill: this.wardley?.annotationFill || this.background
        };
        this.requirementBackground = this.requirementBackground || this.primaryColor;
        this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor;
        this.requirementBorderSize = this.requirementBorderSize || "1";
        this.requirementTextColor = this.requirementTextColor || this.primaryTextColor;
        this.relationColor = this.relationColor || this.lineColor;
        this.relationLabelBackground = this.relationLabelBackground || this.edgeLabelBackground;
        this.relationLabelColor = this.relationLabelColor || this.actorTextColor;
        this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.pie1, 25) || this.primaryColor;
        this.git1 = this.pie2 || this.secondaryColor;
        this.git2 = this.pie3 || this.tertiaryColor;
        this.git3 = this.pie4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -30
        });
        this.git4 = this.pie5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60
        });
        this.git5 = this.pie6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -90
        });
        this.git6 = this.pie7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60
        });
        this.git7 = this.pie8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120
        });
        this.gitInv0 = this.gitInv0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git0);
        this.gitInv1 = this.gitInv1 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git1);
        this.gitInv2 = this.gitInv2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git2);
        this.gitInv3 = this.gitInv3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git3);
        this.gitInv4 = this.gitInv4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git4);
        this.gitInv5 = this.gitInv5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git5);
        this.gitInv6 = this.gitInv6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git6);
        this.gitInv7 = this.gitInv7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git7);
        this.branchLabelColor = this.branchLabelColor || this.labelTextColor;
        this.gitBranchLabel0 = this.branchLabelColor;
        this.gitBranchLabel1 = "white";
        this.gitBranchLabel2 = this.branchLabelColor;
        this.gitBranchLabel3 = "white";
        this.gitBranchLabel4 = this.branchLabelColor;
        this.gitBranchLabel5 = this.branchLabelColor;
        this.gitBranchLabel6 = this.branchLabelColor;
        this.gitBranchLabel7 = this.branchLabelColor;
        this.tagLabelColor = this.tagLabelColor || this.primaryTextColor;
        this.tagLabelBackground = this.tagLabelBackground || this.primaryColor;
        this.tagLabelBorder = this.tagBorder || this.primaryBorderColor;
        this.tagLabelFontSize = this.tagLabelFontSize || "10px";
        this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor;
        this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor;
        this.commitLabelFontSize = this.commitLabelFontSize || "10px";
        this.emUiFill = this.emUiFill || "white";
        this.emUiStroke = this.emUiStroke || "#dbdada";
        this.emProcessorFill = this.emProcessorFill || "#edb3f6";
        this.emProcessorStroke = this.emProcessorStroke || "#b88cbf";
        this.emReadModelFill = this.emReadModelFill || "#d3f1a2";
        this.emReadModelStroke = this.emReadModelStroke || "#a3b732";
        this.emCommandFill = this.emCommandFill || "#bcd6fe";
        this.emCommandStroke = this.emCommandStroke || "#679ac3";
        this.emEventFill = this.emEventFill || "#ffb778";
        this.emEventStroke = this.emEventStroke || "#c19a0f";
        this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)";
        this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)";
        this.emArrowhead = this.emArrowhead || this.lineColor;
        this.emRelationStroke = this.emRelationStroke || this.lineColor;
        this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || oldAttributeBackgroundColorOdd;
        this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || oldAttributeBackgroundColorEven;
    }
    calculate(overrides) {
        if (typeof overrides !== "object") {
            this.updateColors();
            return;
        }
        const keys = Object.keys(overrides);
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
        this.updateColors();
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
    }
};
var getThemeVariables5 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((userOverrides)=>{
    const theme = new Theme5();
    theme.calculate(userOverrides);
    return theme;
}, "getThemeVariables");
;
var Theme6 = class {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "Theme");
    }
    constructor(){
        this.background = "#ffffff";
        this.primaryColor = "#cccccc";
        this.mainBkg = "#ffffff";
        this.noteBkgColor = "#fff5ad";
        this.noteTextColor = "#333";
        this.THEME_COLOR_LIMIT = 12;
        this.radius = 3;
        this.strokeWidth = 2;
        this.primaryBorderColor = mkBorder(this.primaryColor, this.darkMode);
        this.fontFamily = "arial, sans-serif";
        this.fontSize = "14px";
        this.nodeBorder = "#000000";
        this.stateBorder = "#000000";
        this.useGradient = true;
        this.gradientStart = "#0042eb";
        this.gradientStop = "#eb0042";
        this.dropShadow = "drop-shadow( 0px 1px 2px rgba(0, 0, 0, 0.25));";
        this.tertiaryColor = "#ffffff";
        this.archEdgeColor = "calculated";
        this.archEdgeArrowColor = "calculated";
        this.archEdgeWidth = "3";
        this.archGroupBorderColor = this.primaryBorderColor;
        this.archGroupBorderWidth = "2px";
        this.noteFontWeight = "normal";
        this.fontWeight = "normal";
    }
    updateColors() {
        this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333");
        this.secondaryColor = this.secondaryColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -120
        });
        this.tertiaryColor = this.tertiaryColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 180,
            l: 5
        });
        this.primaryBorderColor = this.primaryBorderColor || mkBorder(this.primaryColor, this.darkMode);
        this.secondaryBorderColor = this.secondaryBorderColor || mkBorder(this.secondaryColor, this.darkMode);
        this.tertiaryBorderColor = this.tertiaryBorderColor || mkBorder(this.tertiaryColor, this.darkMode);
        this.noteBorderColor = this.noteBorderColor || mkBorder(this.noteBkgColor, this.darkMode);
        this.noteBkgColor = this.noteBkgColor || "#fff5ad";
        this.noteTextColor = this.noteTextColor || "#333";
        this.secondaryTextColor = this.secondaryTextColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.secondaryColor);
        this.tertiaryTextColor = this.tertiaryTextColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.tertiaryColor);
        this.lineColor = this.lineColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.arrowheadColor = this.arrowheadColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.textColor = this.textColor || this.primaryTextColor;
        this.border2 = this.border2 || this.tertiaryBorderColor;
        this.nodeBkg = this.nodeBkg || this.primaryColor;
        this.mainBkg = this.mainBkg || this.primaryColor;
        this.nodeBorder = this.nodeBorder || this.primaryBorderColor;
        this.clusterBkg = this.clusterBkg || this.tertiaryColor;
        this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor;
        this.defaultLinkColor = this.defaultLinkColor || this.lineColor;
        this.titleColor = this.titleColor || this.tertiaryTextColor;
        this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 30) : this.secondaryColor);
        this.nodeTextColor = this.nodeTextColor || this.primaryTextColor;
        this.actorBorder = this.actorBorder || this.primaryBorderColor;
        this.actorBkg = this.actorBkg || this.mainBkg;
        this.actorTextColor = this.actorTextColor || this.primaryTextColor;
        this.actorLineColor = this.actorLineColor || this.actorBorder;
        this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg;
        this.signalColor = this.signalColor || this.textColor;
        this.signalTextColor = this.signalTextColor || this.textColor;
        this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder;
        this.labelTextColor = this.labelTextColor || this.actorTextColor;
        this.loopTextColor = this.loopTextColor || this.actorTextColor;
        this.activationBorderColor = this.activationBorderColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 10);
        this.activationBkgColor = this.activationBkgColor || this.secondaryColor;
        this.sequenceNumberColor = this.sequenceNumberColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.lineColor);
        this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
        const primaryColor = "#ECECFE";
        const secondaryColor = "#E9E9F1";
        const tertiaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 180,
            l: 5
        });
        this.sectionBkgColor = this.sectionBkgColor || tertiaryColor;
        this.altSectionBkgColor = this.altSectionBkgColor || "white";
        this.sectionBkgColor = this.sectionBkgColor || secondaryColor;
        this.sectionBkgColor2 = this.sectionBkgColor2 || primaryColor;
        this.excludeBkgColor = this.excludeBkgColor || "#eeeeee";
        this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor;
        this.taskBkgColor = this.taskBkgColor || primaryColor;
        this.activeTaskBorderColor = this.activeTaskBorderColor || primaryColor;
        this.activeTaskBkgColor = this.activeTaskBkgColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(primaryColor, 23);
        this.gridColor = this.gridColor || "lightgrey";
        this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey";
        this.doneTaskBorderColor = this.doneTaskBorderColor || "grey";
        this.critBorderColor = this.critBorderColor || "#ff8888";
        this.critBkgColor = this.critBkgColor || "red";
        this.todayLineColor = this.todayLineColor || "red";
        this.taskTextColor = this.taskTextColor || this.textColor;
        this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor;
        this.vertLineColor = this.vertLineColor || this.primaryBorderColor;
        this.taskTextLightColor = this.taskTextLightColor || this.textColor;
        this.taskTextColor = this.taskTextColor || this.primaryTextColor;
        this.taskTextDarkColor = this.taskTextDarkColor || this.textColor;
        this.taskTextClickableColor = this.taskTextClickableColor || "#003163";
        this.archEdgeColor = this.lineColor;
        this.archEdgeArrowColor = this.lineColor;
        this.personBorder = this.personBorder || this.primaryBorderColor;
        this.personBkg = this.personBkg || this.mainBkg;
        this.transitionColor = this.transitionColor || this.lineColor;
        this.transitionLabelColor = this.transitionLabelColor || this.textColor;
        this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor;
        this.stateBkg = this.stateBkg || this.mainBkg;
        this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg;
        this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor;
        this.altBackground = this.altBackground || "#f0f0f0";
        this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg;
        this.compositeBorder = this.compositeBorder || this.nodeBorder;
        this.innerEndBackground = this.nodeBorder;
        this.errorBkgColor = this.errorBkgColor || this.tertiaryColor;
        this.errorTextColor = this.errorTextColor || this.tertiaryTextColor;
        this.transitionColor = this.transitionColor || this.lineColor;
        this.specialStateColor = this.lineColor;
        this.cScale0 = this.cScale0 || primaryColor;
        this.cScale1 = this.cScale1 || secondaryColor;
        this.cScale2 = this.cScale2 || tertiaryColor;
        this.cScale3 = this.cScale3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 30
        });
        this.cScale4 = this.cScale4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 60
        });
        this.cScale5 = this.cScale5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 90
        });
        this.cScale6 = this.cScale6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 120
        });
        this.cScale7 = this.cScale7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 150
        });
        this.cScale8 = this.cScale8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 210,
            l: 150
        });
        this.cScale9 = this.cScale9 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 270
        });
        this.cScale10 = this.cScale10 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 300
        });
        this.cScale11 = this.cScale11 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 330
        });
        if (this.darkMode) {
            for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
                this["cScale" + i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 75);
            }
        } else {
            for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
                this["cScale" + i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 25);
            }
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleInv" + i] = this["cScaleInv" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this["cScale" + i]);
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            if (this.darkMode) {
                this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this["cScale" + i], 10);
            } else {
                this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 10);
            }
        }
        this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleLabel" + i] = this["cScaleLabel" + i] || this.scaleLabelColor;
        }
        const multiplier = this.darkMode ? -4 : -1;
        for(let i = 0; i < 5; i++){
            this["surface" + i] = this["surface" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 180,
                s: -15,
                l: multiplier * (5 + i * 3)
            });
            this["surfacePeer" + i] = this["surfacePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 180,
                s: -15,
                l: multiplier * (8 + i * 3)
            });
        }
        this.classText = this.classText || this.textColor;
        this.fillType0 = this.fillType0 || primaryColor;
        this.fillType1 = this.fillType1 || secondaryColor;
        this.fillType2 = this.fillType2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 64
        });
        this.fillType3 = this.fillType3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(secondaryColor, {
            h: 64
        });
        this.fillType4 = this.fillType4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -64
        });
        this.fillType5 = this.fillType5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(secondaryColor, {
            h: -64
        });
        this.fillType6 = this.fillType6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 128
        });
        this.fillType7 = this.fillType7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(secondaryColor, {
            h: 128
        });
        this.pie1 = this.pie1 || primaryColor;
        this.pie2 = this.pie2 || secondaryColor;
        this.pie3 = this.pie3 || tertiaryColor;
        this.pie4 = this.pie4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            l: -10
        });
        this.pie5 = this.pie5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(secondaryColor, {
            l: -10
        });
        this.pie6 = this.pie6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(tertiaryColor, {
            l: -10
        });
        this.pie7 = this.pie7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 60,
            l: -10
        });
        this.pie8 = this.pie8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -60,
            l: -10
        });
        this.pie9 = this.pie9 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 120,
            l: 0
        });
        this.pie10 = this.pie10 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 60,
            l: -20
        });
        this.pie11 = this.pie11 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -60,
            l: -20
        });
        this.pie12 = this.pie12 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 120,
            l: -10
        });
        this.pieTitleTextSize = this.pieTitleTextSize || "25px";
        this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor;
        this.pieSectionTextSize = this.pieSectionTextSize || "17px";
        this.pieSectionTextColor = this.pieSectionTextColor || this.textColor;
        this.pieLegendTextSize = this.pieLegendTextSize || "17px";
        this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor;
        this.pieStrokeColor = this.pieStrokeColor || "black";
        this.pieStrokeWidth = this.pieStrokeWidth || "2px";
        this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px";
        this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black";
        this.pieOpacity = this.pieOpacity || "0.7";
        this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor;
        this.vennSetTextColor = this.vennSetTextColor ?? this.textColor;
        this.quadrant1Fill = this.quadrant1Fill || primaryColor;
        this.quadrant2Fill = this.quadrant2Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            r: 5,
            g: 5,
            b: 5
        });
        this.quadrant3Fill = this.quadrant3Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            r: 10,
            g: 10,
            b: 10
        });
        this.quadrant4Fill = this.quadrant4Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            r: 15,
            g: 15,
            b: 15
        });
        this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor;
        this.quadrant2TextFill = this.quadrant2TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -5,
            g: -5,
            b: -5
        });
        this.quadrant3TextFill = this.quadrant3TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -10,
            g: -10,
            b: -10
        });
        this.quadrant4TextFill = this.quadrant4TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -15,
            g: -15,
            b: -15
        });
        this.quadrantPointFill = this.quadrantPointFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$is_dark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__isDark$3e$__["isDark"])(this.quadrant1Fill) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.quadrant1Fill) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.quadrant1Fill);
        this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor;
        this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor;
        this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor;
        this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor;
        this.xyChart = {
            backgroundColor: this.xyChart?.backgroundColor || this.background,
            titleColor: this.xyChart?.titleColor || this.primaryTextColor,
            legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
            xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
            xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
            xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
            xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
            yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
            yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
            yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
            yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
            plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
        };
        this.requirementBackground = this.requirementBackground || primaryColor;
        this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor;
        this.requirementBorderSize = this.requirementBorderSize || "1";
        this.requirementTextColor = this.requirementTextColor || this.primaryTextColor;
        this.relationColor = this.relationColor || this.lineColor;
        this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 30) : this.secondaryColor);
        this.relationLabelColor = this.relationLabelColor || this.actorTextColor;
        this.git0 = this.git0 || primaryColor;
        this.git1 = this.git1 || secondaryColor;
        this.git2 = this.git2 || tertiaryColor;
        this.git3 = this.git3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -30
        });
        this.git4 = this.git4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -60
        });
        this.git5 = this.git5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -90
        });
        this.git6 = this.git6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 60
        });
        this.git7 = this.git7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 120
        });
        if (this.darkMode) {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git7, 25);
        } else {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git7, 25);
        }
        this.gitInv0 = this.gitInv0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git0);
        this.gitInv1 = this.gitInv1 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git1);
        this.gitInv2 = this.gitInv2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git2);
        this.gitInv3 = this.gitInv3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git3);
        this.gitInv4 = this.gitInv4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git4);
        this.gitInv5 = this.gitInv5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git5);
        this.gitInv6 = this.gitInv6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git6);
        this.gitInv7 = this.gitInv7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git7);
        this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor);
        this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor;
        this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor;
        this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor;
        this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor;
        this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor;
        this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor;
        this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor;
        this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor;
        this.tagLabelColor = this.tagLabelColor || this.primaryTextColor;
        this.tagLabelBackground = this.tagLabelBackground || this.primaryColor;
        this.tagLabelBorder = this.tagBorder || this.primaryBorderColor;
        this.tagLabelFontSize = this.tagLabelFontSize || "10px";
        this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor;
        this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor;
        this.commitLabelFontSize = this.commitLabelFontSize || "10px";
        this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || oldAttributeBackgroundColorOdd;
        this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || oldAttributeBackgroundColorEven;
    }
    calculate(overrides) {
        if (typeof overrides !== "object") {
            this.updateColors();
            return;
        }
        const keys = Object.keys(overrides);
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
        this.updateColors();
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
    }
};
var getThemeVariables6 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((userOverrides)=>{
    const theme = new Theme6();
    theme.calculate(userOverrides);
    return theme;
}, "getThemeVariables");
;
var Theme7 = class {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "Theme");
    }
    constructor(){
        this.background = "#333";
        this.primaryColor = "#1f2020";
        this.secondaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.primaryColor, 16);
        this.tertiaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -160
        });
        this.primaryBorderColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.secondaryBorderColor = mkBorder(this.secondaryColor, this.darkMode);
        this.tertiaryBorderColor = mkBorder(this.tertiaryColor, this.darkMode);
        this.primaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.primaryColor);
        this.secondaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.secondaryColor);
        this.tertiaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.tertiaryColor);
        this.mainBkg = "#2a2020";
        this.secondBkg = "calculated";
        this.mainContrastColor = "lightgrey";
        this.darkTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])("#323D47"), 10);
        this.border1 = "#ccc";
        this.border2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$rgba$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__rgba$3e$__["rgba"])(255, 255, 255, 0.25);
        this.arrowheadColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.fontFamily = "arial, sans-serif";
        this.fontSize = "14px";
        this.labelBackground = "#181818";
        this.textColor = "#ccc";
        this.THEME_COLOR_LIMIT = 12;
        this.radius = 3;
        this.strokeWidth = 1;
        this.noteBkgColor = "#fff5ad";
        this.noteTextColor = "#333";
        this.THEME_COLOR_LIMIT = 12;
        this.fontFamily = "arial, sans-serif";
        this.fontSize = "14px";
        this.useGradient = true;
        this.gradientStart = "#0042eb";
        this.gradientStop = "#eb0042";
        this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,0.2))";
        this.archEdgeColor = "calculated";
        this.archEdgeArrowColor = "calculated";
        this.archEdgeWidth = "3";
        this.archGroupBorderColor = this.primaryBorderColor;
        this.archGroupBorderWidth = "2px";
        this.noteFontWeight = "normal";
        this.fontWeight = "normal";
    }
    updateColors() {
        this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333");
        this.secondaryColor = this.secondaryColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -120
        });
        this.tertiaryColor = this.tertiaryColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 180,
            l: 5
        });
        this.primaryBorderColor = this.primaryBorderColor || mkBorder(this.primaryColor, this.darkMode);
        this.secondaryBorderColor = this.secondaryBorderColor || mkBorder(this.secondaryColor, this.darkMode);
        this.tertiaryBorderColor = this.tertiaryBorderColor || mkBorder(this.tertiaryColor, this.darkMode);
        this.noteBorderColor = this.noteBorderColor || mkBorder(this.noteBkgColor, this.darkMode);
        this.noteBkgColor = this.noteBkgColor || "#fff5ad";
        this.noteTextColor = this.noteTextColor || "#333";
        this.secondaryTextColor = this.secondaryTextColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.secondaryColor);
        this.tertiaryTextColor = this.tertiaryTextColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.tertiaryColor);
        this.lineColor = this.lineColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.arrowheadColor = this.arrowheadColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.textColor = this.textColor || this.primaryTextColor;
        this.border2 = this.border2 || this.tertiaryBorderColor;
        this.nodeBkg = this.nodeBkg || this.primaryColor;
        this.mainBkg = this.mainBkg || this.primaryColor;
        this.nodeBorder = this.nodeBorder || this.border1;
        this.clusterBkg = this.clusterBkg || this.tertiaryColor;
        this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor;
        this.defaultLinkColor = this.defaultLinkColor || this.lineColor;
        this.titleColor = this.titleColor || this.tertiaryTextColor;
        this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 30) : this.secondaryColor);
        this.nodeTextColor = this.nodeTextColor || this.primaryTextColor;
        this.actorBorder = this.actorBorder || this.primaryBorderColor;
        this.actorBkg = this.actorBkg || this.mainBkg;
        this.actorTextColor = this.actorTextColor || this.primaryTextColor;
        this.actorLineColor = this.actorLineColor || this.actorBorder;
        this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg;
        this.signalColor = this.signalColor || this.textColor;
        this.signalTextColor = this.signalTextColor || this.textColor;
        this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder;
        this.labelTextColor = this.labelTextColor || this.actorTextColor;
        this.loopTextColor = this.loopTextColor || this.actorTextColor;
        this.activationBorderColor = this.activationBorderColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 10);
        this.activationBkgColor = this.activationBkgColor || this.secondaryColor;
        this.sequenceNumberColor = this.sequenceNumberColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.lineColor);
        this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
        this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor;
        this.altSectionBkgColor = this.altSectionBkgColor || "white";
        this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor;
        this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor;
        this.excludeBkgColor = this.excludeBkgColor || "#eeeeee";
        this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor;
        this.taskBkgColor = this.taskBkgColor || this.primaryColor;
        this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor;
        this.activeTaskBkgColor = this.activeTaskBkgColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.primaryColor, 23);
        this.gridColor = this.gridColor || "lightgrey";
        this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey";
        this.doneTaskBorderColor = this.doneTaskBorderColor || "grey";
        this.critBorderColor = this.critBorderColor || "#ff8888";
        this.critBkgColor = this.critBkgColor || "red";
        this.todayLineColor = this.todayLineColor || "red";
        this.vertLineColor = this.vertLineColor || this.primaryBorderColor;
        this.taskTextColor = this.taskTextColor || this.textColor;
        this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor;
        this.taskTextLightColor = this.taskTextLightColor || this.textColor;
        this.taskTextColor = this.taskTextColor || this.primaryTextColor;
        this.taskTextDarkColor = this.taskTextDarkColor || this.textColor;
        this.taskTextClickableColor = this.taskTextClickableColor || "#003163";
        this.archEdgeColor = this.lineColor;
        this.archEdgeArrowColor = this.lineColor;
        this.personBorder = this.personBorder || this.primaryBorderColor;
        this.personBkg = this.personBkg || this.mainBkg;
        this.transitionColor = this.transitionColor || this.lineColor;
        this.transitionLabelColor = this.transitionLabelColor || this.textColor;
        this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor;
        this.stateBkg = this.stateBkg || this.mainBkg;
        this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg;
        this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor;
        this.altBackground = this.altBackground || "#f0f0f0";
        this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg;
        this.compositeBorder = this.compositeBorder || this.nodeBorder;
        this.innerEndBackground = this.nodeBorder;
        this.errorBkgColor = this.errorBkgColor || this.tertiaryColor;
        this.errorTextColor = this.errorTextColor || this.tertiaryTextColor;
        this.transitionColor = this.transitionColor || this.lineColor;
        this.specialStateColor = this.lineColor;
        this.cScale0 = this.cScale0 || this.primaryColor;
        this.cScale1 = this.cScale1 || this.secondaryColor;
        this.cScale2 = this.cScale2 || this.tertiaryColor;
        this.cScale3 = this.cScale3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 30
        });
        this.cScale4 = this.cScale4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60
        });
        this.cScale5 = this.cScale5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 90
        });
        this.cScale6 = this.cScale6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120
        });
        this.cScale7 = this.cScale7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 150
        });
        this.cScale8 = this.cScale8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 210,
            l: 150
        });
        this.cScale9 = this.cScale9 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 270
        });
        this.cScale10 = this.cScale10 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 300
        });
        this.cScale11 = this.cScale11 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 330
        });
        if (this.darkMode) {
            for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
                this["cScale" + i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 75);
            }
        } else {
            for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
                this["cScale" + i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 25);
            }
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleInv" + i] = this["cScaleInv" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this["cScale" + i]);
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            if (this.darkMode) {
                this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this["cScale" + i], 10);
            } else {
                this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 10);
            }
        }
        this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleLabel" + i] = this["cScaleLabel" + i] || this.scaleLabelColor;
        }
        const multiplier = this.darkMode ? -4 : -1;
        for(let i = 0; i < 5; i++){
            this["surface" + i] = this["surface" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 180,
                s: -15,
                l: multiplier * (5 + i * 3)
            });
            this["surfacePeer" + i] = this["surfacePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 180,
                s: -15,
                l: multiplier * (8 + i * 3)
            });
        }
        this.classText = this.classText || this.textColor;
        this.fillType0 = this.fillType0 || this.primaryColor;
        this.fillType1 = this.fillType1 || this.secondaryColor;
        this.fillType2 = this.fillType2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 64
        });
        this.fillType3 = this.fillType3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 64
        });
        this.fillType4 = this.fillType4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -64
        });
        this.fillType5 = this.fillType5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: -64
        });
        this.fillType6 = this.fillType6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 128
        });
        this.fillType7 = this.fillType7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 128
        });
        this.pie1 = this.pie1 || this.primaryColor;
        this.pie2 = this.pie2 || this.secondaryColor;
        this.pie3 = this.pie3 || this.tertiaryColor;
        this.pie4 = this.pie4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            l: -10
        });
        this.pie5 = this.pie5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            l: -10
        });
        this.pie6 = this.pie6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.tertiaryColor, {
            l: -10
        });
        this.pie7 = this.pie7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60,
            l: -10
        });
        this.pie8 = this.pie8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60,
            l: -10
        });
        this.pie9 = this.pie9 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120,
            l: 0
        });
        this.pie10 = this.pie10 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60,
            l: -20
        });
        this.pie11 = this.pie11 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60,
            l: -20
        });
        this.pie12 = this.pie12 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120,
            l: -10
        });
        this.pieTitleTextSize = this.pieTitleTextSize || "25px";
        this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor;
        this.pieSectionTextSize = this.pieSectionTextSize || "17px";
        this.pieSectionTextColor = this.pieSectionTextColor || this.textColor;
        this.pieLegendTextSize = this.pieLegendTextSize || "17px";
        this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor;
        this.pieStrokeColor = this.pieStrokeColor || "black";
        this.pieStrokeWidth = this.pieStrokeWidth || "2px";
        this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px";
        this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black";
        this.pieOpacity = this.pieOpacity || "0.7";
        this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor;
        this.vennSetTextColor = this.vennSetTextColor ?? this.textColor;
        this.quadrant1Fill = this.quadrant1Fill || this.primaryColor;
        this.quadrant2Fill = this.quadrant2Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 5,
            g: 5,
            b: 5
        });
        this.quadrant3Fill = this.quadrant3Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 10,
            g: 10,
            b: 10
        });
        this.quadrant4Fill = this.quadrant4Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 15,
            g: 15,
            b: 15
        });
        this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor;
        this.quadrant2TextFill = this.quadrant2TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -5,
            g: -5,
            b: -5
        });
        this.quadrant3TextFill = this.quadrant3TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -10,
            g: -10,
            b: -10
        });
        this.quadrant4TextFill = this.quadrant4TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -15,
            g: -15,
            b: -15
        });
        this.quadrantPointFill = this.quadrantPointFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$is_dark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__isDark$3e$__["isDark"])(this.quadrant1Fill) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.quadrant1Fill) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.quadrant1Fill);
        this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor;
        this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor;
        this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor;
        this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor;
        this.xyChart = {
            backgroundColor: this.xyChart?.backgroundColor || this.background,
            titleColor: this.xyChart?.titleColor || this.primaryTextColor,
            legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
            xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
            xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
            xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
            xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
            yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
            yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
            yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
            yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
            plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
        };
        this.requirementBackground = this.requirementBackground || this.primaryColor;
        this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor;
        this.requirementBorderSize = this.requirementBorderSize || "1";
        this.requirementTextColor = this.requirementTextColor || this.primaryTextColor;
        this.relationColor = this.relationColor || this.lineColor;
        this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 30) : this.secondaryColor);
        this.relationLabelColor = this.relationLabelColor || this.actorTextColor;
        this.git0 = this.git0 || "#0b0000";
        this.git1 = this.git1 || "#4d1037";
        this.git2 = this.git2 || "#3f5258";
        this.git3 = this.git3 || "#4f2f1b";
        this.git4 = this.git4 || "#6e0a0a";
        this.git5 = this.git5 || "#3b0048";
        this.git6 = this.git6 || "#995a01";
        this.git7 = this.git7 || "#154706";
        this.gitDarkMode = true;
        if (this.gitDarkMode) {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git7, 25);
        } else {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git7, 25);
        }
        this.gitInv0 = this.gitInv0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git0);
        this.gitInv1 = this.gitInv1 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git1);
        this.gitInv2 = this.gitInv2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git2);
        this.gitInv3 = this.gitInv3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git3);
        this.gitInv4 = this.gitInv4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git4);
        this.gitInv5 = this.gitInv5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git5);
        this.gitInv6 = this.gitInv6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git6);
        this.gitInv7 = this.gitInv7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git7);
        this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor);
        this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor;
        this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor;
        this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor;
        this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor;
        this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor;
        this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor;
        this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor;
        this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor;
        this.tagLabelColor = this.tagLabelColor || this.primaryTextColor;
        this.tagLabelBackground = this.tagLabelBackground || this.primaryColor;
        this.tagLabelBorder = this.tagBorder || this.primaryBorderColor;
        this.tagLabelFontSize = this.tagLabelFontSize || "10px";
        this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor;
        this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor;
        this.commitLabelFontSize = this.commitLabelFontSize || "10px";
        this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || oldAttributeBackgroundColorOdd;
        this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || oldAttributeBackgroundColorEven;
    }
    calculate(overrides) {
        if (typeof overrides !== "object") {
            this.updateColors();
            return;
        }
        const keys = Object.keys(overrides);
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
        this.updateColors();
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
    }
};
var getThemeVariables7 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((userOverrides)=>{
    const theme = new Theme7();
    theme.calculate(userOverrides);
    return theme;
}, "getThemeVariables");
;
var Theme8 = class {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "Theme");
    }
    constructor(){
        this.background = "#ffffff";
        this.primaryColor = "#cccccc";
        this.mainBkg = "#ffffff";
        this.noteBkgColor = "#fff5ad";
        this.noteTextColor = "#28253D";
        this.THEME_COLOR_LIMIT = 12;
        this.radius = 12;
        this.strokeWidth = 2;
        this.primaryBorderColor = mkBorder("#28253D", this.darkMode);
        this.fontFamily = '"Recursive Variable", arial, sans-serif';
        this.fontSize = "14px";
        this.nodeBorder = "#28253D";
        this.stateBorder = "#28253D";
        this.useGradient = false;
        this.gradientStart = "#0042eb";
        this.gradientStop = "#eb0042";
        this.dropShadow = "url(#drop-shadow)";
        this.nodeShadow = true;
        this.tertiaryColor = "#ffffff";
        this.clusterBkg = "#F9F9FB";
        this.clusterBorder = "#BDBCCC";
        this.noteBorderColor = "#FACC15";
        this.archEdgeColor = "calculated";
        this.archEdgeArrowColor = "calculated";
        this.archEdgeWidth = "3";
        this.archGroupBorderColor = this.primaryBorderColor;
        this.archGroupBorderWidth = "2px";
        this.actorBorder = "#28253D";
        this.filterColor = "#000000";
    }
    updateColors() {
        this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#28253D");
        this.secondaryColor = this.secondaryColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -120
        });
        this.tertiaryColor = this.tertiaryColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 180,
            l: 5
        });
        this.primaryBorderColor = this.primaryBorderColor || mkBorder(this.primaryColor, this.darkMode);
        this.secondaryBorderColor = this.secondaryBorderColor || mkBorder(this.secondaryColor, this.darkMode);
        this.tertiaryBorderColor = this.tertiaryBorderColor || mkBorder(this.tertiaryColor, this.darkMode);
        this.noteBorderColor = this.noteBorderColor || mkBorder(this.noteBkgColor, this.darkMode);
        this.noteBkgColor = this.noteBkgColor || "#FEF9C3";
        this.noteTextColor = this.noteTextColor || "#28253D";
        this.secondaryTextColor = this.secondaryTextColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.secondaryColor);
        this.tertiaryTextColor = this.tertiaryTextColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.tertiaryColor);
        this.lineColor = this.lineColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.arrowheadColor = this.arrowheadColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.textColor = this.textColor || this.primaryTextColor;
        this.border2 = this.border2 || this.tertiaryBorderColor;
        this.nodeBkg = this.nodeBkg || this.primaryColor;
        this.mainBkg = this.mainBkg || this.primaryColor;
        this.nodeBorder = this.nodeBorder || this.primaryBorderColor;
        this.clusterBkg = this.clusterBkg || this.tertiaryColor;
        this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor;
        this.defaultLinkColor = this.defaultLinkColor || this.lineColor;
        this.titleColor = this.titleColor || this.tertiaryTextColor;
        this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 30) : this.secondaryColor);
        this.nodeTextColor = this.nodeTextColor || this.primaryTextColor;
        this.noteFontWeight = 600;
        this.actorBorder = this.actorBorder || this.primaryBorderColor;
        this.actorBkg = this.actorBkg || this.mainBkg;
        this.actorTextColor = this.actorTextColor || this.primaryTextColor;
        this.actorLineColor = this.actorLineColor || this.actorBorder;
        this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg;
        this.signalColor = this.signalColor || this.textColor;
        this.signalTextColor = this.signalTextColor || this.textColor;
        this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder;
        this.labelTextColor = this.labelTextColor || this.actorTextColor;
        this.loopTextColor = this.loopTextColor || this.actorTextColor;
        this.activationBorderColor = this.activationBorderColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 10);
        this.activationBkgColor = this.activationBkgColor || this.secondaryColor;
        this.sequenceNumberColor = this.sequenceNumberColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.lineColor);
        this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
        const primaryColor = "#ECECFE";
        const secondaryColor = "#E9E9F1";
        const tertiaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 180,
            l: 5
        });
        this.sectionBkgColor = this.sectionBkgColor || tertiaryColor;
        this.altSectionBkgColor = this.altSectionBkgColor || "white";
        this.sectionBkgColor = this.sectionBkgColor || secondaryColor;
        this.sectionBkgColor2 = this.sectionBkgColor2 || primaryColor;
        this.excludeBkgColor = this.excludeBkgColor || "#eeeeee";
        this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor;
        this.taskBkgColor = this.taskBkgColor || primaryColor;
        this.activeTaskBorderColor = this.activeTaskBorderColor || primaryColor;
        this.activeTaskBkgColor = this.activeTaskBkgColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(primaryColor, 23);
        this.gridColor = this.gridColor || "lightgrey";
        this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey";
        this.doneTaskBorderColor = this.doneTaskBorderColor || "grey";
        this.critBorderColor = this.critBorderColor || "#ff8888";
        this.critBkgColor = this.critBkgColor || "red";
        this.todayLineColor = this.todayLineColor || "red";
        this.taskTextColor = this.taskTextColor || this.textColor;
        this.vertLineColor = this.vertLineColor || this.primaryBorderColor;
        this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor;
        this.taskTextLightColor = this.taskTextLightColor || this.textColor;
        this.taskTextColor = this.taskTextColor || this.primaryTextColor;
        this.taskTextDarkColor = this.taskTextDarkColor || this.textColor;
        this.taskTextClickableColor = this.taskTextClickableColor || "#003163";
        this.archEdgeColor = this.lineColor;
        this.archEdgeArrowColor = this.lineColor;
        this.personBorder = this.personBorder || this.primaryBorderColor;
        this.personBkg = this.personBkg || this.mainBkg;
        this.transitionColor = this.transitionColor || this.lineColor;
        this.transitionLabelColor = this.transitionLabelColor || this.textColor;
        this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor;
        this.compositeTitleBackground = "#F9F9FB";
        this.altBackground = "#F9F9FB";
        this.stateEdgeLabelBackground = "#FFFFFF";
        this.fontWeight = 600;
        this.stateBkg = this.stateBkg || this.mainBkg;
        this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg;
        this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor;
        this.altBackground = this.altBackground || "#f0f0f0";
        this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg;
        this.compositeBorder = this.compositeBorder || this.nodeBorder;
        this.innerEndBackground = this.nodeBorder;
        this.errorBkgColor = this.errorBkgColor || this.tertiaryColor;
        this.errorTextColor = this.errorTextColor || this.tertiaryTextColor;
        this.transitionColor = this.transitionColor || this.lineColor;
        this.specialStateColor = this.lineColor;
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScale" + i] = this.mainBkg;
        }
        if (this.darkMode) {
            for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
                this["cScale" + i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 75);
            }
        } else {
            for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
                this["cScale" + i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 25);
            }
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleInv" + i] = this["cScaleInv" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this["cScale" + i]);
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            if (this.darkMode) {
                this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this["cScale" + i], 10);
            } else {
                this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 10);
            }
        }
        this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleLabel" + i] = this["cScaleLabel" + i] || this.scaleLabelColor;
        }
        const multiplier = this.darkMode ? -4 : -1;
        for(let i = 0; i < 5; i++){
            this["surface" + i] = this["surface" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 180,
                s: -15,
                l: multiplier * (5 + i * 3)
            });
            this["surfacePeer" + i] = this["surfacePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 180,
                s: -15,
                l: multiplier * (8 + i * 3)
            });
        }
        this.classText = this.classText || this.textColor;
        this.fillType0 = this.fillType0 || primaryColor;
        this.fillType1 = this.fillType1 || secondaryColor;
        this.fillType2 = this.fillType2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 64
        });
        this.fillType3 = this.fillType3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(secondaryColor, {
            h: 64
        });
        this.fillType4 = this.fillType4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -64
        });
        this.fillType5 = this.fillType5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(secondaryColor, {
            h: -64
        });
        this.fillType6 = this.fillType6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 128
        });
        this.fillType7 = this.fillType7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(secondaryColor, {
            h: 128
        });
        this.pie1 = this.pie1 || primaryColor;
        this.pie2 = this.pie2 || secondaryColor;
        this.pie3 = this.pie3 || tertiaryColor;
        this.pie4 = this.pie4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            l: -10
        });
        this.pie5 = this.pie5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(secondaryColor, {
            l: -10
        });
        this.pie6 = this.pie6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(tertiaryColor, {
            l: -10
        });
        this.pie7 = this.pie7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 60,
            l: -10
        });
        this.pie8 = this.pie8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -60,
            l: -10
        });
        this.pie9 = this.pie9 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 120,
            l: 0
        });
        this.pie10 = this.pie10 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 60,
            l: -20
        });
        this.pie11 = this.pie11 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -60,
            l: -20
        });
        this.pie12 = this.pie12 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 120,
            l: -10
        });
        this.pieTitleTextSize = this.pieTitleTextSize || "25px";
        this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor;
        this.pieSectionTextSize = this.pieSectionTextSize || "17px";
        this.pieSectionTextColor = this.pieSectionTextColor || this.textColor;
        this.pieLegendTextSize = this.pieLegendTextSize || "17px";
        this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor;
        this.pieStrokeColor = this.pieStrokeColor || "black";
        this.pieStrokeWidth = this.pieStrokeWidth || "2px";
        this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px";
        this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black";
        this.pieOpacity = this.pieOpacity || "0.7";
        this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor;
        this.vennSetTextColor = this.vennSetTextColor ?? this.textColor;
        this.quadrant1Fill = this.quadrant1Fill || primaryColor;
        this.quadrant2Fill = this.quadrant2Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            r: 5,
            g: 5,
            b: 5
        });
        this.quadrant3Fill = this.quadrant3Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            r: 10,
            g: 10,
            b: 10
        });
        this.quadrant4Fill = this.quadrant4Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            r: 15,
            g: 15,
            b: 15
        });
        this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor;
        this.quadrant2TextFill = this.quadrant2TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -5,
            g: -5,
            b: -5
        });
        this.quadrant3TextFill = this.quadrant3TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -10,
            g: -10,
            b: -10
        });
        this.quadrant4TextFill = this.quadrant4TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -15,
            g: -15,
            b: -15
        });
        this.quadrantPointFill = this.quadrantPointFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$is_dark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__isDark$3e$__["isDark"])(this.quadrant1Fill) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.quadrant1Fill) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.quadrant1Fill);
        this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor;
        this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor;
        this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor;
        this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor;
        this.xyChart = {
            backgroundColor: this.xyChart?.backgroundColor || this.background,
            titleColor: this.xyChart?.titleColor || this.primaryTextColor,
            legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
            xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
            xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
            xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
            xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
            yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
            yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
            yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
            yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
            plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
        };
        this.requirementBackground = this.requirementBackground || primaryColor;
        this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor;
        this.requirementBorderSize = this.requirementBorderSize || "1";
        this.requirementTextColor = this.requirementTextColor || this.primaryTextColor;
        this.relationColor = this.relationColor || this.lineColor;
        this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 30) : this.secondaryColor);
        this.relationLabelColor = this.relationLabelColor || this.actorTextColor;
        this.requirementEdgeLabelBackground = "#FFFFFF";
        this.git0 = this.git0 || primaryColor;
        this.git1 = this.git1 || secondaryColor;
        this.git2 = this.git2 || tertiaryColor;
        this.git3 = this.git3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -30
        });
        this.git4 = this.git4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -60
        });
        this.git5 = this.git5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -90
        });
        this.git6 = this.git6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 60
        });
        this.git7 = this.git7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 120
        });
        if (this.darkMode) {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git7, 25);
        } else {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git7, 25);
        }
        this.gitInv0 = this.gitInv0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git0);
        this.gitInv1 = this.gitInv1 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git1);
        this.gitInv2 = this.gitInv2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git2);
        this.gitInv3 = this.gitInv3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git3);
        this.gitInv4 = this.gitInv4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git4);
        this.gitInv5 = this.gitInv5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git5);
        this.gitInv6 = this.gitInv6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git6);
        this.gitInv7 = this.gitInv7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git7);
        this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor);
        this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor;
        this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor;
        this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor;
        this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor;
        this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor;
        this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor;
        this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor;
        this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor;
        this.tagLabelColor = this.tagLabelColor || this.primaryTextColor;
        this.tagLabelBackground = this.tagLabelBackground || this.primaryColor;
        this.tagLabelBorder = this.tagBorder || this.primaryBorderColor;
        this.tagLabelFontSize = this.tagLabelFontSize || "10px";
        this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor;
        this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor;
        this.commitLabelFontSize = this.commitLabelFontSize || "10px";
        this.commitLineColor = this.commitLineColor ?? "#BDBCCC";
        this.erEdgeLabelBackground = "#FFFFFF";
        this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || oldAttributeBackgroundColorOdd;
        this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || oldAttributeBackgroundColorEven;
    }
    calculate(overrides) {
        if (typeof overrides !== "object") {
            this.updateColors();
            return;
        }
        const keys = Object.keys(overrides);
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
        this.updateColors();
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
    }
};
var getThemeVariables8 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((userOverrides)=>{
    const theme = new Theme8();
    theme.calculate(userOverrides);
    return theme;
}, "getThemeVariables");
;
var Theme9 = class {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "Theme");
    }
    constructor(){
        this.background = "#333";
        this.primaryColor = "#1f2020";
        this.secondaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.primaryColor, 16);
        this.tertiaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -160
        });
        this.primaryBorderColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.secondaryBorderColor = mkBorder(this.secondaryColor, this.darkMode);
        this.tertiaryBorderColor = mkBorder(this.tertiaryColor, this.darkMode);
        this.primaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.primaryColor);
        this.secondaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.secondaryColor);
        this.tertiaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.tertiaryColor);
        this.mainBkg = "#111113";
        this.secondBkg = "calculated";
        this.mainContrastColor = "lightgrey";
        this.darkTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])("#323D47"), 10);
        this.border1 = "#ccc";
        this.border2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$rgba$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__rgba$3e$__["rgba"])(255, 255, 255, 0.25);
        this.arrowheadColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.fontFamily = '"Recursive Variable", arial, sans-serif';
        this.fontSize = "14px";
        this.labelBackground = "#111113";
        this.textColor = "#ccc";
        this.THEME_COLOR_LIMIT = 12;
        this.radius = 12;
        this.strokeWidth = 2;
        this.noteBkgColor = this.noteBkgColor ?? "#FEF9C3";
        this.noteTextColor = this.noteTextColor ?? "#28253D";
        this.THEME_COLOR_LIMIT = 12;
        this.fontFamily = '"Recursive Variable", arial, sans-serif';
        this.fontSize = "14px";
        this.nodeBorder = "#FFFFFF";
        this.stateBorder = "#FFFFFF";
        this.useGradient = false;
        this.gradientStart = "#0042eb";
        this.gradientStop = "#eb0042";
        this.dropShadow = "url(#drop-shadow)";
        this.nodeShadow = true;
        this.archEdgeColor = "calculated";
        this.archEdgeArrowColor = "calculated";
        this.archEdgeWidth = "3";
        this.archGroupBorderColor = this.primaryBorderColor;
        this.archGroupBorderWidth = "2px";
        this.clusterBkg = "#1E1A2E";
        this.clusterBorder = "#BDBCCC";
        this.noteBorderColor = "#FACC15";
        this.noteFontWeight = 600;
        this.filterColor = "#FFFFFF";
    }
    updateColors() {
        this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#FFFFFF");
        this.secondaryColor = this.secondaryColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -120
        });
        this.tertiaryColor = this.tertiaryColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 180,
            l: 5
        });
        this.primaryBorderColor = this.primaryBorderColor || mkBorder(this.primaryColor, this.darkMode);
        this.secondaryBorderColor = this.secondaryBorderColor || mkBorder(this.secondaryColor, this.darkMode);
        this.tertiaryBorderColor = this.tertiaryBorderColor || mkBorder(this.tertiaryColor, this.darkMode);
        this.noteBorderColor = this.noteBorderColor || mkBorder(this.noteBkgColor, this.darkMode);
        this.noteBkgColor = this.noteBkgColor || "#fff5ad";
        this.noteTextColor = this.noteTextColor || "#FFFFFF";
        this.secondaryTextColor = this.secondaryTextColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.secondaryColor);
        this.tertiaryTextColor = this.tertiaryTextColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.tertiaryColor);
        this.lineColor = this.lineColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.arrowheadColor = this.arrowheadColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.textColor = this.textColor || this.primaryTextColor;
        this.border2 = this.border2 || this.tertiaryBorderColor;
        this.nodeBkg = this.nodeBkg || this.primaryColor;
        this.mainBkg = this.mainBkg || this.primaryColor;
        this.nodeBorder = this.nodeBorder || this.border1;
        this.clusterBkg = this.clusterBkg || this.tertiaryColor;
        this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor;
        this.defaultLinkColor = this.defaultLinkColor || this.lineColor;
        this.titleColor = this.titleColor || this.tertiaryTextColor;
        this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 30) : this.secondaryColor);
        this.nodeTextColor = this.nodeTextColor || this.primaryTextColor;
        this.actorBorder = "#FFFFFF";
        this.signalColor = "#FFFFFF";
        this.labelBoxBorderColor = "#BDBCCC";
        this.actorBorder = this.actorBorder || this.primaryBorderColor;
        this.actorBkg = this.actorBkg || this.mainBkg;
        this.actorTextColor = this.actorTextColor || this.primaryTextColor;
        this.actorLineColor = this.actorLineColor || this.actorBorder;
        this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg;
        this.signalColor = this.signalColor || this.textColor;
        this.signalTextColor = this.signalTextColor || this.textColor;
        this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder;
        this.labelTextColor = this.labelTextColor || this.actorTextColor;
        this.loopTextColor = this.loopTextColor || this.actorTextColor;
        this.activationBorderColor = this.activationBorderColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 10);
        this.activationBkgColor = this.activationBkgColor || this.secondaryColor;
        this.sequenceNumberColor = this.sequenceNumberColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.lineColor);
        this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
        this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor;
        this.altSectionBkgColor = this.altSectionBkgColor || "white";
        this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor;
        this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor;
        this.excludeBkgColor = this.excludeBkgColor || "#eeeeee";
        this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor;
        this.taskBkgColor = this.taskBkgColor || this.primaryColor;
        this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor;
        this.activeTaskBkgColor = this.activeTaskBkgColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.primaryColor, 23);
        this.gridColor = this.gridColor || "lightgrey";
        this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey";
        this.doneTaskBorderColor = this.doneTaskBorderColor || "grey";
        this.critBorderColor = this.critBorderColor || "#ff8888";
        this.critBkgColor = this.critBkgColor || "red";
        this.todayLineColor = this.todayLineColor || "red";
        this.taskTextColor = this.taskTextColor || this.textColor;
        this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor;
        this.taskTextLightColor = this.taskTextLightColor || this.textColor;
        this.taskTextColor = this.taskTextColor || this.primaryTextColor;
        this.taskTextDarkColor = this.taskTextDarkColor || this.textColor;
        this.taskTextClickableColor = this.taskTextClickableColor || "#003163";
        this.archEdgeColor = this.lineColor;
        this.archEdgeArrowColor = this.lineColor;
        this.personBorder = this.personBorder || this.primaryBorderColor;
        this.personBkg = this.personBkg || this.mainBkg;
        this.transitionColor = this.transitionColor || this.lineColor;
        this.transitionLabelColor = this.transitionLabelColor || this.textColor;
        this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor;
        this.vertLineColor = this.vertLineColor || this.primaryBorderColor;
        this.compositeBackground = "#16141F";
        this.altBackground = "#16141F";
        this.compositeTitleBackground = "#16141F";
        this.stateEdgeLabelBackground = "#16141F";
        this.fontWeight = 600;
        this.stateBkg = this.stateBkg || this.mainBkg;
        this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg;
        this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor;
        this.altBackground = this.altBackground || "#f0f0f0";
        this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg;
        this.compositeBorder = this.compositeBorder || this.nodeBorder;
        this.innerEndBackground = this.nodeBorder;
        this.errorBkgColor = this.errorBkgColor || this.tertiaryColor;
        this.errorTextColor = this.errorTextColor || this.tertiaryTextColor;
        this.transitionColor = this.transitionColor || this.lineColor;
        this.specialStateColor = this.lineColor;
        this.cScale0 = this.cScale0 || this.primaryColor;
        this.cScale1 = this.cScale1 || this.secondaryColor;
        this.cScale2 = this.cScale2 || this.tertiaryColor;
        this.cScale3 = this.cScale3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 30
        });
        this.cScale4 = this.cScale4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60
        });
        this.cScale5 = this.cScale5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 90
        });
        this.cScale6 = this.cScale6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120
        });
        this.cScale7 = this.cScale7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 150
        });
        this.cScale8 = this.cScale8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 210,
            l: 150
        });
        this.cScale9 = this.cScale9 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 270
        });
        this.cScale10 = this.cScale10 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 300
        });
        this.cScale11 = this.cScale11 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 330
        });
        if (this.darkMode) {
            for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
                this["cScale" + i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 75);
            }
        } else {
            for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
                this["cScale" + i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 25);
            }
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleInv" + i] = this["cScaleInv" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this["cScale" + i]);
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            if (this.darkMode) {
                this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this["cScale" + i], 10);
            } else {
                this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 10);
            }
        }
        this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleLabel" + i] = this["cScaleLabel" + i] || this.scaleLabelColor;
        }
        const multiplier = this.darkMode ? -4 : -1;
        for(let i = 0; i < 5; i++){
            this["surface" + i] = this["surface" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 180,
                s: -15,
                l: multiplier * (5 + i * 3)
            });
            this["surfacePeer" + i] = this["surfacePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 180,
                s: -15,
                l: multiplier * (8 + i * 3)
            });
        }
        this.classText = this.classText || this.textColor;
        this.fillType0 = this.fillType0 || this.primaryColor;
        this.fillType1 = this.fillType1 || this.secondaryColor;
        this.fillType2 = this.fillType2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 64
        });
        this.fillType3 = this.fillType3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 64
        });
        this.fillType4 = this.fillType4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -64
        });
        this.fillType5 = this.fillType5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: -64
        });
        this.fillType6 = this.fillType6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 128
        });
        this.fillType7 = this.fillType7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 128
        });
        this.pie1 = this.pie1 || this.primaryColor;
        this.pie2 = this.pie2 || this.secondaryColor;
        this.pie3 = this.pie3 || this.tertiaryColor;
        this.pie4 = this.pie4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            l: -10
        });
        this.pie5 = this.pie5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            l: -10
        });
        this.pie6 = this.pie6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.tertiaryColor, {
            l: -10
        });
        this.pie7 = this.pie7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60,
            l: -10
        });
        this.pie8 = this.pie8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60,
            l: -10
        });
        this.pie9 = this.pie9 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120,
            l: 0
        });
        this.pie10 = this.pie10 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60,
            l: -20
        });
        this.pie11 = this.pie11 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60,
            l: -20
        });
        this.pie12 = this.pie12 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120,
            l: -10
        });
        this.pieTitleTextSize = this.pieTitleTextSize || "25px";
        this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor;
        this.pieSectionTextSize = this.pieSectionTextSize || "17px";
        this.pieSectionTextColor = this.pieSectionTextColor || this.textColor;
        this.pieLegendTextSize = this.pieLegendTextSize || "17px";
        this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor;
        this.pieStrokeColor = this.pieStrokeColor || "black";
        this.pieStrokeWidth = this.pieStrokeWidth || "2px";
        this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px";
        this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black";
        this.pieOpacity = this.pieOpacity || "0.7";
        this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor;
        this.vennSetTextColor = this.vennSetTextColor ?? this.textColor;
        this.quadrant1Fill = this.quadrant1Fill || this.primaryColor;
        this.quadrant2Fill = this.quadrant2Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 5,
            g: 5,
            b: 5
        });
        this.quadrant3Fill = this.quadrant3Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 10,
            g: 10,
            b: 10
        });
        this.quadrant4Fill = this.quadrant4Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 15,
            g: 15,
            b: 15
        });
        this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor;
        this.quadrant2TextFill = this.quadrant2TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -5,
            g: -5,
            b: -5
        });
        this.quadrant3TextFill = this.quadrant3TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -10,
            g: -10,
            b: -10
        });
        this.quadrant4TextFill = this.quadrant4TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -15,
            g: -15,
            b: -15
        });
        this.quadrantPointFill = this.quadrantPointFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$is_dark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__isDark$3e$__["isDark"])(this.quadrant1Fill) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.quadrant1Fill) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.quadrant1Fill);
        this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor;
        this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor;
        this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor;
        this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor;
        this.xyChart = {
            backgroundColor: this.xyChart?.backgroundColor || this.background,
            titleColor: this.xyChart?.titleColor || this.primaryTextColor,
            legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
            xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
            xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
            xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
            xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
            yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
            yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
            yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
            yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
            plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
        };
        this.requirementBackground = this.requirementBackground || this.primaryColor;
        this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor;
        this.requirementBorderSize = this.requirementBorderSize || "1";
        this.requirementTextColor = this.requirementTextColor || this.primaryTextColor;
        this.relationColor = this.relationColor || this.lineColor;
        this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 30) : this.secondaryColor);
        this.relationLabelColor = this.relationLabelColor || this.actorTextColor;
        this.requirementEdgeLabelBackground = "#16141F";
        this.git0 = this.git0 || this.primaryColor;
        this.git1 = this.git1 || this.secondaryColor;
        this.git2 = this.git2 || this.tertiaryColor;
        this.git3 = this.git3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -30
        });
        this.git4 = this.git4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60
        });
        this.git5 = this.git5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -90
        });
        this.git6 = this.git6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60
        });
        this.git7 = this.git7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120
        });
        if (this.darkMode) {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git7, 25);
        } else {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git7, 25);
        }
        this.gitInv0 = this.gitInv0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git0);
        this.gitInv1 = this.gitInv1 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git1);
        this.gitInv2 = this.gitInv2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git2);
        this.gitInv3 = this.gitInv3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git3);
        this.gitInv4 = this.gitInv4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git4);
        this.gitInv5 = this.gitInv5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git5);
        this.gitInv6 = this.gitInv6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git6);
        this.gitInv7 = this.gitInv7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git7);
        this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor);
        this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor;
        this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor;
        this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor;
        this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor;
        this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor;
        this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor;
        this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor;
        this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor;
        this.tagLabelColor = this.tagLabelColor || this.primaryTextColor;
        this.tagLabelBackground = this.tagLabelBackground || this.primaryColor;
        this.tagLabelBorder = this.tagBorder || this.primaryBorderColor;
        this.tagLabelFontSize = this.tagLabelFontSize || "10px";
        this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor;
        this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor;
        this.commitLabelFontSize = this.commitLabelFontSize || "10px";
        this.commitLineColor = this.commitLineColor ?? "#BDBCCC";
        this.erEdgeLabelBackground = "#16141F";
        this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || oldAttributeBackgroundColorOdd;
        this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || oldAttributeBackgroundColorEven;
    }
    calculate(overrides) {
        if (typeof overrides !== "object") {
            this.updateColors();
            return;
        }
        const keys = Object.keys(overrides);
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
        this.updateColors();
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
    }
};
var getThemeVariables9 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((userOverrides)=>{
    const theme = new Theme9();
    theme.calculate(userOverrides);
    return theme;
}, "getThemeVariables");
;
var Theme10 = class {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "Theme");
    }
    constructor(){
        this.background = "#ffffff";
        this.primaryColor = "#cccccc";
        this.mainBkg = "#ffffff";
        this.noteBkgColor = "#fff5ad";
        this.noteTextColor = "#28253D";
        this.THEME_COLOR_LIMIT = 12;
        this.radius = 12;
        this.strokeWidth = 2;
        this.primaryBorderColor = mkBorder(this.primaryColor, this.darkMode);
        this.fontFamily = '"Recursive Variable", arial, sans-serif';
        this.fontSize = "14px";
        this.nodeBorder = "#28253D";
        this.stateBorder = "#28253D";
        this.useGradient = false;
        this.gradientStart = "#0042eb";
        this.gradientStop = "#eb0042";
        this.dropShadow = "url(#drop-shadow)";
        this.nodeShadow = true;
        this.tertiaryColor = "#ffffff";
        this.archEdgeColor = "calculated";
        this.archEdgeArrowColor = "calculated";
        this.archEdgeWidth = "3";
        this.archGroupBorderColor = this.primaryBorderColor;
        this.archGroupBorderWidth = "2px";
        this.actorBorder = "#28253D";
        this.noteBorderColor = "#FACC15";
        this.noteFontWeight = 600;
        this.borderColorArray = [
            "#E879F9",
            //Fuchsia-400
            "#2DD4BF",
            //Teal-400
            "#FB923C",
            //Orange-400
            "#22D3EE",
            // Cyan-400
            "#4ADE80",
            // Green-400
            "#A78BFA",
            //Violet-400
            "#F87171",
            //red-400
            "#FACC15",
            //yellow-400
            "#818CF8",
            //indigo-400
            "#A3E635 ",
            //Lime-400
            "#38BDF8",
            //Sky-400
            "#FB7185"
        ];
        this.bkgColorArray = [
            "#FDF4FF",
            //Fuchsia-50
            "#F0FDFA",
            //Teal-50
            "#FFF7ED",
            //Orange-50
            "#ECFEFF",
            // Cyan-50
            "#F0FDF4",
            // Green-50
            "#F5F3FF",
            //Violet-50
            "#FEF2F2",
            //red-50
            "#FEFCE8",
            //yellow-50
            "#EEF2FF",
            //indigo-50
            "#F7FEE7",
            //Lime-50
            "#F0F9FF",
            //Sky-50
            "#FFF1F2"
        ];
        this.filterColor = "#000000";
    }
    updateColors() {
        this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#28253D");
        this.secondaryColor = this.secondaryColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -120
        });
        this.tertiaryColor = this.tertiaryColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 180,
            l: 5
        });
        this.primaryBorderColor = this.primaryBorderColor || mkBorder(this.primaryColor, this.darkMode);
        this.secondaryBorderColor = this.secondaryBorderColor || mkBorder(this.secondaryColor, this.darkMode);
        this.tertiaryBorderColor = this.tertiaryBorderColor || mkBorder(this.tertiaryColor, this.darkMode);
        this.noteBorderColor = this.noteBorderColor || mkBorder(this.noteBkgColor, this.darkMode);
        this.noteBkgColor = this.noteBkgColor || "#fff5ad";
        this.noteTextColor = this.noteTextColor || "#28253D";
        this.secondaryTextColor = this.secondaryTextColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.secondaryColor);
        this.tertiaryTextColor = this.tertiaryTextColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.tertiaryColor);
        this.lineColor = this.lineColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.arrowheadColor = this.arrowheadColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.textColor = this.textColor || this.primaryTextColor;
        this.border2 = this.border2 || this.tertiaryBorderColor;
        this.nodeBkg = this.nodeBkg || this.primaryColor;
        this.mainBkg = this.mainBkg || this.primaryColor;
        this.nodeBorder = this.nodeBorder || this.primaryBorderColor;
        this.clusterBkg = this.clusterBkg || this.tertiaryColor;
        this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor;
        this.defaultLinkColor = this.defaultLinkColor || this.lineColor;
        this.titleColor = this.titleColor || this.tertiaryTextColor;
        this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 30) : this.secondaryColor);
        this.nodeTextColor = this.nodeTextColor || this.primaryTextColor;
        this.actorBorder = this.actorBorder || this.primaryBorderColor;
        this.actorBkg = this.actorBkg || this.mainBkg;
        this.actorTextColor = this.actorTextColor || this.primaryTextColor;
        this.actorLineColor = this.actorLineColor || this.actorBorder;
        this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg;
        this.signalColor = this.signalColor || this.textColor;
        this.signalTextColor = this.signalTextColor || this.textColor;
        this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder;
        this.labelTextColor = this.labelTextColor || this.actorTextColor;
        this.loopTextColor = this.loopTextColor || this.actorTextColor;
        this.activationBorderColor = this.activationBorderColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 10);
        this.activationBkgColor = this.activationBkgColor || this.secondaryColor;
        this.sequenceNumberColor = this.sequenceNumberColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.lineColor);
        this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
        const primaryColor = "#ECECFE";
        const secondaryColor = "#E9E9F1";
        const tertiaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 180,
            l: 5
        });
        this.sectionBkgColor = this.sectionBkgColor || tertiaryColor;
        this.altSectionBkgColor = this.altSectionBkgColor || "white";
        this.sectionBkgColor = this.sectionBkgColor || secondaryColor;
        this.sectionBkgColor2 = this.sectionBkgColor2 || primaryColor;
        this.excludeBkgColor = this.excludeBkgColor || "#eeeeee";
        this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor;
        this.taskBkgColor = this.taskBkgColor || primaryColor;
        this.activeTaskBorderColor = this.activeTaskBorderColor || primaryColor;
        this.activeTaskBkgColor = this.activeTaskBkgColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(primaryColor, 23);
        this.gridColor = this.gridColor || "lightgrey";
        this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey";
        this.doneTaskBorderColor = this.doneTaskBorderColor || "grey";
        this.critBorderColor = this.critBorderColor || "#ff8888";
        this.critBkgColor = this.critBkgColor || "red";
        this.todayLineColor = this.todayLineColor || "red";
        this.taskTextColor = this.taskTextColor || this.textColor;
        this.vertLineColor = this.vertLineColor || this.primaryBorderColor;
        this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor;
        this.taskTextLightColor = this.taskTextLightColor || this.textColor;
        this.taskTextColor = this.taskTextColor || this.primaryTextColor;
        this.taskTextDarkColor = this.taskTextDarkColor || this.textColor;
        this.taskTextClickableColor = this.taskTextClickableColor || "#003163";
        this.archEdgeColor = this.lineColor;
        this.archEdgeArrowColor = this.lineColor;
        this.personBorder = this.personBorder || this.primaryBorderColor;
        this.personBkg = this.personBkg || this.mainBkg;
        this.transitionColor = this.transitionColor || this.lineColor;
        this.transitionLabelColor = this.transitionLabelColor || this.textColor;
        this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor;
        this.stateBkg = this.stateBkg || this.mainBkg;
        this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg;
        this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor;
        this.altBackground = this.altBackground || "#f0f0f0";
        this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg;
        this.compositeBorder = this.compositeBorder || this.nodeBorder;
        this.innerEndBackground = this.nodeBorder;
        this.errorBkgColor = this.errorBkgColor || this.tertiaryColor;
        this.errorTextColor = this.errorTextColor || this.tertiaryTextColor;
        this.transitionColor = this.transitionColor || this.lineColor;
        this.specialStateColor = this.lineColor;
        this.cScale0 = this.cScale0 || "#f4a8ff";
        this.cScale1 = this.cScale1 || "#46ecd5";
        this.cScale2 = this.cScale2 || "#ffb86a";
        this.cScale3 = this.cScale3 || "#dab2ff";
        this.cScale4 = this.cScale4 || "#7bf1a8";
        this.cScale5 = this.cScale5 || "#c4b4ff";
        this.cScale6 = this.cScale6 || "#ffa2a2";
        this.cScale7 = this.cScale7 || "#ffdf20";
        this.cScale8 = this.cScale8 || "#a3b3ff";
        this.cScale9 = this.cScale9 || "#bbf451";
        this.cScale10 = this.cScale10 || "#74d4ff";
        this.cScale11 = this.cScale11 || "#ffa1ad";
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleInv" + i] = this["cScaleInv" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this["cScale" + i]);
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            if (this.darkMode) {
                this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this["cScale" + i], 10);
            } else {
                this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 10);
            }
        }
        this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleLabel" + i] = this["cScaleLabel" + i] || this.scaleLabelColor;
        }
        const multiplier = this.darkMode ? -4 : -1;
        for(let i = 0; i < 5; i++){
            this["surface" + i] = this["surface" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 180,
                s: -15,
                l: multiplier * (5 + i * 3)
            });
            this["surfacePeer" + i] = this["surfacePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 180,
                s: -15,
                l: multiplier * (8 + i * 3)
            });
        }
        this.classText = this.classText || this.textColor;
        this.fillType0 = this.fillType0 || primaryColor;
        this.fillType1 = this.fillType1 || secondaryColor;
        this.fillType2 = this.fillType2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 64
        });
        this.fillType3 = this.fillType3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(secondaryColor, {
            h: 64
        });
        this.fillType4 = this.fillType4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -64
        });
        this.fillType5 = this.fillType5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(secondaryColor, {
            h: -64
        });
        this.fillType6 = this.fillType6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 128
        });
        this.fillType7 = this.fillType7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(secondaryColor, {
            h: 128
        });
        this.pie1 = this.pie1 || primaryColor;
        this.pie2 = this.pie2 || secondaryColor;
        this.pie3 = this.pie3 || tertiaryColor;
        this.pie4 = this.pie4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            l: -10
        });
        this.pie5 = this.pie5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(secondaryColor, {
            l: -10
        });
        this.pie6 = this.pie6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(tertiaryColor, {
            l: -10
        });
        this.pie7 = this.pie7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 60,
            l: -10
        });
        this.pie8 = this.pie8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -60,
            l: -10
        });
        this.pie9 = this.pie9 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 120,
            l: 0
        });
        this.pie10 = this.pie10 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 60,
            l: -20
        });
        this.pie11 = this.pie11 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -60,
            l: -20
        });
        this.pie12 = this.pie12 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 120,
            l: -10
        });
        this.pieTitleTextSize = this.pieTitleTextSize || "25px";
        this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor;
        this.pieSectionTextSize = this.pieSectionTextSize || "17px";
        this.pieSectionTextColor = this.pieSectionTextColor || this.textColor;
        this.pieLegendTextSize = this.pieLegendTextSize || "17px";
        this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor;
        this.pieStrokeColor = this.pieStrokeColor || "black";
        this.pieStrokeWidth = this.pieStrokeWidth || "2px";
        this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px";
        this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black";
        this.pieOpacity = this.pieOpacity || "0.7";
        this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor;
        this.vennSetTextColor = this.vennSetTextColor ?? this.textColor;
        this.quadrant1Fill = this.quadrant1Fill || primaryColor;
        this.quadrant2Fill = this.quadrant2Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            r: 5,
            g: 5,
            b: 5
        });
        this.quadrant3Fill = this.quadrant3Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            r: 10,
            g: 10,
            b: 10
        });
        this.quadrant4Fill = this.quadrant4Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            r: 15,
            g: 15,
            b: 15
        });
        this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor;
        this.quadrant2TextFill = this.quadrant2TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -5,
            g: -5,
            b: -5
        });
        this.quadrant3TextFill = this.quadrant3TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -10,
            g: -10,
            b: -10
        });
        this.quadrant4TextFill = this.quadrant4TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -15,
            g: -15,
            b: -15
        });
        this.quadrantPointFill = this.quadrantPointFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$is_dark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__isDark$3e$__["isDark"])(this.quadrant1Fill) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.quadrant1Fill) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.quadrant1Fill);
        this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor;
        this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor;
        this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor;
        this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor;
        this.xyChart = {
            backgroundColor: this.xyChart?.backgroundColor || this.background,
            titleColor: this.xyChart?.titleColor || this.primaryTextColor,
            legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
            xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
            xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
            xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
            xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
            yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
            yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
            yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
            yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
            plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
        };
        this.requirementBackground = this.requirementBackground || primaryColor;
        this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor;
        this.requirementBorderSize = this.requirementBorderSize || "1";
        this.requirementTextColor = this.requirementTextColor || this.primaryTextColor;
        this.relationColor = this.relationColor || this.lineColor;
        this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 30) : this.secondaryColor);
        this.relationLabelColor = this.relationLabelColor || this.actorTextColor;
        this.git0 = this.git0 || primaryColor;
        this.git1 = this.git1 || secondaryColor;
        this.git2 = this.git2 || tertiaryColor;
        this.git3 = this.git3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -30
        });
        this.git4 = this.git4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -60
        });
        this.git5 = this.git5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: -90
        });
        this.git6 = this.git6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 60
        });
        this.git7 = this.git7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(primaryColor, {
            h: 120
        });
        if (this.darkMode) {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git7, 25);
        } else {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git7, 25);
        }
        this.gitInv0 = this.gitInv0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git0);
        this.gitInv1 = this.gitInv1 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git1);
        this.gitInv2 = this.gitInv2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git2);
        this.gitInv3 = this.gitInv3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git3);
        this.gitInv4 = this.gitInv4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git4);
        this.gitInv5 = this.gitInv5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git5);
        this.gitInv6 = this.gitInv6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git6);
        this.gitInv7 = this.gitInv7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git7);
        this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor);
        this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor;
        this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor;
        this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor;
        this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor;
        this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor;
        this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor;
        this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor;
        this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor;
        this.tagLabelColor = this.tagLabelColor || this.primaryTextColor;
        this.tagLabelBackground = this.tagLabelBackground || this.primaryColor;
        this.tagLabelBorder = this.tagBorder || this.primaryBorderColor;
        this.tagLabelFontSize = this.tagLabelFontSize || "10px";
        this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor;
        this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor;
        this.commitLineColor = this.commitLineColor ?? "#BDBCCC";
        this.commitLabelFontSize = this.commitLabelFontSize || "10px";
        this.fontWeight = 600;
        this.erEdgeLabelBackground = "#FFFFFF";
        this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || oldAttributeBackgroundColorOdd;
        this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || oldAttributeBackgroundColorEven;
    }
    calculate(overrides) {
        if (typeof overrides !== "object") {
            this.updateColors();
            return;
        }
        const keys = Object.keys(overrides);
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
        this.updateColors();
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
    }
};
var getThemeVariables10 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((userOverrides)=>{
    const theme = new Theme10();
    theme.calculate(userOverrides);
    return theme;
}, "getThemeVariables");
;
var Theme11 = class {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "Theme");
    }
    constructor(){
        this.background = "#333";
        this.primaryColor = "#1f2020";
        this.secondaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.primaryColor, 16);
        this.tertiaryColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -160
        });
        this.primaryBorderColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.secondaryBorderColor = mkBorder(this.secondaryColor, this.darkMode);
        this.tertiaryBorderColor = mkBorder(this.tertiaryColor, this.darkMode);
        this.primaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.primaryColor);
        this.secondaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.secondaryColor);
        this.tertiaryTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.tertiaryColor);
        this.mainBkg = "#111113";
        this.secondBkg = "calculated";
        this.mainContrastColor = "lightgrey";
        this.darkTextColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])("#323D47"), 10);
        this.border1 = "#ccc";
        this.border2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$rgba$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__rgba$3e$__["rgba"])(255, 255, 255, 0.25);
        this.arrowheadColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.fontFamily = '"Recursive Variable", arial, sans-serif';
        this.fontSize = "14px";
        this.labelBackground = "#111113";
        this.textColor = "#ccc";
        this.THEME_COLOR_LIMIT = 12;
        this.radius = 12;
        this.strokeWidth = 2;
        this.noteBkgColor = this.noteBkgColor ?? "#FEF9C3";
        this.noteTextColor = this.noteTextColor ?? "#28253D";
        this.THEME_COLOR_LIMIT = 12;
        this.fontFamily = '"Recursive Variable", arial, sans-serif';
        this.fontSize = "14px";
        this.nodeBorder = "#FFFFFF";
        this.stateBorder = "#FFFFFF";
        this.useGradient = false;
        this.gradientStart = "#0042eb";
        this.gradientStop = "#eb0042";
        this.dropShadow = "url(#drop-shadow)";
        this.nodeShadow = true;
        this.archEdgeColor = "calculated";
        this.archEdgeArrowColor = "calculated";
        this.archEdgeWidth = "3";
        this.archGroupBorderColor = this.primaryBorderColor;
        this.archGroupBorderWidth = "2px";
        this.clusterBkg = "#1E1A2E";
        this.clusterBorder = "#BDBCCC";
        this.noteBorderColor = "#FACC15";
        this.noteFontWeight = 600;
        this.borderColorArray = [
            "#E879F9",
            //Fuchsia-400
            "#2DD4BF",
            //Teal-400
            "#FB923C",
            //Orange-400
            "#22D3EE",
            // Cyan-400
            "#4ADE80",
            // Green-400
            "#A78BFA",
            //Violet-400
            "#F87171",
            //red-400
            "#FACC15",
            //yellow-400
            "#818CF8",
            //indigo-400
            "#A3E635 ",
            //Lime-400
            "#38BDF8",
            //Sky-400
            "#FB7185"
        ];
        this.bkgColorArray = [];
        this.filterColor = "#FFFFFF";
    }
    updateColors() {
        this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#FFFFFF");
        this.secondaryColor = this.secondaryColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -120
        });
        this.tertiaryColor = this.tertiaryColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 180,
            l: 5
        });
        this.primaryBorderColor = this.primaryBorderColor || mkBorder(this.primaryColor, this.darkMode);
        this.secondaryBorderColor = this.secondaryBorderColor || mkBorder(this.secondaryColor, this.darkMode);
        this.tertiaryBorderColor = this.tertiaryBorderColor || mkBorder(this.tertiaryColor, this.darkMode);
        this.noteBorderColor = this.noteBorderColor || mkBorder(this.noteBkgColor, this.darkMode);
        this.noteBkgColor = this.noteBkgColor || "#fff5ad";
        this.noteTextColor = this.noteTextColor || "#FFFFFF";
        this.secondaryTextColor = this.secondaryTextColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.secondaryColor);
        this.tertiaryTextColor = this.tertiaryTextColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.tertiaryColor);
        this.lineColor = this.lineColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.arrowheadColor = this.arrowheadColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.background);
        this.textColor = this.textColor || this.primaryTextColor;
        this.border2 = this.border2 || this.tertiaryBorderColor;
        this.nodeBkg = this.nodeBkg || this.primaryColor;
        this.mainBkg = this.mainBkg || this.primaryColor;
        this.nodeBorder = this.nodeBorder || this.border1;
        this.clusterBkg = this.clusterBkg || this.tertiaryColor;
        this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor;
        this.defaultLinkColor = this.defaultLinkColor || this.lineColor;
        this.titleColor = this.titleColor || this.tertiaryTextColor;
        this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 30) : this.secondaryColor);
        this.nodeTextColor = this.nodeTextColor || this.primaryTextColor;
        this.actorBorder = "#FFFFFF";
        this.signalColor = "#FFFFFF";
        this.labelBoxBorderColor = "#BDBCCC";
        this.actorBorder = this.actorBorder || this.primaryBorderColor;
        this.actorBkg = this.actorBkg || this.mainBkg;
        this.actorTextColor = this.actorTextColor || this.primaryTextColor;
        this.actorLineColor = this.actorLineColor || this.actorBorder;
        this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg;
        this.signalColor = this.signalColor || this.textColor;
        this.signalTextColor = this.signalTextColor || this.textColor;
        this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder;
        this.labelTextColor = this.labelTextColor || this.actorTextColor;
        this.loopTextColor = this.loopTextColor || this.actorTextColor;
        this.activationBorderColor = this.activationBorderColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 10);
        this.activationBkgColor = this.activationBkgColor || this.secondaryColor;
        this.sequenceNumberColor = this.sequenceNumberColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.lineColor);
        this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
        this.rootLabelColor = "#FFFFFF";
        this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor;
        this.altSectionBkgColor = this.altSectionBkgColor || "white";
        this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor;
        this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor;
        this.excludeBkgColor = this.excludeBkgColor || "#eeeeee";
        this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor;
        this.taskBkgColor = this.taskBkgColor || this.primaryColor;
        this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor;
        this.activeTaskBkgColor = this.activeTaskBkgColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.primaryColor, 23);
        this.gridColor = this.gridColor || "lightgrey";
        this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey";
        this.doneTaskBorderColor = this.doneTaskBorderColor || "grey";
        this.critBorderColor = this.critBorderColor || "#ff8888";
        this.critBkgColor = this.critBkgColor || "red";
        this.todayLineColor = this.todayLineColor || "red";
        this.taskTextColor = this.taskTextColor || this.textColor;
        this.vertLineColor = this.vertLineColor || this.primaryBorderColor;
        this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor;
        this.taskTextLightColor = this.taskTextLightColor || this.textColor;
        this.taskTextColor = this.taskTextColor || this.primaryTextColor;
        this.taskTextDarkColor = this.taskTextDarkColor || this.textColor;
        this.taskTextClickableColor = this.taskTextClickableColor || "#003163";
        this.archEdgeColor = this.lineColor;
        this.archEdgeArrowColor = this.lineColor;
        this.personBorder = this.personBorder || this.primaryBorderColor;
        this.personBkg = this.personBkg || this.mainBkg;
        this.transitionColor = this.transitionColor || this.lineColor;
        this.transitionLabelColor = this.transitionLabelColor || this.textColor;
        this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor;
        this.stateBkg = this.stateBkg || this.mainBkg;
        this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg;
        this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor;
        this.altBackground = this.altBackground || "#f0f0f0";
        this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg;
        this.compositeBorder = this.compositeBorder || this.nodeBorder;
        this.innerEndBackground = this.nodeBorder;
        this.errorBkgColor = this.errorBkgColor || this.tertiaryColor;
        this.errorTextColor = this.errorTextColor || this.tertiaryTextColor;
        this.transitionColor = this.transitionColor || this.lineColor;
        this.specialStateColor = this.lineColor;
        this.cScale0 = this.cScale0 || "#f4a8ff";
        this.cScale1 = this.cScale1 || "#46ecd5";
        this.cScale2 = this.cScale2 || "#ffb86a";
        this.cScale3 = this.cScale3 || "#dab2ff";
        this.cScale4 = this.cScale4 || "#7bf1a8";
        this.cScale5 = this.cScale5 || "#c4b4ff";
        this.cScale6 = this.cScale6 || "#ffa2a2";
        this.cScale7 = this.cScale7 || "#ffdf20";
        this.cScale8 = this.cScale8 || "#a3b3ff";
        this.cScale9 = this.cScale9 || "#bbf451";
        this.cScale10 = this.cScale10 || "#74d4ff";
        this.cScale11 = this.cScale11 || "#ffa1ad";
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleInv" + i] = this["cScaleInv" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this["cScale" + i]);
        }
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            if (this.darkMode) {
                this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this["cScale" + i], 10);
            } else {
                this["cScalePeer" + i] = this["cScalePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 10);
            }
        }
        this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
        for(let i = 0; i < this.THEME_COLOR_LIMIT; i++){
            this["cScaleLabel" + i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this["cScale" + i], 75);
        }
        const multiplier = this.darkMode ? -4 : -1;
        for(let i = 0; i < 5; i++){
            this["surface" + i] = this["surface" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 180,
                s: -15,
                l: multiplier * (5 + i * 3)
            });
            this["surfacePeer" + i] = this["surfacePeer" + i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.mainBkg, {
                h: 180,
                s: -15,
                l: multiplier * (8 + i * 3)
            });
        }
        this.classText = this.classText || this.textColor;
        this.fillType0 = this.fillType0 || this.primaryColor;
        this.fillType1 = this.fillType1 || this.secondaryColor;
        this.fillType2 = this.fillType2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 64
        });
        this.fillType3 = this.fillType3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 64
        });
        this.fillType4 = this.fillType4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -64
        });
        this.fillType5 = this.fillType5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: -64
        });
        this.fillType6 = this.fillType6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 128
        });
        this.fillType7 = this.fillType7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            h: 128
        });
        this.pie1 = this.pie1 || this.primaryColor;
        this.pie2 = this.pie2 || this.secondaryColor;
        this.pie3 = this.pie3 || this.tertiaryColor;
        this.pie4 = this.pie4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            l: -10
        });
        this.pie5 = this.pie5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.secondaryColor, {
            l: -10
        });
        this.pie6 = this.pie6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.tertiaryColor, {
            l: -10
        });
        this.pie7 = this.pie7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60,
            l: -10
        });
        this.pie8 = this.pie8 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60,
            l: -10
        });
        this.pie9 = this.pie9 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120,
            l: 0
        });
        this.pie10 = this.pie10 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60,
            l: -20
        });
        this.pie11 = this.pie11 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60,
            l: -20
        });
        this.pie12 = this.pie12 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120,
            l: -10
        });
        this.pieTitleTextSize = this.pieTitleTextSize || "25px";
        this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor;
        this.pieSectionTextSize = this.pieSectionTextSize || "17px";
        this.pieSectionTextColor = this.pieSectionTextColor || this.textColor;
        this.pieLegendTextSize = this.pieLegendTextSize || "17px";
        this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor;
        this.pieStrokeColor = this.pieStrokeColor || "black";
        this.pieStrokeWidth = this.pieStrokeWidth || "2px";
        this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px";
        this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black";
        this.pieOpacity = this.pieOpacity || "0.7";
        this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor;
        this.vennSetTextColor = this.vennSetTextColor ?? this.textColor;
        this.quadrant1Fill = this.quadrant1Fill || this.primaryColor;
        this.quadrant2Fill = this.quadrant2Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 5,
            g: 5,
            b: 5
        });
        this.quadrant3Fill = this.quadrant3Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 10,
            g: 10,
            b: 10
        });
        this.quadrant4Fill = this.quadrant4Fill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            r: 15,
            g: 15,
            b: 15
        });
        this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor;
        this.quadrant2TextFill = this.quadrant2TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -5,
            g: -5,
            b: -5
        });
        this.quadrant3TextFill = this.quadrant3TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -10,
            g: -10,
            b: -10
        });
        this.quadrant4TextFill = this.quadrant4TextFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryTextColor, {
            r: -15,
            g: -15,
            b: -15
        });
        this.quadrantPointFill = this.quadrantPointFill || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$is_dark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__isDark$3e$__["isDark"])(this.quadrant1Fill) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.quadrant1Fill) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.quadrant1Fill);
        this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor;
        this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor;
        this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor;
        this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor;
        this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor;
        this.xyChart = {
            backgroundColor: this.xyChart?.backgroundColor || this.background,
            titleColor: this.xyChart?.titleColor || this.primaryTextColor,
            legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
            xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
            xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
            xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
            xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
            yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
            yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
            yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
            yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
            plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
        };
        this.requirementBackground = this.requirementBackground || this.primaryColor;
        this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor;
        this.requirementBorderSize = this.requirementBorderSize || "1";
        this.requirementTextColor = this.requirementTextColor || this.primaryTextColor;
        this.relationColor = this.relationColor || this.lineColor;
        this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.secondaryColor, 30) : this.secondaryColor);
        this.relationLabelColor = this.relationLabelColor || this.actorTextColor;
        this.git0 = this.git0 || this.primaryColor;
        this.git1 = this.git1 || this.secondaryColor;
        this.git2 = this.git2 || this.tertiaryColor;
        this.git3 = this.git3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -30
        });
        this.git4 = this.git4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -60
        });
        this.git5 = this.git5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: -90
        });
        this.git6 = this.git6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 60
        });
        this.git7 = this.git7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__adjust$3e$__["adjust"])(this.primaryColor, {
            h: 120
        });
        if (this.darkMode) {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lighten$3e$__["lighten"])(this.git7, 25);
        } else {
            this.git0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git0, 25);
            this.git1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git1, 25);
            this.git2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git2, 25);
            this.git3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git3, 25);
            this.git4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git4, 25);
            this.git5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git5, 25);
            this.git6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git6, 25);
            this.git7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__darken$3e$__["darken"])(this.git7, 25);
        }
        this.gitInv0 = this.gitInv0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git0);
        this.gitInv1 = this.gitInv1 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git1);
        this.gitInv2 = this.gitInv2 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git2);
        this.gitInv3 = this.gitInv3 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git3);
        this.gitInv4 = this.gitInv4 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git4);
        this.gitInv5 = this.gitInv5 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git5);
        this.gitInv6 = this.gitInv6 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git6);
        this.gitInv7 = this.gitInv7 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__invert$3e$__["invert"])(this.git7);
        this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor);
        this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor;
        this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor;
        this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor;
        this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor;
        this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor;
        this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor;
        this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor;
        this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor;
        this.tagLabelColor = this.tagLabelColor || this.primaryTextColor;
        this.tagLabelBackground = this.tagLabelBackground || this.primaryColor;
        this.tagLabelBorder = this.tagBorder || this.primaryBorderColor;
        this.tagLabelFontSize = this.tagLabelFontSize || "10px";
        this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor;
        this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor;
        this.commitLabelFontSize = this.commitLabelFontSize || "10px";
        this.commitLineColor = this.commitLineColor ?? "#BDBCCC";
        this.fontWeight = 600;
        this.erEdgeLabelBackground = "#16141F";
        this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || oldAttributeBackgroundColorOdd;
        this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || oldAttributeBackgroundColorEven;
    }
    calculate(overrides) {
        if (typeof overrides !== "object") {
            this.updateColors();
            return;
        }
        const keys = Object.keys(overrides);
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
        this.updateColors();
        keys.forEach((k)=>{
            this[k] = overrides[k];
        });
    }
};
var getThemeVariables11 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((userOverrides)=>{
    const theme = new Theme11();
    theme.calculate(userOverrides);
    return theme;
}, "getThemeVariables");
// src/themes/index.js
var themes_default = {
    base: {
        getThemeVariables
    },
    dark: {
        getThemeVariables: getThemeVariables2
    },
    default: {
        getThemeVariables: getThemeVariables3
    },
    forest: {
        getThemeVariables: getThemeVariables4
    },
    neutral: {
        getThemeVariables: getThemeVariables5
    },
    neo: {
        getThemeVariables: getThemeVariables6
    },
    "neo-dark": {
        getThemeVariables: getThemeVariables7
    },
    redux: {
        getThemeVariables: getThemeVariables8
    },
    "redux-dark": {
        getThemeVariables: getThemeVariables9
    },
    "redux-color": {
        getThemeVariables: getThemeVariables10
    },
    "redux-dark-color": {
        getThemeVariables: getThemeVariables11
    }
};
// src/schemas/config.schema.yaml?only-defaults=true
var config_schema_default = {
    "flowchart": {
        "useMaxWidth": true,
        "titleTopMargin": 25,
        "subGraphTitleMargin": {
            "top": 0,
            "bottom": 0
        },
        "diagramPadding": 8,
        "htmlLabels": null,
        "nodeSpacing": 50,
        "rankSpacing": 50,
        "curve": "basis",
        "padding": 15,
        "defaultRenderer": "dagre-wrapper",
        "wrappingWidth": 200,
        "inheritDir": false
    },
    "swimlane": {
        "useMaxWidth": true,
        "lineHops": "arc",
        "ignoreCrossLaneEdges": true,
        "optimizeRanksByCrossings": true,
        "automaticLaneOrdering": false
    },
    "sequence": {
        "useMaxWidth": true,
        "hideUnusedParticipants": false,
        "activationWidth": 10,
        "diagramMarginX": 50,
        "diagramMarginY": 10,
        "actorMargin": 50,
        "width": 150,
        "height": 65,
        "boxMargin": 10,
        "boxTextMargin": 5,
        "noteMargin": 10,
        "messageMargin": 35,
        "messageAlign": "center",
        "mirrorActors": true,
        "forceMenus": false,
        "bottomMarginAdj": 1,
        "rightAngles": false,
        "showSequenceNumbers": false,
        "actorFontSize": 14,
        "actorFontFamily": '"Open Sans", sans-serif',
        "actorFontWeight": 400,
        "noteFontSize": 14,
        "noteFontFamily": '"trebuchet ms", verdana, arial, sans-serif',
        "noteFontWeight": 400,
        "noteAlign": "center",
        "messageFontSize": 16,
        "messageFontFamily": '"trebuchet ms", verdana, arial, sans-serif',
        "messageFontWeight": 400,
        "wrap": false,
        "wrapPadding": 10,
        "labelBoxWidth": 50,
        "labelBoxHeight": 20
    },
    "gantt": {
        "useMaxWidth": true,
        "titleTopMargin": 25,
        "barHeight": 20,
        "barGap": 4,
        "topPadding": 50,
        "rightPadding": 75,
        "leftPadding": 75,
        "gridLineStartPadding": 35,
        "fontSize": 11,
        "sectionFontSize": 11,
        "numberSectionStyles": 4,
        "axisFormat": "%Y-%m-%d",
        "topAxis": false,
        "displayMode": "",
        "weekday": "sunday"
    },
    "journey": {
        "useMaxWidth": true,
        "diagramMarginX": 50,
        "diagramMarginY": 10,
        "leftMargin": 150,
        "maxLabelWidth": 360,
        "width": 150,
        "height": 50,
        "boxMargin": 10,
        "boxTextMargin": 5,
        "noteMargin": 10,
        "messageMargin": 35,
        "messageAlign": "center",
        "bottomMarginAdj": 1,
        "rightAngles": false,
        "taskFontSize": 14,
        "taskFontFamily": '"Open Sans", sans-serif',
        "taskMargin": 50,
        "activationWidth": 10,
        "textPlacement": "fo",
        "actorColours": [
            "#8FBC8F",
            "#7CFC00",
            "#00FFFF",
            "#20B2AA",
            "#B0E0E6",
            "#FFFFE0"
        ],
        "sectionFills": [
            "#191970",
            "#8B008B",
            "#4B0082",
            "#2F4F4F",
            "#800000",
            "#8B4513",
            "#00008B"
        ],
        "sectionColours": [
            "#fff"
        ],
        "titleColor": "",
        "titleFontFamily": '"trebuchet ms", verdana, arial, sans-serif',
        "titleFontSize": "4ex"
    },
    "class": {
        "useMaxWidth": true,
        "titleTopMargin": 25,
        "arrowMarkerAbsolute": false,
        "dividerMargin": 10,
        "padding": 5,
        "textHeight": 10,
        "defaultRenderer": "dagre-wrapper",
        "htmlLabels": false,
        "hideEmptyMembersBox": false,
        "hierarchicalNamespaces": true
    },
    "state": {
        "useMaxWidth": true,
        "titleTopMargin": 25,
        "dividerMargin": 10,
        "sizeUnit": 5,
        "padding": 8,
        "textHeight": 10,
        "titleShift": -15,
        "noteMargin": 10,
        "forkWidth": 70,
        "forkHeight": 7,
        "miniPadding": 2,
        "fontSizeFactor": 5.02,
        "fontSize": 24,
        "labelHeight": 16,
        "edgeLengthFactor": "20",
        "compositTitleSize": 35,
        "radius": 5,
        "defaultRenderer": "dagre-wrapper"
    },
    "er": {
        "useMaxWidth": true,
        "titleTopMargin": 25,
        "diagramPadding": 20,
        "layoutDirection": "TB",
        "minEntityWidth": 100,
        "minEntityHeight": 75,
        "entityPadding": 15,
        "nodeSpacing": 140,
        "rankSpacing": 80,
        "stroke": "gray",
        "fill": "honeydew",
        "fontSize": 12
    },
    "pie": {
        "useMaxWidth": true,
        "textPosition": 0.75,
        "donutHole": 0,
        "legendPosition": "right",
        "highlightSlice": ""
    },
    "quadrantChart": {
        "useMaxWidth": true,
        "chartWidth": 500,
        "chartHeight": 500,
        "titleFontSize": 20,
        "titlePadding": 10,
        "quadrantPadding": 5,
        "xAxisLabelPadding": 5,
        "yAxisLabelPadding": 5,
        "xAxisLabelFontSize": 16,
        "yAxisLabelFontSize": 16,
        "quadrantLabelFontSize": 16,
        "quadrantTextTopPadding": 5,
        "pointTextPadding": 5,
        "pointLabelFontSize": 12,
        "pointRadius": 5,
        "xAxisPosition": "top",
        "yAxisPosition": "left",
        "quadrantInternalBorderStrokeWidth": 1,
        "quadrantExternalBorderStrokeWidth": 2
    },
    "xyChart": {
        "useMaxWidth": true,
        "width": 700,
        "height": 500,
        "titleFontSize": 20,
        "titlePadding": 10,
        "showDataLabel": false,
        "showDataLabelOutsideBar": false,
        "showTitle": true,
        "showLegend": true,
        "legendFontSize": 14,
        "legendPadding": 10,
        "xAxis": {
            "$ref": "#/$defs/XYChartAxisConfig",
            "showLabel": true,
            "labelFontSize": 14,
            "labelPadding": 5,
            "showTitle": true,
            "titleFontSize": 16,
            "titlePadding": 5,
            "showTick": true,
            "tickLength": 5,
            "tickWidth": 2,
            "showAxisLine": true,
            "axisLineWidth": 2,
            "labelRotation": 0
        },
        "yAxis": {
            "$ref": "#/$defs/XYChartAxisConfig",
            "showLabel": true,
            "labelFontSize": 14,
            "labelPadding": 5,
            "showTitle": true,
            "titleFontSize": 16,
            "titlePadding": 5,
            "showTick": true,
            "tickLength": 5,
            "tickWidth": 2,
            "showAxisLine": true,
            "axisLineWidth": 2,
            "labelRotation": 0
        },
        "chartOrientation": "vertical",
        "plotReservedSpacePercent": 50
    },
    "requirement": {
        "useMaxWidth": true,
        "rect_fill": "#f9f9f9",
        "text_color": "#333",
        "rect_border_size": "0.5px",
        "rect_border_color": "#bbb",
        "rect_min_width": 200,
        "rect_min_height": 200,
        "fontSize": 14,
        "rect_padding": 10,
        "line_height": 20
    },
    "mindmap": {
        "useMaxWidth": true,
        "padding": 10,
        "maxNodeWidth": 200,
        "layoutAlgorithm": "cose-bilkent"
    },
    "ishikawa": {
        "useMaxWidth": true,
        "diagramPadding": 20
    },
    "kanban": {
        "useMaxWidth": true,
        "padding": 8,
        "sectionWidth": 200,
        "ticketBaseUrl": ""
    },
    "timeline": {
        "useMaxWidth": true,
        "diagramMarginX": 50,
        "diagramMarginY": 10,
        "leftMargin": 150,
        "width": 150,
        "height": 50,
        "boxMargin": 10,
        "boxTextMargin": 5,
        "noteMargin": 10,
        "messageMargin": 35,
        "messageAlign": "center",
        "bottomMarginAdj": 1,
        "rightAngles": false,
        "taskFontSize": 14,
        "taskFontFamily": '"Open Sans", sans-serif',
        "taskMargin": 50,
        "activationWidth": 10,
        "textPlacement": "fo",
        "actorColours": [
            "#8FBC8F",
            "#7CFC00",
            "#00FFFF",
            "#20B2AA",
            "#B0E0E6",
            "#FFFFE0"
        ],
        "sectionFills": [
            "#191970",
            "#8B008B",
            "#4B0082",
            "#2F4F4F",
            "#800000",
            "#8B4513",
            "#00008B"
        ],
        "sectionColours": [
            "#fff"
        ],
        "disableMulticolor": false
    },
    "gitGraph": {
        "useMaxWidth": true,
        "titleTopMargin": 25,
        "diagramPadding": 8,
        "nodeLabel": {
            "width": 75,
            "height": 100,
            "x": -25,
            "y": 0
        },
        "mainBranchName": "main",
        "mainBranchOrder": 0,
        "showCommitLabel": true,
        "showBranches": true,
        "rotateCommitLabel": true,
        "parallelCommits": false,
        "arrowMarkerAbsolute": false
    },
    "c4": {
        "useMaxWidth": true,
        "diagramMarginX": 50,
        "diagramMarginY": 10,
        "c4ShapeMargin": 50,
        "c4ShapePadding": 20,
        "width": 216,
        "height": 60,
        "boxMargin": 10,
        "c4ShapeInRow": 4,
        "nextLinePaddingX": 0,
        "c4BoundaryInRow": 2,
        "personFontSize": 14,
        "personFontFamily": '"Open Sans", sans-serif',
        "personFontWeight": "normal",
        "external_personFontSize": 14,
        "external_personFontFamily": '"Open Sans", sans-serif',
        "external_personFontWeight": "normal",
        "systemFontSize": 14,
        "systemFontFamily": '"Open Sans", sans-serif',
        "systemFontWeight": "normal",
        "external_systemFontSize": 14,
        "external_systemFontFamily": '"Open Sans", sans-serif',
        "external_systemFontWeight": "normal",
        "system_dbFontSize": 14,
        "system_dbFontFamily": '"Open Sans", sans-serif',
        "system_dbFontWeight": "normal",
        "external_system_dbFontSize": 14,
        "external_system_dbFontFamily": '"Open Sans", sans-serif',
        "external_system_dbFontWeight": "normal",
        "system_queueFontSize": 14,
        "system_queueFontFamily": '"Open Sans", sans-serif',
        "system_queueFontWeight": "normal",
        "external_system_queueFontSize": 14,
        "external_system_queueFontFamily": '"Open Sans", sans-serif',
        "external_system_queueFontWeight": "normal",
        "boundaryFontSize": 14,
        "boundaryFontFamily": '"Open Sans", sans-serif',
        "boundaryFontWeight": "normal",
        "messageFontSize": 12,
        "messageFontFamily": '"Open Sans", sans-serif',
        "messageFontWeight": "normal",
        "containerFontSize": 14,
        "containerFontFamily": '"Open Sans", sans-serif',
        "containerFontWeight": "normal",
        "external_containerFontSize": 14,
        "external_containerFontFamily": '"Open Sans", sans-serif',
        "external_containerFontWeight": "normal",
        "container_dbFontSize": 14,
        "container_dbFontFamily": '"Open Sans", sans-serif',
        "container_dbFontWeight": "normal",
        "external_container_dbFontSize": 14,
        "external_container_dbFontFamily": '"Open Sans", sans-serif',
        "external_container_dbFontWeight": "normal",
        "container_queueFontSize": 14,
        "container_queueFontFamily": '"Open Sans", sans-serif',
        "container_queueFontWeight": "normal",
        "external_container_queueFontSize": 14,
        "external_container_queueFontFamily": '"Open Sans", sans-serif',
        "external_container_queueFontWeight": "normal",
        "componentFontSize": 14,
        "componentFontFamily": '"Open Sans", sans-serif',
        "componentFontWeight": "normal",
        "external_componentFontSize": 14,
        "external_componentFontFamily": '"Open Sans", sans-serif',
        "external_componentFontWeight": "normal",
        "component_dbFontSize": 14,
        "component_dbFontFamily": '"Open Sans", sans-serif',
        "component_dbFontWeight": "normal",
        "external_component_dbFontSize": 14,
        "external_component_dbFontFamily": '"Open Sans", sans-serif',
        "external_component_dbFontWeight": "normal",
        "component_queueFontSize": 14,
        "component_queueFontFamily": '"Open Sans", sans-serif',
        "component_queueFontWeight": "normal",
        "external_component_queueFontSize": 14,
        "external_component_queueFontFamily": '"Open Sans", sans-serif',
        "external_component_queueFontWeight": "normal",
        "wrap": true,
        "wrapPadding": 10,
        "person_bg_color": "#08427B",
        "person_border_color": "#073B6F",
        "external_person_bg_color": "#686868",
        "external_person_border_color": "#8A8A8A",
        "system_bg_color": "#1168BD",
        "system_border_color": "#3C7FC0",
        "system_db_bg_color": "#1168BD",
        "system_db_border_color": "#3C7FC0",
        "system_queue_bg_color": "#1168BD",
        "system_queue_border_color": "#3C7FC0",
        "external_system_bg_color": "#999999",
        "external_system_border_color": "#8A8A8A",
        "external_system_db_bg_color": "#999999",
        "external_system_db_border_color": "#8A8A8A",
        "external_system_queue_bg_color": "#999999",
        "external_system_queue_border_color": "#8A8A8A",
        "container_bg_color": "#438DD5",
        "container_border_color": "#3C7FC0",
        "container_db_bg_color": "#438DD5",
        "container_db_border_color": "#3C7FC0",
        "container_queue_bg_color": "#438DD5",
        "container_queue_border_color": "#3C7FC0",
        "external_container_bg_color": "#B3B3B3",
        "external_container_border_color": "#A6A6A6",
        "external_container_db_bg_color": "#B3B3B3",
        "external_container_db_border_color": "#A6A6A6",
        "external_container_queue_bg_color": "#B3B3B3",
        "external_container_queue_border_color": "#A6A6A6",
        "component_bg_color": "#85BBF0",
        "component_border_color": "#78A8D8",
        "component_db_bg_color": "#85BBF0",
        "component_db_border_color": "#78A8D8",
        "component_queue_bg_color": "#85BBF0",
        "component_queue_border_color": "#78A8D8",
        "external_component_bg_color": "#CCCCCC",
        "external_component_border_color": "#BFBFBF",
        "external_component_db_bg_color": "#CCCCCC",
        "external_component_db_border_color": "#BFBFBF",
        "external_component_queue_bg_color": "#CCCCCC",
        "external_component_queue_border_color": "#BFBFBF"
    },
    "sankey": {
        "useMaxWidth": true,
        "width": 600,
        "height": 400,
        "linkColor": "gradient",
        "nodeAlignment": "justify",
        "showValues": true,
        "prefix": "",
        "suffix": "",
        "nodeWidth": 10,
        "nodePadding": 12,
        "labelStyle": "legacy"
    },
    "block": {
        "useMaxWidth": true,
        "padding": 8
    },
    "packet": {
        "useMaxWidth": true,
        "rowHeight": 32,
        "bitWidth": 32,
        "bitsPerRow": 32,
        "showBits": true,
        "paddingX": 5,
        "paddingY": 5
    },
    "treeView": {
        "useMaxWidth": true,
        "rowIndent": 10,
        "paddingX": 5,
        "paddingY": 5,
        "lineThickness": 1,
        "showIcons": false,
        "defaultIconPack": "",
        "filenameIcons": {},
        "extensionIcons": {}
    },
    "architecture": {
        "useMaxWidth": true,
        "padding": 40,
        "iconSize": 80,
        "fontSize": 16,
        "randomize": false,
        "nodeSeparation": 75,
        "idealEdgeLengthMultiplier": 1.5,
        "edgeElasticity": 0.45,
        "numIter": 2500,
        "seed": 1
    },
    "eventmodeling": {
        "useMaxWidth": true,
        "padding": 30,
        "rowHeight": 32
    },
    "radar": {
        "useMaxWidth": true,
        "width": 600,
        "height": 600,
        "marginTop": 50,
        "marginRight": 50,
        "marginBottom": 50,
        "marginLeft": 50,
        "axisScaleFactor": 1,
        "axisLabelFactor": 1.05,
        "curveTension": 0.17
    },
    "venn": {
        "useMaxWidth": true,
        "width": 800,
        "height": 450,
        "padding": 8,
        "useDebugLayout": false
    },
    "cynefin": {
        "useMaxWidth": true,
        "width": 800,
        "height": 600,
        "padding": 40,
        "showDomainDescriptions": true,
        "boundaryAmplitude": 8,
        "seed": 0
    },
    "theme": "default",
    "look": "classic",
    "handDrawnSeed": 0,
    "layout": "dagre",
    "maxTextSize": 5e4,
    "maxEdges": 500,
    "darkMode": false,
    "fontFamily": '"trebuchet ms", verdana, arial, sans-serif;',
    "logLevel": 5,
    "securityLevel": "strict",
    "startOnLoad": true,
    "arrowMarkerAbsolute": false,
    "secure": [
        "secure",
        "securityLevel",
        "startOnLoad",
        "maxTextSize",
        "suppressErrorRendering",
        "maxEdges"
    ],
    "legacyMathML": false,
    "forceLegacyMathML": false,
    "deterministicIds": false,
    "fontSize": 16,
    "markdownAutoWrap": true,
    "suppressErrorRendering": false
};
// src/defaultConfig.ts
var config = {
    ...config_schema_default,
    // Set, even though they're `undefined` so that `configKeys` finds these keys
    // TODO: Should we replace these with `null` so that they can go in the JSON Schema?
    deterministicIDSeed: void 0,
    elk: {
        // mergeEdges is needed here to be considered
        mergeEdges: false,
        nodePlacementStrategy: "BRANDES_KOEPF",
        nodePlacementAlignment: "NONE",
        forceNodeModelOrder: false,
        considerModelOrder: "NODES_AND_EDGES",
        keepEntryNodeOnTop: false
    },
    themeCSS: void 0,
    // add non-JSON default config values
    themeVariables: themes_default.default.getThemeVariables(),
    sequence: {
        ...config_schema_default.sequence,
        messageFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.messageFontFamily,
                fontSize: this.messageFontSize,
                fontWeight: this.messageFontWeight
            };
        }, "messageFont"),
        noteFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.noteFontFamily,
                fontSize: this.noteFontSize,
                fontWeight: this.noteFontWeight
            };
        }, "noteFont"),
        actorFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.actorFontFamily,
                fontSize: this.actorFontSize,
                fontWeight: this.actorFontWeight
            };
        }, "actorFont")
    },
    class: {
        defaultRenderer: "dagre-wrapper",
        hideEmptyMembersBox: false,
        hierarchicalNamespaces: true
    },
    gantt: {
        ...config_schema_default.gantt,
        tickInterval: void 0,
        useWidth: void 0
    },
    c4: {
        ...config_schema_default.c4,
        useWidth: void 0,
        personFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.personFontFamily,
                fontSize: this.personFontSize,
                fontWeight: this.personFontWeight
            };
        }, "personFont"),
        flowchart: {
            ...config_schema_default.flowchart,
            inheritDir: false
        },
        external_personFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.external_personFontFamily,
                fontSize: this.external_personFontSize,
                fontWeight: this.external_personFontWeight
            };
        }, "external_personFont"),
        systemFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.systemFontFamily,
                fontSize: this.systemFontSize,
                fontWeight: this.systemFontWeight
            };
        }, "systemFont"),
        external_systemFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.external_systemFontFamily,
                fontSize: this.external_systemFontSize,
                fontWeight: this.external_systemFontWeight
            };
        }, "external_systemFont"),
        system_dbFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.system_dbFontFamily,
                fontSize: this.system_dbFontSize,
                fontWeight: this.system_dbFontWeight
            };
        }, "system_dbFont"),
        external_system_dbFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.external_system_dbFontFamily,
                fontSize: this.external_system_dbFontSize,
                fontWeight: this.external_system_dbFontWeight
            };
        }, "external_system_dbFont"),
        system_queueFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.system_queueFontFamily,
                fontSize: this.system_queueFontSize,
                fontWeight: this.system_queueFontWeight
            };
        }, "system_queueFont"),
        external_system_queueFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.external_system_queueFontFamily,
                fontSize: this.external_system_queueFontSize,
                fontWeight: this.external_system_queueFontWeight
            };
        }, "external_system_queueFont"),
        containerFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.containerFontFamily,
                fontSize: this.containerFontSize,
                fontWeight: this.containerFontWeight
            };
        }, "containerFont"),
        external_containerFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.external_containerFontFamily,
                fontSize: this.external_containerFontSize,
                fontWeight: this.external_containerFontWeight
            };
        }, "external_containerFont"),
        container_dbFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.container_dbFontFamily,
                fontSize: this.container_dbFontSize,
                fontWeight: this.container_dbFontWeight
            };
        }, "container_dbFont"),
        external_container_dbFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.external_container_dbFontFamily,
                fontSize: this.external_container_dbFontSize,
                fontWeight: this.external_container_dbFontWeight
            };
        }, "external_container_dbFont"),
        container_queueFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.container_queueFontFamily,
                fontSize: this.container_queueFontSize,
                fontWeight: this.container_queueFontWeight
            };
        }, "container_queueFont"),
        external_container_queueFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.external_container_queueFontFamily,
                fontSize: this.external_container_queueFontSize,
                fontWeight: this.external_container_queueFontWeight
            };
        }, "external_container_queueFont"),
        componentFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.componentFontFamily,
                fontSize: this.componentFontSize,
                fontWeight: this.componentFontWeight
            };
        }, "componentFont"),
        external_componentFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.external_componentFontFamily,
                fontSize: this.external_componentFontSize,
                fontWeight: this.external_componentFontWeight
            };
        }, "external_componentFont"),
        component_dbFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.component_dbFontFamily,
                fontSize: this.component_dbFontSize,
                fontWeight: this.component_dbFontWeight
            };
        }, "component_dbFont"),
        external_component_dbFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.external_component_dbFontFamily,
                fontSize: this.external_component_dbFontSize,
                fontWeight: this.external_component_dbFontWeight
            };
        }, "external_component_dbFont"),
        component_queueFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.component_queueFontFamily,
                fontSize: this.component_queueFontSize,
                fontWeight: this.component_queueFontWeight
            };
        }, "component_queueFont"),
        external_component_queueFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.external_component_queueFontFamily,
                fontSize: this.external_component_queueFontSize,
                fontWeight: this.external_component_queueFontWeight
            };
        }, "external_component_queueFont"),
        boundaryFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.boundaryFontFamily,
                fontSize: this.boundaryFontSize,
                fontWeight: this.boundaryFontWeight
            };
        }, "boundaryFont"),
        messageFont: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
            return {
                fontFamily: this.messageFontFamily,
                fontSize: this.messageFontSize,
                fontWeight: this.messageFontWeight
            };
        }, "messageFont")
    },
    pie: {
        ...config_schema_default.pie,
        useWidth: 984
    },
    xyChart: {
        ...config_schema_default.xyChart,
        useWidth: void 0
    },
    requirement: {
        ...config_schema_default.requirement,
        useWidth: void 0
    },
    packet: {
        ...config_schema_default.packet
    },
    eventmodeling: {
        ...config_schema_default.eventmodeling
    },
    treeView: {
        ...config_schema_default.treeView,
        useWidth: void 0
    },
    radar: {
        ...config_schema_default.radar
    },
    railroad: {
        ...config_schema_default.railroad,
        // Railroad colors and typography derive from the active theme unless explicitly overridden.
        fontSize: void 0,
        fontFamily: void 0,
        terminalFill: void 0,
        terminalStroke: void 0,
        terminalTextColor: void 0,
        nonTerminalFill: void 0,
        nonTerminalStroke: void 0,
        nonTerminalTextColor: void 0,
        lineColor: void 0,
        markerFill: void 0,
        commentFill: void 0,
        commentStroke: void 0,
        commentTextColor: void 0,
        specialFill: void 0,
        specialStroke: void 0,
        ruleNameColor: void 0
    },
    ishikawa: {
        ...config_schema_default.ishikawa
    },
    sankey: {
        ...config_schema_default.sankey,
        // Set so that `configKeys` includes this key for sanitizeDirective
        nodeColors: void 0
    },
    treemap: {
        useMaxWidth: true,
        padding: 10,
        diagramPadding: 8,
        showValues: true,
        nodeWidth: 100,
        nodeHeight: 40,
        borderWidth: 1,
        valueFontSize: 12,
        labelFontSize: 14,
        valueFormat: ","
    },
    venn: {
        ...config_schema_default.venn
    },
    cynefin: {
        ...config_schema_default.cynefin
    }
};
var keyify = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((obj, prefix = "")=>Object.keys(obj).reduce((res, el)=>{
        if (Array.isArray(obj[el])) {
            return res;
        } else if (typeof obj[el] === "object" && obj[el] !== null) {
            return [
                ...res,
                prefix + el,
                ...keyify(obj[el], "")
            ];
        }
        return [
            ...res,
            prefix + el
        ];
    }, []), "keyify");
var configKeys = new Set(keyify(config, ""));
var defaultConfig_default = config;
// src/utils/sanitizeDirective.ts
var DICTIONARY_CONFIG_PATTERNS = {
    // CSS colors (sankey)
    nodeColors: /^#[\da-f]{3,8}$|^rgb\([\d\s%,.]+\)$|^hsl\([\d\s%,.]+\)$|^[a-z]+$/i,
    // iconify icon references (treeView filenameIcons/extensionIcons)
    filenameIcons: /^[\w-]+(?::[\w-]+)?$/,
    extensionIcons: /^[\w-]+(?::[\w-]+)?$/
};
var sanitizeDictionaryConfig = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((dict, valuePattern)=>{
    for (const key of Object.keys(dict)){
        const value = dict[key];
        if (key.startsWith("__") || key.includes("proto") || key.includes("constr") || typeof value !== "string" || !valuePattern.test(value)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("sanitize deleting dictionary entry:", key, value);
            delete dict[key];
        }
    }
}, "sanitizeDictionaryConfig");
var sanitizeDirective = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((args)=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("sanitizeDirective called with", args);
    if (typeof args !== "object" || args == null) {
        return;
    }
    if (Array.isArray(args)) {
        args.forEach((arg)=>sanitizeDirective(arg));
        return;
    }
    for (const key of Object.keys(args)){
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Checking key", key);
        if (key.startsWith("__") || key.includes("proto") || key.includes("constr") || !configKeys.has(key) || args[key] == null) {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("sanitize deleting key: ", key);
            delete args[key];
            continue;
        }
        if (typeof args[key] === "object") {
            const valuePattern = DICTIONARY_CONFIG_PATTERNS[key];
            if (valuePattern) {
                sanitizeDictionaryConfig(args[key], valuePattern);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("sanitizing object", key);
                sanitizeDirective(args[key]);
            }
            continue;
        }
        const cssMatchers = [
            "themeCSS",
            "fontFamily",
            "altFontFamily"
        ];
        for (const cssKey of cssMatchers){
            if (key.includes(cssKey)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("sanitizing css option", key);
                args[key] = sanitizeCss(args[key]);
            }
        }
    }
    if (args.themeVariables) {
        for (const k of Object.keys(args.themeVariables)){
            const val = args.themeVariables[k];
            if (val?.match && !val.match(/^[\d "#%(),.;A-Za-z]+$/)) {
                args.themeVariables[k] = "";
            }
        }
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("After sanitization", args);
}, "sanitizeDirective");
var sanitizeCss = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((str)=>{
    let startCnt = 0;
    let endCnt = 0;
    for (const element of str){
        if (startCnt < endCnt) {
            return "{ /* ERROR: Unbalanced CSS */ }";
        }
        if (element === "{") {
            startCnt++;
        } else if (element === "}") {
            endCnt++;
        }
    }
    if (startCnt !== endCnt) {
        return "{ /* ERROR: Unbalanced CSS */ }";
    }
    return str;
}, "sanitizeCss");
// src/config.ts
var defaultConfig = Object.freeze(defaultConfig_default);
var evaluate = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((val)=>val === false || [
        "false",
        "null",
        "0"
    ].includes(String(val).trim().toLowerCase()) ? false : true, "evaluate");
var siteConfig = assignWithDepth_default({}, defaultConfig);
var configFromInitialize;
var directives = [];
var currentConfig = assignWithDepth_default({}, defaultConfig);
var updateCurrentConfig = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((siteCfg, _directives)=>{
    let cfg = assignWithDepth_default({}, siteCfg);
    let sumOfDirectives = {};
    for (const d of _directives){
        sanitize(d);
        sumOfDirectives = assignWithDepth_default(sumOfDirectives, d);
    }
    cfg = assignWithDepth_default(cfg, sumOfDirectives);
    if (sumOfDirectives.theme && sumOfDirectives.theme in themes_default) {
        const tmpConfigFromInitialize = assignWithDepth_default({}, configFromInitialize);
        const themeVariables = assignWithDepth_default(tmpConfigFromInitialize.themeVariables || {}, sumOfDirectives.themeVariables);
        if (cfg.theme && cfg.theme in themes_default) {
            cfg.themeVariables = themes_default[cfg.theme].getThemeVariables(themeVariables);
        }
    }
    currentConfig = cfg;
    checkConfig(currentConfig);
    return currentConfig;
}, "updateCurrentConfig");
var setSiteConfig = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((conf)=>{
    siteConfig = assignWithDepth_default({}, defaultConfig);
    siteConfig = assignWithDepth_default(siteConfig, conf);
    if (conf.theme && themes_default[conf.theme]) {
        siteConfig.themeVariables = themes_default[conf.theme].getThemeVariables(conf.themeVariables);
    }
    updateCurrentConfig(siteConfig, directives);
    return siteConfig;
}, "setSiteConfig");
var saveConfigFromInitialize = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((conf)=>{
    configFromInitialize = assignWithDepth_default({}, conf);
}, "saveConfigFromInitialize");
var updateSiteConfig = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((conf)=>{
    siteConfig = assignWithDepth_default(siteConfig, conf);
    updateCurrentConfig(siteConfig, directives);
    return siteConfig;
}, "updateSiteConfig");
var getSiteConfig = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>{
    return assignWithDepth_default({}, siteConfig);
}, "getSiteConfig");
var setConfig = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((conf)=>{
    updateCurrentConfig(currentConfig, [
        conf
    ]);
    return getConfig();
}, "setConfig");
var getConfig = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>{
    return assignWithDepth_default({}, currentConfig);
}, "getConfig");
var sanitize = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((options)=>{
    if (!options) {
        return;
    }
    [
        "secure",
        ...siteConfig.secure ?? []
    ].forEach((key)=>{
        if (Object.hasOwn(options, key)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug(`Denied attempt to modify a secure key ${key}`, options[key]);
            delete options[key];
        }
    });
    Object.keys(options).forEach((key)=>{
        if (key.startsWith("__")) {
            delete options[key];
        }
    });
    Object.keys(options).forEach((key)=>{
        if (typeof options[key] === "string" && (options[key].includes("<") || options[key].includes(">") || options[key].includes("url(data:"))) {
            delete options[key];
        }
        if (typeof options[key] === "object") {
            sanitize(options[key]);
        }
    });
}, "sanitize");
var addDirective = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((directive)=>{
    sanitizeDirective(directive);
    if (directive.fontFamily && !directive.themeVariables?.fontFamily) {
        directive.themeVariables = {
            ...directive.themeVariables,
            fontFamily: directive.fontFamily
        };
    }
    directives.push(directive);
    updateCurrentConfig(siteConfig, directives);
}, "addDirective");
var reset = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((config2 = siteConfig)=>{
    directives = [];
    updateCurrentConfig(config2, directives);
}, "reset");
var ConfigWarning = {
    LAZY_LOAD_DEPRECATED: "The configuration options lazyLoadedDiagrams and loadExternalDiagramsAtStartup are deprecated. Please use registerExternalDiagrams instead.",
    FLOWCHART_HTML_LABELS_DEPRECATED: "flowchart.htmlLabels is deprecated. Please use global htmlLabels instead."
};
var issuedWarnings = {};
var issueWarning = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((warning)=>{
    if (issuedWarnings[warning]) {
        return;
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].warn(ConfigWarning[warning]);
    issuedWarnings[warning] = true;
}, "issueWarning");
var checkConfig = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((config2)=>{
    if (!config2) {
        return;
    }
    if (config2.lazyLoadedDiagrams || config2.loadExternalDiagramsAtStartup) {
        issueWarning("LAZY_LOAD_DEPRECATED");
    }
}, "checkConfig");
var getUserDefinedConfig = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>{
    let userConfig = {};
    if (configFromInitialize) {
        userConfig = assignWithDepth_default(userConfig, configFromInitialize);
    }
    for (const d of directives){
        userConfig = assignWithDepth_default(userConfig, d);
    }
    return userConfig;
}, "getUserDefinedConfig");
var getEffectiveHtmlLabels = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((config2)=>{
    if (config2.flowchart?.htmlLabels != void 0) {
        issueWarning("FLOWCHART_HTML_LABELS_DEPRECATED");
    }
    return evaluate(config2.htmlLabels ?? config2.flowchart?.htmlLabels ?? true);
}, "getEffectiveHtmlLabels");
// src/diagram-api/regexes.ts
var frontMatterRegex = /^([^\S\n\r]*)-{3}\s*[\n\r](.*?)[\n\r]\1-{3}\s*[\n\r]+/s;
var directiveRegex = /%{2}{\s*(?:(\w+)\s*:|(\w+))\s*(?:(\w+)|((?:(?!}%{2}).|\r?\n)*))?\s*(?:}%{2})?/gi;
var anyCommentRegex = /\s*%%.*\n/gm;
// src/errors.ts
var UnknownDiagramError = class extends Error {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "UnknownDiagramError");
    }
    constructor(message){
        super(message);
        this.name = "UnknownDiagramError";
    }
};
// src/diagram-api/detectType.ts
var detectors = {};
var detectType = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(text, config2) {
    text = text.replace(frontMatterRegex, "").replace(directiveRegex, "").replace(anyCommentRegex, "\n");
    for (const [key, { detector }] of Object.entries(detectors)){
        const diagram = detector(text, config2);
        if (diagram) {
            return key;
        }
    }
    throw new UnknownDiagramError(`No diagram type detected matching given configuration for text: ${text}`);
}, "detectType");
var registerLazyLoadedDiagrams = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((...diagrams2)=>{
    for (const { id, detector, loader } of diagrams2){
        addDetector(id, detector, loader);
    }
}, "registerLazyLoadedDiagrams");
var addDetector = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((key, detector, loader)=>{
    if (detectors[key]) {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].warn(`Detector with key ${key} already exists. Overwriting.`);
    }
    detectors[key] = {
        detector,
        loader
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug(`Detector with key ${key} added${loader ? " with loader" : ""}`);
}, "addDetector");
var getDiagramLoader = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((key)=>{
    return detectors[key].loader;
}, "getDiagramLoader");
;
var lineBreakRegex = /<br\s*\/?>/gi;
var getRows = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((s)=>{
    if (!s) {
        return [
            ""
        ];
    }
    const str = breakToPlaceholder(s).replace(/\\n/g, "#br#");
    return str.split("#br#");
}, "getRows");
var setupDompurifyHooksIfNotSetup = /* @__PURE__ */ (()=>{
    let setup = false;
    return ()=>{
        if (!setup) {
            setupDompurifyHooks();
            setup = true;
        }
    };
})();
function setupDompurifyHooks() {
    const TEMPORARY_ATTRIBUTE = "data-temp-href-target";
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dompurify$2f$dist$2f$purify$2e$es$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].addHook("beforeSanitizeAttributes", (node)=>{
        if (node.tagName === "A" && node.hasAttribute("target")) {
            node.setAttribute(TEMPORARY_ATTRIBUTE, node.getAttribute("target") ?? "");
        }
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dompurify$2f$dist$2f$purify$2e$es$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].addHook("afterSanitizeAttributes", (node)=>{
        if (node.tagName === "A" && node.hasAttribute(TEMPORARY_ATTRIBUTE)) {
            node.setAttribute("target", node.getAttribute(TEMPORARY_ATTRIBUTE) ?? "");
            node.removeAttribute(TEMPORARY_ATTRIBUTE);
            if (node.getAttribute("target") === "_blank") {
                node.setAttribute("rel", "noopener");
            }
        }
    });
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(setupDompurifyHooks, "setupDompurifyHooks");
var removeScript = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((txt)=>{
    setupDompurifyHooksIfNotSetup();
    const sanitizedText = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dompurify$2f$dist$2f$purify$2e$es$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].sanitize(txt);
    return sanitizedText;
}, "removeScript");
var sanitizeMore = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((text, config2)=>{
    if (getEffectiveHtmlLabels(config2)) {
        const level = config2.securityLevel;
        if (level === "antiscript" || level === "strict" || level === "sandbox") {
            text = removeScript(text);
        } else if (level !== "loose") {
            text = breakToPlaceholder(text);
            text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            text = text.replace(/=/g, "&equals;");
            text = placeholderToBreak(text);
        }
    }
    return text;
}, "sanitizeMore");
var sanitizeText = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((text, config2)=>{
    if (!text) {
        return text;
    }
    if (config2.dompurifyConfig) {
        text = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dompurify$2f$dist$2f$purify$2e$es$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].sanitize(sanitizeMore(text, config2), config2.dompurifyConfig).toString();
    } else {
        text = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dompurify$2f$dist$2f$purify$2e$es$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].sanitize(sanitizeMore(text, config2), {
            FORBID_TAGS: [
                "style"
            ]
        }).toString();
    }
    return text;
}, "sanitizeText");
var sanitizeTextOrArray = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((a, config2)=>{
    if (typeof a === "string") {
        return sanitizeText(a, config2);
    }
    return a.flat().map((x)=>sanitizeText(x, config2));
}, "sanitizeTextOrArray");
var hasBreaks = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((text)=>{
    return lineBreakRegex.test(text);
}, "hasBreaks");
var splitBreaks = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((text)=>{
    return text.split(lineBreakRegex);
}, "splitBreaks");
var placeholderToBreak = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((s)=>{
    return s.replace(/#br#/g, "<br/>");
}, "placeholderToBreak");
var breakToPlaceholder = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((s)=>{
    return s.replace(lineBreakRegex, "#br#");
}, "breakToPlaceholder");
var getUrl = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((useAbsolute)=>{
    let url = "";
    if (useAbsolute) {
        url = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search;
        url = CSS.escape(url);
    }
    return url;
}, "getUrl");
var getMax = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(...values) {
    const newValues = values.filter((value)=>{
        return !isNaN(value);
    });
    return Math.max(...newValues);
}, "getMax");
var getMin = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(...values) {
    const newValues = values.filter((value)=>{
        return !isNaN(value);
    });
    return Math.min(...newValues);
}, "getMin");
var parseGenericTypes = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(input) {
    const inputSets = input.split(/(,)/);
    const output = [];
    for(let i = 0; i < inputSets.length; i++){
        let thisSet = inputSets[i];
        if (thisSet === "," && i > 0 && i + 1 < inputSets.length) {
            const previousSet = inputSets[i - 1];
            const nextSet = inputSets[i + 1];
            if (shouldCombineSets(previousSet, nextSet)) {
                thisSet = previousSet + "," + nextSet;
                i++;
                output.pop();
            }
        }
        output.push(processSet(thisSet));
    }
    return output.join("");
}, "parseGenericTypes");
var countOccurrence = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((string, substring)=>{
    return Math.max(0, string.split(substring).length - 1);
}, "countOccurrence");
var shouldCombineSets = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((previousSet, nextSet)=>{
    const prevCount = countOccurrence(previousSet, "~");
    const nextCount = countOccurrence(nextSet, "~");
    return prevCount === 1 && nextCount === 1;
}, "shouldCombineSets");
var processSet = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((input)=>{
    const tildeCount = countOccurrence(input, "~");
    let hasStartingTilde = false;
    if (tildeCount <= 1) {
        return input;
    }
    if (tildeCount % 2 !== 0 && input.startsWith("~")) {
        input = input.substring(1);
        hasStartingTilde = true;
    }
    const chars = [
        ...input
    ];
    let first = chars.indexOf("~");
    let last = chars.lastIndexOf("~");
    while(first !== -1 && last !== -1 && first !== last){
        chars[first] = "<";
        chars[last] = ">";
        first = chars.indexOf("~");
        last = chars.lastIndexOf("~");
    }
    if (hasStartingTilde) {
        chars.unshift("~");
    }
    return chars.join("");
}, "processSet");
var isMathMLSupported = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>window.MathMLElement !== void 0, "isMathMLSupported");
var katexRegex = /\$\$(.*?)\$\$/g;
var hasKatex = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((text)=>(text.match(katexRegex)?.length ?? 0) > 0, "hasKatex");
var calculateMathMLDimensions = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async (text, config2)=>{
    const divElem = document.createElement("div");
    divElem.innerHTML = await renderKatexSanitized(text, config2);
    divElem.id = "katex-temp";
    divElem.style.visibility = "hidden";
    divElem.style.position = "absolute";
    divElem.style.top = "0";
    const body = document.querySelector("body");
    body?.insertAdjacentElement("beforeend", divElem);
    const dim = {
        width: divElem.clientWidth,
        height: divElem.clientHeight
    };
    divElem.remove();
    return dim;
}, "calculateMathMLDimensions");
var renderKatexUnsanitized = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async (text, config2)=>{
    if (!hasKatex(text)) {
        return text;
    }
    if (!(isMathMLSupported() || config2.legacyMathML || config2.forceLegacyMathML)) {
        return text.replace(katexRegex, "MathML is unsupported in this environment.");
    }
    if ("TURBOPACK compile-time truthy", 1) {
        const { default: katex } = await __turbopack_context__.A("[project]/frontend/node_modules/katex/dist/katex.mjs [app-client] (ecmascript, async loader)");
        const outputMode = config2.forceLegacyMathML || !isMathMLSupported() && config2.legacyMathML ? "htmlAndMathml" : "mathml";
        return text.split(lineBreakRegex).map((line)=>hasKatex(line) ? `<div style="display: flex; align-items: center; justify-content: center; white-space: nowrap;">${line}</div>` : `<div>${line}</div>`).join("").replace(katexRegex, (_, c)=>katex.renderToString(c, {
                throwOnError: true,
                displayMode: true,
                output: outputMode
            }).replace(/\n/g, " ").replace(/<annotation.*<\/annotation>/g, ""));
    }
    //TURBOPACK unreachable
    ;
}, "renderKatexUnsanitized");
var renderKatexSanitized = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async (text, config2)=>{
    return sanitizeText(await renderKatexUnsanitized(text, config2), config2);
}, "renderKatexSanitized");
var common_default = {
    getRows,
    sanitizeText,
    sanitizeTextOrArray,
    hasBreaks,
    splitBreaks,
    lineBreakRegex,
    removeScript,
    getUrl,
    evaluate,
    getMax,
    getMin
};
// src/setupGraphViewbox.js
var d3Attrs = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(d3Elem, attrs) {
    for (let attr of attrs){
        d3Elem.attr(attr[0], attr[1]);
    }
}, "d3Attrs");
var calculateSvgSizeAttrs = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(height, width, useMaxWidth) {
    let attrs = /* @__PURE__ */ new Map();
    if (useMaxWidth) {
        attrs.set("width", "100%");
        attrs.set("style", `max-width: ${width}px;`);
    } else {
        attrs.set("height", height);
        attrs.set("width", width);
    }
    return attrs;
}, "calculateSvgSizeAttrs");
var configureSvgSize = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(svgElem, height, width, useMaxWidth) {
    const attrs = calculateSvgSizeAttrs(height, width, useMaxWidth);
    d3Attrs(svgElem, attrs);
}, "configureSvgSize");
var setupGraphViewbox = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(graph, svgElem, padding, useMaxWidth) {
    const svgBounds = svgElem.node().getBBox();
    const sWidth = svgBounds.width;
    const sHeight = svgBounds.height;
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info(`SVG bounds: ${sWidth}x${sHeight}`, svgBounds);
    let width = 0;
    let height = 0;
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info(`Graph bounds: ${width}x${height}`, graph);
    width = sWidth + padding * 2;
    height = sHeight + padding * 2;
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info(`Calculated bounds: ${width}x${height}`);
    configureSvgSize(svgElem, height, width, useMaxWidth);
    const vBox = `${svgBounds.x - padding} ${svgBounds.y - padding} ${svgBounds.width + 2 * padding} ${svgBounds.height + 2 * padding}`;
    svgElem.attr("viewBox", vBox);
}, "setupGraphViewbox");
// src/styles.ts
var themes = {};
function cssStyleSheetToString(cssStyleSheet) {
    return [
        ...cssStyleSheet.cssRules
    ].map((rule)=>rule.cssText).join("\n");
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(cssStyleSheetToString, "cssStyleSheetToString");
var getStyles = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((type, userStyles, options, svgId)=>{
    let diagramStyles = "";
    if (type in themes && themes[type]) {
        diagramStyles = themes[type]({
            ...options,
            svgId
        });
    } else {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].warn(`No theme found for ${type}`);
    }
    return `& {
    font-family: ${options.fontFamily};
    font-size: ${options.fontSize};
    fill: ${options.textColor}
  }
  @keyframes edge-animation-frame {
    from {
      stroke-dashoffset: 0;
    }
  }
  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
  & .edge-animation-slow {
    stroke-dasharray: 9,5 !important;
    stroke-dashoffset: 900;
    animation: dash 50s linear infinite;
    stroke-linecap: round;
  }
  & .edge-animation-fast {
    stroke-dasharray: 9,5 !important;
    stroke-dashoffset: 900;
    animation: dash 20s linear infinite;
    stroke-linecap: round;
  }
  /* Classes common for multiple diagrams */

  & .error-icon {
    fill: ${options.errorBkgColor};
  }
  & .error-text {
    fill: ${options.errorTextColor};
    stroke: ${options.errorTextColor};
  }

  & .edge-thickness-normal {
    stroke-width: ${options.strokeWidth ?? 1}px;
  }
  & .edge-thickness-thick {
    stroke-width: 3.5px
  }
  & .edge-pattern-solid {
    stroke-dasharray: 0;
  }
  & .edge-thickness-invisible {
    stroke-width: 0;
    fill: none;
  }
  & .edge-pattern-dashed{
    stroke-dasharray: 3;
  }
  .edge-pattern-dotted {
    stroke-dasharray: 2;
  }

  & .marker {
    fill: ${options.lineColor};
    stroke: ${options.lineColor};
  }
  & .marker.cross {
    stroke: ${options.lineColor};
  }

  & svg {
    font-family: ${options.fontFamily};
    font-size: ${options.fontSize};
  }
   & p {
    margin: 0
   }

  ${diagramStyles}
  .node .neo-node {
    stroke: ${options.nodeBorder};
  }

  [data-look="neo"].node rect, [data-look="neo"].cluster rect, [data-look="neo"].node polygon {
    stroke: ${options.useGradient ? "url(" + svgId + "-gradient)" : options.nodeBorder};
    filter: ${options.dropShadow ? options.dropShadow.replace("url(#drop-shadow)", `url(${svgId}-drop-shadow)`) : "none"};
  }
  [data-look="neo"].swimlane.cluster rect {
    filter: none;
  }


  [data-look="neo"].node path {
    stroke: ${options.useGradient ? "url(" + svgId + "-gradient)" : options.nodeBorder};
    stroke-width: ${options.strokeWidth ?? 1}px;
  }

  [data-look="neo"].node .outer-path {
    filter: ${options.dropShadow ? options.dropShadow.replace("url(#drop-shadow)", `url(${svgId}-drop-shadow)`) : "none"};
  }

  [data-look="neo"].node .neo-line path {
    stroke: ${options.nodeBorder};
    filter: none;
  }

  [data-look="neo"].node circle{
    stroke: ${options.useGradient ? "url(" + svgId + "-gradient)" : options.nodeBorder};
    filter: ${options.dropShadow ? options.dropShadow.replace("url(#drop-shadow)", `url(${svgId}-drop-shadow)`) : "none"};
  }

  [data-look="neo"].node circle .state-start{
    fill: #000000;
  }

  [data-look="neo"].icon-shape .icon {
    fill: ${options.useGradient ? "url(" + svgId + "-gradient)" : options.nodeBorder};
    filter: ${options.dropShadow ? options.dropShadow.replace("url(#drop-shadow)", `url(${svgId}-drop-shadow)`) : "none"};
  }

    [data-look="neo"].icon-shape .icon-neo path {
    stroke: ${options.useGradient ? "url(" + svgId + "-gradient)" : options.nodeBorder};
    filter: ${options.dropShadow ? options.dropShadow.replace("url(#drop-shadow)", `url(${svgId}-drop-shadow)`) : "none"};
  }

  ${userStyles}
`;
}, "getStyles");
var addStylesForDiagram = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((type, diagramTheme)=>{
    if (diagramTheme !== void 0) {
        themes[type] = diagramTheme;
    }
}, "addStylesForDiagram");
var styles_default = getStyles;
// src/diagrams/common/commonDb.ts
var commonDb_exports = {};
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__export"])(commonDb_exports, {
    clear: ()=>clear,
    getAccDescription: ()=>getAccDescription,
    getAccTitle: ()=>getAccTitle,
    getDiagramTitle: ()=>getDiagramTitle,
    setAccDescription: ()=>setAccDescription,
    setAccTitle: ()=>setAccTitle,
    setDiagramTitle: ()=>setDiagramTitle
});
var accTitle = "";
var diagramTitle = "";
var accDescription = "";
var sanitizeText2 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((txt)=>sanitizeText(txt, getConfig()), "sanitizeText");
var clear = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>{
    accTitle = "";
    accDescription = "";
    diagramTitle = "";
}, "clear");
var setAccTitle = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((txt)=>{
    accTitle = sanitizeText2(txt).replace(/^\s+/g, "");
}, "setAccTitle");
var getAccTitle = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>accTitle, "getAccTitle");
var setAccDescription = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((txt)=>{
    accDescription = sanitizeText2(txt).replace(/\n\s+/g, "\n");
}, "setAccDescription");
var getAccDescription = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>accDescription, "getAccDescription");
var setDiagramTitle = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((txt)=>{
    diagramTitle = sanitizeText2(txt);
}, "setDiagramTitle");
var getDiagramTitle = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>diagramTitle, "getDiagramTitle");
// src/diagram-api/diagramAPI.ts
var log2 = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"];
var setLogLevel2 = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLogLevel"];
var getConfig2 = getConfig;
var setConfig2 = setConfig;
var defaultConfig2 = defaultConfig;
var sanitizeText3 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((text)=>sanitizeText(text, getConfig2()), "sanitizeText");
var setupGraphViewbox2 = setupGraphViewbox;
var getCommonDb = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>{
    return commonDb_exports;
}, "getCommonDb");
var diagrams = {};
var registerDiagram = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((id, diagram, detector)=>{
    if (diagrams[id]) {
        log2.warn(`Diagram with id ${id} already registered. Overwriting.`);
    }
    diagrams[id] = diagram;
    if (detector) {
        addDetector(id, detector);
    }
    addStylesForDiagram(id, diagram.styles);
    diagram.injectUtils?.(log2, setLogLevel2, getConfig2, sanitizeText3, setupGraphViewbox2, getCommonDb(), ()=>{});
}, "registerDiagram");
var getDiagram = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((name)=>{
    if (name in diagrams) {
        return diagrams[name];
    }
    throw new DiagramNotFoundError(name);
}, "getDiagram");
var DiagramNotFoundError = class extends Error {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "DiagramNotFoundError");
    }
    constructor(name){
        super(`Diagram ${name} not found.`);
    }
};
;
}),
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "log",
    ()=>log,
    "setLogLevel",
    ()=>setLogLevel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
// src/logger.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/dayjs/dayjs.min.js [app-client] (ecmascript)");
;
;
var LEVELS = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5
};
var log = {
    trace: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((..._args)=>{}, "trace"),
    debug: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((..._args)=>{}, "debug"),
    info: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((..._args)=>{}, "info"),
    warn: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((..._args)=>{}, "warn"),
    error: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((..._args)=>{}, "error"),
    fatal: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((..._args)=>{}, "fatal")
};
var setLogLevel = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(level = "fatal") {
    let numericLevel = LEVELS.fatal;
    if (typeof level === "string") {
        if (level.toLowerCase() in LEVELS) {
            numericLevel = LEVELS[level];
        }
    } else if (typeof level === "number") {
        numericLevel = level;
    }
    log.trace = ()=>{};
    log.debug = ()=>{};
    log.info = ()=>{};
    log.warn = ()=>{};
    log.error = ()=>{};
    log.fatal = ()=>{};
    if (numericLevel <= LEVELS.fatal) {
        log.fatal = console.error ? console.error.bind(console, format("FATAL"), "color: orange") : console.log.bind(console, "\x1B[35m", format("FATAL"));
    }
    if (numericLevel <= LEVELS.error) {
        log.error = console.error ? console.error.bind(console, format("ERROR"), "color: orange") : console.log.bind(console, "\x1B[31m", format("ERROR"));
    }
    if (numericLevel <= LEVELS.warn) {
        log.warn = console.warn ? console.warn.bind(console, format("WARN"), "color: orange") : console.log.bind(console, `\x1B[33m`, format("WARN"));
    }
    if (numericLevel <= LEVELS.info) {
        log.info = console.info ? console.info.bind(console, format("INFO"), "color: lightblue") : console.log.bind(console, "\x1B[34m", format("INFO"));
    }
    if (numericLevel <= LEVELS.debug) {
        log.debug = console.debug ? console.debug.bind(console, format("DEBUG"), "color: lightgreen") : console.log.bind(console, "\x1B[32m", format("DEBUG"));
    }
    if (numericLevel <= LEVELS.trace) {
        log.trace = console.debug ? console.debug.bind(console, format("TRACE"), "color: lightgreen") : console.log.bind(console, "\x1B[32m", format("TRACE"));
    }
}, "setLogLevel");
var format = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((level)=>{
    const time = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])().format("ss.SSS");
    return `%c${time} : ${level} : `;
}, "format");
;
}),
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
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/ganttDiagram-EL5Y4UJY.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "diagram",
    ()=>diagram
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-75Z2AOVW.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
// src/diagrams/gantt/ganttDb.js
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$braintree$2f$sanitize$2d$url$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@braintree/sanitize-url/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/dayjs/dayjs.min.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$plugin$2f$isoWeek$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/dayjs/plugin/isoWeek.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$plugin$2f$customParseFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/dayjs/plugin/customParseFormat.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$plugin$2f$advancedFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/dayjs/plugin/advancedFormat.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$plugin$2f$duration$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/dayjs/plugin/duration.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$scale$2f$src$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__scaleTime$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-scale/src/time.js [app-client] (ecmascript) <export default as scaleTime>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$array$2f$src$2f$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__min$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-array/src/min.js [app-client] (ecmascript) <export default as min>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$array$2f$src$2f$max$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__max$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-array/src/max.js [app-client] (ecmascript) <export default as max>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$scale$2f$src$2f$linear$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__scaleLinear$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-scale/src/linear.js [app-client] (ecmascript) <export default as scaleLinear>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$hcl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateHcl$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/hcl.js [app-client] (ecmascript) <export default as interpolateHcl>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$axis$2f$src$2f$axis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-axis/src/axis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2d$format$2f$src$2f$defaultLocale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-time-format/src/defaultLocale.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$millisecond$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__millisecond__as__timeMillisecond$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-time/src/millisecond.js [app-client] (ecmascript) <export millisecond as timeMillisecond>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$second$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__second__as__timeSecond$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-time/src/second.js [app-client] (ecmascript) <export second as timeSecond>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$minute$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-time/src/minute.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$hour$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-time/src/hour.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$day$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-time/src/day.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$week$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-time/src/week.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$month$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-time/src/month.js [app-client] (ecmascript)");
;
;
;
;
// src/diagrams/gantt/parser/gantt.jison
var parser = function() {
    var o = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(k, v, o2, l) {
        for(o2 = o2 || {}, l = k.length; l--; o2[k[l]] = v);
        return o2;
    }, "o"), $V0 = [
        6,
        8,
        10,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        33,
        35,
        36,
        38,
        40
    ], $V1 = [
        1,
        26
    ], $V2 = [
        1,
        27
    ], $V3 = [
        1,
        28
    ], $V4 = [
        1,
        29
    ], $V5 = [
        1,
        30
    ], $V6 = [
        1,
        31
    ], $V7 = [
        1,
        32
    ], $V8 = [
        1,
        33
    ], $V9 = [
        1,
        34
    ], $Va = [
        1,
        9
    ], $Vb = [
        1,
        10
    ], $Vc = [
        1,
        11
    ], $Vd = [
        1,
        12
    ], $Ve = [
        1,
        13
    ], $Vf = [
        1,
        14
    ], $Vg = [
        1,
        15
    ], $Vh = [
        1,
        16
    ], $Vi = [
        1,
        19
    ], $Vj = [
        1,
        20
    ], $Vk = [
        1,
        21
    ], $Vl = [
        1,
        22
    ], $Vm = [
        1,
        23
    ], $Vn = [
        1,
        25
    ], $Vo = [
        1,
        35
    ];
    var parser2 = {
        trace: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function trace() {}, "trace"),
        yy: {},
        symbols_: {
            "error": 2,
            "start": 3,
            "gantt": 4,
            "document": 5,
            "EOF": 6,
            "line": 7,
            "SPACE": 8,
            "statement": 9,
            "NL": 10,
            "weekday": 11,
            "weekday_monday": 12,
            "weekday_tuesday": 13,
            "weekday_wednesday": 14,
            "weekday_thursday": 15,
            "weekday_friday": 16,
            "weekday_saturday": 17,
            "weekday_sunday": 18,
            "weekend": 19,
            "weekend_friday": 20,
            "weekend_saturday": 21,
            "dateFormat": 22,
            "inclusiveEndDates": 23,
            "topAxis": 24,
            "axisFormat": 25,
            "tickInterval": 26,
            "excludes": 27,
            "includes": 28,
            "todayMarker": 29,
            "title": 30,
            "acc_title": 31,
            "acc_title_value": 32,
            "acc_descr": 33,
            "acc_descr_value": 34,
            "acc_descr_multiline_value": 35,
            "section": 36,
            "clickStatement": 37,
            "taskTxt": 38,
            "taskData": 39,
            "click": 40,
            "callbackname": 41,
            "callbackargs": 42,
            "href": 43,
            "clickStatementDebug": 44,
            "$accept": 0,
            "$end": 1
        },
        terminals_: {
            2: "error",
            4: "gantt",
            6: "EOF",
            8: "SPACE",
            10: "NL",
            12: "weekday_monday",
            13: "weekday_tuesday",
            14: "weekday_wednesday",
            15: "weekday_thursday",
            16: "weekday_friday",
            17: "weekday_saturday",
            18: "weekday_sunday",
            20: "weekend_friday",
            21: "weekend_saturday",
            22: "dateFormat",
            23: "inclusiveEndDates",
            24: "topAxis",
            25: "axisFormat",
            26: "tickInterval",
            27: "excludes",
            28: "includes",
            29: "todayMarker",
            30: "title",
            31: "acc_title",
            32: "acc_title_value",
            33: "acc_descr",
            34: "acc_descr_value",
            35: "acc_descr_multiline_value",
            36: "section",
            38: "taskTxt",
            39: "taskData",
            40: "click",
            41: "callbackname",
            42: "callbackargs",
            43: "href"
        },
        productions_: [
            0,
            [
                3,
                3
            ],
            [
                5,
                0
            ],
            [
                5,
                2
            ],
            [
                7,
                2
            ],
            [
                7,
                1
            ],
            [
                7,
                1
            ],
            [
                7,
                1
            ],
            [
                11,
                1
            ],
            [
                11,
                1
            ],
            [
                11,
                1
            ],
            [
                11,
                1
            ],
            [
                11,
                1
            ],
            [
                11,
                1
            ],
            [
                11,
                1
            ],
            [
                19,
                1
            ],
            [
                19,
                1
            ],
            [
                9,
                1
            ],
            [
                9,
                1
            ],
            [
                9,
                1
            ],
            [
                9,
                1
            ],
            [
                9,
                1
            ],
            [
                9,
                1
            ],
            [
                9,
                1
            ],
            [
                9,
                1
            ],
            [
                9,
                1
            ],
            [
                9,
                1
            ],
            [
                9,
                1
            ],
            [
                9,
                2
            ],
            [
                9,
                2
            ],
            [
                9,
                1
            ],
            [
                9,
                1
            ],
            [
                9,
                1
            ],
            [
                9,
                2
            ],
            [
                37,
                2
            ],
            [
                37,
                3
            ],
            [
                37,
                3
            ],
            [
                37,
                4
            ],
            [
                37,
                3
            ],
            [
                37,
                4
            ],
            [
                37,
                2
            ],
            [
                44,
                2
            ],
            [
                44,
                3
            ],
            [
                44,
                3
            ],
            [
                44,
                4
            ],
            [
                44,
                3
            ],
            [
                44,
                4
            ],
            [
                44,
                2
            ]
        ],
        performAction: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
            var $0 = $$.length - 1;
            switch(yystate){
                case 1:
                    return $$[$0 - 1];
                    //TURBOPACK unreachable
                    ;
                case 2:
                    this.$ = [];
                    break;
                case 3:
                    $$[$0 - 1].push($$[$0]);
                    this.$ = $$[$0 - 1];
                    break;
                case 4:
                case 5:
                    this.$ = $$[$0];
                    break;
                case 6:
                case 7:
                    this.$ = [];
                    break;
                case 8:
                    yy.setWeekday("monday");
                    break;
                case 9:
                    yy.setWeekday("tuesday");
                    break;
                case 10:
                    yy.setWeekday("wednesday");
                    break;
                case 11:
                    yy.setWeekday("thursday");
                    break;
                case 12:
                    yy.setWeekday("friday");
                    break;
                case 13:
                    yy.setWeekday("saturday");
                    break;
                case 14:
                    yy.setWeekday("sunday");
                    break;
                case 15:
                    yy.setWeekend("friday");
                    break;
                case 16:
                    yy.setWeekend("saturday");
                    break;
                case 17:
                    yy.setDateFormat($$[$0].substr(11));
                    this.$ = $$[$0].substr(11);
                    break;
                case 18:
                    yy.enableInclusiveEndDates();
                    this.$ = $$[$0].substr(18);
                    break;
                case 19:
                    yy.TopAxis();
                    this.$ = $$[$0].substr(8);
                    break;
                case 20:
                    yy.setAxisFormat($$[$0].substr(11));
                    this.$ = $$[$0].substr(11);
                    break;
                case 21:
                    yy.setTickInterval($$[$0].substr(13));
                    this.$ = $$[$0].substr(13);
                    break;
                case 22:
                    yy.setExcludes($$[$0].substr(9));
                    this.$ = $$[$0].substr(9);
                    break;
                case 23:
                    yy.setIncludes($$[$0].substr(9));
                    this.$ = $$[$0].substr(9);
                    break;
                case 24:
                    yy.setTodayMarker($$[$0].substr(12));
                    this.$ = $$[$0].substr(12);
                    break;
                case 27:
                    yy.setDiagramTitle($$[$0].substr(6));
                    this.$ = $$[$0].substr(6);
                    break;
                case 28:
                    this.$ = $$[$0].trim();
                    yy.setAccTitle(this.$);
                    break;
                case 29:
                case 30:
                    this.$ = $$[$0].trim();
                    yy.setAccDescription(this.$);
                    break;
                case 31:
                    yy.addSection($$[$0].substr(8));
                    this.$ = $$[$0].substr(8);
                    break;
                case 33:
                    yy.addTask($$[$0 - 1], $$[$0]);
                    this.$ = "task";
                    break;
                case 34:
                    this.$ = $$[$0 - 1];
                    yy.setClickEvent($$[$0 - 1], $$[$0], null);
                    break;
                case 35:
                    this.$ = $$[$0 - 2];
                    yy.setClickEvent($$[$0 - 2], $$[$0 - 1], $$[$0]);
                    break;
                case 36:
                    this.$ = $$[$0 - 2];
                    yy.setClickEvent($$[$0 - 2], $$[$0 - 1], null);
                    yy.setLink($$[$0 - 2], $$[$0]);
                    break;
                case 37:
                    this.$ = $$[$0 - 3];
                    yy.setClickEvent($$[$0 - 3], $$[$0 - 2], $$[$0 - 1]);
                    yy.setLink($$[$0 - 3], $$[$0]);
                    break;
                case 38:
                    this.$ = $$[$0 - 2];
                    yy.setClickEvent($$[$0 - 2], $$[$0], null);
                    yy.setLink($$[$0 - 2], $$[$0 - 1]);
                    break;
                case 39:
                    this.$ = $$[$0 - 3];
                    yy.setClickEvent($$[$0 - 3], $$[$0 - 1], $$[$0]);
                    yy.setLink($$[$0 - 3], $$[$0 - 2]);
                    break;
                case 40:
                    this.$ = $$[$0 - 1];
                    yy.setLink($$[$0 - 1], $$[$0]);
                    break;
                case 41:
                case 47:
                    this.$ = $$[$0 - 1] + " " + $$[$0];
                    break;
                case 42:
                case 43:
                case 45:
                    this.$ = $$[$0 - 2] + " " + $$[$0 - 1] + " " + $$[$0];
                    break;
                case 44:
                case 46:
                    this.$ = $$[$0 - 3] + " " + $$[$0 - 2] + " " + $$[$0 - 1] + " " + $$[$0];
                    break;
            }
        }, "anonymous"),
        table: [
            {
                3: 1,
                4: [
                    1,
                    2
                ]
            },
            {
                1: [
                    3
                ]
            },
            o($V0, [
                2,
                2
            ], {
                5: 3
            }),
            {
                6: [
                    1,
                    4
                ],
                7: 5,
                8: [
                    1,
                    6
                ],
                9: 7,
                10: [
                    1,
                    8
                ],
                11: 17,
                12: $V1,
                13: $V2,
                14: $V3,
                15: $V4,
                16: $V5,
                17: $V6,
                18: $V7,
                19: 18,
                20: $V8,
                21: $V9,
                22: $Va,
                23: $Vb,
                24: $Vc,
                25: $Vd,
                26: $Ve,
                27: $Vf,
                28: $Vg,
                29: $Vh,
                30: $Vi,
                31: $Vj,
                33: $Vk,
                35: $Vl,
                36: $Vm,
                37: 24,
                38: $Vn,
                40: $Vo
            },
            o($V0, [
                2,
                7
            ], {
                1: [
                    2,
                    1
                ]
            }),
            o($V0, [
                2,
                3
            ]),
            {
                9: 36,
                11: 17,
                12: $V1,
                13: $V2,
                14: $V3,
                15: $V4,
                16: $V5,
                17: $V6,
                18: $V7,
                19: 18,
                20: $V8,
                21: $V9,
                22: $Va,
                23: $Vb,
                24: $Vc,
                25: $Vd,
                26: $Ve,
                27: $Vf,
                28: $Vg,
                29: $Vh,
                30: $Vi,
                31: $Vj,
                33: $Vk,
                35: $Vl,
                36: $Vm,
                37: 24,
                38: $Vn,
                40: $Vo
            },
            o($V0, [
                2,
                5
            ]),
            o($V0, [
                2,
                6
            ]),
            o($V0, [
                2,
                17
            ]),
            o($V0, [
                2,
                18
            ]),
            o($V0, [
                2,
                19
            ]),
            o($V0, [
                2,
                20
            ]),
            o($V0, [
                2,
                21
            ]),
            o($V0, [
                2,
                22
            ]),
            o($V0, [
                2,
                23
            ]),
            o($V0, [
                2,
                24
            ]),
            o($V0, [
                2,
                25
            ]),
            o($V0, [
                2,
                26
            ]),
            o($V0, [
                2,
                27
            ]),
            {
                32: [
                    1,
                    37
                ]
            },
            {
                34: [
                    1,
                    38
                ]
            },
            o($V0, [
                2,
                30
            ]),
            o($V0, [
                2,
                31
            ]),
            o($V0, [
                2,
                32
            ]),
            {
                39: [
                    1,
                    39
                ]
            },
            o($V0, [
                2,
                8
            ]),
            o($V0, [
                2,
                9
            ]),
            o($V0, [
                2,
                10
            ]),
            o($V0, [
                2,
                11
            ]),
            o($V0, [
                2,
                12
            ]),
            o($V0, [
                2,
                13
            ]),
            o($V0, [
                2,
                14
            ]),
            o($V0, [
                2,
                15
            ]),
            o($V0, [
                2,
                16
            ]),
            {
                41: [
                    1,
                    40
                ],
                43: [
                    1,
                    41
                ]
            },
            o($V0, [
                2,
                4
            ]),
            o($V0, [
                2,
                28
            ]),
            o($V0, [
                2,
                29
            ]),
            o($V0, [
                2,
                33
            ]),
            o($V0, [
                2,
                34
            ], {
                42: [
                    1,
                    42
                ],
                43: [
                    1,
                    43
                ]
            }),
            o($V0, [
                2,
                40
            ], {
                41: [
                    1,
                    44
                ]
            }),
            o($V0, [
                2,
                35
            ], {
                43: [
                    1,
                    45
                ]
            }),
            o($V0, [
                2,
                36
            ]),
            o($V0, [
                2,
                38
            ], {
                42: [
                    1,
                    46
                ]
            }),
            o($V0, [
                2,
                37
            ]),
            o($V0, [
                2,
                39
            ])
        ],
        defaultActions: {},
        parseError: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function parseError(str, hash) {
            if (hash.recoverable) {
                this.trace(str);
            } else {
                var error = new Error(str);
                error.hash = hash;
                throw error;
            }
        }, "parseError"),
        parse: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function parse(input) {
            var self = this, stack = [
                0
            ], tstack = [], vstack = [
                null
            ], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
            var args = lstack.slice.call(arguments, 1);
            var lexer2 = Object.create(this.lexer);
            var sharedState = {
                yy: {}
            };
            for(var k in this.yy){
                if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
                    sharedState.yy[k] = this.yy[k];
                }
            }
            lexer2.setInput(input, sharedState.yy);
            sharedState.yy.lexer = lexer2;
            sharedState.yy.parser = this;
            if (typeof lexer2.yylloc == "undefined") {
                lexer2.yylloc = {};
            }
            var yyloc = lexer2.yylloc;
            lstack.push(yyloc);
            var ranges = lexer2.options && lexer2.options.ranges;
            if (typeof sharedState.yy.parseError === "function") {
                this.parseError = sharedState.yy.parseError;
            } else {
                this.parseError = Object.getPrototypeOf(this).parseError;
            }
            function popStack(n) {
                stack.length = stack.length - 2 * n;
                vstack.length = vstack.length - n;
                lstack.length = lstack.length - n;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(popStack, "popStack");
            function lex() {
                var token;
                token = tstack.pop() || lexer2.lex() || EOF;
                if (typeof token !== "number") {
                    if (token instanceof Array) {
                        tstack = token;
                        token = tstack.pop();
                    }
                    token = self.symbols_[token] || token;
                }
                return token;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(lex, "lex");
            var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
            while(true){
                state = stack[stack.length - 1];
                if (this.defaultActions[state]) {
                    action = this.defaultActions[state];
                } else {
                    if (symbol === null || typeof symbol == "undefined") {
                        symbol = lex();
                    }
                    action = table[state] && table[state][symbol];
                }
                if (typeof action === "undefined" || !action.length || !action[0]) {
                    var errStr = "";
                    expected = [];
                    for(p in table[state]){
                        if (this.terminals_[p] && p > TERROR) {
                            expected.push("'" + this.terminals_[p] + "'");
                        }
                    }
                    if (lexer2.showPosition) {
                        errStr = "Parse error on line " + (yylineno + 1) + ":\n" + lexer2.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                    } else {
                        errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
                    }
                    this.parseError(errStr, {
                        text: lexer2.match,
                        token: this.terminals_[symbol] || symbol,
                        line: lexer2.yylineno,
                        loc: yyloc,
                        expected
                    });
                }
                if (action[0] instanceof Array && action.length > 1) {
                    throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
                }
                switch(action[0]){
                    case 1:
                        stack.push(symbol);
                        vstack.push(lexer2.yytext);
                        lstack.push(lexer2.yylloc);
                        stack.push(action[1]);
                        symbol = null;
                        if (!preErrorSymbol) {
                            yyleng = lexer2.yyleng;
                            yytext = lexer2.yytext;
                            yylineno = lexer2.yylineno;
                            yyloc = lexer2.yylloc;
                            if (recovering > 0) {
                                recovering--;
                            }
                        } else {
                            symbol = preErrorSymbol;
                            preErrorSymbol = null;
                        }
                        break;
                    case 2:
                        len = this.productions_[action[1]][1];
                        yyval.$ = vstack[vstack.length - len];
                        yyval._$ = {
                            first_line: lstack[lstack.length - (len || 1)].first_line,
                            last_line: lstack[lstack.length - 1].last_line,
                            first_column: lstack[lstack.length - (len || 1)].first_column,
                            last_column: lstack[lstack.length - 1].last_column
                        };
                        if (ranges) {
                            yyval._$.range = [
                                lstack[lstack.length - (len || 1)].range[0],
                                lstack[lstack.length - 1].range[1]
                            ];
                        }
                        r = this.performAction.apply(yyval, [
                            yytext,
                            yyleng,
                            yylineno,
                            sharedState.yy,
                            action[1],
                            vstack,
                            lstack
                        ].concat(args));
                        if (typeof r !== "undefined") {
                            return r;
                        }
                        if (len) {
                            stack = stack.slice(0, -1 * len * 2);
                            vstack = vstack.slice(0, -1 * len);
                            lstack = lstack.slice(0, -1 * len);
                        }
                        stack.push(this.productions_[action[1]][0]);
                        vstack.push(yyval.$);
                        lstack.push(yyval._$);
                        newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                        stack.push(newState);
                        break;
                    case 3:
                        return true;
                }
            }
            return true;
        }, "parse")
    };
    var lexer = /* @__PURE__ */ function() {
        var lexer2 = {
            EOF: 1,
            parseError: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function parseError(str, hash) {
                if (this.yy.parser) {
                    this.yy.parser.parseError(str, hash);
                } else {
                    throw new Error(str);
                }
            }, "parseError"),
            // resets the lexer, sets new input
            setInput: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(input, yy) {
                this.yy = yy || this.yy || {};
                this._input = input;
                this._more = this._backtrack = this.done = false;
                this.yylineno = this.yyleng = 0;
                this.yytext = this.matched = this.match = "";
                this.conditionStack = [
                    "INITIAL"
                ];
                this.yylloc = {
                    first_line: 1,
                    first_column: 0,
                    last_line: 1,
                    last_column: 0
                };
                if (this.options.ranges) {
                    this.yylloc.range = [
                        0,
                        0
                    ];
                }
                this.offset = 0;
                return this;
            }, "setInput"),
            // consumes and returns one char from the input
            input: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
                var ch = this._input[0];
                this.yytext += ch;
                this.yyleng++;
                this.offset++;
                this.match += ch;
                this.matched += ch;
                var lines = ch.match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno++;
                    this.yylloc.last_line++;
                } else {
                    this.yylloc.last_column++;
                }
                if (this.options.ranges) {
                    this.yylloc.range[1]++;
                }
                this._input = this._input.slice(1);
                return ch;
            }, "input"),
            // unshifts one char (or a string) into the input
            unput: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(ch) {
                var len = ch.length;
                var lines = ch.split(/(?:\r\n?|\n)/g);
                this._input = ch + this._input;
                this.yytext = this.yytext.substr(0, this.yytext.length - len);
                this.offset -= len;
                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                this.match = this.match.substr(0, this.match.length - 1);
                this.matched = this.matched.substr(0, this.matched.length - 1);
                if (lines.length - 1) {
                    this.yylineno -= lines.length - 1;
                }
                var r = this.yylloc.range;
                this.yylloc = {
                    first_line: this.yylloc.first_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.first_column,
                    last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                };
                if (this.options.ranges) {
                    this.yylloc.range = [
                        r[0],
                        r[0] + this.yyleng - len
                    ];
                }
                this.yyleng = this.yytext.length;
                return this;
            }, "unput"),
            // When called from action, caches matched text and appends it on next action
            more: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
                this._more = true;
                return this;
            }, "more"),
            // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
            reject: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
                if (this.options.backtrack_lexer) {
                    this._backtrack = true;
                } else {
                    return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });
                }
                return this;
            }, "reject"),
            // retain first n characters of the match
            less: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(n) {
                this.unput(this.match.slice(n));
            }, "less"),
            // displays already matched input, i.e. for error messages
            pastInput: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
                var past = this.matched.substr(0, this.matched.length - this.match.length);
                return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
            }, "pastInput"),
            // displays upcoming input, i.e. for error messages
            upcomingInput: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
                var next = this.match;
                if (next.length < 20) {
                    next += this._input.substr(0, 20 - next.length);
                }
                return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
            }, "upcomingInput"),
            // displays the character position where the lexing error occurred, i.e. for error messages
            showPosition: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
                var pre = this.pastInput();
                var c = new Array(pre.length + 1).join("-");
                return pre + this.upcomingInput() + "\n" + c + "^";
            }, "showPosition"),
            // test the lexed token: return FALSE when not a match, otherwise return token
            test_match: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(match, indexed_rule) {
                var token, lines, backup;
                if (this.options.backtrack_lexer) {
                    backup = {
                        yylineno: this.yylineno,
                        yylloc: {
                            first_line: this.yylloc.first_line,
                            last_line: this.last_line,
                            first_column: this.yylloc.first_column,
                            last_column: this.yylloc.last_column
                        },
                        yytext: this.yytext,
                        match: this.match,
                        matches: this.matches,
                        matched: this.matched,
                        yyleng: this.yyleng,
                        offset: this.offset,
                        _more: this._more,
                        _input: this._input,
                        yy: this.yy,
                        conditionStack: this.conditionStack.slice(0),
                        done: this.done
                    };
                    if (this.options.ranges) {
                        backup.yylloc.range = this.yylloc.range.slice(0);
                    }
                }
                lines = match[0].match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno += lines.length;
                }
                this.yylloc = {
                    first_line: this.yylloc.last_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.last_column,
                    last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
                };
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                if (this.options.ranges) {
                    this.yylloc.range = [
                        this.offset,
                        this.offset += this.yyleng
                    ];
                }
                this._more = false;
                this._backtrack = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
                if (this.done && this._input) {
                    this.done = false;
                }
                if (token) {
                    return token;
                } else if (this._backtrack) {
                    for(var k in backup){
                        this[k] = backup[k];
                    }
                    return false;
                }
                return false;
            }, "test_match"),
            // return next match in input
            next: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
                if (this.done) {
                    return this.EOF;
                }
                if (!this._input) {
                    this.done = true;
                }
                var token, match, tempMatch, index;
                if (!this._more) {
                    this.yytext = "";
                    this.match = "";
                }
                var rules = this._currentRules();
                for(var i = 0; i < rules.length; i++){
                    tempMatch = this._input.match(this.rules[rules[i]]);
                    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                        match = tempMatch;
                        index = i;
                        if (this.options.backtrack_lexer) {
                            token = this.test_match(tempMatch, rules[i]);
                            if (token !== false) {
                                return token;
                            } else if (this._backtrack) {
                                match = false;
                                continue;
                            } else {
                                return false;
                            }
                        } else if (!this.options.flex) {
                            break;
                        }
                    }
                }
                if (match) {
                    token = this.test_match(match, rules[index]);
                    if (token !== false) {
                        return token;
                    }
                    return false;
                }
                if (this._input === "") {
                    return this.EOF;
                } else {
                    return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });
                }
            }, "next"),
            // return next match that has a token
            lex: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function lex() {
                var r = this.next();
                if (r) {
                    return r;
                } else {
                    return this.lex();
                }
            }, "lex"),
            // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
            begin: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function begin(condition) {
                this.conditionStack.push(condition);
            }, "begin"),
            // pop the previously active lexer condition state off the condition stack
            popState: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function popState() {
                var n = this.conditionStack.length - 1;
                if (n > 0) {
                    return this.conditionStack.pop();
                } else {
                    return this.conditionStack[0];
                }
            }, "popState"),
            // produce the lexer rule set which is active for the currently active lexer condition state
            _currentRules: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function _currentRules() {
                if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
                    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                } else {
                    return this.conditions["INITIAL"].rules;
                }
            }, "_currentRules"),
            // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
            topState: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function topState(n) {
                n = this.conditionStack.length - 1 - Math.abs(n || 0);
                if (n >= 0) {
                    return this.conditionStack[n];
                } else {
                    return "INITIAL";
                }
            }, "topState"),
            // alias for begin(condition)
            pushState: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function pushState(condition) {
                this.begin(condition);
            }, "pushState"),
            // return the number of states currently on the stack
            stateStackSize: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function stateStackSize() {
                return this.conditionStack.length;
            }, "stateStackSize"),
            options: {
                "case-insensitive": true
            },
            performAction: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
                var YYSTATE = YY_START;
                switch($avoiding_name_collisions){
                    case 0:
                        this.begin("open_directive");
                        return "open_directive";
                        //TURBOPACK unreachable
                        ;
                    case 1:
                        this.begin("acc_title");
                        return 31;
                        //TURBOPACK unreachable
                        ;
                    case 2:
                        this.popState();
                        return "acc_title_value";
                        //TURBOPACK unreachable
                        ;
                    case 3:
                        this.begin("acc_descr");
                        return 33;
                        //TURBOPACK unreachable
                        ;
                    case 4:
                        this.popState();
                        return "acc_descr_value";
                        //TURBOPACK unreachable
                        ;
                    case 5:
                        this.begin("acc_descr_multiline");
                        break;
                    case 6:
                        this.popState();
                        break;
                    case 7:
                        return "acc_descr_multiline_value";
                        //TURBOPACK unreachable
                        ;
                    case 8:
                        break;
                    case 9:
                        break;
                    case 10:
                        break;
                    case 11:
                        return 10;
                        //TURBOPACK unreachable
                        ;
                    case 12:
                        break;
                    case 13:
                        break;
                    case 14:
                        this.begin("href");
                        break;
                    case 15:
                        this.popState();
                        break;
                    case 16:
                        return 43;
                        //TURBOPACK unreachable
                        ;
                    case 17:
                        this.begin("callbackname");
                        break;
                    case 18:
                        this.popState();
                        break;
                    case 19:
                        this.popState();
                        this.begin("callbackargs");
                        break;
                    case 20:
                        return 41;
                        //TURBOPACK unreachable
                        ;
                    case 21:
                        this.popState();
                        break;
                    case 22:
                        return 42;
                        //TURBOPACK unreachable
                        ;
                    case 23:
                        this.begin("click");
                        break;
                    case 24:
                        this.popState();
                        break;
                    case 25:
                        return 40;
                        //TURBOPACK unreachable
                        ;
                    case 26:
                        return 4;
                        //TURBOPACK unreachable
                        ;
                    case 27:
                        return 22;
                        //TURBOPACK unreachable
                        ;
                    case 28:
                        return 23;
                        //TURBOPACK unreachable
                        ;
                    case 29:
                        return 24;
                        //TURBOPACK unreachable
                        ;
                    case 30:
                        return 25;
                        //TURBOPACK unreachable
                        ;
                    case 31:
                        return 26;
                        //TURBOPACK unreachable
                        ;
                    case 32:
                        return 28;
                        //TURBOPACK unreachable
                        ;
                    case 33:
                        return 27;
                        //TURBOPACK unreachable
                        ;
                    case 34:
                        return 29;
                        //TURBOPACK unreachable
                        ;
                    case 35:
                        return 12;
                        //TURBOPACK unreachable
                        ;
                    case 36:
                        return 13;
                        //TURBOPACK unreachable
                        ;
                    case 37:
                        return 14;
                        //TURBOPACK unreachable
                        ;
                    case 38:
                        return 15;
                        //TURBOPACK unreachable
                        ;
                    case 39:
                        return 16;
                        //TURBOPACK unreachable
                        ;
                    case 40:
                        return 17;
                        //TURBOPACK unreachable
                        ;
                    case 41:
                        return 18;
                        //TURBOPACK unreachable
                        ;
                    case 42:
                        return 20;
                        //TURBOPACK unreachable
                        ;
                    case 43:
                        return 21;
                        //TURBOPACK unreachable
                        ;
                    case 44:
                        return "date";
                        //TURBOPACK unreachable
                        ;
                    case 45:
                        return 30;
                        //TURBOPACK unreachable
                        ;
                    case 46:
                        return "accDescription";
                        //TURBOPACK unreachable
                        ;
                    case 47:
                        return 36;
                        //TURBOPACK unreachable
                        ;
                    case 48:
                        return 38;
                        //TURBOPACK unreachable
                        ;
                    case 49:
                        return 39;
                        //TURBOPACK unreachable
                        ;
                    case 50:
                        return ":";
                        //TURBOPACK unreachable
                        ;
                    case 51:
                        return 6;
                        //TURBOPACK unreachable
                        ;
                    case 52:
                        return "INVALID";
                        //TURBOPACK unreachable
                        ;
                }
            }, "anonymous"),
            rules: [
                /^(?:%%\{)/i,
                /^(?:accTitle\s*:\s*)/i,
                /^(?:(?!\n||)*[^\n]*)/i,
                /^(?:accDescr\s*:\s*)/i,
                /^(?:(?!\n||)*[^\n]*)/i,
                /^(?:accDescr\s*\{\s*)/i,
                /^(?:[\}])/i,
                /^(?:[^\}]*)/i,
                /^(?:%%(?!\{)*[^\n]*)/i,
                /^(?:[^\}]%%*[^\n]*)/i,
                /^(?:%%*[^\n]*[\n]*)/i,
                /^(?:[\n]+)/i,
                /^(?:\s+)/i,
                /^(?:%[^\n]*)/i,
                /^(?:href[\s]+["])/i,
                /^(?:["])/i,
                /^(?:[^"]*)/i,
                /^(?:call[\s]+)/i,
                /^(?:\([\s]*\))/i,
                /^(?:\()/i,
                /^(?:[^(]*)/i,
                /^(?:\))/i,
                /^(?:[^)]*)/i,
                /^(?:click[\s]+)/i,
                /^(?:[\s\n])/i,
                /^(?:[^\s\n]*)/i,
                /^(?:gantt\b)/i,
                /^(?:dateFormat\s[^#\n;]+)/i,
                /^(?:inclusiveEndDates\b)/i,
                /^(?:topAxis\b)/i,
                /^(?:axisFormat\s[^#\n;]+)/i,
                /^(?:tickInterval\s[^#\n;]+)/i,
                /^(?:includes\s[^#\n;]+)/i,
                /^(?:excludes\s[^#\n;]+)/i,
                /^(?:todayMarker\s[^\n;]+)/i,
                /^(?:weekday\s+monday\b)/i,
                /^(?:weekday\s+tuesday\b)/i,
                /^(?:weekday\s+wednesday\b)/i,
                /^(?:weekday\s+thursday\b)/i,
                /^(?:weekday\s+friday\b)/i,
                /^(?:weekday\s+saturday\b)/i,
                /^(?:weekday\s+sunday\b)/i,
                /^(?:weekend\s+friday\b)/i,
                /^(?:weekend\s+saturday\b)/i,
                /^(?:\d\d\d\d-\d\d-\d\d\b)/i,
                /^(?:title\s[^\n]+)/i,
                /^(?:accDescription\s[^#\n;]+)/i,
                /^(?:section\s[^\n]+)/i,
                /^(?:[^:\n]+)/i,
                /^(?::[^#\n;]+)/i,
                /^(?::)/i,
                /^(?:$)/i,
                /^(?:.)/i
            ],
            conditions: {
                "acc_descr_multiline": {
                    "rules": [
                        6,
                        7
                    ],
                    "inclusive": false
                },
                "acc_descr": {
                    "rules": [
                        4
                    ],
                    "inclusive": false
                },
                "acc_title": {
                    "rules": [
                        2
                    ],
                    "inclusive": false
                },
                "callbackargs": {
                    "rules": [
                        21,
                        22
                    ],
                    "inclusive": false
                },
                "callbackname": {
                    "rules": [
                        18,
                        19,
                        20
                    ],
                    "inclusive": false
                },
                "href": {
                    "rules": [
                        15,
                        16
                    ],
                    "inclusive": false
                },
                "click": {
                    "rules": [
                        24,
                        25
                    ],
                    "inclusive": false
                },
                "INITIAL": {
                    "rules": [
                        0,
                        1,
                        3,
                        5,
                        8,
                        9,
                        10,
                        11,
                        12,
                        13,
                        14,
                        17,
                        23,
                        26,
                        27,
                        28,
                        29,
                        30,
                        31,
                        32,
                        33,
                        34,
                        35,
                        36,
                        37,
                        38,
                        39,
                        40,
                        41,
                        42,
                        43,
                        44,
                        45,
                        46,
                        47,
                        48,
                        49,
                        50,
                        51,
                        52
                    ],
                    "inclusive": true
                }
            }
        };
        return lexer2;
    }();
    parser2.lexer = lexer;
    function Parser() {
        this.yy = {};
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(Parser, "Parser");
    Parser.prototype = parser2;
    parser2.Parser = Parser;
    return new Parser();
}();
parser.parser = parser;
var gantt_default = parser;
;
;
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].extend(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$plugin$2f$isoWeek$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].extend(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$plugin$2f$customParseFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].extend(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$plugin$2f$advancedFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
var WEEKEND_START_DAY = {
    friday: 5,
    saturday: 6
};
var dateFormat = "";
var axisFormat = "";
var tickInterval = void 0;
var todayMarker = "";
var includes = [];
var excludes = [];
var links = /* @__PURE__ */ new Map();
var sections = [];
var tasks = [];
var currentSection = "";
var displayMode = "";
var tags = [
    "active",
    "done",
    "crit",
    "milestone",
    "vert"
];
var funs = [];
var diagramId = "";
var inclusiveEndDates = false;
var topAxis = false;
var weekday = "sunday";
var weekend = "saturday";
var lastOrder = 0;
var clear2 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    sections = [];
    tasks = [];
    currentSection = "";
    funs = [];
    taskCnt = 0;
    lastTask = void 0;
    lastTaskID = void 0;
    rawTasks = [];
    dateFormat = "";
    axisFormat = "";
    displayMode = "";
    tickInterval = void 0;
    todayMarker = "";
    includes = [];
    excludes = [];
    inclusiveEndDates = false;
    topAxis = false;
    lastOrder = 0;
    links = /* @__PURE__ */ new Map();
    diagramId = "";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clear"])();
    weekday = "sunday";
    weekend = "saturday";
}, "clear");
var setDiagramId = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(id) {
    diagramId = id;
}, "setDiagramId");
var setAxisFormat = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(txt) {
    axisFormat = txt;
}, "setAxisFormat");
var getAxisFormat = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    return axisFormat;
}, "getAxisFormat");
var setTickInterval = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(txt) {
    tickInterval = txt;
}, "setTickInterval");
var getTickInterval = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    return tickInterval;
}, "getTickInterval");
var setTodayMarker = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(txt) {
    todayMarker = txt;
}, "setTodayMarker");
var getTodayMarker = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    return todayMarker;
}, "getTodayMarker");
var setDateFormat = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(txt) {
    dateFormat = txt;
}, "setDateFormat");
var enableInclusiveEndDates = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    inclusiveEndDates = true;
}, "enableInclusiveEndDates");
var endDatesAreInclusive = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    return inclusiveEndDates;
}, "endDatesAreInclusive");
var enableTopAxis = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    topAxis = true;
}, "enableTopAxis");
var topAxisEnabled = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    return topAxis;
}, "topAxisEnabled");
var setDisplayMode = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(txt) {
    displayMode = txt;
}, "setDisplayMode");
var getDisplayMode = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    return displayMode;
}, "getDisplayMode");
var getDateFormat = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    return dateFormat;
}, "getDateFormat");
var mergeTokens = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((existing, txt)=>{
    const tokens = txt.toLowerCase().split(/[\s,]+/).filter((t)=>t !== "");
    return [
        .../* @__PURE__ */ new Set([
            ...existing,
            ...tokens
        ])
    ];
}, "mergeTokens");
var setIncludes = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(txt) {
    includes = mergeTokens(includes, txt);
}, "setIncludes");
var getIncludes = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    return includes;
}, "getIncludes");
var setExcludes = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(txt) {
    excludes = mergeTokens(excludes, txt);
}, "setExcludes");
var getExcludes = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    return excludes;
}, "getExcludes");
var getLinks = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    return links;
}, "getLinks");
var addSection = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(txt) {
    currentSection = txt;
    sections.push(txt);
}, "addSection");
var getSections = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    return sections;
}, "getSections");
var getTasks = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    let allItemsProcessed = compileTasks();
    const maxDepth = 10;
    let iterationCount = 0;
    while(!allItemsProcessed && iterationCount < maxDepth){
        allItemsProcessed = compileTasks();
        iterationCount++;
    }
    tasks = rawTasks;
    return tasks;
}, "getTasks");
var isInvalidDate = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(date, dateFormat2, excludes2, includes2) {
    const formattedDate = date.format(dateFormat2.trim());
    const dateOnly = date.format("YYYY-MM-DD");
    if (includes2.includes(formattedDate) || includes2.includes(dateOnly)) {
        return false;
    }
    if (excludes2.includes("weekends") && (date.isoWeekday() === WEEKEND_START_DAY[weekend] || date.isoWeekday() === WEEKEND_START_DAY[weekend] + 1)) {
        return true;
    }
    if (excludes2.includes(date.format("dddd").toLowerCase())) {
        return true;
    }
    return excludes2.includes(formattedDate) || excludes2.includes(dateOnly);
}, "isInvalidDate");
var setWeekday = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(txt) {
    weekday = txt;
}, "setWeekday");
var getWeekday = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    return weekday;
}, "getWeekday");
var setWeekend = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(startDay) {
    weekend = startDay;
}, "setWeekend");
var checkTaskDates = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(task, dateFormat2, excludes2, includes2) {
    if (!excludes2.length || task.manualEndTime) {
        return;
    }
    let startTime;
    if (task.startTime instanceof Date) {
        startTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(task.startTime);
    } else {
        startTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(task.startTime, dateFormat2, true);
    }
    startTime = startTime.add(1, "d");
    let originalEndTime;
    if (task.endTime instanceof Date) {
        originalEndTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(task.endTime);
    } else {
        originalEndTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(task.endTime, dateFormat2, true);
    }
    const [fixedEndTime, renderEndTime] = fixTaskDates(startTime, originalEndTime, dateFormat2, excludes2, includes2);
    task.endTime = fixedEndTime.toDate();
    task.renderEndTime = renderEndTime;
}, "checkTaskDates");
var fixTaskDates = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(startTime, endTime, dateFormat2, excludes2, includes2) {
    let invalid = false;
    let renderEndTime = null;
    const maxEndTime = endTime.add(1e4, "d");
    while(startTime <= endTime){
        if (!invalid) {
            renderEndTime = endTime.toDate();
        }
        invalid = isInvalidDate(startTime, dateFormat2, excludes2, includes2);
        if (invalid) {
            endTime = endTime.add(1, "d");
            if (endTime > maxEndTime) {
                throw new Error("Failed to find a valid date that was not excluded by `excludes` after 10,000 iterations.");
            }
        }
        startTime = startTime.add(1, "d");
    }
    return [
        endTime,
        renderEndTime
    ];
}, "fixTaskDates");
var getStartDate = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(prevTime, dateFormat2, str) {
    str = str.trim();
    const isTimestampFormat = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((format)=>{
        const trimmedFormat = format.trim();
        return trimmedFormat === "x" || trimmedFormat === "X";
    }, "isTimestampFormat");
    if (isTimestampFormat(dateFormat2) && /^\d+$/.test(str)) {
        return new Date(Number(str));
    }
    const afterRePattern = /^after\s+(?<ids>[\d\w- ]+)/;
    const afterStatement = afterRePattern.exec(str);
    if (afterStatement !== null) {
        let latestTask = null;
        for (const id of afterStatement.groups.ids.split(" ")){
            let task = findTaskById(id);
            if (task !== void 0 && (!latestTask || task.endTime > latestTask.endTime)) {
                latestTask = task;
            }
        }
        if (latestTask) {
            return latestTask.endTime;
        }
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    }
    let mDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(str, dateFormat2.trim(), true);
    if (mDate.isValid()) {
        return mDate.toDate();
    } else {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Invalid date:" + str);
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("With date format:" + dateFormat2.trim());
        const d = new Date(str);
        if (d === void 0 || isNaN(d.getTime()) || // WebKit browsers can mis-parse invalid dates to be ridiculously
        // huge numbers, e.g. new Date('202304') gets parsed as January 1, 202304.
        // This can cause virtually infinite loops while rendering, so for the
        // purposes of Gantt charts we'll just treat any date beyond 10,000 AD/BC as
        // invalid.
        d.getFullYear() < -1e4 || d.getFullYear() > 1e4) {
            throw new Error("Invalid date:" + str);
        }
        return d;
    }
}, "getStartDate");
var parseDuration = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(str) {
    const statement = /^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(str.trim());
    if (statement !== null) {
        return [
            Number.parseFloat(statement[1]),
            statement[2]
        ];
    }
    return [
        NaN,
        "ms"
    ];
}, "parseDuration");
var getEndDate = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(prevTime, dateFormat2, str, inclusive = false) {
    str = str.trim();
    const untilRePattern = /^until\s+(?<ids>[\d\w- ]+)/;
    const untilStatement = untilRePattern.exec(str);
    if (untilStatement !== null) {
        let earliestTask = null;
        for (const id of untilStatement.groups.ids.split(" ")){
            let task = findTaskById(id);
            if (task !== void 0 && (!earliestTask || task.startTime < earliestTask.startTime)) {
                earliestTask = task;
            }
        }
        if (earliestTask) {
            return earliestTask.startTime;
        }
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    }
    let parsedDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(str, dateFormat2.trim(), true);
    if (parsedDate.isValid()) {
        if (inclusive) {
            parsedDate = parsedDate.add(1, "d");
        }
        return parsedDate.toDate();
    }
    let endTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(prevTime);
    const [durationValue, durationUnit] = parseDuration(str);
    if (!Number.isNaN(durationValue)) {
        const newEndTime = endTime.add(durationValue, durationUnit);
        if (newEndTime.isValid()) {
            endTime = newEndTime;
        }
    }
    return endTime.toDate();
}, "getEndDate");
var taskCnt = 0;
var parseId = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(idStr) {
    if (idStr === void 0) {
        taskCnt = taskCnt + 1;
        return "task" + taskCnt;
    }
    return idStr;
}, "parseId");
var compileData = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(prevTask, dataStr) {
    let ds;
    if (dataStr.substr(0, 1) === ":") {
        ds = dataStr.substr(1, dataStr.length);
    } else {
        ds = dataStr;
    }
    const data = ds.split(",");
    const task = {};
    getTaskTags(data, task, tags);
    for(let i = 0; i < data.length; i++){
        data[i] = data[i].trim();
    }
    let endTimeData = "";
    switch(data.length){
        case 1:
            task.id = parseId();
            task.startTime = prevTask.endTime;
            endTimeData = data[0];
            break;
        case 2:
            task.id = parseId();
            task.startTime = getStartDate(void 0, dateFormat, data[0]);
            endTimeData = data[1];
            break;
        case 3:
            task.id = parseId(data[0]);
            task.startTime = getStartDate(void 0, dateFormat, data[1]);
            endTimeData = data[2];
            break;
        default:
    }
    if (endTimeData) {
        task.endTime = getEndDate(task.startTime, dateFormat, endTimeData, inclusiveEndDates);
        task.manualEndTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(endTimeData, "YYYY-MM-DD", true).isValid();
        checkTaskDates(task, dateFormat, excludes, includes);
    }
    return task;
}, "compileData");
var parseData = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(prevTaskId, dataStr) {
    let ds;
    if (dataStr.substr(0, 1) === ":") {
        ds = dataStr.substr(1, dataStr.length);
    } else {
        ds = dataStr;
    }
    const data = ds.split(",");
    const task = {};
    getTaskTags(data, task, tags);
    for(let i = 0; i < data.length; i++){
        data[i] = data[i].trim();
    }
    switch(data.length){
        case 1:
            task.id = parseId();
            task.startTime = {
                type: "prevTaskEnd",
                id: prevTaskId
            };
            task.endTime = {
                data: data[0]
            };
            break;
        case 2:
            task.id = parseId();
            task.startTime = {
                type: "getStartDate",
                startData: data[0]
            };
            task.endTime = {
                data: data[1]
            };
            break;
        case 3:
            task.id = parseId(data[0]);
            task.startTime = {
                type: "getStartDate",
                startData: data[1]
            };
            task.endTime = {
                data: data[2]
            };
            break;
        default:
    }
    return task;
}, "parseData");
var lastTask;
var lastTaskID;
var rawTasks = [];
var taskDb = {};
var addTask = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(descr, data) {
    const rawTask = {
        section: currentSection,
        type: currentSection,
        processed: false,
        manualEndTime: false,
        renderEndTime: null,
        raw: {
            data
        },
        task: descr,
        classes: []
    };
    const taskInfo = parseData(lastTaskID, data);
    rawTask.raw.startTime = taskInfo.startTime;
    rawTask.raw.endTime = taskInfo.endTime;
    rawTask.id = taskInfo.id;
    rawTask.prevTaskId = lastTaskID;
    rawTask.active = taskInfo.active;
    rawTask.done = taskInfo.done;
    rawTask.crit = taskInfo.crit;
    rawTask.milestone = taskInfo.milestone;
    rawTask.vert = taskInfo.vert;
    if (rawTask.vert) {
        rawTask.order = -1;
    } else {
        rawTask.order = lastOrder;
        lastOrder++;
    }
    const pos = rawTasks.push(rawTask);
    lastTaskID = rawTask.id;
    taskDb[rawTask.id] = pos - 1;
}, "addTask");
var findTaskById = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(id) {
    const pos = taskDb[id];
    return rawTasks[pos];
}, "findTaskById");
var addTaskOrg = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(descr, data) {
    const newTask = {
        section: currentSection,
        type: currentSection,
        description: descr,
        task: descr,
        classes: []
    };
    const taskInfo = compileData(lastTask, data);
    newTask.startTime = taskInfo.startTime;
    newTask.endTime = taskInfo.endTime;
    newTask.id = taskInfo.id;
    newTask.active = taskInfo.active;
    newTask.done = taskInfo.done;
    newTask.crit = taskInfo.crit;
    newTask.milestone = taskInfo.milestone;
    newTask.vert = taskInfo.vert;
    lastTask = newTask;
    tasks.push(newTask);
}, "addTaskOrg");
var compileTasks = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    const compileTask = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(pos) {
        const task = rawTasks[pos];
        let startTime = "";
        switch(rawTasks[pos].raw.startTime.type){
            case "prevTaskEnd":
                {
                    const prevTask = findTaskById(task.prevTaskId);
                    task.startTime = prevTask.endTime;
                    break;
                }
            case "getStartDate":
                startTime = getStartDate(void 0, dateFormat, rawTasks[pos].raw.startTime.startData);
                if (startTime) {
                    rawTasks[pos].startTime = startTime;
                }
                break;
        }
        if (rawTasks[pos].startTime) {
            rawTasks[pos].endTime = getEndDate(rawTasks[pos].startTime, dateFormat, rawTasks[pos].raw.endTime.data, inclusiveEndDates);
            if (rawTasks[pos].endTime) {
                rawTasks[pos].processed = true;
                rawTasks[pos].manualEndTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(rawTasks[pos].raw.endTime.data, "YYYY-MM-DD", true).isValid();
                checkTaskDates(rawTasks[pos], dateFormat, excludes, includes);
            }
        }
        return rawTasks[pos].processed;
    }, "compileTask");
    let allProcessed = true;
    for (const [i, rawTask] of rawTasks.entries()){
        compileTask(i);
        allProcessed = allProcessed && rawTask.processed;
    }
    return allProcessed;
}, "compileTasks");
var setLink = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(ids, _linkStr) {
    let linkStr = _linkStr;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])().securityLevel !== "loose") {
        linkStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$braintree$2f$sanitize$2d$url$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeUrl"])(_linkStr);
    }
    ids.split(",").forEach(function(id) {
        let rawTask = findTaskById(id);
        if (rawTask !== void 0) {
            pushFun(id, ()=>{
                window.open(linkStr, "_self");
            });
            links.set(id, linkStr);
        }
    });
    setClass(ids, "clickable");
}, "setLink");
var setClass = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(ids, className) {
    ids.split(",").forEach(function(id) {
        let rawTask = findTaskById(id);
        if (rawTask !== void 0) {
            rawTask.classes.push(className);
        }
    });
}, "setClass");
var setClickFun = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(id, functionName, functionArgs) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])().securityLevel !== "loose") {
        return;
    }
    if (functionName === void 0) {
        return;
    }
    let argList = [];
    if (typeof functionArgs === "string") {
        argList = functionArgs.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        for(let i = 0; i < argList.length; i++){
            let item = argList[i].trim();
            if (item.startsWith('"') && item.endsWith('"')) {
                item = item.substr(1, item.length - 2);
            }
            argList[i] = item;
        }
    }
    if (argList.length === 0) {
        argList.push(id);
    }
    let rawTask = findTaskById(id);
    if (rawTask !== void 0) {
        pushFun(id, ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils_default"].runFunc(functionName, ...argList);
        });
    }
}, "setClickFun");
var pushFun = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(id, callbackFunction) {
    funs.push(function() {
        const prefixedId = diagramId ? `${diagramId}-${id}` : id;
        const elem = document.querySelector(`[id="${prefixedId}"]`);
        if (elem !== null) {
            elem.addEventListener("click", function() {
                callbackFunction();
            });
        }
    }, function() {
        const prefixedId = diagramId ? `${diagramId}-${id}` : id;
        const elem = document.querySelector(`[id="${prefixedId}-text"]`);
        if (elem !== null) {
            elem.addEventListener("click", function() {
                callbackFunction();
            });
        }
    });
}, "pushFun");
var setClickEvent = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(ids, functionName, functionArgs) {
    ids.split(",").forEach(function(id) {
        setClickFun(id, functionName, functionArgs);
    });
    setClass(ids, "clickable");
}, "setClickEvent");
var bindFunctions = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(element) {
    funs.forEach(function(fun) {
        fun(element);
    });
}, "bindFunctions");
var ganttDb_default = {
    getConfig: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])().gantt, "getConfig"),
    clear: clear2,
    setDateFormat,
    getDateFormat,
    enableInclusiveEndDates,
    endDatesAreInclusive,
    enableTopAxis,
    topAxisEnabled,
    setAxisFormat,
    getAxisFormat,
    setTickInterval,
    getTickInterval,
    setTodayMarker,
    getTodayMarker,
    setAccTitle: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAccTitle"],
    getAccTitle: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAccTitle"],
    setDiagramTitle: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDiagramTitle"],
    getDiagramTitle: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDiagramTitle"],
    setDiagramId,
    setDisplayMode,
    getDisplayMode,
    setAccDescription: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAccDescription"],
    getAccDescription: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAccDescription"],
    addSection,
    getSections,
    getTasks,
    addTask,
    findTaskById,
    addTaskOrg,
    setIncludes,
    getIncludes,
    setExcludes,
    getExcludes,
    setClickEvent,
    setLink,
    getLinks,
    bindFunctions,
    parseDuration,
    isInvalidDate,
    setWeekday,
    getWeekday,
    setWeekend
};
function getTaskTags(data, task, tags2) {
    let matchFound = true;
    while(matchFound){
        matchFound = false;
        tags2.forEach(function(t) {
            const pattern = "^\\s*" + t + "\\s*$";
            const regex = new RegExp(pattern);
            if (data[0].match(regex)) {
                task[t] = true;
                data.shift(1);
                matchFound = true;
            }
        });
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(getTaskTags, "getTaskTags");
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].extend(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$plugin$2f$duration$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
var setConf = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Something is calling, setConf, remove the call");
}, "setConf");
var mapWeekdayToTimeFunction = {
    monday: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$week$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeMonday"],
    tuesday: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$week$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeTuesday"],
    wednesday: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$week$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeWednesday"],
    thursday: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$week$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeThursday"],
    friday: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$week$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeFriday"],
    saturday: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$week$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeSaturday"],
    sunday: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$week$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeSunday"]
};
var getMaxIntersections = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((tasks2, orderOffset)=>{
    let timeline = [
        ...tasks2
    ].map(()=>-Infinity);
    let sorted = [
        ...tasks2
    ].sort((a, b)=>a.startTime - b.startTime || a.order - b.order);
    let maxIntersections = 0;
    for (const element of sorted){
        for(let j = 0; j < timeline.length; j++){
            if (element.startTime >= timeline[j]) {
                timeline[j] = element.endTime;
                element.order = j + orderOffset;
                if (j > maxIntersections) {
                    maxIntersections = j;
                }
                break;
            }
        }
    }
    return maxIntersections;
}, "getMaxIntersections");
var w;
var MAX_TICK_COUNT = 1e4;
var draw = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(text, id, version, diagObj) {
    const conf = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])().gantt;
    diagObj.db.setDiagramId(id);
    const securityLevel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])().securityLevel;
    let sandboxElement;
    if (securityLevel === "sandbox") {
        sandboxElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])("#i" + id);
    }
    const root = securityLevel === "sandbox" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(sandboxElement.nodes()[0].contentDocument.body) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])("body");
    const doc = securityLevel === "sandbox" ? sandboxElement.nodes()[0].contentDocument : document;
    const elem = doc.getElementById(id);
    w = elem.parentElement.offsetWidth;
    if (w === void 0) {
        w = 1200;
    }
    if (conf.useWidth !== void 0) {
        w = conf.useWidth;
    }
    const taskArray = diagObj.db.getTasks();
    const tasksWithoutVert = taskArray.filter((task)=>!task.vert);
    let categories = [];
    for (const element of tasksWithoutVert){
        categories.push(element.type);
    }
    categories = checkUnique(categories);
    const categoryHeights = {};
    let h = 2 * conf.topPadding;
    if (diagObj.db.getDisplayMode() === "compact" || conf.displayMode === "compact") {
        const categoryElements = {};
        for (const element of tasksWithoutVert){
            if (categoryElements[element.section] === void 0) {
                categoryElements[element.section] = [
                    element
                ];
            } else {
                categoryElements[element.section].push(element);
            }
        }
        let intersections = 0;
        for (const category of Object.keys(categoryElements)){
            const categoryHeight = getMaxIntersections(categoryElements[category], intersections) + 1;
            intersections += categoryHeight;
            h += categoryHeight * (conf.barHeight + conf.barGap);
            categoryHeights[category] = categoryHeight;
        }
    } else {
        h += tasksWithoutVert.length * (conf.barHeight + conf.barGap);
        for (const category of categories){
            categoryHeights[category] = tasksWithoutVert.filter((task)=>task.type === category).length;
        }
    }
    elem.setAttribute("viewBox", "0 0 " + w + " " + h);
    const svg = root.select(`[id="${id}"]`);
    const timeScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$scale$2f$src$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__scaleTime$3e$__["scaleTime"])().domain([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$array$2f$src$2f$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__min$3e$__["min"])(taskArray, function(d) {
            return d.startTime;
        }),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$array$2f$src$2f$max$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__max$3e$__["max"])(taskArray, function(d) {
            return d.endTime;
        })
    ]).rangeRound([
        0,
        w - conf.leftPadding - conf.rightPadding
    ]);
    function taskCompare(a, b) {
        const taskA = a.startTime;
        const taskB = b.startTime;
        let result = 0;
        if (taskA > taskB) {
            result = 1;
        } else if (taskA < taskB) {
            result = -1;
        }
        return result;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(taskCompare, "taskCompare");
    taskArray.sort(taskCompare);
    makeGantt(taskArray, w, h);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["configureSvgSize"])(svg, h, w, conf.useMaxWidth);
    svg.append("text").text(diagObj.db.getDiagramTitle()).attr("x", w / 2).attr("y", conf.titleTopMargin).attr("class", "titleText");
    function makeGantt(tasks2, pageWidth, pageHeight) {
        const barHeight = conf.barHeight;
        const gap = barHeight + conf.barGap;
        const topPadding = conf.topPadding;
        const leftPadding = conf.leftPadding;
        const colorScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$scale$2f$src$2f$linear$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__scaleLinear$3e$__["scaleLinear"])().domain([
            0,
            categories.length
        ]).range([
            "#00B9FA",
            "#F95002"
        ]).interpolate(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$hcl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateHcl$3e$__["interpolateHcl"]);
        drawExcludeDays(gap, topPadding, leftPadding, pageWidth, pageHeight, tasks2, diagObj.db.getExcludes(), diagObj.db.getIncludes());
        makeGrid(leftPadding, topPadding, pageWidth, pageHeight);
        drawRects(tasks2, gap, topPadding, leftPadding, barHeight, colorScale, pageWidth, pageHeight);
        vertLabels(gap, topPadding, leftPadding, barHeight, colorScale);
        drawToday(leftPadding, topPadding, pageWidth, pageHeight);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(makeGantt, "makeGantt");
    function drawRects(theArray, theGap, theTopPad, theSidePad, theBarHeight, theColorScale, w2) {
        theArray.sort((a, b)=>a.vert === b.vert ? 0 : a.vert ? 1 : -1);
        const tasksWithoutVert2 = theArray.filter((task)=>!task.vert);
        const uniqueTaskOrderIds = [
            ...new Set(tasksWithoutVert2.map((item)=>item.order))
        ];
        const uniqueTasks = uniqueTaskOrderIds.map((id2)=>tasksWithoutVert2.find((item)=>item.order === id2));
        svg.append("g").selectAll("rect").data(uniqueTasks).enter().append("rect").attr("x", 0).attr("y", function(d, i) {
            i = d.order;
            return i * theGap + theTopPad - 2;
        }).attr("width", function() {
            return w2 - conf.rightPadding / 2;
        }).attr("height", theGap).attr("class", function(d) {
            for (const [i, category] of categories.entries()){
                if (d.type === category) {
                    return "section section" + i % conf.numberSectionStyles;
                }
            }
            return "section section0";
        }).enter();
        const rectangles = svg.append("g").selectAll("rect").data(theArray).enter();
        const links2 = diagObj.db.getLinks();
        rectangles.append("rect").attr("id", function(d) {
            return id + "-" + d.id;
        }).attr("rx", 3).attr("ry", 3).attr("x", function(d) {
            if (d.milestone) {
                return timeScale(d.startTime) + theSidePad + 0.5 * (timeScale(d.endTime) - timeScale(d.startTime)) - 0.5 * theBarHeight;
            }
            return timeScale(d.startTime) + theSidePad;
        }).attr("y", function(d, i) {
            i = d.order;
            if (d.vert) {
                return conf.gridLineStartPadding;
            }
            return i * theGap + theTopPad;
        }).attr("width", function(d) {
            if (d.milestone) {
                return theBarHeight;
            }
            if (d.vert) {
                return 0.08 * theBarHeight;
            }
            return timeScale(d.renderEndTime || d.endTime) - timeScale(d.startTime);
        }).attr("height", function(d) {
            if (d.vert) {
                return tasksWithoutVert2.length * (conf.barHeight + conf.barGap) + conf.barHeight * 2;
            }
            return theBarHeight;
        }).attr("transform-origin", function(d, i) {
            i = d.order;
            return (timeScale(d.startTime) + theSidePad + 0.5 * (timeScale(d.endTime) - timeScale(d.startTime))).toString() + "px " + (i * theGap + theTopPad + 0.5 * theBarHeight).toString() + "px";
        }).attr("class", function(d) {
            const res = "task";
            let classStr = "";
            if (d.classes.length > 0) {
                classStr = d.classes.join(" ");
            }
            let secNum = 0;
            for (const [i, category] of categories.entries()){
                if (d.type === category) {
                    secNum = i % conf.numberSectionStyles;
                }
            }
            let taskClass = "";
            if (d.active) {
                if (d.crit) {
                    taskClass += " activeCrit";
                } else {
                    taskClass = " active";
                }
            } else if (d.done) {
                if (d.crit) {
                    taskClass = " doneCrit";
                } else {
                    taskClass = " done";
                }
            } else {
                if (d.crit) {
                    taskClass += " crit";
                }
            }
            if (taskClass.length === 0) {
                taskClass = " task";
            }
            if (d.milestone) {
                taskClass = " milestone " + taskClass;
            }
            if (d.vert) {
                taskClass = " vert " + taskClass;
            }
            taskClass += secNum;
            taskClass += " " + classStr;
            return res + taskClass;
        });
        rectangles.append("text").attr("id", function(d) {
            return id + "-" + d.id + "-text";
        }).text(function(d) {
            return d.task;
        }).attr("font-size", conf.fontSize).attr("x", function(d) {
            let startX = timeScale(d.startTime);
            let endX = timeScale(d.renderEndTime || d.endTime);
            if (d.milestone) {
                startX += 0.5 * (timeScale(d.endTime) - timeScale(d.startTime)) - 0.5 * theBarHeight;
                endX = startX + theBarHeight;
            }
            if (d.vert) {
                return timeScale(d.startTime) + theSidePad;
            }
            const textWidth = this.getBBox().width;
            if (textWidth > endX - startX) {
                if (endX + textWidth + 1.5 * conf.leftPadding > w2) {
                    return startX + theSidePad - 5;
                } else {
                    return endX + theSidePad + 5;
                }
            } else {
                return (endX - startX) / 2 + startX + theSidePad;
            }
        }).attr("y", function(d, i) {
            if (d.vert) {
                return conf.gridLineStartPadding + tasksWithoutVert2.length * (conf.barHeight + conf.barGap) + 60;
            }
            i = d.order;
            return i * theGap + conf.barHeight / 2 + (conf.fontSize / 2 - 2) + theTopPad;
        }).attr("text-height", theBarHeight).attr("class", function(d) {
            const startX = timeScale(d.startTime);
            let endX = timeScale(d.endTime);
            if (d.milestone) {
                endX = startX + theBarHeight;
            }
            const textWidth = this.getBBox().width;
            let classStr = "";
            if (d.classes.length > 0) {
                classStr = d.classes.join(" ");
            }
            let secNum = 0;
            for (const [i, category] of categories.entries()){
                if (d.type === category) {
                    secNum = i % conf.numberSectionStyles;
                }
            }
            let taskType = "";
            if (d.active) {
                if (d.crit) {
                    taskType = "activeCritText" + secNum;
                } else {
                    taskType = "activeText" + secNum;
                }
            }
            if (d.done) {
                if (d.crit) {
                    taskType = taskType + " doneCritText" + secNum;
                } else {
                    taskType = taskType + " doneText" + secNum;
                }
            } else {
                if (d.crit) {
                    taskType = taskType + " critText" + secNum;
                }
            }
            if (d.milestone) {
                taskType += " milestoneText";
            }
            if (d.vert) {
                taskType += " vertText";
            }
            if (textWidth > endX - startX) {
                if (endX + textWidth + 1.5 * conf.leftPadding > w2) {
                    return classStr + " taskTextOutsideLeft taskTextOutside" + secNum + " " + taskType;
                } else {
                    return classStr + " taskTextOutsideRight taskTextOutside" + secNum + " " + taskType + " width-" + textWidth;
                }
            } else {
                return classStr + " taskText taskText" + secNum + " " + taskType + " width-" + textWidth;
            }
        });
        const securityLevel2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])().securityLevel;
        if (securityLevel2 === "sandbox") {
            let sandboxElement2;
            sandboxElement2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])("#i" + id);
            const doc2 = sandboxElement2.nodes()[0].contentDocument;
            rectangles.filter(function(d) {
                return links2.has(d.id);
            }).each(function(o) {
                var taskRect = doc2.querySelector("#" + CSS.escape(id + "-" + o.id));
                var taskText = doc2.querySelector("#" + CSS.escape(id + "-" + o.id + "-text"));
                const oldParent = taskRect.parentNode;
                var Link = doc2.createElement("a");
                Link.setAttribute("xlink:href", links2.get(o.id));
                Link.setAttribute("target", "_top");
                oldParent.appendChild(Link);
                Link.appendChild(taskRect);
                Link.appendChild(taskText);
            });
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(drawRects, "drawRects");
    function drawExcludeDays(theGap, theTopPad, theSidePad, w2, h2, tasks2, excludes2, includes2) {
        if (excludes2.length === 0 && includes2.length === 0) {
            return;
        }
        let minTime;
        let maxTime;
        for (const { startTime, endTime } of tasks2){
            if (minTime === void 0 || startTime < minTime) {
                minTime = startTime;
            }
            if (maxTime === void 0 || endTime > maxTime) {
                maxTime = endTime;
            }
        }
        if (!minTime || !maxTime) {
            return;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(maxTime).diff((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(minTime), "year") > 5) {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");
            return;
        }
        const dateFormat2 = diagObj.db.getDateFormat();
        const excludeRanges = [];
        let range = null;
        let d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(minTime);
        while(d.valueOf() <= maxTime){
            if (diagObj.db.isInvalidDate(d, dateFormat2, excludes2, includes2)) {
                if (!range) {
                    range = {
                        start: d,
                        end: d
                    };
                } else {
                    range.end = d;
                }
            } else {
                if (range) {
                    excludeRanges.push(range);
                    range = null;
                }
            }
            d = d.add(1, "d");
        }
        const rectangles = svg.append("g").selectAll("rect").data(excludeRanges).enter();
        rectangles.append("rect").attr("id", (d2)=>id + "-exclude-" + d2.start.format("YYYY-MM-DD")).attr("x", (d2)=>timeScale(d2.start.startOf("day")) + theSidePad).attr("y", conf.gridLineStartPadding).attr("width", (d2)=>timeScale(d2.end.endOf("day")) - timeScale(d2.start.startOf("day"))).attr("height", h2 - theTopPad - conf.gridLineStartPadding).attr("transform-origin", function(d2, i) {
            return (timeScale(d2.start) + theSidePad + 0.5 * (timeScale(d2.end) - timeScale(d2.start))).toString() + "px " + (i * theGap + 0.5 * h2).toString() + "px";
        }).attr("class", "exclude-range");
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(drawExcludeDays, "drawExcludeDays");
    function getEstimatedTickCount(minTime, maxTime, every, interval) {
        if (every <= 0 || minTime > maxTime) {
            return Infinity;
        }
        const timeDiffMs = maxTime - minTime;
        const intervalMs = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].duration({
            [interval ?? "day"]: every
        }).asMilliseconds();
        if (intervalMs <= 0) {
            return Infinity;
        }
        return Math.ceil(timeDiffMs / intervalMs);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(getEstimatedTickCount, "getEstimatedTickCount");
    function makeGrid(theSidePad, theTopPad, w2, h2) {
        const dateFormat2 = diagObj.db.getDateFormat();
        const userAxisFormat = diagObj.db.getAxisFormat();
        let axisFormat2;
        if (userAxisFormat) {
            axisFormat2 = userAxisFormat;
        } else if (dateFormat2 === "D") {
            axisFormat2 = "%d";
        } else {
            axisFormat2 = conf.axisFormat ?? "%Y-%m-%d";
        }
        let bottomXAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$axis$2f$src$2f$axis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axisBottom"])(timeScale).tickSize(-h2 + theTopPad + conf.gridLineStartPadding).tickFormat((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2d$format$2f$src$2f$defaultLocale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeFormat"])(axisFormat2));
        const reTickInterval = /^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/;
        const resultTickInterval = reTickInterval.exec(diagObj.db.getTickInterval() || conf.tickInterval);
        if (resultTickInterval !== null) {
            const every = parseInt(resultTickInterval[1], 10);
            if (isNaN(every) || every <= 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].warn(`Invalid tick interval value: "${resultTickInterval[1]}". Skipping custom tick interval.`);
            } else {
                const interval = resultTickInterval[2];
                const weekday2 = diagObj.db.getWeekday() || conf.weekday;
                const domain = timeScale.domain();
                const minTime = domain[0];
                const maxTime = domain[1];
                const estimatedTicks = getEstimatedTickCount(minTime, maxTime, every, interval);
                if (estimatedTicks > MAX_TICK_COUNT) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].warn(`The tick interval "${every}${interval}" would generate ${estimatedTicks} ticks, which exceeds the maximum allowed (${MAX_TICK_COUNT}). This may indicate an invalid date or time range. Skipping custom tick interval.`);
                } else {
                    switch(interval){
                        case "millisecond":
                            bottomXAxis.ticks(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$millisecond$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__millisecond__as__timeMillisecond$3e$__["timeMillisecond"].every(every));
                            break;
                        case "second":
                            bottomXAxis.ticks(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$second$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__second__as__timeSecond$3e$__["timeSecond"].every(every));
                            break;
                        case "minute":
                            bottomXAxis.ticks(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$minute$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeMinute"].every(every));
                            break;
                        case "hour":
                            bottomXAxis.ticks(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$hour$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeHour"].every(every));
                            break;
                        case "day":
                            bottomXAxis.ticks(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$day$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeDay"].every(every));
                            break;
                        case "week":
                            bottomXAxis.ticks(mapWeekdayToTimeFunction[weekday2].every(every));
                            break;
                        case "month":
                            bottomXAxis.ticks(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$month$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeMonth"].every(every));
                            break;
                    }
                }
            }
        }
        svg.append("g").attr("class", "grid").attr("transform", "translate(" + theSidePad + ", " + (h2 - 50) + ")").call(bottomXAxis).selectAll("text").style("text-anchor", "middle").attr("fill", "#000").attr("stroke", "none").attr("font-size", 10).attr("dy", "1em");
        if (diagObj.db.topAxisEnabled() || conf.topAxis) {
            let topXAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$axis$2f$src$2f$axis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axisTop"])(timeScale).tickSize(-h2 + theTopPad + conf.gridLineStartPadding).tickFormat((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2d$format$2f$src$2f$defaultLocale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeFormat"])(axisFormat2));
            if (resultTickInterval !== null) {
                const every = parseInt(resultTickInterval[1], 10);
                if (isNaN(every) || every <= 0) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].warn(`Invalid tick interval value: "${resultTickInterval[1]}". Skipping custom tick interval.`);
                } else {
                    const interval = resultTickInterval[2];
                    const weekday2 = diagObj.db.getWeekday() || conf.weekday;
                    const domain = timeScale.domain();
                    const minTime = domain[0];
                    const maxTime = domain[1];
                    const estimatedTicks = getEstimatedTickCount(minTime, maxTime, every, interval);
                    if (estimatedTicks <= MAX_TICK_COUNT) {
                        switch(interval){
                            case "millisecond":
                                topXAxis.ticks(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$millisecond$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__millisecond__as__timeMillisecond$3e$__["timeMillisecond"].every(every));
                                break;
                            case "second":
                                topXAxis.ticks(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$second$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__second__as__timeSecond$3e$__["timeSecond"].every(every));
                                break;
                            case "minute":
                                topXAxis.ticks(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$minute$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeMinute"].every(every));
                                break;
                            case "hour":
                                topXAxis.ticks(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$hour$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeHour"].every(every));
                                break;
                            case "day":
                                topXAxis.ticks(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$day$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeDay"].every(every));
                                break;
                            case "week":
                                topXAxis.ticks(mapWeekdayToTimeFunction[weekday2].every(every));
                                break;
                            case "month":
                                topXAxis.ticks(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$time$2f$src$2f$month$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeMonth"].every(every));
                                break;
                        }
                    }
                }
            }
            svg.append("g").attr("class", "grid").attr("transform", "translate(" + theSidePad + ", " + theTopPad + ")").call(topXAxis).selectAll("text").style("text-anchor", "middle").attr("fill", "#000").attr("stroke", "none").attr("font-size", 10);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(makeGrid, "makeGrid");
    function vertLabels(theGap, theTopPad) {
        let prevGap = 0;
        const numOccurrences = Object.keys(categoryHeights).map((d)=>[
                d,
                categoryHeights[d]
            ]);
        svg.append("g").selectAll("text").data(numOccurrences).enter().append(function(d) {
            const rows = d[0].split(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["common_default"].lineBreakRegex);
            const dy = -(rows.length - 1) / 2;
            const svgLabel = doc.createElementNS("http://www.w3.org/2000/svg", "text");
            svgLabel.setAttribute("dy", dy + "em");
            for (const [j, row] of rows.entries()){
                const tspan = doc.createElementNS("http://www.w3.org/2000/svg", "tspan");
                tspan.setAttribute("alignment-baseline", "central");
                tspan.setAttribute("x", "10");
                if (j > 0) {
                    tspan.setAttribute("dy", "1em");
                }
                tspan.textContent = row;
                svgLabel.appendChild(tspan);
            }
            return svgLabel;
        }).attr("x", 10).attr("y", function(d, i) {
            if (i > 0) {
                for(let j = 0; j < i; j++){
                    prevGap += numOccurrences[i - 1][1];
                    return d[1] * theGap / 2 + prevGap * theGap + theTopPad;
                }
            } else {
                return d[1] * theGap / 2 + theTopPad;
            }
        }).attr("font-size", conf.sectionFontSize).attr("class", function(d) {
            for (const [i, category] of categories.entries()){
                if (d[0] === category) {
                    return "sectionTitle sectionTitle" + i % conf.numberSectionStyles;
                }
            }
            return "sectionTitle";
        });
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(vertLabels, "vertLabels");
    function drawToday(theSidePad, theTopPad, w2, h2) {
        const todayMarker2 = diagObj.db.getTodayMarker();
        if (todayMarker2 === "off") {
            return;
        }
        const todayG = svg.append("g").attr("class", "today");
        const today = /* @__PURE__ */ new Date();
        const todayLine = todayG.append("line");
        todayLine.attr("x1", timeScale(today) + theSidePad).attr("x2", timeScale(today) + theSidePad).attr("y1", conf.titleTopMargin).attr("y2", h2 - conf.titleTopMargin).attr("class", "today");
        if (todayMarker2 !== "") {
            todayLine.attr("style", todayMarker2.replace(/,/g, ";"));
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(drawToday, "drawToday");
    function checkUnique(arr) {
        const hash = {};
        const result = [];
        for(let i = 0, l = arr.length; i < l; ++i){
            if (!Object.prototype.hasOwnProperty.call(hash, arr[i])) {
                hash[arr[i]] = true;
                result.push(arr[i]);
            }
        }
        return result;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(checkUnique, "checkUnique");
}, "draw");
var ganttRenderer_default = {
    setConf,
    draw
};
// src/diagrams/gantt/styles.js
var getStyles = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((options)=>`
  .mermaid-main-font {
        font-family: ${options.fontFamily};
  }

  .exclude-range {
    fill: ${options.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${options.sectionBkgColor};
  }

  .section2 {
    fill: ${options.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${options.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${options.titleColor};
  }

  .sectionTitle1 {
    fill: ${options.titleColor};
  }

  .sectionTitle2 {
    fill: ${options.titleColor};
  }

  .sectionTitle3 {
    fill: ${options.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: ${options.fontFamily};
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${options.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${options.fontFamily};
    fill: ${options.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${options.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: ${options.fontFamily};
  }

  .taskTextOutsideRight {
    fill: ${options.taskTextDarkColor};
    text-anchor: start;
    font-family: ${options.fontFamily};
  }

  .taskTextOutsideLeft {
    fill: ${options.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${options.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${options.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${options.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${options.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${options.taskBkgColor};
    stroke: ${options.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${options.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${options.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${options.activeTaskBkgColor};
    stroke: ${options.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${options.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${options.doneTaskBorderColor};
    fill: ${options.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${options.taskTextDarkColor} !important;
  }

  /* Done task text displayed outside the bar sits against the diagram background,
     not against the done-task bar, so it must use the outside/contrast color. */
  .doneText0.taskTextOutsideLeft,
  .doneText0.taskTextOutsideRight,
  .doneText1.taskTextOutsideLeft,
  .doneText1.taskTextOutsideRight,
  .doneText2.taskTextOutsideLeft,
  .doneText2.taskTextOutsideRight,
  .doneText3.taskTextOutsideLeft,
  .doneText3.taskTextOutsideRight {
    fill: ${options.taskTextOutsideColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${options.critBorderColor};
    fill: ${options.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${options.critBorderColor};
    fill: ${options.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${options.critBorderColor};
    fill: ${options.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${options.taskTextDarkColor} !important;
  }

  /* Done-crit task text outside the bar \u2014 same reasoning as doneText above. */
  .doneCritText0.taskTextOutsideLeft,
  .doneCritText0.taskTextOutsideRight,
  .doneCritText1.taskTextOutsideLeft,
  .doneCritText1.taskTextOutsideRight,
  .doneCritText2.taskTextOutsideLeft,
  .doneCritText2.taskTextOutsideRight,
  .doneCritText3.taskTextOutsideLeft,
  .doneCritText3.taskTextOutsideRight {
    fill: ${options.taskTextOutsideColor} !important;
  }

  .vert {
    stroke: ${options.vertLineColor};
  }

  .vertText {
    font-size: 15px;
    text-anchor: middle;
    fill: ${options.vertLineColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${options.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${options.titleColor || options.textColor};
    font-family: ${options.fontFamily};
  }
`, "getStyles");
var styles_default = getStyles;
// src/diagrams/gantt/ganttDiagram.ts
var diagram = {
    parser: gantt_default,
    db: ganttDb_default,
    renderer: ganttRenderer_default,
    styles: styles_default
};
;
}),
]);

//# sourceMappingURL=19xk_mermaid_dist_chunks_mermaid_core_1tk4_m8._.js.map