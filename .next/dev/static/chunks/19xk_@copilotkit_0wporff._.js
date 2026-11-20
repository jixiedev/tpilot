(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/@copilotkit/shared/dist/a2ui-prompts.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "A2UI_DEFAULT_DESIGN_GUIDELINES",
    ()=>A2UI_DEFAULT_DESIGN_GUIDELINES,
    "A2UI_DEFAULT_GENERATION_GUIDELINES",
    ()=>A2UI_DEFAULT_GENERATION_GUIDELINES
]);
//#region src/a2ui-prompts.ts
/**
* Default A2UI generation and design guideline prompts.
*
* These are the canonical prompt fragments that instruct an LLM how to call
* the render_a2ui tool, how to bind data, and how to style surfaces.
*/ /**
* Generation guidelines — protocol rules, tool arguments, path rules,
* data model format, and form/two-way-binding instructions.
*/ const A2UI_DEFAULT_GENERATION_GUIDELINES = `\
Generate A2UI v0.9 JSON.

## A2UI Protocol Instructions

A2UI (Agent to UI) is a protocol for rendering rich UI surfaces from agent responses.

CRITICAL: You MUST call the render_a2ui tool with ALL of these arguments:
- surfaceId: A unique ID for the surface (e.g. "product-comparison")
- components: REQUIRED — the A2UI component array. NEVER omit this. Only use
  components listed in the Available Components schema provided as context.
- data: OPTIONAL — a JSON object written to the root of the surface data model.
  Use for pre-filling form values or providing data for path-bound components.
- every component must have the "component" field specifying the component type.
  ONLY use component names from the Available Components schema — do NOT invent
  component names or use names not in the schema.

COMPONENT ID RULES:
- Exactly one component MUST have id="root". This is the surface's entry
  point — the renderer begins at "root" and walks the child/children tree
  from there. Every other component must be reachable from "root". If no
  component has id="root", the surface renders an empty loading placeholder
  and none of your components will be shown.
- Every component ID must be unique within the surface.
- A component MUST NOT reference itself as child/children. This causes a
  circular dependency error. For example, if a component has id="avatar",
  its child must be a DIFFERENT id (e.g. "avatar-img"), never "avatar".
- The child/children tree must be a DAG — no cycles allowed.

REPEATING CONTENT (TEMPLATES):
To repeat a component for each item in an array, use the structural children format:
  children: { componentId: "card-id", path: "/items" }
This tells the renderer to create one instance of "card-id" per item in the "/items" array.

PATH RULES FOR TEMPLATES:
Components inside a repeating template use RELATIVE paths (no leading slash).
The path is resolved relative to each array item automatically.
If a container has children: { componentId: "card", path: "/items" } and each item
has a key "name", use { "path": "name" } (NO leading slash — relative to item).
CRITICAL: Do NOT use "/name" (absolute) inside templates — use "name" (relative).
The container's path ("/items") uses a leading slash (absolute), but all
components INSIDE the template use paths WITHOUT leading slash.

COMPONENT VALUES — DEFAULT RULE:
Use inline literal values for ALL component properties. Pass strings, numbers,
arrays, and objects directly on the component. Do NOT use { "path": "..." }
objects unless the property's schema explicitly allows it (see exception below).
CRITICAL: USING { "path": "..." } ON A PROPERTY THAT DOES NOT DECLARE PATH
SUPPORT IN ITS SCHEMA WILL CAUSE A RUNTIME CRASH AND BREAK THE ENTIRE UI.
ALWAYS CHECK THE COMPONENT SCHEMA FIRST — IF THE PROPERTY ONLY ACCEPTS A
PLAIN TYPE, YOU MUST USE A LITERAL VALUE.
VERY IMPORTANT: THE APPLICATION WILL BREAK IF YOU DO NOT FOLLOW THIS RULE!

For example, a chart's "data" must always be an inline array:
  "data": [{"label": "Jan", "value": 100}, {"label": "Feb", "value": 200}]
A metric's "value" must always be an inline string:
  "value": "$1,200"

PATH BINDING EXCEPTION — SCHEMA-DRIVEN:
A few properties accept { "path": "/some/path" } as an alternative to a literal
value. You can identify these in the Available Components schema: the property
will list BOTH a literal type AND an object-with-path option. If a property only
shows a single type (string, number, array, etc.), it does NOT support path
binding — use a literal value only.

Path binding is typically used for editable form inputs so the client can write
user input back to the data model. When building forms:
- Bind input "value" to a data model path: "value": { "path": "/form/name" }
- Pre-fill via the "data" tool argument: "data": { "form": { "name": "Alice" } }
- Capture values on submit via button action context:
    "action": { "event": { "name": "submit", "context": { "name": { "path": "/form/name" } } } }

REPEATING CONTENT uses a structural children format (not the same as value binding):
  children: { componentId: "card-id", path: "/items" }
Components inside templates use RELATIVE paths (no leading slash): { "path": "name" }.`;
/**
* Design guidelines — visual design rules, component hierarchy tips,
* and action handler patterns.
*/ const A2UI_DEFAULT_DESIGN_GUIDELINES = `\
Create polished, visually appealing interfaces. ONLY use components listed in the
Available Components schema — do NOT use component names that are not in the schema.

Design principles:
- Create clear visual hierarchy within cards and layouts.
- Keep cards clean — avoid clutter. Whitespace is good.
- Use consistent surfaceIds (lowercase, hyphenated).
- NEVER use the same ID for a component and its child — this creates a
  circular dependency. E.g. if id="avatar", child must NOT be "avatar".
- For side-by-side comparisons, use a container with structural children
  (children: { componentId, path }) to repeat a card template per data item.
- Include images when relevant (logos, icons, product photos):
  - Prefer company logos via Google favicons: https://www.google.com/s2/favicons?domain=example.com&sz=128
  - Do NOT invent Unsplash photo-IDs — they will 404. Only use real, known URLs.
- For buttons: action MUST use this exact nested format:
    "action": { "event": { "name": "myAction", "context": { "key": "value" } } }
  The "event" key holds an OBJECT with "name" (required) and "context" (optional).
  Do NOT use a flat format like {"event": "name"} — "event" must be an object.
- For forms: check the component schema — if an input's "value" property
  supports path binding, use it for editable fields. The submit button's
  action context should reference the same paths to capture user input.

Use the SAME surfaceId as the main surface. Match action names to button action event names.`;
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/attachments/utils.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "exceedsMaxSize",
    ()=>exceedsMaxSize,
    "formatFileSize",
    ()=>formatFileSize,
    "generateVideoThumbnail",
    ()=>generateVideoThumbnail,
    "getDocumentIcon",
    ()=>getDocumentIcon,
    "getModalityFromMimeType",
    ()=>getModalityFromMimeType,
    "getSourceUrl",
    ()=>getSourceUrl,
    "matchesAcceptFilter",
    ()=>matchesAcceptFilter,
    "readFileAsBase64",
    ()=>readFileAsBase64
]);
//#region src/attachments/utils.ts
const DEFAULT_MAX_SIZE = 20 * 1024 * 1024;
/**
* Derive the attachment modality from a MIME type string.
*/ function getModalityFromMimeType(mimeType) {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.startsWith("video/")) return "video";
    return "document";
}
/**
* Format a byte count as a human-readable file size string.
*/ function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
/**
* Check if a file exceeds the maximum allowed size.
*/ function exceedsMaxSize(file, maxSize = DEFAULT_MAX_SIZE) {
    return file.size > maxSize;
}
/**
* Read a File as a base64 string (without the data URL prefix).
*/ function readFileAsBase64(file) {
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = (e)=>{
            const base64 = e.target?.result?.split(",")[1];
            if (base64) resolve(base64);
            else reject(/* @__PURE__ */ new Error("Failed to read file as base64"));
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
/**
* Generate a thumbnail data URL from a video file by capturing a frame near the start (at 0.1s).
* Returns undefined if thumbnail generation fails or if called outside a browser environment.
*/ function generateVideoThumbnail(file) {
    if (typeof document === "undefined") return Promise.resolve(void 0);
    return new Promise((resolve)=>{
        let resolved = false;
        const video = document.createElement("video");
        const canvas = document.createElement("canvas");
        const url = URL.createObjectURL(file);
        const cleanup = (result)=>{
            if (resolved) return;
            resolved = true;
            URL.revokeObjectURL(url);
            resolve(result);
        };
        const timeout = setTimeout(()=>{
            console.warn(`[CopilotKit] generateVideoThumbnail: timed out for file "${file.name}"`);
            cleanup(void 0);
        }, 1e4);
        video.preload = "metadata";
        video.muted = true;
        video.playsInline = true;
        video.onloadeddata = ()=>{
            video.currentTime = .1;
        };
        video.onseeked = ()=>{
            clearTimeout(timeout);
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0);
                cleanup(canvas.toDataURL("image/jpeg", .7));
            } else {
                console.warn("[CopilotKit] generateVideoThumbnail: could not get 2d canvas context");
                cleanup(void 0);
            }
        };
        video.onerror = ()=>{
            clearTimeout(timeout);
            console.warn(`[CopilotKit] generateVideoThumbnail: video element error for file "${file.name}"`);
            cleanup(void 0);
        };
        video.src = url;
    });
}
/**
* Check if a file's MIME type matches an accept filter string.
* Handles file extensions (e.g. ".pdf"), MIME wildcards ("image/*"), and comma-separated lists.
*/ function matchesAcceptFilter(file, accept) {
    if (!accept || accept === "*/*") return true;
    return accept.split(",").map((f)=>f.trim()).some((filter)=>{
        if (filter.startsWith(".")) return (file.name ?? "").toLowerCase().endsWith(filter.toLowerCase());
        if (filter.endsWith("/*")) {
            const prefix = filter.slice(0, -2);
            return file.type.startsWith(prefix + "/");
        }
        return file.type === filter;
    });
}
/**
* Convert an InputContentSource to a usable URL string.
* For data sources, returns a base64 data URL; for URL sources, returns the URL directly.
*/ function getSourceUrl(source) {
    if (source.type === "url") return source.value;
    return `data:${source.mimeType};base64,${source.value}`;
}
/**
* Return a short human-readable label for a document MIME type (e.g. "PDF", "DOC").
*/ function getDocumentIcon(mimeType) {
    if (mimeType.includes("pdf")) return "PDF";
    if (mimeType.includes("sheet") || mimeType.includes("excel")) return "XLS";
    if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "PPT";
    if (mimeType.includes("word") || mimeType.includes("document")) return "DOC";
    if (mimeType.includes("text/")) return "TXT";
    return "FILE";
}
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/constants/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AG_UI_CHANNEL_EVENT",
    ()=>AG_UI_CHANNEL_EVENT,
    "COPILOT_CLOUD_API_URL",
    ()=>COPILOT_CLOUD_API_URL,
    "COPILOT_CLOUD_CHAT_URL",
    ()=>COPILOT_CLOUD_CHAT_URL,
    "COPILOT_CLOUD_PUBLIC_API_KEY_HEADER",
    ()=>COPILOT_CLOUD_PUBLIC_API_KEY_HEADER,
    "COPILOT_CLOUD_VERSION",
    ()=>COPILOT_CLOUD_VERSION,
    "DEFAULT_AGENT_ID",
    ()=>DEFAULT_AGENT_ID
]);
//#region src/constants/index.ts
const COPILOT_CLOUD_API_URL = "https://api.cloud.copilotkit.ai";
const COPILOT_CLOUD_VERSION = "v1";
const COPILOT_CLOUD_CHAT_URL = `${COPILOT_CLOUD_API_URL}/copilotkit/${COPILOT_CLOUD_VERSION}`;
const COPILOT_CLOUD_PUBLIC_API_KEY_HEADER = "X-CopilotCloud-Public-Api-Key";
const DEFAULT_AGENT_ID = "default";
/** Phoenix channel event name used for all AG-UI events. */ const AG_UI_CHANNEL_EVENT = "ag-ui";
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/debug.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resolveDebugConfig",
    ()=>resolveDebugConfig
]);
//#region src/debug.ts
/** The all-off config used when debug is falsy. */ const DEBUG_OFF = {
    enabled: false,
    events: false,
    lifecycle: false,
    verbose: false
};
/**
* Normalizes a DebugConfig value into a ResolvedDebugConfig.
*
* - `false` / `undefined` → all off
* - `true` → events + lifecycle on, verbose off (no PII in logs)
* - object → merges with defaults (events: true, lifecycle: true, verbose: false)
*/ function resolveDebugConfig(debug) {
    if (!debug) return DEBUG_OFF;
    if (debug === true) return {
        enabled: true,
        events: true,
        lifecycle: true,
        verbose: false
    };
    const events = debug.events ?? true;
    const lifecycle = debug.lifecycle ?? true;
    const enabled = events || lifecycle;
    return {
        enabled,
        events,
        lifecycle,
        verbose: enabled && (debug.verbose ?? false)
    };
}
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/finalize-events.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "finalizeRunEvents",
    ()=>finalizeRunEvents
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$random$2d$id$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/utils/random-id.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@ag-ui/core/dist/index.mjs [app-client] (ecmascript)");
;
;
//#region src/finalize-events.ts
const defaultStopMessage = "Run stopped by user";
const defaultAbruptEndMessage = "Run ended without emitting a terminal event";
function finalizeRunEvents(events, options = {}) {
    const { stopRequested = false, interruptionMessage } = options;
    const resolvedStopMessage = interruptionMessage ?? defaultStopMessage;
    const resolvedAbruptMessage = interruptionMessage && interruptionMessage !== defaultStopMessage ? interruptionMessage : defaultAbruptEndMessage;
    const appended = [];
    const openMessageIds = /* @__PURE__ */ new Set();
    const openToolCalls = /* @__PURE__ */ new Map();
    for (const event of events)switch(event.type){
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_START:
            {
                const messageId = event.messageId;
                if (typeof messageId === "string") openMessageIds.add(messageId);
                break;
            }
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_END:
            {
                const messageId = event.messageId;
                if (typeof messageId === "string") openMessageIds.delete(messageId);
                break;
            }
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_START:
            {
                const toolCallId = event.toolCallId;
                if (typeof toolCallId === "string") openToolCalls.set(toolCallId, {
                    hasEnd: false,
                    hasResult: false
                });
                break;
            }
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_END:
            {
                const toolCallId = event.toolCallId;
                const info = toolCallId ? openToolCalls.get(toolCallId) : void 0;
                if (info) info.hasEnd = true;
                break;
            }
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_RESULT:
            {
                const toolCallId = event.toolCallId;
                const info = toolCallId ? openToolCalls.get(toolCallId) : void 0;
                if (info) info.hasResult = true;
                break;
            }
        default:
            break;
    }
    if (events.some((event)=>event.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_FINISHED || event.type === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_ERROR)) return appended;
    for (const messageId of openMessageIds){
        const endEvent = {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TEXT_MESSAGE_END,
            messageId
        };
        events.push(endEvent);
        appended.push(endEvent);
    }
    for (const [toolCallId, info] of openToolCalls){
        if (!info.hasEnd) {
            const endEvent = {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_END,
                toolCallId
            };
            events.push(endEvent);
            appended.push(endEvent);
        }
        if (!info.hasResult) {
            const resultEvent = {
                type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].TOOL_CALL_RESULT,
                toolCallId,
                messageId: `${toolCallId ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$random$2d$id$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["randomUUID"])()}-result`,
                role: "tool",
                content: JSON.stringify(stopRequested ? {
                    status: "stopped",
                    reason: "stop_requested",
                    message: resolvedStopMessage
                } : {
                    status: "error",
                    reason: "missing_terminal_event",
                    message: resolvedAbruptMessage
                })
            };
            events.push(resultEvent);
            appended.push(resultEvent);
        }
    }
    if (stopRequested) {
        const finishedEvent = {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_FINISHED
        };
        events.push(finishedEvent);
        appended.push(finishedEvent);
    } else {
        const errorEvent = {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ag$2d$ui$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventType"].RUN_ERROR,
            message: resolvedAbruptMessage,
            code: "INCOMPLETE_STREAM"
        };
        events.push(errorEvent);
        appended.push(errorEvent);
    }
    return appended;
}
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/index.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COPILOTKIT_VERSION",
    ()=>COPILOTKIT_VERSION,
    "createLicenseContextValue",
    ()=>createLicenseContextValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$clipboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/utils/clipboard.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$conditions$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/utils/conditions.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$console$2d$styling$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/utils/console-styling.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/utils/errors.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$json$2d$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/utils/json-schema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$inspector$2d$metadata$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/utils/inspector-metadata.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$types$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/utils/types.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$random$2d$id$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/utils/random-id.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$requests$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/utils/requests.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/utils/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$constants$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/constants/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$telemetry$2f$lambda$2d$client$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/telemetry/lambda-client.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$telemetry$2f$telemetry$2d$client$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/telemetry/telemetry-client.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$debug$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/debug.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$standard$2d$schema$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/standard-schema.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$attachments$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/attachments/utils.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$logger$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/logger.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$finalize$2d$events$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/finalize-events.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$transcription$2d$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/transcription-errors.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$package$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/package.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$a2ui$2d$prompts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/a2ui-prompts.mjs [app-client] (ecmascript)");
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
;
;
;
;
;
;
;
;
;
//#region src/index.ts
const COPILOTKIT_VERSION = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$package$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"];
/**
* Client-safe license context factory, driven by the license status the
* runtime reports via /info.
*
* Features are enabled unless the runtime definitively reports the license
* as "expired" or "invalid". A null/"none"/"unknown" status fails open
* (unlicensed = unrestricted, with branding), and "expiring" keeps features
* on while the provider surfaces a warning banner. Per-feature data is not
* in /info yet, so checkFeature is uniform across features and getLimit has
* no limits to report. This is inlined here to avoid importing the full
* license-verifier bundle (which depends on Node's `crypto`) into browser
* bundles.
*/ function createLicenseContextValue(status) {
    const resolvedStatus = status ?? null;
    const featuresEnabled = resolvedStatus !== "expired" && resolvedStatus !== "invalid";
    return {
        status: resolvedStatus,
        license: null,
        checkFeature: ()=>featuresEnabled,
        getLimit: ()=>null
    };
}
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/logger.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "logger",
    ()=>logger
]);
//#region src/logger.ts
const logger = console;
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/package.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "version",
    ()=>version
]);
//#region package.json
var version = "1.69.2";
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/standard-schema.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "schemaToJsonSchema",
    ()=>schemaToJsonSchema
]);
//#region src/standard-schema.ts
/**
* Check whether a schema implements the Standard JSON Schema V1 protocol.
*/ function hasStandardJsonSchema(schema) {
    const props = schema["~standard"];
    return props != null && typeof props === "object" && "jsonSchema" in props && props.jsonSchema != null && typeof props.jsonSchema === "object" && "input" in props.jsonSchema && typeof props.jsonSchema.input === "function";
}
/**
* Convert any StandardSchemaV1-compatible schema to a JSON Schema object.
*
* Strategy:
* 1. If the schema implements Standard JSON Schema V1 (`~standard.jsonSchema`),
*    call `schema['~standard'].jsonSchema.input({ target: 'draft-07' })`.
* 2. If the schema exposes a `toJSONSchema()` method (Zod v4), call it directly.
* 3. If the schema is a Zod v3 schema (`~standard.vendor === 'zod'`), use the
*    injected `zodToJsonSchema()` function.
* 4. Otherwise throw a descriptive error.
*/ function schemaToJsonSchema(schema, options) {
    if (hasStandardJsonSchema(schema)) return schema["~standard"].jsonSchema.input({
        target: "draft-07"
    });
    if (typeof schema.toJSONSchema === "function") return schema.toJSONSchema();
    const vendor = schema["~standard"].vendor;
    if (vendor === "zod" && options?.zodToJsonSchema) return options.zodToJsonSchema(schema, {
        $refStrategy: "none"
    });
    throw new Error(`Cannot convert schema to JSON Schema. The schema (vendor: "${vendor}") does not implement Standard JSON Schema V1 and no zodToJsonSchema fallback is available. Use a library that supports Standard JSON Schema (e.g., Zod 3.24+, Valibot v1+, ArkType v2+) or pass a zodToJsonSchema function in options.`);
}
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/telemetry/lambda-client.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "lambdaClient",
    ()=>lambdaClient,
    "parseAndWarnTelemetryId",
    ()=>parseAndWarnTelemetryId,
    "parseTelemetryIdFromLicense",
    ()=>parseTelemetryIdFromLicense
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
//#region src/telemetry/lambda-client.ts
const TELEMETRY_SINK_URL = typeof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env?.COPILOTKIT_TELEMETRY_URL || "https://telemetry.copilotkit.ai/ingest";
const FETCH_TIMEOUT_MS = 3e3;
const STRIPPED_KEYS = new Set([
    "cloud.public_api_key",
    "cloud.publicApiKey"
]);
function stripCloudKeys(obj) {
    if (!obj) return {};
    const out = {};
    for (const [k, v] of Object.entries(obj))if (!STRIPPED_KEYS.has(k)) out[k] = v;
    return out;
}
function parseTelemetryIdFromLicense(token) {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    try {
        let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padding = (4 - b64.length % 4) % 4;
        b64 += "=".repeat(padding);
        const json = typeof atob === "function" ? atob(b64) : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(b64, "base64").toString("utf8");
        const decoded = JSON.parse(json);
        return typeof decoded.telemetry_id === "string" ? decoded.telemetry_id : null;
    } catch  {
        return null;
    }
}
function parseAndWarnTelemetryId(licenseToken) {
    const telemetryId = parseTelemetryIdFromLicense(licenseToken);
    if (!telemetryId) console.warn("[CopilotKit] License token did not yield a telemetry_id; telemetry events will be sent anonymously.");
    return telemetryId;
}
async function send(opts) {
    try {
        const body = JSON.stringify({
            event: opts.event,
            properties: stripCloudKeys(opts.properties),
            global_properties: stripCloudKeys(opts.globalProperties),
            package: {
                name: opts.packageName,
                version: opts.packageVersion
            },
            ts: Math.floor(Date.now() / 1e3)
        });
        const telemetryId = parseTelemetryIdFromLicense(opts.licenseToken);
        const headers = {
            "Content-Type": "application/json",
            "User-Agent": opts.packageName ? `CopilotKit-Runtime/${opts.packageVersion ?? "unknown"} (${opts.packageName})` : "CopilotKit-Runtime"
        };
        if (telemetryId) headers["X-CopilotKit-Telemetry-Id"] = telemetryId;
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), FETCH_TIMEOUT_MS);
        try {
            await fetch(TELEMETRY_SINK_URL, {
                method: "POST",
                headers,
                body,
                signal: controller.signal
            });
        } finally{
            clearTimeout(timeoutId);
        }
    } catch  {}
}
const lambdaClient = {
    send
};
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/telemetry/telemetry-client.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TelemetryClient",
    ()=>TelemetryClient,
    "isTelemetryDisabled",
    ()=>isTelemetryDisabled
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$telemetry$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/telemetry/utils.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$telemetry$2f$lambda$2d$client$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/telemetry/lambda-client.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/uuid/dist/esm-browser/v4.js [app-client] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$analytics$2d$node$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/analytics-node.js [app-client] (ecmascript)");
;
;
;
;
//#region src/telemetry/telemetry-client.ts
/**
* Checks if telemetry is disabled via environment variables.
* Users can opt out by setting:
* - COPILOTKIT_TELEMETRY_DISABLED=true or COPILOTKIT_TELEMETRY_DISABLED=1
* - DO_NOT_TRACK=true or DO_NOT_TRACK=1
*/ function isTelemetryDisabled() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.COPILOTKIT_TELEMETRY_DISABLED === "true" || __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.COPILOTKIT_TELEMETRY_DISABLED === "1" || __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.DO_NOT_TRACK === "true" || __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.DO_NOT_TRACK === "1";
}
var TelemetryClient = class {
    constructor({ packageName, packageVersion, telemetryDisabled, telemetryBaseUrl, sampleRate }){
        this.globalProperties = {};
        this.cloudConfiguration = null;
        this.licenseToken = null;
        this.telemetryId = null;
        this.telemetryDisabled = false;
        this.sampleRate = .05;
        this.anonymousId = `anon_${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])()}`;
        this.packageName = packageName;
        this.packageVersion = packageVersion;
        this.telemetryDisabled = telemetryDisabled || isTelemetryDisabled();
        if (this.telemetryDisabled) return;
        this.setSampleRate(sampleRate);
        this.segment = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$analytics$2d$node$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Analytics"]({
            writeKey: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.COPILOTKIT_SEGMENT_WRITE_KEY || "n7XAZtQCGS2v1vvBy3LgBCv2h3Y8whja"
        });
        this.setGlobalProperties({
            "copilotkit.package.name": packageName,
            "copilotkit.package.version": packageVersion
        });
    }
    shouldSendEvent() {
        return Math.random() < this.sampleRate;
    }
    async capture(event, properties) {
        if (this.telemetryDisabled) return;
        if (!this.telemetryId && !this.shouldSendEvent()) return;
        const effectiveSampleRate = this.telemetryId ? 1 : this.sampleRate;
        const samplingMeta = {
            sampleRate: effectiveSampleRate,
            sampleRateAdjustmentFactor: 1 - effectiveSampleRate,
            sampleWeight: 1 / effectiveSampleRate
        };
        const flattenedProperties = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$telemetry$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flattenObject"])(properties);
        const propertiesWithGlobal = {
            ...this.globalProperties,
            ...samplingMeta,
            ...flattenedProperties
        };
        const orderedPropertiesWithGlobal = Object.keys(propertiesWithGlobal).sort().reduce((obj, key)=>{
            obj[key] = propertiesWithGlobal[key];
            return obj;
        }, {});
        await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$telemetry$2f$lambda$2d$client$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lambdaClient"].send({
            event,
            properties: flattenedProperties,
            globalProperties: {
                ...this.globalProperties,
                ...samplingMeta
            },
            packageName: this.packageName,
            packageVersion: this.packageVersion,
            licenseToken: this.licenseToken ?? void 0
        });
        if (this.segment) this.segment.track({
            anonymousId: this.anonymousId,
            event,
            properties: {
                ...orderedPropertiesWithGlobal
            }
        });
    }
    setGlobalProperties(properties) {
        const flattenedProperties = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$telemetry$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flattenObject"])(properties);
        this.globalProperties = {
            ...this.globalProperties,
            ...flattenedProperties
        };
    }
    setCloudConfiguration(properties) {
        this.cloudConfiguration = properties;
        this.setGlobalProperties({
            cloud: {
                publicApiKey: properties.publicApiKey,
                baseUrl: properties.baseUrl
            }
        });
    }
    setLicenseToken(licenseToken) {
        this.licenseToken = licenseToken;
        this.telemetryId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$telemetry$2f$lambda$2d$client$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseAndWarnTelemetryId"])(licenseToken);
    }
    setSampleRate(sampleRate) {
        let _sampleRate;
        _sampleRate = sampleRate ?? .05;
        if (__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.COPILOTKIT_TELEMETRY_SAMPLE_RATE) _sampleRate = parseFloat(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.COPILOTKIT_TELEMETRY_SAMPLE_RATE);
        if (Number.isNaN(_sampleRate) || _sampleRate < 0 || _sampleRate > 1) throw new Error("Sample rate must be between 0 and 1");
        this.sampleRate = _sampleRate;
    }
};
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/telemetry/utils.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "flattenObject",
    ()=>flattenObject
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$chalk$2f$source$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/chalk/source/index.js [app-client] (ecmascript)");
;
//#region src/telemetry/utils.ts
function flattenObject(obj, parentKey = "", res = {}) {
    for(let key in obj){
        const propName = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) flattenObject(obj[key], propName, res);
        else res[propName] = obj[key];
    }
    return res;
}
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/transcription-errors.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TranscriptionErrorCode",
    ()=>TranscriptionErrorCode,
    "TranscriptionErrors",
    ()=>TranscriptionErrors
]);
//#region src/transcription-errors.ts
/**
* Error codes for transcription HTTP responses.
* Uses snake_case to align with existing CopilotKitCoreErrorCode pattern.
* These codes are returned by the runtime and parsed by the client.
*/ let TranscriptionErrorCode = /* @__PURE__ */ function(TranscriptionErrorCode) {
    /** Transcription service not configured in runtime */ TranscriptionErrorCode["SERVICE_NOT_CONFIGURED"] = "service_not_configured";
    /** Audio format not supported */ TranscriptionErrorCode["INVALID_AUDIO_FORMAT"] = "invalid_audio_format";
    /** Audio file is too long */ TranscriptionErrorCode["AUDIO_TOO_LONG"] = "audio_too_long";
    /** Audio file is empty or too short */ TranscriptionErrorCode["AUDIO_TOO_SHORT"] = "audio_too_short";
    /** Rate limited by transcription provider */ TranscriptionErrorCode["RATE_LIMITED"] = "rate_limited";
    /** Authentication failed with transcription provider */ TranscriptionErrorCode["AUTH_FAILED"] = "auth_failed";
    /** Transcription provider returned an error */ TranscriptionErrorCode["PROVIDER_ERROR"] = "provider_error";
    /** Network error during transcription */ TranscriptionErrorCode["NETWORK_ERROR"] = "network_error";
    /** Invalid request format */ TranscriptionErrorCode["INVALID_REQUEST"] = "invalid_request";
    return TranscriptionErrorCode;
}({});
/**
* Helper functions to create transcription error responses.
* Used by the runtime to return consistent error responses.
*/ const TranscriptionErrors = {
    serviceNotConfigured: ()=>({
            error: TranscriptionErrorCode.SERVICE_NOT_CONFIGURED,
            message: "Transcription service is not configured",
            retryable: false
        }),
    invalidAudioFormat: (format, supported)=>({
            error: TranscriptionErrorCode.INVALID_AUDIO_FORMAT,
            message: `Unsupported audio format: ${format}. Supported: ${supported.join(", ")}`,
            retryable: false
        }),
    invalidRequest: (details)=>({
            error: TranscriptionErrorCode.INVALID_REQUEST,
            message: details,
            retryable: false
        }),
    rateLimited: ()=>({
            error: TranscriptionErrorCode.RATE_LIMITED,
            message: "Rate limited. Please try again later.",
            retryable: true
        }),
    authFailed: ()=>({
            error: TranscriptionErrorCode.AUTH_FAILED,
            message: "Authentication failed with transcription provider",
            retryable: false
        }),
    providerError: (message)=>({
            error: TranscriptionErrorCode.PROVIDER_ERROR,
            message,
            retryable: true
        }),
    networkError: (message = "Network error during transcription")=>({
            error: TranscriptionErrorCode.NETWORK_ERROR,
            message,
            retryable: true
        }),
    audioTooLong: ()=>({
            error: TranscriptionErrorCode.AUDIO_TOO_LONG,
            message: "Audio file is too long",
            retryable: false
        }),
    audioTooShort: ()=>({
            error: TranscriptionErrorCode.AUDIO_TOO_SHORT,
            message: "Audio is too short to transcribe",
            retryable: false
        })
};
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/utils/clipboard.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "copyToClipboard",
    ()=>copyToClipboard
]);
//#region src/utils/clipboard.ts
/**
* Safely copies text to the clipboard.
*
* Checks that the Clipboard API is available before attempting the write,
* and catches any errors (e.g. permission denied, insecure context).
*
* @param text - The text to copy to the clipboard.
* @returns `true` if the text was successfully copied, `false` otherwise.
*/ async function copyToClipboard(text) {
    if (!navigator.clipboard?.writeText) {
        console.error("Clipboard API is not available");
        return false;
    }
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error("Failed to copy to clipboard:", err);
        return false;
    }
}
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/utils/conditions.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "executeConditions",
    ()=>executeConditions
]);
//#region src/utils/conditions.ts
function executeConditions({ conditions, value }) {
    if (!conditions?.length) return true;
    return conditions.every((condition)=>executeCondition(condition, value));
}
function executeCondition(condition, value) {
    const targetValue = condition.path ? getValueFromPath(value, condition.path) : value;
    switch(condition.rule){
        case "AND":
            return condition.conditions.every((c)=>executeCondition(c, value));
        case "OR":
            return condition.conditions.some((c)=>executeCondition(c, value));
        case "NOT":
            return !condition.conditions.every((c)=>executeCondition(c, value));
        case "EQUALS":
            return targetValue === condition.value;
        case "NOT_EQUALS":
            return targetValue !== condition.value;
        case "GREATER_THAN":
            return targetValue > condition.value;
        case "LESS_THAN":
            return targetValue < condition.value;
        case "CONTAINS":
            return Array.isArray(targetValue) && targetValue.includes(condition.value);
        case "NOT_CONTAINS":
            return Array.isArray(targetValue) && !targetValue.includes(condition.value);
        case "MATCHES":
            return new RegExp(condition.value).test(String(targetValue));
        case "STARTS_WITH":
            return String(targetValue).startsWith(condition.value);
        case "ENDS_WITH":
            return String(targetValue).endsWith(condition.value);
        case "EXISTS":
            return targetValue !== void 0 && targetValue !== null;
        case "NOT_EXISTS":
            return targetValue === void 0 || targetValue === null;
    }
}
function getValueFromPath(obj, path) {
    return path.split(".").reduce((acc, part)=>acc?.[part], obj);
}
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/utils/console-styling.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConsoleColors",
    ()=>ConsoleColors,
    "ConsoleStyles",
    ()=>ConsoleStyles,
    "logCopilotKitPlatformMessage",
    ()=>logCopilotKitPlatformMessage,
    "logStyled",
    ()=>logStyled,
    "publicApiKeyRequired",
    ()=>publicApiKeyRequired,
    "styledConsole",
    ()=>styledConsole
]);
//#region src/utils/console-styling.ts
/**
* Console styling utilities for CopilotKit branded messages
* Provides consistent, readable colors across light and dark console themes
*/ /**
* Color palette optimized for console readability
*/ const ConsoleColors = {
    primary: "#007acc",
    success: "#22c55e",
    feature: "#a855f7",
    cta: "#ef4444",
    info: "#06b6d4",
    inherit: "inherit",
    warning: "#f59e0b"
};
/**
* Console style templates for common patterns
*/ const ConsoleStyles = {
    header: `color: ${ConsoleColors.warning}; font-weight: bold; font-size: 16px;`,
    section: `color: ${ConsoleColors.success}; font-weight: bold;`,
    highlight: `color: ${ConsoleColors.feature}; font-weight: bold;`,
    cta: `color: ${ConsoleColors.success}; font-weight: bold;`,
    info: `color: ${ConsoleColors.info}; font-weight: bold;`,
    link: `color: ${ConsoleColors.primary}; text-decoration: underline;`,
    body: `color: ${ConsoleColors.inherit};`,
    warning: `color: ${ConsoleColors.cta}; font-weight: bold;`
};
/**
* Styled console message for CopilotKit Platform promotion
* Displays a beautiful, branded advertisement in the console
*/ function logCopilotKitPlatformMessage() {
    console.log(`%cCopilotKit Warning%c

useCopilotChatHeadless_c provides full compatibility with CopilotKit's newly released Headless UI feature set. To enable this premium feature, add your public license key, available for free at:

%chttps://dashboard.operations.copilotkit.ai%c

Alternatively, useCopilotChat is available for basic programmatic control, and does not require a license key.

To learn more about premium features, read the documentation here:

%chttps://docs.copilotkit.ai/premium/overview%c`, ConsoleStyles.header, ConsoleStyles.body, ConsoleStyles.cta, ConsoleStyles.body, ConsoleStyles.link, ConsoleStyles.body);
}
function publicApiKeyRequired(feature) {
    console.log(`
%cCopilotKit Warning%c \n
In order to use ${feature}, you need to add your CopilotKit license key, available for free at https://dashboard.operations.copilotkit.ai.
    `.trim(), ConsoleStyles.header, ConsoleStyles.body);
}
/**
* Create a styled console message with custom content
*
* @param template - Template string with %c placeholders
* @param styles - Array of style strings matching the %c placeholders
*
* @example
* ```typescript
* logStyled(
*   '%cCopilotKit%c Welcome to the platform!',
*   [ConsoleStyles.header, ConsoleStyles.body]
* );
* ```
*/ function logStyled(template, styles) {
    console.log(template, ...styles);
}
/**
* Quick styled console methods for common use cases
*/ const styledConsole = {
    success: (message)=>logStyled(`%c✅ ${message}`, [
            ConsoleStyles.section
        ]),
    info: (message)=>logStyled(`%cℹ️ ${message}`, [
            ConsoleStyles.info
        ]),
    feature: (message)=>logStyled(`%c✨ ${message}`, [
            ConsoleStyles.highlight
        ]),
    cta: (message)=>logStyled(`%c🚀 ${message}`, [
            ConsoleStyles.cta
        ]),
    logCopilotKitPlatformMessage,
    publicApiKeyRequired
};
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/utils/errors.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BANNER_ERROR_NAMES",
    ()=>BANNER_ERROR_NAMES,
    "COPILOT_CLOUD_ERROR_NAMES",
    ()=>COPILOT_CLOUD_ERROR_NAMES,
    "ConfigurationError",
    ()=>ConfigurationError,
    "CopilotKitAgentDiscoveryError",
    ()=>CopilotKitAgentDiscoveryError,
    "CopilotKitApiDiscoveryError",
    ()=>CopilotKitApiDiscoveryError,
    "CopilotKitError",
    ()=>CopilotKitError,
    "CopilotKitErrorCode",
    ()=>CopilotKitErrorCode,
    "CopilotKitLowLevelError",
    ()=>CopilotKitLowLevelError,
    "CopilotKitMisuseError",
    ()=>CopilotKitMisuseError,
    "CopilotKitRemoteEndpointDiscoveryError",
    ()=>CopilotKitRemoteEndpointDiscoveryError,
    "CopilotKitVersionMismatchError",
    ()=>CopilotKitVersionMismatchError,
    "ERROR_CONFIG",
    ()=>ERROR_CONFIG,
    "ERROR_NAMES",
    ()=>ERROR_NAMES,
    "ErrorVisibility",
    ()=>ErrorVisibility,
    "MissingPublicApiKeyError",
    ()=>MissingPublicApiKeyError,
    "ResolvedCopilotKitError",
    ()=>ResolvedCopilotKitError,
    "Severity",
    ()=>Severity,
    "UpgradeRequiredError",
    ()=>UpgradeRequiredError,
    "ensureStructuredError",
    ()=>ensureStructuredError,
    "getPossibleVersionMismatch",
    ()=>getPossibleVersionMismatch,
    "isStructuredCopilotKitError",
    ()=>isStructuredCopilotKitError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/graphql/error/GraphQLError.mjs [app-client] (ecmascript)");
