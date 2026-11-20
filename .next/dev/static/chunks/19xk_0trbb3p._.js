(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/@braintree/sanitize-url/dist/constants.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BLANK_URL = exports.relativeFirstCharacters = exports.whitespaceEscapeCharsRegex = exports.urlSchemeRegex = exports.ctrlCharactersRegex = exports.htmlCtrlEntityRegex = exports.htmlEntitiesRegex = exports.invalidProtocolRegex = void 0;
exports.invalidProtocolRegex = /^([^\w]*)(javascript|data|vbscript)/im;
exports.htmlEntitiesRegex = /&#(\w+)(^\w|;)?/g;
exports.htmlCtrlEntityRegex = /&(newline|tab);/gi;
exports.ctrlCharactersRegex = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
exports.urlSchemeRegex = /^.+(:|&colon;)/gim;
exports.whitespaceEscapeCharsRegex = /(\\|%5[cC])((%(6[eE]|72|74))|[nrt])/g;
exports.relativeFirstCharacters = [
    ".",
    "/"
];
exports.BLANK_URL = "about:blank";
}),
"[project]/frontend/node_modules/@braintree/sanitize-url/dist/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sanitizeUrl = sanitizeUrl;
var constants_1 = __turbopack_context__.r("[project]/frontend/node_modules/@braintree/sanitize-url/dist/constants.js [app-client] (ecmascript)");
function isRelativeUrlWithoutProtocol(url) {
    return constants_1.relativeFirstCharacters.indexOf(url[0]) > -1;
}
function decodeHtmlCharacters(str) {
    var removedNullByte = str.replace(constants_1.ctrlCharactersRegex, "");
    return removedNullByte.replace(constants_1.htmlEntitiesRegex, function(match, dec) {
        return String.fromCharCode(dec);
    });
}
function isValidUrl(url) {
    return URL.canParse(url);
}
function decodeURI(uri) {
    try {
        return decodeURIComponent(uri);
    } catch (e) {
        // Ignoring error
        // It is possible that the URI contains a `%` not associated
        // with URI/URL-encoding.
        return uri;
    }
}
function sanitizeUrl(url) {
    if (!url) {
        return constants_1.BLANK_URL;
    }
    var charsToDecode;
    var decodedUrl = decodeURI(url.trim());
    do {
        decodedUrl = decodeHtmlCharacters(decodedUrl).replace(constants_1.htmlCtrlEntityRegex, "").replace(constants_1.ctrlCharactersRegex, "").replace(constants_1.whitespaceEscapeCharsRegex, "").trim();
        decodedUrl = decodeURI(decodedUrl);
        charsToDecode = decodedUrl.match(constants_1.ctrlCharactersRegex) || decodedUrl.match(constants_1.htmlEntitiesRegex) || decodedUrl.match(constants_1.htmlCtrlEntityRegex) || decodedUrl.match(constants_1.whitespaceEscapeCharsRegex);
    }while (charsToDecode && charsToDecode.length > 0)
    var sanitizedUrl = decodedUrl;
    if (!sanitizedUrl) {
        return constants_1.BLANK_URL;
    }
    if (isRelativeUrlWithoutProtocol(sanitizedUrl)) {
        return sanitizedUrl;
    }
    // Remove any leading whitespace before checking the URL scheme
    var trimmedUrl = sanitizedUrl.trimStart();
    var urlSchemeParseResults = trimmedUrl.match(constants_1.urlSchemeRegex);
    if (!urlSchemeParseResults) {
        return sanitizedUrl;
    }
    var urlScheme = urlSchemeParseResults[0].toLowerCase().trim();
    if (constants_1.invalidProtocolRegex.test(urlScheme)) {
        return constants_1.BLANK_URL;
    }
    var backSanitized = trimmedUrl.replace(/\\/g, "/");
    // Handle special cases for mailto: and custom deep-link protocols
    if (urlScheme === "mailto:" || urlScheme.includes("://")) {
        return backSanitized;
    }
    // For http and https URLs, perform additional validation
    if (urlScheme === "http:" || urlScheme === "https:") {
        if (!isValidUrl(backSanitized)) {
            return constants_1.BLANK_URL;
        }
        var url_1 = new URL(backSanitized);
        url_1.protocol = url_1.protocol.toLowerCase();
        url_1.hostname = url_1.hostname.toLowerCase();
        return url_1.toString();
    }
    return backSanitized;
}
}),
"[project]/frontend/node_modules/d3-brush/src/brush.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "brushSelection",
    ()=>brushSelection,
    "brushX",
    ()=>brushX,
    "brushY",
    ()=>brushY,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$dispatch$2f$src$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dispatch$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-dispatch/src/dispatch.js [app-client] (ecmascript) <export default as dispatch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dragDisable$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript) <export default as dragDisable>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__yesdrag__as__dragEnable$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript) <export yesdrag as dragEnable>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$value$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolate$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/value.js [app-client] (ecmascript) <export default as interpolate>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/pointer.js [app-client] (ecmascript) <export default as pointer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interrupt$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/interrupt.js [app-client] (ecmascript) <export default as interrupt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-brush/src/constant.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$event$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-brush/src/event.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-brush/src/noevent.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
var MODE_DRAG = {
    name: "drag"
}, MODE_SPACE = {
    name: "space"
}, MODE_HANDLE = {
    name: "handle"
}, MODE_CENTER = {
    name: "center"
};
const { abs, max, min } = Math;
function number1(e) {
    return [
        +e[0],
        +e[1]
    ];
}
function number2(e) {
    return [
        number1(e[0]),
        number1(e[1])
    ];
}
var X = {
    name: "x",
    handles: [
        "w",
        "e"
    ].map(type),
    input: function(x, e) {
        return x == null ? null : [
            [
                +x[0],
                e[0][1]
            ],
            [
                +x[1],
                e[1][1]
            ]
        ];
    },
    output: function(xy) {
        return xy && [
            xy[0][0],
            xy[1][0]
        ];
    }
};
var Y = {
    name: "y",
    handles: [
        "n",
        "s"
    ].map(type),
    input: function(y, e) {
        return y == null ? null : [
            [
                e[0][0],
                +y[0]
            ],
            [
                e[1][0],
                +y[1]
            ]
        ];
    },
    output: function(xy) {
        return xy && [
            xy[0][1],
            xy[1][1]
        ];
    }
};
var XY = {
    name: "xy",
    handles: [
        "n",
        "w",
        "e",
        "s",
        "nw",
        "ne",
        "sw",
        "se"
    ].map(type),
    input: function(xy) {
        return xy == null ? null : number2(xy);
    },
    output: function(xy) {
        return xy;
    }
};
var cursors = {
    overlay: "crosshair",
    selection: "move",
    n: "ns-resize",
    e: "ew-resize",
    s: "ns-resize",
    w: "ew-resize",
    nw: "nwse-resize",
    ne: "nesw-resize",
    se: "nwse-resize",
    sw: "nesw-resize"
};
var flipX = {
    e: "w",
    w: "e",
    nw: "ne",
    ne: "nw",
    se: "sw",
    sw: "se"
};
var flipY = {
    n: "s",
    s: "n",
    nw: "sw",
    ne: "se",
    se: "ne",
    sw: "nw"
};
var signsX = {
    overlay: +1,
    selection: +1,
    n: null,
    e: +1,
    s: null,
    w: -1,
    nw: -1,
    ne: +1,
    se: +1,
    sw: -1
};
var signsY = {
    overlay: +1,
    selection: +1,
    n: -1,
    e: null,
    s: +1,
    w: null,
    nw: -1,
    ne: -1,
    se: +1,
    sw: +1
};
function type(t) {
    return {
        type: t
    };
}
// Ignore right-click, since that should open the context menu.
function defaultFilter(event) {
    return !event.ctrlKey && !event.button;
}
function defaultExtent() {
    var svg = this.ownerSVGElement || this;
    if (svg.hasAttribute("viewBox")) {
        svg = svg.viewBox.baseVal;
        return [
            [
                svg.x,
                svg.y
            ],
            [
                svg.x + svg.width,
                svg.y + svg.height
            ]
        ];
    }
    return [
        [
            0,
            0
        ],
        [
            svg.width.baseVal.value,
            svg.height.baseVal.value
        ]
    ];
}
function defaultTouchable() {
    return navigator.maxTouchPoints || "ontouchstart" in this;
}
// Like d3.local, but with the name “__brush” rather than auto-generated.
function local(node) {
    while(!node.__brush)if (!(node = node.parentNode)) return;
    return node.__brush;
}
function empty(extent) {
    return extent[0][0] === extent[1][0] || extent[0][1] === extent[1][1];
}
function brushSelection(node) {
    var state = node.__brush;
    return state ? state.dim.output(state.selection) : null;
}
function brushX() {
    return brush(X);
}
function brushY() {
    return brush(Y);
}
function __TURBOPACK__default__export__() {
    return brush(XY);
}
function brush(dim) {
    var extent = defaultExtent, filter = defaultFilter, touchable = defaultTouchable, keys = true, listeners = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$dispatch$2f$src$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dispatch$3e$__["dispatch"])("start", "brush", "end"), handleSize = 6, touchending;
    function brush(group) {
        var overlay = group.property("__brush", initialize).selectAll(".overlay").data([
            type("overlay")
        ]);
        overlay.enter().append("rect").attr("class", "overlay").attr("pointer-events", "all").attr("cursor", cursors.overlay).merge(overlay).each(function() {
            var extent = local(this).extent;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(this).attr("x", extent[0][0]).attr("y", extent[0][1]).attr("width", extent[1][0] - extent[0][0]).attr("height", extent[1][1] - extent[0][1]);
        });
        group.selectAll(".selection").data([
            type("selection")
        ]).enter().append("rect").attr("class", "selection").attr("cursor", cursors.selection).attr("fill", "#777").attr("fill-opacity", 0.3).attr("stroke", "#fff").attr("shape-rendering", "crispEdges");
        var handle = group.selectAll(".handle").data(dim.handles, function(d) {
            return d.type;
        });
        handle.exit().remove();
        handle.enter().append("rect").attr("class", function(d) {
            return "handle handle--" + d.type;
        }).attr("cursor", function(d) {
            return cursors[d.type];
        });
        group.each(redraw).attr("fill", "none").attr("pointer-events", "all").on("mousedown.brush", started).filter(touchable).on("touchstart.brush", started).on("touchmove.brush", touchmoved).on("touchend.brush touchcancel.brush", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }
    brush.move = function(group, selection, event) {
        if (group.tween) {
            group.on("start.brush", function(event) {
                emitter(this, arguments).beforestart().start(event);
            }).on("interrupt.brush end.brush", function(event) {
                emitter(this, arguments).end(event);
            }).tween("brush", function() {
                var that = this, state = that.__brush, emit = emitter(that, arguments), selection0 = state.selection, selection1 = dim.input(typeof selection === "function" ? selection.apply(this, arguments) : selection, state.extent), i = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$value$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolate$3e$__["interpolate"])(selection0, selection1);
                function tween(t) {
                    state.selection = t === 1 && selection1 === null ? null : i(t);
                    redraw.call(that);
                    emit.brush();
                }
                return selection0 !== null && selection1 !== null ? tween : tween(1);
            });
        } else {
            group.each(function() {
                var that = this, args = arguments, state = that.__brush, selection1 = dim.input(typeof selection === "function" ? selection.apply(that, args) : selection, state.extent), emit = emitter(that, args).beforestart();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interrupt$3e$__["interrupt"])(that);
                state.selection = selection1 === null ? null : selection1;
                redraw.call(that);
                emit.start(event).brush(event).end(event);
            });
        }
    };
    brush.clear = function(group, event) {
        brush.move(group, null, event);
    };
    function redraw() {
        var group = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(this), selection = local(this).selection;
        if (selection) {
            group.selectAll(".selection").style("display", null).attr("x", selection[0][0]).attr("y", selection[0][1]).attr("width", selection[1][0] - selection[0][0]).attr("height", selection[1][1] - selection[0][1]);
            group.selectAll(".handle").style("display", null).attr("x", function(d) {
                return d.type[d.type.length - 1] === "e" ? selection[1][0] - handleSize / 2 : selection[0][0] - handleSize / 2;
            }).attr("y", function(d) {
                return d.type[0] === "s" ? selection[1][1] - handleSize / 2 : selection[0][1] - handleSize / 2;
            }).attr("width", function(d) {
                return d.type === "n" || d.type === "s" ? selection[1][0] - selection[0][0] + handleSize : handleSize;
            }).attr("height", function(d) {
                return d.type === "e" || d.type === "w" ? selection[1][1] - selection[0][1] + handleSize : handleSize;
            });
        } else {
            group.selectAll(".selection,.handle").style("display", "none").attr("x", null).attr("y", null).attr("width", null).attr("height", null);
        }
    }
    function emitter(that, args, clean) {
        var emit = that.__brush.emitter;
        return emit && (!clean || !emit.clean) ? emit : new Emitter(that, args, clean);
    }
    function Emitter(that, args, clean) {
        this.that = that;
        this.args = args;
        this.state = that.__brush;
        this.active = 0;
        this.clean = clean;
    }
    Emitter.prototype = {
        beforestart: function() {
            if (++this.active === 1) this.state.emitter = this, this.starting = true;
            return this;
        },
        start: function(event, mode) {
            if (this.starting) this.starting = false, this.emit("start", event, mode);
            else this.emit("brush", event);
            return this;
        },
        brush: function(event, mode) {
            this.emit("brush", event, mode);
            return this;
        },
        end: function(event, mode) {
            if (--this.active === 0) delete this.state.emitter, this.emit("end", event, mode);
            return this;
        },
        emit: function(type, event, mode) {
            var d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(this.that).datum();
            listeners.call(type, this.that, new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$event$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](type, {
                sourceEvent: event,
                target: brush,
                selection: dim.output(this.state.selection),
                mode,
                dispatch: listeners
            }), d);
        }
    };
    function started(event) {
        if (touchending && !event.touches) return;
        if (!filter.apply(this, arguments)) return;
        var that = this, type = event.target.__data__.type, mode = (keys && event.metaKey ? type = "overlay" : type) === "selection" ? MODE_DRAG : keys && event.altKey ? MODE_CENTER : MODE_HANDLE, signX = dim === Y ? null : signsX[type], signY = dim === X ? null : signsY[type], state = local(that), extent = state.extent, selection = state.selection, W = extent[0][0], w0, w1, N = extent[0][1], n0, n1, E = extent[1][0], e0, e1, S = extent[1][1], s0, s1, dx = 0, dy = 0, moving, shifting = signX && signY && keys && event.shiftKey, lockX, lockY, points = Array.from(event.touches || [
            event
        ], (t)=>{
            const i = t.identifier;
            t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(t, that);
            t.point0 = t.slice();
            t.identifier = i;
            return t;
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interrupt$3e$__["interrupt"])(that);
        var emit = emitter(that, arguments, true).beforestart();
        if (type === "overlay") {
            if (selection) moving = true;
            const pts = [
                points[0],
                points[1] || points[0]
            ];
            state.selection = selection = [
                [
                    w0 = dim === Y ? W : min(pts[0][0], pts[1][0]),
                    n0 = dim === X ? N : min(pts[0][1], pts[1][1])
                ],
                [
                    e0 = dim === Y ? E : max(pts[0][0], pts[1][0]),
                    s0 = dim === X ? S : max(pts[0][1], pts[1][1])
                ]
            ];
            if (points.length > 1) move(event);
        } else {
            w0 = selection[0][0];
            n0 = selection[0][1];
            e0 = selection[1][0];
            s0 = selection[1][1];
        }
        w1 = w0;
        n1 = n0;
        e1 = e0;
        s1 = s0;
        var group = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(that).attr("pointer-events", "none");
        var overlay = group.selectAll(".overlay").attr("cursor", cursors[type]);
        if (event.touches) {
            emit.moved = moved;
            emit.ended = ended;
        } else {
            var view = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(event.view).on("mousemove.brush", moved, true).on("mouseup.brush", ended, true);
            if (keys) view.on("keydown.brush", keydowned, true).on("keyup.brush", keyupped, true);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dragDisable$3e$__["dragDisable"])(event.view);
        }
        redraw.call(that);
        emit.start(event, mode.name);
        function moved(event) {
            for (const p of event.changedTouches || [
                event
            ]){
                for (const d of points)if (d.identifier === p.identifier) d.cur = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(p, that);
            }
            if (shifting && !lockX && !lockY && points.length === 1) {
                const point = points[0];
                if (abs(point.cur[0] - point[0]) > abs(point.cur[1] - point[1])) lockY = true;
                else lockX = true;
            }
            for (const point of points)if (point.cur) point[0] = point.cur[0], point[1] = point.cur[1];
            moving = true;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
            move(event);
        }
        function move(event) {
            const point = points[0], point0 = point.point0;
            var t;
            dx = point[0] - point0[0];
            dy = point[1] - point0[1];
            switch(mode){
                case MODE_SPACE:
                case MODE_DRAG:
                    {
                        if (signX) dx = max(W - w0, min(E - e0, dx)), w1 = w0 + dx, e1 = e0 + dx;
                        if (signY) dy = max(N - n0, min(S - s0, dy)), n1 = n0 + dy, s1 = s0 + dy;
                        break;
                    }
                case MODE_HANDLE:
                    {
                        if (points[1]) {
                            if (signX) w1 = max(W, min(E, points[0][0])), e1 = max(W, min(E, points[1][0])), signX = 1;
                            if (signY) n1 = max(N, min(S, points[0][1])), s1 = max(N, min(S, points[1][1])), signY = 1;
                        } else {
                            if (signX < 0) dx = max(W - w0, min(E - w0, dx)), w1 = w0 + dx, e1 = e0;
                            else if (signX > 0) dx = max(W - e0, min(E - e0, dx)), w1 = w0, e1 = e0 + dx;
                            if (signY < 0) dy = max(N - n0, min(S - n0, dy)), n1 = n0 + dy, s1 = s0;
                            else if (signY > 0) dy = max(N - s0, min(S - s0, dy)), n1 = n0, s1 = s0 + dy;
                        }
                        break;
                    }
                case MODE_CENTER:
                    {
                        if (signX) w1 = max(W, min(E, w0 - dx * signX)), e1 = max(W, min(E, e0 + dx * signX));
                        if (signY) n1 = max(N, min(S, n0 - dy * signY)), s1 = max(N, min(S, s0 + dy * signY));
                        break;
                    }
            }
            if (e1 < w1) {
                signX *= -1;
                t = w0, w0 = e0, e0 = t;
                t = w1, w1 = e1, e1 = t;
                if (type in flipX) overlay.attr("cursor", cursors[type = flipX[type]]);
            }
            if (s1 < n1) {
                signY *= -1;
                t = n0, n0 = s0, s0 = t;
                t = n1, n1 = s1, s1 = t;
                if (type in flipY) overlay.attr("cursor", cursors[type = flipY[type]]);
            }
            if (state.selection) selection = state.selection; // May be set by brush.move!
            if (lockX) w1 = selection[0][0], e1 = selection[1][0];
            if (lockY) n1 = selection[0][1], s1 = selection[1][1];
            if (selection[0][0] !== w1 || selection[0][1] !== n1 || selection[1][0] !== e1 || selection[1][1] !== s1) {
                state.selection = [
                    [
                        w1,
                        n1
                    ],
                    [
                        e1,
                        s1
                    ]
                ];
                redraw.call(that);
                emit.brush(event, mode.name);
            }
        }
        function ended(event) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nopropagation"])(event);
            if (event.touches) {
                if (event.touches.length) return;
                if (touchending) clearTimeout(touchending);
                touchending = setTimeout(function() {
                    touchending = null;
                }, 500); // Ghost clicks are delayed!
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__yesdrag__as__dragEnable$3e$__["dragEnable"])(event.view, moving);
                view.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
            }
            group.attr("pointer-events", "all");
            overlay.attr("cursor", cursors.overlay);
            if (state.selection) selection = state.selection; // May be set by brush.move (on start)!
            if (empty(selection)) state.selection = null, redraw.call(that);
            emit.end(event, mode.name);
        }
        function keydowned(event) {
            switch(event.keyCode){
                case 16:
                    {
                        shifting = signX && signY;
                        break;
                    }
                case 18:
                    {
                        if (mode === MODE_HANDLE) {
                            if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
                            if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
                            mode = MODE_CENTER;
                            move(event);
                        }
                        break;
                    }
                case 32:
                    {
                        if (mode === MODE_HANDLE || mode === MODE_CENTER) {
                            if (signX < 0) e0 = e1 - dx;
                            else if (signX > 0) w0 = w1 - dx;
                            if (signY < 0) s0 = s1 - dy;
                            else if (signY > 0) n0 = n1 - dy;
                            mode = MODE_SPACE;
                            overlay.attr("cursor", cursors.selection);
                            move(event);
                        }
                        break;
                    }
                default:
                    return;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
        }
        function keyupped(event) {
            switch(event.keyCode){
                case 16:
                    {
                        if (shifting) {
                            lockX = lockY = shifting = false;
                            move(event);
                        }
                        break;
                    }
                case 18:
                    {
                        if (mode === MODE_CENTER) {
                            if (signX < 0) e0 = e1;
                            else if (signX > 0) w0 = w1;
                            if (signY < 0) s0 = s1;
                            else if (signY > 0) n0 = n1;
                            mode = MODE_HANDLE;
                            move(event);
                        }
                        break;
                    }
                case 32:
                    {
                        if (mode === MODE_SPACE) {
                            if (event.altKey) {
                                if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
                                if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
                                mode = MODE_CENTER;
                            } else {
                                if (signX < 0) e0 = e1;
                                else if (signX > 0) w0 = w1;
                                if (signY < 0) s0 = s1;
                                else if (signY > 0) n0 = n1;
                                mode = MODE_HANDLE;
                            }
                            overlay.attr("cursor", cursors[type]);
                            move(event);
                        }
                        break;
                    }
                default:
                    return;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
        }
    }
    function touchmoved(event) {
        emitter(this, arguments).moved(event);
    }
    function touchended(event) {
        emitter(this, arguments).ended(event);
    }
    function initialize() {
        var state = this.__brush || {
            selection: null
        };
        state.extent = number2(extent.apply(this, arguments));
        state.dim = dim;
        return state;
    }
    brush.extent = function(_) {
        return arguments.length ? (extent = typeof _ === "function" ? _ : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(number2(_)), brush) : extent;
    };
    brush.filter = function(_) {
        return arguments.length ? (filter = typeof _ === "function" ? _ : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(!!_), brush) : filter;
    };
    brush.touchable = function(_) {
        return arguments.length ? (touchable = typeof _ === "function" ? _ : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(!!_), brush) : touchable;
    };
    brush.handleSize = function(_) {
        return arguments.length ? (handleSize = +_, brush) : handleSize;
    };
    brush.keyModifiers = function(_) {
        return arguments.length ? (keys = !!_, brush) : keys;
    };
    brush.on = function() {
        var value = listeners.on.apply(listeners, arguments);
        return value === listeners ? brush : value;
    };
    return brush;
}
}),
"[project]/frontend/node_modules/d3-brush/src/constant.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = (x)=>()=>x;
}),
"[project]/frontend/node_modules/d3-brush/src/event.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BrushEvent
]);
function BrushEvent(type, { sourceEvent, target, selection, mode, dispatch }) {
    Object.defineProperties(this, {
        type: {
            value: type,
            enumerable: true,
            configurable: true
        },
        sourceEvent: {
            value: sourceEvent,
            enumerable: true,
            configurable: true
        },
        target: {
            value: target,
            enumerable: true,
            configurable: true
        },
        selection: {
            value: selection,
            enumerable: true,
            configurable: true
        },
        mode: {
            value: mode,
            enumerable: true,
            configurable: true
        },
        _: {
            value: dispatch
        }
    });
}
}),
"[project]/frontend/node_modules/d3-brush/src/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$brush$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-brush/src/brush.js [app-client] (ecmascript)");
;
}),
"[project]/frontend/node_modules/d3-brush/src/noevent.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "nopropagation",
    ()=>nopropagation
]);
function nopropagation(event) {
    event.stopImmediatePropagation();
}
function __TURBOPACK__default__export__(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
}
}),
"[project]/frontend/node_modules/d3-color/src/color.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Color",
    ()=>Color,
    "Rgb",
    ()=>Rgb,
    "brighter",
    ()=>brighter,
    "darker",
    ()=>darker,
    "default",
    ()=>color,
    "hsl",
    ()=>hsl,
    "hslConvert",
    ()=>hslConvert,
    "rgb",
    ()=>rgb,
    "rgbConvert",
    ()=>rgbConvert
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$define$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-color/src/define.js [app-client] (ecmascript)");
;
function Color() {}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*", reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", reHex = /^#([0-9a-f]{3,8})$/, reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`), reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`), reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`), reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`), reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`), reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
};
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$define$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(Color, color, {
    copy (channels) {
        return Object.assign(new this.constructor, this, channels);
    },
    displayable () {
        return this.rgb().displayable();
    },
    hex: color_formatHex,
    formatHex: color_formatHex,
    formatHex8: color_formatHex8,
    formatHsl: color_formatHsl,
    formatRgb: color_formatRgb,
    toString: color_formatRgb
});
function color_formatHex() {
    return this.rgb().formatHex();
}
function color_formatHex8() {
    return this.rgb().formatHex8();
}
function color_formatHsl() {
    return hslConvert(this).formatHsl();
}
function color_formatRgb() {
    return this.rgb().formatRgb();
}
function color(format) {
    var m, l;
    format = (format + "").trim().toLowerCase();
    return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
     : l === 3 ? new Rgb(m >> 8 & 0xf | m >> 4 & 0xf0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf, 1) // #f00
     : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
     : l === 4 ? rgba(m >> 12 & 0xf | m >> 8 & 0xf0, m >> 8 & 0xf | m >> 4 & 0xf0, m >> 4 & 0xf | m & 0xf0, ((m & 0xf) << 4 | m & 0xf) / 0xff) // #f000
     : null) // invalid hex
     : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
     : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
     : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
     : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
     : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
     : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
     : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
     : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}
