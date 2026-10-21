"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import {
  ChefHat,
  Globe,
  LayoutDashboard,
  Loader2,
  LogOut,
  Utensils,
  UtensilsCrossed,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/kitchen", label: "Kitchen board", Icon: ChefHat },
  { href: "/staff/menu", label: "Manage menu", Icon: Utensils },
];

const item =
  "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6f61]";

export default function StaffNav({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [signingOut, setSigningOut] = useState(false);

  const navRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const isActive = (href) => pathname?.startsWith(href);

  // Fade hint on the mobile strip, only while there is more to scroll to
  const updateFade = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateFade();
    window.addEventListener("resize", updateFade);
    return () => window.removeEventListener("resize", updateFade);
  }, [updateFade]);

  // Keep the current page's link visible in the mobile strip
  useEffect(() => {
    navRef.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [pathname]);

  // The public header is hidden on staff pages, so sign out lives here.
  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Sign out request failed:", err);
    }

    await mutate("/api/auth/me", { user: null }, false);
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 z-10 border-b border-gray-200 bg-white md:h-screen md:w-60 md:shrink-0 md:self-start md:overflow-y-auto md:border-b-0 md:border-r">
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff6f61] to-orange-400 text-white shadow-sm">
            <UtensilsCrossed className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-lg font-bold leading-tight text-gray-900">
              Addis Eats
            </p>
            <p className="truncate text-xs capitalize text-gray-500">
              {user.name} · {user.role}
            </p>
          </div>
        </div>
        <ThemeToggle className="shrink-0" />
      </div>

      <div className="relative">
        <nav
          ref={navRef}
          onScroll={updateFade}
          aria-label="Staff"
          className="flex items-center gap-1 overflow-x-auto px-2 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-col md:items-stretch md:overflow-visible md:pb-4"
        >
          {LINKS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`${item} ${
                isActive(href)
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          ))}

          {/* Divider: vertical in the mobile bar, horizontal in the sidebar */}
          <span
            aria-hidden="true"
            className="mx-1 h-5 w-px shrink-0 bg-gray-200 md:mx-0 md:my-2 md:h-px md:w-full"
          />

          <Link href="/" className={`${item} text-gray-700 hover:bg-gray-100`}>
            <Globe className="h-4 w-4" aria-hidden="true" />
            View site
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className={`${item} text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {signingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <LogOut className="h-4 w-4" aria-hidden="true" />
            )}
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </nav>

        {/* Fade hint on the right edge (mobile only) */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent transition-opacity dark:from-[#12100e] md:hidden ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </aside>
  );
}