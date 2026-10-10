"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { mutate } from "swr";
import { safeNext } from "@/lib/safe-next";

function fieldClass(hasError) {
  return `w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-400 focus:ring-red-100"
      : "border-gray-300 focus:border-[#ff6f61] focus:ring-orange-200"
  }`;
}

export default function AuthForm({ mode }) {
  const searchParams = useSearchParams();

  const isSignup = mode === "signup";

  // safeNext() drops absolute URLs, protocol-relative URLs, backslash tricks.
  const next = safeNext(searchParams.get("next") ?? "/");

  // Build the "switch to the other form" href using the sanitized `next`.
  const otherParams = new URLSearchParams();
  if (next !== "/") otherParams.set("next", next);
  const otherHref = `${isSignup ? "/signin" : "/signup"}${
    otherParams.toString() ? `?${otherParams}` : ""
  }`;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;

    setServerError("");
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch(
        isSignup ? "/api/auth/signup" : "/api/auth/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(
            isSignup ? { name, phone, password } : { phone, password }
          ),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFieldErrors(data.fieldErrors || {});
        setServerError(data.message || "Something went wrong.");
        setIsSubmitting(false);
        return;
      }

      // Refresh the navbar cache so it doesn't flash "Sign in" on the
      // destination page. Fire-and-forget — the hard navigation below
      // will re-render everything anyway.
      mutate("/api/auth/me");

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
    } catch {
      setServerError("Could not connect to the server. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold tracking-widest text-[#ff6f61]">
          {isSignup ? "JOIN ADDIS EATS" : "WELCOME BACK"}
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          {isSignup ? "Create account ✨" : "Sign in 🔐"}
        </h1>
      </div>

      <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-lg">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {isSignup && (
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldClass(!!fieldErrors.name)}
              />
              {fieldErrors.name && (
                <small className="mt-1 block text-sm text-red-500" role="alert">
                  {fieldErrors.name}
                </small>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="0912345678"
              maxLength={10}
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              className={fieldClass(!!fieldErrors.phone)}
            />
            {fieldErrors.phone && (
              <small className="mt-1 block text-sm text-red-500" role="alert">
                {fieldErrors.phone}
              </small>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass(!!fieldErrors.password)}
            />
            {fieldErrors.password && (
              <small className="mt-1 block text-sm text-red-500" role="alert">
                {fieldErrors.password}
              </small>
            )}
          </div>

          {serverError && (
            <p
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
              role="alert"
            >
              ❌ {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="w-full rounded-full bg-gradient-to-r from-[#ff6f61] to-orange-400 py-3 font-semibold text-white shadow-md shadow-orange-200 transition hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting
              ? "Please wait..."
              : isSignup
              ? "Create account"
              : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {isSignup ? "Already have an account?" : "New to Addis Eats?"}{" "}
          <Link
            href={otherHref}
            className="font-semibold text-[#ff6f61] hover:underline"
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>

      {!isSignup && (
        <p className="mt-4 text-center text-xs text-gray-400">
          Demo accounts: customer 0912345678 / customer123 · staff 0911000000 /
          staff123
        </p>
      )}
    </main>
  );
}