function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
}
function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$define$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(Rgb, rgb, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$define$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])(Color, {
    brighter (k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker (k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb () {
        return this;
    },
    clamp () {
        return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
    },
    displayable () {
        return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
    },
    hex: rgb_formatHex,
    formatHex: rgb_formatHex,
    formatHex8: rgb_formatHex8,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb
}));
function rgb_formatHex() {
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}
function rgb_formatHex8() {
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function rgb_formatRgb() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}
function clampa(opacity) {
    return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value) {
    return Math.max(0, Math.min(255, Math.round(value) || 0));
}
function hex(value) {
    value = clampi(value);
    return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
}
function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), h = NaN, s = max - min, l = (max + min) / 2;
    if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
    } else {
        s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$define$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(Hsl, hsl, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$define$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])(Color, {
    brighter (k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker (k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb () {
        var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
        return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
    },
    clamp () {
        return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
    },
    displayable () {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
    },
    formatHsl () {
        const a = clampa(this.opacity);
        return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
    }
}));
function clamph(value) {
    value = (value || 0) % 360;
    return value < 0 ? value + 360 : value;
}
function clampt(value) {
    return Math.max(0, Math.min(1, value || 0));
}
/* From FvD 13.37, CSS Color Module Level 3 */ function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}
}),
"[project]/frontend/node_modules/d3-color/src/color.js [app-client] (ecmascript) <export default as color>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "color",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-color/src/color.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-color/src/define.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "extend",
    ()=>extend
]);
function __TURBOPACK__default__export__(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
}
function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for(var key in definition)prototype[key] = definition[key];
    return prototype;
}
}),
"[project]/frontend/node_modules/d3-dispatch/src/dispatch.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var noop = {
    value: ()=>{}
};
function dispatch() {
    for(var i = 0, n = arguments.length, _ = {}, t; i < n; ++i){
        if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
        _[t] = [];
    }
    return new Dispatch(_);
}
function Dispatch(_) {
    this._ = _;
}
function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {
            type: t,
            name: name
        };
    });
}
Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
        var _ = this._, T = parseTypenames(typename + "", _), t, i = -1, n = T.length;
        // If no callback was specified, return the callback of the given type and name.
        if (arguments.length < 2) {
            while(++i < n)if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
            return;
        }
        // If a type was specified, set the callback for the given type and name.
        // Otherwise, if a null callback was specified, remove callbacks of the given name.
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while(++i < n){
            if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
            else if (callback == null) for(t in _)_[t] = set(_[t], typename.name, null);
        }
        return this;
    },
    copy: function() {
        var copy = {}, _ = this._;
        for(var t in _)copy[t] = _[t].slice();
        return new Dispatch(copy);
    },
    call: function(type, that) {
        if ((n = arguments.length - 2) > 0) for(var args = new Array(n), i = 0, n, t; i < n; ++i)args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for(t = this._[type], i = 0, n = t.length; i < n; ++i)t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for(var t = this._[type], i = 0, n = t.length; i < n; ++i)t[i].value.apply(that, args);
    }
};
function get(type, name) {
    for(var i = 0, n = type.length, c; i < n; ++i){
        if ((c = type[i]).name === name) {
            return c.value;
        }
    }
}
function set(type, name, callback) {
    for(var i = 0, n = type.length; i < n; ++i){
        if (type[i].name === name) {
            type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
            break;
        }
    }
    if (callback != null) type.push({
        name: name,
        value: callback
    });
    return type;
}
const __TURBOPACK__default__export__ = dispatch;
}),
"[project]/frontend/node_modules/d3-dispatch/src/dispatch.js [app-client] (ecmascript) <export default as dispatch>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dispatch",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$dispatch$2f$src$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$dispatch$2f$src$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-dispatch/src/dispatch.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "yesdrag",
    ()=>yesdrag
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-drag/src/noevent.js [app-client] (ecmascript)");
;
;
function __TURBOPACK__default__export__(view) {
    var root = view.document.documentElement, selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(view).on("dragstart.drag", __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nonpassivecapture"]);
    if ("onselectstart" in root) {
        selection.on("selectstart.drag", __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nonpassivecapture"]);
    } else {
        root.__noselect = root.style.MozUserSelect;
        root.style.MozUserSelect = "none";
    }
}
function yesdrag(view, noclick) {
    var root = view.document.documentElement, selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(view).on("dragstart.drag", null);
    if (noclick) {
        selection.on("click.drag", __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nonpassivecapture"]);
        setTimeout(function() {
            selection.on("click.drag", null);
        }, 0);
    }
    if ("onselectstart" in root) {
        selection.on("selectstart.drag", null);
    } else {
        root.style.MozUserSelect = root.__noselect;
        delete root.__noselect;
    }
}
}),
"[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript) <export default as dragDisable>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dragDisable",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript) <export yesdrag as dragEnable>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dragEnable",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yesdrag"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-drag/src/noevent.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// These are typically used in conjunction with noevent to ensure that we can
// preventDefault on the event.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "nonpassive",
    ()=>nonpassive,
    "nonpassivecapture",
    ()=>nonpassivecapture,
    "nopropagation",
    ()=>nopropagation
]);
const nonpassive = {
    passive: false
};
const nonpassivecapture = {
    capture: true,
    passive: false
};
function nopropagation(event) {
    event.stopImmediatePropagation();
}
function __TURBOPACK__default__export__(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
}
}),
"[project]/frontend/node_modules/d3-ease/src/cubic.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cubicIn",
    ()=>cubicIn,
    "cubicInOut",
    ()=>cubicInOut,
    "cubicOut",
    ()=>cubicOut
]);
function cubicIn(t) {
    return t * t * t;
}
function cubicOut(t) {
    return --t * t * t + 1;
}
function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
}),
"[project]/frontend/node_modules/d3-ease/src/cubic.js [app-client] (ecmascript) <export cubicInOut as easeCubicInOut>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "easeCubicInOut",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$ease$2f$src$2f$cubic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cubicInOut"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$ease$2f$src$2f$cubic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-ease/src/cubic.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-format/src/defaultLocale.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>defaultLocale,
    "format",
    ()=>format,
    "formatPrefix",
    ()=>formatPrefix
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$locale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-format/src/locale.js [app-client] (ecmascript)");
;
var locale;
var format;
var formatPrefix;
defaultLocale({
    thousands: ",",
    grouping: [
        3
    ],
    currency: [
        "$",
        ""
    ]
});
function defaultLocale(definition) {
    locale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$locale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(definition);
    format = locale.format;
    formatPrefix = locale.formatPrefix;
    return locale;
}
}),
"[project]/frontend/node_modules/d3-format/src/exponent.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatDecimal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-format/src/formatDecimal.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(x) {
    return x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatDecimal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDecimalParts"])(Math.abs(x)), x ? x[1] : NaN;
}
}),
"[project]/frontend/node_modules/d3-format/src/formatDecimal.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "formatDecimalParts",
    ()=>formatDecimalParts
]);
function __TURBOPACK__default__export__(x) {
    return Math.abs(x = Math.round(x)) >= 1e21 ? x.toLocaleString("en").replace(/,/g, "") : x.toString(10);
}
function formatDecimalParts(x, p) {
    if (!isFinite(x) || x === 0) return null; // NaN, ±Infinity, ±0
    var i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e"), coefficient = x.slice(0, i);
    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
    ];
}
}),
"[project]/frontend/node_modules/d3-format/src/formatGroup.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(grouping, thousands) {
    return function(value, width) {
        var i = value.length, t = [], j = 0, g = grouping[0], length = 0;
        while(i > 0 && g > 0){
            if (length + g + 1 > width) g = Math.max(1, width - length);
            t.push(value.substring(i -= g, i + g));
            if ((length += g + 1) > width) break;
            g = grouping[j = (j + 1) % grouping.length];
        }
        return t.reverse().join(thousands);
    };
}
}),
"[project]/frontend/node_modules/d3-format/src/formatNumerals.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(numerals) {
    return function(value) {
        return value.replace(/[0-9]/g, function(i) {
            return numerals[+i];
        });
    };
}
}),
"[project]/frontend/node_modules/d3-format/src/formatPrefixAuto.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "prefixExponent",
    ()=>prefixExponent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatDecimal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-format/src/formatDecimal.js [app-client] (ecmascript)");
;
var prefixExponent;
function __TURBOPACK__default__export__(x, p) {
    var d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatDecimal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDecimalParts"])(x, p);
    if (!d) return prefixExponent = undefined, x.toPrecision(p);
    var coefficient = d[0], exponent = d[1], i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1, n = coefficient.length;
    return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatDecimal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDecimalParts"])(x, Math.max(0, p + i - 1))[0]; // less than 1y!
}
}),
"[project]/frontend/node_modules/d3-format/src/formatRounded.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatDecimal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-format/src/formatDecimal.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(x, p) {
    var d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatDecimal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDecimalParts"])(x, p);
    if (!d) return x + "";
    var coefficient = d[0], exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}
}),
"[project]/frontend/node_modules/d3-format/src/formatSpecifier.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FormatSpecifier",
    ()=>FormatSpecifier,
    "default",
    ()=>formatSpecifier
]);
// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function formatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
    var match;
    return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
    });
}
formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof
function FormatSpecifier(specifier) {
    this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
    this.align = specifier.align === undefined ? ">" : specifier.align + "";
    this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
    this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
    this.zero = !!specifier.zero;
    this.width = specifier.width === undefined ? undefined : +specifier.width;
    this.comma = !!specifier.comma;
    this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
    this.trim = !!specifier.trim;
    this.type = specifier.type === undefined ? "" : specifier.type + "";
}
FormatSpecifier.prototype.toString = function() {
    return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === undefined ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
}),
"[project]/frontend/node_modules/d3-format/src/formatTrim.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(s) {
    out: for(var n = s.length, i = 1, i0 = -1, i1; i < n; ++i){
        switch(s[i]){
            case ".":
                i0 = i1 = i;
                break;
            case "0":
                if (i0 === 0) i0 = i;
                i1 = i;
                break;
            default:
                if (!+s[i]) break out;
                if (i0 > 0) i0 = 0;
                break;
        }
    }
    return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}
}),
"[project]/frontend/node_modules/d3-format/src/formatTypes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatDecimal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-format/src/formatDecimal.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatPrefixAuto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-format/src/formatPrefixAuto.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatRounded$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-format/src/formatRounded.js [app-client] (ecmascript)");
;
;
;
const __TURBOPACK__default__export__ = {
    "%": (x, p)=>(x * 100).toFixed(p),
    "b": (x)=>Math.round(x).toString(2),
    "c": (x)=>x + "",
    "d": __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatDecimal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "e": (x, p)=>x.toExponential(p),
    "f": (x, p)=>x.toFixed(p),
    "g": (x, p)=>x.toPrecision(p),
    "o": (x)=>Math.round(x).toString(8),
    "p": (x, p)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatRounded$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(x * 100, p),
    "r": __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatRounded$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "s": __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatPrefixAuto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "X": (x)=>Math.round(x).toString(16).toUpperCase(),
    "x": (x)=>Math.round(x).toString(16)
};
}),
"[project]/frontend/node_modules/d3-format/src/identity.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(x) {
    return x;
}
}),
"[project]/frontend/node_modules/d3-format/src/locale.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$exponent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-format/src/exponent.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatGroup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-format/src/formatGroup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatNumerals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-format/src/formatNumerals.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatSpecifier$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-format/src/formatSpecifier.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatTrim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-format/src/formatTrim.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatTypes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-format/src/formatTypes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatPrefixAuto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-format/src/formatPrefixAuto.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$identity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-format/src/identity.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
var map = Array.prototype.map, prefixes = [
    "y",
    "z",
    "a",
    "f",
    "p",
    "n",
    "µ",
    "m",
    "",
    "k",
    "M",
    "G",
    "T",
    "P",
    "E",
    "Z",
    "Y"
];
function __TURBOPACK__default__export__(locale) {
    var group = locale.grouping === undefined || locale.thousands === undefined ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$identity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatGroup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(map.call(locale.grouping, Number), locale.thousands + ""), currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "", currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "", decimal = locale.decimal === undefined ? "." : locale.decimal + "", numerals = locale.numerals === undefined ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$identity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatNumerals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(map.call(locale.numerals, String)), percent = locale.percent === undefined ? "%" : locale.percent + "", minus = locale.minus === undefined ? "−" : locale.minus + "", nan = locale.nan === undefined ? "NaN" : locale.nan + "";
    function newFormat(specifier, options) {
        specifier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatSpecifier$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(specifier);
        var fill = specifier.fill, align = specifier.align, sign = specifier.sign, symbol = specifier.symbol, zero = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type = specifier.type;
        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";
        else if (!__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatTypes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"][type]) precision === undefined && (precision = 12), trim = true, type = "g";
        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || fill === "0" && align === "=") zero = true, fill = "0", align = "=";
        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = (options && options.prefix !== undefined ? options.prefix : "") + (symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : ""), suffix = (symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "") + (options && options.suffix !== undefined ? options.suffix : "");
        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatTypes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"][type], maybeSuffix = /[defgprs%]/.test(type);
        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision === undefined ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
        function format(value) {
            var valuePrefix = prefix, valueSuffix = suffix, i, n, c;
            if (type === "c") {
                valueSuffix = formatType(value) + valueSuffix;
                value = "";
            } else {
                value = +value;
                // Determine the sign. -0 is not less than 0, but 1 / -0 is!
                var valueNegative = value < 0 || 1 / value < 0;
                // Perform the initial formatting.
                value = isNaN(value) ? nan : formatType(Math.abs(value), precision);
                // Trim insignificant zeros.
                if (trim) value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatTrim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(value);
                // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
                if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;
                // Compute the prefix and suffix.
                valuePrefix = (valueNegative ? sign === "(" ? sign : minus : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
                valueSuffix = (type === "s" && !isNaN(value) && __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatPrefixAuto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["prefixExponent"] !== undefined ? prefixes[8 + __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatPrefixAuto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["prefixExponent"] / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");
                // Break the formatted value into the integer “value” part that can be
                // grouped, and fractional or exponential “suffix” part that is not.
                if (maybeSuffix) {
                    i = -1, n = value.length;
                    while(++i < n){
                        if (c = value.charCodeAt(i), 48 > c || c > 57) {
                            valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                            value = value.slice(0, i);
                            break;
                        }
                    }
                }
            }
            // If the fill character is not "0", grouping is applied before padding.
            if (comma && !zero) value = group(value, Infinity);
            // Compute the padding.
            var length = valuePrefix.length + value.length + valueSuffix.length, padding = length < width ? new Array(width - length + 1).join(fill) : "";
            // If the fill character is "0", grouping is applied after padding.
            if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";
            // Reconstruct the final output based on the desired alignment.
            switch(align){
                case "<":
                    value = valuePrefix + value + valueSuffix + padding;
                    break;
                case "=":
                    value = valuePrefix + padding + value + valueSuffix;
                    break;
                case "^":
                    value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
                    break;
                default:
                    value = padding + valuePrefix + value + valueSuffix;
                    break;
            }
            return numerals(value);
        }
        format.toString = function() {
            return specifier + "";
        };
        return format;
    }
    function formatPrefix(specifier, value) {
        var e = Math.max(-8, Math.min(8, Math.floor((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$exponent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(value) / 3))) * 3, k = Math.pow(10, -e), f = newFormat((specifier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$format$2f$src$2f$formatSpecifier$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(specifier), specifier.type = "f", specifier), {
            suffix: prefixes[8 + e / 3]
        });
        return function(value) {
            return f(k * value);
        };
    }
    return {
        format: newFormat,
        formatPrefix: formatPrefix
    };
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/accessors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "optional",
    ()=>optional,
    "required",
    ()=>required
]);
function optional(f) {
    return f == null ? null : required(f);
}
function required(f) {
    if (typeof f !== "function") throw new Error;
    return f;
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/constant.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "constantZero",
    ()=>constantZero,
    "default",
    ()=>__TURBOPACK__default__export__
]);
function constantZero() {
    return 0;
}
function __TURBOPACK__default__export__(x) {
    return function() {
        return x;
    };
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/ancestors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {
    var node = this, nodes = [
        node
    ];
    while(node = node.parent){
        nodes.push(node);
    }
    return nodes;
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/count.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function count(node) {
    var sum = 0, children = node.children, i = children && children.length;
    if (!i) sum = 1;
    else while(--i >= 0)sum += children[i].value;
    node.value = sum;
}
function __TURBOPACK__default__export__() {
    return this.eachAfter(count);
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/descendants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {
    return Array.from(this);
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/each.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(callback, that) {
    let index = -1;
    for (const node of this){
        callback.call(that, node, ++index, this);
    }
    return this;
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/eachAfter.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(callback, that) {
    var node = this, nodes = [
        node
    ], next = [], children, i, n, index = -1;
    while(node = nodes.pop()){
        next.push(node);
        if (children = node.children) {
            for(i = 0, n = children.length; i < n; ++i){
                nodes.push(children[i]);
            }
        }
    }
    while(node = next.pop()){
        callback.call(that, node, ++index, this);
    }
    return this;
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/eachBefore.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(callback, that) {
    var node = this, nodes = [
        node
    ], children, i, index = -1;
    while(node = nodes.pop()){
        callback.call(that, node, ++index, this);
        if (children = node.children) {
            for(i = children.length - 1; i >= 0; --i){
                nodes.push(children[i]);
            }
        }
    }
    return this;
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/find.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(callback, that) {
    let index = -1;
    for (const node of this){
        if (callback.call(that, node, ++index, this)) {
            return node;
        }
    }
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Node",
    ()=>Node,
    "computeHeight",
    ()=>computeHeight,
    "default",
    ()=>hierarchy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$count$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/count.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$each$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/each.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$eachBefore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/eachBefore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$eachAfter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/eachAfter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$find$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/find.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$sum$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/sum.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$sort$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/sort.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/path.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$ancestors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/ancestors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$descendants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/descendants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$leaves$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/leaves.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$links$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/links.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$iterator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/iterator.js [app-client] (ecmascript)");
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
function hierarchy(data, children) {
    if (data instanceof Map) {
        data = [
            undefined,
            data
        ];
        if (children === undefined) children = mapChildren;
    } else if (children === undefined) {
        children = objectChildren;
    }
    var root = new Node(data), node, nodes = [
        root
    ], child, childs, i, n;
    while(node = nodes.pop()){
        if ((childs = children(node.data)) && (n = (childs = Array.from(childs)).length)) {
            node.children = childs;
            for(i = n - 1; i >= 0; --i){
                nodes.push(child = childs[i] = new Node(childs[i]));
                child.parent = node;
                child.depth = node.depth + 1;
            }
        }
    }
    return root.eachBefore(computeHeight);
}
function node_copy() {
    return hierarchy(this).eachBefore(copyData);
}
function objectChildren(d) {
    return d.children;
}
function mapChildren(d) {
    return Array.isArray(d) ? d[1] : null;
}
function copyData(node) {
    if (node.data.value !== undefined) node.value = node.data.value;
    node.data = node.data.data;
}
function computeHeight(node) {
    var height = 0;
    do node.height = height;
    while ((node = node.parent) && node.height < ++height)
}
function Node(data) {
    this.data = data;
    this.depth = this.height = 0;
    this.parent = null;
}
Node.prototype = hierarchy.prototype = {
    constructor: Node,
    count: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$count$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    each: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$each$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    eachAfter: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$eachAfter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    eachBefore: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$eachBefore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    find: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$find$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    sum: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$sum$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    sort: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$sort$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    path: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    ancestors: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$ancestors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    descendants: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$descendants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    leaves: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$leaves$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    links: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$links$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    copy: node_copy,
    [Symbol.iterator]: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$iterator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
};
}),
"[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/index.js [app-client] (ecmascript) <export default as hierarchy>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hierarchy",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$hierarchy$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/index.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/iterator.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function* __TURBOPACK__default__export__() {
    var node = this, current, next = [
        node
    ], children, i, n;
    do {
        current = next.reverse(), next = [];
        while(node = current.pop()){
            yield node;
            if (children = node.children) {
                for(i = 0, n = children.length; i < n; ++i){
                    next.push(children[i]);
                }
            }
        }
    }while (next.length)
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/leaves.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {
    var leaves = [];
    this.eachBefore(function(node) {
        if (!node.children) {
            leaves.push(node);
        }
    });
    return leaves;
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/links.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {
    var root = this, links = [];
    root.each(function(node) {
        if (node !== root) {
            links.push({
                source: node.parent,
                target: node
            });
        }
    });
    return links;
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/path.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(end) {
    var start = this, ancestor = leastCommonAncestor(start, end), nodes = [
        start
    ];
    while(start !== ancestor){
        start = start.parent;
        nodes.push(start);
    }
    var k = nodes.length;
    while(end !== ancestor){
        nodes.splice(k, 0, end);
        end = end.parent;
    }
    return nodes;
}
function leastCommonAncestor(a, b) {
    if (a === b) return a;
    var aNodes = a.ancestors(), bNodes = b.ancestors(), c = null;
    a = aNodes.pop();
    b = bNodes.pop();
    while(a === b){
        c = a;
        a = aNodes.pop();
        b = bNodes.pop();
    }
    return c;
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/sort.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(compare) {
    return this.eachBefore(function(node) {
        if (node.children) {
            node.children.sort(compare);
        }
    });
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/hierarchy/sum.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(value) {
    return this.eachAfter(function(node) {
        var sum = +value(node.data) || 0, children = node.children, i = children && children.length;
        while(--i >= 0)sum += children[i].value;
        node.value = sum;
    });
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/treemap/dice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(parent, x0, y0, x1, y1) {
    var nodes = parent.children, node, i = -1, n = nodes.length, k = parent.value && (x1 - x0) / parent.value;
    while(++i < n){
        node = nodes[i], node.y0 = y0, node.y1 = y1;
        node.x0 = x0, node.x1 = x0 += node.value * k;
    }
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/treemap/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$treemap$2f$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/treemap/round.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$treemap$2f$squarify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/treemap/squarify.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$accessors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/accessors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/constant.js [app-client] (ecmascript)");
;
;
;
;
function __TURBOPACK__default__export__() {
    var tile = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$treemap$2f$squarify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], round = false, dx = 1, dy = 1, paddingStack = [
        0
    ], paddingInner = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["constantZero"], paddingTop = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["constantZero"], paddingRight = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["constantZero"], paddingBottom = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["constantZero"], paddingLeft = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["constantZero"];
    function treemap(root) {
        root.x0 = root.y0 = 0;
        root.x1 = dx;
        root.y1 = dy;
        root.eachBefore(positionNode);
        paddingStack = [
            0
        ];
        if (round) root.eachBefore(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$treemap$2f$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
        return root;
    }
    function positionNode(node) {
        var p = paddingStack[node.depth], x0 = node.x0 + p, y0 = node.y0 + p, x1 = node.x1 - p, y1 = node.y1 - p;
        if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
        if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
        node.x0 = x0;
        node.y0 = y0;
        node.x1 = x1;
        node.y1 = y1;
        if (node.children) {
            p = paddingStack[node.depth + 1] = paddingInner(node) / 2;
            x0 += paddingLeft(node) - p;
            y0 += paddingTop(node) - p;
            x1 -= paddingRight(node) - p;
            y1 -= paddingBottom(node) - p;
            if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
            if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
            tile(node, x0, y0, x1, y1);
        }
    }
    treemap.round = function(x) {
        return arguments.length ? (round = !!x, treemap) : round;
    };
    treemap.size = function(x) {
        return arguments.length ? (dx = +x[0], dy = +x[1], treemap) : [
            dx,
            dy
        ];
    };
    treemap.tile = function(x) {
        return arguments.length ? (tile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$accessors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["required"])(x), treemap) : tile;
    };
    treemap.padding = function(x) {
        return arguments.length ? treemap.paddingInner(x).paddingOuter(x) : treemap.paddingInner();
    };
    treemap.paddingInner = function(x) {
        return arguments.length ? (paddingInner = typeof x === "function" ? x : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(+x), treemap) : paddingInner;
    };
    treemap.paddingOuter = function(x) {
        return arguments.length ? treemap.paddingTop(x).paddingRight(x).paddingBottom(x).paddingLeft(x) : treemap.paddingTop();
    };
    treemap.paddingTop = function(x) {
        return arguments.length ? (paddingTop = typeof x === "function" ? x : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(+x), treemap) : paddingTop;
    };
    treemap.paddingRight = function(x) {
        return arguments.length ? (paddingRight = typeof x === "function" ? x : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(+x), treemap) : paddingRight;
    };
    treemap.paddingBottom = function(x) {
        return arguments.length ? (paddingBottom = typeof x === "function" ? x : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(+x), treemap) : paddingBottom;
    };
    treemap.paddingLeft = function(x) {
        return arguments.length ? (paddingLeft = typeof x === "function" ? x : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(+x), treemap) : paddingLeft;
    };
    return treemap;
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/treemap/index.js [app-client] (ecmascript) <export default as treemap>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "treemap",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$treemap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$treemap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/treemap/index.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-hierarchy/src/treemap/round.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(node) {
    node.x0 = Math.round(node.x0);
    node.y0 = Math.round(node.y0);
    node.x1 = Math.round(node.x1);
    node.y1 = Math.round(node.y1);
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/treemap/slice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(parent, x0, y0, x1, y1) {
    var nodes = parent.children, node, i = -1, n = nodes.length, k = parent.value && (y1 - y0) / parent.value;
    while(++i < n){
        node = nodes[i], node.x0 = x0, node.x1 = x1;
        node.y0 = y0, node.y1 = y0 += node.value * k;
    }
}
}),
"[project]/frontend/node_modules/d3-hierarchy/src/treemap/squarify.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "phi",
    ()=>phi,
    "squarifyRatio",
    ()=>squarifyRatio
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$treemap$2f$dice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/treemap/dice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$treemap$2f$slice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-hierarchy/src/treemap/slice.js [app-client] (ecmascript)");
;
;
var phi = (1 + Math.sqrt(5)) / 2;
function squarifyRatio(ratio, parent, x0, y0, x1, y1) {
    var rows = [], nodes = parent.children, row, nodeValue, i0 = 0, i1 = 0, n = nodes.length, dx, dy, value = parent.value, sumValue, minValue, maxValue, newRatio, minRatio, alpha, beta;
    while(i0 < n){
        dx = x1 - x0, dy = y1 - y0;
        // Find the next non-empty node.
        do sumValue = nodes[i1++].value;
        while (!sumValue && i1 < n)
        minValue = maxValue = sumValue;
        alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
        beta = sumValue * sumValue * alpha;
        minRatio = Math.max(maxValue / beta, beta / minValue);
        // Keep adding nodes while the aspect ratio maintains or improves.
        for(; i1 < n; ++i1){
            sumValue += nodeValue = nodes[i1].value;
            if (nodeValue < minValue) minValue = nodeValue;
            if (nodeValue > maxValue) maxValue = nodeValue;
            beta = sumValue * sumValue * alpha;
            newRatio = Math.max(maxValue / beta, beta / minValue);
            if (newRatio > minRatio) {
                sumValue -= nodeValue;
                break;
            }
            minRatio = newRatio;
        }
        // Position and record the row orientation.
        rows.push(row = {
            value: sumValue,
            dice: dx < dy,
            children: nodes.slice(i0, i1)
        });
        if (row.dice) (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$treemap$2f$dice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(row, x0, y0, x1, value ? y0 += dy * sumValue / value : y1);
        else (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$hierarchy$2f$src$2f$treemap$2f$slice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(row, x0, y0, value ? x0 += dx * sumValue / value : x1, y1);
        value -= sumValue, i0 = i1;
    }
    return rows;
}
const __TURBOPACK__default__export__ = function custom(ratio) {
    function squarify(parent, x0, y0, x1, y1) {
        squarifyRatio(ratio, parent, x0, y0, x1, y1);
    }
    squarify.ratio = function(x) {
        return custom((x = +x) > 1 ? x : 1);
    };
    return squarify;
}(phi);
}),
"[project]/frontend/node_modules/d3-interpolate/src/array.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "genericArray",
    ()=>genericArray
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$value$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/value.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$numberArray$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/numberArray.js [app-client] (ecmascript)");
;
;
function __TURBOPACK__default__export__(a, b) {
    return ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$numberArray$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumberArray"])(b) ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$numberArray$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : genericArray)(a, b);
}
function genericArray(a, b) {
    var nb = b ? b.length : 0, na = a ? Math.min(nb, a.length) : 0, x = new Array(na), c = new Array(nb), i;
    for(i = 0; i < na; ++i)x[i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$value$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(a[i], b[i]);
    for(; i < nb; ++i)c[i] = b[i];
    return function(t) {
        for(i = 0; i < na; ++i)c[i] = x[i](t);
        return c;
    };
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/basis.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "basis",
    ()=>basis,
    "default",
    ()=>__TURBOPACK__default__export__
]);
function basis(t1, v0, v1, v2, v3) {
    var t2 = t1 * t1, t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}
function __TURBOPACK__default__export__(values) {
    var n = values.length - 1;
    return function(t) {
        var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
        return basis((t - i / n) * n, v0, v1, v2, v3);
    };
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/basisClosed.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/basis.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(values) {
    var n = values.length;
    return function(t) {
        var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["basis"])((t - i / n) * n, v0, v1, v2, v3);
    };
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/color.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>nogamma,
    "gamma",
    ()=>gamma,
    "hue",
    ()=>hue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/constant.js [app-client] (ecmascript)");
;
function linear(a, d) {
    return function(t) {
        return a + t * d;
    };
}
function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
    };
}
function hue(a, b) {
    var d = b - a;
    return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(isNaN(a) ? b : a);
}
function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(isNaN(a) ? b : a);
    };
}
function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(isNaN(a) ? b : a);
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/constant.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = (x)=>()=>x;
}),
"[project]/frontend/node_modules/d3-interpolate/src/date.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(a, b) {
    var d = new Date;
    return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
    };
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/number.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(a, b) {
    return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
    };
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/number.js [app-client] (ecmascript) <export default as interpolateNumber>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "interpolateNumber",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/number.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-interpolate/src/numberArray.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "isNumberArray",
    ()=>isNumberArray
]);
function __TURBOPACK__default__export__(a, b) {
    if (!b) b = [];
    var n = a ? Math.min(b.length, a.length) : 0, c = b.slice(), i;
    return function(t) {
        for(i = 0; i < n; ++i)c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
    };
}
function isNumberArray(x) {
    return ArrayBuffer.isView(x) && !(x instanceof DataView);
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/object.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$value$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/value.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(a, b) {
    var i = {}, c = {}, k;
    if (a === null || typeof a !== "object") a = {};
    if (b === null || typeof b !== "object") b = {};
    for(k in b){
        if (k in a) {
            i[k] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$value$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(a[k], b[k]);
        } else {
            c[k] = b[k];
        }
    }
    return function(t) {
        for(k in i)c[k] = i[k](t);
        return c;
    };
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/rgb.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "rgbBasis",
    ()=>rgbBasis,
    "rgbBasisClosed",
    ()=>rgbBasisClosed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-color/src/color.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/basis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$basisClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/basisClosed.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/color.js [app-client] (ecmascript)");
;
;
;
;
const __TURBOPACK__default__export__ = function rgbGamma(y) {
    var color = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gamma"])(y);
    function rgb(start, end) {
        var r = color((start = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rgb"])(start)).r, (end = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rgb"])(end)).r), g = color(start.g, end.g), b = color(start.b, end.b), opacity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(start.opacity, end.opacity);
        return function(t) {
            start.r = r(t);
            start.g = g(t);
            start.b = b(t);
            start.opacity = opacity(t);
            return start + "";
        };
    }
    rgb.gamma = rgbGamma;
    return rgb;
}(1);
function rgbSpline(spline) {
    return function(colors) {
        var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color;
        for(i = 0; i < n; ++i){
            color = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rgb"])(colors[i]);
            r[i] = color.r || 0;
            g[i] = color.g || 0;
            b[i] = color.b || 0;
        }
        r = spline(r);
        g = spline(g);
        b = spline(b);
        color.opacity = 1;
        return function(t) {
            color.r = r(t);
            color.g = g(t);
            color.b = b(t);
            return color + "";
        };
    };
}
var rgbBasis = rgbSpline(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
var rgbBasisClosed = rgbSpline(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$basisClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
}),
"[project]/frontend/node_modules/d3-interpolate/src/rgb.js [app-client] (ecmascript) <export default as interpolateRgb>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "interpolateRgb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/rgb.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-interpolate/src/string.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/number.js [app-client] (ecmascript)");
;
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, reB = new RegExp(reA.source, "g");
function zero(b) {
    return function() {
        return b;
    };
}
function one(b) {
    return function(t) {
        return b(t) + "";
    };
}
function __TURBOPACK__default__export__(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = []; // number interpolators
    // Coerce inputs to strings.
    a = a + "", b = b + "";
    // Interpolate pairs of numbers in a & b.
    while((am = reA.exec(a)) && (bm = reB.exec(b))){
        if ((bs = bm.index) > bi) {
            bs = b.slice(bi, bs);
            if (s[i]) s[i] += bs; // coalesce with previous string
            else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) {
            if (s[i]) s[i] += bm; // coalesce with previous string
            else s[++i] = bm;
        } else {
            s[++i] = null;
            q.push({
                i: i,
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(am, bm)
            });
        }
        bi = reB.lastIndex;
    }
    // Add remains of b.
    if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
    }
    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
        for(var i = 0, o; i < b; ++i)s[(o = q[i]).i] = o.x(t);
        return s.join("");
    });
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/string.js [app-client] (ecmascript) <export default as interpolateString>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "interpolateString",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$string$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$string$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/string.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-interpolate/src/transform/decompose.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "identity",
    ()=>identity
]);
var degrees = 180 / Math.PI;
var identity = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
};
function __TURBOPACK__default__export__(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
        translateX: e,
        translateY: f,
        rotate: Math.atan2(b, a) * degrees,
        skewX: Math.atan(skewX) * degrees,
        scaleX: scaleX,
        scaleY: scaleY
    };
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/transform/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "interpolateTransformCss",
    ()=>interpolateTransformCss,
    "interpolateTransformSvg",
    ()=>interpolateTransformSvg
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$parse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/transform/parse.js [app-client] (ecmascript)");
;
;
function interpolateTransform(parse, pxComma, pxParen, degParen) {
    function pop(s) {
        return s.length ? s.pop() + " " : "";
    }
    function translate(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
            var i = s.push("translate(", null, pxComma, null, pxParen);
            q.push({
                i: i - 4,
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(xa, xb)
            }, {
                i: i - 2,
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(ya, yb)
            });
        } else if (xb || yb) {
            s.push("translate(" + xb + pxComma + yb + pxParen);
        }
    }
    function rotate(a, b, s, q) {
        if (a !== b) {
            if (a - b > 180) b += 360;
            else if (b - a > 180) a += 360; // shortest path
            q.push({
                i: s.push(pop(s) + "rotate(", null, degParen) - 2,
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(a, b)
            });
        } else if (b) {
            s.push(pop(s) + "rotate(" + b + degParen);
        }
    }
    function skewX(a, b, s, q) {
        if (a !== b) {
            q.push({
                i: s.push(pop(s) + "skewX(", null, degParen) - 2,
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(a, b)
            });
        } else if (b) {
            s.push(pop(s) + "skewX(" + b + degParen);
        }
    }
    function scale(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
            var i = s.push(pop(s) + "scale(", null, ",", null, ")");
            q.push({
                i: i - 4,
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(xa, xb)
            }, {
                i: i - 2,
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(ya, yb)
            });
        } else if (xb !== 1 || yb !== 1) {
            s.push(pop(s) + "scale(" + xb + "," + yb + ")");
        }
    }
    return function(a, b) {
        var s = [], q = []; // number interpolators
        a = parse(a), b = parse(b);
        translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
        rotate(a.rotate, b.rotate, s, q);
        skewX(a.skewX, b.skewX, s, q);
        scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
        a = b = null; // gc
        return function(t) {
            var i = -1, n = q.length, o;
            while(++i < n)s[(o = q[i]).i] = o.x(t);
            return s.join("");
        };
    };
}
var interpolateTransformCss = interpolateTransform(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$parse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseCss"], "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$parse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseSvg"], ", ", ")", ")");
}),
"[project]/frontend/node_modules/d3-interpolate/src/transform/parse.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseCss",
    ()=>parseCss,
    "parseSvg",
    ()=>parseSvg
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$decompose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/transform/decompose.js [app-client] (ecmascript)");
;
var svgNode;
function parseCss(value) {
    const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
    return m.isIdentity ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$decompose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identity"] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$decompose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(m.a, m.b, m.c, m.d, m.e, m.f);
}
function parseSvg(value) {
    if (value == null) return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$decompose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identity"];
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$decompose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identity"];
    value = value.matrix;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$decompose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(value.a, value.b, value.c, value.d, value.e, value.f);
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/value.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__color$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-color/src/color.js [app-client] (ecmascript) <export default as color>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/rgb.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/array.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$date$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/date.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$object$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/object.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$string$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/string.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/constant.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$numberArray$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/numberArray.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
function __TURBOPACK__default__export__(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(b) : (t === "number" ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : t === "string" ? (c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__color$3e$__["color"])(b)) ? (b = c, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]) : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$string$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : b instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__color$3e$__["color"] ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : b instanceof Date ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$date$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$numberArray$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumberArray"])(b) ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$numberArray$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : Array.isArray(b) ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["genericArray"] : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$object$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(a, b);
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/value.js [app-client] (ecmascript) <export default as interpolate>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "interpolate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$value$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$value$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/value.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-interpolate/src/zoom.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var epsilon2 = 1e-12;
function cosh(x) {
    return ((x = Math.exp(x)) + 1 / x) / 2;
}
function sinh(x) {
    return ((x = Math.exp(x)) - 1 / x) / 2;
}
function tanh(x) {
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}
const __TURBOPACK__default__export__ = function zoomRho(rho, rho2, rho4) {
    // p0 = [ux0, uy0, w0]
    // p1 = [ux1, uy1, w1]
    function zoom(p0, p1) {
        var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
        // Special case for u0 ≅ u1.
        if (d2 < epsilon2) {
            S = Math.log(w1 / w0) / rho;
            i = function(t) {
                return [
                    ux0 + t * dx,
                    uy0 + t * dy,
                    w0 * Math.exp(rho * t * S)
                ];
            };
        } else {
            var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
            S = (r1 - r0) / rho;
            i = function(t) {
                var s = t * S, coshr0 = cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
                return [
                    ux0 + u * dx,
                    uy0 + u * dy,
                    w0 * coshr0 / cosh(rho * s + r0)
                ];
            };
        }
        i.duration = S * 1000 * rho / Math.SQRT2;
        return i;
    }
    zoom.rho = function(_) {
        var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
        return zoomRho(_1, _2, _4);
    };
    return zoom;
}(Math.SQRT2, 2, 4);
}),
"[project]/frontend/node_modules/d3-interpolate/src/zoom.js [app-client] (ecmascript) <export default as interpolateZoom>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "interpolateZoom",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$zoom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$zoom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/zoom.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-scale/src/init.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initInterpolator",
    ()=>initInterpolator,
    "initRange",
    ()=>initRange
]);
function initRange(domain, range) {
    switch(arguments.length){
        case 0:
            break;
        case 1:
            this.range(domain);
            break;
        default:
            this.range(range).domain(domain);
            break;
    }
    return this;
}
function initInterpolator(domain, interpolator) {
    switch(arguments.length){
        case 0:
            break;
        case 1:
            {
                if (typeof domain === "function") this.interpolator(domain);
                else this.range(domain);
                break;
            }
        default:
            {
                this.domain(domain);
                if (typeof interpolator === "function") this.interpolator(interpolator);
                else this.range(interpolator);
                break;
            }
    }
    return this;
}
}),
"[project]/frontend/node_modules/d3-scale/src/ordinal.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ordinal,
    "implicit",
    ()=>implicit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$internmap$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/internmap/src/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$scale$2f$src$2f$init$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-scale/src/init.js [app-client] (ecmascript)");
