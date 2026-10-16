"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import ThemeToggle from "@/components/ThemeToggle";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/kitchen", label: "Kitchen board" },
  { href: "/staff/menu", label: "Manage menu" },
];

const item = "whitespace-nowrap rounded-md px-3 py-2 text-left text-sm font-medium";

export default function StaffNav({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const isActive = (href) => pathname.startsWith(href);

  // The public header is hidden on staff pages, so sign out lives here.
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
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 z-10 border-b border-gray-200 bg-white md:h-screen md:w-60 md:shrink-0 md:self-start md:overflow-y-auto md:border-b-0 md:border-r">
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="text-lg font-bold text-gray-900">Addis Eats</p>
          <p className="truncate text-xs text-gray-500">
            {user.name} · {user.role}
          </p>
        </div>
        <ThemeToggle className="shrink-0" />
      </div>

      <nav
        aria-label="Staff"
        className="flex items-center gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:items-stretch md:pb-4"
      >
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={isActive(l.href) ? "page" : undefined}
            className={`${item} ${
              isActive(l.href)
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {l.label}
          </Link>
        ))}

        {/* Divider: vertical in the mobile bar, horizontal in the sidebar */}
        <span
          aria-hidden="true"
          className="mx-1 h-5 w-px shrink-0 bg-gray-200 md:mx-0 md:my-2 md:h-px md:w-full"
        />

        <Link href="/" className={`${item} text-gray-700 hover:bg-gray-100`}>
          🏠 View site
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className={`${item} text-red-500 hover:bg-red-50`}
        >
          🚪 Sign out
        </button>
      </nav>
    </aside>
  );
}