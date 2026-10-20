"use client";

import { Moon, Sun } from "lucide-react";

// Sun/moon button. The icon is picked by CSS (the dark: prefix), so it is
// correct from the first paint and needs no state or hydration tricks.
export default function ThemeToggle({ className = "" }) {
  function toggle() {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // Storage can be blocked (private mode); the theme still switches.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-100 bg-white text-gray-700 transition hover:bg-orange-50 hover:text-[#ff6f61] active:scale-95 ${className}`}
    >
      <Moon className="h-5 w-5 dark:hidden" aria-hidden="true" />
      <Sun className="hidden h-5 w-5 dark:block" aria-hidden="true" />
    </button>
  );
}