;
;
const implicit = Symbol("implicit");
function ordinal() {
    var index = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$internmap$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InternMap"](), domain = [], range = [], unknown = implicit;
    function scale(d) {
        let i = index.get(d);
        if (i === undefined) {
            if (unknown !== implicit) return unknown;
            index.set(d, i = domain.push(d) - 1);
        }
        return range[i % range.length];
    }
    scale.domain = function(_) {
        if (!arguments.length) return domain.slice();
        domain = [], index = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$internmap$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InternMap"]();
        for (const value of _){
            if (index.has(value)) continue;
            index.set(value, domain.push(value) - 1);
        }
        return scale;
    };
    scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), scale) : range.slice();
    };
    scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
    };
    scale.copy = function() {
        return ordinal(domain, range).unknown(unknown);
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$scale$2f$src$2f$init$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initRange"].apply(scale, arguments);
    return scale;
}
}),
"[project]/frontend/node_modules/d3-scale/src/ordinal.js [app-client] (ecmascript) <export default as scaleOrdinal>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "scaleOrdinal",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$scale$2f$src$2f$ordinal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$scale$2f$src$2f$ordinal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-scale/src/ordinal.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/array.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Given something array like (or null), returns something that is strictly an
// array. This is used to ensure that array-like objects passed to d3.selectAll
// or selection.selectAll are converted into proper arrays when creating a
// selection; we don’t ever want to create a selection backed by a live
// HTMLCollection or NodeList. However, note that selection.selectAll will use a
// static NodeList as a group, since it safely derived from querySelectorAll.
__turbopack_context__.s([
    "default",
    ()=>array
]);
function array(x) {
    return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}
}),
"[project]/frontend/node_modules/d3-selection/src/constant.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(x) {
    return function() {
        return x;
    };
}
}),
"[project]/frontend/node_modules/d3-selection/src/creator.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/namespace.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespaces$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/namespaces.js [app-client] (ecmascript)");
;
;
function creatorInherit(name) {
    return function() {
        var document = this.ownerDocument, uri = this.namespaceURI;
        return uri === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespaces$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["xhtml"] && document.documentElement.namespaceURI === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespaces$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["xhtml"] ? document.createElement(name) : document.createElementNS(uri, name);
    };
}
function creatorFixed(fullname) {
    return function() {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
}
function __TURBOPACK__default__export__(name) {
    var fullname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(name);
    return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}
}),
"[project]/frontend/node_modules/d3-selection/src/matcher.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "childMatcher",
    ()=>childMatcher,
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(selector) {
    return function() {
        return this.matches(selector);
    };
}
function childMatcher(selector) {
    return function(node) {
        return node.matches(selector);
    };
}
}),
"[project]/frontend/node_modules/d3-selection/src/matcher.js [app-client] (ecmascript) <export default as matcher>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "matcher",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/matcher.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/namespace.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespaces$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/namespaces.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespaces$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].hasOwnProperty(prefix) ? {
        space: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespaces$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"][prefix],
        local: name
    } : name; // eslint-disable-line no-prototype-builtins
}
}),
"[project]/frontend/node_modules/d3-selection/src/namespace.js [app-client] (ecmascript) <export default as namespace>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "namespace",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/namespace.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/namespaces.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "xhtml",
    ()=>xhtml
]);
var xhtml = "http://www.w3.org/1999/xhtml";
const __TURBOPACK__default__export__ = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
};
}),
"[project]/frontend/node_modules/d3-selection/src/pointer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$sourceEvent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/sourceEvent.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(event, node) {
    event = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$sourceEvent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
    if (node === undefined) node = event.currentTarget;
    if (node) {
        var svg = node.ownerSVGElement || node;
        if (svg.createSVGPoint) {
            var point = svg.createSVGPoint();
            point.x = event.clientX, point.y = event.clientY;
            point = point.matrixTransform(node.getScreenCTM().inverse());
            return [
                point.x,
                point.y
            ];
        }
        if (node.getBoundingClientRect) {
            var rect = node.getBoundingClientRect();
            return [
                event.clientX - rect.left - node.clientLeft,
                event.clientY - rect.top - node.clientTop
            ];
        }
    }
    return [
        event.pageX,
        event.pageY
    ];
}
}),
"[project]/frontend/node_modules/d3-selection/src/pointer.js [app-client] (ecmascript) <export default as pointer>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pointer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/pointer.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(selector) {
    return typeof selector === "string" ? new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"]([
        [
            document.querySelector(selector)
        ]
    ], [
        document.documentElement
    ]) : new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"]([
        [
            selector
        ]
    ], __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["root"]);
}
}),
"[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "select",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/selection/append.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$creator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/creator.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(name) {
    var create = typeof name === "function" ? name : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$creator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(name);
    return this.select(function() {
        return this.appendChild(create.apply(this, arguments));
    });
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/attr.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/namespace.js [app-client] (ecmascript)");
;
function attrRemove(name) {
    return function() {
        this.removeAttribute(name);
    };
}
function attrRemoveNS(fullname) {
    return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
    };
}
function attrConstant(name, value) {
    return function() {
        this.setAttribute(name, value);
    };
}
function attrConstantNS(fullname, value) {
    return function() {
        this.setAttributeNS(fullname.space, fullname.local, value);
    };
}
function attrFunction(name, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);
        else this.setAttribute(name, v);
    };
}
function attrFunctionNS(fullname, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
        else this.setAttributeNS(fullname.space, fullname.local, v);
    };
}
function __TURBOPACK__default__export__(name, value) {
    var fullname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(name);
    if (arguments.length < 2) {
        var node = this.node();
        return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
    }
    return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/call.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/classed.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function classArray(string) {
    return string.trim().split(/^|\s+/);
}
function classList(node) {
    return node.classList || new ClassList(node);
}
function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
    add: function(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
            this._names.push(name);
            this._node.setAttribute("class", this._names.join(" "));
        }
    },
    remove: function(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
            this._names.splice(i, 1);
            this._node.setAttribute("class", this._names.join(" "));
        }
    },
    contains: function(name) {
        return this._names.indexOf(name) >= 0;
    }
};
function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while(++i < n)list.add(names[i]);
}
function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while(++i < n)list.remove(names[i]);
}
function classedTrue(names) {
    return function() {
        classedAdd(this, names);
    };
}
function classedFalse(names) {
    return function() {
        classedRemove(this, names);
    };
}
function classedFunction(names, value) {
    return function() {
        (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
}
function __TURBOPACK__default__export__(name, value) {
    var names = classArray(name + "");
    if (arguments.length < 2) {
        var list = classList(this.node()), i = -1, n = names.length;
        while(++i < n)if (!list.contains(names[i])) return false;
        return true;
    }
    return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/clone.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function __TURBOPACK__default__export__(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/data.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$enter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/enter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/constant.js [app-client] (ecmascript)");
;
;
;
function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0, node, groupLength = group.length, dataLength = data.length;
    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for(; i < dataLength; ++i){
        if (node = group[i]) {
            node.__data__ = data[i];
            update[i] = node;
        } else {
            enter[i] = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$enter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EnterNode"](parent, data[i]);
        }
    }
    // Put any non-null nodes that don’t fit into exit.
    for(; i < groupLength; ++i){
        if (node = group[i]) {
            exit[i] = node;
        }
    }
}
function bindKey(parent, group, enter, update, exit, data, key) {
    var i, node, nodeByKeyValue = new Map, groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for(i = 0; i < groupLength; ++i){
        if (node = group[i]) {
            keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
            if (nodeByKeyValue.has(keyValue)) {
                exit[i] = node;
            } else {
                nodeByKeyValue.set(keyValue, node);
            }
        }
    }
    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for(i = 0; i < dataLength; ++i){
        keyValue = key.call(parent, data[i], i, data) + "";
        if (node = nodeByKeyValue.get(keyValue)) {
            update[i] = node;
            node.__data__ = data[i];
            nodeByKeyValue.delete(keyValue);
        } else {
            enter[i] = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$enter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EnterNode"](parent, data[i]);
        }
    }
    // Add any remaining nodes that were not bound to data to exit.
    for(i = 0; i < groupLength; ++i){
        if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
            exit[i] = node;
        }
    }
}
function datum(node) {
    return node.__data__;
}
function __TURBOPACK__default__export__(value, key) {
    if (!arguments.length) return Array.from(this, datum);
    var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
    if (typeof value !== "function") value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(value);
    for(var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j){
        var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        for(var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0){
            if (previous = enterGroup[i0]) {
                if (i0 >= i1) i1 = i0 + 1;
                while(!(next = updateGroup[i1]) && ++i1 < dataLength);
                previous._next = next || null;
            }
        }
    }
    update = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"](update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
}
// Given some data, this returns an array-like view of it: an object that
// exposes a length property and allows numeric indexing. Note that unlike
// selectAll, this isn’t worried about “live” collections because the resulting
// array will only be used briefly while data is being bound. (It is possible to
// cause the data to change while iterating by using a key function, but please
// don’t; we’d rather avoid a gratuitous copy.)
function arraylike(data) {
    return typeof data === "object" && "length" in data ? data // Array, TypedArray, NodeList, array-like
     : Array.from(data); // Map, Set, iterable, string, or anything else
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/datum.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(value) {
    return arguments.length ? this.property("__data__", value) : this.node().__data__;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/dispatch.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$window$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/window.js [app-client] (ecmascript)");
;
function dispatchEvent(node, type, params) {
    var window = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$window$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(node), event = window.CustomEvent;
    if (typeof event === "function") {
        event = new event(type, params);
    } else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
        else event.initEvent(type, false, false);
    }
    node.dispatchEvent(event);
}
function dispatchConstant(type, params) {
    return function() {
        return dispatchEvent(this, type, params);
    };
}
function dispatchFunction(type, params) {
    return function() {
        return dispatchEvent(this, type, params.apply(this, arguments));
    };
}
function __TURBOPACK__default__export__(type, params) {
    return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/each.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(callback) {
    for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j){
        for(var group = groups[j], i = 0, n = group.length, node; i < n; ++i){
            if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
    }
    return this;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/empty.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {
    return !this.node();
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/enter.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EnterNode",
    ()=>EnterNode,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$sparse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/sparse.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
;
;
function __TURBOPACK__default__export__() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"](this._enter || this._groups.map(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$sparse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]), this._parents);
}
function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
}
EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) {
        return this._parent.insertBefore(child, this._next);
    },
    insertBefore: function(child, next) {
        return this._parent.insertBefore(child, next);
    },
    querySelector: function(selector) {
        return this._parent.querySelector(selector);
    },
    querySelectorAll: function(selector) {
        return this._parent.querySelectorAll(selector);
    }
};
}),
"[project]/frontend/node_modules/d3-selection/src/selection/exit.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$sparse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/sparse.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
;
;
function __TURBOPACK__default__export__() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"](this._exit || this._groups.map(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$sparse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]), this._parents);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/filter.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/matcher.js [app-client] (ecmascript)");
;
;
function __TURBOPACK__default__export__(match) {
    if (typeof match !== "function") match = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(match);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i){
            if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
                subgroup.push(node);
            }
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"](subgroups, this._parents);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/html.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function htmlRemove() {
    this.innerHTML = "";
}
function htmlConstant(value) {
    return function() {
        this.innerHTML = value;
    };
}
function htmlFunction(value) {
    return function() {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
    };
}
function __TURBOPACK__default__export__(value) {
    return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Selection",
    ()=>Selection,
    "default",
    ()=>__TURBOPACK__default__export__,
    "root",
    ()=>root
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/select.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$selectAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/selectAll.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$selectChild$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/selectChild.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$selectChildren$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/selectChildren.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/filter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$data$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/data.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$enter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/enter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$exit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/exit.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$join$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/join.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/merge.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$order$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/order.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$sort$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/sort.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$call$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/call.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$nodes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/nodes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$node$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/node.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$size$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/size.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$empty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/empty.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$each$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/each.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$attr$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/attr.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$classed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/classed.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/text.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/html.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$raise$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/raise.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$lower$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/lower.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$append$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/append.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$insert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/insert.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$remove$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/remove.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$clone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/clone.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$datum$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/datum.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$on$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/on.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/dispatch.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$iterator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/iterator.js [app-client] (ecmascript)");
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
var root = [
    null
];
function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
}
function selection() {
    return new Selection([
        [
            document.documentElement
        ]
    ], root);
}
function selection_selection() {
    return this;
}
Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    selectAll: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$selectAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    selectChild: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$selectChild$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    selectChildren: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$selectChildren$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    filter: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    data: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$data$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    enter: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$enter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    exit: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$exit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    join: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$join$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    merge: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    selection: selection_selection,
    order: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$order$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    sort: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$sort$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    call: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$call$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    nodes: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$nodes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    node: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$node$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    size: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$size$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    empty: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$empty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    each: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$each$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    attr: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$attr$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    style: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    property: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    classed: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$classed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    text: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    html: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    raise: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$raise$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    lower: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$lower$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    append: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$append$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    insert: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$insert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    remove: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$remove$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    clone: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$clone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    datum: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$datum$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    on: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$on$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    dispatch: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    [Symbol.iterator]: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$iterator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
};
const __TURBOPACK__default__export__ = selection;
}),
"[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript) <export default as selection>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "selection",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/selection/insert.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$creator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/creator.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selector.js [app-client] (ecmascript)");
;
;
function constantNull() {
    return null;
}
function __TURBOPACK__default__export__(name, before) {
    var create = typeof name === "function" ? name : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$creator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(name), select = before == null ? constantNull : typeof before === "function" ? before : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(before);
    return this.select(function() {
        return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    });
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/iterator.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function* __TURBOPACK__default__export__() {
    for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j){
        for(var group = groups[j], i = 0, n = group.length, node; i < n; ++i){
            if (node = group[i]) yield node;
        }
    }
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/join.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    if (typeof onenter === "function") {
        enter = onenter(enter);
        if (enter) enter = enter.selection();
    } else {
        enter = enter.append(onenter + "");
    }
    if (onupdate != null) {
        update = onupdate(update);
        if (update) update = update.selection();
    }
    if (onexit == null) exit.remove();
    else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/lower.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function __TURBOPACK__default__export__() {
    return this.each(lower);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/merge.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(context) {
    var selection = context.selection ? context.selection() : context;
    for(var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j){
        for(var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i){
            if (node = group0[i] || group1[i]) {
                merge[i] = node;
            }
        }
    }
    for(; j < m0; ++j){
        merges[j] = groups0[j];
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"](merges, this._parents);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/node.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {
    for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j){
        for(var group = groups[j], i = 0, n = group.length; i < n; ++i){
            var node = group[i];
            if (node) return node;
        }
    }
    return null;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/nodes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {
    return Array.from(this);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/on.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function contextListener(listener) {
    return function(event) {
        listener.call(this, event, this.__data__);
    };
}
function parseTypenames(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return {
            type: t,
            name: name
        };
    });
}
function onRemove(typename) {
    return function() {
        var on = this.__on;
        if (!on) return;
        for(var j = 0, i = -1, m = on.length, o; j < m; ++j){
            if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
                this.removeEventListener(o.type, o.listener, o.options);
            } else {
                on[++i] = o;
            }
        }
        if (++i) on.length = i;
        else delete this.__on;
    };
}
function onAdd(typename, value, options) {
    return function() {
        var on = this.__on, o, listener = contextListener(value);
        if (on) for(var j = 0, m = on.length; j < m; ++j){
            if ((o = on[j]).type === typename.type && o.name === typename.name) {
                this.removeEventListener(o.type, o.listener, o.options);
                this.addEventListener(o.type, o.listener = listener, o.options = options);
                o.value = value;
                return;
            }
        }
        this.addEventListener(typename.type, listener, options);
        o = {
            type: typename.type,
            name: typename.name,
            value: value,
            listener: listener,
            options: options
        };
        if (!on) this.__on = [
            o
        ];
        else on.push(o);
    };
}
function __TURBOPACK__default__export__(typename, value, options) {
    var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;
    if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for(var j = 0, m = on.length, o; j < m; ++j){
            for(i = 0, o = on[j]; i < n; ++i){
                if ((t = typenames[i]).type === o.type && t.name === o.name) {
                    return o.value;
                }
            }
        }
        return;
    }
    on = value ? onAdd : onRemove;
    for(i = 0; i < n; ++i)this.each(on(typenames[i], value, options));
    return this;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/order.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {
    for(var groups = this._groups, j = -1, m = groups.length; ++j < m;){
        for(var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;){
            if (node = group[i]) {
                if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
                next = node;
            }
        }
    }
    return this;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/property.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function propertyRemove(name) {
    return function() {
        delete this[name];
    };
}
function propertyConstant(name, value) {
    return function() {
        this[name] = value;
    };
}
function propertyFunction(name, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];
        else this[name] = v;
    };
}
function __TURBOPACK__default__export__(name, value) {
    return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/raise.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
}
function __TURBOPACK__default__export__() {
    return this.each(raise);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/remove.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
}
function __TURBOPACK__default__export__() {
    return this.each(remove);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/select.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selector.js [app-client] (ecmascript)");
;
;
function __TURBOPACK__default__export__(select) {
    if (typeof select !== "function") select = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(select);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i){
            if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
                if ("__data__" in node) subnode.__data__ = node.__data__;
                subgroup[i] = subnode;
            }
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"](subgroups, this._parents);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/selectAll.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/array.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selectorAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selectorAll.js [app-client] (ecmascript)");
;
;
;
function arrayAll(select) {
    return function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(select.apply(this, arguments));
    };
}
function __TURBOPACK__default__export__(select) {
    if (typeof select === "function") select = arrayAll(select);
    else select = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selectorAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(select);
    for(var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
            if (node = group[i]) {
                subgroups.push(select.call(node, node.__data__, i, group));
                parents.push(node);
            }
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"](subgroups, parents);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/selectChild.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/matcher.js [app-client] (ecmascript)");
;
var find = Array.prototype.find;
function childFind(match) {
    return function() {
        return find.call(this.children, match);
    };
}
function childFirst() {
    return this.firstElementChild;
}
function __TURBOPACK__default__export__(match) {
    return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["childMatcher"])(match)));
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/selectChildren.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/matcher.js [app-client] (ecmascript)");
;
var filter = Array.prototype.filter;
function children() {
    return Array.from(this.children);
}
function childrenFilter(match) {
    return function() {
        return filter.call(this.children, match);
    };
}
function __TURBOPACK__default__export__(match) {
    return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["childMatcher"])(match)));
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/size.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {
    let size = 0;
    for (const node of this)++size; // eslint-disable-line no-unused-vars
    return size;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/sort.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(compare) {
    if (!compare) compare = ascending;
    function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }
    for(var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i){
            if (node = group[i]) {
                sortgroup[i] = node;
            }
        }
        sortgroup.sort(compareNode);
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"](sortgroups, this._parents).order();
}
function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/sparse.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(update) {
    return new Array(update.length);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/style.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "styleValue",
    ()=>styleValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$window$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/window.js [app-client] (ecmascript)");
;
function styleRemove(name) {
    return function() {
        this.style.removeProperty(name);
    };
}
function styleConstant(name, value, priority) {
    return function() {
        this.style.setProperty(name, value, priority);
    };
}
function styleFunction(name, value, priority) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
    };
}
function __TURBOPACK__default__export__(name, value, priority) {
    return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
    return node.style.getPropertyValue(name) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$window$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(node).getComputedStyle(node, null).getPropertyValue(name);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/style.js [app-client] (ecmascript) <export styleValue as style>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "style",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["styleValue"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/style.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/selection/text.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function textRemove() {
    this.textContent = "";
}
function textConstant(value) {
    return function() {
        this.textContent = value;
    };
}
function textFunction(value) {
    return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
    };
}
function __TURBOPACK__default__export__(value) {
    return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selector.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function none() {}
function __TURBOPACK__default__export__(selector) {
    return selector == null ? none : function() {
        return this.querySelector(selector);
    };
}
}),
"[project]/frontend/node_modules/d3-selection/src/selector.js [app-client] (ecmascript) <export default as selector>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "selector",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selector.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/selectorAll.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function empty() {
    return [];
}
function __TURBOPACK__default__export__(selector) {
    return selector == null ? empty : function() {
        return this.querySelectorAll(selector);
    };
}
}),
"[project]/frontend/node_modules/d3-selection/src/selectorAll.js [app-client] (ecmascript) <export default as selectorAll>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "selectorAll",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selectorAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selectorAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selectorAll.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/sourceEvent.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(event) {
    let sourceEvent;
    while(sourceEvent = event.sourceEvent)event = sourceEvent;
    return event;
}
}),
"[project]/frontend/node_modules/d3-selection/src/window.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(node) {
    return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView; // node is a Document
}
}),
"[project]/frontend/node_modules/d3-shape/src/curve/basis.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Basis",
    ()=>Basis,
    "default",
    ()=>__TURBOPACK__default__export__,
    "point",
    ()=>point
]);
function point(that, x, y) {
    that._context.bezierCurveTo((2 * that._x0 + that._x1) / 3, (2 * that._y0 + that._y1) / 3, (that._x0 + 2 * that._x1) / 3, (that._y0 + 2 * that._y1) / 3, (that._x0 + 4 * that._x1 + x) / 6, (that._y0 + 4 * that._y1 + y) / 6);
}
function Basis(context) {
    this._context = context;
}
Basis.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x0 = this._x1 = this._y0 = this._y1 = NaN;
        this._point = 0;
    },
    lineEnd: function() {
        switch(this._point){
            case 3:
                point(this, this._x1, this._y1); // falls through
            case 2:
                this._context.lineTo(this._x1, this._y1);
                break;
        }
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        this._line = 1 - this._line;
    },
    point: function(x, y) {
        x = +x, y = +y;
        switch(this._point){
            case 0:
                this._point = 1;
                this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
                break;
            case 1:
                this._point = 2;
                break;
            case 2:
                this._point = 3;
                this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // falls through
            default:
                point(this, x, y);
                break;
        }
        this._x0 = this._x1, this._x1 = x;
        this._y0 = this._y1, this._y1 = y;
    }
};
function __TURBOPACK__default__export__(context) {
    return new Basis(context);
}
}),
"[project]/frontend/node_modules/d3-shape/src/curve/basis.js [app-client] (ecmascript) <export default as curveBasis>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveBasis",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/basis.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/basisClosed.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$noop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/noop.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/basis.js [app-client] (ecmascript)");
;
;
function BasisClosed(context) {
    this._context = context;
}
BasisClosed.prototype = {
    areaStart: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$noop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    areaEnd: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$noop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN;
        this._point = 0;
    },
    lineEnd: function() {
        switch(this._point){
            case 1:
                {
                    this._context.moveTo(this._x2, this._y2);
                    this._context.closePath();
                    break;
                }
            case 2:
                {
                    this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3);
                    this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3);
                    this._context.closePath();
                    break;
                }
            case 3:
                {
                    this.point(this._x2, this._y2);
                    this.point(this._x3, this._y3);
                    this.point(this._x4, this._y4);
                    break;
                }
        }
    },
    point: function(x, y) {
        x = +x, y = +y;
        switch(this._point){
            case 0:
                this._point = 1;
                this._x2 = x, this._y2 = y;
                break;
            case 1:
                this._point = 2;
                this._x3 = x, this._y3 = y;
                break;
            case 2:
                this._point = 3;
                this._x4 = x, this._y4 = y;
                this._context.moveTo((this._x0 + 4 * this._x1 + x) / 6, (this._y0 + 4 * this._y1 + y) / 6);
                break;
            default:
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["point"])(this, x, y);
                break;
        }
        this._x0 = this._x1, this._x1 = x;
        this._y0 = this._y1, this._y1 = y;
    }
};
function __TURBOPACK__default__export__(context) {
    return new BasisClosed(context);
}
}),
"[project]/frontend/node_modules/d3-shape/src/curve/basisClosed.js [app-client] (ecmascript) <export default as curveBasisClosed>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveBasisClosed",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basisClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basisClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/basisClosed.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/basisOpen.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/basis.js [app-client] (ecmascript)");
;
function BasisOpen(context) {
    this._context = context;
}
BasisOpen.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x0 = this._x1 = this._y0 = this._y1 = NaN;
        this._point = 0;
    },
    lineEnd: function() {
        if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
        this._line = 1 - this._line;
    },
    point: function(x, y) {
        x = +x, y = +y;
        switch(this._point){
            case 0:
                this._point = 1;
                break;
            case 1:
                this._point = 2;
                break;
            case 2:
                this._point = 3;
                var x0 = (this._x0 + 4 * this._x1 + x) / 6, y0 = (this._y0 + 4 * this._y1 + y) / 6;
                this._line ? this._context.lineTo(x0, y0) : this._context.moveTo(x0, y0);
                break;
            case 3:
                this._point = 4; // falls through
            default:
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["point"])(this, x, y);
                break;
        }
        this._x0 = this._x1, this._x1 = x;
        this._y0 = this._y1, this._y1 = y;
    }
};
function __TURBOPACK__default__export__(context) {
    return new BasisOpen(context);
}
}),
"[project]/frontend/node_modules/d3-shape/src/curve/basisOpen.js [app-client] (ecmascript) <export default as curveBasisOpen>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveBasisOpen",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basisOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basisOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/basisOpen.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/bump.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bumpRadial",
    ()=>bumpRadial,
    "bumpX",
    ()=>bumpX,
    "bumpY",
    ()=>bumpY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$pointRadial$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/pointRadial.js [app-client] (ecmascript)");
