(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/analytics/dispatch.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dispatch",
    ()=>dispatch,
    "getDelay",
    ()=>getDelay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$callback$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/callback/index.js [app-client] (ecmascript)");
;
;
var getDelay = function(startTimeInEpochMS, timeoutInMS) {
    var elapsedTime = Date.now() - startTimeInEpochMS;
    // increasing the timeout increases the delay by almost the same amount -- this is weird legacy behavior.
    return Math.max((timeoutInMS !== null && timeoutInMS !== void 0 ? timeoutInMS : 300) - elapsedTime, 0);
};
function dispatch(ctx, queue, emitter, options) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function() {
        var startTime, dispatched;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__generator"])(this, function(_a) {
            switch(_a.label){
                case 0:
                    emitter.emit('dispatch_start', ctx);
                    startTime = Date.now();
                    if (!queue.isEmpty()) return [
                        3 /*break*/ ,
                        2
                    ];
                    return [
                        4 /*yield*/ ,
                        queue.dispatchSingle(ctx)
                    ];
                case 1:
                    dispatched = _a.sent();
                    return [
                        3 /*break*/ ,
                        4
                    ];
                case 2:
                    return [
                        4 /*yield*/ ,
                        queue.dispatch(ctx)
                    ];
                case 3:
                    dispatched = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(options === null || options === void 0 ? void 0 : options.callback)) return [
                        3 /*break*/ ,
                        6
                    ];
                    return [
                        4 /*yield*/ ,
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$callback$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invokeCallback"])(dispatched, options.callback, getDelay(startTime, options.timeout))
                    ];
                case 5:
                    dispatched = _a.sent();
                    _a.label = 6;
                case 6:
                    if (options === null || options === void 0 ? void 0 : options.debug) {
                        dispatched.flush();
                    }
                    return [
                        2 /*return*/ ,
                        dispatched
                    ];
            }
        });
    });
}
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/callback/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "invokeCallback",
    ()=>invokeCallback,
    "pTimeout",
    ()=>pTimeout,
    "sleep",
    ()=>sleep
]);
function pTimeout(promise, timeout) {
    return new Promise(function(resolve, reject) {
        var timeoutId = setTimeout(function() {
            reject(Error('Promise timed out'));
        }, timeout);
        promise.then(function(val) {
            clearTimeout(timeoutId);
            return resolve(val);
        }).catch(reject);
    });
}
function sleep(timeoutInMs) {
    return new Promise(function(resolve) {
        return setTimeout(resolve, timeoutInMs);
    });
}
function invokeCallback(ctx, callback, delay) {
    var cb = function() {
        try {
            return Promise.resolve(callback(ctx));
        } catch (err) {
            return Promise.reject(err);
        }
    };
    return sleep(delay)// pTimeout ensures that the callback can't cause the context to hang
    .then(function() {
        return pTimeout(cb(), 1000);
    }).catch(function(err) {
        ctx === null || ctx === void 0 ? void 0 : ctx.log('warn', 'Callback Error', {
            error: err
        });
        ctx === null || ctx === void 0 ? void 0 : ctx.stats.increment('callback_error');
    }).then(function() {
        return ctx;
    });
}
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/context/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ContextCancelation",
    ()=>ContextCancelation,
    "CoreContext",
    ()=>CoreContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$lukeed$2f$uuid$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@lukeed/uuid/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dset$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/dset/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$logger$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/logger/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$stats$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/stats/index.js [app-client] (ecmascript)");
;
;
;
;
var ContextCancelation = function() {
    function ContextCancelation(options) {
        var _a, _b, _c;
        this.retry = (_a = options.retry) !== null && _a !== void 0 ? _a : true;
        this.type = (_b = options.type) !== null && _b !== void 0 ? _b : 'plugin Error';
        this.reason = (_c = options.reason) !== null && _c !== void 0 ? _c : '';
    }
    return ContextCancelation;
}();
;
var CoreContext = function() {
    function CoreContext(event, id, stats, logger) {
        if (id === void 0) {
            id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$lukeed$2f$uuid$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["v4"])();
        }
        if (stats === void 0) {
            stats = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$stats$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NullStats"]();
        }
        if (logger === void 0) {
            logger = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$logger$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreLogger"]();
        }
        this.attempts = 0;
        this.event = event;
        this._id = id;
        this.logger = logger;
        this.stats = stats;
    }
    CoreContext.system = function() {
    // This should be overridden by the subclass to return an instance of the subclass.
    };
    CoreContext.prototype.isSame = function(other) {
        return other.id === this.id;
    };
    CoreContext.prototype.cancel = function(error) {
        if (error) {
            throw error;
        }
        throw new ContextCancelation({
            reason: 'Context Cancel'
        });
    };
    CoreContext.prototype.log = function(level, message, extras) {
        this.logger.log(level, message, extras);
    };
    Object.defineProperty(CoreContext.prototype, "id", {
        get: function() {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    CoreContext.prototype.updateEvent = function(path, val) {
        var _a;
        // Don't allow integrations that are set to false to be overwritten with integration settings.
        if (path.split('.')[0] === 'integrations') {
            var integrationName = path.split('.')[1];
            if (((_a = this.event.integrations) === null || _a === void 0 ? void 0 : _a[integrationName]) === false) {
                return this.event;
            }
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dset$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dset"])(this.event, path, val);
        return this.event;
    };
    CoreContext.prototype.failedDelivery = function() {
        return this._failedDelivery;
    };
    CoreContext.prototype.setFailedDelivery = function(options) {
        this._failedDelivery = options;
    };
    CoreContext.prototype.logs = function() {
        return this.logger.logs;
    };
    CoreContext.prototype.flush = function() {
        this.logger.flush();
        this.stats.flush();
    };
    CoreContext.prototype.toJSON = function() {
        return {
            id: this._id,
            event: this.event,
            logs: this.logger.logs,
            metrics: this.stats.metrics
        };
    };
    return CoreContext;
}();
;
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/events/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CoreEventFactory",
    ()=>CoreEventFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dset$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/dset/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$utils$2f$pick$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/utils/pick.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$assertions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/validation/assertions.js [app-client] (ecmascript)");
;
;
;
;
;
/**
 * Internal settings object that is used internally by the factory
 */ var InternalEventFactorySettings = function() {
    function InternalEventFactorySettings(settings) {
        var _a, _b;
        this.settings = settings;
        this.createMessageId = settings.createMessageId;
        this.onEventMethodCall = (_a = settings.onEventMethodCall) !== null && _a !== void 0 ? _a : function() {};
        this.onFinishedEvent = (_b = settings.onFinishedEvent) !== null && _b !== void 0 ? _b : function() {};
    }
    return InternalEventFactorySettings;
}();
var CoreEventFactory = function() {
    function CoreEventFactory(settings) {
        this.settings = new InternalEventFactorySettings(settings);
    }
    CoreEventFactory.prototype.track = function(event, properties, options, integrationOptions) {
        this.settings.onEventMethodCall({
            type: 'track',
            options: options
        });
        return this.normalize((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, this.baseEvent()), {
            event: event,
            type: 'track',
            properties: properties !== null && properties !== void 0 ? properties : {},
            options: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, options),
            integrations: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, integrationOptions)
        }));
    };
    CoreEventFactory.prototype.page = function(category, page, properties, options, integrationOptions) {
        var _a;
        this.settings.onEventMethodCall({
            type: 'page',
            options: options
        });
        var event = {
            type: 'page',
            properties: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, properties),
            options: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, options),
            integrations: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, integrationOptions)
        };
        if (category !== null) {
            event.category = category;
            event.properties = (_a = event.properties) !== null && _a !== void 0 ? _a : {};
            event.properties.category = category;
        }
        if (page !== null) {
            event.name = page;
        }
        return this.normalize((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, this.baseEvent()), event));
    };
    CoreEventFactory.prototype.screen = function(category, screen, properties, options, integrationOptions) {
        this.settings.onEventMethodCall({
            type: 'screen',
            options: options
        });
        var event = {
            type: 'screen',
            properties: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, properties),
            options: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, options),
            integrations: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, integrationOptions)
        };
        if (category !== null) {
            event.category = category;
        }
        if (screen !== null) {
            event.name = screen;
        }
        return this.normalize((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, this.baseEvent()), event));
    };
    CoreEventFactory.prototype.identify = function(userId, traits, options, integrationsOptions) {
        this.settings.onEventMethodCall({
            type: 'identify',
            options: options
        });
        return this.normalize((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, this.baseEvent()), {
            type: 'identify',
            userId: userId,
            traits: traits !== null && traits !== void 0 ? traits : {},
            options: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, options),
            integrations: integrationsOptions
        }));
    };
    CoreEventFactory.prototype.group = function(groupId, traits, options, integrationOptions) {
        this.settings.onEventMethodCall({
            type: 'group',
            options: options
        });
        return this.normalize((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, this.baseEvent()), {
            type: 'group',
            traits: traits !== null && traits !== void 0 ? traits : {},
            options: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, options),
            integrations: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, integrationOptions),
            groupId: groupId
        }));
    };
    CoreEventFactory.prototype.alias = function(to, from, options, integrationOptions) {
        this.settings.onEventMethodCall({
            type: 'alias',
            options: options
        });
        var base = {
            userId: to,
            type: 'alias',
            options: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, options),
            integrations: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, integrationOptions)
        };
        if (from !== null) {
            base.previousId = from;
        }
        if (to === undefined) {
            return this.normalize((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, base), this.baseEvent()));
        }
        return this.normalize((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, this.baseEvent()), base));
    };
    CoreEventFactory.prototype.baseEvent = function() {
        return {
            integrations: {},
            options: {}
        };
    };
    /**
     * Builds the context part of an event based on "foreign" keys that
     * are provided in the `Options` parameter for an Event
     */ CoreEventFactory.prototype.context = function(options) {
        var _a;
        /**
         * If the event options are known keys from this list, we move them to the top level of the event.
         * Any other options are moved to context.
         */ var eventOverrideKeys = [
            'userId',
            'anonymousId',
            'timestamp',
            'messageId'
        ];
        delete options['integrations'];
        var providedOptionsKeys = Object.keys(options);
        var context = (_a = options.context) !== null && _a !== void 0 ? _a : {};
        var eventOverrides = {};
        providedOptionsKeys.forEach(function(key) {
            if (key === 'context') {
                return;
            }
            if (eventOverrideKeys.includes(key)) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dset$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dset"])(eventOverrides, key, options[key]);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dset$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dset"])(context, key, options[key]);
            }
        });
        return [
            context,
            eventOverrides
        ];
    };
    CoreEventFactory.prototype.normalize = function(event) {
        var _a, _b;
        var integrationBooleans = Object.keys((_a = event.integrations) !== null && _a !== void 0 ? _a : {}).reduce(function(integrationNames, name) {
            var _a;
            var _b;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, integrationNames), (_a = {}, _a[name] = Boolean((_b = event.integrations) === null || _b === void 0 ? void 0 : _b[name]), _a));
        }, {});
        // filter out any undefined options
        event.options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$utils$2f$pick$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickBy"])(event.options || {}, function(_, value) {
            return value !== undefined;
        });
        // This is pretty trippy, but here's what's going on:
        // - a) We don't pass initial integration options as part of the event, only if they're true or false
        // - b) We do accept per integration overrides (like integrations.Amplitude.sessionId) at the event level
        // Hence the need to convert base integration options to booleans, but maintain per event integration overrides
        var allIntegrations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, integrationBooleans), (_b = event.options) === null || _b === void 0 ? void 0 : _b.integrations);
        var _c = event.options ? this.context(event.options) : [], context = _c[0], overrides = _c[1];
        var options = event.options, rest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__rest"])(event, [
            "options"
        ]);
        var evt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({
            timestamp: new Date()
        }, rest), {
            context: context,
            integrations: allIntegrations
        }), overrides), {
            messageId: options.messageId || this.settings.createMessageId()
        });
        this.settings.onFinishedEvent(evt);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$assertions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateEvent"])(evt);
        return evt;
    };
    return CoreEventFactory;
}();
;
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/logger/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CoreLogger",
    ()=>CoreLogger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
;
var CoreLogger = function() {
    function CoreLogger() {
        this._logs = [];
    }
    CoreLogger.prototype.log = function(level, message, extras) {
        var time = new Date();
        this._logs.push({
            level: level,
            message: message,
            time: time,
            extras: extras
        });
    };
    Object.defineProperty(CoreLogger.prototype, "logs", {
        get: function() {
            return this._logs;
        },
        enumerable: false,
        configurable: true
    });
    CoreLogger.prototype.flush = function() {
        if (this.logs.length > 1) {
            var formatted = this._logs.reduce(function(logs, log) {
                var _a;
                var _b, _c;
                var line = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, log), {
                    json: JSON.stringify(log.extras, null, ' '),
                    extras: log.extras
                });
                delete line['time'];
                var key = (_c = (_b = log.time) === null || _b === void 0 ? void 0 : _b.toISOString()) !== null && _c !== void 0 ? _c : '';
                if (logs[key]) {
                    key = "".concat(key, "-").concat(Math.random());
                }
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, logs), (_a = {}, _a[key] = line, _a));
            }, {});
            // ie doesn't like console.table
            if (console.table) {
                console.table(formatted);
            } else {
                console.log(formatted);
            }
        } else {
            this.logs.forEach(function(logEntry) {
                var level = logEntry.level, message = logEntry.message, extras = logEntry.extras;
                if (level === 'info' || level === 'debug') {
                    console.log(message, extras !== null && extras !== void 0 ? extras : '');
                } else {
                    console[level](message, extras !== null && extras !== void 0 ? extras : '');
                }
            });
        }
        this._logs = [];
    };
    return CoreLogger;
}();
;
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/priority-queue/backoff.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "backoff",
    ()=>backoff
]);
function backoff(params) {
    var random = Math.random() + 1;
    var _a = params.minTimeout, minTimeout = _a === void 0 ? 500 : _a, _b = params.factor, factor = _b === void 0 ? 2 : _b, attempt = params.attempt, _c = params.maxTimeout, maxTimeout = _c === void 0 ? Infinity : _c;
    return Math.min(random * minTimeout * Math.pow(factor, attempt), maxTimeout);
}
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/priority-queue/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ON_REMOVE_FROM_FUTURE",
    ()=>ON_REMOVE_FROM_FUTURE,
    "PriorityQueue",
    ()=>PriorityQueue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$generic$2d$utils$2f$dist$2f$esm$2f$emitter$2f$emitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-generic-utils/dist/esm/emitter/emitter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$priority$2d$queue$2f$backoff$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/priority-queue/backoff.js [app-client] (ecmascript)");