;
;
//#region src/utils/errors.ts
let Severity = /* @__PURE__ */ function(Severity) {
    Severity["CRITICAL"] = "critical";
    Severity["WARNING"] = "warning";
    Severity["INFO"] = "info";
    return Severity;
}({});
let ErrorVisibility = /* @__PURE__ */ function(ErrorVisibility) {
    ErrorVisibility["BANNER"] = "banner";
    ErrorVisibility["TOAST"] = "toast";
    ErrorVisibility["SILENT"] = "silent";
    ErrorVisibility["DEV_ONLY"] = "dev_only";
    return ErrorVisibility;
}({});
const ERROR_NAMES = {
    COPILOT_ERROR: "CopilotError",
    COPILOT_API_DISCOVERY_ERROR: "CopilotApiDiscoveryError",
    COPILOT_REMOTE_ENDPOINT_DISCOVERY_ERROR: "CopilotKitRemoteEndpointDiscoveryError",
    COPILOT_KIT_AGENT_DISCOVERY_ERROR: "CopilotKitAgentDiscoveryError",
    COPILOT_KIT_LOW_LEVEL_ERROR: "CopilotKitLowLevelError",
    COPILOT_KIT_VERSION_MISMATCH_ERROR: "CopilotKitVersionMismatchError",
    RESOLVED_COPILOT_KIT_ERROR: "ResolvedCopilotKitError",
    CONFIGURATION_ERROR: "ConfigurationError",
    MISSING_PUBLIC_API_KEY_ERROR: "MissingPublicApiKeyError",
    UPGRADE_REQUIRED_ERROR: "UpgradeRequiredError"
};
const BANNER_ERROR_NAMES = [
    ERROR_NAMES.CONFIGURATION_ERROR,
    ERROR_NAMES.MISSING_PUBLIC_API_KEY_ERROR,
    ERROR_NAMES.UPGRADE_REQUIRED_ERROR,
    ERROR_NAMES.COPILOT_API_DISCOVERY_ERROR,
    ERROR_NAMES.COPILOT_REMOTE_ENDPOINT_DISCOVERY_ERROR,
    ERROR_NAMES.COPILOT_KIT_AGENT_DISCOVERY_ERROR
];
const COPILOT_CLOUD_ERROR_NAMES = BANNER_ERROR_NAMES;
let CopilotKitErrorCode = /* @__PURE__ */ function(CopilotKitErrorCode) {
    CopilotKitErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
    CopilotKitErrorCode["NOT_FOUND"] = "NOT_FOUND";
    CopilotKitErrorCode["AGENT_NOT_FOUND"] = "AGENT_NOT_FOUND";
    CopilotKitErrorCode["API_NOT_FOUND"] = "API_NOT_FOUND";
    CopilotKitErrorCode["REMOTE_ENDPOINT_NOT_FOUND"] = "REMOTE_ENDPOINT_NOT_FOUND";
    CopilotKitErrorCode["AUTHENTICATION_ERROR"] = "AUTHENTICATION_ERROR";
    CopilotKitErrorCode["MISUSE"] = "MISUSE";
    CopilotKitErrorCode["UNKNOWN"] = "UNKNOWN";
    CopilotKitErrorCode["VERSION_MISMATCH"] = "VERSION_MISMATCH";
    CopilotKitErrorCode["CONFIGURATION_ERROR"] = "CONFIGURATION_ERROR";
    CopilotKitErrorCode["MISSING_PUBLIC_API_KEY_ERROR"] = "MISSING_PUBLIC_API_KEY_ERROR";
    CopilotKitErrorCode["UPGRADE_REQUIRED_ERROR"] = "UPGRADE_REQUIRED_ERROR";
    return CopilotKitErrorCode;
}({});
const BASE_URL = "https://docs.copilotkit.ai";
const getSeeMoreMarkdown = (link)=>`See more: [${link}](${link})`;
const ERROR_CONFIG = {
    [CopilotKitErrorCode.NETWORK_ERROR]: {
        statusCode: 503,
        troubleshootingUrl: `${BASE_URL}/troubleshooting/common-issues#network-errors-api-not-found`,
        visibility: ErrorVisibility.BANNER,
        severity: Severity.CRITICAL
    },
    [CopilotKitErrorCode.NOT_FOUND]: {
        statusCode: 404,
        troubleshootingUrl: `${BASE_URL}/troubleshooting/common-issues#network-errors-api-not-found`,
        visibility: ErrorVisibility.BANNER,
        severity: Severity.CRITICAL
    },
    [CopilotKitErrorCode.AGENT_NOT_FOUND]: {
        statusCode: 500,
        troubleshootingUrl: `${BASE_URL}/langgraph-python/coagent-troubleshooting/common-coagent-issues#i-am-getting-agent-not-found-error`,
        visibility: ErrorVisibility.BANNER,
        severity: Severity.CRITICAL
    },
    [CopilotKitErrorCode.API_NOT_FOUND]: {
        statusCode: 404,
        troubleshootingUrl: `${BASE_URL}/troubleshooting/common-issues#network-errors-api-not-found`,
        visibility: ErrorVisibility.BANNER,
        severity: Severity.CRITICAL
    },
    [CopilotKitErrorCode.REMOTE_ENDPOINT_NOT_FOUND]: {
        statusCode: 404,
        troubleshootingUrl: `${BASE_URL}/troubleshooting/common-issues#remote-endpoint-not-found-error`,
        visibility: ErrorVisibility.BANNER,
        severity: Severity.CRITICAL
    },
    [CopilotKitErrorCode.AUTHENTICATION_ERROR]: {
        statusCode: 401,
        troubleshootingUrl: `${BASE_URL}/troubleshooting/common-issues`,
        visibility: ErrorVisibility.BANNER,
        severity: Severity.CRITICAL
    },
    [CopilotKitErrorCode.MISUSE]: {
        statusCode: 400,
        troubleshootingUrl: null,
        visibility: ErrorVisibility.DEV_ONLY,
        severity: Severity.WARNING
    },
    [CopilotKitErrorCode.UNKNOWN]: {
        statusCode: 500,
        visibility: ErrorVisibility.TOAST,
        severity: Severity.CRITICAL
    },
    [CopilotKitErrorCode.CONFIGURATION_ERROR]: {
        statusCode: 400,
        troubleshootingUrl: null,
        severity: Severity.WARNING,
        visibility: ErrorVisibility.BANNER
    },
    [CopilotKitErrorCode.MISSING_PUBLIC_API_KEY_ERROR]: {
        statusCode: 400,
        troubleshootingUrl: null,
        severity: Severity.CRITICAL,
        visibility: ErrorVisibility.BANNER
    },
    [CopilotKitErrorCode.UPGRADE_REQUIRED_ERROR]: {
        statusCode: 402,
        troubleshootingUrl: null,
        severity: Severity.WARNING,
        visibility: ErrorVisibility.BANNER
    },
    [CopilotKitErrorCode.VERSION_MISMATCH]: {
        statusCode: 400,
        troubleshootingUrl: null,
        visibility: ErrorVisibility.DEV_ONLY,
        severity: Severity.INFO
    }
};
var CopilotKitError = class extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$graphql$2f$error$2f$GraphQLError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphQLError"] {
    constructor({ message = "Unknown error occurred", code, severity, visibility }){
        const name = ERROR_NAMES.COPILOT_ERROR;
        const config = ERROR_CONFIG[code];
        const { statusCode } = config;
        const resolvedVisibility = visibility ?? config.visibility ?? ErrorVisibility.TOAST;
        const resolvedSeverity = severity ?? ("severity" in config ? config.severity : void 0);
        super(message, {
            extensions: {
                name,
                statusCode,
                code,
                visibility: resolvedVisibility,
                severity: resolvedSeverity,
                troubleshootingUrl: "troubleshootingUrl" in config ? config.troubleshootingUrl : null,
                originalError: {
                    message,
                    stack: /* @__PURE__ */ new Error().stack
                }
            }
        });
        this.code = code;
        this.name = name;
        this.statusCode = statusCode;
        this.severity = resolvedSeverity;
        this.visibility = resolvedVisibility;
    }
};
/**
* Error thrown when we can identify wrong usage of our components.
* This helps us notify the developer before real errors can happen
*
* @extends CopilotKitError
*/ var CopilotKitMisuseError = class extends CopilotKitError {
    constructor({ message, code = CopilotKitErrorCode.MISUSE }){
        const docsLink = "troubleshootingUrl" in ERROR_CONFIG[code] && ERROR_CONFIG[code].troubleshootingUrl ? getSeeMoreMarkdown(ERROR_CONFIG[code].troubleshootingUrl) : null;
        const finalMessage = docsLink ? `${message}.\n\n${docsLink}` : message;
        super({
            message: finalMessage,
            code
        });
        this.name = ERROR_NAMES.COPILOT_API_DISCOVERY_ERROR;
    }
};
const getVersionMismatchErrorMessage = ({ reactCoreVersion, runtimeVersion, runtimeClientGqlVersion })=>`Version mismatch detected: @copilotkit/runtime@${runtimeVersion ?? ""} is not compatible with @copilotkit/react-core@${reactCoreVersion} and @copilotkit/runtime-client-gql@${runtimeClientGqlVersion}. Please ensure all installed copilotkit packages are on the same version.`;
/**
* Error thrown when CPK versions does not match
*
* @extends CopilotKitError
*/ var CopilotKitVersionMismatchError = class extends CopilotKitError {
    constructor({ reactCoreVersion, runtimeVersion, runtimeClientGqlVersion }){
        const code = CopilotKitErrorCode.VERSION_MISMATCH;
        super({
            message: getVersionMismatchErrorMessage({
                reactCoreVersion,
                runtimeVersion,
                runtimeClientGqlVersion
            }),
            code
        });
        this.name = ERROR_NAMES.COPILOT_KIT_VERSION_MISMATCH_ERROR;
    }
};
/**
* Error thrown when the CopilotKit API endpoint cannot be discovered or accessed.
* This typically occurs when:
* - The API endpoint URL is invalid or misconfigured
* - The API service is not running at the expected location
* - There are network/firewall issues preventing access
*
* @extends CopilotKitError
*/ var CopilotKitApiDiscoveryError = class extends CopilotKitError {
    constructor(params = {}){
        const url = params.url ?? "";
        let operationSuffix = "";
        if (url?.includes("/info")) operationSuffix = `when fetching CopilotKit info`;
        else if (url.includes("/actions/execute")) operationSuffix = `when attempting to execute actions.`;
        else if (url.includes("/agents/state")) operationSuffix = `when attempting to get agent state.`;
        else if (url.includes("/agents/execute")) operationSuffix = `when attempting to execute agent(s).`;
        const message = params.message ?? (params.url ? `Failed to find CopilotKit API endpoint at url ${params.url} ${operationSuffix}` : `Failed to find CopilotKit API endpoint.`);
        const code = params.code ?? CopilotKitErrorCode.API_NOT_FOUND;
        const errorMessage = `${message}.\n\n${getSeeMoreMarkdown(ERROR_CONFIG[code].troubleshootingUrl)}`;
        super({
            message: errorMessage,
            code
        });
        this.name = ERROR_NAMES.COPILOT_API_DISCOVERY_ERROR;
    }
};
/**
* This error is used for endpoints specified in runtime's remote endpoints. If they cannot be contacted
* This typically occurs when:
* - The API endpoint URL is invalid or misconfigured
* - The API service is not running at the expected location
*
* @extends CopilotKitApiDiscoveryError
*/ var CopilotKitRemoteEndpointDiscoveryError = class extends CopilotKitApiDiscoveryError {
    constructor(params){
        const message = params?.message ?? (params?.url ? `Failed to find or contact remote endpoint at url ${params.url}` : "Failed to find or contact remote endpoint");
        const code = CopilotKitErrorCode.REMOTE_ENDPOINT_NOT_FOUND;
        super({
            message,
            code
        });
        this.name = ERROR_NAMES.COPILOT_REMOTE_ENDPOINT_DISCOVERY_ERROR;
    }
};
/**
* Error thrown when a LangGraph agent cannot be found or accessed.
* This typically occurs when:
* - The specified agent name does not exist in the deployment
* - The agent configuration is invalid or missing
* - The agent service is not properly deployed or initialized
*
* @extends CopilotKitError
*/ var CopilotKitAgentDiscoveryError = class extends CopilotKitError {
    constructor(params){
        const { agentName, availableAgents } = params;
        const code = CopilotKitErrorCode.AGENT_NOT_FOUND;
        const seeMore = getSeeMoreMarkdown(ERROR_CONFIG[code].troubleshootingUrl);
        let message;
        if (availableAgents.length) {
            const agentList = availableAgents.map((agent)=>agent.name).join(", ");
            if (agentName) message = `Agent '${agentName}' was not found. Available agents are: ${agentList}. Please verify the agent name in your configuration and ensure it matches one of the available agents.\n\n${seeMore}`;
            else message = `The requested agent was not found. Available agents are: ${agentList}. Please verify the agent name in your configuration and ensure it matches one of the available agents.\n\n${seeMore}`;
        } else message = `${agentName ? `Agent '${agentName}'` : "The requested agent"} was not found. Please set up at least one agent before proceeding. ${seeMore}`;
        super({
            message,
            code
        });
        this.name = ERROR_NAMES.COPILOT_KIT_AGENT_DISCOVERY_ERROR;
    }
};
/**
* Handles low-level networking errors that occur before a request reaches the server.
* These errors arise from issues in the underlying communication infrastructure rather than
* application-level logic or server responses. Typically used to handle "fetch failed" errors
* where no HTTP status code is available.
*
* Common scenarios include:
* - Connection failures (ECONNREFUSED) when server is down/unreachable
* - DNS resolution failures (ENOTFOUND) when domain can't be resolved
* - Timeouts (ETIMEDOUT) when request takes too long
* - Protocol/transport layer errors like SSL/TLS issues
*/ var CopilotKitLowLevelError = class extends CopilotKitError {
    constructor({ error, url, message }){
        let code = CopilotKitErrorCode.NETWORK_ERROR;
        const errorCode = error.code;
        const errorMessage = message ?? resolveLowLevelErrorMessage({
            errorCode,
            url
        });
        super({
            message: errorMessage,
            code
        });
        this.name = ERROR_NAMES.COPILOT_KIT_LOW_LEVEL_ERROR;
    }
};
/**
* Generic catch-all error handler for HTTP responses from the CopilotKit API where a status code is available.
* Used when we receive an HTTP error status and wish to handle broad range of them
*
* This differs from CopilotKitLowLevelError in that:
* - ResolvedCopilotKitError: Server was reached and returned an HTTP status
* - CopilotKitLowLevelError: Error occurred before reaching server (e.g. network failure)
*
* @param status - The HTTP status code received from the API response
* @param message - Optional error message to include
* @param code - Optional specific CopilotKitErrorCode to override default behavior
*
* Default behavior:
* - 400 Bad Request: Maps to CopilotKitApiDiscoveryError
* - All other status codes: Maps to UNKNOWN error code if no specific code provided
*/ var ResolvedCopilotKitError = class extends CopilotKitError {
    constructor({ status, message, code, isRemoteEndpoint, url }){
        let resolvedCode = code;
        if (!resolvedCode) switch(status){
            case 400:
                throw new CopilotKitApiDiscoveryError({
                    message,
                    url
                });
            case 404:
                throw isRemoteEndpoint ? new CopilotKitRemoteEndpointDiscoveryError({
                    message,
                    url
                }) : new CopilotKitApiDiscoveryError({
                    message,
                    url
                });
            default:
                resolvedCode = CopilotKitErrorCode.UNKNOWN;
                break;
        }
        super({
            message,
            code: resolvedCode
        });
        this.name = ERROR_NAMES.RESOLVED_COPILOT_KIT_ERROR;
    }
};
var ConfigurationError = class extends CopilotKitError {
    constructor(message){
        super({
            message,
            code: CopilotKitErrorCode.CONFIGURATION_ERROR
        });
        this.name = ERROR_NAMES.CONFIGURATION_ERROR;
        this.severity = Severity.WARNING;
    }
};
var MissingPublicApiKeyError = class extends ConfigurationError {
    constructor(message){
        super(message);
        this.name = ERROR_NAMES.MISSING_PUBLIC_API_KEY_ERROR;
        this.severity = Severity.CRITICAL;
    }
};
var UpgradeRequiredError = class extends ConfigurationError {
    constructor(message){
        super(message);
        this.name = ERROR_NAMES.UPGRADE_REQUIRED_ERROR;
        this.severity = Severity.WARNING;
    }
};
/**
* Checks if an error is already a structured CopilotKit error.
* This utility centralizes the logic for detecting structured errors across the codebase.
*
* @param error - The error to check
* @returns true if the error is already structured, false otherwise
*/ function isStructuredCopilotKitError(error) {
    return error instanceof CopilotKitError || error instanceof CopilotKitLowLevelError || error?.name && error.name.includes("CopilotKit") || error?.extensions?.code !== void 0;
}
/**
* Returns the error as-is if it's already structured, otherwise converts it using the provided converter function.
* This utility centralizes the pattern of preserving structured errors while converting unstructured ones.
*
* @param error - The error to process
* @param converter - Function to convert unstructured errors to structured ones
* @returns The structured error
*/ function ensureStructuredError(error, converter) {
    return isStructuredCopilotKitError(error) ? error : converter(error);
}
async function getPossibleVersionMismatch({ runtimeVersion, runtimeClientGqlVersion }) {
    if (!runtimeVersion || runtimeVersion === "" || !runtimeClientGqlVersion) return;
    if (__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["COPILOTKIT_VERSION"] !== runtimeVersion || __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["COPILOTKIT_VERSION"] !== runtimeClientGqlVersion || runtimeVersion !== runtimeClientGqlVersion) return {
        runtimeVersion,
        runtimeClientGqlVersion,
        reactCoreVersion: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["COPILOTKIT_VERSION"],
        message: getVersionMismatchErrorMessage({
            runtimeVersion,
            runtimeClientGqlVersion,
            reactCoreVersion: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["COPILOTKIT_VERSION"]
        })
    };
}
const resolveLowLevelErrorMessage = ({ errorCode, url })=>{
    const troubleshootingLink = ERROR_CONFIG[CopilotKitErrorCode.NETWORK_ERROR].troubleshootingUrl;
    const genericMessage = (description = `Failed to fetch from url ${url}.`)=>`${description}.

Possible reasons:
- -The server may have an error preventing it from returning a response (Check the server logs for more info).
- -The server might be down or unreachable
- -There might be a network issue (e.g., DNS failure, connection timeout) 
- -The URL might be incorrect
- -The server is not running on the specified port

${getSeeMoreMarkdown(troubleshootingLink)}`;
    if (url.includes("/info")) return genericMessage(`Failed to fetch CopilotKit agents/action information from url ${url}.`);
    if (url.includes("/actions/execute")) return genericMessage(`Fetch call to ${url} to execute actions failed.`);
    if (url.includes("/agents/state")) return genericMessage(`Fetch call to ${url} to get agent state failed.`);
    if (url.includes("/agents/execute")) return genericMessage(`Fetch call to ${url} to execute agent(s) failed.`);
    switch(errorCode){
        case "ECONNREFUSED":
            return `Connection to ${url} was refused. Ensure the server is running and accessible.\n\n${getSeeMoreMarkdown(troubleshootingLink)}`;
        case "ENOTFOUND":
            return `The server on ${url} could not be found. Check the URL or your network configuration.\n\n${getSeeMoreMarkdown(ERROR_CONFIG[CopilotKitErrorCode.NOT_FOUND].troubleshootingUrl)}`;
        case "ETIMEDOUT":
            return `The connection to ${url} timed out. The server might be overloaded or taking too long to respond.\n\n${getSeeMoreMarkdown(troubleshootingLink)}`;
        default:
            return;
    }
};
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/utils/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isMacOS",
    ()=>isMacOS,
    "parseJson",
    ()=>parseJson,
    "partialJSONParse",
    ()=>partialJSONParse,
    "phoenixExponentialBackoff",
    ()=>phoenixExponentialBackoff,
    "safeParseToolArgs",
    ()=>safeParseToolArgs,
    "tryMap",
    ()=>tryMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$partial$2d$json$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/partial-json/dist/index.js [app-client] (ecmascript)");
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
//#region src/utils/index.ts
/**
* Safely parses a JSON string into an object
* @param json The JSON string to parse
* @param fallback Optional fallback value to return if parsing fails. If not provided or set to "unset", returns null
* @returns The parsed JSON object, or the fallback value (or null) if parsing fails
*/ function parseJson(json, fallback = "unset") {
    try {
        return JSON.parse(json);
    } catch  {
        return fallback === "unset" ? null : fallback;
    }
}
/**
* Parses a partial/incomplete JSON string, returning as much valid data as possible.
* Falls back to an empty object if parsing fails entirely.
*/ function partialJSONParse(json) {
    try {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$partial$2d$json$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parse"](json);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
        return {};
    } catch  {
        return {};
    }
}
/**
* Returns an exponential backoff function suitable for Phoenix.js
* `reconnectAfterMs` and `rejoinAfterMs` options.
*
* @param baseMs  - Initial delay for the first retry attempt.
* @param maxMs   - Upper bound — delays are capped at this value.
*
* Phoenix calls the returned function with a 1-based `tries` count.
* The delay doubles on each attempt: baseMs, 2×baseMs, 4×baseMs, …, maxMs.
*/ function phoenixExponentialBackoff(baseMs, maxMs) {
    return (tries)=>Math.min(baseMs * 2 ** (tries - 1), maxMs);
}
/**
* Maps an array of items to a new array, skipping items that throw errors during mapping
* @param items The array to map
* @param callback The mapping function to apply to each item
* @returns A new array containing only the successfully mapped items
*/ function tryMap(items, callback) {
    return items.reduce((acc, item, index, array)=>{
        try {
            acc.push(callback(item, index, array));
        } catch (error) {
            console.error(error);
        }
        return acc;
    }, []);
}
/**
* Checks if the current environment is macOS
* @returns {boolean} True if running on macOS, false otherwise
*/ function isMacOS() {
    return /Mac|iMac|Macintosh/i.test(navigator.userAgent);
}
/**
* Safely parses a JSON string into a tool arguments object.
* Returns the parsed object only if it's a plain object (not an array, null, etc.).
* Falls back to an empty object for any non-object JSON value or parse failure.
*/ function safeParseToolArgs(raw) {
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
        console.warn(`[CopilotKit] Tool arguments parsed to non-object (${typeof parsed}), falling back to empty object`);
        return {};
    } catch  {
        console.warn("[CopilotKit] Failed to parse tool arguments, falling back to empty object");
        return {};
    }
}
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/utils/inspector-metadata.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseInspectorMetadataV1",
    ()=>parseInspectorMetadataV1
]);
//#region src/utils/inspector-metadata.ts
function isRecord(value) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
    try {
        const prototype = Object.getPrototypeOf(value);
        return prototype === Object.prototype || prototype === null;
    } catch  {
        return false;
    }
}
function readOwnDataProperty(value, key) {
    try {
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        return descriptor !== void 0 && "value" in descriptor ? descriptor.value : void 0;
    } catch  {
        return;
    }
}
function parseNonBlankString(value) {
    if (typeof value !== "string") return;
    const parsed = value.trim();
    return parsed.length > 0 ? parsed : void 0;
}
function parseIdentity(value) {
    if (!isRecord(value)) return;
    const organizationName = parseNonBlankString(value.organizationName);
    const projectName = parseNonBlankString(value.projectName);
    if (organizationName === void 0 || projectName === void 0) return;
    return {
        organizationName,
        projectName
    };
}
function parsePlan(value) {
    if (!isRecord(value)) return;
    const code = parseNonBlankString(value.code);
    const label = parseNonBlankString(value.label);
    if (code === void 0 || label === void 0) return;
    return {
        code,
        label
    };
}
function parseLicense(value) {
    if (!isRecord(value)) return;
    switch(value.state){
        case "valid":
        case "none":
        case "expired":
        case "unknown":
            return {
                state: value.state
            };
        default:
            return;
    }
}
function parseActionKind(value) {
    switch(value){
        case "manage_plan":
        case "renew":
        case "enable_intelligence":
            return value;
        default:
            return;
    }
}
function parseSafeActionUrl(value) {
    const url = parseNonBlankString(value);
    if (url === void 0 || url.includes("?") || url.includes("#")) return;
    const authorityStart = url.indexOf("://");
    if (authorityStart < 1) return;
    const authorityAndPath = url.slice(authorityStart + 3);
    const pathStart = authorityAndPath.indexOf("/");
    if ((pathStart === -1 ? authorityAndPath : authorityAndPath.slice(0, pathStart)).includes("@")) return;
    let parsed;
    try {
        parsed = new URL(url);
    } catch  {
        return;
    }
    if (parsed.hostname.length === 0 || parsed.username || parsed.password) return;
    if (parsed.protocol === "https:") return url;
    const isLoopbackHost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1" || parsed.hostname === "[::1]";
    if (parsed.protocol === "http:" && isLoopbackHost) return url;
}
function parseAction(value) {
    if (!isRecord(value)) return;
    const kind = parseActionKind(value.kind);
    const url = parseSafeActionUrl(value.url);
    if (kind === void 0 || url === void 0) return;
    return {
        kind,
        url
    };
}
function isFiniteNonnegativeInteger(value) {
    return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function parseUsageLimit(value) {
    if (!isRecord(value)) return;
    if (value.kind === "finite") {
        if (typeof value.value !== "number" || !Number.isSafeInteger(value.value) || value.value < 1) return;
        return {
            kind: "finite",
            value: value.value
        };
    }
    if (value.kind === "unlimited") return {
        kind: "unlimited"
    };
    if (value.kind === "unknown") return {
        kind: "unknown"
    };
}
function parseUsage(value) {
    if (!isRecord(value)) return;
    const limit = parseUsageLimit(value.limit);
    const used = value.used;
    if (!isFiniteNonnegativeInteger(used) || limit === void 0) return;
    const rawExpiringSoonCount = readOwnDataProperty(value, "expiringSoonCount");
    const expiringSoonCount = isFiniteNonnegativeInteger(rawExpiringSoonCount) ? rawExpiringSoonCount : void 0;
    return {
        used,
        limit,
        ...expiringSoonCount === void 0 ? {} : {
            expiringSoonCount
        }
    };
}
/**
* Parses untrusted inspector metadata without letting one invalid optional
* module hide the other valid modules.
*
* @param value - The decoded runtime response body.
* @returns Normalized version 1 metadata, or `undefined` for an unsupported
* top-level payload.
*/ function parseInspectorMetadataV1(value) {
    if (!isRecord(value) || value.schemaVersion !== 1) return;
    const identity = parseIdentity(value.identity);
    const plan = parsePlan(value.plan);
    const license = parseLicense(value.license);
    const action = parseAction(value.action);
    const usage = parseUsage(value.usage);
    return {
        schemaVersion: 1,
        ...identity === void 0 ? {} : {
            identity
        },
        ...plan === void 0 ? {} : {
            plan
        },
        ...license === void 0 ? {} : {
            license
        },
        ...action === void 0 ? {} : {
            action
        },
        ...usage === void 0 ? {} : {
            usage
        }
    };
}
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/utils/json-schema.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "actionParametersToJsonSchema",
    ()=>actionParametersToJsonSchema,
    "convertJsonSchemaToZodSchema",
    ()=>convertJsonSchemaToZodSchema,
    "getZodParameters",
    ()=>getZodParameters,
    "jsonSchemaToActionParameters",
    ()=>jsonSchemaToActionParameters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/shared/node_modules/zod/v3/external.js [app-client] (ecmascript) <export * as z>");
;
//#region src/utils/json-schema.ts
function actionParametersToJsonSchema(actionParameters) {
    let parameters = {};
    for (let parameter of actionParameters || [])parameters[parameter.name] = convertAttribute(parameter);
    let requiredParameterNames = [];
    for (let arg of actionParameters || [])if (arg.required !== false) requiredParameterNames.push(arg.name);
    return {
        type: "object",
        properties: parameters,
        required: requiredParameterNames
    };
}
function jsonSchemaToActionParameters(jsonSchema) {
    if (jsonSchema.type !== "object" || !jsonSchema.properties) return [];
    const parameters = [];
    const requiredFields = jsonSchema.required || [];
    for (const [name, schema] of Object.entries(jsonSchema.properties)){
        const parameter = convertJsonSchemaToParameter(name, schema, requiredFields.includes(name));
        parameters.push(parameter);
    }
    return parameters;
}
function convertJsonSchemaToParameter(name, schema, isRequired) {
    const baseParameter = {
        name,
        description: schema.description
    };
    if (!isRequired) baseParameter.required = false;
    if (Array.isArray(schema.type)) {
        const types = schema.type;
        const hasNull = types.includes("null");
        const nonNullTypes = types.filter((t)=>t !== "null");
        const resolvedType = nonNullTypes.length > 0 ? nonNullTypes[0] : "string";
        return convertJsonSchemaToParameter(name, {
            ...schema,
            type: resolvedType
        }, hasNull ? false : isRequired);
    }
    switch(schema.type){
        case "string":
            return {
                ...baseParameter,
                type: "string",
                ...schema.enum && {
                    enum: schema.enum
                }
            };
        case "number":
        case "boolean":
            return {
                ...baseParameter,
                type: schema.type
            };
        case "object":
            if (schema.properties) {
                const attributes = [];
                const requiredFields = schema.required || [];
                for (const [propName, propSchema] of Object.entries(schema.properties))attributes.push(convertJsonSchemaToParameter(propName, propSchema, requiredFields.includes(propName)));
                return {
                    ...baseParameter,
                    type: "object",
                    attributes
                };
            }
            return {
                ...baseParameter,
                type: "object"
            };
        case "array":
            if (schema.items.type === "object" && "properties" in schema.items) {
                const attributes = [];
                const requiredFields = schema.items.required || [];
                for (const [propName, propSchema] of Object.entries(schema.items.properties || {}))attributes.push(convertJsonSchemaToParameter(propName, propSchema, requiredFields.includes(propName)));
                return {
                    ...baseParameter,
                    type: "object[]",
                    attributes
                };
            } else if (schema.items.type === "array") throw new Error("Nested arrays are not supported");
            else return {
                ...baseParameter,
                type: `${schema.items.type}[]`
            };
        default:
            return {
                ...baseParameter,
                type: "string"
            };
    }
}
function convertAttribute(attribute) {
    switch(attribute.type){
        case "string":
            return {
                type: "string",
                description: attribute.description,
                ...attribute.enum && {
                    enum: attribute.enum
                }
            };
        case "number":
        case "boolean":
            return {
                type: attribute.type,
                description: attribute.description
            };
        case "object":
        case "object[]":
            const properties = attribute.attributes?.reduce((acc, attr)=>{
                acc[attr.name] = convertAttribute(attr);
                return acc;
            }, {});
            const required = attribute.attributes?.filter((attr)=>attr.required !== false).map((attr)=>attr.name);
            if (attribute.type === "object[]") return {
                type: "array",
                items: {
                    type: "object",
                    ...properties && {
                        properties
                    },
                    ...required && required.length > 0 && {
                        required
                    }
                },
                description: attribute.description
            };
            return {
                type: "object",
                description: attribute.description,
                ...properties && {
                    properties
                },
                ...required && required.length > 0 && {
                    required
                }
            };
        default:
            if (attribute.type?.endsWith("[]")) return {
                type: "array",
                items: {
                    type: attribute.type.slice(0, -2)
                },
                description: attribute.description
            };
            return {
                type: "string",
                description: attribute.description
            };
    }
}
function convertJsonSchemaToZodSchema(jsonSchema, required, definitions, visitedRefs) {
    if (jsonSchema.$ref && definitions) {
        const refPath = jsonSchema.$ref.replace(/^#\/\$defs\/|^#\/definitions\//, "");
        const refs = visitedRefs ?? /* @__PURE__ */ new Set();
        if (refs.has(refPath)) {
            console.warn(`[CopilotKit] Circular $ref detected for "${refPath}" — falling back to z.any()`);
            let schema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any();
            if (jsonSchema.description) schema = schema.describe(jsonSchema.description);
            return required ? schema : schema.optional();
        }
        const resolved = definitions[refPath];
        if (resolved) {
            const nextRefs = new Set(refs);
            nextRefs.add(refPath);
            return convertJsonSchemaToZodSchema(resolved, required, definitions, nextRefs);
        }
    }
    const defs = definitions ?? jsonSchema.$defs ?? jsonSchema.definitions;
    if (Array.isArray(jsonSchema.type)) {
        const types = jsonSchema.type;
        const hasNull = types.includes("null");
        const nonNullTypes = types.filter((t)=>t !== "null");
        const resolvedType = nonNullTypes.length > 0 ? nonNullTypes[0] : "string";
        const innerSchema = convertJsonSchemaToZodSchema({
            ...jsonSchema,
            type: resolvedType
        }, true, defs, visitedRefs);
        let schema = hasNull ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
            innerSchema,
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].null()
        ]) : innerSchema;
        if (jsonSchema.description) schema = schema.describe(jsonSchema.description);
        return required ? schema : schema.optional();
    }
    const unionVariants = jsonSchema.anyOf ?? jsonSchema.oneOf;
    if (Array.isArray(unionVariants) && unionVariants.length > 0) {
        if (unionVariants.length === 1) return convertJsonSchemaToZodSchema(unionVariants[0], required, defs, visitedRefs);
        const schemas = unionVariants.map((v)=>convertJsonSchemaToZodSchema(v, true, defs, visitedRefs));
        let schema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union(schemas);
        if (jsonSchema.description) schema = schema.describe(jsonSchema.description);
        return required ? schema : schema.optional();
    }
    if (jsonSchema.type === "object") {
        const spec = {};
        if (!jsonSchema.properties || !Object.keys(jsonSchema.properties).length) return !required ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object(spec).optional() : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object(spec);
        for (const [key, value] of Object.entries(jsonSchema.properties))spec[key] = convertJsonSchemaToZodSchema(value, jsonSchema.required ? jsonSchema.required.includes(key) : false, defs, visitedRefs);
        let schema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object(spec).describe(jsonSchema.description);
        return required ? schema : schema.optional();
    } else if (jsonSchema.type === "string") {
        if (jsonSchema.enum && jsonSchema.enum.length > 0) {
            let schema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(jsonSchema.enum).describe(jsonSchema.description);
            return required ? schema : schema.optional();
        }
        let schema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe(jsonSchema.description);
        return required ? schema : schema.optional();
    } else if (jsonSchema.type === "number" || jsonSchema.type === "integer") {
        let schema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe(jsonSchema.description);
        return required ? schema : schema.optional();
    } else if (jsonSchema.type === "boolean") {
        let schema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().describe(jsonSchema.description);
        return required ? schema : schema.optional();
    } else if (jsonSchema.type === "array") {
        let itemSchema = convertJsonSchemaToZodSchema(jsonSchema.items, true, defs, visitedRefs);
        let schema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(itemSchema).describe(jsonSchema.description);
        return required ? schema : schema.optional();
    } else if (jsonSchema.type === "null") {
        let schema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].null().describe(jsonSchema.description);
        return required ? schema : schema.optional();
    }
    console.warn(`[CopilotKit] Unsupported JSON schema type "${jsonSchema.type ?? "unknown"}" — falling back to z.any()`);
    let schema = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any();
    if (jsonSchema.description) schema = schema.describe(jsonSchema.description);
    return required ? schema : schema.optional();
}
function getZodParameters(parameters) {
    if (!parameters) return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$shared$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({});
    return convertJsonSchemaToZodSchema(actionParametersToJsonSchema(parameters), true);
}
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/utils/random-id.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dataToUUID",
    ()=>dataToUUID,
    "isValidUUID",
    ()=>isValidUUID,
    "randomId",
    ()=>randomId,
    "randomUUID",
    ()=>randomUUID
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/uuid/dist/esm-browser/v4.js [app-client] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v5$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__v5$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/uuid/dist/esm-browser/v5.js [app-client] (ecmascript) <locals> <export default as v5>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$validate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__validate$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/uuid/dist/esm-browser/validate.js [app-client] (ecmascript) <export default as validate>");
;
//#region src/utils/random-id.ts
function randomId() {
    return "ck-" + (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
}
function randomUUID() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
}
/**
* Recursively converts an object to a serializable form by converting functions to their string representation.
*/ function toSerializable(value) {
    if (typeof value === "function") return value.toString();
    if (Array.isArray(value)) return value.map(toSerializable);
    if (value !== null && typeof value === "object") {
        const result = {};
        for (const key of Object.keys(value))result[key] = toSerializable(value[key]);
        return result;
    }
    return value;
}
function dataToUUID(input, namespace) {
    const BASE_NAMESPACE = "e4b01160-ff74-4c6e-9b27-d53cd930fe8e";
    const boundNamespace = namespace ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v5$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__v5$3e$__["v5"])(namespace, BASE_NAMESPACE) : BASE_NAMESPACE;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v5$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__v5$3e$__["v5"])(typeof input === "string" ? input : JSON.stringify(toSerializable(input)), boundNamespace);
}
function isValidUUID(uuid) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$validate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__validate$3e$__["validate"])(uuid);
}
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/utils/requests.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "readBody",
    ()=>readBody
]);
//#region src/utils/requests.ts
/**
* Safely read a Response/Request body with sensible defaults:
* - clones the response/request to avoid consuming the original response/request
* - Skips GET/HEAD
* - Tries JSON first regardless of content-type
* - Falls back to text and optionally parses when it "looks" like JSON
*/ async function readBody(r) {
    const method = "method" in r ? r.method.toUpperCase() : void 0;
    if (method === "GET" || method === "HEAD") return;
    if (!("body" in r) || r.body == null) return;
    try {
        return await r.clone().json();
    } catch  {
        try {
            const text = await r.clone().text();
            const trimmed = text.trim();
            if (trimmed.length === 0) return text;
            if (trimmed.startsWith("{") || trimmed.startsWith("[")) try {
                return JSON.parse(trimmed);
            } catch  {
                return text;
            }
            return text;
        } catch  {
            try {
                const stream = r.clone().body ?? null;
                if (!stream) return void 0;
                const reader = stream.getReader();
                const decoder = new TextDecoder();
                let out = "";
                while(true){
                    const { done, value } = await reader.read();
                    if (done) break;
                    if (typeof value === "string") out += value;
                    else out += decoder.decode(value, {
                        stream: true
                    });
                }
                out += decoder.decode();
                const trimmed = out.trim();
                if (trimmed.length === 0) return out;
                if (trimmed.startsWith("{") || trimmed.startsWith("[")) try {
                    return JSON.parse(trimmed);
                } catch  {
                    return out;
                }
                return out;
            } catch  {
                return;
            }
        }
    }
}
;
}),
"[project]/frontend/node_modules/@copilotkit/shared/dist/utils/types.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RUNTIME_MODE_INTELLIGENCE",
    ()=>RUNTIME_MODE_INTELLIGENCE,
    "RUNTIME_MODE_SSE",
    ()=>RUNTIME_MODE_SSE
]);
//#region src/utils/types.ts
const RUNTIME_MODE_SSE = "sse";
const RUNTIME_MODE_INTELLIGENCE = "intelligence";
;
}),
"[project]/frontend/node_modules/@copilotkit/web-components/dist/threads-drawer/copilotkit-threads-drawer.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COPILOTKIT_THREADS_DRAWER_TAG",
    ()=>COPILOTKIT_THREADS_DRAWER_TAG,
    "CopilotKitThreadsDrawer",
    ()=>CopilotKitThreadsDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$web$2d$components$2f$dist$2f$threads$2d$drawer$2f$styles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/web-components/dist/threads-drawer/styles.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lit/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$element$2f$development$2f$lit$2d$element$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lit-element/development/lit-element.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lit-html/development/lit-html.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2f$directives$2f$repeat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lit/directives/repeat.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$directives$2f$repeat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lit-html/development/directives/repeat.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2f$directives$2f$class$2d$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lit/directives/class-map.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$directives$2f$class$2d$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/lit-html/development/directives/class-map.js [app-client] (ecmascript)");