;
class Bump {
    constructor(context, x){
        this._context = context;
        this._x = x;
    }
    areaStart() {
        this._line = 0;
    }
    areaEnd() {
        this._line = NaN;
    }
    lineStart() {
        this._point = 0;
    }
    lineEnd() {
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        this._line = 1 - this._line;
    }
    point(x, y) {
        x = +x, y = +y;
        switch(this._point){
            case 0:
                {
                    this._point = 1;
                    if (this._line) this._context.lineTo(x, y);
                    else this._context.moveTo(x, y);
                    break;
                }
            case 1:
                this._point = 2; // falls through
            default:
                {
                    if (this._x) this._context.bezierCurveTo(this._x0 = (this._x0 + x) / 2, this._y0, this._x0, y, x, y);
                    else this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + y) / 2, x, this._y0, x, y);
                    break;
                }
        }
        this._x0 = x, this._y0 = y;
    }
}
class BumpRadial {
    constructor(context){
        this._context = context;
    }
    lineStart() {
        this._point = 0;
    }
    lineEnd() {}
    point(x, y) {
        x = +x, y = +y;
        if (this._point === 0) {
            this._point = 1;
        } else {
            const p0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$pointRadial$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(this._x0, this._y0);
            const p1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$pointRadial$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(this._x0, this._y0 = (this._y0 + y) / 2);
            const p2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$pointRadial$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(x, this._y0);
            const p3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$pointRadial$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(x, y);
            this._context.moveTo(...p0);
            this._context.bezierCurveTo(...p1, ...p2, ...p3);
        }
        this._x0 = x, this._y0 = y;
    }
}
function bumpX(context) {
    return new Bump(context, true);
}
function bumpY(context) {
    return new Bump(context, false);
}
function bumpRadial(context) {
    return new BumpRadial(context);
}
}),
"[project]/frontend/node_modules/d3-shape/src/curve/bump.js [app-client] (ecmascript) <export bumpX as curveBumpX>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveBumpX",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bump$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bumpX"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bump$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/bump.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/bump.js [app-client] (ecmascript) <export bumpY as curveBumpY>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveBumpY",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bump$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bumpY"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bump$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/bump.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/bundle.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/basis.js [app-client] (ecmascript)");
;
function Bundle(context, beta) {
    this._basis = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Basis"](context);
    this._beta = beta;
}
Bundle.prototype = {
    lineStart: function() {
        this._x = [];
        this._y = [];
        this._basis.lineStart();
    },
    lineEnd: function() {
        var x = this._x, y = this._y, j = x.length - 1;
        if (j > 0) {
            var x0 = x[0], y0 = y[0], dx = x[j] - x0, dy = y[j] - y0, i = -1, t;
            while(++i <= j){
                t = i / j;
                this._basis.point(this._beta * x[i] + (1 - this._beta) * (x0 + t * dx), this._beta * y[i] + (1 - this._beta) * (y0 + t * dy));
            }
        }
        this._x = this._y = null;
        this._basis.lineEnd();
    },
    point: function(x, y) {
        this._x.push(+x);
        this._y.push(+y);
    }
};
const __TURBOPACK__default__export__ = function custom(beta) {
    function bundle(context) {
        return beta === 1 ? new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Basis"](context) : new Bundle(context, beta);
    }
    bundle.beta = function(beta) {
        return custom(+beta);
    };
    return bundle;
}(0.85);
}),
"[project]/frontend/node_modules/d3-shape/src/curve/bundle.js [app-client] (ecmascript) <export default as curveBundle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveBundle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bundle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bundle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/bundle.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/cardinal.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Cardinal",
    ()=>Cardinal,
    "default",
    ()=>__TURBOPACK__default__export__,
    "point",
    ()=>point
]);
function point(that, x, y) {
    that._context.bezierCurveTo(that._x1 + that._k * (that._x2 - that._x0), that._y1 + that._k * (that._y2 - that._y0), that._x2 + that._k * (that._x1 - x), that._y2 + that._k * (that._y1 - y), that._x2, that._y2);
}
function Cardinal(context, tension) {
    this._context = context;
    this._k = (1 - tension) / 6;
}
Cardinal.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
        this._point = 0;
    },
    lineEnd: function() {
        switch(this._point){
            case 2:
                this._context.lineTo(this._x2, this._y2);
                break;
            case 3:
                point(this, this._x1, this._y1);
                break;
        }
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        this._line = 1 - this._line;
    },
    point: function(x, y) {
        x = +x, y = +y;
        switch(this._point){
            case 0:
                this._point = 1;
                this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
                break;
            case 1:
                this._point = 2;
                this._x1 = x, this._y1 = y;
                break;
            case 2:
                this._point = 3; // falls through
            default:
                point(this, x, y);
                break;
        }
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
};
const __TURBOPACK__default__export__ = function custom(tension) {
    function cardinal(context) {
        return new Cardinal(context, tension);
    }
    cardinal.tension = function(tension) {
        return custom(+tension);
    };
    return cardinal;
}(0);
}),
"[project]/frontend/node_modules/d3-shape/src/curve/cardinal.js [app-client] (ecmascript) <export default as curveCardinal>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveCardinal",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/cardinal.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/cardinalClosed.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CardinalClosed",
    ()=>CardinalClosed,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$noop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/noop.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/cardinal.js [app-client] (ecmascript)");
;
;
function CardinalClosed(context, tension) {
    this._context = context;
    this._k = (1 - tension) / 6;
}
CardinalClosed.prototype = {
    areaStart: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$noop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    areaEnd: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$noop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
        this._point = 0;
    },
    lineEnd: function() {
        switch(this._point){
            case 1:
                {
                    this._context.moveTo(this._x3, this._y3);
                    this._context.closePath();
                    break;
                }
            case 2:
                {
                    this._context.lineTo(this._x3, this._y3);
                    this._context.closePath();
                    break;
                }
            case 3:
                {
                    this.point(this._x3, this._y3);
                    this.point(this._x4, this._y4);
                    this.point(this._x5, this._y5);
                    break;
                }
        }
    },
    point: function(x, y) {
        x = +x, y = +y;
        switch(this._point){
            case 0:
                this._point = 1;
                this._x3 = x, this._y3 = y;
                break;
            case 1:
                this._point = 2;
                this._context.moveTo(this._x4 = x, this._y4 = y);
                break;
            case 2:
                this._point = 3;
                this._x5 = x, this._y5 = y;
                break;
            default:
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["point"])(this, x, y);
                break;
        }
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
};
const __TURBOPACK__default__export__ = function custom(tension) {
    function cardinal(context) {
        return new CardinalClosed(context, tension);
    }
    cardinal.tension = function(tension) {
        return custom(+tension);
    };
    return cardinal;
}(0);
}),
"[project]/frontend/node_modules/d3-shape/src/curve/cardinalClosed.js [app-client] (ecmascript) <export default as curveCardinalClosed>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveCardinalClosed",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinalClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinalClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/cardinalClosed.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/cardinalOpen.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CardinalOpen",
    ()=>CardinalOpen,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/cardinal.js [app-client] (ecmascript)");
;
function CardinalOpen(context, tension) {
    this._context = context;
    this._k = (1 - tension) / 6;
}
CardinalOpen.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
        this._point = 0;
    },
    lineEnd: function() {
        if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
        this._line = 1 - this._line;
    },
    point: function(x, y) {
        x = +x, y = +y;
        switch(this._point){
            case 0:
                this._point = 1;
                break;
            case 1:
                this._point = 2;
                break;
            case 2:
                this._point = 3;
                this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
                break;
            case 3:
                this._point = 4; // falls through
            default:
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["point"])(this, x, y);
                break;
        }
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
};
const __TURBOPACK__default__export__ = function custom(tension) {
    function cardinal(context) {
        return new CardinalOpen(context, tension);
    }
    cardinal.tension = function(tension) {
        return custom(+tension);
    };
    return cardinal;
}(0);
}),
"[project]/frontend/node_modules/d3-shape/src/curve/cardinalOpen.js [app-client] (ecmascript) <export default as curveCardinalOpen>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveCardinalOpen",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinalOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinalOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/cardinalOpen.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/catmullRom.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "point",
    ()=>point
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$math$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/math.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/cardinal.js [app-client] (ecmascript)");
;
;
function point(that, x, y) {
    var x1 = that._x1, y1 = that._y1, x2 = that._x2, y2 = that._y2;
    if (that._l01_a > __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$math$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["epsilon"]) {
        var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a, n = 3 * that._l01_a * (that._l01_a + that._l12_a);
        x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
        y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
    }
    if (that._l23_a > __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$math$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["epsilon"]) {
        var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a, m = 3 * that._l23_a * (that._l23_a + that._l12_a);
        x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
        y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
    }
    that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
}
function CatmullRom(context, alpha) {
    this._context = context;
    this._alpha = alpha;
}
CatmullRom.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
        this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
    },
    lineEnd: function() {
        switch(this._point){
            case 2:
                this._context.lineTo(this._x2, this._y2);
                break;
            case 3:
                this.point(this._x2, this._y2);
                break;
        }
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        this._line = 1 - this._line;
    },
    point: function(x, y) {
        x = +x, y = +y;
        if (this._point) {
            var x23 = this._x2 - x, y23 = this._y2 - y;
            this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
        }
        switch(this._point){
            case 0:
                this._point = 1;
                this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
                break;
            case 1:
                this._point = 2;
                break;
            case 2:
                this._point = 3; // falls through
            default:
                point(this, x, y);
                break;
        }
        this._l01_a = this._l12_a, this._l12_a = this._l23_a;
        this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
};
const __TURBOPACK__default__export__ = function custom(alpha) {
    function catmullRom(context) {
        return alpha ? new CatmullRom(context, alpha) : new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cardinal"](context, 0);
    }
    catmullRom.alpha = function(alpha) {
        return custom(+alpha);
    };
    return catmullRom;
}(0.5);
}),
"[project]/frontend/node_modules/d3-shape/src/curve/catmullRom.js [app-client] (ecmascript) <export default as curveCatmullRom>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveCatmullRom",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/catmullRom.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/catmullRomClosed.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinalClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/cardinalClosed.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$noop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/noop.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/catmullRom.js [app-client] (ecmascript)");
;
;
;
function CatmullRomClosed(context, alpha) {
    this._context = context;
    this._alpha = alpha;
}
CatmullRomClosed.prototype = {
    areaStart: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$noop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    areaEnd: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$noop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
        this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
    },
    lineEnd: function() {
        switch(this._point){
            case 1:
                {
                    this._context.moveTo(this._x3, this._y3);
                    this._context.closePath();
                    break;
                }
            case 2:
                {
                    this._context.lineTo(this._x3, this._y3);
                    this._context.closePath();
                    break;
                }
            case 3:
                {
                    this.point(this._x3, this._y3);
                    this.point(this._x4, this._y4);
                    this.point(this._x5, this._y5);
                    break;
                }
        }
    },
    point: function(x, y) {
        x = +x, y = +y;
        if (this._point) {
            var x23 = this._x2 - x, y23 = this._y2 - y;
            this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
        }
        switch(this._point){
            case 0:
                this._point = 1;
                this._x3 = x, this._y3 = y;
                break;
            case 1:
                this._point = 2;
                this._context.moveTo(this._x4 = x, this._y4 = y);
                break;
            case 2:
                this._point = 3;
                this._x5 = x, this._y5 = y;
                break;
            default:
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["point"])(this, x, y);
                break;
        }
        this._l01_a = this._l12_a, this._l12_a = this._l23_a;
        this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
};
const __TURBOPACK__default__export__ = function custom(alpha) {
    function catmullRom(context) {
        return alpha ? new CatmullRomClosed(context, alpha) : new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinalClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardinalClosed"](context, 0);
    }
    catmullRom.alpha = function(alpha) {
        return custom(+alpha);
    };
    return catmullRom;
}(0.5);
}),
"[project]/frontend/node_modules/d3-shape/src/curve/catmullRomClosed.js [app-client] (ecmascript) <export default as curveCatmullRomClosed>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveCatmullRomClosed",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRomClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRomClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/catmullRomClosed.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/catmullRomOpen.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinalOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/cardinalOpen.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/catmullRom.js [app-client] (ecmascript)");
;
;
function CatmullRomOpen(context, alpha) {
    this._context = context;
    this._alpha = alpha;
}
CatmullRomOpen.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
        this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
    },
    lineEnd: function() {
        if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
        this._line = 1 - this._line;
    },
    point: function(x, y) {
        x = +x, y = +y;
        if (this._point) {
            var x23 = this._x2 - x, y23 = this._y2 - y;
            this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
        }
        switch(this._point){
            case 0:
                this._point = 1;
                break;
            case 1:
                this._point = 2;
                break;
            case 2:
                this._point = 3;
                this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
                break;
            case 3:
                this._point = 4; // falls through
            default:
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["point"])(this, x, y);
                break;
        }
        this._l01_a = this._l12_a, this._l12_a = this._l23_a;
        this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
};
const __TURBOPACK__default__export__ = function custom(alpha) {
    function catmullRom(context) {
        return alpha ? new CatmullRomOpen(context, alpha) : new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinalOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardinalOpen"](context, 0);
    }
    catmullRom.alpha = function(alpha) {
        return custom(+alpha);
    };
    return catmullRom;
}(0.5);
}),
"[project]/frontend/node_modules/d3-shape/src/curve/catmullRomOpen.js [app-client] (ecmascript) <export default as curveCatmullRomOpen>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveCatmullRomOpen",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRomOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRomOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/catmullRomOpen.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/linear.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function Linear(context) {
    this._context = context;
}
Linear.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._point = 0;
    },
    lineEnd: function() {
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        this._line = 1 - this._line;
    },
    point: function(x, y) {
        x = +x, y = +y;
        switch(this._point){
            case 0:
                this._point = 1;
                this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
                break;
            case 1:
                this._point = 2; // falls through
            default:
                this._context.lineTo(x, y);
                break;
        }
    }
};
function __TURBOPACK__default__export__(context) {
    return new Linear(context);
}
}),
"[project]/frontend/node_modules/d3-shape/src/curve/linear.js [app-client] (ecmascript) <export default as curveLinear>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveLinear",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$linear$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$linear$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/linear.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/linearClosed.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$noop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/noop.js [app-client] (ecmascript)");
;
function LinearClosed(context) {
    this._context = context;
}
LinearClosed.prototype = {
    areaStart: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$noop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    areaEnd: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$noop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    lineStart: function() {
        this._point = 0;
    },
    lineEnd: function() {
        if (this._point) this._context.closePath();
    },
    point: function(x, y) {
        x = +x, y = +y;
        if (this._point) this._context.lineTo(x, y);
        else this._point = 1, this._context.moveTo(x, y);
    }
};
function __TURBOPACK__default__export__(context) {
    return new LinearClosed(context);
}
}),
"[project]/frontend/node_modules/d3-shape/src/curve/linearClosed.js [app-client] (ecmascript) <export default as curveLinearClosed>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveLinearClosed",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$linearClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$linearClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/linearClosed.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/monotone.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "monotoneX",
    ()=>monotoneX,
    "monotoneY",
    ()=>monotoneY
]);
function sign(x) {
    return x < 0 ? -1 : 1;
}
// Calculate the slopes of the tangents (Hermite-type interpolation) based on
// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
// NOV(II), P. 443, 1990.
function slope3(that, x2, y2) {
    var h0 = that._x1 - that._x0, h1 = x2 - that._x1, s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0), s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0), p = (s0 * h1 + s1 * h0) / (h0 + h1);
    return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
}
// Calculate a one-sided slope.
function slope2(that, t) {
    var h = that._x1 - that._x0;
    return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
}
// According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
// "you can express cubic Hermite interpolation in terms of cubic Bézier curves
// with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
function point(that, t0, t1) {
    var x0 = that._x0, y0 = that._y0, x1 = that._x1, y1 = that._y1, dx = (x1 - x0) / 3;
    that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
}
function MonotoneX(context) {
    this._context = context;
}
MonotoneX.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
        this._point = 0;
    },
    lineEnd: function() {
        switch(this._point){
            case 2:
                this._context.lineTo(this._x1, this._y1);
                break;
            case 3:
                point(this, this._t0, slope2(this, this._t0));
                break;
        }
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        this._line = 1 - this._line;
    },
    point: function(x, y) {
        var t1 = NaN;
        x = +x, y = +y;
        if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
        switch(this._point){
            case 0:
                this._point = 1;
                this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
                break;
            case 1:
                this._point = 2;
                break;
            case 2:
                this._point = 3;
                point(this, slope2(this, t1 = slope3(this, x, y)), t1);
                break;
            default:
                point(this, this._t0, t1 = slope3(this, x, y));
                break;
        }
        this._x0 = this._x1, this._x1 = x;
        this._y0 = this._y1, this._y1 = y;
        this._t0 = t1;
    }
};
function MonotoneY(context) {
    this._context = new ReflectContext(context);
}
(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
    MonotoneX.prototype.point.call(this, y, x);
};
function ReflectContext(context) {
    this._context = context;
}
ReflectContext.prototype = {
    moveTo: function(x, y) {
        this._context.moveTo(y, x);
    },
    closePath: function() {
        this._context.closePath();
    },
    lineTo: function(x, y) {
        this._context.lineTo(y, x);
    },
    bezierCurveTo: function(x1, y1, x2, y2, x, y) {
        this._context.bezierCurveTo(y1, x1, y2, x2, y, x);
    }
};
function monotoneX(context) {
    return new MonotoneX(context);
}
function monotoneY(context) {
    return new MonotoneY(context);
}
}),
"[project]/frontend/node_modules/d3-shape/src/curve/monotone.js [app-client] (ecmascript) <export monotoneX as curveMonotoneX>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveMonotoneX",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["monotoneX"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/monotone.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/monotone.js [app-client] (ecmascript) <export monotoneY as curveMonotoneY>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveMonotoneY",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["monotoneY"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/monotone.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/natural.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function Natural(context) {
    this._context = context;
}
Natural.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x = [];
        this._y = [];
    },
    lineEnd: function() {
        var x = this._x, y = this._y, n = x.length;
        if (n) {
            this._line ? this._context.lineTo(x[0], y[0]) : this._context.moveTo(x[0], y[0]);
            if (n === 2) {
                this._context.lineTo(x[1], y[1]);
            } else {
                var px = controlPoints(x), py = controlPoints(y);
                for(var i0 = 0, i1 = 1; i1 < n; ++i0, ++i1){
                    this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x[i1], y[i1]);
                }
            }
        }
        if (this._line || this._line !== 0 && n === 1) this._context.closePath();
        this._line = 1 - this._line;
        this._x = this._y = null;
    },
    point: function(x, y) {
        this._x.push(+x);
        this._y.push(+y);
    }
};
// See https://www.particleincell.com/2012/bezier-splines/ for derivation.
function controlPoints(x) {
    var i, n = x.length - 1, m, a = new Array(n), b = new Array(n), r = new Array(n);
    a[0] = 0, b[0] = 2, r[0] = x[0] + 2 * x[1];
    for(i = 1; i < n - 1; ++i)a[i] = 1, b[i] = 4, r[i] = 4 * x[i] + 2 * x[i + 1];
    a[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x[n - 1] + x[n];
    for(i = 1; i < n; ++i)m = a[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];
    a[n - 1] = r[n - 1] / b[n - 1];
    for(i = n - 2; i >= 0; --i)a[i] = (r[i] - a[i + 1]) / b[i];
    b[n - 1] = (x[n] + a[n - 1]) / 2;
    for(i = 0; i < n - 1; ++i)b[i] = 2 * x[i + 1] - a[i + 1];
    return [
        a,
        b
    ];
}
function __TURBOPACK__default__export__(context) {
    return new Natural(context);
}
}),
"[project]/frontend/node_modules/d3-shape/src/curve/natural.js [app-client] (ecmascript) <export default as curveNatural>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveNatural",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$natural$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$natural$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/natural.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/step.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "stepAfter",
    ()=>stepAfter,
    "stepBefore",
    ()=>stepBefore
]);
function Step(context, t) {
    this._context = context;
    this._t = t;
}
Step.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x = this._y = NaN;
        this._point = 0;
    },
    lineEnd: function() {
        if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
    },
    point: function(x, y) {
        x = +x, y = +y;
        switch(this._point){
            case 0:
                this._point = 1;
                this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
                break;
            case 1:
                this._point = 2; // falls through
            default:
                {
                    if (this._t <= 0) {
                        this._context.lineTo(this._x, y);
                        this._context.lineTo(x, y);
                    } else {
                        var x1 = this._x * (1 - this._t) + x * this._t;
                        this._context.lineTo(x1, this._y);
                        this._context.lineTo(x1, y);
                    }
                    break;
                }
        }
        this._x = x, this._y = y;
    }
};
function __TURBOPACK__default__export__(context) {
    return new Step(context, 0.5);
}
function stepBefore(context) {
    return new Step(context, 0);
}
function stepAfter(context) {
    return new Step(context, 1);
}
}),
"[project]/frontend/node_modules/d3-shape/src/curve/step.js [app-client] (ecmascript) <export default as curveStep>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveStep",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/step.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/step.js [app-client] (ecmascript) <export stepAfter as curveStepAfter>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveStepAfter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stepAfter"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/step.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/curve/step.js [app-client] (ecmascript) <export stepBefore as curveStepBefore>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "curveStepBefore",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stepBefore"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/step.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-shape/src/math.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "abs",
    ()=>abs,
    "acos",
    ()=>acos,
    "asin",
    ()=>asin,
    "atan2",
    ()=>atan2,
    "cos",
    ()=>cos,
    "epsilon",
    ()=>epsilon,
    "halfPi",
    ()=>halfPi,
    "max",
    ()=>max,
    "min",
    ()=>min,
    "pi",
    ()=>pi,
    "sin",
    ()=>sin,
    "sqrt",
    ()=>sqrt,
    "tau",
    ()=>tau
]);
const abs = Math.abs;
const atan2 = Math.atan2;
const cos = Math.cos;
const max = Math.max;
const min = Math.min;
const sin = Math.sin;
const sqrt = Math.sqrt;
const epsilon = 1e-12;
const pi = Math.PI;
const halfPi = pi / 2;
const tau = 2 * pi;
function acos(x) {
    return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
}
function asin(x) {
    return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
}
}),
"[project]/frontend/node_modules/d3-shape/src/noop.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {}
}),
"[project]/frontend/node_modules/d3-shape/src/pointRadial.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(x, y) {
    return [
        (y = +y) * Math.cos(x -= Math.PI / 2),
        y * Math.sin(x)
    ];
}
}),
"[project]/frontend/node_modules/d3-timer/src/timeout.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-timer/src/timer.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(callback, delay, time) {
    var t = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Timer"];
    delay = delay == null ? 0 : +delay;
    t.restart((elapsed)=>{
        t.stop();
        callback(elapsed + delay);
    }, delay, time);
    return t;
}
}),
"[project]/frontend/node_modules/d3-timer/src/timeout.js [app-client] (ecmascript) <export default as timeout>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "timeout",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-timer/src/timeout.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-timer/src/timer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Timer",
    ()=>Timer,
    "now",
    ()=>now,
    "timer",
    ()=>timer,
    "timerFlush",
    ()=>timerFlush
]);
var frame = 0, timeout = 0, interval = 0, pokeDelay = 1000, taskHead, taskTail, clockLast = 0, clockNow = 0, clockSkew = 0, clock = typeof performance === "object" && performance.now ? performance : Date, setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
    setTimeout(f, 17);
};
function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
    clockNow = 0;
}
function Timer() {
    this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
        if (typeof callback !== "function") throw new TypeError("callback is not a function");
        time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
        if (!this._next && taskTail !== this) {
            if (taskTail) taskTail._next = this;
            else taskHead = this;
            taskTail = this;
        }
        this._call = callback;
        this._time = time;
        sleep();
    },
    stop: function() {
        if (this._call) {
            this._call = null;
            this._time = Infinity;
            sleep();
        }
    }
};
function timer(callback, delay, time) {
    var t = new Timer;
    t.restart(callback, delay, time);
    return t;
}
function timerFlush() {
    now(); // Get the current time, if not already set.
    ++frame; // Pretend we’ve set an alarm, if we haven’t already.
    var t = taskHead, e;
    while(t){
        if ((e = clockNow - t._time) >= 0) t._call.call(undefined, e);
        t = t._next;
    }
    --frame;
}
function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try {
        timerFlush();
    } finally{
        frame = 0;
        nap();
        clockNow = 0;
    }
}
function poke() {
    var now = clock.now(), delay = now - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}