;
;
;
var ON_REMOVE_FROM_FUTURE = 'onRemoveFromFuture';
var PriorityQueue = function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(PriorityQueue, _super);
    function PriorityQueue(maxAttempts, queue, seen) {
        var _this = _super.call(this) || this;
        _this.future = [];
        _this.maxAttempts = maxAttempts;
        _this.queue = queue;
        _this.seen = seen !== null && seen !== void 0 ? seen : {};
        return _this;
    }
    PriorityQueue.prototype.push = function() {
        var _this = this;
        var items = [];
        for(var _i = 0; _i < arguments.length; _i++){
            items[_i] = arguments[_i];
        }
        var accepted = items.map(function(operation) {
            var attempts = _this.updateAttempts(operation);
            if (attempts > _this.maxAttempts || _this.includes(operation)) {
                return false;
            }
            _this.queue.push(operation);
            return true;
        });
        this.queue = this.queue.sort(function(a, b) {
            return _this.getAttempts(a) - _this.getAttempts(b);
        });
        return accepted;
    };
    PriorityQueue.prototype.pushWithBackoff = function(item, minTimeout) {
        var _this = this;
        if (minTimeout === void 0) {
            minTimeout = 0;
        }
        // One immediate retry unless we have a minimum timeout (e.g. for rate limiting)
        if (minTimeout == 0 && this.getAttempts(item) === 0) {
            return this.push(item)[0];
        }
        var attempt = this.updateAttempts(item);
        if (attempt > this.maxAttempts || this.includes(item)) {
            return false;
        }
        var timeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$priority$2d$queue$2f$backoff$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["backoff"])({
            attempt: attempt - 1
        });
        if (minTimeout > 0 && timeout < minTimeout) {
            timeout = minTimeout;
        }
        setTimeout(function() {
            _this.queue.push(item);
            // remove from future list
            _this.future = _this.future.filter(function(f) {
                return f.id !== item.id;
            });
            // Lets listeners know that a 'future' message is now available in the queue
            _this.emit(ON_REMOVE_FROM_FUTURE);
        }, timeout);
        this.future.push(item);
        return true;
    };
    PriorityQueue.prototype.getAttempts = function(item) {
        var _a;
        return (_a = this.seen[item.id]) !== null && _a !== void 0 ? _a : 0;
    };
    PriorityQueue.prototype.updateAttempts = function(item) {
        this.seen[item.id] = this.getAttempts(item) + 1;
        return this.getAttempts(item);
    };
    PriorityQueue.prototype.includes = function(item) {
        return this.queue.includes(item) || this.future.includes(item) || Boolean(this.queue.find(function(i) {
            return i.id === item.id;
        })) || Boolean(this.future.find(function(i) {
            return i.id === item.id;
        }));
    };
    PriorityQueue.prototype.pop = function() {
        return this.queue.shift();
    };
    Object.defineProperty(PriorityQueue.prototype, "length", {
        get: function() {
            return this.queue.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PriorityQueue.prototype, "todo", {
        get: function() {
            return this.queue.length + this.future.length;
        },
        enumerable: false,
        configurable: true
    });
    return PriorityQueue;
}(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$generic$2d$utils$2f$dist$2f$esm$2f$emitter$2f$emitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Emitter"]);
;
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/queue/delivery.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "attempt",
    ()=>attempt,
    "ensure",
    ()=>ensure
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$context$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/context/index.js [app-client] (ecmascript)");
;
;
function tryAsync(fn) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function() {
        var err_1;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__generator"])(this, function(_a) {
            switch(_a.label){
                case 0:
                    _a.trys.push([
                        0,
                        2,
                        ,
                        3
                    ]);
                    return [
                        4 /*yield*/ ,
                        fn()
                    ];
                case 1:
                    return [
                        2 /*return*/ ,
                        _a.sent()
                    ];
                case 2:
                    err_1 = _a.sent();
                    return [
                        2 /*return*/ ,
                        Promise.reject(err_1)
                    ];
                case 3:
                    return [
                        2 /*return*/ 
                    ];
            }
        });
    });
}
function attempt(ctx, plugin) {
    ctx.log('debug', 'plugin', {
        plugin: plugin.name
    });
    var start = new Date().getTime();
    var hook = plugin[ctx.event.type];
    if (hook === undefined) {
        return Promise.resolve(ctx);
    }
    var newCtx = tryAsync(function() {
        return hook.apply(plugin, [
            ctx
        ]);
    }).then(function(ctx) {
        var done = new Date().getTime() - start;
        ctx.stats.gauge('plugin_time', done, [
            "plugin:".concat(plugin.name)
        ]);
        return ctx;
    }).catch(function(err) {
        if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$context$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContextCancelation"] && err.type === 'middleware_cancellation') {
            throw err;
        }
        if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$context$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContextCancelation"]) {
            ctx.log('warn', err.type, {
                plugin: plugin.name,
                error: err
            });
            return err;
        }
        ctx.log('error', 'plugin Error', {
            plugin: plugin.name,
            error: err
        });
        ctx.stats.increment('plugin_error', 1, [
            "plugin:".concat(plugin.name)
        ]);
        return err;
    });
    return newCtx;
}
function ensure(ctx, plugin) {
    return attempt(ctx, plugin).then(function(newContext) {
        if (newContext instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$context$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreContext"]) {
            return newContext;
        }
        ctx.log('debug', 'Context canceled');
        ctx.stats.increment('context_canceled');
        ctx.cancel(newContext);
    });
}
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/queue/event-queue.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CoreEventQueue",
    ()=>CoreEventQueue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$utils$2f$group$2d$by$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/utils/group-by.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$priority$2d$queue$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/priority-queue/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$context$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/context/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$generic$2d$utils$2f$dist$2f$esm$2f$emitter$2f$emitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-generic-utils/dist/esm/emitter/emitter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$task$2f$task$2d$group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/task/task-group.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$queue$2f$delivery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/queue/delivery.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
var CoreEventQueue = function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(CoreEventQueue, _super);
    function CoreEventQueue(priorityQueue) {
        var _this = _super.call(this) || this;
        /**
         * All event deliveries get suspended until all the tasks in this task group are complete.
         * For example: a middleware that augments the event object should be loaded safely as a
         * critical task, this way, event queue will wait for it to be ready before sending events.
         *
         * This applies to all the events already in the queue, and the upcoming ones
         */ _this.criticalTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$task$2f$task$2d$group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTaskGroup"])();
        _this.plugins = [];
        _this.failedInitializations = [];
        _this.flushing = false;
        _this.queue = priorityQueue;
        _this.queue.on(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$priority$2d$queue$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ON_REMOVE_FROM_FUTURE"], function() {
            _this.scheduleFlush(0);
        });
        return _this;
    }
    CoreEventQueue.prototype.register = function(ctx, plugin, instance) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function() {
            var handleLoadError, err_1;
            var _this = this;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__generator"])(this, function(_a) {
                switch(_a.label){
                    case 0:
                        this.plugins.push(plugin);
                        handleLoadError = function(err) {
                            _this.failedInitializations.push(plugin.name);
                            _this.emit('initialization_failure', plugin);
                            console.warn(plugin.name, err);
                            ctx.log('warn', 'Failed to load destination', {
                                plugin: plugin.name,
                                error: err
                            });
                            // Filter out the failed plugin by excluding it from the list
                            _this.plugins = _this.plugins.filter(function(p) {
                                return p !== plugin;
                            });
                        };
                        if (!(plugin.type === 'destination' && plugin.name !== 'Segment.io')) return [
                            3 /*break*/ ,
                            1
                        ];
                        plugin.load(ctx, instance).catch(handleLoadError);
                        return [
                            3 /*break*/ ,
                            4
                        ];
                    case 1:
                        _a.trys.push([
                            1,
                            3,
                            ,
                            4
                        ]);
                        return [
                            4 /*yield*/ ,
                            plugin.load(ctx, instance)
                        ];
                    case 2:
                        _a.sent();
                        return [
                            3 /*break*/ ,
                            4
                        ];
                    case 3:
                        err_1 = _a.sent();
                        handleLoadError(err_1);
                        return [
                            3 /*break*/ ,
                            4
                        ];
                    case 4:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    CoreEventQueue.prototype.deregister = function(ctx, plugin, instance) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function() {
            var e_1;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__generator"])(this, function(_a) {
                switch(_a.label){
                    case 0:
                        _a.trys.push([
                            0,
                            3,
                            ,
                            4
                        ]);
                        if (!plugin.unload) return [
                            3 /*break*/ ,
                            2
                        ];
                        return [
                            4 /*yield*/ ,
                            Promise.resolve(plugin.unload(ctx, instance))
                        ];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.plugins = this.plugins.filter(function(p) {
                            return p.name !== plugin.name;
                        });
                        return [
                            3 /*break*/ ,
                            4
                        ];
                    case 3:
                        e_1 = _a.sent();
                        ctx.log('warn', 'Failed to unload destination', {
                            plugin: plugin.name,
                            error: e_1
                        });
                        return [
                            3 /*break*/ ,
                            4
                        ];
                    case 4:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    CoreEventQueue.prototype.dispatch = function(ctx) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function() {
            var willDeliver;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__generator"])(this, function(_a) {
                ctx.log('debug', 'Dispatching');
                ctx.stats.increment('message_dispatched');
                this.queue.push(ctx);
                willDeliver = this.subscribeToDelivery(ctx);
                this.scheduleFlush(0);
                return [
                    2 /*return*/ ,
                    willDeliver
                ];
            });
        });
    };
    CoreEventQueue.prototype.subscribeToDelivery = function(ctx) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function() {
            var _this = this;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__generator"])(this, function(_a) {
                return [
                    2 /*return*/ ,
                    new Promise(function(resolve) {
                        var onDeliver = function(flushed, delivered) {
                            if (flushed.isSame(ctx)) {
                                _this.off('flush', onDeliver);
                                if (delivered) {
                                    resolve(flushed);
                                } else {
                                    resolve(flushed);
                                }
                            }
                        };
                        _this.on('flush', onDeliver);
                    })
                ];
            });
        });
    };
    CoreEventQueue.prototype.dispatchSingle = function(ctx) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function() {
            var _this = this;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__generator"])(this, function(_a) {
                ctx.log('debug', 'Dispatching');
                ctx.stats.increment('message_dispatched');
                this.queue.updateAttempts(ctx);
                ctx.attempts = 1;
                return [
                    2 /*return*/ ,
                    this.deliver(ctx).catch(function(err) {
                        var accepted = _this.enqueuRetry(err, ctx);
                        if (!accepted) {
                            ctx.setFailedDelivery({
                                reason: err
                            });
                            return ctx;
                        }
                        return _this.subscribeToDelivery(ctx);
                    })
                ];
            });
        });
    };
    CoreEventQueue.prototype.isEmpty = function() {
        return this.queue.length === 0;
    };
    CoreEventQueue.prototype.scheduleFlush = function(timeout) {
        var _this = this;
        if (timeout === void 0) {
            timeout = 500;
        }
        if (this.flushing) {
            return;
        }
        this.flushing = true;
        setTimeout(function() {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            _this.flush().then(function() {
                setTimeout(function() {
                    _this.flushing = false;
                    if (_this.queue.length) {
                        _this.scheduleFlush(0);
                    }
                }, 0);
            });
        }, timeout);
    };
    CoreEventQueue.prototype.deliver = function(ctx) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function() {
            var start, done, err_2, error;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__generator"])(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this.criticalTasks.done()
                        ];
                    case 1:
                        _a.sent();
                        start = Date.now();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([
                            2,
                            4,
                            ,
                            5
                        ]);
                        return [
                            4 /*yield*/ ,
                            this.flushOne(ctx)
                        ];
                    case 3:
                        ctx = _a.sent();
                        done = Date.now() - start;
                        this.emit('delivery_success', ctx);
                        ctx.stats.gauge('delivered', done);
                        ctx.log('debug', 'Delivered', ctx.event);
                        return [
                            2 /*return*/ ,
                            ctx
                        ];
                    case 4:
                        err_2 = _a.sent();
                        error = err_2;
                        ctx.log('error', 'Failed to deliver', error);
                        this.emit('delivery_failure', ctx, error);
                        ctx.stats.increment('delivery_failed');
                        throw err_2;
                    case 5:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    CoreEventQueue.prototype.enqueuRetry = function(err, ctx) {
        var retriable = !(err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$context$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContextCancelation"]) || err.retry;
        if (!retriable) {
            return false;
        }
        return this.queue.pushWithBackoff(ctx);
    };
    CoreEventQueue.prototype.flush = function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function() {
            var ctx, err_3, accepted;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__generator"])(this, function(_a) {
                switch(_a.label){
                    case 0:
                        if (this.queue.length === 0) {
                            return [
                                2 /*return*/ ,
                                []
                            ];
                        }
                        ctx = this.queue.pop();
                        if (!ctx) {
                            return [
                                2 /*return*/ ,
                                []
                            ];
                        }
                        ctx.attempts = this.queue.getAttempts(ctx);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([
                            1,
                            3,
                            ,
                            4
                        ]);
                        return [
                            4 /*yield*/ ,
                            this.deliver(ctx)
                        ];
                    case 2:
                        ctx = _a.sent();
                        this.emit('flush', ctx, true);
                        return [
                            3 /*break*/ ,
                            4
                        ];
                    case 3:
                        err_3 = _a.sent();
                        accepted = this.enqueuRetry(err_3, ctx);
                        if (!accepted) {
                            ctx.setFailedDelivery({
                                reason: err_3
                            });
                            this.emit('flush', ctx, false);
                        }
                        return [
                            2 /*return*/ ,
                            []
                        ];
                    case 4:
                        return [
                            2 /*return*/ ,
                            [
                                ctx
                            ]
                        ];
                }
            });
        });
    };
    CoreEventQueue.prototype.isReady = function() {
        // return this.plugins.every((p) => p.isLoaded())
        // should we wait for every plugin to load?
        return true;
    };
    CoreEventQueue.prototype.availableExtensions = function(denyList) {
        var available = this.plugins.filter(function(p) {
            var _a, _b, _c;
            // Only filter out destination plugins or the Segment.io plugin
            if (p.type !== 'destination' && p.name !== 'Segment.io') {
                return true;
            }
            var alternativeNameMatch = undefined;
            (_a = p.alternativeNames) === null || _a === void 0 ? void 0 : _a.forEach(function(name) {
                if (denyList[name] !== undefined) {
                    alternativeNameMatch = denyList[name];
                }
            });
            // Explicit integration option takes precedence, `All: false` does not apply to Segment.io
            return (_c = (_b = denyList[p.name]) !== null && _b !== void 0 ? _b : alternativeNameMatch) !== null && _c !== void 0 ? _c : (p.name === 'Segment.io' ? true : denyList.All) !== false;
        });
        var _a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$utils$2f$group$2d$by$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["groupBy"])(available, 'type'), _b = _a.before, before = _b === void 0 ? [] : _b, _c = _a.enrichment, enrichment = _c === void 0 ? [] : _c, _d = _a.destination, destination = _d === void 0 ? [] : _d, _e = _a.after, after = _e === void 0 ? [] : _e;
        return {
            before: before,
            enrichment: enrichment,
            destinations: destination,
            after: after
        };
    };
    CoreEventQueue.prototype.flushOne = function(ctx) {
        var _a, _b;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function() {
            var _c, before, enrichment, _i, before_1, beforeWare, temp, _d, enrichment_1, enrichmentWare, temp, _e, destinations, after, afterCalls;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__generator"])(this, function(_f) {
                switch(_f.label){
                    case 0:
                        if (!this.isReady()) {
                            throw new Error('Not ready');
                        }
                        if (ctx.attempts > 1) {
                            this.emit('delivery_retry', ctx);
                        }
                        _c = this.availableExtensions((_a = ctx.event.integrations) !== null && _a !== void 0 ? _a : {}), before = _c.before, enrichment = _c.enrichment;
                        _i = 0, before_1 = before;
                        _f.label = 1;
                    case 1:
                        if (!(_i < before_1.length)) return [
                            3 /*break*/ ,
                            4
                        ];
                        beforeWare = before_1[_i];
                        return [
                            4 /*yield*/ ,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$queue$2f$delivery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensure"])(ctx, beforeWare)
                        ];
                    case 2:
                        temp = _f.sent();
                        if (temp instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$context$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreContext"]) {
                            ctx = temp;
                        }
                        this.emit('message_enriched', ctx, beforeWare);
                        _f.label = 3;
                    case 3:
                        _i++;
                        return [
                            3 /*break*/ ,
                            1
                        ];
                    case 4:
                        _d = 0, enrichment_1 = enrichment;
                        _f.label = 5;
                    case 5:
                        if (!(_d < enrichment_1.length)) return [
                            3 /*break*/ ,
                            8
                        ];
                        enrichmentWare = enrichment_1[_d];
                        return [
                            4 /*yield*/ ,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$queue$2f$delivery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["attempt"])(ctx, enrichmentWare)
                        ];
                    case 6:
                        temp = _f.sent();
                        if (temp instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$context$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreContext"]) {
                            ctx = temp;
                        }
                        this.emit('message_enriched', ctx, enrichmentWare);
                        _f.label = 7;
                    case 7:
                        _d++;
                        return [
                            3 /*break*/ ,
                            5
                        ];
                    case 8:
                        _e = this.availableExtensions((_b = ctx.event.integrations) !== null && _b !== void 0 ? _b : {}), destinations = _e.destinations, after = _e.after;
                        return [
                            4 /*yield*/ ,
                            new Promise(function(resolve, reject) {
                                setTimeout(function() {
                                    var attempts = destinations.map(function(destination) {
                                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$queue$2f$delivery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["attempt"])(ctx, destination);
                                    });
                                    Promise.all(attempts).then(resolve).catch(reject);
                                }, 0);
                            })
                        ];
                    case 9:
                        _f.sent();
                        ctx.stats.increment('message_delivered');
                        this.emit('message_delivered', ctx);
                        afterCalls = after.map(function(after) {
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$queue$2f$delivery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["attempt"])(ctx, after);
                        });
                        return [
                            4 /*yield*/ ,
                            Promise.all(afterCalls)
                        ];
                    case 10:
                        _f.sent();
                        return [
                            2 /*return*/ ,
                            ctx
                        ];
                }
            });
        });
    };
    return CoreEventQueue;
}(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$generic$2d$utils$2f$dist$2f$esm$2f$emitter$2f$emitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Emitter"]);
;
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/stats/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CoreStats",
    ()=>CoreStats,
    "NullStats",
    ()=>NullStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
;
var compactMetricType = function(type) {
    var enums = {
        gauge: 'g',
        counter: 'c'
    };
    return enums[type];
};
var CoreStats = function() {
    function CoreStats() {
        this.metrics = [];
    }
    CoreStats.prototype.increment = function(metric, by, tags) {
        if (by === void 0) {
            by = 1;
        }
        this.metrics.push({
            metric: metric,
            value: by,
            tags: tags !== null && tags !== void 0 ? tags : [],
            type: 'counter',
            timestamp: Date.now()
        });
    };
    CoreStats.prototype.gauge = function(metric, value, tags) {
        this.metrics.push({
            metric: metric,
            value: value,
            tags: tags !== null && tags !== void 0 ? tags : [],
            type: 'gauge',
            timestamp: Date.now()
        });
    };
    CoreStats.prototype.flush = function() {
        var formatted = this.metrics.map(function(m) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__assign"])({}, m), {
                tags: m.tags.join(',')
            });
        });
        // ie doesn't like console.table
        if (console.table) {
            console.table(formatted);
        } else {
            console.log(formatted);
        }
        this.metrics = [];
    };
    /**
     * compact keys for smaller payload
     */ CoreStats.prototype.serialize = function() {
        return this.metrics.map(function(m) {
            return {
                m: m.metric,
                v: m.value,
                t: m.tags,
                k: compactMetricType(m.type),
                e: m.timestamp
            };
        });
    };
    return CoreStats;
}();
;
var NullStats = function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(NullStats, _super);
    function NullStats() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NullStats.prototype.gauge = function() {
        var _args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            _args[_i] = arguments[_i];
        }
    };
    NullStats.prototype.increment = function() {
        var _args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            _args[_i] = arguments[_i];
        }
    };
    NullStats.prototype.flush = function() {
        var _args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            _args[_i] = arguments[_i];
        }
    };
    NullStats.prototype.serialize = function() {
        var _args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            _args[_i] = arguments[_i];
        }
        return [];
    };
    return NullStats;
}(CoreStats);
;
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/task/task-group.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTaskGroup",
    ()=>createTaskGroup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$utils$2f$is$2d$thenable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/utils/is-thenable.js [app-client] (ecmascript)");
