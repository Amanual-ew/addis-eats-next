"use client";

import { usePathname } from "next/navigation";
import { UtensilsCrossed } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Staff pages have their own sidebar layout, same rule as the Header
  const onStaffPage = ["/staff", "/kitchen", "/dashboard"].some((p) =>
    pathname?.startsWith(p)
  );
  if (onStaffPage) return null;

  return (
    <footer className="mt-16 border-t border-orange-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-center text-sm text-gray-500 sm:flex-row sm:px-6 sm:text-left">
        <p className="flex items-center gap-2 font-bold text-gray-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff6f61] to-orange-400 text-white">
            <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>
            Addis<span className="text-[#ff6f61]">Eats</span>
          </span>
        </p>
        <p>Fresh Ethiopian food, delivered with love.</p>
        <p>© {new Date().getFullYear()} Addis Eats</p>
      </div>
    </footer>
  );
}