function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while(t1){
        if (t1._call) {
            if (time > t1._time) time = t1._time;
            t0 = t1, t1 = t1._next;
        } else {
            t2 = t1._next, t1._next = null;
            t1 = t0 ? t0._next = t2 : taskHead = t2;
        }
    }
    taskTail = t0;
    sleep(time);
}
function sleep(time) {
    if (frame) return; // Soonest alarm already set, or will be.
    if (timeout) timeout = clearTimeout(timeout);
    var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
    if (delay > 24) {
        if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
        if (interval) interval = clearInterval(interval);
    } else {
        if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
        frame = 1, setFrame(wake);
    }
}
}),
"[project]/frontend/node_modules/d3-transition/src/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/selection/index.js [app-client] (ecmascript)");
;
;
;
;
}),
"[project]/frontend/node_modules/d3-transition/src/interrupt.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(node, name) {
    var schedules = node.__transition, schedule, active, empty = true, i;
    if (!schedules) return;
    name = name == null ? null : name + "";
    for(i in schedules){
        if ((schedule = schedules[i]).name !== name) {
            empty = false;
            continue;
        }
        active = schedule.state > __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STARTING"] && schedule.state < __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENDING"];
        schedule.state = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENDED"];
        schedule.timer.stop();
        schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
        delete schedules[i];
    }
    if (empty) delete node.__transition;
}
}),
"[project]/frontend/node_modules/d3-transition/src/interrupt.js [app-client] (ecmascript) <export default as interrupt>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "interrupt",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/interrupt.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-transition/src/selection/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selection$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript) <export default as selection>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$selection$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/selection/interrupt.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$selection$2f$transition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/selection/transition.js [app-client] (ecmascript)");
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selection$3e$__["selection"].prototype.interrupt = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$selection$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selection$3e$__["selection"].prototype.transition = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$selection$2f$transition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
}),
"[project]/frontend/node_modules/d3-transition/src/selection/interrupt.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/interrupt.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(name) {
    return this.each(function() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(this, name);
    });
}
}),
"[project]/frontend/node_modules/d3-transition/src/selection/transition.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$ease$2f$src$2f$cubic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__cubicInOut__as__easeCubicInOut$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-ease/src/cubic.js [app-client] (ecmascript) <export cubicInOut as easeCubicInOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-timer/src/timer.js [app-client] (ecmascript)");
;
;
;
;
var defaultTiming = {
    time: null,
    delay: 0,
    duration: 250,
    ease: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$ease$2f$src$2f$cubic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__cubicInOut__as__easeCubicInOut$3e$__["easeCubicInOut"]
};
function inherit(node, id) {
    var timing;
    while(!(timing = node.__transition) || !(timing = timing[id])){
        if (!(node = node.parentNode)) {
            throw new Error(`transition ${id} not found`);
        }
    }
    return timing;
}
function __TURBOPACK__default__export__(name) {
    var id, timing;
    if (name instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"]) {
        id = name._id, name = name._name;
    } else {
        id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["newId"])(), (timing = defaultTiming).time = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["now"])(), name = name == null ? null : name + "";
    }
    for(var groups = this._groups, m = groups.length, j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
            if (node = group[i]) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(node, name, id, i, group, timing || inherit(node, id));
            }
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"](groups, this._parents, name, id);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/attr.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/transform/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__namespace$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/namespace.js [app-client] (ecmascript) <export default as namespace>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$tween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/tween.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$interpolate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/interpolate.js [app-client] (ecmascript)");
;
;
;
;
function attrRemove(name) {
    return function() {
        this.removeAttribute(name);
    };
}
function attrRemoveNS(fullname) {
    return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
    };
}
function attrConstant(name, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
        var string0 = this.getAttribute(name);
        return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
}
function attrConstantNS(fullname, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
        var string0 = this.getAttributeNS(fullname.space, fullname.local);
        return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
}
function attrFunction(name, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
        var string0, value1 = value(this), string1;
        if (value1 == null) return void this.removeAttribute(name);
        string0 = this.getAttribute(name);
        string1 = value1 + "";
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
}
function attrFunctionNS(fullname, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
        var string0, value1 = value(this), string1;
        if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
        string0 = this.getAttributeNS(fullname.space, fullname.local);
        string1 = value1 + "";
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
}
function __TURBOPACK__default__export__(name, value) {
    var fullname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__namespace$3e$__["namespace"])(name), i = fullname === "transform" ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["interpolateTransformSvg"] : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$interpolate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
    return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$tween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenValue"])(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname) : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/attrTween.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__namespace$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/namespace.js [app-client] (ecmascript) <export default as namespace>");
;
function attrInterpolate(name, i) {
    return function(t) {
        this.setAttribute(name, i.call(this, t));
    };
}
function attrInterpolateNS(fullname, i) {
    return function(t) {
        this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
    };
}
function attrTweenNS(fullname, value) {
    var t0, i0;
    function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
        return t0;
    }
    tween._value = value;
    return tween;
}
function attrTween(name, value) {
    var t0, i0;
    function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
        return t0;
    }
    tween._value = value;
    return tween;
}
function __TURBOPACK__default__export__(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    var fullname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__namespace$3e$__["namespace"])(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/delay.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
function delayFunction(id, value) {
    return function() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["init"])(this, id).delay = +value.apply(this, arguments);
    };
}
function delayConstant(id, value) {
    return value = +value, function() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["init"])(this, id).delay = value;
    };
}
function __TURBOPACK__default__export__(value) {
    var id = this._id;
    return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id, value)) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(this.node(), id).delay;
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/duration.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
function durationFunction(id, value) {
    return function() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id).duration = +value.apply(this, arguments);
    };
}
function durationConstant(id, value) {
    return value = +value, function() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id).duration = value;
    };
}
function __TURBOPACK__default__export__(value) {
    var id = this._id;
    return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id, value)) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(this.node(), id).duration;
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/ease.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
function easeConstant(id, value) {
    if (typeof value !== "function") throw new Error;
    return function() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id).ease = value;
    };
}
function __TURBOPACK__default__export__(value) {
    var id = this._id;
    return arguments.length ? this.each(easeConstant(id, value)) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(this.node(), id).ease;
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/easeVarying.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
function easeVarying(id, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (typeof v !== "function") throw new Error;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id).ease = v;
    };
}
function __TURBOPACK__default__export__(value) {
    if (typeof value !== "function") throw new Error;
    return this.each(easeVarying(this._id, value));
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/end.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__() {
    var on0, on1, that = this, id = that._id, size = that.size();
    return new Promise(function(resolve, reject) {
        var cancel = {
            value: reject
        }, end = {
            value: function() {
                if (--size === 0) resolve();
            }
        };
        that.each(function() {
            var schedule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id), on = schedule.on;
            // If this node shared a dispatch with the previous node,
            // just assign the updated shared dispatch and we’re done!
            // Otherwise, copy-on-write.
            if (on !== on0) {
                on1 = (on0 = on).copy();
                on1._.cancel.push(cancel);
                on1._.interrupt.push(cancel);
                on1._.end.push(end);
            }
            schedule.on = on1;
        });
        // The selection was empty, resolve end immediately
        if (size === 0) resolve();
    });
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/filter.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__matcher$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/matcher.js [app-client] (ecmascript) <export default as matcher>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/index.js [app-client] (ecmascript)");
;
;
function __TURBOPACK__default__export__(match) {
    if (typeof match !== "function") match = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__matcher$3e$__["matcher"])(match);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i){
            if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
                subgroup.push(node);
            }
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"](subgroups, this._parents, this._name, this._id);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Transition",
    ()=>Transition,
    "default",
    ()=>transition,
    "newId",
    ()=>newId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selection$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript) <export default as selection>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$attr$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/attr.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$attrTween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/attrTween.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$delay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/delay.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$duration$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/duration.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$ease$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/ease.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$easeVarying$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/easeVarying.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/filter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/merge.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$on$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/on.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$remove$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/remove.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/select.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$selectAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/selectAll.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$selection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/selection.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$styleTween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/styleTween.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/text.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$textTween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/textTween.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$transition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/transition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$tween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/tween.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$end$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/end.js [app-client] (ecmascript)");
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
var id = 0;
function Transition(groups, parents, name, id) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id;
}
function transition(name) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selection$3e$__["selection"])().transition(name);
}
function newId() {
    return ++id;
}
var selection_prototype = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selection$3e$__["selection"].prototype;
Transition.prototype = transition.prototype = {
    constructor: Transition,
    select: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    selectAll: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$selectAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    selectChild: selection_prototype.selectChild,
    selectChildren: selection_prototype.selectChildren,
    filter: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    merge: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    selection: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$selection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    transition: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$transition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$on$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    attr: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$attr$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    attrTween: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$attrTween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    style: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    styleTween: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$styleTween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    text: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    textTween: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$textTween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    remove: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$remove$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    tween: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$tween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    delay: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$delay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    duration: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$duration$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    ease: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$ease$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    easeVarying: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$easeVarying$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    end: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$end$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    [Symbol.iterator]: selection_prototype[Symbol.iterator]
};
}),
"[project]/frontend/node_modules/d3-transition/src/transition/interpolate.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__color$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-color/src/color.js [app-client] (ecmascript) <export default as color>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateNumber$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/number.js [app-client] (ecmascript) <export default as interpolateNumber>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateRgb$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/rgb.js [app-client] (ecmascript) <export default as interpolateRgb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$string$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateString$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/string.js [app-client] (ecmascript) <export default as interpolateString>");
;
;
function __TURBOPACK__default__export__(a, b) {
    var c;
    return (typeof b === "number" ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateNumber$3e$__["interpolateNumber"] : b instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__color$3e$__["color"] ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateRgb$3e$__["interpolateRgb"] : (c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__color$3e$__["color"])(b)) ? (b = c, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateRgb$3e$__["interpolateRgb"]) : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$string$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateString$3e$__["interpolateString"])(a, b);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/merge.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/index.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(transition) {
    if (transition._id !== this._id) throw new Error;
    for(var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j){
        for(var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i){
            if (node = group0[i] || group1[i]) {
                merge[i] = node;
            }
        }
    }
    for(; j < m0; ++j){
        merges[j] = groups0[j];
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"](merges, this._parents, this._name, this._id);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/on.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
        var i = t.indexOf(".");
        if (i >= 0) t = t.slice(0, i);
        return !t || t === "start";
    });
}
function onFunction(id, name, listener) {
    var on0, on1, sit = start(name) ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["init"] : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"];
    return function() {
        var schedule = sit(this, id), on = schedule.on;
        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
        schedule.on = on1;
    };
}
function __TURBOPACK__default__export__(name, listener) {
    var id = this._id;
    return arguments.length < 2 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(this.node(), id).on.on(name) : this.each(onFunction(id, name, listener));
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/remove.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function removeFunction(id) {
    return function() {
        var parent = this.parentNode;
        for(var i in this.__transition)if (+i !== id) return;
        if (parent) parent.removeChild(this);
    };
}
function __TURBOPACK__default__export__() {
    return this.on("end.remove", removeFunction(this._id));
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CREATED",
    ()=>CREATED,
    "ENDED",
    ()=>ENDED,
    "ENDING",
    ()=>ENDING,
    "RUNNING",
    ()=>RUNNING,
    "SCHEDULED",
    ()=>SCHEDULED,
    "STARTED",
    ()=>STARTED,
    "STARTING",
    ()=>STARTING,
    "default",
    ()=>__TURBOPACK__default__export__,
    "get",
    ()=>get,
    "init",
    ()=>init,
    "set",
    ()=>set
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$dispatch$2f$src$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dispatch$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-dispatch/src/dispatch.js [app-client] (ecmascript) <export default as dispatch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-timer/src/timer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__timeout$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-timer/src/timeout.js [app-client] (ecmascript) <export default as timeout>");
;
;
var emptyOn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$dispatch$2f$src$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dispatch$3e$__["dispatch"])("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;
function __TURBOPACK__default__export__(node, name, id, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};
    else if (id in schedules) return;
    create(node, id, {
        name: name,
        index: index,
        group: group,
        on: emptyOn,
        tween: emptyTween,
        time: timing.time,
        delay: timing.delay,
        duration: timing.duration,
        ease: timing.ease,
        timer: null,
        state: CREATED
    });
}
function init(node, id) {
    var schedule = get(node, id);
    if (schedule.state > CREATED) throw new Error("too late; already scheduled");
    return schedule;
}
function set(node, id) {
    var schedule = get(node, id);
    if (schedule.state > STARTED) throw new Error("too late; already running");
    return schedule;
}
function get(node, id) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
    return schedule;
}
function create(node, id, self) {
    var schedules = node.__transition, tween;
    // Initialize the self timer when the transition is created.
    // Note the actual delay is not known until the first callback!
    schedules[id] = self;
    self.timer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timer"])(schedule, 0, self.time);
    function schedule(elapsed) {
        self.state = SCHEDULED;
        self.timer.restart(start, self.delay, self.time);
        // If the elapsed delay is less than our first sleep, start immediately.
        if (self.delay <= elapsed) start(elapsed - self.delay);
    }
    function start(elapsed) {
        var i, j, n, o;
        // If the state is not SCHEDULED, then we previously errored on start.
        if (self.state !== SCHEDULED) return stop();
        for(i in schedules){
            o = schedules[i];
            if (o.name !== self.name) continue;
            // While this element already has a starting transition during this frame,
            // defer starting an interrupting transition until that transition has a
            // chance to tick (and possibly end); see d3/d3-transition#54!
            if (o.state === STARTED) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__timeout$3e$__["timeout"])(start);
            // Interrupt the active transition, if any.
            if (o.state === RUNNING) {
                o.state = ENDED;
                o.timer.stop();
                o.on.call("interrupt", node, node.__data__, o.index, o.group);
                delete schedules[i];
            } else if (+i < id) {
                o.state = ENDED;
                o.timer.stop();
                o.on.call("cancel", node, node.__data__, o.index, o.group);
                delete schedules[i];
            }
        }
        // Defer the first tick to end of the current frame; see d3/d3#1576.
        // Note the transition may be canceled after start and before the first tick!
        // Note this must be scheduled before the start event; see d3/d3-transition#16!
        // Assuming this is successful, subsequent callbacks go straight to tick.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__timeout$3e$__["timeout"])(function() {
            if (self.state === STARTED) {
                self.state = RUNNING;
                self.timer.restart(tick, self.delay, self.time);
                tick(elapsed);
            }
        });
        // Dispatch the start event.
        // Note this must be done before the tween are initialized.
        self.state = STARTING;
        self.on.call("start", node, node.__data__, self.index, self.group);
        if (self.state !== STARTING) return; // interrupted
        self.state = STARTED;
        // Initialize the tween, deleting null tween.
        tween = new Array(n = self.tween.length);
        for(i = 0, j = -1; i < n; ++i){
            if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
                tween[++j] = o;
            }
        }
        tween.length = j + 1;
    }
    function tick(elapsed) {
        var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i = -1, n = tween.length;
        while(++i < n){
            tween[i].call(node, t);
        }
        // Dispatch the end event.
        if (self.state === ENDING) {
            self.on.call("end", node, node.__data__, self.index, self.group);
            stop();
        }
    }
    function stop() {
        self.state = ENDED;
        self.timer.stop();
        delete schedules[id];
        for(var i in schedules)return; // eslint-disable-line no-unused-vars
        delete node.__transition;
    }
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/select.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selector$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selector.js [app-client] (ecmascript) <export default as selector>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
;
;
function __TURBOPACK__default__export__(select) {
    var name = this._name, id = this._id;
    if (typeof select !== "function") select = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selector$3e$__["selector"])(select);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i){
            if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
                if ("__data__" in node) subnode.__data__ = node.__data__;
                subgroup[i] = subnode;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(subgroup[i], name, id, i, subgroup, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(node, id));
            }
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"](subgroups, this._parents, name, id);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/selectAll.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selectorAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selectorAll$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selectorAll.js [app-client] (ecmascript) <export default as selectorAll>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
;
;
function __TURBOPACK__default__export__(select) {
    var name = this._name, id = this._id;
    if (typeof select !== "function") select = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selectorAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selectorAll$3e$__["selectorAll"])(select);
    for(var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
            if (node = group[i]) {
                for(var children = select.call(node, node.__data__, i, group), child, inherit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(node, id), k = 0, l = children.length; k < l; ++k){
                    if (child = children[k]) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(child, name, id, k, children, inherit);
                    }
                }
                subgroups.push(children);
                parents.push(node);
            }
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"](subgroups, parents, name, id);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/selection.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selection$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript) <export default as selection>");
;
var Selection = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selection$3e$__["selection"].prototype.constructor;
function __TURBOPACK__default__export__() {
    return new Selection(this._groups, this._parents);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/style.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/transform/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__styleValue__as__style$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/style.js [app-client] (ecmascript) <export styleValue as style>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$tween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/tween.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$interpolate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/interpolate.js [app-client] (ecmascript)");
;
;
;
;
;
function styleNull(name, interpolate) {
    var string00, string10, interpolate0;
    return function() {
        var string0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__styleValue__as__style$3e$__["style"])(this, name), string1 = (this.style.removeProperty(name), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__styleValue__as__style$3e$__["style"])(this, name));
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
    };
}
function styleRemove(name) {
    return function() {
        this.style.removeProperty(name);
    };
}
function styleConstant(name, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
        var string0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__styleValue__as__style$3e$__["style"])(this, name);
        return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
}
function styleFunction(name, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
        var string0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__styleValue__as__style$3e$__["style"])(this, name), value1 = value(this), string1 = value1 + "";
        if (value1 == null) string1 = value1 = (this.style.removeProperty(name), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__styleValue__as__style$3e$__["style"])(this, name));
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
}
function styleMaybeRemove(id, name) {
    var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
    return function() {
        var schedule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id), on = schedule.on, listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined;
        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
        schedule.on = on1;
    };
}
function __TURBOPACK__default__export__(name, value, priority) {
    var i = (name += "") === "transform" ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["interpolateTransformCss"] : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$interpolate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
    return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove(name)) : typeof value === "function" ? this.styleTween(name, styleFunction(name, i, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$tween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenValue"])(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant(name, i, value), priority).on("end.style." + name, null);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/styleTween.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function styleInterpolate(name, i, priority) {
    return function(t) {
        this.style.setProperty(name, i.call(this, t), priority);
    };
}
function styleTween(name, value, priority) {
    var t, i0;
    function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
        return t;
    }
    tween._value = value;
    return tween;
}
function __TURBOPACK__default__export__(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/text.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$tween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/tween.js [app-client] (ecmascript)");
;
function textConstant(value) {
    return function() {
        this.textContent = value;
    };
}
function textFunction(value) {
    return function() {
        var value1 = value(this);
        this.textContent = value1 == null ? "" : value1;
    };
}
function __TURBOPACK__default__export__(value) {
    return this.tween("text", typeof value === "function" ? textFunction((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$tween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenValue"])(this, "text", value)) : textConstant(value == null ? "" : value + ""));
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/textTween.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function textInterpolate(i) {
    return function(t) {
        this.textContent = i.call(this, t);
    };
}
function textTween(value) {
    var t0, i0;
    function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
        return t0;
    }
    tween._value = value;
    return tween;
}
function __TURBOPACK__default__export__(value) {
    var key = "text";
    if (arguments.length < 1) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, textTween(value));
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/transition.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
;
function __TURBOPACK__default__export__() {
    var name = this._name, id0 = this._id, id1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["newId"])();
    for(var groups = this._groups, m = groups.length, j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
            if (node = group[i]) {
                var inherit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(node, id0);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(node, name, id1, i, group, {
                    time: inherit.time + inherit.delay + inherit.duration,
                    delay: 0,
                    duration: inherit.duration,
                    ease: inherit.ease
                });
            }
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"](groups, this._parents, name, id1);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/tween.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "tweenValue",
    ()=>tweenValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
function tweenRemove(id, name) {
    var tween0, tween1;
    return function() {
        var schedule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id), tween = schedule.tween;
        // If this node shared tween with the previous node,
        // just assign the updated shared tween and we’re done!
        // Otherwise, copy-on-write.
        if (tween !== tween0) {
            tween1 = tween0 = tween;
            for(var i = 0, n = tween1.length; i < n; ++i){
                if (tween1[i].name === name) {
                    tween1 = tween1.slice();
                    tween1.splice(i, 1);
                    break;
                }
            }
        }
        schedule.tween = tween1;
    };
}
function tweenFunction(id, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error;
    return function() {
        var schedule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id), tween = schedule.tween;
        // If this node shared tween with the previous node,
        // just assign the updated shared tween and we’re done!
        // Otherwise, copy-on-write.
        if (tween !== tween0) {
            tween1 = (tween0 = tween).slice();
            for(var t = {
                name: name,
                value: value
            }, i = 0, n = tween1.length; i < n; ++i){
                if (tween1[i].name === name) {
                    tween1[i] = t;
                    break;
                }
            }
            if (i === n) tween1.push(t);
        }
        schedule.tween = tween1;
    };
}
function __TURBOPACK__default__export__(name, value) {
    var id = this._id;
    name += "";
    if (arguments.length < 2) {
        var tween = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(this.node(), id).tween;
        for(var i = 0, n = tween.length, t; i < n; ++i){
            if ((t = tween[i]).name === name) {
                return t.value;
            }
        }
        return null;
    }
    return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}
function tweenValue(transition, name, value) {
    var id = transition._id;
    transition.each(function() {
        var schedule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id);
        (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
    });
    return function(node) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(node, id).value[name];
    };
}
}),
"[project]/frontend/node_modules/d3-zoom/src/constant.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = (x)=>()=>x;
}),
"[project]/frontend/node_modules/d3-zoom/src/event.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ZoomEvent
]);
function ZoomEvent(type, { sourceEvent, target, transform, dispatch }) {
    Object.defineProperties(this, {
        type: {
            value: type,
            enumerable: true,
            configurable: true
        },
        sourceEvent: {
            value: sourceEvent,
            enumerable: true,
            configurable: true
        },
        target: {
            value: target,
            enumerable: true,
            configurable: true
        },
        transform: {
            value: transform,
            enumerable: true,
            configurable: true
        },
        _: {
            value: dispatch
        }
    });
}
}),
"[project]/frontend/node_modules/d3-zoom/src/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$zoom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-zoom/src/zoom.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$transform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-zoom/src/transform.js [app-client] (ecmascript)");
;
;
}),
"[project]/frontend/node_modules/d3-zoom/src/noevent.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "nopropagation",
    ()=>nopropagation
]);
function nopropagation(event) {
    event.stopImmediatePropagation();
}
function __TURBOPACK__default__export__(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
}
}),
"[project]/frontend/node_modules/d3-zoom/src/transform.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Transform",
    ()=>Transform,
    "default",
    ()=>transform,
    "identity",
    ()=>identity
]);
function Transform(k, x, y) {
    this.k = k;
    this.x = x;
    this.y = y;
}
Transform.prototype = {
    constructor: Transform,
    scale: function(k) {
        return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
    },
    translate: function(x, y) {
        return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
    },
    apply: function(point) {
        return [
            point[0] * this.k + this.x,
            point[1] * this.k + this.y
        ];
    },
    applyX: function(x) {
        return x * this.k + this.x;
    },
    applyY: function(y) {
        return y * this.k + this.y;
    },
    invert: function(location) {
        return [
            (location[0] - this.x) / this.k,
            (location[1] - this.y) / this.k
        ];
    },
    invertX: function(x) {
        return (x - this.x) / this.k;
    },
    invertY: function(y) {
        return (y - this.y) / this.k;
    },
    rescaleX: function(x) {
        return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
    },
    rescaleY: function(y) {
        return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
    },
    toString: function() {
        return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
    }
};
var identity = new Transform(1, 0, 0);
transform.prototype = Transform.prototype;
function transform(node) {
    while(!node.__zoom)if (!(node = node.parentNode)) return identity;
    return node.__zoom;
}
}),
"[project]/frontend/node_modules/d3-zoom/src/zoom.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$dispatch$2f$src$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dispatch$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-dispatch/src/dispatch.js [app-client] (ecmascript) <export default as dispatch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dragDisable$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript) <export default as dragDisable>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__yesdrag__as__dragEnable$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript) <export yesdrag as dragEnable>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$zoom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateZoom$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/zoom.js [app-client] (ecmascript) <export default as interpolateZoom>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/pointer.js [app-client] (ecmascript) <export default as pointer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interrupt$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/interrupt.js [app-client] (ecmascript) <export default as interrupt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-zoom/src/constant.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$event$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-zoom/src/event.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$transform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-zoom/src/transform.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-zoom/src/noevent.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
// Ignore right-click, since that should open the context menu.
// except for pinch-to-zoom, which is sent as a wheel+ctrlKey event
function defaultFilter(event) {
    return (!event.ctrlKey || event.type === 'wheel') && !event.button;
}
function defaultExtent() {
    var e = this;
    if (e instanceof SVGElement) {
        e = e.ownerSVGElement || e;
        if (e.hasAttribute("viewBox")) {
            e = e.viewBox.baseVal;
            return [
                [
                    e.x,
                    e.y
                ],
                [
                    e.x + e.width,
                    e.y + e.height
                ]
            ];
        }
        return [
            [
                0,
                0
            ],
            [
                e.width.baseVal.value,
                e.height.baseVal.value
            ]
        ];
    }
    return [
        [
            0,
            0
        ],
        [
            e.clientWidth,
            e.clientHeight
        ]
    ];
}
function defaultTransform() {
    return this.__zoom || __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$transform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identity"];
}
function defaultWheelDelta(event) {
    return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : 1);
}
function defaultTouchable() {
    return navigator.maxTouchPoints || "ontouchstart" in this;
}
function defaultConstrain(transform, extent, translateExtent) {
    var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0], dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0], dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1], dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
    return transform.translate(dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1), dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1));
}
function __TURBOPACK__default__export__() {
    var filter = defaultFilter, extent = defaultExtent, constrain = defaultConstrain, wheelDelta = defaultWheelDelta, touchable = defaultTouchable, scaleExtent = [
        0,
        Infinity
    ], translateExtent = [
        [
            -Infinity,
            -Infinity
        ],
        [
            Infinity,
            Infinity
        ]
    ], duration = 250, interpolate = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$zoom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateZoom$3e$__["interpolateZoom"], listeners = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$dispatch$2f$src$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dispatch$3e$__["dispatch"])("start", "zoom", "end"), touchstarting, touchfirst, touchending, touchDelay = 500, wheelDelay = 150, clickDistance2 = 0, tapDistance = 10;
    function zoom(selection) {
        selection.property("__zoom", defaultTransform).on("wheel.zoom", wheeled, {
            passive: false
        }).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }
    zoom.transform = function(collection, transform, point, event) {
        var selection = collection.selection ? collection.selection() : collection;
        selection.property("__zoom", defaultTransform);
        if (collection !== selection) {
            schedule(collection, transform, point, event);
        } else {
            selection.interrupt().each(function() {
                gesture(this, arguments).event(event).start().zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform).end();
            });
        }
    };
    zoom.scaleBy = function(selection, k, p, event) {
        zoom.scaleTo(selection, function() {
            var k0 = this.__zoom.k, k1 = typeof k === "function" ? k.apply(this, arguments) : k;
            return k0 * k1;
        }, p, event);
    };
    zoom.scaleTo = function(selection, k, p, event) {
        zoom.transform(selection, function() {
            var e = extent.apply(this, arguments), t0 = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p, p1 = t0.invert(p0), k1 = typeof k === "function" ? k.apply(this, arguments) : k;
            return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
        }, p, event);
    };
    zoom.translateBy = function(selection, x, y, event) {
        zoom.transform(selection, function() {
            return constrain(this.__zoom.translate(typeof x === "function" ? x.apply(this, arguments) : x, typeof y === "function" ? y.apply(this, arguments) : y), extent.apply(this, arguments), translateExtent);
        }, null, event);
    };
    zoom.translateTo = function(selection, x, y, p, event) {
        zoom.transform(selection, function() {
            var e = extent.apply(this, arguments), t = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
            return constrain(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$transform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identity"].translate(p0[0], p0[1]).scale(t.k).translate(typeof x === "function" ? -x.apply(this, arguments) : -x, typeof y === "function" ? -y.apply(this, arguments) : -y), e, translateExtent);
        }, p, event);
    };
    function scale(transform, k) {
        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
        return k === transform.k ? transform : new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$transform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transform"](k, transform.x, transform.y);
    }
    function translate(transform, p0, p1) {
        var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
        return x === transform.x && y === transform.y ? transform : new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$transform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transform"](transform.k, x, y);
    }
    function centroid(extent) {
        return [
            (+extent[0][0] + +extent[1][0]) / 2,
            (+extent[0][1] + +extent[1][1]) / 2
        ];
    }
    function schedule(transition, transform, point, event) {
        transition.on("start.zoom", function() {
            gesture(this, arguments).event(event).start();
        }).on("interrupt.zoom end.zoom", function() {
            gesture(this, arguments).event(event).end();
        }).tween("zoom", function() {
            var that = this, args = arguments, g = gesture(that, args).event(event), e = extent.apply(that, args), p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point, w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]), a = that.__zoom, b = typeof transform === "function" ? transform.apply(that, args) : transform, i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
            return function(t) {
                if (t === 1) t = b; // Avoid rounding error on end.
                else {
                    var l = i(t), k = w / l[2];
                    t = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$transform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transform"](k, p[0] - l[0] * k, p[1] - l[1] * k);
                }
                g.zoom(null, t);
            };
        });
    }
    function gesture(that, args, clean) {
        return !clean && that.__zooming || new Gesture(that, args);
    }
    function Gesture(that, args) {
        this.that = that;
        this.args = args;
        this.active = 0;
        this.sourceEvent = null;
        this.extent = extent.apply(that, args);
        this.taps = 0;
    }
    Gesture.prototype = {
        event: function(event) {
            if (event) this.sourceEvent = event;
            return this;
        },
        start: function() {
            if (++this.active === 1) {
                this.that.__zooming = this;
                this.emit("start");
            }
            return this;
        },
        zoom: function(key, transform) {
            if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
            if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
            if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
            this.that.__zoom = transform;
            this.emit("zoom");
            return this;
        },
        end: function() {
            if (--this.active === 0) {
                delete this.that.__zooming;
                this.emit("end");
            }
            return this;
        },
        emit: function(type) {
            var d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(this.that).datum();
            listeners.call(type, this.that, new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$event$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](type, {
                sourceEvent: this.sourceEvent,
                target: zoom,
                type,
                transform: this.that.__zoom,
                dispatch: listeners
            }), d);
        }
    };
    function wheeled(event, ...args) {
        if (!filter.apply(this, arguments)) return;
        var g = gesture(this, args).event(event), t = this.__zoom, k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))), p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(event);
        // If the mouse is in the same location as before, reuse it.
        // If there were recent wheel events, reset the wheel idle timeout.
        if (g.wheel) {
            if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
                g.mouse[1] = t.invert(g.mouse[0] = p);
            }
            clearTimeout(g.wheel);
        } else if (t.k === k) return;
        else {
            g.mouse = [
                p,
                t.invert(p)
            ];
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interrupt$3e$__["interrupt"])(this);
            g.start();
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
        g.wheel = setTimeout(wheelidled, wheelDelay);
        g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
        function wheelidled() {
            g.wheel = null;
            g.end();
        }
    }
    function mousedowned(event, ...args) {
        if (touchending || !filter.apply(this, arguments)) return;
        var currentTarget = event.currentTarget, g = gesture(this, args, true).event(event), v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true), p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(event, currentTarget), x0 = event.clientX, y0 = event.clientY;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dragDisable$3e$__["dragDisable"])(event.view);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nopropagation"])(event);
        g.mouse = [
            p,
            this.__zoom.invert(p)
        ];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interrupt$3e$__["interrupt"])(this);
        g.start();
        function mousemoved(event) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
            if (!g.moved) {
                var dx = event.clientX - x0, dy = event.clientY - y0;
                g.moved = dx * dx + dy * dy > clickDistance2;
            }
            g.event(event).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(event, currentTarget), g.mouse[1]), g.extent, translateExtent));
        }
        function mouseupped(event) {
            v.on("mousemove.zoom mouseup.zoom", null);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__yesdrag__as__dragEnable$3e$__["dragEnable"])(event.view, g.moved);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
            g.event(event).end();
        }
    }
    function dblclicked(event, ...args) {
        if (!filter.apply(this, arguments)) return;
        var t0 = this.__zoom, p0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(event.changedTouches ? event.changedTouches[0] : event, this), p1 = t0.invert(p0), k1 = t0.k * (event.shiftKey ? 0.5 : 2), t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
        if (duration > 0) (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(this).transition().duration(duration).call(schedule, t1, p0, event);
        else (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(this).call(zoom.transform, t1, p0, event);
    }
    function touchstarted(event, ...args) {
        if (!filter.apply(this, arguments)) return;
        var touches = event.touches, n = touches.length, g = gesture(this, args, event.changedTouches.length === n).event(event), started, i, t, p;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nopropagation"])(event);
        for(i = 0; i < n; ++i){
            t = touches[i], p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(t, this);
            p = [
                p,
                this.__zoom.invert(p),
                t.identifier
            ];
            if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
            else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
        }
        if (touchstarting) touchstarting = clearTimeout(touchstarting);
        if (started) {
            if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() {
                touchstarting = null;
            }, touchDelay);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interrupt$3e$__["interrupt"])(this);
            g.start();
        }
    }
    function touchmoved(event, ...args) {
        if (!this.__zooming) return;
        var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t, p, l;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
        for(i = 0; i < n; ++i){
            t = touches[i], p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(t, this);
            if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
            else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
        }
        t = g.that.__zoom;
        if (g.touch1) {
            var p0 = g.touch0[0], l0 = g.touch0[1], p1 = g.touch1[0], l1 = g.touch1[1], dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp, dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
            t = scale(t, Math.sqrt(dp / dl));
            p = [
                (p0[0] + p1[0]) / 2,
                (p0[1] + p1[1]) / 2
            ];
            l = [
                (l0[0] + l1[0]) / 2,
                (l0[1] + l1[1]) / 2
            ];
        } else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
        else return;
        g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
    }
    function touchended(event, ...args) {
        if (!this.__zooming) return;
        var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nopropagation"])(event);
        if (touchending) clearTimeout(touchending);
        touchending = setTimeout(function() {
            touchending = null;
        }, touchDelay);
        for(i = 0; i < n; ++i){
            t = touches[i];
            if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
            else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
        }
        if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
        if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
        else {
            g.end();
            // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.
            if (g.taps === 2) {
                t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(t, this);
                if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
                    var p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(this).on("dblclick.zoom");
                    if (p) p.apply(this, arguments);
                }
            }
        }
    }
    zoom.wheelDelta = function(_) {
        return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(+_), zoom) : wheelDelta;
    };
    zoom.filter = function(_) {
        return arguments.length ? (filter = typeof _ === "function" ? _ : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(!!_), zoom) : filter;
    };
    zoom.touchable = function(_) {
        return arguments.length ? (touchable = typeof _ === "function" ? _ : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(!!_), zoom) : touchable;
    };
    zoom.extent = function(_) {
        return arguments.length ? (extent = typeof _ === "function" ? _ : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])([
            [
                +_[0][0],
                +_[0][1]
            ],
            [
                +_[1][0],
                +_[1][1]
            ]
        ]), zoom) : extent;
    };
    zoom.scaleExtent = function(_) {
        return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [
            scaleExtent[0],
            scaleExtent[1]
        ];
    };
    zoom.translateExtent = function(_) {
        return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [
            [
                translateExtent[0][0],
                translateExtent[0][1]
            ],
            [
                translateExtent[1][0],
                translateExtent[1][1]
            ]
        ];
    };
    zoom.constrain = function(_) {
        return arguments.length ? (constrain = _, zoom) : constrain;
    };
    zoom.duration = function(_) {
        return arguments.length ? (duration = +_, zoom) : duration;
    };
    zoom.interpolate = function(_) {
        return arguments.length ? (interpolate = _, zoom) : interpolate;
    };
    zoom.on = function() {
        var value = listeners.on.apply(listeners, arguments);
        return value === listeners ? zoom : value;
    };
    zoom.clickDistance = function(_) {
        return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
    };
    zoom.tapDistance = function(_) {
        return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
    };
    return zoom;
}
}),
"[project]/frontend/node_modules/d3/src/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-brush/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-zoom/src/index.js [app-client] (ecmascript) <locals>");
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
;
;
;
;
;
;
;
;
;
}),
"[project]/frontend/node_modules/dayjs/dayjs.min.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