;
var createTaskGroup = function() {
    var taskCompletionPromise;
    var resolvePromise;
    var count = 0;
    return {
        done: function() {
            return taskCompletionPromise;
        },
        run: function(op) {
            var returnValue = op();
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$utils$2f$is$2d$thenable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isThenable"])(returnValue)) {
                if (++count === 1) {
                    taskCompletionPromise = new Promise(function(res) {
                        return resolvePromise = res;
                    });
                }
                returnValue.finally(function() {
                    return --count === 0 && resolvePromise();
                });
            }
            return returnValue;
        }
    };
};
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/utils/bind-all.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bindAll",
    ()=>bindAll
]);
function bindAll(obj) {
    var proto = obj.constructor.prototype;
    for(var _i = 0, _a = Object.getOwnPropertyNames(proto); _i < _a.length; _i++){
        var key = _a[_i];
        if (key !== 'constructor') {
            var desc = Object.getOwnPropertyDescriptor(obj.constructor.prototype, key);
            if (!!desc && typeof desc.value === 'function') {
                obj[key] = obj[key].bind(obj);
            }
        }
    }
    return obj;
}
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/utils/group-by.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "groupBy",
    ()=>groupBy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
;
function groupBy(collection, grouper) {
    var results = {};
    collection.forEach(function(item) {
        var _a;
        var key = undefined;
        if (typeof grouper === 'string') {
            var suggestedKey = item[grouper];
            key = typeof suggestedKey !== 'string' ? JSON.stringify(suggestedKey) : suggestedKey;
        } else if (grouper instanceof Function) {
            key = grouper(item);
        }
        if (key === undefined) {
            return;
        }
        results[key] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__spreadArray"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__spreadArray"])([], (_a = results[key]) !== null && _a !== void 0 ? _a : [], true), [
            item
        ], false);
    });
    return results;
}
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/utils/is-thenable.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 *  Check if  thenable
 *  (instanceof Promise doesn't respect realms)
 */ __turbopack_context__.s([
    "isThenable",
    ()=>isThenable
]);
var isThenable = function(value) {
    return typeof value === 'object' && value !== null && 'then' in value && typeof value.then === 'function';
};
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/utils/pick.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pickBy",
    ()=>pickBy
]);
var pickBy = function(obj, fn) {
    return Object.keys(obj).filter(function(k) {
        return fn(k, obj[k]);
    }).reduce(function(acc, key) {
        return acc[key] = obj[key], acc;
    }, {});
};
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/validation/assertions.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assertEventExists",
    ()=>assertEventExists,
    "assertEventType",
    ()=>assertEventType,
    "assertMessageId",
    ()=>assertMessageId,
    "assertTrackEventName",
    ()=>assertTrackEventName,
    "assertTrackEventProperties",
    ()=>assertTrackEventProperties,
    "assertTraits",
    ()=>assertTraits,
    "assertUserIdentity",
    ()=>assertUserIdentity,
    "validateEvent",
    ()=>validateEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/validation/errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/validation/helpers.js [app-client] (ecmascript)");
;
;
var stringError = 'is not a string';
var objError = 'is not an object';
var nilError = 'is nil';
function assertUserIdentity(event) {
    var USER_FIELD_NAME = '.userId/anonymousId/previousId/groupId';
    var getAnyUserId = function(event) {
        var _a, _b, _c;
        return (_c = (_b = (_a = event.userId) !== null && _a !== void 0 ? _a : event.anonymousId) !== null && _b !== void 0 ? _b : event.groupId) !== null && _c !== void 0 ? _c : event.previousId;
    };
    var id = getAnyUserId(event);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exists"])(id)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationError"](USER_FIELD_NAME, nilError);
    } else if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(id)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationError"](USER_FIELD_NAME, stringError);
    }
}
function assertEventExists(event) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exists"])(event)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationError"]('Event', nilError);
    }
    if (typeof event !== 'object') {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationError"]('Event', objError);
    }
}
function assertEventType(event) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(event.type)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationError"]('.type', stringError);
    }
}
function assertTrackEventName(event) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(event.event)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationError"]('.event', stringError);
    }
}
function assertTrackEventProperties(event) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPlainObject"])(event.properties)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationError"]('.properties', objError);
    }
}
function assertTraits(event) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPlainObject"])(event.traits)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationError"]('.traits', objError);
    }
}
function assertMessageId(event) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(event.messageId)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationError"]('.messageId', stringError);
    }
}
function validateEvent(event) {
    assertEventExists(event);
    assertEventType(event);
    assertMessageId(event);
    if (event.type === 'track') {
        assertTrackEventName(event);
        assertTrackEventProperties(event);
    }
    if ([
        'group',
        'identify'
    ].includes(event.type)) {
        assertTraits(event);
    }
}
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/validation/errors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ValidationError",
    ()=>ValidationError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
;
var ValidationError = function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(ValidationError, _super);
    function ValidationError(field, message) {
        var _this = _super.call(this, "".concat(field, " ").concat(message)) || this;
        _this.field = field;
        return _this;
    }
    return ValidationError;
}(Error);
;
}),
"[project]/frontend/node_modules/@segment/analytics-core/dist/esm/validation/helpers.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "exists",
    ()=>exists,
    "isFunction",
    ()=>isFunction,
    "isNumber",
    ()=>isNumber,
    "isPlainObject",
    ()=>isPlainObject,
    "isString",
    ()=>isString
]);
function isString(obj) {
    return typeof obj === 'string';
}
function isNumber(obj) {
    return typeof obj === 'number';
}
function isFunction(obj) {
    return typeof obj === 'function';
}
function exists(val) {
    return val !== undefined && val !== null;
}
function isPlainObject(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === 'object';
}
}),
"[project]/frontend/node_modules/@segment/analytics-generic-utils/dist/esm/create-deferred/create-deferred.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Return a promise that can be externally resolved
 */ __turbopack_context__.s([
    "createDeferred",
    ()=>createDeferred
]);
var createDeferred = function() {
    var resolve;
    var reject;
    var settled = false;
    var promise = new Promise(function(_resolve, _reject) {
        resolve = function() {
            var args = [];
            for(var _i = 0; _i < arguments.length; _i++){
                args[_i] = arguments[_i];
            }
            settled = true;
            _resolve.apply(void 0, args);
        };
        reject = function() {
            var args = [];
            for(var _i = 0; _i < arguments.length; _i++){
                args[_i] = arguments[_i];
            }
            settled = true;
            _reject.apply(void 0, args);
        };
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: promise,
        isSettled: function() {
            return settled;
        }
    };
};
}),
"[project]/frontend/node_modules/@segment/analytics-generic-utils/dist/esm/emitter/emitter.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Emitter",
    ()=>Emitter
]);
/**
 * Event Emitter that takes the expected contract as a generic
 * @example
 * ```ts
 *  type Contract = {
 *    delivery_success: [DeliverySuccessResponse, Metrics],
 *    delivery_failure: [DeliveryError]
 * }
 *  new Emitter<Contract>()
 *  .on('delivery_success', (res, metrics) => ...)
 *  .on('delivery_failure', (err) => ...)
 * ```
 */ var Emitter = function() {
    function Emitter(options) {
        var _a;
        this.callbacks = {};
        this.warned = false;
        this.maxListeners = (_a = options === null || options === void 0 ? void 0 : options.maxListeners) !== null && _a !== void 0 ? _a : 10;
    }
    Emitter.prototype.warnIfPossibleMemoryLeak = function(event) {
        if (this.warned) {
            return;
        }
        if (this.maxListeners && this.callbacks[event].length > this.maxListeners) {
            console.warn("Event Emitter: Possible memory leak detected; ".concat(String(event), " has exceeded ").concat(this.maxListeners, " listeners."));
            this.warned = true;
        }
    };
    Emitter.prototype.on = function(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [
                callback
            ];
        } else {
            this.callbacks[event].push(callback);
            this.warnIfPossibleMemoryLeak(event);
        }
        return this;
    };
    Emitter.prototype.once = function(event, callback) {
        var _this = this;
        var on = function() {
            var args = [];
            for(var _i = 0; _i < arguments.length; _i++){
                args[_i] = arguments[_i];
            }
            _this.off(event, on);
            callback.apply(_this, args);
        };
        this.on(event, on);
        return this;
    };
    Emitter.prototype.off = function(event, callback) {
        var _a;
        var fns = (_a = this.callbacks[event]) !== null && _a !== void 0 ? _a : [];
        var without = fns.filter(function(fn) {
            return fn !== callback;
        });
        this.callbacks[event] = without;
        return this;
    };
    Emitter.prototype.emit = function(event) {
        var _this = this;
        var _a;
        var args = [];
        for(var _i = 1; _i < arguments.length; _i++){
            args[_i - 1] = arguments[_i];
        }
        var callbacks = (_a = this.callbacks[event]) !== null && _a !== void 0 ? _a : [];
        callbacks.forEach(function(callback) {
            callback.apply(_this, args);
        });
        return this;
    };
    return Emitter;
}();
;
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/analytics-node.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Analytics",
    ()=>Analytics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$utils$2f$bind$2d$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/utils/bind-all.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$callback$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/callback/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/settings.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$generated$2f$version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/generated/version.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$plugins$2f$segmentio$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/plugins/segmentio/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$event$2d$factory$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/event-factory.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$dispatch$2d$emit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/dispatch-emit.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$emitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/emitter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$context$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/context.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$event$2d$queue$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/event-queue.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$http$2d$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/http-client.js [app-client] (ecmascript)");
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
class Analytics extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$emitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NodeEmitter"] {
    _eventFactory;
    _isClosed = false;
    _pendingEvents = 0;
    _closeAndFlushDefaultTimeout;
    _publisher;
    _isFlushing = false;
    _queue;
    ready;
    constructor(settings){
        super();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateSettings"])(settings);
        this._eventFactory = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$event$2d$factory$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NodeEventFactory"]();
        this._queue = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$event$2d$queue$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NodeEventQueue"]();
        const flushInterval = settings.flushInterval ?? 10000;
        this._closeAndFlushDefaultTimeout = flushInterval * 1.25; // add arbitrary multiplier in case an event is in a plugin.
        const { plugin, publisher } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$plugins$2f$segmentio$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createConfiguredNodePlugin"])({
            writeKey: settings.writeKey,
            host: settings.host,
            path: settings.path,
            maxRetries: settings.maxRetries ?? 3,
            flushAt: settings.flushAt ?? settings.maxEventsInBatch ?? 15,
            httpRequestTimeout: settings.httpRequestTimeout,
            disable: settings.disable,
            flushInterval,
            httpClient: typeof settings.httpClient === 'function' ? new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$http$2d$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FetchHTTPClient"](settings.httpClient) : settings.httpClient ?? new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$http$2d$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FetchHTTPClient"](),
            oauthSettings: settings.oauthSettings
        }, this);
        this._publisher = publisher;
        this.ready = this.register(plugin).then(()=>undefined);
        this.emit('initialize', settings);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$utils$2f$bind$2d$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bindAll"])(this);
    }
    get VERSION() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$generated$2f$version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"];
    }
    /**
     * Call this method to stop collecting new events and flush all existing events.
     * This method also waits for any event method-specific callbacks to be triggered,
     * and any of their subsequent promises to be resolved/rejected.
     */ closeAndFlush({ timeout = this._closeAndFlushDefaultTimeout } = {}) {
        return this.flush({
            timeout,
            close: true
        });
    }
    /**
     * Call this method to flush all existing events..
     * This method also waits for any event method-specific callbacks to be triggered,
     * and any of their subsequent promises to be resolved/rejected.
     */ async flush({ timeout, close = false } = {}) {
        if (this._isFlushing) {
            // if we're already flushing, then we don't need to do anything
            console.warn('Overlapping flush calls detected. Please wait for the previous flush to finish before calling .flush again');
            return;
        } else {
            this._isFlushing = true;
        }
        if (close) {
            this._isClosed = true;
        }
        this._publisher.flush(this._pendingEvents);
        const promise = new Promise((resolve)=>{
            if (!this._pendingEvents) {
                resolve();
            } else {
                this.once('drained', ()=>{
                    resolve();
                });
            }
        }).finally(()=>{
            this._isFlushing = false;
        });
        return timeout ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$callback$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pTimeout"])(promise, timeout).catch(()=>undefined) : promise;
    }
    _dispatch(segmentEvent, callback) {
        if (this._isClosed) {
            this.emit('call_after_close', segmentEvent);
            return undefined;
        }
        this._pendingEvents++;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$dispatch$2d$emit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatchAndEmit"])(segmentEvent, this._queue, this, callback).catch((ctx)=>ctx).finally(()=>{
            this._pendingEvents--;
            if (!this._pendingEvents) {
                this.emit('drained');
            }
        });
    }
    /**
     * Combines two unassociated user identities.
     * @link https://segment.com/docs/connections/sources/catalog/libraries/server/node/#alias
     */ alias({ userId, previousId, context, timestamp, integrations, messageId }, callback) {
        const segmentEvent = this._eventFactory.alias(userId, previousId, {
            context,
            integrations,
            timestamp,
            messageId
        });
        this._dispatch(segmentEvent, callback);
    }
    /**
     * Associates an identified user with a collective.
     *  @link https://segment.com/docs/connections/sources/catalog/libraries/server/node/#group
     */ group({ timestamp, groupId, userId, anonymousId, traits = {}, context, integrations, messageId }, callback) {
        const segmentEvent = this._eventFactory.group(groupId, traits, {
            context,
            anonymousId,
            userId,
            timestamp,
            integrations,
            messageId
        });
        this._dispatch(segmentEvent, callback);
    }
    /**
     * Includes a unique userId and (maybe anonymousId) and any optional traits you know about them.
     * @link https://segment.com/docs/connections/sources/catalog/libraries/server/node/#identify
     */ identify({ userId, anonymousId, traits = {}, context, timestamp, integrations, messageId }, callback) {
        const segmentEvent = this._eventFactory.identify(userId, traits, {
            context,
            anonymousId,
            userId,
            timestamp,
            integrations,
            messageId
        });
        this._dispatch(segmentEvent, callback);
    }
    /**
     * The page method lets you record page views on your website, along with optional extra information about the page being viewed.
     * @link https://segment.com/docs/connections/sources/catalog/libraries/server/node/#page
     */ page({ userId, anonymousId, category, name, properties, context, timestamp, integrations, messageId }, callback) {
        const segmentEvent = this._eventFactory.page(category ?? null, name ?? null, properties, {
            context,
            anonymousId,
            userId,
            timestamp,
            integrations,
            messageId
        });
        this._dispatch(segmentEvent, callback);
    }
    /**
     * Records screen views on your app, along with optional extra information
     * about the screen viewed by the user.
     *
     * TODO: This is not documented on the segment docs ATM (for node).
     */ screen({ userId, anonymousId, category, name, properties, context, timestamp, integrations, messageId }, callback) {
        const segmentEvent = this._eventFactory.screen(category ?? null, name ?? null, properties, {
            context,
            anonymousId,
            userId,
            timestamp,
            integrations,
            messageId
        });
        this._dispatch(segmentEvent, callback);
    }
    /**
     * Records actions your users perform.
     * @link https://segment.com/docs/connections/sources/catalog/libraries/server/node/#track
     */ track({ userId, anonymousId, event, properties, context, timestamp, integrations, messageId }, callback) {
        const segmentEvent = this._eventFactory.track(event, properties, {
            context,
            userId,
            anonymousId,
            timestamp,
            integrations,
            messageId
        });
        this._dispatch(segmentEvent, callback);
    }
    /**
     * Registers one or more plugins to augment Analytics functionality.
     * @param plugins
     */ register(...plugins) {
        return this._queue.criticalTasks.run(async ()=>{
            const ctx = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$context$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Context"].system();
            const registrations = plugins.map((xt)=>this._queue.register(ctx, xt, this));
            await Promise.all(registrations);
            this.emit('register', plugins.map((el)=>el.name));
        });
    }
    /**
     * Deregisters one or more plugins based on their names.
     * @param pluginNames - The names of one or more plugins to deregister.
     */ async deregister(...pluginNames) {
        const ctx = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$context$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Context"].system();
        const deregistrations = pluginNames.map((pl)=>{
            const plugin = this._queue.plugins.find((p)=>p.name === pl);
            if (plugin) {
                return this._queue.deregister(ctx, plugin, this);
            } else {
                ctx.log('warn', `plugin ${pl} not found`);
            }
        });
        await Promise.all(deregistrations);
        this.emit('deregister', pluginNames);
    }
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/context.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Context",
    ()=>Context
]);
// create a derived class since we may want to add node specific things to Context later
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$context$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/context/index.js [app-client] (ecmascript)");
;
class Context extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$context$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreContext"] {
    static system() {
        return new this({
            type: 'track',
            event: 'system'
        });
    }
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/dispatch-emit.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dispatchAndEmit",
    ()=>dispatchAndEmit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$analytics$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/analytics/dispatch.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$context$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/context.js [app-client] (ecmascript)");