;
;
;
;
//#region src/threads-drawer/copilotkit-threads-drawer.ts
/** Tag name the element registers under. */ const COPILOTKIT_THREADS_DRAWER_TAG = "copilotkit-threads-drawer";
/** Mobile breakpoint (px). At or below this width the drawer is a modal overlay. */ const MOBILE_BREAKPOINT = 768;
/**
* Whether an inbound error message should surface an error state. Only a
* non-empty, non-whitespace string counts — `null`, `""`, and whitespace-only
* strings are treated as "no error" so an empty error never conflates with a
* real one (and never blanks the list behind an empty error panel).
*/ function hasErrorMessage(value) {
    return value !== null && value.trim().length > 0;
}
/**
* Builds the per-row slot name (`row:<id>`) used for consumer projection, but
* only when the thread id is safe to embed in a slot `name` / `slot` attribute
* token. A slot name is matched character-for-character against the consumer's
* `slot="..."` attribute; whitespace splits attribute tokens and quotes/angle
* brackets can break attribute serialization, so an id containing any of those
* would silently fail projection. For such an id we return `null` and the row
* renders its default name span (no per-row slot), which is the safe fallback.
*/ function rowSlotName(id) {
    if (id.length === 0 || /[\s"'<>=]/.test(id)) return null;
    return `row:${id}`;
}
/**
* Inline row-action icons. The element is framework-agnostic Lit, so it cannot
* depend on a React icon library — these are the lucide `archive`,
* `archive-restore`, and `trash-2` glyphs inlined as SVG, drawn with
* `currentColor` so they inherit the button's themed color.
*/ const iconArchive = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
  <svg
    class="row-action-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="5" x="2" y="3" rx="1" />
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
    <path d="M10 12h4" />
  </svg>
`;
const iconUnarchive = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
  <svg
    class="row-action-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="5" x="2" y="3" rx="1" />
    <path d="M4 8v11a2 2 0 0 0 2 2h2" />
    <path d="M20 8v11a2 2 0 0 1-2 2h-2" />
    <path d="m9 15 3-3 3 3" />
    <path d="M12 12v9" />
  </svg>
`;
const iconDelete = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
  <svg
    class="row-action-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M3 6h18" />
    <path
      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
    />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
`;
const iconSidebar = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
  <svg
    class="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18" />
  </svg>
`;
/**
* Header / control icons for the redesigned drawer chrome (ENT-1051). Inlined
* lucide glyphs (`square-plus`, `filter`, `ellipsis-vertical`) drawn with
* `currentColor` so they inherit the button's themed color — the element cannot
* depend on a React icon library.
*/ const iconPlusSquare = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
  <svg
    class="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M8 12h8" />
    <path d="M12 8v8" />
  </svg>
`;
const iconFunnel = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
  <svg
    class="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <line x1="3" y1="5" x2="21" y2="5" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="10" y1="19" x2="14" y2="19" />
  </svg>
`;
const iconKebab = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
  <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="5" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="12" cy="19" r="1.6" />
  </svg>
`;
/**
* `<copilotkit-threads-drawer>` — a public, self-contained, controlled, framework-agnostic
* threads drawer rendered into a shadow root.
*
* Pure VIEW: domain data (threads/loading/error/etc.) comes IN as properties and
* user intent goes OUT as bubbling+composed DOM `CustomEvent`s. The element owns
* VIEW state (open, Active/All filter, confirm-delete dialog, per-row
* animations) while the consumer owns DOMAIN state. `open` is additionally
* externally controllable via the `open` property + `open-change` event so a
* host can coordinate mobile open/close.
*
* The element is AUTHORITATIVE over row order and the Active/All filter.
*/ var CopilotKitThreadsDrawer = class extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$element$2f$development$2f$lit$2d$element$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LitElement"] {
    constructor(..._args){
        super(..._args);
        this.label = "Threads";
        this.recentLabel = "Recent Conversations";
        this.threads = [];
        this.loading = false;
        this.error = null;
        this.activeThreadId = null;
        this.licensed = true;
        this.licenseUrl = "https://docs.copilotkit.ai/intelligence";
        this.hasMore = false;
        this.fetchingMore = false;
        this.fetchMoreError = null;
        this.open = false;
        this.collapsed = false;
        this.collapsible = true;
        this._filter = "active";
        this._confirmingDeleteId = null;
        this._viewportIsMobile = false;
        this._hasHeader = false;
        this._hasMemories = false;
        this._hasFooter = false;
        this._filterOpen = false;
        this._openMenuId = null;
        this._mediaQuery = null;
        this._onMediaChange = (event)=>{
            this._viewportIsMobile = event.matches;
        };
        this._onKeyDown = (event)=>{
            if (event.key === "Escape") {
                if (this._openMenuId !== null) {
                    this._openMenuId = null;
                    event.stopPropagation();
                    return;
                }
                if (this._filterOpen) {
                    this._filterOpen = false;
                    event.stopPropagation();
                    return;
                }
                if (this._confirmingDeleteId !== null) {
                    event.stopPropagation();
                    return;
                }
                if (this._viewportIsMobile && this.open) {
                    this._setOpen(false);
                    event.stopPropagation();
                }
                return;
            }
            if (event.key === "Tab") this._trapTab(event);
        };
        this._onDocumentPointerDown = (event)=>{
            if (!this._filterOpen && this._openMenuId === null) return;
            const path = event.composedPath();
            if (this._filterOpen) {
                const popover = this.renderRoot.querySelector("[part=\"filters\"]");
                const trigger = this.renderRoot.querySelector("[part=\"filter-toggle\"]");
                if (!(popover && path.includes(popover) || trigger && path.includes(trigger))) this._filterOpen = false;
            }
            if (this._openMenuId !== null) {
                const popover = this.renderRoot.querySelector("[part=\"row-menu-popover\"]");
                const trigger = this.renderRoot.querySelector(".row.menu-open [part=\"row-menu\"]");
                if (!(popover && path.includes(popover) || trigger && path.includes(trigger))) this._openMenuId = null;
            }
        };
        this._seenNamed = /* @__PURE__ */ new Set();
        this._justRevealed = /* @__PURE__ */ new Set();
        this._repositionConfirm = ()=>this._positionConfirmDialog();
        this._scrollLocked = false;
        this._prevBodyOverflow = "";
        this._trapTab = (event)=>{
            if (event.key !== "Tab" || !this._isMobileModalOpen()) return;
            const focusable = this._composedFocusable();
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = this.renderRoot.activeElement ?? document.activeElement;
            if (event.shiftKey && active === first) {
                last.focus();
                event.preventDefault();
            } else if (!event.shiftKey && active === last) {
                first.focus();
                event.preventDefault();
            }
        };
    }
    static{
        this.styles = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$web$2d$components$2f$dist$2f$threads$2d$drawer$2f$styles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["drawerStyles"];
    }
    static{
        this.properties = {
            threads: {
                attribute: false
            },
            loading: {
                type: Boolean
            },
            error: {
                type: String
            },
            activeThreadId: {
                attribute: "active-thread-id",
                type: String
            },
            licensed: {
                type: Boolean
            },
            licenseUrl: {
                attribute: "license-url",
                type: String
            },
            hasMore: {
                attribute: "has-more",
                type: Boolean
            },
            fetchingMore: {
                attribute: "fetching-more",
                type: Boolean
            },
            fetchMoreError: {
                attribute: "fetch-more-error",
                type: String
            },
            label: {
                type: String
            },
            recentLabel: {
                attribute: "recent-label",
                type: String
            },
            collapsible: {
                type: Boolean
            },
            open: {
                type: Boolean,
                reflect: true
            },
            collapsed: {
                type: Boolean,
                reflect: true
            },
            _filter: {
                state: true
            },
            _confirmingDeleteId: {
                state: true
            },
            _viewportIsMobile: {
                state: true
            },
            _hasHeader: {
                state: true
            },
            _hasMemories: {
                state: true
            },
            _hasFooter: {
                state: true
            },
            _filterOpen: {
                state: true
            },
            _openMenuId: {
                state: true
            }
        };
    }
    connectedCallback() {
        super.connectedCallback();
        if (typeof window !== "undefined" && window.matchMedia) {
            this._mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
            this._viewportIsMobile = this._mediaQuery.matches;
            this._mediaQuery.addEventListener("change", this._onMediaChange);
        }
        this.addEventListener("keydown", this._onKeyDown);
        if (typeof document !== "undefined") document.addEventListener("pointerdown", this._onDocumentPointerDown);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._mediaQuery?.removeEventListener("change", this._onMediaChange);
        this.removeEventListener("keydown", this._onKeyDown);
        if (typeof document !== "undefined") document.removeEventListener("pointerdown", this._onDocumentPointerDown);
        if (typeof window !== "undefined") {
            window.removeEventListener("scroll", this._repositionConfirm, true);
            window.removeEventListener("resize", this._repositionConfirm);
        }
        if (typeof document !== "undefined") document.documentElement.style.removeProperty("--cpk-drawer-reserved-width");
        this._releaseScrollLock();
    }
    willUpdate(changed) {
        if (changed.has("threads")) {
            const presentIds = /* @__PURE__ */ new Set();
            const revealed = /* @__PURE__ */ new Set();
            for (const thread of this.threads){
                presentIds.add(thread.id);
                const hasName = thread.name !== null && thread.name !== "";
                if (hasName && !this._seenNamed.has(thread.id)) revealed.add(thread.id);
                if (hasName) this._seenNamed.add(thread.id);
            }
            for (const id of this._seenNamed)if (!presentIds.has(id)) this._seenNamed.delete(id);
            this._justRevealed = revealed;
            if (this._confirmingDeleteId !== null) {
                if (!this._visibleThreads().some((t)=>t.id === this._confirmingDeleteId)) this._confirmingDeleteId = null;
            }
            if (this._openMenuId !== null) {
                if (!this._visibleThreads().some((t)=>t.id === this._openMenuId)) this._openMenuId = null;
            }
        }
    }
    updated(changed) {
        if (changed.has("open") || changed.has("_viewportIsMobile")) if (this._isMobileModalOpen()) {
            this._applyScrollLock();
            this._focusFirstFocusable();
        } else this._releaseScrollLock();
        if (changed.has("collapsed") || changed.has("collapsible") || changed.has("_viewportIsMobile")) this._syncReservedWidth();
        const dialog = this.renderRoot.querySelector("dialog");
        if (dialog) {
            const id = this._confirmingDeleteId;
            if (id !== null && !dialog.open) {
                typeof dialog.showModal === "function" ? dialog.showModal() : dialog.setAttribute("open", "");
                this._positionConfirmDialog();
                window.addEventListener("scroll", this._repositionConfirm, true);
                window.addEventListener("resize", this._repositionConfirm);
            } else if (id === null && dialog.open) {
                typeof dialog.close === "function" ? dialog.close() : dialog.removeAttribute("open");
                window.removeEventListener("scroll", this._repositionConfirm, true);
                window.removeEventListener("resize", this._repositionConfirm);
            }
        }
        if (this._justRevealed.size > 0) this._justRevealed = /* @__PURE__ */ new Set();
    }
    _isMobileModalOpen() {
        return this._viewportIsMobile && this.open;
    }
    _setOpen(next) {
        if (this.open === next) return;
        this.open = next;
        this._emit("open-change", {
            open: next
        });
    }
    _setCollapsed(next) {
        if (this.collapsed === next) return;
        this.collapsed = next;
        this._emit("collapse-change", {
            collapsed: next
        });
    }
    /**
	* Signal the drawer's reserved layout width to the host so a desktop collapse
	* reclaims the column instead of leaving an empty gap. On desktop-collapse we
	* set `--cpk-drawer-reserved-width: 0px` on the document root; a host whose
	* grid reads `grid-template-columns: var(--cpk-drawer-reserved-width, 320px) …`
	* inherits it and collapses the track (with its own transition). Expanded/mobile
	* clears the override so the host's fallback width applies — which also means
	* the default (expanded) render never sets it, so there is no hydration flicker.
	*
	* It is set on `document.documentElement` (not `parentElement`) BECAUSE the
	* element is nested inside a framework wrapper host, so its parent is the
	* wrapper — not the grid container, which is an ancestor a child's custom
	* property can't reach. `:root` inheritance reaches the grid regardless of
	* wrapper nesting. Best-effort + namespaced, single-drawer-per-document; a host
	* with multiple drawers or a custom layout should instead react to the
	* `collapse-change` event.
	*/ _syncReservedWidth() {
        if (typeof document === "undefined") return;
        const desktopCollapsed = this.collapsible && this.collapsed && !this._viewportIsMobile;
        const root = document.documentElement;
        if (desktopCollapsed) root.style.setProperty("--cpk-drawer-reserved-width", "0px");
        else root.style.removeProperty("--cpk-drawer-reserved-width");
    }
    /**
	* Center the confirm-delete <dialog> over the drawer PANEL's on-screen box
	* (not the viewport). The dialog stays a top-layer `showModal()` element so it
	* is never clipped, but we drive its center via `--confirm-cx/cy` measured
	* from the visible `.root` rect — so it reads as "inside the drawer" per the
	* ENT-1051 design while keeping the top-layer robustness. Falls back to
	* viewport-center (the CSS default) when the panel isn't measurable
	* (SSR/jsdom).
	*/ _positionConfirmDialog() {
        const dialog = this.renderRoot.querySelector("dialog");
        const root = this.renderRoot.querySelector(".root");
        if (!dialog) return;
        const rect = root?.getBoundingClientRect();
        if (!rect || rect.width === 0 && rect.height === 0) {
            dialog.style.removeProperty("--confirm-cx");
            dialog.style.removeProperty("--confirm-cy");
            return;
        }
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const visLeft = Math.max(rect.left, 0);
        const visRight = Math.min(rect.right, vw);
        const visTop = Math.max(rect.top, 0);
        const visBottom = Math.min(rect.bottom, vh);
        dialog.style.setProperty("--confirm-cx", `${(visLeft + visRight) / 2}px`);
        dialog.style.setProperty("--confirm-cy", `${(visTop + visBottom) / 2}px`);
    }
    _setFilter(next) {
        if (this._filter === next) return;
        this._filter = next;
        this._emit("filter-change", {
            filter: next
        });
    }
    /**
	* Element-authoritative ordering + filtering. Active filter hides archived
	* threads; ordering is most-recent-first by `lastRunAt`/`updatedAt`.
	*/ _visibleThreads() {
        const filtered = this._filter === "active" ? this.threads.filter((t)=>!t.archived) : this.threads;
        const ts = (t)=>{
            const raw = t.lastRunAt ?? t.updatedAt ?? t.createdAt;
            const parsed = Date.parse(raw);
            return Number.isNaN(parsed) ? null : parsed;
        };
        return [
            ...filtered
        ].map((thread, index)=>({
                thread,
                index,
                ts: ts(thread)
            })).sort((a, b)=>{
            if (a.ts === null && b.ts === null) return a.index - b.index;
            if (a.ts === null) return 1;
            if (b.ts === null) return -1;
            if (a.ts !== b.ts) return b.ts - a.ts;
            return a.index - b.index;
        }).map((entry)=>entry.thread);
    }
    _emit(type, detail) {
        this.dispatchEvent(new CustomEvent(type, {
            detail,
            bubbles: true,
            composed: true
        }));
    }
    _applyScrollLock() {
        if (this._scrollLocked || typeof document === "undefined") return;
        this._prevBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        this._scrollLocked = true;
    }
    _releaseScrollLock() {
        if (!this._scrollLocked || typeof document === "undefined") return;
        document.body.style.overflow = this._prevBodyOverflow;
        this._scrollLocked = false;
    }
    /**
	* Returns the focusable elements in the composed/flattened tree of the drawer
	* root, INCLUDING slotted light-DOM content (so a focus trap covers slotted
	* rows). Walks assigned nodes of each `<slot>`.
	*/ _composedFocusable() {
        const selector = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])";
        const out = [];
        const backdrop = this.renderRoot.querySelector(".backdrop");
        if (backdrop) out.push(backdrop);
        const root = this.renderRoot.querySelector(".root");
        if (!root) return out;
        const collect = (node)=>{
            node.querySelectorAll(selector).forEach((el)=>out.push(el));
        };
        collect(root);
        root.querySelectorAll("slot").forEach((slot)=>{
            slot.assignedElements({
                flatten: true
            }).forEach((assigned)=>{
                if (assigned.matches(selector)) out.push(assigned);
                collect(assigned);
            });
        });
        return out;
    }
    _focusFirstFocusable() {
        queueMicrotask(()=>{
            const focusable = this._composedFocusable();
            const backdrop = this.renderRoot.querySelector(".backdrop");
            (focusable.find((el)=>el !== backdrop) ?? focusable[0])?.focus();
        });
    }
    render() {
        const desktopCollapsed = this.collapsible && this.collapsed && !this._viewportIsMobile;
        const mobileClosed = this._viewportIsMobile && !this.open;
        const showCluster = desktopCollapsed || mobileClosed;
        const rootClasses = {
            root: true,
            mobile: this._viewportIsMobile,
            open: this.open,
            collapsed: desktopCollapsed
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
      ${showCluster ? this._renderCluster() : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nothing"]}
      ${this._isMobileModalOpen() ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`<button
            class="backdrop"
            part="backdrop"
            aria-label="Close threads drawer"
            @click=${()=>this._setOpen(false)}
          ></button>` : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nothing"]}
      <div
        class=${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$directives$2f$class$2d$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["classMap"])(rootClasses)}
        part="root"
        role=${this._isMobileModalOpen() ? "dialog" : "region"}
        aria-modal=${this._isMobileModalOpen() ? "true" : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nothing"]}
        aria-hidden=${desktopCollapsed ? "true" : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nothing"]}
        aria-label=${this.label}
      >
        ${desktopCollapsed ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nothing"] : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`${this._renderHeader()} ${this._renderBody()}
              ${this._renderMemories()} ${this._renderFooter()}
              ${this._renderConfirmDialog()}`}
      </div>
    `;
    }
    /**
	* Floating launcher cluster from the Figma "closed" mockup: a sidebar-glyph
	* toggle + a "New Conversation" (+) icon button. Shown in TWO states — the
	* mobile closed state (toggle opens the off-canvas modal) and the desktop
	* collapsed state (toggle expands the sidebar). The primary toggle keeps
	* `part="launcher"` for mobile-launcher theme compat; the new-thread button is
	* suppressed in the locked/unlicensed view, mirroring the New Conversation row.
	*/ _renderCluster() {
        const onToggle = this._viewportIsMobile ? ()=>this._setOpen(true) : ()=>this._setCollapsed(false);
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
      <div class="launcher-cluster" part="launcher-cluster">
        <button
          class="launcher"
          part="launcher"
          aria-label=${this._viewportIsMobile ? "Open threads" : "Expand threads"}
          @click=${onToggle}
        >
          <slot name="launcher-icon">${iconSidebar}</slot>
        </button>
        ${this.licensed ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`<button
                class="launcher launcher-new-thread"
                part="launcher-new-thread"
                aria-label="New Conversation"
                @click=${()=>this._emit("new-thread", {})}
              >
                ${iconPlusSquare}
              </button>` : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nothing"]}
      </div>
    `;
    }
    _renderHeader() {
        const showMobileClose = this._viewportIsMobile && this.open;
        const showCollapseToggle = this.collapsible && !this._viewportIsMobile;
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
      <div
        class="header"
        part="header"
        ?hidden=${!this._hasHeader && !showMobileClose && !showCollapseToggle}
      >
        <slot
          name="header"
          @slotchange=${(e)=>{
            this._hasHeader = e.target.assignedElements().length > 0;
        }}
        ></slot>
        ${showCollapseToggle ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`<button
              class="icon-btn"
              part="collapse-toggle"
              aria-label="Collapse threads"
              @click=${()=>this._setCollapsed(true)}
            >
              ${iconSidebar}
            </button>` : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nothing"]}
        ${showMobileClose ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`<button
              class="icon-btn"
              part="close-toggle"
              aria-label="Close threads"
              @click=${()=>this._setOpen(false)}
            >
              ${iconSidebar}
            </button>` : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nothing"]}
      </div>
      ${this.licensed ? this._renderNewConversation() : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nothing"]}
      ${this._renderSectionHeading()}
    `;
    }
    /**
	* Dedicated full-width "New Conversation" row. Keeps `part="new-thread-button"`
	* and fires the existing `new-thread` event, so wrappers/themes that hook the
	* old header pill are unaffected.
	*/ _renderNewConversation() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
      <button
        class="new-conversation"
        part="new-thread-button"
        @click=${()=>this._emit("new-thread", {})}
      >
        ${iconPlusSquare}
        <span>New Conversation</span>
      </button>
    `;
    }
    /**
	* "Recent Conversations" section heading with a funnel button that opens the
	* Active/All filter popover. Only shown when the list region is shown
	* (licensed, and not the full-panel error/empty-before-load) — mirrors the
	* old filters gate. The popover options keep `part="filter-active"` /
	* `part="filter-all"` and still emit `filter-change` via `_setFilter`.
	*/ _renderSectionHeading() {
        if (!this.licensed || hasErrorMessage(this.error) && this.threads.length === 0) return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nothing"];
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
      <div class="section-heading" part="section-heading">
        <span class="section-title">${this.recentLabel}</span>
        <button
          class="icon-btn small"
          part="filter-toggle"
          aria-label="Filter threads"
          aria-expanded=${this._filterOpen}
          @click=${()=>this._filterOpen = !this._filterOpen}
        >
          ${iconFunnel}
          ${this._filter !== "active" ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
                  <span class="filter-dot" part="filter-indicator"></span>
                ` : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nothing"]}
        </button>
        ${this._filterOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`<div
              class="filter-popover"
              part="filters"
              role="group"
              aria-label="Filter threads"
            >
              <button
                class="filter-opt"
                part="filter-active"
                aria-pressed=${this._filter === "active"}
                @click=${()=>{
            this._setFilter("active");
            this._filterOpen = false;
        }}
              >
                Active
              </button>
              <button
                class="filter-opt"
                part="filter-all"
                aria-pressed=${this._filter === "all"}
                @click=${()=>{
            this._setFilter("all");
            this._filterOpen = false;
        }}
              >
                All
              </button>
            </div>` : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nothing"]}
      </div>
    `;
    }
    _renderBody() {
        if (!this.licensed) return this._renderLicensed();
        if (hasErrorMessage(this.error) && this.threads.length === 0) return this._renderError();
        if (this.loading && this.threads.length === 0) return this._renderLoading();
        return this._renderList();
    }
    /**
	* Handles the Upgrade CTA click in the locked view. Dispatches a cancelable
	* `licensed` event carrying the resolved `licenseUrl`; unless a host calls
	* `preventDefault()`, opens that URL in a new tab. A blank `licenseUrl`
	* suppresses navigation so the event alone drives host behavior.
	*/ _onLicensedCta() {
        if (this.dispatchEvent(new CustomEvent("licensed", {
            detail: {
                licenseUrl: this.licenseUrl
            },
            bubbles: true,
            composed: true,
            cancelable: true
        })) && this.licenseUrl && typeof window !== "undefined") window.open(this.licenseUrl, "_blank", "noopener,noreferrer");
    }
    _renderLicensed() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
      <div class="licensed" part="licensed" data-testid="drawer-licensed">
        <slot name="licensed">
          <p>Threads are a CopilotKit Intelligence feature.</p>
          <button
            class="primary"
            part="licensed-cta"
            @click=${()=>this._onLicensedCta()}
          >
            Upgrade
          </button>
        </slot>
      </div>
    `;
    }
    _renderError() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
      <div
        class="state error"
        part="error"
        role="alert"
        data-testid="drawer-error"
      >
        <p>${this.error}</p>
        <button
          class="primary"
          part="retry-button"
          @click=${()=>this._emit("retry", {
                scope: "initial"
            })}
        >
          Retry
        </button>
      </div>
    `;
    }
    _renderLoading() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
      <div class="state" part="loading" data-testid="drawer-loading" aria-busy="true">
        Loading threads…
      </div>
    `;
    }
    _renderList() {
        const visible = this._visibleThreads();
        if (visible.length === 0) return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
        <div class="state" part="empty" data-testid="drawer-empty">
          <slot name="empty">No threads yet.</slot>
        </div>
      `;
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
      <ul
        class=${this._openMenuId !== null ? "list menu-open" : "list"}
        part="list"
        role="listbox"
        aria-label=${this.label}
      >
        ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$directives$2f$repeat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["repeat"])(visible, (thread)=>thread.id, (thread, index)=>this._renderRow(thread, index, visible.length))}
      </ul>
      ${this._renderFetchMore()}
    `;
    }
    _renderRow(thread, index = 0, total = 1) {
        const isActive = thread.id === this.activeThreadId;
        const hasName = thread.name !== null && thread.name !== "";
        const displayName = hasName ? thread.name : "New thread";
        const justRevealed = this._justRevealed.has(thread.id);
        const menuOpen = this._openMenuId === thread.id;
        const menuUp = menuOpen && total > 1 && index >= total / 2;
        const rowClasses = {
            row: true,
            active: isActive,
            archived: thread.archived,
            "menu-open": menuOpen,
            "menu-up": menuUp
        };
        const nameClasses = {
            "row-name": true,
            placeholder: !hasName,
            revealed: justRevealed
        };
        const slotName = rowSlotName(thread.id);
        const nameSpan = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`<span class=${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$directives$2f$class$2d$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["classMap"])(nameClasses)} part="row-name">
      <span class="row-name-text">${displayName}</span>
    </span>`;
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
      <li
        class=${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$directives$2f$class$2d$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["classMap"])(rowClasses)}
        part=${isActive ? "row row-active" : "row"}
        role="option"
        aria-selected=${isActive ? "true" : "false"}
        tabindex="0"
        data-thread-id=${thread.id}
        @click=${()=>{
            this._openMenuId = null;
            this._emit("thread-selected", {
                threadId: thread.id
            });
        }}
        @keydown=${(e)=>{
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this._openMenuId = null;
                this._emit("thread-selected", {
                    threadId: thread.id
                });
            }
        }}
      >
        ${slotName !== null ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`<slot name=${slotName}>${nameSpan}</slot>` : nameSpan}
        <button
          class="row-menu"
          part="row-menu"
          aria-label=${`Actions for ${displayName}`}
          aria-haspopup="menu"
          aria-expanded=${menuOpen}
          @click=${(e)=>{
            e.stopPropagation();
            this._openMenuId = menuOpen ? null : thread.id;
        }}
        >
          ${iconKebab}
        </button>
        ${menuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`<div
              class="row-menu-popover"
              part="row-menu-popover"
              role="menu"
            >
              ${thread.archived ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`<button
                    class="row-menu-item"
                    part="row-unarchive"
                    role="menuitem"
                    aria-label=${`Unarchive thread ${displayName}`}
                    @click=${(e)=>{
            e.stopPropagation();
            this._openMenuId = null;
            this._emit("unarchive", {
                threadId: thread.id
            });
        }}
                  >
                    ${iconUnarchive}<span>Unarchive</span>
                  </button>` : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`<button
                    class="row-menu-item"
                    part="row-archive"
                    role="menuitem"
                    aria-label=${`Archive thread ${displayName}`}
                    @click=${(e)=>{
            e.stopPropagation();
            this._openMenuId = null;
            this._emit("archive", {
                threadId: thread.id
            });
        }}
                  >
                    ${iconArchive}<span>Archive</span>
                  </button>`}
              <button
                class="row-menu-item danger"
                part="row-delete"
                role="menuitem"
                aria-label=${`Delete thread ${displayName}`}
                @click=${(e)=>{
            e.stopPropagation();
            this._openMenuId = null;
            this._confirmingDeleteId = thread.id;
        }}
              >
                ${iconDelete}<span>Delete</span>
              </button>
            </div>` : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nothing"]}
      </li>
    `;
    }
    _renderFetchMore() {
        if (hasErrorMessage(this.fetchMoreError)) return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
        <div class="fetch-more-error" part="fetch-more-error" role="alert">
          Couldn't load more —
          <button
            class="row-action"
            part="fetch-more-retry"
            @click=${()=>this._emit("retry", {
                scope: "fetch-more"
            })}
          >
            retry
          </button>
        </div>
      `;
        if (this.fetchingMore) return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
        <div class="state" part="fetching-more" aria-busy="true">Loading more…</div>
      `;
        if (this.hasMore) return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
        <button
          class="load-more"
          part="load-more"
          @click=${()=>this._emit("load-more", {})}
        >
          Load more
        </button>
      `;
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nothing"];
    }
    _renderMemories() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
      <div class="memories" part="memories" ?hidden=${!this._hasMemories}>
        <slot
          name="memories"
          @slotchange=${(e)=>{
            this._hasMemories = e.target.assignedElements().length > 0;
        }}
        ></slot>
      </div>
    `;
    }
    _renderFooter() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
      <div class="footer" part="footer" ?hidden=${!this._hasFooter}>
        <slot
          name="footer"
          @slotchange=${(e)=>{
            this._hasFooter = e.target.assignedElements().length > 0;
        }}
        ></slot>
      </div>
    `;
    }
    /**
	* Confirm-delete dialog, rendered as a native `<dialog>` that is ALWAYS
	* present in the shadow DOM so `updated()` can drive `showModal()`/`close()`
	* against it. Opening with `showModal()` puts it in the browser TOP LAYER, so
	* it can never be painted under other UI — the previous CSS-positioned overlay
	* was trapped in the drawer host's stacking context and appeared under the
	* chat's welcome view (ENT-1051). The `::backdrop` pseudo-element (styled in
	* styles.ts) provides the scrim natively.
	*
	* The actionable content (message + Cancel/Delete, bound to the captured id)
	* renders only while confirming, so a closed dialog holds nothing stale.
	* Native dismissal is wired via `@cancel` (Escape) and a backdrop-click check.
	*/ _renderConfirmDialog() {
        const id = this._confirmingDeleteId;
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
      <dialog
        class="dialog"
        part="confirm-dialog"
        role="alertdialog"
        aria-label="Confirm delete"
        data-testid="drawer-confirm-delete"
        @cancel=${(event)=>{
            event.preventDefault();
            this._confirmingDeleteId = null;
        }}
        @click=${(event)=>{
            if (event.target === event.currentTarget) this._confirmingDeleteId = null;
        }}
      >
        ${id !== null ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"]`
                <p>Delete this thread? This cannot be undone.</p>
                <div class="dialog-actions">
                  <button
                    class="row-action"
                    part="confirm-cancel"
                    @click=${()=>this._confirmingDeleteId = null}
                  >
                    Cancel
                  </button>
                  <button
                    class="primary"
                    part="confirm-delete"
                    @click=${()=>{
            this._confirmingDeleteId = null;
            this._emit("delete", {
                threadId: id
            });
        }}
                  >
                    Delete
                  </button>
                </div>
              ` : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2d$html$2f$development$2f$lit$2d$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nothing"]}
      </dialog>
    `;
    }
};
;
}),
"[project]/frontend/node_modules/@copilotkit/web-components/dist/threads-drawer/define.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defineCopilotKitThreadsDrawer",
    ()=>defineCopilotKitThreadsDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$web$2d$components$2f$dist$2f$threads$2d$drawer$2f$copilotkit$2d$threads$2d$drawer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/web-components/dist/threads-drawer/copilotkit-threads-drawer.mjs [app-client] (ecmascript)");
