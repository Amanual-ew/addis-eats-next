export default function Loading() {
  return (
    <div
      className="mx-auto max-w-6xl px-4 py-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading...</span>

      {/* Page title */}
      <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />

      {/* Card grid */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white p-3"
          >
            <div className="mb-3 h-36 w-full animate-pulse rounded-lg bg-gray-200" />
            <div className="mb-2 h-3.5 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-3.5 w-3/5 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-9 w-full animate-pulse rounded-lg bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}