;
;
const normalizeDispatchCb = (cb)=>(ctx)=>{
        const failedDelivery = ctx.failedDelivery();
        return failedDelivery ? cb(failedDelivery.reason, ctx) : cb(undefined, ctx);
    };
const dispatchAndEmit = async (event, queue, emitter, callback)=>{
    try {
        const context = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$context$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Context"](event);
        const ctx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$analytics$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatch"])(context, queue, emitter, {
            ...callback ? {
                callback: normalizeDispatchCb(callback)
            } : {}
        });
        const failedDelivery = ctx.failedDelivery();
        if (failedDelivery) {
            emitter.emit('error', {
                code: 'delivery_failure',
                reason: failedDelivery.reason,
                ctx: ctx
            });
        } else {
            emitter.emit(event.type, ctx);
        }
    } catch (err) {
        emitter.emit('error', {
            code: 'unknown',
            reason: err
        });
    }
};
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/emitter.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NodeEmitter",
    ()=>NodeEmitter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$generic$2d$utils$2f$dist$2f$esm$2f$emitter$2f$emitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-generic-utils/dist/esm/emitter/emitter.js [app-client] (ecmascript)");
;
class NodeEmitter extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$generic$2d$utils$2f$dist$2f$esm$2f$emitter$2f$emitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Emitter"] {
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/event-factory.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NodeEventFactory",
    ()=>NodeEventFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$assertions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/validation/assertions.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$events$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/events/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$get$2d$message$2d$id$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/get-message-id.js [app-client] (ecmascript)");
;
;
class NodeEventFactory extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$events$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CoreEventFactory"] {
    constructor(){
        super({
            createMessageId: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$get$2d$message$2d$id$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createMessageId"],
            onFinishedEvent: (event)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$assertions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assertUserIdentity"])(event);
            }
        });
    }
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/event-queue.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NodeEventQueue",
    ()=>NodeEventQueue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$queue$2f$event$2d$queue$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/queue/event-queue.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$priority$2d$queue$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/priority-queue/index.js [app-client] (ecmascript)");
;
class NodePriorityQueue extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$priority$2d$queue$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PriorityQueue"] {
    constructor(){
        super(1, []);
    }
    // do not use an internal "seen" map
    getAttempts(ctx) {
        return ctx.attempts ?? 0;
    }
    updateAttempts(ctx) {
        ctx.attempts = this.getAttempts(ctx) + 1;
        return this.getAttempts(ctx);
    }
}
class NodeEventQueue extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$queue$2f$event$2d$queue$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoreEventQueue"] {
    constructor(){
        super(new NodePriorityQueue());
    }
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/settings.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "validateSettings",
    ()=>validateSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/validation/errors.js [app-client] (ecmascript)");
;
const validateSettings = (settings)=>{
    if (!settings.writeKey) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$validation$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationError"]('writeKey', 'writeKey is missing.');
    }
};
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/generated/version.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// This file is generated.
__turbopack_context__.s([
    "version",
    ()=>version
]);
const version = '2.3.0';
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/index.common.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$analytics$2d$node$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/analytics-node.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$context$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/context.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$http$2d$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/http-client.js [app-client] (ecmascript)");
;
;
;
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$index$2e$common$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/index.common.js [app-client] (ecmascript) <locals>");
// export Analytics as both a named export and a default export (for backwards-compat. reasons)
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$analytics$2d$node$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/app/analytics-node.js [app-client] (ecmascript)");
;
;
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$app$2f$analytics$2d$node$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Analytics"];
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/abort.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AbortController",
    ()=>AbortController,
    "AbortSignal",
    ()=>AbortSignal,
    "abortSignalAfterTimeout",
    ()=>abortSignalAfterTimeout
]);
/**
 * use non-native event emitter for the benefit of non-node runtimes like CF workers.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$generic$2d$utils$2f$dist$2f$esm$2f$emitter$2f$emitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-generic-utils/dist/esm/emitter/emitter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$env$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/env.js [app-client] (ecmascript)");
;
;
class AbortSignal {
    onabort = null;
    aborted = false;
    eventEmitter = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$generic$2d$utils$2f$dist$2f$esm$2f$emitter$2f$emitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Emitter"]();
    toString() {
        return '[object AbortSignal]';
    }
    get [Symbol.toStringTag]() {
        return 'AbortSignal';
    }
    removeEventListener(...args) {
        this.eventEmitter.off(...args);
    }
    addEventListener(...args) {
        this.eventEmitter.on(...args);
    }
    dispatchEvent(type) {
        const event = {
            type,
            target: this
        };
        const handlerName = `on${type}`;
        if (typeof this[handlerName] === 'function') {
            ;
            this[handlerName](event);
        }
        this.eventEmitter.emit(type, event);
    }
}
class AbortController {
    signal = new AbortSignal();
    abort() {
        if (this.signal.aborted) return;
        this.signal.aborted = true;
        this.signal.dispatchEvent('abort');
    }
    toString() {
        return '[object AbortController]';
    }
    get [Symbol.toStringTag]() {
        return 'AbortController';
    }
}
const abortSignalAfterTimeout = (timeoutMs)=>{
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$env$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["detectRuntime"])() === 'cloudflare-worker') {
        return []; // TODO: this is broken in cloudflare workers, otherwise results in "A hanging Promise was canceled..." error.
    }
    const ac = new (globalThis.AbortController || AbortController)();
    const timeoutId = setTimeout(()=>{
        ac.abort();
    }, timeoutMs);
    // Allow Node.js processes to exit early if only the timeout is running
    timeoutId?.unref?.();
    return [
        ac.signal,
        timeoutId
    ];
};
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/create-url.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tryCreateFormattedUrl",
    ()=>tryCreateFormattedUrl
]);
const stripTrailingSlash = (str)=>str.replace(/\/$/, '');
const tryCreateFormattedUrl = (host, path)=>{
    return stripTrailingSlash(new URL(path || '', host).href);
};
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/env.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "detectRuntime",
    ()=>detectRuntime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const detectRuntime = ()=>{
    if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] === 'object' && __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] && typeof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env === 'object' && __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env && typeof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].version === 'string') {
        return 'node';
    }
    if (typeof window === 'object') {
        return 'browser';
    }
    // @ts-ignore
    if (typeof WebSocketPair !== 'undefined') {
        return 'cloudflare-worker';
    }
    // @ts-ignore
    if (typeof EdgeRuntime === 'string') {
        return 'vercel-edge';
    }
    if (// @ts-ignore
    typeof WorkerGlobalScope !== 'undefined' && // @ts-ignore
    typeof importScripts === 'function') {
        return 'web-worker';
    }
    return 'unknown';
};
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/fetch.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetch",
    ()=>fetch
]);
const fetch = async (...args)=>{
    if (globalThis.fetch) {
        return globalThis.fetch(...args);
    } else if (typeof EdgeRuntime !== 'string') {
        return (await __turbopack_context__.A("[project]/frontend/node_modules/node-fetch/browser.js [app-client] (ecmascript, async loader)")).default(...args);
    } else {
        throw new Error('Invariant: an edge runtime that does not support fetch should not exist');
    }
};
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/get-message-id.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createMessageId",
    ()=>createMessageId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$uuid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/uuid.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$lukeed$2f$uuid$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__v4__as__uuid$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@lukeed/uuid/dist/index.mjs [app-client] (ecmascript) <export v4 as uuid>");
;
const createMessageId = ()=>{
    return `node-next-${Date.now()}-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$lukeed$2f$uuid$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__v4__as__uuid$3e$__["uuid"])()}`;
};
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/http-client.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FetchHTTPClient",
    ()=>FetchHTTPClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$abort$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/abort.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/fetch.js [app-client] (ecmascript)");
;
;
class FetchHTTPClient {
    _fetch;
    constructor(fetchFn){
        this._fetch = fetchFn ?? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetch"];
    }
    async makeRequest(options) {
        const [signal, timeoutId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$abort$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["abortSignalAfterTimeout"])(options.httpRequestTimeout);
        const requestInit = {
            url: options.url,
            method: options.method,
            headers: options.headers,
            body: options.body,
            signal: signal
        };
        return this._fetch(options.url, requestInit).finally(()=>clearTimeout(timeoutId));
    }
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/token-manager.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TokenManager",
    ()=>TokenManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$uuid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/uuid.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$lukeed$2f$uuid$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__v4__as__uuid$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@lukeed/uuid/dist/index.mjs [app-client] (ecmascript) <export v4 as uuid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$jwt$2f$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/jwt/sign.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$key$2f$import$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/key/import.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$priority$2d$queue$2f$backoff$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/priority-queue/backoff.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$callback$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/callback/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$generic$2d$utils$2f$dist$2f$esm$2f$emitter$2f$emitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-generic-utils/dist/esm/emitter/emitter.js [app-client] (ecmascript)");
;
;
;
;
const isAccessToken = (thing)=>{
    return Boolean(thing && typeof thing === 'object' && 'access_token' in thing && 'expires_in' in thing && typeof thing.access_token === 'string' && typeof thing.expires_in === 'number');
};
const isValidCustomResponse = (response)=>{
    return typeof response.text === 'function';
};
function convertHeaders(headers) {
    const lowercaseHeaders = {};
    if (!headers) return {};
    if (isHeaders(headers)) {
        for (const [name, value] of headers.entries()){
            lowercaseHeaders[name.toLowerCase()] = value;
        }
        return lowercaseHeaders;
    }
    for (const [name, value] of Object.entries(headers)){
        lowercaseHeaders[name.toLowerCase()] = value;
    }
    return lowercaseHeaders;
}
function isHeaders(thing) {
    if (typeof thing === 'object' && thing !== null && 'entries' in Object(thing) && typeof Object(thing).entries === 'function') {
        return true;
    }
    return false;
}
class TokenManager {
    alg = 'RS256';
    grantType = 'client_credentials';
    clientAssertionType = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';
    clientId;
    clientKey;
    keyId;
    scope;
    authServer;
    httpClient;
    maxRetries;
    clockSkewInSeconds = 0;
    accessToken;
    tokenEmitter = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$generic$2d$utils$2f$dist$2f$esm$2f$emitter$2f$emitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Emitter"]();
    retryCount;
    pollerTimer;
    constructor(props){
        this.keyId = props.keyId;
        this.clientId = props.clientId;
        this.clientKey = props.clientKey;
        this.authServer = props.authServer ?? 'https://oauth2.segment.io';
        this.scope = props.scope ?? 'tracking_api:write';
        this.httpClient = props.httpClient;
        this.maxRetries = props.maxRetries;
        this.tokenEmitter.on('access_token', (event)=>{
            if ('token' in event) {
                this.accessToken = event.token;
            }
        });
        this.retryCount = 0;
    }
    stopPoller() {
        clearTimeout(this.pollerTimer);
    }
    async pollerLoop() {
        let timeUntilRefreshInMs = 25;
        let response;
        try {
            response = await this.requestAccessToken();
        } catch (err) {
            // Error without a status code - likely networking, retry
            return this.handleTransientError({
                error: err
            });
        }
        if (!isValidCustomResponse(response)) {
            return this.handleInvalidCustomResponse();
        }
        const headers = convertHeaders(response.headers);
        if (headers['date']) {
            this.updateClockSkew(Date.parse(headers['date']));
        }
        // Handle status codes!
        if (response.status === 200) {
            try {
                const body = await response.text();
                const token = JSON.parse(body);
                if (!isAccessToken(token)) {
                    throw new Error('Response did not contain a valid access_token and expires_in');
                }
                // Success, we have a token!
                token.expires_at = Math.round(Date.now() / 1000) + token.expires_in;
                this.tokenEmitter.emit('access_token', {
                    token
                });
                // Reset our failure count
                this.retryCount = 0;
                // Refresh the token after half the expiry time passes
                timeUntilRefreshInMs = token.expires_in / 2 * 1000;
                return this.queueNextPoll(timeUntilRefreshInMs);
            } catch (err) {
                // Something went really wrong with the body, lets surface an error and try again?
                return this.handleTransientError({
                    error: err,
                    forceEmitError: true
                });
            }
        } else if (response.status === 429) {
            // Rate limited, wait for the reset time
            return await this.handleRateLimited(response, headers, timeUntilRefreshInMs);
        } else if ([
            400,
            401,
            415
        ].includes(response.status)) {
            // Unrecoverable errors, stops the poller
            return this.handleUnrecoverableErrors(response);
        } else {
            return this.handleTransientError({
                error: new Error(`[${response.status}] ${response.statusText}`)
            });
        }
    }
    handleTransientError({ error, forceEmitError }) {
        this.incrementRetries({
            error,
            forceEmitError
        });
        const timeUntilRefreshInMs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$priority$2d$queue$2f$backoff$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["backoff"])({
            attempt: this.retryCount,
            minTimeout: 25,
            maxTimeout: 1000
        });
        this.queueNextPoll(timeUntilRefreshInMs);
    }
    handleInvalidCustomResponse() {
        this.tokenEmitter.emit('access_token', {
            error: new Error('HTTPClient does not implement response.text method')
        });
    }
    async handleRateLimited(response, headers, timeUntilRefreshInMs) {
        this.incrementRetries({
            error: new Error(`[${response.status}] ${response.statusText}`)
        });
        if (headers['x-ratelimit-reset']) {
            const rateLimitResetTimestamp = parseInt(headers['x-ratelimit-reset'], 10);
            if (isFinite(rateLimitResetTimestamp)) {
                timeUntilRefreshInMs = rateLimitResetTimestamp - Date.now() + this.clockSkewInSeconds * 1000;
            } else {
                timeUntilRefreshInMs = 5 * 1000;
            }
            // We want subsequent calls to get_token to be able to interrupt our
            //  Timeout when it's waiting for e.g. a long normal expiration, but
            //  not when we're waiting for a rate limit reset. Sleep instead.
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$callback$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sleep"])(timeUntilRefreshInMs);
            timeUntilRefreshInMs = 0;
        }
        this.queueNextPoll(timeUntilRefreshInMs);
    }
    handleUnrecoverableErrors(response) {
        this.retryCount = 0;
        this.tokenEmitter.emit('access_token', {
            error: new Error(`[${response.status}] ${response.statusText}`)
        });
        this.stopPoller();
    }
    updateClockSkew(dateInMs) {
        this.clockSkewInSeconds = (Date.now() - dateInMs) / 1000;
    }
    incrementRetries({ error, forceEmitError }) {
        this.retryCount++;
        if (forceEmitError || this.retryCount % this.maxRetries === 0) {
            this.retryCount = 0;
            this.tokenEmitter.emit('access_token', {
                error: error
            });
        }
    }
    queueNextPoll(timeUntilRefreshInMs) {
        this.pollerTimer = setTimeout(()=>this.pollerLoop(), timeUntilRefreshInMs);
        if (this.pollerTimer.unref) {
            this.pollerTimer.unref();
        }
    }
    /**
     * Solely responsible for building the HTTP request and calling the token service.
     */ async requestAccessToken() {
        // Set issued at time to 5 seconds in the past to account for clock skew
        const ISSUED_AT_BUFFER_IN_SECONDS = 5;
        const MAX_EXPIRY_IN_SECONDS = 60;
        // Final expiry time takes into account the issued at time, so need to subtract IAT buffer
        const EXPIRY_IN_SECONDS = MAX_EXPIRY_IN_SECONDS - ISSUED_AT_BUFFER_IN_SECONDS;
        const jti = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$lukeed$2f$uuid$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__v4__as__uuid$3e$__["uuid"])();
        const currentUTCInSeconds = Math.round(Date.now() / 1000) - this.clockSkewInSeconds;
        const jwtBody = {
            iss: this.clientId,
            sub: this.clientId,
            aud: this.authServer,
            iat: currentUTCInSeconds - ISSUED_AT_BUFFER_IN_SECONDS,
            exp: currentUTCInSeconds + EXPIRY_IN_SECONDS,
            jti
        };
        const key = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$key$2f$import$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["importPKCS8"])(this.clientKey, 'RS256');
        const signedJwt = await new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$jwt$2f$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SignJWT"](jwtBody).setProtectedHeader({
            alg: this.alg,
            kid: this.keyId,
            typ: 'JWT'
        }).sign(key);
        const requestBody = `grant_type=${this.grantType}&client_assertion_type=${this.clientAssertionType}&client_assertion=${signedJwt}&scope=${this.scope}`;
        const accessTokenEndpoint = `${this.authServer}/token`;
        const requestOptions = {
            method: 'POST',
            url: accessTokenEndpoint,
            body: requestBody,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            httpRequestTimeout: 10000
        };
        return this.httpClient.makeRequest(requestOptions);
    }
    async getAccessToken() {
        // Use the cached token if it is still valid, otherwise wait for a new token.
        if (this.isValidToken(this.accessToken)) {
            return this.accessToken;
        }
        // stop poller first in order to make sure that it's not sleeping if we need a token immediately
        // Otherwise it could be hours before the expiration time passes normally
        this.stopPoller();
        // startPoller needs to be called somewhere, either lazily when a token is first requested, or at instantiation.
        // Doing it lazily currently
        this.pollerLoop().catch(()=>{});
        return new Promise((resolve, reject)=>{
            this.tokenEmitter.once('access_token', (event)=>{
                if ('token' in event) {
                    resolve(event.token);
                } else {
                    reject(event.error);
                }
            });
        });
    }
    clearToken() {
        this.accessToken = undefined;
    }
    isValidToken(token) {
        return typeof token !== 'undefined' && token !== null && token.expires_in < Date.now() / 1000;
    }
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/uuid.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$lukeed$2f$uuid$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@lukeed/uuid/dist/index.mjs [app-client] (ecmascript)");
;
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/plugins/segmentio/context-batch.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ContextBatch",
    ()=>ContextBatch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$uuid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/uuid.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$lukeed$2f$uuid$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__v4__as__uuid$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@lukeed/uuid/dist/index.mjs [app-client] (ecmascript) <export v4 as uuid>");
