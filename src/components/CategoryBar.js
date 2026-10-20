"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const categories = ["All", "Drinks", "Ethiopian", "Burger", "Pizza"];

export default function CategoryBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollerRef = useRef(null);
  const activeRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const activeCategory = searchParams.get("category") || "All";

  // Show the right-edge fade only while there is more to scroll to
  const updateFade = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateFade();
    window.addEventListener("resize", updateFade);
    return () => window.removeEventListener("resize", updateFade);
  }, [updateFade]);

  // Keep the selected chip visible when the strip is scrolled on mobile
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeCategory]);

  function selectCategory(category) {
    // scroll: false keeps the page where it is instead of jumping to the top
    if (category === "All") {
      router.push("/menu", { scroll: false });
    } else {
      router.push(`/menu?category=${encodeURIComponent(category)}`, {
        scroll: false,
      });
    }
  }

  return (
    <div className="relative mb-4">
      <div
        ref={scrollerRef}
        onScroll={updateFade}
        role="group"
        aria-label="Filter dishes by category"
        className="
          flex flex-nowrap gap-2 overflow-x-auto px-1 py-2
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          snap-x snap-mandatory
          sm:flex-wrap sm:justify-center sm:gap-3 sm:overflow-visible sm:snap-none
        "
      >
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              ref={isActive ? activeRef : null}
              type="button"
              onClick={() => selectCategory(category)}
              aria-pressed={isActive}
              className={`shrink-0 snap-start whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6f61] focus-visible:ring-offset-2 sm:px-6 ${
                isActive
                  ? "bg-gradient-to-r from-[#ff6f61] to-orange-400 text-white shadow-md shadow-orange-200"
                  : "border border-orange-100 bg-white text-gray-600 hover:bg-orange-50 hover:text-[#ff6f61]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Fade hint on the right edge (mobile only), hidden once scrolled to the end */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#fffaf7] to-transparent transition-opacity dark:from-[#12100e] sm:hidden ${
          canScrollRight ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}