;
//#region src/threads-drawer/define.ts
/**
* Registers the `<copilotkit-threads-drawer>` custom element. Idempotent — safe to call
* multiple times (e.g. from several framework wrappers in the same page); a
* second registration of the same tag is a no-op.
*/ function defineCopilotKitThreadsDrawer() {
    if (typeof customElements !== "undefined" && !customElements.get(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$web$2d$components$2f$dist$2f$threads$2d$drawer$2f$copilotkit$2d$threads$2d$drawer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COPILOTKIT_THREADS_DRAWER_TAG"])) customElements.define(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$web$2d$components$2f$dist$2f$threads$2d$drawer$2f$copilotkit$2d$threads$2d$drawer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COPILOTKIT_THREADS_DRAWER_TAG"], __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$web$2d$components$2f$dist$2f$threads$2d$drawer$2f$copilotkit$2d$threads$2d$drawer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopilotKitThreadsDrawer"]);
}
;
}),
"[project]/frontend/node_modules/@copilotkit/web-components/dist/threads-drawer/generated-tokens.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GENERATED_DRAWER_TOKEN_DEFAULTS",
    ()=>GENERATED_DRAWER_TOKEN_DEFAULTS
]);
//#region src/threads-drawer/generated-tokens.ts
/**
* GENERATED FILE — DO NOT EDIT BY HAND.
*
* Bundled default values for the drawer's design tokens, derived at build time
* from the canonical react-core theme (`packages/react-core/src/v2/styles/globals.css`)
* by `scripts/generate-tokens.ts`. Run `pnpm run gen:tokens` to regenerate.
*
* The drawer's shadow-DOM CSS references these as fallbacks, e.g.
* `var(--cpk-drawer-bg, <built default>)`, so consumers can override every
* token while the built-in skin stays in sync with react-core.
*/ const GENERATED_DRAWER_TOKEN_DEFAULTS = {
    bg: "oklch(1 0 0)",
    fg: "oklch(0.145 0 0)",
    surface: "oklch(1 0 0)",
    "surface-fg": "oklch(0.145 0 0)",
    muted: "oklch(0.97 0 0)",
    "muted-fg": "oklch(0.556 0 0)",
    accent: "oklch(0.97 0 0)",
    "accent-fg": "oklch(0.205 0 0)",
    primary: "oklch(0.205 0 0)",
    "primary-fg": "oklch(0.985 0 0)",
    danger: "oklch(0.577 0.245 27.325)",
    border: "oklch(0.922 0 0)",
    ring: "oklch(0.708 0 0)",
    radius: "0.625rem"
};
;
}),
"[project]/frontend/node_modules/@copilotkit/web-components/dist/threads-drawer/index.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$web$2d$components$2f$dist$2f$threads$2d$drawer$2f$generated$2d$tokens$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/web-components/dist/threads-drawer/generated-tokens.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$web$2d$components$2f$dist$2f$threads$2d$drawer$2f$styles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/web-components/dist/threads-drawer/styles.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$web$2d$components$2f$dist$2f$threads$2d$drawer$2f$copilotkit$2d$threads$2d$drawer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/web-components/dist/threads-drawer/copilotkit-threads-drawer.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$web$2d$components$2f$dist$2f$threads$2d$drawer$2f$define$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/web-components/dist/threads-drawer/define.mjs [app-client] (ecmascript)");
;
;
;
;
;
}),
"[project]/frontend/node_modules/@copilotkit/web-components/dist/threads-drawer/styles.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "drawerStyles",
    ()=>drawerStyles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$web$2d$components$2f$dist$2f$threads$2d$drawer$2f$generated$2d$tokens$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@copilotkit/web-components/dist/threads-drawer/generated-tokens.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lit$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lit/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$lit$2f$reactive$2d$element$2f$development$2f$css$2d$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@lit/reactive-element/development/css-tag.js [app-client] (ecmascript)");