;
const MAX_EVENT_SIZE_IN_KB = 32;
const MAX_BATCH_SIZE_IN_KB = 480; //  (500 KB is the limit, leaving some padding)
class ContextBatch {
    id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$lukeed$2f$uuid$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__v4__as__uuid$3e$__["uuid"])();
    items = [];
    sizeInBytes = 0;
    maxEventCount;
    constructor(maxEventCount){
        this.maxEventCount = Math.max(1, maxEventCount);
    }
    tryAdd(item) {
        if (this.length === this.maxEventCount) return {
            success: false,
            message: `Event limit of ${this.maxEventCount} has been exceeded.`
        };
        const eventSize = this.calculateSize(item.context);
        if (eventSize > MAX_EVENT_SIZE_IN_KB * 1024) {
            return {
                success: false,
                message: `Event exceeds maximum event size of ${MAX_EVENT_SIZE_IN_KB} KB`
            };
        }
        if (this.sizeInBytes + eventSize > MAX_BATCH_SIZE_IN_KB * 1024) {
            return {
                success: false,
                message: `Event has caused batch size to exceed ${MAX_BATCH_SIZE_IN_KB} KB`
            };
        }
        this.items.push(item);
        this.sizeInBytes += eventSize;
        return {
            success: true
        };
    }
    get length() {
        return this.items.length;
    }
    calculateSize(ctx) {
        return encodeURI(JSON.stringify(ctx.event)).split(/%..|i/).length;
    }
    getEvents() {
        const events = this.items.map(({ context })=>context.event);
        return events;
    }
    getContexts() {
        return this.items.map((item)=>item.context);
    }
    resolveEvents() {
        this.items.forEach(({ resolver, context })=>resolver(context));
    }
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/plugins/segmentio/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createConfiguredNodePlugin",
    ()=>createConfiguredNodePlugin,
    "createNodePlugin",
    ()=>createNodePlugin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$plugins$2f$segmentio$2f$publisher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/plugins/segmentio/publisher.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$generated$2f$version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/generated/version.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$env$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/env.js [app-client] (ecmascript)");
;
;
;
function normalizeEvent(ctx) {
    ctx.updateEvent('context.library.name', '@segment/analytics-node');
    ctx.updateEvent('context.library.version', __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$generated$2f$version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
    const runtime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$env$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["detectRuntime"])();
    if (runtime === 'node') {
        // eslint-disable-next-line no-restricted-globals
        ctx.updateEvent('_metadata.nodeVersion', __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].version);
    }
    ctx.updateEvent('_metadata.jsRuntime', runtime);
}
function createNodePlugin(publisher) {
    function action(ctx) {
        normalizeEvent(ctx);
        return publisher.enqueue(ctx);
    }
    return {
        name: 'Segment.io',
        type: 'destination',
        version: '1.0.0',
        isLoaded: ()=>true,
        load: ()=>Promise.resolve(),
        alias: action,
        group: action,
        identify: action,
        page: action,
        screen: action,
        track: action
    };
}
const createConfiguredNodePlugin = (props, emitter)=>{
    const publisher = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$plugins$2f$segmentio$2f$publisher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Publisher"](props, emitter);
    return {
        publisher: publisher,
        plugin: createNodePlugin(publisher)
    };
};
}),
"[project]/frontend/node_modules/@segment/analytics-node/dist/esm/plugins/segmentio/publisher.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Publisher",
    ()=>Publisher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$priority$2d$queue$2f$backoff$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-core/dist/esm/priority-queue/backoff.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$create$2d$url$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/create-url.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$generic$2d$utils$2f$dist$2f$esm$2f$create$2d$deferred$2f$create$2d$deferred$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-generic-utils/dist/esm/create-deferred/create-deferred.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$plugins$2f$segmentio$2f$context$2d$batch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/plugins/segmentio/context-batch.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$token$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/dist/esm/lib/token-manager.js [app-client] (ecmascript)");
;
;
;
;
;
function sleep(timeoutInMs) {
    return new Promise((resolve)=>setTimeout(resolve, timeoutInMs));
}
function noop() {}
class Publisher {
    pendingFlushTimeout;
    _batch;
    _flushInterval;
    _flushAt;
    _maxRetries;
    _url;
    _flushPendingItemsCount;
    _httpRequestTimeout;
    _emitter;
    _disable;
    _httpClient;
    _writeKey;
    _tokenManager;
    constructor({ host, path, maxRetries, flushAt, flushInterval, writeKey, httpRequestTimeout, httpClient, disable, oauthSettings }, emitter){
        this._emitter = emitter;
        this._maxRetries = maxRetries;
        this._flushAt = Math.max(flushAt, 1);
        this._flushInterval = flushInterval;
        this._url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$create$2d$url$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tryCreateFormattedUrl"])(host ?? 'https://api.segment.io', path ?? '/v1/batch');
        this._httpRequestTimeout = httpRequestTimeout ?? 10000;
        this._disable = Boolean(disable);
        this._httpClient = httpClient;
        this._writeKey = writeKey;
        if (oauthSettings) {
            this._tokenManager = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$lib$2f$token$2d$manager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenManager"]({
                ...oauthSettings,
                httpClient: oauthSettings.httpClient ?? httpClient,
                maxRetries: oauthSettings.maxRetries ?? maxRetries
            });
        }
    }
    createBatch() {
        this.pendingFlushTimeout && clearTimeout(this.pendingFlushTimeout);
        const batch = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$dist$2f$esm$2f$plugins$2f$segmentio$2f$context$2d$batch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContextBatch"](this._flushAt);
        this._batch = batch;
        this.pendingFlushTimeout = setTimeout(()=>{
            if (batch === this._batch) {
                this._batch = undefined;
            }
            this.pendingFlushTimeout = undefined;
            if (batch.length) {
                this.send(batch).catch(noop);
            }
        }, this._flushInterval);
        return batch;
    }
    clearBatch() {
        this.pendingFlushTimeout && clearTimeout(this.pendingFlushTimeout);
        this._batch = undefined;
    }
    flush(pendingItemsCount) {
        if (!pendingItemsCount) {
            // if number of pending items is 0, there will never be anything else entering the batch, since the app is closed.
            if (this._tokenManager) {
                this._tokenManager.stopPoller();
            }
            return;
        }
        this._flushPendingItemsCount = pendingItemsCount;
        // if batch is empty, there's nothing to flush, and when things come in, enqueue will handle them.
        if (!this._batch) return;
        // the number of globally pending items will always be larger or the same as batch size.
        // Any mismatch is because some globally pending items are in plugins.
        const isExpectingNoMoreItems = this._batch.length === pendingItemsCount;
        if (isExpectingNoMoreItems) {
            this.send(this._batch).catch(noop).finally(()=>{
                // stop poller so program can exit ().
                if (this._tokenManager) {
                    this._tokenManager.stopPoller();
                }
            });
            this.clearBatch();
        }
    }
    /**
     * Enqueues the context for future delivery.
     * @param ctx - Context containing a Segment event.
     * @returns a promise that resolves with the context after the event has been delivered.
     */ enqueue(ctx) {
        const batch = this._batch ?? this.createBatch();
        const { promise: ctxPromise, resolve } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$generic$2d$utils$2f$dist$2f$esm$2f$create$2d$deferred$2f$create$2d$deferred$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDeferred"])();
        const pendingItem = {
            context: ctx,
            resolver: resolve
        };
        /*
          The following logic ensures that a batch is never orphaned,
          and is always sent before a new batch is created.
    
          Add an event to the existing batch.
            Success: Check if batch is full or no more items are expected to come in (i.e. closing). If so, send batch.
            Failure: Assume event is too big to fit in current batch - send existing batch.
              Add an event to the new batch.
                Success: Check if batch is full and send if it is.
                Failure: Event exceeds maximum size (it will never fit), fail the event.
        */ const addStatus = batch.tryAdd(pendingItem);
        if (addStatus.success) {
            const isExpectingNoMoreItems = batch.length === this._flushPendingItemsCount;
            const isFull = batch.length === this._flushAt;
            if (isFull || isExpectingNoMoreItems) {
                this.send(batch).catch(noop);
                this.clearBatch();
            }
            return ctxPromise;
        }
        // If the new item causes the maximimum event size to be exceeded, send the current batch and create a new one.
        if (batch.length) {
            this.send(batch).catch(noop);
            this.clearBatch();
        }
        const fallbackBatch = this.createBatch();
        const fbAddStatus = fallbackBatch.tryAdd(pendingItem);
        if (fbAddStatus.success) {
            const isExpectingNoMoreItems = fallbackBatch.length === this._flushPendingItemsCount;
            if (isExpectingNoMoreItems) {
                this.send(fallbackBatch).catch(noop);
                this.clearBatch();
            }
            return ctxPromise;
        } else {
            // this should only occur if max event size is exceeded
            ctx.setFailedDelivery({
                reason: new Error(fbAddStatus.message)
            });
            return Promise.resolve(ctx);
        }
    }
    async send(batch) {
        if (this._flushPendingItemsCount) {
            this._flushPendingItemsCount -= batch.length;
        }
        const events = batch.getEvents();
        const maxAttempts = this._maxRetries + 1;
        let currentAttempt = 0;
        while(currentAttempt < maxAttempts){
            currentAttempt++;
            let requestedRetryTimeout;
            let failureReason;
            try {
                if (this._disable) {
                    return batch.resolveEvents();
                }
                let authString = undefined;
                if (this._tokenManager) {
                    const token = await this._tokenManager.getAccessToken();
                    if (token && token.access_token) {
                        authString = `Bearer ${token.access_token}`;
                    }
                }
                const headers = {
                    'Content-Type': 'application/json',
                    'User-Agent': 'analytics-node-next/latest',
                    ...authString ? {
                        Authorization: authString
                    } : {}
                };
                const request = {
                    url: this._url,
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        batch: events,
                        writeKey: this._writeKey,
                        sentAt: new Date()
                    }),
                    httpRequestTimeout: this._httpRequestTimeout
                };
                this._emitter.emit('http_request', {
                    body: request.body,
                    method: request.method,
                    url: request.url,
                    headers: request.headers
                });
                const response = await this._httpClient.makeRequest(request);
                if (response.status >= 200 && response.status < 300) {
                    // Successfully sent events, so exit!
                    batch.resolveEvents();
                    return;
                } else if (this._tokenManager && (response.status === 400 || response.status === 401 || response.status === 403)) {
                    // Retry with a new OAuth token if we have OAuth data
                    this._tokenManager.clearToken();
                    failureReason = new Error(`[${response.status}] ${response.statusText}`);
                } else if (response.status === 400) {
                    // https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/#max-request-size
                    // Request either malformed or size exceeded - don't retry.
                    resolveFailedBatch(batch, new Error(`[${response.status}] ${response.statusText}`));
                    return;
                } else if (response.status === 429) {
                    // Rate limited, wait for the reset time
                    if (response.headers && 'x-ratelimit-reset' in response.headers) {
                        const rateLimitResetTimestamp = parseInt(response.headers['x-ratelimit-reset'], 10);
                        if (isFinite(rateLimitResetTimestamp)) {
                            requestedRetryTimeout = rateLimitResetTimestamp - Date.now();
                        }
                    }
                    failureReason = new Error(`[${response.status}] ${response.statusText}`);
                } else {
                    // Treat other errors as transient and retry.
                    failureReason = new Error(`[${response.status}] ${response.statusText}`);
                }
            } catch (err) {
                // Network errors get thrown, retry them.
                failureReason = err;
            }
            // Final attempt failed, update context and resolve events.
            if (currentAttempt === maxAttempts) {
                resolveFailedBatch(batch, failureReason);
                return;
            }
            // Retry after attempt-based backoff.
            await sleep(requestedRetryTimeout ? requestedRetryTimeout : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$core$2f$dist$2f$esm$2f$priority$2d$queue$2f$backoff$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["backoff"])({
                attempt: currentAttempt,
                minTimeout: 25,
                maxTimeout: 1000
            }));
        }
    }
}
function resolveFailedBatch(batch, reason) {
    batch.getContexts().forEach((ctx)=>ctx.setFailedDelivery({
            reason
        }));
    batch.resolveEvents();
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/jws/compact/sign.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CompactSign",
    ()=>CompactSign
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$jws$2f$flattened$2f$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/jws/flattened/sign.js [app-client] (ecmascript)");
;
class CompactSign {
    constructor(payload){
        this._flattened = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$jws$2f$flattened$2f$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlattenedSign"](payload);
    }
    setProtectedHeader(protectedHeader) {
        this._flattened.setProtectedHeader(protectedHeader);
        return this;
    }
    async sign(key, options) {
        const jws = await this._flattened.sign(key, options);
        if (jws.payload === undefined) {
            throw new TypeError('use the flattened module for creating JWS with b64: false');
        }
        return `${jws.protected}.${jws.payload}.${jws.signature}`;
    }
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/jws/flattened/sign.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FlattenedSign",
    ()=>FlattenedSign
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$base64url$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/base64url.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/sign.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_disjoint$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/is_disjoint.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/util/errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/buffer_utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$check_key_type$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/check_key_type.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$validate_crit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/validate_crit.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
class FlattenedSign {
    constructor(payload){
        if (!(payload instanceof Uint8Array)) {
            throw new TypeError('payload must be an instance of Uint8Array');
        }
        this._payload = payload;
    }
    setProtectedHeader(protectedHeader) {
        if (this._protectedHeader) {
            throw new TypeError('setProtectedHeader can only be called once');
        }
        this._protectedHeader = protectedHeader;
        return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
        if (this._unprotectedHeader) {
            throw new TypeError('setUnprotectedHeader can only be called once');
        }
        this._unprotectedHeader = unprotectedHeader;
        return this;
    }
    async sign(key, options) {
        if (!this._protectedHeader && !this._unprotectedHeader) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JWSInvalid"]('either setProtectedHeader or setUnprotectedHeader must be called before #sign()');
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_disjoint$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(this._protectedHeader, this._unprotectedHeader)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Protected and JWS Unprotected Header Parameter names must be disjoint');
        }
        const joseHeader = {
            ...this._protectedHeader,
            ...this._unprotectedHeader
        };
        const extensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$validate_crit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JWSInvalid"], new Map([
            [
                'b64',
                true
            ]
        ]), options?.crit, this._protectedHeader, joseHeader);
        let b64 = true;
        if (extensions.has('b64')) {
            b64 = this._protectedHeader.b64;
            if (typeof b64 !== 'boolean') {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JWSInvalid"]('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
            }
        }
        const { alg } = joseHeader;
        if (typeof alg !== 'string' || !alg) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS "alg" (Algorithm) Header Parameter missing or invalid');
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$check_key_type$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkKeyTypeWithJwk"])(alg, key, 'sign');
        let payload = this._payload;
        if (b64) {
            payload = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encoder"].encode((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$base64url$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encode"])(payload));
        }
        let protectedHeader;
        if (this._protectedHeader) {
            protectedHeader = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encoder"].encode((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$base64url$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encode"])(JSON.stringify(this._protectedHeader)));
        } else {
            protectedHeader = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encoder"].encode('');
        }
        const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concat"])(protectedHeader, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encoder"].encode('.'), payload);
        const signature = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(alg, key, data);
        const jws = {
            signature: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$base64url$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encode"])(signature),
            payload: ''
        };
        if (b64) {
            jws.payload = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decoder"].decode(payload);
        }
        if (this._unprotectedHeader) {
            jws.header = this._unprotectedHeader;
        }
        if (this._protectedHeader) {
            jws.protected = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decoder"].decode(protectedHeader);
        }
        return jws;
    }
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/jwt/produce.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProduceJWT",
    ()=>ProduceJWT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$epoch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/epoch.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_object$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/is_object.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$secs$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/secs.js [app-client] (ecmascript)");
