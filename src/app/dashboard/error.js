"use client";

export default function Error({ error, reset }) {
  return (
    <main
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center gap-3 p-12 text-center"
    >
      <h1 className="text-2xl font-semibold text-gray-900">Something went wrong</h1>
      <p className="text-gray-600">The dashboard could not load. Please try again.</p>
      <p className="text-xs text-gray-400">{error?.message}</p>
      <button
        onClick={reset}
        className="mt-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
      >
        Try again
      </button>
    </main>
  );
}