;
;
//#region src/threads-drawer/styles.ts
/**
* Wraps a generated token default value so it can be safely interpolated into a
* lit `css` template. Values come from the checked-in generated tokens file
* (derived from react-core), never from user input, so `unsafeCSS` is safe
* here.
*/ const tok = (value)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$lit$2f$reactive$2d$element$2f$development$2f$css$2d$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unsafeCSS"])(value);
const T = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$copilotkit$2f$web$2d$components$2f$dist$2f$threads$2d$drawer$2f$generated$2d$tokens$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GENERATED_DRAWER_TOKEN_DEFAULTS"];
/**
* Self-contained shadow-DOM styles for `<copilotkit-threads-drawer>`.
*
* Authoring rules baked in here:
*  - Every visual value is a `var(--cpk-drawer-<token>, <built default>)`. The
*    built defaults come from {@link GENERATED_DRAWER_TOKEN_DEFAULTS}, derived
*    from react-core's canonical theme at build time (anti-drift). Consumers
*    override by setting `--cpk-drawer-*` from the light DOM — CSS custom
*    properties pierce the shadow boundary by design.
*  - Inherited properties (font, color, line-height) are RE-PINNED on `:host`
*    so a hostile host stylesheet (`all: unset`, `* { ... !important }`,
*    Tailwind preflight) cannot leak into or strip styling from the element.
*  - Structural nodes expose `::part(...)` hooks for fine-grained theming.
*
* Token fallbacks are interpolated as literals (not runtime-read) so the CSS is
* static and ships compiled.
*/ const drawerStyles = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$lit$2f$reactive$2d$element$2f$development$2f$css$2d$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["css"]`
  :host {
    /* Re-pin inheritable properties to close inheritance leaks from hostile
       host CSS. These are the only properties that cross the shadow boundary
       via inheritance, so we hard-set them at the root. */
    all: initial;
    display: block;
    height: 100%;
    box-sizing: border-box;
    font-family: var(
      --cpk-drawer-font-family,
      ui-sans-serif,
      system-ui,
      sans-serif
    );
    font-size: var(--cpk-drawer-font-size, 14px);
    line-height: var(--cpk-drawer-line-height, 1.4);
    color: var(--cpk-drawer-fg, var(--foreground, ${tok(T.fg)}));

    /* Three-level token resolution, highest priority first:
       1. explicit per-token override (--cpk-drawer-*),
       2. the host app's theme variable (--background/--card/… — the standard
          react-core/shadcn names), so the drawer follows the host's light/dark
          theme by inheritance (custom properties are NOT reset by all:initial),
       3. the built-in light default derived from react-core at build time, so a
          host with no theme still renders correctly (self-contained). */
    --_bg: var(--cpk-drawer-bg, var(--background, ${tok(T.bg)}));
    --_surface: var(--cpk-drawer-surface, var(--card, ${tok(T.surface)}));
    --_surface-fg: var(
      --cpk-drawer-surface-fg,
      var(--card-foreground, ${tok(T["surface-fg"])})
    );
    --_muted: var(--cpk-drawer-muted, var(--muted, ${tok(T.muted)}));
    --_muted-fg: var(
      --cpk-drawer-muted-fg,
      var(--muted-foreground, ${tok(T["muted-fg"])})
    );
    --_accent: var(--cpk-drawer-accent, var(--accent, ${tok(T.accent)}));
    --_accent-fg: var(
      --cpk-drawer-accent-fg,
      var(--accent-foreground, ${tok(T["accent-fg"])})
    );
    --_primary: var(--cpk-drawer-primary, var(--primary, ${tok(T.primary)}));
    --_primary-fg: var(
      --cpk-drawer-primary-fg,
      var(--primary-foreground, ${tok(T["primary-fg"])})
    );
    --_danger: var(--cpk-drawer-danger, var(--destructive, ${tok(T.danger)}));
    --_border: var(--cpk-drawer-border, var(--border, ${tok(T.border)}));
    --_ring: var(--cpk-drawer-ring, var(--ring, ${tok(T.ring)}));
    --_indicator: var(--cpk-drawer-indicator, #5b94e4);
    /* Cap the corner radius at 4px (per designer) — themeable but never larger. */
    --_radius: min(
      var(--cpk-drawer-radius, var(--radius, ${tok(T.radius)})),
      4px
    );
    --_width: var(--cpk-drawer-width, 320px);
  }

  :host([hidden]) {
    display: none;
  }

  * {
    box-sizing: border-box;
  }

  .root {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: var(--_width);
    background: var(--_bg);
    border-right: 1px solid var(--_border);
    overflow: hidden;
    transition: width 0.2s ease;
    /* The confirm-delete dialog no longer needs a positioning context here: it
       is a native <dialog> opened with showModal(), which renders in the
       browser top layer independent of any stacking context (ENT-1051). No
       other direct child of .root is absolutely positioned (the filter and
       row-action popovers anchor to their own positioned ancestors), so .root
       stays static. The mobile path establishes its own context via
       position:fixed. */
  }

  /* Mobile: off-canvas overlay (modal pattern). */
  .root.mobile {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 1000;
    width: min(var(--_width), 85vw);
    transform: translateX(-100%);
    transition: transform 0.2s ease;
    box-shadow: 0 0 0 100vmax transparent;
  }

  .root.mobile.open {
    transform: translateX(0);
  }

  /* Desktop collapsed: the panel is replaced by the floating cluster, so remove
     it from the layout entirely. The host reclaims the reserved column via the
     --cpk-drawer-reserved-width:0px override the element sets on collapse. */
  .root.collapsed {
    display: none;
  }

  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.4);
    border: 0;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }

  /* Floating launcher cluster (Figma "closed" mockup): a rounded surface card
     holding the sidebar toggle + a "New Conversation" (+) icon button. Rendered
     by the element itself in the mobile-closed AND desktop-collapsed states so
     there is always a way to reopen/expand — and to start a new conversation —
     with no host wiring. */
  .launcher-cluster {
    position: fixed;
    z-index: 998;
    /* Position is themeable so a host can line the cluster up with its own
       header controls (e.g. vertically centering it on a toggle group). */
    top: var(--cpk-drawer-launcher-top, 24px);
    left: var(--cpk-drawer-launcher-left, 24px);
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 6px;
    border-radius: var(--_radius);
    border: 1px solid var(--_border);
    background: var(--_surface);
    color: var(--_surface-fg);
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.12);
  }

  .launcher {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 6px;
    border: 0;
    border-radius: calc(var(--_radius) - 3px);
    background: transparent;
    color: var(--_surface-fg);
    cursor: pointer;
    font: inherit;
  }

  .launcher:hover,
  .launcher:focus-visible {
    background: var(--_muted);
  }

  .launcher .icon {
    width: 18px;
    height: 18px;
    display: block;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
  }

  /* The header is hidden until a consumer projects slot="header" content
     (the redesign has no built-in header controls). Mirrors the memories/footer
     gating so an empty padded header bar never renders above the list. */
  .header[hidden] {
    display: none;
  }

  /* Optional consumer projection surface. When a consumer projects into
     slot="header" it fills the header row. */
  .header slot[name="header"] {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  .icon-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 6px;
    border: 0;
    border-radius: var(--_radius);
    background: transparent;
    color: var(--_muted-fg);
    cursor: pointer;
    font: inherit;
  }

  /* "Filter applied" indicator dot at the funnel's bottom-right (Figma archived
     view). Shown only when a non-default filter is active. */
  .filter-dot {
    position: absolute;
    right: 3px;
    bottom: 4px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--_indicator);
    pointer-events: none;
  }

  .icon-btn:hover,
  .icon-btn:focus-visible {
    background: var(--_muted);
    color: inherit;
  }

  .icon-btn[aria-pressed="true"] {
    background: var(--_muted);
    color: inherit;
  }

  .icon {
    width: 20px;
    height: 20px;
    display: block;
  }

  .new-conversation {
    display: flex;
    align-items: center;
    gap: 12px;
    /* No top margin by default: the header bar (the collapse toggle on desktop,
       the close button on mobile-open) sits above this row and supplies the top
       spacing — the header-hidden case re-adds it below. Horizontal geometry
       matches the list rows: the hover background insets 12px (like a row's
       highlight) and, with 10px inner padding, the icon's left edge lands at
       22px — the same x as the thread names below (list padding 12 + row
       padding 10). */
    margin: 0 12px;
    padding: 8px 10px;
    border: 0;
    border-radius: var(--_radius);
    background: transparent;
    color: inherit;
    cursor: pointer;
    font: inherit;
    text-align: left;
  }

  /* Only when the header bar is fully hidden (collapsible=false AND no projected
     header content) is this row the first element — give it the top spacing the
     header would otherwise supply. */
  .header[hidden] + .new-conversation {
    margin-top: 12px;
  }

  .new-conversation:hover,
  .new-conversation:focus-visible {
    background: var(--_muted);
  }

  .new-conversation .icon {
    width: 16px;
    height: 16px;
  }

  .section-heading {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* Match the list rows' content edge: "Recent Conversations" lands at 22px
       (margin 12 + padding 10), aligned with the thread names and the New
       Conversation icon; the funnel sits 22px from the right, over the kebabs. */
    padding: 8px 10px;
    margin: 0 12px;
  }

  .section-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--_muted-fg);
    text-transform: none;
  }

  .icon-btn.small {
    width: 24px;
    height: 24px;
    padding: 4px;
  }

  .icon-btn.small .icon {
    width: 16px;
    height: 16px;
  }

  .filter-popover {
    position: absolute;
    right: 0;
    top: calc(100% + 4px);
    z-index: 15;
    display: flex;
    flex-direction: column;
    min-width: 120px;
    padding: 4px;
    background: var(--_surface);
    color: var(--_surface-fg);
    border: 1px solid var(--_border);
    border-radius: var(--_radius);
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.18);
  }

  .filter-opt {
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font: inherit;
    text-align: left;
    padding: 6px 8px;
    border-radius: 4px;
  }

  .filter-opt:hover,
  .filter-opt:focus-visible {
    background: var(--_muted);
  }

  .filter-opt[aria-pressed="true"] {
    font-weight: 600;
  }

  .list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 8px 12px;
    margin: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: var(--_radius);
    cursor: pointer;
    background: transparent;
    color: inherit;
    border: 1px solid transparent;
    opacity: 0;
    transform: translateY(4px);
    animation: cpk-drawer-row-in 0.18s ease forwards;
    /* Positioned so the hovered row can be lifted above later rows (below). */
    position: relative;
  }

  /* Lift the interacted row above later rows so its kebab popover (which paints
     inside the row's own transform stacking context) is not clipped by / drawn
     under the rows below it. */
  .row:hover,
  .row:focus-within,
  .row.menu-open {
    z-index: 3;
  }

  /* While a kebab menu is open, the popover only covers part of the rows it
     overlaps, so the rest of the list would still respond to hover — revealing
     other rows' kebabs and (under a host \`::part(row):hover\` theme) painting a
     hover background "through"/around the open menu. Freeze pointer events on
     every OTHER row so the menu reads as a single focused surface. The owner
     row (\`.menu-open\`) and its popover stay interactive, and a pointerdown that
     lands on a frozen row still reaches the document handler that closes the
     menu, so click-away dismissal is preserved. */
  .list.menu-open .row:not(.menu-open) {
    pointer-events: none;
  }

  @keyframes cpk-drawer-row-in {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .row.active {
    background: var(--_accent);
    color: var(--_accent-fg);
    /* No border on the selected row — the background change alone marks it
       (per designer). The base row keeps its 1px transparent border so the
       layout stays stable. */
  }

  .row.archived .row-name {
    color: var(--_muted-fg);
    font-style: italic;
  }

  .row-name {
    flex: 1;
    min-width: 0;
  }

  .row-name-text {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .row-name.placeholder {
    color: var(--_muted-fg);
    font-style: italic;
  }

  .row-name.revealed {
    animation: cpk-drawer-name-reveal 0.3s ease;
  }

  @keyframes cpk-drawer-name-reveal {
    from {
      opacity: 0.4;
    }
    to {
      opacity: 1;
    }
  }

  .row-action {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    border: 0;
    background: transparent;
    color: var(--_muted-fg);
    cursor: pointer;
    font: inherit;
    padding: 5px;
    border-radius: 4px;
  }

  .row-action:hover,
  .row-action:focus-visible {
    background: var(--_muted);
    color: inherit;
  }

  .row-action-icon {
    width: 15px;
    height: 15px;
    display: block;
  }

  /* Per-row kebab trigger: hidden at rest, revealed when the row is hovered,
     focused (keyboard), active (selected), or its menu is open. */
  .row-menu {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 4px;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: var(--_muted-fg);
    cursor: pointer;
    font: inherit;
    opacity: 0;
  }

  .row:hover .row-menu,
  .row:focus-within .row-menu,
  .row.active .row-menu,
  .row-menu[aria-expanded="true"] {
    opacity: 1;
  }

  .row-menu:hover,
  .row-menu:focus-visible {
    background: var(--_muted);
    color: inherit;
  }

  .row-menu .icon {
    width: 16px;
    height: 16px;
  }

  .row-menu-popover {
    position: absolute;
    right: 8px;
    top: calc(100% - 4px);
    z-index: 16;
    display: flex;
    flex-direction: column;
    min-width: 140px;
    padding: 4px;
    background: var(--_surface);
    color: var(--_surface-fg);
    border: 1px solid var(--_border);
    border-radius: var(--_radius);
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.18);
  }

  /* Rows in the lower portion of the list open their kebab menu UPWARD so it is
     not clipped by the list's overflow scroll box (.list is overflow-y:auto,
     which also clips the x-axis). Anchoring to the button's top edge via
     \`bottom\` keeps the popover inside the list's visible area for bottom rows. */
  .row.menu-up .row-menu-popover {
    top: auto;
    bottom: calc(100% - 4px);
  }

  .row-menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font: inherit;
    text-align: left;
    padding: 6px 8px;
    border-radius: 4px;
  }

  .row-menu-item:hover,
  .row-menu-item:focus-visible {
    background: var(--_muted);
  }

  .row-menu-item.danger:hover,
  .row-menu-item.danger:focus-visible {
    color: var(--_danger);
  }

  .row-menu-item .row-action-icon,
  .row-menu-item .icon {
    width: 15px;
    height: 15px;
  }

  button.primary {
    background: var(--_primary);
    color: var(--_primary-fg);
    border: 0;
    border-radius: var(--_radius);
    padding: 8px 12px;
    cursor: pointer;
    font: inherit;
  }

  .state {
    padding: 24px 16px;
    text-align: center;
    color: var(--_muted-fg);
  }

  .state.error {
    color: var(--_danger);
  }

  .fetch-more-error {
    padding: 8px 12px;
    text-align: center;
    color: var(--_danger);
    font-size: 0.9em;
  }

  .load-more {
    display: block;
    width: 100%;
    padding: 8px 12px;
    background: none;
    border: none;
    color: var(--_muted-fg);
    font: inherit;
    font-size: 0.9em;
    cursor: pointer;
  }

  .load-more:hover,
  .load-more:focus-visible {
    color: var(--_surface-fg);
    background: var(--_muted);
  }

  .licensed {
    padding: 24px 16px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .memories {
    border-top: 1px solid var(--_border);
    padding: 8px 12px;
  }

  .memories[hidden] {
    display: none;
  }

  /* Confirm-delete dialog — a native <dialog> opened with showModal(). It lives
     in the browser TOP LAYER, so it can never be painted under other UI (the
     old CSS-positioned overlay was trapped in the drawer host's stacking
     context and appeared under the chat's welcome view — ENT-1051). The UA
     centers it in the viewport via margin:auto; we reset the UA chrome and
     apply the drawer's surface-card look. */
  .dialog {
    /* Top-layer (showModal) so it is never clipped, but centered over the DRAWER
       PANEL rather than the viewport: JS sets --confirm-cx/cy from the visible
       .root rect (falls back to viewport-center when unmeasured, e.g. jsdom).
       Width is capped to the drawer band so it reads as "inside the drawer". */
    margin: 0;
    position: fixed;
    left: var(--confirm-cx, 50%);
    top: var(--confirm-cy, 50%);
    transform: translate(-50%, -50%);
    border: 0;
    padding: 16px;
    width: max-content;
    max-width: min(80vw, calc(var(--_width) - 24px));
    background: var(--_surface);
    color: var(--_surface-fg);
    border-radius: var(--_radius);
  }

  /* Only lay out the card contents when open. A closed <dialog> is display:none
     via the UA stylesheet, and author display rules must not override that (or
     an empty box would leak), so the flex layout is scoped to [open]. */
  .dialog[open] {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }

  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .footer {
    border-top: 1px solid var(--_border);
    padding: 12px;
  }

  .footer[hidden] {
    display: none;
  }
`;
;
}),
]);

//# sourceMappingURL=19xk_%40copilotkit_0wporff._.js.map