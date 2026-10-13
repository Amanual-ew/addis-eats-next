// src/app/signin/page.js  (REPLACE)
"use client";

import { useState } from "react";
import Link from "next/link";

function fieldClass(hasError) {
  return `w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 ${
    hasError
      ? "border-red-400 focus:ring-red-100"
      : "border-gray-300 focus:border-[#ff6f61] focus:ring-orange-200"
  }`;
}

// Where to go after signing in:
//  1. the page that sent them here (?next=/kitchen), if it's a path on this site
//  2. otherwise staff -> /dashboard, customers -> /menu
async function getDestination(data) {
  const next = new URLSearchParams(window.location.search).get("next");
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;

  // Use the role from the sign-in response, or ask the server who is signed in.
  let role = data?.user?.role;
  if (!role) {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      role = (await res.json())?.user?.role;
    } catch {
      // fall through to the customer default
    }
  }

  return role === "staff" ? "/dashboard" : "/menu";
}

export default function SignInPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");
    setFieldErrors({});

    let res;
    try {
      res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: phone.trim(), password }),
      });
    } catch {
      setError("Could not connect to the server. Please try again.");
      setLoading(false);
      return;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.message || "Something went wrong.");
      setFieldErrors(data.fieldErrors || {});
      setLoading(false);
      return;
    }

    const destination = await getDestination(data);

    // Hard navigation so the session cookie is committed before the next request.
    window.location.assign(destination);
  }

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold tracking-widest text-[#ff6f61]">
          WELCOME BACK
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Sign in 🔐
        </h1>
      </div>

      <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-lg">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="0912345678"
              maxLength={10}
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              disabled={loading}
              aria-invalid={!!fieldErrors.phone}
              aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
              className={fieldClass(!!fieldErrors.phone)}
            />
            {fieldErrors.phone && (
              <small
                id="phone-error"
                className="mt-1 block text-sm text-red-500"
                role="alert"
              >
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
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              className={fieldClass(!!fieldErrors.password)}
            />
            {fieldErrors.password && (
              <small
                id="password-error"
                className="mt-1 block text-sm text-red-500"
                role="alert"
              >
                {fieldErrors.password}
              </small>
            )}
          </div>

          {error && !hasFieldErrors && (
            <p
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
              role="alert"
            >
              ❌ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full rounded-full bg-gradient-to-r from-[#ff6f61] to-orange-400 py-3 font-semibold text-white shadow-md shadow-orange-200 transition hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Please wait..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          New to Addis Eats?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#ff6f61] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}