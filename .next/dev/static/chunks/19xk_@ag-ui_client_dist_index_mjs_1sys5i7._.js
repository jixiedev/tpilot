(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/@ag-ui/client/dist/index.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AbstractAgent",
    ()=>Pe,
    "BackwardCompatibility_0_0_39",
    ()=>Z,
    "BackwardCompatibility_0_0_45",
    ()=>De,
    "BackwardCompatibility_0_0_47",
    ()=>Me,
    "DebugLogger",
    ()=>I,
    "FilterToolCallsMiddleware",
    ()=>xe,
    "FunctionMiddleware",
    ()=>X,
    "HttpAgent",
    ()=>Fe,
    "Middleware",
    ()=>Y,
    "buildResumeArray",
    ()=>be,
    "compactEvents",
    ()=>Ie,
    "convertToLegacyEvents",
    ()=>K,
    "createDebugLogger",
    ()=>L,
    "defaultApplyEvents",
    ()=>R,
    "getRunOutcome",
    ()=>ye,
    "isInterruptExpired",
    ()=>J,
    "parseProtoStream",
    ()=>U,
    "parseSSEStream",
    ()=>H,
    "randomUUID",
    ()=>k,
    "resolveAgentDebugConfig",
    ()=>P,
    "resolveDebugLogger",
    ()=>F,
    "runHttpRequest",
    ()=>V,
    "structuredClone_",
    ()=>O,
    "transformChunks",
    ()=>q,
    "transformHttpEventStream",
    ()=>W,
    "verifyEvents",
    ()=>z
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/uuid/dist/esm-browser/v4.js [app-client] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@ag-ui/core/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$fast$2d$json$2d$patch$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/fast-json-patch/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$empty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/observable/empty.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Observable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/Observable.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$ReplaySubject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/ReplaySubject.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Subject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/Subject.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/observable/defer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$finalize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/finalize.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$from$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/observable/from.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$lastValueFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/lastValueFrom.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$mergeMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/observable/of.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$util$2f$pipe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/util/pipe.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/observable/throwError.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/catchError.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$concatMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/concatMap.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$defaultIfEmpty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/defaultIfEmpty.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/filter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/map.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$mergeAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/mergeAll.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/switchMap.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$takeUntil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/takeUntil.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$tap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/tap.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$untruncate$2d$json$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/untruncate-json/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$proto$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@ag-ui/proto/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@ag-ui/client/node_modules/zod/v3/external.js [app-client] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$compare$2d$versions$2f$lib$2f$esm$2f$compareVersions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/compare-versions/lib/esm/compareVersions.js [app-client] (ecmascript)");
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
const O = (e)=>{
    if (typeof structuredClone == `function`) return structuredClone(e);
    try {
        return JSON.parse(JSON.stringify(e));
    } catch  {
        return Array.isArray(e) ? [
            ...e
        ] : {
            ...e
        };
    }
};
function k() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
}
function A(e) {
    if (Object.freeze(e), typeof e == `object` && e) for (let t of Object.values(e))typeof t == `object` && t && !Object.isFrozen(t) && A(t);
    return e;
}
const j = 512 * 1024;
function M(e, t, n) {
    let r = 0, i = [
        e,
        t
    ], a = new WeakSet;
    for(; i.length > 0;){
        let e = i.pop();
        if (typeof e == `string`) {
            if (r += e.length, r > n) return !0;
        } else if (typeof e == `object` && e) {
            if (a.has(e)) continue;
            if (a.add(e), Array.isArray(e)) for(let t = 0; t < e.length; t++)i.push(e[t]);
            else {
                let t = Object.keys(e);
                for(let a = 0; a < t.length; a++){
                    let o = t[a];
                    if (r += o.length, r > n) return !0;
                    i.push(e[o]);
                }
            }
        }
    }
    return !1;
}
async function N(e, t, n, r) {
    let i = typeof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] < `u` && __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env !== void 0, a = i && (("TURBOPACK compile-time value", "development") === `test` || !!__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.VITEST_WORKER_ID), o = i && (("TURBOPACK compile-time value", "development") === `development` || ("TURBOPACK compile-time value", "development") === `test` || !!__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.VITEST_WORKER_ID), s = o && !M(t, n, j), c = s ? O(t) : t, l = s ? O(n) : n, u = !1, d = !1, f;
    for (let t of e)try {
        s && (A(c), A(l));
        let e = await r(t, c, l);
        if (e === void 0) continue;
        let n = !1;
        if (e.messages !== void 0 && e.messages !== c && (c = O(e.messages), u = !0, n = !0), e.state !== void 0 && e.state !== l && (l = O(e.state), d = !0, n = !0), s && n && M(c, l, j) && (s = !1), f = e.stopPropagation, f === !0) break;
    } catch (e) {
        if (o && e instanceof TypeError) {
            if (a) throw e;
            console.error(`AG-UI: Subscriber attempted to mutate frozen inputs in-place. Return mutations via AgentStateMutation instead of mutating directly.`, e);
        } else a || console.error(`Subscriber error:`, e);
        continue;
    }
    return {
        ...u ? {
            messages: Object.isFrozen(c) ? O(c) : c
        } : {},
        ...d ? {
            state: Object.isFrozen(l) ? O(l) : l
        } : {},
        ...f === void 0 ? {} : {
            stopPropagation: f
        }
    };
}
function P(e) {
    if (!e) return {
        enabled: !1,
        events: !1,
        lifecycle: !1,
        verbose: !1
    };
    if (e === !0) return {
        enabled: !0,
        events: !0,
        lifecycle: !0,
        verbose: !0
    };
    let t = e.events ?? !0, n = e.lifecycle ?? !0, r = e.verbose ?? !1;
    return {
        enabled: t || n,
        events: t,
        lifecycle: n,
        verbose: r
    };
}
function F(e) {
    if (e instanceof I) return e;
    if (e === !0) return new I(P(!0));
}
var I = class {
    constructor(e){
        this.config = e;
    }
    event(e, t, n, r) {
        this.config.events && (this.config.verbose ? console.debug(`[${e}] ${t}`, typeof n == `string` ? n : JSON.stringify(n)) : console.debug(`[${e}] ${t}`, r ?? n));
    }
    lifecycle(e, t, n) {
        this.config.lifecycle && (n ? console.debug(`[${e}] ${t}`, n) : console.debug(`[${e}] ${t}`));
    }
    get eventsEnabled() {
        return this.config.events;
    }
    get lifecycleEnabled() {
        return this.config.lifecycle;
    }
    get enabled() {
        return this.config.enabled;
    }
};
function L(e) {
    return e.enabled ? new I(e) : void 0;
}
function ae(e, t, n) {
    if (t) {
        let r = e.find((e)=>e.id === t);
        if (r?.role === `assistant`) return r;
        r && console.warn(`TOOL_CALL_START: parentMessageId '${t}' matches a '${r.role}' message, not assistant — falling back to toolCallId`);
        let i = {
            id: r ? n : t,
            role: `assistant`,
            toolCalls: []
        };
        return e.push(i), i;
    }
    let r = {
        id: n,
        role: `assistant`,
        toolCalls: []
    };
    return e.push(r), r;
}
const R = (e, t, n, r, s)=>{
    let c = F(s), l = O(n.messages), u = O(e.state), d = {}, f = (e)=>{
        e.messages !== void 0 && (l = e.messages, d.messages = e.messages), e.state !== void 0 && (u = e.state, d.state = e.state);
    }, p = ()=>{
        let e = O(d);
        return d = {}, e.messages !== void 0 || e.state !== void 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e) : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$empty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY"];
    };
    return t.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$concatMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatMap"])(async (t)=>{
        let o = await N(r, l, u, (r, i, a)=>r.onEvent?.({
                event: t,
                agent: n,
                input: e,
                messages: i,
                state: a
            }));
        if (f(o), o.stopPropagation === !0 ? c?.event(`APPLY`, `Event dropped:`, t, {
            type: t.type,
            reason: `stopPropagation by subscriber`
        }) : c?.event(`APPLY`, `Event applied:`, t, {
            type: t.type,
            subscribers: r.length
        }), o.stopPropagation === !0) return p();
        switch(t.type){
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_START:
                {
                    let i = await N(r, l, u, (r, i, a)=>r.onTextMessageStartEvent?.({
                            event: t,
                            messages: i,
                            state: a,
                            agent: n,
                            input: e
                        }));
                    if (f(i), i.stopPropagation !== !0) {
                        let { messageId: e, role: n = `assistant`, name: r } = t;
                        if (!l.find((t)=>t.id === e)) {
                            let t = {
                                id: e,
                                role: n,
                                content: ``,
                                ...r !== void 0 && {
                                    name: r
                                }
                            };
                            l.push(t), f({
                                messages: l
                            });
                        }
                    }
                    return p();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_CONTENT:
                {
                    let { messageId: i, delta: a } = t, o = l.find((e)=>e.id === i);
                    if (!o) return console.warn(`TEXT_MESSAGE_CONTENT: No message found with ID '${i}'`), p();
                    let s = await N(r, l, u, (r, i, a)=>r.onTextMessageContentEvent?.({
                            event: t,
                            messages: i,
                            state: a,
                            agent: n,
                            input: e,
                            textMessageBuffer: typeof o.content == `string` ? o.content : ``
                        }));
                    return f(s), s.stopPropagation !== !0 && (o.content = `${typeof o.content == `string` ? o.content : ``}${a}`, f({
                        messages: l
                    })), p();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_END:
                {
                    let { messageId: i } = t, a = l.find((e)=>e.id === i);
                    return a ? (f(await N(r, l, u, (r, i, o)=>r.onTextMessageEndEvent?.({
                            event: t,
                            messages: i,
                            state: o,
                            agent: n,
                            input: e,
                            textMessageBuffer: typeof a.content == `string` ? a.content : ``
                        }))), await Promise.all(r.map((t)=>{
                        t.onNewMessage?.({
                            message: a,
                            messages: l,
                            state: u,
                            agent: n,
                            input: e
                        });
                    })), p()) : (console.warn(`TEXT_MESSAGE_END: No message found with ID '${i}'`), p());
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_START:
                {
                    let i = await N(r, l, u, (r, i, a)=>r.onToolCallStartEvent?.({
                            event: t,
                            messages: i,
                            state: a,
                            agent: n,
                            input: e
                        }));
                    if (f(i), i.stopPropagation !== !0) {
                        let { toolCallId: e, toolCallName: n, parentMessageId: r } = t, i = ae(l, r, e);
                        i.toolCalls ??= [], i.toolCalls.push({
                            id: e,
                            type: `function`,
                            function: {
                                name: n,
                                arguments: ``
                            }
                        }), f({
                            messages: l
                        });
                    }
                    return p();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_ARGS:
                {
                    let { toolCallId: i, delta: a } = t, o = l.find((e)=>e.toolCalls?.some((e)=>e.id === i));
                    if (!o) return console.warn(`TOOL_CALL_ARGS: No message found containing tool call with ID '${i}'`), p();
                    let s = o.toolCalls?.find((e)=>e.id === i);
                    if (!s) return console.warn(`TOOL_CALL_ARGS: No tool call found with ID '${i}'`), p();
                    let c = await N(r, l, u, (r, i, a)=>{
                        let o = s.function.arguments, c = s.function.name, l = {};
                        try {
                            l = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$untruncate$2d$json$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(o);
                        } catch  {}
                        return r.onToolCallArgsEvent?.({
                            event: t,
                            messages: i,
                            state: a,
                            agent: n,
                            input: e,
                            toolCallBuffer: o,
                            toolCallName: c,
                            partialToolCallArgs: l
                        });
                    });
                    return f(c), c.stopPropagation !== !0 && (s.function.arguments += a, f({
                        messages: l
                    })), p();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_END:
                {
                    let { toolCallId: i } = t, a = l.find((e)=>e.toolCalls?.some((e)=>e.id === i));
                    if (!a) return console.warn(`TOOL_CALL_END: No message found containing tool call with ID '${i}'`), p();
                    let o = a.toolCalls?.find((e)=>e.id === i);
                    return o ? (f(await N(r, l, u, (r, i, a)=>{
                        let s = o.function.arguments, c = o.function.name, l = {};
                        try {
                            l = JSON.parse(s);
                        } catch  {}
                        return r.onToolCallEndEvent?.({
                            event: t,
                            messages: i,
                            state: a,
                            agent: n,
                            input: e,
                            toolCallName: c,
                            toolCallArgs: l
                        });
                    })), await Promise.all(r.map((t)=>{
                        t.onNewToolCall?.({
                            toolCall: o,
                            messages: l,
                            state: u,
                            agent: n,
                            input: e
                        });
                    })), p()) : (console.warn(`TOOL_CALL_END: No tool call found with ID '${i}'`), p());
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_RESULT:
                {
                    let i = await N(r, l, u, (r, i, a)=>r.onToolCallResultEvent?.({
                            event: t,
                            messages: i,
                            state: a,
                            agent: n,
                            input: e
                        }));
                    if (f(i), i.stopPropagation !== !0) {
                        let { messageId: i, toolCallId: a, content: o, role: s } = t, c = {
                            id: i,
                            toolCallId: a,
                            role: s || `tool`,
                            content: o
                        }, d = l.findIndex((e)=>e.role === `assistant` && e.toolCalls?.some((e)=>e.id === a));
                        if (d === -1) l.push(c);
                        else {
                            let e = d + 1;
                            for(; e < l.length && l[e].role === `tool`;)e++;
                            l.splice(e, 0, c);
                        }
                        await Promise.all(r.map((t)=>{
                            t.onNewMessage?.({
                                message: c,
                                messages: l,
                                state: u,
                                agent: n,
                                input: e
                            });
                        })), f({
                            messages: l
                        });
                    }
                    return p();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STATE_SNAPSHOT:
                {
                    let i = await N(r, l, u, (r, i, a)=>r.onStateSnapshotEvent?.({
                            event: t,
                            messages: i,
                            state: a,
                            agent: n,
                            input: e
                        }));
                    if (f(i), i.stopPropagation !== !0) {
                        let { snapshot: e } = t;
                        u = e, f({
                            state: u
                        });
                    }
                    return p();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STATE_DELTA:
                {
                    let i = await N(r, l, u, (r, i, a)=>r.onStateDeltaEvent?.({
                            event: t,
                            messages: i,
                            state: a,
                            agent: n,
                            input: e
                        }));
                    if (f(i), i.stopPropagation !== !0) {
                        let { delta: e } = t;
                        try {
                            u = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$fast$2d$json$2d$patch$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].applyPatch(u, e, !0, !1).newDocument, f({
                                state: u
                            });
                        } catch (t) {
                            let n = t instanceof Error ? t.message : String(t);
                            console.warn(`Failed to apply state patch:\nCurrent state: ${JSON.stringify(u, null, 2)}\nPatch operations: ${JSON.stringify(e, null, 2)}\nError: ${n}`);
                        }
                    }
                    return p();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].MESSAGES_SNAPSHOT:
                {
                    let i = await N(r, l, u, (r, i, a)=>r.onMessagesSnapshotEvent?.({
                            event: t,
                            messages: i,
                            state: a,
                            agent: n,
                            input: e
                        }));
                    if (f(i), i.stopPropagation !== !0) {
                        let { messages: e } = t, n = new Map(e.map((e)=>[
                                e.id,
                                e
                            ])), r = e.some((e)=>e.role === `reasoning`), i = (e)=>e.role === `activity` || e.role === `reasoning` && !r;
                        l = l.filter((e)=>i(e) || n.has(e.id)).map((e)=>i(e) ? e : n.get(e.id));
                        let a = new Set(l.map((e)=>e.id));
                        for (let t of e)a.has(t.id) || l.push(t);
                        f({
                            messages: l
                        });
                    }
                    return p();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].ACTIVITY_SNAPSHOT:
                {
                    let i = t, a = l.findIndex((e)=>e.id === i.messageId), o = a >= 0 ? l[a] : void 0, s = o?.role === `activity` ? o : void 0, c = i.replace ?? !0, d = await N(r, l, u, (t, r, a)=>t.onActivitySnapshotEvent?.({
                            event: i,
                            messages: r,
                            state: a,
                            agent: n,
                            input: e,
                            activityMessage: s,
                            existingMessage: o
                        }));
                    if (f(d), d.stopPropagation !== !0) {
                        let t = {
                            id: i.messageId,
                            role: `activity`,
                            activityType: i.activityType,
                            content: O(i.content)
                        }, o;
                        a === -1 ? (l.push(t), o = t) : s ? c && (l[a] = {
                            ...s,
                            activityType: i.activityType,
                            content: O(i.content)
                        }) : c && (l[a] = t, o = t), f({
                            messages: l
                        }), o && await Promise.all(r.map((t)=>t.onNewMessage?.({
                                message: o,
                                messages: l,
                                state: u,
                                agent: n,
                                input: e
                            })));
                    }
                    return p();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].ACTIVITY_DELTA:
                {
                    let i = t, o = l.findIndex((e)=>e.id === i.messageId);
                    if (o === -1) return p();
                    let s = l[o];
                    if (s.role !== `activity`) return console.warn(`ACTIVITY_DELTA: Message '${i.messageId}' is not an activity message`), p();
                    let c = s, d = await N(r, l, u, (t, r, a)=>t.onActivityDeltaEvent?.({
                            event: i,
                            messages: r,
                            state: a,
                            agent: n,
                            input: e,
                            activityMessage: c
                        }));
                    if (f(d), d.stopPropagation !== !0) try {
                        let e = O(c.content ?? {}), t = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$fast$2d$json$2d$patch$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].applyPatch(e, i.patch ?? [], !0, !1).newDocument;
                        l[o] = {
                            ...c,
                            content: O(t),
                            activityType: i.activityType
                        }, f({
                            messages: l
                        });
                    } catch (e) {
                        let t = e instanceof Error ? e.message : String(e);
                        console.warn(`Failed to apply activity patch for '${i.messageId}': ${t}`);
                    }
                    return p();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RAW:
                return f(await N(r, l, u, (r, i, a)=>r.onRawEvent?.({
                        event: t,
                        messages: i,
                        state: a,
                        agent: n,
                        input: e
                    }))), p();
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].CUSTOM:
                return f(await N(r, l, u, (r, i, a)=>r.onCustomEvent?.({
                        event: t,
                        messages: i,
                        state: a,
                        agent: n,
                        input: e
                    }))), p();
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_STARTED:
                {
                    let i = await N(r, l, u, (r, i, a)=>r.onRunStartedEvent?.({
                            event: t,
                            messages: i,
                            state: a,
                            agent: n,
                            input: e
                        }));
                    if (f(i), i.stopPropagation !== !0) {
                        let e = t;
                        if (e.input?.messages) {
                            for (let t of e.input.messages)l.find((e)=>e.id === t.id) || l.push(t);
                            f({
                                messages: l
                            });
                        }
                    }
                    return p();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_FINISHED:
                {
                    let i = t, a = i.outcome?.type === `interrupt` ? {
                        event: i,
                        outcome: `interrupt`,
                        interrupts: i.outcome.interrupts
                    } : {
                        event: i,
                        outcome: `success`,
                        result: i.result
                    }, o = await N(r, l, u, (t, r, i)=>t.onRunFinishedEvent?.({
                            ...a,
                            messages: r,
                            state: i,
                            agent: n,
                            input: e
                        }));
                    return f(o), o.stopPropagation !== !0 && (n.pendingInterrupts = a.outcome === `interrupt` ? [
                        ...a.interrupts
                    ] : []), p();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_ERROR:
                return f(await N(r, l, u, (r, i, a)=>r.onRunErrorEvent?.({
                        event: t,
                        messages: i,
                        state: a,
                        agent: n,
                        input: e
                    }))), p();
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STEP_STARTED:
                return f(await N(r, l, u, (r, i, a)=>r.onStepStartedEvent?.({
                        event: t,
                        messages: i,
                        state: a,
                        agent: n,
                        input: e
                    }))), p();
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STEP_FINISHED:
                return f(await N(r, l, u, (r, i, a)=>r.onStepFinishedEvent?.({
                        event: t,
                        messages: i,
                        state: a,
                        agent: n,
                        input: e
                    }))), p();
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_CHUNK:
                throw Error(`TEXT_MESSAGE_CHUNK must be tranformed before being applied`);
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_CHUNK:
                throw Error(`TOOL_CALL_CHUNK must be tranformed before being applied`);
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].THINKING_START:
                return p();
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].THINKING_END:
                return p();
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].THINKING_TEXT_MESSAGE_START:
                return p();
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].THINKING_TEXT_MESSAGE_CONTENT:
                return p();
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].THINKING_TEXT_MESSAGE_END:
                return p();
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_START:
                return f(await N(r, l, u, (r, i, a)=>r.onReasoningStartEvent?.({
                        event: t,
                        messages: i,
                        state: a,
                        agent: n,
                        input: e
                    }))), p();
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_START:
                {
                    let i = await N(r, l, u, (r, i, a)=>r.onReasoningMessageStartEvent?.({
                            event: t,
                            messages: i,
                            state: a,
                            agent: n,
                            input: e
                        }));
                    if (f(i), i.stopPropagation !== !0) {
                        let { messageId: e } = t;
                        if (!l.find((t)=>t.id === e)) {
                            let t = {
                                id: e,
                                role: `reasoning`,
                                content: ``
                            };
                            l.push(t), f({
                                messages: l
                            });
                        }
                    }
                    return p();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_CONTENT:
                {
                    let { messageId: i, delta: a } = t, o = l.find((e)=>e.id === i);
                    if (!o) return console.warn(`REASONING_MESSAGE_CONTENT: No message found with ID '${i}'`), p();
                    let s = await N(r, l, u, (r, i, a)=>r.onReasoningMessageContentEvent?.({
                            event: t,
                            messages: i,
                            state: a,
                            agent: n,
                            input: e,
                            reasoningMessageBuffer: typeof o.content == `string` ? o.content : ``
                        }));
                    return f(s), s.stopPropagation !== !0 && (o.content = `${typeof o.content == `string` ? o.content : ``}${a}`, f({
                        messages: l
                    })), p();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_END:
                {
                    let { messageId: i } = t, a = l.find((e)=>e.id === i);
                    return a ? (f(await N(r, l, u, (r, i, o)=>r.onReasoningMessageEndEvent?.({
                            event: t,
                            messages: i,
                            state: o,
                            agent: n,
                            input: e,
                            reasoningMessageBuffer: typeof a.content == `string` ? a.content : ``
                        }))), await Promise.all(r.map((t)=>{
                        t.onNewMessage?.({
                            message: a,
                            messages: l,
                            state: u,
                            agent: n,
                            input: e
                        });
                    })), p()) : (console.warn(`REASONING_MESSAGE_END: No message found with ID '${i}'`), p());
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_CHUNK:
                throw Error(`REASONING_MESSAGE_CHUNK must be transformed before being applied`);
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_END:
                return f(await N(r, l, u, (r, i, a)=>r.onReasoningEndEvent?.({
                        event: t,
                        messages: i,
                        state: a,
                        agent: n,
                        input: e
                    }))), p();
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_ENCRYPTED_VALUE:
                {
                    let { subtype: i, entityId: a, encryptedValue: o } = t, s = await N(r, l, u, (r, i, a)=>r.onReasoningEncryptedValueEvent?.({
                            event: t,
                            messages: i,
                            state: a,
                            agent: n,
                            input: e
                        }));
                    if (f(s), s.stopPropagation !== !0) {
                        let e = !1;
                        if (i === `tool-call`) {
                            for (let t of l)if (t.role === `assistant` && t.toolCalls) {
                                let n = t.toolCalls.find((e)=>e.id === a);
                                if (n) {
                                    n.encryptedValue = o, e = !0;
                                    break;
                                }
                            }
                        } else {
                            let t = l.find((e)=>e.id === a);
                            t?.role !== `activity` && t && (t.encryptedValue = o, e = !0);
                        }
                        e && (d.messages = l);
                    }
                    return p();
                }
        }
        return t.type, p();
    }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$mergeAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeAll"])(), r.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$defaultIfEmpty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultIfEmpty"])({}) : (e)=>e);
}, z = (e)=>(t)=>{
        let r = F(e), a = new Map, o = new Map, s = !1, c = !1, l = !1, u = new Map, d = !1, f = !1, p = !1, m = ()=>{
            a.clear(), o.clear(), u.clear(), d = !1, f = !1, s = !1, c = !1, p = !0;
        };
        return t.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$mergeMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeMap"])((e)=>{
            let t = e.type;
            if (r?.event(`VERIFY`, `Event:`, e, {
                type: e.type
            }), c) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send event type '${t}': The run has already errored with 'RUN_ERROR'. No further events can be sent.`));
            if (s && t !== __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_ERROR && t !== __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_STARTED) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send event type '${t}': The run has already finished with 'RUN_FINISHED'. Start a new run with 'RUN_STARTED'.`));
            if (!l) {
                if (l = !0, t !== __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_STARTED && t !== __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_ERROR) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`First event must be 'RUN_STARTED'`));
            } else if (t === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_STARTED) {
                if (p && !s) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'RUN_STARTED' while a run is still active. The previous run must be finished with 'RUN_FINISHED' before starting a new run.`));
                s && m();
            }
            switch(t){
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_START:
                    {
                        let t = e.messageId;
                        return a.has(t) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'TEXT_MESSAGE_START' event: A text message with ID '${t}' is already in progress. Complete it with 'TEXT_MESSAGE_END' first.`)) : (a.set(t, !0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e));
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_CONTENT:
                    {
                        let t = e.messageId;
                        return a.has(t) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'TEXT_MESSAGE_CONTENT' event: No active text message found with ID '${t}'. Start a text message with 'TEXT_MESSAGE_START' first.`));
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_END:
                    {
                        let t = e.messageId;
                        return a.has(t) ? (a.delete(t), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e)) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'TEXT_MESSAGE_END' event: No active text message found with ID '${t}'. A 'TEXT_MESSAGE_START' event must be sent first.`));
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_START:
                    {
                        let t = e.toolCallId;
                        return o.has(t) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'TOOL_CALL_START' event: A tool call with ID '${t}' is already in progress. Complete it with 'TOOL_CALL_END' first.`)) : (o.set(t, !0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e));
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_ARGS:
                    {
                        let t = e.toolCallId;
                        return o.has(t) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'TOOL_CALL_ARGS' event: No active tool call found with ID '${t}'. Start a tool call with 'TOOL_CALL_START' first.`));
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_END:
                    {
                        let t = e.toolCallId;
                        return o.has(t) ? (o.delete(t), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e)) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'TOOL_CALL_END' event: No active tool call found with ID '${t}'. A 'TOOL_CALL_START' event must be sent first.`));
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STEP_STARTED:
                    {
                        let t = e.stepName;
                        return u.has(t) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Step "${t}" is already active for 'STEP_STARTED'`)) : (u.set(t, !0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e));
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STEP_FINISHED:
                    {
                        let t = e.stepName;
                        return u.has(t) ? (u.delete(t), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e)) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'STEP_FINISHED' for step "${t}" that was not started`));
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_STARTED:
                    return p = !0, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e);
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_FINISHED:
                    if (u.size > 0) {
                        let e = Array.from(u.keys()).join(`, `);
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'RUN_FINISHED' while steps are still active: ${e}`));
                    }
                    if (a.size > 0) {
                        let e = Array.from(a.keys()).join(`, `);
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'RUN_FINISHED' while text messages are still active: ${e}`));
                    }
                    if (o.size > 0) {
                        let e = Array.from(o.keys()).join(`, `);
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'RUN_FINISHED' while tool calls are still active: ${e}`));
                    }
                    return s = !0, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e);
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_ERROR:
                    return c = !0, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e);
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].CUSTOM:
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e);
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].THINKING_TEXT_MESSAGE_START:
                    return d ? f ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'THINKING_TEXT_MESSAGE_START' event: A thinking message is already in progress. Complete it with 'THINKING_TEXT_MESSAGE_END' first.`)) : (f = !0, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e)) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'THINKING_TEXT_MESSAGE_START' event: A thinking step is not in progress. Create one with 'THINKING_START' first.`));
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].THINKING_TEXT_MESSAGE_CONTENT:
                    return f ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'THINKING_TEXT_MESSAGE_CONTENT' event: No active thinking message found. Start a message with 'THINKING_TEXT_MESSAGE_START' first.`));
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].THINKING_TEXT_MESSAGE_END:
                    return f ? (f = !1, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e)) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'THINKING_TEXT_MESSAGE_END' event: No active thinking message found. A 'THINKING_TEXT_MESSAGE_START' event must be sent first.`));
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].THINKING_START:
                    return d ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'THINKING_START' event: A thinking step is already in progress. End it with 'THINKING_END' first.`)) : (d = !0, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e));
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].THINKING_END:
                    return d ? (d = !1, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e)) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Cannot send 'THINKING_END' event: No active thinking step found. A 'THINKING_START' event must be sent first.`));
                default:
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(e);
            }
        }));
    };
