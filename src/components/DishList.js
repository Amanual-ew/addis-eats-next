"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import DishCard from "./DishCard";

const fetcher = (url) =>
  fetch(url).then((res) => res.json());

// Builds /menu?search=...&category=...&page=...
// (only includes values that are set, so nothing gets lost)
function buildMenuUrl({ search, category, page }) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category && category !== "All") params.set("category", category);
  params.set("page", String(page));
  return `/menu?${params.toString()}`;
}

export default function DishList({ category = "All" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const urlSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // When the search really changes: go to page 1, KEEP the category
  useEffect(() => {
    if (debouncedSearch === urlSearch) return;

    router.push(
      buildMenuUrl({ search: debouncedSearch, category, page: 1 })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Category + search + page all go to the API together
  const apiParams = new URLSearchParams({
    search: urlSearch,
    page: String(page),
  });
  if (category !== "All") apiParams.set("category", category);

  const key = `/api/dishes?${apiParams.toString()}`;

  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(key, fetcher, {
    keepPreviousData: true,
  });

  if (isLoading && !data) {
    return (
       <div className="menu-loading">

      <h1 className="skeleton-title"></h1>

      <div className="skeleton-categories">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="skeleton-grid">
        <div className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-small"></div>
          <div className="skeleton-button"></div>
        </div>

        <div className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-small"></div>
          <div className="skeleton-button"></div>
        </div>

        <div className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-small"></div>
          <div className="skeleton-button"></div>
        </div>

        <div className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-small"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>

    </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-red-600">
        Failed to load dishes.
      </p>
    );
  }

  const displayedDishes = data?.dishes || [];

  function nextPage() {
    router.push(
      buildMenuUrl({ search: urlSearch, category, page: page + 1 })
    );
  }

  function previousPage() {
    router.push(
      buildMenuUrl({ search: urlSearch, category, page: page - 1 })
    );
  }

  return (
    <div>
      {/* Search */}
      <div className="relative mx-auto mb-8 max-w-xl">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search dishes..."
          className="w-full rounded-full border border-orange-100 bg-white py-3 pl-12 pr-5 shadow-sm outline-none transition focus:border-[#ff6f61] focus:ring-2 focus:ring-orange-200"
        />
      </div>

      {/* Refreshing */}
      {isValidating && (
        <p className="mb-4 text-center text-sm text-gray-500">
          Updating menu...
        </p>
      )}

      {/* Dishes */}
      {displayedDishes.length === 0 ? (
        <div className="rounded-3xl border border-orange-100 bg-white p-12 text-center text-gray-500 shadow-sm">
          No dishes found 😕
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={previousPage}
            disabled={page === 1}
            className="rounded-full border border-orange-100 bg-white px-6 py-2 font-medium text-gray-700 transition hover:bg-orange-50 hover:text-[#ff6f61] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          <span className="font-semibold text-gray-700">
            Page {page} of {data.totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={page >= data.totalPages}
            className="rounded-full bg-gradient-to-r from-[#ff6f61] to-orange-400 px-6 py-2 font-semibold text-white shadow-md shadow-orange-200 transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            Next →
          </button>
        </div>
      )}

      {/* Refresh */}
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