;
;
;
function validateInput(label, input) {
    if (!Number.isFinite(input)) {
        throw new TypeError(`Invalid ${label} input`);
    }
    return input;
}
class ProduceJWT {
    constructor(payload = {}){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_object$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(payload)) {
            throw new TypeError('JWT Claims Set MUST be an object');
        }
        this._payload = payload;
    }
    setIssuer(issuer) {
        this._payload = {
            ...this._payload,
            iss: issuer
        };
        return this;
    }
    setSubject(subject) {
        this._payload = {
            ...this._payload,
            sub: subject
        };
        return this;
    }
    setAudience(audience) {
        this._payload = {
            ...this._payload,
            aud: audience
        };
        return this;
    }
    setJti(jwtId) {
        this._payload = {
            ...this._payload,
            jti: jwtId
        };
        return this;
    }
    setNotBefore(input) {
        if (typeof input === 'number') {
            this._payload = {
                ...this._payload,
                nbf: validateInput('setNotBefore', input)
            };
        } else if (input instanceof Date) {
            this._payload = {
                ...this._payload,
                nbf: validateInput('setNotBefore', (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$epoch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(input))
            };
        } else {
            this._payload = {
                ...this._payload,
                nbf: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$epoch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(new Date()) + (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$secs$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(input)
            };
        }
        return this;
    }
    setExpirationTime(input) {
        if (typeof input === 'number') {
            this._payload = {
                ...this._payload,
                exp: validateInput('setExpirationTime', input)
            };
        } else if (input instanceof Date) {
            this._payload = {
                ...this._payload,
                exp: validateInput('setExpirationTime', (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$epoch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(input))
            };
        } else {
            this._payload = {
                ...this._payload,
                exp: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$epoch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(new Date()) + (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$secs$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(input)
            };
        }
        return this;
    }
    setIssuedAt(input) {
        if (typeof input === 'undefined') {
            this._payload = {
                ...this._payload,
                iat: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$epoch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(new Date())
            };
        } else if (input instanceof Date) {
            this._payload = {
                ...this._payload,
                iat: validateInput('setIssuedAt', (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$epoch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(input))
            };
        } else if (typeof input === 'string') {
            this._payload = {
                ...this._payload,
                iat: validateInput('setIssuedAt', (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$epoch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(new Date()) + (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$secs$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(input))
            };
        } else {
            this._payload = {
                ...this._payload,
                iat: validateInput('setIssuedAt', input)
            };
        }
        return this;
    }
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/jwt/sign.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SignJWT",
    ()=>SignJWT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$jws$2f$compact$2f$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/jws/compact/sign.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/util/errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/buffer_utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$jwt$2f$produce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/jwt/produce.js [app-client] (ecmascript)");
;
;
;
;
class SignJWT extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$jwt$2f$produce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProduceJWT"] {
    setProtectedHeader(protectedHeader) {
        this._protectedHeader = protectedHeader;
        return this;
    }
    async sign(key, options) {
        const sig = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$jws$2f$compact$2f$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CompactSign"](__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encoder"].encode(JSON.stringify(this._payload)));
        sig.setProtectedHeader(this._protectedHeader);
        if (Array.isArray(this._protectedHeader?.crit) && this._protectedHeader.crit.includes('b64') && this._protectedHeader.b64 === false) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JWTInvalid"]('JWTs MUST NOT use unencoded payload');
        }
        return sig.sign(key, options);
    }
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/key/import.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "importJWK",
    ()=>importJWK,
    "importPKCS8",
    ()=>importPKCS8,
    "importSPKI",
    ()=>importSPKI,
    "importX509",
    ()=>importX509
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$base64url$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/base64url.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$asn1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/asn1.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$jwk_to_key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/jwk_to_key.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/util/errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_object$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/is_object.js [app-client] (ecmascript)");
;
;
;
;
;
async function importSPKI(spki, alg, options) {
    if (typeof spki !== 'string' || spki.indexOf('-----BEGIN PUBLIC KEY-----') !== 0) {
        throw new TypeError('"spki" must be SPKI formatted string');
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$asn1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromSPKI"])(spki, alg, options);
}
async function importX509(x509, alg, options) {
    if (typeof x509 !== 'string' || x509.indexOf('-----BEGIN CERTIFICATE-----') !== 0) {
        throw new TypeError('"x509" must be X.509 formatted string');
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$asn1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromX509"])(x509, alg, options);
}
async function importPKCS8(pkcs8, alg, options) {
    if (typeof pkcs8 !== 'string' || pkcs8.indexOf('-----BEGIN PRIVATE KEY-----') !== 0) {
        throw new TypeError('"pkcs8" must be PKCS#8 formatted string');
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$asn1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromPKCS8"])(pkcs8, alg, options);
}
async function importJWK(jwk, alg) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_object$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(jwk)) {
        throw new TypeError('JWK must be an object');
    }
    alg || (alg = jwk.alg);
    switch(jwk.kty){
        case 'oct':
            if (typeof jwk.k !== 'string' || !jwk.k) {
                throw new TypeError('missing "k" (Key Value) Parameter value');
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$base64url$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decode"])(jwk.k);
        case 'RSA':
            if ('oth' in jwk && jwk.oth !== undefined) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOSENotSupported"]('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
            }
        case 'EC':
        case 'OKP':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$jwk_to_key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
                ...jwk,
                alg
            });
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOSENotSupported"]('Unsupported "kty" (Key Type) Parameter value');
    }
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/buffer_utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "concat",
    ()=>concat,
    "concatKdf",
    ()=>concatKdf,
    "decoder",
    ()=>decoder,
    "encoder",
    ()=>encoder,
    "lengthAndInput",
    ()=>lengthAndInput,
    "p2s",
    ()=>p2s,
    "uint32be",
    ()=>uint32be,
    "uint64be",
    ()=>uint64be
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$digest$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/digest.js [app-client] (ecmascript)");
;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const MAX_INT32 = 2 ** 32;
function concat(...buffers) {
    const size = buffers.reduce((acc, { length })=>acc + length, 0);
    const buf = new Uint8Array(size);
    let i = 0;
    for (const buffer of buffers){
        buf.set(buffer, i);
        i += buffer.length;
    }
    return buf;
}
function p2s(alg, p2sInput) {
    return concat(encoder.encode(alg), new Uint8Array([
        0
    ]), p2sInput);
}
function writeUInt32BE(buf, value, offset) {
    if (value < 0 || value >= MAX_INT32) {
        throw new RangeError(`value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`);
    }
    buf.set([
        value >>> 24,
        value >>> 16,
        value >>> 8,
        value & 0xff
    ], offset);
}
function uint64be(value) {
    const high = Math.floor(value / MAX_INT32);
    const low = value % MAX_INT32;
    const buf = new Uint8Array(8);
    writeUInt32BE(buf, high, 0);
    writeUInt32BE(buf, low, 4);
    return buf;
}
function uint32be(value) {
    const buf = new Uint8Array(4);
    writeUInt32BE(buf, value);
    return buf;
}
function lengthAndInput(input) {
    return concat(uint32be(input.length), input);
}
async function concatKdf(secret, bits, value) {
    const iterations = Math.ceil((bits >> 3) / 32);
    const res = new Uint8Array(iterations * 32);
    for(let iter = 0; iter < iterations; iter++){
        const buf = new Uint8Array(4 + secret.length + value.length);
        buf.set(uint32be(iter + 1));
        buf.set(secret, 4);
        buf.set(value, 4 + secret.length);
        res.set(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$digest$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('sha256', buf), iter * 32);
    }
    return res.slice(0, bits >> 3);
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/check_key_type.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkKeyTypeWithJwk",
    ()=>checkKeyTypeWithJwk,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/invalid_key_input.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/is_key_like.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/is_jwk.js [app-client] (ecmascript)");
;
;
;
const tag = (key)=>key?.[Symbol.toStringTag];
const jwkMatchesOp = (alg, key, usage)=>{
    if (key.use !== undefined && key.use !== 'sig') {
        throw new TypeError('Invalid key for this operation, when present its use must be sig');
    }
    if (key.key_ops !== undefined && key.key_ops.includes?.(usage) !== true) {
        throw new TypeError(`Invalid key for this operation, when present its key_ops must include ${usage}`);
    }
    if (key.alg !== undefined && key.alg !== alg) {
        throw new TypeError(`Invalid key for this operation, when present its alg must be ${alg}`);
    }
    return true;
};
const symmetricTypeCheck = (alg, key, usage, allowJwk)=>{
    if (key instanceof Uint8Array) return;
    if (allowJwk && __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isJWK"](key)) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSecretJWK"](key) && jwkMatchesOp(alg, key, usage)) return;
        throw new TypeError(`JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`);
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(key)) {
        throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withAlg"])(alg, key, ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["types"], 'Uint8Array', allowJwk ? 'JSON Web Key' : null));
    }
    if (key.type !== 'secret') {
        throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
    }
};
const asymmetricTypeCheck = (alg, key, usage, allowJwk)=>{
    if (allowJwk && __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isJWK"](key)) {
        switch(usage){
            case 'sign':
                if (__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPrivateJWK"](key) && jwkMatchesOp(alg, key, usage)) return;
                throw new TypeError(`JSON Web Key for this operation be a private JWK`);
            case 'verify':
                if (__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPublicJWK"](key) && jwkMatchesOp(alg, key, usage)) return;
                throw new TypeError(`JSON Web Key for this operation be a public JWK`);
        }
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(key)) {
        throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withAlg"])(alg, key, ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["types"], allowJwk ? 'JSON Web Key' : null));
    }
    if (key.type === 'secret') {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
    }
    if (usage === 'sign' && key.type === 'public') {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm signing must be of type "private"`);
    }
    if (usage === 'decrypt' && key.type === 'public') {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`);
    }
    if (key.algorithm && usage === 'verify' && key.type === 'private') {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`);
    }
    if (key.algorithm && usage === 'encrypt' && key.type === 'private') {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`);
    }
};
function checkKeyType(allowJwk, alg, key, usage) {
    const symmetric = alg.startsWith('HS') || alg === 'dir' || alg.startsWith('PBES2') || /^A\d{3}(?:GCM)?KW$/.test(alg);
    if (symmetric) {
        symmetricTypeCheck(alg, key, usage, allowJwk);
    } else {
        asymmetricTypeCheck(alg, key, usage, allowJwk);
    }
}
const __TURBOPACK__default__export__ = checkKeyType.bind(undefined, false);
const checkKeyTypeWithJwk = checkKeyType.bind(undefined, true);
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/crypto_key.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkEncCryptoKey",
    ()=>checkEncCryptoKey,
    "checkSigCryptoKey",
    ()=>checkSigCryptoKey
]);
function unusable(name, prop = 'algorithm.name') {
    return new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
}
function isAlgorithm(algorithm, name) {
    return algorithm.name === name;
}
function getHashLength(hash) {
    return parseInt(hash.name.slice(4), 10);
}
function getNamedCurve(alg) {
    switch(alg){
        case 'ES256':
            return 'P-256';
        case 'ES384':
            return 'P-384';
        case 'ES512':
            return 'P-521';
        default:
            throw new Error('unreachable');
    }
}
function checkUsage(key, usages) {
    if (usages.length && !usages.some((expected)=>key.usages.includes(expected))) {
        let msg = 'CryptoKey does not support this operation, its usages must include ';
        if (usages.length > 2) {
            const last = usages.pop();
            msg += `one of ${usages.join(', ')}, or ${last}.`;
        } else if (usages.length === 2) {
            msg += `one of ${usages[0]} or ${usages[1]}.`;
        } else {
            msg += `${usages[0]}.`;
        }
        throw new TypeError(msg);
    }
}
function checkSigCryptoKey(key, alg, ...usages) {
    switch(alg){
        case 'HS256':
        case 'HS384':
        case 'HS512':
            {
                if (!isAlgorithm(key.algorithm, 'HMAC')) throw unusable('HMAC');
                const expected = parseInt(alg.slice(2), 10);
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash');
                break;
            }
        case 'RS256':
        case 'RS384':
        case 'RS512':
            {
                if (!isAlgorithm(key.algorithm, 'RSASSA-PKCS1-v1_5')) throw unusable('RSASSA-PKCS1-v1_5');
                const expected = parseInt(alg.slice(2), 10);
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash');
                break;
            }
        case 'PS256':
        case 'PS384':
        case 'PS512':
            {
                if (!isAlgorithm(key.algorithm, 'RSA-PSS')) throw unusable('RSA-PSS');
                const expected = parseInt(alg.slice(2), 10);
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash');
                break;
            }
        case 'EdDSA':
            {
                if (key.algorithm.name !== 'Ed25519' && key.algorithm.name !== 'Ed448') {
                    throw unusable('Ed25519 or Ed448');
                }
                break;
            }
        case 'Ed25519':
            {
                if (!isAlgorithm(key.algorithm, 'Ed25519')) throw unusable('Ed25519');
                break;
            }
        case 'ES256':
        case 'ES384':
        case 'ES512':
            {
                if (!isAlgorithm(key.algorithm, 'ECDSA')) throw unusable('ECDSA');
                const expected = getNamedCurve(alg);
                const actual = key.algorithm.namedCurve;
                if (actual !== expected) throw unusable(expected, 'algorithm.namedCurve');
                break;
            }
        default:
            throw new TypeError('CryptoKey does not support this operation');
    }
    checkUsage(key, usages);
}
function checkEncCryptoKey(key, alg, ...usages) {
    switch(alg){
        case 'A128GCM':
        case 'A192GCM':
        case 'A256GCM':
            {
                if (!isAlgorithm(key.algorithm, 'AES-GCM')) throw unusable('AES-GCM');
                const expected = parseInt(alg.slice(1, 4), 10);
                const actual = key.algorithm.length;
                if (actual !== expected) throw unusable(expected, 'algorithm.length');
                break;
            }
        case 'A128KW':
        case 'A192KW':
        case 'A256KW':
            {
                if (!isAlgorithm(key.algorithm, 'AES-KW')) throw unusable('AES-KW');
                const expected = parseInt(alg.slice(1, 4), 10);
                const actual = key.algorithm.length;
                if (actual !== expected) throw unusable(expected, 'algorithm.length');
                break;
            }
        case 'ECDH':
            {
                switch(key.algorithm.name){
                    case 'ECDH':
                    case 'X25519':
                    case 'X448':
                        break;
                    default:
                        throw unusable('ECDH, X25519, or X448');
                }
                break;
            }
        case 'PBES2-HS256+A128KW':
        case 'PBES2-HS384+A192KW':
        case 'PBES2-HS512+A256KW':
            if (!isAlgorithm(key.algorithm, 'PBKDF2')) throw unusable('PBKDF2');
            break;
        case 'RSA-OAEP':
        case 'RSA-OAEP-256':
        case 'RSA-OAEP-384':
        case 'RSA-OAEP-512':
            {
                if (!isAlgorithm(key.algorithm, 'RSA-OAEP')) throw unusable('RSA-OAEP');
                const expected = parseInt(alg.slice(9), 10) || 1;
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash');
                break;
            }
        default:
            throw new TypeError('CryptoKey does not support this operation');
    }
    checkUsage(key, usages);
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/epoch.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = (date)=>Math.floor(date.getTime() / 1000);
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/format_pem.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = (b64, descriptor)=>{
    const newlined = (b64.match(/.{1,64}/g) || []).join('\n');
    return `-----BEGIN ${descriptor}-----\n${newlined}\n-----END ${descriptor}-----`;
};
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/invalid_key_input.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "withAlg",
    ()=>withAlg
]);
function message(msg, actual, ...types) {
    types = types.filter(Boolean);
    if (types.length > 2) {
        const last = types.pop();
        msg += `one of type ${types.join(', ')}, or ${last}.`;
    } else if (types.length === 2) {
        msg += `one of type ${types[0]} or ${types[1]}.`;
    } else {
        msg += `of type ${types[0]}.`;
    }
    if (actual == null) {
        msg += ` Received ${actual}`;
    } else if (typeof actual === 'function' && actual.name) {
        msg += ` Received function ${actual.name}`;
    } else if (typeof actual === 'object' && actual != null) {
        if (actual.constructor?.name) {
            msg += ` Received an instance of ${actual.constructor.name}`;
        }
    }
    return msg;
}
const __TURBOPACK__default__export__ = (actual, ...types)=>{
    return message('Key must be ', actual, ...types);
};
function withAlg(alg, actual, ...types) {
    return message(`Key for the ${alg} algorithm must be `, actual, ...types);
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/is_disjoint.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const isDisjoint = (...headers)=>{
    const sources = headers.filter(Boolean);
    if (sources.length === 0 || sources.length === 1) {
        return true;
    }
    let acc;
    for (const header of sources){
        const parameters = Object.keys(header);
        if (!acc || acc.size === 0) {
            acc = new Set(parameters);
            continue;
        }
        for (const parameter of parameters){
            if (acc.has(parameter)) {
                return false;
            }
            acc.add(parameter);
        }
    }
    return true;
};
const __TURBOPACK__default__export__ = isDisjoint;
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/is_jwk.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isJWK",
    ()=>isJWK,
    "isPrivateJWK",
    ()=>isPrivateJWK,
    "isPublicJWK",
    ()=>isPublicJWK,
    "isSecretJWK",
    ()=>isSecretJWK
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_object$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/is_object.js [app-client] (ecmascript)");
;
function isJWK(key) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_object$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(key) && typeof key.kty === 'string';
}
function isPrivateJWK(key) {
    return key.kty !== 'oct' && typeof key.d === 'string';
}
function isPublicJWK(key) {
    return key.kty !== 'oct' && typeof key.d === 'undefined';
}
function isSecretJWK(key) {
    return isJWK(key) && key.kty === 'oct' && typeof key.k === 'string';
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/is_object.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>isObject
]);
function isObjectLike(value) {
    return typeof value === 'object' && value !== null;
}
function isObject(input) {
    if (!isObjectLike(input) || Object.prototype.toString.call(input) !== '[object Object]') {
        return false;
    }
    if (Object.getPrototypeOf(input) === null) {
        return true;
    }
    let proto = input;
    while(Object.getPrototypeOf(proto) !== null){
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(input) === proto;
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/secs.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const minute = 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const year = day * 365.25;
const REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
const __TURBOPACK__default__export__ = (str)=>{
    const matched = REGEX.exec(str);
    if (!matched || matched[4] && matched[1]) {
        throw new TypeError('Invalid time period format');
    }
    const value = parseFloat(matched[2]);
    const unit = matched[3].toLowerCase();
    let numericDate;
    switch(unit){
        case 'sec':
        case 'secs':
        case 'second':
        case 'seconds':
        case 's':
            numericDate = Math.round(value);
            break;
        case 'minute':
        case 'minutes':
        case 'min':
        case 'mins':
        case 'm':
            numericDate = Math.round(value * minute);
            break;
        case 'hour':
        case 'hours':
        case 'hr':
        case 'hrs':
        case 'h':
            numericDate = Math.round(value * hour);
            break;
        case 'day':
        case 'days':
        case 'd':
            numericDate = Math.round(value * day);
            break;
        case 'week':
        case 'weeks':
        case 'w':
            numericDate = Math.round(value * week);
            break;
        default:
            numericDate = Math.round(value * year);
            break;
    }
    if (matched[1] === '-' || matched[4] === 'ago') {
        return -numericDate;
    }
    return numericDate;
};
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/validate_crit.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/util/errors.js [app-client] (ecmascript)");
;
function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
    if (joseHeader.crit !== undefined && protectedHeader?.crit === undefined) {
        throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
    }
    if (!protectedHeader || protectedHeader.crit === undefined) {
        return new Set();
    }
    if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input)=>typeof input !== 'string' || input.length === 0)) {
        throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
    }
    let recognized;
    if (recognizedOption !== undefined) {
        recognized = new Map([
            ...Object.entries(recognizedOption),
            ...recognizedDefault.entries()
        ]);
    } else {
        recognized = recognizedDefault;
    }
    for (const parameter of protectedHeader.crit){
        if (!recognized.has(parameter)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOSENotSupported"](`Extension Header Parameter "${parameter}" is not recognized`);
        }
        if (joseHeader[parameter] === undefined) {
            throw new Err(`Extension Header Parameter "${parameter}" is missing`);
        }
        if (recognized.get(parameter) && protectedHeader[parameter] === undefined) {
            throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
        }
    }
    return new Set(protectedHeader.crit);
}
const __TURBOPACK__default__export__ = validateCrit;
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/asn1.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fromPKCS8",
    ()=>fromPKCS8,
    "fromSPKI",
    ()=>fromSPKI,
    "fromX509",
    ()=>fromX509,
    "toPKCS8",
    ()=>toPKCS8,
    "toSPKI",
    ()=>toSPKI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/webcrypto.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/invalid_key_input.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$base64url$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/base64url.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$format_pem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/format_pem.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/util/errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/is_key_like.js [app-client] (ecmascript)");
