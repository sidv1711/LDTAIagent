(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/lib/utils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "cn": (()=>cn)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/qa-assistant.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>QAAssistant)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
const questions = [
    "What are my LDT analytical validation requirements?",
    "What quality system documentation is needed?",
    "Who is Elizabeth Holmes and why is LDT compliance important?",
    "What are Laboratory Developed Tests (LDTs)?",
    "How do I demonstrate clinical validity?",
    "What is the FDA and what do they regulate?",
    "What happened with Theranos and LDT oversight?",
    "What's the difference between FDA and CLIA regulations?"
];
function QAAssistant({ onQuestionClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-card text-foreground rounded-lg p-6 space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center space-x-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-2 bg-background rounded-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                className: "h-5 w-5 text-primary"
                            }, void 0, false, {
                                fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/qa-assistant.tsx",
                                lineNumber: 28,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/qa-assistant.tsx",
                            lineNumber: 27,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-semibold text-foreground",
                            children: "Regulatory Q&A Assistant"
                        }, void 0, false, {
                            fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/qa-assistant.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/qa-assistant.tsx",
                    lineNumber: 26,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/qa-assistant.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: questions.map((question, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onQuestionClick?.(question),
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full p-4 rounded-lg text-left transition-all duration-200", "bg-background hover:bg-background/80 group", "border border-border hover:border-primary/20"),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-medium leading-relaxed text-foreground pr-3",
                                    children: question
                                }, void 0, false, {
                                    fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/qa-assistant.tsx",
                                    lineNumber: 48,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 flex-shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/qa-assistant.tsx",
                                    lineNumber: 51,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/qa-assistant.tsx",
                            lineNumber: 47,
                            columnNumber: 13
                        }, this)
                    }, index, false, {
                        fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/qa-assistant.tsx",
                        lineNumber: 38,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/qa-assistant.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full py-3 px-4 rounded-lg", "bg-primary text-primary-foreground font-medium", "hover:bg-primary/90 transition-colors duration-200"),
                children: "Ask Question"
            }, void 0, false, {
                fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/qa-assistant.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/qa-assistant.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_c = QAAssistant;
var _c;
__turbopack_context__.k.register(_c, "QAAssistant");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/qa-assistant.tsx [app-client] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/qa-assistant.tsx [app-client] (ecmascript)"));
}}),
}]);

//# sourceMappingURL=LDTAIagent-3_BitPatrol-Website-Enhancement_-codebase_src_fab6a45a._.js.map