!function(t, e) {
    ("TURBOPACK compile-time truthy", 1) ? module.exports = e() : "TURBOPACK unreachable";
}(/*TURBOPACK member replacement*/ __turbopack_context__.e, function() {
    "use strict";
    var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|YYYY|YY|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = {
        name: "en",
        weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        ordinal: function(t) {
            var e = [
                "th",
                "st",
                "nd",
                "rd"
            ], n = t % 100;
            return "[" + t + (e[(n - 20) % 10] || e[n] || e[0]) + "]";
        }
    }, m = function(t, e, n) {
        var r = String(t);
        return !r || r.length >= e ? t : "" + Array(e + 1 - r.length).join(n) + t;
    }, v = {
        s: m,
        z: function(t) {
            var e = -t.utcOffset(), n = Math.abs(e), r = Math.floor(n / 60), i = n % 60;
            return (e <= 0 ? "+" : "-") + m(r, 2, "0") + ":" + m(i, 2, "0");
        },
        m: function t(e, n) {
            if (e.date() < n.date()) return -t(n, e);
            var r = 12 * (n.year() - e.year()) + (n.month() - e.month()), i = e.clone().add(r, c), s = n - i < 0, u = e.clone().add(r + (s ? -1 : 1), c);
            return +(-(r + (n - i) / (s ? i - u : u - i)) || 0);
        },
        a: function(t) {
            return t < 0 ? Math.ceil(t) || 0 : Math.floor(t);
        },
        p: function(t) {
            return ({
                M: c,
                y: h,
                w: o,
                d: a,
                D: d,
                h: u,
                m: s,
                s: i,
                ms: r,
                Q: f
            })[t] || String(t || "").toLowerCase().replace(/s$/, "");
        },
        u: function(t) {
            return void 0 === t;
        }
    }, g = "en", D = {};
    D[g] = M;
    var p = "$isDayjsObject", S = function(t) {
        return t instanceof _ || !(!t || !t[p]);
    }, w = function t(e, n, r) {
        var i;
        if (!e) return g;
        if ("string" == typeof e) {
            var s = e.toLowerCase();
            D[s] && (i = s), n && (D[s] = n, i = s);
            var u = e.split("-");
            if (!i && u.length > 1) return t(u[0]);
        } else {
            var a = e.name;
            D[a] = e, i = a;
        }
        return !r && i && (g = i), i || !r && g;
    }, O = function(t, e) {
        if (S(t)) return t.clone();
        var n = "object" == typeof e ? e : {};
        return n.date = t, n.args = arguments, new _(n);
    }, b = v;
    b.l = w, b.i = S, b.w = function(t, e) {
        return O(t, {
            locale: e.$L,
            utc: e.$u,
            x: e.$x,
            $offset: e.$offset
        });
    };
    var _ = function() {
        function M(t) {
            this.$L = w(t.locale, null, !0), this.parse(t), this.$x = this.$x || t.x || {}, this[p] = !0;
        }
        var m = M.prototype;
        return m.parse = function(t) {
            this.$d = function(t) {
                var e = t.date, n = t.utc;
                if (null === e) return new Date(NaN);
                if (b.u(e)) return new Date;
                if (e instanceof Date) return new Date(e);
                if ("string" == typeof e && !/Z$/i.test(e)) {
                    var r = e.match($);
                    if (r) {
                        var i = r[2] - 1 || 0, s = (r[7] || "0").substring(0, 3);
                        return n ? new Date(Date.UTC(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s)) : new Date(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s);
                    }
                }
                return new Date(e);
            }(t), this.init();
        }, m.init = function() {
            var t = this.$d;
            this.$y = t.getFullYear(), this.$M = t.getMonth(), this.$D = t.getDate(), this.$W = t.getDay(), this.$H = t.getHours(), this.$m = t.getMinutes(), this.$s = t.getSeconds(), this.$ms = t.getMilliseconds();
        }, m.$utils = function() {
            return b;
        }, m.isValid = function() {
            return !(this.$d.toString() === l);
        }, m.isSame = function(t, e) {
            var n = O(t);
            return this.startOf(e) <= n && n <= this.endOf(e);
        }, m.isAfter = function(t, e) {
            return O(t) < this.startOf(e);
        }, m.isBefore = function(t, e) {
            return this.endOf(e) < O(t);
        }, m.$g = function(t, e, n) {
            return b.u(t) ? this[e] : this.set(n, t);
        }, m.unix = function() {
            return Math.floor(this.valueOf() / 1e3);
        }, m.valueOf = function() {
            return this.$d.getTime();
        }, m.startOf = function(t, e) {
            var n = this, r = !!b.u(e) || e, f = b.p(t), l = function(t, e) {
                var i = b.w(n.$u ? Date.UTC(n.$y, e, t) : new Date(n.$y, e, t), n);
                return r ? i : i.endOf(a);
            }, $ = function(t, e) {
                return b.w(n.toDate()[t].apply(n.toDate("s"), (r ? [
                    0,
                    0,
                    0,
                    0
                ] : [
                    23,
                    59,
                    59,
                    999
                ]).slice(e)), n);
            }, y = this.$W, M = this.$M, m = this.$D, v = "set" + (this.$u ? "UTC" : "");
            switch(f){
                case h:
                    return r ? l(1, 0) : l(31, 11);
                case c:
                    return r ? l(1, M) : l(0, M + 1);
                case o:
                    var g = this.$locale().weekStart || 0, D = (y < g ? y + 7 : y) - g;
                    return l(r ? m - D : m + (6 - D), M);
                case a:
                case d:
                    return $(v + "Hours", 0);
                case u:
                    return $(v + "Minutes", 1);
                case s:
                    return $(v + "Seconds", 2);
                case i:
                    return $(v + "Milliseconds", 3);
                default:
                    return this.clone();
            }
        }, m.endOf = function(t) {
            return this.startOf(t, !1);
        }, m.$set = function(t, e) {
            var n, o = b.p(t), f = "set" + (this.$u ? "UTC" : ""), l = (n = {}, n[a] = f + "Date", n[d] = f + "Date", n[c] = f + "Month", n[h] = f + "FullYear", n[u] = f + "Hours", n[s] = f + "Minutes", n[i] = f + "Seconds", n[r] = f + "Milliseconds", n)[o], $ = o === a ? this.$D + (e - this.$W) : e;
            if (o === c || o === h) {
                var y = this.clone().set(d, 1);
                y.$d[l]($), y.init(), this.$d = y.set(d, Math.min(this.$D, y.daysInMonth())).$d;
            } else l && this.$d[l]($);
            return this.init(), this;
        }, m.set = function(t, e) {
            return this.clone().$set(t, e);
        }, m.get = function(t) {
            return this[b.p(t)]();
        }, m.add = function(r, f) {
            var d, l = this;
            r = Number(r);
            var $ = b.p(f), y = function(t) {
                var e = O(l);
                return b.w(e.date(e.date() + Math.round(t * r)), l);
            };
            if ($ === c) return this.set(c, this.$M + r);
            if ($ === h) return this.set(h, this.$y + r);
            if ($ === a) return y(1);
            if ($ === o) return y(7);
            var M = (d = {}, d[s] = e, d[u] = n, d[i] = t, d)[$] || 1, m = this.$d.getTime() + r * M;
            return b.w(m, this);
        }, m.subtract = function(t, e) {
            return this.add(-1 * t, e);
        }, m.format = function(t) {
            var e = this, n = this.$locale();
            if (!this.isValid()) return n.invalidDate || l;
            var r = t || "YYYY-MM-DDTHH:mm:ssZ", i = b.z(this), s = this.$H, u = this.$m, a = this.$M, o = n.weekdays, c = n.months, f = n.meridiem, h = function(t, n, i, s) {
                return t && (t[n] || t(e, r)) || i[n].slice(0, s);
            }, d = function(t) {
                return b.s(s % 12 || 12, t, "0");
            }, $ = f || function(t, e, n) {
                var r = t < 12 ? "AM" : "PM";
                return n ? r.toLowerCase() : r;
            };
            return r.replace(y, function(t, r) {
                return r || function(t) {
                    switch(t){
                        case "YY":
                            return String(e.$y).slice(-2);
                        case "YYYY":
                            return b.s(e.$y, 4, "0");
                        case "M":
                            return a + 1;
                        case "MM":
                            return b.s(a + 1, 2, "0");
                        case "MMM":
                            return h(n.monthsShort, a, c, 3);
                        case "MMMM":
                            return h(c, a);
                        case "D":
                            return e.$D;
                        case "DD":
                            return b.s(e.$D, 2, "0");
                        case "d":
                            return String(e.$W);
                        case "dd":
                            return h(n.weekdaysMin, e.$W, o, 2);
                        case "ddd":
                            return h(n.weekdaysShort, e.$W, o, 3);
                        case "dddd":
                            return o[e.$W];
                        case "H":
                            return String(s);
                        case "HH":
                            return b.s(s, 2, "0");
                        case "h":
                            return d(1);
                        case "hh":
                            return d(2);
                        case "a":
                            return $(s, u, !0);
                        case "A":
                            return $(s, u, !1);
                        case "m":
                            return String(u);
                        case "mm":
                            return b.s(u, 2, "0");
                        case "s":
                            return String(e.$s);
                        case "ss":
                            return b.s(e.$s, 2, "0");
                        case "SSS":
                            return b.s(e.$ms, 3, "0");
                        case "Z":
                            return i;
                    }
                    return null;
                }(t) || i.replace(":", "");
            });
        }, m.utcOffset = function() {
            return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m.diff = function(r, d, l) {
            var $, y = this, M = b.p(d), m = O(r), v = (m.utcOffset() - this.utcOffset()) * e, g = this - m, D = function() {
                return b.m(y, m);
            };
            switch(M){
                case h:
                    $ = D() / 12;
                    break;
                case c:
                    $ = D();
                    break;
                case f:
                    $ = D() / 3;
                    break;
                case o:
                    $ = (g - v) / 6048e5;
                    break;
                case a:
                    $ = (g - v) / 864e5;
                    break;
                case u:
                    $ = g / n;
                    break;
                case s:
                    $ = g / e;
                    break;
                case i:
                    $ = g / t;
                    break;
                default:
                    $ = g;
            }
            return l ? $ : b.a($);
        }, m.daysInMonth = function() {
            return this.endOf(c).$D;
        }, m.$locale = function() {
            return D[this.$L];
        }, m.locale = function(t, e) {
            if (!t) return this.$L;
            var n = this.clone(), r = w(t, e, !0);
            return r && (n.$L = r), n;
        }, m.clone = function() {
            return b.w(this.$d, this);
        }, m.toDate = function() {
            return new Date(this.valueOf());
        }, m.toJSON = function() {
            return this.isValid() ? this.toISOString() : null;
        }, m.toISOString = function() {
            return this.$d.toISOString();
        }, m.toString = function() {
            return this.$d.toUTCString();
        }, M;
    }(), Y = _.prototype;
    return O.prototype = Y, [
        [
            "$ms",
            r
        ],
        [
            "$s",
            i
        ],
        [
            "$m",
            s
        ],
        [
            "$H",
            u
        ],
        [
            "$W",
            a
        ],
        [
            "$M",
            c
        ],
        [
            "$y",
            h
        ],
        [
            "$D",
            d
        ]
    ].forEach(function(t) {
        Y[t[1]] = function(e) {
            return this.$g(e, t[0], t[1]);
        };
    }), O.extend = function(t, e) {
        return t.$i || (t(e, _, O), t.$i = !0), O;
    }, O.locale = w, O.isDayjs = S, O.unix = function(t) {
        return O(1e3 * t);
    }, O.en = D[g], O.Ls = D, O.p = {}, O;
});
}),
"[project]/frontend/node_modules/es-toolkit/dist/_internal/globalThis.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "globalThis_",
    ()=>globalThis_
]);
//#region src/_internal/globalThis.ts
const globalThis_ = typeof globalThis === "object" && globalThis || typeof window === "object" && window || typeof self === "object" && self || ("TURBOPACK compile-time value", "object") === "object" && /*TURBOPACK member replacement*/ __turbopack_context__.g || function() {
    return this;
}();
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/_internal/isUnsafeProperty.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isUnsafeProperty",
    ()=>isUnsafeProperty
]);
//#region src/_internal/isUnsafeProperty.ts
/**
* Checks if a property key is unsafe to access or copy directly.
*
* This function is used in functions like `get`, `unset`, and `merge` to prevent
* prototype pollution attacks by identifying `__proto__`, which modifies the object's
* prototype chain. `constructor` and `prototype` stay accessible here because lodash
* keeps reads of them unrestricted; write paths use `isUnsafeToWriteProperty` instead,
* which also blocks those keys.
*
* @param key - The property key to check
* @returns `true` if the property is unsafe to access directly, `false` otherwise
* @internal
*/ function isUnsafeProperty(key) {
    return key === "__proto__";
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/compat/_internal/getSymbols.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSymbols",
    ()=>getSymbols
]);
//#region src/compat/_internal/getSymbols.ts
function getSymbols(object) {
    return Object.getOwnPropertySymbols(object).filter((symbol)=>Object.prototype.propertyIsEnumerable.call(object, symbol));
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/compat/_internal/getTag.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTag",
    ()=>getTag
]);
//#region src/compat/_internal/getTag.ts
/**
* Gets the `toStringTag` of `value`.
*
* @private
* @param {T} value The value to query.
* @returns {string} Returns the `Object.prototype.toString.call` result.
*/ function getTag(value) {
    if (value == null) return value === void 0 ? "[object Undefined]" : "[object Null]";
    return Object.prototype.toString.call(value);
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/compat/_internal/tags.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "argumentsTag",
    ()=>argumentsTag,
    "arrayBufferTag",
    ()=>arrayBufferTag,
    "arrayTag",
    ()=>arrayTag,
    "bigInt64ArrayTag",
    ()=>bigInt64ArrayTag,
    "bigUint64ArrayTag",
    ()=>bigUint64ArrayTag,
    "booleanTag",
    ()=>booleanTag,
    "dataViewTag",
    ()=>dataViewTag,
    "dateTag",
    ()=>dateTag,
    "errorTag",
    ()=>errorTag,
    "float32ArrayTag",
    ()=>float32ArrayTag,
    "float64ArrayTag",
    ()=>float64ArrayTag,
    "functionTag",
    ()=>functionTag,
    "int16ArrayTag",
    ()=>int16ArrayTag,
    "int32ArrayTag",
    ()=>int32ArrayTag,
    "int8ArrayTag",
    ()=>int8ArrayTag,
    "mapTag",
    ()=>mapTag,
    "numberTag",
    ()=>numberTag,
    "objectTag",
    ()=>objectTag,
    "regexpTag",
    ()=>regexpTag,
    "setTag",
    ()=>setTag,
    "stringTag",
    ()=>stringTag,
    "symbolTag",
    ()=>symbolTag,
    "uint16ArrayTag",
    ()=>uint16ArrayTag,
    "uint32ArrayTag",
    ()=>uint32ArrayTag,
    "uint8ArrayTag",
    ()=>uint8ArrayTag,
    "uint8ClampedArrayTag",
    ()=>uint8ClampedArrayTag
]);
//#region src/compat/_internal/tags.ts
const regexpTag = "[object RegExp]";
const stringTag = "[object String]";
const numberTag = "[object Number]";
const booleanTag = "[object Boolean]";
const argumentsTag = "[object Arguments]";
const symbolTag = "[object Symbol]";
const dateTag = "[object Date]";
const mapTag = "[object Map]";
const setTag = "[object Set]";
const arrayTag = "[object Array]";
const functionTag = "[object Function]";
const arrayBufferTag = "[object ArrayBuffer]";
const objectTag = "[object Object]";
const errorTag = "[object Error]";
const dataViewTag = "[object DataView]";
const uint8ArrayTag = "[object Uint8Array]";
const uint8ClampedArrayTag = "[object Uint8ClampedArray]";
const uint16ArrayTag = "[object Uint16Array]";
const uint32ArrayTag = "[object Uint32Array]";
const bigUint64ArrayTag = "[object BigUint64Array]";
const int8ArrayTag = "[object Int8Array]";
const int16ArrayTag = "[object Int16Array]";
const int32ArrayTag = "[object Int32Array]";
const bigInt64ArrayTag = "[object BigInt64Array]";
const float32ArrayTag = "[object Float32Array]";
const float64ArrayTag = "[object Float64Array]";
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/compat/function/memoize.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "memoize",
    ()=>memoize
]);
//#region src/compat/function/memoize.ts
/**
* Creates a function that memoizes the result of func. If resolver is provided it determines the cache key for
* storing the result based on the arguments provided to the memoized function. By default, the first argument
* provided to the memoized function is coerced to a string and used as the cache key. The func is invoked with
* the this binding of the memoized function.
*
* @template T - The type of the original function being memoized
* @param func The function to have its output memoized.
* @param [resolver] The function to resolve the cache key.
* @return {MemoizedFunction<T>} Returns the new memoizing function.
*/ function memoize(func, resolver) {
    if (typeof func !== "function" || resolver != null && typeof resolver !== "function") throw new TypeError("Expected a function");
    const memoized = function(...args) {
        const key = resolver ? resolver.apply(this, args) : args[0];
        const cache = memoized.cache;
        if (cache.has(key)) return cache.get(key);
        const result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
    };
    memoized.cache = new (memoize.Cache || Map)();
    return memoized;
}
memoize.Cache = Map;
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/compat/object/cloneDeep.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cloneDeep",
    ()=>cloneDeep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$object$2f$cloneDeepWith$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/object/cloneDeepWith.mjs [app-client] (ecmascript)");