let B = function(e) {
    return e.HEADERS = `headers`, e.DATA = `data`, e;
}({});
const V = (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$from$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["from"])(e())).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])((e)=>{
        if (!e.ok) {
            let t = e.headers.get(`content-type`) || ``;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$from$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["from"])(e.text()).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$mergeMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeMap"])((n)=>{
                let r = n;
                if (t.includes(`application/json`)) try {
                    r = JSON.parse(n);
                } catch  {}
                let i = Error(`HTTP ${e.status}: ${typeof r == `string` ? r : JSON.stringify(r)}`);
                return i.status = e.status, i.payload = r, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>i);
            }));
        }
        let t = {
            type: B.HEADERS,
            status: e.status,
            headers: e.headers
        }, n = e.body?.getReader();
        return n ? new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Observable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Observable"]((e)=>(e.next(t), (async ()=>{
                try {
                    for(;;){
                        let { done: t, value: r } = await n.read();
                        if (t) break;
                        let i = {
                            type: B.DATA,
                            data: r
                        };
                        e.next(i);
                    }
                    e.complete();
                } catch (t) {
                    e.error(t);
                }
            })(), ()=>{
                n.cancel().catch((e)=>{
                    if (e?.name !== `AbortError`) throw e;
                });
            })) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>Error(`Failed to getReader() from response`));
    })), H = (e, t)=>{
    let n = F(t), r = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Subject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subject"], i = new TextDecoder(`utf-8`, {
        fatal: !1
    }), a = ``;
    e.subscribe({
        next: (e)=>{
            if (e.type !== B.HEADERS && e.type === B.DATA && e.data) {
                let t = i.decode(e.data, {
                    stream: !0
                });
                a += t;
                let n = a.split(/\n\n/);
                a = n.pop() || ``;
                for (let e of n)o(e);
            }
        },
        error: (e)=>r.error(e),
        complete: ()=>{
            a && (a += i.decode(), o(a)), r.complete();
        }
    });
    function o(e) {
        let t = e.split(`
`), i = [];
        for (let e of t)e.startsWith(`data:`) && i.push(e.slice(5).replace(/^ /, ``));
        if (i.length > 0) try {
            let e = i.join(`
`), t = JSON.parse(e);
            n?.event(`SSE`, `Event received:`, t, {
                type: t.type
            }), r.next(t);
        } catch (e) {
            r.error(e);
        }
    }
    return r.asObservable();
}, U = (e)=>{
    let t = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Subject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subject"], n = new Uint8Array;
    e.subscribe({
        next: (e)=>{
            if (e.type !== B.HEADERS && e.type === B.DATA && e.data) {
                let t = new Uint8Array(n.length + e.data.length);
                t.set(n, 0), t.set(e.data, n.length), n = t, r();
            }
        },
        error: (e)=>t.error(e),
        complete: ()=>{
            if (n.length > 0) try {
                r();
            } catch  {
                console.warn(`Incomplete or invalid protocol buffer data at stream end`);
            }
            t.complete();
        }
    });
    function r() {
        for(; n.length >= 4;){
            let e = 4 + new DataView(n.buffer, n.byteOffset, 4).getUint32(0, !1);
            if (n.length < e) break;
            try {
                let r = n.slice(4, e), i = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$proto$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decode"](r);
                t.next(i), n = n.slice(e);
            } catch (e) {
                let n = e instanceof Error ? e.message : String(e);
                t.error(Error(`Failed to decode protocol buffer message: ${n}`));
                return;
            }
        }
    }
    return t.asObservable();
}, W = (e, t)=>{
    let n = F(t), a = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Subject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subject"], o = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$ReplaySubject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReplaySubject"], s = !1;
    return e.subscribe({
        next: (e)=>{
            if (o.next(e), e.type === B.HEADERS && !s) {
                s = !0;
                let t = e.headers.get(`content-type`);
                n?.lifecycle(`HTTP`, `Stream format detected:`, {
                    contentType: t,
                    parser: t === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$proto$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUI_MEDIA_TYPE"] ? `protobuf` : `sse`
                }), t === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$proto$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUI_MEDIA_TYPE"] ? U(o).subscribe({
                    next: (e)=>a.next(e),
                    error: (e)=>a.error(e),
                    complete: ()=>a.complete()
                }) : H(o, n).subscribe({
                    next: (e)=>{
                        try {
                            let t = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventSchemas"].parse(e);
                            n?.event(`HTTP`, `Event validated:`, t, {
                                type: t.type,
                                valid: !0
                            }), a.next(t);
                        } catch (t) {
                            n?.event(`HTTP`, `Event invalid:`, {
                                json: e,
                                error: String(t)
                            }), a.error(t);
                        }
                    },
                    error: (e)=>{
                        if (e?.name === `AbortError`) {
                            a.next({
                                type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_ERROR,
                                message: e.message || `Request aborted`,
                                code: `abort`,
                                rawEvent: e
                            }), a.complete();
                            return;
                        }
                        return a.error(e);
                    },
                    complete: ()=>a.complete()
                });
            } else s || a.error(Error(`No headers event received before data events`));
        },
        error: (e)=>{
            o.error(e), a.error(e);
        },
        complete: ()=>{
            o.complete();
        }
    }), a.asObservable();
}, G = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    `TextMessageStart`,
    `TextMessageContent`,
    `TextMessageEnd`,
    `ActionExecutionStart`,
    `ActionExecutionArgs`,
    `ActionExecutionEnd`,
    `ActionExecutionResult`,
    `AgentStateMessage`,
    `MetaEvent`,
    `RunStarted`,
    `RunFinished`,
    `RunError`,
    `NodeStarted`,
    `NodeFinished`
]), oe = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    `LangGraphInterruptEvent`,
    `PredictState`,
    `Exit`
]), se = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(G.enum.TextMessageStart),
    messageId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    parentMessageId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    role: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
}), ce = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(G.enum.TextMessageContent),
    messageId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    content: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
}), le = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(G.enum.TextMessageEnd),
    messageId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
}), ue = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(G.enum.ActionExecutionStart),
    actionExecutionId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    actionName: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    parentMessageId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
}), de = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(G.enum.ActionExecutionArgs),
    actionExecutionId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    args: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
}), fe = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(G.enum.ActionExecutionEnd),
    actionExecutionId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
}), pe = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(G.enum.ActionExecutionResult),
    actionName: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    actionExecutionId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    result: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
}), me = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(G.enum.AgentStateMessage),
    threadId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    agentName: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    nodeName: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    runId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    active: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    role: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    state: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    running: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean()
}), he = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(G.enum.MetaEvent),
    name: oe,
    value: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()
}), ge = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(G.enum.RunError),
    message: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    code: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].discriminatedUnion(`type`, [
    se,
    ce,
    le,
    ue,
    de,
    fe,
    pe,
    me,
    he,
    ge
]), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    role: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    content: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    parentMessageId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
}), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    arguments: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any(),
    parentMessageId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
}), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    result: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any(),
    actionExecutionId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    actionName: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const _e = (e)=>{
    if (typeof e == `string`) return e;
    if (!Array.isArray(e)) return;
    let t = e.filter((e)=>e.type === `text`).map((e)=>e.text).filter((e)=>e.length > 0);
    if (t.length !== 0) return t.join(`
`);
}, K = (e, t, n)=>(r)=>{
        let o = {}, s = !0, c = !0, l = ``, u = null, d = null, f = [], p = {}, m = (e)=>{
            typeof e == `object` && e && (`messages` in e && delete e.messages, o = e);
        };
        return r.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$mergeMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeMap"])((r)=>{
            switch(r.type){
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_START:
                    {
                        let e = r;
                        return [
                            {
                                type: G.enum.TextMessageStart,
                                messageId: e.messageId,
                                role: e.role
                            }
                        ];
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_CONTENT:
                    {
                        let e = r;
                        return [
                            {
                                type: G.enum.TextMessageContent,
                                messageId: e.messageId,
                                content: e.delta
                            }
                        ];
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_END:
                    {
                        let e = r;
                        return [
                            {
                                type: G.enum.TextMessageEnd,
                                messageId: e.messageId
                            }
                        ];
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_START:
                    {
                        let e = r;
                        return f.push({
                            id: e.toolCallId,
                            type: `function`,
                            function: {
                                name: e.toolCallName,
                                arguments: ``
                            }
                        }), c = !0, p[e.toolCallId] = e.toolCallName, [
                            {
                                type: G.enum.ActionExecutionStart,
                                actionExecutionId: e.toolCallId,
                                actionName: e.toolCallName,
                                parentMessageId: e.parentMessageId
                            }
                        ];
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_ARGS:
                    {
                        let i = r, a = f.find((e)=>e.id === i.toolCallId);
                        if (!a) return console.warn(`TOOL_CALL_ARGS: No tool call found with ID '${i.toolCallId}'`), [];
                        a.function.arguments += i.delta;
                        let u = !1;
                        if (d) {
                            let e = d.find((e)=>e.tool == a.function.name);
                            if (e) try {
                                let t = JSON.parse((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$untruncate$2d$json$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(a.function.arguments));
                                e.tool_argument && e.tool_argument in t ? (m({
                                    ...o,
                                    [e.state_key]: t[e.tool_argument]
                                }), u = !0) : e.tool_argument || (m({
                                    ...o,
                                    [e.state_key]: t
                                }), u = !0);
                            } catch  {}
                        }
                        return [
                            {
                                type: G.enum.ActionExecutionArgs,
                                actionExecutionId: i.toolCallId,
                                args: i.delta
                            },
                            ...u ? [
                                {
                                    type: G.enum.AgentStateMessage,
                                    threadId: e,
                                    agentName: n,
                                    nodeName: l,
                                    runId: t,
                                    running: s,
                                    role: `assistant`,
                                    state: JSON.stringify(o),
                                    active: c
                                }
                            ] : []
                        ];
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_END:
                    {
                        let e = r;
                        return [
                            {
                                type: G.enum.ActionExecutionEnd,
                                actionExecutionId: e.toolCallId
                            }
                        ];
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_RESULT:
                    {
                        let e = r;
                        return [
                            {
                                type: G.enum.ActionExecutionResult,
                                actionExecutionId: e.toolCallId,
                                result: e.content,
                                actionName: p[e.toolCallId] || `unknown`
                            }
                        ];
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RAW:
                    return [];
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].CUSTOM:
                    {
                        let e = r;
                        switch(e.name){
                            case `Exit`:
                                s = !1;
                                break;
                            case `PredictState`:
                                d = e.value;
                                break;
                        }
                        return [
                            {
                                type: G.enum.MetaEvent,
                                name: e.name,
                                value: e.value
                            }
                        ];
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STATE_SNAPSHOT:
                    return m(r.snapshot), [
                        {
                            type: G.enum.AgentStateMessage,
                            threadId: e,
                            agentName: n,
                            nodeName: l,
                            runId: t,
                            running: s,
                            role: `assistant`,
                            state: JSON.stringify(o),
                            active: c
                        }
                    ];
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STATE_DELTA:
                    {
                        let i = r, u = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$fast$2d$json$2d$patch$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].applyPatch(o, i.delta, !0, !1);
                        return u ? (m(u.newDocument), [
                            {
                                type: G.enum.AgentStateMessage,
                                threadId: e,
                                agentName: n,
                                nodeName: l,
                                runId: t,
                                running: s,
                                role: `assistant`,
                                state: JSON.stringify(o),
                                active: c
                            }
                        ]) : [];
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].MESSAGES_SNAPSHOT:
                    return u = r.messages, [
                        {
                            type: G.enum.AgentStateMessage,
                            threadId: e,
                            agentName: n,
                            nodeName: l,
                            runId: t,
                            running: s,
                            role: `assistant`,
                            state: JSON.stringify({
                                ...o,
                                ...u ? {
                                    messages: u
                                } : {}
                            }),
                            active: !0
                        }
                    ];
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_STARTED:
                    return [];
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_FINISHED:
                    return u && (o.messages = u), Object.keys(o).length === 0 ? [] : [
                        {
                            type: G.enum.AgentStateMessage,
                            threadId: e,
                            agentName: n,
                            nodeName: l,
                            runId: t,
                            running: s,
                            role: `assistant`,
                            state: JSON.stringify({
                                ...o,
                                ...u ? {
                                    messages: ve(u)
                                } : {}
                            }),
                            active: !1
                        }
                    ];
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_ERROR:
                    {
                        let e = r;
                        return [
                            {
                                type: G.enum.RunError,
                                message: e.message,
                                code: e.code
                            }
                        ];
                    }
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STEP_STARTED:
                    return l = r.stepName, f = [], d = null, [
                        {
                            type: G.enum.AgentStateMessage,
                            threadId: e,
                            agentName: n,
                            nodeName: l,
                            runId: t,
                            running: s,
                            role: `assistant`,
                            state: JSON.stringify(o),
                            active: !0
                        }
                    ];
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STEP_FINISHED:
                    return f = [], d = null, [
                        {
                            type: G.enum.AgentStateMessage,
                            threadId: e,
                            agentName: n,
                            nodeName: l,
                            runId: t,
                            running: s,
                            role: `assistant`,
                            state: JSON.stringify(o),
                            active: !1
                        }
                    ];
                default:
                    return [];
            }
        }));
    };
function ve(e) {
    let t = [];
    for (let n of e)if (n.role === `assistant` || n.role === `user` || n.role === `system`) {
        let e = _e(n.content);
        if (e) {
            let r = {
                id: n.id,
                role: n.role,
                content: e
            };
            t.push(r);
        }
        if (n.role === `assistant` && n.toolCalls && n.toolCalls.length > 0) for (let e of n.toolCalls){
            let r = {
                id: e.id,
                name: e.function.name,
                arguments: JSON.parse(e.function.arguments),
                parentMessageId: n.id
            };
            t.push(r);
        }
    } else if (n.role === `tool`) {
        let r = `unknown`;
        for (let t of e)if (t.role === `assistant` && t.toolCalls?.length) {
            for (let e of t.toolCalls)if (e.id === n.toolCallId) {
                r = e.function.name;
                break;
            }
        }
        let i = {
            id: n.id,
            result: n.content,
            actionExecutionId: n.toolCallId,
            actionName: r
        };
        t.push(i);
    }
    return t;
}
const q = (e)=>(t)=>{
        let n = F(e), r, a, o, s, c = ()=>{
            if (!r || s !== `text`) throw Error(`No text message to close`);
            let e = {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_END,
                messageId: r.messageId
            };
            return s = void 0, r = void 0, n?.event(`TRANSFORM`, `TEXT_MESSAGE_END`, e, {
                messageId: e.messageId
            }), e;
        }, l = ()=>{
            if (!a || s !== `tool`) throw Error(`No tool call to close`);
            let e = {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_END,
                toolCallId: a.toolCallId
            };
            return s = void 0, a = void 0, n?.event(`TRANSFORM`, `TOOL_CALL_END`, e, {
                toolCallId: e.toolCallId
            }), e;
        }, u = ()=>{
            if (!o || s !== `reasoning`) throw Error(`No reasoning message to close`);
            let e = {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_END,
                messageId: o.messageId
            };
            return s = void 0, o = void 0, n?.event(`TRANSFORM`, `REASONING_MESSAGE_END`, e, {
                messageId: e.messageId
            }), e;
        }, f = ()=>s === `text` ? [
                c()
            ] : s === `tool` ? [
                l()
            ] : s === `reasoning` ? [
                u()
            ] : [];
        return t.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$mergeMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeMap"])((e)=>{
            switch(e.type){
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_START:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_CONTENT:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_END:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_START:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_ARGS:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_END:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_RESULT:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STATE_SNAPSHOT:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STATE_DELTA:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].MESSAGES_SNAPSHOT:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].CUSTOM:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_STARTED:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_FINISHED:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_ERROR:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STEP_STARTED:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STEP_FINISHED:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].THINKING_START:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].THINKING_END:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].THINKING_TEXT_MESSAGE_START:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].THINKING_TEXT_MESSAGE_CONTENT:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].THINKING_TEXT_MESSAGE_END:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_START:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_START:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_CONTENT:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_END:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_END:
                    return [
                        ...f(),
                        e
                    ];
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RAW:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].ACTIVITY_SNAPSHOT:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].ACTIVITY_DELTA:
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_ENCRYPTED_VALUE:
                    return [
                        e
                    ];
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_CHUNK:
                    let t = e, c = [];
                    if ((s !== `text` || t.messageId !== void 0 && t.messageId !== r?.messageId) && c.push(...f()), s !== `text`) {
                        if (t.messageId === void 0) throw Error(`First TEXT_MESSAGE_CHUNK must have a messageId`);
                        r = {
                            messageId: t.messageId,
                            name: t.name
                        }, s = `text`;
                        let e = {
                            type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_START,
                            messageId: t.messageId,
                            role: t.role || `assistant`,
                            ...t.name !== void 0 && {
                                name: t.name
                            }
                        };
                        c.push(e), n?.event(`TRANSFORM`, `TEXT_MESSAGE_START`, e, {
                            messageId: t.messageId
                        });
                    }
                    if (t.delta !== void 0) {
                        let e = {
                            type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_CONTENT,
                            messageId: r.messageId,
                            delta: t.delta
                        };
                        c.push(e), n?.event(`TRANSFORM`, `TEXT_MESSAGE_CONTENT`, e, {
                            messageId: r.messageId
                        });
                    }
                    return c;
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_CHUNK:
                    let l = e, u = [];
                    if ((s !== `tool` || l.toolCallId !== void 0 && l.toolCallId !== a?.toolCallId) && u.push(...f()), s !== `tool`) {
                        if (l.toolCallId === void 0) throw Error(`First TOOL_CALL_CHUNK must have a toolCallId`);
                        if (l.toolCallName === void 0) throw Error(`First TOOL_CALL_CHUNK must have a toolCallName`);
                        a = {
                            toolCallId: l.toolCallId,
                            toolCallName: l.toolCallName,
                            parentMessageId: l.parentMessageId
                        }, s = `tool`;
                        let e = {
                            type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_START,
                            toolCallId: l.toolCallId,
                            toolCallName: l.toolCallName,
                            parentMessageId: l.parentMessageId
                        };
                        u.push(e), n?.event(`TRANSFORM`, `TOOL_CALL_START`, e, {
                            toolCallId: l.toolCallId,
                            toolCallName: l.toolCallName
                        });
                    }
                    if (l.delta !== void 0) {
                        let e = {
                            type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_ARGS,
                            toolCallId: a.toolCallId,
                            delta: l.delta
                        };
                        u.push(e), n?.event(`TRANSFORM`, `TOOL_CALL_ARGS`, e, {
                            toolCallId: a.toolCallId
                        });
                    }
                    return u;
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_CHUNK:
                    let d = e, p = [];
                    if ((s !== `reasoning` || d.messageId && d.messageId !== o?.messageId) && p.push(...f()), s !== `reasoning`) {
                        if (d.messageId === void 0) throw Error(`First REASONING_MESSAGE_CHUNK must have a messageId`);
                        o = {
                            messageId: d.messageId
                        }, s = `reasoning`;
                        let e = {
                            type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_START,
                            messageId: d.messageId
                        };
                        p.push(e), n?.event(`TRANSFORM`, `REASONING_MESSAGE_START`, e, {
                            messageId: d.messageId
                        });
                    }
                    if (d.delta !== void 0) {
                        let e = {
                            type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_CONTENT,
                            messageId: o.messageId,
                            delta: d.delta
                        };
                        p.push(e), n?.event(`TRANSFORM`, `REASONING_MESSAGE_CONTENT`, e, {
                            messageId: o.messageId
                        });
                    }
                    return p;
            }
            return e.type, [];
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$finalize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["finalize"])(()=>{
            f();
        }));
    };
