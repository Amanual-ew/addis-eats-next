"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const categories = ["All", "Drinks", "Ethiopian", "Burger", "Pizza"];

export default function CategoryBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeRef = useRef(null);

  const activeCategory = searchParams.get("category") || "All";

  // Keep the selected chip visible when the strip is scrolled on mobile
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeCategory]);

  function selectCategory(category) {
    if (category === "All") {
      router.push("/menu");
    } else {
      router.push(`/menu?category=${encodeURIComponent(category)}`);
    }
  }

  return (
    <div
      className="
        mb-8 flex flex-nowrap gap-2 overflow-x-auto px-1 py-2
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
            onClick={() => selectCategory(category)}
            className={`shrink-0 snap-start whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition hover:scale-105 active:scale-95 sm:px-6 ${
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
  );
}