module.exports = {

"[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>AppFooter)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$life$2d$buoy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LifeBuoy$3e$__ = __turbopack_context__.i("[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/node_modules/lucide-react/dist/esm/icons/life-buoy.js [app-ssr] (ecmascript) <export default as LifeBuoy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
"use client";
;
;
;
function AppFooter() {
    const handleContactUs = ()=>{
        const founders = [
            "sidv@berkeley.edu",
            "akshajmolukutla@berkeley.edu",
            "nygmetainur@gmail.com"
        ];
        const subject = "LDT Compliance Platform - Inquiry";
        const message = `Dear Sid and Akshaj,

I'm interested in learning more about your LDT Compliance Platform.

Could you please provide more information about:
- Pricing and plans
- Integration options  
- Custom features
- Demo availability
- Technical support

Thank you!

Best regards,
[Your Name]
[Your Organization]`;
        // Create mailto link with both founders
        const mailtoLink = `mailto:${founders.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        // Open default email client
        window.open(mailtoLink, '_blank');
    };
    const footerSections = [
        {
            title: "Product",
            links: [
                {
                    label: "Compliance Analysis",
                    href: "/"
                },
                {
                    label: "Q&A Assistant",
                    href: "/"
                }
            ]
        },
        {
            title: "Resources",
            links: [
                {
                    label: "FDA Guidance",
                    href: "https://www.fda.gov/medical-devices/in-vitro-diagnostics/laboratory-developed-tests",
                    target: "_blank"
                }
            ]
        },
        {
            title: "Support",
            links: [
                {
                    label: "Help Center",
                    href: "/help-center"
                },
                {
                    label: "Contact Us",
                    onClick: handleContactUs
                },
                {
                    label: "API Status",
                    href: "/api-status"
                }
            ]
        },
        {
            title: "Legal",
            links: [
                {
                    label: "Privacy Policy",
                    href: "/privacy-policy"
                },
                {
                    label: "Terms of Service",
                    href: "/terms-of-service"
                },
                {
                    label: "Security",
                    href: "/security"
                }
            ]
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "bg-[#f8fafc] dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 py-12 sm:px-6 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-8 md:grid-cols-4",
                    children: footerSections.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100",
                                    children: section.title
                                }, void 0, false, {
                                    fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                                    lineNumber: 89,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-3",
                                    children: section.links.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: link.onClick ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: link.onClick,
                                                className: "text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors duration-200 cursor-pointer",
                                                children: link.label
                                            }, void 0, false, {
                                                fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                                                lineNumber: 96,
                                                columnNumber: 23
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: link.href || "#",
                                                target: link.target,
                                                className: "text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors duration-200",
                                                children: link.label
                                            }, void 0, false, {
                                                fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                                                lineNumber: 103,
                                                columnNumber: 23
                                            }, this)
                                        }, link.label, false, {
                                            fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                                            lineNumber: 94,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                                    lineNumber: 92,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, section.title, true, {
                            fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                            lineNumber: 88,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-12 border-t border-slate-200 dark:border-slate-800 pt-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                            className: "h-5 w-5 text-slate-400 dark:text-slate-500"
                                        }, void 0, false, {
                                            fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                                            lineNumber: 121,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-slate-600 dark:text-slate-400",
                                            children: "Enterprise-Grade Security"
                                        }, void 0, false, {
                                            fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                                            lineNumber: 122,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                                    lineNumber: 120,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$life$2d$buoy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LifeBuoy$3e$__["LifeBuoy"], {
                                            className: "h-4 w-4 text-slate-400 dark:text-slate-500"
                                        }, void 0, false, {
                                            fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                                            lineNumber: 127,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-slate-600 dark:text-slate-400",
                                            children: "24/7 Technical Support"
                                        }, void 0, false, {
                                            fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                                            lineNumber: 128,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                                    lineNumber: 126,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                            className: "h-4 w-4 text-slate-400 dark:text-slate-500"
                                        }, void 0, false, {
                                            fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                                            lineNumber: 133,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-slate-600 dark:text-slate-400",
                                            children: "SOC 2 Compliant"
                                        }, void 0, false, {
                                            fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                                            lineNumber: 134,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                                    lineNumber: 132,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                            lineNumber: 119,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-8 text-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$LDTAIagent$2d$3$2f$BitPatrol$2d$Website$2d$Enhancement_$2d$codebase$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-500 dark:text-slate-400",
                                children: [
                                    "© ",
                                    new Date().getFullYear(),
                                    " Compliance Platform. All rights reserved."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                            lineNumber: 140,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
                    lineNumber: 118,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
            lineNumber: 85,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
}}),
"[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx [app-ssr] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/LDTAIagent-3/BitPatrol-Website-Enhancement_-codebase/src/components/compliance/app-footer.tsx [app-ssr] (ecmascript)"));
}}),

};

//# sourceMappingURL=2409e_-Website-Enhancement_-codebase_src_components_compliance_app-footer_tsx_d1ad8e82._.js.map