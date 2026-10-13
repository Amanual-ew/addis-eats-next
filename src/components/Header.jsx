"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import {  useCart } from "./CartProvider";
const fetcher = async (url) => {
  const response = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  
  if (response.status === 401) {
    return { user: null };
  }

  if (!response.ok) {
    throw new Error(`Failed to load user: ${response.status}`);
  }

  return response.json();
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate } = useSWRConfig();
  const {
    cart
  } = useCart();
  const count = cart.map((item) => item.quantity).reduce((sum, q) => sum + q, 0);
  // Only fetch + render auth UI after mount so SSR and first paint match
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [menuOpen, setMenuOpen] = useState(false);
  const desktopMenuRef = useRef(null);

  const { data, isLoading, error } = useSWR(
    mounted ? "/api/auth/me" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );
  
  const user = error ? null : data?.user;
  const isStaff = user?.role === "staff";

  // Close mobile menu + desktop dropdown whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
    if (desktopMenuRef.current) desktopMenuRef.current.open = false;
  }, [pathname]);

  // Close menus on Escape; close desktop dropdown on outside click
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        if (desktopMenuRef.current) desktopMenuRef.current.open = false;
      }
    };
    const onClick = (e) => {
      const el = desktopMenuRef.current;
      if (el && el.open && !el.contains(e.target)) el.open = false;
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  // Close mobile menu if the viewport grows to desktop size
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => e.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  async function handleSignOut() {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Sign out request failed:", err);
    }

    await mutate("/api/auth/me", { user: null }, false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const navLink = (href) =>
    `px-4 py-2 transition-colors duration-200 ${
      pathname === href
        ? "text-[#ff6f61]"
        : "text-gray-600 hover:text-[#ff6f61]"
    }`;

  const mobileLink = (href) =>
    `block rounded-lg px-4 py-3 text-base font-semibold transition-colors ${
      pathname === href
        ? "bg-orange-50 text-[#ff6f61]"
        : "text-gray-700 hover:bg-orange-50 hover:text-[#ff6f61]"
    }`;

  const dropdownItem =
    "block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#ff6f61]";

  // Role-based account links, shared by desktop dropdown + mobile panel
  const accountLinks = [
    !isStaff && { href: "/orders", label: "📦 My Orders" },
    isStaff && { href: "/dashboard", label: "📊 Dashboard" },
    isStaff && { href: "/kitchen", label: "👨‍🍳 Kitchen" },
  ].filter(Boolean);

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff6f61] to-orange-400 text-lg shadow-md sm:h-10 sm:w-10 sm:text-xl">
            🍴
          </span>
          <span className="text-lg font-extrabold tracking-tight text-gray-900 sm:text-xl">
            Addis<span className="text-[#ff6f61]">Eats</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0.5 text-sm font-semibold md:flex">
          <Link href="/" className={navLink("/")}>
            Home
          </Link>
          <Link href="/menu" className={navLink("/menu")}>
            Menu
          </Link>

          <Link
          href="/cart"
          aria-label={`Cart, ${count} items`}
          className="group relative ml-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff6f61] to-orange-400 px-5 py-2 font-semibold text-white shadow-md shadow-orange-200 ring-1 ring-white/20 transition duration-200 hover:scale-105 hover:shadow-lg hover:shadow-orange-300 active:scale-95"
        >
          <span className="text-base leading-none transition-transform group-hover:-rotate-12">
            🛒
          </span>
          <span>Cart</span>

          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-bold tabular-nums text-[#ff6f61] shadow ring-2 ring-[#ff6f61]">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Link>

          {!mounted ? (
            <div className="ml-3 h-10 w-24" />
          ) : isLoading ? (
            <div className="ml-3 h-10 w-24 animate-pulse rounded-lg bg-gray-100" />
          ) : user ? (
            <details ref={desktopMenuRef} className="group relative ml-3">
              <summary className="flex cursor-pointer list-none items-center gap-2 px-2 py-2 text-gray-700 transition hover:text-[#ff6f61]">
                <span className="text-lg">👤</span>
                <span className="max-w-24 truncate">{user.name}</span>
                <span className="text-xs text-gray-400 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>

              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white p-2 shadow-xl ring-1 ring-gray-100">
                <div className="px-3 py-3">
                  <p className="truncate font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs capitalize text-[#ff6f61]">
                    {user.role} account
                  </p>
                </div>

                {accountLinks.map((l) => (
                  <Link key={l.href} href={l.href} className={dropdownItem}>
                    {l.label}
                  </Link>
                ))}

                <div className="my-1 border-t border-gray-100" />

                <button
                  onClick={handleSignOut}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                >
                  🚪 Sign out
                </button>
              </div>
            </details>
          ) : (
            <div className="ml-2 flex items-center gap-1">
              <Link
                href="/signin"
                className="px-4 py-2 text-gray-600 transition hover:text-[#ff6f61]"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 font-semibold text-[#ff6f61] transition hover:text-orange-500"
              >
                Create account
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/cart"
            aria-label={`Cart, ${count} items`}
            className="group relative ml-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff6f61] to-orange-400 px-5 py-2 font-semibold text-white shadow-md shadow-orange-200 ring-1 ring-white/20 transition duration-200 hover:scale-105 hover:shadow-lg hover:shadow-orange-300 active:scale-95"
           >
            <span className="text-base leading-none transition-transform group-hover:-rotate-12">
              🛒
            </span>
            <span>Cart</span>

            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-bold tabular-nums text-[#ff6f61] shadow ring-2 ring-[#ff6f61]">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>


          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-orange-50 hover:text-[#ff6f61]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-6 w-6"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`md:hidden ${menuOpen ? "block" : "hidden"} max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-orange-100 bg-white px-4 pb-4 pt-2 shadow-lg`}
      >
        <Link href="/" className={mobileLink("/")}>
          Home
        </Link>
        <Link href="/menu" className={mobileLink("/menu")}>
          Menu
        </Link>

        <div className="my-2 border-t border-gray-100" />

        {!mounted ? null : isLoading ? (
          <div className="h-12 animate-pulse rounded-lg bg-gray-100" />
        ) : user ? (
          <>
            <div className="px-4 py-2">
              <p className="truncate font-bold text-gray-900">👤 {user.name}</p>
              <p className="text-xs capitalize text-[#ff6f61]">
                {user.role} account
              </p>
            </div>

            {accountLinks.map((l) => (
              <Link key={l.href} href={l.href} className={mobileLink(l.href)}>
                {l.label}
              </Link>
            ))}

            <button
              onClick={handleSignOut}
              className="mt-1 w-full rounded-lg px-4 py-3 text-left text-base font-semibold text-red-500 hover:bg-red-50"
            >
              🚪 Sign out
            </button>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/signin"
              className="rounded-lg border border-gray-200 px-4 py-3 text-center text-base font-semibold text-gray-700 hover:border-[#ff6f61] hover:text-[#ff6f61]"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[#ff6f61] px-4 py-3 text-center text-base font-semibold text-white hover:bg-orange-500"
            >
              Create account
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
