(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/swr/dist/config-context-ext53wcz.mjs [app-client] (ecmascript) <export k as mutate>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mutate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["k"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/config-context-ext53wcz.mjs [app-client] (ecmascript)");
}),
"[project]/src/components/AuthForm.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__k__as__mutate$3e$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/config-context-ext53wcz.mjs [app-client] (ecmascript) <export k as mutate>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safe$2d$next$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/safe-next.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function fieldClass(hasError) {
    return `w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:ring-2 ${hasError ? "border-red-400 focus:ring-red-100" : "border-gray-300 focus:border-[#ff6f61] focus:ring-orange-200"}`;
}
function AuthForm({ mode }) {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const isSignup = mode === "signup";
    // safeNext() drops absolute URLs, protocol-relative URLs, backslash tricks.
    const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$safe$2d$next$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["safeNext"])(searchParams.get("next") ?? "/");
    // Build the "switch to the other form" href using the sanitized `next`.
    const otherParams = new URLSearchParams();
    if (next !== "/") otherParams.set("next", next);
    const otherHref = `${isSignup ? "/signin" : "/signup"}${otherParams.toString() ? `?${otherParams}` : ""}`;
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [fieldErrors, setFieldErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [serverError, setServerError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function handleSubmit(e) {
        e.preventDefault();
        if (isSubmitting) return;
        setServerError("");
        setFieldErrors({});
        setIsSubmitting(true);
        try {
            const response = await fetch(isSignup ? "/api/auth/signup" : "/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(isSignup ? {
                    name,
                    phone,
                    password
                } : {
                    phone,
                    password
                })
            });
            const data = await response.json().catch(()=>({}));
            if (!response.ok) {
                setFieldErrors(data.fieldErrors || {});
                setServerError(data.message || "Something went wrong.");
                setIsSubmitting(false);
                return;
            }
            // Refresh the navbar cache so it doesn't flash "Sign in" on the
            // destination page. Fire-and-forget — the hard navigation below
            // will re-render everything anyway.
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__k__as__mutate$3e$__["mutate"])("/api/auth/me");
            // 🔑 THE FIX: hard navigation instead of router.push + router.refresh.
            //
            // Why: `Set-Cookie` from the sign-in response is committed by the
            // browser asynchronously. `router.push` fires a request *immediately*
            // and can race ahead of the cookie, so the middleware sees no session
            // and bounces the user back to /signin?next=... .
            //
            // `window.location.assign` waits for the cookie to be committed before
            // issuing the request. That's why the second click currently "works".
            window.location.assign(next);
        // Note: no `setIsSubmitting(false)` here — the page is unloading.
        } catch  {
            setServerError("Could not connect to the server. Please try again.");
            setIsSubmitting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "mx-auto max-w-md px-6 py-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-2 text-sm font-semibold tracking-widest text-[#ff6f61]",
                        children: isSignup ? "JOIN ADDIS EATS" : "WELCOME BACK"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AuthForm.js",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-extrabold tracking-tight text-gray-900",
                        children: isSignup ? "Create account ✨" : "Sign in 🔐"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AuthForm.js",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AuthForm.js",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-3xl border border-orange-100 bg-white p-8 shadow-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        noValidate: true,
                        className: "space-y-5",
                        children: [
                            isSignup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "name",
                                        className: "mb-1 block text-sm font-semibold text-gray-700",
                                        children: "Full Name"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AuthForm.js",
                                        lineNumber: 108,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "name",
                                        type: "text",
                                        autoComplete: "name",
                                        placeholder: "Enter your full name",
                                        value: name,
                                        onChange: (e)=>setName(e.target.value),
                                        className: fieldClass(!!fieldErrors.name)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AuthForm.js",
                                        lineNumber: 114,
                                        columnNumber: 15
                                    }, this),
                                    fieldErrors.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        className: "mt-1 block text-sm text-red-500",
                                        role: "alert",
                                        children: fieldErrors.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AuthForm.js",
                                        lineNumber: 124,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AuthForm.js",
                                lineNumber: 107,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "phone",
                                        className: "mb-1 block text-sm font-semibold text-gray-700",
                                        children: "Phone Number"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AuthForm.js",
                                        lineNumber: 132,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "phone",
                                        type: "tel",
                                        inputMode: "numeric",
                                        autoComplete: "tel",
                                        placeholder: "0912345678",
                                        maxLength: 10,
                                        value: phone,
                                        onChange: (e)=>setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)),
                                        className: fieldClass(!!fieldErrors.phone)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AuthForm.js",
                                        lineNumber: 138,
                                        columnNumber: 13
                                    }, this),
                                    fieldErrors.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        className: "mt-1 block text-sm text-red-500",
                                        role: "alert",
                                        children: fieldErrors.phone
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AuthForm.js",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AuthForm.js",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "password",
                                        className: "mb-1 block text-sm font-semibold text-gray-700",
                                        children: "Password"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AuthForm.js",
                                        lineNumber: 159,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "password",
                                        type: "password",
                                        autoComplete: isSignup ? "new-password" : "current-password",
                                        placeholder: "••••••••",
                                        value: password,
                                        onChange: (e)=>setPassword(e.target.value),
                                        className: fieldClass(!!fieldErrors.password)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AuthForm.js",
                                        lineNumber: 165,
                                        columnNumber: 13
                                    }, this),
                                    fieldErrors.password && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        className: "mt-1 block text-sm text-red-500",
                                        role: "alert",
                                        children: fieldErrors.password
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AuthForm.js",
                                        lineNumber: 175,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AuthForm.js",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this),
                            serverError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600",
                                role: "alert",
                                children: [
                                    "❌ ",
                                    serverError
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AuthForm.js",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: isSubmitting,
                                "aria-busy": isSubmitting,
                                className: "w-full rounded-full bg-gradient-to-r from-[#ff6f61] to-orange-400 py-3 font-semibold text-white shadow-md shadow-orange-200 transition hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100",
                                children: isSubmitting ? "Please wait..." : isSignup ? "Create account" : "Sign in"
                            }, void 0, false, {
                                fileName: "[project]/src/components/AuthForm.js",
                                lineNumber: 190,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AuthForm.js",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-6 text-center text-sm text-gray-500",
                        children: [
                            isSignup ? "Already have an account?" : "New to Addis Eats?",
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: otherHref,
                                className: "font-semibold text-[#ff6f61] hover:underline",
                                children: isSignup ? "Sign in" : "Create an account"
                            }, void 0, false, {
                                fileName: "[project]/src/components/AuthForm.js",
                                lineNumber: 206,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AuthForm.js",
                        lineNumber: 204,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AuthForm.js",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            !isSignup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 text-center text-xs text-gray-400",
                children: "Demo accounts: customer 0912345678 / customer123 · staff 0911000000 / staff123"
            }, void 0, false, {
                fileName: "[project]/src/components/AuthForm.js",
                lineNumber: 216,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/AuthForm.js",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
_s(AuthForm, "DOzMWqrPMYYfIIwRCT1c9HLkXD4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = AuthForm;
var _c;
__turbopack_context__.k.register(_c, "AuthForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/safe-next.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "safeNext",
    ()=>safeNext
]);
// Only allows same-origin relative paths.
// Blocks:
//   - absolute URLs:         https://evil.com
//   - protocol-relative:     //evil.com
//   - backslash tricks:      /\evil.com
//   - double-encoded paths:  %252Fevil.com  (decoded once, then re-checked)
const FALLBACK = "/";
function safeNext(raw, fallback = FALLBACK) {
    if (typeof raw !== "string" || !raw) return fallback;
    let next = raw;
    // Some callers may double-encode. Decode up to 2 passes.
    for(let i = 0; i < 2 && next.includes("%"); i++){
        try {
            const decoded = decodeURIComponent(next);
            if (decoded === next) break;
            next = decoded;
        } catch  {
            break;
        }
    }
    if (!next.startsWith("/")) return fallback;
    if (next.startsWith("//")) return fallback;
    if (next.startsWith("/\\")) return fallback;
    return next;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1v8o1cf._.js.map