;
//#region src/compat/object/cloneDeep.ts
/**
* Creates a deep clone of the given object.
*
* @template T - The type of the object.
* @param obj - The object to clone.
* @returns A deep clone of the given object.
*
* @example
* // Clone a primitive value
* const num = 29;
* const clonedNum = clone(num);
* console.log(clonedNum); // 29
* console.log(clonedNum === num); // true
*
* @example
* // Clone an array
* const arr = [1, 2, 3];
* const clonedArr = cloneDeep(arr);
* console.log(clonedArr); // [1, 2, 3]
* console.log(clonedArr === arr); // false
*
* @example
* // Clone an array with nested objects
* const arr = [1, { a: 1 }, [1, 2, 3]];
* const clonedArr = cloneDeep(arr);
* arr[1].a = 2;
* console.log(arr); // [1, { a: 2 }, [1, 2, 3]]
* console.log(clonedArr); // [1, { a: 1 }, [1, 2, 3]]
* console.log(clonedArr === arr); // false
*
* @example
* // Clone an object
* const obj = { a: 1, b: 'es-toolkit', c: [1, 2, 3] };
* const clonedObj = cloneDeep(obj);
* console.log(clonedObj); // { a: 1, b: 'es-toolkit', c: [1, 2, 3] }
* console.log(clonedObj === obj); // false
*
* @example
* // Clone an object with nested objects
* const obj = { a: 1, b: { c: 1 } };
* const clonedObj = cloneDeep(obj);
* obj.b.c = 2;
* console.log(obj); // { a: 1, b: { c: 2 } }
* console.log(clonedObj); // { a: 1, b: { c: 1 } }
* console.log(clonedObj === obj); // false
*/ function cloneDeep(obj) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$object$2f$cloneDeepWith$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneDeepWith"])(obj);
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/compat/object/cloneDeepWith.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cloneDeepWith",
    ()=>cloneDeepWith
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$getTag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/_internal/getTag.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/_internal/tags.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$object$2f$cloneDeepWith$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/object/cloneDeepWith.mjs [app-client] (ecmascript)");
;
;
;
//#region src/compat/object/cloneDeepWith.ts
/**
* Creates a deep clone of the given object using a customizer function.
*
* @template T - The type of the object.
* @param obj - The object to clone.
* @param [cloneValue] - A function to customize the cloning process.
* @returns A deep clone of the given object.
*
* @example
* // Clone a primitive value
* const num = 29;
* const clonedNum = cloneDeepWith(num);
* console.log(clonedNum); // 29
* console.log(clonedNum === num); // true
*
* @example
* // Clone an object with a customizer
* const obj = { a: 1, b: 2 };
* const clonedObj = cloneDeepWith(obj, (value) => {
*   if (typeof value === 'number') {
*     return value * 2; // Double the number
*   }
* });
* console.log(clonedObj); // { a: 2, b: 4 }
* console.log(clonedObj === obj); // false
*
* @example
* // Clone an array with a customizer
* const arr = [1, 2, 3];
* const clonedArr = cloneDeepWith(arr, (value) => {
*   if (typeof value === 'number') {
*     return value + 1; // Increment each number
*   }
* });
* console.log(clonedArr); // [2, 3, 4]
* console.log(clonedArr === arr); // false
*/ function cloneDeepWith(obj, customizer) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$object$2f$cloneDeepWith$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneDeepWith"])(obj, (value, key, object, stack)=>{
        const cloned = customizer?.(value, key, object, stack);
        if (cloned !== void 0) return cloned;
        if (typeof obj !== "object") return;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$getTag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTag"])(obj) === "[object Object]" && typeof obj.constructor !== "function") {
            const result = {};
            stack.set(obj, result);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$object$2f$cloneDeepWith$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["copyProperties"])(result, obj, object, stack);
            return result;
        }
        switch(Object.prototype.toString.call(obj)){
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberTag"]:
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringTag"]:
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["booleanTag"]:
                {
                    const result = new obj.constructor(obj?.valueOf());
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$object$2f$cloneDeepWith$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["copyProperties"])(result, obj);
                    return result;
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["argumentsTag"]:
                {
                    const result = {};
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$object$2f$cloneDeepWith$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["copyProperties"])(result, obj);
                    result.length = obj.length;
                    result[Symbol.iterator] = obj[Symbol.iterator];
                    return result;
                }
            default:
                return;
        }
    });
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/compat/object/merge.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "merge",
    ()=>merge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$function$2f$noop$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/function/noop.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$object$2f$mergeWith$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/object/mergeWith.mjs [app-client] (ecmascript)");
;
;
//#region src/compat/object/merge.ts
/**
* Merges the properties of one or more source objects into the target object.
*
* This function performs a deep merge, recursively merging nested objects and arrays.
* If a property in the source object is an array or object and the corresponding property in the target object is also an array or object, they will be merged.
* If a property in the source object is `undefined`, it will not overwrite a defined property in the target object.
*
* The function can handle multiple source objects and will merge them all into the target object.
*
* @param object - The target object into which the source object properties will be merged. This object is modified in place.
* @param sources - The source objects whose properties will be merged into the target object.
* @returns The updated target object with properties from the source object(s) merged in.
*
* @example
* const target = { a: 1, b: { x: 1, y: 2 } };
* const source = { b: { y: 3, z: 4 }, c: 5 };
*
* const result = merge(target, source);
* console.log(result);
* // Output: { a: 1, b: { x: 1, y: 3, z: 4 }, c: 5 }
*
* @example
* const target = { a: [1, 2], b: { x: 1 } };
* const source = { a: [3], b: { y: 2 } };
*
* const result = merge(target, source);
* console.log(result);
* // Output: { a: [3], b: { x: 1, y: 2 } }
*
* @example
* const target = { a: null };
* const source = { a: [1, 2, 3] };
*
* const result = merge(target, source);
* console.log(result);
* // Output: { a: [1, 2, 3] }
*/ function merge(object, ...sources) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$object$2f$mergeWith$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeWith"])(object, ...sources, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$function$2f$noop$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]);
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/compat/object/mergeWith.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mergeWith",
    ()=>mergeWith
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isPrimitive$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/predicate/isPrimitive.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$object$2f$clone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/object/clone.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$getSymbols$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/_internal/getSymbols.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isBuffer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/predicate/isBuffer.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$_internal$2f$isUnsafeProperty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/_internal/isUnsafeProperty.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isPlainObject$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/predicate/isPlainObject.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$object$2f$cloneDeep$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/object/cloneDeep.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isArguments$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/predicate/isArguments.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/predicate/isObjectLike.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isArrayLikeObject$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/predicate/isArrayLikeObject.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isTypedArray$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/predicate/isTypedArray.mjs [app-client] (ecmascript)");
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
//#region src/compat/object/mergeWith.ts
/**
* Merges the properties of one or more source objects into the target object using a customizer function.
*
* This function performs a deep merge, recursively merging nested objects and arrays.
* If a property in the source object is an array or object and the corresponding property in the target object is also an array or object, they will be merged.
* If a property in the source object is `undefined`, it will not overwrite a defined property in the target object.
*
* You can provide a custom `merge` function to control how properties are merged. The `merge` function is called for each property that is being merged and receives the following arguments:
*
* - `targetValue`: The current value of the property in the target object.
* - `sourceValue`: The value of the property in the source object.
* - `key`: The key of the property being merged.
* - `target`: The target object.
* - `source`: The source object.
* - `stack`: A `Map` used to keep track of objects that have already been processed to handle circular references.
*
* The `merge` function should return the value to be set in the target object. If it returns `undefined`, a default deep merge will be applied for arrays and objects.
*
* The function can handle multiple source objects and will merge them all into the target object.
*
* @param object - The target object into which the source object properties will be merged. This object is modified in place.
* @param otherArgs - Additional source objects to merge into the target object, including the custom `merge` function.
* @returns The updated target object with properties from the source object(s) merged in.
*
* @example
* const target = { a: 1, b: 2 };
* const source = { b: 3, c: 4 };
*
* mergeWith(target, source, (targetValue, sourceValue) => {
*   if (typeof targetValue === 'number' && typeof sourceValue === 'number') {
*     return targetValue + sourceValue;
*   }
* });
* // Returns { a: 1, b: 5, c: 4 }
* @example
* const target = { a: [1], b: [2] };
* const source = { a: [3], b: [4] };
*
* const result = mergeWith(target, source, (objValue, srcValue) => {
*   if (Array.isArray(objValue)) {
*     return objValue.concat(srcValue);
*   }
* });
*
* expect(result).toEqual({ a: [1, 3], b: [2, 4] });
*/ function mergeWith(object, ...otherArgs) {
    const sources = otherArgs.slice(0, -1);
    const merge = otherArgs[otherArgs.length - 1];
    let result = object;
    for(let i = 0; i < sources.length; i++){
        const source = sources[i];
        result = mergeWithDeep(result, source, merge, /* @__PURE__ */ new Map());
    }
    return result;
}
function mergeWithDeep(target, source, merge, stack) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isPrimitive$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPrimitive"])(target)) target = Object(target);
    if (source == null || typeof source !== "object") return target;
    if (stack.has(source)) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$object$2f$clone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clone"])(stack.get(source));
    stack.set(source, target);
    if (Array.isArray(source)) {
        source = source.slice();
        for(let i = 0; i < source.length; i++)source[i] = source[i] ?? void 0;
    }
    const sourceKeys = [
        ...Object.keys(source),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$getSymbols$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSymbols"])(source)
    ];
    for(let i = 0; i < sourceKeys.length; i++){
        const key = sourceKeys[i];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$_internal$2f$isUnsafeProperty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUnsafeProperty"])(key)) continue;
        let sourceValue = source[key];
        let targetValue = target[key];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isArguments$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArguments"])(sourceValue)) sourceValue = {
            ...sourceValue
        };
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isArguments$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArguments"])(targetValue)) targetValue = {
            ...targetValue
        };
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isBuffer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBuffer"])(sourceValue)) sourceValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$object$2f$cloneDeep$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneDeep"])(sourceValue);
        if (Array.isArray(sourceValue)) if (Array.isArray(targetValue)) {
            const cloned = [];
            const targetKeys = Reflect.ownKeys(targetValue);
            for(let i = 0; i < targetKeys.length; i++){
                const targetKey = targetKeys[i];
                cloned[targetKey] = targetValue[targetKey];
            }
            targetValue = cloned;
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isArrayLikeObject$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArrayLikeObject"])(targetValue)) {
            const cloned = [];
            for(let i = 0; i < targetValue.length; i++)cloned[i] = targetValue[i];
            targetValue = cloned;
        } else targetValue = [];
        const merged = merge(targetValue, sourceValue, key, target, source, stack);
        if (merged !== void 0) target[key] = merged;
        else if (Array.isArray(sourceValue)) target[key] = mergeWithDeep(targetValue, sourceValue, merge, stack);
        else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectLike"])(targetValue) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectLike"])(sourceValue) && ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isPlainObject$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPlainObject"])(targetValue) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isPlainObject$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPlainObject"])(sourceValue) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isTypedArray$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypedArray"])(targetValue) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isTypedArray$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypedArray"])(sourceValue))) target[key] = mergeWithDeep(targetValue, sourceValue, merge, stack);
        else if (targetValue == null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isPlainObject$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPlainObject"])(sourceValue)) target[key] = mergeWithDeep({}, sourceValue, merge, stack);
        else if (targetValue == null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isTypedArray$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypedArray"])(sourceValue)) target[key] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$object$2f$cloneDeep$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneDeep"])(sourceValue);
        else if (targetValue === void 0 || sourceValue !== void 0) target[key] = sourceValue;
    }
    return target;
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/compat/predicate/isArguments.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isArguments",
    ()=>isArguments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$getTag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/_internal/getTag.mjs [app-client] (ecmascript)");
