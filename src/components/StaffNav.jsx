"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/kitchen", label: "Kitchen board" },
  { href: "/staff/menu", label: "Manage menu" },
];

export default function StaffNav({ user }) {
  const pathname = usePathname();

  const isActive = (href) =>
    pathname.startsWith(href);

  return (
    <aside className="sticky top-0 z-10 border-b border-gray-200 bg-white md:h-screen md:w-60 md:shrink-0 md:self-start md:overflow-y-auto md:border-b-0 md:border-r">
      <div className="p-4">
        <p className="text-lg font-bold text-gray-900">Addis Eats</p>
        <p className="text-xs text-gray-500">
          {user.name} · {user.role}
        </p>
      </div>
      <nav aria-label="Staff" className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:pb-0">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={isActive(l.href) ? "page" : undefined}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
              isActive(l.href)
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}