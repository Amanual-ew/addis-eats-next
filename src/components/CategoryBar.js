"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  "All",
  "Drinks",
  "Ethiopian",
  "Burger",
  "Pizza",
];

export default function CategoryBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory =
    searchParams.get("category") || "All";

  function selectCategory(category) {
    if (category === "All") {
      router.push("/menu");
    } else {
      router.push(`/menu?category=${category}`);
    }
  }

 return (
  <div className="mb-8 flex flex-wrap justify-center gap-3">
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => selectCategory(category)}
        className={`rounded-full px-6 py-2 text-sm font-semibold transition hover:scale-105 active:scale-95 ${
          activeCategory === category
            ? "bg-gradient-to-r from-[#ff6f61] to-orange-400 text-white shadow-md shadow-orange-200"
            : "border border-orange-100 bg-white text-gray-600 hover:bg-orange-50 hover:text-[#ff6f61]"
        }`}
      >
        {category}
      </button>
    ))}
  </div>
);
}