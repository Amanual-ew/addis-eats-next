"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import DishCard from "./DishCard";

const fetcher = (url) => fetch(url).then((res) => res.json());

function buildMenuUrl({ search, category, page }) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category && category !== "All") params.set("category", category);
  params.set("page", String(page));
  return `/menu?${params.toString()}`;
}

// Same grid + same card shape as the real list, so nothing jumps when data arrives
function MenuSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm"
        >
          <div className="aspect-[3/2] bg-orange-50" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-2/3 rounded bg-orange-50" />
            <div className="h-4 w-1/3 rounded bg-orange-50" />
            <div className="h-10 w-full rounded-full bg-orange-50" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DishList({
  category = "All",
  initialData = null,
  initialSearch = "",
  initialPage = 1,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const urlSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch === urlSearch) return;
    router.push(buildMenuUrl({ search: debouncedSearch, category, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const apiParams = new URLSearchParams({ search: urlSearch, page: String(page) });
  if (category !== "All") apiParams.set("category", category);
  const key = `/api/dishes?${apiParams.toString()}`;

  // The server already sent this exact page, so use it right away
  const hasServerData =
    initialData && urlSearch === initialSearch && page === initialPage;

  const { data, error, isLoading, isValidating, mutate } = useSWR(key, fetcher, {
    keepPreviousData: true,
    fallbackData: hasServerData ? initialData : undefined,
    revalidateOnMount: hasServerData ? false : undefined,
  });

  const searchBox = (
    <div className="relative mx-auto mb-8 max-w-xl">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search dishes..."
        className="w-full rounded-full border border-orange-100 bg-white py-3 pl-12 pr-5 shadow-sm outline-none transition focus:border-[#ff6f61] focus:ring-2 focus:ring-orange-200"
      />
    </div>
  );

  if (error) {
    return (
      <div>
        {searchBox}
        <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-red-600">
          Failed to load dishes.
        </p>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div>
        {searchBox}
        <div className="mb-4 h-5" />
        <MenuSkeleton />
      </div>
    );
  }

  const displayedDishes = data?.dishes || [];

  function goTo(p) {
    router.push(buildMenuUrl({ search: urlSearch, category, page: p }));
  }

  return (
    <div>
      {searchBox}

      {/* Always takes space, so the grid never moves down */}
      <p className="mb-4 h-5 text-center text-sm text-gray-500">
        {isValidating ? "Updating menu..." : ""}
      </p>

      {displayedDishes.length === 0 ? (
        <div className="rounded-3xl border border-orange-100 bg-white p-12 text-center text-gray-500 shadow-sm">
          No dishes found 😕
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedDishes.map((dish, index) => (
            <DishCard key={dish.id} dish={dish} priority={index < 3} />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            className="rounded-full border border-orange-100 bg-white px-6 py-2 font-medium text-gray-700 transition hover:bg-orange-50 hover:text-[#ff6f61] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          <span className="font-semibold text-gray-700">
            Page {page} of {data.totalPages}
          </span>

          <button
            onClick={() => goTo(page + 1)}
            disabled={page >= data.totalPages}
            className="rounded-full bg-gradient-to-r from-[#ff6f61] to-orange-400 px-6 py-2 font-semibold text-white shadow-md shadow-orange-200 transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            Next →
          </button>
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => mutate()}
          disabled={isValidating}
          className="rounded-full border-2 border-[#ff6f61] px-6 py-2 font-semibold text-[#ff6f61] transition hover:bg-[#ff6f61] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isValidating ? "Refreshing..." : "Refresh Menu"}
        </button>
      </div>
    </div>
  );
}