;
//#region src/compat/predicate/isArguments.ts
/**
* Checks if the given value is an arguments object.
*
* This function tests whether the provided value is an arguments object or not.
* It returns `true` if the value is an arguments object, and `false` otherwise.
*
* This function can also serve as a type predicate in TypeScript, narrowing the type of the argument to an arguments object.
*
* @param value - The value to test if it is an arguments object.
* @returns `true` if the value is an arguments, `false` otherwise.
*
* @example
* const args = (function() { return arguments; })();
* const strictArgs = (function() { 'use strict'; return arguments; })();
* const value = [1, 2, 3];
*
* console.log(isArguments(args)); // true
* console.log(isArguments(strictArgs)); // true
* console.log(isArguments(value)); // false
*/ function isArguments(value) {
    return value !== null && typeof value === "object" && (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$getTag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTag"])(value) === "[object Arguments]";
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/compat/predicate/isArrayLike.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isArrayLike",
    ()=>isArrayLike
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isLength$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/predicate/isLength.mjs [app-client] (ecmascript)");
;
//#region src/compat/predicate/isArrayLike.ts
/**
* Checks if `value` is array-like.
*
* @param value The value to check.
* @returns Returns `true` if `value` is array-like, else `false`.
*
* @example
* isArrayLike([1, 2, 3]); // true
* isArrayLike('abc'); // true
* isArrayLike({ 0: 'a', length: 1 }); // true
* isArrayLike({}); // false
* isArrayLike(null); // false
* isArrayLike(undefined); // false
*/ function isArrayLike(value) {
    return value != null && typeof value !== "function" && (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isLength$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLength"])(value.length);
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/compat/predicate/isArrayLikeObject.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isArrayLikeObject",
    ()=>isArrayLikeObject
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isArrayLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/predicate/isArrayLike.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/predicate/isObjectLike.mjs [app-client] (ecmascript)");
;
;
//#region src/compat/predicate/isArrayLikeObject.ts
/**
* Checks if the given value is a non-primitive, array-like object.
*
* @param value The value to check.
* @returns `true` if the value is a non-primitive, array-like object, `false` otherwise.
*
* @example
* isArrayLikeObject([1, 2, 3]); // true
* isArrayLikeObject({ 0: 'a', length: 1 }); // true
* isArrayLikeObject('abc'); // false
* isArrayLikeObject(()=>{}); // false
*/ function isArrayLikeObject(value) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isObjectLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObjectLike"])(value) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$predicate$2f$isArrayLike$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArrayLike"])(value);
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/compat/predicate/isObjectLike.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isObjectLike",
    ()=>isObjectLike
]);
//#region src/compat/predicate/isObjectLike.ts
/**
* Checks if the given value is object-like.
*
* A value is object-like if its type is object and it is not null.
*
* This function can also serve as a type predicate in TypeScript, narrowing the type of the argument to an object-like value.
*
* @param value - The value to test if it is an object-like.
* @returns `true` if the value is an object-like, `false` otherwise.
*
* @example
* const value1 = { a: 1 };
* const value2 = [1, 2, 3];
* const value3 = 'abc';
* const value4 = () => {};
* const value5 = null;
*
* console.log(isObjectLike(value1)); // true
* console.log(isObjectLike(value2)); // true
* console.log(isObjectLike(value3)); // false
* console.log(isObjectLike(value4)); // false
* console.log(isObjectLike(value5)); // false
*/ function isObjectLike(value) {
    return typeof value === "object" && value !== null;
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/compat/predicate/isPlainObject.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isPlainObject",
    ()=>isPlainObject
]);
//#region src/compat/predicate/isPlainObject.ts
/**
* Checks if a given value is a plain object.
*
* A plain object is an object created by the `{}` literal, `new Object()`, or
* `Object.create(null)`.
*
* This function also handles objects with custom
* `Symbol.toStringTag` properties.
*
* `Symbol.toStringTag` is a built-in symbol that a constructor can use to customize the
* default string description of objects.
*
* @param [object] - The value to check.
* @returns True if the value is a plain object, otherwise false.
*
* @example
* console.log(isPlainObject({})); // true
* console.log(isPlainObject([])); // false
* console.log(isPlainObject(null)); // false
* console.log(isPlainObject(Object.create(null))); // true
* console.log(isPlainObject(new Map())); // false
*/ function isPlainObject(object) {
    if (typeof object !== "object") return false;
    if (object == null) return false;
    if (Object.getPrototypeOf(object) === null) return true;
    if (Object.prototype.toString.call(object) !== "[object Object]") {
        const tag = object[Symbol.toStringTag];
        if (tag == null) return false;
        if (!Object.getOwnPropertyDescriptor(object, Symbol.toStringTag)?.writable) return false;
        return object.toString() === `[object ${tag}]`;
    }
    let proto = object;
    while(Object.getPrototypeOf(proto) !== null)proto = Object.getPrototypeOf(proto);
    return Object.getPrototypeOf(object) === proto;
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/compat/predicate/isTypedArray.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isTypedArray",
    ()=>isTypedArray
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isTypedArray$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/predicate/isTypedArray.mjs [app-client] (ecmascript)");
;
//#region src/compat/predicate/isTypedArray.ts
/**
* Checks if a value is a TypedArray.
* @param x The value to check.
* @returns Returns true if `x` is a TypedArray, false otherwise.
*
* @example
* const arr = new Uint8Array([1, 2, 3]);
* isTypedArray(arr); // true
*
* const regularArray = [1, 2, 3];
* isTypedArray(regularArray); // false
*
* const buffer = new ArrayBuffer(16);
* isTypedArray(buffer); // false
*/ function isTypedArray(x) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isTypedArray$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypedArray"])(x);
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/function/noop.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "noop",
    ()=>noop
]);
//#region src/function/noop.ts
/**
* A no-operation function that does nothing.
* This can be used as a placeholder or default function.
*
* @example
* noop(); // Does nothing
*
* @returns This function does not return anything.
*/ function noop() {}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/object/clone.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clone",
    ()=>clone
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isPrimitive$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/predicate/isPrimitive.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isTypedArray$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/predicate/isTypedArray.mjs [app-client] (ecmascript)");
;
;
//#region src/object/clone.ts
/**
* Creates a shallow clone of the given object.
*
* @template T - The type of the object.
* @param obj - The object to clone.
* @returns A shallow clone of the given object.
*
* @example
* // Clone a primitive value
* const num = 29;
* const clonedNum = clone(num);
* console.log(clonedNum); // 29
* console.log(clonedNum === num); // true
*
* @example
* // Clone an array
* const arr = [1, 2, 3];
* const clonedArr = clone(arr);
* console.log(clonedArr); // [1, 2, 3]
* console.log(clonedArr === arr); // false
*
* @example
* // Clone an object
* const obj = { a: 1, b: 'es-toolkit', c: [1, 2, 3] };
* const clonedObj = clone(obj);
* console.log(clonedObj); // { a: 1, b: 'es-toolkit', c: [1, 2, 3] }
* console.log(clonedObj === obj); // false
*/ function clone(obj) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isPrimitive$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPrimitive"])(obj)) return obj;
    if (Array.isArray(obj) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isTypedArray$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypedArray"])(obj) || obj instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && obj instanceof SharedArrayBuffer) return obj.slice(0);
    const prototype = Object.getPrototypeOf(obj);
    if (prototype == null) return Object.assign(Object.create(prototype), obj);
    const Constructor = prototype.constructor;
    if (obj instanceof Date || obj instanceof Map || obj instanceof Set) return new Constructor(obj);
    if (obj instanceof RegExp) {
        const newRegExp = new Constructor(obj);
        newRegExp.lastIndex = obj.lastIndex;
        return newRegExp;
    }
    if (obj instanceof DataView) return new Constructor(obj.buffer.slice(0));
    if (obj instanceof Error) {
        let newError;
        if (obj instanceof AggregateError) newError = new Constructor(obj.errors, obj.message, {
            cause: obj.cause
        });
        else newError = new Constructor(obj.message, {
            cause: obj.cause
        });
        newError.stack = obj.stack;
        Object.assign(newError, obj);
        return newError;
    }
    if (typeof File !== "undefined" && obj instanceof File) return new Constructor([
        obj
    ], obj.name, {
        type: obj.type,
        lastModified: obj.lastModified
    });
    if (typeof obj === "object") return Object.assign(Object.create(prototype), obj);
    return obj;
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/object/cloneDeepWith.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cloneDeepWith",
    ()=>cloneDeepWith,
    "cloneDeepWithImpl",
    ()=>cloneDeepWithImpl,
    "copyProperties",
    ()=>copyProperties
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isPrimitive$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/predicate/isPrimitive.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isTypedArray$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/predicate/isTypedArray.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$getSymbols$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/_internal/getSymbols.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$getTag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/_internal/getTag.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/_internal/tags.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isBuffer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/predicate/isBuffer.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
//#region src/object/cloneDeepWith.ts
/**
* Deeply clones the given object.
*
* You can customize the deep cloning process using the `cloneValue` function.
* The function takes the current value `value`, the property name `key`, and the entire object `obj` as arguments.
* If the function returns a value, that value is used;
* if it returns `undefined`, the default cloning method is used.
*
* @template T - The type of the object.
* @param obj - The object to clone.
* @param [cloneValue] - A function to customize the cloning process.
* @returns A deep clone of the given object.
*
* @example
* // Clone a primitive value
* const num = 29;
* const clonedNum = cloneDeepWith(num);
* console.log(clonedNum); // 29
* console.log(clonedNum === num); // true
*
* @example
* // Clone an object with a customizer
* const obj = { a: 1, b: 2 };
* const clonedObj = cloneDeepWith(obj, (value) => {
*   if (typeof value === 'number') {
*     return value * 2; // Double the number
*   }
* });
* console.log(clonedObj); // { a: 2, b: 4 }
* console.log(clonedObj === obj); // false
*
* @example
* // Clone an array with a customizer
* const arr = [1, 2, 3];
* const clonedArr = cloneDeepWith(arr, (value) => {
*   if (typeof value === 'number') {
*     return value + 1; // Increment each number
*   }
* });
* console.log(clonedArr); // [2, 3, 4]
* console.log(clonedArr === arr); // false
*/ function cloneDeepWith(obj, cloneValue) {
    return cloneDeepWithImpl(obj, void 0, obj, /* @__PURE__ */ new Map(), cloneValue);
}
function cloneDeepWithImpl(valueToClone, keyToClone, objectToClone, stack = /* @__PURE__ */ new Map(), cloneValue = void 0) {
    const cloned = cloneValue?.(valueToClone, keyToClone, objectToClone, stack);
    if (cloned !== void 0) return cloned;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isPrimitive$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPrimitive"])(valueToClone)) return valueToClone;
    if (stack.has(valueToClone)) return stack.get(valueToClone);
    if (Array.isArray(valueToClone)) {
        const result = new Array(valueToClone.length);
        stack.set(valueToClone, result);
        for(let i = 0; i < valueToClone.length; i++)result[i] = cloneDeepWithImpl(valueToClone[i], i, objectToClone, stack, cloneValue);
        if (Object.hasOwn(valueToClone, "index")) result.index = valueToClone.index;
        if (Object.hasOwn(valueToClone, "input")) result.input = valueToClone.input;
        return result;
    }
    if (valueToClone instanceof Date) return new Date(valueToClone.getTime());
    if (valueToClone instanceof RegExp) {
        const result = new RegExp(valueToClone.source, valueToClone.flags);
        result.lastIndex = valueToClone.lastIndex;
        return result;
    }
    if (valueToClone instanceof Map) {
        const result = /* @__PURE__ */ new Map();
        stack.set(valueToClone, result);
        for (const [key, value] of valueToClone)result.set(key, cloneDeepWithImpl(value, key, objectToClone, stack, cloneValue));
        return result;
    }
    if (valueToClone instanceof Set) {
        const result = /* @__PURE__ */ new Set();
        stack.set(valueToClone, result);
        for (const value of valueToClone)result.add(cloneDeepWithImpl(value, void 0, objectToClone, stack, cloneValue));
        return result;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isBuffer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBuffer"])(valueToClone)) return valueToClone.subarray();
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isTypedArray$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypedArray"])(valueToClone)) {
        const result = new (Object.getPrototypeOf(valueToClone)).constructor(valueToClone.length);
        stack.set(valueToClone, result);
        for(let i = 0; i < valueToClone.length; i++)result[i] = cloneDeepWithImpl(valueToClone[i], i, objectToClone, stack, cloneValue);
        return result;
    }
    if (valueToClone instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && valueToClone instanceof SharedArrayBuffer) return valueToClone.slice(0);
    if (valueToClone instanceof DataView) {
        const result = new DataView(valueToClone.buffer.slice(0), valueToClone.byteOffset, valueToClone.byteLength);
        stack.set(valueToClone, result);
        copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
        return result;
    }
    if (typeof File !== "undefined" && valueToClone instanceof File) {
        const result = new File([
            valueToClone
        ], valueToClone.name, {
            type: valueToClone.type
        });
        stack.set(valueToClone, result);
        copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
        return result;
    }
    if (typeof Blob !== "undefined" && valueToClone instanceof Blob) {
        const result = new Blob([
            valueToClone
        ], {
            type: valueToClone.type
        });
        stack.set(valueToClone, result);
        copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
        return result;
    }
    if (valueToClone instanceof Error) {
        const result = structuredClone(valueToClone);
        stack.set(valueToClone, result);
        result.message = valueToClone.message;
        result.name = valueToClone.name;
        result.stack = valueToClone.stack;
        result.cause = valueToClone.cause;
        result.constructor = valueToClone.constructor;
        copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
        return result;
    }
    if (valueToClone instanceof Boolean) {
        const result = new Boolean(valueToClone.valueOf());
        stack.set(valueToClone, result);
        copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
        return result;
    }
    if (valueToClone instanceof Number) {
        const result = new Number(valueToClone.valueOf());
        stack.set(valueToClone, result);
        copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
        return result;
    }
    if (valueToClone instanceof String) {
        const result = new String(valueToClone.valueOf());
        stack.set(valueToClone, result);
        copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
        return result;
    }
    if (typeof valueToClone === "object" && isCloneableObject(valueToClone)) {
        const result = Object.create(Object.getPrototypeOf(valueToClone));
        stack.set(valueToClone, result);
        copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
        return result;
    }
    return valueToClone;
}
function copyProperties(target, source, objectToClone = target, stack, cloneValue) {
    const keys = [
        ...Object.keys(source),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$getSymbols$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSymbols"])(source)
    ];
    for(let i = 0; i < keys.length; i++){
        const key = keys[i];
        const descriptor = Object.getOwnPropertyDescriptor(target, key);
        if (descriptor == null || descriptor.writable) target[key] = cloneDeepWithImpl(source[key], key, objectToClone, stack, cloneValue);
    }
}
function isCloneableObject(object) {
    switch((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$getTag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTag"])(object)){
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["argumentsTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayBufferTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dataViewTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["booleanTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dateTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["float32ArrayTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["float64ArrayTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["int8ArrayTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["int16ArrayTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["int32ArrayTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["objectTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["regexpTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["symbolTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uint8ArrayTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uint8ClampedArrayTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uint16ArrayTag"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$_internal$2f$tags$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uint32ArrayTag"]:
            return true;
        default:
            return false;
    }
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/predicate/isBuffer.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isBuffer",
    ()=>isBuffer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$_internal$2f$globalThis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/_internal/globalThis.mjs [app-client] (ecmascript)");
;
//#region src/predicate/isBuffer.ts
/**
* Checks if the given value is a Buffer instance.
*
* This function tests whether the provided value is an instance of Buffer.
* It returns `true` if the value is a Buffer, and `false` otherwise.
*
* This function can also serve as a type predicate in TypeScript, narrowing the type of the argument to `Buffer`.
*
* @param x - The value to check if it is a Buffer.
* @returns Returns `true` if `x` is a Buffer, else `false`.
*
* @example
* const buffer = Buffer.from("test");
* console.log(isBuffer(buffer)); // true
*
* const notBuffer = "not a buffer";
* console.log(isBuffer(notBuffer)); // false
*/ function isBuffer(x) {
    return typeof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$_internal$2f$globalThis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globalThis_"].Buffer !== "undefined" && __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$_internal$2f$globalThis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["globalThis_"].Buffer.isBuffer(x);
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/predicate/isLength.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isLength",
    ()=>isLength
]);
//#region src/predicate/isLength.ts
/**
* Checks if a given value is a valid length.
*
* A valid length is of type `number`, is a non-negative integer, and is less than or equal to
* JavaScript's maximum safe integer (`Number.MAX_SAFE_INTEGER`).
* It returns `true` if the value is a valid length, and `false` otherwise.
*
* This function can also serve as a type predicate in TypeScript, narrowing the type of the
* argument to a valid length (`number`).
*
* @param value The value to check.
* @returns Returns `true` if `value` is a valid length, else `false`.
*
* @example
* isLength(0); // true
* isLength(42); // true
* isLength(-1); // false
* isLength(1.5); // false
* isLength(Number.MAX_SAFE_INTEGER); // true
* isLength(Number.MAX_SAFE_INTEGER + 1); // false
*/ function isLength(value) {
    return Number.isSafeInteger(value) && value >= 0;
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/predicate/isPrimitive.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isPrimitive",
    ()=>isPrimitive
]);
//#region src/predicate/isPrimitive.ts
/**
* Checks whether a value is a JavaScript primitive.
* JavaScript primitives include null, undefined, strings, numbers, booleans, symbols, and bigints.
*
* @param value The value to check.
* @returns Returns true if `value` is a primitive, false otherwise.
*
* @example
* isPrimitive(null); // true
* isPrimitive(undefined); // true
* isPrimitive('123'); // true
* isPrimitive(false); // true
* isPrimitive(true); // true
* isPrimitive(Symbol('a')); // true
* isPrimitive(123n); // true
* isPrimitive({}); // false
* isPrimitive(new Date()); // false
* isPrimitive(new Map()); // false
* isPrimitive(new Set()); // false
* isPrimitive([1, 2, 3]); // false
*/ function isPrimitive(value) {
    return value == null || typeof value !== "object" && typeof value !== "function";
}
;
}),
"[project]/frontend/node_modules/es-toolkit/dist/predicate/isTypedArray.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isTypedArray",
    ()=>isTypedArray
]);
//#region src/predicate/isTypedArray.ts
/**
* Checks if a value is a TypedArray.
* @param x The value to check.
* @returns Returns true if `x` is a TypedArray, false otherwise.
*
* @example
* const arr = new Uint8Array([1, 2, 3]);
* isTypedArray(arr); // true
*
* const regularArray = [1, 2, 3];
* isTypedArray(regularArray); // false
*
* const buffer = new ArrayBuffer(16);
* isTypedArray(buffer); // false
*/ function isTypedArray(x) {
    return ArrayBuffer.isView(x) && !(x instanceof DataView);
}
;
}),
"[project]/frontend/node_modules/internmap/src/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InternMap",
    ()=>InternMap,
    "InternSet",
    ()=>InternSet
]);
class InternMap extends Map {
    constructor(entries, key = keyof){
        super();
        Object.defineProperties(this, {
            _intern: {
                value: new Map()
            },
            _key: {
                value: key
            }
        });
        if (entries != null) for (const [key, value] of entries)this.set(key, value);
    }
    get(key) {
        return super.get(intern_get(this, key));
    }
    has(key) {
        return super.has(intern_get(this, key));
    }
    set(key, value) {
        return super.set(intern_set(this, key), value);
    }
    delete(key) {
        return super.delete(intern_delete(this, key));
    }
}
class InternSet extends Set {
    constructor(values, key = keyof){
        super();
        Object.defineProperties(this, {
            _intern: {
                value: new Map()
            },
            _key: {
                value: key
            }
        });
        if (values != null) for (const value of values)this.add(value);
    }
    has(value) {
        return super.has(intern_get(this, value));
    }
    add(value) {
        return super.add(intern_set(this, value));
    }
    delete(value) {
        return super.delete(intern_delete(this, value));
    }
}
function intern_get({ _intern, _key }, value) {
    const key = _key(value);
    return _intern.has(key) ? _intern.get(key) : value;
}
function intern_set({ _intern, _key }, value) {
    const key = _key(value);
    if (_intern.has(key)) return _intern.get(key);
    _intern.set(key, value);
    return value;
}
function intern_delete({ _intern, _key }, value) {
    const key = _key(value);
    if (_intern.has(key)) {
        value = _intern.get(key);
        _intern.delete(key);
    }
    return value;
}
function keyof(value) {
    return value !== null && typeof value === "object" ? value.valueOf() : value;
}
}),
"[project]/frontend/node_modules/khroma/dist/channels/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/utils/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$channels$2f$type$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/channels/type.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/constants.js [app-client] (ecmascript)");
;
;
;
/* MAIN */ class Channels {
    /* CONSTRUCTOR */ constructor(data, color){
        this.color = color;
        this.changed = false;
        this.data = data; //TSC
        this.type = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$channels$2f$type$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
    }
    /* API */ set(data, color) {
        this.color = color;
        this.changed = false;
        this.data = data; //TSC
        this.type.type = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE"].ALL;
        return this;
    }
    /* HELPERS */ _ensureHSL() {
        const data = this.data;
        const { h, s, l } = data;
        if (h === undefined) data.h = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.rgb2hsl(data, 'h');
        if (s === undefined) data.s = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.rgb2hsl(data, 's');
        if (l === undefined) data.l = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.rgb2hsl(data, 'l');
    }
    _ensureRGB() {
        const data = this.data;
        const { r, g, b } = data;
        if (r === undefined) data.r = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.hsl2rgb(data, 'r');
        if (g === undefined) data.g = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.hsl2rgb(data, 'g');
        if (b === undefined) data.b = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.hsl2rgb(data, 'b');
    }
    /* GETTERS */ get r() {
        const data = this.data;
        const r = data.r;
        if (!this.type.is(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE"].HSL) && r !== undefined) return r;
        this._ensureHSL();
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.hsl2rgb(data, 'r');
    }
    get g() {
        const data = this.data;
        const g = data.g;
        if (!this.type.is(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE"].HSL) && g !== undefined) return g;
        this._ensureHSL();
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.hsl2rgb(data, 'g');
    }
    get b() {
        const data = this.data;
        const b = data.b;
        if (!this.type.is(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE"].HSL) && b !== undefined) return b;
        this._ensureHSL();
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.hsl2rgb(data, 'b');
    }
    get h() {
        const data = this.data;
        const h = data.h;
        if (!this.type.is(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE"].RGB) && h !== undefined) return h;
        this._ensureRGB();
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.rgb2hsl(data, 'h');
    }
    get s() {
        const data = this.data;
        const s = data.s;
        if (!this.type.is(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE"].RGB) && s !== undefined) return s;
        this._ensureRGB();
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.rgb2hsl(data, 's');
    }
    get l() {
        const data = this.data;
        const l = data.l;
        if (!this.type.is(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE"].RGB) && l !== undefined) return l;
        this._ensureRGB();
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.rgb2hsl(data, 'l');
    }
    get a() {
        return this.data.a;
    }
    /* SETTERS */ set r(r) {
        this.type.set(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE"].RGB);
        this.changed = true;
        this.data.r = r;
    }
    set g(g) {
        this.type.set(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE"].RGB);
        this.changed = true;
        this.data.g = g;
    }
    set b(b) {
        this.type.set(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE"].RGB);
        this.changed = true;
        this.data.b = b;
    }
    set h(h) {
        this.type.set(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE"].HSL);
        this.changed = true;
        this.data.h = h;
    }
    set s(s) {
        this.type.set(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE"].HSL);
        this.changed = true;
        this.data.s = s;
    }
    set l(l) {
        this.type.set(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE"].HSL);
        this.changed = true;
        this.data.l = l;
    }
    set a(a) {
        this.changed = true;
        this.data.a = a;
    }
}
const __TURBOPACK__default__export__ = Channels;
}),
"[project]/frontend/node_modules/khroma/dist/channels/reusable.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$channels$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/channels/index.js [app-client] (ecmascript)");
;
/* MAIN */ const channels = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$channels$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
    r: 0,
    g: 0,
    b: 0,
    a: 0
}, 'transparent');
const __TURBOPACK__default__export__ = channels;
}),
"[project]/frontend/node_modules/khroma/dist/channels/type.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/constants.js [app-client] (ecmascript)");
;
/* MAIN */ class Type {
    constructor(){
        /* VARIABLES */ this.type = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE"].ALL;
    }
    /* API */ get() {
        return this.type;
    }
    set(type) {
        if (this.type && this.type !== type) throw new Error('Cannot change both RGB and HSL channels at the same time');
        this.type = type;
    }
    reset() {
        this.type = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE"].ALL;
    }
    is(type) {
        return this.type === type;
    }
}
const __TURBOPACK__default__export__ = Type;
}),
"[project]/frontend/node_modules/khroma/dist/color/hex.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* IMPORT */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$channels$2f$reusable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/channels/reusable.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/constants.js [app-client] (ecmascript)");
;
;
;
/* MAIN */ const Hex = {
    /* VARIABLES */ re: /^#((?:[a-f0-9]{2}){2,4}|[a-f0-9]{3})$/i,
    /* API */ parse: (color)=>{
        if (color.charCodeAt(0) !== 35) return; // '#'
        const match = color.match(Hex.re);
        if (!match) return;
        const hex = match[1];
        const dec = parseInt(hex, 16);
        const length = hex.length;
        const hasAlpha = length % 4 === 0;
        const isFullLength = length > 4;
        const multiplier = isFullLength ? 1 : 17;
        const bits = isFullLength ? 8 : 4;
        const bitsOffset = hasAlpha ? 0 : -1;
        const mask = isFullLength ? 255 : 15;
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$channels$2f$reusable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set({
            r: (dec >> bits * (bitsOffset + 3) & mask) * multiplier,
            g: (dec >> bits * (bitsOffset + 2) & mask) * multiplier,
            b: (dec >> bits * (bitsOffset + 1) & mask) * multiplier,
            a: hasAlpha ? (dec & mask) * multiplier / 255 : 1
        }, color);
    },
    stringify: (channels)=>{
        const { r, g, b, a } = channels;
        if (a < 1) {
            return `#${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEC2HEX"][Math.round(r)]}${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEC2HEX"][Math.round(g)]}${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEC2HEX"][Math.round(b)]}${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEC2HEX"][Math.round(a * 255)]}`;
        } else {
            return `#${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEC2HEX"][Math.round(r)]}${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEC2HEX"][Math.round(g)]}${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEC2HEX"][Math.round(b)]}`;
        }
    }
};
const __TURBOPACK__default__export__ = Hex;
}),
"[project]/frontend/node_modules/khroma/dist/color/hsl.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/utils/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$channels$2f$reusable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/channels/reusable.js [app-client] (ecmascript)");
;
;
/* MAIN */ const HSL = {
    /* VARIABLES */ re: /^hsla?\(\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?(?:deg|grad|rad|turn)?)\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?%)\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?%)(?:\s*?(?:,|\/)\s*?\+?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?(%)?))?\s*?\)$/i,
    hueRe: /^(.+?)(deg|grad|rad|turn)$/i,
    /* HELPERS */ _hue2deg: (hue)=>{
        const match = hue.match(HSL.hueRe);
        if (match) {
            const [, number, unit] = match;
            switch(unit){
                case 'grad':
                    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp.h(parseFloat(number) * .9);
                case 'rad':
                    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp.h(parseFloat(number) * 180 / Math.PI);
                case 'turn':
                    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp.h(parseFloat(number) * 360);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp.h(parseFloat(hue));
    },
    /* API */ parse: (color)=>{
        const charCode = color.charCodeAt(0);
        if (charCode !== 104 && charCode !== 72) return; // 'h'/'H'
        const match = color.match(HSL.re);
        if (!match) return;
        const [, h, s, l, a, isAlphaPercentage] = match;
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$channels$2f$reusable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set({
            h: HSL._hue2deg(h),
            s: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp.s(parseFloat(s)),
            l: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp.l(parseFloat(l)),
            a: a ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp.a(isAlphaPercentage ? parseFloat(a) / 100 : parseFloat(a)) : 1
        }, color);
    },
    stringify: (channels)=>{
        const { h, s, l, a } = channels;
        if (a < 1) {
            return `hsla(${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lang.round(h)}, ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lang.round(s)}%, ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lang.round(l)}%, ${a})`;
        } else {
            return `hsl(${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lang.round(h)}, ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lang.round(s)}%, ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lang.round(l)}%)`;
        }
    }
};
const __TURBOPACK__default__export__ = HSL;
}),
"[project]/frontend/node_modules/khroma/dist/color/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* IMPORT */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$hex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/color/hex.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$hsl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/color/hsl.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$keyword$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/color/keyword.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/color/rgb.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/constants.js [app-client] (ecmascript)");
;
;
;
;
;
;
/* MAIN */ const Color = {
    /* VARIABLES */ format: {
        keyword: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$keyword$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        hex: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$hex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        rgb: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        rgba: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        hsl: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$hsl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        hsla: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$hsl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    },
    /* API */ parse: (color)=>{
        if (typeof color !== 'string') return color;
        const channels = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$hex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parse(color) || __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parse(color) || __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$hsl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parse(color) || __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$keyword$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parse(color); // Color providers ordered with performance in mind
        if (channels) return channels;
        throw new Error(`Unsupported color format: "${color}"`);
    },
    stringify: (channels)=>{
        // SASS returns a keyword if possible, but we avoid doing that as it's slower and doesn't really add any value
        if (!channels.changed && channels.color) return channels.color;
        if (channels.type.is(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TYPE"].HSL) || channels.data.r === undefined) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$hsl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].stringify(channels);
        } else if (channels.a < 1 || !Number.isInteger(channels.r) || !Number.isInteger(channels.g) || !Number.isInteger(channels.b)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].stringify(channels);
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$hex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].stringify(channels);
        }
    }
};
const __TURBOPACK__default__export__ = Color;
}),
"[project]/frontend/node_modules/khroma/dist/color/keyword.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$hex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/color/hex.js [app-client] (ecmascript)");
;
/* MAIN */ const Keyword = {
    /* VARIABLES */ colors: {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyanaqua: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkgrey: '#a9a9a9',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkslategrey: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dimgrey: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        grey: '#808080',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrodyellow: '#fafad2',
        lightgray: '#d3d3d3',
        lightgreen: '#90ee90',
        lightgrey: '#d3d3d3',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightslategrey: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370db',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#db7093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        rebeccapurple: '#663399',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        slategrey: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        transparent: '#00000000',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32'
    },
    /* API */ parse: (color)=>{
        color = color.toLowerCase();
        const hex = Keyword.colors[color];
        if (!hex) return;
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$hex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parse(hex);
    },
    stringify: (channels)=>{
        const hex = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$hex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].stringify(channels);
        for(const name in Keyword.colors){
            if (Keyword.colors[name] === hex) return name;
        }
        return;
    }
};
const __TURBOPACK__default__export__ = Keyword;
}),
"[project]/frontend/node_modules/khroma/dist/color/rgb.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/utils/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$channels$2f$reusable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/channels/reusable.js [app-client] (ecmascript)");
;
;
/* MAIN */ const RGB = {
    /* VARIABLES */ re: /^rgba?\(\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))(?:\s*?(?:,|\/)\s*?\+?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?)))?\s*?\)$/i,
    /* API */ parse: (color)=>{
        const charCode = color.charCodeAt(0);
        if (charCode !== 114 && charCode !== 82) return; // 'r'/'R'
        const match = color.match(RGB.re);
        if (!match) return;
        const [, r, isRedPercentage, g, isGreenPercentage, b, isBluePercentage, a, isAlphaPercentage] = match;
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$channels$2f$reusable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set({
            r: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp.r(isRedPercentage ? parseFloat(r) * 2.55 : parseFloat(r)),
            g: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp.g(isGreenPercentage ? parseFloat(g) * 2.55 : parseFloat(g)),
            b: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp.b(isBluePercentage ? parseFloat(b) * 2.55 : parseFloat(b)),
            a: a ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp.a(isAlphaPercentage ? parseFloat(a) / 100 : parseFloat(a)) : 1
        }, color);
    },
    stringify: (channels)=>{
        const { r, g, b, a } = channels;
        if (a < 1) {
            return `rgba(${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lang.round(r)}, ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lang.round(g)}, ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lang.round(b)}, ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lang.round(a)})`;
        } else {
            return `rgb(${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lang.round(r)}, ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lang.round(g)}, ${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lang.round(b)})`;
        }
    }
};
const __TURBOPACK__default__export__ = RGB;
}),
"[project]/frontend/node_modules/khroma/dist/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEC2HEX",
    ()=>DEC2HEX,
    "TYPE",
    ()=>TYPE
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/utils/index.js [app-client] (ecmascript)");
;
/* MAIN */ const DEC2HEX = {};
for(let i = 0; i <= 255; i++)DEC2HEX[i] = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].unit.dec2hex(i); // Populating dynamically, striking a balance between code size and performance
const TYPE = {
    ALL: 0,
    RGB: 1,
    HSL: 2
};
;
}),
"[project]/frontend/node_modules/khroma/dist/methods/adjust.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/color/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$change$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/change.js [app-client] (ecmascript)");
;
;
/* MAIN */ const adjust = (color, channels)=>{
    const ch = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parse(color);
    const changes = {};
    for(const c in channels){
        if (!channels[c]) continue;
        changes[c] = ch[c] + channels[c];
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$change$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(color, changes);
};
const __TURBOPACK__default__export__ = adjust;
}),
"[project]/frontend/node_modules/khroma/dist/methods/adjust.js [app-client] (ecmascript) <export default as adjust>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adjust",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/adjust.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/khroma/dist/methods/adjust_channel.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/utils/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/color/index.js [app-client] (ecmascript)");
;
;
/* MAIN */ const adjustChannel = (color, channel, amount)=>{
    const channels = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parse(color);
    const amountCurrent = channels[channel];
    const amountNext = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp[channel](amountCurrent + amount);
    if (amountCurrent !== amountNext) channels[channel] = amountNext;
    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].stringify(channels);
};
const __TURBOPACK__default__export__ = adjustChannel;
}),
"[project]/frontend/node_modules/khroma/dist/methods/change.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/utils/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/color/index.js [app-client] (ecmascript)");
;
;
/* MAIN */ const change = (color, channels)=>{
    const ch = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parse(color);
    for(const c in channels){
        ch[c] = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp[c](channels[c]);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].stringify(ch);
};
const __TURBOPACK__default__export__ = change;
}),
"[project]/frontend/node_modules/khroma/dist/methods/darken.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust_channel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/adjust_channel.js [app-client] (ecmascript)");
;
/* MAIN */ const darken = (color, amount)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust_channel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(color, 'l', -amount);
};
const __TURBOPACK__default__export__ = darken;
}),
"[project]/frontend/node_modules/khroma/dist/methods/darken.js [app-client] (ecmascript) <export default as darken>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "darken",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$darken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/darken.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/khroma/dist/methods/invert.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/color/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$mix$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/mix.js [app-client] (ecmascript)");
;
;
/* MAIN */ const invert = (color, weight = 100)=>{
    const inverse = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parse(color);
    inverse.r = 255 - inverse.r;
    inverse.g = 255 - inverse.g;
    inverse.b = 255 - inverse.b;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$mix$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(inverse, color, weight);
};
const __TURBOPACK__default__export__ = invert;
}),
"[project]/frontend/node_modules/khroma/dist/methods/invert.js [app-client] (ecmascript) <export default as invert>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "invert",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$invert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/invert.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/khroma/dist/methods/is_dark.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$is_light$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/is_light.js [app-client] (ecmascript)");
;
/* MAIN */ const isDark = (color)=>{
    return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$is_light$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(color);
};
const __TURBOPACK__default__export__ = isDark;
}),
"[project]/frontend/node_modules/khroma/dist/methods/is_dark.js [app-client] (ecmascript) <export default as isDark>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isDark",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$is_dark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$is_dark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/is_dark.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/khroma/dist/methods/is_light.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$luminance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/luminance.js [app-client] (ecmascript)");
;
/* MAIN */ const isLight = (color)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$luminance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(color) >= .5;
};
const __TURBOPACK__default__export__ = isLight;
}),
"[project]/frontend/node_modules/khroma/dist/methods/lighten.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust_channel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/adjust_channel.js [app-client] (ecmascript)");
;
/* MAIN */ const lighten = (color, amount)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$adjust_channel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(color, 'l', amount);
};
const __TURBOPACK__default__export__ = lighten;
}),
"[project]/frontend/node_modules/khroma/dist/methods/lighten.js [app-client] (ecmascript) <export default as lighten>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "lighten",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$lighten$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/lighten.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/khroma/dist/methods/luminance.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/utils/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/color/index.js [app-client] (ecmascript)");
;
;
/* MAIN */ //SOURCE: https://planetcalc.com/7779
const luminance = (color)=>{
    const { r, g, b } = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parse(color);
    const luminance = .2126 * __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.toLinear(r) + .7152 * __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.toLinear(g) + .0722 * __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.toLinear(b);
    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].lang.round(luminance);
};
const __TURBOPACK__default__export__ = luminance;
}),
"[project]/frontend/node_modules/khroma/dist/methods/mix.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/color/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$rgba$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/rgba.js [app-client] (ecmascript)");
;
;
/* MAIN */ //SOURCE: https://github.com/sass/dart-sass/blob/7457d2e9e7e623d9844ffd037a070cf32d39c348/lib/src/functions/color.dart#L718-L756
const mix = (color1, color2, weight = 50)=>{
    const { r: r1, g: g1, b: b1, a: a1 } = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parse(color1);
    const { r: r2, g: g2, b: b2, a: a2 } = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parse(color2);
    const weightScale = weight / 100;
    const weightNormalized = weightScale * 2 - 1;
    const alphaDelta = a1 - a2;
    const weight1combined = weightNormalized * alphaDelta === -1 ? weightNormalized : (weightNormalized + alphaDelta) / (1 + weightNormalized * alphaDelta);
    const weight1 = (weight1combined + 1) / 2;
    const weight2 = 1 - weight1;
    const r = r1 * weight1 + r2 * weight2;
    const g = g1 * weight1 + g2 * weight2;
    const b = b1 * weight1 + b2 * weight2;
    const a = a1 * weightScale + a2 * (1 - weightScale);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$rgba$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(r, g, b, a);
};
const __TURBOPACK__default__export__ = mix;
}),
"[project]/frontend/node_modules/khroma/dist/methods/rgba.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/utils/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$channels$2f$reusable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/channels/reusable.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/color/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$change$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/change.js [app-client] (ecmascript)");
;
;
;
;
/* MAIN */ const rgba = (r, g, b = 0, a = 1)=>{
    if (typeof r !== 'number') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$change$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(r, {
        a: g
    });
    const channels = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$channels$2f$reusable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set({
        r: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp.r(r),
        g: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp.g(g),
        b: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp.b(b),
        a: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].channel.clamp.a(a)
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$color$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].stringify(channels);
};
const __TURBOPACK__default__export__ = rgba;
}),
"[project]/frontend/node_modules/khroma/dist/methods/rgba.js [app-client] (ecmascript) <export default as rgba>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "rgba",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$rgba$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$methods$2f$rgba$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/methods/rgba.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/khroma/dist/utils/channel.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ /* MAIN */ const Channel = {
    /* CLAMP */ min: {
        r: 0,
        g: 0,
        b: 0,
        s: 0,
        l: 0,
        a: 0
    },
    max: {
        r: 255,
        g: 255,
        b: 255,
        h: 360,
        s: 100,
        l: 100,
        a: 1
    },
    clamp: {
        r: (r)=>r >= 255 ? 255 : r < 0 ? 0 : r,
        g: (g)=>g >= 255 ? 255 : g < 0 ? 0 : g,
        b: (b)=>b >= 255 ? 255 : b < 0 ? 0 : b,
        h: (h)=>h % 360,
        s: (s)=>s >= 100 ? 100 : s < 0 ? 0 : s,
        l: (l)=>l >= 100 ? 100 : l < 0 ? 0 : l,
        a: (a)=>a >= 1 ? 1 : a < 0 ? 0 : a
    },
    /* CONVERSION */ //SOURCE: https://planetcalc.com/7779
    toLinear: (c)=>{
        const n = c / 255;
        return c > .03928 ? Math.pow((n + .055) / 1.055, 2.4) : n / 12.92;
    },
    //SOURCE: https://gist.github.com/mjackson/5311256
    hue2rgb: (p, q, t)=>{
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    },
    hsl2rgb: ({ h, s, l }, channel)=>{
        if (!s) return l * 2.55; // Achromatic
        h /= 360;
        s /= 100;
        l /= 100;
        const q = l < .5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        switch(channel){
            case 'r':
                return Channel.hue2rgb(p, q, h + 1 / 3) * 255;
            case 'g':
                return Channel.hue2rgb(p, q, h) * 255;
            case 'b':
                return Channel.hue2rgb(p, q, h - 1 / 3) * 255;
        }
    },
    rgb2hsl: ({ r, g, b }, channel)=>{
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const l = (max + min) / 2;
        if (channel === 'l') return l * 100;
        if (max === min) return 0; // Achromatic
        const d = max - min;
        const s = l > .5 ? d / (2 - max - min) : d / (max + min);
        if (channel === 's') return s * 100;
        switch(max){
            case r:
                return ((g - b) / d + (g < b ? 6 : 0)) * 60;
            case g:
                return ((b - r) / d + 2) * 60;
            case b:
                return ((r - g) / d + 4) * 60;
            default:
                return -1; //TSC: TypeScript is stupid and complains if there isn't this useless default statement
        }
    }
};
const __TURBOPACK__default__export__ = Channel;
}),
"[project]/frontend/node_modules/khroma/dist/utils/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* IMPORT */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$channel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/utils/channel.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$lang$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/utils/lang.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$unit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/khroma/dist/utils/unit.js [app-client] (ecmascript)");
;
;
;
/* MAIN */ const Utils = {
    channel: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$channel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    lang: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$lang$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    unit: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$khroma$2f$dist$2f$utils$2f$unit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
};
const __TURBOPACK__default__export__ = Utils;
}),
"[project]/frontend/node_modules/khroma/dist/utils/lang.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* MAIN */ const Lang = {
    /* API */ clamp: (number, lower, upper)=>{
        if (lower > upper) return Math.min(lower, Math.max(upper, number));
        return Math.min(upper, Math.max(lower, number));
    },
    round: (number)=>{
        return Math.round(number * 10000000000) / 10000000000;
    }
};
const __TURBOPACK__default__export__ = Lang;
}),
"[project]/frontend/node_modules/khroma/dist/utils/unit.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* MAIN */ const Unit = {
    /* API */ dec2hex: (dec)=>{
        const hex = Math.round(dec).toString(16);
        return hex.length > 1 ? hex : `0${hex}`;
    }
};
const __TURBOPACK__default__export__ = Unit;
}),
]);

//# sourceMappingURL=19xk_0trbb3p._.js.map