function ye(e) {
    return e.outcome;
}
function J(e, t = new Date) {
    return e.expiresAt === void 0 ? !1 : new Date(e.expiresAt) <= t;
}
function be(e, t) {
    let n = new Set(e.map((e)=>e.id)), r = new Set(Object.keys(t)), i = [
        ...n
    ].filter((e)=>!r.has(e));
    if (i.length > 0) throw Error(`buildResumeArray: missing responses for open interrupts: ${i.join(`, `)}`);
    let a = [
        ...r
    ].filter((e)=>!n.has(e));
    if (a.length > 0) throw Error(`buildResumeArray: responses reference unknown interrupt ids: ${a.join(`, `)}`);
    return e.map((e)=>{
        let n = t[e.id];
        if (n.status === `resolved`) {
            let t = {
                interruptId: e.id,
                status: `resolved`
            };
            return n.payload !== void 0 && (t.payload = n.payload), t;
        }
        return {
            interruptId: e.id,
            status: `cancelled`
        };
    });
}
var Y = class {
    runNext(e, t) {
        return t.run(e).pipe(q(!1));
    }
    runNextWithState(e, t) {
        let n = O(e.messages || []), r = O(e.state || {}), i = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$ReplaySubject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReplaySubject"];
        return R(e, i, t, []).subscribe((e)=>{
            e.messages !== void 0 && (n = e.messages), e.state !== void 0 && (r = e.state);
        }), this.runNext(e, t).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$concatMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatMap"])(async (e)=>(i.next(e), await new Promise((e)=>setTimeout(e, 0)), {
                event: e,
                messages: O(n),
                state: O(r)
            })));
    }
}, X = class extends Y {
    constructor(e){
        super(), this.fn = e;
    }
    run(e, t) {
        return this.fn(e, t);
    }
}, xe = class extends Y {
    constructor(e){
        if (super(), this.blockedToolCallIds = new Set, e.allowedToolCalls && e.disallowedToolCalls) throw Error(`Cannot specify both allowedToolCalls and disallowedToolCalls`);
        if (!e.allowedToolCalls && !e.disallowedToolCalls) throw Error(`Must specify either allowedToolCalls or disallowedToolCalls`);
        e.allowedToolCalls ? this.allowedTools = new Set(e.allowedToolCalls) : e.disallowedToolCalls && (this.disallowedTools = new Set(e.disallowedToolCalls));
    }
    run(e, t) {
        return this.runNext(e, t).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])((e)=>{
            if (e.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_START) {
                let t = e;
                return this.shouldFilterTool(t.toolCallName) ? (this.blockedToolCallIds.add(t.toolCallId), !1) : !0;
            }
            if (e.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_ARGS) {
                let t = e;
                return !this.blockedToolCallIds.has(t.toolCallId);
            }
            if (e.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_END) {
                let t = e;
                return !this.blockedToolCallIds.has(t.toolCallId);
            }
            if (e.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_RESULT) {
                let t = e;
                return this.blockedToolCallIds.has(t.toolCallId) ? (this.blockedToolCallIds.delete(t.toolCallId), !1) : !0;
            }
            return !0;
        }));
    }
    shouldFilterTool(e) {
        return this.allowedTools ? !this.allowedTools.has(e) : this.disallowedTools ? this.disallowedTools.has(e) : !1;
    }
};
function Se(e) {
    let t = e.content;
    if (Array.isArray(t)) {
        let n = t.filter((e)=>typeof e == `object` && !!e && `type` in e && e.type === `text` && typeof e.text == `string`).map((e)=>e.text).join(``);
        return {
            ...e,
            content: n
        };
    }
    return typeof t == `string` ? e : {
        ...e,
        content: ``
    };
}
var Z = class extends Y {
    run(e, t) {
        let { parentRunId: n, ...r } = e, i = {
            ...r,
            messages: r.messages.map(Se)
        };
        return this.runNext(i, t);
    }
};
const Q = `THINKING_START`, Ce = `THINKING_END`, we = `THINKING_TEXT_MESSAGE_START`, Te = `THINKING_TEXT_MESSAGE_CONTENT`, Ee = `THINKING_TEXT_MESSAGE_END`;
var De = class extends Y {
    constructor(...e){
        super(...e), this.currentReasoningId = null, this.currentMessageId = null;
    }
    warnAboutTransformation(e, t) {
        typeof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] < `u` && __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env !== void 0 && __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.SUPPRESS_TRANSFORMATION_WARNINGS || console.warn(`AG-UI is converting ${e} to ${t}. To remove this warning, upgrade your AG-UI integration package (e.g. @ag-ui/langgraph). To surpress it, set SUPPRESS_TRANSFORMATION_WARNINGS=true in your .env file.`);
    }
    run(e, t) {
        return this.currentReasoningId = null, this.currentMessageId = null, this.runNext(e, t).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((e)=>this.transformEvent(e)));
    }
    transformEvent(e) {
        switch(e.type){
            case Q:
                {
                    this.currentReasoningId = k();
                    let { title: t, ...n } = e;
                    return this.warnAboutTransformation(Q, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_START), {
                        ...n,
                        type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_START,
                        messageId: this.currentReasoningId
                    };
                }
            case we:
                return this.currentMessageId = k(), this.warnAboutTransformation(we, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_START), {
                    ...e,
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_START,
                    messageId: this.currentMessageId,
                    role: `assistant`
                };
            case Te:
                {
                    let { delta: t, ...n } = e;
                    return this.warnAboutTransformation(Te, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_CONTENT), {
                        ...n,
                        type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_CONTENT,
                        messageId: this.currentMessageId ?? k(),
                        delta: t
                    };
                }
            case Ee:
                {
                    let t = this.currentMessageId ?? k();
                    return this.warnAboutTransformation(Ee, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_END), {
                        ...e,
                        type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_MESSAGE_END,
                        messageId: t
                    };
                }
            case Ce:
                {
                    let t = this.currentReasoningId ?? k();
                    return this.warnAboutTransformation(Ce, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_END), {
                        ...e,
                        type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].REASONING_END,
                        messageId: t
                    };
                }
            default:
                return e;
        }
    }
};
function Oe(e) {
    return e.startsWith(`image/`) ? `image` : e.startsWith(`audio/`) ? `audio` : e.startsWith(`video/`) ? `video` : `document`;
}
function ke(e) {
    return typeof e == `object` && !!e && `type` in e && e.type === `binary` && `mimeType` in e && typeof e.mimeType == `string`;
}
function Ae(e) {
    let t = Oe(e.mimeType);
    return e.data ? {
        type: t,
        source: {
            type: `data`,
            value: e.data,
            mimeType: e.mimeType
        },
        ...e.filename ? {
            metadata: {
                filename: e.filename
            }
        } : {}
    } : e.url ? {
        type: t,
        source: {
            type: `url`,
            value: e.url,
            mimeType: e.mimeType
        },
        ...e.filename ? {
            metadata: {
                filename: e.filename
            }
        } : {}
    } : e;
}
function je(e) {
    let t = e.content;
    if (!Array.isArray(t)) return e;
    let n = t.map((e)=>ke(e) ? Ae(e) : e);
    return {
        ...e,
        content: n
    };
}
var Me = class extends Y {
    run(e, t) {
        let n = {
            ...e,
            messages: e.messages.map(je)
        };
        return this.runNext(n, t);
    }
}, Ne = `0.0.57`, Pe = class {
    get maxVersion() {
        return Ne;
    }
    get debug() {
        return this._debug;
    }
    set debug(e) {
        this._debug = P(e), this._debugLogger = L(this._debug);
    }
    get debugLogger() {
        return this._debugLogger;
    }
    set debugLogger(e) {
        typeof e == `boolean` ? this._debugLogger = e ? L(P(!0)) : void 0 : this._debugLogger = e;
    }
    constructor({ agentId: t, description: n, threadId: r, initialMessages: i, initialState: a, debug: o } = {}){
        this.subscribers = [], this.isRunning = !1, this.pendingInterrupts = [], this.middlewares = [], this.agentId = t, this.description = n ?? ``, this.threadId = r ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(), this.messages = O(i ?? []), this.state = O(a ?? {}), this._debug = P(o), this._debugLogger = L(this._debug), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$compare$2d$versions$2f$lib$2f$esm$2f$compareVersions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compareVersions"])(this.maxVersion, `0.0.39`) <= 0 && this.middlewares.unshift(new Z), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$compare$2d$versions$2f$lib$2f$esm$2f$compareVersions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compareVersions"])(this.maxVersion, `0.0.45`) <= 0 && this.middlewares.unshift(new De), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$compare$2d$versions$2f$lib$2f$esm$2f$compareVersions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compareVersions"])(this.maxVersion, `0.0.47`) <= 0 && this.middlewares.unshift(new Me);
    }
    subscribe(e) {
        return this.subscribers.push(e), {
            unsubscribe: ()=>{
                this.subscribers = this.subscribers.filter((t)=>t !== e);
            }
        };
    }
    use(...e) {
        let t = e.map((e)=>typeof e == `function` ? new X(e) : e);
        return this.middlewares.push(...t), this;
    }
    async runAgent(t, n) {
        try {
            this.isRunning = !0, this.agentId = this.agentId ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
            let r = this.prepareRunAgentInput(t);
            this.debugLogger?.lifecycle(`LIFECYCLE`, `Run started:`, {
                agentId: this.agentId,
                threadId: this.threadId
            });
            let i, a = new Set(this.messages.map((e)=>e.id)), o = [
                {
                    onRunFinishedEvent: (e)=>{
                        e.outcome === `success` && (i = e.result);
                    }
                },
                ...this.subscribers,
                n ?? {}
            ];
            await this.onInitialize(r, o), this.activeRunDetach$ = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Subject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subject"];
            let s;
            this.activeRunCompletionPromise = new Promise((e)=>{
                s = e;
            }), await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$lastValueFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lastValueFrom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$util$2f$pipe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pipe"])(()=>this.middlewares.length === 0 ? this.run(r) : this.middlewares.reduceRight((e, t)=>({
                        run: (n)=>t.run(n, e),
                        get messages () {
                            return e.messages;
                        },
                        get state () {
                            return e.state;
                        }
                    }), this).run(r), q(this.debugLogger), z(this.debugLogger), (e)=>e.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$takeUntil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takeUntil"])(this.activeRunDetach$)), (e)=>this.apply(r, e, o), (e)=>this.processApplyEvents(r, e, o), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catchError"])((e)=>(this.debugLogger?.lifecycle(`LIFECYCLE`, `Run errored:`, {
                    agentId: this.agentId,
                    error: e instanceof Error ? e.message : String(e)
                }), this.isRunning = !1, this.onError(r, e, o))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$finalize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["finalize"])(()=>{
                this.debugLogger?.lifecycle(`LIFECYCLE`, `Run finished:`, {
                    agentId: this.agentId,
                    threadId: this.threadId
                }), this.isRunning = !1, this.onFinalize(r, o), s?.(), s = void 0, this.activeRunCompletionPromise = void 0, this.activeRunDetach$ = void 0;
            }))((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(null)));
            let c = O(this.messages).filter((e)=>!a.has(e.id));
            return {
                result: i,
                newMessages: c
            };
        } finally{
            this.isRunning = !1;
        }
    }
    connect(e) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIConnectNotImplementedError"];
    }
    async connectAgent(n, r) {
        try {
            this.isRunning = !0, this.agentId = this.agentId ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
            let i = this.prepareRunAgentInput(n), a, s = new Set(this.messages.map((e)=>e.id)), c = [
                {
                    onRunFinishedEvent: (e)=>{
                        e.outcome === `success` && (a = e.result);
                    }
                },
                ...this.subscribers,
                r ?? {}
            ];
            await this.onInitialize(i, c), this.activeRunDetach$ = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Subject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subject"];
            let d;
            this.activeRunCompletionPromise = new Promise((e)=>{
                d = e;
            }), await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$lastValueFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lastValueFrom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$util$2f$pipe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pipe"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>this.connect(i)), q(this.debugLogger), z(this.debugLogger), (e)=>e.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$takeUntil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takeUntil"])(this.activeRunDetach$)), (e)=>this.apply(i, e, c), (e)=>this.processApplyEvents(i, e, c), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catchError"])((e)=>(this.isRunning = !1, e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIConnectNotImplementedError"] ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$empty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY"] : this.onError(i, e, c))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$finalize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["finalize"])(()=>{
                this.isRunning = !1, this.onFinalize(i, c), d?.(), d = void 0, this.activeRunCompletionPromise = void 0, this.activeRunDetach$ = void 0;
            }))((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(null)), {
                defaultValue: void 0
            });
            let f = O(this.messages).filter((e)=>!s.has(e.id));
            return {
                result: a,
                newMessages: f
            };
        } finally{
            this.isRunning = !1;
        }
    }
    abortRun() {}
    async detachActiveRun() {
        if (!this.activeRunDetach$) return;
        let e = this.activeRunCompletionPromise ?? Promise.resolve();
        this.activeRunDetach$.next(), this.activeRunDetach$?.complete(), await e;
    }
    apply(e, t, n) {
        return R(e, t, this, n, this.debugLogger);
    }
    processApplyEvents(e, t, n) {
        return t.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$tap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tap"])((t)=>{
            t.messages && (this.messages = t.messages, n.forEach((t)=>{
                t.onMessagesChanged?.({
                    messages: this.messages,
                    state: this.state,
                    agent: this,
                    input: e
                });
            })), t.state && (this.state = t.state, n.forEach((t)=>{
                t.onStateChanged?.({
                    state: this.state,
                    messages: this.messages,
                    agent: this,
                    input: e
                });
            }));
        }));
    }
    prepareRunAgentInput(t) {
        let n = O(this.messages).filter((e)=>e.role !== `activity`);
        return {
            threadId: this.threadId,
            runId: t?.runId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
            tools: O(t?.tools ?? []),
            context: O(t?.context ?? []),
            forwardedProps: O(t?.forwardedProps ?? {}),
            state: O(this.state),
            messages: n,
            ...t?.resume === void 0 ? {} : {
                resume: O(t.resume)
            }
        };
    }
    async onInitialize(e, t) {
        if (this.pendingInterrupts.length > 0) {
            let t = new Set((e.resume ?? []).map((e)=>e.interruptId)), r = this.pendingInterrupts.map((e)=>e.id).filter((e)=>!t.has(e));
            if (r.length > 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Thread has ${r.length} pending interrupt(s) not addressed by resume: ${r.join(`, `)}`);
            for (let e of this.pendingInterrupts)if (J(e)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGUIError"](`Interrupt ${e.id} expired at ${e.expiresAt}`);
        }
        let r = await N(t, this.messages, this.state, (t, n, r)=>t.onRunInitialized?.({
                messages: n,
                state: r,
                agent: this,
                input: e
            }));
        (r.messages !== void 0 || r.state !== void 0) && (r.messages && (this.messages = r.messages, e.messages = r.messages, t.forEach((t)=>{
            t.onMessagesChanged?.({
                messages: this.messages,
                state: this.state,
                agent: this,
                input: e
            });
        })), r.state && (this.state = r.state, e.state = r.state, t.forEach((t)=>{
            t.onStateChanged?.({
                state: this.state,
                messages: this.messages,
                agent: this,
                input: e
            });
        })));
    }
    onError(e, t, n) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$from$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["from"])(N(n, this.messages, this.state, (n, r, i)=>n.onRunFailed?.({
                error: t,
                messages: r,
                state: i,
                agent: this,
                input: e
            }))).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((r)=>{
            let i = r;
            if ((i.messages !== void 0 || i.state !== void 0) && (i.messages !== void 0 && (this.messages = i.messages, n.forEach((t)=>{
                t.onMessagesChanged?.({
                    messages: this.messages,
                    state: this.state,
                    agent: this,
                    input: e
                });
            })), i.state !== void 0 && (this.state = i.state, n.forEach((t)=>{
                t.onStateChanged?.({
                    state: this.state,
                    messages: this.messages,
                    agent: this,
                    input: e
                });
            }))), i.stopPropagation !== !0) {
                let e = String(t);
                if (!(t.name === `AbortError` || t.message === `Fetch is aborted` || t.message === `signal is aborted without reason` || t.message === `component unmounted` || e === `component unmounted`)) throw console.error(`Agent execution failed:`, t), t;
            }
            return {};
        }));
    }
    async onFinalize(e, t) {
        let n = await N(t, this.messages, this.state, (t, n, r)=>t.onRunFinalized?.({
                messages: n,
                state: r,
                agent: this,
                input: e
            }));
        (n.messages !== void 0 || n.state !== void 0) && (n.messages !== void 0 && (this.messages = n.messages, t.forEach((t)=>{
            t.onMessagesChanged?.({
                messages: this.messages,
                state: this.state,
                agent: this,
                input: e
            });
        })), n.state !== void 0 && (this.state = n.state, t.forEach((t)=>{
            t.onStateChanged?.({
                state: this.state,
                messages: this.messages,
                agent: this,
                input: e
            });
        })));
    }
    clone() {
        let e = Object.create(Object.getPrototypeOf(this));
        return e.agentId = this.agentId, e.description = this.description, e.threadId = this.threadId, e.messages = O(this.messages), e.state = O(this.state), e._debug = this._debug, e._debugLogger = this._debugLogger, e.isRunning = this.isRunning, e.subscribers = [
            ...this.subscribers
        ], e.middlewares = [
            ...this.middlewares
        ], e.pendingInterrupts = O(this.pendingInterrupts), e;
    }
    addMessage(e) {
        this.messages.push(e), (async ()=>{
            for (let t of this.subscribers)await t.onNewMessage?.({
                message: e,
                messages: this.messages,
                state: this.state,
                agent: this
            });
            if (e.role === `assistant` && e.toolCalls) for (let t of e.toolCalls)for (let e of this.subscribers)await e.onNewToolCall?.({
                toolCall: t,
                messages: this.messages,
                state: this.state,
                agent: this
            });
            for (let e of this.subscribers)await e.onMessagesChanged?.({
                messages: this.messages,
                state: this.state,
                agent: this
            });
        })();
    }
    addMessages(e) {
        this.messages.push(...e), (async ()=>{
            for (let t of e){
                for (let e of this.subscribers)await e.onNewMessage?.({
                    message: t,
                    messages: this.messages,
                    state: this.state,
                    agent: this
                });
                if (t.role === `assistant` && t.toolCalls) for (let e of t.toolCalls)for (let t of this.subscribers)await t.onNewToolCall?.({
                    toolCall: e,
                    messages: this.messages,
                    state: this.state,
                    agent: this
                });
            }
            for (let e of this.subscribers)await e.onMessagesChanged?.({
                messages: this.messages,
                state: this.state,
                agent: this
            });
        })();
    }
    setMessages(e) {
        this.messages = O(e), (async ()=>{
            for (let e of this.subscribers)await e.onMessagesChanged?.({
                messages: this.messages,
                state: this.state,
                agent: this
            });
        })();
    }
    setState(e) {
        this.state = O(e), (async ()=>{
            for (let e of this.subscribers)await e.onStateChanged?.({
                messages: this.messages,
                state: this.state,
                agent: this
            });
        })();
    }
    legacy_to_be_removed_runAgentBridged(t) {
        this.agentId = this.agentId ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
        let n = this.prepareRunAgentInput(t);
        return (this.middlewares.length === 0 ? this.run(n) : this.middlewares.reduceRight((e, t)=>({
                run: (n)=>t.run(n, e),
                get messages () {
                    return e.messages;
                },
                get state () {
                    return e.state;
                }
            }), this).run(n)).pipe(q(this.debugLogger), z(this.debugLogger), K(this.threadId, n.runId, this.agentId), (e)=>e.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((e)=>(this.debugLogger?.event(`LEGACY`, `Event:`, e, {
                    type: e.type
                }), e))));
    }
}, Fe = class extends Pe {
    requestInit(e) {
        return {
            method: `POST`,
            headers: {
                ...this.headers,
                "Content-Type": `application/json`,
                Accept: `text/event-stream`
            },
            body: JSON.stringify(e),
            signal: this.abortController.signal
        };
    }
    runAgent(e, t) {
        return this.abortController = e?.abortController ?? new AbortController, super.runAgent(e, t);
    }
    abortRun() {
        this.abortController.abort(), super.abortRun();
    }
    constructor(e){
        super(e), this.abortController = new AbortController, this.url = e.url, this.headers = O(e.headers ?? {}), this.fetch = e.fetch ?? ((e, t)=>fetch(e, t));
    }
    run(e) {
        return W(V(()=>this.fetch(this.url, this.requestInit(e))), this.debugLogger);
    }
    clone() {
        let e = super.clone();
        e.url = this.url, e.headers = O(this.headers ?? {}), e.fetch = this.fetch;
        let t = new AbortController, n = this.abortController.signal;
        return n.aborted && t.abort(n.reason), e.abortController = t, e;
    }
};
function Ie(e) {
    let t = [], n = new Map, r = new Map, a = [];
    for (let o of e)if (o.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_START) {
        let e = o, t = e.messageId;
        n.has(t) || n.set(t, {
            contents: [],
            otherEvents: []
        });
        let r = n.get(t);
        r.start = e;
    } else if (o.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_CONTENT) {
        let e = o, t = e.messageId;
        n.has(t) || n.set(t, {
            contents: [],
            otherEvents: []
        }), n.get(t).contents.push(e);
    } else if (o.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_END) {
        let e = o, r = e.messageId;
        n.has(r) || n.set(r, {
            contents: [],
            otherEvents: []
        });
        let i = n.get(r);
        i.end = e, Le(r, i, t), n.delete(r);
    } else if (o.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_START) {
        let e = o, t = e.toolCallId;
        r.has(t) || r.set(t, {
            args: [],
            otherEvents: []
        });
        let n = r.get(t);
        n.start = e;
    } else if (o.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_ARGS) {
        let e = o, t = e.toolCallId;
        r.has(t) || r.set(t, {
            args: [],
            otherEvents: []
        }), r.get(t).args.push(e);
    } else if (o.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_END) {
        let e = o, n = e.toolCallId;
        r.has(n) || r.set(n, {
            args: [],
            otherEvents: []
        });
        let i = r.get(n);
        i.end = e, Re(n, i, t), r.delete(n);
    } else if (o.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_STARTED) $(a, t), a = [], t.push(o);
    else if (o.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_FINISHED || o.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_ERROR) $(a, t), a = [], t.push(o);
    else if (o.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STATE_SNAPSHOT || o.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STATE_DELTA) a.push(o);
    else {
        let e = !1;
        for (let [t, r] of n)if (r.start && !r.end) {
            r.otherEvents.push(o), e = !0;
            break;
        }
        if (!e) {
            for (let [t, n] of r)if (n.start && !n.end) {
                n.otherEvents.push(o), e = !0;
                break;
            }
        }
        e || t.push(o);
    }
    for (let [e, r] of n)Le(e, r, t);
    for (let [e, n] of r)Re(e, n, t);
    return $(a, t), t;
}
function Le(e, t, n) {
    if (t.start && n.push(t.start), t.contents.length > 0) {
        let r = t.contents.map((e)=>e.delta).join(``), a = {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_CONTENT,
            messageId: e,
            delta: r
        };
        n.push(a);
    }
    t.end && n.push(t.end);
    for (let e of t.otherEvents)n.push(e);
}
function Re(e, t, n) {
    if (t.start && n.push(t.start), t.args.length > 0) {
        let r = t.args.map((e)=>e.delta).join(``), a = {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_ARGS,
            toolCallId: e,
            delta: r
        };
        n.push(a);
    }
    t.end && n.push(t.end);
    for (let e of t.otherEvents)n.push(e);
}
function $(e, t) {
    if (e.length === 0) return;
    let n = {};
    for (let t of e)n = t.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STATE_SNAPSHOT ? O(t.snapshot) : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$fast$2d$json$2d$patch$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].applyPatch(n, O(t.delta), !0, !1).newDocument;
    let r = {
        type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].STATE_SNAPSHOT,
        snapshot: n
    };
    t.push(r);
}
;
}),
]);

//# sourceMappingURL=19xk_%40ag-ui_client_dist_index_mjs_1sys5i7._.js.map