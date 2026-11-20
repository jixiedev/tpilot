(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-6EIED4P4.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EventModelingModule",
    ()=>EventModelingModule,
    "createEventModelingServices",
    ()=>createEventModelingServices
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-FOHPRMQF.mjs [app-client] (ecmascript)");
;
// src/language/eventmodeling/tokenBuilder.ts
var EventModelingTokenBuilder = class extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AbstractMermaidTokenBuilder"] {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "EventModelingTokenBuilder");
    }
    constructor(){
        super([
            "eventmodeling"
        ]);
    }
};
// src/language/eventmodeling/event-modeling-validator.ts
var COMMAND_TYPES = /* @__PURE__ */ new Set([
    "cmd",
    "command"
]);
var EVENT_TYPES = /* @__PURE__ */ new Set([
    "evt",
    "event"
]);
var READMODEL_TYPES = /* @__PURE__ */ new Set([
    "rmo",
    "readmodel"
]);
var PROCESSOR_TYPES = /* @__PURE__ */ new Set([
    "pcr",
    "processor"
]);
var UI_TYPES = /* @__PURE__ */ new Set([
    "ui"
]);
function registerValidationChecks(services) {
    const validator = services.validation.EventModelingValidator;
    const registry = services.validation.ValidationRegistry;
    if (registry) {
        const checks = {
            EmTimeFrame: validator.checkSourceFrameTypes.bind(validator),
            EmResetFrame: validator.checkSourceFrameTypes.bind(validator)
        };
        registry.register(checks, validator);
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(registerValidationChecks, "registerValidationChecks");
var EventModelingValidator = class {
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "EventModelingValidator");
    }
    checkSourceFrameTypes(frame, accept) {
        if (frame.sourceFrames.length === 0) {
            return;
        }
        if (COMMAND_TYPES.has(frame.modelEntityType)) {
            this.validateSources(frame, /* @__PURE__ */ new Set([
                ...UI_TYPES,
                ...PROCESSOR_TYPES
            ]), "command", "ui or processor", accept);
        } else if (EVENT_TYPES.has(frame.modelEntityType)) {
            this.validateSources(frame, COMMAND_TYPES, "event", "command", accept);
        } else if (READMODEL_TYPES.has(frame.modelEntityType)) {
            this.validateSources(frame, EVENT_TYPES, "read model", "event", accept);
        } else if (PROCESSOR_TYPES.has(frame.modelEntityType)) {
            this.validateSources(frame, READMODEL_TYPES, "processor", "read model", accept);
        } else if (UI_TYPES.has(frame.modelEntityType)) {
            this.validateSources(frame, READMODEL_TYPES, "ui", "read model", accept);
        }
    }
    validateSources(frame, allowedSourceTypes, targetLabel, expectedSourceLabel, accept) {
        for (const sourceRef of frame.sourceFrames){
            const source = sourceRef.ref;
            if (source !== void 0 && !allowedSourceTypes.has(source.modelEntityType)) {
                accept("error", `A ${targetLabel} can only receive input from a ${expectedSourceLabel}, not from '${source.modelEntityType}'.`, {
                    node: frame,
                    property: "sourceFrames"
                });
            }
        }
    }
};
// src/language/eventmodeling/module.ts
var EventModelingModule = {
    parser: {
        TokenBuilder: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>new EventModelingTokenBuilder(), "TokenBuilder"),
        ValueConverter: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommonValueConverter"](), "ValueConverter")
    },
    validation: {
        EventModelingValidator: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>new EventModelingValidator(), "EventModelingValidator")
    }
};
function createEventModelingServices(context = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyFileSystem"]) {
    const shared = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inject"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultSharedCoreModule"])(context), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MermaidGeneratedSharedModule"]);
    const EventModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inject"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultCoreModule"])({
        shared
    }), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventModelingGeneratedModule"], EventModelingModule);
    shared.ServiceRegistry.register(EventModel);
    registerValidationChecks(EventModel);
    return {
        shared,
        EventModel
    };
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(createEventModelingServices, "createEventModelingServices");
;
}),
"[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/eventmodeling-NTZA5JFV.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EventModelingModule",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$6EIED4P4$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventModelingModule"],
    "createEventModelingServices",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$6EIED4P4$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEventModelingServices"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$eventmodeling$2d$NTZA5JFV$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/eventmodeling-NTZA5JFV.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$6EIED4P4$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-6EIED4P4.mjs [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/eventmodeling-NTZA5JFV.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$6EIED4P4$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-6EIED4P4.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$mermaid$2d$js$2f$parser$2f$dist$2f$chunks$2f$mermaid$2d$parser$2e$core$2f$chunk$2d$FOHPRMQF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-FOHPRMQF.mjs [app-client] (ecmascript)");
;
;
;
}),
]);

//# sourceMappingURL=19xk_%40mermaid-js_parser_dist_chunks_mermaid-parser_core_1gduaa9._.js.map