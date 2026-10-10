"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export default function MenuSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const [term, setTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(term);
    }, 500);

    return () => clearTimeout(timer);
  }, [term]);

  const key = debouncedTerm
    ? `/api/dishes?search=${encodeURIComponent(
        debouncedTerm
      )}&page=${page}`
    : null;

  const {
    data,
    error,
    isLoading,
    isValidating,
  } = useSWR(key, fetcher, {
    keepPreviousData: true,
  });

  function changePage(newPage) {
    router.push(
      `/menu?page=${newPage}`
    );
  }

  return (
    <div>
      {/* Search */}
      <input
        type="text"
        value={term}
        onChange={(event) => {
          setTerm(event.target.value);

          // Reset to page 1 when searching
          router.push("/menu?page=1");
        }}
        placeholder="Search dishes..."
        className="mb-6 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#ff6f61]"
      />

      {/* Empty search */}
      {!debouncedTerm && (
        <p className="text-sm text-gray-500">
          Type a dish name to search.
        </p>
      )}

      {/* Initial loading */}
      {isLoading && (
        <p className="text-gray-500">
          Searching...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500">
          Failed to load dishes.
        </p>
      )}

      {/* Revalidation */}
      {isValidating && !isLoading && (
        <p className="mb-3 text-sm text-gray-500">
          Updating results...
        </p>
      )}

      {/* Results */}
      {data && (
        <>
          <div className="space-y-3">
            {data.dishes.length === 0 ? (
              <p className="text-gray-500">
                No dishes found.
              </p>
            ) : (
              data.dishes.map((dish) => (
                <div
                  key={dish.id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >
                  <h3 className="font-semibold text-gray-800">
                    {dish.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {dish.category}
                  </p>

                  <p className="mt-2 font-semibold text-[#ff6f61]">
                    {dish.price} ETB
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            <span className="font-semibold">
              Page {data.page} of {data.totalPages}
            </span>

            <button
              onClick={() => changePage(page + 1)}
              disabled={page >= data.totalPages}
              className="rounded-lg bg-[#ff6f61] px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}