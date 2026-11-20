(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/@copilotkit/core/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AgentRegistry",
    ()=>AgentRegistry,
    "AgentThreadLockedError",
    ()=>AgentThreadLockedError,
    "ContextStore",
    ()=>ContextStore,
    "CopilotKitCore",
    ()=>CopilotKitCore,
    "CopilotKitCoreErrorCode",
    ()=>CopilotKitCoreErrorCode,
    "CopilotKitCoreRuntimeConnectionStatus",
    ()=>CopilotKitCoreRuntimeConnectionStatus,
    "INSPECTOR_THREAD_BRIDGE_PLUGIN_ID",
    ()=>INSPECTOR_THREAD_BRIDGE_PLUGIN_ID,
    "IntelligenceAgent",
    ()=>IntelligenceAgent,
    "MEMORY_ERROR_REGISTRY",
    ()=>MEMORY_ERROR_REGISTRY,
    "MemoryError",
    ()=>MemoryError,
    "ProxiedCopilotRuntimeAgent",
    ()=>ProxiedCopilotRuntimeAgent,
    "RunHandler",
    ()=>RunHandler,
    "StateManager",
    ()=>StateManager,
    "SuggestionEngine",
    ()=>SuggestionEngine,
    "ToolCallStatus",
    ()=>ToolCallStatus,
    "completePartialMarkdown",
    ()=>completePartialMarkdown,
    "createActionGroup",
    ()=>createActionGroup,
    "createEffect",
    ()=>createEffect,
    "createInspectorThreadRequestId",
    ()=>createInspectorThreadRequestId,
    "createReducer",
    ()=>createReducer,
    "createSelector",
    ()=>createSelector,
    "createStore",
    ()=>createStore,
    "emitInspectorActiveThread",
    ()=>emitInspectorActiveThread,
    "emitInspectorStopViewing",
    ()=>emitInspectorStopViewing,
    "emitInspectorViewThread",
    ()=>emitInspectorViewThread,
    "emitInspectorViewThreadResult",
    ()=>emitInspectorViewThreadResult,
    "empty",
    ()=>empty,
    "ensureObjectArgs",
    ()=>ensureObjectArgs,
    "isAbortError",
    ()=>isAbortError,
    "isInspectorThreadBridgeEnabled",
    ()=>isInspectorThreadBridgeEnabled,
    "isRunCompletionAware",
    ()=>isRunCompletionAware,
    "ofType",
    ()=>ofType,
    "on",
    ()=>on,
    "onInspectorActiveThread",
    ()=>onInspectorActiveThread,
    "onInspectorStopViewing",
    ()=>onInspectorStopViewing,
    "onInspectorViewThread",
    ()=>onInspectorViewThread,
    "onInspectorViewThreadResult",
    ()=>onInspectorViewThreadResult,
    "parseToolArguments",
    ()=>parseToolArguments,
    "props",
    ()=>props,
    "select",
    ()=>select,
    "ɵCOPILOTKIT_FEATURES",
    ()=>ɵCOPILOTKIT_FEATURES,
    "ɵInterruptState",
    ()=>ɵInterruptState,
    "ɵMAX_SOCKET_RETRIES",
    ()=>ɵMAX_SOCKET_RETRIES,
    "ɵcreateMemoryStore",
    ()=>createMemoryStore,
    "ɵcreateThreadSelectors",
    ()=>ɵcreateThreadSelectors,
    "ɵcreateThreadStore",
    ()=>createThreadStore,
    "ɵisCopilotKitFeature",
    ()=>ɵisCopilotKitFeature,
    "ɵisRetryableMemoryStatus",
    ()=>isRetryableStatus,
    "ɵjoinPhoenixChannel$",
    ()=>ɵjoinPhoenixChannel$,
    "ɵmapMemoryMetadataEvent",
    ()=>ɵmapMemoryMetadataEvent,
    "ɵmemoryAdapterEvents",
    ()=>ɵmemoryAdapterEvents,
    "ɵmemoryDomainEvents",
    ()=>ɵmemoryDomainEvents,
    "ɵmemoryReducer",
    ()=>ɵmemoryReducer,
    "ɵmemoryRestEvents",
    ()=>ɵmemoryRestEvents,
    "ɵobservePhoenixEvent$",
    ()=>ɵobservePhoenixEvent$,
    "ɵobservePhoenixJoinOutcome$",
    ()=>ɵobservePhoenixJoinOutcome$,
    "ɵobservePhoenixSocketHealth$",
    ()=>ɵobservePhoenixSocketHealth$,
    "ɵobservePhoenixSocketSignals$",
    ()=>ɵobservePhoenixSocketSignals$,
    "ɵphoenixChannel$",
    ()=>ɵphoenixChannel$,
    "ɵphoenixSocket$",
    ()=>ɵphoenixSocket$,
    "ɵselectFetchMoreError",
    ()=>ɵselectFetchMoreError,
    "ɵselectHasNextPage",
    ()=>ɵselectHasNextPage,
    "ɵselectIsFetchingNextPage",
    ()=>ɵselectIsFetchingNextPage,
    "ɵselectIsMutating",
    ()=>ɵselectIsMutating,
    "ɵselectMemories",
    ()=>ɵselectMemories,
    "ɵselectMemoriesAvailable",
    ()=>ɵselectMemoriesAvailable,
    "ɵselectMemoriesError",
    ()=>ɵselectMemoriesError,
    "ɵselectMemoriesIsLoading",
    ()=>ɵselectMemoriesIsLoading,
    "ɵselectMemoriesIsMutating",
    ()=>ɵselectMemoriesIsMutating,
    "ɵselectMemoriesRealtimeStatus",
    ()=>ɵselectMemoriesRealtimeStatus,
    "ɵselectThreads",
    ()=>ɵselectThreads,
    "ɵselectThreadsError",
    ()=>ɵselectThreadsError,
    "ɵselectThreadsIsLoading",
    ()=>ɵselectThreadsIsLoading,
    "ɵthreadAdapterEvents",
    ()=>ɵthreadAdapterEvents
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$tanstack$2f$pacer$2f$dist$2f$throttler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@tanstack/pacer/dist/throttler.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@ag-ui/client/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@ag-ui/core/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/utils/types.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$logger$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/logger.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$inspector$2d$metadata$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/utils/inspector-metadata.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/utils/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$random$2d$id$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/utils/random-id.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$debug$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/debug.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$standard$2d$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/standard-schema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$BehaviorSubject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/BehaviorSubject.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$empty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/observable/empty.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$never$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/observable/never.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Notification$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/Notification.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Observable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/Observable.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Subject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/Subject.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Subscription$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/Subscription.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$scheduler$2f$asap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/scheduler/asap.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$combineLatest$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/observable/combineLatest.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$concat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/observable/concat.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/observable/defer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$dematerialize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/dematerialize.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$firstValueFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/firstValueFrom.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$from$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/observable/from.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$lastValueFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/lastValueFrom.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/observable/merge.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$observeOn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/observeOn.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/observable/of.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/switchMap.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/observable/throwError.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/catchError.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$concatWith$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/concatWith.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$delay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/delay.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$distinctUntilChanged$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/distinctUntilChanged.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$endWith$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/endWith.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/filter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$finalize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/finalize.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$ignoreElements$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/ignoreElements.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/map.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$mergeMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$scan$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/scan.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$share$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/share.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$shareReplay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/shareReplay.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$take$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/take.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$takeUntil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/takeUntil.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$tap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/tap.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/timeout.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$withLatestFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/operators/withLatestFrom.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$phoenix$2f$priv$2f$static$2f$phoenix$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/phoenix/priv/static/phoenix.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2d$to$2d$json$2d$schema$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/zod-to-json-schema/dist/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2d$to$2d$json$2d$schema$2f$dist$2f$esm$2f$zodToJsonSchema$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/zod-to-json-schema/dist/esm/zodToJsonSchema.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$dom$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/rxjs/dist/esm5/internal/observable/dom/fetch.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
//#region src/utils/phoenix-observable.ts
/**
* Adapt Phoenix socket open/error callbacks into an observable signal stream.
*
* The returned observable is shared and replayable by the caller when needed,
* but this helper itself does not own socket connection teardown.
*/ function ɵcreatePhoenixSocketSignals$(socket) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Observable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
        socket.onOpen(()=>observer.next({
                type: "open"
            }));
        socket.onError((error)=>observer.next({
                type: "error",
                error
            }));
    });
}
/**
* Adapt a Phoenix channel join attempt into a single-outcome observable.
*/ function ɵcreatePhoenixJoinOutcome$(channel) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Observable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
        channel.join().receive("ok", ()=>{
            observer.next({
                type: "joined"
            });
            observer.complete();
        }).receive("error", (response)=>{
            observer.next({
                type: "error",
                response
            });
            observer.complete();
        }).receive("timeout", ()=>{
            observer.next({
                type: "timeout"
            });
            observer.complete();
        });
    });
}
/**
* Create a cold Phoenix socket session.
*
* The socket is constructed and connected on subscription, and disconnected on
* teardown. Each subscription creates an isolated socket instance.
*/ function ɵphoenixSocket$(options) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>{
        const socket = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$phoenix$2f$priv$2f$static$2f$phoenix$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Socket"](options.url, options.options);
        const signals$ = ɵcreatePhoenixSocketSignals$(socket).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$shareReplay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareReplay"])({
            bufferSize: 1,
            refCount: true
        }));
        socket.connect();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$concat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concat"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])({
            socket,
            signals$
        }), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$never$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEVER"]).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$finalize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["finalize"])(()=>socket.disconnect()));
    });
}
/**
* Create a cold Phoenix channel session from a socket session stream.
*
* A channel is created and joined for each active socket session. If the
* upstream socket session changes, the previous channel is left before the
* next one becomes active.
*/ function ɵphoenixChannel$(options) {
    return options.socket$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])(({ socket })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>{
            const channel = socket.channel(options.topic, options.params);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$concat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concat"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])({
                channel,
                joinOutcome$: ɵcreatePhoenixJoinOutcome$(channel).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$shareReplay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareReplay"])({
                    bufferSize: 1,
                    refCount: true
                }))
            }), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$never$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEVER"]).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$finalize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["finalize"])(()=>{
                if (options.leaveOnUnsubscribe !== false) channel.leave();
            }));
        })));
}
/**
* Observe a named Phoenix channel event as an observable payload stream.
*/ function ɵobservePhoenixEvent$(channel, eventName) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Observable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
        const ref = channel.on(eventName, (payload)=>observer.next(payload));
        return ()=>{
            channel.off(eventName, ref);
        };
    });
}
/**
* Flatten channel sessions into their join-outcome stream.
*/ function ɵobservePhoenixJoinOutcome$(channel$) {
    return channel$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])((session)=>session.joinOutcome$));
}
/**
* Complete when a channel joins successfully, or error if the join fails.
*/ function ɵjoinPhoenixChannel$(channel$) {
    return ɵobservePhoenixJoinOutcome$(channel$).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$take$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$mergeMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeMap"])((outcome)=>{
        if (outcome.type === "joined") return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$empty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY"];
        throw outcome.type === "timeout" ? /* @__PURE__ */ new Error("Timed out joining channel") : /* @__PURE__ */ new Error(`Failed to join channel: ${JSON.stringify(outcome.response)}`);
    }));
}
/**
* Flatten socket sessions into their lifecycle signal stream.
*/ function ɵobservePhoenixSocketSignals$(socket$) {
    return socket$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])((session)=>session.signals$));
}
/**
* Error after a socket emits the configured number of consecutive error
* signals, resetting the counter after each successful open signal.
*/ function ɵobservePhoenixSocketHealth$(socketSignals$, maxConsecutiveErrors) {
    return socketSignals$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$scan$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scan"])((consecutiveErrors, signal)=>signal.type === "open" ? 0 : consecutiveErrors + 1, 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])((consecutiveErrors)=>consecutiveErrors >= maxConsecutiveErrors), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$take$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$mergeMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeMap"])((consecutiveErrors)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>/* @__PURE__ */ new Error(`WebSocket connection failed after ${consecutiveErrors} consecutive errors`))));
}
//#endregion
//#region src/intelligence-agent.ts
const CLIENT_AG_UI_EVENT = "ag_ui_event";
const REPLAY_COMPLETE_EVENT = "replay_complete";
const STREAM_IDLE_EVENT = "stream_idle";
const STOP_RUN_EVENT = "stop_run";
const CONNECT_STREAM_IDLE_REPLAY_FALLBACK_MS = 100;
var AgentThreadLockedError = class extends Error {
    constructor(threadId){
        super(threadId ? `Thread ${threadId} is locked` : "Thread is locked");
        this.name = "AgentThreadLockedError";
    }
};
/**
* Type guard for {@link RunCompletionAware}. Returns true when `agent` exposes
* an `activeRunCompletionPromise` property, so callers can await an in-flight
* run without an `as unknown as` cast. Returns false for agents that don't
* implement the contract, letting the caller skip the await and degrade safely.
*/ function isRunCompletionAware(agent) {
    return typeof agent === "object" && agent !== null && "activeRunCompletionPromise" in agent;
}
var IntelligenceAgent = class IntelligenceAgent extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AbstractAgent"] {
    config;
    socket = null;
    activeChannel = null;
    canonicalRunId = null;
    sharedState;
    constructor(config, sharedState = {
        lastSeenEventIds: /* @__PURE__ */ new Map()
    }){
        super();
        this.config = config;
        this.sharedState = sharedState;
    }
    /**
	* Headers sent with the REST join requests (`/connect`, `/run`).
	*
	* Deliberately a public accessor pair rather than a plain read of `config`.
	* `ProxiedCopilotRuntimeAgent` builds its delegate once and caches it for the
	* proxy's lifetime, so a header that changes later (a tenant switch, a
	* rotated bearer) would otherwise never reach the gateway. The accessor is
	* what closes that gap: `syncDelegate` refreshes the delegate before every
	* join, and its `hasHeaders` probe is an `"headers" in agent` check — which a
	* prototype accessor satisfies but a `private config` does not.
	*
	* The setter replaces the config object instead of mutating it because
	* `clone()` hands the same config reference to the copy. An in-place write
	* would therefore have a per-thread clone's headers land on the original's
	* config too. The join path itself would survive that (`syncDelegate`
	* rewrites the headers just before every join), but the re-acquisition inside
	* an already-running pipeline does not go through `syncDelegate` — so a
	* clone's tenant could ride out on the original's socket-error refresh. That
	* is the same cross-tenant leak this accessor exists to prevent.
	*/ get headers() {
        return this.config.headers;
    }
    set headers(headers) {
        this.config = {
            ...this.config,
            headers
        };
    }
    /** Credentials mode for the REST join requests. Live for the same reason as {@link headers}. */ get credentials() {
        return this.config.credentials;
    }
    set credentials(credentials) {
        this.config = {
            ...this.config,
            credentials
        };
    }
    clone() {
        return new IntelligenceAgent(this.config, this.sharedState);
    }
    /**
	* Override of AbstractAgent.connectAgent that removes the `verifyEvents` step.
	*
	* Background: AbstractAgent's connectAgent pipeline runs events through
	* `verifyEvents`, which validates that the stream follows the AG-UI protocol
	* lifecycle — specifically, it expects a RUN_STARTED event before any content
	* events and a RUN_FINISHED/RUN_ERROR event to complete the stream.
	*
	* IntelligenceAgent uses long-lived WebSocket connections rather than
	* request-scoped SSE streams. When connecting to replay historical messages
	* for an existing thread, the connection semantics don't map to a single
	* agent run start/stop cycle. The replayed events may not include
	* RUN_STARTED/RUN_FINISHED bookends (or may contain events from multiple
	* past runs), which causes verifyEvents to either never complete or to
	* error out.
	*
	* This override replicates the base connectAgent implementation exactly,
	* substituting only `transformChunks` (which is still needed for message
	* reassembly) and omitting `verifyEvents`.
	*
	* TODO: Remove this override once AG-UI's AbstractAgent supports opting out
	* of verifyEvents for transports with different connection life-cycles.
	*/ async connectAgent(parameters, subscriber) {
        const self = this;
        try {
            this.isRunning = true;
            this.agentId = this.agentId ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["randomUUID"])();
            const effectiveParameters = parameters?.runId || !this.canonicalRunId ? parameters : {
                ...parameters,
                runId: this.canonicalRunId
            };
            const input = this.prepareRunAgentInput(effectiveParameters);
            let result;
            const previousMessageIds = new Set(this.messages.map((m)=>m.id));
            const subscribers = [
                {
                    onRunFinishedEvent: (event)=>{
                        if (event.outcome === "success") result = event.result;
                    }
                },
                ...this.subscribers,
                subscriber ?? {}
            ];
            await this.onInitialize(input, subscribers);
            self.activeRunDetach$ = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Subject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subject"]();
            let resolveCompletion;
            self.activeRunCompletionPromise = new Promise((resolve)=>{
                resolveCompletion = resolve;
            });
            const source$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>this.connect(input)).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["transformChunks"])(this.debugLogger), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$takeUntil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takeUntil"])(self.activeRunDetach$));
            const applied$ = this.apply(input, source$, subscribers);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$lastValueFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lastValueFrom"])(this.processApplyEvents(input, applied$, subscribers).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catchError"])((error)=>{
                this.isRunning = false;
                return this.onError(input, error, subscribers);
            }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$finalize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["finalize"])(()=>{
                this.isRunning = false;
                this.onFinalize(input, subscribers);
                resolveCompletion?.();
                resolveCompletion = void 0;
                self.activeRunCompletionPromise = void 0;
                self.activeRunDetach$ = void 0;
            })), {
                defaultValue: void 0
            });
            const newMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["structuredClone_"])(this.messages).filter((m)=>!previousMessageIds.has(m.id));
            return {
                result,
                newMessages
            };
        } finally{
            this.isRunning = false;
        }
    }
    abortRun() {
        if (this.activeChannel && this.canonicalRunId) {
            const fallback = setTimeout(()=>clear(), 5e3);
            const clear = ()=>{
                clearTimeout(fallback);
                this.detachActiveRun();
                this.cleanup();
            };
            this.activeChannel.push(STOP_RUN_EVENT, {
                run_id: this.canonicalRunId
            }).receive("ok", clear).receive("error", clear).receive("timeout", clear);
        } else {
            this.detachActiveRun();
            this.cleanup();
        }
    }
    /**
	* Trigger the run via REST, then join the realtime thread channel and relay
	* server-pushed AG-UI events to the Observable subscriber.
	*/ run(input) {
        this.threadId = input.threadId;
        this.canonicalRunId = input.runId;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>this.requestJoinCredentials$("run", input)).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])((credentials)=>{
            if (credentials === null) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>/* @__PURE__ */ new Error("REST run request returned no credentials"));
            const canonicalInput = this.applyCanonicalRunIdentity(input, credentials, {
                fallbackToInputRunId: true
            });
            return this.observeThread$(canonicalInput, credentials, {
                completeOnRunError: false,
                streamMode: "run"
            });
        }));
    }
    /**
	* Reconnect to an existing thread by fetching websocket credentials and
	* joining the realtime thread channel.
	*/ /**
	* Reconnect to an existing thread by fetching websocket credentials
	* and joining the realtime thread channel.
	*
	* Note: this method does NOT clear the replay cursor. Whether to
	* request a full historical replay vs. resume from
	* `lastSeenEventId` is a decision the caller (typically
	* `RunHandler.connectAgent`) makes by calling
	* {@link clearReconnectCursor} ahead of time on a fresh thread
	* restore. Same-thread churn re-connects preserve the cursor so the
	* gateway only streams events past it instead of replaying the
	* entire history every time the chat re-opens a socket.
	*/ connect(input) {
        this.threadId = input.threadId;
        this.canonicalRunId = null;
        const replayCursor = this.getReconnectCursor(input);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>this.requestJoinCredentials$("connect", input, replayCursor)).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])((credentials)=>{
            if (credentials === null) return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$empty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY"];
            const canonicalInput = this.applyCanonicalRunIdentity(input, credentials, {
                fallbackToInputRunId: false
            });
            return this.observeThread$(canonicalInput, credentials, {
                completeOnRunError: false,
                streamMode: "connect",
                replayCursor
            });
        }));
    }
    /**
	* Tear down a specific channel + socket pair that belongs to one pipeline.
	* Only nulls instance references when they still point to the owned resource,
	* so a concurrent pipeline's resources are never clobbered.
	*/ cleanupOwned(ownChannel, ownSocket) {
        if (ownChannel) {
            ownChannel.leave();
            if (this.activeChannel === ownChannel) this.activeChannel = null;
        }
        if (ownSocket) {
            ownSocket.disconnect();
            if (this.socket === ownSocket) this.socket = null;
        }
        this.canonicalRunId = null;
    }
    cleanup() {
        this.cleanupOwned(this.activeChannel, this.socket);
    }
    requestJoinCredentials$(mode, input, replayCursor) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(async ()=>{
            try {
                const response = await fetch(this.buildRuntimeUrl(mode), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...this.headers
                    },
                    body: JSON.stringify({
                        threadId: input.threadId,
                        runId: input.runId,
                        messages: input.messages,
                        tools: input.tools,
                        context: input.context,
                        state: input.state,
                        forwardedProps: input.forwardedProps,
                        ...mode === "connect" ? {
                            lastSeenEventId: replayCursor === void 0 ? this.getReconnectCursor(input) : replayCursor
                        } : {}
                    }),
                    ...this.credentials ? {
                        credentials: this.credentials
                    } : {}
                });
                if (response.status === 204 && mode === "connect") return null;
                if (response.status === 409 && mode === "run") throw new AgentThreadLockedError(input.threadId);
                if (!response.ok) {
                    const text = await response.text().catch(()=>"");
                    throw new Error(text || response.statusText || String(response.status));
                }
                return this.normalizeJoinCredentials(await response.json(), input);
            } catch (error) {
                if (error instanceof AgentThreadLockedError) throw error;
                throw new Error(`REST ${mode} request failed: ${error instanceof Error ? error.message : String(error)}`, {
                    cause: error
                });
            }
        });
    }
    normalizeJoinCredentials(payload, input) {
        const envelope = payload && typeof payload === "object" ? payload : null;
        const realtime = envelope?.realtime && typeof envelope.realtime === "object" ? envelope.realtime : null;
        if (typeof envelope?.joinToken !== "string" || !envelope.joinToken) throw new Error("missing joinToken");
        if (typeof realtime?.clientUrl !== "string" || !realtime.clientUrl) throw new Error("missing realtime.clientUrl");
        if (typeof realtime.topic !== "string" || !realtime.topic) throw new Error("missing realtime.topic");
        return {
            threadId: typeof envelope.threadId === "string" && envelope.threadId ? envelope.threadId : input.threadId,
            runId: typeof envelope.runId === "string" && envelope.runId ? envelope.runId : null,
            joinToken: envelope.joinToken,
            realtime: {
                clientUrl: realtime.clientUrl,
                topic: realtime.topic
            }
        };
    }
    observeThread$(input, credentials, options) {
        return this.observeThreadSession$(input, credentials, options).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catchError"])((error)=>{
            if (!this.isSocketReconnectExhaustedError(error)) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$throwError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throwError"])(()=>error);
            const replayCursor = this.getReconnectCursor(input);
            return this.requestJoinCredentials$("connect", input, replayCursor).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])((refreshedCredentials)=>refreshedCredentials === null ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$empty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY"] : this.observeThread$(this.applyCanonicalRunIdentity(input, refreshedCredentials, {
                    fallbackToInputRunId: options.streamMode === "run"
                }), refreshedCredentials, {
                    ...options,
                    channelMode: "connect",
                    replayCursor
                })));
        }));
    }
    observeThreadSession$(input, credentials, options) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>{
            let ownSocket = null;
            let ownChannel = null;
            const socket$ = ɵphoenixSocket$({
                url: credentials.realtime.clientUrl,
                options: {
                    params: {
                        ...this.config.socketParams,
                        join_token: credentials.joinToken
                    },
                    reconnectAfterMs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["phoenixExponentialBackoff"])(100, 1e4),
                    rejoinAfterMs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["phoenixExponentialBackoff"])(1e3, 3e4)
                }
            }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$tap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tap"])(({ socket })=>{
                ownSocket = socket;
                this.socket = ownSocket;
            }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$shareReplay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareReplay"])({
                bufferSize: 1,
                refCount: true
            }));
            const params = this.createThreadChannelParams(input, options.channelMode ?? options.streamMode, options.replayCursor);
            const channel$ = ɵphoenixChannel$({
                socket$,
                topic: credentials.realtime.topic,
                params
            }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$tap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tap"])(({ channel })=>{
                ownChannel = channel;
                this.activeChannel = ownChannel;
            }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$shareReplay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareReplay"])({
                bufferSize: 1,
                refCount: true
            }));
            const reconnectCursor = this.readDurableEventId(options.replayCursor ?? this.getReconnectCursor(input));
            let latestObservedReplayCursor = null;
            const threadEvents$ = this.observeThreadEvents$(input.threadId, channel$, options).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$tap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tap"])((payload)=>{
                latestObservedReplayCursor = this.readEventId(payload) ?? latestObservedReplayCursor;
            }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$share$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["share"])());
            const replayComplete$ = this.observeControlEvent$(input.threadId, channel$, REPLAY_COMPLETE_EVENT).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$shareReplay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareReplay"])({
                bufferSize: 1,
                refCount: true
            }));
            const streamIdle$ = this.observeControlEvent$(input.threadId, channel$, STREAM_IDLE_EVENT).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$shareReplay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareReplay"])({
                bufferSize: 1,
                refCount: true
            }));
            const streamIdleCompletion$ = options.streamMode === "connect" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$combineLatest$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["combineLatest"])([
                replayComplete$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$take$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["take"])(1)),
                streamIdle$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$take$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["take"])(1))
            ]), streamIdle$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$take$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])((payload)=>this.canFallbackCompleteConnect(payload, reconnectCursor, latestObservedReplayCursor)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$delay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["delay"])(CONNECT_STREAM_IDLE_REPLAY_FALLBACK_MS))).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$take$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["take"])(1)) : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$empty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY"];
            const threadCompleted$ = threadEvents$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$ignoreElements$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ignoreElements"])(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$endWith$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endWith"])(null), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$take$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["take"])(1));
            const terminal$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])(threadCompleted$, streamIdleCompletion$);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])(this.joinThreadChannel$(channel$), this.observeSocketHealth$(socket$).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$takeUntil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takeUntil"])(terminal$)), threadEvents$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$takeUntil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takeUntil"])(streamIdleCompletion$)), replayComplete$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$ignoreElements$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ignoreElements"])(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$takeUntil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takeUntil"])(terminal$)), streamIdleCompletion$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$ignoreElements$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ignoreElements"])(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$takeUntil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takeUntil"])(threadCompleted$))).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$finalize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["finalize"])(()=>this.cleanupOwned(ownChannel, ownSocket)));
        });
    }
    joinThreadChannel$(channel$) {
        return ɵjoinPhoenixChannel$(channel$);
    }
    observeSocketHealth$(socket$) {
        return ɵobservePhoenixSocketHealth$(ɵobservePhoenixSocketSignals$(socket$), 5);
    }
    observeThreadEvents$(threadId, channel$, options) {
        return channel$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])(({ channel })=>this.observeChannelEvent$(channel, CLIENT_AG_UI_EVENT)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$tap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tap"])((payload)=>{
            this.updateLastSeenEventId(threadId, payload);
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$mergeMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeMap"])((payload)=>this.createThreadNotifications(payload, {
                completeOnRunError: options.completeOnRunError,
                completeOnRunFinished: options.streamMode === "run",
                errorOnRunError: options.streamMode === "run"
            })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$dematerialize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dematerialize"])());
    }
    observeControlEvent$(threadId, channel$, eventName) {
        return channel$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])(({ channel })=>this.observeChannelEvent$(channel, eventName)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$tap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tap"])((payload)=>this.updateLastSeenEventIdFromControl(threadId, payload)));
    }
    observeChannelEvent$(channel, eventName) {
        return ɵobservePhoenixEvent$(channel, eventName);
    }
    createThreadNotifications(payload, options) {
        if (payload.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_FINISHED) return options.completeOnRunFinished ? [
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Notification$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notification"].createNext(payload),
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Notification$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notification"].createComplete()
        ] : [
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Notification$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notification"].createNext(payload)
        ];
        if (payload.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_ERROR) {
            const errorMessage = payload.message ?? "Run error";
            return options.completeOnRunError ? [
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Notification$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notification"].createNext(payload),
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Notification$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notification"].createComplete()
            ] : options.errorOnRunError ? [
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Notification$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notification"].createNext(payload),
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Notification$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notification"].createError(new Error(errorMessage))
            ] : [
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Notification$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notification"].createNext(payload)
            ];
        }
        return [
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Notification$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notification"].createNext(payload)
        ];
    }
    buildRuntimeUrl(mode) {
        const path = `${this.config.runtimeUrl}/agent/${encodeURIComponent(this.config.agentId)}/${mode}`;
        const origin = typeof window !== "undefined" && window.location ? window.location.origin : "http://localhost";
        return new URL(path, new URL(this.config.runtimeUrl, origin)).toString();
    }
    createThreadChannelParams(input, streamMode, replayCursor) {
        return streamMode === "run" ? {
            stream_mode: "run",
            run_id: input.runId
        } : {
            stream_mode: "connect",
            last_seen_event_id: replayCursor === void 0 ? this.getReconnectCursor(input) : replayCursor
        };
    }
    getLastSeenEventId(threadId) {
        return this.sharedState.lastSeenEventIds.get(threadId) ?? null;
    }
    getReconnectCursor(input) {
        return this.getLastSeenEventId(input.threadId);
    }
    /**
	* Drop the cached `lastSeenEventId` cursor for `threadId` so the
	* next connect to that topic asks the gateway for a full historical
	* replay (rather than resuming). Public because
	* `RunHandler.connectAgent` calls it on a detected thread switch
	* to rebuild local state from scratch, and skips it on same-thread
	* churn so the gateway can resume.
	*/ clearReconnectCursor(threadId) {
        this.sharedState.lastSeenEventIds.delete(threadId);
    }
    updateLastSeenEventId(threadId, payload) {
        const eventId = this.readEventId(payload);
        if (!eventId) return;
        this.advanceLastSeenEventId(threadId, eventId);
    }
    updateLastSeenEventIdFromControl(threadId, payload) {
        const eventId = this.readControlEventId(payload);
        if (!eventId) return;
        this.advanceLastSeenEventId(threadId, eventId);
    }
    advanceLastSeenEventId(threadId, eventId) {
        this.sharedState.lastSeenEventIds.set(threadId, eventId);
    }
    readEventId(payload) {
        const metadata = payload.metadata;
        if (!metadata || typeof metadata !== "object") return null;
        const eventMetadata = metadata;
        return this.readDurableEventId(eventMetadata.cpki_event_id);
    }
    readControlEventId(payload) {
        if (!payload || typeof payload !== "object") return null;
        const controlPayload = payload;
        const latestEventId = controlPayload.latestEventId ?? controlPayload.latest_event_id;
        return this.readDurableEventId(latestEventId);
    }
    readDurableEventId(eventId) {
        if (typeof eventId !== "string" || eventId.trim() === "") return null;
        return eventId.startsWith("cpki_ingested") ? null : eventId;
    }
    canFallbackCompleteConnect(streamIdlePayload, reconnectCursor, latestObservedReplayCursor) {
        const idleCursor = this.readControlEventId(streamIdlePayload);
        if (!idleCursor) return true;
        return idleCursor === reconnectCursor || idleCursor === latestObservedReplayCursor;
    }
    applyCanonicalRunIdentity(input, credentials, options) {
        this.threadId = credentials.threadId;
        const runId = credentials.runId ?? (options.fallbackToInputRunId ? input.runId : null);
        this.canonicalRunId = runId;
        return {
            ...input,
            threadId: credentials.threadId,
            ...runId === null ? {} : {
                runId
            }
        };
    }
    isSocketReconnectExhaustedError(error) {
        return error instanceof Error && error.message.includes("WebSocket connection failed after");
    }
};
//#endregion
//#region src/utils/runtime-info-error.ts
/**
* Build the error for a failed runtime `/info` response, folding in whatever
* explanation the runtime sent back.
*
* The status alone cannot distinguish a wrong `runtimeUrl` from a transport
* mismatch, so the runtime answers the latter with a body naming the cause
* (see the handler's `single_route_envelope_against_multi_route_runtime`
* diagnostic). Discarding that body — as every `/info` caller used to — left
* the developer with a bare 404 and nothing to act on (OSS-882).
*
* A body that isn't JSON, or carries no string `message`, contributes nothing:
* the status is then the whole error.
*/ async function runtimeInfoError(response) {
    const base = `Runtime info request failed with status ${response.status}`;
    let detail;
    try {
        const message = (await response.clone().json())?.message;
        if (typeof message === "string" && message.trim().length > 0) detail = message.trim();
    } catch  {}
    return new Error(detail ? `${base}: ${detail}` : base);
}
//#endregion
//#region src/agent.ts
function hasHeaders(agent) {
    return "headers" in agent;
}
function hasCredentials(agent) {
    return "credentials" in agent;
}
function isZodError(error) {
    return error !== null && typeof error === "object" && "name" in error && error.name === "ZodError";
}
function isAbortError$1(error) {
    return (error instanceof DOMException || error instanceof Error) && error.name === "AbortError";
}
function withAbortErrorHandling(observable) {
    return observable.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catchError"])((error)=>{
        if (isZodError(error) || isAbortError$1(error)) return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$empty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY"];
        throw error;
    }));
}
var ProxiedCopilotRuntimeAgent = class ProxiedCopilotRuntimeAgent extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HttpAgent"] {
    runtimeUrl;
    credentials;
    runtimeAgentId;
    transport;
    singleEndpointUrl;
    runtimeMode;
    intelligence;
    _capabilities;
    delegate;
    runtimeInfoPromise;
    constructor(config){
        const normalizedRuntimeUrl = config.runtimeUrl ? config.runtimeUrl.replace(/\/$/, "") : void 0;
        const transport = config.transport ?? "auto";
        const routedId = config.runtimeAgentId ?? config.agentId ?? "";
        const runUrl = transport === "single" ? normalizedRuntimeUrl ?? config.runtimeUrl ?? "" : `${normalizedRuntimeUrl ?? config.runtimeUrl}/agent/${encodeURIComponent(routedId)}/run`;
        if (!runUrl) throw new Error("ProxiedCopilotRuntimeAgent requires a runtimeUrl when transport is set to 'single'.");
        super({
            ...config,
            url: runUrl
        });
        this.runtimeUrl = normalizedRuntimeUrl ?? config.runtimeUrl;
        this.credentials = config.credentials;
        this.runtimeAgentId = config.runtimeAgentId;
        this.transport = transport;
        this.runtimeMode = config.runtimeMode ?? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUNTIME_MODE_SSE"];
        this.intelligence = config.intelligence;
        this._capabilities = config.capabilities;
        if (config.debug) this.debug = config.debug;
        if (this.transport === "single") this.singleEndpointUrl = this.runtimeUrl;
    }
    /**
	* The agent id used for outbound runtime requests — `runtimeAgentId` when
	* set (manually-registered proxy), otherwise `agentId` (registry id
	* matches runtime id). Subscriber bookkeeping keeps using `agentId`
	* directly.
	*
	* Throws when both are unset: a proxy reaching an HTTP path with no
	* routable id is a bug, and a missing id would otherwise produce a
	* malformed `/agent//run` or `/agent/undefined/connect` URL silently.
	*/ routedAgentId() {
        const id = this.runtimeAgentId ?? this.agentId;
        if (!id) throw new Error("ProxiedCopilotRuntimeAgent: cannot make a runtime request without an agentId or runtimeAgentId.");
        return id;
    }
    get capabilities() {
        return this._capabilities;
    }
    requestInit(input) {
        return {
            ...super.requestInit(input),
            ...this.credentials ? {
                credentials: this.credentials
            } : {}
        };
    }
    async getCapabilities() {
        return this._capabilities ?? {};
    }
    async detachActiveRun() {
        if (this.delegate) await this.delegate.detachActiveRun();
        await super.detachActiveRun();
    }
    abortRun() {
        if (this.delegate) {
            this.syncDelegate(this.delegate);
            this.delegate.abortRun();
            this.detachActiveRun();
            return;
        }
        if (!this.agentId || !this.threadId) return;
        if (typeof fetch === "undefined") return;
        const routedId = this.routedAgentId();
        if (this.transport === "single") {
            if (!this.singleEndpointUrl) return;
            const headers = new Headers({
                ...this.headers,
                "Content-Type": "application/json"
            });
            fetch(this.singleEndpointUrl, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    method: "agent/stop",
                    params: {
                        agentId: routedId,
                        threadId: this.threadId
                    }
                }),
                ...this.credentials ? {
                    credentials: this.credentials
                } : {}
            }).catch((error)=>{
                console.error("ProxiedCopilotRuntimeAgent: stop request failed", error);
            });
            return;
        }
        if (!this.runtimeUrl) return;
        const stopPath = `${this.runtimeUrl}/agent/${encodeURIComponent(routedId)}/stop/${encodeURIComponent(this.threadId)}`;
        const origin = typeof window !== "undefined" && window.location ? window.location.origin : "http://localhost";
        const base = new URL(this.runtimeUrl, origin);
        const stopUrl = new URL(stopPath, base);
        fetch(stopUrl.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...this.headers
            },
            ...this.credentials ? {
                credentials: this.credentials
            } : {}
        }).catch((error)=>{
            console.error("ProxiedCopilotRuntimeAgent: stop request failed", error);
        });
    }
    async connectAgent(parameters, subscriber) {
        if (this.runtimeMode !== __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUNTIME_MODE_INTELLIGENCE"]) return super.connectAgent(parameters, subscriber);
        if (this.delegate) await this.delegate.detachActiveRun();
        await this.resolveDelegate();
        const delegate = this.delegate;
        const bridgeSub = delegate.subscribe({
            onMessagesChanged: ()=>{
                this.setMessages([
                    ...delegate.messages
                ]);
            },
            onStateChanged: ()=>{
                this.setState({
                    ...delegate.state
                });
            },
            onRunInitialized: ()=>{
                this.isRunning = true;
            },
            onRunFinalized: ()=>{
                this.isRunning = false;
            },
            onRunFailed: ()=>{
                this.isRunning = false;
            },
            onRunErrorEvent: ()=>{
                this.isRunning = false;
            }
        });
        const forwardedSubs = this.subscribers.map((s)=>delegate.subscribe(s));
        try {
            const result = await delegate.connectAgent(parameters, subscriber);
            this.setMessages([
                ...delegate.messages
            ]);
            this.setState({
                ...delegate.state
            });
            return result;
        } finally{
            this.isRunning = false;
            bridgeSub.unsubscribe();
            for (const sub of forwardedSubs)sub.unsubscribe();
        }
    }
    connect(input) {
        if (this.runtimeMode === "pending" || this.transport === "auto" && this.runtimeMode !== __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUNTIME_MODE_INTELLIGENCE"]) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$from$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["from"])(this.ensureRuntimeConfiguration())).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])(()=>this.connect(input)));
        if (this.runtimeMode === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUNTIME_MODE_INTELLIGENCE"]) return this.#connectViaDelegate(input);
        return this.#connectViaHttp(input);
    }
    run(input) {
        if (this.runtimeMode === "pending" || this.transport === "auto" && this.runtimeMode !== __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUNTIME_MODE_INTELLIGENCE"]) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$from$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["from"])(this.ensureRuntimeConfiguration())).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])(()=>this.run(input)));
        if (this.runtimeMode === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUNTIME_MODE_INTELLIGENCE"]) return this.#runViaDelegate(input);
        return this.#runViaHttp(input);
    }
    #connectViaDelegate(input) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$from$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["from"])(this.resolveDelegate())).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])((delegate)=>withAbortErrorHandling(delegate.connect(input))));
    }
    #connectViaHttp(input) {
        const routedId = this.routedAgentId();
        if (this.transport === "single") {
            if (!this.singleEndpointUrl) throw new Error("Single endpoint transport requires a runtimeUrl");
            const requestInit = this.createSingleRouteRequestInit(input, "agent/connect", {
                agentId: routedId
            });
            return withAbortErrorHandling((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["transformHttpEventStream"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["runHttpRequest"])(()=>this.fetch(this.singleEndpointUrl, requestInit))));
        }
        const connectUrl = `${this.runtimeUrl}/agent/${routedId}/connect`;
        const connectRequestInit = this.requestInit(input);
        return withAbortErrorHandling((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["transformHttpEventStream"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["runHttpRequest"])(()=>this.fetch(connectUrl, connectRequestInit))));
    }
    #runViaDelegate(input) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$from$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["from"])(this.resolveDelegate())).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])((delegate)=>withAbortErrorHandling(delegate.run(input))));
    }
    #runViaHttp(input) {
        if (this.transport === "single") {
            if (!this.singleEndpointUrl) throw new Error("Single endpoint transport requires a runtimeUrl");
            const requestInit = this.createSingleRouteRequestInit(input, "agent/run", {
                agentId: this.routedAgentId()
            });
            return withAbortErrorHandling((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["transformHttpEventStream"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["runHttpRequest"])(()=>this.fetch(this.singleEndpointUrl, requestInit))));
        }
        return withAbortErrorHandling(super.run(input));
    }
    clone() {
        const cloned = new ProxiedCopilotRuntimeAgent({
            runtimeUrl: this.runtimeUrl,
            agentId: this.agentId,
            runtimeAgentId: this.runtimeAgentId,
            description: this.description,
            headers: {
                ...this.headers
            },
            credentials: this.credentials,
            transport: this.transport,
            runtimeMode: this.runtimeMode,
            intelligence: this.intelligence,
            capabilities: this._capabilities,
            debug: this.debug
        });
        cloned.threadId = this.threadId;
        cloned.setState(this.state);
        cloned.setMessages(this.messages);
        if (this.delegate) {
            const clonedDelegate = this.delegate.clone();
            cloned.delegate = clonedDelegate;
            cloned.syncDelegate(clonedDelegate);
        }
        return cloned;
    }
    /**
	* Drop the delegate's cached `lastSeenEventId` for this thread so
	* the next connect requests a full historical replay from the
	* gateway. Used by `RunHandler.connectAgent` on a detected thread
	* switch (the chat moved between threads, so its local
	* messages/state are about to be cleared and need rebuilding from
	* the gateway). Skipped on same-thread churn re-connects so the
	* gateway can resume from the cursor instead.
	*
	* No-op for non-Intelligence runtime modes — the HTTP transport
	* doesn't replay.
	*/ clearReplayCursor(threadId) {
        if (this.runtimeMode !== __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUNTIME_MODE_INTELLIGENCE"]) return;
        this.delegate?.clearReconnectCursor?.(threadId);
    }
    async resolveDelegate() {
        await this.ensureRuntimeConfiguration();
        if (!this.delegate) {
            if (this.runtimeMode !== __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUNTIME_MODE_INTELLIGENCE"]) throw new Error("A delegate is only created for Intelligence mode");
            this.delegate = this.createIntelligenceDelegate();
        }
        this.syncDelegate(this.delegate);
        return this.delegate;
    }
    /** Resolve transport and runtime mode before the first outbound request. */ async ensureRuntimeConfiguration() {
        if (this.runtimeMode === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUNTIME_MODE_INTELLIGENCE"] || this.runtimeMode !== "pending" && this.transport !== "auto") return;
        if (!this.runtimeUrl) throw new Error("Runtime URL is not set");
        const runtimeInfoPromise = this.runtimeInfoPromise ?? this.fetchRuntimeInfo().then((runtimeInfo)=>{
            this.runtimeMode = runtimeInfo.mode ?? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUNTIME_MODE_SSE"];
            this.intelligence = runtimeInfo.intelligence;
        });
        this.runtimeInfoPromise = runtimeInfoPromise;
        try {
            await runtimeInfoPromise;
        } catch (error) {
            if (this.runtimeInfoPromise === runtimeInfoPromise) this.runtimeInfoPromise = void 0;
            throw error;
        }
    }
    async fetchRuntimeInfo() {
        const headers = {
            ...this.headers
        };
        if (this.transport === "auto") return this.fetchRuntimeInfoAutoDetect(headers);
        let init;
        let url;
        if (this.transport === "single") {
            if (!this.singleEndpointUrl) throw new Error("Single endpoint transport requires a runtimeUrl");
            if (!headers["Content-Type"]) headers["Content-Type"] = "application/json";
            url = this.runtimeUrl;
            init = {
                method: "POST",
                body: JSON.stringify({
                    method: "info"
                })
            };
        } else {
            url = `${this.runtimeUrl}/info`;
            init = {};
        }
        const response = await fetch(url, {
            ...init,
            headers,
            ...this.credentials ? {
                credentials: this.credentials
            } : {}
        });
        if (!response.ok) throw await runtimeInfoError(response);
        return await response.json();
    }
    async fetchRuntimeInfoAutoDetect(headers) {
        try {
            const response = await fetch(`${this.runtimeUrl}/info`, {
                headers: {
                    ...headers
                },
                ...this.credentials ? {
                    credentials: this.credentials
                } : {}
            });
            if (response.status >= 200 && response.status < 300) {
                this.transport = "rest";
                return await response.json();
            }
        } catch  {}
        const singleHeaders = {
            ...headers
        };
        if (!singleHeaders["Content-Type"]) singleHeaders["Content-Type"] = "application/json";
        const response = await fetch(this.runtimeUrl, {
            method: "POST",
            headers: singleHeaders,
            body: JSON.stringify({
                method: "info"
            }),
            ...this.credentials ? {
                credentials: this.credentials
            } : {}
        });
        if (!response.ok) throw await runtimeInfoError(response);
        this.transport = "single";
        this.singleEndpointUrl = this.runtimeUrl;
        return await response.json();
    }
    createSingleRouteRequestInit(input, method, params) {
        if (!this.agentId) throw new Error("ProxiedCopilotRuntimeAgent requires agentId to make runtime requests");
        const baseInit = super.requestInit(input);
        const headers = new Headers(baseInit.headers ?? {});
        headers.set("Content-Type", "application/json");
        headers.set("Accept", headers.get("Accept") ?? "text/event-stream");
        let originalBody = void 0;
        if (typeof baseInit.body === "string") try {
            originalBody = JSON.parse(baseInit.body);
        } catch (error) {
            console.warn("ProxiedCopilotRuntimeAgent: failed to parse request body for single route transport", error);
        }
        const envelope = {
            method
        };
        if (params && Object.keys(params).length > 0) envelope.params = params;
        if (originalBody !== void 0) envelope.body = originalBody;
        return {
            ...baseInit,
            headers,
            body: JSON.stringify(envelope),
            ...this.credentials ? {
                credentials: this.credentials
            } : {}
        };
    }
    createIntelligenceDelegate() {
        const routedId = this.routedAgentId();
        if (!this.runtimeUrl || !routedId || !this.intelligence?.wsUrl) throw new Error("Intelligence mode requires runtimeUrl, agentId, and intelligence websocket metadata");
        return new IntelligenceAgent({
            url: this.intelligence.wsUrl,
            runtimeUrl: this.runtimeUrl,
            agentId: routedId,
            headers: {
                ...this.headers
            },
            credentials: this.credentials
        });
    }
    syncDelegate(delegate) {
        delegate.agentId = this.routedAgentId();
        delegate.description = this.description;
        delegate.threadId = this.threadId;
        delegate.setMessages(this.messages);
        delegate.setState(this.state);
        if (hasHeaders(delegate)) delegate.headers = {
            ...this.headers
        };
        if (hasCredentials(delegate)) delegate.credentials = this.credentials;
    }
};
//#endregion
//#region src/core/agent-registry.ts
/** Maximum wait for optional Inspector metadata before degrading to absence. */ const INSPECTOR_METADATA_REQUEST_TIMEOUT_MS = 5e3;
/** Build case-insensitive JSON headers without mutating the Core snapshot. */ function withJsonContentType(headers) {
    const requestHeaders = new Headers(headers);
    if (!requestHeaders.has("content-type")) requestHeaders.set("content-type", "application/json");
    return requestHeaders;
}
/**
* Manages agent registration, lifecycle, and runtime connectivity for CopilotKitCore.
* Handles both local development agents and remote runtime agents.
*/ var AgentRegistry = class {
    _agents = {};
    localAgents = {};
    remoteAgents = {};
    _runtimeUrl;
    _connectionInFlight;
    _runtimeVersion;
    _runtimeConnectionStatus = CopilotKitCoreRuntimeConnectionStatus.Disconnected;
    _runtimeTransport = "auto";
    _requestedTransport = "auto";
    _audioFileTranscriptionEnabled = false;
    _runtimeMode = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUNTIME_MODE_SSE"];
    _intelligence;
    _threadEndpoints;
    _suggestions;
    _inspectorMetadata;
    _inspectorMetadataSupported = false;
    inspectorMetadataRefreshReady = false;
    inspectorMetadataConnectionGeneration = 0;
    inspectorMetadataGeneration = 0;
    inspectorMetadataHeadersGeneration = 0;
    inspectorMetadataCredentialsGeneration = 0;
    inspectorMetadataAbortController;
    inspectorMetadataNotificationQueue = Promise.resolve();
    _a2uiEnabled = false;
    _a2uiAgents;
    _openGenerativeUIEnabled = false;
    _licenseStatus;
    _telemetryDisabled = false;
    /**
	* The headers each HttpAgent was constructed with, captured on the first
	* `applyHeadersToAgent` call for that agent (which, for agents the registry
	* owns, happens at registration before any core headers are applied). Core
	* headers are merged ON TOP of this baseline so that headers configured
	* directly on an agent (e.g. an `Authorization` for a self-hosted backend)
	* survive registration instead of being silently replaced. The baseline is
	* captured once and never re-captured, so a later direct mutation of
	* `agent.headers` is not folded into it. See #5635.
	*/ agentOwnHeaders = /* @__PURE__ */ new WeakMap();
    constructor(core){
        this.core = core;
    }
    /**
	* Get all agents as a readonly record
	*/ get agents() {
        return this._agents;
    }
    get runtimeUrl() {
        return this._runtimeUrl;
    }
    get runtimeVersion() {
        return this._runtimeVersion;
    }
    get runtimeConnectionStatus() {
        return this._runtimeConnectionStatus;
    }
    get runtimeTransport() {
        return this._runtimeTransport;
    }
    get audioFileTranscriptionEnabled() {
        return this._audioFileTranscriptionEnabled;
    }
    get runtimeMode() {
        return this._runtimeMode;
    }
    get intelligence() {
        return this._intelligence;
    }
    get threadEndpoints() {
        return this._threadEndpoints;
    }
    get suggestions() {
        return this._suggestions;
    }
    get inspectorMetadata() {
        return this._inspectorMetadata;
    }
    get a2uiEnabled() {
        return this._a2uiEnabled;
    }
    /**
	* Agent ids the runtime applies A2UI to (#5369). `undefined` means A2UI
	* applies to every agent — or is disabled entirely; check `a2uiEnabled`.
	*/ get a2uiAgents() {
        return this._a2uiAgents;
    }
    get openGenerativeUIEnabled() {
        return this._openGenerativeUIEnabled;
    }
    get licenseStatus() {
        return this._licenseStatus;
    }
    get telemetryDisabled() {
        return this._telemetryDisabled;
    }
    /**
	* Initialize agents from configuration
	*/ initialize(agents) {
        this.localAgents = this.assignAgentIds(agents);
        this.applyHeadersToAgents(this.localAgents);
        this.applyCredentialsToAgents(this.localAgents);
        this._agents = this.localAgents;
    }
    /**
	* Set the runtime URL and update connection
	*/ setRuntimeUrl(runtimeUrl, options) {
        const normalizedRuntimeUrl = runtimeUrl ? runtimeUrl.replace(/\/$/, "") : void 0;
        if (this._runtimeUrl === normalizedRuntimeUrl) return;
        this.invalidateInspectorMetadataConnection();
        this._runtimeUrl = normalizedRuntimeUrl;
        if (options?.deferConnection) return;
        this.updateRuntimeConnection();
    }
    /**
	* Start the initial runtime connection if it has not been started yet.
	*
	* Backs {@link CopilotKitCore.connect}. Idempotent: it only kicks off a fetch
	* when a `runtimeUrl` is set and the connection is still `Disconnected` (its
	* state before any connect attempt). `updateRuntimeConnection` flips the
	* status to `Connecting` synchronously, so a second call — e.g. React
	* StrictMode double-invoking the mount effect — bails here. A genuine config
	* change still reconnects through `setRuntimeUrl`/`setRuntimeTransport`. See
	* #5801.
	*/ connectRuntime() {
        if (typeof window === "undefined") return;
        if (!this._runtimeUrl) return;
        if (this._runtimeConnectionStatus !== CopilotKitCoreRuntimeConnectionStatus.Disconnected) return;
        this.updateRuntimeConnection();
    }
    setRuntimeTransport(runtimeTransport) {
        if (this._requestedTransport === runtimeTransport) return;
        this.invalidateInspectorMetadataConnection();
        this._requestedTransport = runtimeTransport;
        this._runtimeTransport = runtimeTransport;
        this.updateRuntimeConnection();
    }
    /**
	* Set all agents at once (for development use)
	*/ setAgents__unsafe_dev_only(agents) {
        Object.entries(agents).forEach(([id, agent])=>{
            if (agent) this.validateAndAssignAgentId(id, agent);
        });
        this.localAgents = agents;
        this._agents = {
            ...this.localAgents,
            ...this.remoteAgents
        };
        this.applyHeadersToAgents(this._agents);
        this.applyCredentialsToAgents(this._agents);
        this.notifyAgentsChanged();
    }
    /**
	* Add a single agent (for development use)
	*/ addAgent__unsafe_dev_only({ id, agent }) {
        this.validateAndAssignAgentId(id, agent);
        this.localAgents[id] = agent;
        this.applyHeadersToAgent(agent);
        this.applyCredentialsToAgent(agent);
        this._agents = {
            ...this.localAgents,
            ...this.remoteAgents
        };
        this.notifyAgentsChanged();
    }
    /**
	* Remove an agent by ID (for development use)
	*/ removeAgent__unsafe_dev_only(id) {
        delete this.localAgents[id];
        this._agents = {
            ...this.localAgents,
            ...this.remoteAgents
        };
        this.notifyAgentsChanged();
    }
    /**
	* Register a proxied agent that routes outbound runtime requests to an
	* existing runtime agent (`runtimeAgentId`) while exposing a distinct local
	* registry id (`agentId`). Throws if `agentId` is already taken by either a
	* local or runtime-discovered agent.
	*
	* Use this to mount multiple frontend agents against a single runtime
	* agent (e.g. a chat-1 / chat-2 pair both proxying to "default") without
	* implicit per-thread cloning. The returned `unregister` removes the proxy
	* from the registry and emits `onAgentsChanged`.
	*/ registerProxiedAgent({ agentId, runtimeAgentId }) {
        if (Object.prototype.hasOwnProperty.call(this._agents, agentId)) throw new Error(`CopilotKitCore.registerProxiedAgent: agentId "${agentId}" is already registered. Pick a different agentId, or unregister the existing agent first.`);
        const friends = this.core;
        const debug = friends.debug;
        const agent = new ProxiedCopilotRuntimeAgent({
            runtimeUrl: this._runtimeUrl,
            agentId,
            runtimeAgentId,
            transport: this._runtimeTransport,
            credentials: friends.credentials,
            runtimeMode: this._runtimeUrl ? this._runtimeConnectionStatus === CopilotKitCoreRuntimeConnectionStatus.Connected ? this._runtimeMode : "pending" : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUNTIME_MODE_SSE"],
            intelligence: this._intelligence,
            debug: debug ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$debug$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveDebugConfig"])(debug) : void 0
        });
        this.applyHeadersToAgent(agent);
        this.localAgents[agentId] = agent;
        this._agents = {
            ...this.localAgents,
            ...this.remoteAgents
        };
        this.notifyAgentsChanged();
        return {
            agent,
            unregister: ()=>{
                if (this.localAgents[agentId] === agent) {
                    delete this.localAgents[agentId];
                    this._agents = {
                        ...this.localAgents,
                        ...this.remoteAgents
                    };
                    this.notifyAgentsChanged();
                }
            }
        };
    }
    /**
	* Get an agent by ID
	*/ getAgent(id) {
        if (id in this._agents) return this._agents[id];
        if (this.runtimeUrl !== void 0 && (this.runtimeConnectionStatus === CopilotKitCoreRuntimeConnectionStatus.Disconnected || this.runtimeConnectionStatus === CopilotKitCoreRuntimeConnectionStatus.Connecting)) return;
        console.warn(`Agent ${id} not found`);
    }
    /**
	* Apply current core headers to an agent, merged ON TOP of the agent's own
	* construction-time headers (the per-agent baseline in `agentOwnHeaders`).
	* Core wins on a key conflict. Non-`HttpAgent` agents are left untouched
	* because only `HttpAgent` carries a `headers` field. See #5635.
	*/ applyHeadersToAgent(agent) {
        if (agent instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HttpAgent"]) {
            if (!this.agentOwnHeaders.has(agent)) this.agentOwnHeaders.set(agent, {
                ...agent.headers
            });
            agent.headers = {
                ...this.agentOwnHeaders.get(agent),
                ...this.core.headers
            };
        }
    }
    /**
	* Apply current headers to all agents
	*/ applyHeadersToAgents(agents) {
        Object.values(agents).forEach((agent)=>{
            this.applyHeadersToAgent(agent);
        });
    }
    /**
	* Apply current credentials to an agent
	*/ applyCredentialsToAgent(agent) {
        if (agent instanceof ProxiedCopilotRuntimeAgent) agent.credentials = this.core.credentials;
    }
    /**
	* Apply current credentials to all agents
	*/ applyCredentialsToAgents(agents) {
        Object.values(agents).forEach((agent)=>{
            this.applyCredentialsToAgent(agent);
        });
    }
    /** Refresh metadata after the Core header snapshot changes. */ handleHeadersChanged() {
        this.inspectorMetadataHeadersGeneration += 1;
        this.setInspectorMetadata(void 0);
        this.refreshInspectorMetadata();
    }
    /** Refresh metadata after the Core credentials mode changes. */ handleCredentialsChanged() {
        this.inspectorMetadataCredentialsGeneration += 1;
        this.setInspectorMetadata(void 0);
        this.refreshInspectorMetadata();
    }
    /**
	* Fetch trusted inspector metadata independently from runtime discovery.
	* Optional-route failures degrade to absent metadata and never affect the
	* runtime connection state.
	*/ async refreshInspectorMetadata() {
        const generation = ++this.inspectorMetadataGeneration;
        this.inspectorMetadataAbortController?.abort();
        this.inspectorMetadataAbortController = void 0;
        if (!this._inspectorMetadataSupported || !this.inspectorMetadataRefreshReady || !this.runtimeUrl || this._runtimeConnectionStatus !== CopilotKitCoreRuntimeConnectionStatus.Connected) {
            this.setInspectorMetadata(void 0);
            return;
        }
        const runtimeUrl = this.runtimeUrl;
        const requestedTransport = this._requestedTransport;
        const resolvedTransport = this._runtimeTransport;
        const headersGeneration = this.inspectorMetadataHeadersGeneration;
        const credentialsGeneration = this.inspectorMetadataCredentialsGeneration;
        const friends = this.core;
        const headers = {
            ...friends.headers
        };
        const credentials = friends.credentials;
        const abortController = new AbortController();
        this.inspectorMetadataAbortController = abortController;
        let timedOut = false;
        let timeoutId;
        let rejectForAbort;
        const aborted = new Promise((_resolve, reject)=>{
            rejectForAbort = reject;
        });
        const handleAbort = ()=>{
            rejectForAbort?.(/* @__PURE__ */ new Error("Inspector metadata request aborted"));
        };
        abortController.signal.addEventListener("abort", handleAbort, {
            once: true
        });
        const timeout = new Promise((_resolve, reject)=>{
            timeoutId = setTimeout(()=>{
                timedOut = true;
                reject(/* @__PURE__ */ new Error("Inspector metadata request timed out"));
                abortController.abort();
            }, INSPECTOR_METADATA_REQUEST_TIMEOUT_MS);
        });
        let nextMetadata;
        try {
            const request = (async ()=>{
                const response = resolvedTransport === "single" ? await this.fetchInspectorMetadataSingle({
                    runtimeUrl,
                    headers,
                    credentials,
                    signal: abortController.signal
                }) : await this.fetchInspectorMetadataRest({
                    runtimeUrl,
                    headers,
                    credentials,
                    signal: abortController.signal
                });
                if (response.status === 204 || !response.ok) return;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$inspector$2d$metadata$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseInspectorMetadataV1"])(await response.json());
            })();
            nextMetadata = await Promise.race([
                request,
                aborted,
                timeout
            ]);
        } catch  {
            nextMetadata = void 0;
        } finally{
            if (timeoutId !== void 0) clearTimeout(timeoutId);
            abortController.signal.removeEventListener("abort", handleAbort);
        }
        if (!this.isInspectorMetadataRequestCurrent({
            generation,
            runtimeUrl,
            requestedTransport,
            resolvedTransport,
            headersGeneration,
            credentialsGeneration,
            signal: abortController.signal,
            allowAbortedSignal: timedOut
        })) return;
        this.inspectorMetadataAbortController = void 0;
        this.setInspectorMetadata(nextMetadata);
    }
    async fetchInspectorMetadataRest({ runtimeUrl, headers, credentials, signal }) {
        return fetch(`${runtimeUrl}/inspector-metadata`, {
            method: "GET",
            headers,
            ...credentials ? {
                credentials
            } : {},
            signal
        });
    }
    async fetchInspectorMetadataSingle({ runtimeUrl, headers, credentials, signal }) {
        return fetch(runtimeUrl, {
            method: "POST",
            headers: withJsonContentType(headers),
            body: JSON.stringify({
                method: "inspector/metadata"
            }),
            ...credentials ? {
                credentials
            } : {},
            signal
        });
    }
    isInspectorMetadataRequestCurrent({ generation, runtimeUrl, requestedTransport, resolvedTransport, headersGeneration, credentialsGeneration, signal, allowAbortedSignal = false }) {
        return (allowAbortedSignal || !signal.aborted) && generation === this.inspectorMetadataGeneration && runtimeUrl === this.runtimeUrl && requestedTransport === this._requestedTransport && resolvedTransport === this._runtimeTransport && headersGeneration === this.inspectorMetadataHeadersGeneration && credentialsGeneration === this.inspectorMetadataCredentialsGeneration && this._inspectorMetadataSupported && this.inspectorMetadataRefreshReady && this._runtimeConnectionStatus === CopilotKitCoreRuntimeConnectionStatus.Connected;
    }
    invalidateInspectorMetadataConnection() {
        this._inspectorMetadataSupported = false;
        this.inspectorMetadataRefreshReady = false;
        this.inspectorMetadataConnectionGeneration += 1;
        this.inspectorMetadataGeneration += 1;
        this.inspectorMetadataAbortController?.abort();
        this.inspectorMetadataAbortController = void 0;
        this.setInspectorMetadata(void 0);
    }
    /**
	* Publish one state transition without making refreshes wait on subscribers.
	* Each queued callback closes over its readonly snapshot so reentrant changes
	* cannot replace the value that an older publication is still delivering.
	*/ setInspectorMetadata(inspectorMetadata) {
        if (JSON.stringify(this._inspectorMetadata) === JSON.stringify(inspectorMetadata)) return;
        this._inspectorMetadata = inspectorMetadata;
        const snapshot = inspectorMetadata;
        this.inspectorMetadataNotificationQueue = this.inspectorMetadataNotificationQueue.then(()=>this.notifyInspectorMetadataChanged(snapshot)).catch((error)=>{
            console.error("Subscriber onInspectorMetadataChanged queue error:", error);
        });
    }
    /**
	* Update runtime connection and fetch remote agents
	*/ async updateRuntimeConnection() {
        if (typeof window === "undefined") return;
        const key = `${this._runtimeUrl ?? ""}::${this._requestedTransport}`;
        const inFlight = this._connectionInFlight;
        if (inFlight && inFlight.key === key) return inFlight.promise;
        const promise = this.performRuntimeConnection();
        this._connectionInFlight = {
            key,
            promise
        };
        promise.finally(()=>{
            if (this._connectionInFlight?.promise === promise) this._connectionInFlight = void 0;
        });
        return promise;
    }
    async performRuntimeConnection() {
        if (!this.runtimeUrl) {
            this.invalidateInspectorMetadataConnection();
            this._runtimeConnectionStatus = CopilotKitCoreRuntimeConnectionStatus.Disconnected;
            this._runtimeVersion = void 0;
            this._audioFileTranscriptionEnabled = false;
            this._runtimeMode = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUNTIME_MODE_SSE"];
            this._intelligence = void 0;
            this._threadEndpoints = void 0;
            this._suggestions = void 0;
            this._a2uiEnabled = false;
            this._a2uiAgents = void 0;
            this._openGenerativeUIEnabled = false;
            this.remoteAgents = {};
            this._agents = this.localAgents;
            await this.notifyRuntimeStatusChanged(CopilotKitCoreRuntimeConnectionStatus.Disconnected);
            await this.notifyAgentsChanged();
            return;
        }
        const inspectorMetadataConnectionGeneration = this.inspectorMetadataConnectionGeneration;
        this._runtimeConnectionStatus = CopilotKitCoreRuntimeConnectionStatus.Connecting;
        await this.notifyRuntimeStatusChanged(CopilotKitCoreRuntimeConnectionStatus.Connecting);
        try {
            if (inspectorMetadataConnectionGeneration !== this.inspectorMetadataConnectionGeneration) return;
            const { runtimeInfo: runtimeInfoResponse, resolvedTransport } = await this.fetchRuntimeInfo();
            if (inspectorMetadataConnectionGeneration !== this.inspectorMetadataConnectionGeneration) return;
            this._runtimeTransport = resolvedTransport;
            const { version, ...runtimeInfo } = runtimeInfoResponse;
            const credentials = this.core.credentials;
            const rawDebug = this.core.debug;
            this.remoteAgents = Object.fromEntries(Object.entries(runtimeInfo.agents).map(([id, { description, capabilities }])=>{
                const existing = Object.prototype.hasOwnProperty.call(this.remoteAgents, id) ? this.remoteAgents[id] : void 0;
                if (existing instanceof ProxiedCopilotRuntimeAgent) {
                    this.applyHeadersToAgent(existing);
                    this.applyCredentialsToAgent(existing);
                    return [
                        id,
                        existing
                    ];
                }
                const agent = new ProxiedCopilotRuntimeAgent({
                    runtimeUrl: this.runtimeUrl,
                    agentId: id,
                    description,
                    transport: this._runtimeTransport,
                    credentials,
                    runtimeMode: runtimeInfoResponse.mode ?? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUNTIME_MODE_SSE"],
                    intelligence: runtimeInfoResponse.intelligence,
                    capabilities,
                    debug: rawDebug ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$debug$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveDebugConfig"])(rawDebug) : void 0
                });
                this.applyHeadersToAgent(agent);
                return [
                    id,
                    agent
                ];
            }));
            this._agents = {
                ...this.localAgents,
                ...this.remoteAgents
            };
            this._runtimeConnectionStatus = CopilotKitCoreRuntimeConnectionStatus.Connected;
            this._runtimeVersion = version;
            this._audioFileTranscriptionEnabled = runtimeInfoResponse.audioFileTranscriptionEnabled ?? false;
            this._runtimeMode = runtimeInfoResponse.mode ?? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUNTIME_MODE_SSE"];
            this._intelligence = runtimeInfoResponse.intelligence;
            this._threadEndpoints = runtimeInfoResponse.threadEndpoints;
            this._suggestions = runtimeInfoResponse.suggestions;
            this._inspectorMetadataSupported = runtimeInfoResponse.inspectorMetadata === true;
            this.inspectorMetadataRefreshReady = false;
            if (!this._inspectorMetadataSupported) this.setInspectorMetadata(void 0);
            const a2uiInfo = runtimeInfoResponse.a2ui;
            this._a2uiEnabled = a2uiInfo?.enabled ?? runtimeInfoResponse.a2uiEnabled ?? false;
            this._a2uiAgents = a2uiInfo?.enabled ? a2uiInfo.agents : void 0;
            this._openGenerativeUIEnabled = runtimeInfoResponse.openGenerativeUIEnabled ?? false;
            this._licenseStatus = runtimeInfoResponse.licenseStatus;
            this._telemetryDisabled = runtimeInfoResponse.telemetryDisabled ?? false;
            await this.notifyRuntimeStatusChanged(CopilotKitCoreRuntimeConnectionStatus.Connected);
            await this.notifyAgentsChanged();
            if (inspectorMetadataConnectionGeneration !== this.inspectorMetadataConnectionGeneration || this._runtimeConnectionStatus !== CopilotKitCoreRuntimeConnectionStatus.Connected) return;
            this.inspectorMetadataRefreshReady = true;
            if (this._inspectorMetadataSupported) this.refreshInspectorMetadata();
        } catch (error) {
            if (inspectorMetadataConnectionGeneration !== this.inspectorMetadataConnectionGeneration) return;
            this.invalidateInspectorMetadataConnection();
            this._runtimeConnectionStatus = CopilotKitCoreRuntimeConnectionStatus.Error;
            this._runtimeVersion = void 0;
            this._audioFileTranscriptionEnabled = false;
            this._runtimeMode = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RUNTIME_MODE_SSE"];
            this._intelligence = void 0;
            this._threadEndpoints = void 0;
            this._suggestions = void 0;
            this._a2uiEnabled = false;
            this._a2uiAgents = void 0;
            this._openGenerativeUIEnabled = false;
            this.remoteAgents = {};
            this._agents = this.localAgents;
            await this.notifyRuntimeStatusChanged(CopilotKitCoreRuntimeConnectionStatus.Error);
            await this.notifyAgentsChanged();
            const message = error instanceof Error ? error.message : JSON.stringify(error);
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$logger$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn(`Failed to load runtime info (${this.runtimeUrl}/info): ${message}`);
            const runtimeError = error instanceof Error ? error : new Error(String(error));
            await this.core.emitError({
                error: runtimeError,
                code: CopilotKitCoreErrorCode.RUNTIME_INFO_FETCH_FAILED,
                context: {
                    runtimeUrl: this.runtimeUrl
                }
            });
        }
    }
    async fetchRuntimeInfo() {
        const runtimeUrl = this.runtimeUrl;
        if (!runtimeUrl) throw new Error("Runtime URL is not set");
        const baseHeaders = this.core.headers;
        const credentials = this.core.credentials;
        const headers = {
            ...baseHeaders
        };
        const runtimeTransport = this._runtimeTransport;
        if (runtimeTransport === "single") return {
            runtimeInfo: await this.fetchRuntimeInfoSingle(runtimeUrl, headers, credentials),
            resolvedTransport: "single"
        };
        if (runtimeTransport === "auto") return this.fetchRuntimeInfoAutoDetect(runtimeUrl, headers, credentials);
        const response = await fetch(`${runtimeUrl}/info`, {
            headers,
            ...credentials ? {
                credentials
            } : {}
        });
        if (!response.ok) throw await runtimeInfoError(response);
        return {
            runtimeInfo: await response.json(),
            resolvedTransport: "rest"
        };
    }
    async fetchRuntimeInfoSingle(runtimeUrl, headers, credentials) {
        const response = await fetch(runtimeUrl, {
            method: "POST",
            headers: withJsonContentType(headers),
            body: JSON.stringify({
                method: "info"
            }),
            ...credentials ? {
                credentials
            } : {}
        });
        if (!response.ok) throw await runtimeInfoError(response);
        return await response.json();
    }
    /**
	* Auto-detect transport by trying REST first, then falling back to single-endpoint.
	* The caller commits the detected transport only after confirming this
	* connection attempt is still current.
	*/ async fetchRuntimeInfoAutoDetect(runtimeUrl, headers, credentials) {
        try {
            const response = await fetch(`${runtimeUrl}/info`, {
                headers: {
                    ...headers
                },
                ...credentials ? {
                    credentials
                } : {}
            });
            if (response.status >= 200 && response.status < 300) return {
                runtimeInfo: await response.json(),
                resolvedTransport: "rest"
            };
        } catch  {}
        return {
            runtimeInfo: await this.fetchRuntimeInfoSingle(runtimeUrl, {
                ...headers
            }, credentials),
            resolvedTransport: "single"
        };
    }
    /**
	* Assign agent IDs to a record of agents
	*/ assignAgentIds(agents) {
        Object.entries(agents).forEach(([id, agent])=>{
            if (agent) this.validateAndAssignAgentId(id, agent);
        });
        return agents;
    }
    /**
	* Validate and assign an agent ID
	*/ validateAndAssignAgentId(registrationId, agent) {
        if (agent.agentId && agent.agentId !== registrationId) throw new Error(`Agent registration mismatch: Agent with ID "${agent.agentId}" cannot be registered under key "${registrationId}". The agent ID must match the registration key or be undefined.`);
        if (!agent.agentId) agent.agentId = registrationId;
    }
    /**
	* Notify subscribers of runtime status changes
	*/ async notifyRuntimeStatusChanged(status) {
        await this.core.notifySubscribers((subscriber)=>subscriber.onRuntimeConnectionStatusChanged?.({
                copilotkit: this.core,
                status
            }), "Error in CopilotKitCore subscriber (onRuntimeConnectionStatusChanged):");
    }
    /**
	* Notify subscribers of agent changes
	*/ async notifyAgentsChanged() {
        await this.core.notifySubscribers((subscriber)=>subscriber.onAgentsChanged?.({
                copilotkit: this.core,
                agents: this._agents
            }), "Subscriber onAgentsChanged error:");
    }
    async notifyInspectorMetadataChanged(inspectorMetadata) {
        await this.core.notifySubscribers((subscriber)=>subscriber.onInspectorMetadataChanged?.({
                copilotkit: this.core,
                inspectorMetadata
            }), "Subscriber onInspectorMetadataChanged error:");
    }
};
//#endregion
//#region src/core/context-store.ts
/**
* Manages context storage and lifecycle for CopilotKitCore.
* Context represents additional information available to agents during execution.
*/ var ContextStore = class {
    _context = {};
    constructor(core){
        this.core = core;
    }
    /**
	* Get all context entries as a readonly record
	*/ get context() {
        return this._context;
    }
    /**
	* Add a new context entry. Pass `agentIds` to restrict the entry to runs of
	* specific agents (#5369); omit it for context every agent should receive.
	* @returns The ID of the created context entry
	*/ addContext({ description, value, agentIds }) {
        const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$random$2d$id$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomUUID"])();
        this._context[id] = {
            description,
            value,
            ...agentIds ? {
                agentIds
            } : {}
        };
        this.notifySubscribers();
        return id;
    }
    /**
	* Build the context array for a run of the given agent: entries scoped to
	* other agents are dropped, and the scoping metadata is stripped so only
	* protocol-shaped `{ description, value }` entries go over the wire.
	*/ getContextForAgent(agentId) {
        return Object.values(this._context).filter((entry)=>!entry.agentIds || agentId !== void 0 && entry.agentIds.includes(agentId)).map(({ description, value })=>({
                description,
                value
            }));
    }
    /**
	* Remove a context entry by ID
	*/ removeContext(id) {
        delete this._context[id];
        this.notifySubscribers();
    }
    /**
	* Notify all subscribers of context changes
	*/ async notifySubscribers() {
        await this.core.notifySubscribers((subscriber)=>subscriber.onContextChanged?.({
                copilotkit: this.core,
                context: this._context
            }), "Subscriber onContextChanged error:");
    }
};
//#endregion
//#region src/core/suggestion-engine.ts
/**
* Manages suggestion generation, streaming, and lifecycle for CopilotKitCore.
* Handles both dynamic (AI-generated) and static suggestions.
*/ var SuggestionEngine = class {
    _suggestionsConfig = {};
    _suggestions = {};
    _runningSuggestions = {};
    constructor(core){
        this.core = core;
    }
    /**
	* Initialize with suggestion configs
	*/ initialize(suggestionsConfig) {
        for (const config of suggestionsConfig)this._suggestionsConfig[(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$random$2d$id$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomUUID"])()] = config;
    }
    /**
	* Add a suggestion configuration
	* @returns The ID of the created config
	*/ addSuggestionsConfig(config) {
        const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$random$2d$id$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomUUID"])();
        this._suggestionsConfig[id] = config;
        this.notifySuggestionsConfigChanged();
        return id;
    }
    /**
	* Remove a suggestion configuration by ID
	*/ removeSuggestionsConfig(id) {
        delete this._suggestionsConfig[id];
        this.notifySuggestionsConfigChanged();
    }
    /**
	* Reload suggestions for a specific agent
	* This triggers generation of new suggestions based on current configs
	*/ reloadSuggestions(agentId) {
        this.clearSuggestions(agentId);
        const agent = this.core.getAgent(agentId);
        const messageCount = agent?.messages?.length ?? 0;
        let hasAnySuggestions = false;
        for (const config of Object.values(this._suggestionsConfig)){
            if (config.consumerAgentId !== void 0 && config.consumerAgentId !== "*" && config.consumerAgentId !== agentId) continue;
            if (!this.shouldShowSuggestions(config, messageCount)) continue;
            const suggestionId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$random$2d$id$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomUUID"])();
            if (isDynamicSuggestionsConfig(config)) {
                if (!agent) continue;
                if (!hasAnySuggestions) {
                    hasAnySuggestions = true;
                    this.notifySuggestionsStartedLoading(agentId);
                }
                this.generateSuggestions(suggestionId, config, agentId);
            } else if (isStaticSuggestionsConfig(config)) this.addStaticSuggestions(suggestionId, config, agentId);
        }
    }
    /**
	* Clear all suggestions for a specific agent
	*/ clearSuggestions(agentId) {
        const runningAgents = this._runningSuggestions[agentId];
        if (runningAgents) {
            for (const agent of runningAgents)agent.abortRun();
            delete this._runningSuggestions[agentId];
        }
        this._suggestions[agentId] = {};
        this.notifySuggestionsChanged(agentId, []);
    }
    /**
	* Get current suggestions for an agent
	*/ getSuggestions(agentId) {
        return {
            suggestions: Object.values(this._suggestions[agentId] ?? {}).flat(),
            isLoading: (this._runningSuggestions[agentId]?.length ?? 0) > 0
        };
    }
    /**
	* Generate suggestions by running a provider agent and extracting the
	* `copilotkitSuggest` tool call from its streamed messages.
	*
	* Two transports, one set of mechanics: both seed an agent with the
	* consumer's messages + state and the instruction, then `runAgent` with
	* forced `copilotkitSuggest` tool choice, parsing suggestions as messages
	* stream in via `onMessagesChanged`.
	*
	* - **Stateless** (runtime advertises `suggestions` and transport isn't
	*   `single`): a stock `HttpAgent` pointed at `/agent/:id/suggest`. That
	*   endpoint runs the provider directly and streams AG-UI SSE **without**
	*   persisting a thread, and a plain `HttpAgent` only ever speaks REST SSE —
	*   it never routes through the Intelligence websocket delegate (which would
	*   persist a thread). This is the path that removes the thread flood.
	* - **Fallback** (capability absent → old runtime, or `single` transport):
	*   clone the provider agent and run it client-side, as before.
	*
	* Gated to non-`single` transports because this client only builds the
	* multi-route `/agent/:id/suggest` URL; single-route deployments (not the
	* persisting-thread/Intelligence case) fall through to the clone fallback.
	*/ async generateSuggestions(suggestionId, config, consumerAgentId) {
        let runHandle = void 0;
        let aborted = false;
        try {
            const friends = this.core;
            const resolvedProviderAgentId = config.providerAgentId ?? "default";
            const suggestionsProviderAgent = friends.getAgent(resolvedProviderAgentId);
            if (!suggestionsProviderAgent) throw new Error(`Suggestions provider agent not found: ${resolvedProviderAgentId}`);
            const suggestionsConsumerAgent = friends.getAgent(consumerAgentId);
            if (!suggestionsConsumerAgent) throw new Error(`Suggestions consumer agent not found: ${consumerAgentId}`);
            const instructionContent = [
                `Suggest what the user could say next. Provide clear, highly relevant suggestions by calling the \`copilotkitSuggest\` tool.`,
                `Provide at least ${config.minSuggestions ?? 1} and at most ${config.maxSuggestions ?? 3} suggestions.`,
                `The user has the following tools available: ${JSON.stringify(friends.buildFrontendTools(consumerAgentId))}.`,
                ` ${config.instructions}`
            ].join("\n");
            this._suggestions[consumerAgentId] = {
                ...this._suggestions[consumerAgentId],
                [suggestionId]: []
            };
            const seededMessages = JSON.parse(JSON.stringify(suggestionsConsumerAgent.messages));
            const seededState = JSON.parse(JSON.stringify(suggestionsConsumerAgent.state ?? {}));
            const useStateless = this.core.suggestions === true && this.core.runtimeTransport !== "single";
            let suggestionAgent;
            if (useStateless) {
                const suggestUrl = `${this.core.runtimeUrl}/agent/${encodeURIComponent(resolvedProviderAgentId)}/suggest`;
                const credentials = this.core.credentials;
                suggestionAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HttpAgent"]({
                    agentId: resolvedProviderAgentId,
                    url: suggestUrl,
                    headers: {
                        ...this.core.headers
                    },
                    ...credentials ? {
                        fetch: (url, requestInit)=>fetch(url, {
                                ...requestInit,
                                credentials
                            })
                    } : {}
                });
            } else suggestionAgent = suggestionsProviderAgent.clone();
            suggestionAgent.threadId = suggestionId;
            suggestionAgent.setMessages(seededMessages);
            suggestionAgent.setState(seededState);
            runHandle = {
                abortRun: ()=>{
                    aborted = true;
                    suggestionAgent.abortRun();
                }
            };
            this._runningSuggestions[consumerAgentId] = [
                ...this._runningSuggestions[consumerAgentId] ?? [],
                runHandle
            ];
            suggestionAgent.addMessage({
                id: suggestionId,
                role: "user",
                content: instructionContent
            });
            await suggestionAgent.runAgent({
                context: friends.getContextForAgent(consumerAgentId),
                forwardedProps: {
                    ...friends.properties,
                    toolChoice: {
                        type: "function",
                        function: {
                            name: "copilotkitSuggest"
                        }
                    }
                },
                tools: [
                    SUGGEST_TOOL
                ]
            }, {
                onMessagesChanged: ({ messages })=>{
                    this.extractSuggestions(messages, suggestionId, consumerAgentId, true);
                }
            });
        } catch (error) {
            if (!isAbortError(error) && !aborted) console.warn("Error generating suggestions:", error);
        } finally{
            this.finalizeSuggestions(suggestionId, consumerAgentId);
            const runningAgents = this._runningSuggestions[consumerAgentId];
            const remaining = runHandle ? (runningAgents ?? []).filter((a)=>a !== runHandle) : runningAgents ?? [];
            if (remaining.length === 0) {
                delete this._runningSuggestions[consumerAgentId];
                await this.notifySuggestionsFinishedLoading(consumerAgentId);
            } else this._runningSuggestions[consumerAgentId] = remaining;
        }
    }
    /**
	* Finalize suggestions by marking them as no longer loading
	*/ finalizeSuggestions(suggestionId, consumerAgentId) {
        const agentSuggestions = this._suggestions[consumerAgentId];
        const currentSuggestions = agentSuggestions?.[suggestionId];
        if (agentSuggestions && currentSuggestions && currentSuggestions.length > 0) {
            const finalizedSuggestions = currentSuggestions.filter((suggestion)=>suggestion.title !== "" || suggestion.message !== "").map((suggestion)=>({
                    ...suggestion,
                    isLoading: false
                }));
            if (finalizedSuggestions.length > 0) agentSuggestions[suggestionId] = finalizedSuggestions;
            else delete agentSuggestions[suggestionId];
            const allSuggestions = Object.values(this._suggestions[consumerAgentId] ?? {}).flat();
            this.notifySuggestionsChanged(consumerAgentId, allSuggestions, "finalized");
        }
    }
    /**
	* Extract suggestions from messages (called during streaming)
	*/ extractSuggestions(messages, suggestionId, consumerAgentId, isRunning) {
        const idx = messages.findIndex((message)=>message.id === suggestionId);
        if (idx == -1) return;
        const suggestions = [];
        const newMessages = messages.slice(idx + 1);
        for (const message of newMessages)if (message.role === "assistant" && message.toolCalls) {
            for (const toolCall of message.toolCalls)if (toolCall.function.name === "copilotkitSuggest") {
                const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["partialJSONParse"])(Array.isArray(toolCall.function.arguments) ? toolCall.function.arguments.join("") : toolCall.function.arguments);
                if (parsed && typeof parsed === "object" && "suggestions" in parsed) {
                    const parsedSuggestions = parsed.suggestions;
                    if (Array.isArray(parsedSuggestions)) {
                        for (const item of parsedSuggestions)if (item && typeof item === "object" && "title" in item) suggestions.push({
                            title: item.title ?? "",
                            message: item.message ?? "",
                            isLoading: false
                        });
                    }
                }
            }
        }
        if (isRunning && suggestions.length > 0) suggestions[suggestions.length - 1].isLoading = true;
        const agentSuggestions = this._suggestions[consumerAgentId];
        if (agentSuggestions) {
            agentSuggestions[suggestionId] = suggestions;
            const allSuggestions = Object.values(this._suggestions[consumerAgentId] ?? {}).flat();
            this.notifySuggestionsChanged(consumerAgentId, allSuggestions, "suggestions changed");
        }
    }
    /**
	* Notify subscribers of suggestions config changes
	*/ async notifySuggestionsConfigChanged() {
        await this.core.notifySubscribers((subscriber)=>subscriber.onSuggestionsConfigChanged?.({
                copilotkit: this.core,
                suggestionsConfig: this._suggestionsConfig
            }), "Subscriber onSuggestionsConfigChanged error:");
    }
    /**
	* Notify subscribers of suggestions changes
	*/ async notifySuggestionsChanged(agentId, suggestions, context = "") {
        await this.core.notifySubscribers((subscriber)=>subscriber.onSuggestionsChanged?.({
                copilotkit: this.core,
                agentId,
                suggestions
            }), `Subscriber onSuggestionsChanged error: ${context}`);
    }
    /**
	* Notify subscribers that suggestions started loading
	*/ async notifySuggestionsStartedLoading(agentId) {
        await this.core.notifySubscribers((subscriber)=>subscriber.onSuggestionsStartedLoading?.({
                copilotkit: this.core,
                agentId
            }), "Subscriber onSuggestionsStartedLoading error:");
    }
    /**
	* Notify subscribers that suggestions finished loading
	*/ async notifySuggestionsFinishedLoading(agentId) {
        await this.core.notifySubscribers((subscriber)=>subscriber.onSuggestionsFinishedLoading?.({
                copilotkit: this.core,
                agentId
            }), "Subscriber onSuggestionsFinishedLoading error:");
    }
    /**
	* Check if suggestions should be shown based on availability and message count
	*/ shouldShowSuggestions(config, messageCount) {
        const availability = config.available;
        if (!availability) if (isDynamicSuggestionsConfig(config)) return messageCount > 0;
        else return messageCount === 0;
        switch(availability){
            case "disabled":
                return false;
            case "before-first-message":
                return messageCount === 0;
            case "after-first-message":
                return messageCount > 0;
            case "always":
                return true;
            default:
                return false;
        }
    }
    /**
	* Add static suggestions directly without AI generation
	*/ addStaticSuggestions(suggestionId, config, consumerAgentId) {
        const suggestions = config.suggestions.map((s)=>({
                ...s,
                isLoading: false
            }));
        this._suggestions[consumerAgentId] = {
            ...this._suggestions[consumerAgentId],
            [suggestionId]: suggestions
        };
        const allSuggestions = Object.values(this._suggestions[consumerAgentId] ?? {}).flat();
        this.notifySuggestionsChanged(consumerAgentId, allSuggestions, "static suggestions added");
    }
};
/**
* Detects an `AbortController`-driven cancellation so the stateless path can
* treat it as an expected (non-error) outcome on clear/reload.
*/ function isAbortError(error) {
    return typeof error === "object" && error !== null && "name" in error && error.name === "AbortError";
}
/**
* Type guard for dynamic suggestions config
*/ function isDynamicSuggestionsConfig(config) {
    return "instructions" in config;
}
/**
* Type guard for static suggestions config
*/ function isStaticSuggestionsConfig(config) {
    return "suggestions" in config;
}
/**
* The tool definition for AI-generated suggestions
*/ const SUGGEST_TOOL = {
    name: "copilotkitSuggest",
    description: "Suggest what the user could say next",
    parameters: {
        type: "object",
        properties: {
            suggestions: {
                type: "array",
                description: "List of suggestions shown to the user as buttons.",
                items: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            description: "The title of the suggestion. This is shown as a button and should be short."
                        },
                        message: {
                            type: "string",
                            description: "The message to send when the suggestion is clicked. This should be a clear, complete sentence and will be sent as an instruction to the AI."
                        }
                    },
                    required: [
                        "title",
                        "message"
                    ]
                }
            }
        },
        required: [
            "suggestions"
        ]
    }
};
//#endregion
//#region src/core/tool-result-content.ts
/**
* Single authority for the forwarded-to-client sentinel used by StateManager
* and RunHandler.
*/ const FORWARDED_TO_CLIENT = "Forwarded to client";
function normalizeToolResultContent(content) {
    if (typeof content === "string") return content.trim();
    if (Array.isArray(content)) {
        const text = content.flatMap((part)=>{
            if (typeof part === "string") return [
                part
            ];
            if (part && typeof part === "object" && "text" in part && typeof part.text === "string") return [
                part.text
            ];
            return [];
        }).join("").trim();
        return text.length > 0 ? text : null;
    }
    if (content && typeof content === "object" && "text" in content && typeof content.text === "string") return content.text.trim();
    return null;
}
function isForwardedToClientPlaceholder(content) {
    return normalizeToolResultContent(content) === FORWARDED_TO_CLIENT;
}
//#endregion
//#region src/core/run-handler.ts
/**
* Absolute safety cap on the depth of recursive follow-up runs triggered by
* `processAgentResult`. Without this, any scenario that keeps
* `needsFollowUp = true` (e.g. the LLM repeatedly calling the same tool, a
* backend that errors after receiving tool results, or input processors that
* reprocess tool messages) would loop indefinitely, silently consuming API
* quota and potentially DOS'ing the backend.
*
* The cap is deliberately high so that legitimate multi-step agent workflows
* (search → fill form → confirm → update → send email, etc.) are never
* affected; it only trips on runaway recursion.
*/ const MAX_FOLLOW_UP_DEPTH = 100;
/**
* Handles agent execution, tool calling, and agent connectivity for CopilotKitCore.
* Manages the complete lifecycle of agent runs including tool execution and follow-ups.
*/ var RunHandler = class {
    _tools = [];
    /**
	* The full list of A2UI catalog components registered by the provider.
	* Order is preserved for display in the inspector.
	*/ _catalogComponents = [];
    /**
	* Names of catalog components the caller has explicitly disabled. A name
	* absent from this set is enabled (default). Survives re-registration so a
	* catalog identity change does not silently re-enable a disabled component.
	*/ _disabledCatalogComponents = /* @__PURE__ */ new Set();
    /**
	* Keys of frontend tools explicitly disabled at runtime via the Inspector's
	* Capabilities tool (`setToolEnabled`). Kept independently of each tool's own
	* `available` flag so a hook re-registering the tool (which resets
	* `available`) does not clobber the override. Key = `capabilityKey(name, agentId)`.
	*/ _disabledToolKeys = /* @__PURE__ */ new Set();
    /**
	* Tracks whether the current run (including in-flight tool execution)
	* has been aborted via `stopAgent()` or `agent.abortRun()`. Created
	* fresh in `runAgent()`, aborted by `abortCurrentRun()`.
	*/ _runAbortController = null;
    /**
	* Tracks recursive `runAgent` depth so that the abort controller and
	* `agent.abortRun()` intercept are only set up / torn down at the
	* top-level call, not on follow-up recursive calls from
	* `processAgentResult`.
	*/ _runDepth = 0;
    /**
	* Tracks the threadId of the most recent `connectAgent` call so we
	* can distinguish a fresh thread restore (different threadId than
	* last time — chat is rebuilding state from scratch, must clear
	* messages/state and ask the gateway for a full replay) from a
	* same-thread churn re-connect (effect-dep churn or transient
	* disconnect — local messages/state are still meaningful, must
	* preserve them and let the gateway resume from
	* `lastSeenEventId`).
	*
	* Tyler's bug fired because every `connectAgent` was treated as a
	* fresh restore, which forced the gateway to replay the full
	* thread history on every churn re-connect and amplified the
	* downstream churn into duplicate `cpki_event_id` rows in the
	* inspector and intermittent "Message not found" toasts.
	*/ _lastConnectedThreadIdsByAgent = /* @__PURE__ */ new Map();
    _anonymousAgentIds = /* @__PURE__ */ new WeakMap();
    _nextAnonymousAgentId = 0;
    constructor(core){
        this.core = core;
    }
    /**
	* Abort the current run. Called by `CopilotKitCore.stopAgent()` to signal
	* that in-flight tool handlers should stop and `processAgentResult` should
	* not start a follow-up run.
	*/ abortCurrentRun() {
        this._runAbortController?.abort();
    }
    /**
	* Typed access to CopilotKitCore's internal ("friend") methods.
	* Centralises the single unavoidable cast so call-sites stay clean.
	*/ get _internal() {
        return this.core;
    }
    /**
	* Return a stable restore-tracking key for the logical agent being
	* connected. Named agents share their last-thread marker across proxy
	* instances; anonymous agents fall back to object identity.
	*/ getConnectRestoreKey(agent) {
        if (agent.agentId) return `agent:${agent.agentId}`;
        const existing = this._anonymousAgentIds.get(agent);
        if (existing) return existing;
        const anonymousId = `anonymous:${this._nextAnonymousAgentId}`;
        this._nextAnonymousAgentId += 1;
        this._anonymousAgentIds.set(agent, anonymousId);
        return anonymousId;
    }
    /**
	* Get all tools as a readonly array
	*/ get tools() {
        return this._tools;
    }
    /**
	* Initialize with tools
	*/ initialize(tools) {
        this._tools = tools;
    }
    /**
	* Add a tool to the registry
	*/ addTool(tool) {
        if (this._tools.findIndex((t)=>t.name === tool.name && t.agentId === tool.agentId) !== -1) {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$logger$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn(`Tool already exists: '${tool.name}' for agent '${tool.agentId || "global"}', skipping.`);
            return;
        }
        this._tools.push(tool);
    }
    /**
	* Remove a tool by name and optionally by agentId
	*/ removeTool(id, agentId) {
        this._tools = this._tools.filter((tool)=>{
            if (agentId !== void 0) return !(tool.name === id && tool.agentId === agentId);
            return !(tool.name === id && !tool.agentId);
        });
    }
    /**
	* Get a tool by name and optionally by agentId.
	* If agentId is provided, it will first look for an agent-specific tool,
	* then fall back to a global tool with the same name.
	*/ getTool(params) {
        const { toolName, agentId } = params;
        if (agentId) {
            const agentTool = this._tools.find((tool)=>tool.name === toolName && tool.agentId === agentId);
            if (agentTool) return agentTool;
        }
        return this._tools.find((tool)=>tool.name === toolName && !tool.agentId);
    }
    /**
	* Set all tools at once. Replaces existing tools.
	*/ setTools(tools) {
        this._tools = [
            ...tools
        ];
    }
    /**
	* Return the registered A2UI catalog components (readonly).
	*/ get catalogComponents() {
        return this._catalogComponents;
    }
    /**
	* Replace the registered catalog component list. Preserves the disabled set
	* (by name) so re-registration does not re-enable disabled components.
	*/ setCatalogComponents(components) {
        this._catalogComponents = [
            ...components
        ];
    }
    /**
	* Enable or disable a catalog component by name.
	*/ setCatalogComponentEnabled(name, enabled) {
        if (enabled) this._disabledCatalogComponents.delete(name);
        else this._disabledCatalogComponents.add(name);
    }
    /**
	* Whether a catalog component is enabled. Unknown names default to enabled.
	*/ isCatalogComponentEnabled(name) {
        return !this._disabledCatalogComponents.has(name);
    }
    /**
	* Connect an agent (establish initial connection)
	*/ async connectAgent({ agent }) {
        const incomingThreadId = agent.threadId ?? null;
        try {
            const restoreKey = this.getConnectRestoreKey(agent);
            const isFreshRestore = incomingThreadId !== (this._lastConnectedThreadIdsByAgent.get(restoreKey) ?? null);
            this._lastConnectedThreadIdsByAgent.set(restoreKey, incomingThreadId);
            await agent.detachActiveRun();
            if (isFreshRestore) {
                agent.setMessages([]);
                agent.setState({});
                const cursorAware = agent;
                if (incomingThreadId) {
                    if (typeof cursorAware.clearReplayCursor === "function") cursorAware.clearReplayCursor(incomingThreadId);
                    if (typeof cursorAware.clearReconnectCursor === "function") cursorAware.clearReconnectCursor(incomingThreadId);
                }
            }
            this._internal.applyHeadersToAgent(agent);
            await this._internal.notifySubscribers((subscriber)=>subscriber.onAgentRunStarted?.({
                    copilotkit: this.core,
                    agent
                }), "Subscriber onAgentRunStarted error:");
            const runAgentResult = await agent.connectAgent({
                forwardedProps: this._internal.properties,
                tools: this.buildFrontendTools(agent.agentId),
                context: this._internal.getContextForAgent(agent.agentId)
            }, this.createAgentErrorSubscriber(agent));
            return this.processAgentResult({
                runAgentResult,
                agent,
                executeFrontendTools: false
            });
        } catch (error) {
            const connectError = error instanceof Error ? error : new Error(String(error));
            if (!(connectError.name === "AbortError" || connectError.message === "Fetch is aborted" || connectError.message === "signal is aborted without reason" || connectError.message === "component unmounted")) {
                const context = {};
                if (agent.agentId) context.agentId = agent.agentId;
                if (incomingThreadId) context.threadId = incomingThreadId;
                await this._internal.emitError({
                    error: connectError,
                    code: CopilotKitCoreErrorCode.AGENT_CONNECT_FAILED,
                    context
                });
            }
            return {
                result: void 0,
                newMessages: []
            };
        }
    }
    /**
	* Run an agent
	*/ async runAgent({ agent, forwardedProps, resume, runId }, continuationHandoff) {
        if (agent.agentId) this._internal.suggestionEngine.clearSuggestions(agent.agentId);
        this._internal.applyHeadersToAgent(agent);
        if (agent.detachActiveRun) try {
            await agent.detachActiveRun();
        } catch (error) {
            continuationHandoff?.cancel();
            throw error;
        }
        const isTopLevel = this._runDepth === 0;
        let originalAbortRun;
        if (isTopLevel) {
            this._runAbortController = new AbortController();
            const controller = this._runAbortController;
            originalAbortRun = agent.abortRun.bind(agent);
            agent.abortRun = ()=>{
                controller.abort();
                originalAbortRun();
            };
            await this._internal.notifySubscribers((subscriber)=>subscriber.onAgentRunStarted?.({
                    copilotkit: this.core,
                    agent
                }), "Subscriber onAgentRunStarted error:");
        }
        this._runDepth++;
        try {
            let logicalRunId = runId;
            const agentSubscriber = this.createAgentErrorSubscriber(agent);
            let started = false;
            const onRunStartedEvent = agentSubscriber.onRunStartedEvent;
            const onRunInitialized = agentSubscriber.onRunInitialized;
            agentSubscriber.onRunInitialized = async (params)=>{
                continuationHandoff?.bind(params.input);
                return onRunInitialized?.(params);
            };
            agentSubscriber.onRunStartedEvent = async (params)=>{
                started = true;
                if (!continuationHandoff) logicalRunId = params.input.runId;
                return onRunStartedEvent?.(params);
            };
            const pinRunIdOnWire = runId !== void 0 && !continuationHandoff;
            const agentRunInput = {
                forwardedProps: {
                    ...this._internal.properties,
                    ...forwardedProps
                },
                ...resume !== void 0 ? {
                    resume
                } : {},
                ...pinRunIdOnWire ? {
                    runId
                } : {},
                tools: this.buildFrontendTools(agent.agentId),
                context: this._internal.getContextForAgent(agent.agentId)
            };
            const runAgentResult = await agent.runAgent(agentRunInput, agentSubscriber);
            if (!started) continuationHandoff?.cancel();
            return await this.processAgentResult({
                runAgentResult,
                agent,
                runId: logicalRunId
            });
        } catch (error) {
            continuationHandoff?.cancel();
            const runError = error instanceof Error ? error : new Error(String(error));
            const context = {};
            if (agent.agentId) context.agentId = agent.agentId;
            await this._internal.emitError({
                error: runError,
                code: CopilotKitCoreErrorCode.AGENT_RUN_FAILED,
                context
            });
            return {
                result: void 0,
                newMessages: []
            };
        } finally{
            this._runDepth--;
            if (isTopLevel && originalAbortRun) agent.abortRun = originalAbortRun;
        }
    }
    /**
	* Process agent result and execute tools
	*/ async processAgentResult({ runAgentResult, agent, runId, executeFrontendTools = true }) {
        const { newMessages } = runAgentResult;
        const agentId = agent.agentId;
        let needsFollowUp = false;
        if (executeFrontendTools) {
            for (const message of newMessages)if (message.role === "assistant") for (const toolCall of message.toolCalls || []){
                const tool = this.getTool({
                    toolName: toolCall.function.name,
                    agentId: agent.agentId
                });
                let wildcardTool;
                const getWildcardTool = ()=>{
                    if (tool || wildcardTool) return wildcardTool;
                    wildcardTool = this.getTool({
                        toolName: "*",
                        agentId: agent.agentId
                    });
                    return wildcardTool;
                };
                let existingResultIndex = newMessages.findIndex((m)=>m.role === "tool" && m.toolCallId === toolCall.id);
                const existingResult = existingResultIndex === -1 ? void 0 : newMessages[existingResultIndex];
                const executableTool = tool ?? getWildcardTool();
                if (existingResult && executableTool?.handler && this.isFrontendPlaceholderResult(existingResult)) {
                    newMessages.splice(existingResultIndex, 1);
                    existingResultIndex = -1;
                    const agentMsgIdx = agent.messages.findIndex((m)=>m.role === "tool" && m.toolCallId === toolCall.id);
                    if (agentMsgIdx !== -1) agent.messages.splice(agentMsgIdx, 1);
                }
                if (existingResultIndex === -1) if (tool) {
                    if (await this.executeSpecificTool(tool, toolCall, message, agent, agentId)) needsFollowUp = true;
                } else {
                    const fallbackTool = getWildcardTool();
                    if (fallbackTool) {
                        if (await this.executeWildcardTool(fallbackTool, toolCall, message, agent, agentId)) needsFollowUp = true;
                    }
                }
            }
        }
        if (needsFollowUp && !this._runAbortController?.signal.aborted) if (this._runDepth >= MAX_FOLLOW_UP_DEPTH) __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$logger$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn(`[CopilotKit] Follow-up depth limit (${MAX_FOLLOW_UP_DEPTH}) reached for agent "${agentId}". Stopping recursive follow-up runs to prevent an infinite loop. This usually indicates a tool that keeps requesting a follow-up (e.g. the LLM repeatedly calling the same tool). Consider setting "followUp: false" on the offending tool.`);
        else {
            await this._internal.waitForPendingFrameworkUpdates();
            const continuationHandoff = this._internal.stateManager.markNextRunAsContinuation(agent, runId);
            return await this.runAgent({
                agent,
                ...runId !== void 0 ? {
                    runId
                } : {}
            }, continuationHandoff);
        }
        this._internal.suggestionEngine.reloadSuggestions(agentId);
        return runAgentResult;
    }
    isFrontendPlaceholderResult(message) {
        return message.role === "tool" && isForwardedToClientPlaceholder(message.content);
    }
    /**
	* Shared handler execution logic used by executeSpecificTool, executeWildcardTool, and runTool.
	* Handles arg parsing, subscriber notifications, handler invocation, result stringification,
	* and error handling.
	*/ async executeToolHandler({ tool, toolCall, agent, agentId, handlerArgs, toolType, messageId }) {
        let toolCallResult = "";
        let errorMessage;
        let isArgumentError = false;
        let parsedArgs;
        try {
            parsedArgs = parseToolArguments(handlerArgs, toolCall.function.name);
        } catch (error) {
            const parseError = error instanceof Error ? error : new Error(String(error));
            errorMessage = parseError.message;
            isArgumentError = true;
            await this._internal.emitError({
                error: parseError,
                code: CopilotKitCoreErrorCode.TOOL_ARGUMENT_PARSE_FAILED,
                context: {
                    agentId,
                    toolCallId: toolCall.id,
                    toolName: toolCall.function.name,
                    rawArguments: handlerArgs,
                    toolType,
                    ...messageId ? {
                        messageId
                    } : {}
                }
            });
        }
        await this._internal.notifySubscribers((subscriber)=>subscriber.onToolExecutionStart?.({
                copilotkit: this.core,
                toolCallId: toolCall.id,
                agentId,
                toolName: toolCall.function.name,
                args: parsedArgs
            }), "Subscriber onToolExecutionStart error:");
        if (!errorMessage) try {
            const result = await tool.handler(parsedArgs, {
                toolCall,
                agent,
                signal: this._runAbortController?.signal
            });
            if (result === void 0 || result === null) toolCallResult = "";
            else if (typeof result === "string") toolCallResult = result;
            else toolCallResult = JSON.stringify(result);
        } catch (error) {
            const handlerError = error instanceof Error ? error : new Error(String(error));
            errorMessage = handlerError.message;
            await this._internal.emitError({
                error: handlerError,
                code: CopilotKitCoreErrorCode.TOOL_HANDLER_FAILED,
                context: {
                    agentId,
                    toolCallId: toolCall.id,
                    toolName: toolCall.function.name,
                    parsedArgs,
                    toolType,
                    ...messageId ? {
                        messageId
                    } : {}
                }
            });
        }
        if (errorMessage) toolCallResult = `Error: ${errorMessage}`;
        await this._internal.notifySubscribers((subscriber)=>subscriber.onToolExecutionEnd?.({
                copilotkit: this.core,
                toolCallId: toolCall.id,
                agentId,
                toolName: toolCall.function.name,
                result: errorMessage ? "" : toolCallResult,
                error: errorMessage
            }), "Subscriber onToolExecutionEnd error:");
        return {
            result: toolCallResult,
            error: errorMessage,
            isArgumentError
        };
    }
    /**
	* Execute a specific tool
	*/ async executeSpecificTool(tool, toolCall, message, agent, agentId) {
        if (tool?.agentId && tool.agentId !== agent.agentId) return false;
        let handlerResult = {
            result: "",
            error: void 0,
            isArgumentError: false
        };
        if (tool?.handler) handlerResult = await this.executeToolHandler({
            tool,
            toolCall,
            agent,
            agentId,
            handlerArgs: toolCall.function.arguments,
            toolType: "specific",
            messageId: message.id
        });
        {
            const messageIndex = agent.messages.findIndex((m)=>m.id === message.id);
            if (messageIndex === -1) return false;
            let insertAt = messageIndex + 1;
            while(insertAt < agent.messages.length && agent.messages[insertAt]?.role === "tool")insertAt++;
            const toolMessage = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$random$2d$id$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomUUID"])(),
                role: "tool",
                toolCallId: toolCall.id,
                content: handlerResult.result
            };
            agent.messages.splice(insertAt, 0, toolMessage);
            if (!handlerResult.error && tool?.followUp !== false) return true;
        }
        return false;
    }
    /**
	* Execute a wildcard tool.
	* Wildcard tools receive args wrapped as `{toolName, args}`, which differs from
	* specific tools, so this method keeps its own arg-wrapping logic rather than
	* delegating to `executeToolHandler`.
	*/ async executeWildcardTool(wildcardTool, toolCall, message, agent, agentId) {
        if (wildcardTool?.agentId && wildcardTool.agentId !== agent.agentId) return false;
        let toolCallResult = "";
        let errorMessage;
        if (wildcardTool?.handler) {
            let parsedArgs;
            try {
                parsedArgs = parseToolArguments(toolCall.function.arguments, toolCall.function.name);
            } catch (error) {
                const parseError = error instanceof Error ? error : new Error(String(error));
                errorMessage = parseError.message;
                await this._internal.emitError({
                    error: parseError,
                    code: CopilotKitCoreErrorCode.TOOL_ARGUMENT_PARSE_FAILED,
                    context: {
                        agentId,
                        toolCallId: toolCall.id,
                        toolName: toolCall.function.name,
                        rawArguments: toolCall.function.arguments,
                        toolType: "wildcard",
                        messageId: message.id
                    }
                });
            }
            const wildcardArgs = {
                toolName: toolCall.function.name,
                args: parsedArgs
            };
            await this._internal.notifySubscribers((subscriber)=>subscriber.onToolExecutionStart?.({
                    copilotkit: this.core,
                    toolCallId: toolCall.id,
                    agentId,
                    toolName: toolCall.function.name,
                    args: wildcardArgs
                }), "Subscriber onToolExecutionStart error:");
            if (!errorMessage) try {
                const result = await wildcardTool.handler(wildcardArgs, {
                    toolCall,
                    agent
                });
                if (result === void 0 || result === null) toolCallResult = "";
                else if (typeof result === "string") toolCallResult = result;
                else toolCallResult = JSON.stringify(result);
            } catch (error) {
                const handlerError = error instanceof Error ? error : new Error(String(error));
                errorMessage = handlerError.message;
                await this._internal.emitError({
                    error: handlerError,
                    code: CopilotKitCoreErrorCode.TOOL_HANDLER_FAILED,
                    context: {
                        agentId,
                        toolCallId: toolCall.id,
                        toolName: toolCall.function.name,
                        parsedArgs: wildcardArgs,
                        toolType: "wildcard",
                        messageId: message.id
                    }
                });
            }
            if (errorMessage) toolCallResult = `Error: ${errorMessage}`;
            await this._internal.notifySubscribers((subscriber)=>subscriber.onToolExecutionEnd?.({
                    copilotkit: this.core,
                    toolCallId: toolCall.id,
                    agentId,
                    toolName: toolCall.function.name,
                    result: errorMessage ? "" : toolCallResult,
                    error: errorMessage
                }), "Subscriber onToolExecutionEnd error:");
        }
        {
            const messageIndex = agent.messages.findIndex((m)=>m.id === message.id);
            if (messageIndex === -1) return false;
            let insertAt = messageIndex + 1;
            while(insertAt < agent.messages.length && agent.messages[insertAt]?.role === "tool")insertAt++;
            const toolMessage = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$random$2d$id$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomUUID"])(),
                role: "tool",
                toolCallId: toolCall.id,
                content: toolCallResult
            };
            agent.messages.splice(insertAt, 0, toolMessage);
            if (!errorMessage && wildcardTool?.followUp !== false) return true;
        }
        return false;
    }
    /**
	* Programmatically execute a registered frontend tool without going through an LLM turn.
	* The handler runs, render components show up in the UI, and both the tool call and
	* result messages are added to `agent.messages`.
	*/ async runTool(params) {
        const { name, agentId, parameters = {}, followUp = false } = params;
        const tool = this.getTool({
            toolName: name,
            agentId
        });
        if (!tool) {
            const error = /* @__PURE__ */ new Error(`Tool not found: ${name}`);
            await this._internal.emitError({
                error,
                code: CopilotKitCoreErrorCode.TOOL_NOT_FOUND,
                context: {
                    toolName: name,
                    agentId
                }
            });
            throw error;
        }
        const resolvedAgentId = agentId ?? "default";
        const agent = this._internal.getAgent(resolvedAgentId);
        if (!agent) {
            const error = /* @__PURE__ */ new Error(`Agent not found: ${resolvedAgentId}`);
            await this._internal.emitError({
                error,
                code: CopilotKitCoreErrorCode.AGENT_NOT_FOUND,
                context: {
                    agentId: resolvedAgentId
                }
            });
            throw error;
        }
        const toolCallId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$random$2d$id$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomUUID"])();
        const assistantToolCall = {
            id: toolCallId,
            type: "function",
            function: {
                name,
                arguments: JSON.stringify(parameters)
            }
        };
        const assistantMessage = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$random$2d$id$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomUUID"])(),
            role: "assistant",
            content: "",
            toolCalls: [
                assistantToolCall
            ]
        };
        agent.messages.push(assistantMessage);
        let handlerResult = {
            result: "",
            error: void 0,
            isArgumentError: false
        };
        if (tool.handler) handlerResult = await this.executeToolHandler({
            tool,
            toolCall: assistantToolCall,
            agent,
            agentId: resolvedAgentId,
            handlerArgs: parameters,
            toolType: "runTool"
        });
        const toolResultMessage = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$random$2d$id$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomUUID"])(),
            role: "tool",
            toolCallId,
            content: handlerResult.result
        };
        const assistantIndex = agent.messages.findIndex((m)=>m.id === assistantMessage.id);
        if (assistantIndex !== -1) agent.messages.splice(assistantIndex + 1, 0, toolResultMessage);
        else agent.messages.push(toolResultMessage);
        if (!handlerResult.error && followUp !== false) {
            if (typeof followUp === "string" && followUp !== "generate") {
                const userMessage = {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$random$2d$id$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomUUID"])(),
                    role: "user",
                    content: followUp
                };
                agent.messages.push(userMessage);
            }
            await this._internal.waitForPendingFrameworkUpdates();
            await this.runAgent({
                agent
            });
        }
        return {
            toolCallId,
            result: handlerResult.result,
            error: handlerResult.error
        };
    }
    /** Stable identity for a tool override: agent-scope + name (NUL-separated). */ capabilityKey(name, agentId) {
        return `${agentId ?? ""}\u0000${name}`;
    }
    /**
	* Enable/disable a registered frontend tool at runtime without unregistering
	* it. A disabled tool is omitted from {@link buildFrontendTools}, so the agent
	* never receives it. Unlike the per-tool `available` flag, this override
	* survives the tool being re-registered.
	*/ setToolEnabled(name, enabled, agentId) {
        const key = this.capabilityKey(name, agentId);
        if (enabled) this._disabledToolKeys.delete(key);
        else this._disabledToolKeys.add(key);
    }
    /** Whether a tool is currently enabled (not overridden off). Defaults true. */ isToolEnabled(name, agentId) {
        return !this._disabledToolKeys.has(this.capabilityKey(name, agentId));
    }
    /**
	* Build frontend tools for an agent
	*/ buildFrontendTools(agentId) {
        return this._tools.filter((tool)=>tool.available !== false && tool.available !== "disabled" && (!tool.agentId || tool.agentId === agentId) && this.isToolEnabled(tool.name, tool.agentId)).map((tool)=>({
                name: tool.name,
                description: tool.description ?? "",
                parameters: createToolSchema(tool)
            }));
    }
    /**
	* Create an agent error subscriber
	*/ createAgentErrorSubscriber(agent) {
        const emitAgentError = async (error, code, extraContext = {})=>{
            const context = {
                ...extraContext
            };
            if (agent.agentId) context.agentId = agent.agentId;
            await this._internal.emitError({
                error,
                code,
                context
            });
        };
        return {
            onRunFailed: async ({ error })=>{
                await emitAgentError(error, error instanceof AgentThreadLockedError ? CopilotKitCoreErrorCode.AGENT_THREAD_LOCKED : CopilotKitCoreErrorCode.AGENT_RUN_FAILED_EVENT, {
                    source: "onRunFailed"
                });
            },
            onRunErrorEvent: async ({ event })=>{
                if (this._runAbortController?.signal.aborted === true || event?.code === "abort") return;
                const eventError = event?.rawEvent instanceof Error ? event.rawEvent : event?.rawEvent?.error instanceof Error ? event.rawEvent.error : void 0;
                const errorMessage = typeof event?.rawEvent?.error === "string" ? event.rawEvent.error : event?.message ?? "Agent run error";
                const rawError = eventError ?? new Error(errorMessage);
                if (event?.code && !rawError.code) rawError.code = event.code;
                await emitAgentError(rawError, CopilotKitCoreErrorCode.AGENT_RUN_ERROR_EVENT, {
                    source: "onRunErrorEvent",
                    event,
                    runtimeErrorCode: event?.code
                });
            }
        };
    }
};
/**
* Empty tool schema constant
*/ const EMPTY_TOOL_SCHEMA = {
    type: "object",
    properties: {}
};
/**
* Create a JSON schema from a tool's parameters
*/ function createToolSchema(tool) {
    if (!tool.parameters) return {
        ...EMPTY_TOOL_SCHEMA
    };
    const rawSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$standard$2d$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["schemaToJsonSchema"])(tool.parameters, {
        zodToJsonSchema: (schema, options)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2d$to$2d$json$2d$schema$2f$dist$2f$esm$2f$zodToJsonSchema$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodToJsonSchema"])(schema, options)
    });
    if (!rawSchema || typeof rawSchema !== "object") return {
        ...EMPTY_TOOL_SCHEMA
    };
    const { $schema: _$schema, ...schema } = rawSchema;
    if (typeof schema.type !== "string") schema.type = "object";
    if (typeof schema.properties !== "object" || schema.properties === null) schema.properties = {};
    stripAdditionalProperties(schema);
    return schema;
}
function stripAdditionalProperties(schema) {
    if (!schema || typeof schema !== "object") return;
    if (Array.isArray(schema)) {
        schema.forEach(stripAdditionalProperties);
        return;
    }
    const record = schema;
    if (record.additionalProperties !== void 0) delete record.additionalProperties;
    for (const value of Object.values(record))stripAdditionalProperties(value);
}
/**
* Ensures parsed tool arguments are a plain object.
* Throws for non-object values so the caller's catch block can emit
* a structured TOOL_ARGUMENT_PARSE_FAILED error.
*
* @internal Exported for testing only.
*/ function ensureObjectArgs(parsed, toolName) {
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) return parsed;
    throw new Error(`Tool arguments for ${toolName} parsed to non-object (${typeof parsed})`);
}
/**
* Parses raw tool call arguments into a validated object.
*
* Some LLM providers (e.g. @ai-sdk/openai-compatible) may send empty string "",
* null, or undefined instead of "{}". This function normalises those cases to an
* empty object so callers don't crash on JSON.parse("").
*
* A debug-level warning is emitted when the fallback triggers so silent coercion
* is observable in logs.
*
* @internal Exported for testing only.
*/ function parseToolArguments(rawArgs, toolName) {
    if (rawArgs === "" || rawArgs === null || rawArgs === void 0) {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$logger$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug(`[parseToolArguments] Tool "${toolName}" received empty/null/undefined arguments — defaulting to {}`);
        return {};
    }
    return ensureObjectArgs(typeof rawArgs === "string" ? JSON.parse(rawArgs) : rawArgs, toolName);
}
//#endregion
//#region src/core/state-manager.ts
const isContinuation = (input)=>input.resume !== void 0 || Object.prototype.hasOwnProperty.call(input.forwardedProps?.command ?? {}, "resume");
/**
* Manages state and message tracking by run for CopilotKitCore.
* Tracks agent state snapshots and message-to-run associations.
*/ var StateManager = class {
    stateByRun = /* @__PURE__ */ new Map();
    messageToRun = /* @__PURE__ */ new Map();
    rawEventByMessage = /* @__PURE__ */ new Map();
    activeRun = /* @__PURE__ */ new Map();
    agentSubscriptions = /* @__PURE__ */ new Map();
    pendingContinuations = /* @__PURE__ */ new WeakMap();
    constructor(core){
        this.core = core;
    }
    /**
	* Initialize state tracking for an agent
	*/ initialize() {}
    markNextRunAsContinuation(agent, expectedRunId) {
        let pendingForAgent = this.pendingContinuations.get(agent);
        if (!pendingForAgent) {
            pendingForAgent = /* @__PURE__ */ new Set();
            this.pendingContinuations.set(agent, pendingForAgent);
        }
        const pending = {
            active: true,
            expectedRunId,
            bind: (input)=>{
                if (pending.active) pending.expectedInput = input;
            },
            cancel: ()=>{
                if (!pending.active) return;
                pending.active = false;
                pendingForAgent.delete(pending);
                if (pendingForAgent.size === 0) this.pendingContinuations.delete(agent);
            }
        };
        pendingForAgent.add(pending);
        return pending;
    }
    /**
	* Subscribe to an agent's events to track state and messages.
	*/ subscribeToAgent(agent) {
        if (!agent.agentId) return;
        const agentId = agent.agentId;
        const existingUnsubscribe = this.agentSubscriptions.get(agentId);
        if (existingUnsubscribe) {
            existingUnsubscribe();
            this.agentSubscriptions.delete(agentId);
        }
        let revoked = false;
        let subRunId;
        let runFinished = false;
        const pendingResults = /* @__PURE__ */ new WeakMap();
        const reconcilePendingResults = (historyMessages, input)=>{
            const events = pendingResults.get(input);
            if (!events) return void 0;
            const messages = [
                ...historyMessages
            ];
            let changed = false;
            for (const event of events.values()){
                const ownerIndex = messages.findIndex((message)=>message.role === "assistant" && message.toolCalls?.some((toolCall)=>toolCall.id === event.toolCallId));
                if (ownerIndex < 0) continue;
                const matchingIndexes = messages.reduce((indexes, message, index)=>{
                    if (message.role === "tool" && message.toolCallId === event.toolCallId) indexes.push(index);
                    return indexes;
                }, []);
                const realIndex = matchingIndexes.find((index)=>!isForwardedToClientPlaceholder(messages[index]?.content));
                if (realIndex !== void 0) {
                    for (const duplicateIndex of matchingIndexes.filter((candidateIndex)=>candidateIndex !== realIndex).sort((a, b)=>b - a)){
                        messages.splice(duplicateIndex, 1);
                        changed = true;
                    }
                    continue;
                }
                const placeholderIndex = matchingIndexes.find((index)=>isForwardedToClientPlaceholder(messages[index]?.content));
                if (placeholderIndex !== void 0) {
                    if (isForwardedToClientPlaceholder(event.content)) {
                        for (const duplicateIndex of matchingIndexes.slice(1).sort((a, b)=>b - a)){
                            messages.splice(duplicateIndex, 1);
                            changed = true;
                        }
                        continue;
                    }
                    messages[placeholderIndex] = {
                        ...messages[placeholderIndex],
                        id: event.messageId,
                        content: event.content
                    };
                    changed = true;
                    for (const duplicateIndex of matchingIndexes.filter((candidateIndex)=>candidateIndex !== placeholderIndex && isForwardedToClientPlaceholder(messages[candidateIndex]?.content)).sort((a, b)=>b - a))messages.splice(duplicateIndex, 1);
                    continue;
                }
                const result = {
                    id: event.messageId,
                    role: "tool",
                    toolCallId: event.toolCallId,
                    content: event.content
                };
                let insertIndex = ownerIndex + 1;
                while(messages[insertIndex]?.role === "tool")insertIndex++;
                messages.splice(insertIndex, 0, result);
                changed = true;
            }
            return changed ? {
                messages
            } : void 0;
        };
        const clearPendingResults = (input)=>{
            pendingResults.delete(input);
        };
        const effectiveInput = (input)=>({
                ...input,
                runId: subRunId ?? input.runId
            });
        const { unsubscribe } = agent.subscribe({
            onRunStartedEvent: ({ event, input, state })=>{
                if (revoked) return;
                const internalContinuation = [
                    ...this.pendingContinuations.get(agent) ?? []
                ].find((pending)=>pending.expectedInput === input);
                internalContinuation?.cancel();
                if (internalContinuation) subRunId = internalContinuation.expectedRunId ?? event.runId ?? input.runId;
                else if (runFinished && input.runId === subRunId && !isContinuation(input) && (event.runId == null || event.runId === subRunId)) subRunId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["randomUUID"])();
                else subRunId = event.runId || input.runId;
                runFinished = false;
                this.handleRunStarted(agent, effectiveInput(input), state);
            },
            onRunFinishedEvent: ({ input, state, messages })=>{
                if (revoked) return;
                runFinished = true;
                const effective = effectiveInput(input);
                const mutation = reconcilePendingResults(messages, input);
                clearPendingResults(input);
                this.handleRunFinished(agent, effective, state);
                return mutation;
            },
            onRunErrorEvent: ({ input, state, messages })=>{
                if (revoked) return;
                runFinished = true;
                const effective = effectiveInput(input);
                const mutation = reconcilePendingResults(messages, input);
                this.handleRunFinished(agent, effective, state);
                return mutation;
            },
            onRunFailed: ({ input, messages })=>{
                if (revoked) return;
                return reconcilePendingResults(messages, input);
            },
            onRunFinalized: ({ input })=>{
                if (revoked) return;
                clearPendingResults(input);
            },
            onToolCallResultEvent: ({ event, input })=>{
                if (revoked) return;
                let events = pendingResults.get(input);
                if (!events) {
                    events = /* @__PURE__ */ new Map();
                    pendingResults.set(input, events);
                }
                events.set(event.toolCallId, event);
            },
            onStateSnapshotEvent: ({ event, input, state })=>{
                if (revoked) return;
                this.handleStateSnapshot(agent, event, effectiveInput(input), state);
            },
            onStateDeltaEvent: ({ event, input, state })=>{
                if (revoked) return;
                this.handleStateDelta(agent, event, effectiveInput(input), state);
            },
            onTextMessageStartEvent: ({ event, input })=>{
                if (revoked) return;
                this.handleTextMessageStart(agent, event, effectiveInput(input));
            },
            onMessagesSnapshotEvent: ({ event, input, messages })=>{
                if (revoked) return;
                this.handleMessagesSnapshot(agent, event, effectiveInput(input), messages);
                this.pruneRawEvents(agent.agentId, input.threadId, event.messages, effectiveInput(input));
            },
            onNewMessage: ({ message, input })=>{
                if (revoked) return;
                this.handleNewMessage(agent, message, input ? effectiveInput(input) : void 0);
            },
            onMessagesChanged: ({ messages, input })=>{
                if (revoked) return;
                if (!input) this.pruneRawEvents(agent.agentId, agent.threadId, messages);
            }
        });
        this.agentSubscriptions.set(agentId, ()=>{
            revoked = true;
            this.pendingContinuations.delete(agent);
            unsubscribe();
        });
    }
    /**
	* Unsubscribe an agent's subscription.
	*/ unsubscribeFromAgent(agentId) {
        const unsubscribe = this.agentSubscriptions.get(agentId);
        if (unsubscribe) {
            unsubscribe();
            this.agentSubscriptions.delete(agentId);
        }
        this.rawEventByMessage.delete(agentId);
    }
    /**
	* Get state for a specific run
	* Returns a deep copy to prevent external mutations
	*/ getStateByRun(agentId, threadId, runId) {
        const state = this.stateByRun.get(agentId)?.get(threadId)?.get(runId);
        if (!state) return void 0;
        return JSON.parse(JSON.stringify(state));
    }
    /**
	* Get runId associated with a message
	*/ getRunIdForMessage(agentId, threadId, messageId) {
        return this.messageToRun.get(agentId)?.get(threadId)?.get(messageId);
    }
    /**
	* Get direct text-start metadata associated with a message.
	*/ getRawEventForMessage(agentId, threadId, messageId) {
        const rawEvent = this.rawEventByMessage.get(agentId)?.get(threadId)?.get(messageId);
        return rawEvent === void 0 ? void 0 : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["structuredClone_"])(rawEvent);
    }
    /**
	* Get all states for an agent's thread
	*/ getStatesForThread(agentId, threadId) {
        return this.stateByRun.get(agentId)?.get(threadId) ?? /* @__PURE__ */ new Map();
    }
    /**
	* Get all run IDs for an agent's thread
	*/ getRunIdsForThread(agentId, threadId) {
        const threadStates = this.stateByRun.get(agentId)?.get(threadId);
        return threadStates ? Array.from(threadStates.keys()) : [];
    }
    /**
	* Handle run started event
	*/ handleRunStarted(agent, input, state) {
        if (!agent.agentId) return;
        const { threadId, runId } = input;
        this.activeRun.set(`${agent.agentId}:${threadId}`, runId);
        if (state && Object.keys(state).length > 0) this.saveState(agent.agentId, threadId, runId, state);
    }
    /**
	* Handle run finished event
	*/ handleRunFinished(agent, input, state) {
        if (!agent.agentId) return;
        const { threadId, runId } = input;
        this.activeRun.delete(`${agent.agentId}:${threadId}`);
        if (state && Object.keys(state).length > 0) this.saveState(agent.agentId, threadId, runId, state);
    }
    /**
	* Handle state snapshot event
	*/ handleStateSnapshot(agent, event, input, state) {
        if (!agent.agentId) return;
        const { threadId, runId } = input;
        const mergedState = {
            ...state,
            ...event.snapshot
        };
        this.saveState(agent.agentId, threadId, runId, mergedState);
    }
    /**
	* Handle state delta event
	*/ handleStateDelta(agent, event, input, state) {
        if (!agent.agentId) return;
        const { threadId, runId } = input;
        this.saveState(agent.agentId, threadId, runId, state);
    }
    /**
	* Capture only defined metadata from a normalized direct text-start event.
	*/ handleTextMessageStart(agent, event, input) {
        if (!agent.agentId) return;
        const { threadId } = input;
        if (event.rawEvent === void 0) {
            const threadEvents = this.rawEventByMessage.get(agent.agentId)?.get(threadId);
            threadEvents?.delete(event.messageId);
            if (threadEvents?.size === 0) this.rawEventByMessage.get(agent.agentId)?.delete(threadId);
            if (this.rawEventByMessage.get(agent.agentId)?.size === 0) this.rawEventByMessage.delete(agent.agentId);
            return;
        }
        if (!this.rawEventByMessage.has(agent.agentId)) this.rawEventByMessage.set(agent.agentId, /* @__PURE__ */ new Map());
        const agentEvents = this.rawEventByMessage.get(agent.agentId);
        if (!agentEvents.has(threadId)) agentEvents.set(threadId, /* @__PURE__ */ new Map());
        agentEvents.get(threadId).set(event.messageId, event.rawEvent);
    }
    /**
	* Handle messages snapshot event
	*/ handleMessagesSnapshot(agent, event, input, _messages) {
        if (!agent.agentId) return;
        const { threadId, runId } = input;
        for (const message of event.messages)if (this.getRunIdForMessage(agent.agentId, threadId, message.id) === void 0) this.associateMessageWithRun(agent.agentId, threadId, message.id, runId);
    }
    /**
	* Handle new message event
	*/ handleNewMessage(agent, message, input) {
        if (!agent.agentId) return;
        if (!input) {
            const threadId = agent.threadId ?? "";
            const runId = this.activeRun.get(`${agent.agentId}:${threadId}`);
            if (runId) this.associateMessageWithRun(agent.agentId, threadId, message.id, runId);
            return;
        }
        const { threadId, runId } = input;
        this.associateMessageWithRun(agent.agentId, threadId, message.id, runId);
    }
    /**
	* Save state for a specific run
	*/ saveState(agentId, threadId, runId, state) {
        if (!this.stateByRun.has(agentId)) this.stateByRun.set(agentId, /* @__PURE__ */ new Map());
        const agentStates = this.stateByRun.get(agentId);
        if (!agentStates.has(threadId)) agentStates.set(threadId, /* @__PURE__ */ new Map());
        agentStates.get(threadId).set(runId, JSON.parse(JSON.stringify(state)));
    }
    /**
	* Associate a message with a run
	*/ associateMessageWithRun(agentId, threadId, messageId, runId) {
        if (!this.messageToRun.has(agentId)) this.messageToRun.set(agentId, /* @__PURE__ */ new Map());
        const agentMessages = this.messageToRun.get(agentId);
        if (!agentMessages.has(threadId)) agentMessages.set(threadId, /* @__PURE__ */ new Map());
        agentMessages.get(threadId).set(messageId, runId);
    }
    pruneRawEvents(agentId, fallbackThreadId, messages, input) {
        const threadId = input?.threadId ?? fallbackThreadId;
        if (!threadId) return;
        const threadEvents = this.rawEventByMessage.get(agentId)?.get(threadId);
        if (!threadEvents) return;
        const messageIds = new Set(messages.map((message)=>message.id));
        for (const messageId of threadEvents.keys())if (!messageIds.has(messageId)) threadEvents.delete(messageId);
        if (threadEvents.size === 0) this.rawEventByMessage.get(agentId)?.delete(threadId);
        if (this.rawEventByMessage.get(agentId)?.size === 0) this.rawEventByMessage.delete(agentId);
    }
    /**
	* Clear all state for an agent
	*/ clearAgentState(agentId) {
        this.stateByRun.delete(agentId);
        this.messageToRun.delete(agentId);
        this.rawEventByMessage.delete(agentId);
    }
    /**
	* Clear all state for a thread
	*/ clearThreadState(agentId, threadId) {
        this.stateByRun.get(agentId)?.delete(threadId);
        this.messageToRun.get(agentId)?.delete(threadId);
        this.rawEventByMessage.get(agentId)?.delete(threadId);
    }
};
//#endregion
//#region src/core/thread-store-registry.ts
var ThreadStoreRegistry = class {
    _stores = {};
    _snapshot = null;
    constructor(core){
        this.core = core;
    }
    register(agentId, store) {
        if (agentId in this._stores) {
            const prevStore = this._stores[agentId];
            delete this._stores[agentId];
            this._snapshot = null;
            this.notifyUnregistered(agentId, prevStore).catch((err)=>{
                console.error("ThreadStoreRegistry notifyUnregistered failed:", err);
            });
        }
        this._stores[agentId] = store;
        this._snapshot = null;
        this.notifyRegistered(agentId, store).catch((err)=>{
            console.error("ThreadStoreRegistry notifyRegistered failed:", err);
        });
    }
    unregister(agentId) {
        if (!(agentId in this._stores)) return;
        const prevStore = this._stores[agentId];
        delete this._stores[agentId];
        this._snapshot = null;
        this.notifyUnregistered(agentId, prevStore).catch((err)=>{
            console.error("ThreadStoreRegistry notifyUnregistered failed:", err);
        });
    }
    get(agentId) {
        return this._stores[agentId];
    }
    getAll() {
        if (this._snapshot === null) this._snapshot = Object.freeze({
            ...this._stores
        });
        return this._snapshot;
    }
    async notifyRegistered(agentId, store) {
        await this.core.notifySubscribers((subscriber)=>subscriber.onThreadStoreRegistered?.({
                copilotkit: this.core,
                agentId,
                store
            }), "Subscriber onThreadStoreRegistered error:");
    }
    async notifyUnregistered(agentId, prevStore) {
        await this.core.notifySubscribers((subscriber)=>subscriber.onThreadStoreUnregistered?.({
                copilotkit: this.core,
                agentId,
                prevStore
            }), "Subscriber onThreadStoreUnregistered error:");
    }
};
//#endregion
//#region src/utils/micro-redux.ts
const INTERNAL_ACTION_TYPES = {
    boot: "@@micro-redux/boot",
    init: "@@micro-redux/init",
    stop: "@@micro-redux/stop"
};
const INTERNAL_BOOT_ACTION = {
    type: INTERNAL_ACTION_TYPES.boot
};
/**
* Builds a typed action creator from a type string and payload factory.
*/ function createTypedActionCreator(type, factory) {
    const creator = (...args)=>({
            ...factory(...args),
            type
        });
    creator.type = type;
    creator.match = (action)=>action.type === type;
    return creator;
}
/**
* Declares a payload-based action config for `createActionGroup`.
*
* @example
* ```ts
* const actions = createActionGroup("User", {
*   loaded: props<{ id: string }>(),
* });
* ```
*/ function props() {
    return {
        kind: "props"
    };
}
/**
* Declares a no-payload action config for `createActionGroup`.
*
* @example
* ```ts
* const actions = createActionGroup("User", {
*   reset: empty(),
* });
* ```
*/ function empty() {
    return {
        kind: "empty"
    };
}
/**
* Creates a namespaced group of typed action creators.
*
* Action types are formatted as: `[Source] actionName`.
*/ function createActionGroup(source, config) {
    const group = {};
    for (const eventName of Object.keys(config)){
        const eventConfig = config[eventName];
        if (!eventConfig) continue;
        const actionType = `[${source}] ${eventName}`;
        if (eventConfig.kind === "props") {
            group[eventName] = createTypedActionCreator(actionType, (payload)=>({
                    ...payload
                }));
            continue;
        }
        group[eventName] = createTypedActionCreator(actionType, ()=>({}));
    }
    return group;
}
/**
* Registers one reducer handler for one or more action creators.
*
* @throws Error when called without at least one action creator and reducer.
*/ function on(...args) {
    if (args.length < 2) throw new Error("on requires at least one action creator and one reducer");
    const reducer = args[args.length - 1];
    return {
        creators: args.slice(0, -1),
        reducer
    };
}
/**
* Creates a reducer from an initial state and `on(...)` handler entries.
*
* Unknown action types return the current state unchanged.
*/ function createReducer(initialState, ...entries) {
    const reducerMap = /* @__PURE__ */ new Map();
    for (const entry of entries)for (const creator of entry.creators){
        const handlers = reducerMap.get(creator.type) ?? [];
        handlers.push(entry.reducer);
        reducerMap.set(creator.type, handlers);
    }
    return (state, action)=>{
        const currentState = state ?? initialState;
        const handlers = reducerMap.get(action.type);
        if (!handlers || handlers.length === 0) return currentState;
        let nextState = currentState;
        for (const handler of handlers)nextState = handler(nextState, action);
        return nextState;
    };
}
/**
* Creates a selector that caches and reuses the last computed result
* when all input references are unchanged.
*/ function createSelector(...args) {
    if (args.length === 1) {
        const projector = args[0];
        let hasCached = false;
        let lastState;
        let lastResult;
        return (state)=>{
            if (hasCached && state === lastState) return lastResult;
            lastState = state;
            lastResult = projector(state);
            hasCached = true;
            return lastResult;
        };
    }
    const projector = args[args.length - 1];
    const selectors = args.slice(0, -1);
    let hasCached = false;
    let lastInputs = [];
    let lastResult;
    return (state)=>{
        const inputs = selectors.map((selector)=>selector(state));
        if (hasCached && inputs.length === lastInputs.length && inputs.every((value, index)=>value === lastInputs[index])) return lastResult;
        lastInputs = inputs;
        lastResult = projector(...inputs);
        hasCached = true;
        return lastResult;
    };
}
/**
* RxJS operator that maps state emissions through a selector and suppresses
* unchanged projected values via reference equality.
*/ function select(selector) {
    return (source$)=>source$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(selector), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$distinctUntilChanged$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distinctUntilChanged"])());
}
/**
* RxJS operator that filters an action stream by action creators and narrows
* the output action type to the matched creator union.
*
* @throws Error when called without at least one action creator.
*/ function ofType(...creators) {
    if (creators.length === 0) throw new Error("ofType requires at least one action creator");
    const actionTypes = new Set(creators.map((creator)=>creator.type));
    return (source$)=>{
        return source$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])((action)=>{
            return actionTypes.has(action.type);
        }));
    };
}
/**
* Creates an effect descriptor consumed by `createStore`.
*/ function createEffect(factory, options = {}) {
    if (options.dispatch === false) return {
        run: factory,
        dispatch: false
    };
    return {
        run: factory,
        dispatch: true
    };
}
/**
* Creates a small observable store with reducer + effects.
*
* Behavior:
* - `init()` starts effects and dispatches `@@micro-redux/init`.
* - `stop()` dispatches `@@micro-redux/stop` and unsubscribes all effects.
* - Effect action observation is scheduled on `asapScheduler` to avoid
*   synchronous re-entrancy in the effect loop.
* - Any effect error triggers fail-fast teardown and errors both `actions$`
*   and `state$`.
*/ function createStore(options) {
    const reducer = options.reducer;
    const effects = options.effects ?? [];
    let hasFatalError = false;
    let isRunning = false;
    let effectSubscriptions = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Subscription$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subscription"]();
    let currentState = reducer(void 0, INTERNAL_BOOT_ACTION);
    const stateSubject = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$BehaviorSubject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BehaviorSubject"](currentState);
    const actionsSubject = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Subject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subject"]();
    const dispatchInternal = (action)=>{
        if (hasFatalError) throw new Error("Store is in a failed state due to an effect error");
        currentState = reducer(currentState, action);
        stateSubject.next(currentState);
        actionsSubject.next(action);
    };
    const failFast = (error)=>{
        if (hasFatalError) return;
        hasFatalError = true;
        isRunning = false;
        effectSubscriptions.unsubscribe();
        effectSubscriptions = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Subscription$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subscription"]();
        actionsSubject.error(error);
        stateSubject.error(error);
    };
    const startEffects = ()=>{
        for (const effect of effects){
            const scheduledActions$ = actionsSubject.asObservable().pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$observeOn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["observeOn"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$scheduler$2f$asap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asapScheduler"]));
            const state$ = stateSubject.asObservable();
            if (effect.dispatch) {
                const subscription = effect.run(scheduledActions$, state$).subscribe({
                    next: (effectAction)=>{
                        if (hasFatalError) return;
                        dispatchInternal(effectAction);
                    },
                    error: (error)=>{
                        failFast(error);
                    }
                });
                effectSubscriptions.add(subscription);
                continue;
            }
            const subscription = effect.run(scheduledActions$, state$).subscribe({
                error: (error)=>{
                    failFast(error);
                }
            });
            effectSubscriptions.add(subscription);
        }
    };
    return {
        dispatch (action) {
            dispatchInternal(action);
        },
        getState () {
            return currentState;
        },
        get state$ () {
            return stateSubject.asObservable();
        },
        get actions$ () {
            return actionsSubject.asObservable();
        },
        select (selector) {
            return stateSubject.asObservable().pipe(select(selector));
        },
        init () {
            if (hasFatalError || isRunning) return;
            isRunning = true;
            startEffects();
            if (hasFatalError) return;
            dispatchInternal({
                type: INTERNAL_ACTION_TYPES.init
            });
        },
        stop () {
            if (hasFatalError || !isRunning) return;
            dispatchInternal({
                type: INTERNAL_ACTION_TYPES.stop
            });
            effectSubscriptions.unsubscribe();
            effectSubscriptions = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Subscription$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subscription"]();
            isRunning = false;
        }
    };
}
//#endregion
//#region src/memory-errors.ts
/**
* The memory error registry: the single source of truth for memory error
* metadata. Keyed by `code` so a code maps to exactly one category/retryable
* default.
*
* Categories/retryable rationale:
* - List/credentials/mutation failures are `dependency` (the runtime/platform
*   the store calls failed). A 5xx is transient (`retryable: true`); a 4xx is
*   caller-caused, so the helpers below downgrade those to non-retryable.
* - Timeouts are `dependency` and `retryable: true` (the request may simply be
*   slow).
*/ const MEMORY_ERROR_REGISTRY = Object.freeze({
    MEMORY_LIST_FAILED: {
        code: "MEMORY_LIST_FAILED",
        category: "dependency",
        retryable: true,
        message: "Failed to fetch memories",
        docsPath: "docs/errors/memory.md#memory_list_failed"
    },
    MEMORY_RECALL_FAILED: {
        code: "MEMORY_RECALL_FAILED",
        category: "dependency",
        retryable: true,
        message: "Failed to recall memories",
        docsPath: "docs/errors/memory.md#memory_recall_failed"
    },
    MEMORY_CREDENTIALS_FAILED: {
        code: "MEMORY_CREDENTIALS_FAILED",
        category: "dependency",
        retryable: true,
        message: "Failed to fetch memory subscribe credentials",
        docsPath: "docs/errors/memory.md#memory_credentials_failed"
    },
    MEMORY_MUTATION_FAILED: {
        code: "MEMORY_MUTATION_FAILED",
        category: "dependency",
        retryable: true,
        message: "Memory mutation request failed",
        docsPath: "docs/errors/memory.md#memory_mutation_failed"
    },
    MEMORY_REQUEST_TIMEOUT: {
        code: "MEMORY_REQUEST_TIMEOUT",
        category: "dependency",
        retryable: true,
        message: "Request timed out",
        docsPath: "docs/errors/memory.md#memory_request_timeout"
    }
});
/**
* An `Error` carrying a stable memory error `code`, `category`, and `retryable`
* flag so consumers and observability can branch on it without string-matching
* the message.
*
* It is a real `Error` subclass: `instanceof Error` is true, so the public
* `MemoryState.error: Error | null` contract (and the `error: Error | null`
* surfaced by `useMemories` / `injectMemories`) holds unchanged. Existing
* consumers that only read `.message` keep working; the richer fields are
* additive.
*/ var MemoryError = class MemoryError extends Error {
    /** Stable, machine-readable error identifier. */ code;
    /** Coarse error category for grouping/observability. */ category;
    /** Whether retrying the operation could plausibly succeed. */ retryable;
    /**
	* @param code - Registry code identifying this error.
	* @param options - Optional overrides:
	*   - `message`: human-readable message (defaults to the registry message;
	*     callers pass a status-bearing string to preserve prior wording).
	*   - `retryable`: overrides the registry default (e.g. a 4xx list failure is
	*     not retryable even though the code's default is).
	*   - `cause`: the underlying error, preserved for debugging.
	*/ constructor(code, options){
        const entry = MEMORY_ERROR_REGISTRY[code];
        super(options?.message ?? entry.message, {
            cause: options?.cause
        });
        this.name = "MemoryError";
        this.code = code;
        this.category = entry.category;
        this.retryable = options?.retryable ?? entry.retryable;
        Object.setPrototypeOf(this, MemoryError.prototype);
    }
};
/**
* Narrows an HTTP status to whether the failure is worth retrying: a 5xx (or a
* missing/0 status) is a transient dependency failure and retryable; a 4xx is
* caller-caused and not. Used so a `MEMORY_LIST_FAILED`/`MEMORY_MUTATION_FAILED`
* carries an accurate `retryable` flag derived from the response status.
*/ function isRetryableStatus(status) {
    return !(Number.isInteger(status) && status >= 400 && status <= 499);
}
//#endregion
//#region src/memory.ts
const MEMORIES_PATH = "/memories";
const MEMORIES_SUBSCRIBE_PATH = "/memories/subscribe";
const MEMORIES_RECALL_PATH = "/memories/recall";
const REQUEST_TIMEOUT_MS$1 = 15e3;
/** Consecutive socket errors tolerated before the realtime stream gives up. */ const MAX_SOCKET_RETRIES$1 = 5;
/**
* HTTP status codes that indicate memory routes are not configured (non-fatal).
* 404/501 mean the route is absent/unimplemented; 422 is the runtime's
* MISSING_INTELLIGENCE signal (intelligence not configured on the deployment —
* see packages/runtime/.../handlers/intelligence/memories.ts). All three map to
* the graceful "not available" locked-teaser path, not a hard error.
*/ const ROUTE_UNAVAILABLE_STATUSES = new Set([
    404,
    422,
    501
]);
/**
* Thrown when a memory route returns a 404/422/501 — treated as "not
* configured" (422 is the runtime's MISSING_INTELLIGENCE signal).
*/ var MemoryRouteUnavailableError = class extends Error {
};
const initialMemoryState = Object.freeze({
    memories: Object.freeze([]),
    isLoading: false,
    inFlightMutationCount: 0,
    error: null,
    context: null,
    sessionId: 0,
    available: true,
    realtimeStatus: "connecting"
});
const memoryAdapterEvents = createActionGroup("Memory Adapter", {
    started: empty(),
    stopped: empty(),
    contextChanged: props(),
    addRequested: props(),
    updateRequested: props(),
    removeRequested: props()
});
const memoryRestEvents = createActionGroup("Memory REST", {
    listRequested: props(),
    listSucceeded: props(),
    listFailed: props(),
    listUnavailable: props(),
    mutationFinished: props(),
    credentialsRequested: props(),
    credentialsSucceeded: props(),
    credentialsFailed: props(),
    credentialsUnavailable: props()
});
const memoryDomainEvents = createActionGroup("Memory Domain", {
    memoryUpserted: props(),
    memoryInvalidated: props(),
    realtimeConnecting: props(),
    realtimeConnected: props(),
    realtimeUnavailable: props()
});
/** Projects a wire memory to the public {@link Memory} shape (drops tenant ids). */ function toMemory(memory) {
    return {
        id: memory.id,
        kind: memory.kind,
        scope: memory.scope,
        content: memory.content,
        sourceThreadIds: memory.sourceThreadIds,
        invalidatedAt: memory.invalidatedAt
    };
}
/**
* Maps a realtime `memory_metadata` event to the domain action that applies it:
* `created`/`updated` upsert the projected memory, `invalidated` removes it by
* id. Carries the current `sessionId` so the reducer's session guard can drop
* deltas left over from a previous context.
*/ function mapMemoryMetadataEvent(event, sessionId) {
    if (event.operation === "invalidated") return memoryDomainEvents.memoryInvalidated({
        sessionId,
        memoryId: event.invalidated.id
    });
    return memoryDomainEvents.memoryUpserted({
        sessionId,
        memory: toMemory(event.memory)
    });
}
/**
* Inserts or replaces a memory by id. A new memory is prepended (newest first,
* matching the REST list's `created_at DESC` ordering without needing a date
* field on the public projection); an existing memory is replaced in place.
*/ function upsertMemory(memories, memory) {
    const existingIndex = memories.findIndex((item)=>item.id === memory.id);
    if (existingIndex === -1) return [
        memory,
        ...memories
    ];
    const next = [
        ...memories
    ];
    next[existingIndex] = memory;
    return next;
}
const memoryReducer = createReducer(initialMemoryState, on(memoryAdapterEvents.contextChanged, (state, { context })=>({
        ...state,
        context,
        sessionId: state.sessionId + 1,
        memories: [],
        isLoading: Boolean(context),
        inFlightMutationCount: 0,
        error: null,
        available: true,
        realtimeStatus: "connecting"
    })), on(memoryAdapterEvents.stopped, (state)=>({
        ...state,
        memories: [],
        isLoading: false,
        inFlightMutationCount: 0,
        error: null,
        available: true,
        realtimeStatus: "connecting"
    })), on(memoryRestEvents.listRequested, (state, { sessionId })=>{
    if (sessionId !== state.sessionId || !state.context) return state;
    return {
        ...state,
        isLoading: true,
        error: null,
        available: true
    };
}), on(memoryRestEvents.listFailed, (state, { sessionId, error })=>{
    if (sessionId !== state.sessionId) return state;
    return {
        ...state,
        isLoading: false,
        error
    };
}), on(memoryRestEvents.listUnavailable, (state, { sessionId })=>{
    if (sessionId !== state.sessionId) return state;
    return {
        ...state,
        memories: [],
        isLoading: false,
        error: null,
        available: false
    };
}), on(memoryAdapterEvents.addRequested, memoryAdapterEvents.updateRequested, memoryAdapterEvents.removeRequested, (state)=>({
        ...state,
        inFlightMutationCount: state.inFlightMutationCount + 1
    })), on(memoryRestEvents.mutationFinished, (state, { outcome })=>{
    if (outcome.sessionId !== state.sessionId) return state;
    return {
        ...state,
        inFlightMutationCount: Math.max(0, state.inFlightMutationCount - 1),
        error: outcome.ok ? null : outcome.error
    };
}), on(memoryRestEvents.listSucceeded, (state, { sessionId, memories })=>{
    if (sessionId !== state.sessionId) return state;
    return {
        ...state,
        memories,
        isLoading: false,
        error: null,
        available: true
    };
}), on(memoryDomainEvents.memoryUpserted, (state, { sessionId, memory })=>{
    if (sessionId !== state.sessionId) return state;
    return {
        ...state,
        memories: upsertMemory(state.memories, memory)
    };
}), on(memoryDomainEvents.memoryInvalidated, (state, { sessionId, memoryId })=>{
    if (sessionId !== state.sessionId) return state;
    return {
        ...state,
        memories: state.memories.filter((memory)=>memory.id !== memoryId)
    };
}), on(memoryDomainEvents.realtimeConnecting, (state, { sessionId })=>{
    if (sessionId !== state.sessionId) return state;
    return {
        ...state,
        realtimeStatus: "connecting"
    };
}), on(memoryDomainEvents.realtimeConnected, (state, { sessionId })=>{
    if (sessionId !== state.sessionId) return state;
    return {
        ...state,
        realtimeStatus: "connected"
    };
}), on(memoryDomainEvents.realtimeUnavailable, (state, { sessionId })=>{
    if (sessionId !== state.sessionId) return state;
    return {
        ...state,
        realtimeStatus: "unavailable"
    };
}));
const selectMemories = createSelector((state)=>state.memories);
const selectMemoriesIsLoading = createSelector((state)=>state.isLoading);
const selectMemoriesError = createSelector((state)=>state.error);
/**
* Reports whether at least one mutation is in flight. Derived from
* `inFlightMutationCount` so concurrent mutations stay correct: the boolean
* only clears once every in-flight mutation has settled.
*/ const selectMemoriesIsMutating = createSelector((state)=>state.inFlightMutationCount > 0);
/**
* Reports whether the memory routes are available. Becomes `false` after a
* 404, 422 (the runtime's MISSING_INTELLIGENCE signal), or 501 response during
* an auto-activation read; defaults to `true`.
*/ const selectMemoriesAvailable = createSelector((state)=>state.available);
/**
* Reports the realtime-connection health (see {@link MemoryRealtimeStatus}).
* Distinct from `available`/`error`: it reflects ONLY the live socket/channel,
* so the UI can suppress a "live" indicator once realtime permanently dies even
* while the REST list route stays healthy. Defaults to `"connecting"`.
*/ const selectMemoriesRealtimeStatus = createSelector((state)=>state.realtimeStatus);
const MEMORY_METADATA_EVENT = "memory_metadata";
function memoryFromFetch(input, init) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$dom$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromFetch"])(input, init);
}
/**
* Fetches the memory snapshot and maps it to a success/failure action. Both
* user- and project-scoped rows are kept: the store now opens a second
* `project_meta:memories:<code>` realtime channel (when project credentials are
* available) that keeps project rows in sync, so surfacing them in the snapshot
* no longer risks a stale list. Rows are keyed by id across both channels, so
* realtime deltas reconcile either scope idempotently.
*/ function createMemoryFetchObservable(environment, context, sessionId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>{
        const qs = context.includeInvalidated ? "?includeInvalidated=true" : "";
        return memoryFromFetch(`${context.runtimeUrl}${MEMORIES_PATH}${qs}`, {
            selector: (response)=>{
                if (!response.ok) {
                    if (ROUTE_UNAVAILABLE_STATUSES.has(response.status)) throw new MemoryRouteUnavailableError(String(response.status));
                    throw new MemoryError("MEMORY_LIST_FAILED", {
                        message: `Failed to fetch memories: ${response.status}`,
                        retryable: isRetryableStatus(response.status)
                    });
                }
                return response.json();
            },
            fetch: environment.fetch,
            method: "GET",
            headers: {
                ...context.headers
            }
        }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeout"])({
            first: REQUEST_TIMEOUT_MS$1,
            with: ()=>{
                throw new MemoryError("MEMORY_REQUEST_TIMEOUT");
            }
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((data)=>memoryRestEvents.listSucceeded({
                sessionId,
                memories: data.memories
            })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catchError"])((error)=>{
            if (error instanceof MemoryRouteUnavailableError) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(memoryRestEvents.listUnavailable({
                sessionId
            }));
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(memoryRestEvents.listFailed({
                sessionId,
                error: error instanceof Error ? error : new Error(String(error))
            }));
        }));
    });
}
/**
* Fetches join credentials from the `/memories/subscribe` endpoint and maps
* the response to a success/failure action. Requires both `joinToken` and
* `joinCode` to be non-empty strings; throws otherwise so the `catchError`
* path emits `credentialsFailed`.
*/ function createMemoryCredentialsFetchObservable(environment, context, sessionId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>memoryFromFetch(`${context.runtimeUrl}${MEMORIES_SUBSCRIBE_PATH}`, {
            selector: async (response)=>{
                if (!response.ok) {
                    if (ROUTE_UNAVAILABLE_STATUSES.has(response.status)) throw new MemoryRouteUnavailableError(String(response.status));
                    throw new MemoryError("MEMORY_CREDENTIALS_FAILED", {
                        message: `Failed to fetch memory subscribe credentials: ${response.status}`,
                        retryable: isRetryableStatus(response.status)
                    });
                }
                return response.json();
            },
            fetch: environment.fetch,
            method: "POST",
            headers: {
                ...context.headers,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeout"])({
            first: REQUEST_TIMEOUT_MS$1,
            with: ()=>{
                throw new MemoryError("MEMORY_REQUEST_TIMEOUT");
            }
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((data)=>{
            const hasUserCreds = typeof data.joinToken === "string" && data.joinToken.length > 0 && typeof data.joinCode === "string" && data.joinCode.length > 0;
            const hasProjectCreds = typeof data.projectJoinToken === "string" && data.projectJoinToken.length > 0 && typeof data.projectJoinCode === "string" && data.projectJoinCode.length > 0;
            if (!hasUserCreds && !hasProjectCreds) throw new Error("missing memory realtime credentials");
            return memoryRestEvents.credentialsSucceeded({
                sessionId,
                ...hasUserCreds ? {
                    joinToken: data.joinToken,
                    joinCode: data.joinCode
                } : {},
                ...hasProjectCreds ? {
                    projectJoinToken: data.projectJoinToken,
                    projectJoinCode: data.projectJoinCode
                } : {}
            });
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catchError"])((error)=>{
            if (error instanceof MemoryRouteUnavailableError) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(memoryRestEvents.credentialsUnavailable({
                sessionId
            }));
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(memoryRestEvents.credentialsFailed({
                sessionId,
                error: error instanceof Error ? error : new Error(String(error))
            }));
        })));
}
/** Projects a REST mutation response to the public {@link Memory} shape. */ function responseToMemory(data) {
    return {
        id: data.id,
        kind: data.kind,
        scope: data.scope,
        content: data.content,
        sourceThreadIds: data.sourceThreadIds,
        invalidatedAt: data.invalidatedAt
    };
}
/**
* Projects a recall REST response memory (which carries a relevance `score`)
* to the public {@link Memory} shape. `score` is copied through when supplied.
*/ function recallResponseToMemory(data) {
    return {
        id: data.id,
        kind: data.kind,
        scope: data.scope,
        content: data.content,
        sourceThreadIds: data.sourceThreadIds,
        invalidatedAt: data.invalidatedAt,
        ...typeof data.score === "number" ? {
            score: data.score
        } : {}
    };
}
const MEMORY_KINDS = new Set([
    "topical",
    "episodic",
    "operational"
]);
const MEMORY_SCOPES = new Set([
    "user",
    "project"
]);
/**
* Validates the required fields of a create/supersede REST response before it is
* projected to a {@link Memory}. Returns an `Error` describing the first
* missing/invalid field, or `null` when the body is well-formed. Without this a
* malformed 200 body yields a Memory with undefined fields that gets upserted.
*/ function validateMutationResponse(data) {
    if (!data || typeof data !== "object") return /* @__PURE__ */ new Error("memory mutation response missing/invalid body");
    if (typeof data.id !== "string" || data.id.length === 0) return /* @__PURE__ */ new Error("memory mutation response missing/invalid id");
    if (typeof data.kind !== "string" || !MEMORY_KINDS.has(data.kind)) return /* @__PURE__ */ new Error("memory mutation response missing/invalid kind");
    if (typeof data.scope !== "string" || !MEMORY_SCOPES.has(data.scope)) return /* @__PURE__ */ new Error("memory mutation response missing/invalid scope");
    if (typeof data.content !== "string") return /* @__PURE__ */ new Error("memory mutation response missing/invalid content");
    if (!Array.isArray(data.sourceThreadIds) || !data.sourceThreadIds.every((id)=>typeof id === "string")) return /* @__PURE__ */ new Error("memory mutation response missing/invalid sourceThreadIds");
    if (data.invalidatedAt !== null && typeof data.invalidatedAt !== "string") return /* @__PURE__ */ new Error("memory mutation response missing/invalid invalidatedAt");
    return null;
}
/**
* Request body for create/supersede. `scope` is forwarded only when the caller
* supplies it: the platform owns the default (`scope` defaults to `"user"` in
* the `/api/memories` schema), so the store does not second-guess it here —
* one default, at the contract owner. `sourceThreadIds` defaults to `[]`.
*/ function toMutationBody(input) {
    return {
        content: input.content,
        kind: input.kind,
        ...input.scope !== void 0 ? {
            scope: input.scope
        } : {},
        sourceThreadIds: input.sourceThreadIds ?? []
    };
}
/**
* Builds the actions a successful mutation dispatches (server-authoritative):
* the REST response is applied to local state immediately, and the realtime
* event reconciles idempotently (upsert-by-id). `mutationFinished` resolves the
* caller's promise.
*/ function buildMutationSuccessActions(request, data) {
    const { requestId, sessionId } = request;
    if (request.kind === "remove") return [
        memoryDomainEvents.memoryInvalidated({
            sessionId,
            memoryId: request.id
        }),
        memoryRestEvents.mutationFinished({
            outcome: {
                requestId,
                sessionId,
                ok: true,
                memory: null
            }
        })
    ];
    const validationError = validateMutationResponse(data);
    if (validationError) return [
        memoryRestEvents.mutationFinished({
            outcome: {
                requestId,
                sessionId,
                ok: false,
                error: validationError
            }
        })
    ];
    const memory = responseToMemory(data);
    if (request.kind === "update") {
        const retiredId = data.retiredId;
        if (typeof retiredId !== "string" || retiredId.length === 0) return [
            memoryRestEvents.mutationFinished({
                outcome: {
                    requestId,
                    sessionId,
                    ok: false,
                    error: /* @__PURE__ */ new Error("supersede response missing retiredId")
                }
            })
        ];
        return [
            memoryDomainEvents.memoryInvalidated({
                sessionId,
                memoryId: retiredId
            }),
            memoryDomainEvents.memoryUpserted({
                sessionId,
                memory
            }),
            memoryRestEvents.mutationFinished({
                outcome: {
                    requestId,
                    sessionId,
                    ok: true,
                    memory
                }
            })
        ];
    }
    return [
        memoryDomainEvents.memoryUpserted({
            sessionId,
            memory
        }),
        memoryRestEvents.mutationFinished({
            outcome: {
                requestId,
                sessionId,
                ok: true,
                memory
            }
        })
    ];
}
/** Performs a create/supersede/retire HTTP call and emits its resulting actions. */ function createMemoryMutationObservable(environment, context, request) {
    const method = request.kind === "add" ? "POST" : request.kind === "update" ? "PATCH" : "DELETE";
    const path = request.kind === "add" ? MEMORIES_PATH : `${MEMORIES_PATH}/${encodeURIComponent(request.id)}`;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>memoryFromFetch(`${context.runtimeUrl}${path}`, {
            selector: async (response)=>{
                if (!response.ok) throw new MemoryError("MEMORY_MUTATION_FAILED", {
                    message: `Request failed: ${response.status}`,
                    retryable: isRetryableStatus(response.status)
                });
                return request.kind === "remove" ? null : await response.json();
            },
            fetch: environment.fetch,
            method,
            headers: {
                ...context.headers,
                "Content-Type": "application/json"
            },
            body: request.kind === "remove" ? void 0 : JSON.stringify(request.body)
        }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeout"])({
            first: REQUEST_TIMEOUT_MS$1,
            with: ()=>{
                throw new MemoryError("MEMORY_REQUEST_TIMEOUT");
            }
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$mergeMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeMap"])((data)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(...buildMutationSuccessActions(request, data))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catchError"])((error)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(memoryRestEvents.mutationFinished({
                outcome: {
                    requestId: request.requestId,
                    sessionId: request.sessionId,
                    ok: false,
                    error: error instanceof Error ? error : new Error(String(error))
                }
            })))));
}
/**
* Creates the framework-agnostic memory store: a REST snapshot on `setContext`,
* server-authoritative add/update/remove mutations, and realtime
* `memory_metadata` deltas off the injected `user_meta` event source — all
* reduced into observable state.
*/ function createMemoryStore(environment) {
    let memoryRequestId = 0;
    const createMemoryRequestId = ()=>{
        memoryRequestId += 1;
        return `memory-request-${memoryRequestId}`;
    };
    const bootstrapEffect = createEffect((actions$, state$)=>actions$.pipe(ofType(memoryAdapterEvents.contextChanged), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$withLatestFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withLatestFrom"])(state$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(([, state])=>Boolean(state.context)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(([, state])=>memoryRestEvents.listRequested({
                sessionId: state.sessionId
            }))));
    const credentialsBootstrapEffect = createEffect((actions$, state$)=>actions$.pipe(ofType(memoryAdapterEvents.contextChanged), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$withLatestFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withLatestFrom"])(state$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(([, state])=>Boolean(state.context)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(([, state])=>memoryRestEvents.credentialsRequested({
                sessionId: state.sessionId
            }))));
    const credentialsFetchEffect = createEffect((actions$, state$)=>actions$.pipe(ofType(memoryRestEvents.credentialsRequested), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])((action)=>state$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((state)=>state.context), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])((context)=>Boolean(context)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$take$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((context)=>({
                    action,
                    context
                })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$takeUntil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takeUntil"])(actions$.pipe(ofType(memoryAdapterEvents.contextChanged, memoryAdapterEvents.stopped))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])(({ action: currentAction, context })=>createMemoryCredentialsFetchObservable(environment, context, currentAction.sessionId))))));
    const store = createStore({
        reducer: memoryReducer,
        effects: [
            bootstrapEffect,
            credentialsBootstrapEffect,
            createEffect((actions$, state$)=>actions$.pipe(ofType(memoryRestEvents.listRequested), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])((action)=>state$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((state)=>state.context), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])((context)=>Boolean(context)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$take$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((context)=>({
                            action,
                            context
                        })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$takeUntil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takeUntil"])(actions$.pipe(ofType(memoryAdapterEvents.contextChanged, memoryAdapterEvents.stopped))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])(({ action: currentAction, context })=>createMemoryFetchObservable(environment, context, currentAction.sessionId)))))),
            credentialsFetchEffect,
            createEffect((actions$, state$)=>actions$.pipe(ofType(memoryAdapterEvents.addRequested, memoryAdapterEvents.updateRequested, memoryAdapterEvents.removeRequested), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$withLatestFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withLatestFrom"])(state$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$mergeMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeMap"])(([action, state])=>{
                    const context = state.context;
                    const sessionId = state.sessionId;
                    if (!context?.runtimeUrl) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(memoryRestEvents.mutationFinished({
                        outcome: {
                            requestId: action.requestId,
                            sessionId,
                            ok: false,
                            error: /* @__PURE__ */ new Error("Runtime URL is not configured")
                        }
                    }));
                    if (memoryAdapterEvents.addRequested.match(action)) return createMemoryMutationObservable(environment, context, {
                        requestId: action.requestId,
                        sessionId,
                        kind: "add",
                        body: toMutationBody(action.input)
                    });
                    if (memoryAdapterEvents.updateRequested.match(action)) return createMemoryMutationObservable(environment, context, {
                        requestId: action.requestId,
                        sessionId,
                        kind: "update",
                        id: action.id,
                        body: toMutationBody(action.changes)
                    });
                    return createMemoryMutationObservable(environment, context, {
                        requestId: action.requestId,
                        sessionId,
                        kind: "remove",
                        id: action.id
                    });
                }))),
            createEffect((actions$, state$)=>actions$.pipe(ofType(memoryRestEvents.credentialsSucceeded), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$withLatestFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withLatestFrom"])(state$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(([action, state])=>{
                    return action.sessionId === state.sessionId && Boolean(state.context?.wsUrl);
                }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])(([action, state])=>{
                    const context = state.context;
                    const { joinToken, joinCode, projectJoinToken, projectJoinCode } = action;
                    const primaryJoinToken = joinToken ?? projectJoinToken;
                    const primaryTopic = joinToken && joinCode ? `user_meta:memories:${joinCode}` : `project_meta:memories:${projectJoinCode}`;
                    const sessionId = action.sessionId;
                    const shutdown$ = actions$.pipe(ofType(memoryAdapterEvents.contextChanged, memoryAdapterEvents.stopped));
                    const channelMetadata$ = (channelJoinToken, topic)=>{
                        const channel$ = ɵphoenixChannel$({
                            socket$: ɵphoenixSocket$({
                                url: context.wsUrl,
                                options: {
                                    params: {
                                        join_token: channelJoinToken
                                    },
                                    reconnectAfterMs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["phoenixExponentialBackoff"])(100, 1e4),
                                    rejoinAfterMs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["phoenixExponentialBackoff"])(1e3, 3e4)
                                }
                            }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$shareReplay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareReplay"])({
                                bufferSize: 1,
                                refCount: true
                            })),
                            topic
                        }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$shareReplay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareReplay"])({
                            bufferSize: 1,
                            refCount: true
                        }));
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])(channel$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])(({ channel })=>ɵobservePhoenixEvent$(channel, MEMORY_METADATA_EVENT)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((event)=>mapMemoryMetadataEvent(event, sessionId))), ɵjoinPhoenixChannel$(channel$).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catchError"])((error)=>{
                            console.warn(`[memory] failed to join ${topic}`, error);
                            return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$empty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY"];
                        })));
                    };
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>{
                        const socket$ = ɵphoenixSocket$({
                            url: context.wsUrl,
                            options: {
                                params: {
                                    join_token: primaryJoinToken
                                },
                                reconnectAfterMs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["phoenixExponentialBackoff"])(100, 1e4),
                                rejoinAfterMs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["phoenixExponentialBackoff"])(1e3, 3e4)
                            }
                        }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$shareReplay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareReplay"])({
                            bufferSize: 1,
                            refCount: true
                        }));
                        const channel$ = ɵphoenixChannel$({
                            socket$,
                            topic: primaryTopic
                        }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$shareReplay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareReplay"])({
                            bufferSize: 1,
                            refCount: true
                        }));
                        const fatalSocketShutdown$ = ɵobservePhoenixSocketHealth$(ɵobservePhoenixSocketSignals$(socket$).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$share$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["share"])()), MAX_SOCKET_RETRIES$1).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catchError"])(()=>{
                            console.warn(`[memory] WebSocket failed after ${MAX_SOCKET_RETRIES$1} attempts, giving up`);
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(void 0);
                        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$share$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["share"])());
                        const fatalStatus$ = fatalSocketShutdown$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(()=>memoryDomainEvents.realtimeUnavailable({
                                sessionId
                            })));
                        const metadata$ = channel$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])(({ channel })=>ɵobservePhoenixEvent$(channel, MEMORY_METADATA_EVENT)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((event)=>mapMemoryMetadataEvent(event, action.sessionId)));
                        const join$ = ɵjoinPhoenixChannel$(channel$).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$concatWith$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatWith"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(memoryDomainEvents.realtimeConnected({
                            sessionId
                        }))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catchError"])((error)=>{
                            console.warn(`[memory] failed to join ${primaryTopic}`, error);
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(memoryDomainEvents.realtimeUnavailable({
                                sessionId
                            }));
                        }));
                        const projectMetadata$ = joinToken && joinCode && projectJoinToken && projectJoinCode ? channelMetadata$(projectJoinToken, `project_meta:memories:${projectJoinCode}`) : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$empty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY"];
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(memoryDomainEvents.realtimeConnecting({
                            sessionId
                        })), metadata$, join$, projectMetadata$, fatalStatus$).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$takeUntil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takeUntil"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])(shutdown$, fatalSocketShutdown$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$observeOn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["observeOn"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$scheduler$2f$asap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asapScheduler"])))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$finalize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["finalize"])(()=>{}));
                    });
                })))
        ]
    });
    function trackMutation(dispatchAction, extract) {
        const { requestId } = dispatchAction;
        const resultPromise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$firstValueFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firstValueFrom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])(store.actions$.pipe(ofType(memoryRestEvents.mutationFinished), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])((action)=>action.outcome.requestId === requestId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((action)=>action.outcome)), store.actions$.pipe(ofType(memoryAdapterEvents.stopped), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(()=>({
                requestId,
                sessionId: store.getState().sessionId,
                ok: false,
                error: /* @__PURE__ */ new Error("Memory store stopped before mutation completed")
            })))).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$take$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["take"])(1))).then((outcome)=>{
            if (!outcome.ok) throw outcome.error;
            return extract(outcome);
        });
        store.dispatch(dispatchAction);
        return resultPromise;
    }
    return {
        start () {
            store.init();
            store.dispatch(memoryAdapterEvents.started());
        },
        stop () {
            store.dispatch(memoryAdapterEvents.stopped());
            store.stop();
        },
        setContext (context) {
            store.dispatch(memoryAdapterEvents.contextChanged({
                context
            }));
        },
        refresh () {
            const { sessionId, context } = store.getState();
            if (!context) return Promise.resolve();
            const done = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$firstValueFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firstValueFrom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])(store.actions$.pipe(ofType(memoryRestEvents.listSucceeded, memoryRestEvents.listFailed, memoryRestEvents.listUnavailable), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])((action)=>action.sessionId === sessionId)), store.actions$.pipe(ofType(memoryAdapterEvents.stopped)), store.actions$.pipe(ofType(memoryAdapterEvents.contextChanged))).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$take$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["take"])(1))).then((action)=>{
                if (memoryRestEvents.listFailed.match(action)) throw action.error;
                if (memoryAdapterEvents.stopped.match(action)) throw new Error("Memory store stopped before refresh completed");
                if (memoryAdapterEvents.contextChanged.match(action)) return;
            });
            store.dispatch(memoryRestEvents.listRequested({
                sessionId
            }));
            return done;
        },
        recall (query, opts) {
            const { context } = store.getState();
            if (!context?.runtimeUrl) return Promise.reject(/* @__PURE__ */ new Error("Runtime URL is not configured"));
            const body = {
                query
            };
            if (opts?.limit !== void 0) body.limit = opts.limit;
            if (opts?.scope !== void 0) body.scope = opts.scope;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$firstValueFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firstValueFrom"])(memoryFromFetch(`${context.runtimeUrl}${MEMORIES_RECALL_PATH}`, {
                selector: async (response)=>{
                    if (!response.ok) throw new MemoryError("MEMORY_RECALL_FAILED", {
                        message: `Failed to recall memories: ${response.status}`,
                        retryable: isRetryableStatus(response.status)
                    });
                    return await response.json();
                },
                fetch: environment.fetch,
                method: "POST",
                headers: {
                    ...context.headers,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeout"])({
                first: REQUEST_TIMEOUT_MS$1,
                with: ()=>{
                    throw new MemoryError("MEMORY_REQUEST_TIMEOUT");
                }
            }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((data)=>(data.memories ?? []).map((m)=>recallResponseToMemory(m)))));
        },
        addMemory (input) {
            return trackMutation(memoryAdapterEvents.addRequested({
                requestId: createMemoryRequestId(),
                input
            }), (outcome)=>{
                if (outcome.memory == null) throw new Error("add resolved without a memory");
                return outcome.memory;
            });
        },
        updateMemory (id, changes) {
            return trackMutation(memoryAdapterEvents.updateRequested({
                requestId: createMemoryRequestId(),
                id,
                changes
            }), (outcome)=>{
                if (outcome.memory == null) throw new Error("update resolved without a memory");
                return outcome.memory;
            });
        },
        removeMemory (id) {
            return trackMutation(memoryAdapterEvents.removeRequested({
                requestId: createMemoryRequestId(),
                id
            }), ()=>void 0);
        },
        getState () {
            return store.getState();
        },
        getServerState () {
            return initialMemoryState;
        },
        select: store.select.bind(store)
    };
}
const ɵmemoryAdapterEvents = memoryAdapterEvents;
const ɵmemoryRestEvents = memoryRestEvents;
const ɵmemoryDomainEvents = memoryDomainEvents;
const ɵmemoryReducer = memoryReducer;
const ɵmapMemoryMetadataEvent = mapMemoryMetadataEvent;
const ɵselectMemories = selectMemories;
const ɵselectMemoriesIsLoading = selectMemoriesIsLoading;
const ɵselectMemoriesError = selectMemoriesError;
const ɵselectMemoriesIsMutating = selectMemoriesIsMutating;
const ɵselectMemoriesAvailable = selectMemoriesAvailable;
const ɵselectMemoriesRealtimeStatus = selectMemoriesRealtimeStatus;
//#endregion
//#region src/core/core.ts
let CopilotKitCoreErrorCode = /* @__PURE__ */ function(CopilotKitCoreErrorCode) {
    CopilotKitCoreErrorCode["RUNTIME_INFO_FETCH_FAILED"] = "runtime_info_fetch_failed";
    CopilotKitCoreErrorCode["AGENT_CONNECT_FAILED"] = "agent_connect_failed";
    CopilotKitCoreErrorCode["AGENT_RUN_FAILED"] = "agent_run_failed";
    CopilotKitCoreErrorCode["AGENT_RUN_FAILED_EVENT"] = "agent_run_failed_event";
    CopilotKitCoreErrorCode["AGENT_RUN_ERROR_EVENT"] = "agent_run_error_event";
    CopilotKitCoreErrorCode["TOOL_ARGUMENT_PARSE_FAILED"] = "tool_argument_parse_failed";
    CopilotKitCoreErrorCode["TOOL_HANDLER_FAILED"] = "tool_handler_failed";
    CopilotKitCoreErrorCode["TOOL_NOT_FOUND"] = "tool_not_found";
    CopilotKitCoreErrorCode["AGENT_NOT_FOUND"] = "agent_not_found";
    /**
	* Emitted when an agent run fails because the thread is already locked
	* by another active run.
	*
	* @example
	* ```tsx
	* <CopilotKitProvider
	*   onError={({ code, error, context }) => {
	*     if (code === "agent_thread_locked") {
	*       // Show "Agent is busy, retry?" UI
	*     }
	*   }}
	* />
	* ```
	*/ CopilotKitCoreErrorCode["AGENT_THREAD_LOCKED"] = "agent_thread_locked";
    CopilotKitCoreErrorCode["TRANSCRIPTION_FAILED"] = "transcription_failed";
    CopilotKitCoreErrorCode["TRANSCRIPTION_SERVICE_NOT_CONFIGURED"] = "transcription_service_not_configured";
    CopilotKitCoreErrorCode["TRANSCRIPTION_INVALID_AUDIO"] = "transcription_invalid_audio";
    CopilotKitCoreErrorCode["TRANSCRIPTION_RATE_LIMITED"] = "transcription_rate_limited";
    CopilotKitCoreErrorCode["TRANSCRIPTION_AUTH_FAILED"] = "transcription_auth_failed";
    CopilotKitCoreErrorCode["TRANSCRIPTION_NETWORK_ERROR"] = "transcription_network_error";
    CopilotKitCoreErrorCode["SUBSCRIBER_CALLBACK_FAILED"] = "subscriber_callback_failed";
    return CopilotKitCoreErrorCode;
}({});
/**
* Runtime allowlist derived from {@link SUBSCRIBE_TO_AGENT_KEYS}. Hoisted
* to module scope so the Set is allocated once, not per-subscription.
*/ const ALLOWED_KEYS = new Set([
    "onMessagesChanged",
    "onStateChanged",
    "onRunInitialized",
    "onRunFinalized",
    "onRunFailed",
    "onRunErrorEvent"
]);
let CopilotKitCoreRuntimeConnectionStatus = /* @__PURE__ */ function(CopilotKitCoreRuntimeConnectionStatus) {
    CopilotKitCoreRuntimeConnectionStatus["Disconnected"] = "disconnected";
    CopilotKitCoreRuntimeConnectionStatus["Connected"] = "connected";
    CopilotKitCoreRuntimeConnectionStatus["Connecting"] = "connecting";
    CopilotKitCoreRuntimeConnectionStatus["Error"] = "error";
    return CopilotKitCoreRuntimeConnectionStatus;
}({});
/**
* Normalize a header map to the internal invariant: a `Record<string, string>`
* with no `null`/`undefined` values. Entries whose value is `null`/`undefined`
* are dropped (this is how a header is cleared). Shared by the constructor and
* `setHeaders` so both write paths into `_headers` enforce the same invariant.
*/ function normalizeHeaders(headers) {
    return Object.fromEntries(Object.entries(headers).filter((entry)=>entry[1] != null));
}
var CopilotKitCore = class {
    _headers;
    _credentials;
    _properties;
    _defaultThrottleMs;
    _debug;
    subscribers = /* @__PURE__ */ new Set();
    agentRegistry;
    contextStore;
    suggestionEngine;
    runHandler;
    stateManager;
    threadStoreRegistry;
    /**
	* The single core-owned memory store, created lazily on first
	* `getMemoryStore()` and kept user-scoped for the lifetime of the core.
	* Its runtime context is wired by the core itself (see `syncMemoryContext`),
	* so callers never register or look it up by `agentId`.
	*/ _memoryStore;
    /**
	* Tracks the agent IDs from the most recent `onAgentsChanged` notification.
	* Used to gate thread-store auto-unregister so the FIRST empty-agents
	* notification (before published agents are merged in) does not rip out a
	* store that was registered prior to that initial notification.
	*/ previousAgentIds = /* @__PURE__ */ new Set();
    constructor({ runtimeUrl, runtimeTransport = "auto", deferInitialConnection = false, headers = {}, credentials, properties = {}, agents__unsafe_dev_only = {}, tools = [], suggestionsConfig = [], debug }){
        this._headers = normalizeHeaders(headers);
        this._credentials = credentials;
        this._properties = properties;
        this._debug = debug;
        this.agentRegistry = new AgentRegistry(this);
        this.contextStore = new ContextStore(this);
        this.suggestionEngine = new SuggestionEngine(this);
        this.runHandler = new RunHandler(this);
        this.stateManager = new StateManager(this);
        this.threadStoreRegistry = new ThreadStoreRegistry(this);
        this.agentRegistry.initialize(agents__unsafe_dev_only);
        this.runHandler.initialize(tools);
        this.suggestionEngine.initialize(suggestionsConfig);
        this.stateManager.initialize();
        this.agentRegistry.setRuntimeTransport(runtimeTransport);
        this.agentRegistry.setRuntimeUrl(runtimeUrl, {
            deferConnection: deferInitialConnection
        });
        this.previousAgentIds = new Set(Object.keys(agents__unsafe_dev_only));
        this.subscribe({
            onRuntimeConnectionStatusChanged: ()=>{
                if (this._memoryStore) this.syncMemoryContext();
            },
            onAgentsChanged: ({ agents })=>{
                Object.values(agents).forEach((agent)=>{
                    if (agent.agentId) this.stateManager.subscribeToAgent(agent);
                });
                const currentAgentIds = new Set(Object.keys(agents));
                for (const agentId of Object.keys(this.threadStoreRegistry.getAll()))if (this.previousAgentIds.has(agentId) && !currentAgentIds.has(agentId)) try {
                    this.threadStoreRegistry.unregister(agentId);
                } catch (err) {
                    console.error(`CopilotKitCore.onAgentsChanged: threadStoreRegistry.unregister failed for "${agentId}":`, err);
                }
                for (const agentId of this.previousAgentIds)if (!currentAgentIds.has(agentId)) try {
                    this.stateManager.unsubscribeFromAgent(agentId);
                } catch (err) {
                    console.error(`CopilotKitCore.onAgentsChanged: stateManager.unsubscribeFromAgent failed for "${agentId}":`, err);
                }
                this.previousAgentIds = currentAgentIds;
            }
        });
    }
    /**
	* Internal method used by delegate classes and subclasses to notify subscribers
	*/ async notifySubscribers(handler, errorMessage) {
        await Promise.all(Array.from(this.subscribers).map(async (subscriber)=>{
            try {
                await handler(subscriber);
            } catch (error) {
                console.error(errorMessage, error);
            }
        }));
    }
    /**
	* Internal method used by delegate classes to emit errors
	*/ async emitError({ error, code, context = {} }) {
        await this.notifySubscribers((subscriber)=>subscriber.onError?.({
                copilotkit: this,
                error,
                code,
                context
            }), "Subscriber onError error:");
    }
    /**
	* Log a message to the console and emit an error to subscribers.
	* Catches failures from `emitError` itself to prevent unhandled rejections.
	*/ logAndEmitError(message, params, logLevel = "error") {
        console[logLevel](message, params.error);
        this.emitError(params).catch((emitErr)=>{
            console.error(message + " — emitError itself failed:", emitErr);
        });
    }
    /**
	* Snapshot accessors
	*/ get context() {
        return this.contextStore.context;
    }
    get agents() {
        return this.agentRegistry.agents;
    }
    get tools() {
        return this.runHandler.tools;
    }
    get catalogComponents() {
        return this.runHandler.catalogComponents;
    }
    get runtimeUrl() {
        return this.agentRegistry.runtimeUrl;
    }
    setRuntimeUrl(runtimeUrl) {
        this.agentRegistry.setRuntimeUrl(runtimeUrl);
    }
    /**
	* Start the runtime `/info` connection if it has not been started yet.
	*
	* Intended to be driven from a host's commit-phase effect when the core was
	* constructed with {@link CopilotKitCoreConfig.deferInitialConnection}. Safe
	* to call repeatedly — it is a no-op once a connection is in progress or
	* settled, so a double-invoked mount effect (React StrictMode) collapses to a
	* single request. See #5801.
	*/ connect() {
        this.agentRegistry.connectRuntime();
    }
    get runtimeTransport() {
        return this.agentRegistry.runtimeTransport;
    }
    setRuntimeTransport(runtimeTransport) {
        this.agentRegistry.setRuntimeTransport(runtimeTransport);
    }
    get runtimeVersion() {
        return this.agentRegistry.runtimeVersion;
    }
    get headers() {
        return this._headers;
    }
    get credentials() {
        return this._credentials;
    }
    get properties() {
        return this._properties;
    }
    /**
	* Default throttle interval (ms) used by `subscribeToAgentWithOptions()`
	* when the caller does not specify an explicit `throttleMs`.
	* `undefined` means no default is configured; `0` means no throttling.
	*/ get defaultThrottleMs() {
        return this._defaultThrottleMs;
    }
    /**
	* Set the default throttle interval (ms) for `subscribeToAgentWithOptions()`.
	*
	* Accepts a non-negative finite number or `undefined` (to clear the
	* default). Invalid values (NaN, Infinity, negative) are logged as
	* errors and ignored — the previous valid value is preserved.
	*/ setDefaultThrottleMs(value) {
        if (value !== void 0 && (!Number.isFinite(value) || value < 0)) {
            this.logAndEmitError(`CopilotKitCore.setDefaultThrottleMs: value must be a non-negative finite number or undefined, got ${value}. Keeping current value (${this._defaultThrottleMs}).`, {
                error: /* @__PURE__ */ new Error(`setDefaultThrottleMs: invalid value (${value}), keeping current value (${this._defaultThrottleMs})`),
                code: CopilotKitCoreErrorCode.SUBSCRIBER_CALLBACK_FAILED,
                context: {
                    value,
                    currentValue: this._defaultThrottleMs
                }
            });
            return;
        }
        this._defaultThrottleMs = value;
    }
    get debug() {
        return this._debug;
    }
    setDebug(debug) {
        this._debug = debug;
    }
    get runtimeConnectionStatus() {
        return this.agentRegistry.runtimeConnectionStatus;
    }
    get audioFileTranscriptionEnabled() {
        return this.agentRegistry.audioFileTranscriptionEnabled;
    }
    get runtimeMode() {
        return this.agentRegistry.runtimeMode;
    }
    get intelligence() {
        return this.agentRegistry.intelligence;
    }
    get threadEndpoints() {
        return this.agentRegistry.threadEndpoints;
    }
    get suggestions() {
        return this.agentRegistry.suggestions;
    }
    /** Trusted, optional metadata advertised by the connected runtime. */ get inspectorMetadata() {
        return this.agentRegistry.inspectorMetadata;
    }
    /** Refresh trusted inspector metadata without reconnecting runtime agents. */ async refreshInspectorMetadata() {
        await this.agentRegistry.refreshInspectorMetadata();
    }
    get a2uiEnabled() {
        return this.agentRegistry.a2uiEnabled;
    }
    /**
	* Agent ids the runtime applies A2UI to. `undefined` means A2UI applies to
	* every agent (or is disabled — check `a2uiEnabled`).
	*/ get a2uiAgents() {
        return this.agentRegistry.a2uiAgents;
    }
    get openGenerativeUIEnabled() {
        return this.agentRegistry.openGenerativeUIEnabled;
    }
    get licenseStatus() {
        return this.agentRegistry.licenseStatus;
    }
    get telemetryDisabled() {
        return this.agentRegistry.telemetryDisabled;
    }
    /**
	* Configuration updates
	*/ /**
	* Replace the headers sent with every runtime request.
	*
	* This is an overwrite, not a merge — the supplied object becomes the
	* complete header set. Entries whose value is `null` or `undefined` are
	* dropped, which is how you clear a header (e.g. removing `Authorization`
	* on logout) without leaving an empty-string value behind:
	*
	* ```ts
	* copilotkit.setHeaders({
	*   ...copilotkit.headers,
	*   Authorization: token ? `Bearer ${token}` : null,
	* });
	* ```
	*
	* The resulting header set is also re-applied to every agent in the registry
	* and `onHeadersChanged` subscribers are notified. These headers are merged
	* ON TOP of the headers each `HttpAgent` was constructed with, so per-agent
	* headers (e.g. an `Authorization` for a self-hosted backend) are preserved;
	* on a key conflict the core-level value wins.
	*
	* Because the agent's construction-time headers form the merge baseline, this
	* method can override a per-agent header but cannot REMOVE one: clearing a
	* core key here only drops the core-level override, after which the agent's
	* own value (if any) re-surfaces. To change a header an agent was constructed
	* with, set it at the provider/core level instead of on the agent, or update
	* it on the agent directly. The clear-on-logout pattern above is for
	* core-level headers.
	*/ setHeaders(headers) {
        this._headers = normalizeHeaders(headers);
        if (this._memoryStore) this.syncMemoryContext();
        this.agentRegistry.applyHeadersToAgents(this.agentRegistry.agents);
        this.agentRegistry.handleHeadersChanged();
        this.notifySubscribers((subscriber)=>subscriber.onHeadersChanged?.({
                copilotkit: this,
                headers: this.headers
            }), "Subscriber onHeadersChanged error:");
    }
    setCredentials(credentials) {
        this._credentials = credentials;
        this.agentRegistry.applyCredentialsToAgents(this.agentRegistry.agents);
        this.agentRegistry.handleCredentialsChanged();
    }
    setProperties(properties) {
        this._properties = properties;
        this.notifySubscribers((subscriber)=>subscriber.onPropertiesChanged?.({
                copilotkit: this,
                properties: this.properties
            }), "Subscriber onPropertiesChanged error:");
    }
    /**
	* Agent management (delegated to AgentRegistry)
	*/ setAgents__unsafe_dev_only(agents) {
        this.agentRegistry.setAgents__unsafe_dev_only(agents);
    }
    addAgent__unsafe_dev_only(params) {
        this.agentRegistry.addAgent__unsafe_dev_only(params);
    }
    removeAgent__unsafe_dev_only(id) {
        this.agentRegistry.removeAgent__unsafe_dev_only(id);
    }
    /**
	* Register a proxied agent against an existing runtime agent. The proxy is
	* exposed under `agentId` (local registry id) and routes outbound runtime
	* requests to `runtimeAgentId`. Throws if `agentId` is already taken.
	*
	* Returns the minted proxy and an `unregister` handle for cleanup.
	*
	* Use this to mount multiple frontend agents against a single runtime
	* agent (e.g. one per chat window) without implicit per-thread cloning.
	*
	* @example
	* const { agent, unregister } = copilotkit.registerProxiedAgent({
	*   agentId: "chat-1",
	*   runtimeAgentId: "default",
	* });
	* // ... <CopilotChat agentId="chat-1" />
	* // on cleanup:
	* unregister();
	*/ registerProxiedAgent(params) {
        return this.agentRegistry.registerProxiedAgent(params);
    }
    getAgent(id) {
        return this.agentRegistry.getAgent(id);
    }
    /**
	* Re-apply the current headers to a single agent (delegated to
	* AgentRegistry). Core headers are merged on top of the agent's own
	* construction-time headers rather than replacing them, so headers
	* configured directly on an `HttpAgent` (e.g. an `Authorization` for a
	* self-hosted backend) survive header updates instead of being silently
	* dropped (see #5635). On a key conflict the core-level value wins.
	*
	* The merge baseline is the agent's headers as captured the first time the
	* agent is applied (at registration), so the way to change headers
	* afterwards is `setHeaders` (which re-applies to every agent), not mutating
	* `agent.headers` directly — a direct mutation is overwritten on the next
	* re-apply.
	*/ applyHeadersToAgent(agent) {
        this.agentRegistry.applyHeadersToAgent(agent);
    }
    /**
	* Context management (delegated to ContextStore).
	* Pass `agentIds` to restrict the entry to runs of specific agents;
	* omit it for context every agent should receive.
	*/ addContext(context) {
        return this.contextStore.addContext(context);
    }
    removeContext(id) {
        this.contextStore.removeContext(id);
    }
    /**
	* Build the context array for a run of the given agent, dropping entries
	* scoped to other agents and stripping the scoping metadata.
	*/ getContextForAgent(agentId) {
        return this.contextStore.getContextForAgent(agentId);
    }
    /**
	* Thread store registry (delegated to ThreadStoreRegistry)
	*/ registerThreadStore(agentId, store) {
        this.threadStoreRegistry.register(agentId, store);
    }
    unregisterThreadStore(agentId) {
        this.threadStoreRegistry.unregister(agentId);
    }
    getThreadStore(agentId) {
        return this.threadStoreRegistry.get(agentId);
    }
    getThreadStores() {
        return this.threadStoreRegistry.getAll();
    }
    /**
	* Returns the single core-owned, user-scoped memory store, creating and
	* starting it on first access. Unlike thread stores, memory is not scoped per
	* agent: there is exactly one store whose runtime context the core wires
	* itself (see `syncMemoryContext`), so consumers (e.g. a `useMemories`
	* binding) just read this store rather than registering one.
	*/ getMemoryStore() {
        return this.ensureMemoryStore();
    }
    /**
	* Lazily creates, starts, and context-syncs the core-owned memory store on
	* first access, then returns it. Subsequent calls return the existing store.
	* The store is constructed with a bound `globalThis.fetch` and immediately
	* has its runtime context synced from the current connection state.
	*/ ensureMemoryStore() {
        if (!this._memoryStore) {
            this._memoryStore = createMemoryStore({
                fetch: globalThis.fetch.bind(globalThis)
            });
            this._memoryStore.start();
            this.syncMemoryContext();
        }
        return this._memoryStore;
    }
    /**
	* Pushes the current runtime wiring into the memory store. When the runtime
	* is connected and both the intelligence WebSocket URL and runtime URL are
	* available, the store receives a context (runtime URL, WebSocket URL, and a
	* copy of the current headers); otherwise its context is cleared. No-op when
	* the store has not been created yet.
	*/ syncMemoryContext() {
        if (!this._memoryStore) return;
        if (this.runtimeConnectionStatus === CopilotKitCoreRuntimeConnectionStatus.Connected && this.intelligence?.wsUrl && this.runtimeUrl) this._memoryStore.setContext({
            runtimeUrl: this.runtimeUrl,
            wsUrl: this.intelligence.wsUrl,
            headers: {
                ...this.headers
            }
        });
        else this._memoryStore.setContext(null);
    }
    /**
	* Suggestions management (delegated to SuggestionEngine)
	*/ addSuggestionsConfig(config) {
        return this.suggestionEngine.addSuggestionsConfig(config);
    }
    removeSuggestionsConfig(id) {
        this.suggestionEngine.removeSuggestionsConfig(id);
    }
    reloadSuggestions(agentId) {
        this.suggestionEngine.reloadSuggestions(agentId);
    }
    clearSuggestions(agentId) {
        this.suggestionEngine.clearSuggestions(agentId);
    }
    getSuggestions(agentId) {
        return this.suggestionEngine.getSuggestions(agentId);
    }
    /**
	* Tool management (delegated to RunHandler)
	*/ addTool(tool) {
        this.runHandler.addTool(tool);
    }
    removeTool(id, agentId) {
        this.runHandler.removeTool(id, agentId);
    }
    getTool(params) {
        return this.runHandler.getTool(params);
    }
    setTools(tools) {
        this.runHandler.setTools(tools);
    }
    /**
	* Enable/disable a registered frontend tool at runtime without unregistering
	* it (Inspector "Capabilities" tool). A disabled tool is omitted from the
	* tool list sent to the agent on the next run. The override is keyed by name
	* (+ optional agentId) and survives the tool being re-registered.
	*/ setToolEnabled(name, enabled, agentId) {
        this.runHandler.setToolEnabled(name, enabled, agentId);
    }
    /** Whether a registered tool is currently enabled (defaults true). */ isToolEnabled(name, agentId) {
        return this.runHandler.isToolEnabled(name, agentId);
    }
    /**
	* A2UI catalog component management (delegated to RunHandler).
	* Registers the full component list and controls per-component enablement.
	*/ setCatalogComponents(components) {
        this.runHandler.setCatalogComponents(components);
        this.notifySubscribers((subscriber)=>subscriber.onCatalogComponentsChanged?.({
                copilotkit: this,
                catalogComponents: this.runHandler.catalogComponents
            }), "Subscriber onCatalogComponentsChanged error:");
    }
    setCatalogComponentEnabled(name, enabled) {
        this.runHandler.setCatalogComponentEnabled(name, enabled);
        this.notifySubscribers((subscriber)=>subscriber.onCatalogComponentsChanged?.({
                copilotkit: this,
                catalogComponents: this.runHandler.catalogComponents
            }), "Subscriber onCatalogComponentsChanged error:");
    }
    isCatalogComponentEnabled(name) {
        return this.runHandler.isCatalogComponentEnabled(name);
    }
    /**
	* Subscription lifecycle
	*/ subscribe(subscriber) {
        this.subscribers.add(subscriber);
        return {
            unsubscribe: ()=>{
                this.subscribers.delete(subscriber);
            }
        };
    }
    /**
	* Subscribe to an agent's notification and lifecycle events with
	* optional configuration (e.g. throttling).
	*
	* Wraps every callback with error protection (`safeCall`) and applies
	* the options before delegating to `agent.subscribe()`.
	*
	* See {@link SubscribeToAgentSubscriber} for the accepted callback subset
	* and the rationale for excluding AG-UI event handlers.
	*/ subscribeToAgentWithOptions(agent, subscriber, options) {
        const resolved = options?.throttleMs ?? this._defaultThrottleMs ?? 0;
        let effectiveMs = 0;
        if (!Number.isFinite(resolved) || resolved < 0) {
            const source = options?.throttleMs !== void 0 ? "throttleMs" : "defaultThrottleMs";
            this.logAndEmitError(`CopilotKitCore.subscribeToAgentWithOptions: ${source} must be a non-negative finite number, got ${resolved}. Falling back to unthrottled.`, {
                error: /* @__PURE__ */ new Error(`subscribeToAgentWithOptions: invalid ${source} (${resolved}), falling back to unthrottled`),
                code: CopilotKitCoreErrorCode.SUBSCRIBER_CALLBACK_FAILED,
                context: {
                    agentId: agent.agentId,
                    source,
                    value: resolved
                }
            });
        } else effectiveMs = resolved;
        const agentLabel = agent.agentId || "(unknown agent)";
        const safeCall = (label, fn, ...args)=>{
            const reportError = (err, verb)=>{
                this.logAndEmitError(`CopilotKitCore.subscribeToAgentWithOptions[${agentLabel}]: ${label} callback ${verb}:`, {
                    error: err instanceof Error ? err : new Error(String(err)),
                    code: CopilotKitCoreErrorCode.SUBSCRIBER_CALLBACK_FAILED,
                    context: {
                        agentId: agent.agentId,
                        callback: label
                    }
                });
            };
            try {
                const result = fn(...args);
                if (result instanceof Promise) return result.catch((err)=>{
                    reportError(err, "rejected");
                });
                return result;
            } catch (err) {
                reportError(err, "threw");
            }
        };
        const guardAll = (sub)=>{
            const guarded = {};
            if (sub.onMessagesChanged) {
                const fn = sub.onMessagesChanged;
                guarded.onMessagesChanged = (params)=>safeCall("onMessagesChanged", fn, params);
            }
            if (sub.onStateChanged) {
                const fn = sub.onStateChanged;
                guarded.onStateChanged = (params)=>safeCall("onStateChanged", fn, params);
            }
            if (sub.onRunInitialized) {
                const fn = sub.onRunInitialized;
                guarded.onRunInitialized = (params)=>safeCall("onRunInitialized", fn, params);
            }
            if (sub.onRunFinalized) {
                const fn = sub.onRunFinalized;
                guarded.onRunFinalized = (params)=>safeCall("onRunFinalized", fn, params);
            }
            if (sub.onRunFailed) {
                const fn = sub.onRunFailed;
                guarded.onRunFailed = (params)=>safeCall("onRunFailed", fn, params);
            }
            if (sub.onRunErrorEvent) {
                const fn = sub.onRunErrorEvent;
                guarded.onRunErrorEvent = (params)=>safeCall("onRunErrorEvent", fn, params);
            }
            return guarded;
        };
        for (const key of Object.keys(subscriber))if (typeof subscriber[key] === "function" && !ALLOWED_KEYS.has(key)) {
            const message = `CopilotKitCore.subscribeToAgentWithOptions[${agentLabel}]: callback "${key}" is not supported and was dropped. Supported callbacks: ${Array.from(ALLOWED_KEYS).join(", ")}. Use agent.subscribe() directly for event handlers and per-item notifications.`;
            this.logAndEmitError(message, {
                error: new Error(message),
                code: CopilotKitCoreErrorCode.SUBSCRIBER_CALLBACK_FAILED,
                context: {
                    agentId: agent.agentId,
                    droppedCallback: key
                }
            }, "warn");
        }
        if (effectiveMs <= 0) {
            const subscription = agent.subscribe(guardAll(subscriber));
            return {
                unsubscribe: ()=>subscription.unsubscribe()
            };
        }
        let active = true;
        let latestMessagesParams = null;
        let latestStateParams = null;
        const flushPending = ()=>{
            if (active && subscriber.onMessagesChanged && latestMessagesParams) {
                const params = latestMessagesParams;
                latestMessagesParams = null;
                safeCall("onMessagesChanged", subscriber.onMessagesChanged, params);
            }
            if (active && subscriber.onStateChanged && latestStateParams) {
                const params = latestStateParams;
                latestStateParams = null;
                safeCall("onStateChanged", subscriber.onStateChanged, params);
            }
        };
        const throttler = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$tanstack$2f$pacer$2f$dist$2f$throttler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Throttler"](flushPending, {
            wait: effectiveMs,
            leading: true,
            trailing: true
        });
        const lifecycleOnly = {};
        if (subscriber.onRunInitialized) lifecycleOnly.onRunInitialized = subscriber.onRunInitialized;
        if (subscriber.onRunFinalized) lifecycleOnly.onRunFinalized = subscriber.onRunFinalized;
        if (subscriber.onRunFailed) lifecycleOnly.onRunFailed = subscriber.onRunFailed;
        if (subscriber.onRunErrorEvent) lifecycleOnly.onRunErrorEvent = subscriber.onRunErrorEvent;
        const wrappedSubscriber = guardAll(lifecycleOnly);
        if (subscriber.onMessagesChanged) wrappedSubscriber.onMessagesChanged = (params)=>{
            latestMessagesParams = params;
            throttler.maybeExecute();
        };
        if (subscriber.onStateChanged) wrappedSubscriber.onStateChanged = (params)=>{
            latestStateParams = params;
            throttler.maybeExecute();
        };
        const subscription = agent.subscribe(wrappedSubscriber);
        return {
            unsubscribe: ()=>{
                active = false;
                throttler.cancel();
                subscription.unsubscribe();
            }
        };
    }
    /**
	* Agent connectivity (delegated to RunHandler)
	*/ async connectAgent(params) {
        return this.runHandler.connectAgent(params);
    }
    stopAgent(params) {
        this.runHandler.abortCurrentRun();
        params.agent.abortRun();
    }
    async runAgent(params) {
        return this.runHandler.runAgent(params);
    }
    /**
	* Programmatically execute a registered frontend tool without going through an LLM turn.
	* The handler runs, render components show up in the UI, and both the tool call and
	* result messages are added to `agent.messages`.
	*/ async runTool(params) {
        return this.runHandler.runTool(params);
    }
    /**
	* State management (delegated to StateManager)
	*/ getStateByRun(agentId, threadId, runId) {
        return this.stateManager.getStateByRun(agentId, threadId, runId);
    }
    getRunIdForMessage(agentId, threadId, messageId) {
        return this.stateManager.getRunIdForMessage(agentId, threadId, messageId);
    }
    getRawEventForMessage(agentId, threadId, messageId) {
        return this.stateManager.getRawEventForMessage(agentId, threadId, messageId);
    }
    getRunIdsForThread(agentId, threadId) {
        return this.stateManager.getRunIdsForThread(agentId, threadId);
    }
    /**
	* Internal method used by RunHandler to build frontend tools
	*/ buildFrontendTools(agentId) {
        return this.runHandler.buildFrontendTools(agentId);
    }
    /**
	* Called before each follow-up agent run (after tool execution).
	*
	* When a frontend tool handler calls framework state setters (e.g. React's
	* setState), those updates are batched and deferred — they do not take effect
	* until the framework's scheduler runs (React uses MessageChannel).
	* useAgentContext registers context via useLayoutEffect, which runs
	* synchronously after React commits that deferred batch.
	*
	* Without yielding here, the follow-up runAgent reads the context store
	* synchronously while the deferred updates are still pending, producing stale
	* context for the next agent turn.
	*
	* Override in framework-specific subclasses to yield to the framework
	* scheduler before the follow-up run. The base implementation is a no-op
	* because non-React environments have no deferred state to flush.
	*/ async waitForPendingFrameworkUpdates() {}
};
//#endregion
//#region src/types.ts
/**
* Status of a tool call execution
*/ let ToolCallStatus = /* @__PURE__ */ function(ToolCallStatus) {
    ToolCallStatus["InProgress"] = "inProgress";
    ToolCallStatus["Executing"] = "executing";
    ToolCallStatus["Complete"] = "complete";
    return ToolCallStatus;
}({});
//#endregion
//#region src/utils/markdown.ts
function completePartialMarkdown(input) {
    let s = input;
    const fenceMatches = Array.from(s.matchAll(/^(\s*)(`{3,}|~{3,})/gm));
    if (fenceMatches.length % 2 === 1) {
        const [, indent, fence] = fenceMatches[0];
        s += `\n${indent}${fence}`;
    }
    if (s.match(/\[([^\]]*)\]\(([^)]*)$/)) s += ")";
    const openElements = [];
    const chars = Array.from(s);
    const codeBlockRanges = [];
    const inlineCodeRanges = [];
    let tempCodeFenceCount = 0;
    let currentCodeBlockStart = -1;
    for(let i = 0; i < chars.length; i++)if (i === 0 || chars[i - 1] === "\n") {
        const lineMatch = s.substring(i).match(/^(\s*)(`{3,}|~{3,})/);
        if (lineMatch) {
            tempCodeFenceCount++;
            if (tempCodeFenceCount % 2 === 1) currentCodeBlockStart = i;
            else if (currentCodeBlockStart !== -1) {
                codeBlockRanges.push({
                    start: currentCodeBlockStart,
                    end: i + lineMatch[0].length
                });
                currentCodeBlockStart = -1;
            }
            i += lineMatch[0].length - 1;
        }
    }
    for(let i = 0; i < chars.length; i++)if (chars[i] === "`") {
        let backslashCount = 0;
        for(let j = i - 1; j >= 0 && chars[j] === "\\"; j--)backslashCount++;
        if (backslashCount % 2 === 0) {
            for(let j = i + 1; j < chars.length; j++)if (chars[j] === "`") {
                let closingBackslashCount = 0;
                for(let k = j - 1; k >= 0 && chars[k] === "\\"; k--)closingBackslashCount++;
                if (closingBackslashCount % 2 === 0) {
                    inlineCodeRanges.push({
                        start: i,
                        end: j + 1
                    });
                    i = j;
                    break;
                }
            }
        }
    }
    const isInCode = (pos)=>{
        return codeBlockRanges.some((range)=>pos >= range.start && pos < range.end) || inlineCodeRanges.some((range)=>pos >= range.start && pos < range.end);
    };
    for(let i = 0; i < chars.length; i++){
        const char = chars[i];
        const nextChar = chars[i + 1];
        const prevChar = chars[i - 1];
        if (isInCode(i)) continue;
        if (char === "[") {
            let isCompleteLink = false;
            let bracketDepth = 1;
            let j = i + 1;
            while(j < chars.length && bracketDepth > 0){
                if (chars[j] === "[" && !isInCode(j)) bracketDepth++;
                if (chars[j] === "]" && !isInCode(j)) bracketDepth--;
                j++;
            }
            if (bracketDepth === 0 && chars[j] === "(") {
                let parenDepth = 1;
                j++;
                while(j < chars.length && parenDepth > 0){
                    if (chars[j] === "(" && !isInCode(j)) parenDepth++;
                    if (chars[j] === ")" && !isInCode(j)) parenDepth--;
                    j++;
                }
                if (parenDepth === 0) {
                    isCompleteLink = true;
                    i = j - 1;
                    continue;
                }
            }
            if (!isCompleteLink) {
                const existingIndex = openElements.findIndex((el)=>el.type === "bracket");
                if (existingIndex !== -1) openElements.splice(existingIndex, 1);
                else openElements.push({
                    type: "bracket",
                    marker: "[",
                    position: i
                });
            }
        } else if (char === "*" && nextChar === "*") {
            const existingIndex = openElements.findIndex((el)=>el.type === "bold_star");
            if (existingIndex !== -1) openElements.splice(existingIndex, 1);
            else openElements.push({
                type: "bold_star",
                marker: "**",
                position: i
            });
            i++;
        } else if (char === "_" && nextChar === "_") {
            const existingIndex = openElements.findIndex((el)=>el.type === "bold_underscore");
            if (existingIndex !== -1) openElements.splice(existingIndex, 1);
            else openElements.push({
                type: "bold_underscore",
                marker: "__",
                position: i
            });
            i++;
        } else if (char === "~" && nextChar === "~") {
            const existingIndex = openElements.findIndex((el)=>el.type === "strike");
            if (existingIndex !== -1) openElements.splice(existingIndex, 1);
            else openElements.push({
                type: "strike",
                marker: "~~",
                position: i
            });
            i++;
        } else if (char === "*" && prevChar !== "*" && nextChar !== "*") {
            const existingIndex = openElements.findIndex((el)=>el.type === "italic_star");
            if (existingIndex !== -1) openElements.splice(existingIndex, 1);
            else openElements.push({
                type: "italic_star",
                marker: "*",
                position: i
            });
        } else if (char === "_" && prevChar !== "_" && nextChar !== "_") {
            const existingIndex = openElements.findIndex((el)=>el.type === "italic_underscore");
            if (existingIndex !== -1) openElements.splice(existingIndex, 1);
            else openElements.push({
                type: "italic_underscore",
                marker: "_",
                position: i
            });
        }
    }
    let backtickCount = 0;
    for(let i = 0; i < chars.length; i++)if (chars[i] === "`" && !isInCode(i)) backtickCount++;
    if (backtickCount % 2 === 1) s += "`";
    openElements.sort((a, b)=>b.position - a.position);
    const closers = openElements.map((el)=>{
        switch(el.type){
            case "bracket":
                return "]";
            case "bold_star":
                return "**";
            case "bold_underscore":
                return "__";
            case "strike":
                return "~~";
            case "italic_star":
                return "*";
            case "italic_underscore":
                return "_";
            default:
                return "";
        }
    });
    let result = s + closers.join("");
    const finalFenceMatches = Array.from(result.matchAll(/^(\s*)(`{3,}|~{3,})/gm));
    const hasUnclosedBacktick = (result.match(/`/g) || []).length % 2 === 1;
    const hasUnclosedCodeFence = finalFenceMatches.length % 2 === 1;
    let shouldCloseParens = !hasUnclosedBacktick && !hasUnclosedCodeFence;
    if (shouldCloseParens) {
        const lastOpenParen = result.lastIndexOf("(");
        if (lastOpenParen !== -1) {
            if ((result.substring(0, lastOpenParen).match(/`/g) || []).length % 2 === 1) shouldCloseParens = false;
        }
    }
    if (shouldCloseParens) {
        const openParens = (result.match(/\(/g) || []).length;
        const closeParens = (result.match(/\)/g) || []).length;
        if (openParens > closeParens) result += ")".repeat(openParens - closeParens);
    }
    return result;
}
//#endregion
//#region src/threads.ts
const THREADS_CHANNEL_EVENT = "thread_metadata";
const THREAD_RUN_ACTIVITY_CHANNEL_EVENT = "thread_run_activity";
const THREAD_SUBSCRIBE_PATH = "/threads/subscribe";
const MAX_SOCKET_RETRIES = 5;
const REQUEST_TIMEOUT_MS = 15e3;
const initialThreadState = {
    threads: [],
    isLoading: false,
    isFetchingNextPage: false,
    error: null,
    fetchMoreError: null,
    context: null,
    sessionId: 0,
    metadataCredentialsRequested: false,
    metadataJoinCode: null,
    nextCursor: null,
    inFlightMutationCount: 0,
    pendingDeletes: {}
};
const threadAdapterEvents = createActionGroup("Thread Adapter", {
    started: empty(),
    stopped: empty(),
    contextChanged: props(),
    fetchNextPageRequested: empty(),
    renameRequested: props(),
    archiveRequested: props(),
    unarchiveRequested: props(),
    deleteRequested: props(),
    newThreadStarted: empty()
});
const threadRestEvents = createActionGroup("Thread REST", {
    listRequested: props(),
    listSucceeded: props(),
    listFailed: props(),
    nextPageSucceeded: props(),
    nextPageFailed: props(),
    metadataCredentialsRequested: props(),
    metadataCredentialsSucceeded: props(),
    metadataCredentialsFailed: props(),
    mutationFinished: props()
});
const threadSocketEvents = createActionGroup("Thread Socket", {
    opened: props(),
    errored: props(),
    joinFailed: props(),
    joinTimedOut: props(),
    metadataReceived: props(),
    runActivityReceived: props()
});
const threadDomainEvents = createActionGroup("Thread Domain", {
    threadUpserted: props(),
    threadDeleted: props()
});
function sortThreadsByRecency(threads) {
    return [
        ...threads
    ].sort((left, right)=>{
        const leftKey = left.lastRunAt ?? left.updatedAt ?? left.createdAt;
        return (right.lastRunAt ?? right.updatedAt ?? right.createdAt).localeCompare(leftKey);
    });
}
function upsertThread(threads, thread) {
    const existingIndex = threads.findIndex((item)=>item.id === thread.id);
    if (existingIndex === -1) return sortThreadsByRecency([
        ...threads,
        thread
    ]);
    const next = [
        ...threads
    ];
    next[existingIndex] = thread;
    return sortThreadsByRecency(next);
}
/**
* Returns a non-empty string payload field or undefined for absent fields.
*/ function optionalString(value) {
    return typeof value === "string" && value.length > 0 ? value : void 0;
}
/**
* REST `/threads` is agent-scoped. The Phoenix `user_meta` channel is not.
* Drop live upserts that belong to a different agent, or one Inspector
* `all-agents` flatten shows the same thread twice until a hard refresh.
*/ function threadMetadataTargetsAgent(payload, agentId) {
    if (!agentId || payload.operation === "deleted") return true;
    const threadAgentId = optionalString(payload.thread.agentId);
    return !threadAgentId || threadAgentId === agentId;
}
/**
* Converts gateway run-activity payloads into the internal TypeScript shape.
*/ function normalizeThreadRunActivityNotification(payload) {
    const threadId = optionalString(payload.threadId ?? payload.thread_id);
    const eventType = optionalString(payload.eventType ?? payload.event_type);
    if (!threadId || !eventType) return null;
    return {
        type: "thread_run_activity",
        threadId,
        agentId: optionalString(payload.agentId ?? payload.agent_id),
        runId: optionalString(payload.runId ?? payload.run_id),
        eventType,
        latestEventId: optionalString(payload.latestEventId ?? payload.latest_event_id)
    };
}
const threadReducer = createReducer(initialThreadState, on(threadAdapterEvents.contextChanged, (state, { context })=>({
        ...state,
        context,
        sessionId: state.sessionId + 1,
        threads: [],
        isLoading: Boolean(context),
        isFetchingNextPage: false,
        error: null,
        fetchMoreError: null,
        metadataCredentialsRequested: false,
        metadataJoinCode: null,
        nextCursor: null,
        inFlightMutationCount: 0,
        pendingDeletes: {}
    })), on(threadAdapterEvents.stopped, (state)=>({
        ...state,
        threads: [],
        isLoading: false,
        isFetchingNextPage: false,
        error: null,
        fetchMoreError: null,
        metadataCredentialsRequested: false,
        metadataJoinCode: null,
        nextCursor: null,
        inFlightMutationCount: 0,
        pendingDeletes: {}
    })), on(threadRestEvents.listRequested, (state, { sessionId })=>{
    if (sessionId !== state.sessionId || !state.context) return state;
    return {
        ...state,
        isLoading: true,
        error: null,
        fetchMoreError: null
    };
}), on(threadRestEvents.listSucceeded, (state, { sessionId, threads, joinCode, nextCursor })=>{
    if (sessionId !== state.sessionId) return state;
    const joinCodeChanged = joinCode !== state.metadataJoinCode;
    return {
        ...state,
        threads: sortThreadsByRecency(threads),
        isLoading: false,
        error: null,
        fetchMoreError: null,
        metadataJoinCode: joinCode,
        metadataCredentialsRequested: joinCodeChanged ? false : state.metadataCredentialsRequested,
        nextCursor
    };
}), on(threadRestEvents.listFailed, (state, { sessionId, error })=>{
    if (sessionId !== state.sessionId) return state;
    return {
        ...state,
        isLoading: false,
        error
    };
}), on(threadRestEvents.nextPageSucceeded, (state, { sessionId, threads, nextCursor })=>{
    if (sessionId !== state.sessionId) return state;
    let merged = state.threads;
    for (const thread of threads)merged = upsertThread(merged, thread);
    return {
        ...state,
        threads: merged,
        isFetchingNextPage: false,
        fetchMoreError: null,
        nextCursor
    };
}), on(threadRestEvents.nextPageFailed, (state, { sessionId, error })=>{
    if (sessionId !== state.sessionId) return state;
    return {
        ...state,
        isFetchingNextPage: false,
        fetchMoreError: error
    };
}), on(threadRestEvents.metadataCredentialsFailed, (state, { sessionId })=>{
    if (sessionId !== state.sessionId) return state;
    return {
        ...state,
        metadataCredentialsRequested: false
    };
}), on(threadRestEvents.metadataCredentialsRequested, (state, { sessionId })=>{
    if (sessionId !== state.sessionId) return state;
    return {
        ...state,
        metadataCredentialsRequested: true
    };
}), on(threadAdapterEvents.fetchNextPageRequested, (state)=>{
    if (!state.nextCursor || state.isFetchingNextPage) return state;
    return {
        ...state,
        isFetchingNextPage: true,
        fetchMoreError: null
    };
}), on(threadAdapterEvents.renameRequested, (state, { threadId, name })=>{
    const existing = state.threads.find((thread)=>thread.id === threadId);
    const inFlightMutationCount = state.inFlightMutationCount + 1;
    if (!existing) return {
        ...state,
        inFlightMutationCount
    };
    return {
        ...state,
        threads: upsertThread(state.threads, {
            ...existing,
            name
        }),
        inFlightMutationCount
    };
}), on(threadAdapterEvents.archiveRequested, (state, { threadId })=>{
    const existing = state.threads.find((thread)=>thread.id === threadId);
    const inFlightMutationCount = state.inFlightMutationCount + 1;
    if (!existing) return {
        ...state,
        inFlightMutationCount
    };
    if (!state.context?.includeArchived) return {
        ...state,
        threads: state.threads.filter((thread)=>thread.id !== threadId),
        inFlightMutationCount
    };
    return {
        ...state,
        threads: upsertThread(state.threads, {
            ...existing,
            archived: true
        }),
        inFlightMutationCount
    };
}), on(threadAdapterEvents.unarchiveRequested, (state, { threadId })=>{
    const existing = state.threads.find((thread)=>thread.id === threadId);
    const inFlightMutationCount = state.inFlightMutationCount + 1;
    if (!existing) return {
        ...state,
        inFlightMutationCount
    };
    return {
        ...state,
        threads: upsertThread(state.threads, {
            ...existing,
            archived: false
        }),
        inFlightMutationCount
    };
}), on(threadAdapterEvents.deleteRequested, (state, { requestId, threadId })=>{
    const existing = state.threads.find((thread)=>thread.id === threadId);
    const inFlightMutationCount = state.inFlightMutationCount + 1;
    if (!existing) return {
        ...state,
        inFlightMutationCount
    };
    return {
        ...state,
        threads: state.threads.filter((thread)=>thread.id !== threadId),
        pendingDeletes: {
            ...state.pendingDeletes,
            [requestId]: existing
        },
        inFlightMutationCount
    };
}), on(threadAdapterEvents.newThreadStarted, (state)=>({
        ...state,
        error: null
    })), on(threadRestEvents.mutationFinished, (state, { outcome })=>{
    if (outcome.sessionId !== state.sessionId) return state;
    const inFlightMutationCount = Math.max(0, state.inFlightMutationCount - 1);
    if (outcome.ok) {
        if (state.pendingDeletes[outcome.requestId] === void 0) return {
            ...state,
            inFlightMutationCount
        };
        const { [outcome.requestId]: _settled, ...rest } = state.pendingDeletes;
        return {
            ...state,
            inFlightMutationCount,
            pendingDeletes: rest
        };
    }
    const rolledBack = state.pendingDeletes[outcome.requestId];
    if (rolledBack === void 0) return {
        ...state,
        inFlightMutationCount,
        error: outcome.error
    };
    const { [outcome.requestId]: _restored, ...rest } = state.pendingDeletes;
    return {
        ...state,
        threads: upsertThread(state.threads, rolledBack),
        pendingDeletes: rest,
        inFlightMutationCount,
        error: outcome.error
    };
}), on(threadDomainEvents.threadUpserted, (state, { sessionId, thread })=>{
    if (sessionId !== state.sessionId) return state;
    return {
        ...state,
        threads: upsertThread(state.threads, thread)
    };
}), on(threadDomainEvents.threadDeleted, (state, { sessionId, threadId })=>{
    if (sessionId !== state.sessionId) return state;
    return {
        ...state,
        threads: state.threads.filter((thread)=>thread.id !== threadId)
    };
}));
/**
* Builds a fresh set of memoized thread selectors.
*
* Each `createSelector` closure owns a private one-entry cache. Sharing a
* single module-level selector instance across multiple concurrent stores
* (e.g. a `<CopilotThreadsDrawer>` plus an independent `useThreads`) makes every
* cross-store emission a cache miss, defeating memoization and risking
* emission instability for any future selector that allocates a new
* object/array. Creating a per-store instance keeps each store's cache
* isolated so concurrent stores never thrash one another.
*/ function createThreadSelectors() {
    return {
        threads: createSelector((state)=>state.threads),
        isLoading: createSelector((state)=>state.isLoading),
        error: createSelector((state)=>state.error),
        fetchMoreError: createSelector((state)=>state.fetchMoreError),
        hasNextPage: createSelector((state)=>state.nextCursor != null),
        isFetchingNextPage: createSelector((state)=>state.isFetchingNextPage),
        isMutating: createSelector((state)=>state.inFlightMutationCount > 0)
    };
}
const standaloneSelectors = createThreadSelectors();
const selectThreads = standaloneSelectors.threads;
const selectThreadsIsLoading = standaloneSelectors.isLoading;
const selectThreadsError = standaloneSelectors.error;
const selectFetchMoreError = standaloneSelectors.fetchMoreError;
const selectHasNextPage = standaloneSelectors.hasNextPage;
const selectIsFetchingNextPage = standaloneSelectors.isFetchingNextPage;
const selectIsMutating = standaloneSelectors.isMutating;
let threadRequestId = 0;
function createThreadRequestId() {
    threadRequestId += 1;
    return `thread-request-${threadRequestId}`;
}
function threadFromFetch(input, init) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$Observable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Observable"]((subscriber)=>{
        const { fetch: fetchImpl, selector, signal, ...requestInit } = init;
        const controller = new AbortController();
        const abortRequest = ()=>controller.abort();
        if (signal?.aborted) abortRequest();
        else signal?.addEventListener("abort", abortRequest, {
            once: true
        });
        fetchImpl(input, {
            ...requestInit,
            signal: controller.signal
        }).then((response)=>selector(response)).then((value)=>{
            if (subscriber.closed) return;
            subscriber.next(value);
            subscriber.complete();
        }).catch((error)=>{
            if (!subscriber.closed) subscriber.error(error);
        });
        return ()=>{
            signal?.removeEventListener("abort", abortRequest);
            abortRequest();
        };
    });
}
function createThreadFetchObservable(environment, context, sessionId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>{
        const params = {
            agentId: context.agentId
        };
        if (context.includeArchived) params.includeArchived = "true";
        if (context.limit != null) params.limit = String(context.limit);
        const qs = new URLSearchParams(params);
        return threadFromFetch(`${context.runtimeUrl}/threads?${qs.toString()}`, {
            selector: (response)=>{
                if (!response.ok) throw new Error(`Failed to fetch threads: ${response.status}`);
                return response.json();
            },
            fetch: environment.fetch,
            method: "GET",
            headers: {
                ...context.headers
            }
        }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeout"])({
            first: REQUEST_TIMEOUT_MS,
            with: ()=>{
                throw new Error("Request timed out");
            }
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((data)=>threadRestEvents.listSucceeded({
                sessionId,
                threads: data.threads,
                joinCode: typeof data.joinCode === "string" && data.joinCode.length > 0 ? data.joinCode : null,
                nextCursor: data.nextCursor ?? null
            })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catchError"])((error)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(threadRestEvents.listFailed({
                sessionId,
                error: error instanceof Error ? error : new Error(String(error))
            }));
        }));
    });
}
function createThreadMetadataCredentialsObservable(environment, context, sessionId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>{
        return threadFromFetch(`${context.runtimeUrl}${THREAD_SUBSCRIBE_PATH}`, {
            selector: async (response)=>{
                if (!response.ok) throw new Error(`Failed to fetch thread metadata credentials: ${response.status}`);
                return response.json();
            },
            fetch: environment.fetch,
            method: "POST",
            headers: {
                ...context.headers,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeout"])({
            first: REQUEST_TIMEOUT_MS,
            with: ()=>{
                throw new Error("Request timed out");
            }
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((data)=>{
            if (typeof data.joinToken !== "string" || data.joinToken.length === 0) throw new Error("missing joinToken");
            return threadRestEvents.metadataCredentialsSucceeded({
                sessionId,
                joinToken: data.joinToken
            });
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catchError"])((error)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(threadRestEvents.metadataCredentialsFailed({
                sessionId,
                error: error instanceof Error ? error : new Error(String(error))
            }));
        }));
    });
}
function createThreadMutationObservable(environment, context, request) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>{
        return threadFromFetch(`${context.runtimeUrl}${request.path}`, {
            selector: async (response)=>{
                if (!response.ok) throw new Error(`Request failed: ${response.status}`);
                return null;
            },
            fetch: environment.fetch,
            method: request.method,
            headers: {
                ...context.headers,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request.body)
        }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(()=>threadRestEvents.mutationFinished({
                outcome: {
                    requestId: request.requestId,
                    sessionId: request.sessionId,
                    ok: true
                }
            })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catchError"])((error)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(threadRestEvents.mutationFinished({
                outcome: {
                    requestId: request.requestId,
                    sessionId: request.sessionId,
                    ok: false,
                    error: error instanceof Error ? error : new Error(String(error))
                }
            }));
        }));
    });
}
function createThreadStore(environment) {
    const selectors = createThreadSelectors();
    const store = createStore({
        reducer: threadReducer,
        effects: [
            createEffect((actions$, state$)=>actions$.pipe(ofType(threadAdapterEvents.contextChanged), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$withLatestFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withLatestFrom"])(state$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(([, state])=>Boolean(state.context)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(([, state])=>threadRestEvents.listRequested({
                        sessionId: state.sessionId
                    })))),
            createEffect((actions$, state$)=>actions$.pipe(ofType(threadRestEvents.listRequested), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])((action)=>state$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((state)=>state.context), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])((context)=>Boolean(context)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$take$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((context)=>({
                            action,
                            context
                        })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$takeUntil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takeUntil"])(actions$.pipe(ofType(threadAdapterEvents.contextChanged, threadAdapterEvents.stopped))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])(({ action: currentAction, context })=>createThreadFetchObservable(environment, context, currentAction.sessionId)))))),
            createEffect((actions$, state$)=>actions$.pipe(ofType(threadRestEvents.listSucceeded), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$withLatestFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withLatestFrom"])(state$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(([action, state])=>{
                    return action.sessionId === state.sessionId && !state.metadataCredentialsRequested && Boolean(state.context?.wsUrl) && Boolean(state.metadataJoinCode);
                }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(([action])=>threadRestEvents.metadataCredentialsRequested({
                        sessionId: action.sessionId
                    })))),
            createEffect((actions$, state$)=>actions$.pipe(ofType(threadRestEvents.metadataCredentialsRequested), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])((action)=>state$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((state)=>state.context), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])((context)=>Boolean(context)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$take$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((context)=>({
                            action,
                            context
                        })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$takeUntil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takeUntil"])(actions$.pipe(ofType(threadAdapterEvents.contextChanged, threadAdapterEvents.stopped))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])(({ action: currentAction, context })=>createThreadMetadataCredentialsObservable(environment, context, currentAction.sessionId)))))),
            createEffect((actions$, state$)=>actions$.pipe(ofType(threadRestEvents.metadataCredentialsSucceeded), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$withLatestFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withLatestFrom"])(state$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(([action, state])=>{
                    return action.sessionId === state.sessionId && Boolean(state.context?.wsUrl);
                }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])(([action, state])=>{
                    const context = state.context;
                    const joinToken = action.joinToken;
                    const joinCode = state.metadataJoinCode;
                    const shutdown$ = actions$.pipe(ofType(threadAdapterEvents.contextChanged, threadAdapterEvents.stopped));
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$defer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defer"])(()=>{
                        const socket$ = ɵphoenixSocket$({
                            url: context.wsUrl,
                            options: {
                                params: {
                                    join_token: joinToken
                                },
                                reconnectAfterMs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["phoenixExponentialBackoff"])(100, 1e4),
                                rejoinAfterMs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["phoenixExponentialBackoff"])(1e3, 3e4)
                            }
                        }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$shareReplay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareReplay"])({
                            bufferSize: 1,
                            refCount: true
                        }));
                        const channel$ = ɵphoenixChannel$({
                            socket$,
                            topic: `user_meta:${joinCode}`
                        }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$shareReplay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareReplay"])({
                            bufferSize: 1,
                            refCount: true
                        }));
                        const socketSignals$ = ɵobservePhoenixSocketSignals$(socket$).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$share$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["share"])());
                        const fatalSocketShutdown$ = ɵobservePhoenixSocketHealth$(socketSignals$, MAX_SOCKET_RETRIES).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catchError"])(()=>{
                            console.warn(`[threads] WebSocket failed after ${MAX_SOCKET_RETRIES} attempts, giving up`);
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(void 0);
                        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$share$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["share"])());
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])(socketSignals$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((signal)=>signal.type === "open" ? threadSocketEvents.opened({
                                sessionId: action.sessionId
                            }) : threadSocketEvents.errored({
                                sessionId: action.sessionId
                            }))), channel$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])(({ channel })=>ɵobservePhoenixEvent$(channel, THREADS_CHANNEL_EVENT)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((payload)=>threadSocketEvents.metadataReceived({
                                sessionId: action.sessionId,
                                payload
                            }))), channel$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])(({ channel })=>ɵobservePhoenixEvent$(channel, THREAD_RUN_ACTIVITY_CHANNEL_EVENT)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((payload)=>normalizeThreadRunActivityNotification(payload)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])((notification)=>notification !== null), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((notification)=>threadSocketEvents.runActivityReceived({
                                sessionId: action.sessionId,
                                notification
                            }))), ɵobservePhoenixJoinOutcome$(channel$).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])((outcome)=>outcome.type !== "joined"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((outcome)=>outcome.type === "timeout" ? threadSocketEvents.joinTimedOut({
                                sessionId: action.sessionId
                            }) : threadSocketEvents.joinFailed({
                                sessionId: action.sessionId
                            })))).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$takeUntil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takeUntil"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])(shutdown$, fatalSocketShutdown$)));
                    });
                }))),
            createEffect((actions$, state$)=>actions$.pipe(ofType(threadSocketEvents.metadataReceived), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$withLatestFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withLatestFrom"])(state$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(([action, state])=>action.sessionId === state.sessionId && threadMetadataTargetsAgent(action.payload, state.context?.agentId)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(([action, state])=>{
                    if (action.payload.operation === "deleted") return threadDomainEvents.threadDeleted({
                        sessionId: action.sessionId,
                        threadId: action.payload.deleted.id
                    });
                    if (action.payload.operation === "archived" && !state.context?.includeArchived) return threadDomainEvents.threadDeleted({
                        sessionId: action.sessionId,
                        threadId: action.payload.threadId
                    });
                    return threadDomainEvents.threadUpserted({
                        sessionId: action.sessionId,
                        thread: action.payload.thread
                    });
                }))),
            createEffect((actions$, state$)=>actions$.pipe(ofType(threadSocketEvents.joinFailed, threadSocketEvents.joinTimedOut, threadSocketEvents.errored, threadRestEvents.metadataCredentialsFailed), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$withLatestFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withLatestFrom"])(state$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(([action, state])=>action.sessionId === state.sessionId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$tap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tap"])(([action])=>{
                    const reason = threadSocketEvents.joinTimedOut.match(action) ? "channel join timed out" : threadSocketEvents.joinFailed.match(action) ? "channel join was rejected" : threadRestEvents.metadataCredentialsFailed.match(action) ? "metadata credentials fetch failed" : "socket errored";
                    console.warn(`[threads] realtime ${reason}; the thread list may be stale until reconnect`);
                })), {
                dispatch: false
            }),
            createEffect((actions$, state$)=>actions$.pipe(ofType(threadAdapterEvents.fetchNextPageRequested), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$withLatestFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withLatestFrom"])(state$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(([, state])=>Boolean(state.context) && Boolean(state.nextCursor)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$switchMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchMap"])(([, state])=>{
                    const context = state.context;
                    const params = {
                        agentId: context.agentId,
                        cursor: state.nextCursor
                    };
                    if (context.includeArchived) params.includeArchived = "true";
                    if (context.limit != null) params.limit = String(context.limit);
                    return threadFromFetch(`${context.runtimeUrl}/threads?${new URLSearchParams(params).toString()}`, {
                        selector: (response)=>{
                            if (!response.ok) throw new Error(`Failed to fetch next page: ${response.status}`);
                            return response.json();
                        },
                        fetch: environment.fetch,
                        method: "GET",
                        headers: {
                            ...context.headers
                        }
                    }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeout"])({
                        first: REQUEST_TIMEOUT_MS,
                        with: ()=>{
                            throw new Error("Request timed out");
                        }
                    }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((data)=>threadRestEvents.nextPageSucceeded({
                            sessionId: state.sessionId,
                            threads: data.threads,
                            nextCursor: data.nextCursor ?? null
                        })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$catchError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catchError"])((error)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(threadRestEvents.nextPageFailed({
                            sessionId: state.sessionId,
                            error: error instanceof Error ? error : new Error(String(error))
                        }))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$takeUntil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takeUntil"])(actions$.pipe(ofType(threadAdapterEvents.contextChanged, threadAdapterEvents.stopped))));
                }))),
            createEffect((actions$, state$)=>actions$.pipe(ofType(threadAdapterEvents.renameRequested, threadAdapterEvents.archiveRequested, threadAdapterEvents.unarchiveRequested, threadAdapterEvents.deleteRequested), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$withLatestFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withLatestFrom"])(state$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$mergeMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeMap"])(([action, state])=>{
                    const sessionId = state.sessionId;
                    const context = state.context;
                    if (!context?.runtimeUrl) {
                        const requestId = action.requestId;
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$of$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["of"])(threadRestEvents.mutationFinished({
                            outcome: {
                                requestId,
                                sessionId,
                                ok: false,
                                error: /* @__PURE__ */ new Error("Runtime URL is not configured")
                            }
                        }));
                    }
                    const commonBody = {
                        agentId: context.agentId
                    };
                    if (threadAdapterEvents.renameRequested.match(action)) return createThreadMutationObservable(environment, context, {
                        requestId: action.requestId,
                        sessionId,
                        method: "PATCH",
                        path: `/threads/${encodeURIComponent(action.threadId)}`,
                        body: {
                            ...commonBody,
                            name: action.name
                        }
                    });
                    if (threadAdapterEvents.archiveRequested.match(action)) return createThreadMutationObservable(environment, context, {
                        requestId: action.requestId,
                        sessionId,
                        method: "POST",
                        path: `/threads/${encodeURIComponent(action.threadId)}/archive`,
                        body: commonBody
                    });
                    if (threadAdapterEvents.unarchiveRequested.match(action)) return createThreadMutationObservable(environment, context, {
                        requestId: action.requestId,
                        sessionId,
                        method: "PATCH",
                        path: `/threads/${encodeURIComponent(action.threadId)}`,
                        body: {
                            ...commonBody,
                            archived: false
                        }
                    });
                    return createThreadMutationObservable(environment, context, {
                        requestId: action.requestId,
                        sessionId,
                        method: "DELETE",
                        path: `/threads/${encodeURIComponent(action.threadId)}`,
                        body: commonBody
                    });
                })))
        ]
    });
    function trackMutation(dispatchAction) {
        const resultPromise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$firstValueFrom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firstValueFrom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$observable$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])(store.actions$.pipe(ofType(threadRestEvents.mutationFinished), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])((action)=>action.outcome.requestId === dispatchAction.requestId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((action)=>action.outcome)), store.actions$.pipe(ofType(threadAdapterEvents.stopped), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(()=>({
                requestId: dispatchAction.requestId,
                sessionId: store.getState().sessionId,
                ok: false,
                error: /* @__PURE__ */ new Error("Thread store stopped before mutation completed")
            })))).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$take$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["take"])(1))).then((outcome)=>{
            if (outcome.ok) return;
            throw outcome.error;
        });
        store.dispatch(dispatchAction);
        return resultPromise;
    }
    let errorSubscription = null;
    const subscribeErrors = ()=>{
        if (!environment.onError || errorSubscription) return;
        errorSubscription = store.actions$.pipe(ofType(threadRestEvents.mutationFinished), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])((action)=>!action.outcome.ok && action.outcome.sessionId === store.getState().sessionId)).subscribe((action)=>{
            if (!action.outcome.ok) environment.onError?.(action.outcome.error);
        });
    };
    return {
        start () {
            store.init();
            subscribeErrors();
            store.dispatch(threadAdapterEvents.started());
        },
        stop () {
            store.dispatch(threadAdapterEvents.stopped());
            errorSubscription?.unsubscribe();
            errorSubscription = null;
            store.stop();
        },
        setContext (context) {
            store.dispatch(threadAdapterEvents.contextChanged({
                context
            }));
        },
        refresh () {
            const { sessionId, context } = store.getState();
            if (!context) return;
            store.dispatch(threadRestEvents.listRequested({
                sessionId
            }));
        },
        refetchThreads () {
            const { sessionId, context } = store.getState();
            if (!context) return;
            store.dispatch(threadRestEvents.listRequested({
                sessionId
            }));
        },
        startNewThread () {
            store.dispatch(threadAdapterEvents.newThreadStarted());
        },
        fetchNextPage () {
            store.dispatch(threadAdapterEvents.fetchNextPageRequested());
        },
        renameThread (threadId, name) {
            return trackMutation(threadAdapterEvents.renameRequested({
                requestId: createThreadRequestId(),
                threadId,
                name
            }));
        },
        archiveThread (threadId) {
            return trackMutation(threadAdapterEvents.archiveRequested({
                requestId: createThreadRequestId(),
                threadId
            }));
        },
        unarchiveThread (threadId) {
            return trackMutation(threadAdapterEvents.unarchiveRequested({
                requestId: createThreadRequestId(),
                threadId
            }));
        },
        deleteThread (threadId) {
            return trackMutation(threadAdapterEvents.deleteRequested({
                requestId: createThreadRequestId(),
                threadId
            }));
        },
        subscribeToRunActivity (callback) {
            return store.actions$.pipe(ofType(threadSocketEvents.runActivityReceived), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])((action)=>action.sessionId === store.getState().sessionId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$rxjs$2f$dist$2f$esm5$2f$internal$2f$operators$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])((action)=>action.notification)).subscribe(callback);
        },
        getState () {
            return store.getState();
        },
        getServerState () {
            return initialThreadState;
        },
        select: store.select.bind(store),
        selectors
    };
}
const ɵthreadAdapterEvents = threadAdapterEvents;
const ɵcreateThreadSelectors = createThreadSelectors;
const ɵselectThreads = selectThreads;
const ɵselectThreadsIsLoading = selectThreadsIsLoading;
const ɵselectThreadsError = selectThreadsError;
const ɵselectFetchMoreError = selectFetchMoreError;
const ɵselectHasNextPage = selectHasNextPage;
const ɵselectIsFetchingNextPage = selectIsFetchingNextPage;
const ɵselectIsMutating = selectIsMutating;
/**
* Number of consecutive WebSocket connection failures after which the
* threads channel tears itself down rather than retrying indefinitely.
* Exposed for tests so they can assert teardown semantics without
* hardcoding the threshold separately from production.
*/ const ɵMAX_SOCKET_RETRIES = MAX_SOCKET_RETRIES;
//#endregion
//#region src/features.ts
/**
* Central registry of CopilotKit feature names.
*
* Feature names are the strings passed to a license context's `checkFeature`
* (see `@copilotkit/shared`'s `LicenseContextValue`). Historically the only
* features referenced by literal were the chat surfaces (`chat`, `sidebar`,
* `popup`); this module makes the set explicit and typed so new surfaces —
* such as the threads drawer — register a real, discoverable feature name
* rather than an ad-hoc string scattered across components.
*
* `checkFeature` itself still accepts any `string` for backward compatibility;
* this registry simply documents and types the names CopilotKit recognises.
*/ /**
* The set of feature names CopilotKit recognises.
*
* Frozen so the array cannot be mutated at runtime. Add new surfaces here when
* they begin gating behaviour on `checkFeature`.
*/ const ɵCOPILOTKIT_FEATURES = Object.freeze([
    "chat",
    "sidebar",
    "popup",
    "threads"
]);
const FEATURE_SET = new Set(ɵCOPILOTKIT_FEATURES);
/**
* Type guard: returns `true` when `name` is a recognised CopilotKit feature.
*
* @param name - Candidate feature name.
* @returns Whether `name` is a registered feature.
*
* @example
* ```ts
* if (ɵisCopilotKitFeature("threads")) {
*   // narrowed to ɵCopilotKitFeature
* }
* ```
*/ function ɵisCopilotKitFeature(name) {
    return FEATURE_SET.has(name);
}
//#endregion
//#region src/interrupt-state.ts
function toolResultContent(response) {
    if (response.status === "cancelled") return JSON.stringify({
        status: "cancelled"
    });
    return JSON.stringify(response.payload ?? {
        status: "resolved"
    });
}
/**
* @internal Framework-neutral interrupt response state shared by framework
* adapters. Application authors must not depend on this API.
*/ var ɵInterruptState = class {
    #responses = {};
    #pending = null;
    #sealed = false;
    /** Return the active normalized interrupt without exposing mutable state. */ get pending() {
        const pending = this.#pending;
        if (pending?.kind === "standard") return {
            kind: "standard",
            interrupts: [
                ...pending.interrupts
            ]
        };
        return pending;
    }
    /** Replace the current interrupt with a legacy custom-event interrupt. */ setLegacy(event) {
        this.#replace({
            kind: "legacy",
            event
        });
    }
    /** Replace the current interrupt with an AG-UI standard interrupt set. */ setStandard(interrupts) {
        this.#replace({
            kind: "standard",
            interrupts: [
                ...interrupts
            ]
        });
    }
    /** Clear all pending interrupt data and accumulated responses. */ clear() {
        this.#pending = null;
        this.#sealed = false;
        for (const id of Object.keys(this.#responses))delete this.#responses[id];
    }
    /** Record a resolved response and return the next framework action. */ resolve(payload, interruptId) {
        const pending = this.#pending;
        if (!pending || this.#sealed) return {
            kind: "ignored"
        };
        if (pending.kind === "legacy") {
            this.#sealed = true;
            return {
                kind: "legacy-resume",
                payload,
                interruptValue: pending.event.value
            };
        }
        return this.#respond(pending.interrupts, interruptId, {
            status: "resolved",
            payload
        });
    }
    /** Record a cancelled response and return the next framework action. */ cancel(interruptId) {
        const pending = this.#pending;
        if (!pending || this.#sealed) return {
            kind: "ignored"
        };
        if (pending.kind === "legacy") {
            this.#sealed = true;
            return {
                kind: "dismiss"
            };
        }
        return this.#respond(pending.interrupts, interruptId, {
            status: "cancelled"
        });
    }
    #replace(pending) {
        this.clear();
        this.#pending = pending;
    }
    #respond(interrupts, interruptId, response) {
        const id = interruptId ?? interrupts[0]?.id;
        if (!id || !interrupts.some((interrupt)=>interrupt.id === id)) return {
            kind: "ignored"
        };
        this.#responses[id] = response;
        if (!interrupts.every((interrupt)=>this.#responses[interrupt.id])) return {
            kind: "waiting"
        };
        const expired = interrupts.find((interrupt)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isInterruptExpired"])(interrupt));
        if (expired) {
            this.#sealed = true;
            return {
                kind: "expired",
                interrupt: expired
            };
        }
        const mutableInterrupts = [
            ...interrupts
        ];
        const resume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["buildResumeArray"])(mutableInterrupts, this.#responses);
        const toolResults = mutableInterrupts.flatMap((interrupt)=>{
            if (!interrupt.toolCallId || interrupt.reason !== "tool_call") return [];
            return [
                {
                    toolCallId: interrupt.toolCallId,
                    content: toolResultContent(this.#responses[interrupt.id])
                }
            ];
        });
        this.#sealed = true;
        return {
            kind: "resume",
            resume,
            toolResults
        };
    }
};
//#endregion
//#region src/inspector-thread-bridge.ts
const INSPECTOR_THREAD_BRIDGE_PLUGIN_ID = "cpk-inspector-thread";
const EVENT_PREFIX = `copilotkit:${INSPECTOR_THREAD_BRIDGE_PLUGIN_ID}`;
function eventName(suffix) {
    return `${EVENT_PREFIX}:${suffix}`;
}
function getEventTarget() {
    if (typeof window !== "undefined" && typeof window.addEventListener === "function") return window;
    if (typeof EventTarget === "undefined") return null;
    const sharedGlobal = globalThis;
    sharedGlobal.__COPILOTKIT_INSPECTOR_THREAD_EVENT_TARGET__ ??= new EventTarget();
    return sharedGlobal.__COPILOTKIT_INSPECTOR_THREAD_EVENT_TARGET__;
}
function createDetailEvent(name, detail) {
    if (typeof CustomEvent !== "undefined") return new CustomEvent(name, {
        detail
    });
    const event = new Event(name);
    Object.defineProperty(event, "detail", {
        value: detail
    });
    return event;
}
function detailFromEvent(event) {
    return event.detail;
}
/** The Inspector thread bridge is development-only. */ function isInspectorThreadBridgeEnabled() {
    return ("TURBOPACK compile-time value", "development") !== "production";
}
function createInspectorThreadRequestId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return `inspector-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function dispatch(suffix, payload) {
    if (!isInspectorThreadBridgeEnabled()) //TURBOPACK unreachable
    ;
    const target = getEventTarget();
    if (!target) return;
    target.dispatchEvent(createDetailEvent(eventName(suffix), payload));
}
function on$1(suffix, handler) {
    if (!isInspectorThreadBridgeEnabled()) //TURBOPACK unreachable
    ;
    const target = getEventTarget();
    if (!target) return ()=>void 0;
    const listener = (event)=>{
        handler(detailFromEvent(event));
    };
    const name = eventName(suffix);
    target.addEventListener(name, listener);
    return ()=>target.removeEventListener(name, listener);
}
/**
* Ask the first mounted official chat for the matching agent to load a thread.
* Returns false when no chat claims the request synchronously.
*/ function emitInspectorViewThread(payload) {
    if (!isInspectorThreadBridgeEnabled()) //TURBOPACK unreachable
    ;
    const target = getEventTarget();
    if (!target) return false;
    const detail = {
        payload,
        claimed: false
    };
    target.dispatchEvent(createDetailEvent(eventName("view-thread"), detail));
    return detail.claimed;
}
function emitInspectorStopViewing(payload) {
    dispatch("stop-viewing", payload);
}
function emitInspectorActiveThread(payload) {
    dispatch("active-thread", payload);
}
function emitInspectorViewThreadResult(payload) {
    dispatch("view-thread-result", payload);
}
function onInspectorViewThread(handler) {
    if (!isInspectorThreadBridgeEnabled()) //TURBOPACK unreachable
    ;
    const target = getEventTarget();
    if (!target) return ()=>void 0;
    const listener = (event)=>{
        const detail = detailFromEvent(event);
        if (detail.claimed) return;
        detail.claimed = handler(detail.payload);
    };
    const name = eventName("view-thread");
    target.addEventListener(name, listener);
    return ()=>target.removeEventListener(name, listener);
}
function onInspectorStopViewing(handler) {
    return on$1("stop-viewing", handler);
}
function onInspectorActiveThread(handler) {
    return on$1("active-thread", handler);
}
function onInspectorViewThreadResult(handler) {
    return on$1("view-thread-result", handler);
}
;
}),
]);

//# sourceMappingURL=19xk_%40copilotkit_core_dist_index_mjs_17owtn8._.js.map