;
;
;
;
;
;
const genericExport = async (keyType, keyFormat, key)=>{
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCryptoKey"])(key)) {
        throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(key, ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["types"]));
    }
    if (!key.extractable) {
        throw new TypeError('CryptoKey is not extractable');
    }
    if (key.type !== keyType) {
        throw new TypeError(`key is not a ${keyType} key`);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$format_pem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$base64url$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeBase64"])(new Uint8Array(await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].subtle.exportKey(keyFormat, key))), `${keyType.toUpperCase()} KEY`);
};
const toSPKI = (key)=>{
    return genericExport('public', 'spki', key);
};
const toPKCS8 = (key)=>{
    return genericExport('private', 'pkcs8', key);
};
const findOid = (keyData, oid, from = 0)=>{
    if (from === 0) {
        oid.unshift(oid.length);
        oid.unshift(0x06);
    }
    const i = keyData.indexOf(oid[0], from);
    if (i === -1) return false;
    const sub = keyData.subarray(i, i + oid.length);
    if (sub.length !== oid.length) return false;
    return sub.every((value, index)=>value === oid[index]) || findOid(keyData, oid, i + 1);
};
const getNamedCurve = (keyData)=>{
    switch(true){
        case findOid(keyData, [
            0x2a,
            0x86,
            0x48,
            0xce,
            0x3d,
            0x03,
            0x01,
            0x07
        ]):
            return 'P-256';
        case findOid(keyData, [
            0x2b,
            0x81,
            0x04,
            0x00,
            0x22
        ]):
            return 'P-384';
        case findOid(keyData, [
            0x2b,
            0x81,
            0x04,
            0x00,
            0x23
        ]):
            return 'P-521';
        case findOid(keyData, [
            0x2b,
            0x65,
            0x6e
        ]):
            return 'X25519';
        case findOid(keyData, [
            0x2b,
            0x65,
            0x6f
        ]):
            return 'X448';
        case findOid(keyData, [
            0x2b,
            0x65,
            0x70
        ]):
            return 'Ed25519';
        case findOid(keyData, [
            0x2b,
            0x65,
            0x71
        ]):
            return 'Ed448';
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOSENotSupported"]('Invalid or unsupported EC Key Curve or OKP Key Sub Type');
    }
};
const genericImport = async (replace, keyFormat, pem, alg, options)=>{
    let algorithm;
    let keyUsages;
    const keyData = new Uint8Array(atob(pem.replace(replace, '')).split('').map((c)=>c.charCodeAt(0)));
    const isPublic = keyFormat === 'spki';
    switch(alg){
        case 'PS256':
        case 'PS384':
        case 'PS512':
            algorithm = {
                name: 'RSA-PSS',
                hash: `SHA-${alg.slice(-3)}`
            };
            keyUsages = isPublic ? [
                'verify'
            ] : [
                'sign'
            ];
            break;
        case 'RS256':
        case 'RS384':
        case 'RS512':
            algorithm = {
                name: 'RSASSA-PKCS1-v1_5',
                hash: `SHA-${alg.slice(-3)}`
            };
            keyUsages = isPublic ? [
                'verify'
            ] : [
                'sign'
            ];
            break;
        case 'RSA-OAEP':
        case 'RSA-OAEP-256':
        case 'RSA-OAEP-384':
        case 'RSA-OAEP-512':
            algorithm = {
                name: 'RSA-OAEP',
                hash: `SHA-${parseInt(alg.slice(-3), 10) || 1}`
            };
            keyUsages = isPublic ? [
                'encrypt',
                'wrapKey'
            ] : [
                'decrypt',
                'unwrapKey'
            ];
            break;
        case 'ES256':
            algorithm = {
                name: 'ECDSA',
                namedCurve: 'P-256'
            };
            keyUsages = isPublic ? [
                'verify'
            ] : [
                'sign'
            ];
            break;
        case 'ES384':
            algorithm = {
                name: 'ECDSA',
                namedCurve: 'P-384'
            };
            keyUsages = isPublic ? [
                'verify'
            ] : [
                'sign'
            ];
            break;
        case 'ES512':
            algorithm = {
                name: 'ECDSA',
                namedCurve: 'P-521'
            };
            keyUsages = isPublic ? [
                'verify'
            ] : [
                'sign'
            ];
            break;
        case 'ECDH-ES':
        case 'ECDH-ES+A128KW':
        case 'ECDH-ES+A192KW':
        case 'ECDH-ES+A256KW':
            {
                const namedCurve = getNamedCurve(keyData);
                algorithm = namedCurve.startsWith('P-') ? {
                    name: 'ECDH',
                    namedCurve
                } : {
                    name: namedCurve
                };
                keyUsages = isPublic ? [] : [
                    'deriveBits'
                ];
                break;
            }
        case 'Ed25519':
            algorithm = {
                name: 'Ed25519'
            };
            keyUsages = isPublic ? [
                'verify'
            ] : [
                'sign'
            ];
            break;
        case 'EdDSA':
            algorithm = {
                name: getNamedCurve(keyData)
            };
            keyUsages = isPublic ? [
                'verify'
            ] : [
                'sign'
            ];
            break;
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOSENotSupported"]('Invalid or unsupported "alg" (Algorithm) value');
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].subtle.importKey(keyFormat, keyData, algorithm, options?.extractable ?? false, keyUsages);
};
const fromPKCS8 = (pem, alg, options)=>{
    return genericImport(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, 'pkcs8', pem, alg, options);
};
const fromSPKI = (pem, alg, options)=>{
    return genericImport(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, 'spki', pem, alg, options);
};
function getElement(seq) {
    const result = [];
    let next = 0;
    while(next < seq.length){
        const nextPart = parseElement(seq.subarray(next));
        result.push(nextPart);
        next += nextPart.byteLength;
    }
    return result;
}
function parseElement(bytes) {
    let position = 0;
    let tag = bytes[0] & 0x1f;
    position++;
    if (tag === 0x1f) {
        tag = 0;
        while(bytes[position] >= 0x80){
            tag = tag * 128 + bytes[position] - 0x80;
            position++;
        }
        tag = tag * 128 + bytes[position] - 0x80;
        position++;
    }
    let length = 0;
    if (bytes[position] < 0x80) {
        length = bytes[position];
        position++;
    } else if (length === 0x80) {
        length = 0;
        while(bytes[position + length] !== 0 || bytes[position + length + 1] !== 0){
            if (length > bytes.byteLength) {
                throw new TypeError('invalid indefinite form length');
            }
            length++;
        }
        const byteLength = position + length + 2;
        return {
            byteLength,
            contents: bytes.subarray(position, position + length),
            raw: bytes.subarray(0, byteLength)
        };
    } else {
        const numberOfDigits = bytes[position] & 0x7f;
        position++;
        length = 0;
        for(let i = 0; i < numberOfDigits; i++){
            length = length * 256 + bytes[position];
            position++;
        }
    }
    const byteLength = position + length;
    return {
        byteLength,
        contents: bytes.subarray(position, byteLength),
        raw: bytes.subarray(0, byteLength)
    };
}
function spkiFromX509(buf) {
    const tbsCertificate = getElement(getElement(parseElement(buf).contents)[0].contents);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$base64url$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeBase64"])(tbsCertificate[tbsCertificate[0].raw[0] === 0xa0 ? 6 : 5].raw);
}
function getSPKI(x509) {
    const pem = x509.replace(/(?:-----(?:BEGIN|END) CERTIFICATE-----|\s)/g, '');
    const raw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$base64url$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeBase64"])(pem);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$format_pem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(spkiFromX509(raw), 'PUBLIC KEY');
}
const fromX509 = (pem, alg, options)=>{
    let spki;
    try {
        spki = getSPKI(pem);
    } catch (cause) {
        throw new TypeError('Failed to parse the X.509 certificate', {
            cause
        });
    }
    return fromSPKI(spki, alg, options);
};
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/base64url.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decode",
    ()=>decode,
    "decodeBase64",
    ()=>decodeBase64,
    "encode",
    ()=>encode,
    "encodeBase64",
    ()=>encodeBase64
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/buffer_utils.js [app-client] (ecmascript)");
;
const encodeBase64 = (input)=>{
    let unencoded = input;
    if (typeof unencoded === 'string') {
        unencoded = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encoder"].encode(unencoded);
    }
    const CHUNK_SIZE = 0x8000;
    const arr = [];
    for(let i = 0; i < unencoded.length; i += CHUNK_SIZE){
        arr.push(String.fromCharCode.apply(null, unencoded.subarray(i, i + CHUNK_SIZE)));
    }
    return btoa(arr.join(''));
};
const encode = (input)=>{
    return encodeBase64(input).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};
const decodeBase64 = (encoded)=>{
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for(let i = 0; i < binary.length; i++){
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
};
const decode = (input)=>{
    let encoded = input;
    if (encoded instanceof Uint8Array) {
        encoded = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decoder"].decode(encoded);
    }
    encoded = encoded.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
    try {
        return decodeBase64(encoded);
    } catch  {
        throw new TypeError('The input to be decoded is not correctly encoded.');
    }
};
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/check_key_length.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = (alg, key)=>{
    if (alg.startsWith('RS') || alg.startsWith('PS')) {
        const { modulusLength } = key.algorithm;
        if (typeof modulusLength !== 'number' || modulusLength < 2048) {
            throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
        }
    }
};
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/digest.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/webcrypto.js [app-client] (ecmascript)");
;
const digest = async (algorithm, data)=>{
    const subtleDigest = `SHA-${algorithm.slice(-3)}`;
    return new Uint8Array(await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].subtle.digest(subtleDigest, data));
};
const __TURBOPACK__default__export__ = digest;
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/get_sign_verify_key.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>getCryptoKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/webcrypto.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$crypto_key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/crypto_key.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/invalid_key_input.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/is_key_like.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$normalize_key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/normalize_key.js [app-client] (ecmascript)");
;
;
;
;
;
async function getCryptoKey(alg, key, usage) {
    if (usage === 'sign') {
        key = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$normalize_key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].normalizePrivateKey(key, alg);
    }
    if (usage === 'verify') {
        key = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$normalize_key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].normalizePublicKey(key, alg);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCryptoKey"])(key)) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$crypto_key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkSigCryptoKey"])(key, alg, usage);
        return key;
    }
    if (key instanceof Uint8Array) {
        if (!alg.startsWith('HS')) {
            throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(key, ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["types"]));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].subtle.importKey('raw', key, {
            hash: `SHA-${alg.slice(-3)}`,
            name: 'HMAC'
        }, false, [
            usage
        ]);
    }
    throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(key, ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["types"], 'Uint8Array', 'JSON Web Key'));
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/is_key_like.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "types",
    ()=>types
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/webcrypto.js [app-client] (ecmascript)");
;
const __TURBOPACK__default__export__ = (key)=>{
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCryptoKey"])(key)) {
        return true;
    }
    return key?.[Symbol.toStringTag] === 'KeyObject';
};
const types = [
    'CryptoKey'
];
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/jwk_to_key.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/webcrypto.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/util/errors.js [app-client] (ecmascript)");
;
;
function subtleMapping(jwk) {
    let algorithm;
    let keyUsages;
    switch(jwk.kty){
        case 'RSA':
            {
                switch(jwk.alg){
                    case 'PS256':
                    case 'PS384':
                    case 'PS512':
                        algorithm = {
                            name: 'RSA-PSS',
                            hash: `SHA-${jwk.alg.slice(-3)}`
                        };
                        keyUsages = jwk.d ? [
                            'sign'
                        ] : [
                            'verify'
                        ];
                        break;
                    case 'RS256':
                    case 'RS384':
                    case 'RS512':
                        algorithm = {
                            name: 'RSASSA-PKCS1-v1_5',
                            hash: `SHA-${jwk.alg.slice(-3)}`
                        };
                        keyUsages = jwk.d ? [
                            'sign'
                        ] : [
                            'verify'
                        ];
                        break;
                    case 'RSA-OAEP':
                    case 'RSA-OAEP-256':
                    case 'RSA-OAEP-384':
                    case 'RSA-OAEP-512':
                        algorithm = {
                            name: 'RSA-OAEP',
                            hash: `SHA-${parseInt(jwk.alg.slice(-3), 10) || 1}`
                        };
                        keyUsages = jwk.d ? [
                            'decrypt',
                            'unwrapKey'
                        ] : [
                            'encrypt',
                            'wrapKey'
                        ];
                        break;
                    default:
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOSENotSupported"]('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
                }
                break;
            }
        case 'EC':
            {
                switch(jwk.alg){
                    case 'ES256':
                        algorithm = {
                            name: 'ECDSA',
                            namedCurve: 'P-256'
                        };
                        keyUsages = jwk.d ? [
                            'sign'
                        ] : [
                            'verify'
                        ];
                        break;
                    case 'ES384':
                        algorithm = {
                            name: 'ECDSA',
                            namedCurve: 'P-384'
                        };
                        keyUsages = jwk.d ? [
                            'sign'
                        ] : [
                            'verify'
                        ];
                        break;
                    case 'ES512':
                        algorithm = {
                            name: 'ECDSA',
                            namedCurve: 'P-521'
                        };
                        keyUsages = jwk.d ? [
                            'sign'
                        ] : [
                            'verify'
                        ];
                        break;
                    case 'ECDH-ES':
                    case 'ECDH-ES+A128KW':
                    case 'ECDH-ES+A192KW':
                    case 'ECDH-ES+A256KW':
                        algorithm = {
                            name: 'ECDH',
                            namedCurve: jwk.crv
                        };
                        keyUsages = jwk.d ? [
                            'deriveBits'
                        ] : [];
                        break;
                    default:
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOSENotSupported"]('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
                }
                break;
            }
        case 'OKP':
            {
                switch(jwk.alg){
                    case 'Ed25519':
                        algorithm = {
                            name: 'Ed25519'
                        };
                        keyUsages = jwk.d ? [
                            'sign'
                        ] : [
                            'verify'
                        ];
                        break;
                    case 'EdDSA':
                        algorithm = {
                            name: jwk.crv
                        };
                        keyUsages = jwk.d ? [
                            'sign'
                        ] : [
                            'verify'
                        ];
                        break;
                    case 'ECDH-ES':
                    case 'ECDH-ES+A128KW':
                    case 'ECDH-ES+A192KW':
                    case 'ECDH-ES+A256KW':
                        algorithm = {
                            name: jwk.crv
                        };
                        keyUsages = jwk.d ? [
                            'deriveBits'
                        ] : [];
                        break;
                    default:
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOSENotSupported"]('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
                }
                break;
            }
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOSENotSupported"]('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
    }
    return {
        algorithm,
        keyUsages
    };
}
const parse = async (jwk)=>{
    if (!jwk.alg) {
        throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
    }
    const { algorithm, keyUsages } = subtleMapping(jwk);
    const rest = [
        algorithm,
        jwk.ext ?? false,
        jwk.key_ops ?? keyUsages
    ];
    const keyData = {
        ...jwk
    };
    delete keyData.alg;
    delete keyData.use;
    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].subtle.importKey('jwk', keyData, ...rest);
};
const __TURBOPACK__default__export__ = parse;
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/normalize_key.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/lib/is_jwk.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$base64url$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/base64url.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$jwk_to_key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/jwk_to_key.js [app-client] (ecmascript)");
;
;
;
const exportKeyValue = (k)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$base64url$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decode"])(k);
let privCache;
let pubCache;
const isKeyObject = (key)=>{
    return key?.[Symbol.toStringTag] === 'KeyObject';
};
const importAndCache = async (cache, key, jwk, alg, freeze = false)=>{
    let cached = cache.get(key);
    if (cached?.[alg]) {
        return cached[alg];
    }
    const cryptoKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$jwk_to_key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        ...jwk,
        alg
    });
    if (freeze) Object.freeze(key);
    if (!cached) {
        cache.set(key, {
            [alg]: cryptoKey
        });
    } else {
        cached[alg] = cryptoKey;
    }
    return cryptoKey;
};
const normalizePublicKey = (key, alg)=>{
    if (isKeyObject(key)) {
        let jwk = key.export({
            format: 'jwk'
        });
        delete jwk.d;
        delete jwk.dp;
        delete jwk.dq;
        delete jwk.p;
        delete jwk.q;
        delete jwk.qi;
        if (jwk.k) {
            return exportKeyValue(jwk.k);
        }
        pubCache || (pubCache = new WeakMap());
        return importAndCache(pubCache, key, jwk, alg);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isJWK"])(key)) {
        if (key.k) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$base64url$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decode"])(key.k);
        pubCache || (pubCache = new WeakMap());
        const cryptoKey = importAndCache(pubCache, key, key, alg, true);
        return cryptoKey;
    }
    return key;
};
const normalizePrivateKey = (key, alg)=>{
    if (isKeyObject(key)) {
        let jwk = key.export({
            format: 'jwk'
        });
        if (jwk.k) {
            return exportKeyValue(jwk.k);
        }
        privCache || (privCache = new WeakMap());
        return importAndCache(privCache, key, jwk, alg);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isJWK"])(key)) {
        if (key.k) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$base64url$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decode"])(key.k);
        privCache || (privCache = new WeakMap());
        const cryptoKey = importAndCache(privCache, key, key, alg, true);
        return cryptoKey;
    }
    return key;
};
const __TURBOPACK__default__export__ = {
    normalizePublicKey,
    normalizePrivateKey
};
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/sign.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$subtle_dsa$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/subtle_dsa.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/webcrypto.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$check_key_length$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/check_key_length.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$get_sign_verify_key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/get_sign_verify_key.js [app-client] (ecmascript)");
;
;
;
;
const sign = async (alg, key, data)=>{
    const cryptoKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$get_sign_verify_key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(alg, key, 'sign');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$check_key_length$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(alg, cryptoKey);
    const signature = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].subtle.sign((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$runtime$2f$subtle_dsa$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(alg, cryptoKey.algorithm), cryptoKey, data);
    return new Uint8Array(signature);
};
const __TURBOPACK__default__export__ = sign;
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/subtle_dsa.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>subtleDsa
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/util/errors.js [app-client] (ecmascript)");
;
function subtleDsa(alg, algorithm) {
    const hash = `SHA-${alg.slice(-3)}`;
    switch(alg){
        case 'HS256':
        case 'HS384':
        case 'HS512':
            return {
                hash,
                name: 'HMAC'
            };
        case 'PS256':
        case 'PS384':
        case 'PS512':
            return {
                hash,
                name: 'RSA-PSS',
                saltLength: alg.slice(-3) >> 3
            };
        case 'RS256':
        case 'RS384':
        case 'RS512':
            return {
                hash,
                name: 'RSASSA-PKCS1-v1_5'
            };
        case 'ES256':
        case 'ES384':
        case 'ES512':
            return {
                hash,
                name: 'ECDSA',
                namedCurve: algorithm.namedCurve
            };
        case 'Ed25519':
            return {
                name: 'Ed25519'
            };
        case 'EdDSA':
            return {
                name: algorithm.name
            };
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$segment$2f$analytics$2d$node$2f$node_modules$2f$jose$2f$dist$2f$browser$2f$util$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOSENotSupported"](`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
}
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/runtime/webcrypto.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "isCryptoKey",
    ()=>isCryptoKey
]);
const __TURBOPACK__default__export__ = crypto;
const isCryptoKey = (key)=>key instanceof CryptoKey;
}),
"[project]/frontend/node_modules/@segment/analytics-node/node_modules/jose/dist/browser/util/errors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JOSEAlgNotAllowed",
    ()=>JOSEAlgNotAllowed,
    "JOSEError",
    ()=>JOSEError,
    "JOSENotSupported",
    ()=>JOSENotSupported,
    "JWEDecryptionFailed",
    ()=>JWEDecryptionFailed,
    "JWEInvalid",
    ()=>JWEInvalid,
    "JWKInvalid",
    ()=>JWKInvalid,
    "JWKSInvalid",
    ()=>JWKSInvalid,
    "JWKSMultipleMatchingKeys",
    ()=>JWKSMultipleMatchingKeys,
    "JWKSNoMatchingKey",
    ()=>JWKSNoMatchingKey,
    "JWKSTimeout",
    ()=>JWKSTimeout,
    "JWSInvalid",
    ()=>JWSInvalid,
    "JWSSignatureVerificationFailed",
    ()=>JWSSignatureVerificationFailed,
    "JWTClaimValidationFailed",
    ()=>JWTClaimValidationFailed,
    "JWTExpired",
    ()=>JWTExpired,
    "JWTInvalid",
    ()=>JWTInvalid
]);
class JOSEError extends Error {
    constructor(message, options){
        super(message, options);
        this.code = 'ERR_JOSE_GENERIC';
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
JOSEError.code = 'ERR_JOSE_GENERIC';
class JWTClaimValidationFailed extends JOSEError {
    constructor(message, payload, claim = 'unspecified', reason = 'unspecified'){
        super(message, {
            cause: {
                claim,
                reason,
                payload
            }
        });
        this.code = 'ERR_JWT_CLAIM_VALIDATION_FAILED';
        this.claim = claim;
        this.reason = reason;
        this.payload = payload;
    }
}
JWTClaimValidationFailed.code = 'ERR_JWT_CLAIM_VALIDATION_FAILED';
class JWTExpired extends JOSEError {
    constructor(message, payload, claim = 'unspecified', reason = 'unspecified'){
        super(message, {
            cause: {
                claim,
                reason,
                payload
            }
        });
        this.code = 'ERR_JWT_EXPIRED';
        this.claim = claim;
        this.reason = reason;
        this.payload = payload;
    }
}
JWTExpired.code = 'ERR_JWT_EXPIRED';
class JOSEAlgNotAllowed extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = 'ERR_JOSE_ALG_NOT_ALLOWED';
    }
}
JOSEAlgNotAllowed.code = 'ERR_JOSE_ALG_NOT_ALLOWED';
class JOSENotSupported extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = 'ERR_JOSE_NOT_SUPPORTED';
    }
}
JOSENotSupported.code = 'ERR_JOSE_NOT_SUPPORTED';
class JWEDecryptionFailed extends JOSEError {
    constructor(message = 'decryption operation failed', options){
        super(message, options);
        this.code = 'ERR_JWE_DECRYPTION_FAILED';
    }
}
JWEDecryptionFailed.code = 'ERR_JWE_DECRYPTION_FAILED';
class JWEInvalid extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = 'ERR_JWE_INVALID';
    }
}
JWEInvalid.code = 'ERR_JWE_INVALID';
class JWSInvalid extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = 'ERR_JWS_INVALID';
    }
}
JWSInvalid.code = 'ERR_JWS_INVALID';
class JWTInvalid extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = 'ERR_JWT_INVALID';
    }
}
JWTInvalid.code = 'ERR_JWT_INVALID';
class JWKInvalid extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = 'ERR_JWK_INVALID';
    }
}
JWKInvalid.code = 'ERR_JWK_INVALID';
class JWKSInvalid extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = 'ERR_JWKS_INVALID';
    }
}
JWKSInvalid.code = 'ERR_JWKS_INVALID';
class JWKSNoMatchingKey extends JOSEError {
    constructor(message = 'no applicable key found in the JSON Web Key Set', options){
        super(message, options);
        this.code = 'ERR_JWKS_NO_MATCHING_KEY';
    }
}
JWKSNoMatchingKey.code = 'ERR_JWKS_NO_MATCHING_KEY';
class JWKSMultipleMatchingKeys extends JOSEError {
    constructor(message = 'multiple matching keys found in the JSON Web Key Set', options){
        super(message, options);
        this.code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';
    }
}
Symbol.asyncIterator;
JWKSMultipleMatchingKeys.code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';
class JWKSTimeout extends JOSEError {
    constructor(message = 'request timed out', options){
        super(message, options);
        this.code = 'ERR_JWKS_TIMEOUT';
    }
}
JWKSTimeout.code = 'ERR_JWKS_TIMEOUT';
class JWSSignatureVerificationFailed extends JOSEError {
    constructor(message = 'signature verification failed', options){
        super(message, options);
        this.code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
    }
}
JWSSignatureVerificationFailed.code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
}),
]);

//# sourceMappingURL=19xk_%40segment_0fs4iav._.js.map